"use client";

import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export default function NewUsersNotification() {
  const [newCount, setNewCount] = useState(0);
  const lastCountRef = useRef<number | null>(null);

  // Fetch submission count
  const checkForNewSubmissions = async () => {
    try {
      const res = await fetch("/api/admin/submissions", { cache: "no-store" });
      const data = await res.json();

      const currentCount = data.entries?.length || 0;

      // First load → set baseline
      if (lastCountRef.current === null) {
        lastCountRef.current = currentCount;
        return;
      }

      // Check difference
      const diff = currentCount - lastCountRef.current;

      if (diff > 0) {
        // New submissions arrived
        setNewCount((prev) => prev + diff);
      }

      // Update reference
      lastCountRef.current = currentCount;
    } catch (err) {
      console.error("Failed to check for new submissions", err);
    }
  };

  useEffect(() => {
    // Check immediately on load
    checkForNewSubmissions();

    // Poll every 15 seconds
    const interval = setInterval(() => {
      checkForNewSubmissions();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleBellClick = () => {
    setNewCount(0); // reset badge
  };

  return (
    <button
      onClick={handleBellClick}
      className="relative inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition"
    >
      <Bell className="h-4 w-4" />

      {newCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {newCount}
        </span>
      )}
    </button>
  );
}
