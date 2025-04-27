import axiosInstance from "./axiosInstance";
import { getAddressId } from "./cookie";

export async function calculateShippingFree(shop) {
    try {
        const userAddress = getAddressId();
        if (!userAddress) {
            console.error('Không tìm thấy địa chỉ người dùng');
            return 0;
        }

        // Kiểm tra shop và products có tồn tại không
        if (!shop || !shop.products || !Array.isArray(shop.products)) {
            console.error('Dữ liệu shop không hợp lệ');
            return 0;
        }

        // Tính tổng trọng lượng của các sản phẩm
        const totalWeight = shop.products.reduce((total, product) => {
            return total + (product.weight * product.productQuantity);
        }, 0);

        console.log('Dữ liệu gửi đi:', {
            shopId: shop.shopId,
            addressUserId: parseInt(userAddress),
            weight: parseFloat(totalWeight)
        });

        // Send a POST request with JSON body
        const response = await axiosInstance.post('/user/payment/shipping-fee', {
            shopId: shop.shopId,
            addressUserId: parseInt(userAddress),
            weight: parseFloat(totalWeight)
        });

  

        // Kiểm tra response và dữ liệu trả về
        if (response && response.data && response.data.data) {
            // Kiểm tra các trường có thể có trong response
            const shippingFee = response.data.data.shippingFee || 
                              response.data.data.fee || 
                              response.data.data.total || 
                              response.data.data.amount;
            
            if (typeof shippingFee === 'number') {
                return shippingFee;
            }
        }

     
        return 0;
    } catch (error) {
        console.error('Lỗi khi tính phí vận chuyển:', error);
        return 0;
    }
}
