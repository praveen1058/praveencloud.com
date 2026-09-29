<?php
/**
 * Front controller for the single-page app.
 *
 * Every request that is not a real file lands here (see .htaccess). It serves the built
 * index.html, but first rewrites the <head> for the requested route — so an article URL
 * returns its own title, description, canonical and Open Graph tags in the raw HTML,
 * without waiting for React to boot. That matters for social crawlers, which do not run
 * JavaScript at all, and it lets unknown article URLs return a real 404 instead of a
 * soft 404 that Google would otherwise index.
 *
 * React still sets the same tags on the client; the values agree, so nothing flickers.
 */

declare(strict_types=1);

require __DIR__ . '/api/blog-lib.php';

const SITE_NAME = 'Praveen Kumar';
const DEFAULT_TITLE = 'Praveen Kumar | Cloud & DevOps Engineer';
const DEFAULT_DESCRIPTION = 'Cloud & DevOps Engineer specializing in AWS, GCP, Linux, Kubernetes, Terraform, CI/CD and cloud infrastructure.';
const DEFAULT_IMAGE = '/images/og-image.svg';

$shell = @file_get_contents(__DIR__ . '/index.html');
if ($shell === false) {
    http_response_code(500);
    exit('Application shell missing.');
}

$path = '/' . trim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/', '/');
$segments = array_values(array_filter(explode('/', $path), static fn($s) => $s !== ''));

/**
 * Category display metadata, read from the same content/categories.json the front end
 * imports, so PHP and JS never disagree on wording. A folder with no entry there still
 * works — the label just falls back to the slug.
 */
function category_meta(string $slug): array
{
    static $map = null;
    if ($map === null) {
        $raw = @file_get_contents(blog_root() . '/content/categories.json');
        $decoded = $raw === false ? null : json_decode($raw, true);
        $map = $decoded['categories'] ?? [];
    }
    return $map[$slug] ?? [];
}

function category_label(string $slug): string
{
    return category_meta($slug)['label'] ?? blog_title_case($slug);
}

function category_description(string $slug): string
{
    return category_meta($slug)['description']
        ?? 'Articles, guides and practical notes on ' . category_label($slug) . '.';
}

$meta = [
    'title' => DEFAULT_TITLE,
    'description' => DEFAULT_DESCRIPTION,
    'image' => DEFAULT_IMAGE,
    'type' => 'website',
    'robots' => 'index,follow',
    'jsonld' => null,
];
$status = 200;

$staticMeta = [
    'about' => ['About Praveen Kumar', 'Cloud and DevOps engineer working with AWS, GCP, Kubernetes, Terraform and CI/CD automation.'],
    'projects' => ['Projects', 'Cloud and DevOps engineering projects — architecture, automation and infrastructure work.'],
    'contact' => ['Contact', 'Get in touch about cloud, infrastructure or DevOps opportunities.'],
    'privacy-policy' => ['Privacy Policy', 'How praveencloud.com handles data, cookies and third-party advertising.'],
    'terms-and-conditions' => ['Terms and Conditions', 'The terms that apply to your use of praveencloud.com.'],
    'disclaimer' => ['Disclaimer', 'Technical content on praveencloud.com is provided for educational purposes.'],
];

