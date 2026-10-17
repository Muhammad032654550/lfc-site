# LFC on Netlify — save once, show on every device

1. Connect your GitHub repository to Netlify, or deploy with the Netlify CLI: `npm install` then `netlify deploy --prod`.
   The shared-save feature requires the Netlify Function and its dependency; Git-connected deploys or the CLI install and deploy both. GitHub Pages or a static drag-and-drop upload alone cannot provide shared storage.
2. In Netlify: Site configuration → Environment variables → add `ADMIN_KEY` = a long secret password only you know. Redeploy.
3. Open your site → Admin → **🌐 Publish** tab → type the same key → **Save key & sync**.
4. From then on every change (photos, hero, menu, prices, categories) syncs automatically. Other open, visible devices check for updates about every 15 seconds; refreshing the page loads the latest version immediately.

Photos and data live in Netlify Blobs (included with your site, no extra account). The publishing key is stored only in the browser where you enter it; visitors and other devices can read published content without the key.
