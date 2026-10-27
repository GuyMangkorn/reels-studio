# Dev findings — Boss feedback for Film and Mark

This log records observed issues and reusable lessons from development, blockout, Studio and rendering so Film can choose 2D / 3D / hybrid and Mark can plan with known tool constraints. Boss owns shared-library findings, Editor owns integration/editing findings, Film owns brief implications and Mark owns written-shot implications. Read findings relevant to the assigned assets, camera, lighting, compositing or tooling.

<a id="วงจรใช้งาน"></a>
## Required feedback cycle

1. **Boss or Editor records findings when observed:** blockers, production/shot changes, workarounds and reusable lessons across 2D/3D/hybrid. Search for an existing entry and update its stable ID for the same issue. Record known symptoms/scope immediately, even with unknown cause, then add experiments and fixes during work and before the PR. Create no empty entry when nothing new or changed was found.
2. **Film reads before choosing/revising approach:** compare relevant entries with target checkout, code/dependencies and applicable conditions. Cite finding ID + checked date/commit and decision ID in the brief, with outcome: use conditionally / build shared capability first / fallback / spike / irrelevant with reason. State when none apply; that does not establish tested feasibility.
3. **Mark reads before creating/revising scene sheets:** consult Film's cited findings and camera/staging findings. Link IDs to affected shots in scene sheets, framing/motion/contact/reveal constraints or fallback, and Boss/Editor proof requirements. Reconcile conflicts through the coordinator so brief/scene-handoff revisions agree.
4. **Feed back impacts on active plans:** as soon as the plan cannot be implemented as written, the observing Boss/Editor reports finding ID, scene/shot/decision IDs, effects on story/time/selected deliverables and affected shared consumers and proposed response through the coordinator. Link open items in handoff/PR; keep details authoritative here. Writing this log does not send messages or invoke agents automatically.
5. **Revalidate after fixes/tool changes:** the finding owner updates status with commit/PR and repeated-test evidence while retaining original symptoms/attempts. After baseline changes, Film/Mark verify the fix exists in the target checkout before reuse. Update active affected brief/scene sheets and link the original finding when results change plans.

<a id="ขอบเขตหลักฐานและสถานะ"></a>
## Evidence scope and status — requirements

- Separate **observed symptoms**, **confirmed cause/hypothesis** and **design guidance**. Types: `implementation-bug`, `integration-gap`, `tool-limitation` or `unknown`, as supported. One adapter/branch issue does not restrict an entire medium.
- Status: `open` (unresolved), `workaround` (conditional avoidance), `fixed` (corrected and rechecked within stated scope), `superseded` (linked replacement). Every status change includes last-checked date and branch/commit. An issue-branch result does not establish a fix on `main`.
- Record composition/frames, timeline/input props, clock, package versions and relevant environment for reproduction. Separate Studio, final render, random seeking and Short/Long; mark unchecked areas `unverified`. Performance claims need methods/context.
- Evidence may be code paths, issues/PRs, commands/results or accessible renders/logs. Generated media stays in ignored `out/` under repository rules. Label local-only artifacts and give a reproduction recipe. Missing artifacts do not turn historical results into current verification.
- Findings inform decisions under tested conditions and preserve the user's freedom to choose 2D/3D/hybrid. Unproven constraints need the smallest spike with acceptance criteria rather than a permanent prohibition.

<a id="ดัชนี-findings"></a>
## Finding index — historical evidence

Created 26 October 2026. The first entry records tooling checks while adding this workflow, without visual/runtime testing to establish medium constraints. The entries below retain their original evidence dates; translating this document does not revalidate them.

