import { useState, useEffect } from "react"
import { useSearchParams, useNavigate, useParams } from "react-router-dom"
import axiosInstance from "../../utils/axiosInstance"
import { showErrorToast, showSuccessToast } from "../../utils/Toast"
import Loading from "../../utils/Loading"

const ReportShop = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    reason: [],
    otherReason: "",
  })
  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [errors, setErrors] = useState({})
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const { id } = useParams();

  // Danh sách lý do báo cáo
  const reportReasons = [
    { id: "fake", label: "Cửa hàng giả mạo/không đúng mô tả" },
    { id: "scam", label: "Lừa đảo khách hàng" },
    { id: "inappropriate", label: "Nội dung không phù hợp" },
    { id: "copyright", label: "Vi phạm bản quyền" },
    { id: "price", label: "Giá cả không hợp lý" },
    { id: "quality", label: "Chất lượng sản phẩm/dịch vụ kém" },
    { id: "shipping", label: "Vấn đề về vận chuyển/giao hàng" },
    { id: "customer_service", label: "Dịch vụ khách hàng kém" },
    { id: "other", label: "Lý do khác" },
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === 'checkbox') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          reason: [...prev.reason, name]
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          reason: prev.reason.filter(r => r !== name)
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'))
    if (files.length > 0) {
      handleImageUpload({ target: { files } })
    }
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setImageLoading(true)
      // Limit to 5 images
      const newFiles = files.slice(0, 5 - images.length)

      // Validate file size and type
      const validFiles = newFiles.filter(file => {
        const isValidType = file.type.startsWith('image/')
        const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
        return isValidType && isValidSize
      })

      // Create preview URLs
      const newPreviewImages = validFiles.map((file) => URL.createObjectURL(file))

      setImages((prev) => [...prev, ...validFiles])
      setPreviewImages((prev) => [...prev, ...newPreviewImages])
      setImageLoading(false)
    }
  }

  const removeImage = (index) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index])

    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleImageReplace = (index, e) => {
    const file = e.target.files[0]
    if (file) {
      // Revoke old URL
      URL.revokeObjectURL(previewImages[index])

      // Create new preview
      const newPreviewUrl = URL.createObjectURL(file)

      // Update arrays
      const newImages = [...images]
      const newPreviews = [...previewImages]
      newImages[index] = file
      newPreviews[index] = newPreviewUrl

      setImages(newImages)
      setPreviewImages(newPreviews)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (formData.reason.length === 0) {
      newErrors.reason = "Vui lòng chọn ít nhất một lý do báo cáo"
    }

    if (formData.reason.includes('other') && !formData.otherReason.trim()) {
      newErrors.otherReason = "Vui lòng nhập lý do khác"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateForm()) {
        return;
      }
      if(images.length === 0){
        showErrorToast('Vui lòng tải lên hình ảnh');
        return;
      }

      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('shopSlug', id);
      
      // Xử lý lý do báo cáo
      const reasons = formData.reason.map(reasonId => {
        const reason = reportReasons.find(r => r.id === reasonId);
        return reason ? reason.label : reasonId;
      });
      
      let note = reasons.join(', ');
      if (formData.reason.includes('other') && formData.otherReason.trim()) {
        note += ` - ${formData.otherReason.trim()}`;
      }
      formDataToSend.append('note', note);

      // Xử lý hình ảnh
      images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await axiosInstance.post('/user/report/shop/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200 && response.data.status === true) {
        showSuccessToast('Báo cáo cửa hàng thành công');
        navigate(-1);
      }

    } catch (error) {
      console.error('Error:', error.response?.data?.message);
     
      showErrorToast(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {loading && <Loading />}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Báo cáo cửa hàng</h1>
          <p className="text-gray-600">
            Vui lòng cho chúng tôi biết lý do bạn muốn báo cáo cửa hàng mã: {id} này.
          </p>
        </div>
        {/* Form báo cáo */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lý do báo cáo */}
          <div className="form-group">
            <label className="block text-gray-700 font-medium mb-2">
              Lý do báo cáo <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {reportReasons.map((reason) => (
                <div key={reason.id} className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id={reason.id}
                      name={reason.id}
                      checked={formData.reason.includes(reason.id)}
                      onChange={handleInputChange}
                      className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 transition-colors"
                    />
                  </div>
                  <label htmlFor={reason.id} className="ml-3 text-gray-700">
                    {reason.label}
                  </label>
                </div>
              ))}
            </div>
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.reason}
              </p>
            )}

            {/* Hiển thị textarea khi chọn Lý do khác */}
            {formData.reason.includes('other') && (
              <div className="mt-3">
                <textarea
                  name="otherReason"
                  value={formData.otherReason}
                  onChange={handleInputChange}
                  placeholder="Vui lòng nhập lý do khác..."
                  rows="3"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.otherReason ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                ></textarea>
                {errors.otherReason && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.otherReason}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Upload hình ảnh */}
          <div className="form-group mt-6">
            <label className="block text-gray-700 font-medium mb-2">
              Hình ảnh minh họa <span className="text-red-500">(*)</span><span className="text-gray-500 text-sm">(tối đa 5 ảnh)</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${dragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-blue-500'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={images.length >= 5 || imageLoading}
              />
              <label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center cursor-pointer ${images.length >= 5 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                {imageLoading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                ) : (
                  <>
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
                  </>
                )}
              </label>
            </div>

            {/* Preview hình ảnh */}
            {previewImages.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Đã tải lên {previewImages.length}/5 ảnh
                    {previewImages.length === 5 && (
                      <span className="text-yellow-600 ml-2">(Đã đạt giới hạn)</span>
                    )}
                  </span>
                  {previewImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setImages([])
                        setPreviewImages([])
                      }}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Xóa tất cả
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {previewImages.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="relative overflow-hidden rounded-lg aspect-w-1 aspect-h-1">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg border border-gray-200 group-hover:border-blue-500 transition-all duration-200 transform group-hover:scale-105"
                          onClick={() => setSelectedImage(url)}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
                      </div>
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        {/* Nút xem ảnh */}
                        <button
                          type="button"
                          onClick={() => setSelectedImage(url)}
                          className="bg-blue-500 text-white rounded-full p-2 transform hover:scale-110 transition-all shadow-lg hover:shadow-xl"
                          title="Xem ảnh"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>

                        {/* Nút thay thế ảnh */}
                        <label
                          className="bg-yellow-500 text-white rounded-full p-2 transform hover:scale-110 transition-all shadow-lg hover:shadow-xl cursor-pointer"
                          title="Thay thế ảnh"
                        >
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageReplace(index, e)}
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        </label>

                        {/* Nút xóa ảnh */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-red-500 text-white rounded-full p-2 transform hover:scale-110 transition-all shadow-lg hover:shadow-xl"
                          title="Xóa ảnh"
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
                      <span className="absolute bottom-2 left-2 text-xs bg-black bg-opacity-50 text-white px-2 py-1 rounded-full">
                        Ảnh {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal xem ảnh */}
          {selectedImage && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
              onClick={() => setSelectedImage(null)}
            >
              <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-2 transform hover:scale-110 transition-all shadow-lg hover:shadow-xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Điều khoản và nút gửi */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center ${loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"}`}
              >
                {loading ? (
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
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Gửi báo cáo
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReportShop

