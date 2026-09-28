import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import SEO from "../components/SEO";
import SectionHeading from "../components/SectionHeading";
import Loading from "../components/Loading";
import BlogCard from "../components/BlogCard";
import { loadBlogIndex } from "../utils/blog";
import { categoryDescription, categoryLabel } from "../utils/categories";

/**
 * /blog/<category> — every article in one folder of blog/.
 *
 * Nothing here is hard-coded per category: the route matches any slug, and a folder
 * with no posts simply renders the empty state with a noindex tag.
 */
export default function BlogCategory() {
  const { category } = useParams();
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    let active = true;
    loadBlogIndex().then(list => {
      if (active) setPosts(list);
    });
    return () => {
      active = false;
    };
  }, []);

  const inCategory = useMemo(
    () => (posts || []).filter(post => post.category === category),
    [posts, category]
  );

  if (!posts) return <Loading />;

  // Articles used to live at the flat /blog/<slug>, so a URL that matches no category
  // but does match a post slug is an old link — send it to the article's real home.
  if (inCategory.length === 0) {
    const legacy = posts.find(post => post.slug === category);
    if (legacy) return <Navigate to={legacy.url} replace />;
  }

  const label = inCategory[0]?.categoryLabel || categoryLabel(category);
  const description = categoryDescription(category);
  const empty = inCategory.length === 0;

  return (
    <div className="container-page section">
      <SEO
        title={`${label} Tutorials & Guides`}
        description={description}
        path={`/blog/${category}`}
        keywords={[label, ...new Set(inCategory.flatMap(post => post.tags || []))]}
        noindex={empty}
        jsonLd={
          empty
            ? null
            : {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: `${label} articles`,
                description,
                url: `https://praveencloud.com/blog/${category}`,
                hasPart: inCategory.map(post => ({
                  "@type": "TechArticle",
                  headline: post.title,
                  url: `https://praveencloud.com${post.url}`,
                  datePublished: post.date,
                })),
              }
        }
      />

      <Link
        to="/blog"
        className="mb-8 inline-flex items-center gap-2 text-base font-medium text-indigo-600 dark:text-indigo-400"
      >
        <ArrowLeft size={16} /> All articles
      </Link>

      <SectionHeading
        eyebrow="Category"
        title={label}
        description={description}
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {inCategory.map(post => (
          <BlogCard key={post.url} post={post} />
        ))}
      </div>

      {empty && (
        <p className="py-16 text-center text-slate-500">
          No articles in this category yet.{" "}
          <Link to="/blog" className="font-medium text-indigo-600 dark:text-indigo-400">
            Browse all articles
          </Link>
        </p>
      )}
    </div>
  );
}
