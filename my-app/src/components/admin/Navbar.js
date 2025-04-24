import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../../utils/Toast';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../utils/axiosInstance';

const Navbar = ({ setSidebarOpen, userMenuOpen, setUserMenuOpen }) => {

  const { userInfo } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsModalOpen(false);
    navigate('/login');
    showSuccessToast('Đăng xuất thành công');

  }; const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)


  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {


      const response = await axiosInstance.post("/user/change_pass", data);

      if (response.status === 200 && response.data.status === true) {
        showSuccessToast(response.data.message);
        navigate("/login");
      } else {
        showErrorToast(response.data.message);
      }
    } catch (error) {
      console.error("Change password error:", error);
      const message =
        error?.response?.data?.message ||
        "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
      showErrorToast(message);
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleVisibility = (type) => {
    if (type === "current") setShowCurrentPassword(!showCurrentPassword)
    if (type === "new") setShowNewPassword(!showNewPassword)
    if (type === "confirm") setShowConfirmPassword(!showConfirmPassword)
  }


  return (
    <nav className="fixed top-0 z-30 w-full bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 py-2.5 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="p-2 mr-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-50 hover:text-gray-600 transition-colors duration-200"
            >
              <span className="sr-only">Menu</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
            </button>
            <a href="/" className="flex items-center group">
              <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3 transition-transform duration-200 group-hover:scale-105" alt="Logo" />
              <span className="self-center text-xl font-semibold text-gray-800">
                Admin Panel
              </span>
            </a>
          </div>

          <div className="flex items-center gap-3">
         

            {/* User Menu */}
            <div className="relative">
              <button
                type="button"
                className="flex text-sm bg-gray-50 rounded-full ring-2 ring-white focus:ring-4 focus:ring-gray-100 transition-all duration-200 hover:ring-gray-200"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                  alt="user photo"
                />
              </button>

              {/* Dropdown menu */}
              <div 
                className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-gray-200 transition-all duration-200 transform origin-top-right ${
                  userMenuOpen 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700">
                    {userInfo?.fullName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {userInfo?.email}
                  </p>
                </div>
                <div className="py-1">
                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => setIsChangePasswordModalOpen(true)}
                  >
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10s10-4.477 10-10C20 4.477 15.523 0 10 0zm0 18a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    Đổi mật khẩu
                  </a>

                  <a
                    href="#"
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    onClick={handleLogoutClick}
                  >
                    <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" />
                    </svg>
                    Đăng xuất
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận đăng xuất */}
      <div 
        className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-200 ${
          isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div 
            className={`fixed inset-0 transition-opacity duration-200 ${
              isModalOpen ? 'opacity-75' : 'opacity-0'
            }`}
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gray-500"></div>
          </div>

          <div 
            className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all duration-200 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
              isModalOpen 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 translate-y-4'
            }`}
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Xác nhận đăng xuất
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal đổi mật khẩu */}
      <div 
        className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-200 ${
          isChangePasswordModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div 
            className={`fixed inset-0 transition-opacity duration-200 ${
              isChangePasswordModalOpen ? 'opacity-75' : 'opacity-0'
            }`}
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-gray-500"></div>
          </div>

          <div 
            className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all duration-200 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
              isChangePasswordModalOpen 
                ? 'opacity-100 scale-100 translate-y-0' 
                : 'opacity-0 scale-95 translate-y-4'
            }`}
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Đổi mật khẩu
                    </h3>
                    <div className="mt-2">
                      <div className="space-y-2">
                        {/* Current Password */}
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu hiện tại <span className="text-red-900 font-bold">*</span>
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <input
                              id="currentPassword"
                              type={showCurrentPassword ? "text" : "password"}
                              {...register("pwOld", {
                                required: "Nhập mật khẩu hiện tại của bạn",
                                minLength: {
                                  value: 6,
                                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                                },
                              })}
                              className={`py-2 pl-10 pr-10 block w-full border border-gray-300 focus:ring-green-600 focus:border-green-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-colors duration-200`}
                              placeholder="Nhập mật khẩu hiện tại của bạn"
                            />

                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <button
                                type="button"
                                onClick={() => toggleVisibility("current")}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200"
                              >
                                {showCurrentPassword ? (
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path
                                      fillRule="evenodd"
                                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                      clipRule="evenodd"
                                    />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="min-h-[1.25rem] mt-1">
                            <p className="text-sm text-red-600 font-semibold">{errors.pwOld?.message || '\u00A0'}</p>
                          </div>
                        </div>

                        {/* New Password */}
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu mới <span className="text-red-900 font-bold">*</span>
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              {...register("pwNew", {
                                required: "Nhập mật khẩu mới của bạn",
                                minLength: {
                                  value: 6,
                                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                                },
                              })}
                              className={`py-2 pl-10 pr-10 block w-full border border-gray-300 focus:ring-green-600 focus:border-green-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-colors duration-200`}
                              placeholder="Nhập mật khẩu mới của bạn"
                            />

                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <button
                                type="button"
                                onClick={() => toggleVisibility("new")}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200"
                              >
                                {showNewPassword ? (
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path
                                      fillRule="evenodd"
                                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                      clipRule="evenodd"
                                    />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="min-h-[1.25rem] mt-1">
                            <p className="text-sm text-red-600 font-semibold">{errors.pwNew?.message || '\u00A0'}</p>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Xác nhận mật khẩu mới <span className="text-red-900 font-bold">*</span>
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                className="h-5 w-5 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              {...register("cfPwNew", {
                                required: "Vui lòng xác nhận mật khẩu mới",
                                minLength: {
                                  value: 6,
                                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                                },
                                validate: (value) => value === watch("pwNew") || "Mật khẩu xác nhận không khớp",
                              })}
                              className={`py-2 pl-10 pr-10 block w-full border border-gray-300 focus:ring-green-600 focus:border-green-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm transition-colors duration-200`}
                              placeholder="Xác nhận mật khẩu mới của bạn"
                            />

                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <button
                                type="button"
                                onClick={() => toggleVisibility("confirm")}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors duration-200"
                              >
                                {showConfirmPassword ? (
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                    <path
                                      fillRule="evenodd"
                                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    className="h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                                      clipRule="evenodd"
                                    />
                                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="min-h-[1.25rem] mt-1">
                            <p className="text-sm text-red-600 font-semibold">{errors.cfPwNew?.message || '\u00A0'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                  onClick={() => {
                    setIsChangePasswordModalOpen(false);
                    reset();
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
