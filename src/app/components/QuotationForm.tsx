import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, User, Home, Calculator, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

interface QuotationFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const QuotationForm: React.FC<QuotationFormProps> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    property: '',
    validUntil: '',
    notes: '',
    items: [{ name: '', quantity: 1, price: 0 }],
    includeVat: true,
    vatRate: 7,
    discount: 0,
    discountType: 'percent' as 'percent' | 'amount',
    enableInstallments: false,
    installments: [{ dueDate: '', percentage: 100, amount: 0, description: 'ชำระเต็มจำนวน' }],
  });

  const [expandedSections, setExpandedSections] = useState({
    items: true,
    discount: false,
    installments: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

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

  const handleAddInstallment = () => {
    setFormData({
      ...formData,
      installments: [...formData.installments, { dueDate: '', percentage: 0, amount: 0, description: '' }],
    });
  };

  const handleRemoveInstallment = (index: number) => {
    const newInstallments = formData.installments.filter((_, i) => i !== index);
    setFormData({ ...formData, installments: newInstallments });
  };

  const handleInstallmentChange = (index: number, field: string, value: any) => {
    const newInstallments = [...formData.installments];
    
    if (field === 'percentage') {
      const percentage = parseFloat(value) || 0;
      newInstallments[index].percentage = percentage;
      newInstallments[index].amount = (calculateGrandTotal() * percentage) / 100;
    } else if (field === 'amount') {
      const amount = parseFloat(value) || 0;
      const total = calculateGrandTotal();
      newInstallments[index].amount = amount;
      newInstallments[index].percentage = total > 0 ? (amount / total) * 100 : 0;
    } else {
      newInstallments[index] = { ...newInstallments[index], [field]: value };
    }
    
    setFormData({ ...formData, installments: newInstallments });
  };

  const applyQuickSplit = (preset: string) => {
    const total = calculateGrandTotal();
    let newInstallments: any[] = [];
    const today = new Date();
    
    switch (preset) {
      case '50-50':
        newInstallments = [
          { dueDate: new Date(today.getTime() + 7*24*60*60*1000).toISOString().split('T')[0], percentage: 50, amount: total * 0.5, description: 'มัดจำ 50%' },
          { dueDate: new Date(today.getTime() + 30*24*60*60*1000).toISOString().split('T')[0], percentage: 50, amount: total * 0.5, description: 'ชำระที่เหลือ 50%' },
        ];
        break;
      case '30-70':
        newInstallments = [
          { dueDate: new Date(today.getTime() + 7*24*60*60*1000).toISOString().split('T')[0], percentage: 30, amount: total * 0.3, description: 'มัดจำ 30%' },
          { dueDate: new Date(today.getTime() + 30*24*60*60*1000).toISOString().split('T')[0], percentage: 70, amount: total * 0.7, description: 'ชำระที่เหลือ 70%' },
        ];
        break;
      case '3-equal':
        newInstallments = [
          { dueDate: new Date(today.getTime() + 7*24*60*60*1000).toISOString().split('T')[0], percentage: 33.33, amount: total * 0.3333, description: 'งวดที่ 1' },
          { dueDate: new Date(today.getTime() + 30*24*60*60*1000).toISOString().split('T')[0], percentage: 33.33, amount: total * 0.3333, description: 'งวดที่ 2' },
          { dueDate: new Date(today.getTime() + 60*24*60*60*1000).toISOString().split('T')[0], percentage: 33.34, amount: total * 0.3334, description: 'งวดที่ 3' },
        ];
        break;
    }
    
    setFormData({ ...formData, installments: newInstallments, enableInstallments: true });
    setExpandedSections(prev => ({ ...prev, installments: true }));
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

  const getTotalInstallmentPercentage = () => {
    return formData.installments.reduce((sum, inst) => sum + parseFloat(inst.percentage.toString() || '0'), 0);
  };

  useEffect(() => {
    if (formData.enableInstallments) {
      const total = calculateGrandTotal();
      const updatedInstallments = formData.installments.map(inst => {
        const percentage = parseFloat(inst.percentage.toString() || '0');
        return {
          ...inst,
          amount: (total * percentage) / 100
        };
      });
      if (JSON.stringify(updatedInstallments) !== JSON.stringify(formData.installments)) {
        setFormData(prev => ({ ...prev, installments: updatedInstallments }));
      }
    }
  }, [formData.items, formData.includeVat, formData.vatRate, formData.discount, formData.discountType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.enableInstallments) {
      const totalPercentage = getTotalInstallmentPercentage();
      if (Math.abs(totalPercentage - 100) > 0.01) {
        alert(`กรุณาตรวจสอบงวดการชำระ ผลรวมต้องเท่ากับ 100% (ปัจจุบัน: ${totalPercentage.toFixed(2)}%)`);
        return;
      }
    }

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
      status: 'pending',
    });
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h2 className="font-bold text-gray-900">ใบเสนอราคา</h2>
          <p className="text-xs text-gray-500">กรอกข้อมูลเอกสาร</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Customer Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">ข้อมูลลูกค้า</h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">ชื่อลูกค้า *</label>
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="ระบุชื่อลูกค้า"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">บ้าน / ทรัพย์สิน *</label>
              <input
                type="text"
                required
                value={formData.property}
                onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                placeholder="ระบุชื่อบ้าน"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">ใบเสนอราคามีผลถึง *</label>
              <input
                type="date"
                required
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('items')}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-200"
            >
              <span className="font-semibold text-gray-900 text-sm">รายการสินค้า/บริการ ({formData.items.length})</span>
              {expandedSections.items ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {expandedSections.items && (
              <div className="p-4 space-y-3">
                {formData.items.map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-700">รายการที่ {index + 1}</span>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    
                    <input
                      type="text"
                      required
                      value={item.name}
                      onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                      placeholder="ชื่อรายการ"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">จำนวน</label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-2 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">ราคา/หน่วย</label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-2 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">รวม</label>
                        <div className="px-2 py-2 text-right font-bold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
                          ฿{(item.quantity * item.price).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
                >
                  <Plus size={18} />
                  เพิ่มรายการ
                </button>
              </div>
            )}
          </div>

          {/* Discount & VAT */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection('discount')}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-200"
            >
              <span className="font-semibold text-gray-900 text-sm">ส่วนลดและภาษี</span>
              {expandedSections.discount ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {expandedSections.discount && (
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">ส่วนลด</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                        placeholder="0"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percent' | 'amount' })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="percent">%</option>
                      <option value="amount">บาท</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">VAT {formData.vatRate}%</div>
                    <div className="text-xs text-gray-500">ภาษีมูลค่าเพิ่ม</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.includeVat}
                      onChange={(e) => setFormData({ ...formData, includeVat: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Installments */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between bg-emerald-50 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <CreditCard size={16} className="text-emerald-700" />
                <span className="font-semibold text-gray-900 text-sm">แบ่งชำระ</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.enableInstallments}
                  onChange={(e) => {
                    setFormData({ ...formData, enableInstallments: e.target.checked });
                    if (e.target.checked) {
                      setExpandedSections(prev => ({ ...prev, installments: true }));
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
              </label>
            </div>

            {formData.enableInstallments && (
              <div className="p-4 space-y-3">
                {/* Quick Presets */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => applyQuickSplit('50-50')}
                    className="flex-1 px-3 py-2 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-lg text-sm font-medium transition"
                  >
                    50-50
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickSplit('30-70')}
                    className="flex-1 px-3 py-2 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-lg text-sm font-medium transition"
                  >
                    30-70
                  </button>
                  <button
                    type="button"
                    onClick={() => applyQuickSplit('3-equal')}
                    className="flex-1 px-3 py-2 bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-700 rounded-lg text-sm font-medium transition"
                  >
                    3งวด
                  </button>
                </div>

                {/* Warning */}
                {Math.abs(getTotalInstallmentPercentage() - 100) > 0.01 && (
                  <div className="bg-amber-50 border border-amber-300 rounded-lg px-3 py-2 text-xs text-amber-800">
                    ⚠️ ต้องรวม 100% (ปัจจุบัน: {getTotalInstallmentPercentage().toFixed(2)}%)
                  </div>
                )}

                {/* Installment List */}
                {formData.installments.map((installment, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={installment.description}
                          onChange={(e) => handleInstallmentChange(index, 'description', e.target.value)}
                          placeholder="คำอธิบาย"
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      {formData.installments.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveInstallment(index)}
                          className="p-1 hover:bg-red-100 text-red-600 rounded transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">วันที่ *</label>
                      <input
                        type="date"
                        required={formData.enableInstallments}
                        value={installment.dueDate}
                        onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">เปอร์เซ็นต์ *</label>
                        <input
                          type="number"
                          required={formData.enableInstallments}
                          min="0"
                          max="100"
                          step="0.01"
                          value={installment.percentage}
                          onChange={(e) => handleInstallmentChange(index, 'percentage', e.target.value)}
                          className="w-full px-3 py-2 text-sm text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">จำนวนเงิน</label>
                        <div className="px-3 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
                          ฿{installment.amount.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddInstallment}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-medium transition"
                >
                  <Plus size={16} />
                  เพิ่มงวด
                </button>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">หมายเหตุ</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="เพิ่มหมายเหตุ..."
              rows={3}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
        </div>

        {/* Summary Footer */}
        <div className="bg-white border-t border-gray-200 px-4 py-3 sticky bottom-0">
          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">ยอดรวม</span>
              <span className="font-medium">฿{calculateSubtotal().toLocaleString()}</span>
            </div>
            {formData.discount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">ส่วนลด</span>
                <span className="font-medium text-red-600">-฿{calculateDiscount().toLocaleString()}</span>
              </div>
            )}
            {formData.includeVat && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">VAT {formData.vatRate}%</span>
                <span className="font-medium">฿{calculateVat().toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-gray-300 flex items-center justify-between">
              <span className="font-bold text-gray-900">ยอดรวมทั้งสิ้น</span>
              <span className="text-xl font-bold text-emerald-600">
                ฿{calculateGrandTotal().toLocaleString()}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition"
            >
              <Save size={18} />
              บันทึก
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
