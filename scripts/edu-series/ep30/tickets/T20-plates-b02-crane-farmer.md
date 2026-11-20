# T20 — plates B02-SH01 (crane into the buffet, place tag) and B02-SH02 (the farmer at the gate) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: fix pass 1 in T38 (R9 Film look check: SH02 accept; SH01 fix) · was: ready · r2: Film notes added (TICKETS-R8)
Class: set (plates) · Hard: yes (flock peck sync, farmer arm and face)
Blocked by: T03, T08, T09, T12 · Consumers: B02-SH01, B02-SH02 (global 200–439)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot blocks [b02.md](../short/scene-sheets/b02.md) B02-SH01 and B02-SH02 (authoritative).

## Build
Replace the two stub shot files with the plates.
Files: `src/painted/edu30/shots/B02-SH01.tsx`, `src/painted/edu30/shots/B02-SH02.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Both | space P, light m 0, eaten 0.4, stubble 0, newsreel warm strength 1 | T09 schedule |
| B02-SH01 camera | start eye (0, 22, 12), yaw 0, pitch −40, f 820, hy 960 → end eye (−3.0, 1.3, −25.0), yaw 10, pitch −4, f 900, hy 860: every field interpolated with e = ease-in-out(L / 100) for L 0–100; L 100–154 the eye drifts 0.15 m along the view toward the row (linear) | b02 B02-SH01 Camera |
| B02-SH01 wheat | the T09 high-view wheat while pitch ≤ −20° (from about L 0 to L 60), the normal ridges after; switch at the frame where pitch crosses −20° (no visible pop: both painters agree within 30 m) | T09 high-view row |
| B02-SH01 set | the whole plan: farmhouse (−90, 0, −160), salmon gums A, B, C, scrub line, fence, track, camp (tent and drum), gun clearing empty (no crew, no G1) | brief space P; b02 B02-SH01 |
| B02-SH01 flock | T08 `buffetRow(L)` (six birds) + F1 `flockIn(31000, 40, [−30, 30], [−60, −30])` in seeded stand/peck/walk on the ambient clock + `paintFarFlock` z −80..−200 | b02 B02-SH01 Staging |
| B02-SH01 title | T02 row 1 (place tag) via the adapter | T02 |
| B02-SH02 camera | eye (−2.2, 1.45, 7.6) → (−2.2, 1.45, 7.2), yaw −1° → −8.5°, pitch −2, f 900, hy 860, ease-in-out L 0–84 | b02 B02-SH02 Camera |
| B02-SH02 FARMER | T12 G (casting line, arm keys, face, talk mouth) at (−2.5, 0, 5.2) facing +z, front | b02 B02-SH02 Staging |
| B02-SH02 emu | one bird at (−3.6, 0, 3.0) (inside the paddock, behind his right shoulder), pecking: peck cycle as `buffetRow` with the full peck at **L 40**, stand otherwise; feet planted | b02 B02-SH02 |
| B02-SH02 set | eaten paddock behind him; the open gate as locked; the fence | T09 |
| Probe leads | B02-SH01: nearest buffet bird (head-up) at L 100 and 154; B02-SH02: FARMER | T03 probe |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TP2.png` (the high view to un-stripe), `LF01a.png` (paddock values).

**Judgment for the builder (Hard).** The buffet dip is one frame for all six (L 135); before it the six peck out of phase like real birds. The farmer's point is one clear gesture with a continuous arm; his turn to the lens on "เรียก" reads through the eyes.

## r2 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R8`)
These override any older value in this ticket that they name.
- **Farmer point (T12 r6, TF27 as built).** Paint FARMER through T12's solve as built: right mitten 0.50 m from the shoulder along d = (−0.873, −0.218, −0.436), elbow flexion 55.6°, open oval mitten with no thumb. At L 9 and L 45 log the screen distance from the shoulder → mitten line to the emu head (T12 measured 50.1 px on the sheet camera; pass ≤ 60 px on the plate camera). The SH02 row's `thumb check` line reads `thumb check: FARMER RIGHT: open oval, no thumb drawn (unshaped kit); edge to the lens`.

## Proof
- Stills (`out/edu30-T20/`): SH01 L 0, 60, 100, 134, 135, 151; SH02 L 0, 9, 40, 47, 53, 84.
- `scripts/qa-sheet.sh out/edu30-T20/sheet.png --cols 6 --width 270 out/edu30-T20/s*.png`; `measure-shots.ts B02-SH01 100,154` and `B02-SH02 0,84`; clean L 0 and L 100 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH01 L 0 | paddock + flock + place tag at 270 px, no stripes | T09 stripe test peak-to-peak ≤ 12 |
| SH01 L 100 | nearest emu big, the row receding | nearest bird ≥ 480 px (sheet 510) |
| SH01 L 135 | six heads down together | 6 of 6 at peck |
| SH02 L 9 / 53 | arm pointing back (screen left) / eyes at the lens | FARMER 604 → 715 ± 30 px; `thumb check` line |

## Result (Boss fills)
Commit: see `git log` on this worktree branch (T20 commit) · fix passes used: 0 · Sonnet medium, 20 Nov 2026 · proof: store `projects/edu/EDU/previews/T20-sheet.png` (12 frames, 270 px), per-frame `T20-s1_<L>.png`, `T20-s2_<L>.png`, clean `T20-clean_s1_0.png`, `T20-clean_s1_100.png`, `T20-clean_s2_40.png` (local `out/edu30-T20/`, logs `out/logs/T20-*.log`). `npx tsc`: 8 error lines, none in the two shot files (environment `three` / `hippo`). `npm test`: 477/486 pass; the 9 failures are HIPPO.YAWN/CHARGE/HALT (known EP18 debt) and loudness, new-shot, render-inputs, segments, store adopt and `canvasStyleOf` test (d) (B03-SH01 L2 overscan, T24 r5 owns it), none touching these plates.

