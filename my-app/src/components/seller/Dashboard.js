"use client"

import { useState, useEffect } from "react"
import {
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  Activity,
  Search,
  X,
  Filter,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  RefreshCw,
} from "lucide-react"

const Dashboard = () => {
  // Sample data - in a real app, this would come from an API
  const [stats, setStats] = useState({
    totalSales: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    activeProducts: 0,
    reportedProducts: 0,
  })

  const [recentOrders, setRecentOrders] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [topSellers, setTopSellers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [showAllOrdersModal, setShowAllOrdersModal] = useState(false)
  const [orderFilter, setOrderFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" })
  const [searchQuery, setSearchQuery] = useState("")

  // Items per page for pagination
  const itemsPerPage = 10

  // Simulate data fetching
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalSales: 1254,
        totalUsers: 8427,
        totalRevenue: 124500000,
        totalOrders: 3254,
        pendingOrders: 42,
        completedOrders: 3212,
        activeProducts: 1254,
        reportedProducts: 13,
      })

      const recentOrdersData = [
        { id: "ORD-7865", customer: "Nguyễn Văn A", amount: 1250000, status: "completed", date: "2023-04-01" },
        { id: "ORD-7864", customer: "Trần Thị B", amount: 750000, status: "processing", date: "2023-04-01" },
        { id: "ORD-7863", customer: "Lê Văn C", amount: 2100000, status: "completed", date: "2023-03-31" },
        { id: "ORD-7862", customer: "Phạm Thị D", amount: 450000, status: "completed", date: "2023-03-31" },
        { id: "ORD-7861", customer: "Hoàng Văn E", amount: 1800000, status: "cancelled", date: "2023-03-30" },
      ]

      setRecentOrders(recentOrdersData)

      // Generate more orders for the "all orders" modal
      const generatedOrders = []
      for (let i = 0; i < 50; i++) {
        const statuses = ["completed", "processing", "cancelled"]
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
        const randomAmount = Math.floor(Math.random() * 5000000) + 100000
        const randomDate = new Date(2023, Math.floor(Math.random() * 4), Math.floor(Math.random() * 30) + 1)

        generatedOrders.push({
          id: `ORD-${7860 - i}`,
          customer: `Khách hàng ${i + 1}`,
          amount: randomAmount,
          status: randomStatus,
          date: randomDate.toISOString().split("T")[0],
          items: Math.floor(Math.random() * 10) + 1,
          paymentMethod: Math.random() > 0.5 ? "Thẻ tín dụng" : "COD",
        })
      }

      // Add the recent orders to the beginning of all orders
      setAllOrders([...recentOrdersData, ...generatedOrders])

      setTopSellers([
        { id: 1, name: "Cửa hàng Điện tử ABC", sales: 254, revenue: 45600000, avatar: "🏆" },
        { id: 2, name: "Thời trang XYZ", sales: 187, revenue: 32400000, avatar: "🥈" },
        { id: 3, name: "Nhà sách Trí Tuệ", sales: 154, revenue: 28700000, avatar: "🥉" },
        { id: 4, name: "Siêu thị Mini Mart", sales: 132, revenue: 24500000, avatar: "4" },
      ])

      setIsLoading(false)
    }, 1000)
  }, [])

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-emerald-500 bg-emerald-50/50 border border-emerald-100"
      case "processing":
        return "text-blue-500 bg-blue-50/50 border border-blue-100"
      case "cancelled":
        return "text-rose-500 bg-rose-50/50 border border-rose-100"
      default:
        return "text-gray-500 bg-gray-50/50 border border-gray-100"
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3.5 h-3.5" />
      case "processing":
        return <Clock className="w-3.5 h-3.5" />
      case "cancelled":
        return <AlertCircle className="w-3.5 h-3.5" />
      default:
        return null
    }
  }

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành"
      case "processing":
        return "Đang xử lý"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  // Get period label
  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "day":
        return "Hôm nay"
      case "week":
        return "Tuần này"
      case "month":
        return "Tháng này"
      case "year":
        return "Năm nay"
      default:
        return "Tuần này"
    }
  }

  // Handle sort
  const requestSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Get sorted and filtered orders
  const getSortedAndFilteredOrders = () => {
    let filteredOrders = [...allOrders]

    // Apply status filter
    if (orderFilter !== "all") {
      filteredOrders = filteredOrders.filter((order) => order.status === orderFilter)
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredOrders = filteredOrders.filter(
        (order) => order.id.toLowerCase().includes(query) || order.customer.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredOrders.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }

    return filteredOrders
  }

  // Get current page items
  const getCurrentPageItems = () => {
    const sortedAndFilteredOrders = getSortedAndFilteredOrders()
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return sortedAndFilteredOrders.slice(indexOfFirstItem, indexOfLastItem)
  }

  // Get total pages
  const totalPages = Math.ceil(getSortedAndFilteredOrders().length / itemsPerPage)

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
    }
    return null
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
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 tracking-tight">Bảng điều khiển</h1>
            <p className="text-gray-500 mt-1 text-sm">Xem tổng quan về hoạt động của hệ thống</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-gray-100">
              <button
                onClick={() => setSelectedPeriod("day")}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${selectedPeriod === "day" ? "bg-emerald-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Ngày
              </button>
              <button
                onClick={() => setSelectedPeriod("week")}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${selectedPeriod === "week" ? "bg-emerald-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Tuần
              </button>
              <button
                onClick={() => setSelectedPeriod("month")}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${selectedPeriod === "month" ? "bg-emerald-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Tháng
              </button>
              <button
                onClick={() => setSelectedPeriod("year")}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${selectedPeriod === "year" ? "bg-emerald-500 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Năm
              </button>
            </div>
            <button className="bg-white p-2 rounded-full shadow-sm border border-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50 transition-all hover:shadow-md hover:border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tổng doanh thu</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{formatCurrency(stats.totalRevenue)}</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-emerald-500 text-sm font-medium flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      12.5%
                    </span>
                    <span className="text-gray-400 text-xs ml-2">so với kỳ trước</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-3 rounded-xl">
                  <DollarSign className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-emerald-300 to-emerald-500"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50 transition-all hover:shadow-md hover:border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tổng đơn hàng</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalOrders.toLocaleString()}</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-emerald-500 text-sm font-medium flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      8.2%
                    </span>
                    <span className="text-gray-400 text-xs ml-2">so với kỳ trước</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-xl">
                  <ShoppingBag className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-blue-300 to-blue-500"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50 transition-all hover:shadow-md hover:border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tổng người dùng</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.totalUsers.toLocaleString()}</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-emerald-500 text-sm font-medium flex items-center">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      5.3%
                    </span>
                    <span className="text-gray-400 text-xs ml-2">so với kỳ trước</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-xl">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-purple-300 to-purple-500"></div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50 transition-all hover:shadow-md hover:border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Sản phẩm hoạt động</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{stats.activeProducts.toLocaleString()}</h3>
                  <div className="flex items-center mt-2">
                    <span className="text-rose-500 text-sm font-medium flex items-center">
                      <ArrowDownRight className="w-3 h-3 mr-1" />
                      2.1%
                    </span>
                    <span className="text-gray-400 text-xs ml-2">so với kỳ trước</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-amber-300 to-amber-500"></div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-50 lg:col-span-2 transition-all hover:shadow-md hover:border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAllOrdersModal(true)}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center transition-colors"
                  >
                    Xem tất cả
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto -mx-6">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-100">
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã đơn hàng
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Khách hàng
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị</th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatCurrency(order.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                          >
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{getStatusText(order.status)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(order.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-50 transition-all hover:shadow-md hover:border-gray-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">Người bán hàng đầu</h2>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-5">
                {topSellers.map((seller, index) => (
                  <div
                    key={seller.id}
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
                      {seller.avatar}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-800">{seller.name}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>{seller.sales} đơn hàng</span>
                        <span className="mx-2">•</span>
                        <span>{formatCurrency(seller.revenue)}</span>
                      </div>
                    </div>
                    <div
                      className={`flex items-center text-xs font-medium ${
                        index === 0
                          ? "text-emerald-500"
                          : index === 1
                            ? "text-emerald-400"
                            : index === 2
                              ? "text-emerald-400"
                              : "text-gray-400"
                      }`}
                    >
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      {index === 0 ? "12%" : index === 1 ? "8%" : index === 2 ? "5%" : "2%"}
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full py-2.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 border border-gray-100 rounded-xl hover:bg-gray-50/70 transition-colors">
                Xem tất cả người bán
              </button>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-6 transition-all hover:shadow-md hover:border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-blue-500 mr-2" />
                  <p className="text-sm font-medium text-gray-800">Đơn hàng đang xử lý</p>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">{stats.pendingOrders}</h3>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg">
                <span className="text-xs font-medium text-blue-500">
                  {((stats.pendingOrders / stats.totalOrders) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(stats.pendingOrders / stats.totalOrders) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.pendingOrders} trong tổng số {stats.totalOrders} đơn hàng
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-6 transition-all hover:shadow-md hover:border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
                  <p className="text-sm font-medium text-gray-800">Đơn hàng hoàn thành</p>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">{stats.completedOrders}</h3>
              </div>
              <div className="bg-emerald-50 p-2 rounded-lg">
                <span className="text-xs font-medium text-emerald-500">
                  {((stats.completedOrders / stats.totalOrders) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(stats.completedOrders / stats.totalOrders) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.completedOrders} trong tổng số {stats.totalOrders} đơn hàng
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-6 transition-all hover:shadow-md hover:border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-rose-500 mr-2" />
                  <p className="text-sm font-medium text-gray-800">Sản phẩm bị báo cáo</p>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mt-2">{stats.reportedProducts}</h3>
              </div>
              <div className="bg-rose-50 p-2 rounded-lg">
                <span className="text-xs font-medium text-rose-500">
                  {((stats.reportedProducts / stats.activeProducts) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 to-rose-500 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${(stats.reportedProducts / stats.activeProducts) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.reportedProducts} trong tổng số {stats.activeProducts} sản phẩm
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Dữ liệu được cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}</p>
        </div>
      </div>

      {/* All Orders Modal */}
      {showAllOrdersModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div
                className="absolute inset-0 bg-gray-500 opacity-75"
                onClick={() => setShowAllOrdersModal(false)}
              ></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-7xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Tất cả đơn hàng</h3>
                  <button
                    onClick={() => setShowAllOrdersModal(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Tìm kiếm đơn hàng..."
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-full sm:w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Trạng thái:</span>
                      <select
                        className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value)}
                      >
                        <option value="all">Tất cả</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <RefreshCw className="w-4 h-4" />
                      <span>Làm mới</span>
                    </button>
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Filter className="w-4 h-4" />
                      <span>Lọc</span>
                    </button>
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Xuất</span>
                    </button>
                    <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <Printer className="w-4 h-4" />
                      <span>In</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("id")}
                        >
                          <div className="flex items-center">
                            Mã đơn hàng
                            {getSortIndicator("id")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("customer")}
                        >
                          <div className="flex items-center">
                            Khách hàng
                            {getSortIndicator("customer")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("amount")}
                        >
                          <div className="flex items-center">
                            Giá trị
                            {getSortIndicator("amount")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("items")}
                        >
                          <div className="flex items-center">
                            Số lượng
                            {getSortIndicator("items")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("status")}
                        >
                          <div className="flex items-center">
                            Trạng thái
                            {getSortIndicator("status")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("paymentMethod")}
                        >
                          <div className="flex items-center">
                            Thanh toán
                            {getSortIndicator("paymentMethod")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => requestSort("date")}
                        >
                          <div className="flex items-center">
                            Ngày
                            {getSortIndicator("date")}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {getCurrentPageItems().map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{order.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.customer}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatCurrency(order.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.items || "-"}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1 capitalize">{getStatusText(order.status)}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {order.paymentMethod || "Thẻ tín dụng"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(order.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-emerald-600 hover:text-emerald-900 mr-3">Chi tiết</button>
                            <button className="text-gray-600 hover:text-gray-900">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-500">
                      Hiển thị {(currentPage - 1) * itemsPerPage + 1} đến{" "}
                      {Math.min(currentPage * itemsPerPage, getSortedAndFilteredOrders().length)} trong tổng số{" "}
                      {getSortedAndFilteredOrders().length} đơn hàng
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
                      >
                        Trước
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 rounded-md ${currentPage === pageNum ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
                      >
                        Tiếp
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-500 text-base font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAllOrdersModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard

