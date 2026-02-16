import crypto from 'crypto';
import { getBaseUrlFromRequest, requireEnv } from './_lib/env';

function json(res: any, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function setCookie(res: any, cookie: string) {
  const prev = res.getHeader('Set-Cookie');
  if (!prev) {
    res.setHeader('Set-Cookie', cookie);
    return;
  }
  const next = Array.isArray(prev) ? [...prev, cookie] : [String(prev), cookie];
  res.setHeader('Set-Cookie', next);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const clientId = requireEnv('LINE_CHANNEL_ID');
    const baseUrl = getBaseUrlFromRequest(req);
    const redirectUri = (process.env.LINE_REDIRECT_URI || `${baseUrl}/auth/line/callback`).replace(/\s/g, '');

    const state = crypto.randomUUID();

    setCookie(
      res,
      `line_oauth_state=${encodeURIComponent(state)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600` +
        (baseUrl.startsWith('https://') ? '; Secure' : '')
    );

    const url = new URL('https://access.line.me/oauth2/v2.1/authorize');
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('state', state);
    url.searchParams.set('scope', 'openid profile email');

    return json(res, 200, { url: url.toString() });
  } catch (err) {
    return json(res, 500, { error: (err as Error).message });
  }
}
