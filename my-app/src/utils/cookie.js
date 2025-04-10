
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


export const setAddressId = (addressId) => {
        return Cookies.set('ADDRESS_ID', addressId);
};
export const getAddressId = () => {
        return Cookies.get('ADDRESS_ID');
};
export const removeAddressId = () => {
        return Cookies.remove('ADDRESS_ID');
};

export const setListProductIds = (listProductIds) => {
        return Cookies.set('LIST_PRODUCT_IDS', listProductIds);
};
export const getListProductIds = () => {
        return Cookies.get('LIST_PRODUCT_IDS');
};
export const removeListProductIds = () => {
        return Cookies.remove('LIST_PRODUCT_IDS');
};
export const setListVoucherIds = (listVoucherIds) => {
        return Cookies.set('LIST_VOUCHER_IDS', listVoucherIds);
};
export const getListVoucherIds = () => {
        return Cookies.get('LIST_VOUCHER_IDS');
};
export const removeListVoucherIds = () => {
        return Cookies.remove('LIST_VOUCHER_IDS');
};


export const cookie= () => {
        return {
                setToken,
                getToken,
                removeToken,
                setAddressId,
                getAddressId,
                removeAddressId,
                setListProductIds,
                getListProductIds,
                removeListProductIds,
                setListVoucherIds,
                getListVoucherIds,
                removeListVoucherIds,
        };
}