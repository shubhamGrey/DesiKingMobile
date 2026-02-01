import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
        total: calculateTotal(action.payload),
        itemCount: calculateItemCount(action.payload),
      };
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item => item.productId === action.payload.productId && item.sku === action.payload.sku
      );
      
      let newItems;
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
      }
      
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
      }
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };
    }
    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0,
      };
    default:
      return state;
  }
};

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateItemCount = (items) => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, getUserId, isLoading: isAuthLoading } = useAuth();

  const loadCart = useCallback(async () => {
    try {
      if (isAuthenticated) {
        const userId = await getUserId();
        if (userId) {
          const response = await apiService.getCart(userId);
          const apiItems = response.data || response;

          if (Array.isArray(apiItems)) {
            dispatch({ type: 'SET_ITEMS', payload: apiItems });
            await AsyncStorage.setItem('cart', JSON.stringify(apiItems));
            return;
          }
        }
      }
      
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        dispatch({ type: 'SET_ITEMS', payload: JSON.parse(savedCart) });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        dispatch({ type: 'SET_ITEMS', payload: JSON.parse(savedCart) });
      }
    }
  }, [isAuthenticated, getUserId]);

  useEffect(() => {
    if (!isAuthLoading) {
      loadCart();
    }
  }, [isAuthLoading, isAuthenticated, loadCart]);

  useEffect(() => {
    const saveToLocal = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(state.items));
      } catch (e) {
        console.error('Failed to save cart to local storage', e);
      }
    };
    saveToLocal();
  }, [state.items]);

  const addItem = useCallback(async (item) => {
    // Generate a temporary local ID
    const cartItem = {
      ...item,
      id: item.id || `temp-${item.productId}-${Date.now()}`,
    };
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
    
    if (isAuthenticated) {
      try {
        const userId = await getUserId();
        await apiService.addToCart({
          cart: {
            productId: item.productId,
            quantity: item.quantity,
            userId: userId,
            sku: item.sku,
            price: item.price
          }
        });
        // Refresh to get the actual database IDs for new items
        await loadCart();
      } catch (error) {
        console.error('Failed to sync cart item with API:', error);
      }
    }
  }, [isAuthenticated, getUserId, loadCart]);

  const removeItem = useCallback(async (id) => {
    // Optimistically remove locally
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    
    if (isAuthenticated) {
      try {
        await apiService.removeFromCart(id);
      } catch (error) {
        console.error('Failed to remove item from API:', error);
        // Optional: reload cart to revert if server delete failed
        loadCart();
      }
    }
  }, [isAuthenticated, loadCart]);

  const updateQuantity = useCallback(async (id, quantity) => {
    if (quantity <= 0) {
      return removeItem(id);
    }

    const item = state.items.find(i => i.id === id);
    if (!item) return;

    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });

    if (isAuthenticated) {
      try {
        const userId = await getUserId();
        await apiService.addToCart({
          cart: {
            productId: item.productId,
            quantity: quantity,
            userId: userId,
            sku: item.sku,
            price: item.price
          }
        });
      } catch (error) {
        console.error('Failed to update cart quantity on API:', error);
        loadCart();
      }
    }
  }, [isAuthenticated, getUserId, state.items, removeItem, loadCart]);

  const clearCart = useCallback(async () => {
    dispatch({ type: 'CLEAR_CART' });
    await AsyncStorage.removeItem('cart');
  }, []);

  const isInCart = useCallback((productId) => {
    return state.items.some(item => item.productId === productId);
  }, [state.items]);

  const getItemQuantity = useCallback((productId) => {
    const item = state.items.find(item => item.productId === productId);
    return item?.quantity || 0;
  }, [state.items]);

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
        refreshCart: loadCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
