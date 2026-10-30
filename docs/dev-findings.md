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
| <a id="df-20261026-duplicate-types"></a>[DF-20261026-duplicate-types](dev-findings/DF-20261026-duplicate-types.md) | Typecheck / local dependencies | workaround | 2026-10-26 / `906a85e` | Separate environment failures from medium feasibility |
| <a id="df-20261026-studio-emfile"></a>[DF-20261026-studio-emfile](dev-findings/DF-20261026-studio-emfile.md) | Studio file watcher / tooling | open | 2026-10-26 / `906a85e` | CLI renders are available; Studio seeking remains unverified |
| <a id="df-20261026-subpixel-stage-projection"></a>[DF-20261026-subpixel-stage-projection](dev-findings/DF-20261026-subpixel-stage-projection.md) | 2D scale / camera / anchors | fixed | 2026-10-26 / `906a85e` + working tree | Use direct output-pixel projection for metre-space DOM/SVG actors/props |
| <a id="df-20261027-catbox-short-home-stage"></a>[DF-20261027-catbox-short-home-stage](dev-findings/DF-20261027-catbox-short-home-stage.md) | Short crop / prop contact / overlay ownership | fixed | 2026-10-27 / PR #38 branch | Keep C03 actor/target in portrait crop; draw C06 shared frame once |
| <a id="df-20261028-blender-cycles-water-spike"></a>[DF-20261028-blender-cycles-water-spike](dev-findings/DF-20261028-blender-cycles-water-spike.md) | Blender Cycles water refraction / MP4 colour tags / M1 render cost | workaround | 2026-10-28 / `claude/pool-depth-short` HEAD `59809c8` + working tree | Cycles Glass refraction is measurably Snell-accurate; follow the modelling rules and encode tags below |
| <a id="df-20261028-zcondo-eevee-render-spike"></a>[DF-20261028-zcondo-eevee-render-spike](dev-findings/DF-20261028-zcondo-eevee-render-spike.md) | Blender Eevee vs Cycles render cost and look / M1 / interiors need baked GI | workaround | 2026-10-28 / `main` `9670266` + untracked `assets/blender/zc-render-spike/` | Eevee ≈4.2–4.6 s/frame vs Cycles ≈26–30 s/frame on ZCONDO blockouts (≈6–7×); interiors need a baked volume probe; Eevee smoke is softer |
| <a id="df-20261028-zcondo-sp01-corridor-plate"></a>[DF-20261028-zcondo-sp01-corridor-plate](dev-findings/DF-20261028-zcondo-sp01-corridor-plate.md) | ZCONDO SP01 corridor plate: Eevee + baked GI, bt709 encode, Remotion load / caption middle | workaround | 2026-10-28 / `main` `9670266` + untracked `assets/blender/zc-corridor/` | B01-SH01 blockout plate passes SP01 (a)–(f) at the stated coverage; Eevee 64 ≈5.4 s/frame; ≈−2 level shift after encode; caption-middle fits the box |
| <a id="df-20261028-zcondo-eevee-worstcase"></a>[DF-20261028-zcondo-eevee-worstcase](dev-findings/DF-20261028-zcondo-eevee-worstcase.md) | Worst-case Eevee 64 vs Cycles 40spp + OIDN on B08 and a character-heavy corridor / M1 | workaround | 2026-10-28 / `main` `9670266` + untracked `assets/blender/zc-render-spike/` | Eevee stays 3.8× to 18× faster on the heaviest cases; look gaps listed in the entry |
| <a id="df-20261029-zcondo-b01-look-r31"></a>[DF-20261029-zcondo-b01-look-r31](dev-findings/DF-20261029-zcondo-b01-look-r31.md) | ZCONDO B01 look target (infected darker than the window) reached by lighting / light linking | workaround | 2026-10-29 / `main` `80c73c5` + working tree | `VD-ZC-01` R3.1 look target met on the blockout (0.234 ≤ 0.25); hair rim and production assets still to verify in `S-02` |
| <a id="df-20261029-zcondo-sp02-section-spike"></a>[DF-20261029-zcondo-sp02-section-spike](dev-findings/DF-20261029-zcondo-sp02-section-spike.md) | ZCONDO SP02 section cutaway: `CAM-SECTION-LL` seated stills, standing 60-frame truck, caps, door wall 0.18 | workaround | 2026-10-29 / `main` `80c73c5` + working tree | Seated lead ≥480 px passes; poses pass on a placeholder mannequin; cut-plane magnification moves the corridor-cap sliver and the B07-SH02 TH tail frame clips a foot |
| <a id="df-20261029-zcondo-zc-you-rig"></a>[DF-20261029-zcondo-zc-you-rig](dev-findings/DF-20261029-zcondo-zc-you-rig.md) | ZCONDO rigged `zc-you` (armature, IK, face controls, cel look), IK straight-chain singularity, B09 seated lead 456 px at 3.4 m | workaround | 2026-10-29 / `claude/zcondo-boss-plates` + working tree | B09 camera 3.2 m or other pose; sheet discrepancies for Mark |
| <a id="df-20261029-painted-timeline-dissolve"></a>[DF-20261029-painted-timeline-dissolve](dev-findings/DF-20261029-painted-timeline-dissolve.md) | Painted 2D (p5.brush) in the timeline: one canvas per composition, in-canvas dissolves, ink alpha ignored, sub-level nondeterminism on translucent plates | workaround | 2026-10-29 / branch `claude/shipwreck-boss-painted` (uncommitted) | Use `painted.shots[].dissolveSec` for dissolves, never `transitionIn`; dissolve/drain frames differ by ≤3 levels between renders, full-alpha frames are byte-identical |
| <a id="df-20261029-edge-tts-voice-tuning"></a>[DF-20261029-edge-tts-voice-tuning](dev-findings/DF-20261029-edge-tts-voice-tuning.md) | Edge TTS Thai child / elderly / alternate-adult voices: edge pitch/rate + ffmpeg asetrate/atempo (adults); Praat/WORLD decoupled resynthesis (child/elderly, round 2); no Thai roles, custom SSML blocked | workaround | 2026-10-29 / `f830580` | Use only for short lines or minor characters after the user approves a listened sample; perceptual quality unverified |
| <a id="df-20261030-zcpaint-pose-track-fields"></a>[DF-20261030-zcpaint-pose-track-fields](dev-findings/DF-20261030-zcpaint-pose-track-fields.md) | Painted hands / pose tracks / key fields | workaround | 2026-10-30 / uncommitted pass 5 | Hand pinch shape changes at the mid-rise; look check on the grip |
| <a id="df-20261030-painted-screen-layers-overlay"></a>[DF-20261030-painted-screen-layers-overlay](dev-findings/DF-20261030-painted-screen-layers-overlay.md) | Painted plates / screen layers (Grade, Grain, caption shade) / PaintedStage | workaround | 2026-10-30 / uncommitted pass 5 | Production grain and vignette only on plates that carry them; TL/Editor decision on a shared mount |
| <a id="df-20261030-b08-far-fires-occluded"></a>[DF-20261030-b08-far-fires-occluded](dev-findings/DF-20261030-b08-far-fires-occluded.md) | B08 layers / far fires / occlusion by the near towers | open | 2026-10-30 / uncommitted pass 6 | Film: acceptance item 2 "four sources visible" does not hold for the approved layers; keep two visible or move the far pair (decision) |
| <a id="df-20261030-scenerenderer-default-chrome"></a>[DF-20261030-scenerenderer-default-chrome](dev-findings/DF-20261030-scenerenderer-default-chrome.md) | SceneRenderer chrome / painted scenes / composition default | workaround | 2026-10-30 / uncommitted pass 6 | Editor: pass `chrome` off for ZCPAINT scene renders (the record's rule) |
| <a id="df-20261030-p5brush-large-fill-mottle"></a>[DF-20261030-p5brush-large-fill-mottle](dev-findings/DF-20261030-p5brush-large-fill-mottle.md) | p5.brush fills / flatness / large areas | workaround | 2026-10-30 / uncommitted pass 5 | Backgrounds and sets are wash-flat by rule; textures on large areas cost mottle |

<a id="แบบฟอร์มรายการ"></a>
## Entry template

Add each entry as its own file `docs/dev-findings/DF-YYYYMMDD-short-slug.md` (unique stable ID) and link it in the index above; old `dev-findings.md#df-…` anchors stay on the index rows. Read the index first and open only the entries that apply. Keep detail in the entry file; briefs, scene sheets and sequence indices link to it instead of copying full symptoms.

```markdown
# DF-YYYYMMDD-short-slug — symptom-based title

- Owner: Boss or Editor; first observed: ...; last checked: ...
- Status: open / workaround / fixed / superseded
- Type: implementation-bug / integration-gap / tool-limitation / unknown
- Tags: 2D / 3D / hybrid / camera / contact / lighting / texture / tooling / ...
- Scope: branch + commit; relevant packages/environment; asset/module paths
- Consumers: episode/scene/shot IDs; Film decision/brief revision; scene-handoff revision or N/A

## Symptoms and evidence
- Desired → observed; occurrence conditions and unknowns:
- Reproduce: command, timeline/input props, composition, frames/clock:
- Evidence: code/log/issue/PR/render path; local-only and recipe if applicable:
- Coverage: Studio / final render / seeking; Short / Long; unverified areas:
- Root cause: confirmed with evidence / hypothesis and follow-up method:

## Attempts and results
- Approach → outcome; workaround/fix and remaining unsupported conditions:
- Measured/observed cost, quality and tradeoffs; estimates explicitly labeled:

## Planning impact
- Film: medium/compositing/camera/light/interface effect; fallback/shared capability:
- Mark: selected-deliverable shot/framing/staging/contact/reveal effect; preserved constraints:
- Follow-up: owner + issue/PR; spike/acceptance criteria; brief/scene-sheet/index updates:

## Revalidation history
- Date + branch/commit → method/result/coverage → status; fix PR/merge status:
- Film/Mark adoption: read finding revision/date → decision/shot refs + outcome:
```
