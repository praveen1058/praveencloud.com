// Node-side blog scanner. This is the development / build-time twin of
// public/api/blog.php: both walk blog/<category>/<slug>.md and produce the same JSON
// shape, so the front end talks to one contract regardless of where it is running.
import fs from "node:fs";
import path from "node:path";

import { parseFrontmatter } from "../src/utils/parseFrontmatter.js";

export const SITE_URL = "https://praveencloud.com";

// Posts live in public/ so that Vite copies them into dist/ untouched — the folder the
// user uploads to on Hostinger is byte-for-byte the folder in this repo.
export const blogDir = () => path.resolve(process.cwd(), "public/blog");

const WORDS_PER_MINUTE = 200;

function readingTimeFor(content) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min`;
}

function toArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function titleCase(slug) {
  return String(slug)
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// A leading underscore or dot marks a file or folder as not published — that is how a
// draft is parked next to finished posts, and how notes like _README.md stay private.
const isHidden = name => name.startsWith("_") || name.startsWith(".");

const isPost = name => name.toLowerCase().endsWith(".md") && !isHidden(name);

/**
 * Walks blog/<category>/<slug>.md, one level deep. Files dropped directly in blog/
 * are still picked up and treated as uncategorised rather than silently ignored.
 */
export function scanPosts() {
  const root = blogDir();
  if (!fs.existsSync(root)) return [];

  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (isHidden(entry.name)) continue;
      for (const child of fs.readdirSync(path.join(root, entry.name), { withFileTypes: true })) {
        if (child.isFile() && isPost(child.name)) {
          files.push({ category: entry.name, name: child.name });
        }
      }
    } else if (entry.isFile() && isPost(entry.name)) {
      files.push({ category: "", name: entry.name });
    }
  }

  const posts = files.map(({ category, name }) => {
    const relative = category ? `${category}/${name}` : name;
    const full = path.join(root, relative);
    const raw = fs.readFileSync(full, "utf8");
    const { data, content } = parseFrontmatter(raw);
    const slug = name.replace(/\.md$/i, "");
    const modifiedAt = new Date(fs.statSync(full).mtimeMs).toISOString();

    return {
      slug,
      category,
      // The folder is the category; a `category:` in front matter only overrides the
      // label that gets displayed.
      categoryLabel: data.category || titleCase(category) || "Uncategorised",
      file: relative,
      url: category ? `/blog/${category}/${slug}` : `/blog/${slug}`,
      title: data.title || titleCase(slug),
      description: data.description || "",
      // `image` is the documented field; `cover` is what the existing posts use.
      image: data.image || data.cover || "",
      author: data.author || "Praveen Kumar",
      date: (data.date || modifiedAt).slice(0, 10),
      tags: toArray(data.tags),
      readingTime: data.readingTime || readingTimeFor(content),
      modifiedAt,
    };
  });

  // Newest first, by the front-matter date, with the file's mtime breaking ties.
  return posts.sort(
    (a, b) => b.date.localeCompare(a.date) || b.modifiedAt.localeCompare(a.modifiedAt)
  );
}

function xmlEscape(value) {
  return String(value).replace(/[<>&'"]/g, c =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]
  );
}

function urlEntry(loc, lastmod, changefreq, priority) {
  return [
    "  <url>",
    `    <loc>${xmlEscape(SITE_URL + loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : "",
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

export function renderSitemap(posts) {
  const newest = posts[0]?.modifiedAt || new Date().toISOString();
  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))].sort();

  const staticPages = [
    ["/", "weekly", "1.0"],
    ["/about", "monthly", "0.7"],
    ["/projects", "monthly", "0.8"],
    ["/blog", "daily", "0.9"],
    ["/contact", "monthly", "0.5"],
    ["/privacy-policy", "yearly", "0.3"],
    ["/terms-and-conditions", "yearly", "0.3"],
    ["/disclaimer", "yearly", "0.3"],
  ];

  const entries = [
    ...staticPages.map(([loc, freq, priority]) =>
      urlEntry(loc, loc === "/blog" ? newest : "", freq, priority)
    ),
    ...categories.map(category => {
      const latest = posts.find(p => p.category === category)?.modifiedAt;
      return urlEntry(`/blog/${category}`, latest, "weekly", "0.7");
    }),
    ...posts.map(post => urlEntry(post.url, post.modifiedAt, "monthly", "0.8")),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;
}
