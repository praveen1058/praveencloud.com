import SEO from "../components/SEO";
import SectionHeading from "../components/SectionHeading";
import ContactChannels from "../components/ContactChannels";
import { site } from "../utils/seo";

export default function Contact() {
  return (
    <div className="container-page section">
      <SEO
        title="Contact"
        description="Get in touch about cloud, infrastructure or DevOps opportunities, or to report a correction to an article."
        path="/contact"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: `${site.url}/contact`,
          mainEntity: {
            "@type": "Person",
            name: site.name,
            email: `mailto:${site.email}`,
            jobTitle: site.role,
          },
        }}
      />

      <div className="glass relative overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:p-16">
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

          <p className="mx-auto mt-10 max-w-2xl text-center text-base text-slate-600 dark:text-slate-400">
            Spotted an error in an article, or something that has gone out of date since
            it was published? Please email me — corrections are welcome and I would
            rather fix it than leave it wrong.
          </p>
        </div>
      </div>
    </div>
  );
}
