import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  Package,
  Camera,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  Leaf,
} from 'lucide-react';

interface ServiceDetailModalProps {
  service: any;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageView, setImageView] = useState<'before' | 'after'>('before');

  const tasksList: string[] = Array.isArray(service.tasksCompleted) ? service.tasksCompleted : [];
  const materialsList: Array<{ name: string; quantity: string }> = Array.isArray(service.materials)
    ? service.materials
    : [];

  const beforeImages: string[] = Array.isArray(service.images?.before) ? service.images.before : [];
  const afterImages: string[] = Array.isArray(service.images?.after) ? service.images.after : [];

  const currentImages = imageView === 'before' ? beforeImages : afterImages;

  const technicianNote: string = typeof service.technicianNote === 'string' ? service.technicianNote : '';
  const recommendations: string[] = Array.isArray(service.recommendations) ? service.recommendations : [];

  const nextImage = () => {
    if (currentImages.length === 0) return;
    setSelectedImageIndex((prev) =>
      prev === currentImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (currentImages.length === 0) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? currentImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-0 md:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-5xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header - Clean */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 flex-shrink-0 bg-white">
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Leaf size={20} className="text-emerald-600 md:w-6 md:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-xl font-bold text-gray-900 truncate">
                รายงานการดูแลสวน
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                {service.date || '—'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition flex-shrink-0"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 md:p-6 space-y-3 md:space-y-4">
            
            {/* Info Bar - Clean Minimal */}
            <div className="bg-white rounded-2xl p-3 md:p-4 border border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Calendar size={12} className="md:w-3.5 md:h-3.5" />
                    <span className="text-xs uppercase tracking-wide font-medium">วันที่</span>
                  </div>
                  <p className="text-sm md:text-base font-bold text-gray-900">{service.date}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Clock size={12} className="md:w-3.5 md:h-3.5" />
                    <span className="text-xs uppercase tracking-wide font-medium">เวลา</span>
                  </div>
                  <p className="text-sm md:text-base font-bold text-gray-900">{service.duration || '2 ชม.'}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <User size={12} className="md:w-3.5 md:h-3.5" />
                    <span className="text-xs uppercase tracking-wide font-medium">ช่าง</span>
                  </div>
                  <p className="text-sm md:text-base font-bold text-gray-900 truncate">{service.worker || '—'}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <span className="text-xs uppercase tracking-wide font-medium">ค่าบริการ</span>
                  </div>
                  <p className="text-sm md:text-base font-bold text-emerald-600">
                    {typeof service.cost === 'number' ? `฿${service.cost.toLocaleString()}` : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Before & After Images - Clean Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
              {/* Image Tabs */}
              <div className="flex border-b border-gray-100">
                <button
                  onClick={() => setImageView('before')}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
                    imageView === 'before'
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/30'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ก่อนดูแล
                </button>
                <button
                  onClick={() => setImageView('after')}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition ${
                    imageView === 'after'
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/30'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  หลังดูแล
                </button>
              </div>

              {/* Image Viewer */}
              <div className="relative bg-gray-100">
                <div className="aspect-video relative">
                  {currentImages.length > 0 ? (
                    <img
                      src={currentImages[selectedImageIndex]}
                      alt={`${imageView} ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                      ไม่มีรูปภาพ
                    </div>
                  )}
                  
                  {/* Navigation Arrows */}
                  {currentImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 hover:bg-white flex items-center justify-center transition shadow-lg"
                      >
                        <ChevronLeft size={16} className="text-gray-900" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 hover:bg-white flex items-center justify-center transition shadow-lg"
                      >
                        <ChevronRight size={16} className="text-gray-900" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {currentImages.length > 0 && (
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-lg">
                      <span className="text-xs font-semibold text-white">
                        {selectedImageIndex + 1} / {currentImages.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {currentImages.length > 1 && (
                  <div className="p-3 bg-white flex gap-2 overflow-x-auto scrollbar-hide">
                    {currentImages.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-16 h-16 md:w-18 md:h-18 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                          selectedImageIndex === idx
                            ? 'border-emerald-500 ring-2 ring-emerald-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tasks & Materials Grid - Clean 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              
              {/* Tasks Completed */}
              <div className="bg-white rounded-2xl p-3 md:p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    งานที่ทำเสร็จ
                  </h3>
                  <span className="ml-auto text-xs font-semibold text-gray-400">
                    {tasksList.length}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {tasksList.map((task: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs md:text-sm text-gray-700"
                    >
                      <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                      </div>
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Materials Used */}
              <div className="bg-white rounded-2xl p-3 md:p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Package size={16} className="text-emerald-600" />
                  <h3 className="text-sm font-bold text-gray-900">
                    วัสดุที่ใช้
                  </h3>
                </div>
                <div className="space-y-2">
                  {materialsList.map((material: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-1.5"
                    >
                      <span className="text-xs md:text-sm text-gray-700">
                        {material.name}
                      </span>
                      <span className="text-xs md:text-sm font-semibold text-gray-900">
                        {material.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Technician Notes - Clean */}
            <div className="bg-white rounded-2xl p-3 md:p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2.5">
                <FileText size={16} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-gray-900">
                  บันทึกจากช่าง
                </h3>
              </div>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {technicianNote}
              </p>
            </div>

            {/* Recommendations - Clean */}
            <div className="bg-emerald-50 rounded-2xl p-3 md:p-4 border border-emerald-100">
              <h3 className="text-sm font-bold text-emerald-900 mb-2.5">
                คำแนะนำ
              </h3>
              <div className="space-y-1.5">
                {recommendations.map((rec: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-xs md:text-sm text-emerald-800"
                  >
                    <span className="text-emerald-600 font-bold flex-shrink-0 mt-0.5">
                      •
                    </span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Clean */}
        <div className="p-3 md:p-4 border-t border-gray-100 bg-white flex-shrink-0">
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl text-sm font-semibold transition"
            >
              ปิด
            </button>
            <button className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2">
              <Download size={16} />
              <span>ดาวน์โหลด</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
