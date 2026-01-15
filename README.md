This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Technology Stack

### Core Framework
- **Next.js 16.0.3** - React framework for production with server-side rendering, static site generation, and API routes
- **React 19.2.0** - JavaScript library for building user interfaces
- **React DOM 19.2.0** - React renderer for web browsers
- **TypeScript 5.9.3** - Typed superset of JavaScript that compiles to plain JavaScript

### 3D Graphics & Animation
- **Three.js 0.181.2** - JavaScript 3D library for creating and displaying animated 3D computer graphics
- **@react-three/fiber 9.4.0** - React renderer for Three.js, allowing declarative 3D scene composition
- **@react-three/drei 10.7.7** - Useful helpers and abstractions for react-three-fiber
- **@react-three/postprocessing 3.0.4** - Post-processing effects library for react-three-fiber
- **postprocessing 6.38.0** - Post-processing library for Three.js providing various visual effects
- **framer-motion 12.23.24** - Production-ready motion library for React, enabling smooth animations and transitions

### Authentication & Security
- **next-auth 4.24.13** - Complete open-source authentication solution for Next.js applications

### Search & Data Processing
- **fuse.js 7.1.0** - Lightweight fuzzy-search library for JavaScript, providing powerful search capabilities

### Content & Markdown
- **react-markdown 10.1.0** - React component for rendering markdown
- **remark-gfm 4.0.1** - Plugin to support GitHub Flavored Markdown (tables, strikethrough, tasklists, etc.)
- **rehype-highlight 7.0.2** - Rehype plugin to highlight code blocks with highlight.js
- **highlight.js 11.11.1** - Syntax highlighting library for code blocks

### PDF Generation
- **jspdf 3.0.4** - Client-side JavaScript PDF generation library
- **jspdf-autotable 5.0.2** - Plugin for jsPDF to generate tables in PDF documents

### APIs & External Services
- **openai 6.9.1** - Official OpenAI Node.js library for interacting with OpenAI's API (GPT models, embeddings, etc.)
- **googleapis 166.0.0** - Google APIs Node.js client library for accessing various Google services

### UI Components & Icons
- **lucide-react 0.554.0** - Beautiful & consistent icon toolkit for React applications

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework for rapid UI development
- **@tailwindcss/postcss 4** - PostCSS plugin for Tailwind CSS

### Development Tools
- **ESLint 9** - Pluggable JavaScript linter for identifying and fixing code problems
- **eslint-config-next 16.0.3** - ESLint configuration for Next.js projects
- **ts-node 10.9.2** - TypeScript execution engine for Node.js, allowing direct execution of TypeScript files
- **@types/node 20** - TypeScript type definitions for Node.js
- **@types/react 19** - TypeScript type definitions for React
- **@types/react-dom 19** - TypeScript type definitions for React DOM

## GitHub Gist Integration

This project integrates with GitHub Gist API for storing and retrieving JSON data. The following technologies are used:

### GitHub Gist Technologies
- **GitHub Gist REST API** - Used to read and update JSON files stored in a GitHub Gist
  - Endpoint: `https://api.github.com/gists/{GIST_ID}`
  - Authentication: Bearer token authentication using GitHub Personal Access Token
  - Methods: GET (read files) and PATCH (update files)
  - Accept Header: `application/vnd.github+json` (GitHub API v3/v4 JSON format)

### Implementation Details
- **Native Fetch API** - Used for making HTTP requests to GitHub Gist API (no additional HTTP client library needed)
- **JSON Parsing/Stringification** - Native JavaScript JSON methods for parsing and serializing data
- **Environment Variables**:
  - `GIST_ID` - The ID of the GitHub Gist containing the data files
  - `GITHUB_GIST_TOKEN` - GitHub Personal Access Token with gist permissions

The Gist integration is implemented in `lib/gist.ts` and provides functions to:
- Read JSON files from a configured Gist
- Update or create JSON files in a configured Gist

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

