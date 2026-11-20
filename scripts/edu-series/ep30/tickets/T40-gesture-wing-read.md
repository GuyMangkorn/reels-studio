# T40 — the mime wing reads at 270 px: a fuller, paler plume fringe on gesture wings, flick raised (T15 fix pass 1) + re-proof of B03-SH03, B05-SH04, B06-SH04
Deliverable: EDU-EP30-SHORT · Revision: r1 (`EDU-EP30-TICKETS-R10`) · Status: ready
Class: figure (fix bundle) · Hard: yes (wing gesture on a creature)
Blocked by: none (T15 done; T25, T30, T32 built) · Consumers: B03-SH03 (T25), B05-SH04 (T30), B06-SH04 (T32)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); [T15](T15-emu-mime-gestures.md) (Decided values, R9 look check); [T06](T06-emu-wings-reactions.md) r3 decision in `emu.ts` ("no solid flat, no tip fan": a solid wing read as a dark arm with a claw, so this ticket adds plumes, never a filled shape).

## Why (Film, R10 look check)
Viewed `T25-sheet.png`, `T25-wing-crop-L10.png`, `T30-sheet.png`, `T30-zoom.png`, `T32-sheet.png`, `T32-zoom.png`. The three mime gestures point where the tickets say (tip numbers pass), but at 270 px the wing is a few thin dark dashes: the B03-SH03 flick vanishes against the dark group behind the hero, the B05-SH04 goodbye wave and the B06-SH04 back wave read as scratches in the sky. The split and both goodbyes are story beats told by the wing alone, so the wing must read. The watch check (B04-SH05) reads and does not change.

## Build
In `src/painted/edu30/emu.ts`: an optional emphasis value on `WingPose`, set on the flick and wave poses only, that thickens, lengthens, adds and lightens the T06 plumes while the wing is raised; the flick pose points higher so its tip clears the backs of the group. Folded wings, the watch pose, every other pose and the locked KP-EMU look are unchanged.
Files: `src/painted/edu30/emu.ts`, `tests/edu30-emu.test.ts` (no plate file changes; plates are re-rendered only).

## Decided values
| Row | What | Value | Source |
| --- | --- | --- | --- |
| G1 | emphasis field | `WingPose.show?: number` (0..1, absent = 0). `wingMix(a, b, t)` interpolates it linearly (`(a.show ?? 0) + ((b.show ?? 0) − (a.show ?? 0)) × t`) | ticket |
| G2 | which poses | `WING_FLICK.show = 1`, `WING_WAVE.show = 1` (front and `back: true` wave both use `WING_WAVE`); `WING_WATCH`, `WING_FOLD`, `WING_FLAP_OUT` and the T06 reaction poses keep `show` absent | ticket |
| G3 | plume count | in the wing loop, plume count `n = 7 + round(7 × s)` (s = the wing's `show`), spread along the two segments with the same `tt` rule over `n`; seeds `5000 + wi·40 + k` and `5100 + wi·40 + k` for k < 7 unchanged, new plumes k ≥ 7 use seeds `5200 + wi·40 + k` and `5300 + wi·40 + k` | ticket |
| G4 | plume size | width offset `±0.015 × (1 + s)` m (was ±0.015); length `(0.08 + 0.08·r2) × (1 + reach) × (1 + 0.6·s)` | ticket |
| G5 | plume tone | `mixColor(<built tone>, '#b8a27a', 0.55 × s)` (the paler inner wing turned to the lens); the alternating 0.35 / 0.15 dark mix stays underneath it | ticket |
| G6 | no flat | no filled polygon, no tip fan, no outline: plumes only (T06 r3) | T06 r3 |
| G7 | flick raised | `WING_FLICK = {dir: nrm([-0.14, 0.60, 0.79]), bend: nrm([-0.14, 0.60, 0.79]), reach: 1.0, show: 1}` (was dir/bend (−0.14, 0.27, 0.95), reach 0.8): tip creature-local y ≈ 1.51 m (was 1.197), out ≈ 0.88 m (was 0.903). `emuWingFlick` timing and head yaw ±0.26 unchanged | ticket (estimate from `wingLen(1)` = 0.45 + 0.40 m) |
| G8 | wave | `WING_WAVE` direction, bend, reach and the ±20° swing unchanged (TF35 tip 1.50–1.85 m stands); only `show: 1` added | T15 R9 |
| G9 | tests | update the T15 tip assertions for the flick to the new pose (tip y ≥ 1.45 m, out 0.80–0.95 m); the KP-EMU default stroke hash and every reaction-pose hash unchanged; add one test: `wingMix(WING_FOLD, WING_FLICK, 0.5).show === 0.5` | ticket |

**Judgment for the builder (Hard).** At 270 px a raised gesture wing must read as a feathered wing held out (a soft fringe of pale-and-dark plumes hanging from a raised line), never as an arm, a claw, a paddle or a flat card. If a plate frame at 270 px shows a hard edge or a hand-like end, set Status blocked with the frame path; do not add a fill.

## Proof
- `npx tsc --noEmit -p .`; `node scripts/test.mjs tests/edu30-emu.test.ts` (log to `out/logs/T40-test.log`).
- KP stills: `render-looks.sh T40 KP-EMU KP-flick-r KP-flick-l KP-wave KP-wave-back KP-watch`; KP-EMU and KP-watch vs the same command at the parent commit.
- Plate stills through `shots-index.tsx` (clean and guides-on): B03-SH03 L 0, 6, 8, 10, 16, 24, 26, 40; B05-SH04 L 0, 6, 10, 14, 30, 45; B06-SH04 L 36, 39, 43, 50. Sheet `scripts/qa-sheet.sh out/edu30-T40/sheet.png --cols 6 --width 270 out/edu30-T40/s*.png`; 540 px crops of B03-SH03 L 8, B05-SH04 L 10, B06-SH04 L 43. Archive `out/edu30-T40` as `T40-*.png`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| KP-EMU, KP-watch | unchanged | mean abs diff vs parent **≤ 2** each |
| B03-SH03 L 8 / L 24 (270 px) | one wing held out pointing screen left / screen right, readable without words, the matching half turning | right-wing tip near **(270, 738) ± 60** at L 8, left-wing tip near **(836, 738) ± 60** at L 24 (Film estimates from G7; log the projected tips); plume-fringe box (40 × 40 px at mid-wing) mean luma vs the box directly behind it **≥ 35 apart** (logged) |
| B03-SH03 L 40 | hero alone, wings folded | EMU-HERO **614–660** px (T25 as built, R10); tuft and bib visible |
| B05-SH04 L 6 / 10 / 14 (270 px) | the wave reads as a raised waving wing above the wire, toward screen right | wing tip y **≤ 800** on all three; tip x logged; fringe box vs background **≥ 35 apart** at L 10 (logged); EMU-HERO **750–810** px at L 10 (T30 as built, R10) |
| B06-SH04 L 39 / 43 (270 px) | from behind, a pale-fringed wing lifts at the flank and swings once | tip above the horizon line (y **≤ 800**) at L 43; fringe box vs background **≥ 35 apart** at L 43 (logged); EMU-HERO **542–563** px at L 39 |
| B06-SH04 L 50; B05-SH04 L 45 | folded again | no plume of the gesture wing outside the body silhouette (viewed) |
| caption zone (TF46) | clean B03-SH03 L 8, B05-SH04 L 14, B06-SH04 L 39 | `caption-zone.py --band 1150:1344 --max-mean 0.80 --max-p95 0.99` pass |
| pads | planted through every gesture | by construction (gesture pads = `emuPads(stand)`, T15 test); no re-measure |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
