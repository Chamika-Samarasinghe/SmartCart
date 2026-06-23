"use client";

import { useState } from "react";
import { useCart, type CartProduct } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: CartProduct;
  className?: string;
}

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const existing = items.find((i) => i.product.id === product.id);

  function handleClick() {
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <button onClick={handleClick} className={className}>
      {justAdded
        ? "Added!"
        : existing
        ? `In cart (${existing.quantity})`
        : "Add to Cart"}
    </button>
  );
}
