# Scroll fade

A scrolling area whose cut ends dissolve into the ground, instead of meeting a hard line or showing a scrollbar.

From the source site, where content fades into the ground colour at an edge; made reusable while building a bet tracker, whose calendar scrolled inside a card.

## Rules

- **A fade, not a line.** Wherever a scrolling area inside a page cuts its content — a list in a sheet, a calendar in a card, a docked panel taller than the screen — the cut end fades to the ground over `48px`. This is the only gradient in the system: functional, never decoration.
- **It fades to what the content sits on.** The page by default (`--color-bg`); `.scroll-fade--surface` on a card or a sheet; `.scroll-fade--stage` on the stage's grey ground. A fade to the wrong colour shows as a band in dark mode, where the page and a surface differ.
- **Only where something is cut.** It rests clear. The top fade comes in once the area has scrolled; the bottom one shows while there is more below. An area that fits its content shows neither.
- **It never takes a press.** The overlay ignores the pointer, so a row or a tile under it stays tappable.
- **It comes and goes on `--duration-base` with plain `ease`**: a fade, like a hover, not something entering the screen.
- **Scrollbars are hidden inside it.** The fade is what says there is more. The page itself keeps the browser's scrollbar.
- **The page is not a scroll fade.** This is for an area inside the page. A fade pinned to the bottom of the whole screen is `.bottom-fade` in `tokens.css`.

## Use

- `.scroll-fade` › `.scroll-fade-area` › the content. The wrapper needs a height, from its layout (a grid row, a flex item with `min-height: 0`) or set on it; the area fills it and scrolls.
- `scroll-fade.js` marks the wrapper `.is-cut-top` and `.is-cut-bottom`. It follows scrolling, resizing and content changes on its own.
- For a wrapper added after the page loads, call `scrollFade(el)`.
- To fade to another ground, set `--scroll-fade-to` on the wrapper.
