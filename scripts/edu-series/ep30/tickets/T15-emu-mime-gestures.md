# T15 — EMU-HERO's mime gestures exist: wing flick (both sides), invisible-watch check, foot tap, wing wave (front three-quarter and back)
Deliverable: EDU-EP30-SHORT · Revision: r3 · Status: **done** (R11: fix pass 1 = T40, accepted as built, TF64, TF66, TF67) · was: fix pass 1 in **T40** (R10: gesture wing does not read at 270 px in B03-SH03, B05-SH04, B06-SH04) · was: built, awaiting Film look check (Q7 answered by the user: values as written) · r3: Film notes added (TICKETS-R3)
Class: movement · Hard: yes (animal, movement, wing as a gesturing limb)
Blocked by: T07 (same files `emu.ts`, `looks.ts`, `tests/edu30-emu.test.ts`; uses the T06 wing rig and T07 head controls) · Consumers: B03-SH03 (flick), B04-SH05 (watch check, foot tap), B05-SH04 (wave, front three-quarter), B06-SH04 (one wave swing, back)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Hard-ticket checks); brief [R3 changes, VD30-12](../short/film-brief.md#r3-changes) (mime language and the FACTCHECK-R3 limits); shot blocks b03 B03-SH03, b04 B04-SH05, b05 B05-SH04, b06 B06-SH04 (EMU-HERO rows); T06 (wing rig: `WingPose`, reach) and T07 (`headYaw`, `blinkLid`, `talkBeak`).

## Build
Four `new:` gesture helpers on the locked emu, each a function of shot-local frames returning an `EmuPose` (wing, head, toes), in `emu.ts`, plus KP stills. The gesture wing is the T06 wing at high reach: a long fan of dark loose plumes lifted from the flank, so it reads at 270 px (VD30-12: wings big and clear); at rest it folds back into the plumage.
Casting line: `new: emu-wing-flick`, `new: emu-watch-check`, `new: emu-foot-tap`, `new: emu-wing-wave` (front three-quarter and back).
Files: `src/painted/edu30/emu.ts`, `src/painted/edu30/looks.ts` (KP stills `KP-flick-r`, `KP-flick-l`, `KP-watch`, `KP-tap`, `KP-wave`, `KP-wave-back`), `tests/edu30-emu.test.ts`

## Decided values
All `WingPose` values are for the bird's LEFT wing in the creature frame (+x forward, +y up, +z the bird's left); the right wing negates z. `headYaw` + = toward the bird's left.

