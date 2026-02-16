import React from 'react';
import {
  X,
  Calendar,
  Leaf,
  TrendingUp,
  DollarSign,
  Download,
  CheckCircle2,
  Clock,
  Award,
  Target,
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

interface AnnualReportModalProps {
  year: string;
  data: any;
  onClose: () => void;
}

export const AnnualReportModal: React.FC<AnnualReportModalProps> = ({
  year,
  data,
  onClose,
}) => {
  const annualData = {
    totalServices: typeof data?.totalServices === 'number' ? data.totalServices : 0,
    totalCost: typeof data?.totalCost === 'number' ? data.totalCost : 0,
    totalHours: typeof data?.totalHours === 'number' ? data.totalHours : 0,
    healthScore: typeof data?.healthScore === 'number' ? data.healthScore : 0,
    healthImprovement: typeof data?.healthImprovement === 'number' ? data.healthImprovement : 0,
    startHealthScore: typeof data?.startHealthScore === 'number' ? data.startHealthScore : 0,
    monthlyData: Array.isArray(data?.monthlyData) ? data.monthlyData : [],
    achievements: Array.isArray(data?.achievements) ? data.achievements : [],
    topServices: Array.isArray(data?.topServices) ? data.topServices : [],
    seasonalInsights: Array.isArray(data?.seasonalInsights) ? data.seasonalInsights : [],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-0 md:p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-6xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 flex-shrink-0 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
              <Award size={20} className="text-white md:w-6 md:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-xl font-bold text-gray-900">
                รายงานประจำปี
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                สรุปผลการดูแลสวนปี {year}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl hover:bg-white/80 flex items-center justify-center transition flex-shrink-0"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4 md:p-6 space-y-3 md:space-y-4">
            
            {/* Hero Summary */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 md:p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg md:text-2xl font-bold mb-2">
                    สวนของคุณเติบโตได้ดีมาก! 🌿
                  </h3>
                  <p className="text-sm md:text-base text-emerald-50 opacity-90">
                    คะแนนสุขภาพเพิ่มขึ้น <span className="font-bold">{annualData.healthImprovement}%</span> จาก {annualData.startHealthScore} เป็น {annualData.healthScore} คะแนน
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs text-emerald-100 mb-1">บริการทั้งหมด</p>
                  <p className="text-xl md:text-2xl font-bold">{annualData.totalServices}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs text-emerald-100 mb-1">ค่าใช้จ่าย</p>
                  <p className="text-xl md:text-2xl font-bold">฿{(annualData.totalCost / 1000).toFixed(0)}k</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-xs text-emerald-100 mb-1">เวลารวม</p>
                  <p className="text-xl md:text-2xl font-bold">{annualData.totalHours} ชม.</p>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
              {annualData.achievements.map((achievement: any, idx: number) => (
                <div key={idx} className="bg-white rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Target size={14} className="text-emerald-600" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{achievement.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{achievement.value}</p>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                </div>
              ))}
            </div>

            {/* Annual Health Trend */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">แนวโน้มสุขภาพสวนตลอดปี</h3>
                  <p className="text-xs text-gray-500 mt-0.5">คะแนนสุขภาพรายเดือน</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <TrendingUp size={14} />
                  <span className="text-xs font-semibold">+{annualData.healthImprovement}%</span>
                </div>
              </div>
              <div className="h-56 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={annualData.monthlyData} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      tick={{ fill: '#9ca3af', fontSize: 10 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      domain={[65, 95]}
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
                      dataKey="health"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Cost & Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              
              {/* Monthly Cost */}
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-3">ค่าใช้จ่ายรายเดือน</h3>
                <div className="h-48 -mx-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={annualData.monthlyData} margin={{ left: -20, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <YAxis
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '12px',
                        }}
                        formatter={(value: any) => [`฿${value.toLocaleString()}`, 'ค่าใช้จ่าย']}
                      />
                      <Bar
                        dataKey="cost"
                        fill="#10b981"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Services */}
              <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 mb-3">บริการยอดนิยม</h3>
                <div className="space-y-3">
                  {annualData.topServices.map((service: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-gray-700">{service.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{service.count} ครั้ง</span>
                          <span className="text-xs font-semibold text-emerald-600">{service.percent}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: `${service.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-900">รวมทั้งหมด</span>
                    <span className="font-bold text-emerald-600">{annualData.totalServices} บริการ</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seasonal Insights */}
            <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-3">สรุปตามฤดูกาล</h3>
              <div className="space-y-3">
                {annualData.seasonalInsights.map((insight: any, idx: number) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Leaf size={14} className="text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-900 mb-1">{insight.season}</h4>
                        <p className="text-xs text-gray-600 mb-1">{insight.highlight}</p>
                        <p className="text-xs text-emerald-600 font-medium">💡 {insight.tips}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Summary */}
            <div className="bg-emerald-50 rounded-2xl p-4 md:p-5 border border-emerald-100">
              <h3 className="text-sm font-bold text-emerald-900 mb-2">สรุปปี {year}</h3>
              <p className="text-sm text-emerald-800 leading-relaxed">
                ปีนี้สวนของคุณมีการพัฒนาที่ยอดเยี่ยม! คะแนนสุขภาพเพิ่มขึ้นอย่างต่อเนื่องจาก <span className="font-bold">{annualData.startHealthScore}</span> เป็น <span className="font-bold">{annualData.healthScore}</span> คะแนน 
                มีการดูแลรักษาสม่ำเสมอตลอดทั้งปี <span className="font-bold">{annualData.totalServices} ครั้ง</span> ใช้เวลารวม <span className="font-bold">{annualData.totalHours} ชั่วโมง</span> 
                แนะนำให้ดูแลต่อเนื่องในปีหน้าเพื่อรักษาคุณภาพสวนให้คงที่
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
              <span>ดาวน์โหลด PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
