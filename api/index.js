const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  // 1. Set fallback/default values (matches index.html defaults)
  let headerImage = "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=1200&h=630&facepad=2&fit=crop";
  let heroTitle = "Tooltea - Essential, Serene Web Tools";
  let heroSubtitle = "Welcome to Tooltea, a serene sanctuary featuring essential, highly responsive web tools styled with calming, soft light-blue tones.";

  try {
    // Fetch current settings dynamically from Google Firestore REST API
    const response = await fetch('https://firestore.googleapis.com/v1/projects/semiotic-quote-c6ppv/databases/ai-studio-tooltea-35c26cb2-d562-40c6-b846-e93304e9abbc/documents/app_data/settings');
    if (response.ok) {
      const data = await response.json();
      if (data && data.fields) {
        if (data.fields.headerImage && data.fields.headerImage.stringValue) {
          headerImage = data.fields.headerImage.stringValue;
        }
        if (data.fields.heroTitle && data.fields.heroTitle.stringValue) {
          heroTitle = data.fields.heroTitle.stringValue;
        }
        if (data.fields.heroSubtitle && data.fields.heroSubtitle.stringValue) {
          heroSubtitle = data.fields.heroSubtitle.stringValue;
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch settings from Firestore:", error);
  }

  // 2. Read the compiled index.html from dist
  try {
    const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    if (!fs.existsSync(htmlPath)) {
      // Fallback if built file is not in dist (should not happen on Vercel deployment)
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(`<!DOCTYPE html><html><head><title>${heroTitle}</title><meta property="og:image" content="${headerImage}" /></head><body>Loading...</body></html>`);
    }

    let html = fs.readFileSync(htmlPath, 'utf8');

    // 3. Perform 100% safe, fast replacements of the default values
    // This dynamically updates the image, title, and description for social media crawlers
    html = html.split('https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=1200&h=630&facepad=2&fit=crop').join(headerImage);
    html = html.split('Tooltea - Essential, Serene Web Tools').join(heroTitle);
    html = html.split('Welcome to Tooltea, a serene sanctuary featuring essential, highly responsive web tools styled with calming, soft light-blue tones.').join(heroSubtitle);

    // 4. Send the dynamically updated HTML
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); // cache on Vercel CDN for 60 seconds to keep it super fast
    res.status(200).send(html);
  } catch (error) {
    console.error("Failed to serve index.html:", error);
    res.status(500).send("Error loading app");
  }
};