| Finding ID / link | Subject / tags | Status | Last checked / commit | Film / Mark implication |
| --- | --- | --- | --- | --- |
| [DF-20261026-duplicate-types](#df-20261026-duplicate-types) | Typecheck / local dependencies | workaround | 2026-10-26 / `906a85e` | Separate environment failures from medium feasibility |
| [DF-20261026-studio-emfile](#df-20261026-studio-emfile) | Studio file watcher / tooling | open | 2026-10-26 / `906a85e` | CLI renders are available; Studio seeking remains unverified |
| [DF-20261026-subpixel-stage-projection](#df-20261026-subpixel-stage-projection) | 2D scale / camera / anchors | fixed | 2026-10-26 / `906a85e` + working tree | Use direct output-pixel projection for metre-space DOM/SVG actors/props |
| [DF-20261027-catbox-short-home-stage](#df-20261027-catbox-short-home-stage) | Short crop / prop contact / overlay ownership | fixed | 2026-10-27 / PR #38 branch | Keep C03 actor/target in portrait crop; draw C06 shared frame once |
| [DF-20261028-blender-cycles-water-spike](#df-20261028-blender-cycles-water-spike) | Blender Cycles water refraction / MP4 colour tags / M1 render cost | workaround | 2026-10-28 / `claude/pool-depth-short` HEAD `59809c8` + working tree | Cycles Glass refraction is measurably Snell-accurate; follow the modelling rules and encode tags below |

<a id="แบบฟอร์มรายการ"></a>
## Entry template

Add actual entries below this template and link each in the index. Use unique stable IDs `DF-YYYYMMDD-short-slug`. Keep detail here; briefs, scene sheets and sequence indices link to it instead of copying full symptoms.

```markdown
## DF-YYYYMMDD-short-slug — symptom-based title

- Owner: Boss or Editor; first observed: ...; last checked: ...
- Status: open / workaround / fixed / superseded
- Type: implementation-bug / integration-gap / tool-limitation / unknown
- Tags: 2D / 3D / hybrid / camera / contact / lighting / texture / tooling / ...
- Scope: branch + commit; relevant packages/environment; asset/module paths
- Consumers: episode/scene/shot IDs; Film decision/brief revision; scene-handoff revision or N/A

### Symptoms and evidence
- Desired → observed; occurrence conditions and unknowns:
- Reproduce: command, timeline/input props, composition, frames/clock:
- Evidence: code/log/issue/PR/render path; local-only and recipe if applicable:
- Coverage: Studio / final render / seeking; Short / Long; unverified areas:
- Root cause: confirmed with evidence / hypothesis and follow-up method:

### Attempts and results
- Approach → outcome; workaround/fix and remaining unsupported conditions:
- Measured/observed cost, quality and tradeoffs; estimates explicitly labeled:

### Planning impact
- Film: medium/compositing/camera/light/interface effect; fallback/shared capability:
- Mark: selected-deliverable shot/framing/staging/contact/reveal effect; preserved constraints:
- Follow-up: owner + issue/PR; spike/acceptance criteria; brief/scene-sheet/index updates:

### Revalidation history
- Date + branch/commit → method/result/coverage → status; fix PR/merge status:
- Film/Mark adoption: read finding revision/date → decision/shot refs + outcome:
```

## DF-20261026-duplicate-types

- Owner: Boss for development revalidation; recorded by the coordinator from actual command results during documentation task #36.
- First observed: 26 October 2026; last checked: 26 October 2026; status: `workaround`; type: `unknown` (local dependency environment); tags: tooling / typecheck.
- Scope: checkout `codex/36-dev-findings`, baseline `1ab2ca1`, with documentation/agent-instruction changes only; Node `24.5.0`, npm `11.5.1`, TypeScript `5.8.3`; `tsconfig.json`, `node_modules/@types/`. Duplicate-directory origin remains unknown.
- Consumers: code checks in this checkout; no visually affected brief decisions/board shots yet.

<a id="อาการและหลักฐาน"></a>
### Symptoms and evidence

`npm run typecheck` exited 2 with TS2688: missing definitions for 14 implicit type libraries whose names ended in ` 2`, including `react 2`, `node 2`, `three 2` and `stats 2.js`. All 14 directories existed in `node_modules/@types/` without root `index.d.ts` or `package.json`. `tsconfig.json` did not specify a `types` list.

Reproduce with `npm run typecheck`; inspect directories using the Python recipe below. These are local results on the stated date, not a guarantee of identical behavior after clean install or in another checkout.

```bash
python3 - <<'PYCODE'
from pathlib import Path
for p in sorted(Path('node_modules/@types').glob('* 2*')):
    print(p, (p / 'index.d.ts').exists(), (p / 'package.json').exists())
PYCODE
```

`npm run lint` passed in the same run. Dependency directories were not modified to prove the cause. Directory origin and clean-install outcome remain `unverified`; this documentation task did not inspect Studio, render, seeking, Short or Long.

<a id="ผลต่อการวางแผนและตรวจซ้ำ"></a>
### Planning impact and revalidation

- Film: this finding does not establish 2D/3D/hybrid feasibility. Inspect the dependency environment before using typecheck failure to justify a medium change.
- Mark: no framing/staging change is warranted by this finding; shot feasibility requires separate blockout/render evidence.
- Follow-up: Boss inspects dependency tree/clean-install state during runtime work in this checkout and reruns typecheck before changing status. Do not conceal an environment issue by changing runtime contracts.
- Rechecked: 2026-10-26 / `codex/33-catbox-foundation` HEAD `906a85e`, base `ce2a0b1`; `npm ls --depth=0` showed matching Remotion packages `4.0.538`; scanning `node_modules/@types/* 2*` found none; `npm run typecheck` and `npm run lint` exited 0; `npm test` passed 26/26.
- Result: TS2688/duplicate declarations did not occur in this checkout. Current dependency setup is a checkout-specific workaround, not proof of the original root cause or a `main` fix.
- History: 2026-10-26 / `1ab2ca1` + documentation diff → typecheck failed, lint passed → `open`; 2026-10-26 / `906a85e` after current dependency setup → no duplicate directories, typecheck/lint passed, 26 tests passed → `workaround`. No fix PR or brief/board changes yet.

<a id="df-20261026-studio-emfile"></a>
## DF-20261026-studio-emfile — Remotion Studio exits while watching the checkout

- Owner: Boss; First observed: 26 October 2026; last checked: 26 October 2026
- Status: `open`; Type: `tool-limitation` (observed watcher failure; root cause not confirmed)
- Tags: tooling / Studio / preview
- Scope: `codex/33-catbox-foundation` HEAD `906a85e`, based on `main` `ce2a0b1`; macOS arm64, Node `v24.5.0`, npm `11.5.1`, Remotion `4.0.538`; `npm run start` / `remotion studio src/index.ts --no-open`
- Consumers: CATBOX C06-S02, Film decisions `VD-C06-S02-01`–`03`, storyboard R3 and current physical-scale follow-up. This finding concerns interactive Studio review, not 2D/3D feasibility.

<a id="อาการและหลักฐาน-1"></a>
### Symptoms and evidence

- Desired: open Remotion Studio to play, seek and inspect C06-S02 in `Short` and `Long`.
- Reproduced on HEAD `906a85e` with `npm run start`: server reports ready at `http://localhost:3000`, begins `Building...`, then Node exits with `EMFILE: too many open files, watch` from `FSWatcher._handle.onchange` before a Studio preview is available.
- Previous issue-branch attempts after clean `npm ci` also failed after moving raw QA folders aside, setting `CHOKIDAR_USEPOLLING=true`, passing `--webpack-poll=1000`, and passing `--disable-git-source`. Those attempts were recorded during the same CATBOX task; the process/file-watcher limit has not been identified.
- Evidence: local terminal output from `npm run start` on `906a85e`; environment and installed versions above. The checkout does not produce an interactive Studio session.
- Coverage: Studio play/seek remains `unverified`. CLI rendered a 46-second / 1,380-frame preview for each composition at 30 fps: `out/qa/cat-boxes/projection-final/Short-c06-preview.mp4` and `out/qa/cat-boxes/projection-final/Long-c06-preview.mp4`. There are 77 full-resolution checks per composition under `out/qa/cat-boxes/projection-final/Short/` and `Long/`, with review sheets under `contact-sheets/`. Random-remount frame comparisons used composition frames 16,050, 15,000 and 15,750: Long was pixel-identical at all three; Short was pixel-identical at 16,050 and 15,750, and differed at five subtitle pixels (maximum channel delta 2) at 15,000, with no geometry displacement.
- Root cause: unknown. The observed `EMFILE` is a file-watch limit surfaced by Studio's process; this evidence does not show that Remotion render itself or any medium is incompatible.

<a id="สิ่งที่ลองและผล"></a>
### Attempts and results

- `npm run start` → reproduces `EMFILE` before Studio is usable.
- `npm run start` with clean dependencies, raw QA folders moved aside, polling enabled, a webpack polling interval, and Git source watching disabled → prior recorded attempts still failed.
- `npx remotion still ...` inside the default sandbox separately aborted at Chromium MachPort rendezvous with permission denied. The same bounded render succeeded when invoked with `require_escalated`; this was a sandbox launch restriction, not the Studio `EMFILE` condition. Still renders do not substitute for interactive seeking.

<a id="ผลต่อการวางแผน"></a>
### Planning impact

- Film: continue selecting 2D / 3D / hybrid based on the approved visual brief and available renderer APIs; this tooling result gives no medium-level restriction. Use CLI-rendered contact sheets for bounded image evidence while Studio is unavailable.
- Mark: retain view/framing/contact criteria and identify the exact still frames used; do not label storyboard or runtime random seeking as Studio-verified.
- Follow-up: Boss/desktop runtime owner should identify the watcher limit or a supported Studio polling configuration, then retry `npm run start` and interactive seeking in both compositions. Keep Studio play/seek `unverified`; the CLI previews, stills and remount comparisons are separate evidence and do not establish Studio verification.
- History: 2026-10-26 / `codex/33-catbox-foundation` `906a85e` → `npm run start` reproduced `EMFILE`; bounded CLI previews, full-resolution stills and frame remount comparisons succeeded → `open`; no fix PR or Studio verification yet.

<a id="df-20261026-subpixel-stage-projection"></a>
## DF-20261026-subpixel-stage-projection — metre-space layer rendered at subpixel CSS size

- Owner: Boss; First observed: 26 October 2026; last checked: 26 October 2026
- Status: `fixed` for the current issue-branch working tree; Type: `implementation-bug`
- Tags: 2D / scale / camera / contact / projection
- Scope: `codex/33-catbox-foundation` HEAD `906a85e` based on `main` `ce2a0b1`, plus uncommitted runtime changes; Remotion `4.0.538`; `src/scenes/projection.ts`, `src/scenes/SceneRenderer.tsx`, `src/assets/backgrounds/CatboxRoom.tsx`, `src/assets/Props.tsx`, `src/rig/physicalScale.ts`, and `scripts/cat-boxes/blockout.json`
- Consumers: `CATBOX-C06-S02` SH01–SH04; Film decision `PROJ-CATBOX-ORTHO-R1`; Mark board R3. This is a rendering implementation issue, not a restriction on 2D, 3D or hybrid production.

<a id="อาการและหลักฐาน-2"></a>
### Symptoms and evidence

- Desired: the BOX-OLD floor anchor, cat floor/seat anchor, room and camera view share one metre-to-pixel mapping in Short and Long.
- Initial implementation laid out vectors in CSS metre units (for example a complete box SVG viewport below 1 CSS pixel) and applied a roughly 1,370× CSS transform to the parent stage for Short. The first rendered Short seated frame visibly placed BOX-OLD off the left edge and separated Mochi from its box, despite both world X positions being at the origin. Applying a CSS drop-shadow on the subpixel SVG stage also scaled the shadow with the parent transform.
- The initial faulty still was overwritten by the corrected frame render. No preserved before-image is available, so this note does not claim a reproducible pixel measurement from that first output.
- Reproduction context: C06-S02 timeline entry `scene[11]`; Short composition frame 15,912 (scene-local frame 1,062), 1080×1920, 30 fps; orthographic view and actor/prop dimensions from `CATBOX-METER-R1`. Before-render layout calculations placed world O at output center X=540, while the first still did not show that result.
- Evidence for the correction: `out/qa/cat-boxes/r3-keyframes/Short-local-000-f14850.png` (historical Short start still), `out/qa/cat-boxes/r3-keyframes/Short-local-1062-f15912.png` (historical Short seated/contact still), full-resolution Short/Long sequence previews and contact sheets above, and projection/anchor assertions in `tests/projection.test.ts` and `tests/animation.test.ts`. Render artifacts are local under ignored `out/`; these two historical PNG paths were absent during the documentation migration, so they are retained as references rather than current accessible evidence. The runtime fix remains in the working tree on `906a85e`, not yet a merged `main` result.
- Root cause: the parent transform and CSS/SVG filter operated on a metre-space DOM subtree whose local dimensions were fractions of one CSS pixel. Layout rounding/rasterization at that scale did not match the intended direct world-to-output mapping. This finding is scoped to this implementation path.

<a id="สิ่งที่ลองและผล-1"></a>
### Attempts and results

- Subpixel metre-stage DOM/SVG plus a parent scale transform → incorrect apparent anchor and prop size in Short.
- Corrected owner: convert world positions and physical asset dimensions directly to output CSS pixels in `orthographicViewAt`, `worldToOutputPoint`, `layoutWorldActor` and `layoutWorldProp`; render the physical room as an output-sized SVG using the active world-view `viewBox`; keep screen-space props outside the camera transform. BOX-OLD remains one library identity, with rear/top and front-wall planes rendered around the actor by the shared asset owner.
- Final CLI QA: Short and Long each rendered 46 seconds / 1,380 frames, with 77 full-resolution stills per composition. Remount comparisons at composition frames 16,050, 15,000 and 15,750 found Long pixel-identical; Short pixel-identical at 16,050 and 15,750, with only five subtitle pixels differing by at most 2 channel values at 15,000 and no geometry displacement. Studio remains unverified under `DF-20261026-studio-emfile`.

<a id="ผลต่อการวางแผน-1"></a>
### Planning impact

- Film: a metre-space 2D DOM/SVG stage needs one projection owner that emits output-pixel layout, or a single SVG world `viewBox`; do not infer 2D infeasibility from the initial subpixel implementation. R4 uses a 1.15m Short view and keeps physical actor/prop sizes unchanged.
- Mark: retain physical contact anchors and shot camera bounds; check Short close crops after occlusion, subtitle clearance, and the SH03 camera cut in F-1/F/F+1. The final cat uses uniform rig scale; `.48m` nose-to-rump remains a design estimate while source-derived body bounds project to about `.45m` at the `.45m` height calibration.
- Follow-up: Boss to commit/push the projection implementation and R4 board/scene-sheet mapping in the issue PR; Film/Mark should verify the finding against the merged baseline before reusing it elsewhere.
- History: 2026-10-26 / `codex/33-catbox-foundation` `906a85e` + working-tree projection fix → Short/Long previews, full-resolution stills, contact sheets and random-remount comparisons recorded above; issue branch only, not yet merged.

<a id="df-20261027-catbox-short-home-stage"></a>
## DF-20261027-catbox-short-home-stage — Short portrait crop and shared-prop overlay mismatch

- Owner: Boss; First observed: 26 October 2026; last checked: 27 October 2026
- Status: `fixed` for the current issue-branch working tree; Type: `implementation-bug`
- Tags: 2D / camera / scale / contact / overlay
- Scope: `codex/33-catbox-foundation`, PR #38 update; Node `24.5.0`, npm `11.5.1`, Remotion `4.0.538`; `short-c01.json`–`short-c06.json`, `VisualStage.tsx`, `SceneRenderer.tsx`, `render-shorts-qa.mjs`
- Consumers: `CATBOX-C03-SHORT-S01-SH01` and `CATBOX-C06-SHORT-S01-SH01`; Film decisions `VD05`/`VD06`/`VD11`/`VD12`, `VB-CATBOX-R4`; Mark's C03/C06 Short boards and sheets. This finding covers only the new portrait Shorts; it does not audit Long scenes.

<a id="อาการและหลักฐาน-3"></a>
### Symptoms and evidence

- Desired: in C03, the toy enters from offscreen left and crosses to Mochi's reaching paw; the cat, box and toy remain readable at the calibrated physical scale. In C06, BOX-OLD is planted at frame 0 and the single shared flat-outline asset enters as a separate visual beat.
- Before correction, the C03 pounce crop clipped Mochi's muzzle; moving the toy along with the cat left it partly under the cat/box. C06 rendered both a timeline `catbox-outline` prop and an inline SVG outline/label over the sofa. The final status label is drawn with the shared direct-text `Text` primitive so its screen-space copy stays clear over the physical stage.
- Reproduce the final Short-only coverage with `node scripts/cat-boxes/render-shorts-qa.mjs`. C03 is 1080×1920 / 30 fps / 1,350 frames; critical frames include actor/pose F89–F91, toy path, label reveal F95–F97 and fade completion F101–F103; direct/same-browser/remount parity includes F59–F61. C06 critical frames include the outline visibility transition F14/F15/F16.
- Evidence: C03 preview (`out/qa/cat-boxes/shorts-r1/C03/CATBOX-C03-Short_A_fade-preview.mp4`), C06 preview (`out/qa/cat-boxes/shorts-r1/C06/CATBOX-C06-Short_A_fade-preview.mp4`), and the Short QA manifest (`out/qa/cat-boxes/shorts-r1/manifest.json`) with contact-sheet paths and frame lists. These historical artifacts are local under ignored `out/` and are not included in a clean checkout; the paths are references rather than published evidence links.
- Root cause: the C03 toy's floor anchor was coupled to the actor endpoint and its final solid bounds fell behind the box/cat overlap; the physical shot crop did not keep the full lead silhouette inside the output. C06 had two owners drawing the same flat frame. These are shot integration/layout errors, not limits of the SVG/2D approach.

<a id="สิ่งที่ลองและผล-2"></a>
### Attempts and results

- Shift cat and toy together → kept their relative positions but left the target obscured. Corrected with separate deterministic paths and foreground layering: toy holds at x=−0.50m offscreen through 0.5s, crosses left-to-right, and settles at x=0.10m beside the box's right wall; Mochi reaches x=0.06m by 2.8s. This keeps the shared estimated asset dimensions and makes the target visible at the paw.
- Kept the C03 1.15m base orthographic view, with a small camera zoom to 0.95 after 2.8s to keep the pounce inside frame. The effective view is about 1.21m high after the move; the estimated 0.316m seated portion projects to about 501px, above the 480px lead-size threshold. No rig or prop dimensions were inflated.
- Removed C06's second inline frame and flat-frame label; retained the shared `catbox-outline` beside BOX-OLD. Its `startSec: 0.5` is an estimated visual entrance, not an audio cue. Single-label physical-stage pills use the right column to avoid covering the sofa.
- Final CLI QA covers all six compositions at 1,350 frames each, with 46 one-second/final stills each and critical counts C01–C06 = 28/28/48/28/28/37. C03 same-browser and remount parity each cover 13 distinct frames: F59–F61, F89–F91, F101–F103, and random seeks F137/F421/F863/F1189; every frame matches direct rendering. The other five cuts each pass four random-frame checks in both modes. All six A-fade previews are 45 seconds; all six B-loop last frames match frame 0 while their penultimate frames differ. Studio playback/seeking remains `unverified` under `DF-20261026-studio-emfile`. Script approval remains pending, narration is absent, and subtitle timing is estimated/unsynced. No Long render or QA was run.

<a id="ผลต่อการวางแผน-2"></a>
### Planning impact

- Film: keep physical dimensions, output-pixel projection and camera framing as separate controls; continue using the brief's orthographic 2D route for these home beats.
- Mark: C03 SH01 starts with the toy fully offscreen left and moves it right into the cat's paw; C06 SH01 starts with the old box visible and introduces the shared outline at F15. Keep the F0 and F−1/F/F+1 states in the boards; C06's 0.5s cue is estimated, not audio-synced.
- Follow-up: recheck the cited findings against merged `main`; keep C06-S02 source framing/scale and all other Long material for the later Long project. Script/voice approval, runtime factual-image review and interactive Studio seeking remain unverified.
- Revalidation history: 2026-10-27 / `codex/33-catbox-foundation` / PR #38 update → six Short CLI previews, 46 per-second/final stills each, critical-frame/contact-sheet coverage, C03's 13-frame same-browser/remount parity, random-seek/remount parity and six loop checks recorded in the manifest → `fixed` for this PR branch. The note records branch evidence and does not assert that PR #38 has merged.

<a id="df-20261028-blender-cycles-water-spike"></a>
## DF-20261028-blender-cycles-water-spike — Cycles water refraction modelling rules, MP4 colour tags, M1 cost

- Owner: Boss; first observed: 2026-10-28; last checked: 2026-10-28; status: `workaround` (modelling/encode rules that avoid the observed failures); type: `tool-limitation`
- Tags: 3D / Blender / refraction / tooling / render-cost
- Scope: `claude/pool-depth-short` HEAD `59809c8` + untracked `assets/blender/pool-depth/build.py`; Blender 5.2.3 LTS headless, Cycles Metal (Apple M1 GPU, 8 cores), Remotion 4.0.538. Numbers: `scripts/pool-depth/spike-results.md`, `assets/blender/pool-depth/spike-manifest.json`.
- Consumers: POOLDEPTH-SHORT `VD01`, `VD02`, `VD05`, `S01-B01`/`B03`/`B05`/`B06`.

### Symptoms and evidence
- Water modelled as a closed Glass BSDF (IOR 1.333) volume matched the Snell prediction within 0.10 px at 1080x1920 (S1). Observed failures that corrupted S2 until fixed: (1) a 0.1 mm air gap between the water side wall and the opaque cup wall produced total-internal-reflection mirror images of the coin (a stretched magenta band); (2) a bare glass cylinder with the cup hidden acts as a lens, so it is not a valid "unoccluded" reference (use a wide flat slab); (3) an MP4 encoded from Blender PNGs without colour tags decoded through Remotion with a visible shift (RGB 16,94,113 became 8,87,115); tagging bt709/tv with `scale=out_color_matrix=bt709` reduced it to about 1-2 levels; (4) the first Cycles Metal frame took 135 s (kernel compile), later frames did not.
- Reproduce: `/Applications/Blender.app/Contents/MacOS/Blender -b --python assets/blender/pool-depth/build.py -- s1|s2`; encode recipe in `scripts/pool-depth/spike-results.md`.
- Coverage: final CLI stills/renders and full-frame decode of one 150-frame render; Studio `unverified` (`DF-20261026-studio-emfile`).

### Attempts and results
- Rules: bury the water bottom and side faces inside opaque geometry (no air gap, no coincident faces); keep the tested IOR 1.0 control; count coin pixels from an emissive mask, threshold 0.5 (indirect bleed from an emissive object is below it).
- Cost: 32 spp, no denoise, 1080x1920, Cycles Metal: 3.8 s/frame for a trivial emissive scene, 13-15 s/frame for a glass+floor scene, 11-13 s/frame for the mug scene at 64 spp (grainy: glass blocks shadow rays, light reaches the cup floor only through noisy indirect paths).

### Planning impact
- Film: Blender route stays feasible for refraction beats; budget render time and a denoise/shadow-ray strategy before committing about 1,000 frames. Mark: no change. Follow-up: Boss decides denoise or fake-shadow trick during D2/D3.

### Revalidation history
- 2026-10-28 / `59809c8` + working tree: S0/S1/S2 pass at the stated coverage; Film/Mark adoption: pending.
