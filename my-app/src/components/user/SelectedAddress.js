import { useNavigate } from "react-router-dom";
import { getAddressId } from "../../utils/cookie";
import axiosInstance from "../../utils/axiosInstance";
import { useState, useEffect } from "react";
import StreetApiAddress from "./StreetApiAddress";

const SelectedAddress = ({ onAddressChange }) => {
    const navigate = useNavigate();
    const [item, setItems] = useState([]);

    const handleChangeAddress = () => {
        navigate("/place-order-address")
    }

    useEffect(() => {
        const addressId = getAddressId();
        axiosInstance.get(`/user/address/default?addressId=${addressId}`)
            .then((response) => {
                const data = response.data.data;
                setItems(data);
                
                // Truyền thông tin địa chỉ lên component cha
                if (data && onAddressChange) {
                    const addressInfo = {
                        fullName: data.fullName,
                        phone: data.phone,
                        email: data.email,
                        address: `${data.street}, ${data.wardName}, ${data.districtName}, ${data.provinceName}`
                    };
                    onAddressChange(addressInfo);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [onAddressChange]);  

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
                    <div className="text-sm font-medium text-gray-700 mb-1">Địa chỉ: <StreetApiAddress provinceId={item?.provinceId} districtId={item?.districtId} wardId={item?.wardId} street={item?.street} /></div>
                </div>
            </div>
        </div>
    )
}

export default SelectedAddress;
