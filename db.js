const Database = require('better-sqlite3');
const db = new Database('raffle.db');

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

module.exports = db;