| What | Value | Source |
| --- | --- | --- |
| FLICK pose | dir (−0.14, 0.27, 0.95), bend = dir (straight), reach 0.8 (0.73 m): tip ≈ 0.9 m out from the body centre at about 1.2 m | b03 B03-SH03 (tips (11.1, 1.2, −32.0) and (12.9, 1.2, −32.0) from the bird at x 12.0) |
| `emuWingFlick(L)` (B03-SH03; bird at (12.0, 0, −32.0) facing +z, front to the lens) | wing 1 = its **RIGHT** wing (screen left): mix FOLD → FLICK over L 4–8 (ease-out), hold 8–12, back to FOLD 12–16 (ease-in-out); `headYaw` 0 → −0.26 (15° to its right, screen left) over 4–8, back to 0 over 12–16. Wing 2 = its **LEFT** wing (screen right): the same at L 20–24 / 24–28 / 28–32 with `headYaw` +0.26. L 32–56 KP-look deadpan, blink from L 44 (`blinkLid`); feet planted throughout | b03 B03-SH03 Staging; SD17 |
| WATCH pose (left wing) | dir (0.81, 0.49, 0.32), bend (0.20, 0.0, −0.98) (the outer segment lies across the front of the chest toward the midline, like a forearm held up to read a wristwatch), reach 0.8: wrist at creature (0.41, 1.19, 0.33), tip (0.48, 1.19, −0.01). In world at the B04-SH05 mark (1.6, 0.33, −4.9), facing −x: wrist (1.19, 1.52, −4.57) (Film fix: the sheet's (1.45, 1.45, −4.6) is not reachable with a 0.39 m inner segment from the root; the new point projects within about 30 px of the sheet's screen wrist) | b04 B04-SH05 EMU-HERO row |
| WATCH head | head joint (0.10, 1.32, 0.05) creature, `headDir` = unit(wrist − head) = unit(0.31, −0.13, 0.28), lid 0.35, `headYaw` 0 (the eye is lateral: the left eye looks down at the wrist) | b04 B04-SH05 (head at (1.5, 1.65, −4.85)) |
| `emuWatchCheck(L)` (B04-SH05, shot-local) | L 0–5 KP-look stare, head squared to the lens; L 6 eyes flick to the gun (`headYaw` +0.10 for 2 f, back by L 8) on the off-screen click; LEFT wing (screen right) FOLD → WATCH over L 8–16 (ease-in-out); head down to the wrist L 12–18 (ease-in-out); hold reading L 18–38; head back up to the lens, deadpan, L 38–40; wing WATCH → FOLD over L 55–60; hold to L 63. FACTCHECK-R3: nothing is painted on the wing (no watch, strap, face, mark) | b04 B04-SH05 Staging |
| `toes` (new `EmuPose` field) | `[left, right]` rad: the three front toes lift about the rear pad (the pad stays planted on the ground); default [0, 0] | ticket |
| `emuFootTap(L, taps)` (B04-SH05) | its **RIGHT** foot (screen left); per tap frame T: T−4: 0, T−2: 0.44 (25° up, ease-out), T−1: 0.44, T: 0 (snap down on the frame); taps at L **40, 47, 54** (global 1126, 1133, 1140); body bob −0.005 m on each T; the left foot and both pads never move | b04 B04-SH05 (toes lift 4 f before each, down on the frame) |
| WAVE pose (left wing) | dir (0.0, 0.80, 0.60), bend (0.0, 0.92, 0.39), reach 1 (0.85 m): wrist (0.10, 1.36, 0.48), tip (0.10, 1.73, 0.64) creature. Swing s rotates dir and bend about the creature +x axis through the root (+ = tip outward, away from the head) | b05 B05-SH04 EMU-HERO row |
| `emuWingWave(L)` front three-quarter (B05-SH04; bird (−0.5, 0, 5.3) facing +z) | `headYaw` 0 → +0.61 (35° to its left = screen right, the truck's way) over L 0–4; LEFT wing (screen right) FOLD → WAVE over L 2–6 (ease-out); swing keys L 6: +20°, 10: −20°, 14: +20°, 18: −20°, 22: +20°, 26: −20°, 30: +20°, 34: 0 (ease-in-out between keys); WAVE → FOLD over L 36–42; beak by T07 `talkBeak` (onsets L 6, 13, 21, 28). World tip ≈ (0.14, 1.73, 5.40) (Film fix: the sheet's (0.35, 1.95, 5.3) is out of reach of an 0.85 m wing from a 1.0 m root; the tip sits about 85 px lower on screen, still above the top wire and the caption band) | b05 B05-SH04 |
| `emuWingWave` back view (B06-SH04; bird (−0.5, 0, 5.3) facing +z, back to the lens) | LEFT wing (screen left from behind, toward the truck): FOLD → WAVE over L 36–39; swing L 39: +20°, 43: −20°, 44: 0; WAVE → FOLD over L 44–50; head still (it watches the truck, `headYaw` +0.3) | b06 B06-SH04 |
| Wing reach between keys | `reach` mixes with the pose (FOLD reach 0); the wing visibly grows out of the flank plumage on the way up and tucks back in on the way down | ticket |
| EMU-HERO identity | tuft and bib unchanged in every gesture | VD30-05 |

**Open-question dependency (Q7, index O8).** `emuWatchCheck` and `emuFootTap` are keyed in B04-SH05 shot-local frames from the start at global 1086. If Q7 moves the cut to 1076 or 1096, the global frames stay (taps 1126/1133/1140, wing up 1094–1102) and Film re-derives the local frames in r2; with the cut at 1096 the eye flick (1092) and the wing lift start (1094) fall in the gunner shot and are dropped.

