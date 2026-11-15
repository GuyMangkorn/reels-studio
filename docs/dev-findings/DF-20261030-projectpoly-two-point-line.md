# DF-20261030-projectpoly-two-point-line — `projectPoly` returns nothing for two points; sedan lines never drew

- Owner: Boss; first observed: 2026-10-30 (WFOG r6 far-door trim line left no pixels); last checked: 2026-10-30
- Status: fixed (see the 2026-11-15 revalidation line)
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
- 2026-11-15, `claude/dev-finding-review-b2efff` (working tree): `projectLine(proj, a, b)` added to `src/painted/kit/draw.ts` (near-clips and projects a two-point line); `projectPoly` now throws on fewer than three points, so the drop is no longer silent (`tests/draw-project-line.test.ts`, 3 of 3). The six `car.ts` calls that never drew were removed as dead code, so the S01-SH02 picture is unchanged by construction (no still re-rendered). To add them after a Film look decision, use `projectLine` with: head top edge `[dx-1.75,1.32,4.5]→[dx-1.25,1.32,4.5]` (w 1.0, `#4a5254`); dash `[dx-1.90,1.0,4.6]→[dx-0.95,1.0,4.6]` (w 1.5, `#3a4144`); crease `onSide([[-3.40,0.62],[0.25,0.62]])` (w 0.8, `#4d5457`); chrome `onSide([[-3.30,0.91],[0.25,0.91]])` (w 0.8, `#a6acae`); shut-door seams `onSide([[-0.90,0.30],[-0.90,0.98]])` and `onSide([[-1.92,0.30],[-1.92,1.40]])` (w 0.8, `#23292b`). Status fixed.
