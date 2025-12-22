// components/ToastNotification.tsx

"use client";

import { useState, useEffect } from "react";

type Props = {
  message: string | null;
  type: "success" | "error";
  onClose: () => void;
};

export default function ToastNotification({ message, type, onClose }: Props) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`p-4 rounded-lg shadow-lg text-white font-medium ${
          type === "success" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {message}
        <button onClick={onClose} className="ml-4 font-bold">
          ×
        </button>
      </div>
    </div>
  );
}