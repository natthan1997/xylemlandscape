import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Home,
  Phone,
  Mail,
  MapPin,
  X,
  Save,
  User,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  properties: Property[];
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  size: string;
  type: string;
}

interface CustomerManagementProps {
  onCustomerAdded?: (customer: Customer) => void;
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({ onCustomerAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'คุณสมชาย ใจดี',
      phone: '081-234-5678',
      email: 'somchai@email.com',
      address: '123 ถ.สุขุมวิท แขวงคลองเตย กรุงเทพฯ',
      properties: [
        { id: '1', name: 'บ้านกรุงเทพ', address: '123 ถ.สุขุมวิท', size: '200 ตร.ม.', type: 'บ้านเดี่ยว' },
        { id: '2', name: 'บ้านชะอำ', address: '45 ต.ชะอำ เพชรบุรี', size: '500 ตร.ม.', type: 'บ้านพักตากอากาศ' },
      ],
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'คุณสมหญิง รักสวน',
      phone: '082-345-6789',
      email: 'somying@email.com',
      address: '456 ถ.พระราม 9 กรุงเทพฯ',
      properties: [
        { id: '3', name: 'บ้านพักตากอากาศ', address: '78 เกาะช้าง ตราด', size: '300 ตร.ม.', type: 'รีสอร์ท' },
      ],
      status: 'active',
      createdAt: '2024-02-01',
    },
    {
      id: '3',
      name: 'คุณธนา เกษตรกร',
      phone: '083-456-7890',
      email: 'tana@email.com',
      address: '789 ถ.นิมมาน เชียงใหม่',
      properties: [
        { id: '4', name: 'บ้านเชียงใหม่', address: '90 ถ.นิมมาน เชียงใหม่', size: '400 ตร.ม.', type: 'บ้านเดี่ยว' },
      ],
      status: 'active',
      createdAt: '2024-01-20',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    properties: [{ name: '', address: '', size: '', type: 'บ้านเดี่ยว' }],
  });

  const handleAddProperty = () => {
    setFormData({
      ...formData,
      properties: [...formData.properties, { name: '', address: '', size: '', type: 'บ้านเดี่ยว' }],
    });
  };

  const handleRemoveProperty = (index: number) => {
    setFormData({
      ...formData,
      properties: formData.properties.filter((_, i) => i !== index),
    });
  };

