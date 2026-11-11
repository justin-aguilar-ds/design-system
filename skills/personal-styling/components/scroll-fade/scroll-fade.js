/* personal-styling · scroll-fade · v0.1.0 */

// Marks which ends of a scrolling area are cutting content, so the CSS
// can fade just those: .is-cut-top once it has scrolled, .is-cut-bottom
// while there is more below. Runs on every .scroll-fade in the page; call
// scrollFade(el) for one added later (a component that builds its own).

const SCROLL_FADE_SLACK = 4;   // px: closer to an end than this isn't a cut

function scrollFade(root) {
  const area = root.querySelector('.scroll-fade-area');
  if (!area || root.scrollFadeReady) return;
  root.scrollFadeReady = true;
  const update = () => {
    root.classList.toggle('is-cut-top', area.scrollTop > SCROLL_FADE_SLACK);
    root.classList.toggle('is-cut-bottom', area.scrollTop < area.scrollHeight - area.clientHeight - SCROLL_FADE_SLACK);
  };
  area.addEventListener('scroll', update, { passive: true });
  // The area resizing, or its content changing, moves the ends too.
  const sizes = new ResizeObserver(update);
  sizes.observe(area);
  [...area.children].forEach((child) => sizes.observe(child));
  new MutationObserver(() => { [...area.children].forEach((child) => sizes.observe(child)); update(); })
    .observe(area, { childList: true, subtree: true });
  update();
}

document.querySelectorAll('.scroll-fade').forEach(scrollFade);
