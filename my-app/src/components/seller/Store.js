"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import axiosInstance from "../../utils/axiosInstance"
import { toast } from "react-toastify"

const Store = () => {
  const { currentUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    logo: null,
    banner: null,
    returnPolicy: "",
    shippingPolicy: "",
  })
  const [previewLogo, setPreviewLogo] = useState("")
  const [previewBanner, setPreviewBanner] = useState("")
  const [originalData, setOriginalData] = useState({})

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true)
        // Replace with your actual API endpoint
        const response = await axiosInstance.get("/seller/store")
        const data = response.data

        setStoreData(data)
        setOriginalData(data)

        if (data.logo) setPreviewLogo(data.logo)
        if (data.banner) setPreviewBanner(data.banner)

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching store data:", error)
        toast.error("Không thể tải thông tin cửa hàng")
        setIsLoading(false)
      }
    }

    fetchStoreData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setStoreData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setStoreData((prev) => ({
        ...prev,
        [name]: files[0],
      }))

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (name === "logo") {
          setPreviewLogo(e.target.result)
        } else if (name === "banner") {
          setPreviewBanner(e.target.result)
        }
      }
      reader.readAsDataURL(files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setIsLoading(true)

      const formData = new FormData()

      // Append all text fields
      Object.keys(storeData).forEach((key) => {
        if (key !== "logo" && key !== "banner") {
          formData.append(key, storeData[key])
        }
      })

      // Append files only if they were changed
      if (storeData.logo && storeData.logo instanceof File) {
        formData.append("logo", storeData.logo)
      }

      if (storeData.banner && storeData.banner instanceof File) {
        formData.append("banner", storeData.banner)
      }

      // Replace with your actual API endpoint
      await axiosInstance.put("/seller/store", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      toast.success("Cập nhật thông tin cửa hàng thành công")
      setIsEditing(false)
      setOriginalData({ ...storeData })
    } catch (error) {
      console.error("Error updating store:", error)
      toast.error("Không thể cập nhật thông tin cửa hàng")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setStoreData({ ...originalData })
    if (originalData.logo) setPreviewLogo(originalData.logo)
    if (originalData.banner) setPreviewBanner(originalData.banner)
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Thông tin cửa hàng</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm transition-all duration-200"
            >
              <span className="flex items-center">
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
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  ></path>
                </svg>
                Chỉnh sửa
              </span>
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-emerald-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm transition-all duration-200"
              >
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>

        {/* Store Banner and Logo */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative h-56 md:h-72 bg-gradient-to-r from-gray-100 to-gray-200">
            {previewBanner ? (
              <img
                src={previewBanner instanceof File ? URL.createObjectURL(previewBanner) : previewBanner}
                alt="Store banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400 text-sm">Chưa có ảnh bìa</span>
              </div>
            )}

            {isEditing && (
              <div className="absolute bottom-4 right-4">
                <label className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 group">
                  <input type="file" name="banner" onChange={handleFileChange} className="hidden" accept="image/*" />
                  <svg
                    className="w-5 h-5 text-gray-500 group-hover:text-emerald-500 transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </label>
              </div>
            )}
          </div>

          <div className="px-6 py-5 flex flex-col md:flex-row md:items-center">
            <div className="relative -mt-20 md:-mt-16 mb-4 md:mb-0 md:mr-6">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                {previewLogo ? (
                  <img
                    src={previewLogo instanceof File ? URL.createObjectURL(previewLogo) : previewLogo}
                    alt="Store logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <span className="text-gray-400 text-sm">Logo</span>
                  </div>
                )}

                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-all duration-200 group">
                    <input type="file" name="logo" onChange={handleFileChange} className="hidden" accept="image/*" />
                    <svg
                      className="w-4 h-4 text-gray-500 group-hover:text-emerald-500 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </label>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={storeData.name || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                    placeholder="Nhập tên cửa hàng"
                  />
                ) : (
                  storeData.name || "Chưa cập nhật tên cửa hàng"
                )}
              </h2>
              {!isEditing && <p className="text-gray-500 mt-1">{storeData.email || "Chưa cập nhật email"}</p>}
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Information */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-6 pb-2 border-b border-gray-100">
                Thông tin liên hệ
              </h3>

              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email liên hệ</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={storeData.email || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      placeholder="Nhập email liên hệ"
                    />
                  ) : (
                    <p className="text-gray-800">{storeData.email || "Chưa cập nhật"}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={storeData.phone || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <p className="text-gray-800">{storeData.phone || "Chưa cập nhật"}</p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={storeData.address || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      placeholder="Nhập địa chỉ cửa hàng"
                    />
                  ) : (
                    <p className="text-gray-800">{storeData.address || "Chưa cập nhật"}</p>
                  )}
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={storeData.city || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                        placeholder="Nhập tỉnh/thành phố"
                      />
                    ) : (
                      <p className="text-gray-800">{storeData.city || "Chưa cập nhật"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="district"
                        value={storeData.district || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                        placeholder="Nhập quận/huyện"
                      />
                    ) : (
                      <p className="text-gray-800">{storeData.district || "Chưa cập nhật"}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="ward"
                        value={storeData.ward || ""}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                        placeholder="Nhập phường/xã"
                      />
                    ) : (
                      <p className="text-gray-800">{storeData.ward || "Chưa cập nhật"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-6 pb-2 border-b border-gray-100">Mô tả cửa hàng</h3>

              {isEditing ? (
                <textarea
                  name="description"
                  value={storeData.description || ""}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                  placeholder="Nhập mô tả về cửa hàng của bạn"
                ></textarea>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-gray-800 whitespace-pre-line">
                    {storeData.description || "Chưa cập nhật mô tả cửa hàng."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Policies */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-6 pb-2 border-b border-gray-100">
                Chính sách cửa hàng
              </h3>

              <div className="space-y-6">
                {/* Return Policy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách đổi trả</label>
                  {isEditing ? (
                    <textarea
                      name="returnPolicy"
                      value={storeData.returnPolicy || ""}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      placeholder="Nhập chính sách đổi trả của cửa hàng"
                    ></textarea>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-gray-800 text-sm whitespace-pre-line">
                        {storeData.returnPolicy || "Chưa cập nhật chính sách đổi trả."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Shipping Policy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chính sách vận chuyển</label>
                  {isEditing ? (
                    <textarea
                      name="shippingPolicy"
                      value={storeData.shippingPolicy || ""}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      placeholder="Nhập chính sách vận chuyển của cửa hàng"
                    ></textarea>
                  ) : (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-gray-800 text-sm whitespace-pre-line">
                        {storeData.shippingPolicy || "Chưa cập nhật chính sách vận chuyển."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tips */}
            {isEditing && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Mẹo cập nhật thông tin</h4>
                <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                  <li>Thêm logo và ảnh bìa để tăng nhận diện thương hiệu</li>
                  <li>Mô tả cửa hàng nên ngắn gọn, súc tích và hấp dẫn</li>
                  <li>Chính sách đổi trả và vận chuyển rõ ràng giúp tăng niềm tin của khách hàng</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Store

