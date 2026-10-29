<!-- Moved from docs/dev-findings.md on 2026-10-29; the index and workflow stay there. -->
# DF-20261028-zcondo-sp01-corridor-plate — SP01: B01-SH01 corridor plate in Eevee + baked GI, encoded and loaded in Remotion

- Owner: Boss; first observed: 2026-10-28; last checked: 2026-10-28; status: `workaround` (pipeline works; residual colour shift and placeholder-level look recorded); type: `tool-limitation`
- Tags: 3D / Blender / Eevee / lighting / colour / runtime / captions / render-cost
- Scope: `main` `9670266` + working tree; untracked `assets/blender/zc-corridor/` (`build.py`, `render_sp01.sh`, `sp01_check.py`, `manifest.md`, `sp01-manifest.json`); Blender 5.2.3 LTS headless Eevee on Apple M1; Remotion 4.0.538 via the shared `SceneRenderer` media path, from a scratch entry `out/qa/zombie-condo/sp01/entry.tsx` (nothing registered in `src/`). User approval to continue SP01 in Eevee: 28 Oct 2026 (“ทำ SP01 ต่อ”, relayed by the coordinator).
- Consumers: ZCONDO-SHORT-TH / -EN `B01-SH01` (`VD-ZC-01`, `PROJ-ZC-R3`, `SP01`, `S-01`/`S-02`/`S-10`); `zc-corridor` is reused by B02 (section, `SP02`). No Mark scene sheet for B01 existed; the staging is Boss's blockout reading of `VD-ZC-01`.

## Symptoms and evidence
- Plate: 150 frames (5.0 s = 0.5 s head + 3.5 s TH share + 1.0 s tail, R3 plate table), Blender frame 1 = clip frame 0; TH conform `trimStartSec 0.5` (shot frame s = clip frame s + 15). OTS camera vFOV 55°, sensor-fit vertical, shift_y −0.20, level, push +0.2 m along +X. zc-you steps out of the doorway (clip F0–F44) then holds; the infected stands ~12 m away, back to camera, in front of the far window; strip 3 flickers from a seeded pattern, strip 4 (in front of her) is dead. Two baked VOLUME probes (corridor 40×5×6, unit 6×6×5; bake ≈8 s).
- Reproduce: `sh assets/blender/zc-corridor/render_sp01.sh` (measure + eevee64/eevee32 full plate + eevee256 F60–F71 reference); encode command in `sp01-manifest.json` (`encode`); `npx remotion still|render out/qa/zombie-condo/sp01/entry.tsx ZCONDO-SP01-TEST|ZCONDO-SP01-NOCAP`; checks `Blender's python3.13 -I assets/blender/zc-corridor/sp01_check.py temporal|compare|capbox`.
- Measurements:
  - (a) Projected geometry bounds (`sp01-manifest.json` `measure`, clip F0/F15/F51/F75/F119/F149): infected x 587–659, y 559–798, **235–239 px** tall from clip F0 (before shot F0), inside the key action zone; zc-you head+hair y 286–701 (top 286–320, chin 687–701), head x ≈65–420 (left third), visible height ≥1600 px. Visually not occluded in shot F0/F36/F104.
  - (b) Remotion still (no caption) vs Blender PNG at shot F0/F36/F104 (clip F15/F51/F119): mean abs 2.07–2.11, max 32–36 (edges/chroma), mean signed RGB −2.3/−1.8/−2.0 levels (Remotion darker), uniform across frames. Frame mapping confirmed: F36 vs clip F50/F51/F52 = 2.17/2.07/2.28.
  - (c) `remotion still` (fresh mount per frame) vs `remotion render --sequence` PNG at F0/F36/F104: **identical** (max diff 0).
  - (d) Two-line TH caption (`position: 'middle'`, outline preset): pixel bbox x 200–882, y 880–1030, inside x 120–888 / y 288–1248; it sits over his torso and the corridor floor, below every face (his chin ≤701, her figure ≤798); readable on inspection.
  - (e) Eevee 64: **5.39 s/frame mean** (median 5.38, max 5.77; 809 s for 150 frames) + ≈8 s build/bake per process; Eevee 32: 2.89 s/frame; Eevee 256 reference: 20.5 s/frame. MP4 (CRF 12): 8.54 MB / 150 frames (≈13.7 Mb/s); PNG masters 279 MB. Encode 8 s.
  - (f) Connection, Blender version, MCP tool list, machine, render route, encode command and checksums are in `assets/blender/zc-corridor/sp01-manifest.json`.
  - Temporal: excess frame-to-frame change over the 256-sample reference (clip F60–F71) is 0.135/255 mean (max 0.146) at 64 samples and 0.253/255 (max 0.273) at 32; spatial error vs 256 is 0.31 (64) and 0.52 (32). Full 150-frame scan (eevee64): median pair change 0.56; all 28 pairs above 3× median touch the seeded flicker dip frames (clip 12, 14, 18, 37, 56, 58, 60, 67, 69, 71, 73, 123, 125, 143, 145); no other pops.
