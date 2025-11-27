"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function NewUsersNotification() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Example: Simulate new user notifications
    const interval = setInterval(() => {
      setCount((c) => c + 1);
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <button className="relative inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition">
      <Bell className="h-4 w-4" />

      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {count}
        </span>
      )}
    </button>
  );
}
