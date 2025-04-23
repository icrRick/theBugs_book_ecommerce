import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Sidebar = ({ sidebarOpen }) => {
  const [reportMenuOpen, setReportMenuOpen] = useState(false)
  const location = useLocation()

  const isActiveRoute = (route) => {
    return location.pathname.startsWith(route)
  }

  // Hàm đóng tất cả submenu
  const closeAllSubmenus = () => {
    setReportMenuOpen(false)
  }

  const menuItems = [
    {
      title: 'Trang chủ',
      path: '/admin/dashboard',
      icon: (
        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
          <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
        </svg>
      )
    },
    {
      title: 'Quản lý sản phẩm',
      path: '/admin/products',
      icon: (
        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"/>
        </svg>
      )
    },
    {
      title: 'Quản lý cửa hàng',
      path: '/admin/stores',
      icon: (
        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
          <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
        </svg>
      )
    },
    {
      title: 'Quản lý thể loại',
      path: '/admin/genres',
      icon: (
        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
        </svg>
      )
    },
    {
      title: 'Quản lý tác giả',
      path: '/admin/authors',
      icon: (
        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
        </svg>
      )
    },
    {
      title: 'Quản lý nhà xuất bản',
      path: '/admin/publishers',
      icon: (
        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm7 5a1 1 0 10-2 0v2.5a1 1 0 102 0V9z"/>
        </svg>
      )
    },
    {
      title: 'Thống kê',
      path: '/admin/statistics',
      icon: (
        <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5z"/>
          <path d="M8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7z"/>
          <path d="M14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
        </svg>
      )
    }
  ]

  const reportMenu = {
    title: 'Báo cáo',
    isOpen: reportMenuOpen,
    icon: (
      <svg className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z"/>
      </svg>
    ),
    items: [
      {
        title: 'Báo cáo sản phẩm',
        path: '/admin/reports/products',
        icon: (
          <svg className="w-4 h-4 mr-2 text-gray-500 transition duration-75 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z"/>
          </svg>
        )
      },
      {
        title: 'Báo cáo cửa hàng',
        path: '/admin/reports/stores',
        icon: (
          <svg className="w-4 h-4 mr-2 text-gray-500 transition duration-75 group-hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z"/>
          </svg>
        )
      }
    ]
  }

  return (
    <aside className={`fixed top-0 left-0 z-20 w-64 h-screen pt-16 transition-transform ${!sidebarOpen ? '-translate-x-full' : ''} bg-white border-r border-gray-200 lg:translate-x-0`}>
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {/* Menu items không có submenu */}
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center p-2.5 rounded-lg group ${
                  isActiveRoute(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={closeAllSubmenus}
              >
                {item.icon}
                <span className="ml-3 font-medium">{item.title}</span>
              </Link>
            </li>
          ))}

          {/* Menu báo cáo có submenu */}
          <li>
            <button
              type="button"
              className={`flex items-center w-full p-2.5 rounded-lg group ${
                reportMenu.isOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setReportMenuOpen(!reportMenuOpen)}
            >
              {reportMenu.icon}
              <span className="flex-1 ml-3 text-left font-medium">Báo cáo</span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${reportMenu.isOpen ? 'rotate-180' : ''}`}
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
              className={`${
                reportMenu.isOpen ? 'max-h-40' : 'max-h-0'
              } overflow-hidden transition-all duration-300 ease-in-out`}
            >
              {reportMenu.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 pl-11 rounded-lg group ${
                      isActiveRoute(item.path)
                        ? 'bg-blue-50 text-blue-600'
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
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
