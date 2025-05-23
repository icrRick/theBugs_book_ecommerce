import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showSuccessToast = (message) => {
        toast.success(message, {
                position: "top-right",
                autoClose: 2500,
                theme: "colored",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                style: {
                        marginTop: '45px',
                }

        });
};


export const showErrorToast = (message) => {
        toast.error(message, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true, style: {
                        marginTop: '45px',
                }
        });
};
export const showInfoToast = (message) => {
        toast.info(message, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
        });
};