"use client";

import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import Loading from "../../utils/Loading";

const SellerInfoStep = ({ accountInfo, handleChange, handleNext }) => {
      const [isLoading, setIsLoading] = useState(false);
      const [errors, setErrors] = useState({});
      const handleSubmit = async (e) => {
            e.preventDefault();
            setIsLoading(true);
            axiosInstance
                  .post("/api/users/validate-register-user", accountInfo)
                  .then((response) => {
                        handleNext();
                  })
                  .catch((error) => {
                        setErrors(error.response.data.data);
                        showErrorToast(
                              error.response?.data?.message ||
                                    "Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại."
                        );
                  })
                  .finally(() => {
                        setIsLoading(false);
                  });
      };
      return (
            <>
                  {isLoading && <Loading />}
                  <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                              Đăng ký tài khoản
                        </h2>
                        <p className="text-gray-600 mb-6">
                              Vui lòng cung cấp thông tin cơ bản để tạo tài
                              khoản người bán.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Họ tên */}
                              <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                          Họ và tên{" "}
                                          <span className="text-red-500">
                                                *
                                          </span>
                                    </label>
                                    <input
                                          type="text"
                                          name="fullName"
                                          value={accountInfo.fullName}
                                          onChange={handleChange}
                                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors?.fullName
                                                      ? "border-red-500"
                                                      : "border-gray-300"
                                          }`}
                                          placeholder="Nhập họ và tên"
                                    />
                                    {errors?.fullName && (
                                          <p className="text-red-500 text-sm mt-1">
                                                {errors.fullName}
                                          </p>
                                    )}
                              </div>

                              {/* Email */}
                              <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                          Email{" "}
                                          <span className="text-red-500">
                                                *
                                          </span>
                                    </label>
                                    <input
                                          type="email"
                                          name="email"
                                          value={accountInfo.email}
                                          onChange={handleChange}
                                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors?.email
                                                      ? "border-red-500"
                                                      : "border-gray-300"
                                          }`}
                                          placeholder="example@email.com"
                                    />
                                    {errors?.email && (
                                          <p className="text-red-500 text-sm mt-1">
                                                {errors.email}
                                          </p>
                                    )}
                              </div>

                              {/* Số điện thoại */}
                              <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                          Số điện thoại{" "}
                                          <span className="text-red-500">
                                                *
                                          </span>
                                    </label>
                                    <input
                                          type="tel"
                                          name="phone"
                                          value={accountInfo.phone}
                                          onChange={handleChange}
                                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors?.phone
                                                      ? "border-red-500"
                                                      : "border-gray-300"
                                          }`}
                                          placeholder="0912345678"
                                    />
                                    {errors?.phone && (
                                          <p className="text-red-500 text-sm mt-1">
                                                {errors.phone}
                                          </p>
                                    )}
                              </div>

                              {/* Mật khẩu */}
                              <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                          Mật khẩu{" "}
                                          <span className="text-red-500">
                                                *
                                          </span>
                                    </label>
                                    <input
                                          type="password"
                                          name="password"
                                          value={accountInfo.password}
                                          onChange={handleChange}
                                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors?.password
                                                      ? "border-red-500"
                                                      : "border-gray-300"
                                          }`}
                                          placeholder="Nhập mật khẩu"
                                    />
                                    {errors?.password && (
                                          <p className="text-red-500 text-sm mt-1">
                                                {errors.password}
                                          </p>
                                    )}
                              </div>

                              {/* Xác nhận mật khẩu */}
                              <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-medium mb-2">
                                          Xác nhận mật khẩu{" "}
                                          <span className="text-red-500">
                                                *
                                          </span>
                                    </label>
                                    <input
                                          type="password"
                                          name="confirmPassword"
                                          value={accountInfo.confirmPassword}
                                          onChange={handleChange}
                                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors?.confirmPassword
                                                      ? "border-red-500"
                                                      : "border-gray-300"
                                          }`}
                                          placeholder="Nhập lại mật khẩu"
                                    />
                                    {errors?.confirmPassword && (
                                          <p className="text-red-500 text-sm mt-1">
                                                {errors.confirmPassword}
                                          </p>
                                    )}
                              </div>
                        </div>
                        <button
                              type="submit"
                              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                              Tiếp tục bước tiếp theo
                        </button>
                  </form>
            </>
      );
};

export default SellerInfoStep;
