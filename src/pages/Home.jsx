import { motion } from "framer-motion";
import {
  ArrowRight,
  Download,
  Mail,
  Server,
  Cloud,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import SEO from "../components/SEO";
import SectionHeading from "../components/SectionHeading";
import ContactChannels from "../components/ContactChannels";
import { loadJSON } from "../utils/api";

const fade = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5 },
};


export default function Home() {
  const [exp, setExp] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    loadJSON("/content/experience.json", []).then(setExp);
    loadJSON("/content/skills.json", []).then(setSkills);
  }, []);

  return (
    <>
      <SEO
        title="Cloud & DevOps Engineer"
        description="Portfolio of Praveen Kumar, Cloud & DevOps Engineer specializing in AWS, Kubernetes and Terraform."
      />

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute right-[10%] top-[10%] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>

        <div className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-14 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-20">
          <motion.div {...fade} className="max-w-3xl">
            <p className="mb-5 text-base font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
              👋 Hello, I'm Praveen Kumar
            </p>

            <h1 className="font-display text-5xl font-bold leading-[1.08] tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
              Cloud & DevOps
              <span className="mt-2 block gradient-text">Engineer</span>
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-base font-medium text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                7+ Years of IT Experience
              </span>
              <span className="hidden sm:inline text-slate-400">•</span>
              <span>AWS</span>
              <span className="hidden sm:inline text-slate-400">•</span>
              <span>Kubernetes</span>
              <span className="hidden sm:inline text-slate-400">•</span>
              <span>Terraform</span>
            </div>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-200 sm:text-xl sm:leading-8">
              I design, manage, and optimize reliable cloud infrastructure and production environments, with a strong focus on AWS, Kubernetes, Terraform, automation, and operational reliability.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {["AWS", "Kubernetes", "Terraform"].map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
                >
                  {technology}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-500"
              >
                View My Work
                <ArrowRight size={18} />
              </Link>

              {/* <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:hover:bg-white/[0.06]"
              >
                Download Resume
                <Download size={18} />
              </a> */}

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-base font-semibold text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
              >
                Contact Me
                <Mail size={18} />
              </a>
            </div>
          </motion.div>

          <motion.div
            {...fade}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto w-full max-w-md lg:max-w-lg"
          >
            <div className="relative">
              <div className="absolute -inset-8 rounded-full bg-indigo-500/10 blur-3xl" />

              <div className="glass relative overflow-hidden rounded-[2rem] p-3 shadow-glow">
                <img
                  src="/images/profile.jpg"
                  alt="Praveen Kumar - Cloud and DevOps Engineer"
                  className="aspect-square w-full rounded-[1.5rem] object-cover"
                />

                <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/20 bg-slate-950/80 p-5 text-white backdrop-blur-xl">
                  <p className="font-display text-lg font-semibold">
                    Cloud Infrastructure
                  </p>
                  <p className="mt-1 text-base text-slate-300">
                    Cloud Infrastructure · Platform Engineering · Production Reliability
                  </p>
                </div>
              </div>

              <div className="absolute -right-4 top-10 hidden rounded-2xl border border-slate-200 bg-white/90 px-5 py-4 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90 sm:block">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  7+
                </p>
                <p className="text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                  Years Experience
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="about" className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="About"
            title="Scalable architecture. Operational excellence."
            description="With over 7 years of IT experience, I build resilient AWS infrastructure, streamline deployments with Kubernetes and Infrastructure as Code, and maintain high availability for production workloads."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            <motion.div {...fade} className="glass rounded-3xl p-7">
              <Cloud className="text-indigo-500" />
              <h3 className="mt-5 font-display text-xl font-semibold">
                Cloud Engineering
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Architecting secure, highly available AWS environments, optimizing network topology, and driving cloud cost governance.
              </p>
            </motion.div>

            <motion.div {...fade} className="glass rounded-3xl p-7">
              <Server className="text-indigo-500" />
              <h3 className="mt-5 font-display text-xl font-semibold">
                Infrastructure & Automation
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Managing infrastructure via Terraform, orchestrating workloads with Kubernetes, and automating Linux environments.
              </p>
            </motion.div>

            <motion.div {...fade} className="glass rounded-3xl p-7">
              <ShieldCheck className="text-indigo-500" />
              <h3 className="mt-5 font-display text-xl font-semibold">
                Production Reliability
              </h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                Ensuring maximum uptime through proactive monitoring, incident response, robust security policies, and performance tuning.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="experience"
        className="section bg-slate-100/70 dark:bg-white/[0.02]"
      >
        <div className="container-page">
          <SectionHeading
            eyebrow="Experience"
            title="A practical engineering journey"
          />

          <div className="relative border-l border-slate-300 pl-7 dark:border-white/10">
            {exp.map((e, i) => (
              <motion.article
                {...fade}
                key={i}
                className="relative mb-10 last:mb-0"
              >
                <span className="absolute -left-[2.15rem] top-1.5 h-3 w-3 rounded-full border-2 border-indigo-500 bg-slate-100 dark:bg-[#070b14]" />

                <p className="text-base font-medium text-indigo-600 dark:text-indigo-400">
                  {e.duration}
                </p>

                <h3 className="mt-1 font-display text-xl font-semibold text-slate-900 dark:text-white">
                  {e.position}
                </h3>

                <p className="mt-0.5 text-base text-slate-600 dark:text-slate-300">
                  {e.company} · {e.location}
                </p>

                {e.focus && (
                  <p className="mt-3 text-base font-medium text-slate-800 dark:text-slate-200">
                    <span className="text-slate-500 dark:text-slate-400">Focus: </span>
                    {e.focus}
                  </p>
                )}

                {e.impact && e.impact.length > 0 && (
                  <div className="mt-3">
                    <p className="text-base font-medium text-slate-500 dark:text-slate-400">
                      Selected Impact:
                    </p>
                    <ul className="mt-1.5 space-y-1.5">
                      {e.impact.map((point, index) => (
                        <li
                          key={index}
                          className="text-base leading-relaxed text-slate-600 dark:text-slate-300"
                        >
                          • {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {(e.technologies || []).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-slate-200 px-2.5 py-1 tag-text text-slate-700 dark:bg-white/10 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="section">
        <div className="container-page">
          <SectionHeading eyebrow="Skills" title="Tools I work with" />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((s, i) => (
              <motion.div
                {...fade}
                key={s.category || i}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-display text-xl font-semibold leading-snug text-slate-900 dark:text-white">
                  {s.category}
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(s.items || []).map((x) => (
                    <span
                      key={x}
                      className="rounded-lg bg-slate-100 px-2.5 py-1.5 tag-text text-slate-700 dark:bg-white/5 dark:text-slate-300"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container-page">
          <div className="glass relative overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:p-16">
            {/* Soft glow behind the panel so the centred layout doesn't read as empty space. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-cyan-400/20 blur-3xl"
            />

            <div className="relative">
              <SectionHeading
                align="center"
                eyebrow="Contact"
                title="Let's build something dependable."
                description="Have a cloud, infrastructure or DevOps opportunity? Reach out on either channel below — I read everything and reply quickly."
              />

              <ContactChannels />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}