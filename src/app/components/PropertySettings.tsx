import React, { useState } from 'react';
import {
  Home,
  MapPin,
  Ruler,
  Calendar,
  Leaf,
  User,
  Bell,
  Trash2,
  Edit3,
  Plus,
} from 'lucide-react';

interface PropertySettingsProps {
  property: any;
  onSave?: (data: any) => void;
  onDelete?: () => void;
}

export const PropertySettings: React.FC<PropertySettingsProps> = ({ 
  property,
  onSave,
  onDelete
}) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: property?.name || '',
    address: property?.address || '',
    size: property?.gardenSize || '',
    type: property?.gardenType || 'residential',
    notes: property?.notes || '',
  });

  const [notifications, setNotifications] = useState({
    maintenance: true,
    watering: true,
    fertilizing: false,
  });

  const handleSave = () => {
    onSave?.(formData);
    setEditMode(false);
  };

  return (
    <div className="space-y-3 md:space-y-6 animate-fade-in pb-20 md:pb-8 max-w-full overflow-hidden">
      {/* Property Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Home size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{property?.name || 'บ้านของคุณ'}</h1>
              <p className="text-emerald-100 text-sm md:text-base mt-1">{property?.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-base md:text-xl lg:text-2xl font-bold text-gray-900">ข้อมูลพื้นฐาน</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg font-medium transition text-sm md:text-base flex items-center gap-2"
          >
            <Edit3 size={14} />
            {editMode ? 'ยกเลิก' : 'แก้ไข'}
          </button>
        </div>

        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">ชื่อบ้าน</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!editMode}
              className={`w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base ${
                !editMode ? 'bg-gray-50 text-gray-500' : ''
              }`}
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">ที่อยู่</label>
            <textarea 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!editMode}
              rows={3}
              className={`w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base resize-none ${
                !editMode ? 'bg-gray-50 text-gray-500' : ''
              }`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">ขนาดสวน</label>
              <div className="relative">
                <input 
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  disabled={!editMode}
                  placeholder="เช่น 50 ตร.ม."
                  className={`w-full px-3 py-2 md:px-4 md:py-3 pl-10 md:pl-12 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base ${
                    !editMode ? 'bg-gray-50 text-gray-500' : ''
                  }`}
                />
                <Ruler size={16} className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">ประเภทสวน</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={!editMode}
                className={`w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base ${
                  !editMode ? 'bg-gray-50 text-gray-500' : ''
                }`}
              >
                <option value="residential">สวนบ้านพักอาศัย</option>
                <option value="commercial">สวนพาณิชย์</option>
                <option value="rooftop">สวนดาดฟ้า</option>
                <option value="vertical">สวนแนวตั้ง</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">หมายเหตุ</label>
            <textarea 
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              disabled={!editMode}
              rows={3}
              placeholder="ข้อมูลเพิ่มเติมเกี่ยวกับสวน..."
              className={`w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base resize-none ${
                !editMode ? 'bg-gray-50 text-gray-500' : ''
              }`}
            />
          </div>
        </div>

        {editMode && (
          <button 
            onClick={handleSave}
            className="w-full mt-4 md:mt-6 px-4 py-2.5 md:px-6 md:py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg md:rounded-xl font-semibold transition text-sm md:text-base"
          >
            บันทึกการเปลี่ยนแปลง
          </button>
        )}
      </div>

      {/* Garden Care Preferences */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-100">
        <h2 className="text-base md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 md:mb-6">การดูแลสวน</h2>
        
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between p-3 md:p-4 bg-emerald-50/50 rounded-lg md:rounded-xl border border-emerald-100">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-sm md:text-base font-semibold text-gray-900 mb-0.5">แจ้งเตือนการดูแลประจำ</p>
              <p className="text-xs md:text-sm text-gray-500">รับการแจ้งเตือนก่อนนัดหมายดูแลสวน</p>
            </div>
            <button 
              onClick={() => setNotifications({ ...notifications, maintenance: !notifications.maintenance })}
              className={`w-11 h-6 md:w-12 md:h-7 rounded-full relative flex-shrink-0 transition ${
                notifications.maintenance ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            >
              <div className={`w-4 h-4 md:w-5 md:h-5 bg-white rounded-full absolute top-1 transition-all ${
                notifications.maintenance ? 'right-1' : 'left-1'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-sm md:text-base font-semibold text-gray-900 mb-0.5">แจ้งเตือนการรดน้ำ</p>
              <p className="text-xs md:text-sm text-gray-500">เตือนเวลาที่ควรรดน้ำตามฤดูกาล</p>
            </div>
            <button 
              onClick={() => setNotifications({ ...notifications, watering: !notifications.watering })}
              className={`w-11 h-6 md:w-12 md:h-7 rounded-full relative flex-shrink-0 transition ${
                notifications.watering ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            >
              <div className={`w-4 h-4 md:w-5 md:h-5 bg-white rounded-full absolute top-1 transition-all ${
                notifications.watering ? 'right-1' : 'left-1'
              }`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl">
            <div className="flex-1 min-w-0 pr-3">
              <p className="text-sm md:text-base font-semibold text-gray-900 mb-0.5">แจ้งเตือนการใส่ปุ๋ย</p>
              <p className="text-xs md:text-sm text-gray-500">เตือนเวลาที่ควรใส่ปุ๋ยให้ต้นไม้</p>
            </div>
            <button 
              onClick={() => setNotifications({ ...notifications, fertilizing: !notifications.fertilizing })}
              className={`w-11 h-6 md:w-12 md:h-7 rounded-full relative flex-shrink-0 transition ${
                notifications.fertilizing ? 'bg-emerald-600' : 'bg-gray-200'
              }`}
            >
              <div className={`w-4 h-4 md:w-5 md:h-5 bg-white rounded-full absolute top-1 transition-all ${
                notifications.fertilizing ? 'right-1' : 'left-1'
              }`}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Service Contact Person */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-100">
        <h2 className="text-base md:text-xl lg:text-2xl font-bold text-gray-900 mb-4 md:mb-6">ผู้ติดต่อสำหรับบ้านหลังนี้</h2>
        
        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">ชื่อผู้ติดต่อ</label>
            <input 
              type="text"
              placeholder="เช่น คุณสมชาย หรือ แม่บ้าน"
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">เบอร์โทรติดต่อ</label>
            <input 
              type="tel"
              placeholder="08X-XXX-XXXX"
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base"
            />
          </div>

          <div>
            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">หมายเหตุเพิ่มเติม</label>
            <textarea 
              rows={2}
              placeholder="เช่น โทรติดต่อหลัง 9 โมง, กดกริ่งที่บ้านหลังเลข 2"
              className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm md:text-base resize-none"
            />
          </div>
        </div>

        <button className="w-full mt-4 md:mt-6 px-4 py-2.5 md:px-6 md:py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg md:rounded-xl font-semibold transition text-sm md:text-base">
          บันทึกข้อมูลผู้ติดต่อ
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-red-100">
        <h2 className="text-base md:text-xl lg:text-2xl font-bold text-red-600 mb-2 md:mb-3">Danger Zone</h2>
        <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
          การลบบ้านจะทำให้ข้อมูลทั้งหมดของบ้านหลังนี้หายไป รวมถึงประวัติการดูแลและรายงานต่างๆ
        </p>
        <button 
          onClick={onDelete}
          className="w-full px-4 py-2.5 md:px-6 md:py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg md:rounded-xl font-semibold transition text-sm md:text-base flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          ลบบ้านหลังนี้
        </button>
      </div>
    </div>
  );
};
