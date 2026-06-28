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
}

type CartAction =
  | { type: "ADD_ITEM"; product: CartProduct }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { product: action.product, quantity: 1 }] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.product.id !== action.productId) };
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => i.product.id !== action.productId) };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      };
    }
    case "CLEAR_CART":
      return { items: [] };
    case "LOAD_CART":
      return { items: action.items };
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: CartProduct) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "smartcart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  // Load cart based on auth state
  useEffect(() => {
    if (status === "loading") return;

    if (userId) {
      // Authenticated: load from DB and clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      fetch("/api/cart")
        .then((r) => r.json())
        .then(({ items }: { items: CartItem[] }) =>
          dispatch({ type: "LOAD_CART", items })
        )
        .catch(() => {});
    } else {
      // Unauthenticated: load from localStorage
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) dispatch({ type: "LOAD_CART", items: JSON.parse(stored) as CartItem[] });
      } catch {
        // ignore
      }
    }
  }, [userId, status]);

  // Persist to localStorage when unauthenticated
  useEffect(() => {
    if (userId) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items, userId]);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const total = state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const addItem = (product: CartProduct) => {
    dispatch({ type: "ADD_ITEM", product });
    if (userId) {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      }).catch(() => {});
    }
  };

  const removeItem = (productId: number) => {
    dispatch({ type: "REMOVE_ITEM", productId });
    if (userId) {
      fetch(`/api/cart/${productId}`, { method: "DELETE" }).catch(() => {});
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
    if (userId) {
      if (quantity <= 0) {
        fetch(`/api/cart/${productId}`, { method: "DELETE" }).catch(() => {});
      } else {
        fetch(`/api/cart/${productId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        }).catch(() => {});
      }
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    if (userId) {
      fetch("/api/cart", { method: "DELETE" }).catch(() => {});
    }
  };

  return (
    <CartContext.Provider
      value={{ items: state.items, itemCount, total, addItem, removeItem, updateQuantity, clearCart }}
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
