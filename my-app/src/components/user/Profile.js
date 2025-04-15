import { useState } from "react"
import { useForm } from "react-hook-form"
import { useAuth } from "../../contexts/AuthContext"
import axiosInstance from "../../utils/axiosInstance"
import { showSuccessToast } from "../../utils/Toast"
import Loading from "../../utils/Loading"

const Profile = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("https://placehold.co/100x100/2ecc71/ffffff?text=avatar")
  const [loading, setLoading] = useState(false)
  const { userInfo, setUserInfo } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      fullName: userInfo.fullName,
      email: userInfo.email,
      phone: userInfo.phone,
      dob: userInfo.dob,
      gender: userInfo.gender,
      cccd: userInfo.cccd,
      address: userInfo.address,
    }
  })

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // đợi 4s
      const response = await axiosInstance.post("/auth/profile", data);
      if (response.data.status === true) {
        setUserInfo(response.data.data);
        reset(response.data.data);
        showSuccessToast(response.data.message);
      }
    } catch (error) {
      console.error("Lỗi cập nhật profile:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <Loading />
        </div>
      )}
      {/* Header with background */}
      <div className="relative h-40 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-lg">
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
              <img src={previewUrl || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 cursor-pointer shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>


      </div>

      {/* User info section */}
      <div className="pt-20 px-8 pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{userInfo.fullName}</h1>
          <p className="text-gray-500">{userInfo.email}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Section */}
          <div className="md:col-span-2">
            <div className="border-b border-gray-200 pb-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-emerald-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                Thông tin cá nhân
              </h2>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input
              {...register("fullName", {
                required: "Vui lòng nhập họ tên",
                minLength: { value: 2, message: "Họ tên phải có ít nhất 2 ký tự" }
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.fullName ? "border-red-500" : ""}`}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register("email", {
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email không hợp lệ"
                }
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              {...register("phone", {
                required: "Vui lòng nhập số điện thoại",
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.phone ? "border-red-500" : ""}`}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
            <input
              type="date"
              {...register("dob", {
                required: "Vui lòng chọn ngày sinh"
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.dob ? "border-red-500" : ""}`}
            />
            {errors.dob && (
              <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
            <select
              {...register("gender")}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.gender ? "border-red-500" : ""}`}
            >
              <option value="true">Nam</option>
              <option value="false">Nữ</option>
              <option value="">Khác</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CCCD/CMND</label>
            <input
              {...register("cccd", {
                required: "Vui lòng nhập CCCD/CMND",
                pattern: {
                  value: /^[0-9]{12}$/,
                  message: "CCCD/CMND không hợp lệ"
                }
              })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${errors.cccd ? "border-red-500" : ""}`}
            />
            {errors.cccd && (
              <p className="mt-1 text-sm text-red-600">{errors.cccd.message}</p>
            )}
          </div>

          {/* Address Section */}
          <div className="md:col-span-2 mt-4">
            <div className="border-b border-gray-200 pb-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-emerald-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                Địa chỉ
              </h2>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
            <textarea
              {...register("address")}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Security Section */}
          <div className="md:col-span-2 mt-4">
            <div className="border-b border-gray-200 pb-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-emerald-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Bảo mật
              </h2>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">Mật khẩu</h3>
                <p className="text-sm text-gray-500">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
              </div>
              <a
                href="/account/change-password"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition duration-150 ease-in-out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Đổi mật khẩu
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-4 mt-6 p-4">


          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="inline-flex items-center px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile;