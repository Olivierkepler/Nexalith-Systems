"use client";

import { useEffect, useState, useMemo } from "react";
import { signOut } from "next-auth/react";
import {
  Search,

  Download,
  Edit3,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import NewUsersNotification from "../components/NewUsersNotification";

export default function AdminDashboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  // Search + Filters
  const [search, setSearch] = useState("");
  const [emailDomain, setEmailDomain] = useState("all");
  const [hasPhone, setHasPhone] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Sorting
  const [sortBy, setSortBy] = useState("newest");

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Edit state
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Fetch entries
  async function fetchEntries() {
    try {
      const res = await fetch("/api/admin/submissions");
      const data = await res.json();
      setEntries(data.entries);
    } catch (err) {
      console.error("Failed to load entries:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  // 🔓 Logout (middleware auth)
  async function handleLogout() {
    try {
      // Sign out from NextAuth
      await signOut({ redirect: false });
      // Clear the admin_auth cookie
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      // Redirect to home page
      window.location.href = "/";
    }
  }

  // Edit
  function handleEdit(entry: any) {
    setEditingEntry(entry);
    setEditForm({
      name: entry.name,
      email: entry.email,
      phone: entry.phone,
      message: entry.message,
    });
  }

  function handleCancelEdit() {
    setEditingEntry(null);
  }

  async function handleSaveEdit() {
    const res = await fetch(`/api/admin/submissions/${editingEntry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });

    if (res.ok) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingEntry.id ? { ...e, ...editForm } : e
        )
      );
      handleCancelEdit();
    }
  }

  // Delete
  async function handleDelete(id: number) {
    if (!confirm("Delete this entry?")) return;

    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  }

  // CSV Export
  function exportCSV() {
    const headers = ["Name", "Email", "Phone", "Message", "Timestamp"];

    const rows = sortedEntries.map((e) => [
      e.name,
      e.email,
      e.phone,
      `"${e.message.replace(/"/g, '""')}"`,
      e.timestamp,
    ]);

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "submissions.csv";
    a.click();
  }

  // Filtering
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const text = search.toLowerCase();

      const matches =
        entry.name.toLowerCase().includes(text) ||
        entry.email.toLowerCase().includes(text) ||
        entry.phone.toLowerCase().includes(text) ||
        entry.message.toLowerCase().includes(text) ||
        entry.timestamp.toLowerCase().includes(text);

      if (!matches) return false;

      if (emailDomain !== "all") {
        if (!entry.email.includes(emailDomain)) return false;
      }

      if (hasPhone === "yes" && !entry.phone.trim()) return false;
      if (hasPhone === "no" && entry.phone.trim()) return false;

      const date = new Date(entry.timestamp);
      if (startDate && date < new Date(startDate)) return false;
      if (endDate && date > new Date(endDate)) return false;

      return true;
    });
  }, [entries, search, emailDomain, hasPhone, startDate, endDate]);

  // Sorting
  const sortedEntries = useMemo(() => {
    const list = [...filteredEntries];

    switch (sortBy) {
      case "newest":
        return list.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      case "oldest":
        return list.sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      case "domain":
        return list.sort((a, b) =>
          (a.email.split("@")[1] || "").localeCompare(
            b.email.split("@")[1] || ""
          )
        );
      default:
        return list;
    }
  }, [filteredEntries, sortBy]);

  // Pagination
  const paginatedEntries = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedEntries.slice(start, start + pageSize);
  }, [sortedEntries, page, pageSize]);

  const totalPages = Math.ceil(sortedEntries.length / pageSize);

  // UI
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Header */}
        <header className="flex pt-16 sm:pt-20 flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Review, filter, update, and export submissions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {/* 🔔 New Users Notification */}
  <NewUsersNotification />
            <button
              onClick={exportCSV}
              className="inline-flex items-center justify-center cursor-pointer gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200 transition text-sm sm:text-base"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">Export</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Filters Card */}
        <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm sm:text-base"
              placeholder="Search name, email, phone, message..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Filters Row */}
          {/* Collapsible Filters */}
          <div>
            <button
              type="button"
              onClick={() => setShowFilters((prev: any) => !prev)}
              className="flex items-center mb-2 gap-2 text-sm font-medium text-indigo-600 hover:underline focus:outline-none"
              aria-expanded={showFilters}
              aria-controls="admin-filters-row"
            >
              <span>Advanced Filters</span>
              <span className="transition-transform" style={{
                transform: showFilters ? "rotate(90deg)" : "rotate(0deg)",
                display: "inline-block",
                transition: "transform 0.2s"
              }}>
                <ChevronRight className="w-4 h-4" />
              </span>
            </button>
            {showFilters && (
              <div
                id="admin-filters-row"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {/* Email Domain */}
                <div>
                  <label className="block text-sm text-gray-500 mb-1 font-medium">
                    Email Domain
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500"
                    value={emailDomain}
                    onChange={(e) => {
                      setEmailDomain(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="gmail.com">gmail.com</option>
                    <option value="outlook.com">outlook.com</option>
                    <option value="yahoo.com">yahoo.com</option>
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm text-gray-500 mb-1 font-medium">
                    Phone Provided
                  </label>
                  <select
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-indigo-500"
                    value={hasPhone}
                    onChange={(e) => {
                      setHasPhone(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="yes">With Phone</option>
                    <option value="no">No Phone</option>
                  </select>
                </div>

                {/* Date */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm text-gray-500 mb-1 font-medium">
                    Date Range
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="date"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-800 text-sm sm:text-base"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setPage(1);
                      }}
                    />
                    <input
                      type="date"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white text-gray-800 text-sm sm:text-base"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-sm text-gray-500 mb-1 font-medium">
                    Summary
                  </label>
                  <div className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Visible</span>
                      <span className="font-semibold">{sortedEntries.length}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Page</span>
                      <span className="font-semibold">
                        {page} / {totalPages || 1}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading...</div>
          ) : sortedEntries.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No matching entries.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-xs sm:text-sm min-w-[640px]">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase">
                    <tr>
                      <th className="p-2 sm:p-3 text-left">Name</th>
                      <th className="p-2 sm:p-3 text-left">Email</th>
                      <th className="p-2 sm:p-3 text-left hidden sm:table-cell">Phone</th>
                      <th className="p-2 sm:p-3 text-left">Message</th>
                      <th className="p-2 sm:p-3 text-left hidden md:table-cell">Timestamp</th>
                      <th className="p-2 sm:p-3 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedEntries.map((entry, i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >
                        <td className="p-2 sm:p-3 font-medium">{entry.name}</td>
                        <td className="p-2 sm:p-3 break-words">{entry.email}</td>
                        <td className="p-2 sm:p-3 hidden sm:table-cell">
                          {entry.phone || (
                            <span className="text-gray-400 italic">none</span>
                          )}
                        </td>
                        <td className="p-2 sm:p-3 max-w-[200px] sm:max-w-xs">
                          <div className="truncate" title={entry.message}>
                            {entry.message}
                          </div>
                        </td>
                        <td className="p-2 sm:p-3 text-gray-500 hidden md:table-cell text-xs">
                          {entry.timestamp}
                        </td>

                        <td className="p-2 sm:p-3">
                          <div className="flex justify-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handleEdit(entry)}
                              className="px-1.5 sm:px-2 py-1 cursor-pointer text-xs flex items-center gap-1 text-gray-600 border border-gray-200 rounded hover:bg-gray-200 transition"
                              aria-label="Edit entry"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={() => handleDelete(entry.id)}
                              className="px-1.5 sm:px-2 py-1 text-xs cursor-pointer flex items-center gap-1 border border-gray-200 rounded hover:bg-gray-200 transition"
                              aria-label="Delete entry"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 text-xs sm:text-sm text-gray-600">
                <span className="order-2 sm:order-1">
                  Showing{" "}
                  <strong>
                    {(page - 1) * pageSize + 1}–
                    {Math.min(page * pageSize, sortedEntries.length)}
                  </strong>{" "}
                  of{" "}
                  <strong>{sortedEntries.length}</strong>
                </span>

                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="min-w-[60px] text-center">
                    {page} / {totalPages || 1}
                  </span>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Edit Modal */}
      {editingEntry && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 w-full max-w-md border border-gray-200 relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
              onClick={handleCancelEdit}
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2 pr-8">
              <Edit3 className="h-5 w-5 text-indigo-500" />
              Edit Entry
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Name
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Phone
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Message
                </label>
                <textarea
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 min-h-[80px] focus:ring-2 focus:ring-indigo-500"
                  value={editForm.message}
                  onChange={(e) =>
                    setEditForm({ ...editForm, message: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 text-sm sm:text-base"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
