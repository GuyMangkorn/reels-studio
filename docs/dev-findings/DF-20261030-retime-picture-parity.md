# DF-20261030-retime-picture-parity — a retime changes production frames before the cut (progress bar, absolute-G fog); compare picture with chrome off at the same G

- Owner: Boss; first observed: 2026-10-30 (r7 one-second pass against r6, SS-R4 timeline); last checked: 2026-10-30
- Status: workaround
- Type: tool-limitation
- Tags: QA / stills / chrome / progress bar / fog drift / determinism / WORLD FOG
- Scope: `src/scenes/SceneRenderer.tsx` (default chrome: one progress segment per scene, fill `(frame + 1) / duration` of the current scene); `src/painted/worldfog/outside.ts` (`const t = G / 30` drives the fog and halo drift); `src/painted/worldfog/qa.tsx` (the labelled entry sets `progressBar: false`); `scripts/world-fog/pass-sheets.py` (byte comparison only).
- Consumers: every World Fog byte or PSNR pass against an earlier pass; the production render of S03 and S04 after any scene-duration change; Film/Mark reviews of retimed windows.

## Symptoms and evidence
- Desired: frames G0–G2069 behave as before the SS-R4 retime. Observed: `pass-sheets.py --prev r6/1s` marks 21 tiles changed: S03-SH01 to S03-SH06 (G1560–G2040) and S04 tiles. The changed pixels sit in the progress-bar row (G2040: 144 px, bbox x 634–669, y 1851–1854).
- Cause (picture): the labelled entry (chrome off) of HEAD and r7 is byte-identical below the label band for G1650, G2040, G2069 and every 30th frame G0–G2040 (68 of 69; S02-SH01 G270 at 106 dB is in the render-noise band of DF-20261030-render-run-noise).
- Cause (chrome): the S03 and S04 scene durations changed (630 → 810 and 450 → 660 frames), so the current-scene progress fill changes on every frame of those scenes.
- Cause (fog drift): `outside.ts` drives the window fog and halo drift from absolute G. A retime therefore changes the drift phase of every window view at the same shot-local frame: S04-SH01 f0 (HEAD G2160 vs r7 G2340) differs at 46.7 dB and S04-SH03 f0 (G2520 vs G2790) at 42.6 dB, both across the window area. The drift is continuous in G across the cuts.
- Environment control: HEAD rendered again in the same session matches the r6 tile at G1650 within noise (113 dB), so the difference is not the environment (`out/qa/world-fog/WFOG-EP01-SHORT/r7/` and `out/logs/r7-*.log`).
- Coverage: stills only (`scripts/world-fog/stills.mjs`, per-frame `renderStill`); Studio seeking not run.

## Attempts and results
- Bisect of the changed files with HEAD as the base (G1650): `head.ts`, `assembly.ts`, `shots/worldfog.tsx` and `videos/world-fog/index.ts` each alone match HEAD within noise; `space.ts` changes the production frame only through the scene durations.
- Chrome off (labelled entry) makes the picture identical below the label band, so the production difference is only the bar.
- Adopted rule for picture parity: compare same-G frames from the chrome-off entry; compare production tiles by bytes and report the progress-bar row separately.

## Planning impact
- Film/Mark: a retime that moves a scene boundary changes the progress bar and the window fog phase by design; judge picture changes at the same G with chrome off, and say which shots moved.
- Editor: decide whether the episode keeps the default progress bar. The bar is chrome in `SceneRenderer`, not a plate; no change was made here.
- Follow-up: `pass-sheets.py` could take a chrome-off entry for picture-only comparison (proposal; not implemented in this round).

## Revalidation history
- 2026-10-30, `claude/world-fog-next-steps-2817bc` (uncommitted r7): byte pass (50 identical, 21 changed, 30 new), chrome-off parity (G0–G2040 68/69 identical, G2069 and S04-SH02 f70 identical), HEAD control in the same session; status workaround.
