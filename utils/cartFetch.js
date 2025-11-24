import axios from 'axios';


const addItemToCart = async (item_id, token) => {
    try {
        if (!item_id) {
            throw new Error('Valid item with id is required');
        }

        const response = await axios.post(`http://10.0.2.2:4000/api/cart/add`, {
            productId: item_id
        }, {

            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` // if using JWT auth
            }
        });
        return response.data;
    } catch (error) {
        console.error('addItemToCart error:', error.response?.data || error.message || error);
        throw error;
    }
};

const decreaseQuantity = async (itemId, token) => {
    try {
        if (!itemId) {
            throw new Error('Valid itemId is required');
        }
        const response = await axios.post(`http://10.0.2.2:4000/api/cart/decrease`, {
            productId: itemId,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` // if using JWT auth
            },
        });
        return response.data;
    } catch (error) {
        console.error('decreaseQuantity error:', error.response?.data || error.message || error);
        throw error;
    }
};


const removeItemFromCart = async (itemId, token) => {
    try {
        // axios.delete accepts (url, config). To send a request body with DELETE,
        // include the body in the `data` field of the config object.
        const response = await axios.delete(`http://10.0.2.2:4000/api/cart/remove`, {
            data: { productId: itemId },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('removeItemFromCart error:', error.response?.data || error.message || error);
        throw error;
    }
};

const getCartItems = async (token) => {
    try {
        const response = await axios.get(`http://10.0.2.2:4000/api/cart/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` // if using JWT auth
            },
        });
        return response.data;
    } catch (error) {
        console.error('getCartItems error:', error.response?.data || error.message || error);
        throw error;
    }
};


export { addItemToCart, decreaseQuantity, removeItemFromCart, getCartItems };