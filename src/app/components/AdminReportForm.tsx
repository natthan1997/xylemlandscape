import React, { useState } from 'react';
import {
  FileText,
  Leaf,
  Droplets,
  Calendar,
  User,
  Home,
  Plus,
  X,
  Save,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Camera,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';

interface AdminReportFormProps {
  onSave?: (report: any) => void;
  onCancel?: () => void;
  customers?: any[];
  properties?: any[];
}

export const AdminReportForm: React.FC<AdminReportFormProps> = ({
  onSave,
  onCancel,
  customers = [],
  properties = [],
}) => {
  const [reportType, setReportType] = useState<'maintenance' | 'health' | 'water'>('maintenance');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  
  // Form data for Maintenance Report
  const [maintenanceData, setMaintenanceData] = useState({
    date: new Date().toISOString().split('T')[0],
    serviceType: 'ดูแลสวน',
    activitiesPerformed: ['ตัดแต่งกิ่งไม้', 'กำจัดวัชพืช'],
    materialsUsed: [{ name: 'ปุ๋ยอินทรีย์', quantity: '2 kg' }],
    observations: '',
    recommendations: '',
    nextVisit: '',
    photosBefore: [] as string[],
    photosAfter: [] as string[],
  });

  // Form data for Plant Health Report
  const [healthData, setHealthData] = useState({
    date: new Date().toISOString().split('T')[0],
    overallScore: 85,
    plants: [
      {
        name: 'ต้นปาล์ม',
        status: 'excellent',
        issues: '',
        treatment: '',
      },
    ],
    environmentalFactors: {
      sunlight: 'adequate',
      watering: 'adequate',
      soilQuality: 'good',
    },
    recommendations: '',
  });

  // Form data for Water Usage Report
  const [waterData, setWaterData] = useState({
    date: new Date().toISOString().split('T')[0],
    period: 'monthly',
    totalUsage: 0,
    areas: [
      {
        name: 'สนามหญ้าหน้าบ้าน',
        usage: 0,
        frequency: '',
      },
    ],
    efficiency: 0,
    recommendations: '',
  });

  const handleAddActivity = () => {
    setMaintenanceData({
      ...maintenanceData,
      activitiesPerformed: [...maintenanceData.activitiesPerformed, ''],
    });
  };

  const handleRemoveActivity = (index: number) => {
    setMaintenanceData({
      ...maintenanceData,
      activitiesPerformed: maintenanceData.activitiesPerformed.filter((_, i) => i !== index),
    });
  };

  const handleAddMaterial = () => {
    setMaintenanceData({
      ...maintenanceData,
      materialsUsed: [...maintenanceData.materialsUsed, { name: '', quantity: '' }],
    });
  };

  const handleRemoveMaterial = (index: number) => {
    setMaintenanceData({
      ...maintenanceData,
      materialsUsed: maintenanceData.materialsUsed.filter((_, i) => i !== index),
    });
  };

  const handleAddPlant = () => {
    setHealthData({
      ...healthData,
      plants: [...healthData.plants, { name: '', status: 'good', issues: '', treatment: '' }],
    });
  };

  const handleRemovePlant = (index: number) => {
    setHealthData({
      ...healthData,
      plants: healthData.plants.filter((_, i) => i !== index),
    });
  };

  const handleAddArea = () => {
    setWaterData({
      ...waterData,
      areas: [...waterData.areas, { name: '', usage: 0, frequency: '' }],
    });
  };

  const handleRemoveArea = (index: number) => {
    setWaterData({
      ...waterData,
      areas: waterData.areas.filter((_, i) => i !== index),
    });
  };

  const handleSave = () => {
    const report = {
      type: reportType,
      customerId: selectedCustomer,
      propertyId: selectedProperty,
      createdAt: new Date().toISOString(),
      data: reportType === 'maintenance' 
        ? maintenanceData 
        : reportType === 'health' 
        ? healthData 
        : waterData,
    };
    onSave?.(report);
  };

  const reportTypeOptions = [
    { value: 'maintenance', label: 'รายงานการดูแล', icon: FileText, color: 'emerald' },
    { value: 'health', label: 'รายงานสุขภาพพืช', icon: Leaf, color: 'green' },
    { value: 'water', label: 'รายงานการใช้น้ำ', icon: Droplets, color: 'blue' },
  ];

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-8 animate-fade-in max-w-full overflow-hidden">
      {/* Header - Gradient Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-emerald-600/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider font-semibold text-emerald-100 mb-2">
              แอดมิน
            </p>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">สร้างรายงานใหม่</h1>
            <p className="text-emerald-50 text-sm md:text-base">
              กรอกข้อมูลรายงานเพื่อส่งให้ลูกค้า
            </p>
          </div>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <FileText size={32} className="text-white" />
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-100">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">ประเภทรายงาน</h2>
        <p className="text-sm text-gray-500 mb-6">เลือกประเภทรายงานที่ต้องการสร้าง</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reportTypeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setReportType(option.value as any)}
                className={`relative p-6 rounded-2xl border-2 transition-all group text-left hover:shadow-lg ${
                  reportType === option.value
                    ? 'border-emerald-600 bg-emerald-50 shadow-lg'
                    : 'border-gray-100 hover:border-emerald-200'
                }`}
              >
                {reportType === option.value && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                    <Activity size={14} className="text-white" />
                  </div>
                )}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition ${
                  reportType === option.value 
                    ? 'bg-emerald-100' 
                    : 'bg-gray-50 group-hover:bg-emerald-50'
                }`}>
                  <Icon
                    size={28}
                    className={`${
                      reportType === option.value ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-600'
                    }`}
                  />
                </div>
                <p
                  className={`text-base font-bold mb-1 ${
                    reportType === option.value ? 'text-emerald-600' : 'text-gray-900'
                  }`}
                >
                  {option.label}
                </p>
                <p className="text-xs text-gray-500">
                  {option.value === 'maintenance' && 'บันทึกการดูแลสวนและกิจกรรม'}
                  {option.value === 'health' && 'ประเมินสุขภาพพืชและสิ่งแวดล้อม'}
                  {option.value === 'water' && 'รายงานการใช้น้ำและประสิทธิภาพ'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Customer & Property Selection */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-100">
        <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">ลูกค้าและสถานที่</h2>
        <p className="text-sm text-gray-500 mb-6">เลือกลูกค้าและบ้านที่ต้องการสร้างรายงาน</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <div className="flex items-center gap-2">
                <User size={16} className="text-emerald-600" />
                <span>ลูกค้า</span>
              </div>
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base transition"
            >
              <option value="">เลือกลูกค้า</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <div className="flex items-center gap-2">
                <Home size={16} className="text-emerald-600" />
                <span>บ้าน/สถานที่</span>
              </div>
            </label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm md:text-base transition disabled:bg-gray-50 disabled:text-gray-400"
              disabled={!selectedCustomer}
            >
              <option value="">เลือกบ้าน</option>
              {properties
                .filter((p) => p.customerId === selectedCustomer)
                .map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Maintenance Report Form */}
      {reportType === 'maintenance' && (
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">ข้อมูลพื้นฐาน</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  วันที่ให้บริการ
                </label>
                <input
                  type="date"
                  value={maintenanceData.date}
                  onChange={(e) => setMaintenanceData({ ...maintenanceData, date: e.target.value })}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  ประเภทบริการ
                </label>
                <select
                  value={maintenanceData.serviceType}
                  onChange={(e) => setMaintenanceData({ ...maintenanceData, serviceType: e.target.value })}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
                >
                  <option value="ออกแบบสวน">ออกแบบสวน</option>
                  <option value="จัดสวน">จัดสวน</option>
                  <option value="ดูแลสวน">ดูแลสวน</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  นัดหมายครั้งถัดไป
                </label>
                <input
                  type="date"
                  value={maintenanceData.nextVisit}
                  onChange={(e) => setMaintenanceData({ ...maintenanceData, nextVisit: e.target.value })}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
            </div>
          </div>

          {/* Activities Performed */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900">กิจกรรมที่ดำเนินการ</h2>
              <button
                onClick={handleAddActivity}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-sm font-medium transition flex items-center gap-1"
              >
                <Plus size={14} />
                เพิ่ม
              </button>
            </div>
            <div className="space-y-2">
              {maintenanceData.activitiesPerformed.map((activity, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={activity}
                    onChange={(e) => {
                      const newActivities = [...maintenanceData.activitiesPerformed];
                      newActivities[index] = e.target.value;
                      setMaintenanceData({ ...maintenanceData, activitiesPerformed: newActivities });
                    }}
                    placeholder="เช่น ตัดแต่งกิ่งไม้, ใส่ปุ๋ย"
                    className="flex-1 px-3 py-2 md:px-4 md:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
                  />
                  <button
                    onClick={() => handleRemoveActivity(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Materials Used */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900">วัสดุที่ใช้</h2>
              <button
                onClick={handleAddMaterial}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-sm font-medium transition flex items-center gap-1"
              >
                <Plus size={14} />
                เพิ่ม
              </button>
            </div>
            <div className="space-y-2">
              {maintenanceData.materialsUsed.map((material, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={material.name}
                    onChange={(e) => {
                      const newMaterials = [...maintenanceData.materialsUsed];
                      newMaterials[index].name = e.target.value;
                      setMaintenanceData({ ...maintenanceData, materialsUsed: newMaterials });
                    }}
                    placeholder="ชื่อวัสดุ"
                    className="flex-1 px-3 py-2 md:px-4 md:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
                  />
                  <input
                    type="text"
                    value={material.quantity}
                    onChange={(e) => {
                      const newMaterials = [...maintenanceData.materialsUsed];
                      newMaterials[index].quantity = e.target.value;
                      setMaintenanceData({ ...maintenanceData, materialsUsed: newMaterials });
                    }}
                    placeholder="จำนวน"
                    className="w-24 md:w-32 px-3 py-2 md:px-4 md:py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
                  />
                  <button
                    onClick={() => handleRemoveMaterial(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Observations & Recommendations */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">สังเกตและคำแนะนำ</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  สิ่งที่สังเกตเห็น
                </label>
                <textarea
                  value={maintenanceData.observations}
                  onChange={(e) => setMaintenanceData({ ...maintenanceData, observations: e.target.value })}
                  rows={4}
                  placeholder="บันทึกสภาพสวน สิ่งที่สังเกตเห็น หรือปัญหาที่พบ..."
                  className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base resize-none"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  คำแนะนำ
                </label>
                <textarea
                  value={maintenanceData.recommendations}
                  onChange={(e) => setMaintenanceData({ ...maintenanceData, recommendations: e.target.value })}
                  rows={4}
                  placeholder="คำแนะนำสำหรับการดูแลสวนในอนาคต..."
                  className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base resize-none"
                />
              </div>
            </div>
          </div>

          {/* Photos - Before and After */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Camera size={20} className="text-emerald-600" />
              <h2 className="text-base md:text-lg font-bold text-gray-900">รูปภาพก่อน-หลัง</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">อัปโหลดรูปภาพเพื่อแสดงผลงานของคุณ</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before Photos */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span>รูปก่อนทำงาน</span>
                    <span className="text-xs text-gray-400 font-normal">({maintenanceData.photosBefore.length} รูป)</span>
                  </div>
                </label>

                {/* Upload Button */}
                <label className="block mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach((file) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setMaintenanceData({
                            ...maintenanceData,
                            photosBefore: [...maintenanceData.photosBefore, reader.result as string],
                          });
                        };
                        reader.readAsDataURL(file);
                      });
                    }}
                  />
                  <div className="w-full p-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition cursor-pointer group">
                    <div className="text-center">
                      <Upload size={32} className="mx-auto text-gray-400 group-hover:text-emerald-600 mb-2 transition" />
                      <p className="text-sm font-semibold text-gray-600 group-hover:text-emerald-600 transition">คลิกเพื่ออัปโหลด</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG หรือ GIF</p>
                    </div>
                  </div>
                </label>

                {/* Preview Grid */}
                {maintenanceData.photosBefore.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {maintenanceData.photosBefore.map((photo, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border-2 border-gray-200 aspect-square">
                        <img
                          src={photo}
                          alt={`Before ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            setMaintenanceData({
                              ...maintenanceData,
                              photosBefore: maintenanceData.photosBefore.filter((_, i) => i !== index),
                            });
                          }}
                          className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition">
                          <p className="text-xs text-white font-medium">รูปที่ {index + 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* After Photos */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span>รูปหลังทำงาน</span>
                    <span className="text-xs text-gray-400 font-normal">({maintenanceData.photosAfter.length} รูป)</span>
                  </div>
                </label>

                {/* Upload Button */}
                <label className="block mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      files.forEach((file) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setMaintenanceData({
                            ...maintenanceData,
                            photosAfter: [...maintenanceData.photosAfter, reader.result as string],
                          });
                        };
                        reader.readAsDataURL(file);
                      });
                    }}
                  />
                  <div className="w-full p-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition cursor-pointer group">
                    <div className="text-center">
                      <Upload size={32} className="mx-auto text-gray-400 group-hover:text-emerald-600 mb-2 transition" />
                      <p className="text-sm font-semibold text-gray-600 group-hover:text-emerald-600 transition">คลิกเพื่ออัปโหลด</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG หรือ GIF</p>
                    </div>
                  </div>
                </label>

                {/* Preview Grid */}
                {maintenanceData.photosAfter.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {maintenanceData.photosAfter.map((photo, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border-2 border-emerald-200 aspect-square">
                        <img
                          src={photo}
                          alt={`After ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            setMaintenanceData({
                              ...maintenanceData,
                              photosAfter: maintenanceData.photosAfter.filter((_, i) => i !== index),
                            });
                          }}
                          className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <X size={14} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition">
                          <p className="text-xs text-white font-medium">รูปที่ {index + 1}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plant Health Report Form */}
      {reportType === 'health' && (
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">ข้อมูลพื้นฐาน</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  วันที่ประเมิน
                </label>
                <input
                  type="date"
                  value={healthData.date}
                  onChange={(e) => setHealthData({ ...healthData, date: e.target.value })}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  คะแนนรวม (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={healthData.overallScore}
                  onChange={(e) => setHealthData({ ...healthData, overallScore: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
                />
              </div>
            </div>
          </div>

          {/* Plant List */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900">รายการต้นไม้</h2>
              <button
                onClick={handleAddPlant}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-sm font-medium transition flex items-center gap-1"
              >
                <Plus size={14} />
                เพิ่มต้นไม้
              </button>
            </div>
            <div className="space-y-4">
              {healthData.plants.map((plant, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">ต้นไม้ #{index + 1}</h3>
                    <button
                      onClick={() => handleRemovePlant(index)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded transition"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        ชื่อต้นไม้
                      </label>
                      <input
                        type="text"
                        value={plant.name}
                        onChange={(e) => {
                          const newPlants = [...healthData.plants];
                          newPlants[index].name = e.target.value;
                          setHealthData({ ...healthData, plants: newPlants });
                        }}
                        placeholder="เช่น ต้นปาล์ม, ต้นบอนสี"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        สถานะ
                      </label>
                      <select
                        value={plant.status}
                        onChange={(e) => {
                          const newPlants = [...healthData.plants];
                          newPlants[index].status = e.target.value;
                          setHealthData({ ...healthData, plants: newPlants });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      >
                        <option value="excellent">ดีเยี่ยม</option>
                        <option value="good">ดี</option>
                        <option value="fair">พอใช้</option>
                        <option value="poor">ต้องปรับปรุง</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        ปัญหาที่พบ
                      </label>
                      <input
                        type="text"
                        value={plant.issues}
                        onChange={(e) => {
                          const newPlants = [...healthData.plants];
                          newPlants[index].issues = e.target.value;
                          setHealthData({ ...healthData, plants: newPlants });
                        }}
                        placeholder="เช่น ใบเหลือง, แมลงศัตรูพืช"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        วิธีแก้ไข/การดูแล
                      </label>
                      <input
                        type="text"
                        value={plant.treatment}
                        onChange={(e) => {
                          const newPlants = [...healthData.plants];
                          newPlants[index].treatment = e.target.value;
                          setHealthData({ ...healthData, plants: newPlants });
                        }}
                        placeholder="เช่น ฉีดพ่นยากำจัดแมลง, ใส่ปุ๋ยเสริม"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Factors */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">ปัจจัยสิ่งแวดล้อม</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  แสงแดด
                </label>
                <select
                  value={healthData.environmentalFactors.sunlight}
                  onChange={(e) => setHealthData({
                    ...healthData,
                    environmentalFactors: { ...healthData.environmentalFactors, sunlight: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
                >
                  <option value="insufficient">ไม่เพียงพอ</option>
                  <option value="adequate">เพียงพอ</option>
                  <option value="excessive">มากเกินไป</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  การรดน้ำ
                </label>
                <select
                  value={healthData.environmentalFactors.watering}
                  onChange={(e) => setHealthData({
                    ...healthData,
                    environmentalFactors: { ...healthData.environmentalFactors, watering: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
                >
                  <option value="insufficient">น้อยเกินไป</option>
                  <option value="adequate">เหมาะสม</option>
                  <option value="excessive">มากเกินไป</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  คุณภาพดิน
                </label>
                <select
                  value={healthData.environmentalFactors.soilQuality}
                  onChange={(e) => setHealthData({
                    ...healthData,
                    environmentalFactors: { ...healthData.environmentalFactors, soilQuality: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
                >
                  <option value="poor">แย่</option>
                  <option value="fair">พอใช้</option>
                  <option value="good">ดี</option>
                  <option value="excellent">ดีเยี่ยม</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">คำแนะนำ</h2>
            <textarea
              value={healthData.recommendations}
              onChange={(e) => setHealthData({ ...healthData, recommendations: e.target.value })}
              rows={4}
              placeholder="คำแนะนำสำหรับการดูแลสุขภาพพืชในอนาคต..."
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base resize-none"
            />
          </div>
        </div>
      )}

      {/* Water Usage Report Form */}
      {reportType === 'water' && (
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">ข้อมูลพื้นฐาน</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  วันที่
                </label>
                <input
                  type="date"
                  value={waterData.date}
                  onChange={(e) => setWaterData({ ...waterData, date: e.target.value })}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  ช่วงเวลา
                </label>
                <select
                  value={waterData.period}
                  onChange={(e) => setWaterData({ ...waterData, period: e.target.value })}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
                >
                  <option value="daily">รายวัน</option>
                  <option value="weekly">รายสัปดาห์</option>
                  <option value="monthly">รายเดือน</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  ประสิทธิภาพ (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={waterData.efficiency}
                  onChange={(e) => setWaterData({ ...waterData, efficiency: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm md:text-base"
                />
              </div>
            </div>
          </div>

          {/* Water Usage by Area */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900">การใช้น้ำแยกตามพื้นที่</h2>
              <button
                onClick={handleAddArea}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-sm font-medium transition flex items-center gap-1"
              >
                <Plus size={14} />
                เพิ่มพื้นที่
              </button>
            </div>
            <div className="space-y-3">
              {waterData.areas.map((area, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">พื้นที่ #{index + 1}</span>
                    <button
                      onClick={() => handleRemoveArea(index)}
                      className="text-red-500 hover:bg-red-50 p-1 rounded transition"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={area.name}
                      onChange={(e) => {
                        const newAreas = [...waterData.areas];
                        newAreas[index].name = e.target.value;
                        setWaterData({ ...waterData, areas: newAreas });
                      }}
                      placeholder="ชื่อพื้นที่"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                    <input
                      type="number"
                      value={area.usage}
                      onChange={(e) => {
                        const newAreas = [...waterData.areas];
                        newAreas[index].usage = parseInt(e.target.value) || 0;
                        setWaterData({ ...waterData, areas: newAreas });
                      }}
                      placeholder="ปริมาณ (ลิตร)"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                    <input
                      type="text"
                      value={area.frequency}
                      onChange={(e) => {
                        const newAreas = [...waterData.areas];
                        newAreas[index].frequency = e.target.value;
                        setWaterData({ ...waterData, areas: newAreas });
                      }}
                      placeholder="ความถี่"
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">คำแนะนำ</h2>
            <textarea
              value={waterData.recommendations}
              onChange={(e) => setWaterData({ ...waterData, recommendations: e.target.value })}
              rows={4}
              placeholder="คำแนะนำสำหรับการใช้น้ำอย่างมีประสิทธิภาพ..."
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base resize-none"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-100">
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold transition text-sm md:text-base"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            disabled={!selectedCustomer || !selectedProperty}
            className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition text-sm md:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            บันทึกรายงาน
          </button>
        </div>

        {(!selectedCustomer || !selectedProperty) && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              กรุณาเลือกลูกค้าและบ้านก่อนบันทึกรายงาน
            </p>
          </div>
        )}
      </div>
    </div>
  );
};