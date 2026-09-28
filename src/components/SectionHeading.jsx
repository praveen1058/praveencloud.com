export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  return (
    <div className={`mb-12 max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {description && <p className="mt-4 body-copy">{description}</p>}
    </div>
  );
}