- Evidence (local only, Git-ignored): masters `out/blender/zc-corridor/B01-SH01/{eevee64,eevee32,eevee256}/frame_####.png`; plate `public/assets/blender/zc-corridor/B01-SH01.mp4`; Remotion stills `out/qa/zombie-condo/sp01/still-{TEST,NOCAP}-F{0,36,104}.png`, sequence `out/qa/zombie-condo/sp01/seq/element-###.png`, render `out/qa/zombie-condo/sp01/ZCONDO-SP01-TEST.mp4`; sheets `contact-TEST-F0-F36-F104.png`, `contact-1s-ZCONDO-SP01-TEST-F0-30-60-90-104.png`, `crop-TEST-F36-mid.png`, `crop-F64-eevee32-64-256.png`; `temporal.json`.
- Coverage: CLI stills/sequence renders only; Studio not opened (`DF-20261026-studio-emfile`); TH conform only (EN trim 93 frames not rendered); no narration/audio; one composition, no neighbour shots (B02 absent).
- Root cause of the colour shift: not isolated; the tagged bt709/tv path still decodes about 2 levels darker, within the 1–3 level range recorded in `DF-20261028-blender-cycles-water-spike`.

## Attempts and results
- Look (Boss inspection): cool cyan-green corridor, warm-white far window, dead and flickering strips, contact on the floor, matte smear trail; she reads as a backlit figure but her pale shirt is still lit from the front by strip 3, so she is a grey figure on a bright window rather than a hard black silhouette with a rim (`VD-ZC-01` asks for the latter). Eevee shows a soft halo around the window and figure (screen-space effects). 32 samples leave visible grain on the dark ceiling at full resolution; 64 is the baseline.
- Placeholders: primitive figures without face, hands, rig, flip-flops or blood decals on the infected; the door pull is not visible from this OTS position (the inward leaf is behind him, already open), so the action reads as "steps out with the trash bag".

## Planning impact
- Film: Eevee + baked volume probes is confirmed for the corridor; budget ≈5.4 s/frame on this set (≈3.2 h for ≈2,100 frames at 64 samples, `estimated`; more with rigged/textured assets). A −2 level encode shift is accepted unless Film wants a compensation grade.
- Mark: decide whether the door pull must be visible in SH01 (needs a camera nearer the hinge side or a different blocking) and whether the infected should be a pure silhouette (Boss can kill strip 3 near her or add a flag). Caption-middle position fits over this framing.
- Follow-up (Boss): real `zc-you`/`zc-infected` rigs and blood decals; EN trim check; Studio seek check when `DF-20261026-studio-emfile` allows; SP02.

## Revalidation history
- 2026-10-28 / `main` `9670266` + untracked `assets/blender/zc-corridor/`: SP01 (a)–(f) pass at the coverage above. Film/Mark adoption: pending.
