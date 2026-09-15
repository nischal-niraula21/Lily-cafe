import { setServers } from 'node:dns';

let configured = false;

export function configureDns() {
  if (configured) return;

  const servers = (process.env.DNS_SERVERS || '8.8.8.8,1.1.1.1')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  if (servers.length) setServers(servers);
  configured = true;
}
