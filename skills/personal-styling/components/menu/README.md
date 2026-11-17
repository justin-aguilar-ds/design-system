# Menu

Actions behind the More button — rename, duplicate, share, delete — in the picker's menu, growing from the button that opened it.

## Rules

- **The trigger is the More icon button, and only that.** Three dots in a secondary icon button (`components/icon-button/`), named with an `aria-label`. Never a labelled button with a chevron: a pill with a chevron is a select (`components/picker/`), and a menu that needs a word on its trigger wants its main action out on the page as a button instead.
- **It is the picker's menu, holding actions.** The same surface (white fill, hairline, `20px` radius, no shadow), the same `4px` inset, the same `32px` items in Interactive type, the same fill gliding between them on `--duration-base`. Nothing is selected, so nothing carries a check.
- **Words only.** No icon before an action. The verb is the label; an icon beside every one is decoration.
- **Items are secondary ink, full ink when indicated.** A disabled action sits at 30% and is skipped by the keyboard.
- **The destructive action is last, under a divider, in the same ink.** Position and the divider set it apart. It is never red: red is for values, not actions. If it can't be undone, confirm it after it's chosen, not by colouring it.
- **It grows from the trigger:** `scale(0.95)` → `scale(1)` with opacity, over `--duration-base` on `--ease-out`, from the corner nearest the trigger. The trigger usually ends a row, so the menu hangs from its right edge; `data-align="start"` hangs it from the left. It opens above when there's no room below.
- **Choosing closes it.** So does Escape, a press outside, or pressing the trigger again. There is no backdrop.
- **A menu is for the actions used least.** One or two actions on a record are buttons on the page (the text button, for infrequent ones). Reach for a menu at three or more, on a row or a card where buttons would crowd the content. Keep it to seven or fewer.
- **Verbs, in sentence case.** "Rename", "Duplicate", "Move to archive". Not nouns, not "Rename…".

## Use

- `.menu` › the trigger (`button.menu-trigger.icon-button.icon-button--secondary` with `aria-haspopup="menu"` and `aria-expanded`), then `.menu-surface[hidden]` › `ul.menu-list[role="menu"]` › `li[role="none"]` › `button.menu-item.t-control[role="menuitem"]`.
- The divider is `<li class="menu-sep" role="separator"></li>` before the last item.
- `menu.js` fires a bubbling `menu-select` with `detail.value` (the item's `data-value`, or its text) and `detail.item`.
- Give the list an `aria-label` that says whose actions these are ("Trip actions").
- Needs `icon-button.css` for the trigger.

## Keyboard

| Key | Closed | Open |
|---|---|---|
| Enter, Space, ↓ | opens, on the first action | Enter and Space choose |
| ↓ ↑ | — | moves the fill |
| Home, End | — | first or last action |
| Escape | — | closes, focus back on the trigger |
| Tab | — | closes and moves on |

## Changes in v0.2.0

- The menu is hidden once its own transition has played, not after a fixed 250ms, so a longer curve (a spring) plays out on close.

