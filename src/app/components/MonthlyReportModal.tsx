import React, { useState } from 'react';
import {
  X,
  Calendar,
  Leaf,
  TrendingUp,
  DollarSign,
  Download,
  CheckCircle2,
  Clock,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyReportModalProps {
  month: string;
  year: string;
  data: any;
  onClose: () => void;
}

export const MonthlyReportModal: React.FC<MonthlyReportModalProps> = ({
  month,
  year,
  data,
  onClose,
}) => {
  const monthlyData = {
    totalServices: typeof data?.totalServices === 'number' ? data.totalServices : 0,
    totalCost: typeof data?.totalCost === 'number' ? data.totalCost : 0,
    totalHours: typeof data?.totalHours === 'number' ? data.totalHours : 0,
    healthScore: typeof data?.healthScore === 'number' ? data.healthScore : 0,
    healthImprovement: typeof data?.healthImprovement === 'number' ? data.healthImprovement : 0,
    servicesCompleted: Array.isArray(data?.servicesCompleted) ? data.servicesCompleted : [],
    weeklyProgress: Array.isArray(data?.weeklyProgress) ? data.weeklyProgress : [],
    topTasks: Array.isArray(data?.topTasks) ? data.topTasks : [],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-0 md:p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-5xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 flex-shrink-0 bg-white">
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Calendar size={20} className="text-emerald-600 md:w-6 md:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-xl font-bold text-gray-900">
                รายงานประจำเดือน
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                {month} {year}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 md:p-6 space-y-3 md:space-y-4">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-0.5">จำนวนบริการ</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{monthlyData.totalServices}</p>
              </div>

              <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <DollarSign size={14} className="text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-0.5">ค่าใช้จ่ายรวม</p>
                <p className="text-xl md:text-2xl font-bold text-emerald-600">
                  ฿{monthlyData.totalCost.toLocaleString()}
                </p>
              </div>

              <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Clock size={14} className="text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-0.5">เวลารวม</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{monthlyData.totalHours} ชม.</p>
              </div>

              <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Leaf size={14} className="text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-0.5">คะแนนสุขภาพ</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{monthlyData.healthScore}</p>
              </div>
            </div>

            {/* Health Progress Chart */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">แนวโน้มสุขภาพสวน</h3>
                <div className="flex items-center gap-1 text-emerald-600">
                  <TrendingUp size={14} />
                  <span className="text-xs font-semibold">+{monthlyData.healthImprovement}%</span>
                </div>
              </div>
              <div className="h-48 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData.weeklyProgress} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="week"
                      tick={{ fill: '#9ca3af', fontSize: 11 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      tick={{ fill: '#9ca3af', fontSize: 11 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      domain={[80, 95]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Services List */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3">บริการที่ทำในเดือนนี้</h3>
              <div className="space-y-2">
                {monthlyData.servicesCompleted.map((service: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition group cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-900">{service.date}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{service.duration}</span>
                      </div>
                      <p className="text-sm text-gray-700">{service.type}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-600">
                          ฿{service.cost.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">{service.tasks} งาน</p>
                      </div>
                      <ArrowRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Tasks */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3">งานที่ทำบ่อยที่สุด</h3>
              <div className="space-y-2">
                {monthlyData.topTasks.map((task: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{task.name}</span>
                        <span className="text-xs font-semibold text-gray-500">{task.count} ครั้ง</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${(task.count / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Note */}
            <div className="bg-emerald-50 rounded-2xl p-4 md:p-5 border border-emerald-100">
              <h3 className="text-sm font-bold text-emerald-900 mb-2">สรุป</h3>
              <p className="text-sm text-emerald-800 leading-relaxed">
                ในเดือนนี้สวนของคุณมีสุขภาพดีขึ้น <span className="font-bold">{monthlyData.healthImprovement}%</span> เมื่อเทียบกับเดือนที่แล้ว 
                มีการดูแลรักษาสม่ำเสมอ <span className="font-bold">{monthlyData.totalServices} ครั้ง</span> ใช้เวลารวม <span className="font-bold">{monthlyData.totalHours} ชั่วโมง</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
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