**Judgment for the builder (Hard).** These are pantomime gestures by a real-looking bird: one gesture at a time, crisp, then stillness (deadpan). The flick is a quick out-and-back pointing gesture, not a flap. The watch check must read as "looking at a wristwatch" from the pose alone: forearm-like outer segment level across the chest, head tipped down to it, a long still hold. The tap is small and patient: toes only, the foot never lifts off. The wave is a shopkeeper's goodbye, high and friendly, never a shooing or driving-off gesture (FACTCHECK-R2, L21). Views: front (flick), front three-quarter (watch, tap, wave), back (wave swing). Wings and head stay above y 1100 in their shots.

## r3 notes (Film, 2026-11-19, `EDU-EP30-TICKETS-R3`)
These override any older value in this ticket that they name.
- **Mixer rule (T06 r3).** Add every gesture field of this ticket (flick, watch, tap, wave) to `mixEmuPose`, mixing from its default (0 / FOLD) when one side lacks it; only `stride` and `pads` stay one-sided. Tests: `mixEmuPose(a, a, u) = a` and both endpoints for each new field.
- **Wing look (T06 r3).** The mime wing at reach up to 1 uses the r3 plume drawing (drooping seeded plumes, no three-plume tip): at the watch check and the wave it reads as a feathered wing, never a hand or an arm with fingers; Film's look check of the mime stills stays in the index.


## R10 look check (Film, 2026-11-20, `EDU-EP30-TICKETS-R10`)
Viewed `T25-sheet.png`, `T25-wing-crop-L10.png`, `T30-sheet.png`, `T30-zoom.png`, `T32-sheet.png`, `T32-zoom.png`. **Verdict: fix (fix pass 1 = [T40](T40-gesture-wing-read.md)).** The flick and both waves point correctly but read as thin dark dashes at 270 px; T40 adds `WingPose.show` (fuller, paler plume fringe, no flat) on `WING_FLICK` and `WING_WAVE` and raises the flick (TF64). Watch check unchanged (it reads in B04-SH05).

## Proof
- `node scripts/test.mjs tests/edu30-emu.test.ts`: wing tip length at reach 0.8 = 0.73 m and reach 1 = 0.85 m; the planted pads are identical at every frame of `emuFootTap` and `emuWatchCheck`; `emuWingFlick(0)` = `emuWingFlick(56)` apart from lid and head yaw.
- `sh scripts/edu-series/ep30/short/render-looks.sh T15 KP-flick-r KP-flick-l KP-watch KP-tap KP-wave KP-wave-back` (KP camera; `KP-flick-r` at L 8 and `KP-flick-l` at L 24 heading π/2 front to the lens; `KP-watch` at L 25 at heading 3π/4 (front three-quarter); `KP-tap` at L 38 (toes up); `KP-wave` at L 10 front three-quarter; `KP-wave-back` at L 39 heading −π/2) then `scripts/qa-sheet.sh out/edu30-T15/sheet.png --cols 6 --width 270 out/edu30/looks/T15/*.png`
- A motion strip for the watch check: KP-watch at L 8, 12, 16, 18, 38, 40, 58 → `out/edu30-T15/watch-strip.png` (`qa-sheet.sh --cols 7 --width 270`).

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| KP-flick-r / -l | one long dark wing pointing out to screen left / right, head turned with it | tip 0.85–0.95 m from the body centre (logged); tip above the bird's hip |
| KP-watch | wing raised and bent across the chest, head down to the wrist, nothing painted on the wing | eye-to-wrist distance 0.25–0.45 m and the eye above the wrist (logged) |
| KP-tap | right toes up, pad planted | toe angle 25° ± 3; pad y 0 |
| KP-wave / -back | one wing high, friendly; from behind a dark wing up at the flank | tip y 1.65–1.80 m (logged) |
| watch strip | lift, hold and lower read as a watch check at 270 px | Film look check (below) |

