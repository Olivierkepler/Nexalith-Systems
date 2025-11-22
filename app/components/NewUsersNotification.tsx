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
        <div
        className="absolute right-0 mt-3 w-80 backdrop-blur-sm bg-white/80
                   border border-gray-200 shadow-lg rounded-xl z-20 
                   animate-scale-fade"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700">Recent Submissions</h3>
          <p className="text-xs text-gray-400">Latest 5 new users</p>
        </div>
      
        {/* Body */}
        <div className="max-h-64 overflow-y-auto">
          {!entries.length ? (
            <p className="text-xs text-gray-500 p-4 text-center">
              No submissions yet
            </p>
          ) : (
            entries.slice(0, 5).map((entry: any, i: number) => (
              <div
                key={i}
                className={`flex items-start gap-3 px-4 py-3 border-b border-gray-100 last:border-none
                  ${i === 0 && unread ? "bg-yellow-50/60" : "hover:bg-gray-50/70 transition"}
                `}
              >
                {/* Avatar */}
                <div
                  className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center 
                             justify-center text-xs font-semibold shadow-sm"
                >
                  {entry.name.charAt(0).toUpperCase()}
                </div>
      
                {/* Info */}
                <div>
                  <p className="font-medium text-gray-900 text-sm">{entry.name}</p>
                  <p className="text-xs text-gray-500">{entry.email}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{entry.timestamp}</p>
                </div>
              </div>
            ))
          )}
        </div>
      
        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 space-y-3">
          {/* Mark all read */}
          <button
            onClick={markAsRead}
            className="w-full text-sm py-2 rounded-lg border border-gray-200 
                      hover:bg-gray-100 transition font-medium text-gray-700"
          >
            Mark all as read
          </button>
      
          {/* Sound Toggle */}
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>Sound Notifications</span>
      
            {/* Modern Switch */}
            <button
              onClick={() => {
                const enabled = !soundEnabled;
                setSoundEnabled(enabled);
                localStorage.setItem("sound_enabled", String(enabled));
              }}
              className={`relative inline-flex h-5 w-10 items-center rounded-full transition
              ${soundEnabled ? "bg-gray-700" : "bg-gray-300"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition
                ${soundEnabled ? "translate-x-5" : "translate-x-1"}`}
              />
            </button>
          </div>
      
          {/* View All */}
          <a
            href="/admin"
            className="block text-center py-2 border border-gray-200 text-gray-700 
                       rounded-lg text-sm font-semibold hover:bg-gray-100
                       transition shadow-sm"
          >
            View All Submissions
          </a>
        </div>
      </div>
      
        )}
      </div>
    </>
  );
}
