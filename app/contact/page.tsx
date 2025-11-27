"use client";

import { useEffect, useState } from "react";
import ContactForm from "../components/contact";

type ContactContent = {
  title: string;
  body: string;
};

export default function ContactPage() {
  const [content, setContent] = useState<ContactContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/content/contact", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load contact content");
        const data = (await res.json()) as ContactContent;
        setContent(data);
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? "Failed to load contact content");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const title = content?.title ?? "Contact";
  const body =
    content?.body ??
    "Have a question, idea, or collaboration in mind? Use the form below to reach out.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 font-sans px-4">
      <div className="w-full max-w-4xl py-16">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
            {title}
          </h1>

          {loading ? (
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Loading contact content…
            </p>
          ) : error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : (
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto">
              {body}
            </p>
          )}
        </div>

        {/* Contact Form */}
        <div className="mt-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
