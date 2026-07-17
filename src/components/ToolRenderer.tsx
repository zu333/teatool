import React from "react";
import { Tool } from "../types";
import TeaTimer from "./tools/TeaTimer";
import TextCounter from "./tools/TextCounter";
import PaletteGenerator from "./tools/PaletteGenerator";
import Base64Converter from "./tools/Base64Converter";
import JsonFormatter from "./tools/JsonFormatter";
import { AlertCircle, ShieldAlert } from "lucide-react";

interface ToolRendererProps {
  tool: Tool;
}

export default function ToolRenderer({ tool }: ToolRendererProps) {
  const isBuiltIn = tool.embedUrl.startsWith("builtin:");

  if (isBuiltIn) {
    switch (tool.embedUrl) {
      case "builtin:tea-timer":
        return <TeaTimer />;
      case "builtin:text-counter":
        return <TextCounter />;
      case "builtin:palette-generator":
        return <PaletteGenerator />;
      case "builtin:base64":
        return <Base64Converter />;
      case "builtin:json":
        return <JsonFormatter />;
      default:
        return (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Unknown Built-in Tool</p>
              <p className="text-xs text-red-500">The builtin type "{tool.embedUrl}" is not recognized.</p>
            </div>
          </div>
        );
    }
  }

  // Detect if the tool's embedUrl is actually an uploaded image or an image URL
  const isImage = !!tool?.embedUrl && (
    tool.embedUrl.startsWith("data:image/") || 
    /\.(jpeg|jpg|gif|png|webp|svg|bmp)(\?.*)?$/i.test(tool.embedUrl) ||
    tool.embedUrl.startsWith("blob:")
  );

  if (isImage) {
    const scale = tool.imageScale !== undefined ? tool.imageScale : 1;
    return (
      <div className="w-full flex flex-col bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden p-6 space-y-4">
        <div className="border-b border-stone-100 dark:border-stone-800 pb-3">
          <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">{tool.name}</h4>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed font-medium">{tool.description}</p>
        </div>
        
        {/* Centered responsive frame with scrollbars enabled for scaled images */}
        <div className="flex-1 bg-stone-50/60 dark:bg-stone-950 rounded-xl p-6 flex items-center justify-center overflow-auto min-h-[320px] max-h-[480px] border border-stone-100 dark:border-stone-800/60 relative">
          <img
            src={tool.embedUrl}
            alt={tool.name}
            style={{ 
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
    );
  }

  // External iframe embed
  return (
    <div className="w-full flex flex-col bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden h-[550px]">
      <div className="px-4 py-3 bg-stone-50 dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 tracking-wide uppercase">External Web Embed</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-stone-400 dark:text-stone-500 bg-stone-200/50 dark:bg-stone-850 px-2 py-0.5 rounded-full border border-stone-200/10">
          <ShieldAlert className="w-3 h-3 text-stone-500" />
          Sandboxed Frame
        </div>
      </div>
      <div className="flex-1 bg-stone-100 dark:bg-stone-950 relative">
        <iframe
          id={`iframe-${tool.id}`}
          src={tool.embedUrl}
          title={tool.name}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          allow="geolocation; microphone; camera; midi; encrypted-media;"
          loading="lazy"
        />
      </div>
    </div>
  );
}
