import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { ArrowLeft, CalendarDays, Clock, User } from "lucide-react";

import SEO from "../components/SEO";
import Loading from "../components/Loading";
import BlogCard from "../components/BlogCard";
import { loadBlogContent, loadBlogIndex, relatedPosts } from "../utils/blog";
import { categoryLabel } from "../utils/categories";

const SITE_URL = "https://praveencloud.com";

// Images inside article markdown are deferred too — a long guide can carry a dozen.
const markdownComponents = {
  img: ({ node, ...props }) => (
    <img {...props} loading="lazy" decoding="async" alt={props.alt || ""} />
  ),
  a: ({ node, href = "", ...props }) => {
    const external = /^https?:\/\//i.test(href) && !href.startsWith(SITE_URL);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...props}
      />
    );
  },
};

export default function BlogPost() {
  const { category, slug } = useParams();
  const [state, setState] = useState(null);

  useEffect(() => {
    let active = true;
    setState(null);

    (async () => {
      try {
        const posts = await loadBlogIndex();
        const index = posts.findIndex(p => p.slug === slug && p.category === category);

        if (index < 0) {
          if (active) setState({ missing: true });
          return;
        }

        const post = posts[index];
        const content = await loadBlogContent(post.file);

        if (active) {
          setState({
            post,
            content,
            posts,
            // The index is newest-first, so the neighbour above is the newer article.
            newer: posts[index - 1] || null,
            older: posts[index + 1] || null,
          });
        }
      } catch {
        if (active) setState({ missing: true });
      }
    })();

    return () => {
      active = false;
    };
  }, [category, slug]);

  const related = useMemo(
    () => (state?.post ? relatedPosts(state.posts, state.post) : []),
    [state]
  );

  if (!state) return <Loading />;

  if (state.missing) {
    return (
      <div className="container-page section text-center">
        <SEO title="Article not found" path={`/blog/${category}/${slug}`} noindex />
        <h1 className="page-title">Article not found</h1>
        <p className="mt-4 body-copy">
          This article may have been moved or renamed.
        </p>
        <Link
          to="/blog"
          className="mt-8 inline-flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400"
        >
          <ArrowLeft size={16} /> Browse all articles
        </Link>
      </div>
    );
  }

  const { post, content, newer, older } = state;
  const label = post.categoryLabel || categoryLabel(post.category);

  return (
    <div className="container-page section">
      <SEO
        title={post.title}
        description={post.description || `A practical ${label} guide by ${post.author}.`}
        path={post.url}
        type="article"
        image={post.image || "/images/og-image.svg"}
        keywords={post.tags}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          headline: post.title,
          description: post.description,
          image: `${SITE_URL}${post.image || "/images/og-image.svg"}`,
          datePublished: post.date,
          dateModified: (post.modifiedAt || post.date).slice(0, 10),
          author: { "@type": "Person", name: post.author },
          publisher: { "@type": "Person", name: "Praveen Kumar" },
          mainEntityOfPage: `${SITE_URL}${post.url}`,
          articleSection: label,
          keywords: (post.tags || []).join(", "),
        }}
      />

      <div className="mx-auto max-w-4xl">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 meta-text">
          <Link to="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            Blog
          </Link>
          <span>/</span>
          <Link
            to={`/blog/${post.category}`}
            className="hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            {label}
          </Link>
        </nav>

        <header>
          <Link
            to={`/blog/${post.category}`}
            className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300"
          >
            {label}
          </Link>

          <h1 className="mt-4 page-title">{post.title}</h1>

          {post.description && <p className="mt-5 body-copy">{post.description}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 meta-text">
            <span className="inline-flex items-center gap-1.5">
              <User size={14} />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} />
              {post.readingTime}
            </span>
          </div>

          {post.image && (
            <img
              src={post.image}
              alt=""
              // The hero is the largest element above the fold, so it loads eagerly and
              // is given priority — this is the Largest Contentful Paint element.
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={1200}
              height={630}
              className="mt-8 w-full rounded-3xl border border-slate-200 object-cover dark:border-white/10"
            />
          )}
        </header>

        <article className="prose-custom mt-10">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        </article>

        {(post.tags || []).length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 tag-text dark:bg-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-12 grid gap-3 border-t border-slate-200 pt-6 sm:grid-cols-2 dark:border-white/10">
          {newer ? (
            <Link
              to={newer.url}
              className="rounded-xl border border-slate-200 p-4 transition hover:border-indigo-400 dark:border-white/10"
            >
              <span className="text-xs text-slate-500">Newer</span>
              <div className="mt-1 font-semibold">← {newer.title}</div>
            </Link>
          ) : (
            <span />
          )}

          {older && (
            <Link
              to={older.url}
              className="rounded-xl border border-slate-200 p-4 text-right transition hover:border-indigo-400 dark:border-white/10"
            >
              <span className="text-xs text-slate-500">Older</span>
              <div className="mt-1 font-semibold">{older.title} →</div>
            </Link>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-8">Related articles</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map(item => (
              <BlogCard key={item.url} post={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
