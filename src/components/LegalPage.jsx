import SEO from "./SEO";
import SectionHeading from "./SectionHeading";

/** Shared shell for the policy pages, so they stay consistent as they get edited. */
export default function LegalPage({ title, description, path, updated, children }) {
  return (
    <div className="container-page section">
      <SEO title={title} description={description} path={path} />

      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Legal" title={title} description={description} />

        <p className="-mt-6 mb-10 text-sm text-slate-500">Last updated: {updated}</p>

        <div className="prose-custom">{children}</div>
      </div>
    </div>
  );
}
