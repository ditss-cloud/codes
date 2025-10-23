import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { snippets } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/snippet', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'snippet.html'));
});

// API
app.get('/api/snippets', (req, res) => {
  res.json(snippets);
});

app.get('/api/snippets/:id', (req, res) => {
  const { id } = req.params;
  const snippet = snippets.find(s => s.id === id);
  if (!snippet) {
    return res.status(404).json({ error: 'Snippet not found' });
  }

  try {
    const filePath = path.resolve(__dirname, snippet.file);
    if (!fs.existsSync(filePath)) {
      return res.status(500).json({ error: 'File tidak ditemukan di server' });
    }
    const code = fs.readFileSync(filePath, 'utf8');
    res.json({ ...snippet, code });
  } catch (err) {
    res.status(500).json({ error: 'Gagal membaca file' });
  }
});

app.listen(PORT, () => {
  console.log(`Ditss CodeShare running on port ${PORT}`);
});
