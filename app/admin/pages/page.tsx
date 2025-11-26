"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load home content from API (which loads Gist)
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/content/home");
        const data = await res.json();
        setContent(data);
      } catch (err) {
        console.error("Error loading content:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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
        throw new Error("Failed to save changes.");
      }

      setMessage("Content saved successfully!");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* =======================
      Update Helpers
  ======================== */

  const updateHero = (key: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      hero: { ...prev.hero, [key]: value },
    }));
  };

  const updateCenterpiece = (key: string, value: string) => {
    setContent((prev: any) => ({
      ...prev,
      centerpiece: { ...prev.centerpiece, [key]: value },
    }));
  };

  const updateFooter = (value: string) => {
    setContent((prev: any) => ({
      ...prev,
      footer: { text: value },
    }));
  };

  const updateFeature = (index: number, key: string, value: string) => {
    setContent((prev: any) => {
      const updated = [...prev.features];
      updated[index][key] = value;
      return { ...prev, features: updated };
    });
  };

  const updateGrid = (index: number, key: string, value: string) => {
    setContent((prev: any) => {
      const updated = [...prev.grid];
      updated[index][key] = value;
      return { ...prev, grid: updated };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-600">
        Loading content…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-10">

        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin — Home Editor</h1>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-black text-white rounded-xl hover:bg-zinc-800 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </header>

        {message && (
          <div className="p-3 bg-zinc-100 border border-zinc-300 rounded-xl text-sm">
            {message}
          </div>
        )}

        {/* ========================
              HERO SECTION
        ========================= */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Hero Section</h2>

          <input
            className="w-full p-3 border rounded-xl"
            value={content.hero.title}
            onChange={(e) => updateHero("title", e.target.value)}
            placeholder="Hero Title"
          />

          <textarea
            className="w-full p-3 border rounded-xl"
            value={content.hero.subtitle}
            onChange={(e) => updateHero("subtitle", e.target.value)}
            placeholder="Hero Subtitle"
            rows={3}
          />
        </section>

        {/* ========================
              FEATURES SECTION
        ========================= */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Features</h2>

          {content.features.map((f: any, i: number) => (
            <div key={i} className="p-4 bg-zinc-50 rounded-xl border space-y-2">
              <input
                className="w-full p-2 border rounded-xl"
                value={f.title}
                onChange={(e) => updateFeature(i, "title", e.target.value)}
                placeholder="Feature Title"
              />
              <textarea
                className="w-full p-2 border rounded-xl"
                value={f.text}
                onChange={(e) => updateFeature(i, "text", e.target.value)}
                placeholder="Feature Text"
                rows={2}
              />
            </div>
          ))}
        </section>

        {/* ========================
           CENTERPIECE SECTION
        ========================= */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Centerpiece</h2>

          <input
            className="w-full p-3 border rounded-xl"
            value={content.centerpiece.title}
            onChange={(e) => updateCenterpiece("title", e.target.value)}
            placeholder="Centerpiece Title"
          />

          <textarea
            className="w-full p-3 border rounded-xl"
            value={content.centerpiece.text}
            onChange={(e) => updateCenterpiece("text", e.target.value)}
            placeholder="Centerpiece Text"
            rows={3}
          />
        </section>

        {/* ========================
             GRID BLOCKS
        ========================= */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Grid Blocks</h2>

          {content.grid.map((g: any, i: number) => (
            <div key={i} className="p-4 bg-zinc-50 rounded-xl border space-y-2">
              <input
                className="w-full p-2 border rounded-xl"
                value={g.title}
                onChange={(e) => updateGrid(i, "title", e.target.value)}
                placeholder="Grid Title"
              />
              <textarea
                className="w-full p-2 border rounded-xl"
                value={g.text}
                onChange={(e) => updateGrid(i, "text", e.target.value)}
                placeholder="Grid Text"
                rows={2}
              />
            </div>
          ))}
        </section>

        {/* ========================
              FOOTER TEXT
        ========================= */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Footer</h2>

          <input
            className="w-full p-3 border rounded-xl"
            value={content.footer.text}
            onChange={(e) => updateFooter(e.target.value)}
            placeholder="Footer Text"
          />
        </section>

      </div>
    </div>
  );
}
