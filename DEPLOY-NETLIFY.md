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

Photos and data live in Netlify Blobs on the same platform as the website (no separate server or storage account). The private publishing key protects admin writes and is stored only in the browser where you enter it; visitors can read published content without the key. A static-only host such as GitHub Pages cannot provide shared admin publishing by itself.

## Restore or download a backup

In **Admin → Settings → Backup & Restore**, choose **Restore Backup from File** and select an existing
`lfc-backup-*.json` file, including the older `lfc-backup-2026-10-26.json`. After entering your
publishing key in **Admin → Publish**, restoring republishes the settings, catalog, offers, zones,
and other shared store data to Netlify. Orders are restored to the current browser only.

Use **Download Complete Backup** to save store data, orders, browser settings, and the referenced
photos in one portable JSON file. Photo restore uploads the images into the current Netlify Blob
store, so enter the publishing key before restoring a complete backup. The publishing key itself is
never included in an export. Keep backup files private because they can contain order/customer data.
