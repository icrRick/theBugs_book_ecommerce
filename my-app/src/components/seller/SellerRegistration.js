"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import SellerInfoStep from "./SellerInfoStep"
import IdRecognitionStep from "./IdRecognitionStep"
import ShopInfoStep from "./ShopInfoStep"
import ShopAddressStep from "./ShopAddressStep"

const SellerRegistration = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Account Info
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,

    // ID Recognition
    idType: "cccd",
    idNumber: "",
    idIssueDate: "",
    idIssuedBy: "",
    dob: "",
    gender: "",
    idFrontImage: null,
    idBackImage: null,
    idRecognitionData: null,

    // Personal Info
    bankName: "",
    bankAccount: "",
    bankAccountName: "",

    // Shop Info
    shopName: "",
    shopDescription: "",
    shopLogo: null,
    shopBanner: null,
    businessType: "",
    mainCategories: [],
    taxCode: "",

    // Shop Address
    provinceId: "",
    provinceName: "",
    districtId: "",
    districtName: "",
    wardId: "",
    wardName: "",
    address: "",
    isHeadquarter: true,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [registrationComplete, setRegistrationComplete] = useState(false)
  const [isProcessingId, setIsProcessingId] = useState(false)

  // Xử lý thay đổi dữ liệu form
  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target

    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      })
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      })
    }
  }

  // Xử lý thay đổi địa chỉ
  const handleAddressChange = (field, value, displayValue = "") => {
    setFormData({
      ...formData,
      [field]: value,
      [`${field.replace("Id", "Name")}`]: displayValue,
    })

    // Clear error when field is edited
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      })
    }
  }

  // Xử lý thay đổi danh mục
  const handleCategoryChange = (selectedCategories) => {
    setFormData({
      ...formData,
      mainCategories: selectedCategories,
    })

    if (errors.mainCategories) {
      setErrors({
        ...errors,
        mainCategories: "",
      })
    }
  }

  // Xử lý dữ liệu nhận diện CCCD/CMND
  const handleIdRecognitionData = (data) => {
    // Cập nhật dữ liệu từ API nhận diện
    setFormData({
      ...formData,
      idRecognitionData: data,
      idNumber: data.id || formData.idNumber,
      fullName: data.name || formData.fullName,
      dob: data.dob || formData.dob,
      gender: data.gender || formData.gender,
      idIssueDate: data.issueDate || formData.idIssueDate,
      idIssuedBy: data.issuedBy || formData.idIssuedBy,
      address: data.address || formData.address,
    })
  }

  // Validate form theo từng bước
  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên"
      if (!formData.email.trim()) {
        newErrors.email = "Vui lòng nhập email"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email không hợp lệ"
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Vui lòng nhập số điện thoại"
      } else if (!/^[0-9]{10}$/.test(formData.phone)) {
        newErrors.phone = "Số điện thoại phải có 10 chữ số"
      }

      if (!formData.password) {
        newErrors.password = "Vui lòng nhập mật khẩu"
      } else if (formData.password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
      }

      if (!formData.agreeTerms) {
        newErrors.agreeTerms = "Bạn phải đồng ý với điều khoản dịch vụ"
      }
    }

    if (step === 2) {
      if (!formData.idFrontImage) newErrors.idFrontImage = "Vui lòng tải lên ảnh mặt trước CCCD/CMND"
      if (!formData.idBackImage) newErrors.idBackImage = "Vui lòng tải lên ảnh mặt sau CCCD/CMND"

      // Kiểm tra dữ liệu nhận diện
      if (!formData.idRecognitionData) {
        newErrors.idRecognitionData = "Vui lòng thực hiện nhận diện giấy tờ"
      }

      // Thông tin ngân hàng
      if (!formData.bankName.trim()) newErrors.bankName = "Vui lòng nhập tên ngân hàng"
      if (!formData.bankAccount.trim()) newErrors.bankAccount = "Vui lòng nhập số tài khoản"
      if (!formData.bankAccountName.trim()) newErrors.bankAccountName = "Vui lòng nhập tên chủ tài khoản"
    }

    if (step === 3) {
      if (!formData.shopName.trim()) newErrors.shopName = "Vui lòng nhập tên cửa hàng"
      if (!formData.shopDescription.trim()) newErrors.shopDescription = "Vui lòng nhập mô tả cửa hàng"
      if (!formData.businessType) newErrors.businessType = "Vui lòng chọn loại hình kinh doanh"
      if (!formData.mainCategories || formData.mainCategories.length === 0) {
        newErrors.mainCategories = "Vui lòng chọn ít nhất một danh mục kinh doanh"
      }
      if (!formData.shopLogo) newErrors.shopLogo = "Vui lòng tải lên logo cửa hàng"
    }

    if (step === 4) {
      if (!formData.provinceId) newErrors.provinceId = "Vui lòng chọn tỉnh/thành phố"
      if (!formData.districtId) newErrors.districtId = "Vui lòng chọn quận/huyện"
      if (!formData.wardId) newErrors.wardId = "Vui lòng chọn phường/xã"
      if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ chi tiết"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Xử lý chuyển bước tiếp theo
  const handleNext = () => {
    const isValid = validateStep(currentStep)

    if (isValid) {
      window.scrollTo(0, 0)
      setCurrentStep(currentStep + 1)
    }
  }

  // Xử lý quay lại bước trước
  const handlePrev = () => {
    window.scrollTo(0, 0)
    setCurrentStep(currentStep - 1)
  }

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault()

    const isValid = validateStep(currentStep)

    if (isValid) {
      setIsSubmitting(true)

      try {
        // Giả lập API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Giả lập thành công
        setRegistrationComplete(true)

        // Chuyển hướng sau 3 giây
        setTimeout(() => {
          navigate("/seller/dashboard")
        }, 3000)
      } catch (error) {
        console.error("Error submitting form:", error)
        alert("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  // Render các bước
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <SellerInfoStep formData={formData} handleChange={handleChange} errors={errors} />
      case 2:
        return (
          <IdRecognitionStep
            formData={formData}
            handleChange={handleChange}
            handleIdRecognitionData={handleIdRecognitionData}
            isProcessingId={isProcessingId}
            setIsProcessingId={setIsProcessingId}
            errors={errors}
          />
        )
      case 3:
        return (
          <ShopInfoStep
            formData={formData}
            handleChange={handleChange}
            handleCategoryChange={handleCategoryChange}
            errors={errors}
          />
        )
      case 4:
        return (
          <ShopAddressStep
            formData={formData}
            handleChange={handleChange}
            handleAddressChange={handleAddressChange}
            errors={errors}
          />
        )
      default:
        return <SellerInfoStep formData={formData} handleChange={handleChange} errors={errors} />
    }
  }

  // Nếu đăng ký hoàn tất
  if (registrationComplete) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Đăng ký thành công!</h2>
        <p className="text-gray-600 mb-8">
          Cảm ơn bạn đã đăng ký trở thành người bán trên nền tảng của chúng tôi. Chúng tôi sẽ xem xét thông tin của bạn
          và thông báo kết quả trong thời gian sớm nhất.
        </p>
        <p className="text-gray-500">Bạn sẽ được chuyển hướng đến trang quản lý sau vài giây...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Đăng ký trở thành người bán</h1>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                1
              </div>
              <span className="text-sm mt-2">Đăng ký tài khoản</span>
            </div>

            <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? "bg-blue-500" : "bg-gray-200"}`}></div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
              <span className="text-sm mt-2">Xác minh danh tính</span>
            </div>

            <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? "bg-blue-500" : "bg-gray-200"}`}></div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                3
              </div>
              <span className="text-sm mt-2">Thông tin cửa hàng</span>
            </div>

            <div className={`flex-1 h-1 mx-2 ${currentStep >= 4 ? "bg-blue-500" : "bg-gray-200"}`}></div>

            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 4 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                4
              </div>
              <span className="text-sm mt-2">Địa chỉ cửa hàng</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStep()}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isProcessingId}
                className={`ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                  isProcessingId ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                Tiếp theo
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center ${
                  isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting && (
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
                {isSubmitting ? "Đang xử lý..." : "Hoàn tất đăng ký"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default SellerRegistration
