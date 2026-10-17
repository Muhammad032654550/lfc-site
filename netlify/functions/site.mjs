// LFC shared storage on Netlify (Functions v2 + Netlify Blobs).
// GET  /api/site            -> published site data (public)
// GET  /api/site?img=<id>   -> published image (public, cached)
// POST /api/site            -> admin only (header x-admin-key must equal env ADMIN_KEY)
import { getStore } from '@netlify/blobs';

const json = (o, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

export default async (req) => {
  const store = getStore('lfc-site');
  const url = new URL(req.url);

  if (req.method === 'GET') {
    const img = url.searchParams.get('img');
    if (img) {
      if (!/^[a-f0-9]{16,64}$/.test(img)) return new Response('Bad id', { status: 400 });
      const uri = await store.get('img-' + img);
      const m = uri && /^data:(image\/[a-z]+);base64,(.+)$/.exec(uri);
      if (!m) return new Response('Not found', { status: 404 });
      const bytes = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
      return new Response(bytes, { headers: { 'content-type': m[1], 'cache-control': 'public, max-age=31536000, immutable' } });
    }
    const data = await store.get('site-data');
    return new Response(data || '{}', { headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
  }

  if (req.method === 'POST') {
    const key = Netlify.env.get('ADMIN_KEY');
    if (!key) return json({ error: 'ADMIN_KEY is not set. Add it in Netlify → Site configuration → Environment variables, then redeploy.' }, 500);
    if (req.headers.get('x-admin-key') !== key) return json({ error: 'Wrong admin key' }, 401);
    let body;
    try { body = await req.json(); } catch { return json({ error: 'Bad request' }, 400); }

    if (body.action === 'upload') {
      const uri = String(body.dataUri || '');
      if (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(uri)) return json({ error: 'Invalid image' }, 400);
      if (uri.length > 5_500_000) return json({ error: 'Image too large' }, 413);
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(uri));
      const id = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 40);
      await store.set('img-' + id, uri);
      return json({ url: '/api/site?img=' + id });
    }
    if (body.action === 'save') {
      if (!body.data || typeof body.data !== 'object') return json({ error: 'Missing data' }, 400);
      await store.set('site-data', JSON.stringify(body.data));
      return json({ ok: true });
    }
    return json({ error: 'Unknown action' }, 400);
  }
  return new Response('Method not allowed', { status: 405 });
};

export const config = { path: '/api/site' };
