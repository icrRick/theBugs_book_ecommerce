"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"

// Dữ liệu mẫu
const sampleData = [
  {
    id: 1,
    name: "NXB Trẻ",
    address: "TP.HCM",
    phone: "0901234567",
    email: "nxbtre@example.com",
    website: "nxbtre.com.vn",
    foundedYear: 1981,
    books: 2500,
  },
  {
    id: 2,
    name: "NXB Kim Đồng",
    address: "Hà Nội",
    phone: "0912345678",
    email: "kimdong@example.com",
    website: "nxbkimdong.com.vn",
    foundedYear: 1957,
    books: 3000,
  },
  {
    id: 3,
    name: "NXB Tổng hợp TP.HCM",
    address: "TP.HCM",
    phone: "0923456789",
    email: "tonghop@example.com",
    website: "nxbtonghop.com.vn",
    foundedYear: 1977,
    books: 1800,
  },
  {
    id: 4,
    name: "NXB Hội Nhà Văn",
    address: "Hà Nội",
    phone: "0934567890",
    email: "hoinhavan@example.com",
    website: "nxbhoinhavan.com.vn",
    foundedYear: 1957,
    books: 1500,
  },
  {
    id: 5,
    name: "NXB Văn Học",
    address: "Hà Nội",
    phone: "0945678901",
    email: "vanhoc@example.com",
    website: "nxbvanhoc.com.vn",
    foundedYear: 1957,
    books: 2200,
  },
  {
    id: 6,
    name: "NXB Lao Động",
    address: "Hà Nội",
    phone: "0956789012",
    email: "laodong@example.com",
    website: "nxblaodong.com.vn",
    foundedYear: 1945,
    books: 1700,
  },
  {
    id: 7,
    name: "NXB Phụ Nữ",
    address: "Hà Nội",
    phone: "0967890123",
    email: "phunu@example.com",
    website: "nxbphunu.com.vn",
    foundedYear: 1948,
    books: 1600,
  },
  {
    id: 8,
    name: "NXB Thanh Niên",
    address: "Hà Nội",
    phone: "0978901234",
    email: "thanhnien@example.com",
    website: "nxbthanhnien.com.vn",
    foundedYear: 1950,
    books: 1400,
  },
  {
    id: 9,
    name: "NXB Đại Học Quốc Gia Hà Nội",
    address: "Hà Nội",
    phone: "0989012345",
    email: "dhqghn@example.com",
    website: "press.vnu.edu.vn",
    foundedYear: 1995,
    books: 1200,
  },
  {
    id: 10,
    name: "NXB Giáo Dục",
    address: "Hà Nội",
    phone: "0990123456",
    email: "giaoduc@example.com",
    website: "nxbgd.vn",
    foundedYear: 1957,
    books: 5000,
  },
]

const ITEMS_PER_PAGE = 5

// Hàm tạo mảng số trang với dấu ...
const getPageNumbers = (currentPage, totalPages) => {
  const delta = 2
  const range = []
  const rangeWithDots = []

  range.push(1)

  for (let i = currentPage - delta; i <= currentPage + delta; i++) {
    if (i > 1 && i < totalPages) {
      range.push(i)
    }
  }

  if (totalPages > 1) {
    range.push(totalPages)
  }

  let prev = 0
  for (const i of range) {
    if (prev + 1 < i) {
      rangeWithDots.push("...")
    }
    rangeWithDots.push(i)
    prev = i
  }

  return rangeWithDots
}

