import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Plus,
  Trash2,
  Upload,
  TreePine,
  Scissors,
  Sprout,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface ServiceFormProps {
  service?: any;
  onSave: (service: any) => void;
  onCancel: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: service?.id || `service-${Date.now()}`,
    title: service?.title || '',
    description: service?.description || '',
    icon: service?.icon || 'Package',
    color: service?.color || 'emerald',
    priceRange: service?.priceRange || '',
    duration: service?.duration || '',
    rating: service?.rating || 4.5,
    reviews: service?.reviews || 0,
    status: service?.status || 'active',
    features: service?.features || [''],
    process: service?.process || [{ step: 1, title: '', desc: '', time: '' }],
    packages: service?.packages || [{ name: '', price: '', area: '', features: [''] }],
    gallery: service?.gallery || [''],
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleArrayChange = (field: string, index: number, value: any) => {
    const newArray = [...formData[field as keyof typeof formData] as any[]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const handleObjectArrayChange = (field: string, index: number, key: string, value: any) => {
    const newArray = [...formData[field as keyof typeof formData] as any[]];
    newArray[index] = { ...newArray[index], [key]: value };
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: string, defaultValue: any) => {
    setFormData({
      ...formData,
      [field]: [...formData[field as keyof typeof formData] as any[], defaultValue],
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    const newArray = [...formData[field as keyof typeof formData] as any[]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-start justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">
            {service ? 'แก้ไขบริการ' : 'เพิ่มบริการใหม่'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Package size={18} className="text-emerald-600" />
              ข้อมูลพื้นฐาน
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อบริการ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="เช่น ออกแบบสวน"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ไอคอน
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="TreePine">ต้นไม้</option>
                  <option value="Scissors">กรรไกร</option>
                  <option value="Sprout">ต้นอ่อน</option>
                  <option value="Package">แพ็กเกจ</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คำอธิบาย <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="อธิบายรายละเอียดบริการ"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ช่วงราคา <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.priceRange}
                  onChange={(e) => handleChange('priceRange', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="เช่น 15,000 - 50,000"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ระยะเวลา <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="เช่น 7-14 วัน"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  คะแนน
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-600" />
                รายละเอียดบริการ
              </h3>
              <button
                type="button"
                onClick={() => addArrayItem('features', '')}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                <Plus size={16} />
                เพิ่ม
              </button>
            </div>
            {formData.features.map((feature: string, idx: number) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayChange('features', idx, e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="เช่น สำรวจพื้นที่ฟรี"
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('features', idx)}
                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Packages */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <DollarSign size={18} className="text-emerald-600" />
                แพ็กเกจราคา
              </h3>
              <button
                type="button"
                onClick={() => addArrayItem('packages', { name: '', price: '', area: '', features: [''] })}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                <Plus size={16} />
                เพิ่มแพ็กเกจ
              </button>
            </div>
            {formData.packages.map((pkg: any, idx: number) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">แพ็กเกจ {idx + 1}</h4>
                  {formData.packages.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('packages', idx)}
                      className="text-red-600 hover:bg-red-100 p-1 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => handleObjectArrayChange('packages', idx, 'name', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="ชื่อแพ็กเกจ"
                  />
                  <input
                    type="text"
                    value={pkg.price}
                    onChange={(e) => handleObjectArrayChange('packages', idx, 'price', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="ราคา"
                  />
                  <input
                    type="text"
                    value={pkg.area}
                    onChange={(e) => handleObjectArrayChange('packages', idx, 'area', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="พื้นที่"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Process Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Clock size={18} className="text-emerald-600" />
                ขั้นตอนการทำงาน
              </h3>
              <button
                type="button"
                onClick={() => addArrayItem('process', { 
                  step: formData.process.length + 1, 
                  title: '', 
                  desc: '', 
                  time: '' 
                })}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                <Plus size={16} />
                เพิ่มขั้นตอน
              </button>
            </div>
            {formData.process.map((item: any, idx: number) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">ขั้นตอนที่ {idx + 1}</h4>
                  {formData.process.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('process', idx)}
                      className="text-red-600 hover:bg-red-100 p-1 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleObjectArrayChange('process', idx, 'title', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="หัวข้อ"
                  />
                  <input
                    type="text"
                    value={item.desc}
                    onChange={(e) => handleObjectArrayChange('process', idx, 'desc', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="คำอธิบาย"
                  />
                  <input
                    type="text"
                    value={item.time}
                    onChange={(e) => handleObjectArrayChange('process', idx, 'time', e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    placeholder="เวลา"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
              <Save size={20} />
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
