import { Outlet, NavLink } from "react-router-dom"

const LayoutAccount = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Menu - 2 phần trên mobile, 3 phần trên desktop */}
        <div className="col-span-1 md:col-span-3 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Thông tin tài khoản</h2>
          <nav className="space-y-2">
            <NavLink
              to="/account/profile"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              Tài khoản của tôi
            </NavLink>
            <NavLink
              to="/account/ordered"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              Đơn hàng
            </NavLink>
            <NavLink
              to="/account/address"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              Địa chỉ
            </NavLink>
            <NavLink
              to="/account/favorite"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              Sản phẩm yêu thích
            </NavLink>
            <NavLink
              to="/account/report-products"
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`
              }
            >
              Báo cáo sản phẩm
            </NavLink>
            <NavLink to="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded">
              Bảo mật
            </NavLink>
          </nav>
        </div>

        {/* Nội dung chính - 1 phần trên mobile, 9 phần trên desktop */}
        <div className="col-span-1 md:col-span-9 bg-white rounded-lg shadow p-4 min-h-[80vh]">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default LayoutAccount

