// app/dashboard/page.tsx

import SalesStats from "@/components/SalesStats";
import TransactionHistory from "@/components/TransactionHistory";
import StockTable from "@/components/StockTable";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <SalesStats />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700">History Transaksi</h2>
          <TransactionHistory />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700">Stok Barang</h2>
          <StockTable />
        </div>
      </div>
    </div>
  );
}