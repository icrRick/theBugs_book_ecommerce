"use client"

import { useState, useEffect } from "react"

// Dữ liệu mẫu cho thống kê
const sampleData = {
  totalRevenue: 1250000000,
  totalOrders: 15680,
  totalUsers: 8450,
  totalProducts: 12500,
  totalStores: 120,

  // Dữ liệu doanh thu theo tháng (12 tháng gần nhất)
  revenueByMonth: [
    { month: "T1", value: 85000000 },
    { month: "T2", value: 92000000 },
    { month: "T3", value: 98000000 },
    { month: "T4", value: 105000000 },
    { month: "T5", value: 115000000 },
    { month: "T6", value: 108000000 },
    { month: "T7", value: 118000000 },
    { month: "T8", value: 125000000 },
    { month: "T9", value: 132000000 },
    { month: "T10", value: 138000000 },
    { month: "T11", value: 145000000 },
    { month: "T12", value: 160000000 },
  ],

  // Dữ liệu đơn hàng theo tháng (12 tháng gần nhất)
  ordersByMonth: [
    { month: "T1", value: 1050 },
    { month: "T2", value: 1120 },
    { month: "T3", value: 1180 },
    { month: "T4", value: 1250 },
    { month: "T5", value: 1320 },
    { month: "T6", value: 1280 },
    { month: "T7", value: 1350 },
    { month: "T8", value: 1420 },
    { month: "T9", value: 1480 },
    { month: "T10", value: 1550 },
    { month: "T11", value: 1620 },
    { month: "T12", value: 1780 },
  ],

  // Dữ liệu người dùng mới theo tháng (12 tháng gần nhất)
  newUsersByMonth: [
    { month: "T1", value: 320 },
    { month: "T2", value: 350 },
    { month: "T3", value: 380 },
    { month: "T4", value: 410 },
    { month: "T5", value: 450 },
    { month: "T6", value: 420 },
    { month: "T7", value: 460 },
    { month: "T8", value: 490 },
    { month: "T9", value: 520 },
    { month: "T10", value: 550 },
    { month: "T11", value: 580 },
    { month: "T12", value: 620 },
  ],

  // Dữ liệu thể loại sách bán chạy
  topGenres: [
    { name: "Văn học", value: 28 },
    { name: "Kinh tế", value: 22 },
    { name: "Kỹ năng sống", value: 18 },
    { name: "Thiếu nhi", value: 15 },
    { name: "Giáo khoa", value: 10 },
    { name: "Khác", value: 7 },
  ],

  // Dữ liệu cửa hàng hàng đầu
  topStores: [
    { name: "Nhà sách Phương Nam", orders: 1850, revenue: 185000000 },
    { name: "Nhà sách Fahasa", orders: 1720, revenue: 172000000 },
    { name: "Nhà sách Kim Đồng", orders: 1580, revenue: 158000000 },
    { name: "Nhà sách Tiến Thọ", orders: 1450, revenue: 145000000 },
    { name: "Nhà sách Trí Tuệ", orders: 1320, revenue: 132000000 },
  ],

  // Dữ liệu sách bán chạy
  topProducts: [
    { name: "Đắc Nhân Tâm", author: "Dale Carnegie", sold: 850, revenue: 73100000 },
    { name: "Nhà Giả Kim", author: "Paulo Coelho", sold: 780, revenue: 53820000 },
    { name: "Tuổi Trẻ Đáng Giá Bao Nhiêu", author: "Rosie Nguyễn", sold: 720, revenue: 50400000 },
    { name: "Cây Cam Ngọt Của Tôi", author: "José Mauro de Vasconcelos", sold: 680, revenue: 73440000 },
    { name: "Tôi Thấy Hoa Vàng Trên Cỏ Xanh", author: "Nguyễn Nhật Ánh", sold: 650, revenue: 81250000 },
  ],
}

