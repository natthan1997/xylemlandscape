import { getStripe } from './_lib/stripe';
import { getSupabaseAdmin } from './_lib/supabaseAdmin';
import { requireEnv } from './_lib/env';

function json(res: any, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const stripe = getStripe();
    const webhookSecret = requireEnv('STRIPE_WEBHOOK_SECRET');

    const signature = req.headers['stripe-signature'];
    if (!signature) return json(res, 400, { error: 'Missing stripe-signature' });

    const raw = await readRawBody(req);

    let event;
    try {
      event = stripe.webhooks.constructEvent(raw, signature, webhookSecret);
    } catch (err) {
      return json(res, 400, { error: (err as Error).message });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const documentId = session?.metadata?.documentId as string | undefined;

      if (documentId) {
        const supabase = getSupabaseAdmin();
        await supabase
          .from('financial_documents')
          .update({
            status: 'paid',
            stripe_payment_intent_id: session?.payment_intent ?? null,
          })
          .eq('id', documentId);
      }
    }

    return json(res, 200, { received: true });
  } catch (err) {
    return json(res, 500, { error: (err as Error).message });
  }
}
