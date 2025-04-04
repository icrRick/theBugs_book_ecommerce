
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
        };
}