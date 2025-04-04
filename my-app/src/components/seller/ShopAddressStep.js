"use client"

import { useState, useEffect } from "react"

const ShopAddressStep = ({ formData, handleChange, handleAddressChange, errors }) => {
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    wards: false,
  })

  // Fetch tỉnh/thành phố khi component mount
  useEffect(() => {
    fetchProvinces()
  }, [])

  // Fetch quận/huyện khi tỉnh/thành phố thay đổi
  useEffect(() => {
    if (formData.provinceId) {
      fetchDistricts(formData.provinceId)
    } else {
      setDistricts([])
      handleAddressChange("districtId", "")
      handleAddressChange("wardId", "")
    }
  }, [formData.provinceId])

  // Fetch phường/xã khi quận/huyện thay đổi
  useEffect(() => {
    if (formData.districtId) {
      fetchWards(formData.districtId)
    } else {
      setWards([])
      handleAddressChange("wardId", "")
    }
  }, [formData.districtId])

  // Giả lập API call để lấy danh sách tỉnh/thành phố
  const fetchProvinces = async () => {
    setLoading((prev) => ({ ...prev, provinces: true }))
    try {
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Dữ liệu mẫu
      const sampleProvinces = [
        { ProvinceID: 201, ProvinceName: "Hà Nội" },
        { ProvinceID: 202, ProvinceName: "TP. Hồ Chí Minh" },
        { ProvinceID: 203, ProvinceName: "Đà Nẵng" },
        { ProvinceID: 204, ProvinceName: "Hải Phòng" },
        { ProvinceID: 205, ProvinceName: "Cần Thơ" },
        { ProvinceID: 206, ProvinceName: "An Giang" },
        { ProvinceID: 207, ProvinceName: "Bà Rịa - Vũng Tàu" },
        { ProvinceID: 208, ProvinceName: "Bắc Giang" },
        { ProvinceID: 209, ProvinceName: "Bắc Kạn" },
        { ProvinceID: 210, ProvinceName: "Bạc Liêu" },
      ]

      setProvinces(sampleProvinces)
    } catch (error) {
      console.error("Error fetching provinces:", error)
    } finally {
      setLoading((prev) => ({ ...prev, provinces: false }))
    }
  }

  // Giả lập API call để lấy danh sách quận/huyện
  const fetchDistricts = async (provinceId) => {
    setLoading((prev) => ({ ...prev, districts: true }))
    try {
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Dữ liệu mẫu
      const sampleDistricts = [
        { DistrictID: 1001, DistrictName: "Quận Ba Đình", ProvinceID: 201 },
        { DistrictID: 1002, DistrictName: "Quận Hoàn Kiếm", ProvinceID: 201 },
        { DistrictID: 1003, DistrictName: "Quận Tây Hồ", ProvinceID: 201 },
        { DistrictID: 1004, DistrictName: "Quận Long Biên", ProvinceID: 201 },
        { DistrictID: 1005, DistrictName: "Quận Cầu Giấy", ProvinceID: 201 },
        { DistrictID: 1006, DistrictName: "Quận 1", ProvinceID: 202 },
        { DistrictID: 1007, DistrictName: "Quận 3", ProvinceID: 202 },
        { DistrictID: 1008, DistrictName: "Quận 4", ProvinceID: 202 },
        { DistrictID: 1009, DistrictName: "Quận 5", ProvinceID: 202 },
        { DistrictID: 1010, DistrictName: "Quận 6", ProvinceID: 202 },
      ]

      // Lọc quận/huyện theo tỉnh/thành phố
      const filteredDistricts = sampleDistricts.filter(
        (district) => district.ProvinceID === Number.parseInt(provinceId),
      )

      setDistricts(filteredDistricts)
    } catch (error) {
      console.error("Error fetching districts:", error)
    } finally {
      setLoading((prev) => ({ ...prev, districts: false }))
    }
  }

  // Giả lập API call để lấy danh sách phường/xã
  const fetchWards = async (districtId) => {
    setLoading((prev) => ({ ...prev, wards: true }))
    try {
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Dữ liệu mẫu
      const sampleWards = [
        { WardCode: "00001", WardName: "Phường Phúc Xá", DistrictID: 1001 },
        { WardCode: "00002", WardName: "Phường Trúc Bạch", DistrictID: 1001 },
        { WardCode: "00003", WardName: "Phường Vĩnh Phúc", DistrictID: 1001 },
        { WardCode: "00004", WardName: "Phường Cống Vị", DistrictID: 1001 },
        { WardCode: "00005", WardName: "Phường Liễu Giai", DistrictID: 1001 },
        { WardCode: "00006", WardName: "Phường Phạm Đình Hổ", DistrictID: 1002 },
        { WardCode: "00007", WardName: "Phường Hàng Mã", DistrictID: 1002 },
        { WardCode: "00008", WardName: "Phường Hàng Buồm", DistrictID: 1002 },
        { WardCode: "00009", WardName: "Phường Hàng Đào", DistrictID: 1002 },
        { WardCode: "00010", WardName: "Phường Bến Nghé", DistrictID: 1006 },
        { WardCode: "00011", WardName: "Phường Bến Thành", DistrictID: 1006 },
        { WardCode: "00012", WardName: "Phường Nguyễn Thái Bình", DistrictID: 1006 },
        { WardCode: "00013", WardName: "Phường Phạm Ngũ Lão", DistrictID: 1006 },
      ]

      // Lọc phường/xã theo quận/huyện
      const filteredWards = sampleWards.filter((ward) => ward.DistrictID === Number.parseInt(districtId))

      setWards(filteredWards)
    } catch (error) {
      console.error("Error fetching wards:", error)
    } finally {
      setLoading((prev) => ({ ...prev, wards: false }))
    }
  }

  // Xử lý thay đổi tỉnh/thành phố
  const handleProvinceChange = (e) => {
    const provinceId = e.target.value
    const provinceName = e.target.options[e.target.selectedIndex].text
    handleAddressChange("provinceId", provinceId, provinceName)
  }

  // Xử lý thay đổi quận/huyện
  const handleDistrictChange = (e) => {
    const districtId = e.target.value
    const districtName = e.target.options[e.target.selectedIndex].text
    handleAddressChange("districtId", districtId, districtName)
  }

  // Xử lý thay đổi phường/xã
  const handleWardChange = (e) => {
    const wardId = e.target.value
    const wardName = e.target.options[e.target.selectedIndex].text
    handleAddressChange("wardId", wardId, wardName)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Địa chỉ cửa hàng</h2>
      <p className="text-gray-600 mb-6">
        Vui lòng cung cấp địa chỉ chính xác của cửa hàng để khách hàng có thể tìm thấy bạn.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tỉnh/Thành phố */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Tỉnh/Thành phố <span className="text-red-500">*</span>
          </label>
          <select
            name="provinceId"
            value={formData.provinceId}
            onChange={handleProvinceChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.provinceId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={loading.provinces}
          >
            <option value="">-- Chọn Tỉnh/Thành phố --</option>
            {provinces.map((province) => (
              <option key={province.ProvinceID} value={province.ProvinceID}>
                {province.ProvinceName}
              </option>
            ))}
          </select>
          {loading.provinces && (
            <div className="flex items-center mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
              <span className="text-sm text-gray-500">Đang tải...</span>
            </div>
          )}
          {errors.provinceId && <p className="text-red-500 text-sm mt-1">{errors.provinceId}</p>}
        </div>

        {/* Quận/Huyện */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Quận/Huyện <span className="text-red-500">*</span>
          </label>
          <select
            name="districtId"
            value={formData.districtId}
            onChange={handleDistrictChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.districtId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={!formData.provinceId || loading.districts}
          >
            <option value="">-- Chọn Quận/Huyện --</option>
            {districts.map((district) => (
              <option key={district.DistrictID} value={district.DistrictID}>
                {district.DistrictName}
              </option>
            ))}
          </select>
          {loading.districts && (
            <div className="flex items-center mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
              <span className="text-sm text-gray-500">Đang tải...</span>
            </div>
          )}
          {errors.districtId && <p className="text-red-500 text-sm mt-1">{errors.districtId}</p>}
        </div>

        {/* Phường/Xã */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Phường/Xã <span className="text-red-500">*</span>
          </label>
          <select
            name="wardId"
            value={formData.wardId}
            onChange={handleWardChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.wardId ? "border-red-500" : "border-gray-300"
            }`}
            disabled={!formData.districtId || loading.wards}
          >
            <option value="">-- Chọn Phường/Xã --</option>
            {wards.map((ward) => (
              <option key={ward.WardCode} value={ward.WardCode}>
                {ward.WardName}
              </option>
            ))}
          </select>
          {loading.wards && (
            <div className="flex items-center mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
              <span className="text-sm text-gray-500">Đang tải...</span>
            </div>
          )}
          {errors.wardId && <p className="text-red-500 text-sm mt-1">{errors.wardId}</p>}
        </div>
      </div>

      {/* Địa chỉ chi tiết */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Địa chỉ chi tiết <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.address ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Số nhà, tên đường, tòa nhà, khu vực..."
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      {/* Địa chỉ trụ sở chính */}
      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="isHeadquarter"
          name="isHeadquarter"
          checked={formData.isHeadquarter}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor="isHeadquarter" className="ml-2 text-gray-700">
          Đây là địa chỉ trụ sở chính của cửa hàng
        </label>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Xác nhận thông tin</h3>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-gray-700 mb-4">
            Vui lòng kiểm tra lại thông tin địa chỉ trước khi hoàn tất đăng ký. Địa chỉ này sẽ được sử dụng để:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Hiển thị trên trang cửa hàng của bạn</li>
            <li>Tính phí vận chuyển cho các đơn hàng</li>
            <li>Gửi các thông báo quan trọng từ hệ thống</li>
          </ul>
        </div>

        {formData.provinceId && formData.districtId && formData.wardId && formData.address && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-800 mb-2">Địa chỉ đã nhập:</h4>
            <p className="text-gray-700">
              {formData.address}, {formData.wardName}, {formData.districtName}, {formData.provinceName}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShopAddressStep

