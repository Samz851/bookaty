import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';

const keyPath = path.resolve('apikeys.json');
const keys = JSON.parse(fs.readFileSync(keyPath));

function generateKey(name, rateLimit = 1000) {
  const key = randomUUID();

  keys.clients[key] = {
    name,
    rateLimit,
    requests: 0,
    enabled: true
  };

  fs.writeFileSync(keyPath, JSON.stringify(keys, null, 2));
  console.log(`Generated key for ${name}: ${key}`);
}

generateKey('New Client');
