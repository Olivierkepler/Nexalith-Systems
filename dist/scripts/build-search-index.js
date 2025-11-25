"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Pages to index.
 * Each entry specifies a slug and a file in /app.
 *
 * Add new pages here if needed.
 */
const pages = [
    {
        slug: "/",
        file: path_1.default.join(process.cwd(), "app", "page.tsx"),
        title: "Home"
    },
    {
        slug: "/about",
        file: path_1.default.join(process.cwd(), "app", "about", "page.tsx"),
        title: "About"
    },
    {
        slug: "/contact",
        file: path_1.default.join(process.cwd(), "app", "contact", "page.tsx"),
        title: "Contact"
    },
    {
        slug: "/docs",
        file: path_1.default.join(process.cwd(), "app", "docs", "page.tsx"),
        title: "Docs"
    },
    {
        slug: "/docs/getting-started",
        file: path_1.default.join(process.cwd(), "app", "docs", "getting-started", "page.tsx"),
        title: "Getting Started"
    }
];
/**
 * Extract readable text from your TSX page.
 * Very simple but effective method for indexing content.
 */
const extractText = (fileContent) => {
    // Remove JSX tags
    let text = fileContent.replace(/<[^>]+>/g, " ");
    // Remove imports/exports
    text = text.replace(/import .+\n/g, "");
    text = text.replace(/export .+\n/g, "");
    // Remove curly braces
    text = text.replace(/{|}/g, " ");
    // Collapse whitespace
    text = text.replace(/\s+/g, " ").trim();
    return text;
};
const buildSearchIndex = () => {
    const index = [];
    pages.forEach(({ slug, file, title }) => {
        if (!fs_1.default.existsSync(file)) {
            console.warn(`⚠️ Skipped missing file: ${file}`);
            return;
        }
        const raw = fs_1.default.readFileSync(file, "utf-8");
        const text = extractText(raw);
        index.push({
            title,
            slug,
            content: text
        });
    });
    // Write into PUBLIC folder where frontend can load it
    const outputPath = path_1.default.join(process.cwd(), "public", "search-index.json");
    fs_1.default.writeFileSync(outputPath, JSON.stringify(index, null, 2));
    console.log("✅ Search index generated successfully.");
};
buildSearchIndex();
