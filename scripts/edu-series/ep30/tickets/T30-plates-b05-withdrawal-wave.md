# T30 — the shared retreat vantage, plate B05-SH03 (withdrawal one) and plate B05-SH04 (EMU-HERO waves the truck off, "ไว้มาใหม่นะ!") are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: **done** (R11: SH04 re-proof in T40 accepted, TF59, TF67) · was: built; SH04 re-proof in **T40** (R10) · was: ready, dispatchable (R9: T15 done) · was: ready · r3: Film notes added (TICKETS-R3) · r4: Film notes added (TICKETS-R4)
Class: set (plates) · Hard: yes (wing wave, talking beak)
Blocked by: T03, T07, T08, T09, T14, T15 · Consumers: B05-SH03, B05-SH04 (global 1294–1433); T32 (vantage helper)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot blocks [b05.md](../short/scene-sheets/b05.md) B05-SH03 and B05-SH04 (authoritative; SD09, SD16); b06 B06-SH03/SH04 Camera (the same vantage returns).

## Build
A small shared module for the retreat vantage (camera line, the fence birds' layout, the truck exit path) so B05-SH03, B06-SH03 and B06-SH04 match exactly, plus the two plates.
Files: `src/painted/edu30/vantage.ts` (new), `src/painted/edu30/shots/B05-SH03.tsx`, `src/painted/edu30/shots/B05-SH04.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| `vantage.ts` | exports `VANTAGE_CAM(shot, L)` for B05-SH03 (eye (−1.0, 1.55, 2.4) → (−0.95, 1.55, 2.55), yaw 160 → 166), B06-SH03 (eye (−1.0, 1.55, 2.4) → (−0.97, 1.55, 2.5), yaw 162 → 164) and B06-SH04 (eye (−0.97, 1.55, 2.5) → (−0.95, 1.55, 2.6), yaw 164), all pitch 0, f 900, hy 820, ease-in-out over the shot; `paintVantageSet(p, c, o: {light m; eaten; stubble})` (paddock from inside looking south: the fence, the track, the camp side, west light); `fenceLine(count)` = T08 `fenceBirds` | b05 B05-SH03 Camera ("this exact camera returns"), b06 |
| B05-SH03 set | light m 1 (low west sun, long shadows toward +x), eaten 0.7, stubble 0.4, newsreel `tint: 'cool'` (tintMix 1) | T01, T09 schedules |
| B05-SH03 birds | five (HERO + F2–F5, T08 `fenceBirds`), back view, stand idle, heads following the truck × 0.3; wings folded (the flap is gone, SD16) | b05 B05-SH03 |
| B05-SH03 truck | T14 B05-SH03 drive, silhouettes, G2 on its pedestal at rest, dust | T14 |
| B05-SH03 title | T02 "ถอนทัพ รอบที่ 1" via the adapter (1363–1388) | T02 |
| B05-SH04 camera | eye (−0.2, 1.35, 7.9) → (−0.25, 1.35, 7.7), yaw −6.6 → −4, pitch 0, f 950, hy 860, ease-in-out L 0–45 | b05 B05-SH04 Camera |
| B05-SH04 set | T09 "fence from the track" (fence drawn after the birds; no truck dust, T09 Film fix), light m 1, eaten 0.7, stubble 0.4, cool tint | T09 |
| B05-SH04 EMU-HERO | (−0.5, 0, 5.3) or its T08 fence-rule z, heading π/2 (facing +z, front three-quarter to the lens): T15 `emuWingWave(L)` front three-quarter; beak T07 `talkBeak` onsets L 6, 13, 21, 28 | b05 B05-SH04; T15 |
| B05-SH04 fence birds | F2 (−1.4), F3 (0.5), F4 (1.4) (T08 rule z), heads turned to screen right (+x) by `headYaw` +0.5, still with ambient breathing | b05 B05-SH04 |
| Never | no gesture reading as driving the army off; no truck in frame | FACTCHECK-R2 (L21); T09 Film fix |
| Probe leads | B05-SH03 EMU-HERO L 0 and 93; B05-SH04 EMU-HERO L 0 and 45 | T03 probe |

**Judgment for the builder (Hard).** B05-SH03: stillness; the birds never turn to the lens; the truck shrinks away in cool evening light. B05-SH04: a cheerful shopkeeper's goodbye, one wing high, swinging, the beak moving on the syllables, head toward the departed truck; wing and head stay above the top wire.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **B05-SH04 fence (T09 r3).** Paint the set with T09 `paintPaddockScene` (birds in its `cast` callback, so the fence draws after them; clearing before the fence from the track side) with `wire: {wireW: 2.5, wireCol: '#3e3226'}`; the locked post at x 0 projects near (753, 987). The fifth fence bird (0.95, 0, 5.8) is this ticket's to place (B05-SH03; TF04 back row).
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17).

## r4 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R4`)
These override any older value in this ticket that they name.
- **Wire contrast (T09 r4).** In B05-SH04 the top-wire contrast ≥ 20 luma is measured at a column between the fence birds; across a bird body no contrast is required. "No body pixel in front of the wire" unchanged.

