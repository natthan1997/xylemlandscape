import { useState } from 'react';
import { 
  Check, 
  ChevronRight, 
  Calendar,
  ArrowLeft,
  Sprout,
  PenTool,
  LeafyGreen,
  Sparkles
} from 'lucide-react';

// Service Types
const SERVICE_TYPES = [
  {
    id: 'design',
    name: 'ออกแบบสวน',
    subtitle: 'ออกแบบแปลนสวนใหม่',
    description: 'วางแผนและออกแบบสวนตามความต้องการของคุณ',
    icon: PenTool,
    color: 'emerald'
  },
  {
    id: 'landscape',
    name: 'จัดสวน',
    subtitle: 'สร้างสวนใหม่ตามแบบ',
    description: 'ปรับปรุงและจัดสวนให้สวยงามพร้อมใช้งาน',
    icon: Sprout,
    color: 'emerald'
  },
  {
    id: 'maintenance',
    name: 'ดูแลสวน',
    subtitle: 'บริการดูแลสวนประจำ',
    description: 'ดูแลรักษาสวนให้สวยงามสดชื่นตลอดเวลา',
    icon: LeafyGreen,
    color: 'emerald',
    popular: true
  }
];

// Design Packages
const DESIGN_PACKAGES = [
  {
    id: 'consult',
    name: 'ปรึกษา',
    subtitle: 'คำแนะนำจากผู้เชี่ยวชาญ',
    price: 2000,
    features: [
      'ปรึกษาหน้างาน 1 ครั้ง',
      'แนะนำพืชที่เหมาะสม',
      'คำแนะนำการจัดวาง',
      'ประมาณการค่าใช้จ่าย'
    ]
  },
  {
    id: '2d',
    name: 'แบบ 2D',
    subtitle: 'แปลนออกแบบสวนแบบ 2 มิติ',
    price: 5000,
    popular: true,
    features: [
      'แปลนออกแบบ 2D',
      'รายการต้นไม้และอุปกรณ์',
      'ประมาณการค่าใช้จ่าย',
      'ปรับแก้ไข 2 ครั้ง',
      'ปรึกษาหน้างาน 1 ครั้ง'
    ]
  },
  {
    id: '3d',
    name: 'แบบ 3D',
    subtitle: 'แปลนออกแบบสวนแบบ 3 มิติ',
    price: 12000,
    features: [
      'แปลนออกแบบ 3D',
      'Perspective ภาพสวน',
      'รายการต้นไม้และอุปกรณ์',
      'ประมาณการค่าใช้จ่าย',
      'ปรับแก้ไข 3 ครั้ง',
      'ปรึกษาหน้างาน 2 ครั้ง'
    ]
  }
];

// Landscape Packages (by size)
const LANDSCAPE_PACKAGES = [
  {
    id: 'small',
    name: 'สวนขนาดเล็ก',
    area: 'น้อยกว่า 50 ตร.ม.',
    priceFrom: 25000,
    example: 'สวนหน้าบ้าน มุมสวนเล็ก'
  },
  {
    id: 'medium',
    name: 'สวนขนาดกลาง',
    area: '50-100 ตร.ม.',
    priceFrom: 60000,
    example: 'สวนบ้านเดี่ยว ทาวน์เฮ้าส์',
    popular: true
  },
  {
    id: 'large',
    name: 'สวนขนาดใหญ่',
    area: '100-200 ตร.ม.',
    priceFrom: 150000,
    example: 'สวนบ้านเดี่ยวขนาดใหญ่'
  },
  {
    id: 'custom',
    name: 'สวนขนาดพิเศษ',
    area: 'มากกว่า 200 ตร.ม.',
    priceFrom: 300000,
    example: 'โรงแรม รีสอร์ท คาเฟ่'
  }
];

