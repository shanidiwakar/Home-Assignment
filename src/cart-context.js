import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = '@nua/cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  useEffect(() => { AsyncStorage.getItem(CART_KEY).then((stored) => { if (stored) setItems(JSON.parse(stored)); }).catch(() => {}).finally(() => setReady(true)); }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem(CART_KEY, JSON.stringify(items)).catch(() => {}); }, [items, ready]);
  const add = useCallback((product) => setItems((current) => {
    const found = current.find((item) => item.id === product.id);
    return found ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }];
  }), []);
  const value = useMemo(() => ({ items, itemCount: items.reduce((total, item) => total + item.quantity, 0), add }), [items, add]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('useCart must be used inside CartProvider'); return context; }
