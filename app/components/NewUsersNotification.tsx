"use client";

import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import Toast from "./Toast";

export default function NewUsersNotification() {
  const [entries, setEntries] = useState<any[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(
    typeof window !== "undefined" &&
      localStorage.getItem("sound_enabled") === "true"
  );

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Play sound when new submission arrives
  function playSound() {
    if (!soundEnabled) return;
    const audio = new Audio("/notification.mp3");
    audio.play();
  }

  // Fetch submissions
  async function loadEntries() {
    try {
      const res = await fetch("/api/admin/submissions");
      const data = await res.json();

      setEntries(data.entries);

      if (!data.entries.length) return;

      const lastRead = Number(localStorage.getItem("last_read_timestamp") || 0);
      const newestTimestamp = new Date(data.entries[0].timestamp).getTime();

      if (newestTimestamp > lastRead) {
        setUnread(1);
        setShowToast(true);
        playSound();
      }
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  }

  useEffect(() => {
    loadEntries();
    const interval = setInterval(loadEntries, 10000);
    return () => clearInterval(interval);
  }, []);

  // Mark as read
  function markAsRead() {
    if (!entries.length) return;

    const newest = new Date(entries[0].timestamp).getTime();
    localStorage.setItem("last_read_timestamp", String(newest));
    setUnread(0);
  }

  // Close dropdown if clicking outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Toast Alert */}
      {showToast && <Toast message="New submission received!" />}

      <div className="relative" ref={dropdownRef}>
        {/* Bell Icon */}
        <button
          onClick={() => {
            setOpen(!open);
            if (!open) markAsRead();
          }}
          className="relative p-2 hover:bg-gray-100 rounded-full"
        >
          <Bell className="h-6 w-6 text-gray-700" />

          {unread > 0 && (
            <span
              className="absolute -top-1 -right-1 
                bg-red-600 text-white text-xs font-bold 
                h-5 w-5 flex items-center justify-center 
                rounded-full shadow animate-pulse"
            >
              {unread}
            </span>
          )}
        </button>

        {/* Dropdown Panel */}
        {open && (
          <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl border border-gray-200 rounded-xl p-4 z-20">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              Recent Submissions
            </h3>

            {!entries.length ? (
              <p className="text-xs text-gray-500">No submissions yet</p>
            ) : (
              entries.slice(0, 5).map((entry: any, i: number) => (
                <div
                  key={i}
                  className={`border-b last:border-none py-2 ${
                    i === 0 && unread ? "bg-yellow-50" : ""
                  }`}
                >
                  <p className="font-medium text-gray-900">{entry.name}</p>
                  <p className="text-xs text-gray-500">{entry.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {entry.timestamp}
                  </p>
                </div>
              ))
            )}

            {/* Mark as Read */}
            <button
              onClick={markAsRead}
              className="mt-3 w-full text-center text-sm py-2
                        bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
            >
              Mark all as read
            </button>

            {/* Sound Toggle */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Sound Notifications
              </span>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => {
                  setSoundEnabled(e.target.checked);
                  localStorage.setItem(
                    "sound_enabled",
                    String(e.target.checked)
                  );
                }}
              />
            </div>

            {/* View All */}
            <a
              href="/admin"
              className="block text-center mt-3 py-2 bg-indigo-600 
                        text-white rounded-lg hover:bg-indigo-500
                        transition text-sm"
            >
              View All Submissions
            </a>
          </div>
        )}
      </div>
    </>
  );
}
