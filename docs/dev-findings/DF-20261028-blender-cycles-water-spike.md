<!-- Moved from docs/dev-findings.md on 2026-10-29; the index and workflow stay there. -->
# DF-20261028-blender-cycles-water-spike — Cycles water refraction modelling rules, MP4 colour tags, M1 cost

- Owner: Boss; first observed: 2026-10-28; last checked: 2026-10-28; status: `workaround` (modelling/encode rules that avoid the observed failures); type: `tool-limitation`
- Tags: 3D / Blender / refraction / tooling / render-cost
- Scope: `claude/pool-depth-short` HEAD `59809c8` + untracked `assets/blender/pool-depth/build.py`; Blender 5.2.3 LTS headless, Cycles Metal (Apple M1 GPU, 8 cores), Remotion 4.0.538. Numbers: `scripts/pool-depth/spike-results.md`, `assets/blender/pool-depth/spike-manifest.json`.
- Consumers: POOLDEPTH-SHORT `VD01`, `VD02`, `VD05`, `S01-B01`/`B03`/`B05`/`B06`.

## Symptoms and evidence
- Water modelled as a closed Glass BSDF (IOR 1.333) volume matched the Snell prediction within 0.10 px at 1080x1920 (S1). Observed failures that corrupted S2 until fixed: (1) a 0.1 mm air gap between the water side wall and the opaque cup wall produced total-internal-reflection mirror images of the coin (a stretched magenta band); (2) a bare glass cylinder with the cup hidden acts as a lens, so it is not a valid "unoccluded" reference (use a wide flat slab); (3) an MP4 encoded from Blender PNGs without colour tags decoded through Remotion with a visible shift (RGB 16,94,113 became 8,87,115); tagging bt709/tv with `scale=out_color_matrix=bt709` reduced it to about 1-2 levels; (4) the first Cycles Metal frame took 135 s (kernel compile), later frames did not.
- Reproduce: `/Applications/Blender.app/Contents/MacOS/Blender -b --python assets/blender/pool-depth/build.py -- s1|s2`; encode recipe in `scripts/pool-depth/spike-results.md`.
- Coverage: final CLI stills/renders and full-frame decode of one 150-frame render; Studio `unverified` (`DF-20261026-studio-emfile`).

## Attempts and results
- Rules: bury the water bottom and side faces inside opaque geometry (no air gap, no coincident faces); keep the tested IOR 1.0 control; count coin pixels from an emissive mask, threshold 0.5 (indirect bleed from an emissive object is below it).
- Cost: 32 spp, no denoise, 1080x1920, Cycles Metal: 3.8 s/frame for a trivial emissive scene, 13-15 s/frame for a glass+floor scene, 11-13 s/frame for the mug scene at 64 spp (grainy: glass blocks shadow rays, light reaches the cup floor only through noisy indirect paths).
- 2026-10-28 D3 follow-up (pool set, `assets/blender/pool-depth/build.py`): the grain risk is resolved by (a) a Mix Shader on the water surface that uses Transparent for shadow rays (`Light Path > Is Shadow Ray`) so the sun and sky light the floor and the child's shadow directly (no caustics; camera rays still refract), and (b) OIDN denoise on GPU at 40 spp (about 20 s/frame for the pool-edge shot, 11 s sign close-up, 35 s legs/water close-up at 1080x1920). 128 spp raw cost 54-104 s/frame, so denoise is the cheaper route; temporal flicker of OIDN across consecutive frames is still untested. Rippled water is a bump from a sum of travelling sines with integer cycles per 30 frames (exactly periodic). Oblique pool-edge camera (65-76 deg from vertical): marker error 0.04-0.65 px against the Snell prediction (IOR 1.0 control 0.09-0.23 px).
- Tooling flake: one of about 12 headless Blender starts crashed inside Cycles Metal kernel compilation (`MetalKernelPipeline::compile`, NSException); re-running the same command worked. Wrap long renders in a retry.

## Planning impact
- Film: Blender route stays feasible for refraction beats; budget render time and a denoise/shadow-ray strategy before committing about 1,000 frames. Mark: no change. Follow-up: Boss decides denoise or fake-shadow trick during D2/D3.

## Revalidation history
- 2026-10-28 / `59809c8` + working tree: S0/S1/S2 pass at the stated coverage; Film/Mark adoption: pending.
- 2026-10-28 / `claude/pool-depth-short` working tree (after `148f3bc`): D3 pool set, S3 diagram geometry and S4 loop seam pass at the stated coverage (`scripts/pool-depth/spike-results.md`); Film/Mark adoption of the recorded camera/pose deviations: pending.
- 2026-10-28 / `claude/pool-depth-short` working tree (after `d079187`): SH03 mug demo with real Cycles refraction passes the S2 criteria (0 coin px before the pour, 95.4% at F225, IOR 1.0 control 0 px, nothing keyed); shadow-ray Transparent mix, caustics off and 40 spp + OIDN solve the S2 grain; OIDN temporal flicker measured negligible (excess <= 0.11/255); D3/S3/S4 re-run after the look pass still pass. Test caveat: with absorbing water the oblique red-marker test needs a strong emitter and a lower centroid threshold. Film/Mark adoption: pending.
