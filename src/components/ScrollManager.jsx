import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

import { scrollToSectionWhenReady, scrollToTop } from "../utils/scroll";

/**
 * Puts each navigation at the right scroll position.
 *
 * React Router does not reset the scroll offset when the route changes, so without
 * this a page opened from halfway down another one appears already scrolled past its
 * own heading.
 *
 * It only acts when the *page* changes. An in-page anchor click on the page you are
 * already on is left to the browser, which scrolls smoothly and honours
 * scroll-padding-top on its own — taking that over would replace a smooth scroll with
 * a jump.
 */
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const navigationType = useNavigationType();
  const previousPath = useRef(null);

  useEffect(() => {
    const changedPage = previousPath.current !== pathname;
    previousPath.current = pathname;

    if (hash) {
      // Arriving at /#experience from another page: the section does not exist until
      // Home's lazy chunk has mounted, so this keeps re-anchoring until it settles.
      // An anchor clicked on the page you are already on is left alone — the browser
      // scrolls it smoothly and honours scroll-padding-top by itself.
      return changedPage ? scrollToSectionWhenReady(hash.slice(1)) : undefined;
    }

    // Any forward navigation without a hash starts at the top, including clicking the
    // link for the page you are already on — `key` changes on every navigation, so
    // re-clicking Contact while on /contact scrolls back up rather than doing nothing.
    // On Back/Forward the browser restores the previous offset, which is what the
    // reader expects.
    if (navigationType !== "POP") scrollToTop();

    return undefined;
  }, [pathname, hash, key, navigationType]);

  return null;
}
