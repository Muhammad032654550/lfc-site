# LFC on Netlify — save once, show on every device

1. Import your GitHub repository in Netlify and deploy. The included `netlify.toml` configures the
   static site and its Function; it intentionally publishes the repository root so runtime
   `./images/...` paths and all existing site files remain available. Do not change the publish
   directory to `dist` unless the asset paths are updated too.
   For a CLI deployment instead, install dependencies with `npm ci`, then run
   `npx netlify-cli deploy --prod` from the project directory. The shared-save feature requires the
   Netlify Function and `@netlify/blobs`; GitHub Pages or a static drag-and-drop upload alone cannot
   provide shared storage.
2. In Netlify: Site configuration → Environment variables → add `ADMIN_KEY` = a long secret password only you know. Redeploy.
3. Open your site → Admin → **🌐 Publish** tab → type the same key → **Save key & sync**.
4. From then on every change (photos, hero, menu, prices, categories, deals and B1G1 offers) syncs automatically. Other open, visible devices check for updates about every 15 seconds; refreshing the page loads the latest version immediately.

Photos and data live in Netlify Blobs (included with your site, no extra account). The publishing key is stored only in the browser where you enter it; visitors and other devices can read published content without the key.
