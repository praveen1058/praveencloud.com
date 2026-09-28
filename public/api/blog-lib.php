<?php
/**
 * Shared blog scanner for the PHP side of the site.
 *
 * This is the runtime twin of scripts/blog.mjs: it walks blog/<category>/<slug>.md and
 * produces the same JSON shape. Because the scan happens per request, dropping a new
 * .md file into blog/ over FTP publishes it — nothing is baked in at build time.
 *
 * Used by api/blog.php (JSON index), sitemap.php (sitemap) and index.php (meta tags).
 */

declare(strict_types=1);

// mod_deflate does not reliably filter PHP output, so compression is enabled here
// instead. This has to run before anything is echoed, which it does — every entry
// point requires this file first.
if (!headers_sent() && ini_get('zlib.output_compression') !== '1') {
    @ini_set('zlib.output_compression', '1');
}

const BLOG_SITE_URL = 'https://praveencloud.com';
const BLOG_WORDS_PER_MINUTE = 200;

/** Deployment root — the directory holding index.html, blog/ and categories.json. */
function blog_root(): string
{
    return dirname(__DIR__);
}

function blog_dir(): string
{
    return blog_root() . '/blog';
}

/** Turns "github-actions" into "Github Actions" for folders not listed in categories.json. */
function blog_title_case(string $slug): string
{
    return implode(' ', array_map('ucfirst', explode('-', $slug)));
}

function blog_strip_quotes(string $value): string
{
    $value = trim($value);
    $length = strlen($value);
    if ($length > 1) {
        $first = $value[0];
        $last = $value[$length - 1];
        if (($first === '"' && $last === '"') || ($first === "'" && $last === "'")) {
            return substr($value, 1, -1);
        }
    }
    return $value;
}

/**
 * Parses the same YAML front-matter subset as src/utils/parseFrontmatter.js:
 * scalars, quoted scalars, block lists ("tags:" then "- item") and inline [a, b] lists.
 *
 * @return array{data: array<string, mixed>, content: string}
 */
function blog_parse_frontmatter(string $raw): array
{
    $raw = preg_replace('/^\xEF\xBB\xBF/', '', $raw) ?? $raw;

    if (!preg_match('/^---\r?\n(.*?)\r?\n---[ \t]*(?:\r?\n(.*))?$/s', $raw, $match)) {
        return ['data' => [], 'content' => $raw];
    }

    $data = [];
    $listKey = null;

    foreach (preg_split('/\r?\n/', $match[1]) ?: [] as $line) {
        if (trim($line) === '' || str_starts_with(trim($line), '#')) {
            continue;
        }

        if ($listKey !== null && preg_match('/^\s+-\s*(.+)$/', $line, $item)) {
            $data[$listKey][] = blog_strip_quotes($item[1]);
            continue;
        }

        if (!preg_match('/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/', $line, $pair)) {
            continue;
        }

        $key = $pair[1];
        $value = trim($pair[2]);

        if ($value === '') {
            $listKey = $key;
            $data[$key] = [];
            continue;
        }

        $listKey = null;

        if (preg_match('/^\[(.*)\]$/s', $value, $inline)) {
            $items = array_filter(array_map(
                static fn($part) => blog_strip_quotes($part),
                explode(',', $inline[1])
            ), static fn($part) => $part !== '');
            $data[$key] = array_values($items);
            continue;
        }

        $data[$key] = in_array($key, ['tags', 'keywords'], true)
            ? [blog_strip_quotes($value)]
            : blog_strip_quotes($value);
    }

    foreach ($data as $key => $value) {
        if (is_array($value) && count($value) === 0) {
            unset($data[$key]);
        }
    }

    return ['data' => $data, 'content' => trim($match[2] ?? '')];
}

function blog_reading_time(string $content): string
{
    $words = count(array_filter(preg_split('/\s+/', trim($content)) ?: []));
    return max(1, (int) round($words / BLOG_WORDS_PER_MINUTE)) . ' min';
}

