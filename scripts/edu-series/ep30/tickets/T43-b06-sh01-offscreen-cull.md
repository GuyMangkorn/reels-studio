# T43 — B06-SH01 skips the slow-line emus that lie wholly outside the picture (render cost, no look change)
Deliverable: EDU-EP30-SHORT · Revision: r1 (Film, 2026-11-20, cost-versus-look pass) · Status: ready
Class: set (plate, render cost) · Hard: no (no figure, pose or motion change; the painted pixels must not change)
Blocked by: **the running EP30 half-size draft cut** (do not commit before the draft cut is assembled: a source change re-keys scene 23 in the scene cache and a re-run of the draft command would repaint it, about 3.4 h). Also: no `paint-bench` run while any render job runs (RAM limit, coordinator 2026-11-20). · Consumers: B06-SH01 (scene 23, f1434–1543, 110 f)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); [T31](T31-plates-b06-tanks-bow.md) Result; [T30](T30-plates-b05-withdrawal-wave.md) Result item 1 (render budget: five near birds about 1.37 M brush ops); TF77 in the [index](index.md).

## Why (Film, 2026-11-20)
- **Measured** (coordinator, `paint-bench` at paintScale 0.5 + paintDraft, `out/EDU-EP30-SHORT/bench/timings.jsonl`): f1480 still 110,976 ms, brushCalls 103,335 ms, 1,370,132 brush calls, 162,861 `polygon:wash` (83,257 ms), 57,525 `spline` + `set`. A light frame (f450) has 424 washes, 2.6 s.
- **Source of the bulk: the five near-LOD emus, not the wheat.** B06-SH01 paints `slowLine(L)` (5 birds, `flock.ts`) through `paintFlock` with automatic LOD; every bird is within 3.3–5 m of the f 1020 camera, so `camUnit` ≥ `LOD_PX` 220 and each paints the near build: every visible loft quad is one `hardFill` (one `polygon:wash`) plus `texCells(n, px, …)`² plumage cells (`survival/beast.ts` lines 148–157, floor n = 3, so at least 9 cells a quad, up to `TEX_MAX_N` 14²), each cell one more `hardFill`, and a cell gets an ink line (`spline`) when its hash `r2` < `tex.scale`. Evidence: (1) the total 1,370,132 calls equals T30's measured "five near-LOD birds about 270 000 brush ops each (1.37 M)"; (2) splines / washes = 57,525 / 162,861 = 0.353, which is the cell-ink share the code predicts (P(r2 < 0.25) = 1/3 for the body and thigh `TEX`, 1/2 for the legs' `scale: 0.5`). The wheat cannot be it: `paintWheatRidges` at eye 0.6 m paints 26 rows × at most a few `hardFill` runs (≈ 80 washes) plus about 790 ink strokes (rows with r < 12 m and < 14 m, 65 and 33 samples), and `paintPadGround` about 15 fills.
- **Three of the five birds paint off the picture.** At f1480 (L 46) the frame shows two birds (SLOW_X index 1 and the hero, index 2; viewed `out/EDU-EP30-SHORT/bench/f01480.png` at 540 px). Film's projection estimate with the plate camera (`camSpace`, f 1020, no overscan): index 4 (x 2.2) lies right of x 1434 px on every frame; index 0 (x −4.6) leaves the left edge during the shot (a ±0.45 × ±0.95 × 2.1 m box is off the picture from L 70); index 3 (x 0.6) sits at or beyond the right edge. Painting them costs the same washes as a visible bird and adds no pixel.
- **Decision:** cut the cost without touching the accepted look by not painting a bird whose whole painted extent (body, mop, legs and its ground shadow) is outside the canvas. Rejected: `lod: 'far'` on the four non-hero birds (T30: far birds read flatter and darker; index 1 is a subject of the "like tanks" line), a coarser texture-cell rule in `beast.ts` (changes the plumage grain on every accepted emu plate and the shared creature kit), a wheat level of detail (not the source).

