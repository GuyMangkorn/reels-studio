# T19 — plates B01-SH01, B01-SH02, B01-SH03 (the hook) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: set (plates) · Hard: yes (emu head turn and sac, walking extras)
Blocked by: T03, T07, T08, T09, T11, T14 · Consumers: B01-SH01, B01-SH02, B01-SH03 (global 0–199)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (plate rules, Hard-ticket checks); shot blocks [b01.md](../short/scene-sheets/b01.md) B01-SH01 … SH03 (Staging, Camera, Projection, Acceptance are authoritative; the values below only add build decisions).

## Build
Replace the three stub shot files with the plates. Reuse `paintPaddock` and `crewAtGun` (looks.ts, exported in T03), the W3 `lf01` composition for B01-SH01 L 0, and the helpers of T07, T08, T09, T11, T14.
Files: `src/painted/edu30/shots/B01-SH01.tsx`, `src/painted/edu30/shots/B01-SH02.tsx`, `src/painted/edu30/shots/B01-SH03.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| All three | space P, light m 0, eaten 0.3, stubble 0; newsreel `{strength 1, tint 'warm', tintAmount 1}`; set seeds as `paintPaddock` (30100 …); actor seeds as the look (MEREDITH 33100, GUNNER-1 33200, G1 33300, GUNNER-2 33400, EMU-HERO 36000) | T09 schedule, look lock |
| B01-SH01 camera | eye(L) = lerp((−3.2, 0.95, −3.4), (−3.27, 0.95, −2.77), e), yaw lerp(134.5°, 128.5°, e), e = ease-in-out(L / 89); pitch 6°, f 1450, hy 640 (interpolating the two sheet eyes keeps L 0 = LF01a exactly; the orbit 4.17 → 3.80 m is the same path ± 0.1 m) | b01 B01-SH01 Camera, SD01 |
| B01-SH01 crew | exactly `crewAtGun(…, {hero, gear: true})` as LF01a: MEREDITH `P30` front, GUNNER-1 seated front (T11, fists on G1, j 0), GUNNER-2 `P34`, G1 barrel −z, `magTurn` 0; still | b01 B01-SH01 Staging |
| B01-SH01 EMU-HERO | L 0–69 `HERO_LF01`; L 70–80 `mixEmuPose(HERO_LF01, EMU_POSES.look(0), e)` (head rises to standing, top 1.70 m); L 80–88 `headYaw` 0 → `emuLensYaw(at, heading, cam(L))` ease-in-out, lid 0.30; hold to 89; both feet planted at the LF01 pads all 90 frames | b01 B01-SH01 Staging |
| B01-SH01 near stalks | as LF01a (`stalks` of `lf01`) | look lock |
| B01-SH02 camera | eye (6.0, 1.5, −30), yaw 200° → 194° ease-in-out over L 0–58, pitch 0, f 900, hy 820 | b01 B01-SH02 Camera |
| B01-SH02 birds | T08 `paddockExtras(L)` | b01 B01-SH02 Staging |
| B01-SH02 truck | T14 B01-SH02 drive, riders `'silhouettes'`, gear `'cases'`, `paintTruckDust` on | b01 B01-SH02 |
| B01-SH02 gun position | the trampled clearing at the origin only (about 30 m away, near x 403): no crew, no G1, no gear (they are on the leaving truck); camp and tent stay | b01 B01-SH02 Direction |
| B01-SH03 EMU-HERO | at (4.0, 0, −26.0) facing +z, `EMU_POSES.look(emuLensYaw(...))`, lid 0.32; blink `blinkLid(L − 6, 0.32)`; sac keys (T07) L 26 → 50; feet planted; head still | b01 B01-SH03 Staging |
| B01-SH03 background | `paintPaddock` with `far: {n: 200, x: [−30, 30], z: [−60, −150]}`, near stalks off; camera eye (4.1, 1.58, −24.6 → −24.8), yaw 0, pitch −2°, f 1000, hy 640, ease-in-out | b01 B01-SH03 Camera |
| Probe leads | B01-SH01: MEREDITH, EMU-HERO; B01-SH02: EMU1, TRUCK (width); B01-SH03: EMU-HERO head + neck (head top to neck base) | T03 probe |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (B01-SH01 L 0), `KP-face.png` and `KP-look.png` (B01-SH03, same folder).

**Judgment for the builder (Hard).** B01-SH01: the bird lifts its head slowly and turns to the lens with its feet still; nobody in the crew reacts. B01-SH03: deadpan; only the lid and the throat move. In B01-SH02 nothing hurries; the extras' feet hold their contacts.

## Proof
- Stills (`out/edu30-T19/`): SH01 L 0, 70, 80, 89; SH02 L 0, 34, 58; SH03 L 0, 7, 34, 50, through `node scripts/stills.mjs src/painted/edu30/shots-index.tsx --gl=angle` (lines `EDU30-B01-SH01 0 out/edu30-T19/s01_L00.png` …).
- `scripts/qa-sheet.sh out/edu30-T19/sheet.png --cols 4 --width 270 out/edu30-T19/s*.png`; `npx tsx scripts/edu-series/ep30/short/measure-shots.ts B01-SH01 0,89` (SH02 0,58; SH03 0,50); seek parity: `EDU30-SEQ` frame 120 equals `EDU30-B01-SH02` L 30.
- Clean L 0 of each shot (`--props='{"guides":false,"tag":false}'`) through `python3 -I scripts/caption-zone.py <png>`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| B01-SH01 L 0 | matches LF01a | MEREDITH 541 ± 20 px; visual match at 270 px |
| B01-SH01 L 89 | EMU standing, head to the lens, fully in frame | EMU left edge x ≥ 120; MEREDITH ≥ 480 (sheet 560); EMU 586 ± 30 |
| B01-SH02 L 0 / 58 | EMU1 crossing, truck leaving screen left | EMU1 ≥ 480 (sheet 510); truck width ≥ 100 px; truck x 512 → 212 ± 30 |
| B01-SH03 L 7 / 34 | blink shut / throat swollen | head + neck 515 → 609 ± 30 px; head top < 1100 at every proof frame |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
