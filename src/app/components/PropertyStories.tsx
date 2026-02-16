import React from 'react';
import { Home, CheckCircle2 } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  thumbnail?: string | null;
  healthScore?: number | null;
  address?: string | null;
}

interface PropertyStoriesProps {
  properties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property) => void;
  onAddProperty?: () => void;
}

export const PropertyStories: React.FC<PropertyStoriesProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
  onAddProperty,
}) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide pb-2">
      <div className="flex gap-4">
        {/* Add Property Story */}
        {onAddProperty && (
          <button
            onClick={onAddProperty}
            className="flex-shrink-0 group"
          >
            <div className="relative">
              {/* Story Ring - Minimal Green */}
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-200 hover:border-emerald-500 transition p-1">
                <div className="w-full h-full rounded-full bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center transition">
                  <Home size={24} className="text-emerald-600" />
                </div>
              </div>
            </div>
            <p className="text-xs font-medium text-gray-400 group-hover:text-emerald-600 mt-3 text-center max-w-[80px] truncate transition">
              เพิ่มบ้าน
            </p>
          </button>
        )}

        {/* Property Stories */}
        {properties.map((property) => {
          const isSelected = selectedProperty?.id === property.id;
          
          return (
            <button
              key={property.id}
              onClick={() => onPropertySelect(property)}
              className="flex-shrink-0 group"
            >
              <div className="relative">
                {/* Story Ring - Clean Green */}
                <div className={`w-20 h-20 rounded-full border-2 transition p-1 ${
                  isSelected
                    ? 'border-emerald-500'
                    : 'border-gray-200 hover:border-emerald-300'
                }`}>
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    {property.thumbnail ? (
                      <img
                        src={property.thumbnail}
                        alt={property.name}
                        className="w-full h-full object-cover transition group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Home size={22} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Selected Badge - Green */}
                {isSelected && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-white" strokeWidth={2.5} />
                  </div>
                )}
              </div>

              {/* Property Name */}
              <p className={`text-xs font-medium mt-3 text-center max-w-[80px] truncate transition ${
                isSelected ? 'text-emerald-600' : 'text-gray-400'
              }`}>
                {property.name}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};