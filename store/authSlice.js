import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        isAuthenticated: false,
    },
    reducers: {
        setCredentials: (state, action) => {
            const { token } = action.payload;
            state.token = token;
            state.isAuthenticated = !!token;
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
        },
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        }
    },
});

export const { setCredentials, logout, setIsAuthenticated } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;