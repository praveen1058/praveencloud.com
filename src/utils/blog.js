import { parseFrontmatter } from "./parseFrontmatter";

// Where the post index comes from, in order of preference:
//   1. /api/blog.php  — scans blog/ per request, so an uploaded .md is live immediately.
//                       Vite's dev server answers the same URL with the same JSON.
//   2. /blog/index.json — a build-time snapshot, emitted by the Vite plugin. Only used
//                       if PHP is unavailable on the host; it will not see new uploads.
const INDEX_SOURCES = ["/api/blog.php", "/blog/index.json"];

let indexPromise = null;

async function fetchIndex() {
  for (const url of INDEX_SOURCES) {
    try {
      const response = await fetch(url, { headers: { Accept: "application/json" } });
      if (!response.ok) continue;

      // A misconfigured host can answer with the SPA shell instead of a 404, which
      // would otherwise blow up as a JSON parse error further down.
      const type = response.headers.get("content-type") || "";
      if (!type.includes("json")) continue;

      const payload = await response.json();
      const posts = Array.isArray(payload) ? payload : payload.posts;
      if (Array.isArray(posts)) return posts;
    } catch {
      // Try the next source.
    }
  }
  return [];
}

/** Every post, newest first. Fetched once per page load and shared by all the views. */
export function loadBlogIndex({ force = false } = {}) {
  if (force || !indexPromise) {
    indexPromise = fetchIndex().catch(() => []);
  }
  return indexPromise;
}

export async function findPost(category, slug) {
  const posts = await loadBlogIndex();
  return posts.find(p => p.slug === slug && (!category || p.category === category)) || null;
}

/** Fetches the markdown body for a post and returns everything after the front matter. */
export async function loadBlogContent(file) {
  const path = String(file)
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  const response = await fetch(`/blog/${path}`);
  if (!response.ok) throw new Error(`Failed to load ${file}`);

  const { content } = parseFrontmatter(await response.text());
  return content;
}

const searchable = post =>
  [post.title, post.description, post.categoryLabel, post.category, ...(post.tags || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

/** Case-insensitive AND search across title, description, category and tags. */
export function searchPosts(posts, query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return posts;
  return posts.filter(post => {
    const haystack = searchable(post);
    return terms.every(term => haystack.includes(term));
  });
}

/**
 * Posts related to `post`, best match first: same category outranks a shared tag, and
 * more shared tags outranks fewer.
 */
export function relatedPosts(posts, post, limit = 3) {
  if (!post) return [];
  const tags = new Set(post.tags || []);

  return posts
    .filter(other => other.url !== post.url)
    .map(other => {
      const shared = (other.tags || []).filter(tag => tags.has(tag)).length;
      const score = (other.category === post.category ? 3 : 0) + shared;
      return { post: other, score };
    })
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map(entry => entry.post);
}
