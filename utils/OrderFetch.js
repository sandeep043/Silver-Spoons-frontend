import axiosInstance from './axiosInstance';

const OrderHistory = async (token) => {

    try {
        const response = await axiosInstance.get(`/api/order/history`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('OrderHistory error:', error.response?.data || error.message || error);

    }
};

const getOrderDetails = async (token, OrderId) => {
    try {
        const response = await axiosInstance.get(`/api/order/${OrderId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('getOrderDetails error:', error.response?.data || error.message || error);

    }
}

export {
    OrderHistory, getOrderDetails
}