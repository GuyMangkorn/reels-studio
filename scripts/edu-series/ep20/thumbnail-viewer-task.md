# EDU-EP20-THUMB-R1 — independent viewer check

Act as Film's independent first-time-viewer critic per `.claude/agents/film.md` and the dedicated viewer-check procedure. This is a checking-only pass, separate from the painter. The project's viewer-check instruction names Claude Sonnet 5.5 at medium effort; it is not an authoring or rendering assignment.

## Inputs and reading scope

Read only `out/EDU-EP20-SHORT/viewer-check/look/bundle.md` and each sheet it names. That native bundle contains the exact three thumbnail images, Film's copied direction/casting, P31 description and user-taste criteria. You may open at most two extra image frames if a judgment genuinely cannot be made from the sheet. The dedicated critic reading restriction takes precedence over authoring-stage core reads. Do not inspect painting code or the painter's own verdict before judging.

These are **draft first-shot cabin thumbnails**, not finished looks or final shots. Judge natural spatial/anatomical/hero readability against the bundle, allowing flat washes and unfinished polish. Preserve the distinction between a critical visible error and a minor taste issue. There is no narration to judge. A pass establishes this thumbnail's readability only, not motion/contact/sequence proof or user approval.

## Output ownership

You are not alone in the same worktree. Preserve others' edits; do not revert or modify any production art, scripts, narration, global rules, episode records, storyboard rows or partner episode. Own only:

- `out/EDU-EP20-SHORT/viewer-check/look/verdicts.json`, with every listed look ID mapped to `pass` or `fail`.
- `storyboards/edu-ep20/short/thumbnail-review/viewer-check-look-r1.md`, one table row per look with what it reads as without narration, pass/fail against the bundle, and findings tagged by class P/A/H/R and severity C/M as specified in the bundle. Any C finding fails; no C means pass. Do not invent findings to look thorough. Record minor findings without requesting polish fixes.

Do not paint, render, fix, generate audio, invoke another role or create a new worktree/top-level session. Finish with the table and exact output paths; complete the Orca worker task through its provided worker_done mechanism so this same coordinator receives the result. No report goes to the originating EP20/EP21 session.
