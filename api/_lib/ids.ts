export type FinancialDocumentType = 'quotation' | 'invoice' | 'receipt';

export function generateDocumentId(type: FinancialDocumentType): string {
  const now = new Date();
  const year = now.getFullYear();
  const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
  const prefix = type === 'quotation' ? 'Q' : type === 'invoice' ? 'INV' : 'REC';
  return `${prefix}${year}-${rand}${now.getTime().toString().slice(-6)}`;
}
