# Working on this repository

This repo is a design system, not an app. The skill in `skills/personal-styling/` is the product; `site/` and `scripts/` exist to develop and check it.

- `SKILL.md` and `tokens.css` are the source of truth. Component CSS follows them; never the other way round.
- Component CSS uses tokens only: no literal colours, durations or curves, spacing on 4 / 8 / 16 / 24 / 48, radius 20px or fully round.
- Every shipped component file starts with the header `personal-styling · <name> · v<version>`. Bump it on any change.
- A component's rules live in its `README.md`. `SKILL.md` keeps only the system-wide rules and the component index.
- Run `npm run check` before committing. It must pass.
- Build output (`dist/`) is not committed.
- Check work in the form factor the person is prompting from (see "Check it where they'll see it" in `SKILL.md`): feedback from a phone is reproduced and fixed at phone width with touch, then checked on desktop.
- The repo holds the skill and the sandbox that shows it, nothing else. Agents read only `skills/personal-styling/`; example pages don't ship and don't live here.
- The sandbox is the one example. It is published as the "Personal styling" artifact, and every change to the skill is republished to it in the same piece of work: build, then publish the changed `dist/` files. The public copy on GitHub Pages (linked from `README.md`) builds itself from `main` on every push (`.github/workflows/pages.yml`); nothing to do by hand.
- Proposals and explorers are published as their own artifacts, never committed. Each is built as a stage and sheet (`patterns/stage-sheet/`): the live specimen is the stage; the controls, readout and approve/decline decisions go in the sheet. Check them on a phone with the sheet closed and open. Once a decision is made, it goes into the component's `README.md` or `SKILL.md`; the artifact is a record, not a source.
