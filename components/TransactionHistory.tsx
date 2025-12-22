// components/TransactionHistory.tsx

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

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<TransactionDetail | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
      setFiltered(data);
    } catch (err) {
      alert("Gagal mengambil transaksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let result = transactions;

    if (search) {
      result = result.filter(
        (tx) =>
          tx.id.toString().includes(search) ||
          tx.customer_id.toString().includes(search)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((tx) => tx.status === statusFilter);
    }

    if (dateFrom) {
      result = result.filter((tx) => new Date(tx.transaction_date) >= new Date(dateFrom));
    }
    if (dateTo) {
      result = result.filter((tx) => new Date(tx.transaction_date) <= new Date(dateTo + "T23:59:59"));
    }

    setFiltered(result);
  }, [search, statusFilter, dateFrom, dateTo, transactions]);

  const handleAcc = async (id: number) => {
    if (confirm("Approve transaksi ini? Status jadi completed.")) {
      try {
        await updateTransactionStatus(id, "completed");
        fetchData();
      } catch (err) {
        alert("Gagal approve");
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus transaksi? Stock akan dikembalikan.")) {
      try {
        await deleteTransaction(id);
        fetchData();
      } catch (err) {
        alert("Gagal hapus");
      }
    }
  };

  const handleDetail = async (id: number) => {
    try {
      const data = await getTransactionDetail(id);
      setDetail(data);
    } catch (err) {
      alert("Gagal ambil detail transaksi");
    }
  };

  if (loading) return <p className="text-center py-8 text-gray-600">Loading history...</p>;

  return (
    <div className="space-y-6">
      {/* Filter & Search - Text Hitam Jelas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Cari ID / Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900"
        >
          <option value="all">Semua Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
        />
      </div>

      {/* Table History */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full table-auto">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">ID</th>
              <th className="px-6 py-4 text-left font-semibold">Customer ID</th>
              <th className="px-6 py-4 text-right font-semibold">Total</th>
              <th className="px-6 py-4 text-center font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Tanggal</th>
              <th className="px-6 py-4 text-center font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {filtered.map((tx) => (
              <tr key={tx.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium">#{tx.id}</td>
                <td className="px-6 py-4">{tx.customer_id}</td>
                <td className="px-6 py-4 text-right font-semibold">
                  Rp {tx.total_amount.toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
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
                <td className="px-6 py-4">
                  {new Date(tx.transaction_date).toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 text-center space-x-4">
                  <button
                    onClick={() => handleDetail(tx.id)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
                  >
                    Detail
                  </button>
                  {tx.status === "pending" && (
                    <button
                      onClick={() => handleAcc(tx.id)}
                      className="text-green-600 hover:text-green-800 font-medium hover:underline"
                    >
                      ACC
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="text-red-600 hover:text-red-800 font-medium hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-center py-12 text-gray-500">Tidak ada transaksi ditemukan</p>
        )}
      </div>

      {/* Modal Detail Transaksi */}
      {detail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-screen overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-3xl font-bold text-indigo-700">
                  Detail Transaksi #{detail.transaction.id}
                </h3>
                <button
                  onClick={() => setDetail(null)}
                  className="text-gray-500 hover:text-gray-700 text-3xl font-light"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-gray-600">Customer</p>
                  <p className="text-xl text-gray-600">{detail.transaction.customer_name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Tanggal</p>
                  <p className="text-xl text-gray-600">
                    {new Date(detail.transaction.transaction_date).toLocaleString("id-ID")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      detail.transaction.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : detail.transaction.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {detail.transaction.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Total</p>
                  <p className="text-3xl font-bold text-indigo-700">
                    Rp {detail.transaction.total_amount.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <h4 className="text-xl font-bold mb-4 text-indigo-700">Daftar Item</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-gray-600 text-left">Produk</th>
                      <th className="text-gray-600 text-center">Qty</th>
                      <th className="text-gray-600 text-right">Harga</th>
                      <th className="text-gray-600 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.items.map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="text-gray-600">{item.product_name}</td>
                        <td className="text-gray-600 text-center">{item.quantity}</td>
                        <td className="text-gray-600 text-right">Rp {item.price.toLocaleString("id-ID")}</td>
                        <td className="text-gray-600 text-right font-semibold">
                          Rp {item.subtotal.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
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