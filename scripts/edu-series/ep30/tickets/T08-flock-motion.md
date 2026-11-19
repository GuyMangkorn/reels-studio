# T08 — flock motion helpers: buffet peck sync, rising heads, scatter, six-group burst, the queue with its unison step
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: movement · Hard: yes (animal movement)
Blocked by: T07 (uses T06 poses and `mixEmuPose`; both write `looks.ts`) · Consumers: B01-SH02, B02-SH01, B02-SH05, B03-SH01, B03-SH02, B03-SH03 (followers), B04-SH02, B04-SH03, B04-SH05, B06-SH01
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules) (Hard-ticket checks, clocks), [flock.ts](../../../../src/painted/edu30/flock.ts) (`EmuMember`, `flockIn`, one build per pose key, `LOD_PX`), shot blocks named in each row below.

## Build
Pure functions in `src/painted/edu30/flock.ts` that return `EmuMember[]` for a shot-local frame (no state between frames), so plates only place the result. Reuse one build per quantised pose key (walk/run phase quantised to 1/16 cycle) to keep a 60-bird frame cheap.
Files: `src/painted/edu30/flock.ts`, `src/painted/edu30/looks.ts` (proof stills `FL-buffet`, `FL-scatter`, `FL-queue`), `tests/edu30-flock.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Walk phase | phase(L) = phase0 + v × L / (30 × `gaitAdvance(stride)`) (T06); stance foot static | T06 contact rule |
| `buffetRow(L)` (B02-SH01) | six birds at (−3.0 + 0.8 i, 0, −28.0 − 1.6 i), i 0…5, heading so they face −x (left views); peck cycle 15 f (down f 0–5 ease-in-out stand→peck, hold f 5–8, up f 8–15), phase offset seeded 0–14 f per bird, until L 125; L 125–128 all mix to head up (stand) and hold to L 131; L 131–135 all down to peck together, full peck exactly at **L 135**; hold 135–139; up 139–145; stand after; feet planted (no walk) | b02 B02-SH01 Staging |
| `risingHeads(L)` (B02-SH05) | six groups g 0…5 rising at L 20 + 5g; group sizes 5, 3, 8, 4, 6, 7 (seeded positions in x −20..+20, z −15..−60, min spacing 1.2 m); each head mixes from peck (head below the wheat top: head y 0.6) to stand over 5 f, ease-out; `headYaw` = `emuLensYaw` (T07) aimed at the crew point (0, 1.0, 0.85) instead of a camera eye | b02 B02-SH05 Staging |
| `scatter(L, o)` (B03-SH01) | F1: 40 birds from `flockIn` around (0, 0, −45) in stand/peck at L < 37; delay d per bird seeded 0–6 f; startle at L 37 + d (T06 startle motion, d+0 → d+2 snap, hold to d+5); from L 41 + d the bird runs: clump = one of 4 by the bird's x (two clumps run toward world −x = screen left, two toward +x = screen right; each clump's heading is its axis ± a seeded 0–25°, one clump angled away from the camera, one toward it), speed ramps 0 → 6 m/s over 6 f, run phase from speed | b03 B03-SH01 Flock F1 row, brief VD30-11 Birds |
| `burst(L)` (B03-SH02) | the same 40 birds continuing from B03-SH01's L 66 state; six groups (assignment: nearest of six headings 15° + 60° k, k 0…5, seeded per bird), speed U(6, 8) m/s, all groups past the frame edges by L 45 at the sheet camera; dust trail = 3 `paintPlume` puffs behind each group per frame | b03 B03-SH02 Staging |
| `followers(L)` (B03-SH03) | three birds at (5.0, 0, −32.4), (4.2, 0, −33.0), (3.4, 0, −32.6) running +x at 3.9 m/s, run phase offsets 0.3, 0.55, 0.8 cycles | b03 B03-SH03 Staging |
| `queue(L, path, o: {sHead(L); spacing 1.4; n 25})` (B04-SH02/03/05) | bird i at arc length sHead(L) + 1.4 i along `path` (T10 `QUEUE_PATH`), heading = path tangent toward the gun, y from the path's ground; beyond 40 m from the camera use `paintFarFlock` (painted mass) instead of birds | b04 Space D continuity |
| sHead for B04-SH02 (queue head x along the rim z −4.9) | **L 0–40: stands at x 4.6** (weight shift idle: head bob ±0.02 m on a seeded 20–30 f cycle per bird); **L 41–49: every bird steps forward 0.6 m together** (one step, ease-in-out, each bird's rear foot lifts L 41 and lands L 49); L 49 at x 4.0; L 49–68 walks on at 0.32 m/s to x 3.8 at L 68 | b04 B04-SH02 (Film fix: the sheet's "walks 0.3 m/s from 4.6" and "4.0 by local 49" cannot both hold with the 0.6 m step; the end positions 4.6 → 4.0 → 3.8 and the unison step are kept, so the line stands before the step) |
| sHead for B04-SH03 | x 3.6 at L 0 → 3.0 at L 46, 0.39 m/s; flinch/hop overrides per bird from T06 (nearest 6: duck-flap from L 11; birds 2 and 4 hop toward −z (into the shallows) from L 18, splash at L 24, walk back to the rim by L 40) | b04 B04-SH03 Queue row |
| B04-SH05 | queue standing (no walk): head bird is EMU-HERO at x 1.6; every bird `headYaw` = `emuLensYaw` (T07) to the B04-SH05 camera | b04 B04-SH05 |
| `slowLine(L)` (B06-SH01) | five birds abreast at x −3.0, −1.4 (EMU-HERO), 0.6, plus x −4.6 and 2.2 (beyond the edges), z −4.6 at L 0 → −3.8 at L 110 (0.218 m/s), walk phase rate from that speed (stance static: cycle ≈ 84 f); EMU-HERO's foot contacts at L 13, 55, **97** (L 97 = "ถัง"); the others offset 7, 19, 31, 41 f | b06 B06-SH01 Staging |
| Paddock extras (B01-SH02) | EMU1 (6.2, 0, −27.1) → (4.6, 0, −27.1) heading −x, stride set so the body advance per cycle is 0.80 m and the cycle is 30 f: contacts left L 4, 34, right L 19, 49 (matches SFX-B01-SH02-2); peck head blend L 30–40 over the walking legs (down 30–34, hold 34–36, up 36–40); EMU2–5 at the sheet positions, 0.6–0.9 m/s seeded, headings −x ± 20° | b01 B01-SH02 Staging |
| No bird hit | no pose or helper ever lays a bird down or tumbles it | brief CAT02 |

**Judgment for the builder (Hard).** Planted feet are the test: on dirt every stance foot holds its world position (slip ≤ 0.02 m) and a stopped bird has both feet down. In wheat the feet may be hidden by the near stalks but must still not slide. The unison step must read as comic precision: the same frames for every bird, one step only.

## Proof
- `node scripts/test.mjs tests/edu30-flock.test.ts`: `buffetRow(135)` all six at full peck and none at 134 or 140 fully down; `queue` positions 1.4 m apart along the path; stance-foot slip ≤ 0.02 m over a 30 f walk for EMU1; same result for frame L computed alone or after 0…L.
- Proof stills (in `looks.ts`, KP camera family): `FL-buffet` at L 130 and 135, `FL-scatter` at L 36, 44, 60, `FL-queue` at L 40, 45, 49 (the step). `render-looks.sh T08 …` then `qa-sheet.sh --cols 4 --width 270`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| FL-buffet 135 | six heads down on the same frame | 6 of 6 at peck (logged head y ≤ 0.5 m) |
| FL-scatter 44 / 60 | heads up then clumps running apart, no bird lying down | ≥ 3 clumps separated by ≥ 4 m at L 60 |
| FL-queue 45 | every bird mid-step | all rear feet lifted (logged) |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
