import React, { useState } from 'react';
import {
  Star,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Calendar,
  List,
} from 'lucide-react';

interface CustomerHistoryProps {
  customer: any;
  onViewService?: (service: any) => void;
}

export const CustomerHistory: React.FC<CustomerHistoryProps> = ({ 
  customer, 
  onViewService 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Get month and year
  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  // Mock service data mapped to dates
  const getServicesForDate = (day: number) => {
    return customer.serviceHistory?.filter((service: any) => {
      // Parse date from service (format: "25 ม.ค. 2567")
      const serviceDay = parseInt(service.date.split(' ')[0]);
      return serviceDay === day;
    }) || [];
  };

  // Build calendar grid
  const calendarDays = [];
  
  // Empty cells before first day
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;

  return (
    <div className="space-y-3 md:space-y-4 animate-fade-in pb-20 md:pb-8 max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              ประวัติการดูแล
            </h1>
            <p className="text-xs md:text-sm text-gray-500">
              ดูบริการที่ผ่านมาทั้งหมด
            </p>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'calendar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar size={14} className="inline mr-1" />
              ปฏิทิน
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List size={14} className="inline mr-1" />
              รายการ
            </button>
          </div>
        </div>

        {/* Month Navigation */}
        {viewMode === 'calendar' && (
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <h2 className="text-base md:text-lg font-bold text-gray-900">
              {monthNames[currentMonth]} {currentYear + 543}
            </h2>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-2xl p-3 md:p-5 border border-gray-100">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
            {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day, idx) => (
              <div
                key={idx}
                className="text-center text-xs font-semibold text-gray-400 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {calendarDays.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const services = getServicesForDate(day);
              const hasService = services.length > 0;
              const isToday = isCurrentMonth && today.getDate() === day;

              return (
                <button
                  key={day}
                  onClick={() => {
                    if (hasService && services[0]) {
                      onViewService?.(services[0]);
                    }
                  }}
                  className={`aspect-square rounded-xl p-1 md:p-2 flex flex-col items-center justify-center transition relative ${
                    isToday
                      ? 'bg-emerald-600 text-white font-bold'
                      : hasService
                      ? 'bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 cursor-pointer'
                      : 'bg-white hover:bg-gray-50 border border-gray-100'
                  }`}
                >
                  {/* Day Number */}
                  <span className={`text-xs md:text-sm font-semibold ${
                    isToday ? 'text-white' : hasService ? 'text-emerald-900' : 'text-gray-600'
                  }`}>
                    {day}
                  </span>

                  {/* Service Indicator */}
                  {hasService && !isToday && (
                    <div className="flex gap-0.5 mt-1">
                      {services.slice(0, 3).map((_: any, i: number) => (
                        <div
                          key={i}
                          className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-600"
                        />
                      ))}
                    </div>
                  )}

                  {/* Today indicator */}
                  {isToday && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full border-2 border-emerald-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-600" />
              <span className="text-xs text-gray-600">วันนี้</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-50 border-2 border-emerald-200" />
              <span className="text-xs text-gray-600">มีบริการ</span>
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {customer.serviceHistory?.map((service: any) => (
            <div 
              key={service.id}
              onClick={() => onViewService?.(service)}
              className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition cursor-pointer group"
            >
              <div className="flex gap-3 md:gap-4">
                {/* Image */}
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={service.images?.after?.[0] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"}
                    className="w-full h-full object-cover transition group-hover:scale-105"
                    alt="service"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                          {service.date}
                        </span>
                        {service.rating && (
                          <div className="flex items-center gap-0.5">
                            {[...Array(service.rating)].map((_: any, i: number) => (
                              <Star key={i} size={10} className="fill-emerald-500 text-emerald-500 md:w-3 md:h-3" />
                            ))}
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1 line-clamp-1">
                        {service.type}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 line-clamp-2">
                        {service.notes}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-base md:text-lg font-bold text-emerald-600">
                        ฿{service.cost?.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Tasks */}
                  {service.tasksCompleted && (
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-1.5">
                        {service.tasksCompleted.slice(0, 3).map((task: string, idx: number) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-md font-semibold"
                          >
                            {task}
                          </span>
                        ))}
                        {service.tasksCompleted.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md font-semibold">
                            +{service.tasksCompleted.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span className="truncate">{service.worker || 'ทีม A'}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{service.duration || '2 ชม.'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
