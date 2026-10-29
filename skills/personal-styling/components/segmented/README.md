# Segmented control

One choice out of a few, always visible, with a fill that glides to the choice and previews where a click will land.

From the portfolio's Design / Music pill nav (`.pill-nav`, `js/pill-nav.js`).

## Rules

- **One truth at a time.** If several options can be on at once, it's a row of toggle chips, not a segmented control.
- **The selected fill is its own element.** `.segmented-indicator` sits behind the options and glides between them over `--duration-deliberate` (450ms) on `--ease-out`. It is `--color-fill-subtle`, because selection is state — never the accent.
- **Hovering an option previews it.** The indicator slides under the hovered option and slides back when the pointer leaves the control. Mouse only: touch has no hover to preview.
- **Unselected labels sit at 30% and go to full ink** when indicated or focused. Opacity transitions with plain `ease` over the same 450ms, so the label and the fill move together.
- **The frame lifts.** It carries the rest shadow and deepens to `--shadow-lift` on hover, like a button.
- **Metrics follow the button.** The default control is exactly the height of a pill in the same type — 36px with `.t-control`, 37px with `.t-label`. `.segmented--nav` is the page-nav size.
- Two to four options. Past four, use a select.

## Use

- **In-page switch:** `<button>` options with `aria-pressed`, in a `role="group"` with an `aria-label`. `segmented.js` switches in place and fires a bubbling `segmented-change` event with `detail.value`.
- **Page nav:** `<a>` options in a `<nav class="segmented segmented--nav">`. Mark the current page's link `.is-active` and `aria-current="page"`. The portfolio pins it with `position: fixed; left: 50%; bottom: var(--space-page); transform: translateX(-50%)`.
- **Gliding across pages:** add `view-transition-name: segmented-indicator` to the indicator and `@view-transition { navigation: auto; }` to both pages, and the fill glides from one page's option to the next.
- Type: `.t-control` in-page, `.t-label` in the nav.

## Changes from the portfolio

- Frame hairline is `--color-hairline` (`#ececec`), not `#f8f8f8`.
- Nav option padding is 16 / 24px, not 20 / 24px, to stay on the scale. The nav is 8px shorter.
- The 2px gap between options is gone. It was off the scale, and the fill covers the whole option anyway.
- Labels use the system's −0.1px tracking, not −0.25px.
- Keyboard focus brings a label to full ink, so the focus outline isn't drawn at 30%.
