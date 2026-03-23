const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const BDMS = ['Jordan','Asher','Ikani','Nicola','Connar','Summar','Emily','Danny'];
const AMS = ['Andrew','Oke','Ryan'];
const ALL_PEOPLE = [...BDMS, ...AMS];

// GET full state
app.get('/api/state', (req, res) => {
  const entries = db.prepare('SELECT * FROM entries ORDER BY created_at ASC').all();
  const claimed = db.prepare('SELECT * FROM claimed').all();
  const bonuses = db.prepare('SELECT * FROM bonus_tickets').all();
  res.json({ entries, claimed, bonuses });
});

// POST new activity entry
app.post('/api/entry', (req, res) => {
  const { bdm, role, date, signed, won, walkins, calls, deals, sameday, venuetype, churnsaves, upgrade30, upgrade35, loyalty, friday35, earned } = req.body;
  if (!ALL_PEOPLE.includes(bdm)) return res.status(400).json({ error: 'Invalid name' });

  // Lock past days — can only log for today
  const today = new Date().toISOString().split('T')[0];
  if (date !== today) return res.status(400).json({ error: 'You can only log activity for today. Past days are locked!' });
  const stmt = db.prepare(`
    INSERT INTO entries (bdm, role, date, signed, won, walkins, calls, deals, sameday, venuetype, churnsaves, upgrade30, upgrade35, loyalty, friday35, earned)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(bdm, role||'BDM', date, signed||0, won||0, walkins||0, calls||0, deals||0, sameday?1:0, venuetype||'', churnsaves||0, upgrade30||0, upgrade35||0, loyalty||0, friday35||0, earned||0);
  res.json({ ok: true });
});

// POST claim a challenge
app.post('/api/claim', (req, res) => {
  const { challenge_key, bdm, tickets } = req.body;
  const existing = db.prepare('SELECT * FROM claimed WHERE challenge_key = ?').get(challenge_key);
  if (existing) return res.json({ ok: false, reason: 'Already claimed', claimedBy: existing.bdm });
  db.prepare('INSERT INTO claimed (challenge_key, bdm, tickets) VALUES (?, ?, ?)').run(challenge_key, bdm, tickets);
  res.json({ ok: true });
});

// POST award bonus tickets (manager use)
app.post('/api/bonus', (req, res) => {
  const { bdm, amount, reason } = req.body;
  db.prepare('INSERT INTO bonus_tickets (bdm, amount, reason) VALUES (?, ?, ?)').run(bdm, amount, reason);
  res.json({ ok: true });
});

// DELETE entry by id
app.delete('/api/entry/:id', (req, res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM entries WHERE id = ?').run(id);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EatClub Raffle running at http://localhost:${PORT}`));
