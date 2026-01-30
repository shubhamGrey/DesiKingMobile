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
  const { isAuthenticated, getUserId } = useAuth();

  // Load cart from storage on mount
  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  // Save cart to storage when it changes
  useEffect(() => {
    saveCart();
  }, [state.items]);

  const loadCart = async () => {
    try {
      if (isAuthenticated) {
        const userId = await getUserId();
        if (userId) {
          try {
            const response = await apiService.getCart(userId);
            if (response.data) {
              dispatch({ type: 'SET_ITEMS', payload: response.data });
              return;
            }
          } catch (error) {
            console.log('Failed to load cart from API, using local storage');
          }
        }
      }
      
      // Fallback to local storage
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        dispatch({ type: 'SET_ITEMS', payload: JSON.parse(savedCart) });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addItem = useCallback(async (item) => {
    const cartItem = {
      ...item,
      id: item.id || `${item.productId}-${item.sku || 'default'}-${Date.now()}`,
    };
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
    
    // Sync with API if authenticated
    if (isAuthenticated) {
      try {
        const userId = await getUserId();
        await apiService.addToCart({
          ...cartItem,
          userId,
        });
      } catch (error) {
        console.error('Failed to sync cart with API:', error);
      }
    }
  }, [isAuthenticated, getUserId]);

  const removeItem = useCallback(async (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    
    if (isAuthenticated) {
      try {
        await apiService.removeFromCart(id);
      } catch (error) {
        console.error('Failed to remove item from API:', error);
      }
    }
  }, [isAuthenticated]);

  const updateQuantity = useCallback((id, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

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
