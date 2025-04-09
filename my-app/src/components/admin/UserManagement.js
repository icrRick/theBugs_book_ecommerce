"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"

// Dữ liệu mẫu cho quản lý người dùng
const sampleUsers = {
  admins: [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "admin1@example.com",
      role: "Super Admin",
      status: "active",
      lastLogin: "10 phút trước",
      permissions: ["all"],
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "admin2@example.com",
      role: "Admin",
      status: "active",
      lastLogin: "1 giờ trước",
      permissions: ["users.view", "users.edit", "products.view", "products.edit"],
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "admin3@example.com",
      role: "Moderator",
      status: "inactive",
      lastLogin: "2 ngày trước",
      permissions: ["products.view", "products.edit", "orders.view"],
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "admin4@example.com",
      role: "Support",
      status: "active",
      lastLogin: "3 giờ trước",
      permissions: ["orders.view", "customers.view"],
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "admin5@example.com",
      role: "Admin",
      status: "active",
      lastLogin: "5 giờ trước",
      permissions: ["users.view", "users.edit", "products.view", "products.edit", "orders.view", "orders.edit"],
    },
  ],
  roles: [
    { id: 1, name: "Super Admin", description: "Toàn quyền quản lý hệ thống", userCount: 1 },
    { id: 2, name: "Admin", description: "Quản lý chung hệ thống", userCount: 2 },
    { id: 3, name: "Moderator", description: "Kiểm duyệt nội dung", userCount: 1 },
    { id: 4, name: "Support", description: "Hỗ trợ khách hàng", userCount: 1 },
  ],
  permissions: [
    { id: 1, name: "users.view", description: "Xem người dùng" },
    { id: 2, name: "users.edit", description: "Chỉnh sửa người dùng" },
    { id: 3, name: "users.delete", description: "Xóa người dùng" },
    { id: 4, name: "products.view", description: "Xem sản phẩm" },
    { id: 5, name: "products.edit", description: "Chỉnh sửa sản phẩm" },
    { id: 6, name: "products.delete", description: "Xóa sản phẩm" },
    { id: 7, name: "orders.view", description: "Xem đơn hàng" },
    { id: 8, name: "orders.edit", description: "Chỉnh sửa đơn hàng" },
    { id: 9, name: "orders.delete", description: "Xóa đơn hàng" },
    { id: 10, name: "customers.view", description: "Xem khách hàng" },
    { id: 11, name: "customers.edit", description: "Chỉnh sửa khách hàng" },
    { id: 12, name: "settings.view", description: "Xem cài đặt" },
    { id: 13, name: "settings.edit", description: "Chỉnh sửa cài đặt" },
  ],
}

