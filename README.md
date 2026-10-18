# 🍗 Lahore Fried Chicken (LFC) — Website

A fast, **zero-build** static website for a fast-food restaurant (fried chicken, burgers,
paratha rolls, loaded pizzas & combo deals) with **instant WhatsApp ordering** and a built-in
**Admin Control Suite**. Designed to run on **GitHub Pages** with no server, no database and no build step.

> **Taste the Legend** — Developer credit: *Trivox Solutions*

---

## ✨ What's inside

| Area | Details |
|---|---|
| Tech | Pure **HTML + CSS + Vanilla JavaScript** (single `index.html` + `app.js`) |
| Styling | Tailwind CSS (CDN) + custom CSS — no compiler needed |
| Ordering | Cart → **WhatsApp checkout** with a pre-filled order message |
| Admin | PIN-protected control suite to manage menu, categories, hero slides, branches, logo & settings |
| Storage | Everything saved in the browser via `localStorage` (no backend) |
| Hosting | **GitHub Pages** ready (static, relative paths, `.nojekyll` included) |

---

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

You can manage: menu items (with photo upload), customer deals (create, edit, enable/disable or delete fixed-price combos and Buy 1 Get 1 Free pizza offers), coupon codes, categories, hero slides, branch locations, logo/branding, WhatsApp & phone numbers, delivery fee, and free-delivery threshold. Changes are saved in the browser; configure the Netlify publishing key to share supported site content across devices.

---

## 📁 Project structure

```
.
├── index.html                 # The whole page (markup + design)
├── app.js                     # All site logic (cart, WhatsApp, admin, animations)
├── public/app.js              # Vite-served copy; keep it in sync with app.js
├── 404.html                   # Friendly "page not found" page
├── manifest.webmanifest       # PWA "Add to Home Screen" support
├── robots.txt / sitemap.xml   # SEO
├── .nojekyll                  # Tells GitHub Pages not to run Jekyll
├── images/                    # Optimised hero photos, logo, icons
└── .github/workflows/deploy.yml
```

> The root `index.html` and `app.js` are the zero-build static site. Vite serves `public/app.js`
> in its development/build output, so keep that copy synchronized when changing site logic.
> `src/` is a legacy React version kept for reference.

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
