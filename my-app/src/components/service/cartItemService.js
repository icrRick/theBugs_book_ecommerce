import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

const s_getCartItems   = async () => {
    try {
        const response = await axiosInstance.get('/user/cart/getCartItems');
        if (response.status === 200 && response.data.status === true) {
            return response.data.data;
        } else {
            console.log(response.data.message);  return [];
        }
    } catch (error) {
        console.log(error);  return [];
    }
}

const s_saveCartItem = async (productId, quantity) => {
    try {
        const response = await axiosInstance.post(`/user/cart/saveCartItem?productId=${productId}&quantity=${quantity}`);
        if (response.status === 200 && response.data.status === true) {
            return await s_getCartItems();
        } else {
            console.log(response.data.message);
            return [];
        }
    } catch (error) {
        console.log(error);  return [];
    }
}


const s_deleteCartItem = async (productId) => {
    try {
        const response = await axiosInstance.post(`/user/cart/deleteCartItem?productId=${productId}`);
        if (response.status === 200 && response.data.status === true) {
            return await s_getCartItems();
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}
const s_repurchaseCartItem = async (orderId) => {
    try {
        const response = await axiosInstance.post(`/user/cart/repurchaseCartItem?orderId=${orderId}`);
        if (response.status === 200 && response.data.status === true) {
            return await s_getCartItems();
        } else {
            console.log(response.data.message);
            return [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}
const s_countCartItems = async () => {
    try {
        const response = await s_getCartItems();
        if (response) {
            console.log(response.reduce((acc, shop) => acc + shop.products.length, 0));
            return response.reduce((acc, shop) => acc + shop.products.length, 0);
        } else {    
            console.log(response.data.message);
            return 0;
        }
    } catch (error) {
        console.log(error);
        return 0;
    }
}
export { s_getCartItems, s_saveCartItem, s_deleteCartItem, s_repurchaseCartItem, s_countCartItems };




