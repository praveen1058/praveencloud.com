import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// Blog posts are read at runtime, not bundled: the client fetches an index of
// content/blogs/*.md and then the .md file itself. The index is rebuilt from disk on
// every request in dev, so adding or editing a post shows up on reload — no restart.
const BLOG_DIR = () => path.resolve(process.cwd(), "content/blogs");
const BLOG_INDEX_URL = "/content/blogs/index.json";

function readBlogIndex() {
  const dir = BLOG_DIR();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const full = path.join(dir, file);
      const raw = fs.readFileSync(full, "utf8");
      // Only the frontmatter block travels in the index — the listing page needs the
      // metadata, and the body is fetched on demand by the article page.
      const frontmatter = raw.match(/^---\s*[\s\S]*?\s*---/);
      // Posts are ordered by file modification time, newest first.
      const modifiedAt = new Date(fs.statSync(full).mtimeMs).toISOString();
      return { slug: file.replace(/\.md$/, ""), file, modifiedAt, raw: frontmatter ? frontmatter[0] : "" };
    })
    .sort((a, b) => b.modifiedAt.localeCompare(a.modifiedAt));
}

function blogContentPlugin() {
  const serveIndex = (server) => {
    server.middlewares.use((req, res, next) => {
      if (!req.url || req.url.split("?")[0] !== BLOG_INDEX_URL) return next();
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-cache");
      res.end(JSON.stringify(readBlogIndex()));
    });
  };

  return {
    name: "blog-content",
    configureServer: serveIndex,
    configurePreviewServer: serveIndex,
    generateBundle() {
      const dir = BLOG_DIR();
      const index = readBlogIndex();
      this.emitFile({ type: "asset", fileName: "content/blogs/index.json", source: JSON.stringify(index) });
      for (const entry of index) {
        this.emitFile({
          type: "asset",
          fileName: `content/blogs/${entry.file}`,
          source: fs.readFileSync(path.join(dir, entry.file))
        });
      }
    },
    handleHotUpdate({ file, server }) {
      if (file.includes(path.join("content", "blogs"))) {
        server.ws.send({ type: "full-reload" });
      }
    }
  };
}

// The JSON in content/ is fetched at runtime from "/content/*.json", but only public/
// is served statically. Rather than duplicating the files, serve content/ in dev and
// copy it into the build output — keeping content/ the single source of truth.
function contentAssetsPlugin() {
  const dir = path.resolve(process.cwd(), "content");
  const prefix = "/content/";

  return {
    name: "content-assets",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith(prefix)) return next();
        const rel = decodeURIComponent(req.url.split("?")[0]).slice(prefix.length);
        const file = path.resolve(dir, rel);
        if (!file.startsWith(dir + path.sep)) return next();
        if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return next();
        res.setHeader("Content-Type", file.endsWith(".json") ? "application/json" : "text/plain; charset=utf-8");
        res.setHeader("Cache-Control", "no-cache");
        res.end(fs.readFileSync(file));
      });
    },
    configurePreviewServer(server) {
      this.configureServer(server);
    },
    generateBundle() {
      if (!fs.existsSync(dir)) return;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
        this.emitFile({
          type: "asset",
          fileName: `content/${entry.name}`,
          source: fs.readFileSync(path.join(dir, entry.name))
        });
      }
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(dir) && file.endsWith(".json")) {
        server.ws.send({ type: "full-reload" });
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), blogContentPlugin(), contentAssetsPlugin()],
  build: {
    target: "es2022",
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "motion-vendor": ["framer-motion"],
          "markdown-vendor": ["react-markdown", "remark-gfm", "rehype-highlight"]
        }
      }
    }
  }
});
