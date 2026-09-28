<?php
/**
 * Dynamic sitemap — served at /sitemap.xml via the rewrite in .htaccess.
 *
 * Because it scans blog/ per request, an uploaded .md file is in the sitemap the next
 * time Google fetches it; nothing needs regenerating or resubmitting by hand.
 */

declare(strict_types=1);

require __DIR__ . '/api/blog-lib.php';

header('Content-Type: application/xml; charset=utf-8');

$posts = blog_scan_posts();

blog_send_validators(md5('sitemap' . json_encode($posts)), blog_last_modified($posts));

/** Static pages that always belong in the sitemap. */
$staticPages = [
    ['/', 'weekly', '1.0'],
    ['/about', 'monthly', '0.7'],
    ['/projects', 'monthly', '0.8'],
    ['/blog', 'daily', '0.9'],
    ['/contact', 'monthly', '0.5'],
    ['/privacy-policy', 'yearly', '0.3'],
    ['/terms-and-conditions', 'yearly', '0.3'],
    ['/disclaimer', 'yearly', '0.3'],
];

function sitemap_url(string $loc, string $lastmod, string $changefreq, string $priority): string
{
    $out = "  <url>\n";
    $out .= '    <loc>' . htmlspecialchars(BLOG_SITE_URL . $loc, ENT_XML1) . "</loc>\n";
    if ($lastmod !== '') {
        $out .= '    <lastmod>' . substr($lastmod, 0, 10) . "</lastmod>\n";
    }
    $out .= "    <changefreq>$changefreq</changefreq>\n";
    $out .= "    <priority>$priority</priority>\n";
    return $out . "  </url>\n";
}

$newest = $posts[0]['modifiedAt'] ?? gmdate('c');

$body = '';
foreach ($staticPages as [$loc, $freq, $priority]) {
    $body .= sitemap_url($loc, $loc === '/blog' ? $newest : '', $freq, $priority);
}

// One entry per category that actually has posts.
$categories = [];
foreach ($posts as $post) {
    if ($post['category'] !== '' && !isset($categories[$post['category']])) {
        $categories[$post['category']] = $post['modifiedAt'];
    }
}
ksort($categories);
foreach ($categories as $category => $lastmod) {
    $body .= sitemap_url("/blog/$category", (string) $lastmod, 'weekly', '0.7');
}

foreach ($posts as $post) {
    $body .= sitemap_url((string) $post['url'], (string) $post['modifiedAt'], 'monthly', '0.8');
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
echo $body;
echo '</urlset>' . "\n";
