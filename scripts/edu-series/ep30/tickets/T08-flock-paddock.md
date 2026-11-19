# T08 — flock motion in the paddock: buffet peck sync, strolling extras, the field of rising heads, scatter, six-group burst, the split by halves, fence birds, the slow-motion line
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready (scatter timing depends on open Q8)
Class: movement · Hard: yes (animal movement)
Blocked by: T07 (uses T06 poses, `mixEmuPose`, `gaitAdvance` and T07 `emuLensYaw`, `nod`) · Consumers: B01-SH02, B02-SH01, B02-SH06, B03-SH01, B03-SH02, B03-SH03 (the group), B05-SH03, B05-SH04, B06-SH01, B06-SH03, B06-SH04; T16
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Hard-ticket checks, clocks); [flock.ts](../../../../src/painted/edu30/flock.ts) (`EmuMember`, `flockIn`, one build per pose key, `LOD_PX`); the shot blocks named in each row.

## Build
Pure functions in `src/painted/edu30/flock.ts` that return `EmuMember[]` for a shot-local frame (no state between frames); plates only place the result. One build per quantised pose key (walk/run phase quantised to 1/16 cycle) keeps a 60-bird frame cheap. EMU-HERO, where it is a member, is `hero: true`, seed 36000.
Files: `src/painted/edu30/flock.ts`, `src/painted/edu30/proof-flock.tsx` (adds `FL30-*` compositions), `tests/edu30-flock.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Walk phase | phase(L) = phase0 + v × L / (30 × `gaitAdvance(stride)`) (T06); stance foot static | T06 contact rule |
| `paddockExtras(L)` (B01-SH02) | EMU1 (6.2, 0, −27.1) → (4.6, 0, −27.1) heading −x, stride so the advance per cycle is 0.80 m and the cycle 30 f: contacts left L 4, 34, right L 19, 49 (SFX-B01-SH02-2); peck blend L 30–40 over the walking legs (down 30–34, hold 34–36, up 36–40); EMU2–5 at (5.0, 0, −24.8), (3.6, 0, −25.6), (7.8, 0, −23.5), (2.4, 0, −28.0), seeds 36101–36104, 0.6–0.9 m/s seeded, headings −x ± 20°; no head turns toward the truck | b01 B01-SH02 |
| `buffetRow(L)` (B02-SH01) | six birds at (−3.0 + 0.8 i, 0, −28.0 − 1.6 i), i 0…5, facing −x; peck cycle 15 f (down f 0–5 ease-in-out stand → peck, hold 5–8, up 8–15), seeded phase 0–14 f per bird until L 125; L 125–128 all mix to stand, hold to 131; L 131–135 all down; full peck exactly at **L 135** (global 335); hold 135–139; up 139–145; stand after; feet planted | b02 B02-SH01 |
| `headsField(L)` (B02-SH06) | 36 members seeded (seed 36200) in x −0.5..+6.0, z −11..−5, min spacing 0.7 m; excluded: a 1.2 m circle round EMU-HERO (1.0, −8.0) and a 0.9 m band either side of the sightline from the end camera (2.4, −12.2) to the crew centre (0.05, 0.8) in the xz plane (the three men stay unblocked). Pose: **sitting in the wheat** (emus sit on their hocks): bob −0.55 (back top ≈ 0.45 m, under the 0.85 m wheat), pads under the body; head joint y 0.60 (low) → 1.60 (up). Groups g 0…5 by z band, nearest the camera first (g0 z −11..−10 … g5 z −6..−5), rising at local **52, 55, 58, 61, 64, 67** over 6 f each, ease-out. Heading: the direction to the crew ± 90° (seeded side), so each head shows a clean side profile to the lens with its near eye turned to the crew | b02 B02-SH06 (heads squared to the lens, eyes to the crew; necks emerge from the wheat) |
| `scatter(L)` (B03-SH01) | F1 = `flockIn(31000, 40, [−30, 30], [−60, −30])` around (0, 0, −45), stand/peck before L 4; startle at L 4 + s, s seeded 0–2 (nearest first) (T06 startle motion); bunch L 10–38: each bird walks toward its clump centre so the band closes by 35 %, walk phase from speed; bolt at L 40 + d, d seeded 0–6: run, speed 0 → 6 m/s over 6 f. Four clumps by x quartile: two run toward −x (screen left), two toward +x; each clump heading = its axis ± seeded 0–25°, one clump angled away from the lens, one toward it | b03 B03-SH01 Flock F1 row; VD30-11 Birds |
| `burst(L)` (B03-SH02) | the same 40 continuing from `scatter(71)`; six groups by nearest of the headings 15° + 60° k (k 0…5, seeded per bird), speed U(6, 8) m/s, all past the frame edges by L 45 at the sheet camera; dust trail = 3 `paintPlume` puffs behind each group per frame. EMU-HERO's group (11 birds incl. the hero) runs toward (12, 0, −32), the B03-SH03 mark (Film fix: the sheet says "+x/−z"; the B03-SH03 mark is +x/+z of the flock centre and wins) | b03 B03-SH02, B03-SH03 |
| `halves(L)` (B03-SH03) | 10 birds bunched behind EMU-HERO (12.0, 0, −32.0), facing +z, stand idle, in two loose rows at z −33.5 and −35.0 (±0.4 seeded): left half 5 birds x 10.4..11.9, right half 5 birds x 12.1..13.6 (seed 36300). Left half: turn to heading −x over 3 f from L 7 + d (d seeded 0–3), run 0 → 5.5 m/s over 4 f, exit frame left by L 22 (x ≤ 6.0). Right half: the same toward +x from L 23 + d, exit right by L 38 (x ≥ 18.0). One dust puff per footfall (`paintPlume`, 0.25 m); feet touch the dirt (no slide). Nobody runs through the hero | b03 B03-SH03 Staging |
| `fenceBirds(state)` (B05-SH03, B05-SH04, B06-SH03, B06-SH04) | contact rule (Film fix): every body front (the build's max creature x at stand, measured once) stays ≥ 0.08 m behind the wire plane z 6.0, so `at.z ≤ 5.92 − front`. Front row at that z: F2 x −1.4, F3 x 0.5, F4 x 1.4 (+ added x 1.9 and x −1.9); back row 0.5 m behind it: F5 x 0.95 (+ added x −1.0 and x 0.0); EMU-HERO keeps (−0.5, 0, 5.3) if it passes the rule, else the rule's z. Five birds = HERO, F2–F5; added at B06-SH03 local 66 (x −1.0), 74 (x 1.9), 82 (x −1.9), 90 (x 0.0) → nine. All face +z, stand; ambient heads follow the truck: `headYaw` toward the truck × 0.3, clamped ±0.3 rad (not the hero in B06-SH03, which is frozen in every jump) | b05 B05-SH03/SH04, b06 B06-SH03/SH04; fence z 6.0 |
| `slowLine(L)` (B06-SH01) | five birds abreast at x −4.6, −3.0, −1.4 (EMU-HERO), 0.6, 2.2, z −4.6 at L 0 → −3.8 at L 109 (0.22 m/s), walk at 40 % cycle speed with phase from that speed (stance static); EMU-HERO contacts at L 12, 54, **96** (global 1530, "ถัง"); the others offset 7, 19, 31, 41 f; at L 109 EMU-HERO stops with both feet down; dust puff at each footfall | b06 B06-SH01 |
| No bird hit | no pose or helper ever lays a bird down or tumbles it | brief CAT02 |
| Render cost | log the time of one 60-bird frame (`scatter(44)` + far mass) at half size | brief technical handoff (Loading) |

**Open-question dependency (Q8).** The scatter frames are tied to round 1 (local 2) and L06's "ยิงใส่ฝูง" (local 40); the alternative moves round 1, and `scatter` then takes its startle frame from round 1 + 2.

**Judgment for the builder (Hard).** Planted feet are the test: on dirt every stance foot holds its world position (slip ≤ 0.02 m) and a stopped bird has both feet down. In wheat feet may be hidden by the near stalks but must not slide. The buffet dip and the halves' departures must read as comic precision: the same frame for every bird in the dip, one clean peel-off per half. The heads field must read as many heads popping up, never as floating heads: each neck enters the wheat.

## Proof
- `node scripts/test.mjs tests/edu30-flock.test.ts`: `buffetRow(135)` all six at full peck, none fully down at 134 or 140; `headsField` keeps every member outside the sightline band; `fenceBirds` bodies behind the wire; stance-foot slip ≤ 0.02 m over 30 f for EMU1; frame L alone equals frame L after 0…L.
- `proof-flock.tsx` compositions on the sheet cameras: `FL30-buffet` (B02-SH01 end camera) L 130, 135; `FL30-heads` (B02-SH06 camera) L 48, 58, 74; `FL30-scatter` (B03-SH01 camera) L 3, 6, 44, 60; `FL30-halves` (B03-SH03 camera) L 6, 14, 30; `FL30-fence` (B05-SH04 camera) L 0; `FL30-slow` (B06-SH01 camera) L 0, 96. `scripts/qa-sheet.sh out/edu30-T08/sheet.png --cols 5 --width 270 out/edu30-T08/*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| FL30-buffet 135 | six heads down on the same frame | 6 of 6 at peck (head y ≤ 0.5 m, logged) |
| FL30-heads 58 / 74 | group 0 up and group 1 rising at 58, all six up by 74; three men unblocked | 36 heads at y 1.6 by L 73; crew bbox overlap 0 px |
| FL30-scatter 6 / 60 | heads up / clumps running apart, no bird lying down | ≥ 3 clumps separated by ≥ 4 m at L 60 |
| FL30-halves 14 / 30 | left half leaving left / right half leaving right, hero alone in the middle | at L 22 all left-half x ≤ 6.0; at L 38 all right-half x ≥ 18.0 |
| FL30-fence 0 | every bird behind the wire from the track | no body pixel in front of the wire layer (logged) |
| render time | — | one 60-bird half-size frame time logged |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
