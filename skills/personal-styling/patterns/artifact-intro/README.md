# Artifact intro

The opening of a tool: one large title, and an info button that reveals what the tool is for.

Requires: tooltip, button

## Rules

- **The title is the only visible intro copy.** Display type, one headline to the view — no eyebrow above it, no descriptor beside it, no sentence under it.
- **The description lives behind an info button** — a 40px circle fixed to the right edge of the title row. It's button-shaped, so it carries the rest shadow and lifts on hover.
- **The button centres on the title, not the page.** The title row is a grid whose height comes from the heading, so the button stays centred when the title wraps or drops to 32px under 630px.
- **The description is a toggled tooltip.** A click opens it and it stays until a second click, a click outside or Escape. It hangs `8px` below the title row, aligned to its right edge, and grows from the top-right corner — under the button — then its text wipes in: the tooltip's motion, `--duration-pop` then `--duration-reveal`.
- **It's set like every tooltip:** `.t-mono` — 10.5px, uppercase, `+0.3px` — in the tooltip's `280px` box. One voice for everything that hides behind a trigger.
- **While open, the button holds the selected fill** (`--color-fill-subtle`). That's state, so never the accent.
- **The description is in the markup**, hidden until opened, so it's there for search and screen readers. Keep it short — mono uppercase slows reading down — one or two sentences: what the tool shows and what to do with it.

## Changes in v0.2.0

- The description is mono, like every other tooltip, in the standard `280px` box. It was Body type in a `360px` box.
- **The control panel comes next**, `24px` below, second in the page hierarchy.

## Use

- Change the title, the description, and the `id` pair (`aria-controls`, `data-tooltip-toggle` and the tooltip's `id` must match).
- Load `tooltip.css` and `tooltip.js`.
- The intro sets no width: it fills whatever container holds it.
