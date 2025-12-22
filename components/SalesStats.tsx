// components/SalesStats.tsx

export default function SalesStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <p className="text-indigo-200">Penjualan Hari Ini</p>
        <p className="text-3xl font-bold mt-2">Rp 4.250.000</p>
        <p className="text-sm mt-2 text-indigo-100">+12% dari kemarin</p>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
        <p className="text-green-200">Transaksi Hari Ini</p>
        <p className="text-3xl font-bold mt-2">28</p>
        <p className="text-sm mt-2 text-green-100">+5 transaksi</p>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <p className="text-purple-200">Penjualan Minggu Ini</p>
        <p className="text-3xl font-bold mt-2">Rp 28.750.000</p>
        <p className="text-sm mt-2 text-purple-100">Target 80% tercapai</p>
      </div>
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
        <p className="text-orange-200">Produk Terjual</p>
        <p className="text-3xl font-bold mt-2">156</p>
        <p className="text-sm mt-2 text-orange-100">+18 dari minggu lalu</p>
      </div>
    </div>
  );
}