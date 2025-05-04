import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ sidebarOpen }) => {
  const [productMenuOpen, setProductMenuOpen] = useState(false)
  const [promotionMenuOpen, setPromotionMenuOpen] = useState(false)
  const [statsMenuOpen, setStatsMenuOpen] = useState(false)
  const [reportMenuOpen, setReportMenuOpen] = useState(false)
  const location = useLocation()

  const isActiveRoute = (route) => {
    return location.pathname.startsWith(route)
  }

  // Hàm đóng tất cả submenu
  const closeAllSubmenus = () => {
    setProductMenuOpen(false)
    setPromotionMenuOpen(false)
    setStatsMenuOpen(false)
  }

  const handleMenuClick = (menuName) => {
    // Đóng tất cả các menu khác
    if (menuName !== 'product') setProductMenuOpen(false)
    if (menuName !== 'promotion') setPromotionMenuOpen(false)
    if (menuName !== 'stats') setStatsMenuOpen(false)

    // Mở/đóng menu được click
    switch (menuName) {
      case 'product':
        setProductMenuOpen(!productMenuOpen)
        break
      case 'promotion':
        setPromotionMenuOpen(!promotionMenuOpen)
        break
      case 'stats':
        setStatsMenuOpen(!statsMenuOpen)
        break
      case 'report':
        setReportMenuOpen(!reportMenuOpen)
        break
      default:
        break
    }
  }

  const menuItems = [
    {
      title: 'Trang chủ',
      path: '/seller/dashboard',
      icon: (
        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      title: 'Thông tin cửa hàng',
      path: '/seller/store',
      icon: (
        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      )
    },
    {
      title: 'Quản lý đơn hàng',
      path: '/seller/orders',
      icon: (
        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    }
  ]

  const dropdownMenus = [
    {
      title: 'Quản lý sản phẩm',
      isOpen: productMenuOpen,
      menuName: 'product',
      icon: (
        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      items: [
        {
          title: 'Danh sách sản phẩm',
          path: '/seller/products',
          icon: (
            <svg className="w-4 h-4 mr-2 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )
        },
        {
          title: 'Đánh giá sản phẩm',
          path: '/seller/reviews',
          icon: (
            <svg className="w-4 h-4 mr-2 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'Khuyến mãi',
      isOpen: promotionMenuOpen,
      menuName: 'promotion',
      icon: (
        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      items: [
        {
          title: 'Khuyến mãi',
          path: '/seller/promotions',
          icon: (
            <svg className="w-4 h-4 mr-2 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          )
        },
        {
          title: 'Mã giảm giá',
          path: '/seller/vouchers',
          icon: (
            <svg className="w-4 h-4 mr-2 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'Thống kê',
      isOpen: statsMenuOpen,
      menuName: 'stats',
      icon: (
        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      items: [
        {
          title: 'Thống kê sản phẩm',
          path: '/seller/stats/products',
          icon: (
            <svg className="w-4 h-4 mr-2 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )
        },
        {
          title: 'Thống kê doanh thu',
          path: '/seller/stats/revenue',
          icon: (
            <svg className="w-4 h-4 mr-2 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      ]
    },
    {
      title: 'Báo cáo',
      isOpen: reportMenuOpen,
      menuName: 'report',
      icon: (
        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      items: [
        {
          title: 'Báo cáo sản phẩm',
          path: '/seller/report-products',
          icon: (
            <svg className="w-4 h-4 mr-2 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )
        },
        {
          title: 'Báo cáo cửa hàng',
          path: '/seller/report-shops',
          icon: (
            <svg className="w-4 h-4 mr-2 text-gray-500 transition duration-75 group-hover:text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      ]
    }
  ]

  return (
    <aside className={`fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform ${!sidebarOpen ? '-translate-x-full' : ''} bg-white border-r border-gray-200 lg:translate-x-0`}>
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {/* Menu items không có submenu */}
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center p-2.5 rounded-lg group ${isActiveRoute(item.path)
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
                onClick={closeAllSubmenus}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.title}</span>
              </Link>
            </li>
          ))}

          {/* Menu items có submenu */}
          {dropdownMenus.map((menu, index) => (
            <li key={index}>
              <button
                type="button"
                className={`flex items-center w-full p-2.5 rounded-lg group ${menu.isOpen ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                onClick={() => handleMenuClick(menu.menuName)}
              >
                {menu.icon}
                <span className="flex-1 ml-3 text-left font-medium">{menu.title}</span>
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${menu.isOpen ? 'rotate-180' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  />
                </svg>
              </button>
              <ul
                className={`${menu.isOpen ? 'max-h-40' : 'max-h-0'
                  } overflow-hidden transition-all duration-300 ease-in-out`}
              >
                {menu.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      to={item.path}
                      className={`flex items-center p-2 pl-11 rounded-lg group ${isActiveRoute(item.path)
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'text-gray-600 hover:bg-gray-50'
                        }`}

                    >
                      {item.icon}
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
