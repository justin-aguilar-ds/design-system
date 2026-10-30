# Type pairs

Seven ways to put two type styles together, from subtle to expressive. Pick the quietest one that does the job.

Requires: none

## The spectrum

| # | Pair | Roles | Gap | Reach for it when | Per view |
|---|---|---|---|---|---|
| 1 | Detail | Label + Mono | `8px` | a value needs its name — a spec row, a timestamp, an ID | any |
| 2 | Quiet | Label + Body | `8px` | a row, a card or a field needs a title and a line | any |
| 3 | Section | Title + Body | `16px` | a part of the page opens and needs a sentence of context | a few |
| 4 | Figure | Title + Caption | `8px` | a number matters, but it's one of several | a few |
| 5 | Statement | Display + Body | `16px` | a page opens and the title needs a sentence of context | one |
| 6 | Big number | Display + Label | `8px` | one figure is the reason the screen exists | one |
| 7 | Flat | Display + Display | `0` | a page opens with a statement, not a name | one |

## Rules

- **Subtle to expressive is a budget, not a menu.** Most of a page is 1 and 2. Use 3 and 4 to structure it, and at most one of 5, 6 or 7 to open it. Two loud pairs on one view cancel each other out.
- **Pairs only combine existing roles.** No new sizes, weights or tracking. If a pair you want needs a new style, the pair is wrong, not the scale.
- **Hierarchy comes from size or ink, never weight.** Every role is 500 except Label (600). The Flat pair makes the point: the same size twice, and the second line in secondary ink is enough.
- **A pair counts toward the three-styles-per-card budget.** A card with a Quiet pair has room for one emphasis — a Figure's number or a mono value — and no more.
- **No eyebrow.** Nothing small sits above a heading. Every pair here reads top to bottom from the louder line, except Detail and Figure, where the name and the value are one unit.
- **In Detail, the mono value is full ink** (`.type-pair-value`). It's meaningful and small, and the contrast floor reserves secondary 10.5px for decoration.
- **8px when the two read as one unit, 16px when they're read one after the other.** Flat is 0, because the two lines are one statement.

## Use

- Copy one pair from `type-pairs.html` and change the words. Use real headings (`h1`, `h2`) where the pair opens the page or a section.
- The Big number pair is what a stat tile would use; there's no stat component yet.
- Edit the spectrum here first. The table is the source the pairs follow.
