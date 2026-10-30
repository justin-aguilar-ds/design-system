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
- **On touch, a pill presses as well as lifts.** While a finger is down it scales to `--scale-tap` (0.97), in at once and springing back on `--duration-base` with `--ease-out`. The large button doesn't press — it's a surface-sized target — and nothing presses under reduced motion.

## Large

- **For the main action of a screen** — the one thing the page exists to do. Above all on a phone, where it's the easiest target to reach.
- **It's the pill, larger.** Same surface, rest shadow, hover lift and Label type. Add `.button--large` to a button that already has the pill classes.
- **Its height is `--height-row` (50px)**, the height of a collapsed control panel, so a large button and a closed panel line up as one family.
- **Pinned to the bottom on a phone**, full width inside the page inset and `24px` from the bottom edge, so it's within reach wherever the page is scrolled. The page gets room at its end so the last content scrolls clear of it. Above 630px it sits in the page, as wide as its label plus `24px` either side.
- **It shares the bottom edge with a docked control panel.** When both are on a phone screen, the panel's pill rises `16px` above the button.
- **One per screen.** If two actions both look large, one of them isn't the main action.

## Use

- Primary action: `.t-label`. Compact controls — card actions, toolbars: `.t-control`.
- Always a real `<button type="button">`, or `type="submit"` in a form.
- Disabled takes the real `disabled` attribute. It drops to 30% ink, loses its shadow and hover, and shows `cursor: not-allowed`.
- Focus is the global `:focus-visible` outline from `tokens.css`. Don't restyle it per button.

## Changes in v0.3.0

- On phones, `.button--large` is pinned to the bottom of the screen.

## Changes in v0.2.0

- `.button--large`: the main action, 50px tall, full width on a phone.
