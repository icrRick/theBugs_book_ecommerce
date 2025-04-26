"use client"

import { useState, useEffect, useCallback } from "react"
import axiosInstance from "../../utils/axiosInstance"
import axios from "axios"
import { getToken } from "../../utils/cookie"
import { showErrorToast, showSuccessToast } from "../../utils/Toast"

// Custom hook để quản lý địa chỉ
const useAddressManagement = () => {
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [addressNames, setAddressNames] = useState({
    provinceName: "Đang tải...",
    districtName: "Đang tải...",
    wardName: "Đang tải...",
  })
  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    wards: false,
  })

  // Fetch tỉnh/thành phố
  const fetchProvinces = useCallback(async () => {
    setLoading((prev) => ({ ...prev, provinces: true }))
    try {
      const response = await axios.get("http://localhost:8080/api/users/get-province-infor", {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      })
      setProvinces(response.data.data || [])
    } catch (error) {
      console.error("Error fetching provinces:", error)
    } finally {
      setLoading((prev) => ({ ...prev, provinces: false }))
    }
  }, [])

  // Fetch quận/huyện
  const fetchDistricts = useCallback(async (provinceId) => {
    if (!provinceId) return

    setLoading((prev) => ({ ...prev, districts: true }))
    try {
      const response = await axios.get("http://localhost:8080/api/users/get-district-infor", {
        params: { provinceID: provinceId },
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      })
      setDistricts(response.data.data || [])
    } catch (error) {
      console.error("Error fetching districts:", error)
    } finally {
      setLoading((prev) => ({ ...prev, districts: false }))
    }
  }, [])

  // Fetch phường/xã
  const fetchWards = useCallback(async (districtId) => {
    if (!districtId) return

    setLoading((prev) => ({ ...prev, wards: true }))
    try {
      const response = await axios.get("http://localhost:8080/api/users/get-ward-infor", {
        params: { districtID: districtId },
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
      })
      setWards(response.data.data || [])
    } catch (error) {
      console.error("Error fetching wards:", error)
    } finally {
      setLoading((prev) => ({ ...prev, wards: false }))
    }
  }, [])

  // Fetch tên địa chỉ
  const fetchAddressNames = useCallback(async (provinceId, districtId, wardId) => {
    try {
      const names = {
        provinceName: "Chưa cập nhật",
        districtName: "Chưa cập nhật",
        wardName: "Chưa cập nhật",
      }

      // Fetch tên tỉnh
      if (provinceId) {
        const provinceRes = await axios.get("http://localhost:8080/api/users/get-province-infor", {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        const province = provinceRes.data.data.find((p) => p.ProvinceID === provinceId)
        if (province) {
          names.provinceName = province.ProvinceName
        }
      }

      // Fetch tên quận/huyện
      if (provinceId && districtId) {
        const districtRes = await axios.get("http://localhost:8080/api/users/get-district-infor", {
          params: { provinceID: provinceId },
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        const district = districtRes.data.data.find((d) => d.DistrictID === districtId)
        if (district) {
          names.districtName = district.DistrictName
        }
      }

      // Fetch tên phường/xã
      if (districtId && wardId) {
        const wardRes = await axios.get("http://localhost:8080/api/users/get-ward-infor", {
          params: { districtID: districtId },
          headers: { Authorization: `Bearer ${getToken()}` },
        })
        const ward = wardRes.data.data.find((w) => w.WardCode === wardId)
        if (ward) {
          names.wardName = ward.WardName
        }
      }

      setAddressNames(names)
    } catch (error) {
      console.error("Error fetching address names:", error)
      setAddressNames({
        provinceName: "Lỗi khi tải",
        districtName: "Lỗi khi tải",
        wardName: "Lỗi khi tải",
      })
    }
  }, [])

  return {
    provinces,
    districts,
    wards,
    addressNames,
    loading,
    fetchProvinces,
    fetchDistricts,
    fetchWards,
    fetchAddressNames,
    setAddressNames,
  }
}

const Store = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    phoneNumber: "",
    email: "",
    addressDetail: "",
    provinceId: "",
    districtId: "",
    wardId: "",
    logoUrl: "",
    bannerUrl: "",
    bankOwnerName: "",
    bankOwnerNumber: "",
    bankProvideName: "",
    shopSlug: "",
  })

  const [previewLogo, setPreviewLogo] = useState(null)
  const [previewBanner, setPreviewBanner] = useState(null)
  const [originalData, setOriginalData] = useState({})

  const {
    provinces,
    districts,
    wards,
    addressNames,
    loading,
    fetchProvinces,
    fetchDistricts,
    fetchWards,
    fetchAddressNames,
    setAddressNames,
  } = useAddressManagement()

  // Fetch shop data
  const fetchShopData = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.get("/api/seller/me")
      const data = response.data.data

      setStoreData(data)
      setOriginalData(data)
      setPreviewLogo(data.logoUrl)
      setPreviewBanner(data.bannerUrl)

      // Fetch địa chỉ nếu có
      if (data.provinceId || data.districtId || data.wardId) {
        fetchAddressNames(data.provinceId, data.districtId, data.wardId)
      } else {
        setAddressNames({
          provinceName: "Chưa cập nhật",
          districtName: "Chưa cập nhật",
          wardName: "Chưa cập nhật",
        })
      }
    } catch (error) {
      console.error("Error fetching shop data:", error)
      showErrorToast("Không thể tải thông tin cửa hàng")
    } finally {
      setIsLoading(false)
    }
  }, [fetchAddressNames, setAddressNames])

  // Initial data load
  useEffect(() => {
    fetchShopData()
  }, [fetchShopData])

  // Load address data when editing
  useEffect(() => {
    if (isEditing) {
      fetchProvinces()

      if (storeData.provinceId) {
        fetchDistricts(storeData.provinceId)
      }

      if (storeData.districtId) {
        fetchWards(storeData.districtId)
      }
    }
  }, [isEditing, storeData.provinceId, storeData.districtId, fetchProvinces, fetchDistricts, fetchWards])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setStoreData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle file uploads
  const handleBannerChange = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      setPreviewBanner(files[0])
    }
  }

  const handleLogoChange = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      setPreviewLogo(files[0])
    }
  }

  // Handle address changes
  const handleAddressChange = (field, value) => {
    setStoreData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Reset dependent fields
    if (field === "provinceId" && value) {
      fetchDistricts(value)
      setStoreData((prev) => ({
        ...prev,
        districtId: "",
        wardId: "",
      }))
    } else if (field === "districtId" && value) {
      fetchWards(value)
      setStoreData((prev) => ({
        ...prev,
        wardId: "",
      }))
    }
  }

  const handleProvinceChange = (e) => {
    const provinceId = Number.parseInt(e.target.value, 10)
    handleAddressChange("provinceId", provinceId)
  }

  const handleDistrictChange = (e) => {
    const districtId = e.target.value
    handleAddressChange("districtId", districtId)
  }

  const handleWardChange = (e) => {
    const wardId = e.target.value
    handleAddressChange("wardId", wardId)
  }

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Build shop info data
    const shopInfoData = {
      name: storeData.name || "",
      email: storeData.email || "",
      phoneNumber: storeData.phoneNumber || "",
      description: storeData.description || "",
      bankOwnerName: storeData.bankOwnerName || "",
      bankOwnerNumber: storeData.bankOwnerNumber || "",
      bankProvideName: storeData.bankProvideName || "",
      addressDetail: storeData.addressDetail || "",
      wardId: storeData.wardId || "",
      districtId: storeData.districtId || "",
      provinceId: storeData.provinceId || "",
      logoUrl: storeData.logoUrl || "",
      bannerUrl: storeData.bannerUrl || "",
    }

    try {
      const formDataToSend = new FormData()

      // Append shop info as JSON blob
      formDataToSend.append(
        "shopInfo",
        new Blob([JSON.stringify(shopInfoData)], {
          type: "application/json",
        }),
      )

      // Append files if changed
      if (previewLogo instanceof File) {
        formDataToSend.append("logo", previewLogo)
      }

      if (previewBanner instanceof File) {
        formDataToSend.append("banner", previewBanner)
      }

      const response = await axiosInstance.put("/api/seller/store", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const data = response.data
      if (data.status) {
        showSuccessToast(data.message || "Cập nhật thành công")
        setIsEditing(false)
        fetchShopData()
      }
    } catch (error) {
      console.error("Error updating shop info:", error)
      if (error.response) {
        showErrorToast(error.response.data.message || "Cập nhật thất bại")
      } else {
        showErrorToast("Đã xảy ra lỗi khi cập nhật")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cancel editing
  const handleCancel = () => {
    setStoreData({ ...originalData })
    setPreviewLogo(originalData.logoUrl)
    setPreviewBanner(originalData.bannerUrl)
    setIsEditing(false)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin cửa hàng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Thông tin cửa hàng</h1>
            <p className="text-gray-500 mt-1">Quản lý thông tin và hình ảnh cửa hàng của bạn</p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm transition-all duration-200 flex items-center"
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
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                ></path>
              </svg>
              Chỉnh sửa
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm transition-all duration-200"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-emerald-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm transition-all duration-200 flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Store Banner and Logo */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8 transition-all duration-300 hover:shadow-md">
          {/* Banner */}
          <div className="relative h-56 md:h-72 bg-gradient-to-r from-gray-100 to-gray-200">
            {previewBanner ? (
              <img
                src={previewBanner instanceof File ? URL.createObjectURL(previewBanner) : previewBanner}
                alt="Ảnh bìa cửa hàng"
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400 text-sm">Chưa có ảnh bìa</span>
              </div>
            )}

            {isEditing && (
              <div className="absolute bottom-4 right-4">
                <label className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 group">
                  <input type="file" accept="image/*" className="hidden" onChange={handleBannerChange} />
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

          {/* Logo */}
          <div className="px-6 py-5 flex flex-col md:flex-row md:items-center">
            <div className="relative -mt-20 md:-mt-16 mb-4 md:mb-0 md:mr-6">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-md transition-transform duration-300 hover:scale-105">
                {previewLogo ? (
                  <img
                    src={previewLogo instanceof File ? URL.createObjectURL(previewLogo) : previewLogo}
                    alt="Logo cửa hàng"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <span className="text-gray-400 text-sm">Logo</span>
                  </div>
                )}

                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-all duration-200 group">
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
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
              {!isEditing && storeData.shopSlug && (
                <p className="text-gray-500 mt-1 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    ></path>
                  </svg>
                  {storeData.shopSlug}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className="grid grid-cols-1 gap-8">
          {/* Main Information */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8 transition-all duration-300 hover:shadow-md">
              <h3 className="text-lg font-medium text-gray-800 mb-6 pb-2 border-b border-gray-100 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                Thông tin liên hệ
              </h3>

              <div className="space-y-6">
                {/* Email */}
                <div className="transition-all duration-200 p-3 rounded-md hover:bg-gray-50">
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
                    <p className="text-gray-800 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                      {storeData.email || "Chưa cập nhật"}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="transition-all duration-200 p-3 rounded-md hover:bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phoneNumber"
                      value={storeData.phoneNumber || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <p className="text-gray-800 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V6a2 2 0 012-2z"
                        ></path>
                      </svg>
                      {storeData.phoneNumber || "Chưa cập nhật"}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="transition-all duration-200 p-3 rounded-md hover:bg-gray-50">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="addressDetail"
                      value={storeData.addressDetail || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      placeholder="Nhập địa chỉ cửa hàng"
                    />
                  ) : (
                    <p className="text-gray-800 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {storeData.addressDetail || "Chưa cập nhật"}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Tỉnh/Thành phố */}
                  <div className="transition-all duration-200 p-3 rounded-md hover:bg-gray-50">
                    <label className="block text-gray-700 font-medium mb-2">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <select
                          name="provinceId"
                          value={storeData?.provinceId ?? ""}
                          onChange={handleProvinceChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 appearance-none"
                          disabled={loading.provinces}
                        >
                          <option value="">-- Chọn Tỉnh/Thành phố --</option>
                          {provinces?.map((province) => (
                            <option key={province.ProvinceID} value={province.ProvinceID}>
                              {province.ProvinceName}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                        {loading.provinces && (
                          <div className="absolute inset-y-0 right-8 flex items-center">
                            <svg
                              className="animate-spin h-4 w-4 text-emerald-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-800 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        {addressNames.provinceName}
                      </p>
                    )}
                  </div>

                  {/* Quận/Huyện */}
                  <div className="transition-all duration-200 p-3 rounded-md hover:bg-gray-50">
                    <label className="block text-gray-700 font-medium mb-2">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <select
                          name="districtId"
                          value={storeData?.districtId || ""}
                          onChange={handleDistrictChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 appearance-none"
                          disabled={!storeData.provinceId || loading.districts}
                        >
                          <option value="">-- Chọn Quận/Huyện --</option>
                          {districts.map((district) => (
                            <option key={district.DistrictID} value={district.DistrictID}>
                              {district.DistrictName}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                        {loading.districts && (
                          <div className="absolute inset-y-0 right-8 flex items-center">
                            <svg
                              className="animate-spin h-4 w-4 text-emerald-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-800 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        {addressNames.districtName}
                      </p>
                    )}
                  </div>

                  {/* Phường/Xã */}
                  <div className="transition-all duration-200 p-3 rounded-md hover:bg-gray-50">
                    <label className="block text-gray-700 font-medium mb-2">
                      Phường/Xã <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <div className="relative">
                        <select
                          name="wardId"
                          value={storeData?.wardId || ""}
                          onChange={handleWardChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200 appearance-none"
                          disabled={!storeData.districtId || loading.wards}
                        >
                          <option value="">-- Chọn Phường/Xã --</option>
                          {wards.map((ward) => (
                            <option key={ward.WardCode} value={ward.WardCode}>
                              {ward.WardName}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            ></path>
                          </svg>
                        </div>
                        {loading.wards && (
                          <div className="absolute inset-y-0 right-8 flex items-center">
                            <svg
                              className="animate-spin h-4 w-4 text-emerald-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-800 flex items-center">
                        <svg
                          className="w-4 h-4 mr-2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        {addressNames.wardName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-300 hover:shadow-md">
              <h3 className="text-lg font-medium text-gray-800 mb-6 pb-2 border-b border-gray-100 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                Mô tả cửa hàng
              </h3>

              {isEditing ? (
                <textarea
                  name="description"
                  value={storeData.description || ""}
                  onChange={handleChange}
                  rows={5}
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
        </div>
      </div>
    </div>
  )
}

export default Store
