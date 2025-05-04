"use client";

import { useState, useEffect } from "react";
import BankSearchSelect from "./BankMultiSelect";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import Loading from "../../utils/Loading";
import axiosInstance from "../../utils/axiosInstance";

const ShopInfoStep = ({ shopInfo, handleChange, handleNext }) => {
      const [logoPreview, setLogoPreview] = useState(
            shopInfo?.shopLogo ? URL.createObjectURL(shopInfo.shopLogo) : null
      );
      const [bannerPreview, setBannerPreview] = useState(
            shopInfo?.shopBanner
                  ? URL.createObjectURL(shopInfo.shopBanner)
                  : null
      );
      const [isLoading, setIsLoading] = useState(false);
      const [banks, setBanks] = useState([]);
      const [isLoadingBanks, setIsLoadingBanks] = useState(false);
      const [bankError, setBankError] = useState("");
      const [errors, setErrors] = useState({});

      const handleSubmit = (e) => {
            e.preventDefault();
            setIsLoading(true);
            const formDataToSend = new FormData();
            formDataToSend.append(
                  "shopInfor",
                  new Blob([JSON.stringify(shopInfo)], {
                        type: "application/json",
                  })
            );
            axiosInstance
                  .post("/api/users/validate-register-seller", formDataToSend, {
                        headers: {
                              "Content-Type": "multipart/form-data",
                        },
                  })
                  .then((response) => {
                        if (response.status) {
                              handleNext();
                        } else {
                              showErrorToast("Lỗi trong quá trình tạo shop");
                        }
                  })
                  .catch((error) => {
                        console.log(error);

                        setErrors(error.response.data.data);
                        showErrorToast("Lỗi trong quá trình tạo shop");
                  })
                  .finally(() => {
                        setIsLoading(false);
                  });
      };
      // Fetch banks from VietQR API
      useEffect(() => {
            const fetchBanks = async () => {
                  setIsLoadingBanks(true);
                  setBankError("");

                  try {
                        const response = await fetch(
                              "https://api.vietqr.io/v2/banks"
                        );
                        if (!response.ok) {
                              throw new Error(
                                    "Không thể tải danh sách ngân hàng"
                              );
                        }

                        const data = await response.json();
                        if (data.code === "00" && Array.isArray(data.data)) {
                              setBanks(data.data);
                        } else {
                              throw new Error("Dữ liệu ngân hàng không hợp lệ");
                        }
                  } catch (error) {
                        console.error(
                              "Lỗi khi tải danh sách ngân hàng:",
                              error
                        );
                        setBankError(
                              "Không thể tải danh sách ngân hàng. Vui lòng thử lại sau."
                        );
                  } finally {
                        setIsLoadingBanks(false);
                  }
            };

            fetchBanks();
      }, []);

      // Xử lý thay đổi logo
      const handleLogoChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                  handleChange({
                        target: {
                              name: "shopLogo",
                              value: file,
                              type: "file",
                              files: e.target.files,
                        },
                  });
                  setLogoPreview(URL.createObjectURL(file));
            }
      };

      // Xử lý thay đổi banner
      const handleBannerChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                  handleChange({
                        target: {
                              name: "shopBanner",
                              value: file,
                              type: "file",
                              files: e.target.files,
                        },
                  });
                  setBannerPreview(URL.createObjectURL(file));
            }
      };

      return (
            <>
                  {isLoading && <Loading />}
                  <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                              Thông tin cửa hàng
                        </h2>
                        <p className="text-gray-600 mb-6">
                              Vui lòng cung cấp thông tin chi tiết về cửa hàng
                              của bạn để khách hàng có thể dễ dàng tìm thấy.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Tên cửa hàng */}
                              <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                          Tên cửa hàng{" "}
                                          <span className="text-red-500">
                                                *
                                          </span>
                                    </label>
                                    <input
                                          type="text"
                                          name="name"
                                          value={shopInfo?.name || ""}
                                          onChange={handleChange}
                                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors?.name
                                                      ? "border-red-500"
                                                      : "border-gray-300"
                                          }`}
                                          placeholder="Nhập tên cửa hàng"
                                    />
                                    {errors?.name && (
                                          <p className="text-red-500 text-sm mt-1">
                                                {errors.name}
                                          </p>
                                    )}
                              </div>

                              {/* Shop Slug */}
                              <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                          Đường dẫn cửa hàng{" "}
                                          <span className="text-red-500">
                                                *
                                          </span>
                                    </label>
                                    <div className="flex items-center">
                                          <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">
                                                thebugs.com/
                                          </span>
                                          <input
                                                type="text"
                                                name="shop_slug"
                                                value={
                                                      shopInfo?.shop_slug || ""
                                                }
                                                onChange={handleChange}
                                                className={`flex-1 px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                      errors?.shop_slug
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                }`}
                                                placeholder="ten-cua-hang-cua-ban"
                                          />
                                    </div>
                                    {errors?.shop_slug && (
                                          <p className="text-red-500 text-sm mt-1">
                                                {errors.shop_slug}
                                          </p>
                                    )}
                                    <p className="text-gray-500 text-xs mt-1">
                                          Chỉ sử dụng chữ cái, số và dấu gạch
                                          ngang. Không sử dụng khoảng trắng hoặc
                                          ký tự đặc biệt.
                                    </p>
                              </div>
                        </div>

                        {/* Mô tả cửa hàng */}
                        <div>
                              <label className="block text-gray-700 font-medium mb-2">
                                    Mô tả cửa hàng{" "}
                                    <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                    name="description"
                                    value={shopInfo?.description || ""}
                                    onChange={handleChange}
                                    rows="4"
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                          errors?.description
                                                ? "border-red-500"
                                                : "border-gray-300"
                                    }`}
                                    placeholder="Mô tả ngắn gọn về cửa hàng của bạn, các sản phẩm bạn bán và điểm nổi bật của cửa hàng..."
                              ></textarea>
                              {errors?.description && (
                                    <p className="text-red-500 text-sm mt-1">
                                          {errors.description}
                                    </p>
                              )}
                        </div>

                        {/* Thông tin tài khoản ngân hàng */}
                        <div className="border-t border-gray-200 pt-6 mt-6">
                              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Thông tin tài khoản ngân hàng
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Tên ngân hàng */}
                                    <div>
                                          <label className="block text-gray-700 font-medium mb-2">
                                                Ngân hàng{" "}
                                                <span className="text-red-500">
                                                      *
                                                </span>
                                          </label>
                                          <div className="relative">
                                                <BankSearchSelect
                                                      shopInfo={shopInfo}
                                                      handleBankChange={
                                                            handleChange
                                                      }
                                                      errors={errors}
                                                      isLoadingBanks={
                                                            isLoadingBanks
                                                      }
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                                      <svg
                                                            className="w-5 h-5 text-gray-400"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                      >
                                                            <path
                                                                  strokeLinecap="round"
                                                                  strokeLinejoin="round"
                                                                  strokeWidth="2"
                                                                  d="M19 9l-7 7-7-7"
                                                            ></path>
                                                      </svg>
                                                </div>
                                          </div>
                                          {isLoadingBanks && (
                                                <p className="text-gray-500 text-sm mt-1">
                                                      Đang tải danh sách ngân
                                                      hàng...
                                                </p>
                                          )}
                                          {bankError && (
                                                <p className="text-red-500 text-sm mt-1">
                                                      {bankError}
                                                </p>
                                          )}
                                          {errors?.bankProvideName && (
                                                <p className="text-red-500 text-sm mt-1">
                                                      {errors.bankProvideName}
                                                </p>
                                          )}
                                    </div>

                                    {/* Tên chủ tài khoản */}
                                    <div>
                                          <label className="block text-gray-700 font-medium mb-2">
                                                Tên chủ tài khoản{" "}
                                                <span className="text-red-500">
                                                      *
                                                </span>
                                          </label>
                                          <input
                                                type="text"
                                                name="bankOwnerName"
                                                value={
                                                      shopInfo?.bankOwnerName ||
                                                      ""
                                                }
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                      errors?.bankOwnerName
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                }`}
                                                placeholder="Nhập tên chủ tài khoản"
                                          />
                                          {errors?.bankOwnerName && (
                                                <p className="text-red-500 text-sm mt-1">
                                                      {errors.bankOwnerName}
                                                </p>
                                          )}
                                    </div>

                                    {/* Số tài khoản */}
                                    <div>
                                          <label className="block text-gray-700 font-medium mb-2">
                                                Số tài khoản{" "}
                                                <span className="text-red-500">
                                                      *
                                                </span>
                                          </label>
                                          <input
                                                type="text"
                                                name="bankOwnerNumber"
                                                value={
                                                      shopInfo?.bankOwnerNumber ||
                                                      ""
                                                }
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                      errors?.bankOwnerNumber
                                                            ? "border-red-500"
                                                            : "border-gray-300"
                                                }`}
                                                placeholder="Nhập số tài khoản"
                                          />
                                          {errors?.bankOwnerNumber && (
                                                <p className="text-red-500 text-sm mt-1">
                                                      {errors.bankOwnerNumber}
                                                </p>
                                          )}
                                    </div>
                              </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6 mt-6">
                              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Hình ảnh cửa hàng
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Logo cửa hàng */}
                                    <div>
                                          <label className="block text-gray-700 font-medium mb-2">
                                                Logo cửa hàng{" "}
                                          </label>
                                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                {logoPreview ? (
                                                      <div className="relative">
                                                            <img
                                                                  src={
                                                                        logoPreview ||
                                                                        "/placeholder.svg" ||
                                                                        "/placeholder.svg"
                                                                  }
                                                                  alt="Logo preview"
                                                                  className="w-32 h-32 mx-auto object-contain"
                                                            />
                                                            <button
                                                                  type="button"
                                                                  onClick={() => {
                                                                        setLogoPreview(
                                                                              null
                                                                        );
                                                                        handleChange(
                                                                              {
                                                                                    target: {
                                                                                          name: "shopLogo",
                                                                                          value: null,
                                                                                    },
                                                                              }
                                                                        );
                                                                  }}
                                                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                            >
                                                                  <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                  >
                                                                        <path
                                                                              strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                              strokeWidth={
                                                                                    2
                                                                              }
                                                                              d="M6 18L18 6M6 6l12 12"
                                                                        />
                                                                  </svg>
                                                            </button>
                                                      </div>
                                                ) : (
                                                      <>
                                                            <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  className="h-12 w-12 text-gray-400 mx-auto mb-2"
                                                                  fill="none"
                                                                  viewBox="0 0 24 24"
                                                                  stroke="currentColor"
                                                            >
                                                                  <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                              2
                                                                        }
                                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                  />
                                                            </svg>
                                                            <p className="text-gray-500 mb-2">
                                                                  Tải lên logo
                                                                  cửa hàng
                                                            </p>
                                                      </>
                                                )}
                                                <input
                                                      type="file"
                                                      id="logo-upload"
                                                      accept="image/*"
                                                      onChange={
                                                            handleLogoChange
                                                      }
                                                      className="hidden"
                                                />
                                                <label
                                                      htmlFor="logo-upload"
                                                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer inline-block"
                                                >
                                                      Chọn ảnh
                                                </label>
                                                <p className="text-gray-500 text-xs mt-2">
                                                      PNG, JPG (tối đa 2MB, kích
                                                      thước khuyến nghị
                                                      300x300px)
                                                </p>
                                          </div>
                                          {errors?.shopLogo && (
                                                <p className="text-red-500 text-sm mt-1">
                                                      {errors.shopLogo}
                                                </p>
                                          )}
                                    </div>

                                    {/* Banner cửa hàng */}
                                    <div>
                                          <label className="block text-gray-700 font-medium mb-2">
                                                Banner cửa hàng
                                          </label>
                                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                                {bannerPreview ? (
                                                      <div className="relative">
                                                            <img
                                                                  src={
                                                                        bannerPreview ||
                                                                        "/placeholder.svg" ||
                                                                        "/placeholder.svg"
                                                                  }
                                                                  alt="Banner preview"
                                                                  className="w-full h-32 mx-auto object-cover"
                                                            />
                                                            <button
                                                                  type="button"
                                                                  onClick={() => {
                                                                        setBannerPreview(
                                                                              null
                                                                        );
                                                                        handleChange(
                                                                              {
                                                                                    target: {
                                                                                          name: "shopBanner",
                                                                                          value: null,
                                                                                    },
                                                                              }
                                                                        );
                                                                  }}
                                                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                            >
                                                                  <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-4 w-4"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                  >
                                                                        <path
                                                                              strokeLinecap="round"
                                                                              strokeLinejoin="round"
                                                                              strokeWidth={
                                                                                    2
                                                                              }
                                                                              d="M6 18L18 6M6 6l12 12"
                                                                        />
                                                                  </svg>
                                                            </button>
                                                      </div>
                                                ) : (
                                                      <>
                                                            <svg
                                                                  xmlns="http://www.w3.org/2000/svg"
                                                                  className="h-12 w-12 text-gray-400 mx-auto mb-2"
                                                                  fill="none"
                                                                  viewBox="0 0 24 24"
                                                                  stroke="currentColor"
                                                            >
                                                                  <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                              2
                                                                        }
                                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                  />
                                                            </svg>
                                                            <p className="text-gray-500 mb-2">
                                                                  Tải lên banner
                                                                  cửa hàng
                                                            </p>
                                                      </>
                                                )}
                                                <input
                                                      type="file"
                                                      id="banner-upload"
                                                      accept="image/*"
                                                      onChange={
                                                            handleBannerChange
                                                      }
                                                      className="hidden"
                                                />
                                                <label
                                                      htmlFor="banner-upload"
                                                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer inline-block"
                                                >
                                                      Chọn ảnh
                                                </label>
                                                <p className="text-gray-500 text-xs mt-2">
                                                      PNG, JPG (tối đa 2MB, kích
                                                      thước khuyến nghị
                                                      1200x300px)
                                                </p>
                                          </div>
                                    </div>
                              </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6">
                              <button
                                    onClick={handleSubmit}
                                    type="submit"
                                    className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                              >
                                    Tiếp tục bước tiếp theo
                              </button>
                        </div>
                  </div>
            </>
      );
};

export default ShopInfoStep;
