import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Settings,
  ChevronRight,
  Bell,
  Lock,
  CreditCard,
  HelpCircle,
  LogOut,
} from 'lucide-react';

interface CustomerProfileProps {
  customer: any;
  onNavigateToSettings?: () => void;
  onLogout?: () => void;
}

export const CustomerProfile: React.FC<CustomerProfileProps> = ({ customer, onNavigateToSettings, onLogout }) => {
  return (
    <div className="space-y-3 md:space-y-6 animate-fade-in pb-20 md:pb-8 max-w-full overflow-hidden">
      {/* Customer Info Card - Clean with Green */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-100">
        <div className="flex items-start gap-3 md:gap-6 mb-5 md:mb-8 pb-5 md:pb-8 border-b border-gray-100">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xl md:text-2xl font-bold flex-shrink-0">
            {customer.name.charAt(2)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2 truncate">
              {customer.name}
            </h2>
            <p className="text-xs md:text-sm text-gray-400">
              สมาชิกตั้งแต่ {new Date(customer.memberSince).toLocaleDateString('th-TH', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl">
            <Phone size={16} className="text-emerald-600 flex-shrink-0 md:w-5 md:h-5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-0.5">เบอร์โทร</p>
              <p className="text-sm md:text-base font-semibold text-gray-900">{customer.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl">
            <Mail size={16} className="text-emerald-600 flex-shrink-0 md:w-5 md:h-5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-0.5">อีเมล</p>
              <p className="text-sm md:text-base font-semibold text-gray-900 truncate">{customer.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl">
            <MapPin size={16} className="text-emerald-600 flex-shrink-0 md:w-5 md:h-5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-0.5">ที่อยู่</p>
              <p className="text-sm md:text-base font-semibold text-gray-900 line-clamp-1">{customer.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics - รวมจากทุกบ้าน */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-100">
        <h3 className="text-base md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 md:mb-6">สถิติการใช้บริการ</h3>
        <p className="text-xs text-gray-500 mb-4">รวมจากบ้านทั้งหมด</p>
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          <div className="text-center">
            <div className="text-xl md:text-3xl lg:text-4xl font-bold text-emerald-600 mb-1 md:mb-2">
              {customer.serviceHistory?.length || 0}
            </div>
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">ครั้งที่ดูแล</p>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-3xl lg:text-4xl font-bold text-emerald-600 mb-1 md:mb-2">4.9</div>
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">คะแนนเฉลี่ย</p>
          </div>
          <div className="text-center">
            <div className="text-xl md:text-3xl lg:text-4xl font-bold text-emerald-600 mb-1 md:mb-2">
              {customer.healthScore || '92'}
            </div>
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">ค่าเฉลี่ย</p>
          </div>
        </div>
      </div>

      {/* Settings & Actions */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100">
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">การตั้งค่า</h3>
        <div className="space-y-2">
          <button 
            onClick={onNavigateToSettings}
            className="w-full flex items-center justify-between p-3 md:p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 flex items-center justify-center transition">
                <Settings size={16} className="text-gray-600 group-hover:text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">ตั้งค่าทั่วไป</span>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition" />
          </button>

          <button className="w-full flex items-center justify-between p-3 md:p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 flex items-center justify-center transition">
                <Bell size={16} className="text-gray-600 group-hover:text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">การแจ้งเตือน</span>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition" />
          </button>

          <button className="w-full flex items-center justify-between p-3 md:p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 flex items-center justify-center transition">
                <Lock size={16} className="text-gray-600 group-hover:text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">ความปลอดภัย</span>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition" />
          </button>

          <button className="w-full flex items-center justify-between p-3 md:p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 flex items-center justify-center transition">
                <CreditCard size={16} className="text-gray-600 group-hover:text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">การชำระเงิน</span>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition" />
          </button>

          <button className="w-full flex items-center justify-between p-3 md:p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl transition group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 flex items-center justify-center transition">
                <HelpCircle size={16} className="text-gray-600 group-hover:text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">ช่วยเหลือ</span>
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition" />
          </button>
        </div>
      </div>

      {/* Logout Button */}
      <button 
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 p-3 md:p-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition"
      >
        <LogOut size={18} />
        <span>ออกจากระบบ</span>
      </button>
    </div>
  );
};
