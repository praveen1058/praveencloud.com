import { useEffect } from "react";

const SITE_URL = "https://praveencloud.com";
const DEFAULT_TITLE = "Praveen Kumar | Cloud & DevOps Engineer";
const DEFAULT_DESCRIPTION =
  "Cloud & DevOps Engineer specializing in AWS, GCP, Linux, Kubernetes, Terraform, CI/CD and cloud infrastructure.";

export default function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = "/images/og-image.svg",
  path = "/",
  type = "website",
}) {
  useEffect(() => {
    const fullTitle =
      title === DEFAULT_TITLE ? title : `${title} | Praveen Kumar`;

    document.title = fullTitle;

    const canonicalUrl = `${SITE_URL}${path}`;

    setMeta("description", description);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", type, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:image", `${SITE_URL}${image}`, "property");

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image", `${SITE_URL}${image}`);

    setCanonical(canonicalUrl);
  }, [title, description, image, path, type]);

  return null;
}

function setMeta(name, content, attribute = "name") {
  if (!content) return;

  let element = document.head.querySelector(
    `meta[${attribute}="${name}"]`
  );

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