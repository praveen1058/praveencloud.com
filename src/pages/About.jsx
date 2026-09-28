import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import SEO from "../components/SEO";
import SectionHeading from "../components/SectionHeading";
import { loadJSON } from "../utils/api";
import { buildCategoryList } from "../utils/categories";
import { loadBlogIndex } from "../utils/blog";
import { site } from "../utils/seo";

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5 },
};

export default function About() {
  const [experience, setExperience] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadJSON("/content/experience.json", []).then(setExperience);
    loadBlogIndex().then(posts => setCategories(buildCategoryList(posts)));
  }, []);

  return (
    <div className="container-page section">
      <SEO
        title="About Praveen Kumar"
        description="Cloud and DevOps engineer working with AWS, GCP, Kubernetes, Terraform and CI/CD automation — and the engineer behind the PraveenCloud blog."
        path="/about"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: site.name,
          jobTitle: site.role,
          url: `${site.url}/about`,
          sameAs: [site.linkedin].filter(Boolean),
          knowsAbout: [
            "Amazon Web Services",
            "Kubernetes",
            "Terraform",
            "Docker",
            "Linux",
            "CI/CD",
          ],
        }}
      />

      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="About"
          title="Hi, I'm Praveen Kumar."
          description="Cloud & DevOps Engineer with over 7 years of IT experience, building resilient AWS infrastructure and automating the way it gets deployed."
        />

        <div className="prose-custom">
          <p>
            I work on production cloud infrastructure — designing AWS environments that
            stay up, provisioning them with Terraform instead of console clicks,
            orchestrating workloads on Kubernetes, and wiring the pipelines that move
            code into them safely.
          </p>
          <p>
            This site is where I write that work down. Most articles start as something
            I had to figure out at work: a container that would not stay running, a
            permissions model that needed untangling, a deployment that needed to stop
            being manual. I publish the version of the explanation I wish I had found
            when I was searching for it.
          </p>

          <h2>What you will find here</h2>
          <p>
            Practical, hands-on guides rather than marketing overviews — real commands,
            real configuration, and the reasoning behind them.
          </p>
        </div>

        {categories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map(category => (
              <Link
                key={category.slug}
                to={`/blog/${category.slug}`}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-600 dark:border-white/10 dark:text-slate-300 dark:hover:text-indigo-400"
              >
                {category.label}
              </Link>
            ))}
          </div>
        )}

        {experience.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-8">Experience</h2>

            <div className="space-y-5">
              {experience.map(role => (
                <motion.div
                  key={`${role.company}-${role.duration}`}
                  {...fade}
                  className="glass rounded-3xl p-6"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold">
                      {role.position}
                    </h3>
                    <span className="meta-text">{role.duration}</span>
                  </div>

                  <p className="mt-1 text-base font-medium text-indigo-600 dark:text-indigo-400">
                    {role.company}
                    {role.location && (
                      <span className="text-slate-500 dark:text-slate-400">
                        {" "}· {role.location}
                      </span>
                    )}
                  </p>

                  {(role.technologies || []).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {role.technologies.map(tech => (
                        <span
                          key={tech}
                          className="rounded-full bg-slate-100 px-2.5 py-1 tag-text dark:bg-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            to="/blog"
            className="rounded-xl bg-indigo-600 px-5 py-3 text-base font-semibold text-white transition hover:bg-indigo-500"
          >
            Read the blog
          </Link>
          <Link
            to="/contact"
            className="rounded-xl border border-slate-300 px-5 py-3 text-base font-semibold transition hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            Get in touch
          </Link>
        </div>
      </div>
    </div>
  );
}