The proof sheet and the watch strip go to Film for a look check before T25, T28, T30 and T32 use the gestures (Boss records the paths in Result; Film answers in the index Look checks).

## Result (Boss fills)
Built r3 (Boss, Sonnet medium, 2026-11-20). Commit: the branch tip ("T15 emu mime gestures"). Proof sheet `out/edu30-T15/T15-sheet.png` (KP-flick-r, KP-flick-l, KP-watch, KP-tap, KP-wave, KP-wave-back at 270 px) and watch strip `out/edu30-T15/T15-watch-strip.png` (L 8, 12, 16, 18, 38, 40, 58); stills `out/edu30-T15/stills/T15-KP-*.png`. Store: `projects/edu/EDU/previews/T15-sheet.png`, `T15-watch-strip.png` and the stills (archived, 15 files). Fix passes used: 0. Open question: none.

Built in `emu.ts`: `WING_FLICK`, `WING_WATCH`, `WING_WAVE`, `WATCH_HEAD`, `WATCH_HEAD_DIR`; `emuWingFlick(L)`, `emuWatchCheck(L, {lensYaw})`, `emuFootTap(L, taps = [40, 47, 54])` (returns only `toes`, `bob`, `pads`: spread it over the watch pose), `emuWingWave(L, {back})`; new `EmuPose.toes` ([left, right] rad, toes rotate about the rear pad, 0 = the locked feet bit for bit) in `buildEmu` and `mixEmuPose` (mixed from [0, 0]). `looks.ts`: KP-flick-r, KP-flick-l, KP-watch, KP-tap, KP-wave, KP-wave-back and the strip frames KP-watch-8 ... -58. `emuWatchCheck` takes the lens yaw as an option (default 0.6; the plate passes `emuLensYaw` for its camera), because the ticket gives no camera for L 0-5.

