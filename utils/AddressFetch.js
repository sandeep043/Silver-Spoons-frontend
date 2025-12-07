import axiosInstance from './axiosInstance';


const getAllAddresses = async (token) => {
    try {
        const response = await axiosInstance.get(`/api/address/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('getAddresses error:', error.response?.data || error.message || error);

    }
};

const createAddress = async (addressData, token) => {
    try {
        const response = await axiosInstance.post(`/api/address/`, addressData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('createAddress response data:', response.data);
        return response.data;
    }
    catch (error) {
        console.error('createAddress error:', error.response?.data || error.message || error);

    }
};

const getDefaultAddress = async (token) => {
    try {
        const response = await axiosInstance.get(`/api/address/default`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('getDefaultAddress error:', error.response?.data || error.message || error);

    }
}


const updateAddress = async (addressId, addressData, token) => {
    try {
        const response = await axiosInstance.put(`/api/address/${addressId}`, addressData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('updateAddress error:', error.response?.data || error.message || error);

    }
};

const deleteAddress = async (addressId, token) => {
    try {
        const response = await axiosInstance.delete(`/api/address/${addressId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('deleteAddress error:', error.response?.data || error.message || error);

    }
};

export { getAllAddresses, createAddress, getDefaultAddress, updateAddress, deleteAddress };