  const handleSaveCustomer = () => {
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      properties: formData.properties.map((p, i) => ({
        ...p,
        id: `${Date.now()}-${i}`,
      })),
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (editingCustomer) {
      setCustomers(customers.map((c) => (c.id === editingCustomer.id ? { ...newCustomer, id: editingCustomer.id } : c)));
    } else {
      setCustomers([...customers, newCustomer]);
      onCustomerAdded?.(newCustomer);
    }

    setShowForm(false);
    setEditingCustomer(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      properties: [{ name: '', address: '', size: '', type: 'บ้านเดี่ยว' }],
    });
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      properties: customer.properties.map((p) => ({
        name: p.name,
        address: p.address,
        size: p.size,
        type: p.type,
      })),
    });
    setShowForm(true);
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบลูกค้ารายนี้?')) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (showForm) {
    return (
      <div className="space-y-4 md:space-y-6 pb-20 md:pb-8 animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-emerald-600/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider font-semibold text-emerald-100 mb-2">
                แอดมิน
              </p>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {editingCustomer ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่'}
              </h1>
              <p className="text-emerald-50 text-sm md:text-base">
                กรอกข้อมูลลูกค้าและที่อยู่บ้าน
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <User size={32} className="text-white" />
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-100">
          <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">ข้อมูลลูกค้า</h2>
          <p className="text-sm text-gray-500 mb-6">กรอกข้อมูลส่วนตัวของลูกค้า</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-emerald-600" />
                  <span>ชื่อ-นามสกุล</span>
                </div>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="เช่น คุณสมชาย ใจดี"
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-emerald-600" />
                  <span>เบอร์โทร</span>
                </div>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="081-234-5678"
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-emerald-600" />
                  <span>อีเมล</span>
                </div>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="somchai@email.com"
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-600" />
                  <span>ที่อยู่</span>
                </div>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 ถ.สุขุมวิท แขวงคลองเตย กรุงเทพฯ"
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base transition"
              />
            </div>
          </div>
        </div>

        {/* Properties */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Home size={20} className="text-emerald-600" />
              <h2 className="text-lg md:text-2xl font-bold text-gray-900">บ้าน/สถานที่</h2>
            </div>
            <button
              onClick={handleAddProperty}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-sm font-medium transition flex items-center gap-1"
            >
              <Plus size={14} />
              เพิ่ม
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">เพิ่มบ้านหรือสถานที่ของลูกค้า</p>

          <div className="space-y-4">
            {formData.properties.map((property, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-700">บ้าน #{index + 1}</h3>
                  {formData.properties.length > 1 && (
                    <button
                      onClick={() => handleRemoveProperty(index)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded transition"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      ชื่อบ้าน
                    </label>
                    <input
                      type="text"
                      value={property.name}
                      onChange={(e) => {
                        const newProperties = [...formData.properties];
                        newProperties[index].name = e.target.value;
                        setFormData({ ...formData, properties: newProperties });
                      }}
                      placeholder="เช่น บ้านกรุงเทพ"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      ประเภท
                    </label>
                    <select
                      value={property.type}
                      onChange={(e) => {
                        const newProperties = [...formData.properties];
                        newProperties[index].type = e.target.value;
                        setFormData({ ...formData, properties: newProperties });
                      }}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    >
                      <option value="บ้านเดี่ยว">บ้านเดี่ยว</option>
                      <option value="ทาวน์เฮ้าส์">ทาวน์เฮ้าส์</option>
                      <option value="คอนโด">คอนโด</option>
                      <option value="บ้านพักตากอากาศ">บ้านพักตากอากาศ</option>
                      <option value="รีสอร์ท">รีสอร์ท</option>
                      <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      ที่อยู่
                    </label>
                    <input
                      type="text"
                      value={property.address}
                      onChange={(e) => {
                        const newProperties = [...formData.properties];
                        newProperties[index].address = e.target.value;
                        setFormData({ ...formData, properties: newProperties });
                      }}
                      placeholder="123 ถ.สุขุมวิท กรุงเทพฯ"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      ขนาดพื้นที่
                    </label>
                    <input
                      type="text"
                      value={property.size}
                      onChange={(e) => {
                        const newProperties = [...formData.properties];
                        newProperties[index].size = e.target.value;
                        setFormData({ ...formData, properties: newProperties });
                      }}
                      placeholder="200 ตร.ม."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingCustomer(null);
                setFormData({
                  name: '',
                  phone: '',
                  email: '',
                  address: '',
                  properties: [{ name: '', address: '', size: '', type: 'บ้านเดี่ยว' }],
                });
              }}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition text-sm md:text-base"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSaveCustomer}
              disabled={!formData.name || !formData.phone}
              className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition text-sm md:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {editingCustomer ? 'บันทึกการแก้ไข' : 'บันทึกลูกค้า'}
            </button>
          </div>

          {(!formData.name || !formData.phone) && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                กรุณากรอกชื่อและเบอร์โทรศัพท์
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-emerald-600/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider font-semibold text-emerald-100 mb-2">
              แอดมิน
            </p>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">จัดการลูกค้า</h1>
            <p className="text-emerald-50 text-sm md:text-base">
              ลูกค้าทั้งหมด {customers.length} ราย
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Users size={32} className="text-white" />
          </div>
        </div>

        {/* Add Customer Button */}
        <button
          onClick={() => setShowForm(true)}
          className="w-full mt-4 px-4 py-3 bg-white hover:bg-emerald-50 text-emerald-600 rounded-xl font-semibold transition text-sm md:text-base flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          เพิ่มลูกค้าใหม่
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อ, เบอร์โทร, หรืออีเมล..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base transition"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base transition"
            >
              <option value="all">ทั้งหมด</option>
              <option value="active">ใช้งานอยู่</option>
              <option value="inactive">ไม่ได้ใช้งาน</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.id}
            className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-100 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <User size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{customer.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                        customer.status === 'active'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {customer.status === 'active' ? 'ใช้งานอยู่' : 'ไม่ได้ใช้งาน'}
                    </span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">
                      {customer.properties.length} บ้าน
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCustomer(customer)}
                  className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition"
                  title="แก้ไข"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteCustomer(customer.id)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"
                  title="ลบ"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} className="text-emerald-600" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} className="text-emerald-600" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 md:col-span-2">
                <MapPin size={16} className="text-emerald-600" />
                <span>{customer.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} className="text-emerald-600" />
                <span>เข้าร่วม: {new Date(customer.createdAt).toLocaleDateString('th-TH')}</span>
              </div>
            </div>

            {/* Properties */}
            {customer.properties.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Building2 size={16} className="text-emerald-600" />
                  บ้าน/สถานที่
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {customer.properties.map((property) => (
                    <div
                      key={property.id}
                      className="p-3 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{property.name}</p>
                          <p className="text-xs text-gray-500">{property.type}</p>
                        </div>
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold">
                          {property.size}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 flex items-start gap-1">
                        <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                        <span>{property.address}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="bg-white rounded-2xl md:rounded-3xl p-12 border border-gray-100 text-center">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">ไม่พบลูกค้า</h3>
            <p className="text-gray-500">ลองค้นหาด้วยคำอื่นหรือเพิ่มลูกค้าใหม่</p>
          </div>
        )}
      </div>
    </div>
  );
};
