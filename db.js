const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Use persistent volume on Railway, local file otherwise
const dataDir = process.env.DATA_DIR || '.';
if (dataDir !== '.' && !fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'raffle.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bdm TEXT NOT NULL,
    role TEXT DEFAULT 'BDM',
    date TEXT NOT NULL,
    signed INTEGER DEFAULT 0,
    won INTEGER DEFAULT 0,
    walkins INTEGER DEFAULT 0,
    calls INTEGER DEFAULT 0,
    deals INTEGER DEFAULT 0,
    sameday INTEGER DEFAULT 0,
    venuetype TEXT DEFAULT '',
    churnsaves INTEGER DEFAULT 0,
    upgrade30 INTEGER DEFAULT 0,
    upgrade35 INTEGER DEFAULT 0,
    loyalty INTEGER DEFAULT 0,
    friday35 INTEGER DEFAULT 0,
    earned INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS claimed (
    challenge_key TEXT PRIMARY KEY,
    bdm TEXT NOT NULL,
    tickets INTEGER NOT NULL,
    claimed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bonus_tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bdm TEXT NOT NULL,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    awarded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed restored data if database is fresh
const count = db.prepare('SELECT COUNT(*) as c FROM bonus_tickets').get().c;
if (count === 0) {
  const seed = db.prepare('INSERT INTO bonus_tickets (bdm, amount, reason) VALUES (?, ?, ?)');
  seed.run('Summar', 101, 'Restored from pre-deploy data');
  seed.run('Asher', 31, 'Restored from pre-deploy data');
  seed.run('Andrew', 27, 'Restored from pre-deploy data');
  seed.run('Oke', 24, 'Restored from pre-deploy data');
  seed.run('Nicola', 17, 'Restored from pre-deploy data');
  seed.run('Ryan', 10, 'Restored from pre-deploy data');
  seed.run('Connar', 4, 'Restored from pre-deploy data');
  console.log('Seeded restored ticket data (214 total)');
}

module.exports = db;