// Maintenance Packages
const MAINTENANCE_PACKAGES = [
  {
    id: 'basic',
    name: 'เบสิค',
    subtitle: 'สวนเล็ก บ้านทาวน์เฮ้าส์',
    area: 'น้อยกว่า 50 ตร.ม.',
    areaRange: [0, 50],
    frequency: 'เดือนละ 2 ครั้ง',
    price: 1600,
    example: 'สวนหน้าบ้าน ทาวน์โฮม'
  },
  {
    id: 'standard',
    name: 'สแตนดาร์ด',
    subtitle: 'สวนกลาง บ้านเดี่ยว',
    area: '50-100 ตร.ม.',
    areaRange: [50, 100],
    frequency: 'สัปดาห์ละ 1 ครั้ง',
    price: 5600,
    example: 'สวนบ้านเดี่ยวทั่วไป'
  },
  {
    id: 'premium',
    name: 'พรีเมียม',
    subtitle: 'สวนใหญ่ บ้านหรู',
    area: '100-200 ตร.ม.',
    areaRange: [100, 200],
    frequency: 'สัปดาห์ละ 2 ครั้ง',
    price: 17600,
    example: 'สวนบ้านเดี่ยวขนาดใหญ่'
  }
];

// Services included in maintenance
const MAINTENANCE_SERVICES = [
  'ตัดแต่งหญ้า',
  'รดน้ำต้นไม้', 
  'กำจัดวัชพืช',
  'เก็บใบไม้',
  'ตัดแต่งพุ่มไม้',
  'ใส่ปุ๋ย',
  'เช็คโรคพืช',
  'รายงานสุขภาพ'
];

interface ServiceSelectionProps {
  onComplete: (selectedServices: any) => void;
  onBack?: () => void;
  gardenInfo?: {
    area?: number;
    [key: string]: any;
  };
}

