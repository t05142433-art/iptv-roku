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

  // Armazenamento temporário de conexões (em memória para este exemplo)
  const tvConnections = new Map();

  app.post('/api/remote-connect', (req, res) => {
    const { code, host, user, pass } = req.body;
    if (!code || !host || !user || !pass) return res.status(400).send('All fields are required');
    
    // Armazena os dados para o código
    tvConnections.set(code, { host, user, pass, timestamp: Date.now() });
    console.log(`🚀 TV Conectada via código ${code}`);
    res.json({ success: true });
  });

  app.get('/api/check-connection/:code', (req, res) => {
    const { code } = req.params;
    const connection = tvConnections.get(code);
    if (connection) {
      // Limpa após ler (opcional, dependendo da lógica desejada)
      // tvConnections.delete(code);
      res.json({ success: true, ...connection });
    } else {
      res.json({ success: false });
    }
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
