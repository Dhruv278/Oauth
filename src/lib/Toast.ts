import { toast } from 'react-toastify';

export const showSuccessToast = (message: string) => {
    toast.success(message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        progressStyle: { background: '#4caf50' },
    });
};

export const showErrorToast = (message: string) => {
    toast.error(message, {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        progressStyle: { background: '#f44336' },
    });
};

