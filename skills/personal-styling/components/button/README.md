# Button

Two treatments for every action: the pill, and the quiet text treatment for actions people rarely need.

| Tier | Shape | Treatment |
|---|---|---|
| Button | fully round pill | `.surface` + `.surface--rest`, Label or Interactive type, lifts to `--shadow-lift` on hover |
| Text | none | Interactive type at `--color-text-secondary`, goes to full ink on hover. This is `.link-quiet`. |

## Rules

- **One shadow for every button-shaped control.** Anything that looks like a button carries the rest shadow (`--shadow-rest`) at rest and lifts on hover. A button-shaped control with no shadow sitting next to one with a shadow is the ambiguity this rule kills — the old no-shadow secondary pill is retired.
- **A control cluster uses at most two treatments**: the button for actions, the quiet text treatment for the rest. Three button styles in one cluster is a defect — if three things all look like buttons, two of them take the same treatment.
- **Infrequent actions take the text treatment.** "Show all", "Clear", "Reset", "Delete week" are text buttons. They should disappear until wanted. A rarely used action does not earn a third button style.
- **In a button lockup, every label aligns.** Labels share one height, one vertical centring and one baseline, regardless of treatment. `.button-row` aligns on the baseline and `.button-text` takes the pill's box, so a quiet action sits on the same line as the pills beside it.
- There is no louder button. If one action must dominate a group, it does so by position, not by a second pill style.
- Buttons never change background colour on hover. They lift, or they brighten their ink.

## Use

- Primary action: `.t-label`. Compact controls — card actions, toolbars: `.t-control`.
- Always a real `<button type="button">`, or `type="submit"` in a form.
- Disabled takes the real `disabled` attribute. It drops to 30% ink, loses its shadow and hover, and shows `cursor: not-allowed`.
- Focus is the global `:focus-visible` outline from `tokens.css`. Don't restyle it per button.
