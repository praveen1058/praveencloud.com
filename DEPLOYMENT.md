# Deploying praveencloud.com

## Publishing an article (the everyday workflow)

1. Write the article as a `.md` file with front matter (see `blog/_README.md`).
2. Upload it to `public_html/blog/<category>/<file-name>.md` on Hostinger.
3. Done.

It is live immediately at `/blog/<category>/<file-name>` and appears on `/blog`, on its
category page, in search, in related articles and in `sitemap.xml`. Nothing is rebuilt
and no code changes.

Creating a folder that does not exist yet (`blog/terraform/`) creates that category and
its page automatically.

## Deploying a code change

```bash
npm install
npm run build
```

Upload **the contents of `dist/`** to `public_html/`. Include the dotfile — `.htaccess`
is easy to miss because FTP clients hide it by default, and without it every URL except
the homepage returns 404.

Do not delete `public_html/blog/` when you upload; if your FTP client offers "delete
files not in source", turn it off, or you will remove articles you uploaded directly to
the server that are not in the repo.

### Testing the production build locally first

```bash
npm run build
docker compose up preview
```

This serves `dist/` at <http://localhost:8081> through Apache + PHP with `.htaccess`
active — the same way Hostinger does. Check a few article URLs and `/sitemap.xml` there
before uploading.

For day-to-day work, `docker compose up web` runs the Vite dev server on
<http://localhost:5173> with hot reload.

## What is on the server

| Path | What it does |
| --- | --- |
| `index.php` | Front controller. Serves the app and injects per-route `<title>`, description, canonical, Open Graph and JSON-LD before sending the HTML. Returns a real 404 for unknown articles. |
| `api/blog.php` | Scans `blog/` per request, returns the article index as JSON. |
| `api/blog-lib.php` | Shared scanner and front-matter parser. |
| `sitemap.php` | Generates `sitemap.xml` on request. |
| `.htaccess` | Clean URLs, HTTPS + non-www redirect, compression, cache headers. |
| `blog/` | Your articles. The only folder you touch to publish. |
| `categories.json` | Optional display names for categories. |

**PHP is required.** It is on by default on Hostinger shared hosting. If PHP were
unavailable the site still renders, but it would fall back to `blog/index.json` — a
build-time snapshot that does not see newly uploaded files, which defeats the point.

## Google Search Console

1. Add `https://praveencloud.com` as a property.
2. Verify with either method:
   - **HTML file** — upload the `google*.html` file to `public_html/`. Real files are
     served directly, so it works with no configuration.
   - **HTML tag** — paste the meta tag into `index.html` where the comment marks the
     spot, then rebuild and upload. The front controller leaves that tag alone.
3. Submit `https://praveencloud.com/sitemap.xml`.
4. For a new article, use URL Inspection → Request Indexing to speed things up.

The sitemap regenerates itself, so you only submit it once.

## Google AdSense

1. Put your publisher ID in `adsenseClient` in `src/utils/seo.js`
   (e.g. `"ca-pub-1234567890123456"`), then rebuild and upload.
2. Upload an `ads.txt` to `public_html/` containing the line AdSense gives you.

While `adsenseClient` is empty, no advertising script is requested at all, so there is
no performance cost before approval.

The pages AdSense review expects — About, Contact, Privacy Policy, Terms and
Conditions, Disclaimer — exist and are linked from the footer on every page.

## Notes

- **Article URLs changed.** Posts moved from `/blog/<slug>` to
  `/blog/<category>/<slug>` and were renamed to clean, lowercase slugs. Old links
  redirect to the new location, so nothing breaks.
- **The canonical host is `https://praveencloud.com`** (no `www`). `.htaccess` redirects
  `www` and plain HTTP to it. If you ever want `www` to be canonical, that redirect and
  the `BLOG_SITE_URL` constant in `api/blog-lib.php` both need changing.
- **Drafts:** a file or folder starting with `_` or `.` is never published.
