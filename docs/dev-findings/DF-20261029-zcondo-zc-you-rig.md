# DF-20261029-zcondo-zc-you-rig — rigged zc-you built; seated B09 pose measures 456 px at 3.4 m

- Owner: Boss; first observed: 2026-10-29; last checked: 2026-10-29
- Status: workaround (rig exists; B09 camera/pose decision open for Film/Mark)
- Type: integration-gap (rig missing) / tool-limitation (Blender IK and pole angles, see below)
- Tags: 3D / rig / contact / camera / lighting
- Scope: `claude/zcondo-boss-plates` on `b216dae` + working tree; Blender 5.2.3 LTS CLI; `assets/blender/zc-you/{rig,poses,tracks,check}.py`, `assets/blender/zc-unit/build_sp02.py`, `assets/blender/zc-corridor/build.py`
- Consumers: ZCONDO-SHORT-TH/EN sheets `SS-R2.4` (B01-SH01, B02-SH01/02/03, B03-SH01, B04-SH01, B05-SH01/02/03, B06-SH01, B07-SH01/02, B08-SH01, B09-SH01/02/03, B10-SH01); brief `VB-ZCONDO-SHORT-R3.3`

## Symptoms and evidence
- Desired → observed: the rigged lead did not exist, so B10-SH01 (R3.3), B09 seated and the B09 phone/bag checks ran on primitives. Now: rig built and re-checked (numbers in `scripts/zombie-condo/build-notes.md`).
- Reproduce: `Blender -b --python assets/blender/zc-you/check.py -- rig|tracks [names]`, `Blender -b --python assets/blender/zc-unit/build_sp02.py -- b10|bag|still <shot>`. Logs `out/logs/zc-you-*.log`; images `out/qa/zombie-condo/zc-you/`.
- Evidence: `assets/blender/zc-you/check-results.json`, `assets/blender/zc-unit/sp02-manifest.json`.
- Coverage: Blender CLI only; no Remotion, Studio or plate renders; B07-SH02 truck not re-run.
- Root causes found: (1) a dead-straight IK chain is a singularity: the pole target is ignored and the chain stays straight, fixed with a 3 degree rest bend at the elbows; (2) pole angle differs per limb and side, so the rig calibrates it at build time; (3) in zsh a quoted loop word is not split, so `for c in "still B09SH01"` ran Blender with one bad argument and the logs were empty (use `${=c}`).

## Attempts and results
- Detail level: the first pass (realistic skin SSS, 84 hair locks, bump cloth) cost 4.0–6.1 s/frame in an isolated 1080x1920 test against 3.3 s for the placeholder-era rig; after the user's reference (flat illustrated level) the look is cel-shaded (Shader to RGB, 6 luminance bands, emission output, no SSS/specular): 3.0 s isolated; sp02 stills 3.8 s (B09-SH01), 3.8 s (B07-SH02), 5.1 s (B02) against 4.0, 4.0, 5.1 s with primitives. 27.7k vertices, 71 meshes, 44 bones.
- Sheet look decisions: VD-ZC-00/01 ask for stylised, simplified 3D with clean materials and light grain; nothing in the dev-findings fixes toon shading, so cel bands are a Boss choice inside that wording. Blood on `zc-you` is not built: VD-ZC-GORE forbids it at any point (blood is for the infected and surfaces); the day-3 variant carries grime and stubble instead.

## Planning impact
- Film: B09-SH01/SH03 at 3.4 m: lead 456 px (hips on the floor, head top z 0.79); sheet fallback 3.2 m / camera y 0.76 gives 485 px, 3.1 m gives 500 px.
- Mark: sheet discrepancies listed in build-notes (B02-SH02 hand side, B09 back wall x -1.50 vs build -1.60, B07-SH01 reach, B05-SH03 stance).
- Follow-up: plates S-02…S-10 (separate stage); B07-SH02 LL truck; face/eye close-ups in the plates.

## Revalidation history
- 2026-10-29 `claude/zcondo-boss-plates` working tree → CLI measurements above → workaround; not merged.
- 2026-10-29 `claude/char-head-template`: face moved to shared `assets/blender/char_head/` (see `scripts/zombie-condo/build-notes.md`); B10-SH01 face box passes at c0/c245, floor contact 0.0, B09-SH01 lead 455 px at 3.4 m (unchanged conclusion), B09-SH01 render 8.33 s to 8.57 s; workaround, not merged. The face still falls short of the 2D reference (see notes).

