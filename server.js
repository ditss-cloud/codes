// server.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { snippets } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// API: Get all snippets metadata
app.get('/api/snippets', (req, res) => {
  res.json(snippets);
});

// API: Get single snippet with code content
app.get('/api/snippets/:id', (req, res) => {
  const { id } = req.params;
  const snippet = snippets.find(s => s.id === id);

  if (!snippet) {
    console.log(`❌ Snippet ID '${id}' tidak ditemukan di db.js`);
    return res.status(404).json({ error: 'Snippet not found' });
  }

  try {
    const filePath = path.join(__dirname, snippet.file);
    console.log(`✅ Membaca file: ${filePath}`); // Log untuk debug

    if (!fs.existsSync(filePath)) {
      console.error(`🚨 File '${filePath}' tidak ditemukan!`);
      return res.status(500).json({ error: 'File tidak ditemukan' });
    }

    const code = fs.readFileSync(filePath, 'utf8');
    res.json({ ...snippet, code });
  } catch (err) {
    console.error('❌ Error membaca file:', err.message);
    res.status(500).json({ error: 'Gagal membaca file' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Ditss CodeShare running at http://localhost:${PORT}`);
});
