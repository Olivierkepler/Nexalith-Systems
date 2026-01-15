"use client";

import { useEffect, useMemo, useState } from "react";
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
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
import NewUsersNotification from "./components/NewUsersNotification";

type HomeContent = {
  hero: { title: string; subtitle: string };
  features: { title: string; text: string }[];
  centerpiece: { title: string; text: string };
  grid: { title: string; text: string }[];
};

type AboutContent = {
  title: string;
  description: string;
  secondary: string;
  vision: { title: string; text: string };
};

type ContactContent = {
  title: string;
  body: string;
};

type SubmissionEntry = {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  timestamp: string;
};

type TabKey = "home" | "about" | "contact" | "submissions";

export default function AdminDashboard() {
  // Tabs
  const [activeTab, setActiveTab] = useState<TabKey>("home");

  // Content states (from local files)
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [contactContent, setContactContent] = useState<ContactContent | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentSaving, setContentSaving] = useState(false);
  const [contentMessage, setContentMessage] = useState<string | null>(null);

  // Submissions states
  const [entries, setEntries] = useState<SubmissionEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(true);

  // Filters / search for submissions
  const [search, setSearch] = useState("");
  const [emailDomain, setEmailDomain] = useState("all");
  const [hasPhone, setHasPhone] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Sorting & pagination for submissions
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Edit state for a submission
  const [editingEntry, setEditingEntry] = useState<SubmissionEntry | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // ===== Load CMS content from local files =====
  useEffect(() => {
    const loadContent = async () => {
      try {
        const [homeRes, aboutRes, contactRes] = await Promise.all([
          fetch("/api/content/home").catch(() => null),
          fetch("/api/content/about").catch(() => null),
          fetch("/api/content/contact").catch(() => null),
        ]);

        if (homeRes && homeRes.ok) {
          setHomeContent(await homeRes.json());
        }
        if (aboutRes && aboutRes.ok) {
          setAboutContent(await aboutRes.json());
        }
        if (contactRes && contactRes.ok) {
          setContactContent(await contactRes.json());
        }
      } catch (err) {
        console.error("Failed to load CMS content:", err);
      } finally {
        setContentLoading(false);
      }
    };

    loadContent();
  }, []);

  // ===== Load submissions =====
  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/admin/submissions");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (err) {
      console.error("Failed to load entries:", err);
    } finally {
      setEntriesLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  // ===== Auth / Logout =====
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      window.location.href = "/";
    }
  };

  // ===== Helpers: Home Content =====
  const updateHomeHero = (key: "title" | "subtitle", value: string) => {
    if (!homeContent) return;
    setHomeContent({
      ...homeContent,
      hero: { ...homeContent.hero, [key]: value },
    });
  };

  const updateHomeFeature = (i: number, key: "title" | "text", value: string) => {
    if (!homeContent) return;
    const updated = [...homeContent.features];
    updated[i] = { ...updated[i], [key]: value };
    setHomeContent({ ...homeContent, features: updated });
  };

  const updateHomeCenterpiece = (key: "title" | "text", value: string) => {
    if (!homeContent) return;
    setHomeContent({
      ...homeContent,
      centerpiece: { ...homeContent.centerpiece, [key]: value },
    });
  };

  const updateHomeGrid = (i: number, key: "title" | "text", value: string) => {
    if (!homeContent) return;
    const updated = [...homeContent.grid];
    updated[i] = { ...updated[i], [key]: value };
    setHomeContent({ ...homeContent, grid: updated });
  };

  const saveHomeContent = async () => {
    if (!homeContent) return;
    setContentSaving(true);
    setContentMessage(null);
    try {
      const res = await fetch("/api/content/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(homeContent),
      });
      if (!res.ok) throw new Error("Failed to save home content");
      setContentMessage("Home content saved ✅");
    } catch (err: any) {
      console.error(err);
      setContentMessage(err.message || "Failed to save home content");
    } finally {
      setContentSaving(false);
    }
  };

  // ===== Helpers: About / Contact Content =====
  const updateAbout = (field: keyof AboutContent | "vision.title" | "vision.text", value: string) => {
    if (!aboutContent) return;
    if (field === "vision.title") {
      setAboutContent({ ...aboutContent, vision: { ...aboutContent.vision, title: value } });
    } else if (field === "vision.text") {
      setAboutContent({ ...aboutContent, vision: { ...aboutContent.vision, text: value } });
    } else {
      setAboutContent({ ...aboutContent, [field]: value } as AboutContent);
    }
  };

  const updateContact = (field: keyof ContactContent, value: string) => {
    if (!contactContent) return;
    setContactContent({ ...contactContent, [field]: value });
  };

  const saveAboutContent = async () => {
    if (!aboutContent) return;
    setContentSaving(true);
    setContentMessage(null);
    try {
      const res = await fetch("/api/content/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aboutContent),
      });
      if (!res.ok) throw new Error("Failed to save about content");
      setContentMessage("About content saved ✅");
    } catch (err: any) {
      console.error(err);
      setContentMessage(err.message || "Failed to save about content");
    } finally {
      setContentSaving(false);
    }
  };

  const saveContactContent = async () => {
    if (!contactContent) return;
    setContentSaving(true);
    setContentMessage(null);
    try {
      const res = await fetch("/api/content/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactContent),
      });
      if (!res.ok) throw new Error("Failed to save contact content");
      setContentMessage("Contact content saved ✅");
    } catch (err: any) {
      console.error(err);
      setContentMessage(err.message || "Failed to save contact content");
    } finally {
      setContentSaving(false);
    }
  };

  // ===== Submissions: edit / delete =====
  const handleEdit = (entry: SubmissionEntry) => {
    setEditingEntry(entry);
    setEditForm({
      name: entry.name,
      email: entry.email,
      phone: entry.phone,
      message: entry.message,
    });
  };

  const handleCancelEdit = () => setEditingEntry(null);

  const handleSaveEdit = async () => {
    if (!editingEntry) return;

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
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this entry?")) return;
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  // ===== Submissions: filtering, sorting, pagination =====
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

      if (emailDomain !== "all" && !entry.email.includes(emailDomain)) {
        return false;
      }

      if (hasPhone === "yes" && !entry.phone.trim()) return false;
      if (hasPhone === "no" && entry.phone.trim()) return false;

      const date = new Date(entry.timestamp);
      if (startDate && date < new Date(startDate)) return false;
      if (endDate && date > new Date(endDate)) return false;

      return true;
    });
  }, [entries, search, emailDomain, hasPhone, startDate, endDate]);

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

  const paginatedEntries = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedEntries.slice(start, start + pageSize);
  }, [sortedEntries, page, pageSize]);

  const totalPages = Math.ceil(sortedEntries.length / pageSize);

  // ===== CSV Export =====
  const exportCSV = () => {
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
  };

  // ===== UI Renders for each tab =====
  const renderHomeEditor = () => {
    if (contentLoading) {
      return <p className="text-sm text-gray-500">Loading home content…</p>;
    }
    if (!homeContent) {
      return (
        <p className="text-sm text-red-500">
          No <code>home.json</code> found. Ensure it exists in the content directory.
        </p>
      );
    }

    return (
      <div className="space-y-8">
        {/* Hero */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Hero Section</h2>
          <input
            className="w-full p-3 border rounded-xl"
            value={homeContent.hero.title}
            onChange={(e) => updateHomeHero("title", e.target.value)}
            placeholder="Hero title"
          />
          <textarea
            className="w-full p-3 border rounded-xl min-h-[80px]"
            value={homeContent.hero.subtitle}
            onChange={(e) => updateHomeHero("subtitle", e.target.value)}
            placeholder="Hero subtitle"
          />
        </section>

        {/* Features */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Feature Cards</h2>
          {homeContent.features.map((f, i) => (
            <div
              key={i}
              className="p-4 border rounded-xl bg-gray-50 space-y-2"
            >
              <input
                className="w-full p-2 border rounded-lg"
                value={f.title}
                onChange={(e) => updateHomeFeature(i, "title", e.target.value)}
                placeholder="Feature title"
              />
              <textarea
                className="w-full p-2 border rounded-lg min-h-[60px]"
                value={f.text}
                onChange={(e) => updateHomeFeature(i, "text", e.target.value)}
                placeholder="Feature text"
              />
            </div>
          ))}
        </section>

        {/* Centerpiece */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Centerpiece</h2>
          <input
            className="w-full p-3 border rounded-xl"
            value={homeContent.centerpiece.title}
            onChange={(e) => updateHomeCenterpiece("title", e.target.value)}
            placeholder="Centerpiece title"
          />
          <textarea
            className="w-full p-3 border rounded-xl min-h-[80px]"
            value={homeContent.centerpiece.text}
            onChange={(e) => updateHomeCenterpiece("text", e.target.value)}
            placeholder="Centerpiece text"
          />
        </section>

        {/* Grid */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Lower Grid Blocks</h2>
          {homeContent.grid.map((g, i) => (
            <div
              key={i}
              className="p-4 border rounded-xl bg-gray-50 space-y-2"
            >
              <input
                className="w-full p-2 border rounded-lg"
                value={g.title}
                onChange={(e) => updateHomeGrid(i, "title", e.target.value)}
                placeholder="Grid title"
              />
              <textarea
                className="w-full p-2 border rounded-lg min-h-[60px]"
                value={g.text}
                onChange={(e) => updateHomeGrid(i, "text", e.target.value)}
                placeholder="Grid text"
              />
            </div>
          ))}
        </section>

        <div className="flex justify-end">
          <button
            onClick={saveHomeContent}
            disabled={contentSaving}
            className="px-5 py-2 rounded-xl bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {contentSaving ? "Saving…" : "Save Home Content"}
          </button>
        </div>
      </div>
    );
  };

  const renderAboutEditor = () => {
    if (contentLoading) {
      return <p className="text-sm text-gray-500">Loading about content…</p>;
    }
    if (!aboutContent) {
      return (
        <p className="text-sm text-red-500">
          No <code>about.json</code> found. Ensure it exists in the content directory.
        </p>
      );
    }

    return (
      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">About Page Text</h2>
          <input
            className="w-full p-3 border rounded-xl"
            value={aboutContent.title}
            onChange={(e) => updateAbout("title", e.target.value)}
            placeholder="Page title"
          />
          <textarea
            className="w-full p-3 border rounded-xl min-h-[80px]"
            value={aboutContent.description}
            onChange={(e) => updateAbout("description", e.target.value)}
            placeholder="Main description"
          />
          <textarea
            className="w-full p-3 border rounded-xl min-h-[80px]"
            value={aboutContent.secondary}
            onChange={(e) => updateAbout("secondary", e.target.value)}
            placeholder="Secondary paragraph"
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Vision Section</h2>
          <input
            className="w-full p-3 border rounded-xl"
            value={aboutContent.vision.title}
            onChange={(e) => updateAbout("vision.title", e.target.value)}
            placeholder="Vision title"
          />
          <textarea
            className="w-full p-3 border rounded-xl min-h-[80px]"
            value={aboutContent.vision.text}
            onChange={(e) => updateAbout("vision.text", e.target.value)}
            placeholder="Vision text"
          />
        </section>

        <div className="flex justify-end">
          <button
            onClick={saveAboutContent}
            disabled={contentSaving}
            className="px-5 py-2 rounded-xl bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {contentSaving ? "Saving…" : "Save About Content"}
          </button>
        </div>
      </div>
    );
  };

  const renderContactEditor = () => {
    if (contentLoading) {
      return <p className="text-sm text-gray-500">Loading contact content…</p>;
    }
    if (!contactContent) {
      return (
        <p className="text-sm text-red-500">
          No <code>contact.json</code> found. Ensure it exists in the content directory.
        </p>
      );
    }

    return (
      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Contact Page Content</h2>
          <input
            className="w-full p-3 border rounded-xl"
            value={contactContent.title}
            onChange={(e) => updateContact("title", e.target.value)}
            placeholder="Contact title"
          />
          <textarea
            className="w-full p-3 border rounded-xl min-h-[100px]"
            value={contactContent.body}
            onChange={(e) => updateContact("body", e.target.value)}
            placeholder="Contact body text"
          />
        </section>

        <div className="flex justify-end">
          <button
            onClick={saveContactContent}
            disabled={contentSaving}
            className="px-5 py-2 rounded-xl bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
          >
            {contentSaving ? "Saving…" : "Save Contact Content"}
          </button>
        </div>
      </div>
    );
  };

  const renderSubmissions = () => (
    <>
      {/* Filters */}
      <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
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

        <div>
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center mb-2 gap-2 text-sm font-medium text-indigo-600 hover:underline focus:outline-none"
            aria-expanded={showFilters}
            aria-controls="admin-filters-row"
          >
            <span>Advanced Filters</span>
            <span
              className="transition-transform inline-block"
              style={{
                transform: showFilters ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </span>
          </button>
          {showFilters && (
            <div
              id="admin-filters-row"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
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

      <section className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        {entriesLoading ? (
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
                    <th className="p-2 sm:p-3 text-left hidden sm:table-cell">
                      Phone
                    </th>
                    <th className="p-2 sm:p-3 text-left">Message</th>
                    <th className="p-2 sm:p-3 text-left hidden md:table-cell">
                      Timestamp
                    </th>
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

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 text-xs sm:text-sm text-gray-600">
              <span className="order-2 sm:order-1">
                Showing{" "}
                <strong>
                  {(page - 1) * pageSize + 1}–
                  {Math.min(page * pageSize, sortedEntries.length)}
                </strong>{" "}
                of <strong>{sortedEntries.length}</strong>
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
    </>
  );

  // ===== MAIN RENDER =====
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
              Manage your site content and review form submissions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <NewUsersNotification />

            {activeTab === "submissions" && (
              <button
                onClick={exportCSV}
                className="inline-flex items-center justify-center cursor-pointer gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200 transition text-sm sm:text-base"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Tabs */}
        <nav className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          {[
            { key: "home", label: "Home Content" },
            { key: "about", label: "About Content" },
            { key: "contact", label: "Contact Content" },
            { key: "submissions", label: "Submissions" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`px-3 py-1.5 text-sm rounded-full border ${
                activeTab === tab.key
                  ? "bg-black text-white border-black"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content message */}
        {contentMessage && activeTab !== "submissions" && (
          <div className="text-xs sm:text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            {contentMessage}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "home" && (
          <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 sm:p-6">
            {renderHomeEditor()}
          </section>
        )}

        {activeTab === "about" && (
          <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 sm:p-6">
            {renderAboutEditor()}
          </section>
        )}

        {activeTab === "contact" && (
          <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 sm:p-6">
            {renderContactEditor()}
          </section>
        )}

        {activeTab === "submissions" && renderSubmissions()}
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
