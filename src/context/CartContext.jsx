import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [] });
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        }
    }, [isAuthenticated]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await cartAPI.get();
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            const response = await cartAPI.add(productId, quantity);
            setCart(response.data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add to cart'
            };
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const response = await cartAPI.update(productId, quantity);
            setCart(response.data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update quantity'
            };
        }
    };

    const removeFromCart = async (productId) => {
        try {
            const response = await cartAPI.remove(productId);
            setCart(response.data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to remove from cart'
            };
        }
    };

    const clearCart = async () => {
        try {
            const response = await cartAPI.clear();
            setCart(response.data);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to clear cart'
            };
        }
    };

    const calculateTotal = () => {
        return cart.items.reduce((total, item) => {
            return total + (item.product?.price || 0) * item.quantity;
        }, 0);
    };

    const getItemCount = () => {
        return cart.items.reduce((count, item) => count + item.quantity, 0);
    };

    const value = {
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        calculateTotal,
        getItemCount,
        refreshCart: fetchCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
