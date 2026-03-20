import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Simple 6-digit code generation and storage (in-memory for demo)
  const codes = new Map<string, { user: string; expires: number }>();

  app.get('/api/generate-code', (req, res) => {
    const user = req.query.user as string;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    codes.set(code, { user, expires: Date.now() + 5 * 60 * 1000 });
    res.json({ code });
  });

  app.post('/api/verify-code', express.json(), (req, res) => {
    const { code } = req.body;
    const data = codes.get(code);
    if (data && data.expires > Date.now()) {
      res.json({ success: true, user: data.user });
    } else {
      res.status(400).json({ success: false, message: 'Código inválido ou expirado' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
