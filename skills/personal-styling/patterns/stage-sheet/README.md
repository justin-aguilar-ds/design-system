# Stage and sheet

A live canvas and the controls that change it, for a tool you use on a phone: opening the controls splits the screen into two surfaces, so you can see what you're changing while you change it.

Requires: slider, segmented, chip

From building a typography tool on a phone: the docked control panel covered the very thing its controls were changing.

## Rules

- **Two surfaces on a ground.** On a phone, opening the controls splits the screen: the stage shrinks into a card at the top and the sheet grows into a card below. Both sit `8px` from every edge and `8px` apart. The gap shows the ground, `--color-ground`: the opposite of the page, black in light and white in dark. The space between them is what says they are two surfaces. Nothing else is needed: no shadow, no hairline between them.
- **Nothing covers the work.** The stage's content re-fits the smaller card: the whole composition scales down rather than being cropped or hidden behind the sheet. Size it to the stage, not the window.
- **One move.** The pill grows into the sheet while the stage shrinks, on one duration (`--duration-deliberate`) and one curve (`--ease-out`), driven by the same values. The two edges stay a gap apart and never cross by more than the pill's own height. Closing is the same move backwards.
- **No delays, no separate width.** Staging the separation before the growth felt slow; a sheet whose width animated on its own lagged behind its height and snapped to a maximum on close. Every edge comes from the shared values.
- **The ground switches at once, both ways.** On as the open is asked for, while the stage still covers the screen; back as the close is asked for. Never animated, so it never fades through grey.
- **The closed pill sits bottom centre**, the page inset from the bottom edge. `data-pill="right"` moves it to the corner. From the centre the sheet grows evenly on both sides; from the corner it grows out of it.
- **The pill is the control panel's heading.** On a phone the title is Label type, like the large button it shares the bottom slot with, and the closed pill pads `24px` (`--inset-slot`) with the chevron `8px` after the title. On a wide screen: mono title, `16px`, a bare `10px` chevron that points up while closed. No fill behind the chevron: an icon inside a control is a mark. On a phone the closed pill is in the bottom slot, so it is `64px` (`--height-slot`) and fully round; it settles to the `50px` heading row as the sheet opens. On a wide screen it is the docked panel's `50px` row throughout. Even `16px` insets.
- **One material.** The sheet is the solid surface from pill to card. Glass would turn grey over the ground mid-move. Closed, the pill is a control in the bottom slot: the rest shadow, lifting on hover, like the segmented control beside it. Open on a wide screen it is the docked panel and keeps the lift; open on a phone it is a surface in the layout and has no shadow.
- **The controls arrive last.** They keep the open width, so the moving edge clips them rather than re-flowing them. They leave at once on close and fade in a beat after both surfaces settle on open.
- **The heading is the handle.** Drag it to resize the split: both surfaces follow the finger 1:1. Let go and it snaps to 40%, 55% or 75% of the screen; a flick up jumps to the next height. Dragging below about a quarter of the screen, or flicking down, closes it. A tap closes it too. The sheet's contents scroll inside it.
- **Wide screens keep the docked corner.** Above `630px` the stage keeps the whole page and the sheet opens as the docked control panel does: a `280px` card in the bottom-right corner, on the same move.

## Use

- `.stage-sheet` › `.stage-sheet-stage` (the work) and `.stage-sheet-sheet` › `button.stage-sheet-toggle` (with `.stage-sheet-title` and the chevron) + `.stage-sheet-body` (the controls). It fills the screen itself (`position: fixed`), so it is the page.
- Put the controls in the body as they'd go in a control panel: each field a row, its mono label left and the control right, `24px` apart. The fields share the panel's two columns, so every control fills the control column (up to `--control-max`) and starts and ends on the same lines; a slider's value is a tooltip on its thumb. Anything else in the body spans both columns. All labelled or all bare.
- Content that draws itself, like a canvas, observes `.stage-sheet-stage` with a `ResizeObserver` and redraws, once per frame while the split moves.
- `data-pill="right"` on `.stage-sheet` puts the pill in the corner. `data-open="false"` starts it closed on a wide screen; on a phone it always starts closed.
- `stage-sheet.js` fires a bubbling `stage-sheet-toggle` event with `detail.open`. Escape closes it.
- The pattern sizes itself from its own width, not the window's (a container query), so it also works inside a framed demo.
- Needs `--color-ground` from `tokens.css` v0.13.

## Open question

- The stage takes the page colour, so it always stands out from the ground: a white stage on black in light, a black stage on white in dark. Content that paints its own background (a poster canvas set to white, say) can match the ground in dark mode, and then the stage's edge disappears and only the sheet shows the split. Undecided: give the stage a hairline when its content matches the ground, or accept it.


## Changes in v0.6.0

- The fields share the control panel's two columns: every control at the same width, long labels wrapping instead of pushing their control under them.

## Changes in v0.5.0

- Closed, the pill takes the rest shadow and lifts on hover, like the segmented control beside it in the bottom slot. It was lifted all the time.

## Changes in v0.4.0

- On a phone the title is Label type, not mono: at 64px the closed pill reads as the large button does, one style fewer at the bottom of the screen. Give the title `.stage-sheet-title`; `stage-sheet.js` swaps its type.
- The closed pill pads `24px` on a phone and the chevron is `8px` after the title (was 16 and 16).

## Changes in v0.3.0

- On a phone the closed pill is 64px (`--height-slot`), the height of everything in the bottom slot, and shrinks to the 50px heading as it opens.

## Changes in v0.2.0

- Fields in the sheet follow the control panel: mono labels, label left and control right.