const Statistics = () => {
  const [data, setData] = useState(sampleData)
  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState("year")
  const [chartType, setChartType] = useState("revenue")

  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu thống kê ở đây
    setLoading(true)
    setTimeout(() => {
      setData(sampleData)
      setLoading(false)
    }, 500)
  }, [timeRange])

  // Hàm vẽ biểu đồ cột
  const renderBarChart = (data, color) => {
    const maxValue = Math.max(...data.map((item) => item.value))

    return (
      <div className="flex items-end h-64 gap-1 mt-4">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-full rounded-t-sm ${color}`}
                style={{ height: `${height}%` }}
                title={`${item.month}: ${item.value.toLocaleString()}`}
              ></div>
              <div className="text-xs mt-2 text-gray-600">{item.month}</div>
            </div>
          )
        })}
      </div>
    )
  }

  // Hàm vẽ biểu đồ tròn
  const renderPieChart = (data) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let startAngle = 0

    return (
      <div className="flex justify-center mt-4">
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const angle = (percentage / 100) * 360
              const endAngle = startAngle + angle

              // Tính toán tọa độ cho đường cung
              const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180)
              const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180)
              const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180)
              const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180)

              // Xác định cờ large-arc
              const largeArcFlag = angle > 180 ? 1 : 0

              // Tạo đường dẫn SVG
              const path = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

              // Mảng màu cho các phần
              const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

              const result = (
                <path key={index} d={path} fill={colors[index % colors.length]} stroke="#fff" strokeWidth="0.5" />
              )

              startAngle = endAngle
              return result
            })}
          </svg>
        </div>
      </div>
    )
  }

  // Hàm hiển thị chú thích cho biểu đồ tròn
  const renderPieLegend = (data) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

    return (
      <div className="grid grid-cols-2 gap-4 mt-6">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1)
          return (
            <div key={index} className="flex items-center">
              <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: colors[index % colors.length] }}></div>
              <div className="text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-500 ml-2">{percentage}%</span>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Thống kê tổng quan</h1>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng doanh thu</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.totalRevenue.toLocaleString()}đ</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-green-500 text-sm font-medium flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              8.2%
            </span>
            <span className="text-gray-500 text-xs ml-2">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng đơn hàng</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.totalOrders.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-green-500 text-sm font-medium flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              5.3%
            </span>
            <span className="text-gray-500 text-xs ml-2">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng người dùng</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.totalUsers.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-green-500 text-sm font-medium flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              3.8%
            </span>
            <span className="text-gray-500 text-xs ml-2">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng sản phẩm</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.totalProducts.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-green-500 text-sm font-medium flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              2.5%
            </span>
            <span className="text-gray-500 text-xs ml-2">so với tháng trước</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng cửa hàng</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.totalStores.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-green-500 text-sm font-medium flex items-center">
              <svg
                className="w-3 h-3 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              1.2%
            </span>
            <span className="text-gray-500 text-xs ml-2">so với tháng trước</span>
          </div>
        </div>
      </div>

      {/* Biểu đồ chính */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Thống kê theo thời gian</h3>
            <div className="flex space-x-2">
              <select
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
              >
                <option value="revenue">Doanh thu</option>
                <option value="orders">Đơn hàng</option>
                <option value="users">Người dùng mới</option>
              </select>
              <select
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="year">Năm nay</option>
                <option value="quarter">Quý này</option>
                <option value="month">Tháng này</option>
              </select>
            </div>
          </div>

          {chartType === "revenue" && renderBarChart(data.revenueByMonth, "bg-blue-500")}
          {chartType === "orders" && renderBarChart(data.ordersByMonth, "bg-green-500")}
          {chartType === "users" && renderBarChart(data.newUsersByMonth, "bg-purple-500")}

          <div className="mt-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {chartType === "revenue" && "Tổng doanh thu: "}
                {chartType === "orders" && "Tổng đơn hàng: "}
                {chartType === "users" && "Tổng người dùng mới: "}
                <span className="font-medium text-gray-800">
                  {chartType === "revenue" && data.totalRevenue.toLocaleString() + "đ"}
                  {chartType === "orders" && data.totalOrders.toLocaleString()}
                  {chartType === "users" && data.totalUsers.toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-green-500 font-medium">
                <span className="flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  {chartType === "revenue" && "10.4%"}
                  {chartType === "orders" && "8.7%"}
                  {chartType === "users" && "6.2%"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Thể loại sách bán chạy</h3>
          </div>

          {renderPieChart(data.topGenres)}
          {renderPieLegend(data.topGenres)}
        </div>
      </div>

      {/* Bảng thống kê */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Cửa hàng hàng đầu</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cửa hàng
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.topStores.map((store, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{store.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      {store.orders.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      {store.revenue.toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Sách bán chạy</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sách
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tác giả
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đã bán
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.topProducts.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{product.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      {product.sold.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      {product.revenue.toLocaleString()}đ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics

