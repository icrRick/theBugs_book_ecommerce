"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"

const Report = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [product, setProduct] = useState(null)
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
  })
  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [errors, setErrors] = useState({})
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const productId = searchParams.get("productId")

  // Danh sách lý do báo cáo
  const reportReasons = [
    { id: "fake", label: "Sản phẩm giả mạo/không đúng mô tả" },
    { id: "inappropriate", label: "Nội dung không phù hợp" },
    { id: "copyright", label: "Vi phạm bản quyền" },
    { id: "price", label: "Giá cả không hợp lý" },
    { id: "quality", label: "Chất lượng sản phẩm kém" },
    { id: "other", label: "Lý do khác" },
  ]

  // Giả lập lấy thông tin sản phẩm từ API
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true)
      try {
        // Giả lập API call
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Dữ liệu mẫu
        const productData = {
          id: productId || "1",
          name: "Đắc Nhân Tâm",
          image: "https://placehold.co/300x400/2ecc71/ffffff?text=Đắc+Nhân+Tâm",
          shop: "Shop A",
          price: 150000,
          discountPrice: 120000,
        }

        setProduct(productData)
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [productId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      // Limit to 5 images
      const newFiles = files.slice(0, 5 - images.length)

      // Create preview URLs
      const newPreviewImages = newFiles.map((file) => URL.createObjectURL(file))

      setImages((prev) => [...prev, ...newFiles])
      setPreviewImages((prev) => [...prev, ...newPreviewImages])
    }
  }

  const removeImage = (index) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index])

    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.reason) {
      newErrors.reason = "Vui lòng chọn lý do báo cáo"
    }

    if (!formData.description || formData.description.trim().length < 10) {
      newErrors.description = "Vui lòng mô tả chi tiết vấn đề (ít nhất 10 ký tự)"
    }

    if (formData.contactEmail && !/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Email không hợp lệ"
    }

    if (formData.contactPhone && !/^[0-9]{10,11}$/.test(formData.contactPhone)) {
      newErrors.contactPhone = "Số điện thoại không hợp lệ"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      // Giả lập API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Giả lập thành công
      setSubmitSuccess(true)

      // Reset form sau khi gửi thành công
      setTimeout(() => {
        navigate("/")
      }, 3000)
    } catch (error) {
      console.error("Error submitting report:", error)
      alert("Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại sau.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Báo cáo đã được gửi thành công!</h2>
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã gửi báo cáo. Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.
        </p>
        <p className="text-gray-500 text-sm">Bạn sẽ được chuyển hướng về trang chủ sau vài giây...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Báo cáo sản phẩm</h1>
        <p className="text-gray-600 mb-6">
          Vui lòng cung cấp thông tin chi tiết về vấn đề bạn gặp phải với sản phẩm này. Chúng tôi sẽ xem xét báo cáo của
          bạn và thực hiện các biện pháp thích hợp.
        </p>

        {/* Thông tin sản phẩm */}
        {product && (
          <div className="flex items-center p-4 border border-gray-200 rounded-lg mb-6 bg-gray-50">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-md mr-4"
            />
            <div>
              <h3 className="font-medium text-gray-800">{product.name}</h3>
              <p className="text-gray-600 text-sm">Shop: {product.shop}</p>
              <div className="flex items-center mt-1">
                <span className="text-red-600 font-semibold">{product.discountPrice.toLocaleString()}đ</span>
                {product.price > product.discountPrice && (
                  <span className="text-gray-500 line-through ml-2 text-sm">{product.price.toLocaleString()}đ</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form báo cáo */}
        <form onSubmit={handleSubmit}>
          {/* Lý do báo cáo */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Lý do báo cáo <span className="text-red-500">*</span>
            </label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.reason ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Chọn lý do --</option>
              {reportReasons.map((reason) => (
                <option key={reason.id} value={reason.id}>
                  {reason.label}
                </option>
              ))}
            </select>
            {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
          </div>

          {/* Mô tả chi tiết */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Mô tả chi tiết <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải với sản phẩm này..."
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            <p className="text-gray-500 text-sm mt-1">Còn lại: {1000 - formData.description.length} ký tự</p>
          </div>

          {/* Upload hình ảnh */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Hình ảnh minh họa (tối đa 5 ảnh)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={images.length >= 5}
              />
              <label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center cursor-pointer ${
                  images.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mb-3"
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
                <p className="text-gray-700 font-medium">Kéo thả hoặc nhấp để tải lên</p>
                <p className="text-gray-500 text-sm mt-1">PNG, JPG (tối đa 5MB/ảnh)</p>
              </label>
            </div>

            {/* Preview hình ảnh */}
            {previewImages.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {previewImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                ))}
              </div>
            )}
          </div>

          {/* Thông tin liên hệ */}
          <div className="mb-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin liên hệ (không bắt buộc)</h3>
            <p className="text-gray-600 mb-4">
              Cung cấp thông tin liên hệ của bạn để chúng tôi có thể phản hồi trực tiếp về báo cáo này.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.contactEmail ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.contactEmail && <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="0912345678"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.contactPhone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.contactPhone && <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>}
              </div>
            </div>
          </div>

          {/* Điều khoản và nút gửi */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-start mb-6">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                Tôi xác nhận rằng thông tin báo cáo là chính xác và đồng ý với{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  điều khoản và điều kiện
                </a>{" "}
                của website.
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center ${
                  submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {submitting && (
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
                )}
                {submitting ? "Đang gửi..." : "Gửi báo cáo"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Report

