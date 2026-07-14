import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      configureServer: (server) => {
        server.middlewares.use('/api/suggest-tool', async (req, res, next) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            return;
          }
          
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              const { description, targetUrl } = JSON.parse(body || '{}');
              
              const { GoogleGenAI, Type } = await import('@google/genai');
              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                throw new Error('GEMINI_API_KEY is not defined');
              }
              const ai = new GoogleGenAI({
                apiKey: apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  }
                }
              });

              const prompt = `You are a tool categorization assistant. Based on the following tool description and URL, suggest a short catchy tool name (max 30 chars), a category, and an icon from the allowed icon list. Return a raw JSON object.

Tool Description: "${description}"
Tool URL: "${targetUrl || ""}"

Allowed Categories: "Tea Ritual", "Writing", "Design", "Developer", "Focus", "Converters", "Utility", "System", "Learning", "Widgets"
Allowed Icons (choose exactly one key): "Coffee", "AlignLeft", "Palette", "RefreshCw", "FileCode", "Music", "Clock", "Sparkles", "Cpu", "Wrench", "BookOpen", "Terminal"`;

              const response = await ai.models.generateContent({
                model: 'gemini-3.5-flash',
                contents: prompt,
                config: {
                  responseMimeType: 'application/json',
                  responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING, description: "Catchy short title of the tool, max 30 characters" },
                      category: { type: Type.STRING, description: "Category that fits best from the allowed list" },
                      iconName: { type: Type.STRING, description: "Icon key chosen from the allowed list" }
                    },
                    required: ["name", "category", "iconName"]
                  }
                }
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(response.text);
            } catch (err: any) {
              console.error('Vite Gemini API failed:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Failed to analyze using AI' }));
            }
          });
        });
      }
    },
  };
});
