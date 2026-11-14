# Switch

On or off, in place — a setting that takes effect the moment it's flipped — drawn with the slider's own track and thumb.

| State | Track | Thumb | Label |
|---|---|---|---|
| Off | `--color-range-track` | left | secondary |
| On | full ink | right | full ink |
| Disabled | as it was, at 30% | as it was | 30% |

## Rules

- **It is the slider's parts.** A `16px` track, a `12px` thumb, `2px` between them: the same sizes as the slider, so a switch and a slider in one panel read as one family. `28px` wide: the thumb and `12px` of travel.
- **State without colour.** Off is the grey track; on is full ink. Never the accent, never green.
- **Heights can differ.** The drawn track is `16px`; the switch itself is a `36px` row (`--height-control`), so it sits on the same line as any other control and a finger has room.
- **A switch acts at once.** Flipping it is the action: no Save beside it. A choice that waits for a button is a checkbox (`components/choice/`).
- **A switch or a two-option segmented control.** A setting that is simply on or off is a switch. Two named states of equal weight — Shown / Hidden, Day / Week — stay a segmented control, because each side needs its word.
- **The label is beside it, `16px` away, or somewhere else.** With its text inside the `<label>`, the text is Body: secondary when off, full ink when on, like a chip. At the end of a row or in a control panel, the row's name or the panel's mono label names it and the switch is bare.
- **In a panel or a row it sits at the end:** on the right line of the control column, where a row's value would be.
- **Hover previews.** The track's ink comes up to 30%, like the slider's fill, and the label brightens.
- **The thumb presses.** Held, it scales to `--scale-press`; it crosses on `--duration-base` with `--ease-out`.
- **Focus is on the track:** the system's full-ink outline, `2px` off it.

## Use

- `<label class="switch">` › `<input class="switch-input" type="checkbox" role="switch">`, then `.switch-track` › `.switch-thumb`. Text after the track, with `.t-body` on the label, if it carries its own label.
- A bare switch takes `aria-label` or `aria-labelledby` on the input.
- Listen for the input's own `change` event; read `checked`.
- No JavaScript.
