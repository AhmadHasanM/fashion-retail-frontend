// app/forecasting/page.tsx

"use client";

import { useState } from "react";

export default function ForecastingPage() {
  const [file, setFile] = useState<File | null>(null);
  const [eda, setEda] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleEDA = async () => {
    if (!file) return alert("Upload CSV dulu!");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8080/forecast/eda", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setEda(data);
    } catch (err) {
      alert("Gagal Analisis EDA: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleForecast = async () => {
    if (!file) return alert("Upload CSV dulu!");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8080/forecast/predict", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setForecast(data);
    } catch (err) {
      alert("Gagal Forecasting: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 p-6">
      <h2 className="text-4xl font-bold text-indigo-700 text-center">Forecasting Penjualan</h2>

      <div className="bg-white rounded-2xl shadow-xl p-10">
        <label className="block text-xl font-semibold text-gray-800 mb-6">Upload File CSV</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          accept=".csv"
          className="w-full px-6 py-5 border-2 border-gray-300 rounded-xl text-gray-900 bg-white cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-400 file:mr-6 file:py-4 file:px-8 file:rounded-xl file:border-0 file:text-base file:font-bold file:bg-indigo-100 file:text-indigo-800 hover:file:bg-indigo-200 transition"
        />

        <div className="flex gap-6 mt-8">
          <button
            onClick={handleEDA}
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white py-5 px-8 rounded-xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 transition shadow-lg hover:shadow-xl"
          >
            {loading ? "Memproses..." : "Analisis EDA"}
          </button>
          <button
            onClick={handleForecast}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-5 px-8 rounded-xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 transition shadow-lg hover:shadow-xl"
          >
            {loading ? "Memproses..." : "Forecasting"}
          </button>
        </div>
      </div>

      {eda && (
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <h3 className="text-3xl font-bold mb-8 text-indigo-700 text-center">Hasil Analisis EDA</h3>

          {/* AI Insights (kalau ada) */}
          {eda.ai_insights && (
            <div className="mb-10">
              <h4 className="text-2xl font-semibold mb-4 text-gray-800">Insights AI</h4>
              <div className="prose max-w-none text-gray-800 leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: eda.ai_insights.replace(/\n/g, '<br>') }} />
              </div>
            </div>
          )}

          {/* Summary Statistik */}
          <div className="mb-10">
            <h4 className="text-2xl font-semibold mb-4 text-gray-800">Summary Statistik</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl shadow">
                <p className="font-medium text-gray-700">Shape</p>
                <p className="text-2xl font-bold text-indigo-700">{eda.shape || "-"}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl shadow">
                <p className="font-medium text-gray-700">Kolom</p>
                <p className="text-lg text-gray-800">{eda.columns?.join(", ") || "-"}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl shadow">
                <p className="font-medium text-gray-700">Missing Values</p>
                <pre className="text-gray-800 bg-white p-4 rounded-lg overflow-x-auto mt-2">{JSON.stringify(eda.missing || {}, null, 2)}</pre>
              </div>
            </div>
          </div>

          {/* Graphs Dinamis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {eda.graphs?.graph_harga && (
              <div className="bg-gray-50 p-6 rounded-xl shadow">
                <h4 className="text-xl font-semibold mb-4 text-gray-800">Distribusi Harga</h4>
                <img src={`data:image/png;base64,${eda.graphs.graph_harga}`} alt="Distribusi Harga" className="w-full rounded-lg" />
              </div>
            )}

            {eda.graphs?.graph_top_sales && (
              <div className="bg-gray-50 p-6 rounded-xl shadow">
                <h4 className="text-xl font-semibold mb-4 text-gray-800">Perbandingan Penjualan 3 Produk Top</h4>
                <img src={`data:image/png;base64,${eda.graphs.graph_top_sales}`} alt="Top Sales" className="w-full rounded-lg" />
              </div>
            )}

            {eda.graphs?.graph_rating_brand && (
              <div className="bg-gray-50 p-6 rounded-xl shadow">
                <h4 className="text-xl font-semibold mb-4 text-gray-800">Distribusi Rating per Brand</h4>
                <img src={`data:image/png;base64,${eda.graphs.graph_rating_brand}`} alt="Rating per Brand" className="w-full rounded-lg" />
              </div>
            )}

            {eda.graphs?.graph_motif && (
              <div className="bg-gray-50 p-6 rounded-xl shadow">
                <h4 className="text-xl font-semibold mb-4 text-gray-800">Distribusi Motif Produk</h4>
                <img src={`data:image/png;base64,${eda.graphs.graph_motif}`} alt="Distribusi Motif" className="w-full rounded-lg" />
              </div>
            )}
          </div>
        </div>
      )}

      {forecast && (
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <h3 className="text-3xl font-bold mb-8 text-indigo-700 text-center">Hasil Forecasting</h3>
          <div className="mb-8">
            <h4 className="text-2xl font-semibold mb-4 text-gray-800">Prediksi Penjualan</h4>
            <pre className="bg-gray-50 p-6 rounded-xl overflow-x-auto text-gray-800 text-lg">
              {JSON.stringify(forecast.forecast, null, 2)}
            </pre>
          </div>
          {forecast.graph && (
            <div>
              <h4 className="text-2xl font-semibold mb-4 text-gray-800">Grafik Forecasting</h4>
              <img src={`data:image/png;base64,${forecast.graph}`} alt="Forecast Graph" className="w-full rounded-lg shadow-md" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}