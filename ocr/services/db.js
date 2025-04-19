import Database from 'better-sqlite3';
const db = new Database('./db/ocr_service.db');

export const getKey = (apiKey) =>
  db.prepare('SELECT * FROM api_keys WHERE key = ? AND enabled = 1 AND datetime(expires_at) > datetime("now")').get(apiKey);

export const logUsage = (keyId) => {
  db.prepare('INSERT INTO usage_logs (key_id, used_at) VALUES (?, datetime("now"))').run(keyId);
  db.prepare('UPDATE api_keys SET usage_count = usage_count + 1 WHERE id = ?').run(keyId);
};

export const getMonthlyUsage = () =>
  db.prepare(`SELECT name, key, COUNT(*) as usage_count FROM api_keys
    LEFT JOIN usage_logs ON api_keys.id = usage_logs.key_id
    WHERE strftime('%Y-%m', used_at) = strftime('%Y-%m', 'now')
    GROUP BY key_id`).all();
