// lib/cartContext.tsx

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getProducts } from "@/lib/api";

type ProductInfo = {
  id: number;
  name: string;
  price: number;
};

type CartItem = {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<number, ProductInfo>>({});
  const [loading, setLoading] = useState(true);

  // Fetch semua produk dari backend saat app mulai
  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const data = await getProducts();
        const map: Record<number, ProductInfo> = {};
        data.forEach((p: ProductInfo) => {
          map[p.id] = { id: p.id, name: p.name, price: p.price };
        });
        setProducts(map);
      } catch (err) {
        alert("Gagal memuat data produk. Transaksi sementara tidak bisa.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductInfo();
  }, []);

  const addToCart = (productId: number, quantity: number) => {
    if (loading) {
      alert("Data produk masih dimuat. Tunggu sebentar.");
      return;
    }

    if (quantity <= 0) return;

    const productInfo = products[productId];
    if (!productInfo) {
      alert(`Produk dengan ID ${productId} tidak ditemukan!`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * productInfo.price,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId,
          productName: productInfo.name,
          price: productInfo.price,
          quantity,
          subtotal: quantity * productInfo.price,
        },
      ];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const productInfo = products[productId];
    if (!productInfo) return;

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity, subtotal: quantity * productInfo.price }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}