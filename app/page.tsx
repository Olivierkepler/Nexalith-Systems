"use client";

import Chatbot from "./components/Chatbot";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black font-sans p-4">
      <div className="w-full mt-20 max-w-7xl flex flex-col gap-8">
        {/* Header Section */}
        {/* <header className="w-full h-20 rounded-2xl bg-white dark:bg-zinc-900 shadow" /> */}

        {/* Hero Section */}
        <section className="w-full h-96 rounded-2xl bg-white dark:bg-zinc-900 shadow" />

        {/* Feature Grid Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-48 rounded-2xl bg-white dark:bg-zinc-900 shadow" />
          <div className="h-48 rounded-2xl bg-white dark:bg-zinc-900 shadow" />
          <div className="h-48 rounded-2xl bg-white dark:bg-zinc-900 shadow" />
        </section>

        {/* Wide Centerpiece Section */}
        <section className="w-full h-80 rounded-2xl bg-white dark:bg-zinc-900 shadow" />

        {/* Additional Grid Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 rounded-2xl bg-white dark:bg-zinc-900 shadow" />
          <div className="h-64 rounded-2xl bg-white dark:bg-zinc-900 shadow" />
        </section>

         {/* ✅ Floating Chatbot Widget */}
      <div className="fixed bottom-0 right-6 z-50">
        <Chatbot />
      </div>


        {/* Footer Section */}
        <footer className="w-full h-24 rounded-2xl bg-white dark:bg-zinc-900 shadow" />
      </div>
    </div>
  );
}
