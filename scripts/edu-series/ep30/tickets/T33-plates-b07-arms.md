# T33 — plates B07-SH01 (burn-out to full colour, crane to the coat of arms) and B07-SH02 (push in; the relief emu looks at the lens) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: set (plates) · Hard: yes (relief emu head turn and blink)
Blocked by: T01, T03, T07 · Consumers: B07-SH01, B07-SH02 (global 1737–1976)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot blocks [b07.md](../short/scene-sheets/b07.md) B07-SH01 and B07-SH02 (authoritative; SD11); brief VD30-04/04a and [arms-check](../short/arms-check.md) AV01–AV03 (shown once, nothing overlaid, never a logo or end card); looks.ts `armsLook`, `CAM_LF03`, `CAM_A2`; [arms.ts](../../../../src/painted/edu30/arms.ts).

## Build
Replace the two stub shot files with the plates; the emblem is LF03 as locked and never changes except the relief emu's head and lid.
Files: `src/painted/edu30/shots/B07-SH01.tsx`, `src/painted/edu30/shots/B07-SH02.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Set | space A as LF03: `paintArmsSky`, `paintSandstoneWall`, `paintArms` (supporters as W3: kangaroo ×1.3 at x −1.12, emu ×1.12 at x +1.12 on the wattle top y 3.45), `paintWattleBed`; morning sun from the upper left; paper `#e8d8b8` | b07 B07-SH01 Staging; brief look frames |
| B07-SH01 newsreel | `strength` 1 → 0 linear over L 0–9, `pop` 0.15 / 0.10 / 0.05 on L 0 / 1 / 2, tint cool (tintMix 1) released with the strength; from L 10 strength 0 (no grain, weave or tint); one plate, no two-canvas dissolve ([DF-20261029-painted-timeline-dissolve](../../../../docs/dev-findings.md#df-20261029-painted-timeline-dissolve)) | b07 Newsreel burn-out; T01 |
| B07-SH01 camera | start eye (−0.3, 1.0, 4.5), yaw 0, pitch 4, f 1200, hy 760 → end eye (−0.3, 2.6, 4.5), pitch 20 (= LF03) over L 0–100 ease-in-out; hold L 100–117 | b07 B07-SH01 Camera (SD11) |
| B07-SH02 camera | eye (0.95, 3.9, 2.7) → (0.95, 3.9, 2.4), yaw 4, pitch 16, f 1000, hy 900, ease-out over L 0–90; hold L 90–121 | b07 B07-SH02 Camera |
| B07-SH02 relief emu | `ArmsOpts.emuPose`: KP-look pose; `headYaw` 0 → the KP-look three-quarter value over L 34–49 (ease-in-out), held; `lid` = T07 `blinkLid(L − 54, 0.30)`; nothing else on the emblem moves | b07 B07-SH02 Staging; T07 |
| No overlay | no title, card or mark change on the arms; only the standing chrome and the Editor's captions | AV01–AV03 |
| Probe leads | B07-SH01 relief emu at L 100; B07-SH02 relief emu at L 0 and 90 | T03 probe |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r2/LF03.png` (B07-SH01 end, locked LF03 R2), `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TA2.png` (B07-SH02 end).

**Judgment for the builder (Hard, face).** The relief emu turns its head like the B01-SH03 stare, a small proud look and one blink, and stays a carved relief (35 % depth, sandstone light): no living-bird texture, no colour change.

## Proof
- Stills (`out/edu30-T33/`): SH01 L 0, 2, 9, 10, 50, 100, 117; SH02 L 0, 34, 49, 55, 90, 121.
- `scripts/qa-sheet.sh out/edu30-T33/sheet.png --cols 7 --width 270 out/edu30-T33/s*.png`; `measure-shots.ts B07-SH01 100` and `B07-SH02 0,90`; clean SH01 L 100 and SH02 L 90 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH01 L 0 / 10 | flare, then full colour with no grain, weave or tint | L 10 filter `none` (logged) |
| SH01 L 100 | matches LF03 (both supporters, scroll above the captions) | mean abs pixel difference ≤ 4 vs a fresh `CAPTION=0 sh scripts/edu-series/ep30/short/render-looks.sh T33 LF03` still (the store still carries caption and chrome); scroll y < 1100 |
| SH02 L 49 / 55 | relief emu head turned to the lens / blink shut | relief emu 630–705 px painted; head above y 1100 |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
