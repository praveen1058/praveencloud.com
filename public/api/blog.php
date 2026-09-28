<?php
/**
 * Blog index endpoint — GET /api/blog.php
 *
 * Returns every post found under blog/ as JSON. The front end calls this on the blog
 * listing, the category pages and the article page, so a newly uploaded .md file shows
 * up everywhere at once with no rebuild and no code change.
 *
 * Optional filters: ?category=aws  ?slug=aws-ec2-guide
 */

declare(strict_types=1);

require __DIR__ . '/blog-lib.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$posts = blog_scan_posts();

blog_send_validators(md5(json_encode($posts) ?: ''), blog_last_modified($posts));

$category = isset($_GET['category']) ? (string) $_GET['category'] : '';
$slug = isset($_GET['slug']) ? (string) $_GET['slug'] : '';

if ($category !== '') {
    $posts = array_values(array_filter(
        $posts,
        static fn(array $post): bool => $post['category'] === $category
    ));
}

if ($slug !== '') {
    $posts = array_values(array_filter(
        $posts,
        static fn(array $post): bool => $post['slug'] === $slug
    ));
}

echo json_encode(
    ['posts' => $posts, 'count' => count($posts)],
    JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
);
