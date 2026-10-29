<!-- Moved from docs/dev-findings.md on 2026-10-29; the index and workflow stay there. -->
# DF-20261028-zcondo-eevee-render-spike — Eevee vs Cycles cost and look on ZCONDO blockouts (M1)

- Owner: Boss; first observed: 2026-10-28; last checked: 2026-10-28; status: `workaround` (Eevee is ≈6–7× cheaper; its interior bounce gap is closed by a baked volume probe); type: `tool-limitation`
- Tags: 3D / Blender / Eevee / Cycles / lighting / volumetrics / render-cost
- Scope: `main` `9670266` + untracked `assets/blender/zc-render-spike/` (`build.py`, `run_all.sh`, `spike-manifest.json`); Blender 5.2.3 LTS headless (`BLENDER_EEVEE`, Eevee Next) and Cycles Metal on Apple M1 (8-core GPU, 16 GB); the user's GUI Blender (MCP-connected, empty scene) was open and idle during the runs. Blender MCP connection checked with `execute_blender_code` (version 5.2.3 LTS, arm64).
- Consumers: ZCONDO-SHORT-TH / ZCONDO-SHORT-EN plates (`VB-ZCONDO-SHORT-R3` `VD-ZC-00`, `SP01` (e), `S-10`, `RK-02`); user request 28 Oct 2026 to try Eevee.

