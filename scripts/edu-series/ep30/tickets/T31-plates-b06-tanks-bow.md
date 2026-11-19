# T31 — plates B06-SH01 (emus advance like tanks over MEREDITH's back) and B06-SH02 (the silent bow, L15 mime) are built and proven
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: set (plates) · Hard: yes (slow-motion walk contacts, bow on the story clock)
Blocked by: T03, T06, T07, T08, T09, T12 · Consumers: B06-SH01, B06-SH02 (global 1434–1579)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); shot blocks [b06.md](../short/scene-sheets/b06.md) B06-SH01 and B06-SH02 (authoritative); brief VD30-05b (bow as painted) and [R3 changes](../short/film-brief.md#r3-changes) (one bow, no smirk, no victory pose, cut before L16).

## Build
Replace the two stub shot files with the plates.
Files: `src/painted/edu30/shots/B06-SH01.tsx`, `src/painted/edu30/shots/B06-SH02.tsx`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Both | space P, light m 0 (morning NE sun, rim light on the birds), eaten 0.7, stubble 0, newsreel warm strength 1 | T09 schedule |
| B06-SH01 camera | eye (−1.6, 0.6, −1.0), yaw −6 → 0, pitch 6, f 1020, hy 900, ease-in-out L 0–109 (pan only) | b06 B06-SH01 Camera |
| B06-SH01 MEREDITH | T12 D (`new: P44-back`) at (−2.4, 0, −2.2) facing −z, still; only shoulder and hat in frame at the top left (partial silhouette, intended); mouth never visible | b06 B06-SH01 |
| B06-SH01 line | T08 `slowLine(L)`: EMU-HERO footfall on L 96 (global 1530, "ถัง"), stop at L 109; dust puff per footfall (0.3 m, `paintPlume`) | T08 |
| B06-SH02 camera | eye (0.3, 1.5, −3.15) → (0.3, 1.5, −3.3), yaw −12.2 → −7, pitch −2, f 1000, hy 760, ease-in-out L 0–35 | b06 B06-SH02 Camera |
| B06-SH02 EMU-HERO | (0, 0, −5.0) facing +z (heading π/2; a cheat from B06-SH01's x −1.4 across the cut, accepted: different lens and size); L 0–4 still (stand, eyes to the lens, lid 0.30); bow = `mixEmuPose(stand, EMU_POSES.bow(), u)`: u 0 → 1 over **L 5–19** (ease-in-out, bottom at L 19 = global 1563), 1 → 0 over **L 19–31**; feather ruffle L 5–15 (body plume jitter ± 0.01 m, seeded per plume, on the story clock); L 31–35 upright and still, neutral (no smirk); feet: the bow's `pads` mix in and out with u (one foot draws back and returns) | b06 B06-SH02 Staging; VD30-05b |
| B06-SH02 one bow | exactly one bow; no hold of the bow into L16; cut at 1580 | FACTCHECK-R3 |
| Probe leads | B06-SH01 EMU-HERO L 0 and 109; B06-SH02 head point at L 19 | T03 probe |

**Judgment for the builder (Hard).** B06-SH01: slow, heavy, inevitable: each stance foot planted, the line advancing like armour. B06-SH02: a beat of stillness, then one slow gracious bow (the locked bow as painted) and back up, deadpan.

## Proof
- Stills (`out/edu30-T31/`): SH01 L 0, 54, 96, 109; SH02 L 0, 5, 12, 19, 25, 31, 35.
- `scripts/qa-sheet.sh out/edu30-T31/sheet.png --cols 6 --width 270 out/edu30-T31/s*.png`; `measure-shots.ts B06-SH01 0,109`; clean SH01 L 96 and SH02 L 19 through `caption-zone.py`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| SH01 L 0 / 109 | line abreast, EMU-HERO centre, MEREDITH's shoulder and hat top left | EMU-HERO 485 ± 25 → 615 ± 30 px |
| SH01 L 96 | EMU-HERO's foot just planted | the stance pad's world position equal at L 96 and L 100 (slip ≤ 0.02 m) |
| SH02 L 19 | bottom of the bow, head above y 1100 | bow head near (549 → 436, 993 → 1024) ± 40 px |
| SH02 L 35 | upright, eyes to the lens, no smirk | tuft and bib visible |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