**Built** (`B02-SH01.tsx`, `B02-SH02.tsx`; no other file): space P, light 0, eaten 0.4, stubble 0 through `paintPaddockScene`. SH01: camera fields eased with smoothstep(L/100) then a 0.15 m linear drift along the view L 100-154; the T09 high-view wheat switches by itself at pitch <= -20 deg (L about 56); `buffetRow(L)` plus F1 `flockIn(31000, 40, [-30, 30], [-60, -30])` re-posed per frame on the shot's own L (peck cycle 15 f in eighths, walkers 0.6 m/s by `gaitPhase`, stand), far mass `far {n 150, x +-150, z -200..-80}`. SH02: eased camera L 0-84, FARMER through T12 `paintCrewPose` 'farmer' at (-2.5, 0, 5.2), one emu at (-3.6, 0, 3.0) facing -x.

**Measured against the Proof table** (`measure-shots.ts`, px)

| Row | Number | Pass range | Result |
| --- | --- | --- | --- |
| SH01 L 0 stripe test, row-mean luma, trend removed | 6.6 over y 800-1180 (clean ground band); 18.3 over y 450-640; 54.3 over y 450-1180 | <= 12 | band pass; the full-height number holds the eaten patch, fence, vignette and flock (T09 Q-A measured the same way on a bare variant, which this plate has none of); frame viewed: no stripes or arc rows |
| SH01 L 100 / 154 nearest bird (head-up) | 537 / 567 | >= 480 (sheet 510) | pass |
| SH01 L 135 six heads down | all six at u = 1 (`buffetRow`, T08), viewed L 134, 135 down, L 151 up | 6 of 6 | pass |
| SH02 L 0 / 9 / 53 / 84 FARMER | 619 / 622 / 694 / 735 | 604 -> 715 +- 30 | pass |
| SH02 L 9 / 45 line shoulder -> mitten to emu head | 13.0 / 15.7 (head anchor, grazing u 0.75); 50.4 / 56.1 to the sheet's head point (-3.6, 1.0, 3.0) | <= 60 | pass |
| SH02 farmer solve | flexion3 55.6 deg, reach 0.460 m, drawn flexion 69.3 / 71.2 deg, arm ratio 0.833 / 0.807 | 55.6 deg, 0.50 m from the shoulder | as built by T12 |
| Caption zone (clean frames) | SH01 L 0 mean 0.894, p95 0.907; L 100 mean 0.65, p95 0.914; `pass: false` at the script defaults | no range in the ticket | measured |

`thumb check: FARMER RIGHT: open oval, no thumb drawn (unshaped kit); edge to the lens` · `arm check: FARMER right: attached ok` (arm ratio <= 1.05 on L 9, 45) · emu feet planted (static `at`, stance not animated; slip 0).

**Values I could not follow / judgement calls (return to Film)**
- **SH02 emu carriage.** The sheet gives a pecking head at 1.0 m; the standing head is 1.60 m and misses the pointing line by 177 px. The emu holds a grazing carriage (u 0.75, head 0.69 m) all shot with the full peck (u 1.0) at L 40, instead of "stand otherwise"; line 13 / 16 px.
- **SH01 stripe measure.** No bare variant of this camera exists, so the <= 12 test is met only on the clean band y 800-1180 (6.6); the rest of the frame holds scene content. Frame viewed.
- **SH01 L 60 arcs.** At L 60 pitch is -16.7 deg, past the -20 deg switch, so the T09 ridge rows paint (concentric arcs near the lens, a T09 limit): visible from the switch (L about 56) while the camera descends, as in the viewed L 60 frame; reported, not fixed (T09 owns the ridge painter).
- **Seek and walkers.** Every helper is a pure function of L; F1 walkers' foot slip was not measured (far birds, > 12 m).
- Render note: pose keys are cached, so continuous blends of a 40-bird flock (not quantised) rebuilt every bird and timed out at 180 s; F1 peck blends are quantised to eighths.

## R9 look check and decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
These override any older value in this ticket that they name.
Viewed: store `T20-sheet.png` (12 frames). **Verdict: SH02 accept with value change; SH01 fix (in T38).**
| Item | Decision | Reason |
| --- | --- | --- |
| SH02 emu carriage | accepted: grazing carriage (u 0.75, head 0.69 m) all shot, full peck at L 40; line to head 13.0 / 15.7 px. TF42 | the pointing line meets the bird's head; a standing head would miss it by 177 px |
| SH01 stripe test | met on the clean band y 800–1180 (6.6 ≤ 12); the full-frame number holds scene content | frame viewed: no stripes at L 0 |
| SH01 L 56–100 ridge arcs | **fix**: concentric ridge rings show while the eye is high after the −20° switch (L 60 viewed). Cause in T09's ridge painter (rings round the eye seen from 8–10 m up). Fixed in `paddock.ts` by **T38 row P1** (ridges start at r0 = 2.5 + 6 (eye y − 3) m above 3 m, high-view texture inside); B02-SH01 is re-proven there. TF47 | one owner for the set painter; no plate workaround |
| Caption zone | L 0 0.894 / 0.907 under the TF46 high-view exception (≤ 0.92); L 100 0.65 / 0.914 pass | edu stroke captions; Editor confirms legibility in the draft cut |
