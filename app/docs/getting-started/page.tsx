export default function GettingStarted() {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold mb-6">Getting Started</h1>
  
        <p className="text-gray-700 leading-relaxed text-lg">
          This guide will help you get familiar with the structure and workflow of 
          the Nexalith project. Whether you're building pages, integrating search, 
          or expanding features, this is the place to start.
        </p>
  
        <h2 className="text-2xl font-semibold mt-10 mb-4">Project Overview</h2>
        <p className="text-gray-700 leading-relaxed">
          Nexalith uses a clean architecture built around the App Router, 
          TypeScript, TailwindCSS, and a custom search indexing system powered by 
          your own scripts.
        </p>
  
        <h2 className="text-2xl font-semibold mt-10 mb-4">Next Steps</h2>
        <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
          <li>Create more pages to expand the searchable content.</li>
          <li>Add metadata or tags to enhance search relevance.</li>
          <li>Integrate components and layout elements for consistency.</li>
        </ul>
      </div>
    );
  }
  