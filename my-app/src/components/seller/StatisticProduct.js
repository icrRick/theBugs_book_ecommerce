"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  FaBoxOpen,
  FaChartLine,
  FaChartPie,
  FaFilter,
  FaSearch,
  FaSortAmountDown,
  FaCalendarAlt,
  FaDownload,
  FaEllipsisH,
} from "react-icons/fa";

const StatisticProduct = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("sales");

  // Mock data - would be replaced with actual API data
  const topProducts = [
    {
      id: 1,
      name: "Áo thun nam cổ tròn",
      sku: "AT001",
      sales: 245,
      revenue: 12250000,
      stock: 56,
      category: "Áo",
    },
    {
      id: 2,
      name: "Quần jean nữ ống rộng",
      sku: "QJ002",
      sales: 189,
      revenue: 18900000,
      stock: 32,
      category: "Quần",
    },
    {
      id: 3,
      name: "Giày thể thao unisex",
      sku: "GT003",
      sales: 156,
      revenue: 23400000,
      stock: 18,
      category: "Giày",
    },
    {
      id: 4,
      name: "Túi xách nữ da thật",
      sku: "TX004",
      sales: 134,
      revenue: 26800000,
      stock: 24,
      category: "Túi xách",
    },
    {
      id: 5,
      name: "Đồng hồ nam dây da",
      sku: "DH005",
      sales: 98,
      revenue: 29400000,
      stock: 15,
      category: "Phụ kiện",
    },
  ];

  const salesTrendData = [
    { name: "T1", sales: 120, views: 1400 },
    { name: "T2", sales: 145, views: 1600 },
    { name: "T3", sales: 135, views: 1500 },
    { name: "T4", sales: 180, views: 2000 },
    { name: "T5", sales: 210, views: 2200 },
    { name: "T6", sales: 190, views: 2100 },
    { name: "T7", sales: 240, views: 2500 },
  ];

  const categoryData = [
    { name: "Áo", value: 35 },
    { name: "Quần", value: 25 },
    { name: "Giày", value: 20 },
    { name: "Túi xách", value: 12 },
    { name: "Phụ kiện", value: 8 },
  ];

  const inventoryStatusData = [
    { name: "Còn hàng", value: 65 },
    { name: "Sắp hết", value: 20 },
    { name: "Hết hàng", value: 15 },
  ];

  // Refined color palette
  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f97316"];
  const INVENTORY_COLORS = ["#10b981", "#f59e0b", "#ef4444"];
  const CHART_COLORS = {
    sales: "#6366f1",
    views: "#10b981",
    area: "rgba(99, 102, 241, 0.1)",
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="p-8 bg-white rounded-xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Thống kê sản phẩm
          </h1>
          <p className="text-gray-500 mt-1">
            Phân tích hiệu suất và xu hướng sản phẩm
          </p>
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
          <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-all shadow-sm flex items-center">
            <FaDownload className="mr-2 text-gray-500" /> Xuất báo cáo
          </button>
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
              <p className="text-sm text-gray-500 mb-1">Tổng sản phẩm</p>
              <h3 className="text-2xl font-bold text-gray-800">1,245</h3>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                  +3.2%
                </span>
                <span className="text-xs text-gray-500 ml-1.5">
                  so với tháng trước
                </span>
              </div>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
              <FaBoxOpen className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Sản phẩm đã bán</p>
              <h3 className="text-2xl font-bold text-gray-800">3,872</h3>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                  +5.7%
                </span>
                <span className="text-xs text-gray-500 ml-1.5">
                  so với tháng trước
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <FaChartLine className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Sản phẩm bán chạy nhất</p>
              <h3 className="text-2xl font-bold text-gray-800">8.4%</h3>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                  +1.2%
                </span>
                <span className="text-xs text-gray-500 ml-1.5">
                  so với tháng trước
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <FaChartPie className="text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 mb-1">Sản phẩm bán ít nhất</p>
              <h3 className="text-2xl font-bold text-gray-800">42,568</h3>
              <div className="flex items-center mt-2">
                <span className="text-xs font-medium px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                  +12.3%
                </span>
                <span className="text-xs text-gray-500 ml-1.5">
                  so với tháng trước
                </span>
              </div>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
              <FaSearch className="text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Sales trend chart */}
      {/* <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Xu hướng bán hàng
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Phân tích số lượng bán và lượt xem theo thời gian
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 bg-white shadow-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              <option value="ao">Áo</option>
              <option value="quan">Quần</option>
              <option value="giay">Giày</option>
              <option value="tuixach">Túi xách</option>
              <option value="phukien">Phụ kiện</option>
            </select>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesTrendData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.sales}
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.sales}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.views}
                    stopOpacity={0.1}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.views}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#888"
                axisLine={false}
                tickLine={false}
              />
              <YAxis stroke="#888" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  border: "none",
                  padding: "12px",
                }}
                formatter={(value, name) => [
                  value,
                  name === "sales" ? "Đã bán" : "Lượt xem",
                ]}
                labelFormatter={(label) => `Tháng ${label}`}
              />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) =>
                  value === "sales" ? "Đã bán" : "Lượt xem"
                }
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke={CHART_COLORS.sales}
                fillOpacity={1}
                fill="url(#colorSales)"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke={CHART_COLORS.views}
                fillOpacity={1}
                fill="url(#colorViews)"
                strokeWidth={2}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      {/* Category and inventory charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Phân bố danh mục sản phẩm
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Tỷ lệ sản phẩm theo từng danh mục
            </p>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, "Tỷ lệ"]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    border: "none",
                    padding: "12px",
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
            <h2 className="text-lg font-semibold text-gray-800">
              Tình trạng kho hàng
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Phân tích tình trạng tồn kho sản phẩm
            </p>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {inventoryStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={INVENTORY_COLORS[index % INVENTORY_COLORS.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, "Tỷ lệ"]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    border: "none",
                    padding: "12px",
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
      </div>

      {/* Top products table */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Sản phẩm bán chạy
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Top 5 sản phẩm có doanh số cao nhất
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 bg-white shadow-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="sales">Sắp xếp theo số lượng bán</option>
              <option value="revenue">Sắp xếp theo doanh thu</option>
              <option value="views">Sắp xếp theo lượt xem</option>
            </select>
            <button className="p-2 text-gray-500 hover:text-indigo-600 transition bg-white border border-gray-200 rounded-lg shadow-sm">
              <FaSortAmountDown />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đã bán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doanh thu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tồn kho
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-all duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{product.sku}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">
                      {product.sales}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-800">
                      {formatCurrency(product.revenue)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`text-sm font-medium ${
                        product.stock < 20
                          ? "text-red-600"
                          : product.stock < 50
                          ? "text-amber-600"
                          : "text-green-600"
                      }`}
                    >
                      {product.stock}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <FaEllipsisH />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex justify-center">
          <button className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-150">
            Xem tất cả sản phẩm
          </button>
        </div>
      </div>

      {/* Product performance chart */}
    </div>
  );
};

export default StatisticProduct;
