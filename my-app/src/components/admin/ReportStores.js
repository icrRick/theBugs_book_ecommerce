"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"

// Dữ liệu mẫu
const sampleData = {
  totalStores: 120,
  activeStores: 105,
  inactiveStores: 15,
  totalRevenue: 8560000000,

  // Dữ liệu báo cáo cửa hàng theo khu vực
  storesByRegion: [
    { region: "TP.HCM", count: 45, revenue: 3200000000, orders: 32000 },
    { region: "Hà Nội", count: 35, revenue: 2500000000, orders: 25000 },
    { region: "Đà Nẵng", count: 15, revenue: 1200000000, orders: 12000 },
    { region: "Cần Thơ", count: 10, revenue: 800000000, orders: 8000 },
    { region: "Khác", count: 15, revenue: 860000000, orders: 8600 },
  ],

  // Dữ liệu báo cáo cửa hàng theo doanh thu
  storesByRevenue: [
    { range: "Trên 100 triệu", count: 25, percentage: 20.8 },
    { range: "50-100 triệu", count: 35, percentage: 29.2 },
    { range: "20-50 triệu", count: 40, percentage: 33.3 },
    { range: "5-20 triệu", count: 15, percentage: 12.5 },
    { range: "Dưới 5 triệu", count: 5, percentage: 4.2 },
  ],

  // Dữ liệu báo cáo cửa hàng theo số lượng sản phẩm
  storesByProducts: [
    { range: "Trên 500 sản phẩm", count: 20, percentage: 16.7 },
    { range: "200-500 sản phẩm", count: 40, percentage: 33.3 },
    { range: "100-200 sản phẩm", count: 35, percentage: 29.2 },
    { range: "50-100 sản phẩm", count: 15, percentage: 12.5 },
    { range: "Dưới 50 sản phẩm", count: 10, percentage: 8.3 },
  ],

  // Dữ liệu báo cáo cửa hàng theo đánh giá
  storesByRating: [
    { rating: "5 sao", count: 30, percentage: 25 },
    { rating: "4-5 sao", count: 55, percentage: 45.8 },
    { rating: "3-4 sao", count: 25, percentage: 20.8 },
    { rating: "2-3 sao", count: 8, percentage: 6.7 },
    { rating: "Dưới 2 sao", count: 2, percentage: 1.7 },
  ],

  // Dữ liệu cửa hàng hàng đầu
  topStores: [
    { name: "Nhà sách Phương Nam", products: 850, orders: 8500, revenue: 850000000, rating: 4.8 },
    { name: "Nhà sách Fahasa", products: 780, orders: 7800, revenue: 780000000, rating: 4.7 },
    { name: "Nhà sách Kim Đồng", products: 720, orders: 7200, revenue: 720000000, rating: 4.5 },
    { name: "Nhà sách Tiến Thọ", products: 680, orders: 6800, revenue: 680000000, rating: 4.2 },
    { name: "Nhà sách Trí Tuệ", products: 650, orders: 6500, revenue: 650000000, rating: 4.6 },
  ],

  // Dữ liệu cửa hàng mới
  newStores: [
    { name: "Nhà sách Minh Khai", joinDate: "15/03/2023", products: 120, orders: 850, revenue: 85000000 },
    { name: "Nhà sách Cá Chép", joinDate: "22/03/2023", products: 95, orders: 720, revenue: 72000000 },
    { name: "Nhà sách Sài Gòn", joinDate: "05/04/2023", products: 150, orders: 680, revenue: 68000000 },
    { name: "Nhà sách Hà Nội", joinDate: "12/04/2023", products: 110, orders: 620, revenue: 62000000 },
    { name: "Nhà sách Đông Á", joinDate: "20/04/2023", products: 85, orders: 580, revenue: 58000000 },
  ],
}

