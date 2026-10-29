# Picker

A select menu: a button with a chevron that opens a list of options, growing from the trigger with a fill that glides between the options.

## Rules

- **A select is a button with a chevron — nothing else distinguishes it.** The trigger is the Button component: same height, same font (Label or Interactive), same padding, same pill, same rest shadow, same hover lift. A picker that looks smaller, lighter or flatter than the buttons beside it is a defect.
- **The chevron is the only distinguishing mark.** It's drawn custom, never the native select chrome, and it turns 180° as the menu opens, over `--duration-base` on `--ease-out`.
- **The menu follows the surface rules:** white fill, hairline, `20px` radius. Hairline only, like the tooltip and toast — no shadow, because the menu as a whole can't be hovered.
- **It grows from the trigger.** `scale(0.95)` → `scale(1)` with opacity, over `--duration-base` on `--ease-out`, with `transform-origin` on the corner nearest the trigger. A menu is bigger than a tooltip, so it takes the large-surface scale (0.95), not the pop from 0. It opens above the trigger when there's no room below.
- **Options are Interactive type**, secondary ink, going to full ink when indicated. An option is a compact button's height.
- **One fill moves between options**, like the segmented control's indicator: `--color-fill-subtle`, pill radius. It appears in place on the selected option when the menu opens, then glides to whatever the pointer or arrow keys reach. Options are dense targets, so it moves on `--duration-base`, not `--duration-deliberate`.
- **The selected option carries a check** at full ink — state shown with a glyph, never the accent.
- **Disabled options** sit at 30% and are skipped by the keyboard.
- Past about nine options the menu scrolls. Past about fifteen, the person needs search, which this component doesn't do yet.

## Use

- Copy the whole `.picker-field`. Give the list a unique `id` and point the trigger's `aria-controls` at it. The trigger's `aria-labelledby` names the field label and the value, so it reads as "Sort by, Most recent".
- With no option selected, the trigger shows whatever is in `.picker-value` in secondary ink — put a placeholder there.
- `data-value` on each option is what goes into the hidden `<input>` and the `picker-change` event (`detail.value`, `detail.option`). Without it, the option's text is used.
- For a picker with no visible label, such as in a toolbar, drop the label `<span>` and give the trigger and list an `aria-label` instead.
- Type: `.t-control` for compact pickers, `.t-label` beside primary buttons. Options stay `.t-control`.
- Needs `button.css` for the trigger.

## Keyboard

| Key | Closed | Open |
|---|---|---|
| Enter, Space | opens | chooses the indicated option |
| ↓ ↑ | opens | moves the fill |
| Home, End | — | first or last option |
| A letter | — | jumps to the first option that starts with it |
| Escape | — | closes, focus back on the trigger |
| Tab | — | closes and moves on |
