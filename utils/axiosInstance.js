import axios from 'axios';
import { removeItem } from './asyncStorage';
import { store } from '../store/store';
import { logout } from '../store/authSlice';

const axiosInstance = axios.create({
    baseURL: 'http://10.0.2.2:4000',
    timeout: 10000,
});

// Prevent multiple simultaneous logout handling
let isHandlingLogout = false;

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        try {
            if (error.response?.status === 401 && !isHandlingLogout) {
                isHandlingLogout = true;
                console.log('Token expired - logging out');

                try {
                    await removeItem('token');
                    await removeItem('user');
                } catch (e) {
                    console.error('Error clearing storage during logout handling:', e);
                }

                // Dispatch logout via the store (avoid hooks here)
                store.dispatch(logout());

                // Allow handling again after a short delay
                setTimeout(() => {
                    isHandlingLogout = false;
                }, 1000);
            }
        } catch (e) {
            console.error('Error in axios interceptor:', e);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
