import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";

/** One article in a listing grid. Shared by /blog and the category pages. */
export default function BlogCard({ post }) {
  const tags = (post.tags || []).slice(0, 4);

  return (
    <article className="glass group flex flex-col overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
      {post.image && (
        <Link to={post.url} className="block overflow-hidden" tabIndex={-1} aria-hidden>
          <img
            src={post.image}
            alt=""
            // Listing images are below the fold on every viewport, so they are always
            // deferred; width/height reserve the box and keep CLS at zero.
            loading="lazy"
            decoding="async"
            width={800}
            height={420}
            className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {post.category && (
            <Link
              to={`/blog/${post.category}`}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
            >
              {post.categoryLabel}
            </Link>
          )}

          <span className="inline-flex items-center gap-1.5 meta-text">
            <CalendarDays size={14} />
            {post.date}
          </span>

          <span className="inline-flex items-center gap-1.5 meta-text">
            <Clock size={14} />
            {post.readingTime}
          </span>
        </div>

        <h2 className="mt-3 font-display text-xl font-semibold leading-snug">
          <Link to={post.url} className="transition hover:text-indigo-600 dark:hover:text-indigo-400">
            {post.title}
          </Link>
        </h2>

        {post.description && (
          <p className="mt-3 line-clamp-3 text-base leading-7 text-slate-600 dark:text-slate-400">
            {post.description}
          </p>
        )}

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2.5 py-1 tag-text dark:bg-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          to={post.url}
          className="mt-6 inline-flex items-center gap-2 self-start text-base font-semibold text-indigo-600 dark:text-indigo-400"
        >
          Read More
          <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
