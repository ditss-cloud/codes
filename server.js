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
    const filePath = path.join(__dirname, snippet.file);
    const code = fs.readFileSync(filePath, 'utf8');
    res.json({ ...snippet, code });
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).json({ error: 'Failed to read file' });
  }
});

app.listen(PORT, () => {
  console.log(`Ditss CodeShare running at http://localhost:${PORT}`);
});
