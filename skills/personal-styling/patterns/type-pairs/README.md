# Type pairs

Seven ways to put two type styles together, from subtle to expressive. Pick the quietest one that does the job.

Requires: none

## The spectrum

| # | Pair | Top → bottom | Gap | Reach for it when | Per view |
|---|---|---|---|---|---|
| 1 | Detail | Mono label → Body value | `8px` | a value needs its name — a date, an owner, an ID | any |
| 2 | Quiet | Label → Body | `8px` | a row, a card or a field needs a title and a line | any |
| 3 | Figure | Mono label → Title number | `8px` | a number matters, but it's one of several | a few |
| 4 | Section | Title → Body | `16px` | a part of the page opens and the content can't explain itself — rare; a heading alone is the default | a few |
| 5 | Big number | Mono label → Display number | `8px` | one figure is the reason the screen exists | one |
| 6 | Statement | Display → Body | `16px` | a page opens and the title needs a sentence of context | one |
| 7 | Flat | Display → Display | `0` | a page opens with a statement, not a name | one |

## Rules

- **Pairs are at their best with numbers.** A figure under its name is the clearest hierarchy two styles can make. Reach for Detail, Figure and Big number first; the text pairs are for headings and rows.
- **A name sits above what it names.** Detail, Figure and Big number put the small label first and the value under it, the way a reader asks the question before reading the answer. A heading still sits above its sentence, and nothing small sits above a page headline — that's an eyebrow, and it's still out.
- **Mono is the label of a figure.** The name above a value is the third place mono labels something, after the control panel title and the tooltip: uppercase, `10.5px`, secondary ink — like an axis label, it names rather than informs. The value under it is full ink. Keep the name to two or three words.
- **A heading is usually enough.** The Section and Statement pairs are for the rare sentence the content can't say itself — a caveat, a rule. A sentence that restates what the section shows ("Cumulative P&L, day by day" under "Equity curve") goes, and the heading stands alone.
- **Subtle to expressive is a budget, not a menu.** Most of a page is 1, 2 and 3. Use 4 to structure it, and at most one of 5, 6 or 7 on a view. Two loud pairs on one view cancel each other out.
- **Pairs only combine existing roles.** No new sizes, weights or tracking. If a pair you want needs a new style, the pair is wrong, not the scale.
- **Hierarchy comes from size or ink, never weight.** The Flat pair makes the point: the same size twice, and the second line in secondary ink is enough.
- **A pair counts toward the three-styles-per-card budget.** A card with a Figure has room for one more style.
- **8px when the two read as one unit, 16px when they're read one after the other.** Flat is 0, because the two lines are one statement.

## Use

- Copy one pair from `type-pairs.html` and change the words. Use real headings (`h1`, `h2`) where the pair opens the page or a section.
- A value that isn't a number takes `.type-pair-value` — Body at full ink.
- The Big number pair is what a stat tile would use; there's no stat component yet.
- Edit the spectrum here first. The table is the source the pairs follow.

## Changes in v0.3.0

- A heading alone is the default; the Section pair's sentence is the exception.

## Changes in v0.2.0

- Labels sit above values: Detail, Figure and Big number put the name first.
- Mono labels the figure pairs. Detail's value is Body at full ink.
- Number pairs lead the spectrum; Figure moves ahead of Section.
