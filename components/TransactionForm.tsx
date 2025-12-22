// components/TransactionForm.tsx

"use client";

import { useState } from "react";
import { useCart } from "@/lib/cartContext";

export default function TransactionForm() {
  const { addToCart } = useCart();
  const [productId, setProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("1");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || Number(quantity) <= 0) return;

    addToCart(Number(productId), Number(quantity));
    setProductId("");
    setQuantity("1");
  };

  return (
    <form onSubmit={handleAdd} className="space-y-6">
      <div>
        <h4 className="text font-bold mb-8 text-indigo-700">Product ID</h4>
        <input
          type="number"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Contoh: 1"
          required
          min="1"
          className="text-gray-600"
        />
      </div>

      <div>
        <h4 className="text font-bold mb-8 text-indigo-700">Quantity</h4>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          min="1"
          className="text-gray-600"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Tambah ke Keranjang
      </button>
    </form>
  );
}