| Row | Measured | Pass | Result |
| --- | --- | --- | --- |
| wing tip length | reach 0.8 = 0.73 m, reach 1 = 0.85 m | 0.73 / 0.85 | pass |
| pads planted | `emuPads` JSON identical on every frame of `emuWatchCheck` (0-63), `emuFootTap` + watch (0-63), `emuWingFlick` (0-56) | identical | pass |
| flick(0) = flick(56) | equal apart from lid and head yaw | equal | pass |
| KP-flick-r / -l | right tip (-0.002, 1.197, -0.903), left (-0.002, 1.197, +0.903); 0.903 m out from the body axis (3D from the body centre (0.02, 0.9, 0): 0.951); head yaw -0.26 / +0.26; tip y 1.197 above the hip (0.8) | 0.85-0.95 m | pass (horizontal measure; the 3D distance to the centre is 0.001 m over) |
| KP-watch | wrist (0.413, 1.189, 0.314), tip (0.481, 1.189, -0.021); eye (0.107, 1.319, 0.107); eye-to-wrist 0.391 m, eye 0.130 m above the wrist; no extra flat on the wing (the pose adds only the two wings' 7 plumes each) | 0.25-0.45 m, eye above | pass |
| KP-tap | toes 0.44 rad = 25.2 deg on T-2 and T-1 (L 38 = 0.44), 0 at T-4 and T, bob -0.005 on T; left toes 0 on all frames; pad `feet` identical to the locked build (y 0); right claw y 0.012 -> 0.072 | 25 +- 3 deg, pad y 0 | pass |
| KP-wave / -back | swing 0 (L 34) tip (0.100, 1.728, 0.628), y 1.73; with the +-20 deg swing the tip y runs 1.539 (swing +20, L 14 and back L 39) to 1.830 (swing -20, L 10 and back L 43) | 1.65-1.80 m | **see Not followed** |
| watch strip | lift, hold and lower on the strip | Film look check | open (Film) |

Hand and arm checks: the emu has no hands or arms. Planted pad slip: 0 m (pads overridden from `emuPads(stand)`, identical on every frame).

Not followed:
1. **Wave tip y at the swing extremes.** The ticket's WAVE pose (tip y 1.73) and its +-20 deg swing about the +x axis through the root cannot both stay in 1.65-1.80: the swing moves the tip to 1.54 m (outward) and 1.83 m (inward). I built both exactly as written and measured the pose itself (swing 0) against the range; the extremes are logged in the test. KP-wave at L 10 (swing -20) has tip y 1.830, 0.03 m over the range. If Film wants the range at every frame, the swing should be about +-12 deg or the pose centred nearer y 1.70 (the swing then peaks at 1.80).
2. **Watch wrist z.** Wrist 0.314, ticket 0.33: the T06 root offset (the root moves 0.02 m inboard at a low out-share) puts it 0.016 m inboard; the screen projection effect is small and the eye-to-wrist row passes. Test tolerance 0.025.
3. **Look.** At 270 px the T06 plume wing (thin drooping plumes) reads as a short row of dark strokes: the flick reads as a wing pointing out, but the watch check reads mostly through the head tipped down to a short dark stroke by the neck, not as a forearm across the chest, and the wave wing from the front three-quarter is a vertical line of strokes. This is the T06 r3 plume drawing the ticket names, unchanged; Film's look check decides whether the mime wing needs a fuller plume at reach > 0.8 (a T06 follow-up).

Checks: `npx tsc --noEmit -p .` clean for the files this ticket touches (the other tsc errors are in files outside it and predate it). `node scripts/test.mjs tests/edu30-emu.test.ts`: 34 pass, 0 fail (10 new T15 tests; the pre-change hashes unchanged). `npm test` (log `out/logs/T15-npmtest.log`): 487 pass, 9 fail, none in the T15 files: `HIPPO.YAWN`/`CHARGE`/`HALT joints hold` (Maximum call stack size exceeded), `loudness`, `new-shot`, `render-inputs`, `segments`, `(d) canvasStyleOf` (the T24 r5 fix-pass row) and `adopt reuses stored bytes`: environment (shared node_modules symlink, no store checkout) or other tickets, not run against a clean baseline here. Stills crashed once on a 183 s page-render timeout while other worktrees loaded the machine; the three missing strip frames were re-rendered.

## R9 look check and decisions (Film, 2026-11-20, `EDU-EP30-TICKETS-R9`)
These override any older value in this ticket that they name.
Viewed: store `T15-sheet.png` (six KPs at 270 px) and `T15-watch-strip.png` (L 8–58). **Verdict: accept with value change; no Boss pass.**
| Item | Decision | Reason |
| --- | --- | --- |
| Wave tip height (Not followed 1) | keep the built ±20° swing and pose centre. Rows: tip y **1.65–1.80 at swing 0** (1.728 measured), **1.50–1.85 at the swing extremes** (1.539 / 1.830 measured). TF35 | the bigger swing reads as a wave at plate size; the range only guarded "wing above the head line", which 1.54 m still meets at the plate cameras |
| Watch wrist z (Not followed 2) | 0.314 accepted (test tolerance 0.025 stands) | the eye-to-wrist row (0.391 m, eye above) is the read and passes |
| Flick distance | the row is the horizontal distance from the body axis, 0.85–0.95 m (0.903 measured); the 3D 0.951 to the body centre is not a row | as built |
| Plume wing look (Not followed 3) | accepted, no T06 follow-up. The watch strip reads lift (L 12–16), hold with the head dipped to the wing (L 16–38), lower (L 40–58); the wave reads by its motion | the thin T06 r3 plume is the locked wing; a tiny wing used as a hand is the joke; the plates frame the mime at 505–670 px leads, 2–3× the sheet size |
| Plate calls | `emuWatchCheck(L, {lensYaw: emuLensYaw(<plate camera>, <bird>)})`; `emuFootTap` spread over the watch pose; `emuWingFlick`, `emuWingWave(L, {back})` as built | T25, T28, T30, T32 notes (R9) |
