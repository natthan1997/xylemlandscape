import React, { useState } from 'react';
import { Home, MapPin, Leaf, Trees, Plus, ChevronRight } from 'lucide-react';

interface PropertySelectorProps {
  properties: any[];
  onSelect: (property: any) => void;
  onAddProperty?: () => void;
}

export const PropertySelector: React.FC<PropertySelectorProps> = ({
  properties,
  onSelect,
  onAddProperty,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-gray-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4">
            <Leaf size={32} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            เลือกบ้านของคุณ
          </h1>
          <p className="text-gray-500">
            กรุณาเลือกบ้านที่ต้องการเข้าใช้งาน
          </p>
        </div>

        {/* Property Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {properties.map((property) => (
            <button
              key={property.id}
              onClick={() => onSelect(property)}
              onMouseEnter={() => setHoveredId(property.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative bg-white border-2 border-gray-100 hover:border-emerald-600 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02]"
            >
              {/* Thumbnail */}
              {property.thumbnail ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4">
                  <img
                    src={property.thumbnail}
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  
                  {/* Health Score Badge */}
                  {typeof property.healthScore === 'number' && (
                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm font-bold text-gray-900">
                          {property.healthScore}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full h-32 rounded-xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
                  <Home size={28} className="text-gray-400" />
                </div>
              )}

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition">
                    {property.name}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-start gap-1.5">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{property.address}</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">ประเภทสวน</p>
                    <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {property.gardenType || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">พื้นที่</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {typeof property.gardenArea === 'number' ? `${property.gardenArea} ตร.ม.` : '—'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="absolute top-6 right-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                  hoveredId === property.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  <ChevronRight size={16} />
                </div>
              </div>
            </button>
          ))}

          {/* Add New Property Card */}
          {onAddProperty && (
            <button
              onClick={onAddProperty}
              className="group bg-white border-2 border-dashed border-gray-200 hover:border-emerald-600 rounded-2xl p-6 text-center transition-all hover:shadow-xl flex flex-col items-center justify-center min-h-[280px]"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 flex items-center justify-center mb-4 transition">
                <Plus size={28} className="text-emerald-600 group-hover:text-white transition" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition">
                เพิ่มบ้านใหม่
              </h3>
              <p className="text-sm text-gray-500">
                ลงทะเบียนบ้านของคุณ
              </p>
            </button>
          )}
        </div>

        {/* Info */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            คุณสามารถเปลี่ยนบ้านได้ทุกเมื่อจากแถบด้านข้าง
          </p>
        </div>
      </div>
    </div>
  );
};
