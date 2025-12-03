import axiosInstance from './axiosInstance';


const addItemToCart = async (item_id, token) => {
    try {
        if (!item_id) {
            throw new Error('Valid item with id is required');
        }

        const response = await axiosInstance.post(`/api/cart/add`, {
            productId: item_id
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('addItemToCart error:', error.response?.data || error.message || error);

    }
};

const decreaseQuantity = async (itemId, token) => {
    try {
        if (!itemId) {
            throw new Error('Valid itemId is required');
        }
        const response = await axiosInstance.post(`/api/cart/decrease`, {
            productId: itemId,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
        console.error('decreaseQuantity error:', error.response?.data || error.message || error);

    }
};


const removeItemFromCart = async (itemId, token) => {
    try {
        const response = await axiosInstance.delete(`/api/cart/remove`, {
            data: { productId: itemId },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('removeItemFromCart error:', error.response?.data || error.message || error);

    }
};

const getCartItems = async (token) => {
    try {
        const response = await axiosInstance.get(`/api/cart/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
        console.error('getCartItems error:', error.response?.data || error.message || error);

    }
};


export { addItemToCart, decreaseQuantity, removeItemFromCart, getCartItems };