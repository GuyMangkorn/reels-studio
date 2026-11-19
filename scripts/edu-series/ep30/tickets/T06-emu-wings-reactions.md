# T06 — the emu has two-segment wings, a pose mixer, gait contact and the reaction poses (startle, duck-flap, hop)
Deliverable: EDU-EP30-SHORT · Revision: r5 · Status: r4 accepted except the neck (r5 Film look check, 2026-11-20: flap-back, tuft and the reactions pass; the neck join (luma step 20) and the neck-mid notch are fixed by rows N1–N4, which run inside T07 or as a T06 r5 pass on Opus by the user's answer to index Q-R5-1, because T06 has used its two fix passes; r4 built: FLAP_OUT, plume tone and width, bib blend u 0.40–0.50; r3 built: plume wings, startle 0.15, neck bend 17.4°)
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
| Wing geometry | root at creature (0.10, 1.00, ±0.21); inner segment root → wrist along `dir`, length 0.13 + 0.32 × reach; outer segment wrist → tip along `bend`, length 0.11 + 0.29 × reach (reach 0: 0.24 m, the real vestigial wing; reach 1: 0.85 m, the mime wing of T15). **r3 drawing (replaces the r1 dark flat and its three tip plumes):** the two segments carry no solid flat; they are covered by 7 seeded loose plumes (`feather()`, the mop's construction), lengths 0.08–0.16 m × (1 + reach), each plume's direction = normalise(segment direction + (0, −0.8, 0)) so it droops, colours alternating `mixColor(EMU_PX.body, EMU_PX.bodyDark, 0.15)` and `mixColor(EMU_PX.body, EMU_PX.bodyDark, **0.35**)` (r4; 0.55 gave chunky dark ends from behind), plume root width **0.030 m** (r4: the `wv` offset ± 0.015, was ± 0.022) (the mop's tones, no single dark bar); no three-plume tip fan (it read as fingers); the silhouette edge stays broken (no straight edge longer than 0.10 m along a segment); never flight feathers, never a hand | ticket; VD30-05 (real animal), VD30-12 (big in the mime) |
| FOLD | dir (−0.55, −0.83, 0.08), bend (−0.55, −0.83, 0.02), reach 0; the wing is pushed 0.02 m inside the body surface so the plumage hides ≥ 70 % of it at KP-stand | ticket |
| FLAP_OUT (r4) | **dir normalise(−0.35, −0.70, 0.62), bend normalise(−0.40, −0.88, 0.25), reach 0 (tip ≈ (0.010, 0.812, 0.319))** (r4: the r3 dir (−0.30, −0.45, 0.84) / bend (−0.40, −0.80, 0.45), tip (0.017, 0.853, 0.368), still stood out level enough from behind to read as two short arms); r3 reading kept: the small tuft lifted off the flank with its plumes hanging down, a ruffle rather than a limb held out (r1 dir (−0.15, −0.25, 0.96) read as two arms from behind); the r1 root-inset fade applies to the new tip | Film r3 look check |
| `mixEmuPose(a, b, u)` (r3: as built) | linear mix of every numeric field and every L3 component of `walk`, `pitch`, `bob`, `head`, `neckMid`, `headDir` (renormalised), `headYaw`, `lid`, `pads`, `lift`, `wing.dir`/`wing.bend` (renormalised), `wing.reach`; missing fields take the `buildEmu` default before mixing; `hero`, `tone` from `a`; `u` clamped 0..1. r3, accepted as built: `wing` absent = no wing drawn (keeps `buildEmu({})` identical to the locked look) and the mixer reads a missing wing as FOLD; a field only one side has is taken whole from that side for `stride` and `pads` (contacts must not drift toward a default). T07 and T15 add their fields to this list (rule written in both tickets) | ticket; Film r3 |
| `EMU_POSES.startle(o)` | head (0.30, 1.70, 0), neckMid (0.22, 1.36, 0), headDir (0.6, 0.3, 0), pitch +0.08, lid 0, wing mix(FOLD, FLAP_OUT, **0.15**) (r3; 0.4 drew a dark diagonal across the body in profile); neck one smooth curve: the bend between base → `neckMid` and `neckMid` → head ≤ 25°, Boss moves `neckMid` x only to meet it (logged), and the bib joins the neck with no step (r3: KP-startle r1 shows a kink and a step at the bib top); feet: the pads of the pose it comes from (both planted, no step) | VD30-11 Birds ("heads snap up") |
| `EMU_POSES.duck(o)` | head (0.55, 1.15, 0), neckMid (0.40, 1.20, 0), headDir (0.8, −0.3, 0), pitch −0.10, bob −0.04, lid 0.2; feet planted | b04 B04-SH03 Queue ("heads duck") |
| Startle motion (B03-SH01, per bird from its startle frame s) | s+0 → s+2 mix current → startle (ease-out); hold s+2 … s+5; T08 schedules s (local 4 + 0–2 f) and the bunch and bolt after it | b03 B03-SH01 Flock F1 row |
| Duck-flap motion (B04-SH03, from local 12) | f 0–2 mix current → duck (ease-out); wing mix(FOLD, FLAP_OUT, w) with w keys f 0: 0, f 2: 0.9, f 4: 0.2, f 6: 0.9, f 8: 0.1, f 10: 0; f 10–16 mix duck → the walk pose again; both pads planted f 0–16 at their world positions | b04 B04-SH03 Queue row (flinch local 12) |
| `emuHop(f, o: {side: 1 \| −1; dist: 0.6})` (B04-SH03, from local 19) | f 0 crouch (bob −0.08, pitch −0.05, both pads planted); f 1–5 airborne: body moves `dist` m sideways toward `side` (+1 = the bird's left), height parabola apex 0.25 m at f 3, both pads lifted 0.15 m toward the body (`lift`), wing w 0.8; f 6 landing, both feet down together, bob −0.06, splash at f 6 (= local 25, T05 `paintSplash`); r3: the returned `offset` y is the height above the ground, which consumers pass as the member's `air` (T35) so the shadow stays on the ground; f 7–9 recover to stand (bob 0, w 0) | b04 B04-SH03 (hop local 19, splash local 25) |
| Gait contact (all walks and runs) | the stance foot is fixed in the world: phase rate per frame = v / (30 × A), A = body advance per gait cycle that makes `gaitFoot`'s stance foot static, computed once per stride numerically; export `gaitAdvance(stride)` | ticket (contact rule) |
| EMU-HERO identity | tuft and bib unchanged in every new pose | VD30-05 |
| Neck colour seam (r4) | in the neck loft `col`, the hero bib branch (`o.hero && u < 0.5 && sd < −0.1`) blends linearly over **u 0.40 → 0.50** from its own colour into the non-bib colour at the same u (`mixColor(bibCol, neckCol, (u − 0.40) / 0.10)`), so both branches are equal at u 0.5; below u 0.40 the bib is unchanged. Applies to every hero build, so KP-stand and the locked hero change in that band only | Film r4 look check (a hard step where the bib ends, visible in KP-startle and KP-stand) |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/KP-EMU-sheet.png`, `KP-stand.png`, `KP-run.png`, `KP-bow.png` (same folder). New poses match their body, colour and rim exactly; only wings and head/neck differ.

**Judgment for the builder (Hard).** In this ticket the wing reads as a real emu's: small, dark, close to the body, a quick flutter rather than a flap through the air. Views needed: left and right profile (KP camera), back (B04-SH03 birds seen from behind the gun side), front three-quarter (B04-SH03 queue toward the lens). At FOLD every still must look identical to the locked KP stills. The hop is one sideways jump with both feet together, the planted pads never slide before take-off or after landing.

## Proof
- `node scripts/test.mjs tests/edu30-emu.test.ts`: `mixEmuPose(a, a, u)` = a; u 0 = a, u 1 = b; `gaitAdvance(EMU_WALK.stride)` stance-foot slip over its stance frames ≤ 0.02 m; `buildEmu({})` vertex output equals the pre-change build (FOLD is invisible to the locked look); reach 0 total wing length 0.24 m, reach 1 0.85 m.
- `sh scripts/edu-series/ep30/short/render-looks.sh T06 KP-stand KP-startle KP-duck KP-hop KP-flap KP-flap-back` (`KP-hop` at f 3; `KP-flap` = duck pose with w 0.9; `KP-flap-back` the same at heading −π/2, back to the KP lens) then `scripts/qa-sheet.sh out/edu30-T06/sheet.png --cols 6 --width 270 out/edu30/looks/T06/*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| KP-stand (T06) vs store KP-stand | unchanged | mean abs pixel difference ≤ 2 |
| KP-flap, KP-flap-back | two small dark tufts out from the flanks | tuft length 0.24 m → 80–110 px at the KP camera (f 1000, d ≈ 2.5 m; logged), measured along the drawn path root → wrist → tip on KP-flap (r4: the path, not the chord; the drooping tip shortens the chord) |
| KP-flap-back (r4) | small loose tufts hanging off the flanks, no arm or hand read | each tuft's outward extent beyond the body silhouette ≤ 30 px (logged; r3 about 0.12 m); tip y ≤ 0.82 m (from the build) |
| KP-stand, KP-startle (r4) | bib joins the bare neck with no hard edge | luma step across u 0.5 on the front edge ≤ 8 (6 px sample either side, logged); KP-stand vs store KP-stand: every changed pixel inside the neck bbox (logged), mean abs ≤ 2 over the frame |
| KP-startle | head up and back, eyes wide | head top ≥ 1.75 m (from the build) |
| KP-hop (f 3) | both feet off the ground | lowest pad y ≥ 0.15 m |

The proof sheet goes to Film for a look check before T08 and T16 use the reactions (Boss records the sheet path in Result; Film answers in the index Look checks).

## r3 decisions (Film, 2026-11-19): look check of the r1 sheet and the open notes
Look check (viewed: the store stills `KP-stand`, `KP-fold`, `KP-startle`, `KP-duck`, `KP-flap`, `KP-flap-back`, `KP-hop`, tiled at 270 px plus 700 px crops of startle, flap and flap-back): **fix**.
- KP-startle: the wing at mix 0.4 is a dark straight bar across the flank ending in three prongs, which reads as an arm and a claw; the neck kinks at the bib with a visible step.
- KP-flap-back: the two tufts stand straight out level from the flanks with three-pronged ends: from behind the bird reads as a person holding its arms out. Fails "never a hand" and VD30-05 (real animal).
- KP-stand, KP-fold, KP-duck, KP-flap (profile) and KP-hop pass (fold hidden in the mop; hop with both feet off the ground; flap in profile reads as a ruffle).
Decisions: the plume drawing, the drooping FLAP_OUT, startle 0.15 and the neck curve rule in the Decided values table; the FOLD / `buildEmu({})` reading and the one-sided mixer rule accepted as built; the hop shadow goes to the new ticket **T35** (`beast.ts` `air` for the shadow, `flock.ts` `EmuMember.air`), which blocks T08, T16 and T27.
r3 work for Boss: the wing drawing and FLAP_OUT in `emu.ts`, the startle wing and neck values; keep every r1 test (fold invisible, lengths 0.24 / 0.85, tuft 80–110 px, slip); re-render `KP-stand KP-fold KP-startle KP-duck KP-flap KP-flap-back KP-hop` to `out/edu30/looks/T06/` and the sheet, plus 700 px crops of startle, flap and flap-back; archive with a ticket-named folder (`--path out/edu30-T06`, files named `T06-*.png`, so the store `sheet.png` of other tickets is not overwritten). New proof rows: FLAP_OUT tip y ≤ root y − 0.10 m (from the build); startle neck bend ≤ 25° (logged); Film's look check again in the index (pending r3). Files: `src/painted/edu30/emu.ts`, `src/painted/edu30/looks.ts` (only if a KP still id changes), `tests/edu30-emu.test.ts`.

## r4 decisions (Film, 2026-11-19, `EDU-EP30-TICKETS-R4`): look check of the r3 sheet
Viewed: store `T06-sheet.png` (7 stills at 270 px) and `T06-crops.png` (startle, flap, flap-back). **fix** on two items, the rest pass.
1. **Tuft length: the path.** The ticket row says "tuft length 0.24 m"; that is the wing's length, so the drawn path root → wrist → tip is the measure (82.1 px, pass). The chord is not a range. Range 80–110 unchanged.
2. **Neck seam: fix.** The crops show a hard horizontal step where the pale hero bib stops at u 0.5 and the dark neck colour starts; it is a code cutoff (`u < 0.5` branch), not anatomy, and it is the same step in KP-stand. A real emu's feathered neck fades into the bare skin. Fix in the Decided values (blend over u 0.40–0.50). This touches the user-locked KP-EMU hero in the neck band only; the coordinator shows the before/after crop to the user with this ticket's result (see index R4 question). If the user wants the locked pixels back, revert this one row; nothing else depends on it.
3. **KP-flap-back: fix with numbers.** From behind, the two tufts still stand out from the flanks with dark chunky ends and read as short arms with ragged sleeves at 270 px. FLAP_OUT moves closer to the flank (tip z 0.368 → 0.319, tip y 0.853 → 0.812), the darker plume tone 0.55 → 0.35 and the plume width 0.044 → 0.030 m (Decided values). The duck-flap w keys and the hop w 0.8 are unchanged; they now open to the new FLAP_OUT.
4. **Startle wing at 0.15: accepted.** The startle is a head snap; the wing hidden in the mop is the real bird. Nothing else in the startle changes (neck bend 17.4° passes).
5. KP-stand, KP-fold, KP-duck, KP-flap (profile) and KP-hop pass.
- r4 work for Boss: FLAP_OUT, plume tone and width, the neck blend in `emu.ts`; tests: keep every r3 test (the no-wing hash of five builds changes only if a hero build is in it: re-take that hash after the blend and log both), new: FLAP_OUT tip y ≤ 0.82; re-render the seven KP stills and the three crops plus a neck crop of KP-stand before/after (the user sees it); archive as `T06r4-*.png`. Files: `src/painted/edu30/emu.ts`, `tests/edu30-emu.test.ts`.

## r5 decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R5`): look check of the r4 sheet
Viewed: store `T06r4-sheet.png` (7 stills, about 155 px a tile), `T06r4-crops.png` (startle, flap, flap-back) downscaled to 1100 px wide, `T06r4-flap-back-before-after.png` at 700 px, `T06r4-neck-before-after.png` at 1100 px and `T06r4-neck-startle-after.png` at full size (500 px crop).
1. **KP-flap-back: pass.** The two tufts now hang as loose fringes along the flanks, lighter and thinner; they no longer read as arms in sleeves (r3 left vs r4 right in the before/after).
2. **Tuft path 80.7 px against the 80 floor: pass, as measured.** It is inside the range; the r4 thinner plume was asked for, and the flap still reads as a wing at 270 px (KP-flap). No change.
3. **Neck join: fix, widen the blend (the option offered to the user as recommended).** The r4 step 45 → 20 is still a visible band edge in KP-startle and KP-duck (the pale skin section sits on a darker collar). More rings alone would change the neck silhouette for a colour fault; the colour ramp is the cause, so widen it first and use finer rings only as the fallback the numbers call for (N3).
4. **Neck-mid notch: fix.** The full-size startle crop shows a pale wedge and a sideways step in the neck outline just above the dark band, at the neck-mid seam; at 270 px it reads as a joint or a broken neck in the startle head-snap (B03-SH01) and the duck (B04-SH03), the two shots that use these poses. The 17.4° bend rule stays; the outline must be continuous.
5. Everything else of r4 stands (FLAP_OUT, plume tone 0.35, width 0.030, the duck-flap and hop w keys, the no-wing hash).

**Rows N1–N4 (the neck; written once here, run where Q-R5-1 says).** Files: `src/painted/edu30/emu.ts`, `tests/edu30-emu.test.ts`.

| Row | Value | Pass |
| --- | --- | --- |
| N1 blend | hero bib colour → neck colour over **u 0.15–0.50** (was 0.40–0.50): `u < 0.15 ? bibCol : mixColor(bibCol, neckCol, (u − 0.15) / 0.35)`; equal at u 0.5 as r4; non-hero, back of neck (`sd ≥ −0.1`) and the hero neck feathers (`i < 6`) untouched | colour function step at u 0.5 = 0; test updated to the new start |
| N2 image step | measure as r4: KP-startle front edge x 449, 6 px means down the join | worst adjacent step **≤ 8** (log every step) |
| N3 fallback (only if N2 fails after N1) | neck spline subdivision `spline(…, 3)` → `spline(…, 6)` (25 rings; the same five keys, so the curve and widths are the same, sampled twice as finely); nothing else | N2 ≤ 8; KP-stand vs store `KP-stand` mean abs ≤ 2 (the KP-EMU lock) |
| N4 outline | on KP-startle and KP-duck, trace the neck's front and back silhouette edges row by row over the neck-mid seam ± 40 px (full size) | largest x jump between adjacent rows **≤ 3 px** on both edges, and no background pixel inside the outline; if N4 fails after N1, apply N3 (if not yet applied) and re-measure; if it still fails, set `blocked` with the per-row numbers and change nothing else |

Proof: re-render KP-stand, KP-startle, KP-duck and the neck before/after crops (store `T06r4-neck-*` as the before), archive as `T06r5-*.png` (or `T07-neck-*.png` inside T07). The user sees the after crop with the result (touches the KP-EMU hero neck band).

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

### r3 pass (Boss, Sonnet medium, 19 Nov 2026)
Proof sheet: store `projects/edu/EDU/previews/T06-sheet.png` (KP-stand, KP-fold, KP-startle, KP-duck, KP-flap, KP-flap-back, KP-hop), 700 px crops `T06-crops.png` (startle, flap, flap-back), stills `T06-KP-*.png`; local `out/edu30-T06/`. Fix passes used: 1 (the r3 pass).
Built: 7 seeded plumes per wing in place of the flat and tip fan (separate seeds, so the neck ruff and every no-wing build are unchanged), plume direction = segment + (0, -0.8, 0), two mop tones alternating; `WING_FLAP_OUT` = dir norm(-0.30, -0.45, 0.84), bend norm(-0.40, -0.80, 0.45); startle wing mix 0.15; startle `neckMid` x 0.22 -> 0.28 (the only change; new export `emuNeckBend`).
Measured: `node scripts/test.mjs tests/edu30-emu.test.ts` 11 of 11 pass (r1 tests kept; hash of five no-wing builds unchanged; new: FLAP_OUT tip y 0.853 <= root y 1.00 - 0.10, startle neck bend 17.4 deg (was 35.6 at x 0.22, 24.8 about at 0.26), 14 plume flats and no solid flat). Tuft at the KP camera: drawn path root -> wrist -> tip 82.1 px left and right (pass 80-110); the root -> tip chord is 79.5 px.
Values not followed or open for Film:
1. Tuft chord 79.5 px is 0.5 px under 80: the r3 drooping tip shortens the chord (0.233 m). I measured the 0.24 m path instead of the chord (the ticket says "tuft length 0.24 m"); Film to confirm that reading or widen the range.
2. Startle neck: the bend rule is met (17.4 deg), but the crop still shows a hard colour/segment seam where the dark feathered neck meets the bare skin (the `nmix` / hero-bib colour cutoff at u 0.5, also present in KP-stand). Not changed: fixing it alters locked KP-stand pixels, so it is Film's call.
3. KP-flap-back: plumes hang as thin dark strands with chunky dark ends; I judge it nearer plumage than r1 but did not verify against Film's bar; Film look check.
4. `npm test` and `tsc` not rerun in full (worktree has no node_modules; symlinked the main checkout's for this run only).

### r4 pass (Boss, Sonnet medium, 20 Nov 2026)
Proof (store `projects/edu/EDU/previews/`, local `out/edu30-T06r4/`): `T06r4-sheet.png` (stand, fold, startle, duck, flap, flap-back, hop at 270 px), `T06r4-crops.png` (startle, flap, flap-back at 700 px), `T06r4-flap-back-before-after.png` (r3 left, r4 right), **`T06r4-neck-before-after.png`** (KP-stand and KP-startle, before then after; for the user), `T06r4-KP-*.png`. Fix passes used: 1 (the r4 pass; index count 2).
Built in `src/painted/edu30/emu.ts`: FLAP_OUT dir norm(-0.35, -0.70, 0.62), bend norm(-0.40, -0.88, 0.25); darker plume tone 0.55 -> 0.35; plume half-width 0.022 -> 0.015 (width 0.030); hero bib colour blends into the neck colour over u 0.40-0.50 (equal at u 0.5, unchanged below 0.40, non-hero and back of neck untouched).
Measured (`node scripts/test.mjs tests/edu30-emu.test.ts`: 13 of 13 pass; new tests for FLAP_OUT tip y, bib blend, tip extent):
| Check | Number | Range | Result |
| --- | --- | --- | --- |
| FLAP_OUT tip (reach 0) | y 0.812 m, z 0.319 | y <= 0.82 | pass |
| KP-flap tuft, drawn path | 80.7 px left and right (chord 79.1) | 80-110 | pass, 0.7 px over the floor |
| KP-flap-back tip beyond the body silhouette | 0.042 m = 16.9 px (geometric: tip z 0.301 at w 0.9 minus body half-width 0.26, f 1000, d 2.5 m; not measured on the image) | <= 30 px | pass |
| KP-stand r4 vs store KP-stand | mean abs 0.00013; 176 changed px (a store-vs-r3 render already shows 216 changed px, so this is render noise) | <= 2, changes inside the neck bbox | pass for the mean; the changed px are not confined to the neck bbox (bbox x 330-746, y 521-1189, same noise as r3) |
| Bib colour function, u 0.5 | equal to the non-hero colour (step 0.00); worst neighbouring-sample luma step 2.30 | <= 8 | pass (analytic) |
| Image luma step at the bib/neck join, KP-startle, front edge x 449, 6 px means | r3: 87 -> 132 (45); r4: 87 -> 107 (20), then 107 -> 119 -> 133 | <= 8 | **not met** |
| No-wing hash of five builds | unchanged (the hash covers geometry, not colour; hero builds included, so both values are equal) | unchanged | pass |
| `npm test` | 294 pass, 19 fail, none in edu30 or emu (missing store media and modules, as in r1/r3); `tsc` 22 errors, none in `src/painted/edu30` or the test | | as before |

Value not followed (returned as a question): the pixel luma step <= 8 at the join. The colour function is smooth, but the neck loft paints one flat colour per quad (`part.col(i / (n - 1))`) and `spline(..., 3)` gives 13 rings, so u 0.40-0.50 covers about 1.2 quads: the 45-step becomes 20 + 16 + 13. Reaching <= 8 needs a wider blend (about u 0.15-0.50) or a finer neck loft (about 5x the rings, which also changes the whole neck silhouette). Film decides which; I changed neither. Also: the visible kink at the neck-mid segment seam in KP-startle and KP-duck (a geometric wedge, not colour) remains; startle neck bend 17.4 deg passes the ticket's rule, so it is not changed here. KP-stand is visibly unchanged (the bib is on the far side of the neck at that heading); only KP-startle and KP-duck change at the neck.
Look check for Film: flap-back now reads as small loose tufts hanging off the flanks (r3 left vs r4 right in the before/after); judge whether the plumes still read as sleeves.
