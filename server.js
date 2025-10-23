// server.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { snippets } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files
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
    return res.status(404).json({ error: 'Snippet not found' });
  }

  try {
    const code = fs.readFileSync(path.join(__dirname, snippet.file), 'utf8');
    res.json({ ...snippet, code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

app.listen(PORT, () => {
  console.log(`Ditss CodeShare running at http://localhost:${PORT}`);
});
