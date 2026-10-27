# POOLDEPTH-SHORT Blender manifest (Boss)

Status: spike stage (S0-S2 run 2026-10-28); `VD01` route Blender pre-render to MP4 consumed by `Scene.media`. Results: `scripts/pool-depth/spike-results.md`. Computed numbers: `spike-manifest.json` (written by `build.py`).

| ID | Item | Value | Source |
| --- | --- | --- | --- |
| M1 | Units / axes | 1 BU = 1 m, Z up, camera looks along -Z local | brief scale baseline |
| M2 | Output | 1080x1920, 30 fps, PNG 8-bit sRGB (Standard view transform), frame 1 = scene-local frame 0 | `VD10` |
| M3 | Engine / device | Cycles, `device=GPU`, Metal (Apple M1 GPU, 8 cores) set in `build.py` | preflight PF3d |
| M4 | Water | closed Glass BSDF volume, IOR 1.333, bottom and sides buried in opaque geometry | S1, S2 |
| M5 | Spike pool | depth 1.0 m, camera 2.0 m above surface, vFOV 60 deg | S1 |
| M6 | Mug demo | inner Ø 0.08 m, inner height 0.09 m, water 0.07 m, coin Ø 0.02 m x 0.001 m at 0.064 m from the near wall, eye 40 deg from vertical, camera 1.0 m, vFOV 13.2 deg | S2 |
| M7 | Clip encode | libx264 crf 12 yuv420p, tags bt709/tv (recipe in spike-results.md) | S0 |

Commands: `Blender -b --python assets/blender/pool-depth/build.py -- s0|s1|s2 [--samples N] [--scale PCT] [--coin_x M] [--ior N]`. Renders go to `renders/<spike>/` (local only). Packaging policy: see spike-results.md (proposed).
