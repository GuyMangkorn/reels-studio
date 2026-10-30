# DF-20261030-projectpoly-two-point-line — `projectPoly` returns nothing for two points; sedan lines never drew

- Owner: Boss; first observed: 2026-10-30 (WFOG r6 far-door trim line left no pixels); last checked: 2026-10-30
- Status: workaround (project a line's points one by one with `proj.P` and call `inkLine`; r6 trim line uses this)
- Type: tool-limitation (shared helper contract; the drop is silent, no error)
- Tags: 2D / painted / p5.brush / projection / thin lines / WORLD FOG S01-SH02
- Scope: `src/painted/worldfog/draw.ts` (`projectPoly` ends with `return out.length >= 3 ? clipScreen(...) : []`); `src/painted/worldfog/car.ts` (`paintCabin`, `paintSedanBody`)
- Consumers: WFOG-EP01-SHORT S01-SH02 only (the sedan). Grep of `src/painted` (2026-10-30): the six two-point `projectPoly` calls are all in `car.ts`

## Symptoms and evidence
- Check (scratch, 2026-10-30, `out/logs/r6-projectpoly-check.log`): `projectPoly` with two points returns 0 points; with three points, 3. `proj.P` per point gives the 0.70 m line at plate y 1076, x 153–528.
- r6 trim line first written as a two-point `projectPoly`: no pixels; far-door band p05 (y 1066–1086) stayed at the r5 value 0.2370. After projecting point by point the p05 is 0.2306 at G180 (`out/qa/world-fog/WFOG-EP01-SHORT/r6/far-door/`).
- Existing two-point lines in r5 that were never drawn: `topEdge` (head top edge), `dash` (dash line), `crease` and `chrome` (body lines), `seamF` and `seamB` (door seams). Their `if (…length)` guards hide the miss.

## Attempts and results
- `onSide(...).map((q) => proj.P(q))` + `inkLine(..., {closed: false})` draws the trim line (r6, `car.ts`).
- The r5 lines are left as built. Drawing them changes the S01-SH02 car look (new seams, crease, chrome, dash line and head-top edge), so it needs a Film/Mark look decision first. Not done in r6.

## Planning impact
- Film/Mark: the r5 sedan has no crease, chrome, seams, dash line or head-top edge in its frames. Adding them is a visible change to S01-SH02; decide before the next look review.
- Boss: a new thin line uses `proj.P` + `inkLine`, or a polygon of at least three points through `projectPoly`.

## Revalidation history
- 2026-10-30, worktree `claude/world-fog-next-steps-2817bc` (uncommitted r6): two-point and three-point behaviour checked by scratch run; trim line drawn after the fix (luma and crop checked).
