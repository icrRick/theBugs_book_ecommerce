"use client";

import { useState, useEffect } from "react";
import { getToken } from "../../utils/cookie";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";

const ShopAddressStep = ({
      shopAddress,
      handleChange,
      handleAddressChange,
      handleSubmitAll,
      errors,
}) => {
      const [provinces, setProvinces] = useState([]);
      const [districts, setDistricts] = useState([]);
      const [wards, setWards] = useState([]);
      const [loading, setLoading] = useState({
            provinces: false,
            districts: false,
            wards: false,
      });

      // Fetch tỉnh/thành phố khi component mount
      useEffect(() => {
            fetchProvinces();
      }, []);

      // Fetch quận/huyện khi tỉnh/thành phố thay đổi
      useEffect(() => {
            console.log("Change");

            if (shopAddress?.provinceId) {
                  fetchDistricts(shopAddress.provinceId);
            } else {
                  setDistricts([]);
                  handleAddressChange("districtId", "");
                  handleAddressChange("wardId", "");
            }
      }, [shopAddress?.provinceId]);

      // Fetch phường/xã khi quận/huyện thay đổi
      useEffect(() => {
            if (shopAddress?.districtId) {
                  fetchWards(shopAddress.districtId);
            } else {
                  setWards([]);
                  handleAddressChange("wardId", "");
            }
      }, [shopAddress?.districtId]);

      // Giả lập API call để lấy danh sách tỉnh/thành phố
      const fetchProvinces = async () => {
            setLoading((prev) => ({ ...prev, provinces: true }));
            try {
                  const response = await axios.get(
                        "http://localhost:8080/api/users/get-province-infor",
                        {
                              headers: {
                                    Authorization: `Bearer ${getToken()}`,
                                    "Content-Type": "application/json",
                              },
                        }
                  );

                  console.log("Provinces:", response);
                  setProvinces(response.data.data);
            } catch (error) {
                  console.error("Error fetching provinces:", error);
            } finally {
                  setLoading((prev) => ({ ...prev, provinces: false }));
            }
      };

      // Giả lập API call để lấy danh sách quận/huyện
      const fetchDistricts = async (provinceId) => {
            setLoading((prev) => ({ ...prev, districts: true }));
            try {
                  const response = await axios.get(
                        "http://localhost:8080/api/users/get-district-infor",
                        {
                              params: {
                                    provinceID: provinceId,
                              },
                              headers: {
                                    Authorization: `Bearer ${getToken()}`,
                                    "Content-Type": "application/json",
                              },
                        }
                  );

                  console.log("Provinces:", response.data);
                  setDistricts(response.data.data);
            } catch (error) {
                  console.error("Error fetching provinces:", error);
            } finally {
                  setLoading((prev) => ({ ...prev, districts: false }));
            }
      };

      // Giả lập API call để lấy danh sách phường/xã
      const fetchWards = async (districtId) => {
            setLoading((prev) => ({ ...prev, wards: true }));
            try {
                  const response = await axios.get(
                        "http://localhost:8080/api/users/get-ward-infor",
                        {
                              params: {
                                    districtID: districtId,
                              },
                              headers: {
                                    Authorization: `Bearer ${getToken()}`,
                                    "Content-Type": "application/json",
                              },
                        }
                  );

                  setWards(response.data.data);
            } catch (error) {
                  console.error("Error fetching wards:", error);
            } finally {
                  setLoading((prev) => ({ ...prev, wards: false }));
            }
      };

      const onSubmit = (e) => {
            e.preventDefault();
            const addressInfor = {
                  fullName: "ShopName",
                  phone: "0000000000",
                  provinceId: shopAddress.provinceId,
                  districtId: shopAddress.districtId,
                  wardId: shopAddress.wardId,
                  street: shopAddress.address,
            };

            axios.post(
                  "http://localhost:8080/api/users/register-add-address",
                  addressInfor,
                  {
                        headers: {
                              Authorization: `Bearer ${getToken()}`,
                        },
                  }
            )
                  .then((response) => {
                        const data = response.data;
                        console.log("RESPONSE: ");
                        console.log(response);
                        if (data.status) {
                              showSuccessToast("Thêm địa chỉ shop thành công");
                        } else {
                              showErrorToast(
                                    "Lỗi trong quá trình tạo  địa chỉ shop"
                              );
                        }
                  })
                  .catch((error) => {
                        console.log("error: ");
                        console.log(error);
                        showErrorToast("Lỗi trong quá trình tạo địa chỉ shop");
                  });
      };
      // Xử lý thay đổi tỉnh/thành phố
      const handleProvinceChange = (e) => {
            const provinceId = Number.parseInt(e.target.value, 10); // Chuyển sang number
            const provinceName = e.target.options[e.target.selectedIndex].text;
            handleAddressChange("provinceId", provinceId, provinceName);
      };

      // Xử lý thay đổi quận/huyện
      const handleDistrictChange = (e) => {
            const districtId = e.target.value;
            const districtName = e.target.options[e.target.selectedIndex].text;
            handleAddressChange("districtId", districtId, districtName);
      };

      // Xử lý thay đổi phường/xã
      const handleWardChange = (e) => {
            const wardId = e.target.value;
            const wardName = e.target.options[e.target.selectedIndex].text;
            handleAddressChange("wardId", wardId, wardName);
      };

      return (
            <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Địa chỉ cửa hàng
                  </h2>
                  <p className="text-gray-600 mb-6">
                        Vui lòng cung cấp địa chỉ chính xác của cửa hàng để
                        khách hàng có thể tìm thấy bạn.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Tỉnh/Thành phố */}
                        <div>
                              <label className="block text-gray-700 font-medium mb-2">
                                    Tỉnh/Thành phố{" "}
                                    <span className="text-red-500">*</span>
                              </label>
                              <select
                                    name="provinceId"
                                    value={shopAddress?.provinceId ?? ""}
                                    onChange={handleProvinceChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                          errors.provinceId
                                                ? "border-red-500"
                                                : "border-gray-300"
                                    }`}
                                    disabled={loading.provinces}
                              >
                                    <option value="">
                                          -- Chọn Tỉnh/Thành phố --
                                    </option>
                                    {provinces?.map((province) => (
                                          <option
                                                key={province.ProvinceID}
                                                value={province.ProvinceID} // Giả sử ProvinceID là number
                                          >
                                                {province.ProvinceName}
                                          </option>
                                    ))}
                              </select>
                              {loading.provinces && (
                                    <div className="flex items-center mt-2">
                                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                                          <span className="text-sm text-gray-500">
                                                Đang tải...
                                          </span>
                                    </div>
                              )}
                              {errors.provinceId && (
                                    <p className="text-red-500 text-sm mt-1">
                                          {errors.provinceId}
                                    </p>
                              )}
                        </div>

                        {/* Quận/Huyện */}
                        <div>
                              <label className="block text-gray-700 font-medium mb-2">
                                    Quận/Huyện{" "}
                                    <span className="text-red-500">*</span>
                              </label>
                              <select
                                    name="districtId"
                                    value={shopAddress?.districtId || ""}
                                    onChange={handleDistrictChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                          errors.districtId
                                                ? "border-red-500"
                                                : "border-gray-300"
                                    }`}
                                    disabled={
                                          !shopAddress?.provinceId ||
                                          loading.districts
                                    }
                              >
                                    <option value="">
                                          -- Chọn Quận/Huyện --
                                    </option>
                                    {districts.map((district) => (
                                          <option
                                                key={district.DistrictID}
                                                value={district.DistrictID}
                                          >
                                                {district.DistrictName}
                                          </option>
                                    ))}
                              </select>
                              {loading.districts && (
                                    <div className="flex items-center mt-2">
                                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                                          <span className="text-sm text-gray-500">
                                                Đang tải...
                                          </span>
                                    </div>
                              )}
                              {errors.districtId && (
                                    <p className="text-red-500 text-sm mt-1">
                                          {errors.districtId}
                                    </p>
                              )}
                        </div>

                        {/* Phường/Xã */}
                        <div>
                              <label className="block text-gray-700 font-medium mb-2">
                                    Phường/Xã{" "}
                                    <span className="text-red-500">*</span>
                              </label>
                              <select
                                    name="wardId"
                                    value={shopAddress?.wardId || ""}
                                    onChange={handleWardChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                          errors.wardId
                                                ? "border-red-500"
                                                : "border-gray-300"
                                    }`}
                                    disabled={
                                          !shopAddress?.districtId ||
                                          loading.wards
                                    }
                              >
                                    <option value="">
                                          -- Chọn Phường/Xã --
                                    </option>
                                    {wards.map((ward) => (
                                          <option
                                                key={ward.WardCode}
                                                value={ward.WardCode}
                                          >
                                                {ward.WardName}
                                          </option>
                                    ))}
                              </select>
                              {loading.wards && (
                                    <div className="flex items-center mt-2">
                                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                                          <span className="text-sm text-gray-500">
                                                Đang tải...
                                          </span>
                                    </div>
                              )}
                              {errors.wardId && (
                                    <p className="text-red-500 text-sm mt-1">
                                          {errors.wardId}
                                    </p>
                              )}
                        </div>
                  </div>

                  {/* Địa chỉ chi tiết */}
                  <div>
                        <label className="block text-gray-700 font-medium mb-2">
                              Địa chỉ chi tiết{" "}
                              <span className="text-red-500">*</span>
                        </label>
                        <input
                              type="text"
                              name="street"
                              value={shopAddress?.street || ""}
                              onChange={(e) =>
                                    handleChange(e.target.name, e.target.value)
                              }
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.address
                                          ? "border-red-500"
                                          : "border-gray-300"
                              }`}
                              placeholder="Số nhà, tên đường, tòa nhà, khu vực..."
                        />
                        {errors.address && (
                              <p className="text-red-500 text-sm mt-1">
                                    {errors.address}
                              </p>
                        )}
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                              Xác nhận thông tin
                        </h3>

                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                              <p className="text-gray-700 mb-4">
                                    Vui lòng kiểm tra lại thông tin địa chỉ
                                    trước khi hoàn tất đăng ký. Địa chỉ này sẽ
                                    được sử dụng để:
                              </p>
                              <ul className="list-disc list-inside space-y-2 text-gray-600">
                                    <li>
                                          Hiển thị trên trang cửa hàng của bạn
                                    </li>
                                    <li>
                                          Tính phí vận chuyển cho các đơn hàng
                                    </li>
                                    <li>
                                          Gửi các thông báo quan trọng từ hệ
                                          thống
                                    </li>
                              </ul>
                        </div>

                        {shopAddress?.provinceId &&
                              shopAddress?.districtId &&
                              shopAddress?.wardId &&
                              shopAddress?.street && (
                                    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                          <h4 className="font-medium text-gray-800 mb-2">
                                                Địa chỉ đã nhập:
                                          </h4>
                                          <p className="text-gray-700">
                                                {shopAddress?.street || ""},{" "}
                                                {shopAddress?.wardName || ""},{" "}
                                                {shopAddress?.districtName ||
                                                      ""}
                                                ,{" "}
                                                {shopAddress?.provinceName ||
                                                      ""}
                                          </p>
                                    </div>
                              )}
                  </div>
                  <div className="mt-6">
                        <button
                              type="button"
                              onClick={handleSubmitAll}
                              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                              disabled={
                                    !shopAddress?.provinceId ||
                                    !shopAddress?.districtId ||
                                    !shopAddress?.wardId ||
                                    !shopAddress?.street
                              }
                        >
                              <span>Xác nhận và gửi thông tin</span>
                        </button>
                  </div>
            </div>
      );
};

export default ShopAddressStep;
