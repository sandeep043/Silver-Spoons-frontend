import React, { createContext, useState, useCallback } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartRefreshTrigger, setCartRefreshTrigger] = useState(0);

    const triggerCartRefresh = useCallback(() => {
        setCartRefreshTrigger(prev => prev + 1);
    }, []);

    return (
        <CartContext.Provider value={{ cartRefreshTrigger, triggerCartRefresh }}>
            {children}
        </CartContext.Provider>
    );
};
