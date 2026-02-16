import React, { useState } from 'react';
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Leaf,
  BarChart3,
  DollarSign,
  Bell,
  ShoppingBag,
  MapPin,
} from 'lucide-react';
import { FinancialDocuments } from './FinancialDocuments';
import { AdminReports } from './AdminReports';
import { CustomerManagement } from './CustomerManagement';
import { ServiceManagement } from './ServiceManagement';
import { ServiceForm } from './ServiceForm';
import { ServiceDetail } from './ServiceDetail';
import { PlantManagement } from './PlantManagement';
import { ServiceAreaManagement } from './ServiceAreaManagement';

interface AdminPortalProps {
  onLogout: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false); // เปลี่ยนเป็น false เพื่อให้ปิด sidebar บนมือถือ
  
  // Service Management State
  const [services, setServices] = useState([
    {
      id: 'service-1',
      title: 'ออกแบบสวน',
      description: 'บริการออกแบบและวางผังสวนตามความต้องการของคุณ โดยทีมสถาปนิกภูมิทัศน์มืออาชีพ',
      icon: 'TreePine',
      color: 'emerald',
      priceRange: '15,000 - 50,000',
      duration: '7-14 วัน',
      rating: 4.9,
      reviews: 256,
      status: 'active',
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
      gallery: [
        'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800',
        'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
        'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
      ],
    },
    {
      id: 'service-2',
      title: 'จัดสวน',
      description: 'บริการจัดสวนครบวงจร ตั้งแต่เตรียมดิน ปลูกต้นไม้ จัดภูมิทัศน์ ติดตั้งระบบน้ำ',
      icon: 'Scissors',
      color: 'emerald',
      priceRange: '20,000 - 100,000',
      duration: '5-30 วัน',
      rating: 4.8,
      reviews: 342,
      status: 'active',
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
      gallery: [
        'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800',
        'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800',
        'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
        'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
      ],
    },
    {
      id: 'service-3',
      title: 'ดูแลสวน',
      description: 'บริการดูแลรักษาสวนประจำเดือน ตัดแต่งกิ่งไม้ รดน้ำ ใส่ปุ๋ย กำจัดศัตรูพืช',
      icon: 'Sprout',
      color: 'emerald',
      priceRange: '3,000 - 15,000',
      duration: 'ทุกเดือน',
      rating: 4.9,
      reviews: 589,
      status: 'active',
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
      gallery: [
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800',
        'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800',
        'https://images.unsplash.com/photo-1599629954294-1c2f272c1f6f?w=800',
        'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
      ],
    },
  ]);
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [viewService, setViewService] = useState<any>(null);

  // Plant Management State
  const [plants, setPlants] = useState([
    {
      id: 1,
      name: 'ต้นมอนสเตอร่า',
      category: 'ไม้ใบสวย',
      price: 450,
      originalPrice: 650,
      image: 'https://images.unsplash.com/photo-1614594895304-fe7116b781fa?w=500',
      size: 'กระถาง 6 นิ้ว',
      stock: 15,
      description: 'ต้นไม้ฟอกอากาศยอดนิยม ใบใหญ่สวยงาม ดูแลง่าย เหมาะกับการปลูกในที่ร่ม',
      care: 'รดน้ำสัปดาห์ละ 2-3 ครั้ง ชอบแสงแดดอ่อน ไม่ควรตากแดดจัด',
    },
    {
      id: 2,
      name: 'ต้นพลูด่าง',
      category: 'ไม้ฟอกอากาศ',
      price: 180,
      image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=500',
      size: 'กระถางแขวน 5 นิ้ว',
      stock: 25,
      description: 'ไม้ฟอกอากาศอันดับ 1 ช่วยกรองสารพิษในอากาศได้ดีเยี่ยม',
      care: 'รดน้ำเมื่อดินแห้ง ชอบที่ร่ม ไม่ชอบแดดจัด',
    },
    {
      id: 3,
      name: 'ต้นไทรเงิน',
      category: 'ไม้ประดับ',
      price: 320,
      image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=500',
      size: 'กระถาง 8 นิ้ว',
      stock: 12,
      description: 'ต้นไม้มงคล นำโชคลาภ ใบสีเขียวเงาสวยงาม',
      care: 'รดน้ำวันละครั้ง ชอบแสงสว่าง ควรได้รับแสงแดดอ่อน',
    },
    {
      id: 4,
      name: 'ต้นหางนกยูง',
      category: 'ไม้ประดับ',
      price: 250,
      image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=500',
      size: 'กระถาง 6 นิ้ว',
      stock: 20,
      description: 'ใบลายสวย ทนแล้ง ดูแลง่าย เหมาะกับมือใหม่',
      care: 'รดน้ำสัปดาห์ละ 1-2 ครั้ง ชอบแดดจัด ทนแล้งได้ดี',
    },
    {
      id: 5,
      name: 'กระบองเพชรแคคตัส',
      category: 'กระบองเพชร',
      price: 150,
      image: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=500',
      size: 'กระถาง 4 นิ้ว',
      stock: 30,
      description: 'ต้นไม้อวบน้ำ ทนแล้งดีเยี่ยม ดูแลง่ายที่สุด',
      care: 'รดน้ำเดือนละ 2-3 ครั้ง ชอบแดดจัด ควรปลูกในที่มีแสง',
    },
    {
      id: 6,
      name: 'ต้นฟิโลเดนดรอน',
      category: 'ไม้ใบสวย',
      price: 320,
      originalPrice: 420,
      image: 'https://images.unsplash.com/photo-1583953427525-531e03ca2c4b?w=500',
      size: 'กระถาง 5 นิ้ว',
      stock: 18,
      description: 'ต้นไม้เลื้อยสวยงาม ใบเขียวเข้ม เติบโตเร็ว',
      care: 'รดน้ำสัปดาห์ละ 2 ครั้ง ชอบที่ร่ม ควรพ่นน้ำใบบางครั้ง',
    },
    {
      id: 7,
      name: 'ต้นลิ้นมังกร',
      category: 'ไม้อวบน้ำ',
      price: 200,
      image: 'https://images.unsplash.com/photo-1459156212016-c812468e2115?w=500',
      size: 'กระถาง 6 นิ้ว',
      stock: 22,
      description: 'ไม้ฟอกอากาศตอนกลางคืน ดูแลง่ายมาก ทนแล้ง',
      care: 'รดน้ำเดือนละ 2 ครั้ง ชอบแดดร่ม ไม่ควรรดน้ำมาก',
    },
    {
      id: 8,
      name: 'ต้นบอนสี',
      category: 'ไม้ประดับ',
      price: 1200,
      originalPrice: 1500,
      image: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=500',
      size: 'กระถาง 10 นิ้ว',
      stock: 5,
      description: 'ต้นไม้ศิลปะญี่ปุ่น รูปทรงสวยงาม เพิ่มความมงคล',
      care: 'รดน้ำทุกวัน ตัดแต่งกิ่งสม่ำเสมอ ควรได้รับแสงแดดเช้า',
    },
    {
      id: 9,
      name: 'ต้นหญ้าหางกระรอก',
      category: 'ไม้ประดับ',
      price: 120,
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500',
      size: 'กระถาง 4 นิ้ว',
      stock: 35,
      description: 'ไม้ตกแตงสวย ปลูกง่าย เติบโตเร็ว เหมาะตกแต่งโต๊ะทำงาน',
      care: 'รดน้ำวันละครั้ง ชอบแสงสว่าง ควรพ่นน้ำใบบ่อยๆ',
    },
    {
      id: 10,
      name: 'ต้นหยก',
      category: 'ไม้อวบน้ำ',
      price: 280,
      image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=500',
      size: 'กระถาง 6 นิ้ว',
      stock: 15,
      description: 'ต้นไม้มงคล ดึงดูดโชคลาภ ใบกลมสวยงาม',
      care: 'รดน้ำสัปดาห์ละ 1 ครั้ง ชอบแดดจัด ทนแล้งดี',
    },
  ]);

  const handleAddPlant = (plant: any) => {
    const newPlant = {
      ...plant,
      id: Math.max(...plants.map(p => p.id), 0) + 1,
    };
    setPlants([...plants, newPlant]);
  };

  const handleUpdatePlant = (id: number, updates: any) => {
    setPlants(plants.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleDeletePlant = (id: number) => {
    setPlants(plants.filter(p => p.id !== id));
  };

  const menuItems = [
    { id: 'home', label: 'หน้าหลัก', icon: Home },
    { id: 'customers', label: 'ลูกค้า', icon: Users },
    { id: 'services', label: 'จัดการบริการ', icon: FileText },
    { id: 'plants', label: 'จัดการต้นไม้', icon: ShoppingBag },
    { id: 'serviceareas', label: 'จุดให้บริการ', icon: MapPin },
    { id: 'calendar', label: 'ปฏิทิน', icon: Calendar },
    { id: 'financial', label: 'เอกสารการเงิน', icon: DollarSign },
    { id: 'reports', label: 'รายงาน', icon: BarChart3 },
    { id: 'settings', label: 'ตั้งค่า', icon: Settings },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky md:top-0 inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transition-transform duration-300 md:h-screen flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center">
                <Leaf size={18} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-gray-900">XYLEM</span>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition ${
                activeTab === item.id
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:bg-emerald-50'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-900 font-medium transition"
          >
            <LogOut size={18} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen w-full">
        {/* Mobile Header - แสดงเฉพาะมือถือ */}
        <header className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-emerald-50 rounded-lg transition"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900">XYLEM LANDSCAPE</span>
          </div>

          <button className="p-2 hover:bg-emerald-50 rounded-lg transition relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </header>

        {/* Desktop Top Bar - แสดงเฉพาะ desktop */}
        <header className="hidden md:block bg-white border-b border-gray-100 sticky top-0 z-20 flex-shrink-0">
          <div className="px-4 md:px-8 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-emerald-50 rounded-lg transition"
                >
                  <Menu size={20} className="text-gray-600" />
                </button>
                <div>
                  <h2 className="font-bold text-lg text-gray-900">
                    {menuItems.find((item) => item.id === activeTab)?.label || 'หน้าหลัก'}
                  </h2>
                  <p className="text-xs text-gray-500">จัดการระบบ XYLEM</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-emerald-50 rounded-lg transition relative">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
              </div>
            </div>

            {/* Search Bar - แบบใหม่ */}
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหา..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-emerald-600/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wider font-semibold text-emerald-100 mb-2">
                      ยินดีต้อนรับกลับมา
                    </p>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                      แดชบอร์ดแอดมิน
                    </h1>
                    <p className="text-emerald-50 text-sm">
                      ภาพรวมธุรกิจและการจัดการ XYLEM LANDSCAPE
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Leaf size={32} className="text-white" />
                  </div>
                </div>

                {/* Quick Stats in Card */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-xs text-emerald-100 mb-1">ลูกค้า</div>
                    <div className="text-2xl font-bold">156</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-xs text-emerald-100 mb-1">นัดหมาย</div>
                    <div className="text-2xl font-bold">24</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                    <div className="text-xs text-emerald-100 mb-1">รายได้</div>
                    <div className="text-2xl font-bold">485K</div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div>
                <h2 className="font-bold text-gray-900 mb-3">สถิติรายละเอียด</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition">
                        <Users size={24} className="text-blue-600" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-700 rounded-lg">+12%</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">156</div>
                    <div className="text-sm text-gray-500">ลูกค้าทั้งหมด</div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition">
                        <Calendar size={24} className="text-emerald-600" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg">สัปดาห์นี้</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">24</div>
                    <div className="text-sm text-gray-500">นัดหมายที่กำลังจะมา</div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center transition">
                        <DollarSign size={24} className="text-amber-600" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-amber-50 text-amber-700 rounded-lg">เดือนนี้</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">₿485K</div>
                    <div className="text-sm text-gray-500">รายได้</div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition">
                        <FileText size={24} className="text-purple-600" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-purple-50 text-purple-700 rounded-lg">รอดำเนินการ</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">18</div>
                    <div className="text-sm text-gray-500">เอกสาร</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">การดำเนินการด่วน</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveTab('financial')}
                    className="p-5 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-center transition group"
                  >
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition">
                      <FileText size={24} className="text-blue-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition">
                      ใบเสนอราคา
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab('financial')}
                    className="p-5 bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-xl text-center transition group"
                  >
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center transition">
                      <DollarSign size={24} className="text-amber-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-amber-600 transition">
                      ใบแจ้งหนี้
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab('customers')}
                    className="p-5 bg-white hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-xl text-center transition group"
                  >
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition">
                      <Users size={24} className="text-emerald-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition">
                      เพิ่มลูกค้า
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab('calendar')}
                    className="p-5 bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-300 rounded-xl text-center transition group"
                  >
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition">
                      <Calendar size={24} className="text-purple-600" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-purple-600 transition">
                      นัดหมายใหม่
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financial' && <FinancialDocuments />}

          {activeTab === 'customers' && <CustomerManagement />}

          {activeTab === 'calendar' && (
            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">ปฏิทินนัดหมาย</h3>
              <p className="text-gray-500">ส่วนนี้กำลังพัฒนา</p>
            </div>
          )}

          {activeTab === 'reports' && <AdminReports />}

          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings size={64} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">ตั้งค่า</h3>
              <p className="text-gray-500">ส่วนนี้กำลังพัฒนา</p>
            </div>
          )}

          {activeTab === 'services' && (
            <>
              <ServiceManagement
                services={services}
                onAddService={() => {
                  setSelectedService(null);
                  setServiceFormOpen(true);
                }}
                onEditService={(service) => {
                  setSelectedService(service);
                  setServiceFormOpen(true);
                }}
                onDeleteService={(serviceId) => {
                  setServices(services.filter(s => s.id !== serviceId));
                }}
                onViewService={(service) => setViewService(service)}
              />
              
              {/* Service Form Modal */}
              {serviceFormOpen && (
                <ServiceForm
                  service={selectedService}
                  onSave={(service) => {
                    if (selectedService) {
                      // Edit existing
                      setServices(services.map(s => s.id === service.id ? service : s));
                    } else {
                      // Add new
                      setServices([...services, service]);
                    }
                    setServiceFormOpen(false);
                    setSelectedService(null);
                  }}
                  onCancel={() => {
                    setServiceFormOpen(false);
                    setSelectedService(null);
                  }}
                />
              )}
              
              {/* Service Detail Preview Modal */}
              {viewService && (
                <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
                  <ServiceDetail
                    service={{
                      label: viewService.title,
                      icon: viewService.icon,
                      color: viewService.color
                    }}
                    onBack={() => setViewService(null)}
                  />
                </div>
              )}
            </>
          )}

          {activeTab === 'plants' && (
            <PlantManagement
              plants={plants}
              onAddPlant={handleAddPlant}
              onUpdatePlant={handleUpdatePlant}
              onDeletePlant={handleDeletePlant}
            />
          )}

          {activeTab === 'serviceareas' && <ServiceAreaManagement />}
        </div>
      </main>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};