/** @return list<string> */
function blog_to_array(mixed $value): array
{
    if (is_array($value)) {
        return array_values(array_filter($value, static fn($v) => $v !== '' && $v !== null));
    }
    if (is_string($value) && trim($value) !== '') {
        return [trim($value)];
    }
    return [];
}

/**
 * A leading underscore or dot marks a file or folder as not published — that is how a
 * draft is parked next to finished posts, and how notes like _README.md stay private.
 */
function blog_is_hidden(string $name): bool
{
    return $name === '' || str_starts_with($name, '_') || str_starts_with($name, '.');
}

function blog_is_post(string $name): bool
{
    return !blog_is_hidden($name) && str_ends_with(strtolower($name), '.md');
}

/**
 * Every published post, newest first.
 *
 * @return list<array<string, mixed>>
 */
function blog_scan_posts(): array
{
    $root = blog_dir();
    if (!is_dir($root)) {
        return [];
    }

    $files = [];
    foreach (scandir($root) ?: [] as $entry) {
        if (blog_is_hidden($entry)) {
            continue;
        }
        $full = $root . '/' . $entry;
        if (is_dir($full)) {
            foreach (scandir($full) ?: [] as $child) {
                if (blog_is_post($child)) {
                    $files[] = [$entry, $child];
                }
            }
        } elseif (blog_is_post($entry)) {
            // A stray .md straight in blog/ is published as uncategorised rather than lost.
            $files[] = ['', $entry];
        }
    }

    $posts = [];
    foreach ($files as [$category, $name]) {
        $relative = $category === '' ? $name : $category . '/' . $name;
        $full = $root . '/' . $relative;
        $raw = file_get_contents($full);
        if ($raw === false) {
            continue;
        }

        $parsed = blog_parse_frontmatter($raw);
        $data = $parsed['data'];
        $slug = preg_replace('/\.md$/i', '', $name) ?? $name;
        $modifiedAt = gmdate('c', (int) filemtime($full));

        $posts[] = [
            'slug' => $slug,
            'category' => $category,
            // The folder is the category; a `category:` in front matter only overrides
            // the label that gets displayed.
            'categoryLabel' => $data['category'] ?? (blog_title_case($category) ?: 'Uncategorised'),
            'file' => $relative,
            'url' => $category === '' ? "/blog/$slug" : "/blog/$category/$slug",
            'title' => $data['title'] ?? blog_title_case($slug),
            'description' => $data['description'] ?? '',
            // `image` is the documented field; `cover` is what the older posts use.
            'image' => $data['image'] ?? ($data['cover'] ?? ''),
            'author' => $data['author'] ?? 'Praveen Kumar',
            'date' => substr((string) ($data['date'] ?? $modifiedAt), 0, 10),
            'tags' => blog_to_array($data['tags'] ?? []),
            'readingTime' => $data['readingTime'] ?? blog_reading_time($parsed['content']),
            'modifiedAt' => $modifiedAt,
        ];
    }

    usort($posts, static function (array $a, array $b): int {
        return [$b['date'], $b['modifiedAt']] <=> [$a['date'], $a['modifiedAt']];
    });

    return $posts;
}

/** Newest mtime across the blog tree — used for ETag/Last-Modified validators. */
function blog_last_modified(array $posts): int
{
    $latest = 0;
    foreach ($posts as $post) {
        $latest = max($latest, strtotime((string) $post['modifiedAt']) ?: 0);
    }
    return $latest ?: time();
}

/**
 * Answers a conditional request with 304 when nothing changed. Keeps repeat visits
 * cheap without ever serving a stale index.
 */
function blog_send_validators(string $etag, int $lastModified): void
{
    header('ETag: "' . $etag . '"');
    header('Last-Modified: ' . gmdate('D, d M Y H:i:s', $lastModified) . ' GMT');
    header('Cache-Control: public, max-age=0, must-revalidate');

    $noneMatch = trim($_SERVER['HTTP_IF_NONE_MATCH'] ?? '', '"');
    $since = $_SERVER['HTTP_IF_MODIFIED_SINCE'] ?? '';

    if ($noneMatch === $etag || ($since !== '' && strtotime($since) >= $lastModified)) {
        http_response_code(304);
        exit;
    }
}
