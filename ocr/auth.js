import { getKey, logUsage } from './services/db.js';

const API_KEY = process.env.API_KEY || 'default-key';

export function authenticate(req, res, next) {
  const key = req.headers['x-api-key'];
  // const client = getKey(key);
  if (!key) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  // req.clientData = client;
  // logUsage(client.id);
  next();
}

export function rateLimit(req, res, next) {
  // const client = req.clientData;
  // if (client.usage_count >= client.rate_limit) {
  //   return res.status(429).json({ success: false, message: 'Rate limit exceeded' });
  // }
  next();
}
