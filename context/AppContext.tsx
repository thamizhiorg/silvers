import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
  size?: number;
}

interface AppContextType {
  cart: CartItem[];
  favorites: Product[];
  addToCart: (product: Product, quantity: number, size?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);

  const addToCart = (product: Product, quantity: number, size?: number) => {
    setCart(prevCart => {
      // Check if product already exists in cart
      const existingItemIndex = prevCart.findIndex(item => 
        item.product.id === product.id && 
        (size ? item.size === size : true)
      );

      if (existingItemIndex !== -1) {
        // Update quantity if product already exists
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // Add new item if product doesn't exist
        return [...prevCart, { product, quantity, size }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (product: Product) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.some(item => item.id === product.id);
      
      if (isAlreadyFavorite) {
        return prevFavorites.filter(item => item.id !== product.id);
      } else {
        return [...prevFavorites, product];
      }
    });
  };

  const isFavorite = (productId: string) => {
    return favorites.some(item => item.id === productId);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        favorites,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
