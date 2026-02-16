import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  MessageSquare,
  X,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Trash2,
  ChevronRight,
} from 'lucide-react';

interface CustomerAppointmentsProps {
  customer: any;
}

export const CustomerAppointments: React.FC<CustomerAppointmentsProps> = ({ customer }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      date: '2 ก.พ. 2567',
      fullDate: 'วันศุกร์ที่ 2 กุมภาพันธ์ 2567',
      time: '09:00 - 11:00 น.',
      type: 'บริการดูแลสวนรายสัปดาห์',
      status: 'confirmed',
      worker: 'ทีม A - คุณสมชาย',
      workerPhone: '081-234-5678',
      location: customer.properties?.[0]?.name || 'บ้านในเมือง',
      address: customer.properties?.[0]?.address || '123 ถนนสุขุมวิท',
      tasks: ['ตัดหญ้า', 'รดน้ำ', 'ตัดแต่งพุ่มไม้', 'กำจัดวัชพืช'],
      estimatedCost: 2500,
      notes: 'โปรดเตรียมพื้นที่จอดรถสำหรับรถบริการ',
    },
    {
      id: 2,
      date: '9 ก.พ. 2567',
      fullDate: 'วันศุกร์ที่ 9 กุมภาพันธ์ 2567',
      time: '09:00 - 11:00 น.',
      type: 'บริการดูแลสวนรายสัปดาห์',
      status: 'pending',
      worker: 'รอยืนยันช่าง',
      workerPhone: '-',
      location: customer.properties?.[0]?.name || 'บ้านในเมือง',
      address: customer.properties?.[0]?.address || '123 ถนนสุขุมวิท',
      tasks: ['ตัดหญ้า', 'รดน้ำ', 'ใส่ปุ๋ย'],
      estimatedCost: 2500,
      notes: '',
    },
    {
      id: 3,
      date: '16 ก.พ. 2567',
      fullDate: 'วันศุกร์ที่ 16 กุมภาพันธ์ 2567',
      time: '09:00 - 11:00 น.',
      type: 'บริการดูแลสวนรายสัปดาห์',
      status: 'pending',
      worker: 'รอยืนยันช่าง',
      workerPhone: '-',
      location: customer.properties?.[0]?.name || 'บ้านในเมือง',
      address: customer.properties?.[0]?.address || '123 ถนนสุขุมวิท',
      tasks: ['ตัดหญ้า', 'รดน้ำ'],
      estimatedCost: 2500,
      notes: '',
    },
  ];

  const handleCancelAppointment = () => {
    alert('✅ ยกเลิกนัดหมายเรียบร้อยแล้ว');
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  const handleReschedule = () => {
    alert('✅ เปลี่ยนนัดหมายเรียบร้อยแล้ว');
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="space-y-3 md:space-y-4 animate-fade-in pb-20 md:pb-8 max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
          นัดหมายของคุณ
        </h1>
        <p className="text-xs md:text-sm text-gray-500">
          จัดการและดูนัดหมายทั้งหมด
        </p>
      </div>

      {/* Next Appointment - Featured Card */}
      {upcomingAppointments[0] && (
        <div>
          <h2 className="text-sm font-bold text-gray-900 mb-2 px-1">
            นัดหมายครั้งถัดไป
          </h2>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 md:p-6 text-white shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={18} className="md:w-5 md:h-5" />
                  <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
                    นัดหมายใกล้สุด
                  </span>
                </div>
                <h3 className="text-xl md:text-3xl font-bold mb-1">
                  {upcomingAppointments[0].date}
                </h3>
                <p className="text-sm md:text-base text-emerald-50 flex items-center gap-1.5">
                  <Clock size={14} className="md:w-4 md:h-4" />
                  {upcomingAppointments[0].time}
                </p>
              </div>
              {upcomingAppointments[0].status === 'confirmed' && (
                <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg flex items-center gap-1.5 flex-shrink-0">
                  <CheckCircle2 size={14} />
                  <span className="text-xs font-semibold">ยืนยันแล้ว</span>
                </div>
              )}
            </div>

            {/* Service Type */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 mb-3">
              <p className="text-xs text-emerald-100 mb-0.5">ประเภทบริการ</p>
              <p className="text-sm font-semibold">{upcomingAppointments[0].type}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-emerald-100 mb-1">
                  <MapPin size={12} />
                  <span className="text-xs">สถานที่</span>
                </div>
                <p className="text-sm font-semibold truncate">{upcomingAppointments[0].location}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-emerald-100 mb-1">
                  <User size={12} />
                  <span className="text-xs">ช่างผู้ดูแล</span>
                </div>
                <p className="text-sm font-semibold truncate">{upcomingAppointments[0].worker}</p>
              </div>
            </div>

            {/* Tasks Preview */}
            <div className="mb-4">
              <p className="text-xs text-emerald-100 mb-2">งานที่จะทำ</p>
              <div className="flex flex-wrap gap-1.5">
                {upcomingAppointments[0].tasks.slice(0, 3).map((task: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-md font-medium"
                  >
                    {task}
                  </span>
                ))}
                {upcomingAppointments[0].tasks.length > 3 && (
                  <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-md font-medium">
                    +{upcomingAppointments[0].tasks.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedAppointment(upcomingAppointments[0]);
                }}
                className="flex-1 px-4 py-2.5 bg-white text-emerald-600 rounded-xl text-sm font-semibold hover:bg-emerald-50 transition shadow-sm"
              >
                ดูรายละเอียด
              </button>
              <button
                onClick={() => {
                  setSelectedAppointment(upcomingAppointments[0]);
                  setShowRescheduleModal(true);
                }}
                className="px-4 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl text-sm font-semibold transition border border-white/20"
              >
                เปลี่ยนนัด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Appointments List */}
      <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100">
        <h3 className="text-sm md:text-base font-bold text-gray-900 mb-3 md:mb-4">
          นัดหมายทั้งหมด ({upcomingAppointments.length})
        </h3>
        <div className="space-y-2 md:space-y-3">
          {upcomingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              onClick={() => setSelectedAppointment(appointment)}
              className="p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                {/* Date Badge */}
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white border border-gray-200 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gray-500 font-medium">
                    {appointment.date.split(' ')[1]}
                  </span>
                  <span className="text-lg md:text-xl font-bold text-gray-900">
                    {appointment.date.split(' ')[0]}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm md:text-base font-bold text-gray-900 mb-0.5 truncate">
                        {appointment.type}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    {appointment.status === 'confirmed' ? (
                      <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-xs font-semibold flex-shrink-0">
                        ยืนยันแล้ว
                      </div>
                    ) : (
                      <div className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-xs font-semibold flex-shrink-0">
                        รอยืนยัน
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <MapPin size={12} />
                    <span className="truncate">{appointment.location}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-600">
                      ฿{appointment.estimatedCost.toLocaleString()}
                    </span>
                    <ChevronRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && !showCancelModal && !showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-0 md:p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedAppointment(null)}
          />

          <div className="relative bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 flex-shrink-0 bg-white">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <Calendar size={20} className="text-emerald-600 md:w-6 md:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base md:text-xl font-bold text-gray-900 truncate">
                    รายละเอียดนัดหมาย
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                    {selectedAppointment.fullDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center transition flex-shrink-0"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                
                {/* Status Banner */}
                {selectedAppointment.status === 'confirmed' ? (
                  <div className="bg-emerald-50 rounded-xl p-3 md:p-4 border border-emerald-200">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <CheckCircle2 size={18} />
                      <span className="text-sm font-semibold">นัดหมายได้รับการยืนยันแล้ว</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 rounded-xl p-3 md:p-4 border border-amber-200">
                    <div className="flex items-center gap-2 text-amber-700">
                      <AlertCircle size={18} />
                      <span className="text-sm font-semibold">รอยืนยันนัดหมายจากทีมงาน</span>
                    </div>
                  </div>
                )}

                {/* Basic Info */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Calendar size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">วันที่</p>
                      <p className="text-sm font-bold text-gray-900">{selectedAppointment.fullDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Clock size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">เวลา</p>
                      <p className="text-sm font-bold text-gray-900">{selectedAppointment.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">สถานที่</p>
                      <p className="text-sm font-bold text-gray-900">{selectedAppointment.location}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{selectedAppointment.address}</p>
                    </div>
                  </div>
                </div>

                {/* Service Type */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">ประเภทบริการ</h4>
                  <p className="text-sm text-gray-700">{selectedAppointment.type}</p>
                </div>

                {/* Worker Info */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">ข้อมูลช่างผู้ดูแล</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User size={14} className="text-gray-400" />
                      <span className="text-gray-700">{selectedAppointment.worker}</span>
                    </div>
                    {selectedAppointment.workerPhone !== '-' && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-gray-700">{selectedAppointment.workerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tasks */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-900 mb-2">งานที่จะทำ</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAppointment.tasks.map((task: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-lg font-semibold"
                      >
                        {task}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cost */}
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-900">ค่าบริการโดยประมาณ</span>
                    <span className="text-xl font-bold text-emerald-600">
                      ฿{selectedAppointment.estimatedCost.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {selectedAppointment.notes && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare size={14} className="text-gray-400" />
                      <h4 className="text-sm font-bold text-gray-900">หมายเหตุ</h4>
                    </div>
                    <p className="text-sm text-gray-600">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 md:p-5 border-t border-gray-100 bg-white flex-shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowRescheduleModal(true);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
                >
                  <Edit3 size={16} />
                  <span>เปลี่ยนนัดหมาย</span>
                </button>
                <button
                  onClick={() => {
                    setShowCancelModal(true);
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  <span>ยกเลิกนัดหมาย</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          />

          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 md:p-6">
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">ยกเลิกนัดหมาย?</h3>
              <p className="text-sm text-gray-600">
                คุณแน่ใจหรือไม่ว่าต้องการยกเลิกนัดหมายวันที่ {selectedAppointment.date}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl text-sm font-semibold transition"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={handleCancelAppointment}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition"
              >
                ยืนยันยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowRescheduleModal(false)}
          />

          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-5 md:p-6">
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                <Calendar size={24} className="text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">เปลี่ยนนัดหมาย</h3>
              <p className="text-sm text-gray-600">
                กรุณาติดต่อทีมงานเพื่อเปลี่ยนนัดหมาย
              </p>
            </div>

            <div className="space-y-2 mb-5">
              <a
                href="tel:0812345678"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-sm font-semibold transition"
              >
                <Phone size={16} />
                <span>โทร 081-234-5678</span>
              </a>
              <button
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold transition"
              >
                <MessageSquare size={16} />
                <span>ส่งข้อความ</span>
              </button>
            </div>

            <button
              onClick={() => setShowRescheduleModal(false)}
              className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl text-sm font-semibold transition"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
};