export const ServiceSelection = ({ onComplete, onBack, gardenInfo }: ServiceSelectionProps) => {
  const [step, setStep] = useState<'type' | 'detail'>('type');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [startDate, setStartDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [notes, setNotes] = useState('');

  // Function to get recommended package based on garden area
  const getRecommendedPackage = () => {
    if (!gardenInfo?.area) return null;
    
    const area = gardenInfo.area;
    for (const pkg of MAINTENANCE_PACKAGES) {
      if (area >= pkg.areaRange[0] && area < pkg.areaRange[1]) {
        return pkg.id;
      }
    }
    // If area is >= 200, recommend premium
    if (area >= 200) {
      return 'premium';
    }
    return null;
  };

  const recommendedPackage = getRecommendedPackage();

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setSelectedPackage(null);
    setStep('detail');
  };

  const handleBackToType = () => {
    setStep('type');
    setSelectedPackage(null);
  };

  const handleSubmit = () => {
    let packageData = null;
    
    if (selectedType === 'design') {
      packageData = DESIGN_PACKAGES.find(p => p.id === selectedPackage);
    } else if (selectedType === 'landscape') {
      packageData = LANDSCAPE_PACKAGES.find(p => p.id === selectedPackage);
    } else if (selectedType === 'maintenance') {
      packageData = MAINTENANCE_PACKAGES.find(p => p.id === selectedPackage);
    }

    onComplete({
      serviceType: selectedType,
      package: packageData,
      startDate,
      preferredTime,
      notes
    });
  };

  const canSubmit = () => {
    if (selectedType === 'design' || selectedType === 'landscape') {
      return selectedPackage && preferredTime;
    }
    return selectedPackage && startDate && preferredTime;
  };

  const selectedServiceType = SERVICE_TYPES.find(s => s.id === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white max-w-full overflow-hidden">
      <div className="max-w-5xl mx-auto px-3 md:px-6 py-6 md:py-10 pb-24 md:pb-32">
        
        {/* Header */}
        <div className="mb-12">
          {(step === 'detail' || onBack) && (
            <button
              onClick={step === 'detail' ? handleBackToType : onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-6 transition"
            >
              <ArrowLeft size={20} />
              <span className="text-sm">ย้อนกลับ</span>
            </button>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {step === 'type' ? 'เลือกบริการ' : selectedServiceType?.name}
          </h1>
          <p className="text-gray-500">
            {step === 'type' 
              ? 'เลือกประเภทบริการที่คุณต้องการ'
              : selectedServiceType?.description
            }
          </p>
        </div>

        {/* Step 1: Service Type Selection */}
        {step === 'type' && (
          <div className="space-y-4">
            {SERVICE_TYPES.map(service => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  onClick={() => handleTypeSelect(service.id)}
                  className="relative bg-white rounded-2xl p-6 cursor-pointer transition hover:shadow-lg border-2 border-gray-100 hover:border-emerald-300 group"
                >
                  <div className="flex items-center gap-6">
                    {/* Icon */}
                    <div className="w-16 h-16 flex-shrink-0 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center group-hover:scale-110 transition">
                      <Icon size={32} className="text-emerald-600" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {service.name}
                        </h3>
                        {service.popular && (
                          <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <Sparkles size={12} />
                            ยอดนิยม
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-emerald-600 font-medium mb-2">
                        {service.subtitle}
                      </p>
                      <p className="text-sm text-gray-500">
                        {service.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight size={32} className="text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Step 2: Package Selection - Design */}
        {step === 'detail' && selectedType === 'design' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
              {DESIGN_PACKAGES.map(pkg => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative bg-white rounded-2xl p-6 cursor-pointer transition border-2 ${
                    selectedPackage === pkg.id
                      ? 'border-emerald-600 shadow-lg'
                      : 'border-gray-100 hover:border-emerald-200'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        แนะนำ
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {pkg.subtitle}
                    </p>
                    <div className="text-3xl font-bold text-emerald-600">
                      ฿{pkg.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm">
                        <Check size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`w-full py-3 rounded-xl font-semibold transition ${
                      selectedPackage === pkg.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedPackage === pkg.id ? 'เลือกแล้ว ✓' : 'เลือกแพ็คเกจนี้'}
                  </button>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            {selectedPackage && (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6">ข้อมูลการติดต่อ</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ช่วงเวลาที่สะดวก
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: '🌅 เช้า', sub: '8-12 น.', value: 'เช้า (08:00-12:00)' },
                        { label: '☀️ บ่าย', sub: '13-17 น.', value: 'บ่าย (13:00-17:00)' },
                        { label: '🌆 เย็น', sub: '17-19 น.', value: 'เย็น (17:00-19:00)' },
                        { label: '✨ ยืดหยุ่น', sub: 'เวลาไหนก็ได้', value: 'ยืดหยุ่นได้' }
                      ].map(time => (
                        <button
                          key={time.value}
                          onClick={() => setPreferredTime(time.value)}
                          className={`p-4 rounded-xl border-2 text-center transition ${
                            preferredTime === time.value
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-gray-100 hover:border-emerald-200'
                          }`}
                        >
                          <div className="font-semibold mb-1">{time.label}</div>
                          <div className={`text-xs ${preferredTime === time.value ? 'text-emerald-600' : 'text-gray-500'}`}>
                            {time.sub}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      รายละเอียดเพิ่มเติม
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="บอกเราเกี่ยวกับสวนที่คุณต้องการ..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Package Selection - Landscape */}
        {step === 'detail' && selectedType === 'landscape' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12">
              {LANDSCAPE_PACKAGES.map(pkg => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`bg-white rounded-2xl p-6 cursor-pointer transition border-2 ${
                    selectedPackage === pkg.id
                      ? 'border-emerald-600 shadow-lg'
                      : 'border-gray-100 hover:border-emerald-200'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-4">
                      <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        ยอดนิยม
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">{pkg.area}</p>
                  <p className="text-xs text-gray-400 mb-4">{pkg.example}</p>
                  
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-sm text-gray-500">เริ่มต้น</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      ฿{(pkg.priceFrom / 1000).toFixed(0)}k
                    </span>
                  </div>

                  <button
                    className={`w-full py-3 rounded-xl font-semibold transition ${
                      selectedPackage === pkg.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {selectedPackage === pkg.id ? 'เลือกแล้ว ✓' : 'เลือกแพ็คเกจนี้'}
                  </button>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            {selectedPackage && (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6">ข้อมูลการติดต่อ</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      ช่วงเวลาที่สะดวก
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: '🌅 เช้า', sub: '8-12 น.', value: 'เช้า (08:00-12:00)' },
                        { label: '☀️ บ่าย', sub: '13-17 น.', value: 'บ่าย (13:00-17:00)' },
                        { label: '🌆 เย็น', sub: '17-19 น.', value: 'เย็น (17:00-19:00)' },
                        { label: '✨ ยืดหยุ่น', sub: 'เวลาไหนก็ได้', value: 'ยืดหยุ่นได้' }
                      ].map(time => (
                        <button
                          key={time.value}
                          onClick={() => setPreferredTime(time.value)}
                          className={`p-4 rounded-xl border-2 text-center transition ${
                            preferredTime === time.value
                              ? 'border-emerald-600 bg-emerald-50'
                              : 'border-gray-100 hover:border-emerald-200'
                          }`}
                        >
                          <div className="font-semibold mb-1">{time.label}</div>
                          <div className={`text-xs ${preferredTime === time.value ? 'text-emerald-600' : 'text-gray-500'}`}>
                            {time.sub}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      รายละเอียดเพิ่มเติม
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="สไตล์สวนที่ต้องการ, งบประมาณ, ฯลฯ"
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Package Selection - Maintenance */}
        {step === 'detail' && selectedType === 'maintenance' && (
          <div>
            {/* Package Comparison Table - MOVED TO TOP */}
            <div className="mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">เลือกแพ็คเกจที่เหมาะกับคุณ</h3>
              <p className="text-sm text-gray-500 mb-6">เลือกแพ็คเกจตามขนาดสวนของคุณ</p>
              
              <div className="grid grid-cols-3 gap-4 md:gap-8">
                {MAINTENANCE_PACKAGES.map(pkg => {
                  const isRecommended = pkg.id === recommendedPackage;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`relative bg-white rounded-3xl p-6 md:p-10 cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? 'ring-4 ring-emerald-500 shadow-2xl scale-105'
                          : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-emerald-300 hover:shadow-xl'
                      }`}
                    >
                      {isRecommended && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                          <span className="bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                            แนะนำ
                          </span>
                        </div>
                      )}

                      {/* Package Name */}
                      <div className="text-center mb-6 md:mb-10">
                        <h3 className="text-lg md:text-3xl font-bold text-gray-900">
                          {pkg.name}
                        </h3>
                      </div>

                      {/* Area - HERO */}
                      <div className="text-center mb-6 md:mb-10">
                        <div className="text-4xl md:text-7xl font-black text-emerald-600 mb-2 md:mb-3 leading-none">
                          {pkg.area.includes('-') ? pkg.area.split(' ')[0] : pkg.area.split(' ')[0]}
                        </div>
                        <div className="text-base md:text-2xl font-bold text-emerald-600/70">
                          {pkg.area.includes('-') ? 'ตร.ม.' : pkg.area.split(' ').slice(1).join(' ')}
                        </div>
                      </div>

                      {/* Frequency */}
                      <div className="text-center mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-100">
                        <div className="text-sm md:text-lg font-semibold text-gray-700">
                          {pkg.frequency}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-center mb-6 md:mb-8">
                        <div className="text-2xl md:text-4xl font-bold text-gray-900">
                          ฿{(pkg.price / 1000).toFixed(1)}k
                        </div>
                        <div className="text-xs md:text-sm text-gray-400 mt-1">
                          ต่อเดือน
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => setSelectedPackage(pkg.id)}
                        className={`w-full py-3 md:py-4 rounded-2xl font-bold text-sm md:text-xl transition-all ${
                          selectedPackage === pkg.id
                            ? 'bg-emerald-600 text-white shadow-lg'
                            : isRecommended
                            ? 'bg-amber-500 text-white hover:bg-amber-600'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        {selectedPackage === pkg.id ? (
                          <span className="flex items-center justify-center gap-2">
                            <Check size={20} />
                            เลือกแล้ว
                          </span>
                        ) : (
                          'เลือก'
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Included Services Info - MOVED TO BOTTOM */}
            <div className="bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-100 rounded-3xl p-6 md:p-8 mb-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg">
                  <Check size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">บริการที่คุณจะได้รับทุกครั้ง</h3>
                  <p className="text-sm md:text-base text-gray-600">ไม่ว่าจะเลือกแพ็คเกจไหน คุณจะได้รับบริการครบวงจรเหมือนกันทุกครั้ง แตกต่างเพียงความถี่ในการดูแล</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MAINTENANCE_SERVICES.map((service, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Check size={16} className="text-emerald-600" />
                    </div>
                    <span className="text-sm md:text-base font-medium text-gray-900">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule Form */}
            {selectedPackage && (
              <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-gray-100 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <Calendar size={24} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">กำหนดการให้บริการ</h3>
                    <p className="text-sm text-gray-500">เลือกวันและเวลาที่สะดวกสำหรับคุณ</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                      ช่วงเวลาที่สะดวก
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: '🌅 เช้า', sub: '8-12 น.', value: 'เช้า (08:00-12:00)' },
                        { label: '☀️ บ่าย', sub: '13-17 น.', value: 'บ่าย (13:00-17:00)' },
                        { label: '🌆 เย็น', sub: '17-19 น.', value: 'เย็น (17:00-19:00)' },
                        { label: '✨ ยืดหยุ่น', sub: 'เวลาไหนก็ได้', value: 'ยืดหยุ่นได้' }
                      ].map(time => (
                        <button
                          key={time.value}
                          onClick={() => setPreferredTime(time.value)}
                          className={`p-4 md:p-5 rounded-2xl border-2 text-center transition transform hover:scale-105 ${
                            preferredTime === time.value
                              ? 'border-emerald-600 bg-emerald-50 shadow-lg'
                              : 'border-gray-200 hover:border-emerald-300 bg-white'
                          }`}
                        >
                          <div className="text-base md:text-lg font-bold mb-1">{time.label}</div>
                          <div className={`text-xs md:text-sm ${preferredTime === time.value ? 'text-emerald-600 font-semibold' : 'text-gray-500'}`}>
                            {time.sub}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                      วันที่เริ่มบริการ
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-6 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Fixed Bottom Bar */}
        {step === 'detail' && selectedPackage && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100 p-4 md:p-6 shadow-lg">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between gap-4">
                <div>
                  {selectedType === 'design' && (
                    <>
                      <p className="text-sm text-gray-500">ค่าบริการ</p>
                      <p className="text-3xl md:text-4xl font-bold text-gray-900">
                        ฿{DESIGN_PACKAGES.find(p => p.id === selectedPackage)?.price.toLocaleString()}
                      </p>
                    </>
                  )}
                  {selectedType === 'landscape' && (
                    <>
                      <p className="text-sm text-gray-500">ราคาเริ่มต้น</p>
                      <p className="text-3xl md:text-4xl font-bold text-gray-900">
                        ฿{LANDSCAPE_PACKAGES.find(p => p.id === selectedPackage)?.priceFrom.toLocaleString()}
                      </p>
                    </>
                  )}
                  {selectedType === 'maintenance' && (
                    <>
                      <p className="text-sm text-gray-500">ยอดชำระรายเดือน</p>
                      <p className="text-3xl md:text-4xl font-bold text-gray-900">
                        ฿{MAINTENANCE_PACKAGES.find(p => p.id === selectedPackage)?.price.toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
                
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit()}
                  className={`px-8 md:px-12 py-4 md:py-5 rounded-xl font-bold text-lg transition flex items-center gap-2 whitespace-nowrap ${
                    canSubmit()
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  ยืนยัน
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};