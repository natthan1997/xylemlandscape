import { generateDocumentId, type FinancialDocumentType } from './_lib/ids';
import { getSupabaseAdmin } from './_lib/supabaseAdmin';

function json(res: any, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export default async function handler(req: any, res: any) {
  try {
    const supabase = getSupabaseAdmin();

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('financial_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return json(res, 500, { error: error.message });
      return json(res, 200, { documents: data ?? [] });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const type = body?.type as FinancialDocumentType | undefined;
      const document = body?.document as any;

      if (!type || !document) return json(res, 400, { error: 'Missing type/document' });

      const nowIso = new Date().toISOString().slice(0, 10);
      const id = generateDocumentId(type);

      const row = {
        id,
        type,
        customer_name: document.customerName ?? '',
        property: document.property ?? '',
        date: document.date ?? nowIso,
        due_date: document.dueDate ?? null,
        valid_until: document.validUntil ?? null,
        payment_method: document.paymentMethod ?? null,
        notes: document.notes ?? null,
        items: document.items ?? [],
        include_vat: document.includeVat ?? true,
        vat_rate: document.vatRate ?? 7,
        discount: document.discount ?? 0,
        discount_type: document.discountType ?? 'percent',
        enable_installments: document.enableInstallments ?? false,
        installments: document.installments ?? [],
        subtotal: document.subtotal ?? null,
        after_discount: document.afterDiscount ?? null,
        vat: document.vat ?? null,
        total: document.total ?? null,
        status: document.status ?? (type === 'invoice' ? 'unpaid' : type === 'receipt' ? 'paid' : 'pending'),
      };

      const { data, error } = await supabase
        .from('financial_documents')
        .insert(row)
        .select('*')
        .single();

      if (error) return json(res, 500, { error: error.message });
      return json(res, 200, { document: data });
    }

    res.setHeader('Allow', 'GET, POST');
    return json(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    return json(res, 500, { error: (err as Error).message });
  }
}
