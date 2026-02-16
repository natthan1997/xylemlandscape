import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, User, Home, CreditCard, Calculator, Percent } from 'lucide-react';

interface ReceiptFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const ReceiptForm: React.FC<ReceiptFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    property: '',
    paymentMethod: 'เงินสด',
    notes: '',
    items: [{ name: '', quantity: 1, price: 0 }],
    includeVat: true,
    vatRate: 7,
    discount: 0,
    discountType: 'percent' as 'percent' | 'amount',
  });

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: '', quantity: 1, price: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (formData.discountType === 'percent') {
      return (subtotal * formData.discount) / 100;
    }
    return formData.discount;
  };

  const calculateAfterDiscount = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const calculateVat = () => {
    if (!formData.includeVat) return 0;
    return (calculateAfterDiscount() * formData.vatRate) / 100;
  };

  const calculateGrandTotal = () => {
    return calculateAfterDiscount() + calculateVat();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const afterDiscount = calculateAfterDiscount();
    const vat = calculateVat();
    const total = calculateGrandTotal();

    onSave({
      ...formData,
      subtotal,
      discount,
      afterDiscount,
      vat,
      total,
      status: 'paid',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-emerald-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">สร้างใบเสร็จรับเงิน</h2>
            <p className="text-sm text-gray-600 mt-1">กรอกข้อมูลเพื่อสร้างใบเสร็จรับเงินใหม่</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/50 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              ข้อมูลลูกค้า
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อลูกค้า *
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="ระบุชื่อลูกค้า"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  บ้าน / ทรัพย์สิน *
                </label>
                <div className="relative">
                  <Home size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.property}
                    onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                    placeholder="ระบุชื่อบ้าน"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  วิธีชำระเงิน *
                </label>
                <div className="relative">
                  <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    required
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="เงินสด">เงินสด</option>
                    <option value="โอนเงิน">โอนเงิน</option>
                    <option value="บัตรเครดิต">บัตรเครดิต</option>
                    <option value="บัตรเดบิต">บัตรเดบิต</option>
                    <option value="เช็ค">เช็ค</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                รายการบริการ / สินค้า
              </h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-sm font-medium transition"
              >
                <Plus size={16} />
                เพิ่มรายการ
              </button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  <div className="col-span-12 md:col-span-5">
                    <input
                      type="text"
                      required
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      placeholder="ชื่อรายการ"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <input
                      type="number"
                      required
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)
                      }
                      placeholder="จำนวน"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, 'price', parseFloat(e.target.value) || 0)
                      }
                      placeholder="ราคา"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div className="col-span-3 md:col-span-2 flex items-center justify-end">
                    <span className="text-sm font-semibold text-gray-900">
                      ฿{(item.quantity * item.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculation Settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              การคำนวณ
            </h3>

            {/* Discount */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ส่วนลด
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ประเภท
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percent' | 'amount' })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="percent">เปอร์เซ็นต์ (%)</option>
                  <option value="amount">จำนวนเงิน (฿)</option>
                </select>
              </div>
            </div>

            {/* VAT Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Percent size={20} className="text-emerald-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-900">รวมภาษีมูลค่าเพิ่ม (VAT)</label>
                  <p className="text-xs text-gray-500">คำนวณภาษี {formData.vatRate}% ในยอดรวม</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeVat}
                  onChange={(e) => setFormData({ ...formData, includeVat: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 space-y-3 border-2 border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <Calculator size={20} className="text-emerald-600" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                สรุปยอดเงินที่ชำระแล้ว
              </h3>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">ยอดรวม</span>
                <span className="font-medium text-gray-900">
                  ฿{calculateSubtotal().toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                </span>
              </div>

              {formData.discount > 0 && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      ส่วนลด {formData.discountType === 'percent' ? `(${formData.discount}%)` : ''}
                    </span>
                    <span className="font-medium text-red-600">
                      -฿{calculateDiscount().toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-emerald-200">
                    <span className="text-gray-600">หักส่วนลดแล้ว</span>
                    <span className="font-medium text-gray-900">
                      ฿{calculateAfterDiscount().toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </>
              )}

              {formData.includeVat && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">ภาษีมูลค่าเพิ่ม {formData.vatRate}%</span>
                  <span className="font-medium text-gray-900">
                    ฿{calculateVat().toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t-2 border-emerald-300">
                <div className="flex items-center justify-between">
                  <span className="text-base md:text-lg font-bold text-gray-900">ยอดที่ชำระแล้ว</span>
                  <span className="text-xl md:text-2xl font-bold text-emerald-600">
                    ฿{calculateGrandTotal().toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หมายเหตุ (ถ้ามี)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="เพิ่มหมายเหตุหรือเงื่อนไขพิเศษ"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-200 hover:bg-white text-gray-700 rounded-xl font-medium transition"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition"
          >
            <Save size={18} />
            บันทึกใบเสร็จรับเงิน
          </button>
        </div>
      </form>
    </div>
  );
};
