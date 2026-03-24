const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const DB_PATH = path.join(__dirname, 'db.json');

function readDB() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { inventory: [], requests: [], contacts: [] };
  }
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend static files from project root
app.use(express.static(path.join(__dirname)));

// API: Get inventory (optional query: loc, type)
app.get('/api/inventory', (req, res) => {
  const db = readDB();
  const { loc = '', type = 'all' } = req.query;
  const filtered = db.inventory.filter(item => {
    const locMatch = item.location.toLowerCase().includes((loc || '').toLowerCase()) || item.hospital.toLowerCase().includes((loc || '').toLowerCase());
    let typeMatch = false;
    if (!type || type === 'all') typeMatch = true;
    else item.stocks.forEach(s => { if (s.type === type && s.units > 0) typeMatch = true; });
    return locMatch && typeMatch;
  });
  res.json({ data: filtered });
});

// API: Submit a request
app.post('/api/request', (req, res) => {
  const db = readDB();
  const payload = req.body || {};
  const entry = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...payload
  };
  db.requests.unshift(entry);
  writeDB(db);
  res.json({ ok: true, request: entry });
});

// API: Contact form
app.post('/api/contact', (req, res) => {
  const db = readDB();
  const payload = req.body || {};
  const entry = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...payload
  };
  db.contacts.unshift(entry);
  writeDB(db);
  res.json({ ok: true, contact: entry });
});

// Fallback
app.get('/api', (req, res) => res.json({ ok: true, msg: 'Sanguis backend running' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sanguis backend listening on http://localhost:${PORT}`));
