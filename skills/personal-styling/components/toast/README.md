# Toast

A short confirmation that grows from the control that caused it, for when an action finishes somewhere the result can't be seen.

From the portfolio's "Copy email to clipboard" button (`.about-email-button`, `.about-copy-feedback`, `initAboutEmailButton` in `js/about.js`).

## Rules

- **A toast confirms a control, so it grows from that control.** `transform-origin` is its bottom centre, `8px` above the control. It is never a corner notification stack.
- **Scale from 0.** `scale(0)` → `scale(1)` over `--duration-base` on `--ease-out` — a small thing that pops. It leaves the same way after 1.5s.
- **It is a value, not a sentence.** `.t-mono`, one or two words: "Copied", "Saved", "Sent". No exclamation mark.
- **Full ink, not secondary.** It's a status at 10.5px, and the contrast floor puts a meaningful small value at full ink — 50% black at that size is for decoration only.
- **One surface, hairline only.** It can't be hovered, so no shadow, and a `20px` radius.
- **Not for errors that need action.** A toast disappears. If the person has to do something, put it on the page as glyph + word at full ink.

## Use

- Wrap the control and an empty `<span class="toast t-mono" role="status">` in `.toast-anchor`. Put `data-toast="Copied"` on the control.
- `data-copy="…"` copies that text first: the Clipboard API, with a fallback for plain-HTTP pages. If copying fails, the toast says so instead.
- The control is usually a Button, so load `button.css` too.

## Changes in v0.2.0

- Text is full ink, not secondary, per the contrast floor.

## Changes from the portfolio

- "Copied!" is now "Copied". The voice has no exclamation marks.
- The gap above the button is 8px, not 12px, and padding is 8 / 16px, not 12 / 16px, to stay on the scale.
- Hairline is `--color-hairline` (`#ececec`), not `#f8f8f8`.
- It's anchored to its control with `position: absolute`, not fixed to the bottom of the viewport, so it works for any button anywhere.
- It reports a failed copy instead of always saying it worked.
