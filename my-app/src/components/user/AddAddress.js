import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import { useNavigate } from "react-router-dom";

export default function AddAddress() {
    const token = "f248ba4d-d70a-11ef-881c-b25c083cd867";
    const navigate = useNavigate();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [searchProvince, setSearchProvince] = useState("");
    const [searchDistrict, setSearchDistrict] = useState("");
    const [searchWard, setSearchWard] = useState("");
    const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
    const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
    const [showWardDropdown, setShowWardDropdown] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm();

    const provinceId = watch("provinceId");
    const districtId = watch("districtId");
    const wardId = watch("wardId");

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axios.get(
                    "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
                    { headers: { Token: token } }
                );
                if (response.data && response.data.data) {
                    setProvinces(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching provinces:", error);
                setProvinces([]);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedProvince) {
                try {
                    const response = await axios.get(
                        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${selectedProvince}`,
                        {
                            headers: { Token: token },
                        }
                    );
                    if (response.data && response.data.data) {
                        setDistricts(response.data.data);
                    }
                } catch (error) {
                    console.error("Error fetching districts:", error);
                    setDistricts([]);
                }
            }
        };

        fetchDistricts();
    }, [selectedProvince]);

    useEffect(() => {
        const fetchWards = async () => {
            if (selectedDistrict) {
                try {
                    const response = await axios.get(
                        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${selectedDistrict}`,
                        {
                            headers: { Token: token },
                        }
                    );
                    if (response.data && response.data.data) {
                        setWards(response.data.data);
                    }
                } catch (error) {
                    console.error("Error fetching wards:", error);
                    setWards([]);
                }
            }
        };

        fetchWards();
    }, [selectedDistrict]);

    useEffect(() => {
        reset({
            provinceId: "",
            districtId: "",
            wardId: "",
        });
    }, [reset]);

    const handleSaveAddress = async (data) => {
        try {
            const response = await axiosInstance.post(`/user/address/save`, data);
            if (response.data.status === true) {
                showSuccessToast(response.data.message);
                navigate(-1);
            } else {
                showErrorToast(response.data.message);
            }
        } catch (error) {
            showErrorToast(
                error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
            );
        }
    };

    const filteredProvinces = provinces?.filter((province) =>
        province.ProvinceName.toLowerCase().includes(searchProvince.toLowerCase())
    ) || [];

    const filteredDistricts = districts?.filter((district) =>
        district.DistrictName.toLowerCase().includes(searchDistrict.toLowerCase())
    ) || [];

    const filteredWards = wards?.filter((ward) =>
        ward.WardName.toLowerCase().includes(searchWard.toLowerCase())
    ) || [];

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <h3 className="text-2xl font-bold text-white">
                Thêm địa chỉ mới
            </h3>
            <p className="mt-2 text-blue-100">
                Vui lòng điền đầy đủ thông tin địa chỉ của bạn
            </p>
        </div>
        <div className="p-6">
            <form onSubmit={handleSubmit(handleSaveAddress)} className="space-y-6">
                <input type="hidden" {...register("id")} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Họ & Tên <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150`}
                            placeholder="Nhập họ và tên"
                            {...register("fullName", {
                                required: "Họ tên không được để trống",
                            })}
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.fullName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150`}
                            placeholder="Nhập số điện thoại"
                            {...register("phone", {
                                required: "Số điện thoại không được để trống",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Số điện thoại phải là 10 chữ số",
                                },
                            })}
                        />
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tỉnh/Thành phố <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.provinceId ? "border-red-500" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150`}
                                placeholder="Chọn tỉnh/thành phố"
                                value={searchProvince}
                                onChange={(e) => {
                                    setSearchProvince(e.target.value);
                                    setShowProvinceDropdown(true);
                                }}
                                onFocus={() => setShowProvinceDropdown(true)}
                            />
                            {showProvinceDropdown && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {filteredProvinces.map((province) => (
                                        <div
                                            key={province.ProvinceID}
                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition duration-150"
                                            onClick={() => {
                                                setValue("provinceId", province.ProvinceID);
                                                setSearchProvince(province.ProvinceName);
                                                setSelectedProvince(province.ProvinceID);
                                                setShowProvinceDropdown(false);
                                            }}
                                        >
                                            {province.ProvinceName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.provinceId && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.provinceId.message}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quận/Huyện <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.districtId ? "border-red-500" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150`}
                                placeholder="Chọn quận/huyện"
                                value={searchDistrict}
                                onChange={(e) => {
                                    setSearchDistrict(e.target.value);
                                    setShowDistrictDropdown(true);
                                }}
                                onFocus={() => setShowDistrictDropdown(true)}
                                disabled={!selectedProvince}
                            />
                            {showDistrictDropdown && selectedProvince && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {filteredDistricts.map((district) => (
                                        <div
                                            key={district.DistrictID}
                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition duration-150"
                                            onClick={() => {
                                                setValue("districtId", district.DistrictID);
                                                setSearchDistrict(district.DistrictName);
                                                setSelectedDistrict(district.DistrictID);
                                                setShowDistrictDropdown(false);
                                            }}
                                        >
                                            {district.DistrictName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.districtId && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.districtId.message}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phường/Xã <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.wardId ? "border-red-500" : "border-gray-300"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150`}
                                placeholder="Chọn phường/xã"
                                value={searchWard}
                                onChange={(e) => {
                                    setSearchWard(e.target.value);
                                    setShowWardDropdown(true);
                                }}
                                onFocus={() => setShowWardDropdown(true)}
                                disabled={!selectedDistrict}
                            />
                            {showWardDropdown && selectedDistrict && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {filteredWards.map((ward) => (
                                        <div
                                            key={ward.WardCode}
                                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition duration-150"
                                            onClick={() => {
                                                setValue("wardId", ward.WardCode);
                                                setSearchWard(ward.WardName);
                                                setShowWardDropdown(false);
                                            }}
                                        >
                                            {ward.WardName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.wardId && (
                            <p className="mt-1 text-sm text-red-500">
                                {errors.wardId.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ chi tiết <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className={`w-full px-4 py-3 rounded-lg border ${errors.street ? "border-red-500" : "border-gray-300"
                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150`}
                        rows="3"
                        placeholder="Nhập số nhà, tên đường..."
                        {...register("street", {
                            required: "Địa chỉ không được để trống",
                        })}
                    />
                    {errors.street && (
                        <p className="mt-1 text-sm text-red-500">
                            {errors.street.message}
                        </p>
                    )}
                </div>
                    <div className="flex justify-end pt-4 space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate("/account/address")}
                            className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition duration-150 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:-translate-y-0.5"
                        >
                            Xác nhận
                        </button>
                    </div>
            </form>
        </div>
    </div>
    );
}