const ReportStores = () => {
  const [data, setData] = useState(sampleData)
  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState("year")
  const [reportType, setReportType] = useState("region")
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu báo cáo ở đây
    setLoading(true)
    setTimeout(() => {
      setData(sampleData)
      setLoading(false)
    }, 500)
  }, [timeRange])

  const handleExport = (format) => {
    setExportLoading(true)
    setTimeout(() => {
      toast.success(`Xuất báo cáo dạng ${format.toUpperCase()} thành công!`)
      setExportLoading(false)
    }, 1500)
  }

  // Hàm vẽ biểu đồ cột ngang
  const renderHorizontalBarChart = (data, valueKey, colorClass) => {
    const maxValue = Math.max(...data.map((item) => item[valueKey]))

    return (
      <div className="space-y-4 mt-4">
        {data.map((item, index) => {
          const width = (item[valueKey] / maxValue) * 100
          return (
            <div key={index} className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{item.region || item.range || item.rating}</span>
                <span className="text-sm text-gray-500">
                  {valueKey === "revenue" ? `${item[valueKey].toLocaleString()}đ` : item[valueKey].toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full ${colorClass}`} style={{ width: `${width}%` }}></div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Hàm vẽ biểu đồ tròn
  const renderPieChart = (data, valueKey) => {
    const total = data.reduce((sum, item) => sum + item[valueKey], 0)
    let startAngle = 0

    return (
      <div className="flex justify-center mt-4">
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {data.map((item, index) => {
              const value = item[valueKey]
              const percentage = (value / total) * 100
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
  const renderPieLegend = (data, valueKey) => {
    const total = data.reduce((sum, item) => sum + item[valueKey], 0)
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"]

    return (
      <div className="grid grid-cols-2 gap-4 mt-6">
        {data.map((item, index) => {
          const value = item[valueKey]
          const percentage = ((value / total) * 100).toFixed(1)
          return (
            <div key={index} className="flex items-center">
              <div className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: colors[index % colors.length] }}></div>
              <div className="text-sm">
                <span className="font-medium">{item.region || item.range || item.rating}</span>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Báo cáo cửa hàng</h1>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <select
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="year">Năm nay</option>
            <option value="quarter">Quý này</option>
            <option value="month">Tháng này</option>
            <option value="week">Tuần này</option>
          </select>

          <div className="relative">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
              onClick={() => document.getElementById("exportDropdown").classList.toggle("hidden")}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              {exportLoading ? "Đang xuất..." : "Xuất báo cáo"}
            </button>
            <div id="exportDropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden z-10">
              <div className="py-1">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleExport("pdf")}
                >
                  Xuất PDF
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleExport("excel")}
                >
                  Xuất Excel
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleExport("csv")}
                >
                  Xuất CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng cửa hàng</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.totalStores.toLocaleString()}</h3>
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Cửa hàng hoạt động</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.activeStores.toLocaleString()}</h3>
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {((data.activeStores / data.totalStores) * 100).toFixed(1)}% tổng số cửa hàng
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tổng doanh thu</p>
              <h3 className="text-2xl font-bold text-gray-800">{data.totalRevenue.toLocaleString()}đ</h3>
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Báo cáo chính */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h3 className="text-lg font-semibold text-gray-800">Phân tích cửa hàng</h3>
            <div className="mt-3 sm:mt-0">
              <select
                className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="region">Theo khu vực</option>
                <option value="revenue">Theo doanh thu</option>
                <option value="products">Theo số lượng sản phẩm</option>
                <option value="rating">Theo đánh giá</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {reportType === "region" && renderHorizontalBarChart(data.storesByRegion, "count", "bg-blue-600")}
              {reportType === "revenue" && renderHorizontalBarChart(data.storesByRevenue, "count", "bg-blue-600")}
              {reportType === "products" && renderHorizontalBarChart(data.storesByProducts, "count", "bg-blue-600")}
              {reportType === "rating" && renderHorizontalBarChart(data.storesByRating, "count", "bg-blue-600")}
            </div>

            <div>
              {reportType === "region" && renderPieChart(data.storesByRegion, "count")}
              {reportType === "revenue" && renderPieChart(data.storesByRevenue, "count")}
              {reportType === "products" && renderPieChart(data.storesByProducts, "count")}
              {reportType === "rating" && renderPieChart(data.storesByRating, "count")}

              {reportType === "region" && renderPieLegend(data.storesByRegion, "count")}
              {reportType === "revenue" && renderPieLegend(data.storesByRevenue, "count")}
              {reportType === "products" && renderPieLegend(data.storesByProducts, "count")}
              {reportType === "rating" && renderPieLegend(data.storesByRating, "count")}
            </div>
          </div>
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
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đánh giá
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.topStores.map((store, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{store.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{store.products}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                      {store.orders.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                      {store.revenue.toLocaleString()}đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span>{store.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Cửa hàng mới tham gia</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cửa hàng
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tham gia
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.newStores.map((store, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{store.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{store.joinDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{store.products}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
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
      </div>
    </div>
  )
}

export default ReportStores

