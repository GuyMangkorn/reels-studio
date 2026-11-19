# T20 — plates B02-SH01 (crane into the buffet, place tag) and B02-SH02 (the farmer at the gate) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
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
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
