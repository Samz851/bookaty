import Database from 'better-sqlite3';
const db = new Database('./db/ocr_service.db');
db.prepare('UPDATE api_keys SET usage_count = 0').run();
console.log('Monthly usage reset.');