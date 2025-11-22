"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export default function NewUsersNotification() {
  const [count, setCount] = useState(0);

  async function fetchNewUsers() {
    try {
      const res = await fetch("/api/admin/submissions");
      const data = await res.json();
      setCount(data.entries?.length || 0);
    } catch (e) {
      console.error("Failed to fetch new users count:", e);
    }
  }

  // Fetch on mount + refresh every 10s
  useEffect(() => {
    fetchNewUsers();
    const interval = setInterval(fetchNewUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-flex items-center ">
      <Bell className="h-6 w-6 text-gray-600" />

      {count > 0 && (
        <span
          className="
            absolute -top-1 -right-2 
            bg-red-600 text-white text-xs 
            px-1.5 py-0.5 rounded-full 
            font-medium shadow
            animate-pulse
          "
        >
          {count}
        </span>
      )}
    </div>
  );
}
