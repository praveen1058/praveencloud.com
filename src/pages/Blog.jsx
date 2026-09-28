import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

import SEO from "../components/SEO";
import SectionHeading from "../components/SectionHeading";
import Loading from "../components/Loading";
import BlogCard from "../components/BlogCard";
import { loadBlogIndex, searchPosts } from "../utils/blog";
import { buildCategoryList } from "../utils/categories";

export default function Blog() {
  const [query, setQuery] = useState("");
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

  const categories = useMemo(() => buildCategoryList(posts || []), [posts]);
  const results = useMemo(() => searchPosts(posts || [], query), [posts, query]);

  if (!posts) return <Loading />;

  return (
    <div className="container-page section">
      <SEO
        title="Blog"
        description="Technical articles and guides on AWS, Azure, GCP, Docker, Kubernetes, Terraform, Ansible, Jenkins, GitHub Actions and Linux automation."
        path="/blog"
        keywords={categories.map(c => c.label)}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "PraveenCloud Blog",
          url: "https://praveencloud.com/blog",
          description:
            "Cloud, DevOps, automation and infrastructure articles by Praveen Kumar.",
        }}
      />

      <SectionHeading
        eyebrow="Writing"
        title="Cloud & DevOps guides"
        description="Practical, hands-on articles on cloud platforms, containers, CI/CD, infrastructure as code and Linux automation."
      />

      <div className="relative mb-6">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Search articles — try “kubernetes pods” or “docker volumes”"
          aria-label="Search articles"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-base outline-none transition focus:border-indigo-500 dark:border-white/10 dark:bg-white/5"
        />
      </div>

      {categories.length > 0 && (
        <nav aria-label="Blog categories" className="mb-10 flex flex-wrap gap-2">
          {categories.map(category => (
            <Link
              key={category.slug}
              to={`/blog/${category.slug}`}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-white/10 dark:text-slate-300 dark:hover:text-indigo-400"
            >
              {category.label}
              <span className="ml-2 text-slate-400">{category.count}</span>
            </Link>
          ))}
        </nav>
      )}

      {query && (
        <p className="mb-6 text-sm text-slate-500">
          {results.length} {results.length === 1 ? "article" : "articles"} matching “{query}”
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {results.map(post => (
          <BlogCard key={post.url} post={post} />
        ))}
      </div>

      {results.length === 0 && (
        <p className="py-16 text-center text-slate-500">
          {posts.length === 0
            ? "No articles published yet."
            : "No articles matched that search."}
        </p>
      )}
    </div>
  );
}