## R9 notes (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
These override any older value in this ticket that they name.
- **Wave (T15 R9, TF35).** B05-SH04 `emuWingWave(L)` as built: ±20° swing, tip y 1.54–1.83 m; the sheet acceptance "wing and head above the wire and above y 1100" stands.
- **Caption zone (TF46).**


## R10 look check (Film, 2026-11-20, `EDU-EP30-TICKETS-R10`)
Viewed `T30-sheet.png`, `T30-zoom.png`. **Verdict: SH03 accept with value change; SH04 fix via [T40](T40-gesture-wing-read.md) (wave wing; this plate is re-rendered only).**
- SH03 cool light, five backs, truck: pass. Title box y ≈ 292–464 accepted; its timing (1363–1388, adapter) belongs to T02/Editor; the plate is right not to draw it before L 69 (TF59).
- Far-LOD fence birds read flatter and darker than the hero: accepted (the textured hero stands out, which helps identity; render budget).
- SH04 (TF59): hero row 617–670 → **750–810 px at L 10 with the wing** (712 at L 0); wing tip x row withdrawn, tip y **≤ 800** on L 6 / 10 / 14 (T40). Head mostly to the lens with a slight turn right: accepted (cheerful goodbye reads once the wing reads).
- Pad slip: by construction (T15 gesture pads).

## Proof
- Stills (`out/edu30-T30/`): SH03 L 0, 46, 69, 93; SH04 L 0, 6, 10, 14, 30, 42, 45.
- `scripts/qa-sheet.sh out/edu30-T30/sheet.png --cols 6 --width 270 out/edu30-T30/s*.png`; `measure-shots.ts B05-SH03 0,93` and `B05-SH04 0,45`; clean SH03 L 69 and SH04 L 14 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH03 L 0 | cool west light reads as a chapter change; five birds' backs; truck beyond the fence | EMU-HERO 529 ± 30 px; truck (1019, 898) ± 40 |
| SH03 L 69 | title with the truck far left | title box y 300–475 |
| SH04 L 10 | wing high on screen right, head toward screen right, beak open | EMU-HERO 617–670 px; wing tip x 740–880, y 620–760 (T15 Film fix) |
| SH04 L 45 | wing folded, head still toward the truck; birds behind the wire | no body pixel in front of the wire layer |

## Result (Boss fills)
Commit: see `git log` on this worktree branch (T30 commit) · fix passes used: 0 · Sonnet medium, 20 Nov 2026 · proof: store `projects/edu/EDU/previews/T30-sheet.png` (11 frames, 270 px), `T30-zoom.png` (SH03 L 0, SH04 L 10, L 45 at 540 px), per-frame `T30-s03_L<L>.png`, `T30-s04_L<L>.png`, clean `T30-clean-c03_L69.png`, `T30-clean-c04_L14.png` (local `out/edu30-T30/`, logs `out/logs/T30-*.log`). `npx tsc`: 8 error lines, none in the three files (environment `three` / `hippo`).

