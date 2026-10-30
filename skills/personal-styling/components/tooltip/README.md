# Tooltip

A detail worth having but not worth printing: inline information on a value, a tooltip dropped where you click, and the cursor pill that invites the click.

From the source site's media carousel, where a "Learn more" pill invited a click and the click explained the item.

## Rules

- **Default to a hover reveal over permanent secondary text.** A precise figure behind a rounded one, a full timestamp behind "Yest.", a definition, the arithmetic behind a total.
- **Hover for a glance, click for a sentence.** Inline information opens on hover because it's a glance. A toggled tooltip holds a sentence or two, so it opens on click and stays until dismissed — reading shouldn't depend on holding the pointer still.
- **One row is a pill, more is a card.** `tooltip.js` measures the box once its text is in: under `--pill-below` (60px) it takes `.is-pill`, so a one-line value reads like the cursor pill and a wrapped sentence keeps 20px corners.
- **The tooltip is the one place mono is unreservedly right** — every tooltip, toggled ones included, is `.t-mono`. `.t-mono` on one surface with the hairline and a `20px` radius. No shadow — nothing hovers it.
- **It grows from the point it explains.** `scale(0)` → `scale(1)` over `--duration-pop` (350ms) on `--ease-out`, with `transform-origin` on the anchored corner: the click point for a dropped tooltip, the trigger for inline information.
- **Then the text wipes in.** `clip-path: inset(0 100% 0 0)` → `inset(0)` over `--duration-reveal` (550ms), starting once the box has finished scaling.
- **Closing reverses only the scale.** The text stays revealed until the box has shrunk away.
- **The cursor pill:** uppercase mono at −0.25px and full ink, over a 50% fill with a 20px backdrop blur. It's the only blurred element on a page. Its position tracks the pointer instantly; only its scale animates.
- **Hover is an upgrade, never the only route.** Inline triggers open on focus and on tap. Dropped tooltips open from the keyboard. Escape closes either.
- One tooltip at a time.

## Use

- **Inline:** `<button class="tooltip-trigger" type="button" data-tooltip="…">value</button>`. It inherits the surrounding text and brightens to full ink on hover. It opens on hover, focus or tap, and appears above the trigger, or below if there's no room.
- **Dropped:** `data-tooltip-drop="…"` on a `<button>` wrapping the media. A click drops the tooltip with its bottom-left corner at the pointer, and the next click anywhere closes it. From the keyboard it drops at the centre.
- **Toggled:** `data-tooltip-toggle="<id>"` on a button, `aria-expanded` and `aria-controls` on it too, and the tooltip itself in the markup: `<div class="tooltip tooltip--anchored" id="<id>" hidden><p class="tooltip-text …">…</p></div>`. Click opens it, a second click, a click outside or Escape closes it (Escape returns focus to the button). Its container's CSS places it — `top`, `left` or `right`, and `transform-origin` on the corner nearest the button. Used by `patterns/artifact-intro/`.
- **Cursor pill:** `data-cursor="Learn more"` on any element. Pair it with `data-tooltip-drop` for the carousel pattern: the pill invites the click, the click explains. The pill hides while that element's tooltip is open.
- Needs `--duration-pop`, `--duration-reveal` and `--color-glass` from `tokens.css` v0.5.

## Changes in v0.5.0

- On touch screens the hover response plays while the finger is down — the native tap flash is gone.

## Changes in v0.3.0

- `.tooltip--prose` is gone: toggled tooltips are mono like the rest, in the standard `280px` box.

## Changes in v0.2.0

- Toggled tooltips (`data-tooltip-toggle`): authored in the markup, opened and closed by a button, for prose.

## Changes from the source

- Hairline is `--color-hairline` (`#ececec`), not `#f8f8f8`.
- Cursor pill padding is 8 / 16px, not 8 / 12px, to stay on the scale.
- Inline information is new. The source only had the dropped tooltip. It uses the same surface and motion, anchored to the trigger.
- Keyboard and touch paths are new. The source's tooltip was mouse and tap on the carousel only.