const Publishers = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    foundedYear: "",
    books: "",
  })
  const [searchText, setSearchText] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchData = async (selectedName) => {
    setLoading(true)
    try {
      const searchValue = selectedName || searchText
      let filteredData = [...sampleData]

      if (searchValue) {
        filteredData = sampleData.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase()))
      }

      // Tính toán dữ liệu cho trang hiện tại
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
      const endIndex = startIndex + ITEMS_PER_PAGE
      const paginatedData = filteredData.slice(startIndex, endIndex)

      setData(paginatedData)
      setTotalPages(Math.ceil(filteredData.length / ITEMS_PER_PAGE))
    } catch (error) {
      console.error("Error:", error)
      toast.error("Có lỗi khi tải dữ liệu")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [searchText, currentPage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        const index = sampleData.findIndex((item) => item.id === editingId)
        if (index !== -1) {
          sampleData[index] = { ...sampleData[index], ...formData }
          toast.success("Cập nhật nhà xuất bản thành công!")
        }
      } else {
        const newId = Math.max(...sampleData.map((item) => item.id)) + 1
        sampleData.push({ id: newId, ...formData })
        toast.success("Thêm nhà xuất bản mới thành công!")
      }
      setShowModal(false)
      fetchData()
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        website: "",
        foundedYear: "",
        books: "",
      })
    } catch (error) {
      console.error("Error:", error)
      toast.error("Có lỗi xảy ra!")
    }
  }

  const handleDelete = async (id) => {
    try {
      const index = sampleData.findIndex((item) => item.id === id)
      if (index !== -1) {
        sampleData.splice(index, 1)
        toast.success("Xóa nhà xuất bản thành công!")
        fetchData()
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("Có lỗi xảy ra khi xóa!")
    }
    setShowDeleteModal(false)
  }

  const openDeleteModal = (id) => {
    setDeletingId(id)
    setShowDeleteModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Quản lý nhà xuất bản</h1>

      {/* Search và Add */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="w-full md:max-w-xl relative">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
              placeholder="Tìm kiếm nhà xuất bản..."
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value)
                setIsSearching(true)
              }}
              onFocus={() => setIsSearching(true)}
              className="w-full py-3 ps-11 pe-4 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors duration-200"
            />
          </div>

          {/* Dropdown Results */}
          {searchText && isSearching && (
            <div className="absolute z-50 w-full mt-2">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  {sampleData
                    .filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))
                    .slice(0, 10)
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          const selectedName = item.name
                          setSearchText(selectedName)
                          setIsSearching(false)
                          fetchData(selectedName)
                        }}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-0"
                      >
                        <div className="text-sm text-gray-700">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.address}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            setEditingId(null)
            setFormData({
              name: "",
              address: "",
              phone: "",
              email: "",
              website: "",
              foundedYear: "",
              books: "",
            })
            setShowModal(true)
          }}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center whitespace-nowrap"
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
          Thêm nhà xuất bản
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Tên nhà xuất bản
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">
                  Địa chỉ
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                  Liên hệ
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider hidden xl:table-cell">
                  Năm thành lập
                </th>
                <th className="text-center py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Số sách
                </th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-3.5 px-6 text-gray-800">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.website}</div>
                  </td>
                  <td className="py-3.5 px-6 text-gray-600 hidden md:table-cell">{item.address}</td>
                  <td className="py-3.5 px-6 text-gray-600 hidden lg:table-cell">
                    <div>{item.email}</div>
                    <div>{item.phone}</div>
                  </td>
                  <td className="py-3.5 px-6 text-gray-600 text-center hidden xl:table-cell">{item.foundedYear}</td>
                  <td className="py-3.5 px-6 text-gray-600 text-center">{item.books}</td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => {
                        setEditingId(item.id)
                        setFormData({
                          name: item.name,
                          address: item.address,
                          phone: item.phone,
                          email: item.email,
                          website: item.website,
                          foundedYear: item.foundedYear,
                          books: item.books,
                        })
                        setShowModal(true)
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors duration-200"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => openDeleteModal(item.id)}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Trước
            </button>

            {getPageNumbers(currentPage, totalPages).map((item, index) =>
              item === "..." ? (
                <span key={`dots-${index}`} className="px-3 py-1 text-gray-500">
                  {item}
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  className={`px-3 py-1 rounded ${
                    currentPage === item
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </button>
              ),
            )}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Xác nhận xóa</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">Bạn có chắc chắn muốn xóa nhà xuất bản này?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm/sửa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingId ? "Chỉnh sửa nhà xuất bản" : "Thêm nhà xuất bản mới"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên nhà xuất bản</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập tên nhà xuất bản"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập địa chỉ"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập website"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Năm thành lập</label>
                  <input
                    type="number"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập năm thành lập"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số sách đã xuất bản</label>
                  <input
                    type="number"
                    name="books"
                    value={formData.books}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập số sách"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200 font-medium mr-3"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  {editingId ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Publishers

