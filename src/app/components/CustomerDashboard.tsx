import React from 'react';
import {
  Leaf,
  Calendar,
  Clock,
  Star,
  ArrowRight,
  User,
  Search,
  Bell,
  Scissors,
  TreePine,
  Sprout,
  ChevronRight,
  Package,
  ShoppingBag,
  Plus,
} from 'lucide-react';
import { PropertyStories } from '@/app/components/PropertyStories';

interface CustomerDashboardProps {
  customer: any;
  onViewService?: (service: any) => void;
  onNavigate?: (tab: string) => void;
  properties?: any[];
  selectedProperty?: any;
  onPropertySelect?: (property: any) => void;
  onAddProperty?: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ 
  customer, 
  onViewService,
  onNavigate,
  properties,
  selectedProperty,
  onPropertySelect,
  onAddProperty
}) => {
  const currentProperty = selectedProperty || properties?.[0];
  const displayData = customer;

  // Services
  const services = [
    { icon: TreePine, label: 'ออกแบบสวน', color: 'bg-emerald-600', active: true },
    { icon: Scissors, label: 'จัดสวน', color: 'bg-white', active: false },
    { icon: Sprout, label: 'ดูแลสวน', color: 'bg-white', active: false },
    { icon: Package, label: 'ร้านต้นไม้', color: 'bg-white', active: false },
  ];

  // Specialties (Garden Types)
  const specialties = [
    { icon: TreePine, label: 'สวนญี่ปุ่น' },
    { icon: Leaf, label: 'สวนผัก' },
    { icon: Sprout, label: 'สวนดอกไม้' },
    { icon: TreePine, label: 'สวนหินแห้ง' },
    { icon: Leaf, label: 'สวนใบไม้' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="px-4 py-3">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <User size={20} className="text-emerald-700" />
              </div>
              <div>
                <p className="text-xs text-gray-500">ยินดีต้อนรับ</p>
                <p className="text-sm font-bold text-gray-900">{customer?.name || 'ลูกค้า'}</p>
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition relative">
              <Bell size={20} className="text-gray-600" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาบริการ..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Properties */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-gray-900">บ้าน/สถานที่</h2>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold">
                {properties?.length ?? 0}
              </span>
            </div>
            <button 
              onClick={() => onNavigate?.('properties')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ทั้งหมด
            </button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {(properties ?? []).slice(0, 6).map((property) => (
              <button
                key={property.id}
                onClick={() => onPropertySelect?.(property)}
                className={`flex flex-col items-start gap-1.5 px-3.5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition min-w-[140px] ${
                  selectedProperty?.id === property.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-1.5 w-full">
                  <Package size={16} className="flex-shrink-0" />
                  <span className="font-bold text-sm truncate">{property.name}</span>
                </div>
                <span className={`text-xs leading-tight ${selectedProperty?.id === property.id ? 'text-emerald-100' : 'text-gray-500'}`}>
                  {property.address || '—'}
                </span>
              </button>
            ))}

            {(!properties || properties.length === 0) && (
              <button
                onClick={onAddProperty}
                className="flex flex-col items-start justify-center gap-1.5 px-3.5 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition min-w-[140px] bg-white text-gray-700 border border-dashed border-gray-200 hover:border-emerald-300"
              >
                <div className="flex items-center gap-1.5 w-full">
                  <Plus size={16} className="flex-shrink-0" />
                  <span className="font-bold text-sm truncate">เพิ่มบ้าน</span>
                </div>
                <span className="text-xs leading-tight text-gray-500">เริ่มต้นใช้งาน</span>
              </button>
            )}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">นัดหมายถัดไป</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700">ทั้งหมด</button>
          </div>
          
          {displayData?.nextService ? (
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-4 shadow-xl shadow-emerald-600/30">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <User size={24} className="text-white" />
              </div>
              <div className="flex-1 text-white">
                <h3 className="font-bold mb-1">{displayData?.worker || '—'}</h3>
                <p className="text-xs text-emerald-100">{displayData?.serviceType || '—'}</p>
              </div>
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 text-white mb-1">
                  <Calendar size={14} />
                  <span className="text-xs">วันที่</span>
                </div>
                <p className="text-sm font-bold text-white">{displayData.nextService}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 text-white mb-1">
                  <Clock size={14} />
                  <span className="text-xs">เวลา</span>
                </div>
                <p className="text-sm font-bold text-white">09:00 - 12:00</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-white text-emerald-700 rounded-xl font-medium text-sm hover:bg-emerald-50 transition">
                เปลี่ยนนัด
              </button>
              <button className="flex-1 py-2.5 bg-emerald-800 text-white rounded-xl font-medium text-sm hover:bg-emerald-900 transition">
                ดูรายละเอียด
              </button>
            </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="text-sm font-semibold text-gray-900 mb-1">ยังไม่มีนัดหมาย</div>
              <div className="text-sm text-gray-500">เมื่อมีการจองบริการ จะแสดงรายละเอียดที่นี่</div>
            </div>
          )}
        </div>

        {/* Specialties */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">บริการของเรา</h2>
            <button className="text-sm text-gray-500 hover:text-gray-700">ทั้งหมด</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {services.slice(0, 3).map((service, idx) => (
              <button 
                key={idx} 
                onClick={() => onViewService?.(service)}
                className="flex flex-col items-center gap-2 min-w-[80px] group"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-600 transition cursor-pointer">
                  <service.icon size={24} className="text-emerald-600 group-hover:text-white transition" />
                </div>
                <p className="text-xs text-gray-700 text-center font-medium">{service.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Garden Health */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">สุขภาพสวน</h2>
            <button 
              onClick={() => onNavigate?.('plants')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ทั้งหมด
            </button>
          </div>

          <div className="space-y-3">
            {displayData.plantHealth?.slice(0, 2).map((plant: any, idx: number) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-gray-100 hover:border-emerald-200 transition">
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Leaf size={24} className="text-emerald-600" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1">{plant.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{plant.note}</p>
                    
                    {/* Progress */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                          style={{ width: `${plant.score}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">{plant.score}%</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 rounded-lg">
                    <Star size={12} className="fill-emerald-600 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">{plant.score / 20}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Services */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">การดูแลล่าสุด</h2>
            <button 
              onClick={() => onNavigate?.('history')}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ทั้งหมด
            </button>
          </div>

          <div className="space-y-3">
            {displayData.serviceHistory?.slice(0, 2).map((service: any) => (
              <div 
                key={service.id}
                onClick={() => onViewService?.(service)}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:border-emerald-200 transition cursor-pointer"
              >
                <div className="flex gap-3">
                  {/* Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img 
                      src={service.images?.after?.[0] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"}
                      className="w-full h-full object-cover"
                      alt="service"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm mb-0.5 truncate">{service.type}</h3>
                        <p className="text-xs text-gray-500">{service.worker || 'ทีม A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-0.5">ค่าใช้จ่าย</p>
                        <p className="font-bold text-emerald-600 text-sm">฿{service.cost?.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      {service.rating && (
                        <div className="flex items-center gap-1">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-gray-700">{service.rating}.0</span>
                          <span className="text-xs text-gray-400">({service.reviews || 85} รีวิว)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button className="w-full mt-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition">
                  ดูรายละเอียด
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Plant Shop Section - Featured Plants */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-emerald-600" />
              <h2 className="font-bold text-gray-900">ต้นไม้แนะนำ</h2>
            </div>
            <button 
              onClick={() => onNavigate?.('plantshop')}
              className="text-sm text-emerald-600 font-medium hover:text-emerald-700"
            >
              ดูทั้งหมด
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {[
              {
                id: 1,
                name: 'ต้นมอนสเตอร่า',
                price: 450,
                originalPrice: 650,
                image: 'https://images.unsplash.com/photo-1614594895304-fe7116b781fa?w=500',
                size: 'กระถาง 6 นิ้ว'
              },
              {
                id: 2,
                name: 'ต้นพลูด่าง',
                price: 180,
                image: 'https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=500',
                size: 'กระถางแขวน 5 นิ้ว'
              },
              {
                id: 4,
                name: 'ต้นหางนกยูง',
                price: 250,
                image: 'https://images.unsplash.com/photo-1593482892290-f54927ae1bb6?w=500',
                size: 'กระถาง 6 นิ้ว'
              },
              {
                id: 6,
                name: 'ต้นฟิโลเดนดรอน',
                price: 320,
                originalPrice: 420,
                image: 'https://images.unsplash.com/photo-1583953427525-531e03ca2c4b?w=500',
                size: 'กระถาง 5 นิ้ว'
              }
            ].map((plant) => (
              <div 
                key={plant.id}
                onClick={() => onNavigate?.('plantshop')}
                className="flex-shrink-0 w-36 bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="w-full h-full object-cover"
                  />
                  {plant.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                      -{Math.round((1 - plant.price / plant.originalPrice) * 100)}%
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-lg font-semibold text-gray-900 mb-1">฿{plant.price}</p>
                  <h3 className="text-sm text-gray-800 mb-1 line-clamp-2">{plant.name}</h3>
                  <p className="text-xs text-gray-500">{plant.size}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};