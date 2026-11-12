# Stage and list

A view and the records behind it, for a tool you check on a phone: pick something on the stage and its records rise beside it, never over it — with one button under the thumb to open, close and go back.

Requires: button, scroll-fade, list-row, takeover, stage-nav

From a bet tracker: a calendar of results on the stage, the bets in a list, and a picked day that kept ending up under the panel that was meant to explain it.

## When it is this, and when it is the stage and sheet

Both split a phone screen into two surfaces. They answer different questions.

| | Stage and sheet | Stage and list |
|---|---|---|
| The second surface holds | controls that change the stage | records the stage is made of |
| You go | sheet → stage: adjust, and watch | stage → list: pick, and read |
| The ground between them | black: a tool taking the screen over | the page: two cards on it |
| Opened by | the sheet's own pill, which is also its handle | the thumb button, which is also the way back |
| Its height | yours: drag to resize | fixed, so the same spot always closes it |
| On a wide screen | a docked card in the corner | a column beside the stage, always open |

If the second surface holds both, it is a stage and list, and the controls go on the stage.

## Rules

- **Three depths, and no more.** The stage, the list, and one record's detail. The thumb button walks them one at a time; nothing opens a fourth.
- **Two surfaces on one line.** On a wide screen the stage is the system's grey ground and the list is the one surface style, side by side, the same top and the same bottom, `8px` apart and `8px` from every edge. The list is always open.
- **On a phone, the stage is the screen.** Closed, it runs edge to edge with no corner and no gap: the list isn't there until it's asked for.
- **Opening splits; nothing covers.** As the list comes up the stage draws in `8px` from the edges, rounds its corners and gets shorter, and the list rises into the room below it, `8px` apart. Whatever was picked on the stage is still in view above the list that explains it. A panel laid over the stage is the mistake this pattern exists to avoid.
- **The ground is the page.** White in light, black in dark, like everything around it. This is a tool's everyday screen, not a mode, so nothing goes dark to make room.
- **One move.** Every edge of both surfaces comes from one value on one duration (`--duration-deliberate`) and one curve (`--ease-out`). Closing is the same move backwards.
- **Split, the stage is only its view.** The stage's top row — the figure, the navigation, the controls — folds away above the view on the same move and returns as the list goes down. The view re-fits the height it has; it is never cropped by the list.
- **Keep what was picked in view.** A view that scrolls inside the shorter stage brings the picked thing back into view through the whole move, not after it.
- **The thumb button is one place.** Bottom centre, the page inset from the bottom edge, `64px` like everything in the bottom slot. It is the only thing at the bottom of the screen.
- **It changes job, never place.** With the list's name it opens the list. As a cross it closes it. As a chevron it goes back from the detail to the list. Opening, closing and going back are all the same reach.
- **No handle, no drag.** The list has a heading, not a grip, and one height. A sheet you resize needs a handle at its top; a list you close needs its close where the open was.
- **Closing the list lets go of the pick.** With the list gone, nothing on the stage stays selected. The page clears its pick when it hears the list close.
- **The detail is a takeover** (`components/takeover/`, contained). One record, opened, covers the whole pattern in the page's ground: opaque, scaled in from `--scale-enter` on `--duration-slow`, never a dimmed modal. The thumb button stays above it. On a wide screen it is the only time the thumb button shows.
- **Controls go on the stage.** They change what the stage shows, so they sit on its edges — and fold away with its top row when the list is up. Never in the list: there they are hidden until it opens, and they push the records down. In the top row they share the line with the figure only while both fit: a long figure keeps its size, and the controls wrap under it at the right. They never sit on top of the figure or squeeze it.
- **Escape goes back one depth**, like the thumb button.

## Use

- `.stage-list` › `.stage-list-stage` (› `.stage-list-top` › `.stage-list-top-in`, then `.stage-list-view`), `.stage-list-list`, `.stage-list-detail`, and `button.stage-list-thumb` with the button's pill classes. It fills the screen itself (`position: fixed`), so it is the page.
- The thumb button's text is the list's name: "Bets", "Orders". Keep it to one word.
- Inside the stage, space is the stage's (see Surfaces in `SKILL.md`). The stage is a size container named `stage`: size the view from it with `cqw` and `cqh`.
- Make the list's body a scroll fade (`.scroll-fade--surface`), and leave room at its end for the thumb button on a phone. Its records are list rows (`components/list-row/`).
- Several views on the stage are a bare carousel (`data-frame="bare"`) with stage navigation (`components/stage-nav/`) in the stage's top row.
- `el.stageList.open()` and `.close()` move the list on a phone; `.detail(true)` opens the detail once you've filled it, `.detail(false)` leaves it. `.isOpen`, `.isDetail` and `.isPhone` read the state.
- It fires bubbling `stage-list-toggle` and `stage-list-detail` events, each with `detail.open`. Clear the stage's pick on `stage-list-toggle` when `open` is false.
- Tune it with `--list-w` (the wide column, `320px`), `--list-h` (the phone list's height, `52cqh`) and `--list-gap` (`8px`) on `.stage-list`.
- The pattern sizes itself from its own width, not the window's (a container query), so it also works inside a framed demo.

## Changes in v0.2.0

- The top row wraps: controls drop under a long figure instead of colliding with it.
- The detail is the takeover component, contained; the list's records are list rows; several views are a bare carousel with stage navigation.
