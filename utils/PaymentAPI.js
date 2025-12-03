import axiosInstance from './axiosInstance';


export const api = (token) => {
    // Create a new instance that includes the token in auth header
    const instance = axiosInstance;
    if (token) {
        instance.defaults.headers.Authorization = `Bearer ${token}`;
    }
    return instance;
};