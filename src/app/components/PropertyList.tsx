import React from 'react';
import {
  Home,
  MapPin,
  Calendar,
  ArrowLeft,
  Plus,
  ChevronRight,
} from 'lucide-react';

interface PropertyListProps {
  properties?: any[];
  selectedProperty?: any;
  onPropertySelect?: (property: any) => void;
  onAddProperty?: () => void;
  onBack?: () => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
  onAddProperty,
  onBack,
}) => {
  const displayProperties = properties ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <button 
              onClick={onBack}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div className="flex-1">
              <h1 className="font-bold text-gray-900 text-lg">บ้าน/สถานที่ทั้งหมด</h1>
              <p className="text-xs text-gray-500">จัดการบ้านของคุณ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Home size={16} className="text-emerald-600" />
              </div>
              <span className="text-xs text-gray-500">บ้านทั้งหมด</span>
            </div>
            <p className="font-bold text-2xl text-gray-900">{displayProperties.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Calendar size={16} className="text-emerald-600" />
              </div>
              <span className="text-xs text-gray-500">นัดหมายที่รอ</span>
            </div>
            <p className="font-bold text-2xl text-gray-900">{displayProperties.length}</p>
          </div>
        </div>

        {/* Add Property Button */}
        <button 
          onClick={onAddProperty}
          className="w-full mb-4 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
        >
          <Plus size={18} />
          เพิ่มบ้านใหม่
        </button>

        {displayProperties.length === 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
            <div className="text-sm font-semibold text-gray-900 mb-1">ยังไม่มีบ้าน/สถานที่</div>
            <div className="text-sm text-gray-500">เพิ่มบ้านแรกของคุณเพื่อเริ่มใช้งาน</div>
          </div>
        )}

        {/* Property List */}
        {displayProperties.length > 0 && (
        <div className="space-y-3">
          {displayProperties.map((property) => (
            <button
              key={property.id}
              onClick={() => {
                onPropertySelect?.(property);
                onBack?.();
              }}
              className="w-full bg-white rounded-xl p-4 border border-gray-100 hover:border-emerald-300 transition text-left group"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition">
                  <Home size={24} className="text-emerald-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-gray-900 mb-0.5">
                        {property.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <MapPin size={14} />
                        <p className="text-sm">{property.address || '—'}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400 group-hover:text-emerald-600 transition flex-shrink-0 ml-2" />
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="bg-gray-50 rounded-lg px-2.5 py-2">
                      <p className="text-xs text-gray-500 mb-0.5">นัดหมายถัดไป</p>
                      <p className="text-xs font-semibold text-gray-900">{property.nextService || '—'}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg px-2.5 py-2">
                      <p className="text-xs text-gray-500 mb-0.5">ขนาดสวน</p>
                      <p className="text-xs font-semibold text-gray-900">
                        {typeof property.gardenArea === 'number' ? `${property.gardenArea} ตร.ม.` : property.gardenSize || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Service Type Badge */}
                  <div className="mt-2">
                    {property.serviceType && (
                      <span className="inline-flex items-center px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold">
                        {property.serviceType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};
