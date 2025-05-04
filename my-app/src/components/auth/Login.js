import React from "react"
import { useState } from "react"
import { Link, useNavigate,  } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../utils/Toast";
import Loading from "../../utils/Loading";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, fetchUserInfo } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const response = await axios.post("http://localhost:8080/login", data);

      if (response.data.status === true) {
        await login(response.data.data.token);
        const userData = await fetchUserInfo();
        if (userData && userData.role === 3) {
          navigate("/admin/dashboard");
        } else {
          if (window.location.pathname === "/login") {
            navigate("/home");
          } else {
            navigate(-1);
          }
        }
      } else {
        showErrorToast("Đăng nhập không thành công!");
      }
    } catch (error) {
      console.error("Lỗi đăng nhập: ", error);
      showErrorToast(error.response?.data?.message || "Đã xảy ra lỗi trong quá trình đăng nhập. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };




  return (
    <>
      {isLoading && <Loading />}
      <div className="flex items-center justify-center p-4">
        <div className="max-w-3xl w-full space-y-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex">
              <div
                className="hidden md:block w-1/2 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
                  backgroundSize: "contain", // Ensures the image fits without zooming
                  backgroundRepeat: "no-repeat", // Prevents the image from repeating
                  backgroundPosition: "center", // Centers the image
                }}
              >
                <div className="h-full w-full bg-gradient-to-r from-emerald-800/90 to-emerald-900/90 flex items-center justify-center p-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">E-Com Books</h2>
                    <p className="text-emerald-100 text-sm">Khám phá thế giới qua từng trang sách</p>
                  </div>
                </div>
              </div >
              <div className="w-full md:w-1/2 px-8 py-12">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Đăng nhập </h2>
                  <p className="text-gray-600 text-sm">Chào mừng bạn quay trở lại</p>
                </div>

                <div className="w-full space-y-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className=" font-semibold text-red-900">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        {...register("email", {
                          required: "Email là bắt buộc",
                          pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: "Email không hợp lệ",
                          },
                        }

                        )}
                        className={`py-2 pl-10 block w-full border border-green-300 focus:ring-green-500 focus:border-green-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                        placeholder="Nhập email của bạn"
                      />
                    </div>
                    <div className="min-h-[1.25rem] mt-1">
                      <p className="text-sm text-red-600 font-semibold">{errors.email?.message || '\u00A0'}</p>
                    </div>
                  </div>

                  <div >
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Mật khẩu <span className="text-red-900 font-bold">*</span>
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
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        {...register("password", {
                          required: "Mật khẩu là bắt buộc",
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
                        placeholder="Nhập mật khẩu"
                      />

                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          {showPassword ? (
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
                      <p className="text-sm text-red-600 font-semibold">{errors.password?.message || '\u00A0'}</p>
                    </div>
                  </div>



                  <div>
                    <button
                      onClick={handleSubmit(onSubmit)}
                      type="submit"

                      className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Đăng nhập
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-start mt-2">
                  <Link to={'/forgot-password'} className="text-md font-medium text-emerald-600 hover:text-emerald-500">
                    Quên mật khẩu
                  </Link>
                </div>
                <div className="mt-2">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Hoặc đăng ký với</span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5 text-[#4285F4]" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                        />
                      </svg>
                    </button>

                    <button
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                      onClick={handleGoogleLogin}
                    >
                      <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <p className="text-md text-gray-600">
                    Đã chưa có tài khoản?{" "}
                    <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>
              </div>
            </div >
          </div >
        </div >
      </div >
    </>

  )
}

export default Login