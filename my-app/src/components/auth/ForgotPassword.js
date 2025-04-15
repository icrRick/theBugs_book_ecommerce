import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { showErrorToast, showSuccessToast } from '../../utils/Toast';
import axios from 'axios';
import Loading from '../../utils/Loading';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8080/forgot/send-email', data);
      if (response.status === 200 && response.data.status === true) {
        showSuccessToast(response.data.message);
      }
    } catch (error) {
      showErrorToast(error.response.data.message);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="flex">
              <div
                className="hidden md:block w-1/2 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <div className="h-full w-full bg-gradient-to-r from-emerald-800/90 to-emerald-900/90 flex items-center justify-center p-8">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">E-Com Books</h2>
                    <p className="text-emerald-100 text-sm">Khám phá thế giới qua từng trang sách</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 px-8 py-12">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Quên mật khẩu</h2>
                  <p className="text-gray-600 text-sm">Nhập email của bạn để đặt lại mật khẩu</p>
                </div>

                <div className="w-full space-y-3">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="font-semibold text-red-900">*</span>
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
                        })}
                        className={`py-2 pl-10 block w-full border border-green-300 focus:ring-green-500 focus:border-green-500 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 sm:text-sm`}
                        placeholder="Nhập email của bạn"
                      />
                    </div>
                    <div className="min-h-[1.25rem] mt-1">
                      <p className="text-sm text-red-600 font-semibold">{errors.email?.message || '\u00A0'}</p>
                    </div>
                  </div>



                  <button

                    onClick={handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {isLoading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
                  </button>

                  <div className="text-center">
                    <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                      Quay lại đăng nhập
                    </Link>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
