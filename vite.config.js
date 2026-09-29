import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

import { blogDir, renderSitemap, scanPosts } from "./scripts/blog.mjs";

// In production the index comes from public/api/blog.php, which scans the blog/ folder
// on every request — that is what makes "upload a .md file" enough to publish. This
// plugin stands in for that endpoint during dev and `vite preview`, answering the same
// URL with the same JSON so the front end has a single contract, and it also writes a
// static blog/index.json fallback into the build for hosts without PHP.
const BLOG_API_URL = "/api/blog.php";
const BLOG_INDEX_URL = "/blog/index.json";
const SITEMAP_URL = "/sitemap.xml";

function blogContentPlugin() {
  const serve = (server) => {
    server.middlewares.use((req, res, next) => {
      const url = req.url?.split("?")[0];
      if (!url) return next();

      if (url === BLOG_API_URL || url === BLOG_INDEX_URL) {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Cache-Control", "no-cache");
        return res.end(JSON.stringify({ posts: scanPosts() }));
      }

      if (url === SITEMAP_URL) {
        res.setHeader("Content-Type", "application/xml");
        res.setHeader("Cache-Control", "no-cache");
        return res.end(renderSitemap(scanPosts()));
      }

      return next();
    });
  };

  return {
    name: "blog-content",
    configureServer: serve,
    configurePreviewServer: serve,
    generateBundle() {
      const posts = scanPosts();
      // The .md files themselves are in public/, so Vite copies them already.
      this.emitFile({
        type: "asset",
        fileName: "blog/index.json",
        source: JSON.stringify({ posts })
      });
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: renderSitemap(posts) });
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(blogDir())) {
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
        // A query string means Vite's own module pipeline is asking (?import, ?raw,
        // ?url, ?t=). Those must be transformed into a JS module, so serving the raw
        // file here would hand the browser JSON where it expects a module and take the
        // whole app down. Only plain runtime fetches are answered directly.
        if (req.url.includes("?")) return next();
        const rel = decodeURIComponent(req.url).slice(prefix.length);
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
  server: {
    watch: process.env.VITE_DOCKER ? { usePolling: true, interval: 300 } : undefined
  },
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
