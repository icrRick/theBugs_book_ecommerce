"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { set } from "lodash";
import axios from "axios";
import { getToken } from "../../utils/cookie";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";

const Store = () => {
  const { currentUser } = useAuth();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [addressNames, setAddressNames] = useState({
    provinceName: "Đang tải...",
    districtName: "Đang tải...",
    wardName: "Đang tải...",
  });

  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    wards: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    logo: null,
    banner: null,
    returnPolicy: "",
    shippingPolicy: "",
  });
  const [previewLogo, setPreviewLogo] = useState("");
  const [previewBanner, setPreviewBanner] = useState("");
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    fetchShopData();
  }, []);
  useEffect(() => {
    console.log(previewLogo);
  }, [previewLogo]);
  useEffect(() => {
    if (isEditing) {
      fetchProvinces();
      if (storeData.provinceId) {
        fetchDistricts(storeData.provinceId);
      }
      if (storeData.districtId) {
        fetchWards(storeData.districtId);
      }
    }
  }, [isEditing, storeData.provinceId, storeData.districtId]);
  const fetchAddressNames = async (provinceId, districtId, wardId) => {
    try {
      // Fetch tên tỉnh
      if (provinceId) {
        const provinceRes = await axios.get(
          "http://localhost:8080/api/users/get-province-infor",
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        const province = provinceRes.data.data.find(
          (p) => p.ProvinceID === provinceId
        );
        if (province) {
          setAddressNames((prev) => ({
            ...prev,
            provinceName: province.ProvinceName,
          }));
        }
      }

      // Fetch tên quận/huyện
      if (districtId) {
        const districtRes = await axios.get(
          "http://localhost:8080/api/users/get-district-infor",
          {
            params: { provinceID: provinceId },
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        const district = districtRes.data.data.find(
          (d) => d.DistrictID === districtId
        );
        if (district) {
          setAddressNames((prev) => ({
            ...prev,
            districtName: district.DistrictName,
          }));
        }
      }

      // Fetch tên phường/xã
      if (wardId) {
        const wardRes = await axios.get(
          "http://localhost:8080/api/users/get-ward-infor",
          {
            params: { districtID: districtId },
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );
        const ward = wardRes.data.data.find((w) => w.WardCode === wardId);
        if (ward) {
          setAddressNames((prev) => ({ ...prev, wardName: ward.WardName }));
        }
      }
    } catch (error) {
      console.error("Error fetching address names:", error);
      setAddressNames({
        provinceName: "Lỗi khi tải",
        districtName: "Lỗi khi tải",
        wardName: "Lỗi khi tải",
      });
    }
  };
  const fetchShopData = () => {
    setIsLoading(true);
    axiosInstance
      .get("/api/seller/me")
      .then((response) => {
        const data = response.data.data;
        setStoreData(data);
        setOriginalData(data);
        setPreviewLogo(data.logoUrl);
        setPreviewBanner(data.bannerUrl);

        // Fetch tên địa phương nếu có ID
        if (data.provinceId || data.districtId || data.wardId) {
          fetchAddressNames(data.provinceId, data.districtId, data.wardId);
        } else {
          setAddressNames({
            provinceName: "Chưa cập nhật",
            districtName: "Chưa cập nhật",
            wardName: "Chưa cập nhật",
          });
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    console.log("Preview Logo: ", previewLogo);
  }, [previewLogo]);
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewBanner(file);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewLogo(file);
    }
  };

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
  const handleAddressChange = (field, value, displayValue = "") => {
    setStoreData((prev) => ({
      ...prev,
      [field]: value,
      [`${field.replace("Id", "Name")}`]: displayValue,
    }));

    // Fetch districts when province changes
    if (field === "provinceId" && value) {
      fetchDistricts(value);
      // Reset district and ward when province changes
      setStoreData((prev) => ({
        ...prev,
        districtId: "",
        districtName: "",
        wardId: "",
        wardName: "",
      }));
      setDistricts([]);
      setWards([]);
    }

    // Fetch wards when district changes
    if (field === "districtId" && value) {
      fetchWards(value);
      // Reset ward when district changes
      setStoreData((prev) => ({
        ...prev,
        wardId: "",
        wardName: "",
      }));
      setWards([]);
    }
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Build object giống bean
    const shopInfoData = {
      name: storeData.name || "",
      description: storeData.description || "",
      bankOwnerName: storeData.bankOwnerName || "",
      bankOwnerNumber: storeData.bankOwnerNumber || "",
      bankProvideName: storeData.bankProvideName || "",
      addressDetail: storeData.addressDetail || "",
      wardId: storeData.wardId || 0,
      districtId: storeData.districtId || 0,
      provinceId: storeData.provinceId || 0,
      logoUrl: storeData.logoUrl || "",
      bannerUrl: storeData.bannerUrl || "",
    };
    console.log("shopInfoData", shopInfoData);

    try {
      const formDataToSend = new FormData();

      // Đưa object text vào blob json
      formDataToSend.append(
        "shopInfo",
        new Blob([JSON.stringify(shopInfoData)], {
          type: "application/json",
        })
      );
      console.log("LOGO ");
      console.log(previewLogo);

      // Append file nếu có thay đổi
      if (previewLogo) {
        formDataToSend.append("logo", previewLogo);
      }

      if (previewBanner) {
        formDataToSend.append("banner", previewBanner);
      }

      const response = await axiosInstance.put(
        "/api/seller/store",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      if (data.status) {
        showSuccessToast(data.message);
        setIsEditing(false);
        fetchShopData();
      }
    } catch (error) {
      console.error("Error updating shop info:", error);
      if (error.response) {
        showErrorToast(error.response.data.message || error.message);
      } else {
        showErrorToast(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setStoreData({ ...originalData });
    if (originalData.logo) setPreviewLogo(originalData.logo);
    if (originalData.banner) setPreviewBanner(originalData.banner);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Thông tin cửa hàng
          </h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm transition-all duration-200"
            >
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  ></path>
                </svg>
                Chỉnh sửa
              </span>
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 shadow-sm transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-emerald-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-sm transition-all duration-200"
              >
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>

        {/* Store Banner and Logo */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Banner */}
          <div className="relative h-56 md:h-72 bg-gradient-to-r from-gray-100 to-gray-200">
            {previewBanner ? (
              <img
                src={
                  previewBanner instanceof File
                    ? URL.createObjectURL(previewBanner)
                    : previewBanner
                }
                alt="Store banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-gray-400 text-sm">Chưa có ảnh bìa</span>
              </div>
            )}

            {isEditing && (
              <div className="absolute bottom-4 right-4">
                <label className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 group">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerChange}
                  />
                  <svg
                    className="w-5 h-5 text-gray-500 group-hover:text-emerald-500 transition-colors duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </label>
              </div>
            )}
          </div>

          {/* Logo */}
          <div className="px-6 py-5 flex flex-col md:flex-row md:items-center">
            <div className="relative -mt-20 md:-mt-16 mb-4 md:mb-0 md:mr-6">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                {previewLogo ? (
                  <img
                    src={
                      previewLogo instanceof File
                        ? URL.createObjectURL(previewLogo)
                        : previewLogo
                    }
                    alt="Store logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <span className="text-gray-400 text-sm">Logo</span>
                  </div>
                )}

                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-all duration-200 group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                    <svg
                      className="w-4 h-4 text-gray-500 group-hover:text-emerald-500 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </label>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={storeData.name || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                    placeholder="Nhập tên cửa hàng"
                  />
                ) : (
                  storeData.name || "Chưa cập nhật tên cửa hàng"
                )}
              </h2>
              {!isEditing && (
                <p className="text-gray-500 mt-1">
                  {storeData.shopSlug || "Chưa cập nhật email"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className="grid grid-cols-1 md:grid-cols gap-8">
          {/* Main Information */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-6 pb-2 border-b border-gray-100">
                Thông tin liên hệ
              </h3>

              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email liên hệ
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={storeData.email || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      placeholder="Nhập email liên hệ"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {storeData.email || "Chưa cập nhật"}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={storeData.phoneNumber || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      placeholder="Nhập số điện thoại"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {storeData.phoneNumber || "Chưa cập nhật"}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={storeData.addressDetail || ""}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                      placeholder="Nhập địa chỉ cửa hàng"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {storeData.addressDetail || "Chưa cập nhật"}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Tỉnh/Thành phố */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Tỉnh/Thành phố <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <select
                        name="provinceId"
                        value={storeData?.provinceId ?? ""}
                        onChange={handleProvinceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                        disabled={loading.provinces}
                      >
                        <option value="">-- Chọn Tỉnh/Thành phố --</option>
                        {provinces?.map((province) => (
                          <option
                            key={province.ProvinceID}
                            value={province.ProvinceID}
                          >
                            {province.ProvinceName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-800">
                        {addressNames.provinceName}
                      </p>
                    )}
                  </div>

                  {/* Quận/Huyện */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <select
                        name="districtId"
                        value={storeData?.districtId || ""}
                        onChange={handleDistrictChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                        disabled={!storeData.provinceId || loading.districts}
                      >
                        <option value="">-- Chọn Quận/Huyện --</option>
                        {districts.map((district) => (
                          <option
                            key={district.DistrictID}
                            value={district.DistrictID}
                          >
                            {district.DistrictName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-800">
                        {addressNames.districtName}
                      </p>
                    )}
                  </div>

                  {/* Phường/Xã */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phường/Xã <span className="text-red-500">*</span>
                    </label>
                    {isEditing ? (
                      <select
                        name="wardId"
                        value={storeData?.wardId || ""}
                        onChange={handleWardChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                        disabled={!storeData.districtId || loading.wards}
                      >
                        <option value="">-- Chọn Phường/Xã --</option>
                        {wards.map((ward) => (
                          <option key={ward.WardCode} value={ward.WardCode}>
                            {ward.WardName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-gray-800">{addressNames.wardName}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-6 pb-2 border-b border-gray-100">
                Mô tả cửa hàng
              </h3>

              {isEditing ? (
                <textarea
                  name="description"
                  value={storeData.description || ""}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                  placeholder="Nhập mô tả về cửa hàng của bạn"
                ></textarea>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-gray-800 whitespace-pre-line">
                    {storeData.description || "Chưa cập nhật mô tả cửa hàng."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
