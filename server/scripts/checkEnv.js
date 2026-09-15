import fs from 'node:fs';
import path from 'node:path';

const envPath = path.resolve(process.cwd(), '.env');

if (!fs.existsSync(envPath)) {
  console.error('Missing .env file in the project root.');
  process.exit(1);
}

const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
const seen = new Set();
const duplicates = new Set();
const malformed = [];
const values = new Map();

lines.forEach((line, index) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;

  const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(trimmed);
  if (!match) {
    malformed.push(index + 1);
    return;
  }

  const [, key, value] = match;
  if (seen.has(key)) duplicates.add(key);
  seen.add(key);
  values.set(key, value.trim());
});

const required = ['MONGODB_URI', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'];
const missing = required.filter((key) => !values.get(key));

if (malformed.length) {
  console.error(`Malformed .env line(s): ${malformed.join(', ')}. Every setting must use NAME=value.`);
}

if (duplicates.size) {
  console.error(`Duplicate .env key(s): ${[...duplicates].join(', ')}.`);
}

if (missing.length) {
  console.error(`Missing required .env value(s): ${missing.join(', ')}.`);
}

if (malformed.length || duplicates.size || missing.length) {
  process.exit(1);
}

console.log('.env structure looks valid. Secrets were not printed.');
