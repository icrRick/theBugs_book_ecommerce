import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useAuth } from "../../contexts/AuthContext"
import axiosInstance from "../../utils/axiosInstance"
import { showErrorToast, showSuccessToast } from "../../utils/Toast"
import Loading from "../../utils/Loading"

const Profile = () => {
  const [selectedFile, setSelectedFile] = useState(null)
  const { userInfo, setUserInfo } = useAuth();
  const [previewUrl, setPreviewUrl] = useState(userInfo?.avatar)
  const [loading, setLoading] = useState(false)
 
  // Format ngày sinh từ dạng yyyy-MM-dd
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    // Nếu đã đúng format thì trả về luôn
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    try {
      // Chuyển đổi từ các định dạng khác về yyyy-MM-dd
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; // Nếu không phải ngày hợp lệ
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Lỗi định dạng ngày:", error);
      return "";
    }
  };

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      fullName: userInfo?.fullName || "",
      email: userInfo?.email || "",
      phone: userInfo?.phone || "",
      dob: formatDate(userInfo?.dob) || "",
      gender: userInfo?.gender || "",
      cccd: userInfo?.cccd || "",
      address: userInfo?.address || "",
      avatar: userInfo?.avatar || "",
    }
  });
  
  // Cập nhật giá trị khi userInfo thay đổi
  useEffect(() => {
    if (userInfo) {
      setValue("fullName", userInfo.fullName || "");
      setValue("email", userInfo.email || "");
      setValue("phone", userInfo.phone || "");
      setValue("dob", formatDate(userInfo.dob) || "");
      setValue("gender", userInfo.gender || "");
      setValue("cccd", userInfo.cccd || "");
      setValue("address", userInfo.address || "");
      setValue("avatar", userInfo.avatar || "");
    }
  }, [userInfo, setValue]);

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


  const uploadAvatar = async () => {
    if (!selectedFile) {
      showErrorToast("No file selected.");
      return;
    }
  
    // Optional: Validate file type and size
    const maxSize = 5 * 1024 * 1024; // 5MB limit
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
    if (selectedFile.size > maxSize) {
      showErrorToast("File size exceeds the 5MB limit.");
      return;
    }
  
    if (!validTypes.includes(selectedFile.type)) {
      showErrorToast("Unsupported file type. Only JPEG, PNG, and GIF are allowed.");
      return;
    }
  
    const formData = new FormData();
    formData.append('avatar', selectedFile);
  
    try {
      const response = await axiosInstance.post('/auth/upload-avatar', formData,{
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
  
      // Handle success response
      if (response.status === 200 && response.data.status === true) {
        showSuccessToast(response.data.message);
      } else {
        showErrorToast(response.data.message || "Unexpected error occurred.");
      }
    } catch (error) {
      // Improved error handling
      const errorMessage = error.response?.data?.message || error.message || "An error occurred. Please try again.";
      showErrorToast(errorMessage);
      console.error("Error uploading avatar:", errorMessage);
    }
  };
  

  const onSubmit = async (data) => {
    setLoading(true);
    try {
    

      const response = await axiosInstance.post("/auth/profile", data);
      if (response.status === 200 &&   response.data.status === true) {
        setUserInfo(response.data.data);
        reset(response.data.data);
        setSelectedFile(response.data.data.avatar);
        setPreviewUrl(response.data.data.avatar);
        showSuccessToast(response.data.message);
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Đã xảy ra lỗi trong quá trình cập nhật profile. Vui lòng thử lại.");
      console.error("Lỗi cập nhật profile:", error);
    } finally {
      setLoading(false);
    }
  }

  // Nút cập nhật ảnh riêng biệt
  const handleUpdateAvatar = async () => {
    if (!selectedFile) {
      showErrorToast("Vui lòng chọn ảnh đại diện");
      return;
    }

    setLoading(true);
    try {
      const avatarUrl = await uploadAvatar();
      if (avatarUrl) {
        setUserInfo({ ...userInfo, avatarUrl });
        showSuccessToast("Cập nhật ảnh đại diện thành công");
        setSelectedFile(null);
      }
    } catch (error) {
      showErrorToast("Lỗi cập nhật ảnh đại diện");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <Loading />}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header with background */}
        <div className="relative h-40 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-lg">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                <img src={previewUrl || userInfo?.avatarUrl || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-emerald-500 text-white p-2 rounded-full hover:bg-emerald-600 cursor-pointer shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" name="avatar" onChange={handleFileChange} />
              </label>
            </div>
            {selectedFile && (
              <button
                onClick={handleUpdateAvatar}
                className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H9V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L7 9.414V13H5.5z" clipRule="evenodd" />
                </svg>
                Cập nhật ảnh
              </button>
            )}
          </div>
        </div>

        {/* User info section */}
        <div className="pt-20 px-8 pb-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{userInfo?.fullName}</h1>
            <p className="text-gray-500">{userInfo?.email}</p>
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
                className="px-4 py-2 block w-full border border-green-300 focus:ring-green-500 focus:border-green-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
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
                className="px-4 py-2 block w-full border border-green-300 focus:ring-green-500 focus:border-green-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
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
                className="px-4 py-2 block w-full border border-green-300 focus:ring-green-500 focus:border-green-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
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
                className="px-4 py-2 block w-full border border-green-300 focus:ring-green-500 focus:border-green-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
              />
              {errors.dob && (
                <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              <select
                {...register("gender")}
                className="px-4 py-2 block w-full border border-green-300 focus:ring-green-500 focus:border-green-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
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
                className="px-4 py-2 block w-full border border-green-300 focus:ring-green-500 focus:border-green-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
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
                className="px-4 py-2 block w-full border border-green-300 focus:ring-green-500 focus:border-green-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm"
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
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
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
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
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
    </>
  )
}

export default Profile;