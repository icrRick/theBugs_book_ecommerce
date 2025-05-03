import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import { showErrorToast, showSuccessToast } from "../../utils/Toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Loading from "../../utils/Loading";



export default function EditAddress() {
    const token = "f248ba4d-d70a-11ef-881c-b25c083cd867";
    const { addressId } = useParams();
    const navigate = useNavigate();
    const [address, setAddress] = useState(null);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [searchProvince, setSearchProvince] = useState("");
    const [searchDistrict, setSearchDistrict] = useState("");
    const [searchWard, setSearchWard] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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

    useEffect(() => {
        const fetchAddress = async () => {
            setIsLoading(true);
            try {
                const response = await axiosInstance.get(`/user/address/detail?addressId=${addressId}`);
                if (response.data.status === true) {
                    setAddress(response.data.data);
                    console.log('Address data:', response.data.data);
                } else {
                    showErrorToast(response.data.message);
                }
            } catch (error) {
                showErrorToast(
                    error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
                );
            } finally {
                setIsLoading(false);
            }
        };
        fetchAddress();
    }, [addressId]);

    useEffect(() => {
        if (address) {
            reset({
                id: address?.id || "",
                fullName: address?.fullName || "",
                phone: address?.phone || "",
                provinceId: address?.provinceId || "",
                districtId: address?.districtId || "",
                wardId: address?.wardId || "",
                street: address?.street || "",
            });
            setSelectedProvince(address?.provinceId || "");
            setSelectedDistrict(address?.districtId || "");
            setSelectedWard(address?.wardId || "");

            // Fetch province name
            if (address?.provinceId) {
                axios.get(
                    "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
                    { headers: { Token: token } }
                ).then((response) => {
                    const province = response.data.data.find(p => p.ProvinceID === address.provinceId);
                    if (province) {
                        setSearchProvince(province.ProvinceName);
                        setProvinces(response.data.data);
                    }
                });
            }

            // Fetch district name
            if (address?.provinceId && address?.districtId) {
                axios.get(
                    `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${address.provinceId}`,
                    { headers: { Token: token } }
                ).then((response) => {
                    const district = response.data.data.find(d => d.DistrictID === address.districtId);
                    if (district) {
                        setSearchDistrict(district.DistrictName);
                        setDistricts(response.data.data);
                    }
                });
            }

            // Fetch ward name
            if (address?.districtId && address?.wardId) {
                axios.get(
                    `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${address.districtId}`,
                    { headers: { Token: token } }
                ).then((response) => {
                    const ward = response.data.data.find(w => w.WardCode === address.wardId);
                    if (ward) {
                        setSearchWard(ward.WardName);
                        setWards(response.data.data);
                    }
                });
            }
        }
    }, [address, reset, token]);

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
        if (!selectedProvince) {
            setDistricts([]);
            setWards([]);
            setSelectedDistrict("");
            setSelectedWard("");
            setValue("districtId", "");
            setValue("wardId", "");
            return;
        }
        axios
            .get(
                `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${selectedProvince}`,
                { headers: { Token: token } }
            )
            .then((response) => {
                setDistricts(response.data.data);
                if (!response.data.data.some((d) => d.DistrictID === selectedDistrict)) {
                    setSelectedDistrict("");
                    setSelectedWard("");
                    setValue("districtId", "");
                    setValue("wardId", "");
                }
            })
            .catch((error) => console.error("Error fetching districts:", error));
    }, [selectedProvince, selectedDistrict, setValue]);


    useEffect(() => {
        if (!selectedDistrict) {
            setWards([]);
            setSelectedWard("");
            setValue("wardId", "");
            return;
        }
        axios
            .get(
                `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${selectedDistrict}`,
                { headers: { Token: token } }
            )
            .then((response) => {
                setWards(response.data.data);
                if (!response.data.data.some((w) => w.WardCode === selectedWard)) {
                    setSelectedWard("");
                    setValue("wardId", "");
                }
            })
            .catch((error) => console.error("Error fetching wards:", error));
    }, [selectedDistrict, selectedWard, setValue]);

    const location = useLocation();

    useEffect(() => {
        reset({
            provinceId: "",
            districtId: "",
            wardId: "",
        });
    }, [reset]);
    const provinceId = watch("provinceId");
    const districtId = watch("districtId");
    const wardId = watch("wardId");
    const handleSaveAddress = async (data) => {
        try {
            setIsSaving(true);
            const response = await axiosInstance.post(`/user/address/save`, data);
            if (response.data.status === true) {
                showSuccessToast(response.data.message);
                navigate(-1, { state: { from: location.state } });
            } else {
                showErrorToast(response.data.message);
            }
        } catch (error) {
            showErrorToast(
                error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại."
            );
        } finally {
            setIsSaving(false);
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
        <>
            {(isLoading || isSaving) && <Loading />}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
                    <h3 className="text-2xl font-bold text-white">
                        Sửa địa chỉ
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
                                                        // Reset district and ward when province changes
                                                        setSearchDistrict("");
                                                        setSearchWard("");
                                                        setSelectedDistrict("");
                                                        setSelectedWard("");
                                                        setValue("districtId", "");
                                                        setValue("wardId", "");
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
                                                        // Reset ward when district changes
                                                        setSearchWard("");
                                                        setSelectedWard("");
                                                        setValue("wardId", "");
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
                                                        setSelectedWard(ward.WardCode);
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
        </>
    );
}