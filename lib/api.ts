// lib/api.ts

const API_BASE_URL = "http://localhost:8080";

export type CreateTransactionRequest = {
  customer_id: number;
  items: {
    product_id: number;
    quantity: number;
  }[];
};

export const createTransaction = async (data: CreateTransactionRequest) => {
  const res = await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Gagal membuat transaksi");
  }
  return res.json();
};

export const getTransactions = async () => {
  const res = await fetch(`${API_BASE_URL}/transactions`);
  if (!res.ok) throw new Error("Gagal mengambil transaksi");
  return res.json();
};

export const getTransactionDetail = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}`);
  if (!res.ok) throw new Error("Transaksi tidak ditemukan");
  return res.json();
};

export const updateTransactionStatus = async (id: number, status: "completed" | "cancelled") => {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Gagal update status");
};

export const deleteTransaction = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Gagal hapus transaksi");
};

// GET semua produk untuk stok
export const getProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error("Gagal mengambil data stok");
  return res.json();
};

export const createProduct = async (data: any) => {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal tambah produk");
  return res.json();
};

// lib/api.ts

export const updateProduct = async (id: number, data: any) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT", // PASTIKAN PUT, BUKAN PATCH
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Gagal update produk");
  }
};

export const deleteProduct = async (id: number) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Gagal hapus produk");
};