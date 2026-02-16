import React, { useState } from 'react';
import {
  FileText,
  Leaf,
  Droplets,
  Calendar,
  User,
  Home,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  TrendingUp,
} from 'lucide-react';
import { AdminReportForm } from './AdminReportForm';

interface AdminReportsProps {
  customers?: any[];
  properties?: any[];
}

export const AdminReports: React.FC<AdminReportsProps> = ({
  customers = [
    { id: '1', name: 'คุณสมชาย ใจดี', phone: '081-234-5678' },
    { id: '2', name: 'คุณสมหญิง รักสวน', phone: '082-345-6789' },
    { id: '3', name: 'คุณธนา เกษตรกร', phone: '083-456-7890' },
  ],
  properties = [
    { id: '1', customerId: '1', name: 'บ้านกรุงเทพ', address: '123 ถ.สุขุมวิท' },
    { id: '2', customerId: '1', name: 'บ้านชะอำ', address: '45 ต.ชะอำ' },
    { id: '3', customerId: '2', name: 'บ้านพักตากอากาศ', address: '78 เกาะช้าง' },
    { id: '4', customerId: '3', name: 'บ้านเชียงใหม่', address: '90 ถ.นิมมาน' },
  ],
}) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [reports, setReports] = useState([
    {
      id: '1',
      type: 'maintenance',
      customerId: '1',
      customerName: 'คุณสมชาย ใจดี',
      propertyId: '1',
      propertyName: 'บ้านกรุงเทพ',
      date: '2024-02-05',
      createdAt: '2024-02-05T10:30:00',
      status: 'sent',
    },
    {
      id: '2',
      type: 'health',
      customerId: '2',
      customerName: 'คุณสมหญิง รักสวน',
      propertyId: '3',
      propertyName: 'บ้านพักตากอากาศ',
      date: '2024-02-04',
      createdAt: '2024-02-04T14:20:00',
      status: 'sent',
    },
    {
      id: '3',
      type: 'water',
      customerId: '1',
      customerName: 'คุณสมชาย ใจดี',
      propertyId: '2',
      propertyName: 'บ้านชะอำ',
      date: '2024-02-03',
      createdAt: '2024-02-03T09:15:00',
      status: 'draft',
    },
  ]);

  const handleSaveReport = (report: any) => {
    const customer = customers.find((c) => c.id === report.customerId);
    const property = properties.find((p) => p.id === report.propertyId);

    const newReport = {
      id: Date.now().toString(),
      ...report,
      customerName: customer?.name || '',
      propertyName: property?.name || '',
      status: 'sent',
    };

    setReports([newReport, ...reports]);
    setShowForm(false);
  };

  const handleDeleteReport = (id: string) => {
    if (confirm('คุณต้องการลบรายงานนี้ใช่หรือไม่?')) {
      setReports(reports.filter((r) => r.id !== id));
    }
  };

  const getReportTypeInfo = (type: string) => {
    switch (type) {
      case 'maintenance':
        return { label: 'รายงานการดูแล', icon: FileText, color: 'emerald' };
      case 'health':
        return { label: 'รายงานสุขภาพพืช', icon: Leaf, color: 'green' };
      case 'water':
        return { label: 'รายงานการใช้น้ำ', icon: Droplets, color: 'blue' };
      default:
        return { label: 'รายงาน', icon: FileText, color: 'gray' };
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      label: 'รายงานทั้งหมด',
      value: reports.length,
      icon: FileText,
      color: 'emerald',
    },
    {
      label: 'รายงานการดูแล',
      value: reports.filter((r) => r.type === 'maintenance').length,
      icon: FileText,
      color: 'emerald',
    },
    {
      label: 'รายงานสุขภาพพืช',
      value: reports.filter((r) => r.type === 'health').length,
      icon: Leaf,
      color: 'green',
    },
    {
      label: 'รายงานการใช้น้ำ',
      value: reports.filter((r) => r.type === 'water').length,
      icon: Droplets,
      color: 'blue',
    },
  ];

  if (showForm) {
    return (
      <AdminReportForm
        onSave={handleSaveReport}
        onCancel={() => setShowForm(false)}
        customers={customers}
        properties={properties}
      />
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl md:rounded-2xl p-4 md:p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">จัดการรายงาน</h1>
            <p className="text-emerald-100 text-sm md:text-base">สร้างและจัดการรายงานสำหรับลูกค้า</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 md:px-5 md:py-3 bg-white hover:bg-emerald-50 text-emerald-600 rounded-xl font-semibold transition text-sm md:text-base flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden md:inline">สร้างรายงาน</span>
            <span className="md:hidden">สร้าง</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}>
                  <Icon size={16} className={`text-${stat.color}-600 md:w-5 md:h-5`} />
                </div>
              </div>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm text-gray-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ค้นหาตามชื่อลูกค้าหรือบ้าน..."
              className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
            />
          </div>

          <div className="relative">
            <Filter size={18} className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base appearance-none bg-white"
            >
              <option value="all">ทุกประเภท</option>
              <option value="maintenance">รายงานการดูแล</option>
              <option value="health">รายงานสุขภาพพืช</option>
              <option value="water">รายงานการใช้น้ำ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl md:rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <h2 className="text-base md:text-lg font-bold text-gray-900">
            รายงานทั้งหมด ({filteredReports.length})
          </h2>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-8 md:p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-sm md:text-base">ไม่พบรายงาน</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredReports.map((report) => {
              const typeInfo = getReportTypeInfo(report.type);
              const Icon = typeInfo.icon;

              return (
                <div
                  key={report.id}
                  className="p-4 md:p-6 hover:bg-gray-50 transition"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-${typeInfo.color}-50 flex items-center justify-center flex-shrink-0`}>
                      <Icon size={20} className={`text-${typeInfo.color}-600`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                            {typeInfo.label}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User size={12} />
                              <span className="truncate">{report.customerName}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Home size={12} />
                              <span className="truncate">{report.propertyName}</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>{new Date(report.date).toLocaleDateString('th-TH')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-1 rounded-lg text-xs font-medium flex-shrink-0 ${
                            report.status === 'sent'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {report.status === 'sent' ? 'ส่งแล้ว' : 'แบบร่าง'}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <button className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-xs md:text-sm font-medium transition flex items-center gap-1">
                          <Eye size={14} />
                          ดู
                        </button>
                        <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs md:text-sm font-medium transition flex items-center gap-1">
                          <Edit size={14} />
                          แก้ไข
                        </button>
                        <button className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg text-xs md:text-sm font-medium transition flex items-center gap-1">
                          <Download size={14} />
                          ดาวน์โหลด
                        </button>
                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs md:text-sm font-medium transition flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          ลบ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
