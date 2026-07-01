"use client";

import React, { createContext, useContext, useEffect, useReducer } from "react";
import { useSession } from "next-auth/react";

export interface CartProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  cartError: string | null;
}

type CartAction =
  | { type: "ADD_ITEM"; product: CartProduct }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "SET_ERROR"; error: string | null };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { product: action.product, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    case "LOAD_CART":
      return { ...state, items: action.items };
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "SET_ERROR":
      return { ...state, cartError: action.error };
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  isLoading: boolean;
  cartError: string | null;
  clearError: () => void;
  addItem: (product: CartProduct) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "smartcart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isLoading: false,
    cartError: null,
  });
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (status === "loading") return;

    if (userId) {
      localStorage.removeItem(STORAGE_KEY);
      dispatch({ type: "SET_LOADING", isLoading: true });
      fetch("/api/cart")
        .then((r) => {
          if (!r.ok) throw new Error("Failed to load cart");
          return r.json();
        })
        .then(({ items }: { items: CartItem[] }) =>
          dispatch({ type: "LOAD_CART", items })
        )
        .catch(() =>
          dispatch({ type: "SET_ERROR", error: "Could not load your cart. Please refresh the page." })
        )
        .finally(() => dispatch({ type: "SET_LOADING", isLoading: false }));
    } else {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) dispatch({ type: "LOAD_CART", items: JSON.parse(stored) as CartItem[] });
      } catch {
        // corrupted storage — ignore, start fresh
      }
    }
  }, [userId, status]);

  useEffect(() => {
    if (userId) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, userId]);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const total = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const clearError = () => dispatch({ type: "SET_ERROR", error: null });

  const addItem = (product: CartProduct) => {
    dispatch({ type: "ADD_ITEM", product });
    dispatch({ type: "SET_ERROR", error: null });
    if (userId) {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      })
        .then((r) => { if (!r.ok) throw new Error(); })
        .catch(() =>
          dispatch({ type: "SET_ERROR", error: "Failed to add item to cart. Your changes may not be saved." })
        );
    }
  };

  const removeItem = (productId: number) => {
    dispatch({ type: "REMOVE_ITEM", productId });
    dispatch({ type: "SET_ERROR", error: null });
    if (userId) {
      fetch(`/api/cart/${productId}`, { method: "DELETE" })
        .then((r) => { if (!r.ok) throw new Error(); })
        .catch(() =>
          dispatch({ type: "SET_ERROR", error: "Failed to remove item. Please try again." })
        );
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
    dispatch({ type: "SET_ERROR", error: null });
    if (userId) {
      const req =
        quantity <= 0
          ? fetch(`/api/cart/${productId}`, { method: "DELETE" })
          : fetch(`/api/cart/${productId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ quantity }),
            });
      req
        .then((r) => { if (!r.ok) throw new Error(); })
        .catch(() =>
          dispatch({ type: "SET_ERROR", error: "Failed to update quantity. Please try again." })
        );
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    dispatch({ type: "SET_ERROR", error: null });
    if (userId) {
      fetch("/api/cart", { method: "DELETE" })
        .then((r) => { if (!r.ok) throw new Error(); })
        .catch(() =>
          dispatch({ type: "SET_ERROR", error: "Failed to clear cart. Please try again." })
        );
    }
  };

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount,
        total,
        isLoading: state.isLoading,
        cartError: state.cartError,
        clearError,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
