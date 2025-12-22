// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { CartProvider } from "@/lib/cartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fashion Retail System",
  description: "Kasir and Inventory Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="light">
      <body className={`${inter.className} bg-gray-100 text-gray-900 antialiased`}>
        <CartProvider>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="px-6 py-4 flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-800">Fashion Retail System</h1>
                  <p className="text-gray-600 font-medium">
                    {new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {children}
              </main>
            </div>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}