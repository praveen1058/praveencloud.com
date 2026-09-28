export function parseFrontmatter(raw) {
  const match = raw.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const data = {};
  match[1].split(/\r?\n/).forEach(line => {
    const m = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (m) data[m[1]] = m[2].replace(/^["']|["']$/g, "");
  });
  const tags = [];
  let inTags = false;
  match[1].split(/\r?\n/).forEach(line => {
    if (/^tags:\s*$/.test(line)) { inTags = true; return; }
    if (inTags && /^\s*-\s*/.test(line)) tags.push(line.replace(/^\s*-\s*/, "").trim());
    else if (inTags && /^\S/.test(line)) inTags = false;
  });
  if (tags.length) data.tags = tags;
  return { data, content: match[2].trim() };
}
