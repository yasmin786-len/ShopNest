import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalItems: 0, totalAmount: 0 });
      return;
    }
    setLoading(true);
    try {
      const { data } = await cartApi.get();
      setCart(data.data);
    } catch {
      // Silently ignore — cart icon will just show stale/zero state.
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    const { data } = await cartApi.add(productId, quantity);
    setCart(data.data);
    return data.data;
  }, []);

  const updateCartItem = useCallback(async (cartItemId, quantity) => {
    const { data } = await cartApi.update(cartItemId, quantity);
    setCart(data.data);
    return data.data;
  }, []);

  const removeCartItem = useCallback(async (cartItemId) => {
    const { data } = await cartApi.remove(cartItemId);
    setCart(data.data);
    return data.data;
  }, []);

  const clearCart = useCallback(async () => {
    await cartApi.clear();
    setCart({ items: [], totalItems: 0, totalAmount: 0 });
  }, []);

  const value = useMemo(
    () => ({
      cart,
      loading,
      refreshCart,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
    }),
    [cart, loading, refreshCart, addToCart, updateCartItem, removeCartItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
