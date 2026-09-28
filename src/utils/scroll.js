// Height of the sticky header (h-16), so section tops don't hide underneath it.
const HEADER_OFFSET = 64;

const targetTop = (el) =>
  Math.max(0, el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);

export function scrollToSection(id, { smooth = true } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;
  window.scrollTo({ top: targetTop(el), behavior: smooth ? "smooth" : "auto" });
  return true;
}

// After a route change the section may not exist yet (Home is lazy-loaded) and
// its position keeps moving while experience/skills JSON streams in, so re-anchor
// for a short window instead of scrolling once. Stops early if the user scrolls.
export function scrollToSectionWhenReady(id, { timeout = 800 } = {}) {
  let frames = Math.ceil(timeout / 16);
  let cancelled = false;
  const cancel = () => {
    cancelled = true;
    window.removeEventListener("wheel", cancel);
    window.removeEventListener("touchstart", cancel);
  };
  window.addEventListener("wheel", cancel, { passive: true, once: true });
  window.addEventListener("touchstart", cancel, { passive: true, once: true });

  const step = () => {
    if (cancelled) return;
    const el = document.getElementById(id);
    if (el) {
      const top = targetTop(el);
      if (Math.abs(window.scrollY - top) > 2) window.scrollTo({ top, behavior: "auto" });
    }
    if (--frames > 0) requestAnimationFrame(step);
    else cancel();
  };
  requestAnimationFrame(step);
  return cancel;
}
