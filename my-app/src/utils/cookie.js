
import Cookies from 'js-cookie';
export const setToken = (token) => {
        return Cookies.set('JWT_TOKEN', token);
};
export const getToken = () => {
        return Cookies.get('JWT_TOKEN');
};
export const removeToken = () => {
        return Cookies.remove('JWT_TOKEN');
};
export const setRole = (role) => {
        return Cookies.set('ROLE', role);
};
export const getRole = () => {
        return Cookies.get('ROLE');
};
export const removeRole = () => {
        return Cookies.remove('ROLE');
};

export const setAddressId = (addressId) => {
        return Cookies.set('ADDRESS_ID', addressId);
};
export const getAddressId = () => {
        return Cookies.get('ADDRESS_ID');
};
export const removeAddressId = () => {
        return Cookies.remove('ADDRESS_ID');
};

export const setCartByUser = (cartItems) => {
        return Cookies.set('CARTITEMS', cartItems);
};
export const getCartByUser = () => {
        return Cookies.get('CARTITEMS');
};
export const removeCartByUser = () => {
        return Cookies.remove('CARTITEMS');
};

export const getCartByUserChecked = () => {
        return Cookies.get('CARTITEMSCHECKED');
};
export const setCartByUserChecked  = (cartItems) => {
        return Cookies.set('CARTITEMSCHECKED', cartItems);
};
export const removeCartByUserChecked  = () => {
        return Cookies.remove('CARTITEMSCHECKED');
};


export const cookie= () => {
        return {
                setToken,
                getToken,
                removeToken,
                setRole,
                getRole,
                removeRole,
                setAddressId,
                getAddressId,
                removeAddressId,
                setCartByUser,
                getCartByUser,
                removeCartByUser,
        };
}