const UserManagement = () => {
  const [users, setUsers] = useState(sampleUsers)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("admins")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu người dùng ở đây
    setLoading(true)
    setTimeout(() => {
      setUsers(sampleUsers)
      setLoading(false)
    }, 500)
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredAdmins = users.admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredRoles = users.roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddUser = () => {
    setSelectedUser({
      id: null,
      name: "",
      email: "",
      role: "Admin",
      status: "active",
      permissions: [],
    })
    setIsUserModalOpen(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsUserModalOpen(true)
  }

  const handleAddRole = () => {
    setSelectedRole({
      id: null,
      name: "",
      description: "",
      permissions: [],
    })
    setIsRoleModalOpen(true)
  }

  const handleEditRole = (role) => {
    setSelectedRole(role)
    setIsRoleModalOpen(true)
  }

  const handleDeleteItem = (item, type) => {
    setItemToDelete({ item, type })
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete.type === "user") {
      // Xóa người dùng
      const updatedAdmins = users.admins.filter((admin) => admin.id !== itemToDelete.item.id)
      setUsers({ ...users, admins: updatedAdmins })
      toast.success("Xóa người dùng thành công!")
    } else if (itemToDelete.type === "role") {
      // Xóa vai trò
      const updatedRoles = users.roles.filter((role) => role.id !== itemToDelete.item.id)
      setUsers({ ...users, roles: updatedRoles })
      toast.success("Xóa vai trò thành công!")
    }
    setIsDeleteModalOpen(false)
  }

  const saveUser = (userData) => {
    if (userData.id) {
      // Cập nhật người dùng hiện có
      const updatedAdmins = users.admins.map((admin) => (admin.id === userData.id ? userData : admin))
      setUsers({ ...users, admins: updatedAdmins })
      toast.success("Cập nhật người dùng thành công!")
    } else {
      // Thêm người dùng mới
      const newUser = {
        ...userData,
        id: users.admins.length + 1,
        lastLogin: "Chưa đăng nhập",
      }
      setUsers({ ...users, admins: [...users.admins, newUser] })
      toast.success("Thêm người dùng thành công!")
    }
    setIsUserModalOpen(false)
  }

  const saveRole = (roleData) => {
    if (roleData.id) {
      // Cập nhật vai trò hiện có
      const updatedRoles = users.roles.map((role) => (role.id === roleData.id ? roleData : role))
      setUsers({ ...users, roles: updatedRoles })
      toast.success("Cập nhật vai trò thành công!")
    } else {
      // Thêm vai trò mới
      const newRole = {
        ...roleData,
        id: users.roles.length + 1,
        userCount: 0,
      }
      setUsers({ ...users, roles: [...users.roles, newRole] })
      toast.success("Thêm vai trò thành công!")
    }
    setIsRoleModalOpen(false)
  }

  const renderAdminsTab = () => {
    return (
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="w-full md:w-64 mb-4 md:mb-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
            onClick={handleAddUser}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm người dùng
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đăng nhập cuối
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{admin.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{admin.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{admin.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          admin.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {admin.status === "active" ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{admin.lastLogin}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => handleEditUser(admin)}>
                        Sửa
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteItem(admin, "user")}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredAdmins.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderRolesTab = () => {
    return (
      <div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="w-full md:w-64 mb-4 md:mb-0">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tìm kiếm vai trò..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
            onClick={handleAddRole}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Thêm vai trò
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số người dùng
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{role.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{role.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{role.userCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={() => handleEditRole(role)}>
                        Sửa
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteItem(role, "role")}
                        disabled={role.name === "Super Admin"}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRoles.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      Không tìm thấy vai trò nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderPermissionsTab = () => {
    return (
      <div>
        <div className="mb-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tìm kiếm quyền..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên quyền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.permissions
                  .filter(
                    (permission) =>
                      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      permission.description.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map((permission) => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                        {permission.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{permission.description}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Modal người dùng
  const renderUserModal = () => {
    if (!isUserModalOpen || !selectedUser) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedUser.id ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
            </h3>
            <button className="text-gray-400 hover:text-gray-600" onClick={() => setIsUserModalOpen(false)}>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                >
                  {users.roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedUser.status}
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                >
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </div>
            </div>

            {!selectedUser.id && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mật khẩu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Xác nhận mật khẩu"
                  />
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quyền hạn</label>
              <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {users.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`permission-${permission.id}`}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={
                          selectedUser.permissions.includes(permission.name) || selectedUser.permissions.includes("all")
                        }
                        onChange={(e) => {
                          if (permission.name === "all") {
                            if (e.target.checked) {
                              setSelectedUser({ ...selectedUser, permissions: ["all"] })
                            } else {
                              setSelectedUser({ ...selectedUser, permissions: [] })
                            }
                          } else {
                            if (e.target.checked) {
                              if (selectedUser.permissions.includes("all")) {
                                const allPermissions = users.permissions.map((p) => p.name).filter((p) => p !== "all")
                                setSelectedUser({ ...selectedUser, permissions: allPermissions })
                              } else {
                                setSelectedUser({
                                  ...selectedUser,
                                  permissions: [...selectedUser.permissions, permission.name],
                                })
                              }
                            } else {
                              setSelectedUser({
                                ...selectedUser,
                                permissions: selectedUser.permissions.filter((p) => p !== permission.name),
                              })
                            }
                          }
                        }}
                      />
                      <label htmlFor={`permission-${permission.id}`} className="ml-2 block text-sm text-gray-700">
                        {permission.description}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 mr-2"
              onClick={() => setIsUserModalOpen(false)}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              onClick={() => saveUser(selectedUser)}
            >
              {selectedUser.id ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Modal vai trò
  const renderRoleModal = () => {
    if (!isRoleModalOpen || !selectedRole) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedRole.id ? "Chỉnh sửa vai trò" : "Thêm vai trò mới"}
            </h3>
            <button className="text-gray-400 hover:text-gray-600" onClick={() => setIsRoleModalOpen(false)}>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên vai trò</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedRole.name}
                onChange={(e) => setSelectedRole({ ...selectedRole, name: e.target.value })}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                value={selectedRole.description}
                onChange={(e) => setSelectedRole({ ...selectedRole, description: e.target.value })}
              ></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quyền hạn</label>
              <div className="bg-gray-50 p-4 rounded-md max-h-60 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {users.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`role-permission-${permission.id}`}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={selectedRole.permissions?.includes(permission.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRole({
                              ...selectedRole,
                              permissions: [...(selectedRole.permissions || []), permission.name],
                            })
                          } else {
                            setSelectedRole({
                              ...selectedRole,
                              permissions: (selectedRole.permissions || []).filter((p) => p !== permission.name),
                            })
                          }
                        }}
                      />
                      <label htmlFor={`role-permission-${permission.id}`} className="ml-2 block text-sm text-gray-700">
                        {permission.description}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 mr-2"
              onClick={() => setIsRoleModalOpen(false)}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              onClick={() => saveRole(selectedRole)}
            >
              {selectedRole.id ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Modal xác nhận xóa
  const renderDeleteModal = () => {
    if (!isDeleteModalOpen || !itemToDelete) return null

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Xác nhận xóa</h3>
          </div>

          <div className="p-6">
            <p className="text-gray-700">
              {itemToDelete.type === "user"
                ? `Bạn có chắc chắn muốn xóa người dùng "${itemToDelete.item.name}" không?`
                : `Bạn có chắc chắn muốn xóa vai trò "${itemToDelete.item.name}" không?`}
            </p>
            <p className="text-gray-500 text-sm mt-2">Hành động này không thể hoàn tác.</p>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 mr-2"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
              onClick={confirmDelete}
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý người dùng</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === "admins" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("admins")}
            >
              Người dùng quản trị
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === "roles" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("roles")}
            >
              Vai trò
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${activeTab === "permissions" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              onClick={() => setActiveTab("permissions")}
            >
              Quyền hạn
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <>
              {activeTab === "admins" && renderAdminsTab()}
              {activeTab === "roles" && renderRolesTab()}
              {activeTab === "permissions" && renderPermissionsTab()}
            </>
          )}
        </div>
      </div>

      {renderUserModal()}
      {renderRoleModal()}
      {renderDeleteModal()}
    </div>
  )
}

export default UserManagement

