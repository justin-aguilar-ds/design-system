# Bottom slot

The bottom of the screen: one row, centred, within reach of a thumb, holding the page nav, the main action, or the nav docked beside one action or one select.

Requires: segmented, button, picker

From a portfolio whose page nav sat at the bottom, and an about page whose one action was a large button.

## Rules

- **One slot.** At most one row is pinned to the bottom of a screen, `24px` (`--space-page`) from the bottom edge and the sides, plus the safe area. It is centred and hugs what it holds at every width. Never two things stacked at the bottom, never a nav at both the top and the bottom.
- **One height: 64px.** Everything in the slot is `--height-slot`: the large segmented control, the large button, the large select, the sheet's closed pill. Compact controls stay `36px` everywhere else. A collapsed control panel stays `50px` (`--height-row`): it is a panel row, not part of the slot.
- **Decide by what the screen is for.** One answer per screen:

  | The screen is | The slot holds |
  |---|---|
  | a small site, two or three pages | the page nav (`.segmented--large`) |
  | there for one action: RSVP, sign up, get in touch | the large button, full width on a phone |
  | a live canvas and its controls | the sheet's pill (`patterns/stage-sheet/`); the nav moves to the top |
  | a site's pages, and this page has one action | the nav, docked beside the large button |
  | four or more pages | two pages docked beside a large select for the rest |
  | anything else: filters, sort, a second action | nothing. It goes in the page or the control panel. |

- **Docked: two surfaces, 8px apart.** The nav and its partner are separate controls, each with its own frame and rest shadow. With two parts, the nav's options pad `16px`, so a label sits `20px` from the frame rather than the usual `24px` (`--inset-slot`): the one exception to the inset rule, so both fit a 390px phone.
- **Never more than two parts, never more than three pages showing.** Past three pages, two stay as segments and the rest go in the select. Check every combination at `390px`: two pages and a short action fit with room to spare; three pages and an action don't.
- **The action stays put.** A page that has an action shows it from the moment it loads. It doesn't arrive, leave or change the nav's width as you move between pages.
- **A select opens upward.** Give the picker `data-side="above"`; its chevron points up while closed and turns down as the menu opens.
- **The current page.** The nav's fill marks the current page. When the current page lives in the select, the select's trigger shows its name and the nav has no fill.
- **The page clears it.** The slot leaves room at the end of the page for its footprint, so the last content scrolls clear of it, and a docked control panel rises `16px` above it on a phone.

## Use

- `.bottom-slot` holds one or two children: a `nav.segmented.segmented--large`, a `.button.button--large`, or a `.picker.picker--large[data-side="above"]`.
- Nav options are `<a>` with `.is-active` and `aria-current="page"` on the current page (see the segmented control). Type is `.t-label` throughout.
- The large button places itself at the bottom of a phone when it's on its own. Inside the slot, the slot places it instead.
- When the current page is in the select, set its option `aria-selected="true"` so the trigger shows its name, and leave no nav option `.is-active`.

## Changes in v0.1.1

- The docked exception is stated against the new inset rule: alone, the nav's labels sit `24px` from the frame; docked, `20px`.
