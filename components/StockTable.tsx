// components/StockTable.tsx

"use client";

import { useState, useEffect } from "react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/api";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
};

export default function StockTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data stok");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category.trim(),
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await createProduct(data);
      }

      setModalOpen(false);
      setEditingProduct(null);
      setForm({ name: "", description: "", price: "", stock: "", category: "" });
      fetchProducts();
    } catch (err: any) {
      alert("Gagal simpan produk: " + (err.message || "Error"));
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus produk ini?")) return;
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      alert("Gagal hapus produk");
    }
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) return <p className="text-center py-12 text-gray-600 text-xl">Memuat stok barang...</p>;
  if (error) return <p className="text-center py-12 text-red-600 text-xl">{error}</p>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-4xl font-extrabold text-indigo-700">Manajemen Stok Barang</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setForm({ name: "", description: "", price: "", stock: "", category: "" });
            setModalOpen(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition"
        >
          + Tambah Produk Baru
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-2xl">
        <table className="w-full table-auto">
          <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
            <tr>
              <th className="px-8 py-5 text-left font-bold">ID</th>
              <th className="px-8 py-5 text-left font-bold">Nama Produk</th>
              <th className="px-8 py-5 text-left font-bold">Deskripsi</th>
              <th className="px-8 py-5 text-left font-bold">Kategori</th>
              <th className="px-8 py-5 text-center font-bold">Stok</th>
              <th className="px-8 py-5 text-right font-bold">Harga</th>
              <th className="px-8 py-5 text-center font-bold">Status</th>
              <th className="px-8 py-5 text-center font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-indigo-50 transition duration-200">
                <td className="px-8 py-6 font-mono font-bold text-indigo-600">#{product.id}</td>
                <td className="px-8 py-6 font-semibold">{product.name}</td>
                <td className="px-8 py-6 text-gray-600 max-w-md truncate">
                  {product.description || "-"}
                </td>
                <td className="px-8 py-6 text-gray-700 font-medium">
                  {product.category || "-"}
                </td>
                <td className="px-8 py-6 text-center text-3xl font-extrabold text-gray-900">
                  {product.stock}
                </td>
                <td className="px-8 py-6 text-right font-bold text-xl">
                  {formatRupiah(product.price)}
                </td>
                <td className="px-8 py-6 text-center">
                  <span
                    className={`px-6 py-3 rounded-full text-sm font-bold shadow-sm ${
                      product.stock < 10
                        ? "bg-red-100 text-red-800"
                        : product.stock < 20
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {product.stock < 10 ? "Stok Kritis" : product.stock < 20 ? "Menipis" : "Aman"}
                  </span>
                </td>
                <td className="px-8 py-6 text-center space-x-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800 font-bold hover:underline transition"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl font-medium">Belum ada produk terdaftar</p>
          </div>
        )}
      </div>

      {/* Modal Tambah/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-10">
            <h3 className="text-3xl font-extrabold mb-8 text-center text-indigo-700">
              {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Nama Produk"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500 transition"
              />
              <textarea
                placeholder="Deskripsi"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500 transition resize-none"
              />
              <div className="grid grid-cols-2 gap-6">
                <input
                  type="number"
                  placeholder="Harga"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  min="0"
                  className="px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                />
                <input
                  type="number"
                  placeholder="Stok Awal"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                  min="0"
                  className="px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <input
                type="text"
                placeholder="Kategori"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300 focus:border-indigo-500 bg-white text-gray-900 placeholder-gray-500"
              />
              <div className="flex gap-6 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xl py-5 rounded-xl transition shadow-lg hover:shadow-xl"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold text-xl py-5 rounded-xl transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}