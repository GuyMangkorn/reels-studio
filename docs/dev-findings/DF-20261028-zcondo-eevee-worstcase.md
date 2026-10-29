<!-- Moved from docs/dev-findings.md on 2026-10-29; the index and workflow stay there. -->
# DF-20261028-zcondo-eevee-worstcase — Worst-case Eevee 64 vs Cycles 40spp + OIDN on B08 and a character-heavy corridor (M1)

- Owner: Boss; first observed: 2026-10-28; last checked: 2026-10-28; status: `workaround` (Eevee stays 3.8× to 18× faster on the heaviest cases; look gaps listed below); type: `tool-limitation`
- Tags: 3D / Blender / Eevee / Cycles / volumetrics / hair / render-cost
- Scope: `main` `9670266` + untracked `assets/blender/zc-render-spike/` (`worstcase.py`, `run_worstcase.sh`, `worstcase-manifest.json`) and `assets/blender/zc-corridor/`; Blender 5.2.3 LTS headless, Apple M1 (8-core GPU, 16 GB); the user's GUI Blender was open and idle. Settings identical to `DF-20261028-zcondo-eevee-render-spike` (`eevee64`, `cycles40dn`). User request 28 Oct 2026 (“ทำต่อได้นะ”, relayed by the coordinator). Follow-up to that finding's "Limits of the estimate".
- Consumers: `VD-ZC-08` / B08 plate (150 frames TH, 135 EN), `zc-infected` hair/blood/shirt (`S-06`, B01 SH01/SH02, B02), `S-10` plate renders.
- Leftover check before the run: no headless Blender process, no partial frames (`eevee32`/`eevee64` 150 PNG each, `eevee256` 12 = the planned F60–F71 window), no stray files in `assets/blender`; nothing tidied. The only Blender process was the user's GUI instance.

## Symptoms and evidence
- Scenes (throwaway placeholders, `worstcase.py` layered on the earlier builds): `b08worst` = spike balcony + ~540 more towers (≈800 total), 4 more near fire clusters with warm lights (8 clusters), 4 more smoke domains incl. big near plumes and one ≈35 m from the balcony, 300 emissive embers, moon sun + 8 fire lights, 2,321 objects. `charots` = production-staged corridor (`zc-corridor/build.py`, 2 baked volume probes), OTS `B01-SH01` camera; `charclose` = same set, 18° vFOV long lens on `zc-infected` facing camera (SH02-like) plus a 220 W fill. Character content in both: infected long hair as 8,000 hair-curve strands × 10 points (≈1.2 mm dia), `zc-you` hair 3,000 strands × 5, 2048² procedural weave/stain shirt + bump and striped tee, 15 shrinkwrapped blood decals on the infected plus 10 floor/wall decals (alpha textures, dithered), Principled Hair BSDF in both engines.
- Measured seconds per frame (render call incl. PNG write; 4 frames per cell; first frame of each process in brackets, then the other three; "steady" = mean of the other three):

  | Case | Eevee 64 | Cycles 40 + OIDN | Cycles / Eevee |
  | --- | --- | --- | --- |
  | `b08worst`, tile 8 | [6.15] 5.88 / 5.76 / 5.76 → **5.80** | [94.9] 94.2 / 110.3 / 109.9 → **104.8** | 18× |
  | `b08worst`, tile 4 | [7.12] 6.94 / 6.45 / 6.33 → **6.57** | same | 16× |
  | `b08worst`, tile 2 | [13.33] 12.10 / 11.62 / 11.68 → **11.80** | same | 8.9× |
  | `charots` (OTS, hair + textures + decals) | [10.35] 10.57 / 10.52 / 10.56 → **10.55** | [44.1] 40.2 / 39.9 / 40.0 → **40.0** | **3.8× (worst)** |
  | `charclose` (long-lens close) | [9.30] 9.24 / 9.06 / 9.24 → **9.18** | [60.8] 57.9 / 56.5 / 55.9 → **56.8** | 6.2× |

  Eevee B08 volumetric tile cost: tile 4 +13 %, tile 2 +103 % over tile 8. Hair and textures roughly doubled Eevee on the corridor (5.4 s/frame blockout in `DF-20261028-zcondo-sp01-corridor-plate` → 10.5 s); the first Eevee frame of a hair process carries ≈2.5 s of shader compile. No crash in 8 runs. Process start + build + probe bake 15–25 s.
