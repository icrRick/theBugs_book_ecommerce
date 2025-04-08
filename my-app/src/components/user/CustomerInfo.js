import { useEffect, useState } from "react";
import {getAddressId } from "../../utils/cookie";
import StreetApiAddress from "./StreetApiAddress";
import axiosInstance from "../../utils/axiosInstance";

function CustomerInfo({ onAddressChange }) {
    const [item, setItems] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = 'f248ba4d-d70a-11ef-881c-b25c083cd867';

    // Fetch address data from our API
    useEffect(() => {
        const addressId = getAddressId();
        axiosInstance.get(`/user/address/default?addressId=${addressId}`)
            .then((response) => {
                setItems(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    // Fetch province data from GHN
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await axiosInstance.get(
                    'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
                    { headers: { 'Token': token } }
                );
                setProvinces(response.data.data);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        fetchProvinces();
    }, []);

    // Fetch district and ward data from GHN
    useEffect(() => {
        const fetchData = async () => {
            if (!item?.provinceId) return;
            
            setIsLoading(true);
            setError(null);
            try {
                // Fetch districts
                const districtResponse = await axiosInstance.get(
                    `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${item.provinceId}`,
                    { headers: { 'Token': token } }
                );
                setDistricts(districtResponse.data.data);

                // Fetch wards if districtId exists
                if (item.districtId) {
                    const wardResponse = await axiosInstance.get(
                        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${item.districtId}`,
                        { headers: { 'Token': token } }
                    );
                    setWards(wardResponse.data.data);
                }
            } catch (error) {
                console.error("Error fetching address data:", error);
                setError("Không thể tải dữ liệu địa chỉ. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [item?.provinceId, item?.districtId]);

    const getProvinceName = (provinceId) => {
        const province = provinces.find(p => p.ProvinceID === provinceId);
        return province ? province.ProvinceName : '';
    };

    const getDistrictName = (districtId) => {
        const district = districts.find(d => d.DistrictID === districtId);
        return district ? district.DistrictName : '';
    };

    const getWardName = (wardId) => {
        const ward = wards.find(w => w.WardCode === wardId);
        return ward ? ward.WardName : '';
    };

    useEffect(() => {
        if (item && provinces.length > 0 && districts.length > 0 && wards.length > 0) {
            const provinceName = getProvinceName(item.provinceId);
            const districtName = getDistrictName(item.districtId);
            const wardName = getWardName(item.wardId);
            const addressInfo = `${item?.fullName} - ${item?.phone} - ${item?.street}, ${wardName}, ${districtName}, ${provinceName}`;
            onAddressChange(addressInfo);
        }
    }, [item, provinces, districts, wards, onAddressChange]);

    return (
        <div>
            <StreetApiAddress 
                provinceId={item?.provinceId} 
                districtId={item?.districtId} 
                wardId={item?.wardId} 
                street={item?.street} 
            />
        </div>
    );
}

export default CustomerInfo;