## Build
In `src/painted/edu30/shots/B06-SH01.tsx` only: before `paintFlock`, probe each `slowLine(L)` member with `paintEmu(null, c, m, {sun})` (no paint; returns `BeastAnchors`) and pass to `paintFlock` only the members that pass the on-screen test below. Painter's order, seeds, poses, scales, `slowDust`, MEREDITH and the `pr` hero probe stay exactly as they are (the dust of every bird is still painted).
Casting line: unchanged (T31 as built).
Files: `src/painted/edu30/shots/B06-SH01.tsx`.

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Members tested | all five `slowLine(L)` members, every frame L 0–109; the hero (index 2) is tested like the others (it never leaves the picture) | ticket |
| Probe | `const a = paintEmu(null, c, m, {sun})`, same `c`, `m`, `sun` as the paint call | ticket (B06-SH01 already probes the hero this way) |
| Shadow pad | `sp = 0.2 * camUnit(c, [m.at[0], 0, m.at[2]])` px. Reason: the body shadow ellipse (`emu.ts` shadow s −0.05, rs 0.5, rl 0.24) lies inside the body's own extent (loft radius 0.25, length −0.5..0.44 m); the foot shadows reach 0.5 × (0.5 / 6 + 0.3) = 0.19 m round each foot, the only painted part that can lie outside the anchor box | `beast.ts` ground-shadow block, `emu.ts` line 252 |
| Stroke pad | 40 px each side (widest beast ink 1.1–1.6 px plus `grow` 0.35–0.5 px, with a wide margin) | ticket |
| Cull test | skip the member when `a.drawn.length === 0`, or `a.right + 40 + sp < 0`, or `a.left − 40 − sp > 1080`. No vertical test (the birds stand mid-frame) | ticket; canvas x 0–1080 (`camToPicture` centre 540, B06-SH01 has no `overscan`) |
| Expected culls (Film estimate, the log decides) | index 4 on all 110 frames; index 0 on the late frames (at least L 70–109); index 3 and index 0 at L 46 if their real silhouettes clear the pads | projection estimate above |

## Proof
Run only when no render job runs. Commands (`PATH=~/.nvm/versions/node/v22.18.0/bin:$PATH`):
1. Before the edit (on the commit before T43): `node scripts/paint-bench.mjs EDU-EP30-SHORT out/bench/T43-before --frames=1434,1480,1530,1543 --props='{"paintScale":0.5,"paintDraft":true}'` and an A/A run `… out/bench/T43-aa --frames=1480,1530 …` (same props).
2. After: `node scripts/paint-bench.mjs EDU-EP30-SHORT out/bench/T43-after --frames=1434,1480,1530,1543 --props='{"paintScale":0.5,"paintDraft":true}'`.
3. `node scripts/paint-bench-compare.mjs out/bench/T43-before out/bench/T43-aa` (the noise floor) and `node scripts/paint-bench-compare.mjs out/bench/T43-before out/bench/T43-after`, both logged to `out/logs/T43-compare.log`.
4. Cull log: a no-paint loop (`paintEmu(null, …)` with the same rule, L 0–109, no Chrome) listing the culled indices per L, to `out/logs/T43-cull.txt`.
5. `python3 -I scripts/caption-zone.py --band 1150:1344 --max-mean 0.80 --max-p95 0.99` on before and after f1480 and f1530 PNGs.
6. `scripts/qa-sheet.sh out/bench/T43-sheet.png` of before and after f1480 and f1530 (4 tiles, 270 px), viewed; file the sheet and both bench folders' PNGs in the store (`store.py archive --path out/bench/T43-after --project EDU --kind previews`).

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| f1434, f1480, f1530, f1543 | the same picture as before: two birds at f1480 (index 1 and the hero), the MEREDITH shoulder, wheat, fence and sky unchanged | `paint-bench-compare` before → after: changed channels, max difference and PSNR **no worse than the before → A/A pair** on f1480 and f1530; on f1434 and f1543, PSNR no lower than the worst A/A PSNR |
| f1480, f1530 | — | `polygon:wash` count after **<** before (162,861 at f1480); report both counts, `brushCalls` ms and still ms per frame (no threshold on the size of the cut: the change is kept whenever the picture holds, since it costs no look) |
| L 0–109 | — | cull log: index 2 (hero) and index 1 never culled; index 4 culled on all 110 frames; report the frames for index 0 and 3 |
| f1480, f1530 | caption band | caption-zone mean and p95 after = before to 3 decimals (reference G1489: 0.764 / 0.901) |
| all | — | `npx tsc --noEmit -p .` clean for `B06-SH01.tsx`; `npm test` with no new failure |

Stop rule: if the picture check fails (any visible difference beyond the A/A floor), revert, report the frame and the bird index in the Result, and do not widen the pads on your own; Film decides. No fix pass on this ticket beyond one.

## Result (Boss fills)
Commit · proof sheet path · measured numbers (washes and still ms before/after per frame, compare lines, cull log summary, caption numbers) · fix passes used · open question, if blocked
