import axios from "axios";
import { useState, useEffect } from "react";

const ShippingFree = ({ shop }) => {
    const [shippingFree, setShippingFree] = useState(0);

    const getShippingFree = async (shopData) => {
        try {
            const url = "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee";
            const userAddress = JSON.parse(localStorage.getItem("userAddress"));
            
            if (!shopData || !shopData.products) {
                console.error("Invalid shop data:", shopData);
                return 0;
            }

            const weight = shopData.products.reduce((acc, product) => acc + (product.weight || 0), 0) || 1000;
            const body = {
                service_type_id: 2,
                from_district_id: parseInt(shopData.fromDistrictId),
                from_ward_code: shopData.fromWardCode,
                to_district_id: parseInt(userAddress.districtId),
                to_ward_code: userAddress.wardId,
                weight: weight
            }
            const headers = {
                "Content-Type": "application/json",
                "Token": "f248ba4d-d70a-11ef-881c-b25c083cd867",
                "ShopId": "5602733"
            }
            const response = await axios.post(url, body, { headers });
            setShippingFree(response.data.data.total);
            return response.data.data.total;
        } catch (error) {
            console.error("Error calculating shipping fee:", error);
            return 0;
        }
    }

    useEffect(() => {
        if (shop) {
            getShippingFree(shop);
        }
    }, [shop]);

    return (
        <span className="text-gray-600">
            {shippingFree.toLocaleString('vi-VN')}đ
        </span>
    )
}

export default ShippingFree;

// Hàm tính phí vận chuyển dựa trên khối lượng
export const calculateShippingFee = (shop) => {
    // Tính tổng khối lượng của các sản phẩm trong shop
    const weight = shop.products.reduce((acc, product) => acc + (product.weight || 0), 0) || 1000;
    
    // Biểu phí vận chuyển theo khối lượng
    const feeRates = [
        { maxWeight: 1000, fee: 15000 },    // <= 1kg: 15.000đ
        { maxWeight: 2000, fee: 25000 },    // <= 2kg: 25.000đ
        { maxWeight: 3000, fee: 35000 },    // <= 3kg: 35.000đ
        { maxWeight: Infinity, fee: 45000 } // > 3kg: 45.000đ
    ];

    // Tìm mức phí phù hợp với khối lượng
    const rate = feeRates.find(rate => weight <= rate.maxWeight);
    return rate ? rate.fee : feeRates[feeRates.length - 1].fee;
};

// Hàm định dạng số tiền thành chuỗi có đơn vị đồng
export const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + 'đ';
};

// Hàm tính tổng phí vận chuyển cho nhiều shop
export const calculateTotalShippingFee = (shops) => {
    return shops.reduce((total, shop) => total + calculateShippingFee(shop), 0);
};

// Hàm tính khối lượng của một shop
export const calculateShopWeight = (shop) => {
    return shop.products.reduce((acc, product) => acc + (product.weight || 0), 0) || 1000;
};
