// components/TransactionTable.tsx

"use client";

import { useState, useEffect } from "react";
import { getTransactions, updateTransactionStatus, deleteTransaction, getTransactionDetail } from "@/lib/api";

type Transaction = {
  id: number;
  customer_id: number;
  total_amount: number;
  transaction_date: string;
  status: string;
};

type TransactionDetail = {
  transaction: {
    id: number;
    customer_name: string;
    total_amount: number;
    transaction_date: string;
    status: string;
  };
  items: {
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
};

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDetail, setSelectedDetail] = useState<TransactionDetail | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      setMessage({ type: "error", text: "Gagal mengambil data transaksi" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 10000); // refresh tiap 10 detik
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (id: number, newStatus: "completed" | "cancelled") => {
    try {
      await updateTransactionStatus(id, newStatus);
      setMessage({ type: "success", text: `Status diubah ke ${newStatus}` });
      fetchTransactions();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus transaksi ini? Stock akan dikembalikan.")) return;
    try {
      await deleteTransaction(id);
      setMessage({ type: "success", text: "Transaksi dihapus & stock dikembalikan" });
      fetchTransactions();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const detail = await getTransactionDetail(id);
      setSelectedDetail(detail);
    } catch (err) {
      setMessage({ type: "error", text: "Gagal ambil detail" });
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
          <button onClick={() => setMessage(null)} className="ml-4 font-bold">
            ×
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center py-8">Loading transaksi...</p>
      ) : transactions.length === 0 ? (
        <p className="text-center py-8 text-gray-500">Belum ada transaksi hari ini</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Customer ID</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Tanggal</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">#{tx.id}</td>
                  <td className="px-4 py-3">{tx.customer_id}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    Rp {tx.total_amount.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tx.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : tx.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(tx.transaction_date).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleViewDetail(tx.id)}
                      className="text-indigo-600 hover:underline mr-3"
                    >
                      Detail
                    </button>
                    {tx.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleStatusChange(tx.id, "completed")}
                          className="text-green-600 hover:underline mr-3"
                        >
                          Selesai
                        </button>
                        <button
                          onClick={() => handleStatusChange(tx.id, "cancelled")}
                          className="text-red-600 hover:underline mr-3"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="text-red-600 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Detail */}
      {selectedDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">Detail Transaksi #{selectedDetail.transaction.id}</h3>
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <p>
                  <strong>Customer:</strong> {selectedDetail.transaction.customer_name}
                </p>
                <p>
                  <strong>Tanggal:</strong>{" "}
                  {new Date(selectedDetail.transaction.transaction_date).toLocaleString("id-ID")}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedDetail.transaction.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : selectedDetail.transaction.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {selectedDetail.transaction.status}
                  </span>
                </p>

                <h4 className="text-lg font-semibold mt-6">Items:</h4>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">Produk</th>
                      <th className="px-4 py-2 text-center">Qty</th>
                      <th className="px-4 py-2 text-right">Harga</th>
                      <th className="px-4 py-2 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDetail.items.map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-4 py-2">{item.product_name}</td>
                        <td className="px-4 py-2 text-center">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">Rp {item.price.toLocaleString("id-ID")}</td>
                        <td className="px-4 py-2 text-right">
                          Rp {item.subtotal.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-gray-100">
                      <td colSpan={3} className="px-4 py-3 text-right">
                        Total
                      </td>
                      <td className="px-4 py-3 text-right">
                        Rp {selectedDetail.transaction.total_amount.toLocaleString("id-ID")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}