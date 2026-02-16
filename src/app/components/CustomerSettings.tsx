import React, { useState } from 'react';
import {
  Bell,
  Lock,
  ChevronRight,
  Globe,
  Moon,
  Shield,
  HelpCircle,
  User,
  CreditCard,
  LogOut,
  Eye,
  EyeOff,
} from 'lucide-react';

interface CustomerSettingsProps {
  customer: any;
  onLogout?: () => void;
}

export const CustomerSettings: React.FC<CustomerSettingsProps> = ({ 
  customer, 
  onLogout 
}) => {
  const [notifications, setNotifications] = useState({
    service: true,
    promotion: false,
    newsletter: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-3 md:space-y-6 animate-fade-in pb-20 md:pb-8 max-w-full overflow-hidden">
      {/* Profile Section - Minimal with Green */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-100">
        <h2 className="text-base md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 md:mb-6">ข้อมูลส่วนตัว</h2>
        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">ชื่อ-นามสกุล</label>
            <input 
              type="text"
              defaultValue={customer.name}
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">เบอร์โทร</label>
            <input 
              type="tel"
              defaultValue={customer.phone}
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">อีเมล</label>
            <input 
              type="email"
              defaultValue={customer.email}
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
            />
          </div>
        </div>
        <button className="w-full mt-4 md:mt-6 px-4 py-2.5 md:px-6 md:py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg md:rounded-xl font-semibold transition text-sm md:text-base">
          บันทึกการเปลี่ยนแปลง
        </button>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-100">
        <h2 className="text-base md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 md:mb-6">เปลี่ยนรหัสผ่าน</h2>
        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">รหัสผ่านปัจจุบัน</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full px-3 py-2 md:px-4 md:py-3 pr-10 md:pr-12 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
                placeholder="••••••••"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} className="md:w-5 md:h-5" /> : <Eye size={16} className="md:w-5 md:h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">รหัสผ่านใหม่</label>
            <input 
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">ยืนยันรหัสผ่านใหม่</label>
            <input 
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
              placeholder="••••••••"
            />
          </div>
        </div>
        <button className="w-full mt-4 md:mt-6 px-4 py-2.5 md:px-6 md:py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg md:rounded-xl font-semibold transition text-sm md:text-base">
          เปลี่ยนรหัสผ่าน
        </button>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-100">
        <h2 className="text-base md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 md:mb-6">การแจ้งเตือน</h2>
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-sm md:text-base font-semibold text-gray-900 mb-0.5">แจ้งเตือนนัดหมาย</p>
              <p className="text-xs md:text-sm text-gray-500">รับการแจ้งเตือนก่อนนัดหมาย 1 วัน</p>
            </div>
            <button className="w-11 h-6 md:w-12 md:h-7 bg-emerald-600 rounded-full relative flex-shrink-0">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full absolute right-1 top-1 transition"></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-sm md:text-base font-semibold text-gray-900 mb-0.5">แจ้งเตือนอีเมล</p>
              <p className="text-xs md:text-sm text-gray-500">รับข่าวสารและโปรโมชั่น</p>
            </div>
            <button className="w-11 h-6 md:w-12 md:h-7 bg-gray-200 rounded-full relative flex-shrink-0">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full absolute left-1 top-1 transition"></div>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-red-100">
        <h2 className="text-base md:text-xl lg:text-2xl font-bold text-red-600 mb-4 md:mb-6">Danger Zone</h2>
        <div className="space-y-3">
          <button className="w-full px-4 py-2.5 md:px-6 md:py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg md:rounded-xl font-semibold transition text-sm md:text-base">
            ลบบัญชี
          </button>
        </div>
      </div>
    </div>
  );
};