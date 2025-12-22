// components/Sidebar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, LayoutDashboard } from "lucide-react";

const menuItems = [
  {
    name: "Transaksi",
    href: "/transaksi",
    icon: ShoppingCart,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-indigo-700 text-white">
      <div className="p-6">
        <h2 className="text-xl font-bold">Fashion Retail</h2>
        <p className="text-indigo-200 text-sm">Chasier and Inventory Management</p>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-800 border-r-4 border-white"
                  : "hover:bg-indigo-600"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}