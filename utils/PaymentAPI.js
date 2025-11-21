import axios from 'axios';


export const api = (token) => {
    const instance = axios.create({
        baseURL: `http://10.0.2.2:4000/api`,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        timeout: 20000
    });
    return instance;
};