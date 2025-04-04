import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen w-full"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay màu xanh */}
      <div className="absolute inset-0 bg-emerald-900/70"></div>
      
      {/* Nội dung */}
      <div className="relative z-10 space-y-6 text-center px-4">
        <h1 className="text-8xl font-bold text-white">404</h1>
        <h2 className="text-3xl font-semibold text-white">Không Tìm Thấy Trang</h2>
        <p className="text-gray-200 text-lg">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <Link
          to="/home"
          className="inline-flex items-center gap-2 px-6 py-3 mt-8 text-white border-2 border-white hover:bg-white hover:text-emerald-900 rounded-lg transition-all duration-300 text-lg font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span>Về Trang Chủ</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound