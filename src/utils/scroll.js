// Height of the sticky header (h-16), so section tops don't hide underneath it.
// Kept in step with scroll-padding-top in index.css.
const HEADER_OFFSET = 64;

const targetTop = (el) =>
  Math.max(0, el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);

// `behavior: "auto"` does NOT mean "jump" — it means "use the element's CSS
// scroll-behavior", which is `smooth` on this site. Anything that needs to land
// immediately has to say "instant" explicitly, or it animates instead.
const INSTANT = "instant";

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: INSTANT });
}

export function scrollToSection(id, { smooth = true } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;
  window.scrollTo({ top: targetTop(el), behavior: smooth ? "smooth" : INSTANT });
  return true;
}

// After a route change the section may not exist yet (Home is lazy-loaded) and its
// position keeps moving while experience/skills JSON streams in and images settle, so
// re-anchor for a short window instead of scrolling once. Stops early once the target
// has held still, or as soon as the user scrolls.
export function scrollToSectionWhenReady(id, { timeout = 2500 } = {}) {
  let frames = Math.ceil(timeout / 16);
  let settled = 0;
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
    window.removeEventListener("keydown", cancel);
  };

  window.addEventListener("wheel", cancel, { passive: true, once: true });
  window.addEventListener("touchstart", cancel, { passive: true, once: true });
  window.addEventListener("keydown", cancel, { once: true });

  const step = () => {
    if (cancelled) return;

    const el = document.getElementById(id);
    if (el) {
      const top = targetTop(el);
      if (Math.abs(window.scrollY - top) > 2) {
        window.scrollTo({ top, behavior: INSTANT });
        settled = 0;
      } else {
        // Ten consecutive frames on target means the layout has stopped moving;
        // there is nothing left to correct.
        settled += 1;
      }
    }

    if (settled >= 10 || --frames <= 0) cancel();
    else requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
  return cancel;
}