- Extrapolation (`estimated`, steady means × frames, plus ≈17 processes × ≈20 s): B08 TH plate 150 frames: Eevee tile 8 **≈15 min**, tile 4 ≈17 min, tile 2 ≈30 min; Cycles **≈4.4 h**. Pessimistic bound for all ≈2,100 plate frames at the character-heavy cost: Eevee **≈6.2 h** (9.2–10.6 s/frame); Cycles **≈23–33 h** (40–57 s/frame). Real mix (many plates have no hair) lands between this bound and the earlier 2.5–3.2 h estimate.
- Evidence (local only, Git-ignored): stills `out/blender/zc-render-spike/worst/<case>/<preset>/F###.png` (`b08worst` F000/F036/F070/F104; char cases F001/F050/F100/F150); sheets `out/blender/zc-render-spike/worst/compare-b08-F036.png`, `compare-b08-F104.png` (tile 8 | 4 | 2 | Cycles), `compare-b08-smoke-crop-F104.png` (full-res crop), `compare-charots-F100.png`, `compare-charclose-F100.png` (Eevee | Cycles), `compare-charclose-hair-crop-F100.png`, `compare-charots-youhair-crop-F100.png`. Timings, settings, checksums: `assets/blender/zc-render-spike/worstcase-manifest.json`. Reproduce: `sh assets/blender/zc-render-spike/run_worstcase.sh`.
- Coverage: CLI stills, 4 frames per cell, blockout geometry; no sequential full-plate render, no encode, no Remotion, no Studio; temporal flicker of hair/decals across consecutive frames `unverified`.

## Attempts and results
- Look verdict (Boss, from the stills):
  - Smoke: tile 8, 4 and 2 are visually the same in the stills (all soft, smooth edges); tile 2 doubles the cost for no visible gain, so keep tile 8 (tile 4 optional). Cycles shows more irregular wisps, a ragged plume edge and more warm scattering near the fires and the embers' glow; Eevee smoke is flatter but warm-lit from below and reads as the same plume, so it holds for the brief's wide push-out.
  - Fire-glow rim: Eevee leaves `zc-you` a near-black silhouette on B08 while Cycles lights him warmly from the fires (no screen-space bounce off the city). `VD-ZC-08` asks for a fire-glow rim, so B08 needs an explicit warm rim/fill light on him in Eevee (the spike's `ZC_FireRim` point light is not enough at this scale). Not yet re-tested.
  - Hair: Eevee draws 8,000 curve strands as distinct dark-brown strands with clumping, no visible aliasing or noise at 64 samples; the face-over-hair read holds. In Cycles the same Principled Hair settings came out pale grey (shader model/sheen difference, not a speed effect), so hair colour needs per-engine tuning; do not compare hair colour across engines.
  - Shirt texture and bump read the same in both. Blood decals read in both; some decals show grey patches where overlapping shrinkwrapped decals fight (placeholder-setup artefact, fix with one decal per area).
  - Embers at emission 80 clip to white hexagons in Eevee and glow softly in Cycles (set lower strength/bloom-like sprites).
- Verdict: the speed conclusion holds on the heaviest cases (Eevee ≥3.8× faster; ≥16× on B08 with tile ≤4); Eevee remains the plate default. Cycles stays a per-shot option only for B08 smoke detail or fire-lit "you", where it would cost ≈100 s/frame (≈4.4 h per 150-frame plate).

## Planning impact
- Film: keep Eevee default; budget ≈6 h worst-case total on this M1, ≈15 min for the B08 plate; use volumetric tile 8.
- Mark: B08 relies on an authored warm rim light on "you", not on bounce.
- Follow-up (Boss): hair shader tuning, decal clean-up, B08 rim-light test, full-plate sequential render of one hair shot for flicker.

## Revalidation history
- 2026-10-28 / `main` `9670266` + untracked `assets/blender/zc-render-spike/` and `zc-corridor/`: results above. Film/Mark adoption: pending.
