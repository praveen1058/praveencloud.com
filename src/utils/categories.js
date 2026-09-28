// Category display metadata. The single source of truth is public/categories.json so
// that the PHP endpoints can read the same file at runtime; it is imported (not
// fetched) so it ends up in the bundle.
import categoriesFile from "../../public/categories.json";

export const CATEGORY_META = categoriesFile.categories || {};

// A folder under blog/ that has no entry in categories.json still works — this is what
// keeps "upload a new folder" from needing a code change.
export function categoryLabel(slug) {
  if (!slug) return "Uncategorised";
  const known = CATEGORY_META[slug];
  if (known?.label) return known.label;
  return String(slug)
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function categoryDescription(slug) {
  return (
    CATEGORY_META[slug]?.description ||
    `Articles, guides and practical notes on ${categoryLabel(slug)}.`
  );
}

export function categoryGroup(slug) {
  return CATEGORY_META[slug]?.group || "More";
}

// Categories that actually have posts, grouped for navigation. Driven by the posts on
// disk rather than the config, so an empty category never renders a dead link.
export function buildCategoryList(posts) {
  const counts = new Map();
  for (const post of posts) {
    if (!post.category) continue;
    counts.set(post.category, (counts.get(post.category) || 0) + 1);
  }

  return [...counts.entries()]
    .map(([slug, count]) => ({
      slug,
      count,
      label: categoryLabel(slug),
      group: categoryGroup(slug),
      description: categoryDescription(slug),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}
