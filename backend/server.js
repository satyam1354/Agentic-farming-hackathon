const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



// SQLite setup
const dbPath = path.join(__dirname, 'database', 'agent_memory.db');
const db = new sqlite3.Database(dbPath);

db.run(`CREATE TABLE IF NOT EXISTS agent_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT,
  input TEXT,
  output TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Route to interact with Ollama and log interaction
app.post('/ask-agent', async (req, res) => {
    console.log(req.body)
  const { role, prompt } = req.body;

  try {
    const ollamaRes = await axios.post('http://localhost:11434/api/generate', {
      model: 'gemma3:4b',
      prompt,
      stream: false
    });

    const output = ollamaRes.data.response;
    console.log(output)

    db.run(
      'INSERT INTO agent_logs (role, input, output) VALUES (?, ?, ?)',
      [role, prompt, output]
    );

    res.json({ output, success: true });
  } catch (err) {
    console.error('Ollama Error:', err.response?.data || err.message || err);
    res.status(500).json({ error: 'Ollama interaction failed' });
  }
});

app.get('/history', (req, res) => {
  db.all('SELECT * FROM agent_logs ORDER BY timestamp DESC LIMIT 20', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch history' });
    }
    res.json(rows);
  });
});  

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

