"use client"

import { useState } from "react"

const ShopInfoStep = ({ formData, handleChange, handleCategoryChange, errors }) => {
  const [logoPreview, setLogoPreview] = useState(formData.shopLogo ? URL.createObjectURL(formData.shopLogo) : null)
  const [bannerPreview, setBannerPreview] = useState(
    formData.shopBanner ? URL.createObjectURL(formData.shopBanner) : null,
  )

  // Danh sách loại hình kinh doanh
  const businessTypes = [
    { id: "individual", name: "Cá nhân" },
    { id: "business", name: "Doanh nghiệp" },
    { id: "cooperative", name: "Hợp tác xã" },
    { id: "household", name: "Hộ kinh doanh" },
  ]

  // Danh sách danh mục kinh doanh
  const categories = [
    { id: 1, name: "Sách tiếng Việt" },
    { id: 2, name: "Sách nước ngoài" },
    { id: 3, name: "Văn phòng phẩm" },
    { id: 4, name: "Quà lưu niệm" },
    { id: 5, name: "Đồ chơi" },
    { id: 6, name: "Sách giáo khoa - tham khảo" },
    { id: 7, name: "Truyện tranh, manga" },
    { id: 8, name: "Tạp chí & báo" },
    { id: 9, name: "Sách kỹ năng sống" },
    { id: 10, name: "Sách kinh tế" },
  ]

  // Xử lý thay đổi logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleChange({
        target: {
          name: "shopLogo",
          value: file,
          type: "file",
          files: e.target.files,
        },
      })
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  // Xử lý thay đổi banner
  const handleBannerChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleChange({
        target: {
          name: "shopBanner",
          value: file,
          type: "file",
          files: e.target.files,
        },
      })
      setBannerPreview(URL.createObjectURL(file))
    }
  }

  // Xử lý chọn danh mục
  const handleCategorySelect = (categoryId) => {
    const isSelected = formData.mainCategories.includes(categoryId)
    let updatedCategories

    if (isSelected) {
      updatedCategories = formData.mainCategories.filter((id) => id !== categoryId)
    } else {
      updatedCategories = [...formData.mainCategories, categoryId]
    }

    handleCategoryChange(updatedCategories)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin cửa hàng</h2>
      <p className="text-gray-600 mb-6">
        Vui lòng cung cấp thông tin chi tiết về cửa hàng của bạn để khách hàng có thể dễ dàng tìm thấy.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tên cửa hàng */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Tên cửa hàng <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.shopName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập tên cửa hàng"
          />
          {errors.shopName && <p className="text-red-500 text-sm mt-1">{errors.shopName}</p>}
        </div>

        {/* Loại hình kinh doanh */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Loại hình kinh doanh <span className="text-red-500">*</span>
          </label>
          <select
            name="businessType"
            value={formData.businessType}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.businessType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">-- Chọn loại hình kinh doanh --</option>
            {businessTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.businessType && <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>}
        </div>

        {/* Mã số thuế */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Mã số thuế {formData.businessType === "individual" ? "" : <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            name="taxCode"
            value={formData.taxCode}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.taxCode ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập mã số thuế"
            disabled={formData.businessType === "individual"}
          />
          {errors.taxCode && <p className="text-red-500 text-sm mt-1">{errors.taxCode}</p>}
          {formData.businessType === "individual" && (
            <p className="text-gray-500 text-sm mt-1">Không bắt buộc đối với cá nhân kinh doanh</p>
          )}
        </div>
      </div>

      {/* Mô tả cửa hàng */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Mô tả cửa hàng <span className="text-red-500">*</span>
        </label>
        <textarea
          name="shopDescription"
          value={formData.shopDescription}
          onChange={handleChange}
          rows="4"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.shopDescription ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Mô tả ngắn gọn về cửa hàng của bạn, các sản phẩm bạn bán và điểm nổi bật của cửa hàng..."
        ></textarea>
        {errors.shopDescription && <p className="text-red-500 text-sm mt-1">{errors.shopDescription}</p>}
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Hình ảnh cửa hàng</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Logo cửa hàng */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Logo cửa hàng <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {logoPreview ? (
                <div className="relative">
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Logo preview"
                    className="w-32 h-32 mx-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogoPreview(null)
                      handleChange({
                        target: {
                          name: "shopLogo",
                          value: null,
                        },
                      })
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500 mb-2">Tải lên logo cửa hàng</p>
                </>
              )}
              <input type="file" id="logo-upload" accept="image/*" onChange={handleLogoChange} className="hidden" />
              <label
                htmlFor="logo-upload"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer inline-block"
              >
                Chọn ảnh
              </label>
              <p className="text-gray-500 text-xs mt-2">PNG, JPG (tối đa 2MB, kích thước khuyến nghị 300x300px)</p>
            </div>
            {errors.shopLogo && <p className="text-red-500 text-sm mt-1">{errors.shopLogo}</p>}
          </div>

          {/* Banner cửa hàng */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Banner cửa hàng</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {bannerPreview ? (
                <div className="relative">
                  <img
                    src={bannerPreview || "/placeholder.svg"}
                    alt="Banner preview"
                    className="w-full h-32 mx-auto object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setBannerPreview(null)
                      handleChange({
                        target: {
                          name: "shopBanner",
                          value: null,
                        },
                      })
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-500 mb-2">Tải lên banner cửa hàng</p>
                </>
              )}
              <input type="file" id="banner-upload" accept="image/*" onChange={handleBannerChange} className="hidden" />
              <label
                htmlFor="banner-upload"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer inline-block"
              >
                Chọn ảnh
              </label>
              <p className="text-gray-500 text-xs mt-2">PNG, JPG (tối đa 2MB, kích thước khuyến nghị 1200x300px)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Danh mục kinh doanh <span className="text-red-500">*</span>
        </h3>
        <p className="text-gray-600 mb-4">
          Chọn các danh mục sản phẩm mà cửa hàng của bạn kinh doanh (tối đa 5 danh mục)
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category.id}`}
                checked={formData.mainCategories.includes(category.id)}
                onChange={() => handleCategorySelect(category.id)}
                disabled={!formData.mainCategories.includes(category.id) && formData.mainCategories.length >= 5}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <label htmlFor={`category-${category.id}`} className="ml-2 text-sm text-gray-700">
                {category.name}
              </label>
            </div>
          ))}
        </div>
        {errors.mainCategories && <p className="text-red-500 text-sm mt-1">{errors.mainCategories}</p>}
        <p className="text-gray-500 text-sm mt-2">Đã chọn {formData.mainCategories.length}/5 danh mục</p>
      </div>
    </div>
  )
}

export default ShopInfoStep

