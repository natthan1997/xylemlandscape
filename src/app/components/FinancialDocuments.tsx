import React, { useState } from 'react';
import {
  FileText,
  Receipt,
  FileCheck,
  Plus,
  Search,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { QuotationForm } from './QuotationForm';
import { InvoiceForm } from './InvoiceForm';
import { ReceiptForm } from './ReceiptForm';
import { DocumentPreview } from './DocumentPreview';

interface FinancialDocumentsProps {
  onBack?: () => void;
}


export const FinancialDocuments: React.FC<FinancialDocumentsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'quotation' | 'invoice' | 'receipt'>('all');
  const [showForm, setShowForm] = useState<'quotation' | 'invoice' | 'receipt' | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refreshDocuments = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const resp = await fetch('/api/documents');
      if (!resp.ok) throw new Error('Failed to load documents');
      const json = await resp.json();
      if (Array.isArray(json?.documents)) {
        const mapped = json.documents.map((d: any) => ({
          id: d.id,
          type: d.type,
          customerName: d.customer_name,
          property: d.property,
          date: d.date,
          dueDate: d.due_date,
          validUntil: d.valid_until,
          paymentMethod: d.payment_method,
          notes: d.notes,
          items: d.items,
          includeVat: d.include_vat,
          vatRate: d.vat_rate,
          discount: d.discount,
          discountType: d.discount_type,
          enableInstallments: d.enable_installments,
          installments: d.installments,
          subtotal: d.subtotal,
          afterDiscount: d.after_discount,
          vat: d.vat,
          total: d.total,
          status: d.status,
        }));
        setDocuments(mapped);
      }
    } catch (err) {
      console.warn(err);
      setLoadError('เชื่อมต่อระบบเอกสารไม่สำเร็จ (API/ENV ยังไม่พร้อม)');
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    refreshDocuments();
  }, []);

  // Calculate statistics
  const stats = {
    quotations: documents.filter(d => d.type === 'quotation').length,
    invoices: documents.filter(d => d.type === 'invoice').length,
    receipts: documents.filter(d => d.type === 'receipt').length,
    totalRevenue: documents.filter(d => d.status === 'paid').reduce((sum, d) => sum + d.total, 0),
    pendingAmount: documents.filter(d => d.status === 'unpaid' || d.status === 'pending').reduce((sum, d) => sum + d.total, 0),
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'quotation':
        return <FileText size={16} className="text-blue-600" />;
      case 'invoice':
        return <FileCheck size={16} className="text-amber-600" />;
      case 'receipt':
        return <Receipt size={16} className="text-emerald-600" />;
      default:
        return <FileText size={16} />;
    }
  };

  const getDocumentTypeText = (type: string) => {
    switch (type) {
      case 'quotation': return 'ใบเสนอราคา';
      case 'invoice': return 'ใบแจ้งหนี้';
      case 'receipt': return 'ใบเสร็จ';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { icon: Clock, text: 'รอดำเนินการ', color: 'bg-amber-50 text-amber-700' },
      approved: { icon: CheckCircle, text: 'อนุมัติ', color: 'bg-blue-50 text-blue-700' },
      paid: { icon: CheckCircle, text: 'ชำระแล้ว', color: 'bg-emerald-50 text-emerald-700' },
      unpaid: { icon: XCircle, text: 'ยังไม่ชำระ', color: 'bg-red-50 text-red-700' },
    };
    const badge = badges[status as keyof typeof badges];
    if (!badge) return null;
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 ${badge.color} text-xs font-medium rounded-lg`}>
        <Icon size={12} />
        {badge.text}
      </span>
    );
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesTab = activeTab === 'all' || doc.type === activeTab;
    const matchesSearch =
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.property.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleCreateDocument = (type: 'quotation' | 'invoice' | 'receipt', data: any) => {
    (async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const resp = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, document: data }),
        });
        if (!resp.ok) throw new Error('Failed to create document');
        await refreshDocuments();
        setShowForm(null);
      } catch (err) {
        console.warn(err);
        setLoadError('สร้างเอกสารไม่สำเร็จ (API/ENV ยังไม่พร้อม)');
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const handlePayInvoice = async (doc: any) => {
    try {
      const resp = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: doc.id }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json?.error || 'Failed to create checkout session');
      if (json?.url) window.location.href = json.url;
    } catch (err) {
      alert((err as Error).message);
    }
  };

  if (showForm) {
    return (
      <>
        {showForm === 'quotation' && (
          <QuotationForm
            onSave={(data) => handleCreateDocument('quotation', data)}
            onCancel={() => setShowForm(null)}
          />
        )}
        {showForm === 'invoice' && (
          <InvoiceForm
            onSave={(data) => handleCreateDocument('invoice', data)}
            onCancel={() => setShowForm(null)}
          />
        )}
        {showForm === 'receipt' && (
          <ReceiptForm
            onSave={(data) => handleCreateDocument('receipt', data)}
            onCancel={() => setShowForm(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="text-xs text-gray-500">กำลังโหลดข้อมูล…</div>
      )}
      {loadError && (
        <div className="text-xs text-red-600">{loadError}</div>
      )}
      {/* Header with Gradient */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-4 md:p-6 text-white shadow-xl shadow-emerald-600/30">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider font-semibold text-emerald-100 mb-1 md:mb-2">
              การจัดการเอกสาร
            </p>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-1 md:mb-2">เอกสารทางการเงิน</h1>
            <p className="text-emerald-50 text-xs md:text-sm">จัดการใบเสนอราคา ใบแจ้งหนี้ และใบเสร็จรับเงิน</p>
          </div>
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <FileText size={24} className="text-white md:hidden" />
            <FileText size={32} className="text-white hidden md:block" />
          </div>
        </div>

        {/* Quick Stats in Card */}
        <div className="grid grid-cols-2 gap-2 md:gap-3 mt-3 md:mt-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 md:p-3">
            <div className="text-xs text-emerald-100 mb-0.5 md:mb-1">รายรับทั้งหมด</div>
            <div className="text-lg md:text-2xl font-bold">฿{stats.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 md:p-3">
            <div className="text-xs text-emerald-100 mb-0.5 md:mb-1">ค้างชำระ</div>
            <div className="text-lg md:text-2xl font-bold">฿{stats.pendingAmount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="font-bold text-gray-900 mb-3 text-sm md:text-base">ประเภทเอกสาร</h2>
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <div className="bg-white rounded-xl p-3 md:p-5 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition group">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition mx-auto md:mx-0 mb-2 md:mb-0">
                <FileText size={16} className="text-blue-600 md:hidden" />
                <FileText size={24} className="text-blue-600 hidden md:block" />
              </div>
              <button 
                onClick={() => setShowForm('quotation')}
                className="hidden md:flex w-8 h-8 items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="text-xl md:text-3xl font-bold text-gray-900 mb-0.5 md:mb-1 text-center md:text-left">{stats.quotations}</div>
            <div className="text-xs md:text-sm text-gray-500 text-center md:text-left">ใบเสนอราคา</div>
            <button 
              onClick={() => setShowForm('quotation')}
              className="md:hidden w-full mt-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-xs font-medium"
            >
              + เพิ่ม
            </button>
          </div>

          <div className="bg-white rounded-xl p-3 md:p-5 border border-gray-100 hover:border-amber-200 hover:shadow-lg transition group">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center transition mx-auto md:mx-0 mb-2 md:mb-0">
                <FileCheck size={16} className="text-amber-600 md:hidden" />
                <FileCheck size={24} className="text-amber-600 hidden md:block" />
              </div>
              <button 
                onClick={() => setShowForm('invoice')}
                className="hidden md:flex w-8 h-8 items-center justify-center bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="text-xl md:text-3xl font-bold text-gray-900 mb-0.5 md:mb-1 text-center md:text-left">{stats.invoices}</div>
            <div className="text-xs md:text-sm text-gray-500 text-center md:text-left">ใบแจ้งหนี้</div>
            <button 
              onClick={() => setShowForm('invoice')}
              className="md:hidden w-full mt-2 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition text-xs font-medium"
            >
              + เพิ่ม
            </button>
          </div>

          <div className="bg-white rounded-xl p-3 md:p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition group">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 md:mb-3">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition mx-auto md:mx-0 mb-2 md:mb-0">
                <Receipt size={16} className="text-emerald-600 md:hidden" />
                <Receipt size={24} className="text-emerald-600 hidden md:block" />
              </div>
              <button 
                onClick={() => setShowForm('receipt')}
                className="hidden md:flex w-8 h-8 items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="text-xl md:text-3xl font-bold text-gray-900 mb-0.5 md:mb-1 text-center md:text-left">{stats.receipts}</div>
            <div className="text-xs md:text-sm text-gray-500 text-center md:text-left">ใบเสร็จ</div>
            <button 
              onClick={() => setShowForm('receipt')}
              className="md:hidden w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition text-xs font-medium"
            >
              + เพิ่ม
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาเอกสาร, ลูกค้า, บ้าน..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto scrollbar-hide">
        {[
          { key: 'all', label: 'ทั้งหมด', count: documents.length },
          { key: 'quotation', label: 'ใบเสนอราคา', count: stats.quotations },
          { key: 'invoice', label: 'ใบแจ้งหนี้', count: stats.invoices },
          { key: 'receipt', label: 'ใบเสร็จ', count: stats.receipts },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 md:px-4 py-2 md:py-3 text-sm md:text-base font-medium transition whitespace-nowrap border-b-2 ${
              activeTab === tab.key
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-xl p-8 md:p-16 border border-gray-100 text-center">
            <FileText size={40} className="mx-auto text-gray-300 mb-3 md:mb-4 md:hidden" />
            <FileText size={48} className="mx-auto text-gray-300 mb-4 hidden md:block" />
            <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">ไม่พบเอกสาร</h3>
            <p className="text-gray-500 text-xs md:text-sm">
              {searchTerm ? 'ลองค้นหาด้วยคำอื่น' : 'เริ่มสร้างเอกสารใหม่ได้เลย'}
            </p>
          </div>
        ) : (
          filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl p-3 md:p-4 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition group">
              <div className="flex items-start gap-3 md:gap-4">
                {/* Icon */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-50 group-hover:bg-emerald-50 flex items-center justify-center flex-shrink-0 transition">
                  {getDocumentIcon(doc.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-1">
                        <span className="font-bold text-gray-900 text-sm md:text-base">{doc.id}</span>
                        <span className="text-xs px-1.5 md:px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                          {getDocumentTypeText(doc.type)}
                        </span>
                      </div>
                      <div className="text-xs md:text-sm text-gray-600 mb-1">
                        {doc.customerName} • {doc.property}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-gray-500">
                        <span>{doc.date}</span>
                        {doc.dueDate && (
                          <span className="text-amber-600 font-medium">ครบกำหนด {doc.dueDate}</span>
                        )}
                      </div>
                    </div>

                    {/* Status & Price - Desktop */}
                    <div className="text-right flex-shrink-0 hidden md:block">
                      <div className="text-xl font-bold text-emerald-600 mb-2">
                        ฿{doc.total.toLocaleString()}
                      </div>
                      {getStatusBadge(doc.status)}
                    </div>
                  </div>

                  {/* Status & Price - Mobile */}
                  <div className="flex items-center justify-between mt-2 md:hidden">
                    <div className="text-lg font-bold text-emerald-600">
                      ฿{doc.total.toLocaleString()}
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>
                </div>

                {/* Actions - Desktop */}
                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                  {doc.type === 'invoice' && doc.status === 'unpaid' && (
                    <button
                      onClick={() => handlePayInvoice(doc)}
                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition text-sm font-medium"
                      title="ชำระเงิน"
                    >
                      ชำระเงิน
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      setShowPreview(true);
                    }}
                    className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition"
                    title="ดูเอกสาร"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => alert('ดาวน์โหลด ' + doc.id)}
                    className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition"
                    title="ดาวน์โหลด"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>

              {/* Actions - Mobile */}
              <div className="flex md:hidden gap-2 mt-3 pt-3 border-t border-gray-100">
                {doc.type === 'invoice' && doc.status === 'unpaid' && (
                  <button
                    onClick={() => handlePayInvoice(doc)}
                    className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                  >
                    <DollarSign size={16} />
                    <span>ชำระเงิน</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedDoc(doc);
                    setShowPreview(true);
                  }}
                  className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-100 transition flex items-center justify-center gap-2"
                >
                  <Eye size={16} />
                  <span>ดูเอกสาร</span>
                </button>
                <button
                  onClick={() => alert('ดาวน์โหลด ' + doc.id)}
                  className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  <span>ดาวน์โหลด</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Document Preview Modal */}
      {showPreview && selectedDoc && (
        <DocumentPreview
          document={selectedDoc}
          onClose={() => {
            setShowPreview(false);
            setSelectedDoc(null);
          }}
        />
      )}
    </div>
  );
};