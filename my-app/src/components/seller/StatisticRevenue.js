import React, { useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  FaChartLine, FaMoneyBillWave, FaShoppingCart, FaPercentage, 
  FaCalendarAlt, FaDownload, FaPrint, FaFilter, FaEllipsisH,
  FaArrowUp, FaArrowDown, FaEquals
} from 'react-icons/fa';

const StatisticRevenue = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [compareWith, setCompareWith] = useState('lastPeriod');

  // Mock data - would be replaced with actual API data
  const revenueData = [
    { name: '01/07', revenue: 12500000, orders: 45, lastPeriod: 11000000 },
    { name: '02/07', revenue: 13200000, orders: 48, lastPeriod: 12000000 },
    { name: '03/07', revenue: 14800000, orders: 52, lastPeriod: 13500000 },
    { name: '04/07', revenue: 11900000, orders: 41, lastPeriod: 12800000 },
    { name: '05/07', revenue: 15600000, orders: 56, lastPeriod: 14200000 },
    { name: '06/07', revenue: 16800000, orders: 62, lastPeriod: 15000000 },
    { name: '07/07', revenue: 18200000, orders: 67, lastPeriod: 16500000 },
    { name: '08/07', revenue: 17500000, orders: 63, lastPeriod: 17000000 },
    { name: '09/07', revenue: 19800000, orders: 72, lastPeriod: 18200000 },
    { name: '10/07', revenue: 21500000, orders: 78, lastPeriod: 19500000 },
    { name: '11/07', revenue: 20200000, orders: 74, lastPeriod: 20800000 },
    { name: '12/07', revenue: 22800000, orders: 83, lastPeriod: 21000000 },
    { name: '13/07', revenue: 24500000, orders: 89, lastPeriod: 22500000 },
    { name: '14/07', revenue: 23200000, orders: 85, lastPeriod: 23000000 },
  ];

  const paymentMethodData = [
    { name: 'Thẻ tín dụng', value: 45 },
    { name: 'Chuyển khoản', value: 30 },
    { name: 'Ví điện tử', value: 15 },
    { name: 'COD', value: 10 },
  ];

  const categoryRevenueData = [
    { name: 'Áo', revenue: 125000000 },
    { name: 'Quần', revenue: 98000000 },
    { name: 'Giày', revenue: 78500000 },
    { name: 'Túi xách', revenue: 45200000 },
    { name: 'Phụ kiện', revenue: 32800000 },
  ];

  const monthlyRevenueData = [
    { name: 'T1', revenue: 320000000 },
    { name: 'T2', revenue: 345000000 },
    { name: 'T3', revenue: 378000000 },
    { name: 'T4', revenue: 412000000 },
    { name: 'T5', revenue: 389000000 },
    { name: 'T6', revenue: 425000000 },
    { name: 'T7', revenue: 456000000 },
  ];

  // Refined color palette
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e'];
  const CHART_COLORS = {
    revenue: '#6366f1',
    lastPeriod: '#94a3b8',
    area: 'rgba(99, 102, 241, 0.1)'
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Calculate total revenue
  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
  const averageOrderValue = totalRevenue / totalOrders;
  const totalLastPeriod = revenueData.reduce((sum, item) => sum + item.lastPeriod, 0);
  const revenueGrowth = ((totalRevenue - totalLastPeriod) / totalLastPeriod) * 100;

  // Helper function to render trend icon
  const renderTrendIcon = (value) => {
    if (value > 0) {
      return <FaArrowUp className="text-green-500" />;
    } else if (value < 0) {
      return <FaArrowDown className="text-red-500" />;
    }
    return <FaEquals className="text-gray-500" />;
  };

  return (
    <div className="p-8 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Thống kê doanh thu</h1>
          <p className="text-gray-500 mt-1">Phân tích doanh thu và hiệu quả kinh doanh</p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <select 
              className="appearance-none pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">7 ngày qua</option>
              <option value="month">30 ngày qua</option>
              <option value="quarter">Quý này</option>
              <option value="year">Năm nay</option>
            </select>
            <FaCalendarAlt className="absolute left-3.5 top-3 text-gray-400" />
          </div>
          <div className="flex space-x-2">
            <button className="p-2.5 text-gray-600 hover:text-indigo-600 bg-white border border-gray-200 rounded-lg shadow-sm transition-all">
              <FaDownload />
            </button>
            <button className="p-2.5 text-gray-600 hover:text-indigo-600 bg-white border border-gray-200 rounded-lg shadow-sm transition-all">
              <FaPrint />
            </button>
          </div>
          <button className="px-4 py-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg text-sm hover:bg-indigo-100 transition-all shadow-sm flex items-center">
            <FaFilter className="mr-2" /> Lọc nâng cao
          </button>
        </div>
      </div>

      {/* Overview metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng doanh thu</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(totalRevenue)}</h3>
              <div className="flex items-center mt-2">
                <span className={`text-xs font-medium px-1.5 py-0.5 rounded flex items-center gap-1 ${
                  revenueGrowth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {renderTrendIcon(revenueGrowth)}
                  {Math.abs(revenueGrowth).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 ml-1.5">so với kỳ trước</span>
              </div>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <FaMoneyBillWave className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng đơn hàng</p>
              <h3 className="text-2xl font-bold text-gray-800">{totalOrders}</h3>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded flex items-center gap-1">
                  <FaArrowUp />
                  8.3%
                </span>
                <span className="text-xs text-gray-500 ml-1.5">so với kỳ trước</span>
              </div>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <FaShoppingCart className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Giá trị đơn trung bình</p>
              <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(averageOrderValue)}</h3>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded flex items-center gap-1">
                  <FaArrowUp />
                  2.5%
                </span>
                <span className="text-xs text-gray-500 ml-1.5">so với kỳ trước</span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <FaChartLine className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tỷ lệ lợi nhuận</p>
              <h3 className="text-2xl font-bold text-gray-800">24.8%</h3>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded flex items-center gap-1">
                  <FaArrowUp />
                  1.2%
                </span>
                <span className="text-xs text-gray-500 ml-1.5">so với kỳ trước</span>
              </div>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <FaPercentage className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Revenue trend chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Xu hướng doanh thu</h2>
            <p className="text-sm text-gray-500 mt-1">So sánh doanh thu với kỳ trước</p>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 bg-white shadow-sm"
              value={compareWith}
              onChange={(e) => setCompareWith(e.target.value)}
            >
              <option value="lastPeriod">So sánh với kỳ trước</option>
              <option value="lastYear">So sánh với cùng kỳ năm trước</option>
              <option value="target">So sánh với mục tiêu</option>
            </select>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.revenue} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={CHART_COLORS.revenue} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" stroke="#888" axisLine={false} tickLine={false} />
              <YAxis stroke="#888" axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
                  border: 'none',
                  padding: '12px'
                }}
                formatter={(value) => [formatCurrency(value), 'Doanh thu']}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                formatter={(value) => value === 'revenue' ? 'Doanh thu hiện tại' : 'Doanh thu kỳ trước'} 
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke={CHART_COLORS.revenue} 
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }} 
              />
              <Area 
                type="monotone" 
                dataKey="lastPeriod" 
                stroke={CHART_COLORS.lastPeriod} 
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment methods and category revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Phương thức thanh toán</h2>
            <p className="text-sm text-gray-500 mt-1">Phân bố theo phương thức thanh toán</p>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Tỷ lệ']}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
                    border: 'none',
                    padding: '12px'
                  }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Doanh thu theo danh mục</h2>
            <p className="text-sm text-gray-500 mt-1">Phân tích doanh thu theo từng danh mục</p>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryRevenueData}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" stroke="#888" axisLine={false} tickLine={false} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#888" 
                  axisLine={false} 
                  tickLine={false}
                  width={80}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
                    border: 'none',
                    padding: '12px'
                  }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill={CHART_COLORS.revenue} 
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly revenue chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Doanh thu theo tháng</h2>
          <p className="text-sm text-gray-500 mt-1">Phân tích xu hướng doanh thu theo tháng</p>
        </div>
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyRevenueData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              barSize={40}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS[0]} stopOpacity={1}/>
                  <stop offset="100%" stopColor={COLORS[1]} stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#888" 
                axisLine={false} 
                tickLine={false}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                stroke="#888" 
                axisLine={false} 
                tickLine={false}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)', 
                  border: 'none',
                  padding: '12px'
                }}
              />
              <Bar 
                dataKey="revenue" 
                fill="url(#barGradient)" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue breakdown table */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Chi tiết doanh thu</h2>
          <p className="text-sm text-gray-500 mt-1">Phân tích chi tiết doanh thu và lợi nhuận</p>
        </div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nguồn doanh thu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doanh thu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chi phí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lợi nhuận
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tỷ suất lợi nhuận
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-gray-50 transition-all duration-150">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-800">Sản phẩm</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-800">{formatCurrency(325000000)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{formatCurrency(243750000)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-green-600">{formatCurrency(81250000)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-800">25.0%</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaEllipsisH />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-all duration-150">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-800">Phí vận chuyển</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-800">{formatCurrency(45000000)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{formatCurrency(38250000)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-green-600">{formatCurrency(6750000)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-800">15.0%</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaEllipsisH />
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-all duration-150">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-800">Dịch vụ bổ sung</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-800">{formatCurrency(18500000)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-600">{formatCurrency(7400000)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-green-600">{formatCurrency(11100000)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-800">60.0%</div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaEllipsisH />
                  </button>
                </td>
              </tr>
              <tr className="bg-gray-50 font-medium">
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-800">Tổng cộng</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-800">{formatCurrency(388500000)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-800">{formatCurrency(289400000)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-green-600">{formatCurrency(99100000)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-gray-800">25.5%</div>
                </td>
                <td className="px-6 py-4 text-right">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatisticRevenue;
