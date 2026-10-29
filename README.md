# 🍗 Lahore Fried Chicken (LFC) — Website

A fast static website for a fast-food restaurant (fried chicken, burgers,
paratha rolls, loaded pizzas & combo deals) with **instant WhatsApp ordering** and a built-in
**Admin Control Suite**. Deploy to **Netlify** for shared publishing across devices, or use it as a
static site on hosts such as Hostinger.

> **Taste the Legend** — Developer credit: *Trivox Solutions*

---

## ✨ What's inside

| Area | Details |
|---|---|
| Tech | **HTML + CSS + Vanilla JavaScript** (`index.html` + `app.js`) |
| Styling | Tailwind CSS + custom CSS |
| Ordering | Cart → **WhatsApp checkout** with a pre-filled order message |
| Admin | PIN-protected control suite to manage menu, categories, hero slides, branches, logo & settings |
| Storage | Browser `localStorage`, with optional shared publishing (PHP on Hostinger, or Netlify Blobs) |
| Hosting | Zero-build static site; Netlify Function provides shared publishing |
---

## 🌐 Deploy to Netlify (shared publishing)

1. Import this repository in Netlify and deploy from your preferred branch. Netlify reads
   [`netlify.toml`](./netlify.toml): it publishes the repository root and deploys the
   `netlify/functions` function directory.
2. In **Site configuration → Environment variables**, set `ADMIN_KEY` to a long, private key, then
   redeploy. Keep this key secret.
3. Open the deployed site, go to **Admin → Publish**, enter the same key, and choose **Save key &
   sync**. Admin changes will then publish across devices.

The site intentionally deploys from the repository root rather than `dist`: it uses relative
`./images/...` paths at runtime, and the root deployment preserves those files along with all
existing storefront and admin features. For detailed setup and troubleshooting, see
[`DEPLOY-NETLIFY.md`](./DEPLOY-NETLIFY.md).

## 🚀 Deploy to GitHub Pages (2 easy ways)

### Option A — GitHub Actions (recommended, nothing to configure locally)

