# DF-20261030-painted-profile-head-turn — a painted profile head cannot turn away from the lens (SS-R4 glance approximated)

- Owner: Boss; first observed: 2026-10-30 (SS-R4 retime RT-3, S04-SH01 f190–f214); last checked: 2026-10-30
- Status: workaround
- Type: integration-gap (rig capability)
- Tags: 2D / painted cast / head rig / profile / WORLD FOG
- Scope: `src/painted/worldfog/head.ts` (`paintHeadSide`; `FaceState.look` moves the pupil 0.03 head units per unit); `src/painted/worldfog/cast.ts` (`FigPose.head` is `'front' | 'left' | 'right'`; `FigPose.nod` shifts the head centre); `src/painted/shots/worldfog.tsx` (`s4sh01`). Checkout `claude/world-fog-next-steps-2817bc`, uncommitted.
- Consumers: WFOG-EP01-SHORT S04-SH01 f190–f214 (G2530–G2554; sheet RT-3 "head glance back to the door glass (0, 1.5, 0)"); Film/Mark decision; sheet `WFOG-EP01-SHORT-SS-R4`.

## Symptoms and evidence
- Desired: the worker, in profile facing the narrator, turns his head back toward the door glass from f190 to f206 and returns to her by f214 (a glance, no arm gesture).
- Observed: the rig has no pose in which a profile head faces away from the lens. `head` is only `front`, `left` or `right`; `left` on a right-facing body would face him the wrong way and `front` turns him toward the lens. The only head controls are the pupil offset (0.03 head units per look unit) and the `nod` shift of the head centre.
- Build (r7): eye look ramps to the door side (−1) and `nod` shifts the head −0.12 head units backward over f190–f206, back to the profile by f214. This is a small backward lean with the eyes moved, not a turn. Not measured in pixels; visible only as a subtle change in the S04-SH01 G2538 tile of `out/qa/world-fog/WFOG-EP01-SHORT/r7/sheet_B_S04.png`.
- Build (r8, SS-R4.1 R8-4): the backward `nod` is removed (`nod` dx 0; the `nod` y term for the slump stays). The eyes-only look toward the door stays as built and is not an acceptance item. Head crop G2520 vs G2538 (ffmpeg PSNR): r7 21.4 dB, r8 28.0 dB; the residual is the eye look.
- Unknowns: whether a back or three-quarter-back head view is worth rig work for one half-second beat.

## Attempts and results
- `head: 'left'` for the glance: rejected (faces the wrong way on a right-facing body).
- `head: 'front'`: rejected (turns the face to the lens).
- Eyes-only look: too small to read at this scale (the pupil moves about 0.003 m).
- Eyes plus backward `nod`: adopted as the approximation above.

## Planning impact
- Film: the glance is subtle at 270 px; either accept the approximation, or keep the head forward and let the line carry the beat, or approve a back-of-head view as new painted rig work.
- Mark: S04-SH01 RT-3 check "G2538 head toward the door, arms unchanged" is met only as a subtle lean. Mark decides whether the sheet keeps the glance as written.
- Follow-up: none scheduled. A rig change would need a new painted head view (not in the current brief); record the decision in `scripts/world-fog/build-notes.md`.

## Revalidation history
- 2026-10-30, `claude/world-fog-next-steps-2817bc` (uncommitted r7): built and rendered at G2530–G2554 (labelled QA entry, chrome off); the look and nod values are in `s4sh01`; status workaround.
- 2026-10-30, `claude/world-fog-ep01-script-dba9ff` (uncommitted r8, SS-R4.1 R8-4): nod dx removed, eyes-only look kept; rendered at G2520, G2538, G2546, G2554 (labelled QA entry, chrome off, `out/tmp/r8-new/` scratch; production entry picture identical at G2538); status workaround.
- 2026-10-30, `claude/world-fog-ep01-script-dba9ff` (uncommitted r8b, coordinator decision on S03-SH07 narrator glance, R8-9): the narrator's whole-head flip is removed (eyes only). Pupil travel is limited by the rig: the pupil sits at +0.05 head units right of the eye-white centre (`head.ts`, `ell(0.67 + 0.03 * lx, ...)` on a `right` head), so `look` −1 brings it to the white's centre, not to the screen-left side. Measured on the native crop: about 9 px at 1080 px width between `look` +1 and −1. A true screen-left pupil needs a shared head-rig change (all profile heads; consumer checks); not made.
