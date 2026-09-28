import { motion } from "framer-motion";
import { ArrowUpRight, Linkedin, Mail } from "lucide-react";

import { site } from "../utils/seo";

const channels = [
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Connect with me",
    href: site.linkedin,
    external: true,
  },
];

/** The email / LinkedIn cards, shared by the home page section and the contact page. */
export default function ContactChannels({ animate = true }) {
  return (
    <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
      {channels.map(({ icon: Icon, label, value, href, external }) => {
        const motionProps = animate
          ? {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.15 },
              transition: { duration: 0.5 },
            }
          : {};

        return (
          <motion.a
            key={label}
            href={href}
            {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            {...motionProps}
            whileHover={{ y: -4 }}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 text-left transition hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-indigo-400/60 sm:p-6"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-500/10 dark:text-indigo-400">
              <Icon size={22} />
            </span>

            <span className="min-w-0">
              <span className="block text-xs font-semibold uppercase tracking-[.18em] text-slate-500 dark:text-slate-400">
                {label}
              </span>
              <span className="mt-1 block break-words font-medium text-slate-900 dark:text-white">
                {value}
              </span>
            </span>

            <ArrowUpRight
              size={20}
              className="ml-auto shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
            />
          </motion.a>
        );
      })}
    </div>
  );
}