1. Push this folder to a GitHub repository (branch `main`).
2. In the repo go to **Settings → Pages → Build and deployment → Source = "GitHub Actions"**.
3. That's it. Every push to `main` auto-publishes the site via
   [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
4. Your site will be live at `https://<username>.github.io/<repo>/`.

### Option B — Deploy from a branch (simplest, no workflow)

1. Push this folder to a GitHub repository.
2. Go to **Settings → Pages → Build and deployment → Source = "Deploy from a branch"**.
3. Choose branch **`main`** and folder **`/ (root)`**, then **Save**.
4. Wait ~1 minute — your site is live at `https://<username>.github.io/<repo>/`.

> All asset paths are **relative** (`./images/...`), so the site works whether it is hosted at the
> repository root or any sub-path. No configuration required.

## 🌐 Deploy to Hostinger (with working Publish)

No build step is needed.

1. In hPanel open **Websites → Manage → Files → File Manager → `public_html`**.
2. Upload **everything in this folder** (`index.html`, `app.js`, `cheesy.*`, `images/`, **`api/`**, `.htaccess`, …).
   Skip `node_modules` and `netlify/`.
3. Open **`public_html/api/config.php`**, replace `CHANGE-ME` with your own long secret key and save.
4. Open `https://yourdomain/#AdminLFC1` → PIN → **🌐 Publish** tab. It should say
   **✅ Backend connected (Hostinger / PHP)**. Enter the same key and press **Save key & publish**.

Menu, deals, photos and prices then show on every device. Data is stored in `api/data/`
(created automatically, blocked from direct access).

**Troubleshooting**
- *"Publishing backend not found"* → the `api` folder is missing or not next to `index.html`.
- *"no key is set yet"* → you haven't changed `CHANGE-ME` in `api/config.php`.
- *"Wrong admin key"* → the key typed in Publish differs from `config.php`.
- *"Cannot write to api/data"* → set the `api` folder permission to 755.

### First-time push (if you don't have a repo yet)

```bash
git init
git add .
git commit -m "LFC website"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

---

## 💻 Run locally

Because this is a plain static site, any static server works:

```bash
# Python (built-in)
python3 -m http.server 8080
# then open http://localhost:8080
```

or, with Node installed:

```bash
npm run dev      # optional Vite dev server on http://localhost:3000
```

---

## 🔐 Admin Control Suite

Open the admin panel in any of these ways:

- Visit the site with the hash **`#AdminLFC1`** (e.g. `https://yoursite/#AdminLFC1`)
- Press **`Alt + A`** (or **`Ctrl + Shift + L`**)
- Call `window.LFC.openAdminModal()` from the console

**Default PIN: `5640`** (change it in *Admin → Settings*).

You can manage: menu items (with photo upload and a Buy 1 Get 1 Free eligibility switch), customer deals (create, edit, enable/disable or delete fixed-price combos and pizza offers), coupon codes, categories, hero slides, branch locations, logo/branding, WhatsApp & phone numbers, delivery fee, and free-delivery threshold. The B1G1 picker previews each selected pizza and clearly marks which one is free based on its size and price. Changes are saved in the browser; sharing them across devices requires the Netlify publishing backend described in [DEPLOY-NETLIFY.md](./DEPLOY-NETLIFY.md).

---

## 📁 Project structure

```
.
├── index.html                 # The whole page (markup + design)
├── app.js                     # All site logic (cart, WhatsApp, admin, animations)
├── 404.html                   # Friendly "page not found" page
├── manifest.webmanifest       # PWA "Add to Home Screen" support
├── robots.txt / sitemap.xml   # SEO
├── .nojekyll                  # Tells GitHub Pages not to run Jekyll
├── images/                    # Optimised hero photos, logo, icons
└── .github/workflows/deploy.yml
```

> The root `index.html` and `app.js` are the zero-build site — upload them as they are.

---

## 🎨 Enhancements in this version

**Design**
- Fixed a broken "Why LFC" card (invalid markup) that was breaking the 4-card grid.
- Animated **counters strip** (branches, reviews, spices, delivery time).
- **Scroll-reveal** fade-up animations and a top **scroll-progress bar**.
- Sticky header now **elevates on scroll**; added a floating **Back-to-top** button.
- Relaxed the viewport rule so users can pinch-zoom (accessibility).

**Features**
- **Order type selector** — Delivery / Pickup / Dine-In (delivery fee adapts automatically).
- **Free-delivery progress bar** ("Add Rs. X more for FREE delivery").
- **Live search** with a clear button and a "showing N items" result count.
- WhatsApp order message now includes the selected order type.
- **ESC** closes the cart/admin/review overlays; smoother mobile experience.
- **Deals manager** — create and edit customer-facing combos and B1G1 pizza offers from Admin → Deals. Add a compressed photo or image URL, original and sale prices, badges, visibility, and optional start/end times. Customers can choose two available pizzas and sizes; the higher-priced pizza is charged and the other is marked free in the cart and WhatsApp order.
- **Expanded menu** — Includes the 16 Nut Deals, four family combos, and the supplied burger, wrap, chicken, pasta, sandwich, hot-shot, wings, nuggets, and sides catalog. Existing Standard/Signature pizza B1G1 and single-purchase pizzas remain available. Menu updates merge into saved items without removing custom products, stock settings, or uploaded photos.
- **Mobile-first storefront** — The hero leads with food photography, a clear LFC message, delivery highlights, and a prominent menu button. Menu browsing uses larger single-column product cards on narrow phones and category filters that scroll horizontally.
- **Clear WhatsApp orders** — the order message is formatted with customer and delivery details, item options, B1G1 paid/free pizza breakdown and savings, subtotal, delivery, discount, and total.

**Performance & SEO**
- Images optimised (≈4 MB of PNGs → ≈0.6 MB JPEGs) + `loading="lazy"`.
- Rich **Restaurant structured data** (JSON-LD), Open Graph/Twitter cards, theme colour.
- PWA **manifest** + app icons, `robots.txt`, `sitemap.xml` and a styled `404.html`.
- Clean, **zero-build** GitHub Pages pipeline (no npm install in CI).

---

## ⚙️ Quick customisation

| What | Where |
|---|---|
| Phone / WhatsApp number, delivery fee, free-delivery threshold, logo, store name | **Admin → Settings** (or `DEFAULT_SETTINGS` in `app.js`) |
| Menu items, deals, categories, hero slides, branches | **Admin panel**, or the `DEFAULT_*` arrays at the top of `app.js` |
| Colors / fonts | Tailwind config + `<style>` block in `index.html` |

---

© Lahore Fried Chicken (LFC). Built by **Trivox Solutions**.
