import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../utils/Loading";

const StreetApiAddress = ({ provinceId, districtId, wardId, street }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = 'f248ba4d-d70a-11ef-881c-b25c083cd867';

    // Fetch province, district, and ward data
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch provinces
                const provinceResponse = await axios.get(
                    'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
                    { headers: { 'Token': token } }
                );
                setProvinces(provinceResponse.data.data);

                // Fetch districts if provinceId exists
                if (provinceId) {
                    const districtResponse = await axios.get(
                        `https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`,
                        { headers: { 'Token': token } }
                    );
                    setDistricts(districtResponse.data.data);
                }

                // Fetch wards if districtId exists
                if (districtId) {
                    const wardResponse = await axios.get(
                        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
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
    }, [provinceId, districtId]);

    const getProvinceName = (list, provinceId) => {
        const item = list.find(item => item.ProvinceID === provinceId);
        return item ? item.ProvinceName : '';
    };

    const getDistrictName = (list, districtId) => {
        const item = list.find(item => item.DistrictID === districtId);
        return item ? item.DistrictName : '';
    };

    const getWardName = (list, wardId) => {
        const item = list.find(item => item.WardCode === wardId);
        return item ? item.WardName : '';
    };

    if (isLoading) {
        return (
           <Loading/>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-sm">
                {error}
            </div>
        );
    }

    const provinceName = getProvinceName(provinces, provinceId);
    const districtName = getDistrictName(districts, districtId);
    const wardName = getWardName(wards, wardId);

    if (!provinceName && !districtName && !wardName) {
        return null;
    }

    return (
        <span className="text-gray-700">
            {`${street ? street + ', ' : ''}${wardName ? wardName + ', ' : ''}${districtName ? districtName + ', ' : ''}${provinceName}`}
        </span>
    );
}

export default StreetApiAddress;