"use client"

import { useState, useEffect } from "react"
import axiosInstance from "../../utils/axiosInstance"


const Dashboard = () => {
  // State for API data
  const [revenueData, setRevenueData] = useState(null)
  const [productStats, setProductStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [revenueResponse, statsResponse] = await Promise.all([
          axiosInstance.get("/seller/revenue/shop/list"),
          axiosInstance.get("/api/seller/statistical"),
        ])

        setRevenueData(revenueResponse.data)
        setProductStats(statsResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-100"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-emerald-500 animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">Bảng điều khiển</h1>
          <p className="text-gray-500 mt-1 text-sm">Xem tổng quan về hoạt động của cửa hàng</p>
        </header>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("overview")}
                className={`${
                  activeTab === "overview"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`${
                  activeTab === "products"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Sản phẩm
              </button>
            </nav>
          </div>

          {/* Overview Tab Content */}
          {activeTab === "overview" && (
            <div className="mt-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">
                          {formatCurrency(revenueData?.data?.totalRevenue || 0)}
                        </h3>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-3 rounded-xl">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-emerald-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
                  <div className="h-1 w-full bg-gradient-to-r from-emerald-300 to-emerald-500"></div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tổng đơn hàng</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">
                          {(revenueData?.data?.arrayList?.length || 0).toLocaleString()}
                        </h3>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
                  </div>
                  <div className="h-1 w-full bg-gradient-to-r from-blue-300 to-blue-500"></div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tổng sản phẩm</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">
                          {(productStats?.data?.allProduct || 0).toLocaleString()}
                        </h3>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-purple-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
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
                  </div>
                  <div className="h-1 w-full bg-gradient-to-r from-purple-300 to-purple-500"></div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Sản phẩm đã bán</p>
                        <h3 className="text-2xl font-bold text-gray-800 mt-1">
                          {productStats?.data?.table_ProductStatistical?.reduce(
                            (total, product) => total + product.soldProduct,
                            0,
                          ) || 0}
                        </h3>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-xl">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-amber-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gradient-to-r from-amber-300 to-amber-500"></div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-50 mb-8">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h2>
                  </div>
                  <div className="overflow-x-auto -mx-6">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-100">
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mã đơn hàng
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giá gốc
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giá khuyến mãi
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {revenueData?.data?.arrayList?.map((order) => (
                          <tr key={order.orderId} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              ORD-{order.orderId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatCurrency(order.totalOlPrice)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatCurrency(order.totalPromoPrice)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatDate(order.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Top Selling Products */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-50">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Sản phẩm bán chạy</h2>
                  </div>
                  <div className="space-y-5">
                    {productStats?.data?.table_ProductStatistical
                      ?.sort((a, b) => b.soldProduct - a.soldProduct)
                      .slice(0, 4)
                      .map((product, index) => (
                        <div
                          key={product.productCode}
                          className="flex items-center p-3 rounded-xl hover:bg-gray-50/70 transition-colors"
                        >
                          <div
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                              index === 0
                                ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white"
                                : index === 1
                                  ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                                  : index === 2
                                    ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                                    : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600"
                            }`}
                          >
                            {index === 0 ? "🏆" : index === 1 ? "🥈" : index === 2 ? "🥉" : (index + 1).toString()}
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="text-sm font-medium text-gray-800">{product.productName}</h3>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <span>{product.soldProduct} đã bán</span>
                              <span className="mx-2">•</span>
                              <span>{formatCurrency(product.revenue)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products Tab Content */}
          {activeTab === "products" && (
            <div className="mt-6">
              {/* Genre Distribution */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-6">Phân bố thể loại sách</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {productStats?.data?.chart_GenresProduct?.map((genre) => (
                    <div
                      key={genre.name}
                      className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center"
                    >
                      <div className="text-lg font-bold text-gray-700">{genre.quantity}</div>
                      <div className="text-sm text-gray-500 text-center mt-1">{genre.name}</div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-emerald-500 h-2.5 rounded-full"
                          style={{
                            width: `${
                              (genre.quantity /
                                Math.max(...productStats.data.chart_GenresProduct.map((g) => g.quantity))) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-50">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-6">Thống kê sản phẩm</h2>
                  <div className="overflow-x-auto -mx-6">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-gray-100">
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tên sản phẩm
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mã sản phẩm
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Thể loại
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Đã bán
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tồn kho
                          </th>
                          <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Doanh thu
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {productStats?.data?.table_ProductStatistical?.map((product) => (
                          <tr key={product.productCode} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              {product.productName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.productCode}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <div className="flex flex-wrap">
                                {product.genre.split(",").map((genre, i) => (
                                  <span
                                    key={i}
                                    className="inline-block px-2 py-1 mr-1 mb-1 text-xs bg-gray-100 rounded-full"
                                  >
                                    {genre.trim()}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.soldProduct}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {product.wareHouseProduct}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatCurrency(product.revenue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Dữ liệu được cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
