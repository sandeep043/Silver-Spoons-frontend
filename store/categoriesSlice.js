import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllCategories } from '../utils/productFetch';

export const fetchCategories = createAsyncThunk('categories/fetch', async (_, { rejectWithValue }) => {
    try {
        const data = await getAllCategories();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        return rejectWithValue(err.response?.data || err.message || String(err));
    }
});

const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to load categories';
            });
    },
});

export const selectCategories = (state) => state.categories.items;
export const selectCategoriesLoading = (state) => state.categories.loading;
export default categoriesSlice.reducer;
