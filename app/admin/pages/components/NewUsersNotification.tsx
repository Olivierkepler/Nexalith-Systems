"use client";

import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";

type SubmissionEntry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
};

export default function NewUsersNotification() {
  const [newCount, setNewCount] = useState(0);
  const [popup, setPopup] = useState<SubmissionEntry | null>(null);

  const lastCountRef = useRef<number | null>(null);
  const lastDataRef = useRef<SubmissionEntry[]>([]);

  const checkForNewSubmissions = async () => {
    try {
      const res = await fetch("/api/admin/submissions", { cache: "no-store" });
      const data = await res.json();

      const entries: SubmissionEntry[] = data.entries || [];
      const currentCount = entries.length;

      // First load → baseline
      if (lastCountRef.current === null) {
        lastCountRef.current = currentCount;
        lastDataRef.current = entries;
        return;
      }

      // New submissions
      if (currentCount > lastCountRef.current) {
        const diff = currentCount - lastCountRef.current;
        setNewCount((prev) => prev + diff);

        // Identify new entries
        const newOnes = entries.slice(-diff);
        const latest = newOnes[newOnes.length - 1];

        // Show popup preview
        setPopup(latest);

        // Hide popup automatically after 5 seconds
        setTimeout(() => setPopup(null), 5000);
      }

      lastCountRef.current = currentCount;
      lastDataRef.current = entries;
    } catch (err) {
      console.error("Failed checking new submissions:", err);
    }
  };

  useEffect(() => {
    checkForNewSubmissions();

    const interval = setInterval(checkForNewSubmissions, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleBellClick = () => {
    setNewCount(0);
  };

  // This triggers switching to submissions tab in dashboard
  const openSubmissionsTab = () => {
    window.dispatchEvent(new CustomEvent("admin-open-submissions"));
    setPopup(null);
  };

  return (
    <>
      {/* 🔔 Bell */}
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

      {/* 🔥 Popup Notification */}
      {popup && (
        <div
          onClick={openSubmissionsTab}
          className="fixed bottom-6 right-6 bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl p-4 w-80 cursor-pointer animate-slide-up-fade z-50"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            New submission received
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            <strong>{popup.name}</strong> • {popup.email}
          </p>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-3">
            {popup.message}
          </p>
        </div>
      )}

      {/* ✨ Popup animation */}
      <style jsx>{`
        .animate-slide-up-fade {
          animation: slideUpFade 0.35s ease-out forwards;
        }
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
