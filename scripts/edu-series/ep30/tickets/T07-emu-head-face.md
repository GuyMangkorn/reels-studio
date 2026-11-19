# T07 — the emu head acts: lens turn, blink, nod, two-state talking beak, neck-sac boom puff (and the relief emu)
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: ready · r3: Film notes added (TICKETS-R3)
Class: figure · Hard: yes (animal face)
Blocked by: T06 (its r3 fix pass first; same files `emu.ts`, `looks.ts`, `tests/edu30-emu.test.ts`; uses `mixEmuPose`) · Consumers: B01-SH01, B01-SH03, B02-SH06, B03-SH03, B04-SH05, B05-SH04, B06-SH02, B07-SH02 (relief emu through `arms.ts`); T08 (heads field, queue stare), T15
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Hard-ticket checks); shot blocks b01 B01-SH01/SH03 Staging, b02 B02-SH06 Staging, b05 B05-SH04 Staging, b07 B07-SH02 Staging; [emu.ts](../../../../src/painted/edu30/emu.ts) `lid`, `headYaw`, `EMU_POSES.look`; looks.ts `lensYaw`; [arms.ts](../../../../src/painted/edu30/arms.ts) `ArmsOpts.emuPose`.

## Build
Head controls on the locked emu, each a new `EmuPose` field (or helper) defaulting to the locked look, plus their KP stills.
Casting line: `new: emu` + `new: emu-beak-talk`, `new: emu-sac-boom`, `new: emu-nod`, blink, lens turn.
Files: `src/painted/edu30/emu.ts`, `src/painted/edu30/arms.ts` (only if `headYaw`/`lid` do not survive the flatten), `src/painted/edu30/looks.ts` (KP stills `KP-beak`, `KP-sac`, `KP-blink`, `KP-nod`, `KP-lookback`), `tests/edu30-emu.test.ts`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| `emuLensYaw(at: V3, heading, cam: YCam, off = 0.45)` | the looks.ts `lensYaw` math generalised from the fixed `KP_EYE` to any camera eye (same `off`, same wrap), clamped ±1.2 rad; looks.ts `lensYaw` then calls it with `KP_EYE` (KP-look unchanged). A turn eases (ease-in-out) from the start yaw to the target over the sheet frames | KP-look; b01 B01-SH01, b07 B07-SH02 |
| Blink | existing `lid`; a blink is 4 frames from base b: f 0 0.8, f 1 1.0, f 2 0.6, f 3 b; export `blinkLid(f, base)` (f < 0 or > 3 → base). Starts: B01-SH03 local 6, B02-SH06 local 33, B03-SH03 local 44, B07-SH02 local 54 | b01, b02, b03, b07 Staging |
| Base lids | deadpan look 0.30 (`EMU_POSES.look`), face close 0.32 (KP-face), startle 0 | emu.ts, looks.ts |
| `nod` | new field, m: the head joint and neckMid move down by `nod` (neckMid × 0.5); B02-SH06 keys per nod starting at s: s 0, s+3 0.04 (ease-out), s+6 0 (ease-in-out); s = local 7, 17, 23 (global 599, 609, 615 = "สาม", "คน", "เหรอ") | b02 B02-SH06 (head 4 cm down 3 f, up 3 f) |
| `beak` | new field, **two states** 0 or 1 (no in-between): 1 = lower mandible rotated down 18° about the bill hinge, interior `#2a1d16`; default 0 | VD30-12 (`emu-beak-talk`, two states) |
| Talk keys | `talkBeak(L, onsets)`: beak 1 on frames onset, onset+1, onset+2, else 0. B02-SH06 onsets local 7, 17, 51, 60 (global 599, 609, 643, 652); B05-SH04 local 6, 13, 21, 28 (global 1394, 1401, 1409, 1416) | b02 B02-SH06, b05 B05-SH04 |
| `sac` | new field 0..1: the throat front swells at neck u 0.25–0.55 (u from the neck base): front-side radius × (1 + 0.6 × sac), with an oval bare-skin patch `EMU_PX.skin` 0.10 × 0.14 m at sac 1, scaling with sac (feathers part around it); back of the neck unchanged | b01 B01-SH03 |
| Sac keys (B01-SH03 local) | 26: 0 → 34: 1.0 (ease-out) → hold to 40 → 48: 0.2 (ease-in-out) → 50: 0.1 | b01 B01-SH03 |
| B02-SH06 look back (Film fix) | the bird faces +z with the camera behind it at +x; it turns its head **over its LEFT shoulder** (the lens side; the sheet's "right shoulder" is a slip: the camera is on the bird's left) by `headYaw` 0 → `emuLensYaw(...)` (expected ≈ +1.15 rad, clamp 1.2) over local 30–44 ease-in-out, holds to 74: its left eye to the lens | b02 B02-SH06 Staging and Camera |
| Relief emu (B07-SH02) | `arms.ts` passes the `EmuPose` through `emuPose` (`flatten` 0.35); head turn `headYaw` 0 → the KP-look three-quarter value over local 34–49 (global 1889–1904), blink local 54; `headYaw` and `lid` must survive the flatten (check; fix in `arms.ts` only if they do not) | b07 B07-SH02 |
| EMU-HERO identity | tuft and bib unchanged with every control | VD30-05 |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/KP-face.png`, `KP-look.png`; `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TA2.png` (relief emu looking at the lens).

**Judgment for the builder (Hard, face).** The emu's expression is deadpan: eye ring and half lid carry it; never add brows, a smile or a smirk (FACTCHECK-R3 for the bow). The beak opens like a bird's, the lower mandible only, a clear dark gap at 270 px, shut between syllables. The sac is the bird's own throat swelling, not a balloon: bulge on the front of the lower-middle neck, neck outline continuous. Views: front three-quarter (B01-SH03, B04-SH05, B05-SH04, B06-SH02), rear three-quarter with the head turned back (B02-SH06), relief three-quarter (B07-SH02).

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Mixer rule (T06 r3).** Add every new numeric or L3 field of this ticket (beak, sac, blink, nod, lens-turn controls) to `mixEmuPose`, mixing from its `buildEmu` default when one side lacks it, so a gesture eases in; only `stride` and `pads` stay one-sided (taken whole). Tests: `mixEmuPose(a, a, u) = a`, u 0 = a, u 1 = b for each new field.
- **Wing (T06 r3).** The wing is the r3 plume drawing; startle carries wing 0.15. Every KP still of this ticket is compared with the T06 r3 renders, not r1.

## Proof
- `node scripts/test.mjs tests/edu30-emu.test.ts`: defaults (`nod` 0, `beak` 0, `sac` 0) give the pre-change build; `blinkLid` sequence; `talkBeak` is exactly 0 or 1 and 0 outside the onset windows.
- `sh scripts/edu-series/ep30/short/render-looks.sh T07 KP-face KP-beak KP-sac KP-blink KP-nod KP-lookback` (KP-face camera for the first five; `KP-lookback` = EMU-HERO at the B02-SH06 mark and camera at local 44) then `scripts/qa-sheet.sh out/edu30-T07/sheet.png --cols 6 --width 270 out/edu30/looks/T07/*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| KP-face (T07) vs store | unchanged | mean abs pixel difference ≤ 2 |
| KP-beak | open beak, dark interior visible | gap at the bill tip ≥ 6 px at full size |
| KP-sac | throat bulge with a pale skin patch on the front of the neck | neck front width at u 0.4 is 1.45–1.75 × KP-face's (logged px) |
| KP-blink | eye shut | lid 1.0, no iris pixels |
| KP-lookback | head turned back toward the lens, left eye visible, tuft visible | eye centre inside the head silhouette on the lens side (logged) |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
