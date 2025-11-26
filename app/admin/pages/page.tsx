"use client";

import { useEffect, useState } from "react";

type HomeContent = {
  hero: { title: string; subtitle: string };
  features: { title: string; text: string }[];
  centerpiece: { title: string; text: string };
  grid: { title: string; text: string }[];
  footer: { text: string };
};

export default function AdminPage() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load content from API
  useEffect(() => {
    fetch("/api/content/home")
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => {
        console.error(err);
        setMessage("Failed to load content");
      });
  }, []);

  const updateHero = (field: "title" | "subtitle", value: string) => {
    if (!content) return;
    setContent({
      ...content,
      hero: {
        ...content.hero,
        [field]: value,
      },
    });
  };

  const updateFooter = (value: string) => {
    if (!content) return;
    setContent({
      ...content,
      footer: {
        text: value,
      },
    });
  };

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/content/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }

      setMessage("Saved successfully ✅");
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-100">
        <p className="text-sm text-zinc-600">Loading content…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-zinc-800 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </header>

        {message && (
          <div className="text-sm text-zinc-700 bg-zinc-100 border border-zinc-200 rounded-xl px-3 py-2">
            {message}
          </div>
        )}

        {/* Hero Section */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Hero</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Title
            </label>
            <input
              value={content.hero.title}
              onChange={(e) => updateHero("title", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Subtitle
            </label>
            <textarea
              value={content.hero.subtitle}
              onChange={(e) => updateHero("subtitle", e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm min-h-[80px]"
            />
          </div>
        </section>

        {/* Footer Section */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Footer</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-700">
              Footer Text
            </label>
            <input
              value={content.footer.text}
              onChange={(e) => updateFooter(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
        </section>

        {/* You can extend this pattern for features, grid, centerpiece, etc. */}
      </div>
    </div>
  );
}
