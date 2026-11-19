# T07 — the emu head acts: blink, head cock, open beak for its lines, neck-sac boom puff
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: figure · Hard: yes (animal face)
Blocked by: T06 (same files `emu.ts`, `looks.ts`; uses `mixEmuPose`) · Consumers: B01-SH01, B01-SH03, B03-SH03, B04-SH05, B06-SH02, B07-SH02 (relief emu through `arms.ts`)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules) (Hard-ticket checks), shot blocks [b01 B01-SH03](../short/scene-sheets/b01.md) Staging, [b04 B04-SH05](../short/scene-sheets/b04.md) Staging, [b06 B06-SH02](../short/scene-sheets/b06.md), [b07 B07-SH02](../short/scene-sheets/b07.md); [emu.ts](../../../../src/painted/edu30/emu.ts) `lid`, `headYaw`, `EMU_POSES.look`.

## Build
Four head controls on the locked emu, each a new `EmuPose` field defaulting to the locked look, plus the KP stills that prove them.
Casting line: `new: emu` + `new: emu-head-cock`, `new: emu-sac-boom`, `new: emu-talk`, blink.
Files: `src/painted/edu30/emu.ts`, `src/painted/edu30/looks.ts` (KP stills `KP-cock`, `KP-sac`, `KP-beak`, `KP-blink`), `tests/edu30-emu.test.ts`

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Blink | existing `lid` 0..1; a blink is 4 frames from the current base lid b: f 0: 0.8, f 1: 1.0, f 2: 0.6, f 3: b; export `blinkLid(f, base)` (f < 0 or > 3 → base) | b01 B01-SH03 (blink local 6–9), b07 B07-SH02 (local 61–64) |
| Base lids | deadpan look 0.30 (`EMU_POSES.look`), face close 0.32 (KP-face), startle 0 | emu.ts, looks.ts |
| `headRoll` | new field, rad, roll of the head about its `headDir` axis after `headYaw` (+ = top of the head toward the bird's left); B04-SH05 cock = −0.436 (25°, top of the head tips toward the bird's right = screen left when the bird faces the lens; Film choice: the tilt goes away from the gun line, like a dog's quizzical tilt) | b04 B04-SH05 ("about 25° roll") |
| `beak` | new field 0..1: the lower mandible rotates down about the bill hinge by 14° × beak; mouth interior `#2a1d16`; default 0 | ticket (EMU L07, L15 are spoken on screen) |
| Talk keys | `talkBeak(G, ranges)`: inside a speech range the beak cycles 0 → 0.6 → 0 with period 6 f (open f 0–2, close f 3–5), starting at each range start; 0 outside | b03 B03-SH03, b06 B06-SH02 VO rows |
| `sac` | new field 0..1: the throat front swells at neck u 0.25–0.55 (u from the base of the neck): front-side radius × (1 + 0.6 × sac), with an oval patch of bare skin `EMU_PX.skin` 0.10 × 0.14 m at sac 1, scaling with sac (feathers part around it); back of the neck unchanged | b01 B01-SH03 ("throat inflation, feathers part") |
| Sac keys (B01-SH03 local) | 26: 0 → 34: 1.0 (ease-out) → hold to 40 → 48: 0.2 (ease-in-out) → 50: 0.1 | b01 B01-SH03 Staging (swell 26–48, exit deflating) |
| Head turn helper | `emuLensYaw(at: V3, heading: number, cam: YCam, off = 0.45)` in `emu.ts`: the existing looks.ts `lensYaw` math generalised from the fixed `KP_EYE` to any camera eye (same `off`, same wrap), result clamped ±1.2 rad; looks.ts `lensYaw` then calls it with `KP_EYE` (KP-look unchanged); a turn eases (ease-in-out) from the start yaw to the target over the sheet's frames | KP-look (looks.ts `lensYaw`), b01 B01-SH01, b07 B07-SH02 |
| Relief emu | `arms.ts` passes the same `EmuPose` through `emuPose` (`flatten` 0.35); `headYaw` and `lid` must survive the flatten (check, no change expected) | b07 B07-SH02 |
| EMU-HERO identity | tuft and bib unchanged with every control | VD30-05 |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/KP-face.png`, `KP-look.png`; `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TA2.png` (relief emu looking at the lens, B07-SH02 end).

**Judgment for the builder (Hard, face).** Expression is the emu's deadpan: eye ring and half lid carry it; never add brows or a smile. The cock is a slow, clear tilt (25°) with the eye staying on the lens. The sac must read as the bird's own throat swelling, not a balloon: keep the bulge on the front of the lower-middle neck and keep the neck outline continuous. Views: front three-quarter (B01-SH03, B04-SH05, B06-SH02), right profile running (B03-SH03 talk while running: the beak opens in the run pose too), relief three-quarter (B07-SH02).

## Proof
- `node scripts/test.mjs tests/edu30-emu.test.ts`: defaults (`headRoll` 0, `beak` 0, `sac` 0) give the pre-change build; `blinkLid` sequence; `talkBeak` is 0 outside the ranges.
- `sh scripts/edu-series/ep30/short/render-looks.sh T07 KP-face KP-cock KP-sac KP-beak KP-blink` (KP-face camera for all; sac at 1.0, beak 0.6, blink f 1) and `qa-sheet.sh --cols 5 --width 270`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| KP-face (T07) vs store | unchanged | mean abs pixel difference ≤ 2 |
| KP-cock | head tilted, eye still on the lens | measured eye-line angle 20–30° from horizontal |
| KP-sac | throat bulge with a pale-blue skin patch on the front of the neck | neck front width at u 0.4 is 1.45–1.75 × KP-face's (logged px) |
| KP-beak | open beak, dark interior visible at 270 px | gap at the bill tip ≥ 6 px at full size |
| KP-blink | eye shut | lid 1.0, no iris pixels |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
