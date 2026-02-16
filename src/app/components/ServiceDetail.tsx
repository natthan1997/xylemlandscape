import React, { useState } from 'react';
import {
  ArrowLeft,
  TreePine,
  Scissors,
  Sprout,
  Package,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  Calendar,
  MessageCircle,
  Phone,
  ChevronRight,
} from 'lucide-react';

interface ServiceDetailProps {
  service: {
    icon: any;
    label: string;
    color: string;
  };
  onBack: () => void;
  onBookService?: () => void;
}

const SERVICE_DATA: any = {
  'ออกแบบสวน': {
    title: 'ออกแบบสวน',
    icon: TreePine,
    color: 'emerald',
    description: 'บริการออกแบบและวางผังสวนตามความต้องการของคุณ โดยทีมสถาปนิกภูมิทัศน์มืออาชีพ',
    priceRange: '15,000 - 50,000',
    duration: '7-14 วัน',
    rating: 4.9,
    reviews: 256,
    features: [
      'สำรวจพื้นที่ฟรี',
      'ออกแบบ 3D Rendering',
      'คำนวณงบประมาณ',
      'เลือกพันธุ์ไม้เหมาะสม',
      'คำปรึกษาตลอดโครงการ',
      'แก้ไขแบบได้ 2 ครั้ง',
    ],
    process: [
      { step: 1, title: 'สำรวจพื้นที่', desc: 'ทีมงานเข้าสำรวจและวัดพื้นที่จริง', time: '1 วัน' },
      { step: 2, title: 'ออกแบบ', desc: 'สถาปนิกออกแบบตามความต้องการ', time: '3-5 วัน' },
      { step: 3, title: 'นำเสนอแบบ', desc: 'นำเสนอ 3D และรายละเอียด', time: '1 วัน' },
      { step: 4, title: 'ปรับแบบ', desc: 'แก้ไขตามความต้องการ', time: '2-3 วัน' },
      { step: 5, title: 'ส่งมอบแบบ', desc: 'ส่งแบบสมบูรณ์พร้อมเริ่มงาน', time: '1 วัน' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
    ],
    packages: [
      {
        name: 'แพ็กเกจพื้นฐาน',
        price: '15,000',
        area: 'ไม่เกิน 50 ตร.ม.',
        features: ['ออกแบบ 2D', 'แบบ 1 มุมมอง', 'คำนวณงบประมาณ'],
      },
      {
        name: 'แพ็กเกจมาตรฐาน',
        price: '30,000',
        area: '50-100 ตร.ม.',
        features: ['ออกแบบ 3D', 'แบบ 3 มุมมอง', 'คำนวณงบประมาณ', 'เลือกพันธุ์ไม้'],
        popular: true,
      },
      {
        name: 'แพ็กเกจพรีเมียม',
        price: '50,000',
        area: 'มากกว่า 100 ตร.ม.',
        features: ['ออกแบบ 3D', 'แบบไม่จำกัดมุมมอง', 'คำนวณงบประมาณ', 'เลือกพันธุ์ไม้', 'คำปรึกษาตลอดโครงการ', 'แก้ไขแบบไม่จำกัด'],
      },
    ],
  },
  'จัดสวน': {
    title: 'จัดสวน',
    icon: Scissors,
    color: 'emerald',
    description: 'บริการจัดสวนครบวงจร ตั้งแต่เตรียมดิน ปลูกต้นไม้ จัดภูมิทัศน์ ติดตั้งระบบน้ำ',
    priceRange: '20,000 - 100,000',
    duration: '5-30 วัน',
    rating: 4.8,
    reviews: 342,
    features: [
      'เตรียมพื้นที่และดิน',
      'ปลูกต้นไม้ตามแบบ',
      'ติดตั้งระบบน้ำ',
      'จัดวางหิน-ทราย',
      'ติดตั้งไฟสนาม',
      'รับประกัน 6 เดือน',
    ],
    process: [
      { step: 1, title: 'เตรียมพื้นที่', desc: 'ปรับพื้นที่และเตรียมดิน', time: '2-3 วัน' },
      { step: 2, title: 'ติดตั้งระบบ', desc: 'ติดตั้งระบบน้ำและไฟฟ้า', time: '2-3 วัน' },
      { step: 3, title: 'จัดวางภูมิทัศน์', desc: 'วางหิน ทราย ทางเดิน', time: '3-5 วัน' },
      { step: 4, title: 'ปลูกต้นไม้', desc: 'ปลูกต้นไม้ตามแบบ', time: '3-5 วัน' },
      { step: 5, title: 'ตกแต่งเสร็จสิ้น', desc: 'ตกแต่งและทำความสะอาด', time: '1-2 วัน' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800',
      'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
    ],
    packages: [
      {
        name: 'แพ็กเกจพื้นฐาน',
        price: '20,000',
        area: 'ไม่เกิน 30 ตร.ม.',
        features: ['เตรียมดิน', 'ปลูกต้นไม้ 10-15 ต้น', 'ระบบน้ำพื้นฐาน'],
      },
      {
        name: 'แพ็กเกจมาตรฐาน',
        price: '50,000',
        area: '30-80 ตร.ม.',
        features: ['เตรียมดิน', 'ปลูกต้นไม้ 20-30 ต้น', 'ระบบน้ำอัตโนมัติ', 'จัดวางหิน-ทราย'],
        popular: true,
      },
      {
        name: 'แพ็กเกจพรีเมียม',
        price: '100,000',
        area: 'มากกว่า 80 ตร.ม.',
        features: ['เตรียมดินพิเศษ', 'ปลูกต้นไม้ไม่จำกัด', 'ระบบน้ำอัตโนมัติ', 'จัดวางภูมิทัศน์', 'ติดตั้งไฟสนาม', 'รับประกัน 1 ปี'],
      },
    ],
  },
  'ดูแลสวน': {
    title: 'ดูแลสวน',
    icon: Sprout,
    color: 'emerald',
    description: 'บริการดูแลรักษาสวนประจำเดือน ตัดแต่งกิ่งไม้ รดน้ำ ใส่ปุ๋ย กำจัดศัตรูพืช',
    priceRange: '3,000 - 15,000',
    duration: 'ทุกเดือน',
    rating: 4.9,
    reviews: 589,
    features: [
      'ตัดแต่งกิ่งไม้',
      'รดน้ำและดูแล',
      'ใส่ปุ๋ยตามฤดูกาล',
      'กำจัดวัชพืช',
      'ป้องกันโรคพืช',
      'ตรวจสุขภาพต้นไม้',
    ],
    process: [
      { step: 1, title: 'ตรวจสอบ', desc: 'ตรวจสุขภาพต้นไม้และสวน', time: '30 นาที' },
      { step: 2, title: 'ตัดแต่ง', desc: 'ตัดแต่งกิ่งไม้และทรงพุ่ม', time: '1-2 ชม.' },
      { step: 3, title: 'ดูแลดิน', desc: 'ใส่ปุ๋ยและปรับสภาพดิน', time: '30 นาที' },
      { step: 4, title: 'รดน้ำ', desc: 'รดน้ำและตรวจระบบน้ำ', time: '30 นาที' },
      { step: 5, title: 'ทำความสะอาด', desc: 'เก็บใบไม้และทำความสะอาด', time: '30 นาที' },
    ],
    gallery: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
      'https://images.unsplash.com/photo-1599629954294-1c2f272c1f6f?w=800',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
    ],
    packages: [
      {
        name: 'แพ็กเกจรายเดือน',
        price: '3,000',
        area: 'ไม่เกิน 50 ตร.ม.',
        features: ['เดือนละ 1 ครั้ง', 'ตัดแต่งกิ่งไม้', 'รดน้ำ', 'ทำความสะอาด'],
      },
      {
        name: 'แพ็กเกจ 2 สัปดาห์',
        price: '6,000',
        area: '50-100 ตร.ม.',
        features: ['เดือนละ 2 ครั้ง', 'ตัดแต่งกิ่งไม้', 'รดน้ำ', 'ใส่ปุ๋ย', 'กำจัดวัชพืช'],
        popular: true,
      },
      {
        name: 'แพ็กเกจรายสัปดาห์',
        price: '15,000',
        area: 'มากกว่า 100 ตร.ม.',
        features: ['สัปดาห์ละ 1 ครั้ง', 'ดูแลครบวงจร', 'ใส่ปุ๋ยพิเศษ', 'ป้องกันโรคพืช', 'รายงานสุขภาพสวน'],
      },
    ],
  },
};

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onBack, onBookService }) => {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const data = SERVICE_DATA[service.label];
  const Icon = data.icon;

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">ไม่พบข้อมูลบริการ</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-br from-${data.color}-600 to-${data.color}-700 text-white sticky top-0 z-10`}>
        <div className="px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">กลับ</span>
          </button>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Icon size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{data.title}</h1>
              <p className="text-sm text-white/90 mb-3">{data.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-white text-white" />
                  <span className="font-bold">{data.rating}</span>
                  <span className="text-white/70">({data.reviews} รีวิว)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <DollarSign size={16} />
              <span className="text-xs">ราคาเริ่มต้น</span>
            </div>
            <p className="font-bold text-gray-900">฿{data.priceRange}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Clock size={16} />
              <span className="text-xs">ระยะเวลา</span>
            </div>
            <p className="font-bold text-gray-900">{data.duration}</p>
          </div>
        </div>

        {/* Gallery */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">ผลงานของเรา</h2>
          <div className="grid grid-cols-2 gap-3">
            {data.gallery.map((img: string, idx: number) => (
              <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl p-5 border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">รายละเอียดบริการ</h2>
          <div className="space-y-3">
            {data.features.map((feature: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">ขั้นตอนการทำงาน</h2>
          <div className="bg-white rounded-xl p-5 border border-gray-100">
            <div className="space-y-4">
              {data.process.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full bg-${data.color}-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0`}>
                      {item.step}
                    </div>
                    {idx < data.process.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 my-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{item.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Packages */}
        <div>
          <h2 className="font-bold text-gray-900 mb-3">แพ็กเกจบริการ</h2>
          <div className="space-y-3">
            {data.packages.map((pkg: any, idx: number) => (
              <div
                key={idx}
                onClick={() => setSelectedPackage(idx)}
                className={`bg-white rounded-xl p-5 border-2 transition cursor-pointer ${
                  selectedPackage === idx
                    ? `border-${data.color}-600 shadow-lg`
                    : 'border-gray-100 hover:border-gray-200'
                } ${pkg.popular ? 'relative' : ''}`}
              >
                {pkg.popular && (
                  <div className={`absolute -top-3 left-4 px-3 py-1 bg-${data.color}-600 text-white text-xs font-bold rounded-full`}>
                    แนะนำ
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{pkg.name}</h3>
                    <p className="text-xs text-gray-500">{pkg.area}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold text-${data.color}-600`}>฿{pkg.price}</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {pkg.features.map((feature: string, fIdx: number) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-2">
          <button
            onClick={onBookService}
            className={`w-full py-3.5 bg-${data.color}-600 hover:bg-${data.color}-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2`}
          >
            <Calendar size={20} />
            จองบริการ
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition flex items-center justify-center gap-2 text-sm">
              <MessageCircle size={18} />
              สอบถาม
            </button>
            <button className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition flex items-center justify-center gap-2 text-sm">
              <Phone size={18} />
              โทร
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};