**Built** (`vantage.ts` new, `B05-SH03.tsx`, `B05-SH04.tsx`): `VANTAGE_CAM(shot, L)` for the three shots (values as the table, smoothstep over the shot), `paintVantageSet` (T09 `paintPaddockScene` from inside, `cast` hook), `fenceLine(count, o)` (T08 `fenceBirds`). SH03: light 1, eaten 0.7, stubble 0.4, cool tint (tintMix 1); truck T14 drive with silhouettes, G2 pedestal at rest, far and near dust; five birds back view, heads follow the truck x 0.3 (T08 `truck` option). SH04: T09 camera and set with `wire {2.5, '#3e3226'}`, birds in `cast` (fence after them), hero `emuWingWave(L)`, F2-F4 `stand({headYaw: 0.5})`, no truck.

**Measured against the Proof table** (`measure-shots.ts`, px)

| Row | Number | Pass range | Result |
| --- | --- | --- | --- |
| SH03 L 0 EMU-HERO | 523 (top 775, bottom 1299); L 93 543; x 694 -> 605 | 529 +- 30 | pass |
| SH03 L 0 truck | centre x 1019 (ground y 1040), tray mid (1101, 900), cab roof (757, 746) | (1019, 898) +- 40 | pass (x exact, body y 900) |
| SH03 L 69 title | viewed `T30-s03_L93.png`: title box y about 292-464 at 1920 px; at L 69 the adapter title is not yet drawn (it appears by L 93); truck out of frame left (x -1032) | y 300-475 | about pass (box top about 8 px above, estimated off a 270 px tile); L 69 itself shows no title: Editor / T02 adapter timing, not this ticket |
| SH04 L 10 EMU-HERO | 779 tall (top 634 at the wing, bottom 1413); head top 694 at L 0 (712 tall at L 0) | 617-670 | **fail, 60-110 px taller** |
| SH04 L 10 wing tip | (663, 674); at L 6 / 14 (871, 786) / (869, 785) | x 740-880, y 620-760 | **fail at L 10: x 663 is 77 px left of range** (the -20 degree swing key); y 674 inside; L 6 and 14 x inside but y 786 is 26 px below |
| SH04 L 45 | wing folded (tip (588, 1075)); no body pixel in front of the wire (fence paints after the birds; viewed `T30-s04_L45.png`) | no body pixel in front of the wire | pass |
| SH04 wing and head above the wire and y 1100 (L 6-42) | tip y 674-786, head y 744, top wire y about 1033 | above | pass |
| Caption zone (TF46 thresholds, band 1150:1344, mean <= 0.80, p95 <= 0.99; the ticket's R9 line was empty, T23's TF46 line used) | SH03 L 69 0.501 / 0.721, SH04 L 14 0.510 / 0.649 | pass | pass |

**Deviations and values I could not follow**
1. **Render budget (LOD).** Five near-LOD fence birds paint about 270 000 brush ops each (1.37 M for the plate, against 0.3-0.47 M for the other EMU plates); the still then times out at the 180 s `stills.mjs` limit on this machine (two attempts, SH03 L 0 and SH04 L 0). The hero stays `lod: 'near'`; the four other birds paint `lod: 'far'` (8 k ops, no feather texture, same shape). They read flatter and darker than the hero in the 540 px zoom. If Film wants near detail on all five, the plate needs a cheaper near build (T08/T06) or a longer still timeout.
2. **SH04 EMU-HERO height and wing-tip x** are outside the Film ranges above while the sheet acceptance ("EMU-HERO >= 480 px", wing above the wire and above y 1100) holds. The hero is at the decided (-0.5, 0, 5.3) with the decided camera, so the 617-670 and x 740-880 numbers come from the projection-tool estimate, not the built emu (about 1.95 m to the tuft). Not redesigned.
3. SH04 hero's head reads mostly toward the lens with a slight turn right (T15 `headYaw` 0.61 as built); the wing renders as a few thin feather strokes (T15 as built, R9 accepted).
