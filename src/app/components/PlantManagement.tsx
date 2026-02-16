import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Package,
  AlertCircle,
} from 'lucide-react';

interface Plant {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  stock: number;
  description: string;
  care: string;
}

interface PlantManagementProps {
  plants: Plant[];
  onAddPlant: (plant: Omit<Plant, 'id'>) => void;
  onUpdatePlant: (id: number, plant: Partial<Plant>) => void;
  onDeletePlant: (id: number) => void;
}

const CATEGORIES = [
  'ทั้งหมด',
  'ไม้ฟอกอากาศ',
  'ไม้ประดับ',
  'ไม้อวบน้ำ',
  'กระบองเพชร',
  'ไม้ดอก',
  'ไม้ใบสวย',
];

export const PlantManagement: React.FC<PlantManagementProps> = ({
  plants,
  onAddPlant,
  onUpdatePlant,
  onDeletePlant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'ไม้ฟอกอากาศ',
    price: 0,
    originalPrice: 0,
    image: '',
    size: '',
    stock: 0,
    description: '',
    care: '',
  });

  const filteredPlants = plants.filter(plant => {
    const matchSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'ทั้งหมด' || plant.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPlant) {
      onUpdatePlant(editingPlant.id, formData);
      setEditingPlant(null);
    } else {
      onAddPlant(formData);
    }
    
    setShowAddModal(false);
    setFormData({
      name: '',
      category: 'ไม้ฟอกอากาศ',
      price: 0,
      originalPrice: 0,
      image: '',
      size: '',
      stock: 0,
      description: '',
      care: '',
    });
  };

  const handleEdit = (plant: Plant) => {
    setEditingPlant(plant);
    setFormData({
      name: plant.name,
      category: plant.category,
      price: plant.price,
      originalPrice: plant.originalPrice || 0,
      image: plant.image,
      size: plant.size,
      stock: plant.stock,
      description: plant.description,
      care: plant.care,
    });
    setShowAddModal(true);
  };

  const handleCancel = () => {
    setShowAddModal(false);
    setEditingPlant(null);
    setFormData({
      name: '',
      category: 'ไม้ฟอกอากาศ',
      price: 0,
      originalPrice: 0,
      image: '',
      size: '',
      stock: 0,
      description: '',
      care: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">จัดการต้นไม้</h1>
          <p className="text-sm text-gray-500 mt-1">เพิ่ม แก้ไข และลบต้นไม้ในร้าน</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
        >
          <Plus size={20} />
          <span>เพิ่มต้นไม้ใหม่</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Package size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">ต้นไม้ทั้งหมด</p>
              <p className="text-xl font-bold text-gray-900">{plants.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Tag size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">หมวดหมู่</p>
              <p className="text-xl font-bold text-gray-900">{CATEGORIES.length - 1}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">มูลค่ารวม</p>
              <p className="text-xl font-bold text-gray-900">
                ฿{plants.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <AlertCircle size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">สต็อกต่ำ</p>
              <p className="text-xl font-bold text-gray-900">
                {plants.filter(p => p.stock < 5).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาต้นไม้..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap text-sm transition ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plants Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ต้นไม้
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  หมวดหมู่
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ขนาด
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ราคา
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  สต็อก
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPlants.map(plant => (
                <tr key={plant.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={plant.image}
                          alt={plant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{plant.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{plant.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                      {plant.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-700">{plant.size}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">฿{plant.price}</span>
                      {plant.originalPrice && plant.originalPrice > plant.price && (
                        <span className="text-xs text-gray-400 line-through">฿{plant.originalPrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-semibold ${
                      plant.stock < 5 ? 'text-orange-600' : 'text-gray-900'
                    }`}>
                      {plant.stock} ต้น
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(plant)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`ต้องการลบ "${plant.name}" ใช่หรือไม่?`)) {
                            onDeletePlant(plant.id);
                          }
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPlants.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">ไม่พบต้นไม้</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingPlant ? 'แก้ไขต้นไม้' : 'เพิ่มต้นไม้ใหม่'}
                </h2>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ชื่อต้นไม้ *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="เช่น ต้นมอนสเตอร่า"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Category & Size */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      หมวดหมู่ *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {CATEGORIES.filter(c => c !== 'ทั้งหมด').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ขนาด *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      placeholder="เช่น กระถาง 6 นิ้ว"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Price & Original Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ราคา (บาท) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ราคาเดิม (ถ้ามีส่วนลด)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    จำนวนสต็อก *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL รูปภาพ *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {formData.image && (
                    <div className="mt-2 w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    คำอธิบาย *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="บอกรายละเอียดเกี่ยวกับต้นไม้..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Care Instructions */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    วิธีดูแล *
                  </label>
                  <textarea
                    required
                    value={formData.care}
                    onChange={(e) => setFormData({ ...formData, care: e.target.value })}
                    placeholder="แนะนำวิธีการดูแล..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  <span>{editingPlant ? 'บันทึก' : 'เพิ่มต้นไม้'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};