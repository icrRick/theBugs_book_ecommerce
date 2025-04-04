import { useNavigate } from "react-router-dom";
import { getAddressId } from "../../utils/cookie";
import axiosInstance from "../../utils/axiosInstance";
import { useState, useEffect } from "react";
import StreetApiAddress from "./StreetApiAddress";
const SelectedAddress = () => {
    const navigate = useNavigate();
    const handleChangeAddress = () => {
        navigate("/place-order-address")
    }
    const [item, setItems] = useState([]);
    useEffect(() => {
        const addressId = getAddressId() || '';  // Dùng '' nếu không có addressId
        axiosInstance.get(`/user/address/default?addressId=${addressId}`)
            .then((response) => {
                setItems(response.data.data);
                localStorage.setItem("userAddress", JSON.stringify(response.data.data));
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);  

    return (
        <div>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold">Thông tin giao hàng</div>
                    <button className="text-blue-600 hover:text-blue-800" onClick={handleChangeAddress}>Thay đổi</button>
                </div>
                <div className="space-y-4">
                    <div className="text-sm font-medium text-gray-700 mb-1">Họ và tên: {item?.fullName}</div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Số điện thoại: {item?.phone}</div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Địa chỉ: <StreetApiAddress provinceId={item.provinceId} districtId={item.districtId} wardId={item.wardId} street={item.street} /></div>
                </div>
            </div>
        </div>
    )
}

export default SelectedAddress;
