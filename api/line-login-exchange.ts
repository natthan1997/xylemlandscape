import { getBaseUrlFromRequest, requireEnv } from './_lib/env';

function json(res: any, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function parseCookies(req: any): Record<string, string> {
  const header = req.headers?.cookie;
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of String(header).split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    out[key] = decodeURIComponent(value);
  }
  return out;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const code = body?.code as string | undefined;
    const state = body?.state as string | undefined;
    if (!code || !state) return json(res, 400, { error: 'Missing code/state' });

    const cookies = parseCookies(req);
    if (!cookies.line_oauth_state || cookies.line_oauth_state !== state) {
      return json(res, 400, { error: 'Invalid state' });
    }

    const clientId = requireEnv('LINE_CHANNEL_ID');
    const clientSecret = requireEnv('LINE_CHANNEL_SECRET');
    const baseUrl = getBaseUrlFromRequest(req);
    const redirectUri = (process.env.LINE_REDIRECT_URI || `${baseUrl}/auth/line/callback`).replace(/\s/g, '');

    const params = new URLSearchParams();
    params.set('grant_type', 'authorization_code');
    params.set('code', code);
    params.set('redirect_uri', redirectUri);
    params.set('client_id', clientId);
    params.set('client_secret', clientSecret);

    const resp = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const jsonBody = await resp.json().catch(() => null);
    if (!resp.ok) {
      return json(res, 400, {
        error: jsonBody?.error_description || jsonBody?.error || 'LINE token exchange failed',
      });
    }

    const idToken = jsonBody?.id_token as string | undefined;
    if (!idToken) return json(res, 400, { error: 'LINE did not return id_token (check scope openid)' });

    // Clear state cookie
    res.setHeader(
      'Set-Cookie',
      `line_oauth_state=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0` + (baseUrl.startsWith('https://') ? '; Secure' : '')
    );

    return json(res, 200, { id_token: idToken });
  } catch (err) {
    return json(res, 500, { error: (err as Error).message });
  }
}
