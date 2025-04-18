import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { showErrorToast, showSuccessToast } from '../../utils/Toast';
import Loading from '../../utils/Loading';

const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const userId = queryParams.get('userId');



  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm()

  const [isLoading, setIsLoading] = useState(false)

  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {

      const responseBody = {
        token: token,
        userId: userId,
        newPassword: data.pwNew,
        confirmPassword: data.cfPwNew
      }
      const response = await axios.post("http://localhost:8080/forgot/reset-password", responseBody);

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
      setIsLoading(false)
    }
  }

  // Lấy token từ URL query params








  const toggleVisibility = (type) => {
    if (type === "new") setShowNewPassword(!showNewPassword)
    if (type === "confirm") setShowConfirmPassword(!showConfirmPassword)
  }


  return (
    <>
      {isLoading && <Loading />}
      <div className='flex items-center justify-center p-4'>
        <div className="max-w-4xl w-full space-y-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex">
              {/* Left side - Book illustration */}
              <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')" }}>
                <div className="h-full w-full bg-gradient-to-r from-emerald-800/90 to-emerald-900/90 flex items-center justify-center p-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">E-Com Books</h2>
                    <p className="text-emerald-100 text-sm">Khám phá thế giới qua từng trang sách</p>
                  </div>
                </div>
              </div>

              {/* Right side - Reset Password form */}
              <div className="w-full md:w-1/2 px-8 py-10">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Đặt lại mật khẩu</h2>
                  <p className="text-gray-600 text-sm">Nhập mật khẩu mới của bạn</p>
                </div>

                <div className="space-y-3">
                  <div >
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
                          required: "Nhập mật khẩu hiện tại của bạn",
                          minLength: {
                            value: 6,
                            message: "Mật khẩu phải có ít nhất 6 ký tự",
                          },
                          // pattern: {
                          //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                          //   message: "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường và một số",
                          // },
                        })}
                        className={`py-2 pl-10 pr-10 block w-full border $border-red-300 focus:ring-green-600 focus:border-green-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                        placeholder="Nhập mật khẩu mới của bạn"
                      />

                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => toggleVisibility("new")}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
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
                  <div >
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
                          // pattern: {
                          //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
                          //   message: "Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường và một số",
                          // },
                        })}

                        className={`py-2 pl-10 pr-10 block w-full border $border-red-300 focus:ring-green-600 focus:border-green-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                        placeholder="Xác nhận mật khẩu mới của bạn"
                      />

                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => toggleVisibility("confirm")}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
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


                  <button
                    disabled={isLoading}
                    onClick={handleSubmit(onSubmit)}
                    className={`py-2 px-4 text-sm text-white rounded-md bg-emerald-600 hover:bg-emerald-700 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                  >
                    {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>


  );
};

export default ResetPassword;
