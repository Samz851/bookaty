import express from 'express';
import basicAuth from 'express-basic-auth';
import { getMonthlyUsage } from './services/db.js';
import db from 'better-sqlite3';

const admin = express();
admin.set('view engine', 'ejs');

admin.use(basicAuth({
  users: { admin: 'supersecure' },
  challenge: true
}));

const conn = new db('./db/ocr_service.db');

admin.get('/admin/keys', (req, res) => {
  const keys = conn.prepare('SELECT * FROM api_keys').all();
  res.render('keys', { keys });
});

admin.get('/admin/report', (req, res) => {
  const stats = getMonthlyUsage();
  res.render('report', { stats });
});

admin.post('/admin/rotate/:id', (req, res) => {
  const newKey = crypto.randomUUID();
  conn.prepare('UPDATE api_keys SET key = ?, created_at = datetime("now"), expires_at = datetime("now", "+90 days") WHERE id = ?')
      .run(newKey, req.params.id);
  res.redirect('/admin/keys');
});

export default admin;
