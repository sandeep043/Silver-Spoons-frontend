import axios from "axios";

/**
 * Fetch products using query params. Calls backend GET /api/products/search
 * Expects params: { query, type, category, minPrice, maxPrice, page, limit, sortBy, order }
 */
const productFetchOnCategory = async (category) => {
    try {
        if (!category) {
            throw new Error('category is required');
        }
        console.log('Fetching products for category:', category);
        const response = await axios.get(`http://10.0.2.2:4000/api/products/search`, {
            params: { category },
            headers: { 'Content-Type': 'application/json' },
        });

        return response.data;
    } catch (error) {
        console.error('productFetchOnCategory error:', error.response?.data || error.message || error);
        throw error;
    }
};

const getAllCategories = async () => {
    try {
        const response = await axios.get(`http://10.0.2.2:4000/api/products/categories`, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Fetched categories:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('getAllCategories error:', error.response?.data || error.message || error);
        throw error;
    }
};

export { productFetchOnCategory, getAllCategories };