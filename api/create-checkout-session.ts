import { getStripe } from './_lib/stripe';
import { getSupabaseAdmin } from './_lib/supabaseAdmin';
import { getBaseUrlFromRequest } from './_lib/env';

function json(res: any, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const documentId = body?.documentId as string | undefined;
    if (!documentId) return json(res, 400, { error: 'Missing documentId' });

    const supabase = getSupabaseAdmin();
    const { data: doc, error } = await supabase
      .from('financial_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (error || !doc) return json(res, 404, { error: 'Document not found' });
    if (doc.type !== 'invoice') return json(res, 400, { error: 'Only invoices can be paid' });
    if (doc.status === 'paid') return json(res, 400, { error: 'Invoice already paid' });

    const stripe = getStripe();
    const baseUrl = getBaseUrlFromRequest(req);

    const items = Array.isArray(doc.items) ? doc.items : [];

    const line_items = items.map((it: any) => {
      const name = String(it?.name ?? 'รายการ');
      const quantity = Math.max(1, Number(it?.quantity ?? 1));
      const unit = Math.max(0, Number(it?.price ?? 0));
      return {
        quantity,
        price_data: {
          currency: 'thb',
          product_data: { name },
          unit_amount: Math.round(unit * 100),
        },
      } as const;
    });

    if (line_items.length === 0) {
      return json(res, 400, { error: 'Invoice has no items' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${baseUrl}/?payment=success&documentId=${encodeURIComponent(documentId)}`,
      cancel_url: `${baseUrl}/?payment=cancel&documentId=${encodeURIComponent(documentId)}`,
      metadata: { documentId },
    });

    await supabase
      .from('financial_documents')
      .update({ stripe_checkout_session_id: session.id })
      .eq('id', documentId);

    return json(res, 200, { url: session.url });
  } catch (err) {
    return json(res, 500, { error: (err as Error).message });
  }
}
