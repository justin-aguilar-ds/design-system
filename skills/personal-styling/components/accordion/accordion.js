/* personal-styling · accordion · v0.5.0 */

// Each trigger owns one panel. A closed panel is inert, so its controls
// leave the tab order and the accessibility tree while collapsed.
// data-accordion="single" on the group keeps one item open at a time.
// .is-settled marks a panel that has finished opening, so the CSS can stop
// clipping it; .is-collapsed marks one that has finished closing, so a
// container can change shape once its height is final.

function setAccordion(item, open) {
  const trigger = item.querySelector('.accordion-trigger');
  const panel = item.querySelector('.accordion-panel');
  item.classList.toggle('is-open', open);
  if (!open) item.classList.remove('is-settled');
  if (open) item.classList.remove('is-collapsed');
  trigger.setAttribute('aria-expanded', String(open));
  panel.inert = !open;
}

document.querySelectorAll('.accordion-item').forEach((item) => {
  const trigger = item.querySelector('.accordion-trigger');
  const panel = item.querySelector('.accordion-panel');
  if (!trigger || !panel) return;

  // data-closed-below="630" starts the item closed on screens that narrow.
  const narrow = item.dataset.closedBelow && matchMedia(`(max-width: ${item.dataset.closedBelow}px)`).matches;
  const open = trigger.getAttribute('aria-expanded') === 'true' && !narrow;
  setAccordion(item, open);
  item.classList.toggle('is-settled', open);
  item.classList.toggle('is-collapsed', !open);

  panel.addEventListener('transitionend', (event) => {
    if (event.target !== panel || event.propertyName !== 'grid-template-rows') return;
    item.classList.add(item.classList.contains('is-open') ? 'is-settled' : 'is-collapsed');
  });

  trigger.addEventListener('click', () => {
    const next = !item.classList.contains('is-open');
    const group = item.closest('.accordion');
    if (next && group?.dataset.accordion === 'single') {
      group.querySelectorAll('.accordion-item.is-open').forEach((other) => {
        if (other !== item) setAccordion(other, false);
      });
    }
    setAccordion(item, next);
    item.dispatchEvent(new CustomEvent('accordion-toggle', { bubbles: true, detail: { open: next } }));
  });
});
