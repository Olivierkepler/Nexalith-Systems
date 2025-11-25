import Link from "next/link";

export default function DocsHome() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold mb-6">Documentation</h1>

      <p className="text-gray-700 leading-relaxed mb-8">
        Welcome to the Nexalith documentation. Start here to understand the 
        project, its features, and how to work with the system.
      </p>

      <div className="space-y-4">
        <Link 
          href="/docs/getting-started"
          className="block p-5 rounded-2xl bg-white shadow hover:shadow-md border transition"
        >
          <h2 className="text-xl font-semibold mb-1">Getting Started</h2>
          <p className="text-gray-600 text-sm">
            Learn how to begin working with Nexalith and explore its core structure.
          </p>
        </Link>
      </div>
    </div>
  );
}
