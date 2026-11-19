# T06 — the emu has two-segment wings, a pose mixer, gait contact and the reaction poses (startle, duck-flap, hop)
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: done
Class: figure · Hard: yes (animal, movement)
Blocked by: T03 (both write `looks.ts`) · Consumers: B03-SH01 (startle), B04-SH03 (duck-flap, hop); T07, T15 (wing rig, mixer), T08, T16 (gait contact)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Hard-ticket checks); brief [VD30-05 / VD30-05a / VD30-05b](../short/film-brief.md#look-frames), [VD30-11 Birds](../short/film-brief.md#vd30-11), [R3 changes VD30-12](../short/film-brief.md#r3-changes) (wings big and clear in the mime beats); the locked creature [emu.ts](../../../../src/painted/edu30/emu.ts) (`EmuPose`, `buildEmu`, `EMU_POSES`, `feather`).

## Build
Extend the locked emu (KP-EMU r1, W3.2) without changing any locked pose: a two-segment wing on each flank that hides in the plumage when folded, a numeric pose mixer, a gait-contact helper, and three reaction poses. The emu stays a real animal: at rest and in the reactions the wing is the real small dark tuft; only the mime gestures (T15) extend it.
Casting line: `new: emu` (locked) + `new: emu-wing`, `new: emu-startle`, `new: emu-flap`, `new: emu-hop`.
Files: `src/painted/edu30/emu.ts`, `src/painted/edu30/looks.ts` (KP stills `KP-startle`, `KP-duck`, `KP-hop`, `KP-flap`, `KP-flap-back` in `LOOK_DEFS`), `tests/edu30-emu.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Creature frame | as emu.ts: +x forward (beak side), +y up, +z the bird's LEFT; `heading` = atan2(facing z, facing x) (π faces −x) | emu.ts, looks.ts |
| `EmuPose.wing` | new field `wing?: WingPose \| [WingPose, WingPose]` ([left, right]; one value = both). `WingPose = {dir: L3; bend: L3; reach: number}`, given for the LEFT wing; the right wing negates z. Default = FOLD | ticket |
| Wing geometry | root at creature (0.10, 1.00, ±0.21); inner segment root → wrist along `dir`, length 0.13 + 0.32 × reach; outer segment wrist → tip along `bend`, length 0.11 + 0.29 × reach (reach 0: 0.24 m, the real vestigial wing; reach 1: 0.85 m, the mime wing of T15). Drawn as a flat two-sided bunch of loose dark plumes (`feather()` style): width 0.09 m at the root tapering to 0.03 m at the tip, colour `EMU_PX.bodyDark`, 3 loose plumes `EMU_PX.neckFeather` 0.10 m at the tip; never flight feathers, never a hand | ticket; VD30-05 (real animal), VD30-12 (big in the mime) |
| FOLD | dir (−0.55, −0.83, 0.08), bend (−0.55, −0.83, 0.02), reach 0; the wing is pushed 0.02 m inside the body surface so the plumage hides ≥ 70 % of it at KP-stand | ticket |
| FLAP_OUT | dir (−0.15, −0.25, 0.96), bend = dir, reach 0 (tip ≈ (0.06, 0.94, 0.44)): the small tuft flicked out sideways | ticket |
| `mixEmuPose(a, b, u)` | linear mix of every numeric field and every L3 component of `walk`, `pitch`, `bob`, `head`, `neckMid`, `headDir` (renormalised), `headYaw`, `lid`, `pads`, `lift`, `wing.dir`/`wing.bend` (renormalised), `wing.reach`; missing fields take the `buildEmu` default before mixing; `hero`, `tone` from `a`; `u` clamped 0..1. T07 and T15 add their fields to this list | ticket |
| `EMU_POSES.startle(o)` | head (0.30, 1.70, 0), neckMid (0.22, 1.36, 0), headDir (0.6, 0.3, 0), pitch +0.08, lid 0, wing mix(FOLD, FLAP_OUT, 0.4); feet: the pads of the pose it comes from (both planted, no step) | VD30-11 Birds ("heads snap up") |
| `EMU_POSES.duck(o)` | head (0.55, 1.15, 0), neckMid (0.40, 1.20, 0), headDir (0.8, −0.3, 0), pitch −0.10, bob −0.04, lid 0.2; feet planted | b04 B04-SH03 Queue ("heads duck") |
| Startle motion (B03-SH01, per bird from its startle frame s) | s+0 → s+2 mix current → startle (ease-out); hold s+2 … s+5; T08 schedules s (local 4 + 0–2 f) and the bunch and bolt after it | b03 B03-SH01 Flock F1 row |
| Duck-flap motion (B04-SH03, from local 12) | f 0–2 mix current → duck (ease-out); wing mix(FOLD, FLAP_OUT, w) with w keys f 0: 0, f 2: 0.9, f 4: 0.2, f 6: 0.9, f 8: 0.1, f 10: 0; f 10–16 mix duck → the walk pose again; both pads planted f 0–16 at their world positions | b04 B04-SH03 Queue row (flinch local 12) |
| `emuHop(f, o: {side: 1 \| −1; dist: 0.6})` (B04-SH03, from local 19) | f 0 crouch (bob −0.08, pitch −0.05, both pads planted); f 1–5 airborne: body moves `dist` m sideways toward `side` (+1 = the bird's left), height parabola apex 0.25 m at f 3, both pads lifted 0.15 m toward the body (`lift`), wing w 0.8; f 6 landing, both feet down together, bob −0.06, splash at f 6 (= local 25, T05 `paintSplash`); f 7–9 recover to stand (bob 0, w 0) | b04 B04-SH03 (hop local 19, splash local 25) |
| Gait contact (all walks and runs) | the stance foot is fixed in the world: phase rate per frame = v / (30 × A), A = body advance per gait cycle that makes `gaitFoot`'s stance foot static, computed once per stride numerically; export `gaitAdvance(stride)` | ticket (contact rule) |
| EMU-HERO identity | tuft and bib unchanged in every new pose | VD30-05 |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/KP-EMU-sheet.png`, `KP-stand.png`, `KP-run.png`, `KP-bow.png` (same folder). New poses match their body, colour and rim exactly; only wings and head/neck differ.

**Judgment for the builder (Hard).** In this ticket the wing reads as a real emu's: small, dark, close to the body, a quick flutter rather than a flap through the air. Views needed: left and right profile (KP camera), back (B04-SH03 birds seen from behind the gun side), front three-quarter (B04-SH03 queue toward the lens). At FOLD every still must look identical to the locked KP stills. The hop is one sideways jump with both feet together, the planted pads never slide before take-off or after landing.

## Proof
- `node scripts/test.mjs tests/edu30-emu.test.ts`: `mixEmuPose(a, a, u)` = a; u 0 = a, u 1 = b; `gaitAdvance(EMU_WALK.stride)` stance-foot slip over its stance frames ≤ 0.02 m; `buildEmu({})` vertex output equals the pre-change build (FOLD is invisible to the locked look); reach 0 total wing length 0.24 m, reach 1 0.85 m.
- `sh scripts/edu-series/ep30/short/render-looks.sh T06 KP-stand KP-startle KP-duck KP-hop KP-flap KP-flap-back` (`KP-hop` at f 3; `KP-flap` = duck pose with w 0.9; `KP-flap-back` the same at heading −π/2, back to the KP lens) then `scripts/qa-sheet.sh out/edu30-T06/sheet.png --cols 6 --width 270 out/edu30/looks/T06/*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| KP-stand (T06) vs store KP-stand | unchanged | mean abs pixel difference ≤ 2 |
| KP-flap, KP-flap-back | two small dark tufts out from the flanks | tuft length 0.24 m → 80–110 px at the KP camera (f 1000, d ≈ 2.5 m; logged) |
| KP-startle | head up and back, eyes wide | head top ≥ 1.75 m (from the build) |
| KP-hop (f 3) | both feet off the ground | lowest pad y ≥ 0.15 m |

The proof sheet goes to Film for a look check before T08 and T16 use the reactions (Boss records the sheet path in Result; Film answers in the index Look checks).

## Result (Boss fills)
Commit: see the branch tip `T06` commit (EDU-EP30 T06) · proof sheet: `out/edu30-T06/sheet.png` (KP-stand, KP-startle, KP-duck, KP-hop, KP-flap, KP-flap-back); archived with the stills and `fold-diff.png` to the store `projects/edu/EDU/previews/` (`sheet.png`, `KP-startle.png`, `KP-duck.png`, `KP-hop.png`, `KP-flap.png`, `KP-flap-back.png`, `KP-fold.png`, `fold-diff.png`) · fix passes used: 0

Measured (Sonnet, 19 Nov 2026):
| Frame | Number | Range | Result |
| --- | --- | --- | --- |
| KP-stand (T06) vs store KP-stand | mean abs pixel difference 0.0002 (gray, 0-255) | <= 2 | pass |
| KP-fold (KP-stand with `wing: WING_FOLD`) vs KP-stand | mean abs 0.004; one small wing point (about 12 px) shows under the mop edge, see `fold-diff.png` | <= 2 | pass |
| KP-flap, KP-flap-back tuft | 86.1 px left and right (logged by the test) | 80-110 | pass |
| KP-startle head top | 1.776 m | >= 1.75 | pass |
| KP-hop f 3 lowest pad y | 0.40 m (body 0.25 m + pad 0.15 m) | >= 0.15 | pass |
| `node scripts/test.mjs tests/edu30-emu.test.ts` | 9 of 9 pass (mixer, gait slip <= 0.02, pre-change hash of five builds, wing lengths 0.24 / 0.85, startle, duck-flap, hop planted pads, tuft px) | all | pass |

Notes and the values read as follows (Film may revise):
- **FOLD and `buildEmu({})`.** The ticket asks both that `wing` default to FOLD and that `buildEmu({})` equal the pre-change build. Built as: `wing` absent draws no wing at all (identical vertex output, five builds hashed), and `wing: WING_FOLD` draws a wing that hides in the mop. The mixer takes a missing wing as FOLD.
- **Root inset.** FOLD root z is pulled 0.02 m inside (0.19); the inset fades to 0 as the wing goes out so FLAP_OUT keeps its stated tip (0.06, 0.94, 0.44).
- **Sheet orientation.** The flat's width vector is not in the ticket: in the flank plane at FOLD, turning vertical (seen from behind) as the wing goes out.
- **Hop pads.** Hop returns `{pose, offset}` (creature frame, +z the bird's left; add `offset` to `at`, including the y arc). The pad `lift` is carried in the pads' y (0.15 m relative to the body) because `pads` override `lift`. The pads land at the stand pads, both together.
- **Hop shadow.** The body arc is `at[1]`, so the painted shadow rides up with the bird (paintBeast puts it at `ground + 0.01`); T16 and T27 need a ground-level shadow on the hop frames (a `flock.ts` change, not in this ticket's Files).
- **Easing between wing keys** (duck-flap w, hop w) is linear; the ticket names ease-out only for the pose mixes.
- Extra helpers exported for T07, T08, T15, T16: `emuPads`, `gaitPhase`, `wingMix`, `emuStartle`, `emuDuckFlap`, `emuHop`, `WING_FOLD`, `WING_FLAP_OUT`, and wing anchors `wingRoot/Wrist/Tip` L and R. Extra look `KP-fold`.
- Mixer rule for a field only one pose has (`stride`, `pads`): taken whole from that side. T07 and T15 add their fields to `mixEmuPose`.
- Hard-ticket checks: no hand or arm is drawn; planted pads slip 0 m across f 0-16 of the duck-flap and f <= 0 and f >= 6 of the hop; tuft and bib unchanged (hero: true on every KP still).
- `npm test`: 229 of 245 pass; the 16 failures are this worktree's missing `@remotion/three` and store media (not touched by T06; no edu30 test fails). `tsc` shows only the same missing-module errors (none in `src/painted/edu30` or the T06 test). Film's look check of the sheet is still pending.
