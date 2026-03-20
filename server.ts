import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // PROXY PARA BURLAR CORS E ACESSAR IPTV
  app.get('/api/proxy', async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) return res.status(400).send('URL is required');

    try {
      const response = await axios({
        method: 'get',
        url: targetUrl,
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      // Repassar headers importantes
      res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
      response.data.pipe(res);
    } catch (error) {
      console.error('Proxy Error:', error);
      res.status(500).send('Error fetching target URL');
    }
  });

  // API para o Painel Remoto (Simulado para este exemplo)
  app.post('/api/verify-code', (req, res) => {
    const { code, playlist } = req.body;
    console.log(`Recebido playlist para código ${code}:`, playlist);
    res.json({ success: true });
  });

  // Configuração do Vite para Desenvolvimento
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
    console.log(`🚀 Servidor Thayson & Thayla rodando em http://localhost:${PORT}`);
  });
}

startServer();
