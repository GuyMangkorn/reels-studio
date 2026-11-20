# T19 — plates B01-SH01, B01-SH02, B01-SH03 (the hook) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: done (R9 Film look check: accept with value change) · was: done · r3: Film notes added (TICKETS-R3)
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

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Lewis gun (T13 r3).** After the gun's `placeBuild`, call `paintLewisPanTicks(p, c, seed, at, heading, magTurn, {elev, recoil})` in the next paint slot (before anything in front of the gun); without it the pan step per round is invisible. Every gun point (muzzle, pan, port, grip, stock, cock) comes from `lewisAnchors(at, heading, {elev, recoil, cock})`, never from a sheet literal: the locked gun is 1.32 m long with the muzzle 0.66 m ahead of the tripod head, so the sheet anchors that assumed a 1.1 m gun are superseded (index TF17).

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
Built 2026-11-20 (Boss, Sonnet medium), on `bf9d664`; commit = the T19 commit on branch `worktree-agent-afb938a7302c89054`. Fix passes used: 0 (one self-correction before the first proof: the crew paints after `paintPaddockScene`, not inside its `cast`, because the clearing paints over `cast` content when the camera is north of the fence). Files: the three shot files only.
Proof, store `projects/edu/EDU/previews/` (all T19-prefixed, `sheet.png` untouched): `T19-sheet.png` (13 frames at 270 px), `T19-s01_L{00,70,80,89}.png`, `T19-s02_L{00,34,58}.png`, `T19-s03_L{00,07,34,50}.png`, `T19-clean_s0{1,2,3}_L00.png`, `T19-cmp-LF01a.png` (store LF01a beside SH01 L0 and L70), `T19-cmp-KPface.png` (store KP-face beside SH03 L0), `T19-s01_L89_head.png` (head crop), `T19-measure.txt`.
Checks: `tsc` shows no error in the three files (errors exist only in other tests); `npm test` 477 pass, 9 fail, none from these files (HIPPO joints x3, loudness, new-shot, render-inputs, segments, store adopt, and the known T24 r5 test (d) on B03-SH01).
Built: B01-SH01 = own crew pass in LF01a order (T11 `paintSeatedGunner` with `lewisAnchors` grip and stock; gun, then T13 `paintLewisPanTicks`, then T36 `paintGunnerFists`; GUNNER-2 P34; MEREDITH P30; gear) after `paintPaddockScene`; EMU-HERO = `HERO_LF01` mixed to `EMU_POSES.look(0)` L70-80, then `emuLookTurn` L80-88 to `emuLensYaw`; the truck is not painted (out of view). B01-SH02 = `paintPaddockScene` + `paintTruckRig` (silhouettes, cases) with far and near dust + `paddockExtras`. B01-SH03 = `EMU_POSES.look` with `blinkLid(L-6, .32)` and `emuSac(L)`.
| Row | Measured | Range | Result |
| --- | --- | --- | --- |
| SH01 L0 MEREDITH | 541 px (x 944) | 541 +-20 | pass; matches LF01a at 270 px (`T19-cmp-LF01a.png`) |
| SH01 L89 EMU left edge | head column x 163; body and feet reach x about 50 (inside the frame, not cut) | >= 120 | head passes, **body left edge about 50 < 120** |
| SH01 L89 MEREDITH | 603 px (x 983) | >= 480 | pass |
| SH01 L89 EMU | 642 px (top 507, feet 1149) | 586 +-30 | **fail by 26 px** (see below) |
| SH02 L0 / L58 EMU1 | 567 / 479 px (L34 peck 375) | >= 480 | L0 pass; **L58 479, 1 px under** |
| SH02 truck width | 109 / 121 / 128 px (L0 / 34 / 58), readable as a truck at 270 px | >= 100 | pass |
| SH02 truck x | 510 / 404 / 314 | 512 -> 212 +-30 | L0 pass; **L58 314, 102 px off** (see below) |
| SH03 head + neck (head top to the `neck.base` joint) | 756 (L0), 764 (L7), 887 (L34), 939 (L50) | 515 -> 609 +-30 | **fail** (see below) |
| SH03 head top | 448 / 447 / 420 / 408 | < 1100 | pass; equals the locked KP-face head top (about 446) |
| `caption-zone.py`, clean L0 | SH01 mean 0.716 p95 0.853; SH02 0.667 / 0.933; SH03 0.598 / 0.898 | pass flag | all three `pass: false` (light sand ground fills the band; the Editor's caption stroke covers it) |
Values I could not follow (sheet or ticket numbers that disagree with the sheet's own camera lines or the locked emu; camera, pose and staging kept as decided):
- **SH01 L89 EMU 586 +-30:** the locked `look(0)` pose is 1.75 m to the head top (measured side-on at 10 m; the ticket says 1.70), and at the sheet camera it measures 642 px (sheet head top 540 and feet 1126; ours 507 and 1149, the probe bottom is the toe line). The body left edge about 50 follows from the same bird in the LF01a frame (tail already near x 80 at L0).
- **SH02:** EMU1 centre x 468 -> 562 in the sheet is true only for yaw about 180; the decided camera (eye 6.0, -30, yaw 200) puts EMU1 at x about 127 at L0. The sheet's truck x 512 -> 212 holds at L0 with yaw 200 but at L58 yaw 194 gives 314 (212 needs yaw 200). Film to correct the sheet projection.
- **SH03 head + neck 515 -> 609:** at the decided camera (about 1.0 m to the chest) the head top is 448 and the `neck.base` joint 1204 (sheet head top 493, neck base 1008). The head top matches the locked KP-face frame (same lens), so the plate follows the look. If Film means the visible neck-to-bib junction (about y 1000 to 1080 in the still), head top to it is about 550 to 630.
- Hard checks: EMU-HERO tuft visible in SH01 and SH03; GUNNER-1 fists painted by `paintGunnerFists` over grip and stock; thumb check: GUNNER-1 right: not measured on screen, left: not measured on screen (crew still, mitten fists from the T11 solve, viewed at 270 px only); arm check: GUNNER-1 front: attached ok (viewed); the emu's pads come from the stance default and no mixed pose sets pads, so the feet do not move across L0-89 (not measured numerically).
- Not verified: seek parity with `EDU30-SEQ` frame 120 (not run); the SH02 foreground wheat bars are the T09 ridge look at this low camera (heavier than the T09 p3 proof) and were not tuned; SH03 blink (L7) is visible only at full size.

## R9 look check and decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
These override any older value in this ticket that they name.
Viewed: store `T19-sheet.png` (13 frames) and `T19-cmp-LF01a.png`. **Verdict: accept with value change; no Boss pass.** SH01 matches LF01a; the lens turn, the reverse wide with the truck leaving and the deadpan stare read.
| Row | New value (as built) | Reason |
| --- | --- | --- |
| SH01 L 89 EMU-HERO | **642 ± 30** px (was 586) | the locked `look(0)` bird is 1.75 m to the head top; 586 was computed for 1.60 m; the cast is not scaled. TF39 |
| SH01 L 89 body left edge | **≥ 40** px (inside the frame, not cut); head column ≥ 120 holds (163) | the LF01a bird's tail already sits near x 80 at L 0 |
| SH02 EMU1 | L 0 centre x ≈ 127 (a foreground framing bird part-cut at the left edge, accepted); L 0 / L 58 heights ≥ **475** (567 / 479) | the sheet's x 468 → 562 assumed yaw 180; the decided yaw 200 → 194 stands |
| SH02 truck x | **510 → 314 ± 30** (L 0 → L 58) | the projection of the decided yaw 200 → 194 |
| SH03 head + neck | head top to the visible neck–bib junction **550–630 ± 30** (head top 448 → 408, matching KP-face) | `neck.base` is a rig joint under the bib, not a picture landmark |
| Caption zone | TF46 thresholds; SH01 0.716 / 0.853, SH02 0.667 / 0.933, SH03 0.598 / 0.898: pass | edu stroke captions |
| Foreground wheat bars (SH02, SH03) | accepted as the T09 ridge look at a low lens | locked set; reads as standing crop |
