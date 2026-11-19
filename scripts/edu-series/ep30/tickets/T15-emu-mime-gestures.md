# T15 — EMU-HERO's mime gestures exist: wing flick (both sides), invisible-watch check, foot tap, wing wave (front three-quarter and back)
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready (B04-SH05 local frames depend on open Q7)
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
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
