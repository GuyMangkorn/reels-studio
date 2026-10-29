<!-- Moved from docs/dev-findings.md on 2026-10-29; the index and workflow stay there. -->
# DF-20261027-catbox-short-home-stage — Short portrait crop and shared-prop overlay mismatch

- Owner: Boss; First observed: 26 October 2026; last checked: 27 October 2026
- Status: `fixed` for the current issue-branch working tree; Type: `implementation-bug`
- Tags: 2D / camera / scale / contact / overlay
- Scope: `codex/33-catbox-foundation`, PR #38 update; Node `24.5.0`, npm `11.5.1`, Remotion `4.0.538`; `short-c01.json`–`short-c06.json`, `VisualStage.tsx`, `SceneRenderer.tsx`, `render-shorts-qa.mjs`
- Consumers: `CATBOX-C03-SHORT-S01-SH01` and `CATBOX-C06-SHORT-S01-SH01`; Film decisions `VD05`/`VD06`/`VD11`/`VD12`, `VB-CATBOX-R4`; Mark's C03/C06 Short boards and sheets. This finding covers only the new portrait Shorts; it does not audit Long scenes.

<a id="อาการและหลักฐาน-3"></a>
## Symptoms and evidence

- Desired: in C03, the toy enters from offscreen left and crosses to Mochi's reaching paw; the cat, box and toy remain readable at the calibrated physical scale. In C06, BOX-OLD is planted at frame 0 and the single shared flat-outline asset enters as a separate visual beat.
- Before correction, the C03 pounce crop clipped Mochi's muzzle; moving the toy along with the cat left it partly under the cat/box. C06 rendered both a timeline `catbox-outline` prop and an inline SVG outline/label over the sofa. The final status label is drawn with the shared direct-text `Text` primitive so its screen-space copy stays clear over the physical stage.
- Reproduce the final Short-only coverage with `node scripts/cat-boxes/render-shorts-qa.mjs`. C03 is 1080×1920 / 30 fps / 1,350 frames; critical frames include actor/pose F89–F91, toy path, label reveal F95–F97 and fade completion F101–F103; direct/same-browser/remount parity includes F59–F61. C06 critical frames include the outline visibility transition F14/F15/F16.
- Evidence: C03 preview (`out/qa/cat-boxes/shorts-r1/C03/CATBOX-C03-Short_A_fade-preview.mp4`), C06 preview (`out/qa/cat-boxes/shorts-r1/C06/CATBOX-C06-Short_A_fade-preview.mp4`), and the Short QA manifest (`out/qa/cat-boxes/shorts-r1/manifest.json`) with contact-sheet paths and frame lists. These historical artifacts are local under ignored `out/` and are not included in a clean checkout; the paths are references rather than published evidence links.
- Root cause: the C03 toy's floor anchor was coupled to the actor endpoint and its final solid bounds fell behind the box/cat overlap; the physical shot crop did not keep the full lead silhouette inside the output. C06 had two owners drawing the same flat frame. These are shot integration/layout errors, not limits of the SVG/2D approach.

<a id="สิ่งที่ลองและผล-2"></a>
## Attempts and results

- Shift cat and toy together → kept their relative positions but left the target obscured. Corrected with separate deterministic paths and foreground layering: toy holds at x=−0.50m offscreen through 0.5s, crosses left-to-right, and settles at x=0.10m beside the box's right wall; Mochi reaches x=0.06m by 2.8s. This keeps the shared estimated asset dimensions and makes the target visible at the paw.
- Kept the C03 1.15m base orthographic view, with a small camera zoom to 0.95 after 2.8s to keep the pounce inside frame. The effective view is about 1.21m high after the move; the estimated 0.316m seated portion projects to about 501px, above the 480px lead-size threshold. No rig or prop dimensions were inflated.
- Removed C06's second inline frame and flat-frame label; retained the shared `catbox-outline` beside BOX-OLD. Its `startSec: 0.5` is an estimated visual entrance, not an audio cue. Single-label physical-stage pills use the right column to avoid covering the sofa.
- Final CLI QA covers all six compositions at 1,350 frames each, with 46 one-second/final stills each and critical counts C01–C06 = 28/28/48/28/28/37. C03 same-browser and remount parity each cover 13 distinct frames: F59–F61, F89–F91, F101–F103, and random seeks F137/F421/F863/F1189; every frame matches direct rendering. The other five cuts each pass four random-frame checks in both modes. All six A-fade previews are 45 seconds; all six B-loop last frames match frame 0 while their penultimate frames differ. Studio playback/seeking remains `unverified` under `DF-20261026-studio-emfile`. Script approval remains pending, narration is absent, and subtitle timing is estimated/unsynced. No Long render or QA was run.

<a id="ผลต่อการวางแผน-2"></a>
## Planning impact

- Film: keep physical dimensions, output-pixel projection and camera framing as separate controls; continue using the brief's orthographic 2D route for these home beats.
- Mark: C03 SH01 starts with the toy fully offscreen left and moves it right into the cat's paw; C06 SH01 starts with the old box visible and introduces the shared outline at F15. Keep the F0 and F−1/F/F+1 states in the boards; C06's 0.5s cue is estimated, not audio-synced.
- Follow-up: recheck the cited findings against merged `main`; keep C06-S02 source framing/scale and all other Long material for the later Long project. Script/voice approval, runtime factual-image review and interactive Studio seeking remain unverified.
- Revalidation history: 2026-10-27 / `codex/33-catbox-foundation` / PR #38 update → six Short CLI previews, 46 per-second/final stills each, critical-frame/contact-sheet coverage, C03's 13-frame same-browser/remount parity, random-seek/remount parity and six loop checks recorded in the manifest → `fixed` for this PR branch. The note records branch evidence and does not assert that PR #38 has merged.
