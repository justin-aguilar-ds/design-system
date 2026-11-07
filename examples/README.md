# Examples

Single-page tools built only from the library, to stress-test it. Each page
links the skill's own files through `lib/` (a symlink to
`skills/personal-styling/`), so a change to the library shows up here too.

- `pnl.html` — a trading P&L dashboard: control panel, figures, two charts, sortable tables.
- `party.html` — a party host's page: docked settings, guest table, running order, large button.
- `registers.html` — temporary: a slider from the Tool register to the Occasion register, with one specimen page answering live.
- `typography-stage.html` — prototype of the stage and sheet pattern for phones, on the typography-on-a-path tool: opening the controls splits the screen into two surfaces on a black ground, and the canvas re-fits above the sheet.
- `data-proposals.html` — proposals for a line chart and table v1.0, awaiting approval: each has an approve/decline switch that turns its feature on or off in the live demos. Nothing here is in the skill yet.
- `panel-proposals.html` — ways to calm a long control panel (mono field labels, separators, full-width or inline controls), awaiting approval. Nothing here is in the skill yet.
- `bottom-proposals.html` — a system for the bottom of the screen (one slot, one 50px height, what goes in it) and three ways to combine the nav with a button or a select, as live mock screens. Decided: H1 at 64px, S1, S2, A and O approved and moved into the skill as `patterns/bottom-slot/`; B, C and M declined.
- `spacing-proposals.html` — an audit of the space inside controls at 36 and 64 (label to edge, frame to fill, label to mark), with a Today / Proposed switch and live measurements. Decided: F2, F3, F4, P1 and T approved and moved into the skill (tokens v0.17); F1 declined, P2 not taken.
- `dinners.html` — a week of dinners: a sortable week beside fixed nights, an ideas list, a small form.

Open one through a local server from this folder, or publish it with its `lib/` files.