if ($path === '/') {
    // Defaults already describe the homepage.
} elseif ($segments[0] === 'blog') {
    $posts = blog_scan_posts();

    if (count($segments) === 1) {
        $meta['title'] = 'Blog | ' . SITE_NAME;
        $meta['description'] = 'Technical articles and guides on AWS, Azure, GCP, Docker, Kubernetes, Terraform, Ansible, Jenkins, GitHub Actions and Linux automation.';
    } elseif (count($segments) === 2) {
        // /blog/<category>
        $category = $segments[1];
        $inCategory = array_values(array_filter(
            $posts,
            static fn(array $p): bool => $p['category'] === $category
        ));

        if (count($inCategory) === 0) {
            $status = 404;
            $meta['robots'] = 'noindex,follow';
            $meta['title'] = 'Page not found | ' . SITE_NAME;
        } else {
            $label = category_label($category);
            $meta['title'] = $label . ' Tutorials & Guides | ' . SITE_NAME;
            $meta['description'] = category_description($category);
        }
    } else {
        // /blog/<category>/<slug>
        $category = $segments[1];
        $slug = $segments[2];
        $post = null;
        foreach ($posts as $candidate) {
            if ($candidate['category'] === $category && $candidate['slug'] === $slug) {
                $post = $candidate;
                break;
            }
        }

        if ($post === null) {
            $status = 404;
            $meta['robots'] = 'noindex,follow';
            $meta['title'] = 'Article not found | ' . SITE_NAME;
        } else {
            $meta['title'] = $post['title'] . ' | ' . SITE_NAME;
            $meta['description'] = $post['description'] !== ''
                ? $post['description']
                : 'A practical ' . category_label($category) . ' guide by ' . $post['author'] . '.';
            $meta['type'] = 'article';
            if ($post['image'] !== '') {
                $meta['image'] = $post['image'];
            }
            $meta['jsonld'] = [
                '@context' => 'https://schema.org',
                '@type' => 'TechArticle',
                'headline' => $post['title'],
                'description' => $meta['description'],
                'image' => BLOG_SITE_URL . $meta['image'],
                'datePublished' => $post['date'],
                'dateModified' => substr((string) $post['modifiedAt'], 0, 10),
                'author' => ['@type' => 'Person', 'name' => $post['author']],
                'publisher' => ['@type' => 'Person', 'name' => SITE_NAME],
                'mainEntityOfPage' => BLOG_SITE_URL . $post['url'],
                'articleSection' => category_label($category),
                'keywords' => implode(', ', $post['tags']),
            ];
        }
    }
} elseif (isset($staticMeta[$segments[0]]) && count($segments) === 1) {
    [$title, $description] = $staticMeta[$segments[0]];
    $meta['title'] = $title . ' | ' . SITE_NAME;
    $meta['description'] = $description;
} else {
    $status = 404;
    $meta['robots'] = 'noindex,follow';
    $meta['title'] = 'Page not found | ' . SITE_NAME;
}

$canonical = BLOG_SITE_URL . ($path === '/' ? '/' : $path);

/** Strips the tags the shell ships with so the route's own values are not duplicated. */
function strip_shell_meta(string $html): string
{
    $patterns = [
        '#<title>.*?</title>#is',
        '#<meta\s+name="description"[^>]*>#i',
        '#<meta\s+name="robots"[^>]*>#i',
        '#<meta\s+property="og:[^"]*"[^>]*>#i',
        '#<meta\s+name="twitter:[^"]*"[^>]*>#i',
        '#<link\s+rel="canonical"[^>]*>#i',
    ];
    return preg_replace($patterns, '', $html) ?? $html;
}

function attr(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

$imageUrl = str_starts_with($meta['image'], 'http')
    ? $meta['image']
    : BLOG_SITE_URL . $meta['image'];

$head = "\n"
    . '<title>' . attr($meta['title']) . "</title>\n"
    . '<meta name="description" content="' . attr($meta['description']) . "\" />\n"
    . '<meta name="robots" content="' . attr($meta['robots']) . "\" />\n"
    . '<link rel="canonical" href="' . attr($canonical) . "\" />\n"
    . '<meta property="og:site_name" content="' . attr(SITE_NAME) . "\" />\n"
    . '<meta property="og:type" content="' . attr($meta['type']) . "\" />\n"
    . '<meta property="og:title" content="' . attr($meta['title']) . "\" />\n"
    . '<meta property="og:description" content="' . attr($meta['description']) . "\" />\n"
    . '<meta property="og:url" content="' . attr($canonical) . "\" />\n"
    . '<meta property="og:image" content="' . attr($imageUrl) . "\" />\n"
    . '<meta name="twitter:card" content="summary_large_image" />' . "\n"
    . '<meta name="twitter:title" content="' . attr($meta['title']) . "\" />\n"
    . '<meta name="twitter:description" content="' . attr($meta['description']) . "\" />\n"
    . '<meta name="twitter:image" content="' . attr($imageUrl) . "\" />\n";

if ($meta['jsonld'] !== null) {
    $head .= '<script type="application/ld+json">'
        . json_encode($meta['jsonld'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
        . "</script>\n";
}

$html = strip_shell_meta($shell);
$html = preg_replace('#</head>#i', $head . '</head>', $html, 1) ?? $html;

http_response_code($status);
header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: public, max-age=0, must-revalidate');
echo $html;
