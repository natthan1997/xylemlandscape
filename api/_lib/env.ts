export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function getBaseUrlFromRequest(req: any): string {
  const configured = process.env.APP_BASE_URL;
  if (configured) return configured.replace(/\/$/, '');

  const host = (req.headers?.['x-forwarded-host'] || req.headers?.host) as string;
  const forwardedProto = req.headers?.['x-forwarded-proto'] as string | undefined;

  const isIpHost = typeof host === 'string' && /^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?$/.test(host);
  const isLocalhost = typeof host === 'string' && (host.startsWith('localhost') || host.startsWith('127.0.0.1'));
  const proto = (forwardedProto || (isIpHost || isLocalhost ? 'http' : 'https')) as string;
  if (!host) return 'https://localhost:5173';

  return `${proto}://${host}`;
}
