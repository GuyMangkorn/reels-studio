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
| [DF-20261028-zcondo-eevee-render-spike](#df-20261028-zcondo-eevee-render-spike) | Blender Eevee vs Cycles render cost and look / M1 / interiors need baked GI | workaround | 2026-10-28 / `main` `9670266` + untracked `assets/blender/zc-render-spike/` | Eevee ≈4.2–4.6 s/frame vs Cycles ≈26–30 s/frame on ZCONDO blockouts (≈6–7×); interiors need a baked volume probe; Eevee smoke is softer |
| [DF-20261028-zcondo-sp01-corridor-plate](#df-20261028-zcondo-sp01-corridor-plate) | ZCONDO SP01 corridor plate: Eevee + baked GI, bt709 encode, Remotion load / caption middle | workaround | 2026-10-28 / `main` `9670266` + untracked `assets/blender/zc-corridor/` | B01-SH01 blockout plate passes SP01 (a)–(f) at the stated coverage; Eevee 64 ≈5.4 s/frame; ≈−2 level shift after encode; caption-middle fits the box |
| [DF-20261029-zcondo-b01-look-r31](#df-20261029-zcondo-b01-look-r31) | ZCONDO B01 look target (infected darker than the window) reached by lighting / light linking | workaround | 2026-10-29 / `main` `80c73c5` + working tree | `VD-ZC-01` R3.1 look target met on the blockout (0.234 ≤ 0.25); hair rim and production assets still to verify in `S-02` |
| [DF-20261029-zcondo-sp02-section-spike](#df-20261029-zcondo-sp02-section-spike) | ZCONDO SP02 section cutaway: `CAM-SECTION-LL` seated stills, standing 60-frame truck, caps, door wall 0.18 | workaround | 2026-10-29 / `main` `80c73c5` + working tree | Seated lead ≥480 px passes; poses pass on a placeholder mannequin; cut-plane magnification moves the corridor-cap sliver and the B07-SH02 TH tail frame clips a foot |

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
- 2026-10-28 D3 follow-up (pool set, `assets/blender/pool-depth/build.py`): the grain risk is resolved by (a) a Mix Shader on the water surface that uses Transparent for shadow rays (`Light Path > Is Shadow Ray`) so the sun and sky light the floor and the child's shadow directly (no caustics; camera rays still refract), and (b) OIDN denoise on GPU at 40 spp (about 20 s/frame for the pool-edge shot, 11 s sign close-up, 35 s legs/water close-up at 1080x1920). 128 spp raw cost 54-104 s/frame, so denoise is the cheaper route; temporal flicker of OIDN across consecutive frames is still untested. Rippled water is a bump from a sum of travelling sines with integer cycles per 30 frames (exactly periodic). Oblique pool-edge camera (65-76 deg from vertical): marker error 0.04-0.65 px against the Snell prediction (IOR 1.0 control 0.09-0.23 px).
- Tooling flake: one of about 12 headless Blender starts crashed inside Cycles Metal kernel compilation (`MetalKernelPipeline::compile`, NSException); re-running the same command worked. Wrap long renders in a retry.

### Planning impact
- Film: Blender route stays feasible for refraction beats; budget render time and a denoise/shadow-ray strategy before committing about 1,000 frames. Mark: no change. Follow-up: Boss decides denoise or fake-shadow trick during D2/D3.

### Revalidation history
- 2026-10-28 / `59809c8` + working tree: S0/S1/S2 pass at the stated coverage; Film/Mark adoption: pending.
- 2026-10-28 / `claude/pool-depth-short` working tree (after `148f3bc`): D3 pool set, S3 diagram geometry and S4 loop seam pass at the stated coverage (`scripts/pool-depth/spike-results.md`); Film/Mark adoption of the recorded camera/pose deviations: pending.
- 2026-10-28 / `claude/pool-depth-short` working tree (after `d079187`): SH03 mug demo with real Cycles refraction passes the S2 criteria (0 coin px before the pour, 95.4% at F225, IOR 1.0 control 0 px, nothing keyed); shadow-ray Transparent mix, caustics off and 40 spp + OIDN solve the S2 grain; OIDN temporal flicker measured negligible (excess <= 0.11/255); D3/S3/S4 re-run after the look pass still pass. Test caveat: with absorbing water the oblique red-marker test needs a strong emitter and a lower centroid threshold. Film/Mark adoption: pending.

<a id="df-20261028-zcondo-eevee-render-spike"></a>
## DF-20261028-zcondo-eevee-render-spike — Eevee vs Cycles cost and look on ZCONDO blockouts (M1)

- Owner: Boss; first observed: 2026-10-28; last checked: 2026-10-28; status: `workaround` (Eevee is ≈6–7× cheaper; its interior bounce gap is closed by a baked volume probe); type: `tool-limitation`
- Tags: 3D / Blender / Eevee / Cycles / lighting / volumetrics / render-cost
- Scope: `main` `9670266` + untracked `assets/blender/zc-render-spike/` (`build.py`, `run_all.sh`, `spike-manifest.json`); Blender 5.2.3 LTS headless (`BLENDER_EEVEE`, Eevee Next) and Cycles Metal on Apple M1 (8-core GPU, 16 GB); the user's GUI Blender (MCP-connected, empty scene) was open and idle during the runs. Blender MCP connection checked with `execute_blender_code` (version 5.2.3 LTS, arm64).
- Consumers: ZCONDO-SHORT-TH / ZCONDO-SHORT-EN plates (`VB-ZCONDO-SHORT-R3` `VD-ZC-00`, `SP01` (e), `S-10`, `RK-02`); user request 28 Oct 2026 to try Eevee.

### Symptoms and evidence
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

### Attempts and results
- Look verdict (Boss, from the stills): the balcony/night-city look (moon shadows of the railing bars, fire-lit tower faces, warm smoke) is close to Cycles in `eevee64` and `eevee32`; Eevee smoke is softer and less detailed (froxel volumes at tile 8) and slightly less warm-lit from below. The corridor is acceptable only with baked GI (`eevee64gi`); emissive panels, exit sign, contact shadows and the figures read correctly. `eevee32` vs `eevee64` showed no visible difference in these stills (no fine texture or hair to expose aliasing).
- Extrapolation for ≈2,100 plate frames (`estimated`, steady-state means × frames, plus ≈17 plate processes × ≈15 s start/build/compile): `eevee64`/`eevee64gi` 4.2–4.6 s/frame → **≈2.5–2.8 h** (2,050–2,260 frames: 2.4–2.9 h); `eevee32` 2.2–2.4 s/frame → **≈1.3–1.5 h**; `cycles40dn` 25.8–30.1 s/frame → **≈15–17.6 h** (2,050–2,260 frames: 14.7–18.9 h). Eevee is ≈6–7× (64 samples) to ≈11–13× (32 samples) faster.
- Limits of the estimate (heavy content since measured in `DF-20261028-zcondo-eevee-worstcase`: ≈10 s/frame in Eevee, still ≥3.8× faster than Cycles): blockouts have no textures, rigged face, hair, cloth, blood decals or section caps; production plates will cost more per frame in either engine (unmeasured). Close-up smoke may need volumetric tile 4 or 2, which costs more (unmeasured).

### Planning impact
- Film: Eevee is a viable default for `VD-ZC-00` plates on this M1; keep Cycles as a per-shot option only where the softer Eevee smoke or the missing interior bounce matters. Interiors (`zc-corridor`, `zc-unit`) must ship a baked volume probe per set (enclosing every lit surface) or explicit fill lights. Fallback (all stills + `pictureMove`) is no longer forced by cost.
- Mark: no shot change; avoid close-ups that rely on fine smoke detail in B08 unless Boss re-tests tile 4.
- Follow-up (Boss, `SP01`): production `zc-corridor/build.py` with probe GI, a full 105-frame `B01-SH01` sequential Eevee render (temporal flicker), bt709 encode and Remotion load per `SP01` (b)–(d), (f); re-measure per-frame cost on the textured/rigged assets.

### Revalidation history
- 2026-10-28 / `main` `9670266` + untracked `assets/blender/zc-render-spike/`: corridor and balcony blockouts, frames 0/36/104, four presets; results above. Film/Mark adoption: pending.
- 2026-10-28 / same checkout + untracked `assets/blender/zc-corridor/`: on the production-staged corridor blockout, Eevee 64 measured 5.39 s/frame mean over 150 frames (higher than the spike's 4.2–4.6), see `DF-20261028-zcondo-sp01-corridor-plate`.

<a id="df-20261028-zcondo-sp01-corridor-plate"></a>
## DF-20261028-zcondo-sp01-corridor-plate — SP01: B01-SH01 corridor plate in Eevee + baked GI, encoded and loaded in Remotion

- Owner: Boss; first observed: 2026-10-28; last checked: 2026-10-28; status: `workaround` (pipeline works; residual colour shift and placeholder-level look recorded); type: `tool-limitation`
- Tags: 3D / Blender / Eevee / lighting / colour / runtime / captions / render-cost
- Scope: `main` `9670266` + working tree; untracked `assets/blender/zc-corridor/` (`build.py`, `render_sp01.sh`, `sp01_check.py`, `manifest.md`, `sp01-manifest.json`); Blender 5.2.3 LTS headless Eevee on Apple M1; Remotion 4.0.538 via the shared `SceneRenderer` media path, from a scratch entry `out/qa/zombie-condo/sp01/entry.tsx` (nothing registered in `src/`). User approval to continue SP01 in Eevee: 28 Oct 2026 (“ทำ SP01 ต่อ”, relayed by the coordinator).
- Consumers: ZCONDO-SHORT-TH / -EN `B01-SH01` (`VD-ZC-01`, `PROJ-ZC-R3`, `SP01`, `S-01`/`S-02`/`S-10`); `zc-corridor` is reused by B02 (section, `SP02`). No Mark scene sheet for B01 existed; the staging is Boss's blockout reading of `VD-ZC-01`.

### Symptoms and evidence
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

### Attempts and results
- Look (Boss inspection): cool cyan-green corridor, warm-white far window, dead and flickering strips, contact on the floor, matte smear trail; she reads as a backlit figure but her pale shirt is still lit from the front by strip 3, so she is a grey figure on a bright window rather than a hard black silhouette with a rim (`VD-ZC-01` asks for the latter). Eevee shows a soft halo around the window and figure (screen-space effects). 32 samples leave visible grain on the dark ceiling at full resolution; 64 is the baseline.
- Placeholders: primitive figures without face, hands, rig, flip-flops or blood decals on the infected; the door pull is not visible from this OTS position (the inward leaf is behind him, already open), so the action reads as "steps out with the trash bag".

### Planning impact
- Film: Eevee + baked volume probes is confirmed for the corridor; budget ≈5.4 s/frame on this set (≈3.2 h for ≈2,100 frames at 64 samples, `estimated`; more with rigged/textured assets). A −2 level encode shift is accepted unless Film wants a compensation grade.
- Mark: decide whether the door pull must be visible in SH01 (needs a camera nearer the hinge side or a different blocking) and whether the infected should be a pure silhouette (Boss can kill strip 3 near her or add a flag). Caption-middle position fits over this framing.
- Follow-up (Boss): real `zc-you`/`zc-infected` rigs and blood decals; EN trim check; Studio seek check when `DF-20261026-studio-emfile` allows; SP02.

### Revalidation history
- 2026-10-28 / `main` `9670266` + untracked `assets/blender/zc-corridor/`: SP01 (a)–(f) pass at the coverage above. Film/Mark adoption: pending.

<a id="df-20261028-zcondo-eevee-worstcase"></a>
## DF-20261028-zcondo-eevee-worstcase — Worst-case Eevee 64 vs Cycles 40spp + OIDN on B08 and a character-heavy corridor (M1)

- Owner: Boss; first observed: 2026-10-28; last checked: 2026-10-28; status: `workaround` (Eevee stays 3.8× to 18× faster on the heaviest cases; look gaps listed below); type: `tool-limitation`
- Tags: 3D / Blender / Eevee / Cycles / volumetrics / hair / render-cost
- Scope: `main` `9670266` + untracked `assets/blender/zc-render-spike/` (`worstcase.py`, `run_worstcase.sh`, `worstcase-manifest.json`) and `assets/blender/zc-corridor/`; Blender 5.2.3 LTS headless, Apple M1 (8-core GPU, 16 GB); the user's GUI Blender was open and idle. Settings identical to `DF-20261028-zcondo-eevee-render-spike` (`eevee64`, `cycles40dn`). User request 28 Oct 2026 (“ทำต่อได้นะ”, relayed by the coordinator). Follow-up to that finding's "Limits of the estimate".
- Consumers: `VD-ZC-08` / B08 plate (150 frames TH, 135 EN), `zc-infected` hair/blood/shirt (`S-06`, B01 SH01/SH02, B02), `S-10` plate renders.
- Leftover check before the run: no headless Blender process, no partial frames (`eevee32`/`eevee64` 150 PNG each, `eevee256` 12 = the planned F60–F71 window), no stray files in `assets/blender`; nothing tidied. The only Blender process was the user's GUI instance.

### Symptoms and evidence
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

### Attempts and results
- Look verdict (Boss, from the stills):
  - Smoke: tile 8, 4 and 2 are visually the same in the stills (all soft, smooth edges); tile 2 doubles the cost for no visible gain, so keep tile 8 (tile 4 optional). Cycles shows more irregular wisps, a ragged plume edge and more warm scattering near the fires and the embers' glow; Eevee smoke is flatter but warm-lit from below and reads as the same plume, so it holds for the brief's wide push-out.
  - Fire-glow rim: Eevee leaves `zc-you` a near-black silhouette on B08 while Cycles lights him warmly from the fires (no screen-space bounce off the city). `VD-ZC-08` asks for a fire-glow rim, so B08 needs an explicit warm rim/fill light on him in Eevee (the spike's `ZC_FireRim` point light is not enough at this scale). Not yet re-tested.
  - Hair: Eevee draws 8,000 curve strands as distinct dark-brown strands with clumping, no visible aliasing or noise at 64 samples; the face-over-hair read holds. In Cycles the same Principled Hair settings came out pale grey (shader model/sheen difference, not a speed effect), so hair colour needs per-engine tuning; do not compare hair colour across engines.
  - Shirt texture and bump read the same in both. Blood decals read in both; some decals show grey patches where overlapping shrinkwrapped decals fight (placeholder-setup artefact, fix with one decal per area).
  - Embers at emission 80 clip to white hexagons in Eevee and glow softly in Cycles (set lower strength/bloom-like sprites).
- Verdict: the speed conclusion holds on the heaviest cases (Eevee ≥3.8× faster; ≥16× on B08 with tile ≤4); Eevee remains the plate default. Cycles stays a per-shot option only for B08 smoke detail or fire-lit "you", where it would cost ≈100 s/frame (≈4.4 h per 150-frame plate).

### Planning impact
- Film: keep Eevee default; budget ≈6 h worst-case total on this M1, ≈15 min for the B08 plate; use volumetric tile 8.
- Mark: B08 relies on an authored warm rim light on "you", not on bounce.
- Follow-up (Boss): hair shader tuning, decal clean-up, B08 rim-light test, full-plate sequential render of one hair shot for flicker.

### Revalidation history
- 2026-10-28 / `main` `9670266` + untracked `assets/blender/zc-render-spike/` and `zc-corridor/`: results above. Film/Mark adoption: pending.

<a id="df-20261029-zcondo-b01-look-r31"></a>
## DF-20261029-zcondo-b01-look-r31 — B01 look target: infected darker than the window by lighting, not by darkening her shirt

- Owner: Boss; first observed: 2026-10-28 (`DF-20261028-zcondo-sp01-corridor-plate` open note); last checked: 2026-10-29; status: `workaround` (target met on the blockout); type: `tool-limitation`
- Tags: 3D / Blender / Eevee / lighting / light-linking / silhouette
- Scope: `main` `80c73c5` + working tree; `assets/blender/zc-corridor/build.py` (`ZC_LOOK=sp01|r31`, `look` command), Blender 5.2.3 LTS headless Eevee 64 on the M1; user instruction 29 Oct 2026 (“เริ่มเลย”, relayed by the coordinator).
- Consumers: ZCONDO-SHORT `B01-SH01`/`B01-SH02` (`VD-ZC-01` R3.1 look target); future `S-02`/`S-06` production lighting.

### Symptoms and evidence
- Target (brief R3.1): at shot F36 (clip F51) infected mean luminance ≤ about ¼ of the window pane's on the plate, with a visible rim on head and shoulders, by lighting, shirt unchanged. SP01 measured nothing; it read grey by eye.
- Measurement: Eevee 64 beauty PNG plus a Workbench flat-colour mask of the same frame (figure = `zc-inf*`, pane = `zc-corr_window`); Rec.709 luma on the PNG's 8-bit display values (and, separately, linearised). Figure 10,313 px, pane 16,828 px (the pane is clipped to ≈1.0, so "window brighter" cannot raise the denominator).
  - `sp01` lighting: figure/pane **0.285** display (0.104 linear), clip F51.
  - `r31` lighting: **0.234** display (0.075 linear) at clip F51; 0.229 at F15; 0.231 at F119. Figure median 0.19, p95 0.54 (bright edge band).
- What worked: (1) light-link the corridor strip lights so they do not light the infected (`light_linking.receiver_collection` + `collection_objects[].light_linking.link_state = 'EXCLUDE'`); (2) cut the far-window area light from 700 W to 100 W; it was bouncing off the floor into her hem and shirt (700 W gave 0.294 even with linking; 350 W 0.262); (3) a 600 W grazing rim area light at (13.6, −0.95, 2.45) aimed down at her head and shoulders raises the top surfaces without lifting the mean far (0.186 without, 0.234 with). Darkening the floor (×0.4) changed little (0.259 at 350 W).
- Not met / caveats: the rim reads on the shoulders and arms; the hair is black, so no rim shows on the head (needs a hair spec/shader tuned in `S-03`, see `DF-20261028-zcondo-eevee-worstcase`). The 100 W window leaves the corridor near the window slightly darker than in SP01; the pane stays clipped white with a soft halo. Placeholder primitive figure only: a real shirt texture, hair and skin will move the number. The SP01 plate was **not** re-rendered with `r31`; re-render B01-SH01 before production.
- Reproduce: `ZC_LOOK=r31 Blender -b --python assets/blender/zc-corridor/build.py -- look 51` (also `ZC_LOOK=sp01`); results merge into `assets/blender/zc-corridor/sp01-manifest.json` keys `look/*`. Evidence (local, Git-ignored): `out/qa/zombie-condo/sp02/look/{sp01,r31}/{beauty,mask}_F51.png` and crops.
- Coverage: Blender CLI stills at clip F15, F51, F119 only; no full-plate flicker run with the new lights, no Remotion/Studio check.

### Planning impact
- Film: `VD-ZC-01` R3.1 look target is met on the blockout by lighting alone; keep the measurement method (plate luma, mask) for the production plate.
- Mark: no sheet change.
- Follow-up (Boss): hair rim; re-measure on the production `zc-infected` in `S-02`; re-render B01-SH01 with `r31`.

### 2026-10-29 addendum — trash bag `MK-ZC-ST-07` (sheets `ZCONDO-SHORT-SS-R2.3`)
- Blockout: one `zc-bag` (squashed ellipsoid 0.40 × 0.28 × 0.38 m plus knot to z 0.45) at (−0.75, 0.40, 0) in every `build_sp02.py` shot; the `zc_you` placeholder's hand-held bag is removed in `pose_stand_b02` only (SP01 / `zc-corridor` keep it). New views `B02start` (B02-SH02 clip 39, bag visible) and the `bag` command (`sp02-manifest.json` key `bag`).
- Measured (ray cast per bag vertex plus projection): bag fully hidden behind `zc-cabinet` (y 0.18–0.58) in B02-SH02 end, B03-SH01 (camera y 2.05; the ray enters through the cabinet's y 0.58 side face) and B09-SH01 / B09-SH03 (camera y 0.90, 0.78, 0.35); 0 of 515 vertices unblocked in each.
- Phone clearance: bag footprint to phone centre (−0.80, 0.62) 0.083 m; to the phone box edge (y 0.58) **0.041 m**, under the sheet's 0.05 m if the phone's own size counts. Not moved; Mark decides (e.g. bag at y 0.38 gives ≈0.06 m).
- **B10-SH01 sheet is not self-consistent in `ZC-WORLD`.** With the camera taken literally (vFOV 55°, (0.70, 2.75, 1.50) → (0.49, 0.05, 1.35), shift_y +0.10) screen-right is −X, so the partition jamb (x 0.30) is on the right and he (x 0.80) on the left, the opposite of the sheet's screen estimates; his lead height is ≈1930 px (not ≈480+ in the face box). The bag (x −0.95…−0.55) is behind partition `p1` (solid for x < 0.30) and off-screen (nearest corner x 1313, y 1816): not visible. `out/qa/zombie-condo/sp02/B10-SH01_measure_literal.png`. Film/Mark must fix the camera or mirror before the bag's B10 visibility can be judged.

### Revalidation history
- 2026-10-29 / `main` `80c73c5` + working tree: results above. Film/Mark adoption: pending.

<a id="df-20261029-zcondo-sp02-section-spike"></a>
## DF-20261029-zcondo-sp02-section-spike — SP02: section cutaway with `CAM-SECTION-LL` seated stills, standing truck, caps and door wall 0.18 m

- Owner: Boss; first observed: 2026-10-29; last checked: 2026-10-29; status: `workaround` (spike passes; framing numbers for Mark and Film below); type: `integration-gap`
- Tags: 3D / Blender / Eevee / section / camera / caps / poses / captions
- Scope: `main` `80c73c5` + working tree; new `assets/blender/zc-unit/` (`build_sp02.py`, `sp02_check.py`, `render_sp02.sh`, `sp02-manifest.json`), shared constant `assets/blender/zc_world.py` (`DOOR_WALL = 0.18`) used by `zc-corridor` and `zc-unit`; Blender 5.2.3 LTS headless Eevee 64 on the M1. Blockout only: grey boxes and primitive mannequins, no final `zc-unit`, `zc-you`, `zc-cabinet`, `S-03`–`S-07`.
- Consumers: ZCONDO-SHORT B02-SH02/SH03, B07-SH02, B09-SH01/SH03 (`PROJ-ZC-R3`, `CAM-SECTION-LL`, `MK-ZC-ST-01/04/05`); sheets `ZCONDO-SHORT-SS-R2.1`, brief `VB-ZCONDO-SHORT-R3.1`.

### Symptoms and evidence
- Camera: x = 17.0, z = 1.70, looking −X, level, vFOV from coverage C at x = 0 (`2·atan(C/2/17)`), lens shift solved so the floor at x = 0 projects to y = 860 (checked: 860.0 in every shot; shift_y −0.552 at 3.4 m, −0.422 at 4.6 m).
- (a) lead size, measured on projected mesh bounds: **B09-SH01/SH03 seated 502–506 px** (3.4 m; head top y 317, feet 824; the minimum over the spike), **B07-SH02 seated 552 px** (4.6 m, clip 0/31/95, head y 283, feet 835), **B02 standing 524 px** (6.4 m, head y 341), **60-frame truck standing 574 px** at start/middle/end (6.0 m, head y 306, feet y 880 because he walks at x 0.45, nearer than the floor line plane). All ≥480 and the head is above y 860 in every case. Sheets estimated ≈530 px for both seated shots; measured margin over 480 is 5 % (B09) and 15 % (B07).
- (a2) seated naturalness (placeholder mannequin, joints by 2-bone IK; vertex-level contact numbers plus visual check of the still): **B09-SH01 pass, B09-SH03 pass** (same pose, F1): hips on floor (lowest z 0.000), feet z 0.000, back wall gap 1.7 mm, no wall/floor/cabinet penetration, hands on knees, head pitched 25°, reads as a person sitting with weight on the floor. **B07-SH02 pass** (clip 0, 31, 95; same pose): hips 2.3 mm over the seat top, seat penetration 2.5 cm (soft-body compression, below the 3 cm threshold), feet z 0.000, back 7 cm off the sofa back (relaxed, not floating), no wall penetration. Judged on a placeholder: the final rig must reproduce the recorded joint targets (`sp02-manifest.json` `still/*/pose_joints`) and Boss re-checks it in `S-03`/`S-04`. No shot falls back to SS-R1 standing.
- (a3) door wall 0.18 m, one constant (`DOOR_WALL`) for `zc-corridor` and `zc-unit`: door wall y ∈ [0, 0.18], cabinet y ∈ [0.18, 0.58] from the built geometry, gap 0 and overlap 0 (`sp02-manifest.json` `geometry`). SP01 plate not re-rendered (2 cm invisible in that framing; nothing contradicted).
- (b) caps closed: 9 cut-face caps tile without overlap (geometry), and in every still and all 60 truck frames each cap's projected rectangle (eroded 3 px) is one flat colour, max deviation 1 level (`sp02_check.py caps`); no holes, z-fighting or light leaks seen. Cut faces are unlit flat colour by construction, so this does not test lit-cap leaks of the production set.
- (c) capped corridor: the corridor cap rectangle is exactly black within 1/255 (max value 1, dither) in the B09-SH03 still and in every truck frame where it is on screen, and nothing from the corridor shows through.
- (d) caption zone y 860–1248: Rec.709 luma mean 0.16–0.24 and p95 0.24–0.32 over all stills and truck F0/30/59 (Boss thresholds mean ≤0.25, p95 ≤0.40; the brief gives none). First attempt with a light floor failed (mean 0.25–0.30, p95 0.59–0.67): the unit floor in perspective fills y 860–975, so the floor tile must be dark (`#2f2c29`) and neighbour slices dark (`#1c1c1c`). Max pixel 0.87 is the lead's/cabinet's bright edge in the zone.
- (e) cost: 4.1–5.9 s/frame stills, truck 4.67 s/frame mean (max 5.07) at Eevee 64, plus ≈2–3 s probe bake per process (one volume probe 8×24×6). The section is cheaper than the corridor (5.4 s).
- Findings that change numbers in the sheets (measured, not estimated):
  1. **Cut-plane magnification.** The caps sit at x = 1.78, 15.2 m from the camera against 17.0 m at the character plane, so everything on the cut plane is ×1.117 larger than the sheets' px/m at x = 0 (e.g. 631 vs 565 px/m at 3.4 m). B09-SH01 at camera y 0.90: the door-wall cap spans x ≈ −28…86 and the black corridor cap is **off-screen** (no 0–30 px sliver); the cabinet face is x ≈ 125–360 (matches the sheet). A visible black sliver of ≥30 px needs camera y ≤ ≈0.81 (cap x 0–31, door wall 31–145, cabinet ≈145–372 at that y). B09-SH03 at y 0.35: black cap x 0–319, door wall 319–433, cabinet ≈433–672 (sheet: 340/445/670; close).
  2. **B07-SH02 TH tail.** The sheet's "y 5.70 → 9.00 over clip 0–126" are camera centres; TH ends at clip 95 (y 8.19) and the frame there has his head at x ≈245 (sheet ≈190) and **the left foot cut by the frame edge by ≈11 px** (feet are at y ≈6.93, left of his hips because he faces 40° toward −Y). EN ends at clip 89 (y 8.03): ≈67 px more room, the foot is in frame. Fully in frame from clip 31 as written.
  3. Truck speed at the cut plane ≈12.2 px/frame for B07-SH02 (0.0262 m/frame × 417 × 1.117); motion blur or judder not rendered or judged in this spike.
  4. Sheet inconsistency: B09-SH01 "phone … by his left foot" at y 0.62 is on his right side when he faces +X (left is +Y); placed as written.
- Reproduce: `sh assets/blender/zc-unit/render_sp02.sh`, then Blender's `python3.13 -I assets/blender/zc-unit/sp02_check.py caps|caption`. Evidence (local, Git-ignored): `out/blender/zc-unit/sp02/{B02,B09SH01,B09SH03,B07SH02,B07SH02mid,B07SH02start}/still.png`, `out/blender/zc-unit/sp02/truck/frame_0000–0059.png`, contact sheets `out/qa/zombie-condo/sp02/contact-stills.png`, `contact-truck-every10.png`, crop `crop-B09SH01.png`.
- Coverage: Blender CLI only. Not done: Remotion load, Studio, EN conform, the 126-frame B07-SH02 LL truck, motion blur/judder, B02 corridor-open 60-frame run (one still), caps under real lighting, production neighbour slices.

### Planning impact
- Film: `CAM-SECTION-LL` seated lead passes on render (≥502 px); the seated stills are acceptable at 3.4 m and 4.6 m. Record the cut-plane ×1.117 note against `PROJ-ZC-R3` (framing arithmetic should be taken on the cut plane for caps, at x = 0 for the character).
- Mark: revalidate B09-SH01 camera y (cap sliver), B07-SH02 TH tail trim or camera at clip 95, the phone side, and the lead sizes (502–506 and 552 px measured vs ≈530 estimated).
- Follow-up (Boss): repeat the pose check on the rigged `zc-you`; add the LL truck with motion blur; replace blockout geometry with `zc-unit` in `S-03`.

### 2026-10-29 addendum — trash bag `MK-ZC-ST-07` (sheets `ZCONDO-SHORT-SS-R2.3`)
- Blockout: one `zc-bag` (squashed ellipsoid 0.40 × 0.28 × 0.38 m plus knot to z 0.45) at (−0.75, 0.40, 0) in every `build_sp02.py` shot; the `zc_you` placeholder's hand-held bag is removed in `pose_stand_b02` only (SP01 / `zc-corridor` keep it). New views `B02start` (B02-SH02 clip 39, bag visible) and the `bag` command (`sp02-manifest.json` key `bag`).
- Measured (ray cast per bag vertex plus projection): bag fully hidden behind `zc-cabinet` (y 0.18–0.58) in B02-SH02 end, B03-SH01 (camera y 2.05; the ray enters through the cabinet's y 0.58 side face) and B09-SH01 / B09-SH03 (camera y 0.90, 0.78, 0.35); 0 of 515 vertices unblocked in each.
- Phone clearance: bag footprint to phone centre (−0.80, 0.62) 0.083 m; to the phone box edge (y 0.58) **0.041 m**, under the sheet's 0.05 m if the phone's own size counts. Not moved; Mark decides (e.g. bag at y 0.38 gives ≈0.06 m).
- **B10-SH01 sheet is not self-consistent in `ZC-WORLD`.** With the camera taken literally (vFOV 55°, (0.70, 2.75, 1.50) → (0.49, 0.05, 1.35), shift_y +0.10) screen-right is −X, so the partition jamb (x 0.30) is on the right and he (x 0.80) on the left, the opposite of the sheet's screen estimates; his lead height is ≈1930 px (not ≈480+ in the face box). The bag (x −0.95…−0.55) is behind partition `p1` (solid for x < 0.30) and off-screen (nearest corner x 1313, y 1816): not visible. `out/qa/zombie-condo/sp02/B10-SH01_measure_literal.png`. Film/Mark must fix the camera or mirror before the bag's B10 visibility can be judged.

### Revalidation history
- 2026-10-29 / `main` `80c73c5` + working tree: results above. Film adoption: read 2026-10-29 (same revision) → brief `VB-ZCONDO-SHORT-R3.2`: cut-plane ×1.117 rule in `PROJ-ZC-R3`, measured leads recorded (B09 at 3.4 m accepted by the user), B09-SH01 camera y 0.78, B07-SH02 TH trim 9, phone on his right. Mark adoption: pending.
