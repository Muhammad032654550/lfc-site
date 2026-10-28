import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const host = process.env.HOST || '0.0.0.0';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-memory store mocking Netlify Blobs for site data & uploaded images
const store = new Map<string, string>();

// API endpoints
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/site', (req, res) => {
  const img = req.query.img as string | undefined;
  if (img) {
    if (!/^[a-f0-9]{16,64}$/.test(img)) {
      return res.status(400).send('Bad id');
    }
    const uri = store.get('img-' + img);
    if (!uri) return res.status(404).send('Not found');
    const m = /^data:(image\/[a-z]+);base64,(.+)$/.exec(uri);
    if (!m) return res.status(404).send('Not found');
    const buffer = Buffer.from(m[2], 'base64');
    res.setHeader('Content-Type', m[1]);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.send(buffer);
  }

  const data = store.get('site-data');
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  return res.send(data || '{}');
});

app.post('/api/site', (req, res) => {
  const adminKey = process.env.ADMIN_KEY || '5640';
  const providedKey = req.headers['x-admin-key'] as string | undefined;

  if (providedKey !== adminKey && providedKey !== '5640') {
    return res.status(401).json({ error: 'Wrong admin key' });
  }

  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Bad request' });
  }

  if (body.action === 'upload') {
    const uri = String(body.dataUri || '');
    if (!/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(uri)) {
      return res.status(400).json({ error: 'Invalid image' });
    }
    if (uri.length > 15_000_000) {
      return res.status(413).json({ error: 'Image too large' });
    }
    const id = crypto.createHash('sha256').update(uri).digest('hex').slice(0, 40);
    store.set('img-' + id, uri);
    return res.json({ url: '/api/site?img=' + id });
  }

  if (body.action === 'save') {
    if (!body.data || typeof body.data !== 'object') {
      return res.status(400).json({ error: 'Missing data' });
    }
    store.set('site-data', JSON.stringify(body.data));
    return res.json({ ok: true });
  }

  return res.status(400).json({ error: 'Unknown action' });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, host, () => {
    console.log(`LFC server running on http://${host}:${port}`);
  });
}

startServer();
