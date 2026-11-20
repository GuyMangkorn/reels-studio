# T30 — the shared retreat vantage, plate B05-SH03 (withdrawal one) and plate B05-SH04 (EMU-HERO waves the truck off, "ไว้มาใหม่นะ!") are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: ready, **dispatchable** (R9: T15 done) · was: ready · r3: Film notes added (TICKETS-R3) · r4: Film notes added (TICKETS-R4)
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
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
