# T19 — plates B03-SH02 (top shot burst), B03-SH03 (the hero calls the split), B03-SH04 (crew at an empty paddock) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: set (plates) · Hard: yes (running emu, talking beak, binoculars hands)
Blocked by: T03, T04, T05, T07, T08, T09, T11, T12 · Consumers: B03-SH02, B03-SH03, B03-SH04 (global 727–911)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules), shot blocks [b03.md](../short/scene-sheets/b03.md) B03-SH02, B03-SH03, B03-SH04 (and SD05).

## Build
Replace the three stub shot files.
Files: `src/painted/edu30/shots/B03-SH02.tsx`, `src/painted/edu30/shots/B03-SH03.tsx`, `src/painted/edu30/shots/B03-SH04.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| All three | space P morning, `eaten: 0.4`; newsreel warm, strength 1 | T09 schedule |
| B03-SH02 camera | `eye (0, 18, 10) → (0, 20, 10)` linear L 0–50, yaw 0, pitch −48°, f 800, hy 860; `overscan: true` | b03 B03-SH02 Camera |
| B03-SH02 shake carry-over | `shakeAt(L + 67, roundFrames(35, 11, 3), B03-SH01 spec)` for L 0–1 (round 11's decay: factor 0.2 on L 0, 0 from L 1); Editor may drop it | b03 B03-SH01 Cut |
| B03-SH02 birds | T08 `burst(L)` continuing B03-SH01's L 66 state; six groups out through the edges by L 45; dust trails | b03 B03-SH02 Staging |
| B03-SH02 crew and gun | `crewAtGun` with back views for all three (no top view exists in the kit; at 65 px the back views read correctly from above), G1 `magTurn` 84.3°; casings at rest (`restingCasings`, B03-SH01 seeds); smoke continuing: `paintSmoke` with the B03-SH01 rounds shifted by −67 (last round at L −2), fading to 0 by L 43 | b03 B03-SH02 Staging, VD30-11 Continuity |
| B03-SH03 EMU-HERO | run, right view (heading +x), path (6.0, 0, −32) → (16.2, 0, −32) linear 3.9 m/s; run cycle 12 f (body advance 1.56 m per cycle via `gaitAdvance`), left contacts L 2 + 12k, right L 8 + 12k, feet on the bare earth (eaten patch) must touch; head turned back toward the followers: `headYaw` 0 → −1.9 rad (toward its right, the camera side, so the face shows) over L 0–3, hold L 3–25, back to 0 over L 25–35, forward from L 35; beak `talkBeak` for global [781, 803) and [823, 849) (local 3–25, 45–71); `lid` 0.3 | b03 B03-SH03 Staging and VO |
| B03-SH03 followers | T08 `followers(L)` | b03 B03-SH03 |
| B03-SH03 camera | truck `eye (7.0 → 15.0, 1.3, −29.3)` linear L 0–77, yaw 0, pitch 0, f 900, hy 860 | b03 B03-SH03 Camera |
| B03-SH04 crew (front views) | MEREDITH T12 pose G (binoculars at the eyes L 0–12, lowered to the chest L 12–24, held) at (−0.6, 0, 1.05); GUNNER-1 seated front (T11) at (0, 0, 0.85), fists on G1; GUNNER-2 `P34, neutral` at (0.75, 0, 0.45); all faces `neutral` | b03 B03-SH04 Staging |
| B03-SH04 props | G1 barrel −z, `magTurn` 84.3°; the 11 casings at rest (`restingCasings`, B03-SH01 seeds; screen left from this side); gear as LF01 | VD30-11 Continuity |
| B03-SH04 feather | 0.12 m dark feather `#2c241d` with a pale shaft `#b3a28a`; enters at (−0.2, 2.4, 0.3) on L 10 (above the frame top), falls with a sway x ± 0.15 m (period 20 f) to the pan top `lewisAnchors(...).pan` (0, 0.97, 0.15) at L 46 (ease-out over the last 6 f), lies flat there to L 55 | b03 B03-SH04 Staging, SD05 |
| B03-SH04 dust | `fall.ts` dust, density 0.6 at L 0 → 0 at L 40 linear | b03 B03-SH04 |
| B03-SH04 camera | `eye (−0.4, 1.35, −2.0) → (−0.4, 1.35, −1.7)`, `yaw 178° → 180°`, f 900, hy 860, ease-in-out L 0–55 | b03 B03-SH04 Camera |
| Probe leads | B03-SH03: EMU-HERO; B03-SH04: MEREDITH, feather point | T03 |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/KP-run.png` (run pose), `KP-look.png` (head), `LF01a.png` (crew front).

**Judgment for the builder (Hard).** B03-SH03: a real running bird with its head swung back to call; the beak opens only while it speaks; feet land on their contact frames and do not slide. B03-SH04: calm faces, binoculars held in both mittens the whole time, thumbs on the outer sides.

## Proof
- Stills: B03-SH02 L 0, 15, 30, 45; B03-SH03 L 0, 3, 14, 25, 35, 50, 77; B03-SH04 L 0, 12, 24, 46, 55 via `stills.mjs` (log `out/logs/T19-stills.log`); `qa-sheet.sh --cols 7 --width 270`; `measure-shots.ts` per shot.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| B03-SH02 L 0 / 45 | six groups bursting out / gone through the edges; gun above y 1100 | gun y 1044 → 1081 ± 20; birds inside frame at L 45 ≤ 3 |
| B03-SH03 L 3 / 50 | head turned back, beak open / head forward | EMU-HERO 500 ± 25 px (≥ 480) on all proof frames; x 207 → 940 ± 30 |
| B03-SH03 any | stance foot slip | ≤ 0.02 m (probe log) |
| B03-SH04 L 46 | feather on the pan above y 1100 | feather at (345 ± 20, 1045 ± 20) |
| B03-SH04 L 0 / 24 | binoculars at the eyes / at the chest | MEREDITH 504 → 557 ± 25; `thumb check` both hands |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
