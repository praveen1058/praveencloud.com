import { loadJSON } from "./api";
import { parseFrontmatter } from "./parseFrontmatter";

const INDEX_URL = "/content/blogs/index.json";

// Index entries carry only the frontmatter block, so `content` is empty here by design.
export async function loadBlogIndex() {
  const entries = await loadJSON(INDEX_URL, []);
  // Newest file first, by last-modified time on disk — falls back to the frontmatter
  // date for any entry served without a modifiedAt.
  return entries
    .map(entry => ({ slug: entry.slug, file: entry.file, modifiedAt: entry.modifiedAt, ...parseFrontmatter(entry.raw || "") }))
    .sort((a, b) => String(b.modifiedAt || b.data.date).localeCompare(String(a.modifiedAt || a.data.date)));
}

export async function loadBlogPost(file) {
  const response = await fetch(`/content/blogs/${encodeURIComponent(file)}`);
  if (!response.ok) throw new Error(`Failed to load ${file}`);
  return parseFrontmatter(await response.text());
}
