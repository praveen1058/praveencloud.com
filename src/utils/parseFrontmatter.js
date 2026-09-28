// Minimal YAML front-matter reader — deliberately not a full YAML parser, just the
// subset blog posts use: scalars, quoted scalars, block lists and inline [a, b] lists.
// The same subset is implemented in public/api/blog.php for the server side; keep the
// two in step if the format grows.

const LIST_KEYS = new Set(["tags", "keywords"]);

function unquote(value) {
  const trimmed = value.trim();
  if (trimmed.length > 1 && /^(".*"|'.*')$/s.test(trimmed)) return trimmed.slice(1, -1);
  return trimmed;
}

export function parseFrontmatter(raw) {
  const match = String(raw || "").match(/^﻿?---\s*?\r?\n([\s\S]*?)\r?\n---\s*?(?:\r?\n([\s\S]*))?$/);
  if (!match) return { data: {}, content: String(raw || "") };

  const data = {};
  const lines = match[1].split(/\r?\n/);
  let listKey = null;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) continue;

    // A "- item" line continues whichever list key was opened above it.
    const item = line.match(/^\s+-\s*(.+)$/);
    if (listKey && item) {
      data[listKey].push(unquote(item[1]));
      continue;
    }

    const pair = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!pair) continue;

    const [, key, rest] = pair;
    const value = rest.trim();

    if (!value) {
      // "tags:" with the values on following lines.
      listKey = key;
      data[key] = [];
      continue;
    }

    listKey = null;

    // "tags: [AWS, EC2]" on a single line.
    const inline = value.match(/^\[(.*)\]$/s);
    if (inline) {
      data[key] = inline[1].split(",").map(unquote).filter(Boolean);
      continue;
    }

    data[key] = LIST_KEYS.has(key) ? [unquote(value)] : unquote(value);
  }

  // Drop list keys that were opened but never filled, so `tags` is absent rather than [].
  for (const key of Object.keys(data)) {
    if (Array.isArray(data[key]) && data[key].length === 0) delete data[key];
  }

  return { data, content: (match[2] || "").trim() };
}
