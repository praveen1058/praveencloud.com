import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";

import { site } from "../utils/seo";
import { loadBlogIndex } from "../utils/blog";
import { buildCategoryList } from "../utils/categories";

const siteLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

const legalLinks = [
  { to: "/privacy-policy", label: "Privacy Policy" },
  { to: "/terms-and-conditions", label: "Terms & Conditions" },
  { to: "/disclaimer", label: "Disclaimer" },
];

export default function Footer() {
  // Topics are read from whatever is actually in blog/, so a new category folder shows
  // up here on its own — the same rule as everywhere else on the site.
  const [topicLinks, setTopicLinks] = useState([]);

  useEffect(() => {
    let active = true;
    loadBlogIndex().then(posts => {
      if (!active) return;
      setTopicLinks(
        buildCategoryList(posts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          .map(category => ({ to: `/blog/${category.slug}`, label: category.label }))
      );
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="border-t border-slate-200 dark:border-white/10">
      <div className="container-page py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-display text-xl font-bold">
              Praveen Kumar<span className="text-indigo-500">.</span>
            </div>
            <p className="mt-2 text-base text-slate-500">Cloud &amp; DevOps Engineer</p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              Practical guides on cloud platforms, containers, CI/CD and infrastructure
              automation.
            </p>

            <div className="mt-5 flex gap-4">
              <a aria-label="GitHub" href={site.github} target="_blank" rel="noreferrer">
                <Github size={19} />
              </a>
              <a aria-label="LinkedIn" href={site.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={19} />
              </a>
              <a aria-label="Email" href={`mailto:${site.email}`}>
                <Mail size={19} />
              </a>
            </div>
          </div>

          <FooterColumn title="Site" links={siteLinks} />
          {topicLinks.length > 0 && <FooterColumn title="Topics" links={topicLinks} />}
          {/* AdSense review looks for these to be reachable from every page. */}
          <FooterColumn title="Legal" links={legalLinks} />
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-white/10">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Praveen Kumar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[.18em] text-slate-900 dark:text-white">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {links.map(link => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-base text-slate-500 transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
