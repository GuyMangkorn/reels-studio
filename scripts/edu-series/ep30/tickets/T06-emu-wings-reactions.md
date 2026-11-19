# T06 — the emu has stubby wings, a pose mixer and the reaction poses (startle, duck-flap, hop, tiny flap)
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: figure · Hard: yes (animal, movement)
Blocked by: T03 (both write `looks.ts`) · Consumers: B03-SH01, B04-SH03, B05-SH03, B06-SH04 (and T07, T08)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules) (Hard-ticket checks), brief [VD30-05 / VD30-05a / VD30-05b](../short/film-brief.md#look-frames) and [VD30-11 Birds](../short/film-brief.md#vd30-11); the locked creature [emu.ts](../../../../src/painted/edu30/emu.ts) (`EmuPose`, `buildEmu`, `EMU_POSES`, `feather`).

## Build
Extend the locked emu (KP-EMU r1, user-locked W3.2) without changing any locked pose: add a stubby wing on each flank, a numeric pose mixer for transitions, and four reaction poses. The emu is a real animal (no cartoon wings): the wing is a small dark feather tuft that is hidden in the body plumage when folded.
Casting line: `new: emu` (locked look) + `new: emu-wing-flap`, `new: emu-startle`, `new: emu-hop`.
Files: `src/painted/edu30/emu.ts`, `src/painted/edu30/looks.ts` (adds KP stills `KP-startle`, `KP-duck`, `KP-hop`, `KP-flap` to `LOOK_DEFS` for the proof), `tests/edu30-emu.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Creature frame | as emu.ts: +x forward (beak side), +y up, +z the bird's LEFT (pads use `g * 0.11`, g > 0 = left) | emu.ts |
| `EmuPose.wing` | new field 0..1 per side or both: `wing?: number \| [left, right]`; default 0 | ticket |
| Wing geometry | root at body point (0.10, 1.00, ±0.21) (left +, right −); a flat 4-point feather bunch (`feather()` style, two-sided) 0.24 m long, 0.09 m wide at the root, colour `EMU_PX.bodyDark` with 3 loose plumes `EMU_PX.neckFeather` 0.10 m at the tip | ticket (real emu wing about 20 cm, vestigial) |
| Folded (wing 0) | wing direction (−0.55, −0.83, 0) (down and back along the flank), pushed 0.02 m inside the body surface so plumage hides at least 70 % of it at KP-stand | ticket |
| Open (wing 1) | direction rotated out from the flank about the root's forward (+x) axis by 75° (tip at about (0.05, 1.05, ±0.43)) and 15° forward; in between: angle = 75° × wing, linear | ticket |
| `mixEmuPose(a, b, u)` | linear mix of every numeric field and every L3 component of `walk`, `pitch`, `bob`, `head`, `neckMid`, `headDir` (renormalised), `headYaw`, `lid`, `pads`, `lift`, `wing`; missing fields take the `buildEmu` default before mixing; `hero` and `tone` from `a`; `u` clamped 0..1 | ticket |
| `EMU_POSES.startle(o)` | head (0.30, 1.70, 0), neckMid (0.22, 1.36, 0), headDir (0.6, 0.3, 0), pitch +0.08, lid 0 (eyes wide), wing 0.4; feet: the pads of the pose it comes from (both planted; no step) | VD30-11 Birds ("heads snap up") |
| `EMU_POSES.duck(o)` | head (0.55, 1.15, 0), neckMid (0.40, 1.20, 0), headDir (0.8, −0.3, 0), pitch −0.10, bob −0.04, lid 0.2; feet planted | b04 B04-SH03 Queue ("heads duck") |
| Duck-flap motion (B04-SH03, from local 11) | f 0–2 mix current → duck (u ease-out); wing keys f 0: 0, f 2: 0.9, f 4: 0.2, f 6: 0.9, f 8: 0.1, f 10: 0; f 10–16 mix duck → walk pose again; both feet planted f 0–16 at their world positions (the planted pads do not move) | b04 B04-SH03 |
| Startle motion (B03-SH01, per bird from its delay frame d) | f d+0 → d+2 mix → startle (snap, ease-out); hold d+2 … d+5; then the run (T08 scatter) | b03 B03-SH01 Flock F1 row |
| `emuHop(f, o: {side: 1 \| −1; dist: 0.6})` (f = frames since start, B04-SH03 start local 18) | f 0: crouch (bob −0.08, pitch −0.05, both pads planted); f 1–5 airborne: body moves sideways `dist` m toward the bird's `side` (positive = left), height parabola apex 0.25 m at f 3, both pads lifted 0.15 m toward the body (`lift`), wing 0.8; f 6 landing (both feet down together, bob −0.06), splash at f 6 (= local 24); f 7–9 recover to stand (bob 0, wing 0) | b04 B04-SH03 Queue row |
| Tiny flap (B05-SH03 local 69–76, B06-SH04 local 25–32; seen from behind) | wing keys f 0: 0, f 2: 0.55, f 4: 0.10, f 5: 0.45, f 7: 0; body bob +0.01 at f 2 and f 5; feet planted; head unchanged | b05 B05-SH03, b06 B06-SH04 |
| Gait contact (all walks and runs) | the stance foot stays fixed in the world: phase rate per frame = v / (30 × A), where A is the body advance per gait cycle that makes `gaitFoot`'s stance foot static (compute A once per stride value numerically from `gaitFoot`); export `gaitAdvance(stride)` | ticket (contact rule) |
| EMU-HERO identity | tuft and bib unchanged in every new pose | VD30-05 |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/KP-EMU-sheet.png`, `KP-stand.png`, `KP-run.png`, `KP-bow.png` (same folder). New poses must match their body, colour and rim exactly; only the wings and the head/neck pose differ.

**Judgment for the builder (Hard).** The wing must read as a real emu's: small, dark, close to the body, a quick flutter rather than a flap through the air. Four views needed: left, right, back (B05-SH03/B06-SH04 are back views: both wings show as small dark tufts that flick out sideways at the flank), front three-quarter (B04-SH03 queue). At wing 0 the stills must look identical to the locked KP stills.

## Proof
- `node scripts/test.mjs tests/edu30-emu.test.ts`: `mixEmuPose(a, a, u)` equals `a`; `mixEmuPose(a, b, 0)` equals `a` and `1` equals `b`; `gaitAdvance(EMU_WALK.stride)` stance-foot slip over its stance frames ≤ 0.02 m; `buildEmu({})` vertex output equals the pre-change build (wing 0 is invisible to the locked look).
- Stills: `sh scripts/edu-series/ep30/short/render-looks.sh T06 KP-stand KP-startle KP-duck KP-hop KP-flap` plus `KP-flap` rendered with heading 0 (back to the lens) as `KP-flap-back`.
- `scripts/qa-sheet.sh out/edu30-T06/sheet.png --cols 6 --width 270 <the six PNGs>`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| KP-stand (T06) vs store KP-stand | unchanged | mean abs pixel difference ≤ 2 |
| KP-flap and KP-flap-back (wing 0.55) | two small dark wing tufts out from the flanks | wing length 0.24 m → 55–75 px at the KP camera (f 1000, d 2.5 m, logged) |
| KP-startle | head up and back, eyes wide | head top ≥ 1.75 m (measured from the build) |
| KP-hop (f 3) | both feet off the ground | lowest pad y ≥ 0.15 m |

The proof sheet goes to Film for a look check before T08 uses the wings (Boss records the sheet path in Result; Film answers in the index).

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
