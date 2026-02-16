import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Leaf,
  Activity,
  Download,
  Filter,
  ChevronDown,
  FileText,
  BarChart3,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MonthlyReportModal } from './MonthlyReportModal';
import { AnnualReportModal } from './AnnualReportModal';

interface CustomerReportsProps {
  customer: any;
}

export const CustomerReports: React.FC<CustomerReportsProps> = ({ customer }) => {
  const [timeRange, setTimeRange] = useState('6months');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>(['all']);
  const [showMonthlyReport, setShowMonthlyReport] = useState(false);
  const [showAnnualReport, setShowAnnualReport] = useState(false);

  const serviceHistory: any[] = Array.isArray(customer?.serviceHistory) ? customer.serviceHistory : [];

  const { healthData, expenseData, filteredServices, monthsWindow } = React.useMemo(() => {
    const parseMaybeDate = (value: unknown): Date | null => {
      if (typeof value !== 'string') return null;
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? null : d;
    };

    const now = new Date();
    const windowMonths =
      timeRange === '1month' ? 1 :
      timeRange === '3months' ? 3 :
      timeRange === '6months' ? 6 :
      timeRange === '1year' ? 12 :
      null;

    const cutoff = windowMonths
      ? new Date(now.getFullYear(), now.getMonth() - windowMonths + 1, 1)
      : null;

    const filtered = serviceHistory.filter((s) => {
      if (!cutoff) return true;
      const d = parseMaybeDate(s?.date);
      if (!d) return false;
      return d >= cutoff;
    });

    const expenseMap = new Map<string, number>();
    for (const s of filtered) {
      const d = parseMaybeDate(s?.date);
      if (!d) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const cost = typeof s?.cost === 'number' ? s.cost : 0;
      expenseMap.set(key, (expenseMap.get(key) ?? 0) + cost);
    }

    const expense = Array.from(expenseMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }));

    return {
      healthData: [] as Array<{ month: string; score: number; target?: number }>,
      expenseData: expense,
      filteredServices: filtered,
      monthsWindow: windowMonths,
    };
  }, [serviceHistory, timeRange]);

  // Calculate total expense
  const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const avgScore = healthData.length
    ? (healthData.reduce((sum, item) => sum + item.score, 0) / healthData.length).toFixed(1)
    : '0.0';

  // Download report handler
  const handleDownloadReport = () => {
    const reportData = {
      customer: customer?.name,
      timeRange: timeRange,
      totalExpense: totalExpense,
      avgScore: avgScore,
      servicesCount: filteredServices.length,
      generatedAt: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `garden-report-${timeRange}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const serviceTypePalette = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];
  const serviceTypeData = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of filteredServices) {
      const key = typeof s?.type === 'string' && s.type.trim() ? s.type.trim() : 'อื่นๆ';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const entries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((sum, [, c]) => sum + c, 0);
    return entries.map(([name, value], idx) => ({
      name,
      value: total > 0 ? Math.round((value / total) * 100) : 0,
      color: serviceTypePalette[idx % serviceTypePalette.length],
    }));
  }, [filteredServices]);

  const now = new Date();
  const monthLabel = now.toLocaleString('th-TH', { month: 'long' });
  const yearLabel = String(now.getFullYear() + 543);

  const monthlyModalData = {
    totalServices: filteredServices.length,
    totalCost: totalExpense,
    totalHours: null,
    healthScore: null,
    healthImprovement: null,
    servicesCompleted: filteredServices.slice(0, 20).map((s: any) => ({
      date: s?.date ?? '',
      type: s?.type ?? '',
      cost: typeof s?.cost === 'number' ? s.cost : 0,
      duration: s?.duration ?? '',
      tasks: Array.isArray(s?.tasksCompleted) ? s.tasksCompleted.length : undefined,
    })),
    weeklyProgress: [],
    topTasks: [],
  };

  const annualModalData = {
    totalServices: filteredServices.length,
    totalCost: totalExpense,
    healthScoreAvg: Number(avgScore),
    monthsWindow,
  };

  // Stats cards data
  const stats = [
    {
      label: 'ค่าใช้จ่ายรวม',
      value: `฿${totalExpense.toLocaleString()}`,
      change: '—',
      trend: 'neutral',
      icon: DollarSign,
    },
    {
      label: 'คะแนนสุขภาพเฉลี่ย',
      value: avgScore,
      change: '—',
      trend: 'neutral',
      icon: Leaf,
    },
    {
      label: 'จำนวนบริการ',
      value: String(filteredServices.length),
      change: '—',
      trend: 'neutral',
      icon: Activity,
    },
    {
      label: 'ความถี่การดูแล',
      value: monthsWindow ? `${(filteredServices.length / Math.max(monthsWindow, 1)).toFixed(1)}x/เดือน` : '—',
      change: '—',
      trend: 'neutral',
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in pb-24 md:pb-8 max-w-full overflow-hidden">
      {/* Header with Actions */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-8">
          <div>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
              รายงานและสถิติ
            </h1>
            <p className="text-xs md:text-base text-gray-500">
              ภาพรวมการดูแลสวนของคุณ
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilterModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 rounded-lg transition text-xs font-semibold text-gray-700"
            >
              <Filter size={14} />
              <span>กรอง</span>
            </button>
            <button 
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition text-xs font-semibold"
            >
              <Download size={14} />
              <span className="hidden sm:inline">ดาวน์โหลด</span>
            </button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: '1month', label: '1 เดือน' },
            { id: '3months', label: '3 เดือน' },
            { id: '6months', label: '6 เดือน' },
            { id: '1year', label: '1 ปี' },
            { id: 'all', label: 'ทั้งหมด' },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex-shrink-0 ${
                timeRange === range.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 border border-gray-100 hover:border-emerald-200 transition"
          >
            <div className="flex items-start justify-between mb-2 md:mb-4">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <stat.icon size={14} className="text-emerald-600 md:w-[18px] md:h-[18px]" />
              </div>
              {stat.trend !== 'neutral' && (
                <div
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                    stat.trend === 'up'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <TrendingUp size={10} className="md:w-3 md:h-3" />
                  ) : (
                    <TrendingDown size={10} className="md:w-3 md:h-3" />
                  )}
                  <span className="hidden sm:inline">{stat.change}</span>
                </div>
              )}
            </div>
            <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-1">
              {stat.label}
            </p>
            <p className="text-base md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Health Score Trend - Line Chart */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-100 overflow-hidden">
        <div className="mb-4 md:mb-8">
          <h2 className="text-base md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
            แนวโน้มคะแนนสุขภาพสวน
          </h2>
          <p className="text-xs md:text-sm text-gray-500">
            เปรียบเทียบคะแนนจริงกับเป้าหมาย
          </p>
        </div>
        <div className="h-48 md:h-80 -mx-2 md:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={healthData} margin={{ left: -20, right: 10, top: 5, bottom: 5 }}>
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
              />
              <Legend
                wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                iconType="circle"
                iconSize={8}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 3 }}
                activeDot={{ r: 5 }}
                name="คะแนนจริง"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#d1d5db"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#9ca3af', r: 2 }}
                name="เป้าหมาย"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense & Service Type - 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Monthly Expenses - Bar Chart */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-100 overflow-hidden">
          <div className="mb-4 md:mb-8">
            <h2 className="text-base md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
              ค่าใช้จ่ายรายเดือน
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              ประจำ 6 เดือนที่ผ่านมา
            </p>
          </div>
          <div className="h-48 md:h-80 -mx-2 md:mx-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData} margin={{ left: -20, right: 10, top: 5, bottom: 5 }}>
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
                  dataKey="amount"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Type Distribution - Pie Chart */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 border border-gray-100 overflow-hidden">
          <div className="mb-4 md:mb-8">
            <h2 className="text-base md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
              สัดส่วนประเภทบริการ
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              การแบ่งประเภทบริการทั้งหมด
            </p>
          </div>
          <div className="h-48 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  style={{ fontSize: '11px' }}
                >
                  {serviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-1 gap-2 mt-4 md:mt-6">
            {serviceTypeData.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div
                    className="w-3 h-3 md:w-4 md:h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs md:text-sm font-semibold text-gray-900">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs md:text-sm font-bold text-gray-900">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl md:rounded-3xl p-4 md:p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4">
          <div className="flex-1">
            <h2 className="text-base md:text-2xl font-bold mb-1 md:mb-2">
              {filteredServices.length > 0
                ? `สรุปช่วงนี้: ${filteredServices.length} บริการ` 
                : 'ยังไม่มีข้อมูลรายงาน'}
            </h2>
            <p className="text-xs md:text-base text-emerald-50 opacity-90">
              {filteredServices.length > 0
                ? `ค่าใช้จ่ายรวม ฿${totalExpense.toLocaleString()} (ช่วง ${timeRange})`
                : 'เมื่อเริ่มมีประวัติการให้บริการ/เอกสาร ระบบจะแสดงสถิติที่นี่'}
            </p>
          </div>
          <button className="w-full md:w-auto px-5 py-2.5 bg-white text-emerald-600 rounded-xl text-sm font-semibold hover:bg-emerald-50 transition whitespace-nowrap">
            ดูคำแนะนำ
          </button>
        </div>
      </div>

      {/* Report Shortcuts - Clean Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <button
          onClick={() => setShowMonthlyReport(true)}
          className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition text-left group"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center flex-shrink-0 transition">
              <FileText size={20} className="text-emerald-600 md:w-6 md:h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-0.5">
                รายงานรายเดือน
              </h3>
              <p className="text-xs md:text-sm text-gray-500">
                สรุปการดูแลสวนแบบรายเดือน
              </p>
            </div>
            <div className="text-emerald-600 group-hover:translate-x-1 transition">
              <ChevronDown size={18} className="rotate-[-90deg]" />
            </div>
          </div>
        </button>

        <button
          onClick={() => setShowAnnualReport(true)}
          className="bg-white rounded-2xl p-4 md:p-6 border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition text-left group"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center flex-shrink-0 transition">
              <BarChart3 size={20} className="text-emerald-600 md:w-6 md:h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm md:text-base font-bold text-gray-900 mb-0.5">
                รายงานรายปี
              </h3>
              <p className="text-xs md:text-sm text-gray-500">
                สรุปผลการดูแลสวนทั้งปี
              </p>
            </div>
            <div className="text-emerald-600 group-hover:translate-x-1 transition">
              <ChevronDown size={18} className="rotate-[-90deg]" />
            </div>
          </div>
        </button>
      </div>

      {/* Modals */}
      {showMonthlyReport && (
        <MonthlyReportModal
          month={monthLabel}
          year={yearLabel}
          data={monthlyModalData}
          onClose={() => setShowMonthlyReport(false)}
        />
      )}

      {showAnnualReport && (
        <AnnualReportModal
          year={yearLabel}
          data={annualModalData}
          onClose={() => setShowAnnualReport(false)}
        />
      )}
    </div>
  );
};