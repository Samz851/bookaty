CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY,
  name TEXT,
  key TEXT UNIQUE,
  rate_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  created_at TEXT,
  expires_at TEXT,
  enabled INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key_id TEXT,
  used_at TEXT,
  FOREIGN KEY (key_id) REFERENCES api_keys(id)
);