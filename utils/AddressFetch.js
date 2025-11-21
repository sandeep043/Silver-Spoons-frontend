import axios from 'axios';


const getAllAddresses = async (token) => {
    try {
        const response = await axios.get(`http://10.0.2.2:4000/api/address/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('getAddresses error:', error.response?.data || error.message || error);
        throw error;
    }
};

const createAddress = async (addressData, token) => {
    try {
        const response = await axios.post(`http://10.0.2.2:4000/api/address/`, addressData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('createAddress response data:', response.data); // Debugging
        return response.data;
    }
    catch (error) {
        console.error('createAddress error:', error.response?.data || error.message || error);
        throw error;
    }
};


export { getAllAddresses, createAddress };