import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

const s_getCartItems   = async () => {
    try {
        const response = await axiosInstance.get('/user/cart/getCartItems');
        if (response.status === 200 && response.data.status === true) {
            return response.data.data;
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

const s_saveCartItem = async (productId, quantity) => {
    try {
        const response = await axiosInstance.post(`/user/cart/saveCartItem?productId=${productId}&quantity=${quantity}`);
        if (response.status === 200 && response.data.status === true) {
            return s_getCartItems();
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}


const s_deleteCartItem = async (productId) => {
    try {
        const response = await axiosInstance.post(`/user/cart/deleteCartItem?productId=${productId}`);
        if (response.status === 200 && response.data.status === true) {
            return s_getCartItems();
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

export { s_getCartItems, s_saveCartItem, s_deleteCartItem };




