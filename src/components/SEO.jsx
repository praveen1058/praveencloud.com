import { useEffect } from "react";

const SITE_URL = "https://praveencloud.com";
const SITE_NAME = "Praveen Kumar";
const DEFAULT_TITLE = "Praveen Kumar | Cloud & DevOps Engineer";
const DEFAULT_DESCRIPTION =
  "Cloud & DevOps Engineer specializing in AWS, GCP, Linux, Kubernetes, Terraform, CI/CD and cloud infrastructure.";

/**
 * Keeps the document head in step with the current route.
 *
 * On the deployed site public/index.php has already written these same tags into the
 * HTML before it was sent, which is what crawlers that do not run JavaScript see. This
 * component keeps them correct across client-side navigation, where no new document is
 * ever requested. The two produce the same values, so nothing changes on hydration.
 */
export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = "/images/og-image.svg",
  path = "/",
  type = "website",
  keywords = [],
  noindex = false,
  jsonLd = null,
}) {
  const tagList = Array.isArray(keywords) ? keywords.join(", ") : String(keywords || "");

  useEffect(() => {
    const fullTitle = title === DEFAULT_TITLE ? title : `${title} | ${SITE_NAME}`;
    const canonicalUrl = `${SITE_URL}${path}`;
    const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

    document.title = fullTitle;

    setMeta("description", description);
    setMeta("robots", noindex ? "noindex,follow" : "index,follow");
    if (tagList) setMeta("keywords", tagList);

    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", type, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:image", imageUrl, "property");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", imageUrl);

    setCanonical(canonicalUrl);
  }, [title, description, image, path, type, tagList, noindex]);

  // Structured data is replaced wholesale per route rather than merged, so a stale
  // article block never survives a navigation.
  useEffect(() => {
    const id = "route-json-ld";
    document.getElementById(id)?.remove();
    if (!jsonLd) return undefined;

    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => script.remove();
  }, [jsonLd]);

  return null;
}

function setMeta(name, content, attribute = "name") {
  if (!content) return;

  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function setCanonical(url) {
  let link = document.head.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", url);
}
