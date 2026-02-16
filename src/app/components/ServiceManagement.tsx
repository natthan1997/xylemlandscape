import React, { useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  TreePine,
  Scissors,
  Sprout,
  Package,
  Eye,
} from 'lucide-react';

interface ServiceManagementProps {
  services: any[];
  onAddService: () => void;
  onEditService: (service: any) => void;
  onDeleteService: (serviceId: string) => void;
  onViewService?: (service: any) => void;
}

export const ServiceManagement: React.FC<ServiceManagementProps> = ({
  services,
  onAddService,
  onEditService,
  onDeleteService,
  onViewService,
}) => {
  const getServiceIcon = (label: string) => {
    switch (label) {
      case 'ออกแบบสวน':
        return TreePine;
      case 'จัดสวน':
        return Scissors;
      case 'ดูแลสวน':
        return Sprout;
      default:
        return Package;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">บริการ</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">{services.length} บริการ</p>
        </div>
        <button
          onClick={onAddService}
          className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition text-sm"
        >
          <Plus size={18} className="sm:hidden" />
          <Plus size={20} className="hidden sm:block" />
          <span className="hidden sm:inline">เพิ่มบริการ</span>
          <span className="sm:hidden">เพิ่ม</span>
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-3 sm:space-y-4">
        {services.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 sm:p-16 text-center">
            <Package size={40} className="text-gray-300 mx-auto mb-3 sm:hidden" />
            <Package size={48} className="text-gray-300 mx-auto mb-3 hidden sm:block" />
            <p className="text-gray-500 text-sm sm:text-base">ยังไม่มีบริการ</p>
          </div>
        ) : (
          services.map((service) => {
            const Icon = getServiceIcon(service.title);
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 p-5 sm:p-8 hover:border-emerald-200 transition group"
              >
                {/* Mobile Layout */}
                <div className="sm:hidden space-y-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={22} className="text-emerald-600" />
                    </div>
                    
                    {/* Title & Actions */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-gray-900 mb-1">
                        {service.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    {/* Actions - Vertical */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        onClick={() => onViewService && onViewService(service)}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="ดูตัวอย่าง"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEditService(service)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                        title="แก้ไข"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`ต้องการลบบริการ "${service.title}" ใช่หรือไม่?`)) {
                            onDeleteService(service.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="ลบ"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Info Grid - Mobile */}
                  <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">ราคา</p>
                      <p className="text-sm font-medium text-gray-900">
                        ฿{service.priceRange}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">ระยะเวลา</p>
                      <p className="text-sm font-medium text-gray-900">
                        {service.duration}
                      </p>
                    </div>
                    <div className="w-px h-8 bg-gray-200"></div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-1">แพ็กเกจ</p>
                      <p className="text-sm font-medium text-gray-900">
                        {service.packages?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-start justify-between gap-8">
                  {/* Left: Icon + Content */}
                  <div className="flex items-start gap-6 flex-1">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={28} className="text-emerald-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2">
                          {service.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Info Grid */}
                      <div className="flex items-center gap-8 pt-2">
                        <div>
                          <p className="text-xs text-gray-400 mb-1.5">ช่วงราคา</p>
                          <p className="font-medium text-gray-900">
                            ฿{service.priceRange}
                          </p>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1.5">ระยะเวลา</p>
                          <p className="font-medium text-gray-900">
                            {service.duration}
                          </p>
                        </div>
                        <div className="w-px h-10 bg-gray-200"></div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1.5">จำนวนแพ็กเกจ</p>
                          <p className="font-medium text-gray-900">
                            {service.packages?.length || 0} แพ็กเกจ
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onViewService && onViewService(service)}
                      className="p-3 text-emerald-600 hover:bg-emerald-50 rounded-xl transition"
                      title="ดูตัวอย่าง"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => onEditService(service)}
                      className="p-3 text-gray-600 hover:bg-gray-100 rounded-xl transition"
                      title="แก้ไข"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`ต้องการลบบริการ "${service.title}" ใช่หรือไม่?`)) {
                          onDeleteService(service.id);
                        }
                      }}
                      className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                      title="ลบ"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};