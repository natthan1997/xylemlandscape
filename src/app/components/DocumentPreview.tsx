import React from 'react';
import { X, Download, Printer, Leaf } from 'lucide-react';

interface DocumentPreviewProps {
  document: any;
  onClose: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ document, onClose }) => {
  const getDocumentTitle = (type: string) => {
    switch (type) {
      case 'quotation': return 'ใบเสนอราคา';
      case 'invoice': return 'ใบแจ้งหนี้';
      case 'receipt': return 'ใบเสร็จรับเงิน';
      default: return 'เอกสาร';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('ดาวน์โหลดเอกสาร PDF (ฟีเจอร์นี้จะพัฒนาต่อ)');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const subtotal = document.subtotal || document.total || 0;
  const discount = document.discount || 0;
  const afterDiscount = document.afterDiscount || subtotal;
  const vat = document.vat || (document.includeVat ? afterDiscount * 0.07 : 0);
  const grandTotal = document.total || (afterDiscount + vat);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-0 md:p-4 overflow-y-auto">
      <div className="w-full md:max-w-4xl bg-white md:rounded-2xl shadow-2xl min-h-screen md:min-h-0 md:my-8">
        {/* Header Actions */}
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-3 md:p-4 border-b border-gray-200">
          <div>
            <h2 className="font-bold text-gray-900 text-sm md:text-base">{getDocumentTitle(document.type)}</h2>
            <p className="text-xs text-gray-500">เลขที่: {document.id}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition"
              title="ดาวน์โหลด"
            >
              <Download size={18} />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition hidden md:flex"
              title="พิมพ์"
            >
              <Printer size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="p-3 md:p-8 bg-gray-50">
          <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Top Border */}
            <div className="h-1 md:h-2 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
            
            <div className="p-4 md:p-12">
              {/* Header Section */}
              <div className="mb-4 md:mb-10 pb-4 md:pb-8 border-b border-gray-200">
                {/* Company Info */}
                <div className="mb-4 md:mb-0">
                  <div className="flex items-center gap-2 mb-2 md:mb-4">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                      <Leaf size={20} className="text-white md:hidden" />
                      <Leaf size={28} className="text-white hidden md:block" />
                    </div>
                    <div>
                      <h1 className="text-base md:text-2xl font-bold text-gray-900">XYLEM LANDSCAPE</h1>
                      <p className="text-xs md:text-sm text-gray-600">บริการออกแบบและดูแลสวนครบวงจร</p>
                    </div>
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 space-y-0.5 mb-3 md:mb-0">
                    <p>123 ถนนสุขุมวิท คลองเตย กรุงเทพฯ 10110</p>
                    <p>โทร: 02-123-4567 | info@xylemlandscape.co.th</p>
                  </div>
                </div>

                {/* Document Number */}
                <div className="flex justify-between items-center md:block md:text-right md:absolute md:top-[4rem] md:right-12">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-0.5 md:mb-1">
                      {getDocumentTitle(document.type)}
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-gray-900">
                      {document.id}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer & Document Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 mb-4 md:mb-10 text-xs md:text-sm">
                <div className="bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-lg md:rounded-none">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">ข้อมูลลูกค้า</h3>
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <span className="text-gray-600">ชื่อ:</span>
                      <p className="font-semibold text-gray-900">{document.customerName}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-600">ทรัพย์สิน:</span>
                      <p className="font-semibold text-gray-900">{document.property}</p>
                    </div>
                    {document.paymentMethod && (
                      <div className="flex gap-2">
                        <span className="text-gray-600">วิธีชำระ:</span>
                        <p className="font-semibold text-gray-900">{document.paymentMethod}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-lg md:rounded-none md:text-right">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">รายละเอียดเอกสาร</h3>
                  <div className="space-y-1">
                    <div className="flex md:block gap-2">
                      <span className="text-gray-600">วันที่:</span>
                      <p className="font-semibold text-gray-900">{document.date}</p>
                    </div>
                    {document.validUntil && (
                      <div className="flex md:block gap-2">
                        <span className="text-gray-600">มีผลถึง:</span>
                        <p className="font-semibold text-gray-900">{document.validUntil}</p>
                      </div>
                    )}
                    {document.dueDate && (
                      <div className="flex md:block gap-2">
                        <span className="text-gray-600">ครบกำหนด:</span>
                        <p className="font-semibold text-emerald-600">{document.dueDate}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-4 md:mb-8 -mx-4 md:mx-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="bg-gray-50 md:bg-transparent border-b-2 border-gray-300">
                        <th className="text-left py-2 md:py-3 font-semibold text-gray-700 pl-4 md:pl-0">#</th>
                        <th className="text-left py-2 md:py-3 font-semibold text-gray-700">รายการ</th>
                        <th className="text-center py-2 md:py-3 font-semibold text-gray-700">จำนวน</th>
                        <th className="text-right py-2 md:py-3 font-semibold text-gray-700 pr-4 md:pr-0">ราคา</th>
                      </tr>
                    </thead>
                    <tbody>
                      {document.items.map((item: any, index: number) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2 md:py-3 text-gray-600 pl-4 md:pl-0">{index + 1}</td>
                          <td className="py-2 md:py-3 text-gray-900 font-medium">{item.name}</td>
                          <td className="py-2 md:py-3 text-center text-gray-900">{item.quantity}</td>
                          <td className="py-2 md:py-3 text-right text-gray-900 font-semibold pr-4 md:pr-0">
                            ฿{formatCurrency(item.quantity * item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-4 md:mb-8">
                <div className="bg-gray-50 md:bg-transparent p-3 md:p-0 rounded-lg md:rounded-none md:ml-auto md:w-96">
                  <div className="space-y-2 text-xs md:text-sm">
                    <div className="flex items-center justify-between py-1.5 md:py-2 border-b border-gray-200">
                      <span className="text-gray-700">ยอดรวม</span>
                      <span className="font-semibold text-gray-900">฿{formatCurrency(subtotal)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <>
                        <div className="flex items-center justify-between py-1.5 md:py-2 border-b border-gray-200">
                          <span className="text-gray-700">ส่วนลด</span>
                          <span className="font-semibold text-red-600">-฿{formatCurrency(discount)}</span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 md:py-2 border-b border-gray-200">
                          <span className="text-gray-700">หลังหักส่วนลด</span>
                          <span className="font-semibold text-gray-900">฿{formatCurrency(afterDiscount)}</span>
                        </div>
                      </>
                    )}
                    
                    {vat > 0 && (
                      <div className="flex items-center justify-between py-1.5 md:py-2 border-b border-gray-200">
                        <span className="text-gray-700">VAT 7%</span>
                        <span className="font-semibold text-gray-900">฿{formatCurrency(vat)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between py-2 md:py-3 bg-emerald-600 px-3 md:px-4 rounded-lg mt-2">
                      <span className="font-bold text-white">ยอดรวมทั้งสิ้น</span>
                      <span className="text-lg md:text-2xl font-bold text-white">฿{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    ({convertNumberToThaiText(grandTotal)})
                  </p>
                </div>
              </div>

              {/* Installments */}
              {document.enableInstallments && document.installments && document.installments.length > 0 && (
                <div className="mb-4 md:mb-8 p-3 md:p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-2 md:mb-3">งวดการชำระเงิน</h3>
                  <div className="space-y-2">
                    {document.installments.map((inst: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-xs md:text-sm bg-white px-3 md:px-4 py-2 rounded-lg gap-2">
                        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                          <div className="w-5 h-5 md:w-6 md:h-6 rounded bg-emerald-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 truncate">{inst.description}</div>
                            <div className="text-xs text-gray-500">ครบกำหนด: {inst.dueDate}</div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-bold text-emerald-700">฿{formatCurrency(inst.amount)}</div>
                          <div className="text-xs text-gray-500">{inst.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {document.notes && (
                <div className="mb-4 md:mb-8 p-3 md:p-5 bg-amber-50 border border-amber-200 rounded-xl">
                  <h3 className="text-xs font-bold text-gray-700 uppercase mb-2">หมายเหตุ</h3>
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{document.notes}</p>
                </div>
              )}

              {/* Terms */}
              {document.type === 'invoice' && (
                <div className="mb-4 md:mb-8 pb-4 md:pb-6 border-b border-gray-200">
                  <h3 className="text-xs font-bold text-gray-700 uppercase mb-2 md:mb-3">เงื่อนไขการชำระเงิน</h3>
                  <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                    <li>• กรุณาชำระเงินภายในวันที่ครบกำหนด</li>
                    <li>• กรณีชำระล่าช้า คิดค่าปรับ 1.5% ต่อเดือน</li>
                    <li>• เช็คที่ถูกปฏิเสธมีค่าธรรมเนียม 500 บาท</li>
                  </ul>
                </div>
              )}

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-6 md:gap-12 mb-4 md:mb-8">
                <div className="text-center">
                  <div className="h-16 md:h-20 mb-2"></div>
                  <div className="border-t border-gray-400 pt-2">
                    <p className="text-xs md:text-sm font-semibold text-gray-900">ผู้อนุมัติ</p>
                    <p className="text-xs text-gray-500">วันที่: ........................</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="h-16 md:h-20 mb-2"></div>
                  <div className="border-t border-gray-400 pt-2">
                    <p className="text-xs md:text-sm font-semibold text-gray-900">ผู้รับเงิน</p>
                    <p className="text-xs text-gray-500">วันที่: ........................</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center pt-4 md:pt-6 border-t border-gray-200">
                <p className="text-xs md:text-sm text-gray-600 mb-1">ขอบคุณที่ใช้บริการ XYLEM LANDSCAPE</p>
                <p className="text-xs text-gray-500">เอกสารนี้ออกโดยระบบอัตโนมัติ ไม่ต้องมีลายเซ็น</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2 border border-gray-300 hover:bg-white text-gray-700 rounded-lg font-medium transition"
          >
            ปิด
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition"
          >
            <Download size={18} />
            ดาวน์โหลด
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
          >
            <Printer size={18} />
            พิมพ์
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to convert number to Thai text
function convertNumberToThaiText(num: number): string {
  const baht = Math.floor(num);
  const satang = Math.round((num - baht) * 100);
  
  if (baht === 0 && satang === 0) return 'ศูนย์บาทถ้วน';
  
  const ones = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const places = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];
  
  let result = '';
  const bahtStr = baht.toString();
  const len = bahtStr.length;
  
  for (let i = 0; i < len; i++) {
    const digit = parseInt(bahtStr[i]);
    const place = len - i - 1;
    
    if (digit === 0) continue;
    
    if (place === 1 && digit === 1) {
      result += 'สิบ';
    } else if (place === 1 && digit === 2) {
      result += 'ยี่สิบ';
    } else if (place === 0 && digit === 1 && len > 1) {
      result += 'เอ็ด';
    } else {
      result += ones[digit];
      if (place > 0) result += places[place];
    }
  }
  
  result += 'บาท';
  
  if (satang === 0) {
    result += 'ถ้วน';
  } else {
    result += satang + ' สตางค์';
  }
  
  return result;
}