// components/CartPreview.tsx

"use client";

import { useCart } from "@/lib/cartContext";
import { createTransaction } from "@/lib/api";
import { useState } from "react";

export default function CartPreview() {
  const { cart, total, removeFromCart, updateQuantity, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCreateTransaction = async () => {
    if (cart.length === 0) {
      alert("Keranjang kosong! Tambahkan produk dulu.");
      return;
    }

    if (!confirm("Buat transaksi ini? Stock akan berkurang otomatis.")) {
      return;
    }

    setLoading(true);

    try {
      const customerId = 1; // hardcode dulu, nanti bisa dropdown

      const data = {
        customer_id: customerId,
        items: cart.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      };

      const result = await createTransaction(data);

      alert(
        `Transaksi berhasil dibuat!\n\nID Transaksi: #${result.id}\nTotal: Rp ${total.toLocaleString("id-ID")}\n\nStock sudah berkurang otomatis.\nSiap print struk!`
      );

      clearCart(); // kosongkan keranjang setelah berhasil
    } catch (err: any) {
      alert("Gagal membuat transaksi:\n" + (err.message || "Error tidak diketahui"));
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold mb-6 text-indigo-700">Keranjang Belanja</h3>
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg font-medium">Keranjang masih kosong</p>
          <p className="text-gray-400 text-sm mt-3">Tambahkan produk dari form di sebelah kiri</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 sticky top-8 max-h-screen overflow-y-auto">
      <h3 className="text-3xl font-bold mb-8 text-indigo-700 text-center">Keranjang Belanja</h3>

      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item.productId}
            className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-indigo-300 transition"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <p className="font-bold text-lg text-gray-800">{item.productName}</p>
                <p className="text-sm text-gray-500 mt-1">ID Produk: {item.productId}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-red-600 hover:text-red-800 font-medium text-sm transition"
              >
                Hapus
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center font-bold text-gray-700"
                >
                  −
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                  min="1"
                  className="text-gray-600"
                />
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center font-bold text-white"
                >
                  +
                </button>
              </div>
              <p className="text-xl font-bold text-gray-900">
                Rp {item.subtotal.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 pt-8 border-t-4 border-indigo-300">
        <div className="flex justify-between items-center mb-8">
          <span className="text-2xl font-bold text-gray-800">Total Pembayaran</span>
          <span className="text-4xl font-extrabold text-indigo-700">
            Rp {total.toLocaleString("id-ID")}
          </span>
        </div>

        <button
          onClick={handleCreateTransaction}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-bold text-xl py-5 rounded-xl transition shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {loading ? "Membuat Transaksi..." : "Buat Transaksi & Print Struk"}
        </button>
      </div>
    </div>
  );
}