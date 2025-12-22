// components/PrintStruk.tsx

"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function PrintStruk({ transaction }: { transaction: any }) {
  const printStruk = async () => {
    const strukElement = document.getElementById("struk-print");
    if (!strukElement) return;

    const canvas = await html2canvas(strukElement);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth - 20, pdfHeight);
    pdf.save(`struk-${transaction.id}.pdf`);
  };

  return (
    <button
      onClick={printStruk}
      className="w-full mt-6 bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition text-lg"
    >
      Buat Transaksi & Print Struk
    </button>
  );
}