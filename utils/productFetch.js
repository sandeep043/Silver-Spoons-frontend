import axiosInstance from "./axiosInstance";

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
        const response = await axiosInstance.get(`/api/products/search`, {
            params: { category },
            headers: { 'Content-Type': 'application/json' },
        });

        return response.data;
    } catch (error) {
        console.error('productFetchOnCategory error:', error.response?.data || error.message || error);

    }
};

const getAllCategories = async () => {
    try {
        const response = await axiosInstance.get(`/api/products/categories`, {
            headers: { 'Content-Type': 'application/json' },
        });

        return response.data.data;
    } catch (error) {
        console.error('getAllCategories error:', error.response?.data || error.message || error);

    }
};

/**
 * Search products with flexible filters.
 * options: { query, type, category, minPrice, maxPrice, page, limit, sortBy, order }
 * Returns: { products: Array, meta: { total, page, limit } }
 */
const searchProducts = async (options = {}) => {
    try {
        const params = {};
        const {
            query,
            type,
            category,
            minPrice,
            maxPrice,
            page,
            limit,
            sortBy,
            order,
        } = options;

        if (query) params.query = query;
        if (type) params.type = type;
        if (category) params.category = category;
        if (minPrice != null) params.minPrice = minPrice;
        if (maxPrice != null) params.maxPrice = maxPrice;
        if (page != null) params.page = page;
        if (limit != null) params.limit = limit;
        if (sortBy) params.sortBy = sortBy;
        if (order) params.order = order;

        console.log('Searching products with params:', params);
        const response = await axiosInstance.get(`/api/products/search`, {
            params,
            headers: { 'Content-Type': 'application/json' },
        });

        // Backend returns { success: true, data: productsArray, meta: { total, page, limit } }
        const resp = response.data || {};
        const products = resp.data ?? resp ?? [];
        const meta = resp.meta ?? {};
        return { products, meta, raw: resp };
    } catch (error) {
        console.error('searchProducts error:', error.response?.data || error.message || error);
    }
};

const getAllComboCategories = async () => {
    try {
        const response = await axiosInstance.get(`/api/products/combo-categories`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        console.error('getAllComboCategories error:', error.response?.data || error.message || error);

    }
};


export { productFetchOnCategory, getAllCategories, searchProducts, getAllComboCategories };