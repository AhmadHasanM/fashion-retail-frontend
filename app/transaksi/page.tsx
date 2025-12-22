// app/transaksi/page.tsx

import TransactionForm from "@/components/TransactionForm";
import CartPreview from "@/components/CartPreview"; // nanti kita buat

export default function TransaksiPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-indigo-700">Transaksi Baru</h2>
          <TransactionForm />
        </div>
      </div>

      <div className="lg:col-span-1">
        <CartPreview />
      </div>
    </div>
  );
}