## Symptoms and evidence
- Question: can Eevee replace Cycles for the ≈2,050–2,260-frame plate set (Cycles estimate ≈7–20 h from `DF-20261028-blender-cycles-water-spike`) without losing the brief's look?
- Test scenes (throwaway grey blockouts, built from scratch by the script, not production assets): `corridor` = B01-SH01-like OTS, 24 m corridor, 8 emissive ceiling panels each with a 35 W area light, green exit sign, doors, "you" foreground figure and an infected figure walking in, vFOV 55°, camera push (69 objects). `balcony` = B08-like night city, balcony at 60 m, ≈260 box towers, 4 fire clusters (emissive blobs + warm point lights), 4 animated Principled Volume smoke domains, cool moon sun, figure at railing, vFOV 60°, camera push-out/rise (388 objects). Both 1080×1920, AgX, PNG 8-bit.
- Presets: `eevee64` = 64 TAA render samples, screen ray tracing (1/2 res, denoise), fast GI, shadows ray 1 / step 6, volumetrics tile 8 / 64 samples / volumetric shadows. `eevee32` = same at 32 samples. `eevee64gi` = `eevee64` + one baked VOLUME light probe around the corridor (grid 4×32×6; bake 1–2 s). `cycles40dn` = Cycles GPU Metal, 40 spp, no adaptive, OIDN GPU denoise, bounces max 6 / diffuse 3 / glossy 2 / transmission 2 / volume 1, caustics off.
- Reproduce: `sh assets/blender/zc-render-spike/run_all.sh` (both scenes × `eevee64`/`eevee32`/`cycles40dn`, frames 0, 36, 104); `Blender -b --python assets/blender/zc-render-spike/build.py -- corridor eevee64gi 0,36,104`.
- Measured seconds per frame (render call incl. PNG write; first value is the process's first frame):

  | Scene | eevee32 | eevee64 | eevee64gi | cycles40dn |
  | --- | --- | --- | --- | --- |
  | corridor | 2.45 / 2.35 / 2.44 | 5.08 / 4.65 / 4.47 | 4.45 / 4.36 / 4.39 | 32.34 / 25.78 / 25.77 |
  | balcony | 2.35 / 2.19 / 2.29 | 4.21 / 4.14 / 4.18 | not run | 34.02 / 29.99 / 30.12 |

  The very first Eevee render on this machine took 12.7 s for one frame (shader compile); later processes reused the shader cache. Cycles did not show the ≈135 s kernel compile this time (cache warm). Process start + scene build added ≈2–4 s per run. No crash in 8 headless runs.
- Evidence (local only, Git-ignored): stills `out/blender/zc-render-spike/<scene>/<preset>/F000|F036|F104.png`; side-by-side sheets (eevee64 | eevee32 | cycles40dn) `out/blender/zc-render-spike/compare-corridor-F036.png`, `compare-corridor-F104.png`, `compare-balcony-F036.png`, `compare-balcony-F104.png`; (eevee64 | eevee64gi | cycles40dn) `compare-corridor-gi-F036.png`; smoke crop at full res (eevee64 | eevee32 | cycles40dn) `compare-balcony-smoke-crop-F104.png`. Timings, settings, devices and PNG checksums in `assets/blender/zc-render-spike/spike-manifest.json`.
- Coverage: CLI stills only, 3 frames per preset; no H.264 encode, no Remotion load, no Studio; temporal flicker across consecutive Eevee frames and full-plate sequential renders `unverified`.
- Root cause of the look gap (confirmed by the `eevee64gi` comparison): without baked GI, Eevee's screen-space GI cannot see off-screen bounce, so the corridor ceiling renders near black and the back-lit foreground figure is much darker than in Cycles. A volume probe whose bounds enclose all lit surfaces (the first try, with the ceiling just outside the bounds, left the ceiling black) brings the figure close to Cycles; the ceiling stays darker than Cycles.

## Attempts and results
- Look verdict (Boss, from the stills): the balcony/night-city look (moon shadows of the railing bars, fire-lit tower faces, warm smoke) is close to Cycles in `eevee64` and `eevee32`; Eevee smoke is softer and less detailed (froxel volumes at tile 8) and slightly less warm-lit from below. The corridor is acceptable only with baked GI (`eevee64gi`); emissive panels, exit sign, contact shadows and the figures read correctly. `eevee32` vs `eevee64` showed no visible difference in these stills (no fine texture or hair to expose aliasing).
- Extrapolation for ≈2,100 plate frames (`estimated`, steady-state means × frames, plus ≈17 plate processes × ≈15 s start/build/compile): `eevee64`/`eevee64gi` 4.2–4.6 s/frame → **≈2.5–2.8 h** (2,050–2,260 frames: 2.4–2.9 h); `eevee32` 2.2–2.4 s/frame → **≈1.3–1.5 h**; `cycles40dn` 25.8–30.1 s/frame → **≈15–17.6 h** (2,050–2,260 frames: 14.7–18.9 h). Eevee is ≈6–7× (64 samples) to ≈11–13× (32 samples) faster.
- Limits of the estimate (heavy content since measured in `DF-20261028-zcondo-eevee-worstcase`: ≈10 s/frame in Eevee, still ≥3.8× faster than Cycles): blockouts have no textures, rigged face, hair, cloth, blood decals or section caps; production plates will cost more per frame in either engine (unmeasured). Close-up smoke may need volumetric tile 4 or 2, which costs more (unmeasured).

## Planning impact
- Film: Eevee is a viable default for `VD-ZC-00` plates on this M1; keep Cycles as a per-shot option only where the softer Eevee smoke or the missing interior bounce matters. Interiors (`zc-corridor`, `zc-unit`) must ship a baked volume probe per set (enclosing every lit surface) or explicit fill lights. Fallback (all stills + `pictureMove`) is no longer forced by cost.
- Mark: no shot change; avoid close-ups that rely on fine smoke detail in B08 unless Boss re-tests tile 4.
- Follow-up (Boss, `SP01`): production `zc-corridor/build.py` with probe GI, a full 105-frame `B01-SH01` sequential Eevee render (temporal flicker), bt709 encode and Remotion load per `SP01` (b)–(d), (f); re-measure per-frame cost on the textured/rigged assets.

## Revalidation history
- 2026-10-28 / `main` `9670266` + untracked `assets/blender/zc-render-spike/`: corridor and balcony blockouts, frames 0/36/104, four presets; results above. Film/Mark adoption: pending.
- 2026-10-28 / same checkout + untracked `assets/blender/zc-corridor/`: on the production-staged corridor blockout, Eevee 64 measured 5.39 s/frame mean over 150 frames (higher than the spike's 4.2–4.6), see `DF-20261028-zcondo-sp01-corridor-plate`.
