import { useEffect } from "react";

import { site } from "../utils/seo";

/**
 * Loads the Google AdSense script — but only once a publisher ID is configured in
 * src/utils/seo.js. Until then this renders nothing and costs nothing, so the site
 * stays fast while it is still waiting on approval.
 *
 * The script is injected after mount rather than sitting in index.html so it can never
 * delay the first render, and it is marked async as Google requires.
 */
export default function AdSense() {
  const client = site.adsenseClient;

  useEffect(() => {
    if (!client) return;
    if (document.querySelector('script[data-adsense="1"]')) return;

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.dataset.adsense = "1";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    document.head.appendChild(script);
  }, [client]);

  return null;
}
