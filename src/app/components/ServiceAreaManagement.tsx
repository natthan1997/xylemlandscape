import React, { useState } from 'react';
import { MapPin, Plus, X, Search, Trash2, Edit2, Check } from 'lucide-react';

interface ServiceArea {
  id: string;
  postalCode: string;
  district: string;
  province: string;
  subDistrict: string;
  status: 'active' | 'inactive';
}

export const ServiceAreaManagement: React.FC = () => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([
    { id: '1', postalCode: '10110', district: 'พญาไท', province: 'กรุงเทพมหานคร', subDistrict: 'พญาไท', status: 'active' },
    { id: '2', postalCode: '10250', district: 'คลองเตย', province: 'กรุงเทพมหานคร', subDistrict: 'คลองเตย', status: 'active' },
    { id: '3', postalCode: '10400', district: 'ป้อมปราบศัตรูพ่าย', province: 'กรุงเทพมหานคร', subDistrict: 'วัดเทพศิรินทร์', status: 'active' },
    { id: '4', postalCode: '76120', district: 'ชะอำ', province: 'เพชรบุรี', subDistrict: 'ชะอำ', status: 'active' },
    { id: '5', postalCode: '23170', district: 'เกาะช้าง', province: 'ตราด', subDistrict: 'เกาะช้าง', status: 'active' },
    { id: '6', postalCode: '10500', district: 'จตุจักร', province: 'กรุงเทพมหานคร', subDistrict: 'ลาดยาว', status: 'active' },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [newArea, setNewArea] = useState({
    postalCode: '',
    district: '',
    province: '',
    subDistrict: '',
  });

  const handleAddArea = () => {
    if (!newArea.postalCode || !newArea.district || !newArea.province) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const area: ServiceArea = {
      id: Date.now().toString(),
      ...newArea,
      status: 'active',
    };

    setServiceAreas([...serviceAreas, area]);
    setNewArea({ postalCode: '', district: '', province: '', subDistrict: '' });
    setShowAddForm(false);
  };

  const handleDeleteArea = (id: string) => {
    if (confirm('คุณต้องการลบจุดให้บริการนี้ใช่หรือไม่?')) {
      setServiceAreas(serviceAreas.filter(area => area.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setServiceAreas(serviceAreas.map(area =>
      area.id === id
        ? { ...area, status: area.status === 'active' ? 'inactive' : 'active' }
        : area
    ));
  };

  const filteredAreas = serviceAreas.filter(area =>
    area.postalCode.includes(searchQuery) ||
    area.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    area.province.toLowerCase().includes(searchQuery.toLowerCase()) ||
    area.subDistrict.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedByProvince = filteredAreas.reduce((acc, area) => {
    if (!acc[area.province]) {
      acc[area.province] = [];
    }
    acc[area.province].push(area);
    return acc;
  }, {} as Record<string, ServiceArea[]>);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จุดให้บริการ</h1>
          <p className="text-sm text-gray-500 mt-1">จัดการพื้นที่ให้บริการตามเลขไปรษณีย์</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition"
        >
          <Plus size={18} />
          เพิ่มจุดให้บริการ
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <MapPin size={24} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">จุดให้บริการทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{serviceAreas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <Check size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">พื้นที่เปิดให้บริการ</p>
              <p className="text-2xl font-bold text-gray-900">
                {serviceAreas.filter(a => a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <MapPin size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">จังหวัดที่ให้บริการ</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(groupedByProvince).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">เพิ่มจุดให้บริการใหม่</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รหัสไปรษณีย์ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newArea.postalCode}
                onChange={(e) => setNewArea({ ...newArea, postalCode: e.target.value })}
                placeholder="เช่น 10110"
                maxLength={5}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                จังหวัด <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newArea.province}
                onChange={(e) => setNewArea({ ...newArea, province: e.target.value })}
                placeholder="เช่น กรุงเทพมหานคร"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เขต/อำเภอ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newArea.district}
                onChange={(e) => setNewArea({ ...newArea, district: e.target.value })}
                placeholder="เช่น พญาไท"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                แขวง/ตำบล
              </label>
              <input
                type="text"
                value={newArea.subDistrict}
                onChange={(e) => setNewArea({ ...newArea, subDistrict: e.target.value })}
                placeholder="เช่น พญาไท"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddArea}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition"
            >
              เพิ่มจุดให้บริการ
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="ค้นหาจากรหัสไปรษณีย์, จังหวัด, เขต หรือแขวง..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Service Areas List - Grouped by Province */}
      <div className="space-y-6">
        {Object.entries(groupedByProvince).map(([province, areas]) => (
          <div key={province} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Province Header */}
            <div className="bg-emerald-50 px-4 md:px-6 py-3 border-b border-emerald-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-emerald-600" />
                  <h3 className="font-bold text-gray-900">{province}</h3>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                  {areas.length} จุด
                </span>
              </div>
            </div>

            {/* Areas */}
            <div className="divide-y divide-gray-100">
              {areas.map((area) => (
                <div
                  key={area.id}
                  className="p-4 md:p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 bg-gray-100 rounded-lg">
                          <span className="font-bold text-gray-900">{area.postalCode}</span>
                        </div>
                        <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          area.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {area.status === 'active' ? 'เปิดให้บริการ' : 'ปิดให้บริการ'}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {area.subDistrict && `${area.subDistrict}, `}
                        {area.district}, {area.province}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(area.id)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                          area.status === 'active'
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {area.status === 'active' ? 'ปิดให้บริการ' : 'เปิดให้บริการ'}
                      </button>
                      <button
                        onClick={() => handleDeleteArea(area.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition group"
                      >
                        <Trash2 size={18} className="text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredAreas.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
            <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">ไม่พบจุดให้บริการ</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 'ลองค้นหาด้วยคำค้นอื่น' : 'เริ่มต้นเพิ่มจุดให้บริการแรกของคุณ'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition inline-flex items-center gap-2"
              >
                <Plus size={18} />
                เพิ่มจุดให้บริการ
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
