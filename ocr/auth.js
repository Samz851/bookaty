import { getKey, logUsage } from './services/db.js';

export function authenticate(req, res, next) {
  const key = req.headers['x-api-key'];
  const client = getKey(key);
  if (!key || !client) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  req.clientData = client;
  logUsage(client.id);
  next();
}

export function rateLimit(req, res, next) {
  const client = req.clientData;
  if (client.usage_count >= client.rate_limit) {
    return res.status(429).json({ success: false, message: 'Rate limit exceeded' });
  }
  next();
}
