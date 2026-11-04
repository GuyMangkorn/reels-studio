# Context map

> Topic → the files that cover it: docs (by section), source, scripts, skills, composition IDs and tests. Locate here first, then read only the linked section ([CB01](../AGENTS.md#context-budget)). The map points; the rules live in the linked documents. Format and reasons: [decision note](reviews/2026-11-02-context-map-format.md).

**Use:** `grep -n '^## ' docs/context-map.md` lists topics; `sed -n '/^## Poses/,/^## /p' docs/context-map.md` prints one entry.

**Keep it current:** a change that adds, moves or removes a doc, script, source module, skill, test or composition updates the matching entry in the same commit. `python3 -I scripts/context-map.py` (also run by `npm test`) fails on a dead link or anchor and on a new module that no entry mentions. Paths on an unmerged branch go on a `- Pending` line as code spans; turn them into links once they land.

Episode-specific files are under [Episodes](#episodes); shared topics come first.

## Characters and cast

**Read when:** building, changing or choosing a painted character body, head or recurring cast member.

- Docs: [character proportions](character-proportion-principles.md#character-proportion-principles) ([age canon](character-proportion-principles.md#cp-a-age-canon), [landmarks](character-proportion-principles.md#cp-l-landmarks), [stylize](character-proportion-principles.md#cp-y-stylize)); [kit README, recurring cast](../src/painted/kit/README.md); [project defaults](delivery-workflow.md#project-defaults) (4-head cast)
- Code: [kit/cast.ts](../src/painted/kit/cast.ts) (`CastDef`, `drawFigure`), [kit/head.ts](../src/painted/kit/head.ts), [kit/hands.ts](../src/painted/kit/hands.ts); episode casts [worldfog/cast.ts](../src/painted/worldfog/cast.ts), [zcpaint/cast.ts](../src/painted/zcpaint/cast.ts), [zcpaint/body6.ts](../src/painted/zcpaint/body6.ts), [kuchisake/cast.ts](../src/painted/kuchisake/cast.ts)
- Sheets: [spike/CastSheet.tsx](../src/painted/spike/CastSheet.tsx), [spike/ProportionSheet.tsx](../src/painted/spike/ProportionSheet.tsx), [spike/SideSheet.tsx](../src/painted/spike/SideSheet.tsx), [spike/HeadSideSheet.tsx](../src/painted/spike/HeadSideSheet.tsx) (entry [spike/index.ts](../src/painted/spike/index.ts))
- Tests: [zcpaint-body6](../tests/zcpaint-body6.test.ts), [zcpaint-bust](../tests/zcpaint-bust.test.ts), [zcpaint-costume](../tests/zcpaint-costume.test.ts)
- Kit library: [people.ts](../src/painted/kit/people.ts), [hair.ts](../src/painted/kit/hair.ts), [back.ts](../src/painted/kit/back.ts) (back view `view: 'back'`, hood-up `hoodUp`; sheet `KIT-BACK`), [legs.ts](../src/painted/kit/legs.ts), [casting.ts](../src/painted/kit/casting.ts), [people-sheet.tsx](../src/painted/kit/people-sheet.tsx), [cast-cards-sheet.tsx](../src/painted/kit/cast-cards-sheet.tsx), [kit-people](../src/videos/kit-people/) (`KIT-PEOPLE-*`, `KIT-CAST-CARDS`), [people.mjs](../scripts/painted-kit/people.mjs), [people.test.ts](../tests/people.test.ts), [casting.test.ts](../tests/casting.test.ts)
- Animals: [animals.ts](../src/painted/kit/animals.ts) (`ANIMALS`, `drawAnimal`: dogs and cats), [animals-sheet.tsx](../src/painted/kit/animals-sheet.tsx) (`KIT-ANIMALS`, `KIT-ANIMALS-LINEUP`), [animals.test.ts](../tests/animals.test.ts); motions [animal-motions.ts](../src/painted/kit/animal-motions.ts) (`ANIMAL_MOTIONS`, reel data), [kit-animal-motions.tsx](../src/painted/shots/kit-animal-motions.tsx), [kit-animal-motions](../src/videos/kit-animal-motions/) (`KIT-ANIMAL-MOTIONS`)

## Poses

**Read when:** devising or reviewing any character pose or gesture (design from the beat, then cite a matching pose ID, [CP-P12](character-proportion-principles.md#cp-p-pose-sheet)).

- Docs: [pose sheet P01–P45](character-proportion-principles.md#cp-p-pose-sheet), [front-view arm depth](character-proportion-principles.md#cp-p-arm-depth)
- Code: [kit/poses.ts](../src/painted/kit/poses.ts) (`POSES`, `poseArms`), [kit/pose-sheet.json](../src/painted/kit/pose-sheet.json); episode pose tracks [zcpaint/pose.ts](../src/painted/zcpaint/pose.ts); legacy SVG rig [rig/poses.ts](../src/rig/poses.ts)
- Compositions: `KIT-POSES`, `KIT-POSES-CLOSE`, `WFOG-ARMBACK-SAMPLE` ([spike/ArmBackSheet.tsx](../src/painted/spike/ArmBackSheet.tsx))
- Tests: [pose-library](../tests/pose-library.test.ts), [pov-forearm](../tests/pov-forearm.test.ts)
- Kit library: [poses-more.ts](../src/painted/kit/poses-more.ts), [poses-sheet.tsx](../src/painted/kit/poses-sheet.tsx) (`KIT-POSES`), [poses.mjs](../scripts/painted-kit/poses.mjs), [poses-motions.test.ts](../tests/poses-motions.test.ts)

## Expressions and faces

**Read when:** changing a face, brow, eye or mouth state, a blink or lip sync.

- Docs: [face principles](character-proportion-principles.md#cp-f-face); [lip-frame fallback finding](dev-findings/DF-20261030-lip-frame-silent-fallback.md)
- Code: [kit/head.ts](../src/painted/kit/head.ts) (`FaceState`, `Brow`/`Eyes`/`Mouth`, `blinking`), [kuchisake/face.ts](../src/painted/kuchisake/face.ts)
- Sheets: [spike/FaceSheet.tsx](../src/painted/spike/FaceSheet.tsx)
- Kit library: [expressions.ts](../src/painted/kit/expressions.ts), [face-looks-sheet.tsx](../src/painted/kit/face-looks-sheet.tsx) (`KIT-FACE-LOOKS`, `KIT-FACE-CAST`; `HeadStyle.look` in [kit/head.ts](../src/painted/kit/head.ts))

## Wardrobe and props

**Read when:** changing an outfit, a held prop (torch, phone, umbrella) or adding a new prop.

- Docs: [kit README, outfit swap and props](../src/painted/kit/README.md)
- Code: [kit/cast.ts](../src/painted/kit/cast.ts) (`Outfit`, `Prop`, `drawTorch`, `drawUmbrella`); episode props such as [zcpaint/accents.ts](../src/painted/zcpaint/accents.ts); legacy SVG props [assets/Props.tsx](../src/assets/Props.tsx), [assets/props/](../src/assets/props/)
- Tests: [zcpaint-costume](../tests/zcpaint-costume.test.ts)
- Kit library: [wardrobe.ts](../src/painted/kit/wardrobe.ts), [gear.ts](../src/painted/kit/gear.ts), [props.ts](../src/painted/kit/props.ts), [wardrobe.test.ts](../tests/wardrobe.test.ts), [back-view.test.ts](../tests/back-view.test.ts) (back view, hood-up, `tintHoodie` coral)

## Motions

**Read when:** animating a walk, gait, reach, head turn or any body motion over time.

- Docs: [walk bob finding](dev-findings/DF-20261031-painted-walk-bob-authored-hang.md), [profile head turn](dev-findings/DF-20261030-painted-profile-head-turn.md), [pose-track fields](dev-findings/DF-20261030-zcpaint-pose-track-fields.md)
- Code: [kit/space.ts](../src/painted/kit/space.ts) (easing, `pchip`, `hermite`), [zcpaint/figure.ts](../src/painted/zcpaint/figure.ts), [kuchisake/shot-motion.ts](../src/painted/kuchisake/shot-motion.ts), [kuchisake/walker-back.ts](../src/painted/kuchisake/walker-back.ts), legacy rig drivers [rig/drivers.ts](../src/rig/drivers.ts)
- Tests: [zcpaint-gait](../tests/zcpaint-gait.test.ts), [animation](../tests/animation.test.ts)
- Kit library: [motions.ts](../src/painted/kit/motions.ts), [motion-reel.ts](../src/painted/kit/motion-reel.ts), [kit-motions.tsx](../src/painted/shots/kit-motions.tsx), [kit-motions](../src/videos/kit-motions/) (`KIT-MOTIONS`), [poses-motions.test.ts](../tests/poses-motions.test.ts)

## Shot templates and camera

**Read when:** choosing framing, camera move or projection for a shot.

- Docs: [cinematography](cinematography-principles.md), [storyboard principles](storyboard-principles.md), [scale and perspective](scale-and-perspective-principles.md), [lead size and shot movement rules](boss-asset-workflow.md#latest-production-rules)
- Code: [kit/camera.tsx](../src/painted/kit/camera.tsx) (`Camera`, `pushCamera`), [kit/space.ts](../src/painted/kit/space.ts) (`Proj`, `cardProjector`), [scenes/projection.ts](../src/scenes/projection.ts), [scenes/quadText.ts](../src/scenes/quadText.ts)
- Scripts: [shot-projection.py](../scripts/shot-projection.py) (lead height, caption-band overlap)
- Tests: [projection](../tests/projection.test.ts), [zcpaint-proj](../tests/zcpaint-proj.test.ts)
- Kit library: [shot-templates.ts](../src/painted/kit/shot-templates.ts), [template-reel.ts](../src/painted/kit/template-reel.ts), [kit-templates.tsx](../src/painted/shots/kit-templates.tsx), [kit.tsx](../src/painted/shots/kit.tsx), [kit-shot-templates](../src/videos/kit-shot-templates/) (`KIT-SHOT-TEMPLATES`), [shot-templates.test.ts](../tests/shot-templates.test.ts)

## Rigs

**Read when:** touching how a figure is built from parts (painted brush rig or the retired SVG cut-out rig).

- Painted brush rig (current): [kit/cast.ts](../src/painted/kit/cast.ts) `drawFigure`, [kit/hands.ts](../src/painted/kit/hands.ts), [painted-2d skill](../.claude/skills/painted-2d/SKILL.md); [arm depth finding](dev-findings/DF-20261030-painted-arm-depth.md)
- SVG cut-out rig (retired for new work): [src/rig/](../src/rig/index.ts), [character-toolkit](character-toolkit.md); legacy SVG scene assets [src/assets/](../src/assets/visuals/VisualStage.tsx)
- Blender `char_base` (deactivated): [assets/blender/](../assets/blender/char_base/build.py), [blender-mcp-workflow](blender-mcp-workflow.md)

## Painted 2D engine

**Read when:** any p5.brush shot, plate, kit module or painted review.

- Skill: [painted-2d](../.claude/skills/painted-2d/SKILL.md) (BrushCanvas contract, seeding, review loop)
- Core: [BrushCanvas.tsx](../src/painted/BrushCanvas.tsx), [PaintedStage.tsx](../src/painted/PaintedStage.tsx), [shot.ts](../src/painted/shot.ts) (`PaintedShot`), [plate.ts](../src/painted/plate.ts), [registry.ts](../src/painted/registry.ts) (shot IDs), [Label.tsx](../src/painted/Label.tsx), [p5-brush.d.ts](../src/painted/p5-brush.d.ts), timeline bridge [scenes/painted.ts](../src/scenes/painted.ts)
- Kit: [kit README](../src/painted/kit/README.md), [painter.ts](../src/painted/kit/painter.ts), [draw.ts](../src/painted/kit/draw.ts), [glow.tsx](../src/painted/kit/glow.tsx), [screen.tsx](../src/painted/kit/screen.tsx), [hash.ts](../src/painted/kit/hash.ts), [catalog.tsx](../src/painted/kit/catalog.tsx) (`KIT-CATALOG`); environment layers [sky.ts](../src/painted/kit/sky.ts), [fall.ts](../src/painted/kit/fall.ts), [fog.ts](../src/painted/kit/fog.ts), [kit/sea.ts](../src/painted/kit/sea.ts), sheet [env-sheet.tsx](../src/painted/kit/env-sheet.tsx) (`KIT-ENV`), plate gallery [plates.ts](../src/painted/kit/plates.ts) (`PLATES`), [plates-sheet.tsx](../src/painted/kit/plates-sheet.tsx) (`KIT-PLATES`), [plates-index.tsx](../src/painted/plates-index.tsx) (clean-plate stills), design [environment-kit spec](superpowers/specs/2026-11-03-environment-kit-design.md)
- Shots per episode: [src/painted/shots/](../src/painted/shots/worldfog.tsx); look spikes and sheets (standalone entry, not in Root): [spike/index.ts](../src/painted/spike/index.ts)
- Scripts: [painted-kit/](../scripts/painted-kit/build-notes.md) ([catalog.mjs](../scripts/painted-kit/catalog.mjs), [regress.mjs](../scripts/painted-kit/regress.mjs), [compare.py](../scripts/painted-kit/compare.py), [plates.ts](../scripts/painted-kit/plates.ts)), [paint-bench.mjs](../scripts/paint-bench.mjs), [paint-bench-compare.mjs](../scripts/paint-bench-compare.mjs)
- Findings: [dev-findings index](dev-findings.md) (entries `DF-*-painted-*`, `DF-*-p5brush-*`)
- Tests: [painted](../tests/painted.test.ts), [environment-kit](../tests/environment-kit.test.ts), [plates](../tests/plates.test.ts)

## Render, stills and scene cache

**Read when:** rendering anything, taking QA stills, pinning approved shots or re-editing.

- Rules: [render by scene / review renders / stills on one Chrome](../AGENTS.md#shared-agent-conventions); [painted shot-by-shot review](sequence-workflow.md#painted-shot-by-shot); [README render and verify](../README.md#render-and-verify), [permanent render folder](../README.md#permanent-render-folder)
- Scripts: [render.mjs](../scripts/render.mjs), [render-options.mjs](../scripts/render-options.mjs), [render-inputs.ts](../scripts/render-inputs.ts), [segments.mjs](../scripts/segments.mjs), [pin.mjs](../scripts/pin.mjs), [stills.mjs](../scripts/stills.mjs), [qa-sheet.sh](../scripts/qa-sheet.sh), [reference-frames.py](../scripts/reference-frames.py)
- Findings: [render speed](dev-findings/DF-20261031-render-speed.md), [segment cache key](dev-findings/DF-20261101-segment-cache-key.md); design [project render cache](reviews/2026-11-01-project-render-cache.md)
- Tests: [segments](../tests/segments.test.ts), [render-options](../tests/render-options.test.ts), [render-inputs](../tests/render-inputs.test.ts)
- ANGLE defaults and timing logs: [logger](../scripts/render-log.mjs), [logger types](../scripts/render-log.d.mts), [log tests](../tests/render-log.test.ts), [measurements and usage](reviews/2026-11-03-angle-render-logging.md). Both render entrypoints write incremental `out/logs/render-*.jsonl` stage, cache and result records; explicit `--gl` overrides the ANGLE default.

## Asset store and media

**Read when:** filing, fetching or locking media; a fresh checkout; user-supplied files.

- Docs: [asset store](../README.md#asset-store), [re-editing](../README.md#re-editing), [proposal](reviews/2026-10-31-asset-store-proposal.md)
- Scripts: [store.py](../scripts/store.py), [episode-media.ts](../scripts/episode-media.ts), [setup.sh](../scripts/setup.sh); kit browse page `$REELS_STORE/index.html` (cast cards, people, poses, motions) built by [painted-kit/store-page.py](../scripts/painted-kit/store-page.py) from [store-page.html](../scripts/painted-kit/store-page.html) and [kit-data.ts](../scripts/painted-kit/kit-data.ts)
- Data: per-video locks `src/videos/<episode>/assets.lock.json` (e.g. [world-fog](../src/videos/world-fog/assets.lock.json)); cached media under [public/](../public/fonts/)
- Tests: [store](../tests/store.test.ts), [media](../tests/media.test.ts)

## Sound

**Read when:** music, ambience, SFX, loudness or the shared sound library.

- Docs: [sound-generation-workflow](sound-generation-workflow.md) ([role duties](sound-generation-workflow.md#role-responsibilities), [library index](sound-generation-workflow.md#library-index)); [audio emphasis EP08a](editor-principles.md#ep08a-shape-audio-emphasis-by-story-beat)
- Skill: [sound-generation](../.agents/skills/sound-generation/SKILL.md) ([library.md](../.agents/skills/sound-generation/library.md))
- Scripts: [sound-library.py](../scripts/sound-library.py), [loudness.mjs](../scripts/loudness.mjs)
- Tests: [loudness](../tests/loudness.test.ts)

## TTS and voice

**Read when:** narration, character voices, emotion lines, the voice lock or transcription.

- Docs: [voice lock](delivery-workflow.md#voice-lock); [Edge TTS tuning finding](dev-findings/DF-20261029-edge-tts-voice-tuning.md)
- Skills: [voice-tuning](../.agents/skills/voice-tuning/SKILL.md) (Edge TTS registers), [gemini-tts](../.agents/skills/gemini-tts/SKILL.md) ([reference](../.agents/skills/gemini-tts/reference.md))
- Scripts: [narration.py](../scripts/narration.py), [narration_files.py](../scripts/narration_files.py), [narration/](../scripts/narration/align-full.py) (split one read into beats), [voice-preset.py](../scripts/voice-preset.py), [gemini-tts.py](../scripts/gemini-tts.py), [transcribe.py](../scripts/transcribe.py)
- Output: `public/narration/<CompositionId>.mp3` + `.amplitude.json`

## Captions and on-screen text

**Read when:** subtitles, Thai line breaks, the caption-safe zone or text layout.

- Docs: [Thai subtitles and narration](production-requirements.md#thai-subtitles-narration-and-channel-label), [vertical caption safe zone](production-requirements.md#vertical-caption-safe-zone), [EP08 captions lead the mix](editor-principles.md#ep08--make-thai-captions-and-voice-lead-the-mix), [remotion captions](remotion-toolkit.md#7-timed-subtitles-and-export-captions), [research: vertical safe areas](research/vertical-safe-areas.md) (platform top/bottom overlays, channel-mark placement, proposed box change)
- Code: [scenes/Subtitles.tsx](../src/scenes/Subtitles.tsx), [kit/screen.tsx](../src/painted/kit/screen.tsx) (`CaptionShade`), [assets/visuals/textLayout.ts](../src/assets/visuals/textLayout.ts)
- Scripts: [caption-breaks.mjs](../scripts/caption-breaks.mjs), [caption-zone.py](../scripts/caption-zone.py)
- Tests: [textLayout](../tests/textLayout.test.ts)

## Timeline and runtime

**Read when:** registering a video, editing timeline JSON, adding a timeline field or claiming a runtime capability.

- Docs: [runtime-contract](runtime-contract.md), [README timeline data](../README.md#timeline-data), [videos and parallel work](../README.md#videos-and-parallel-work), [remotion-toolkit](remotion-toolkit.md); [scene cue assembly](reviews/2026-11-01-scene-cue-assembly.md)
- Code: [Root.tsx](../src/Root.tsx), [index.ts](../src/index.ts), [videos/registry.ts](../src/videos/registry.ts), [videos/types.ts](../src/videos/types.ts), [scenes/timeline.ts](../src/scenes/timeline.ts), [scenes/types.ts](../src/scenes/types.ts), [scenes/assemble.ts](../src/scenes/assemble.ts), [scenes/SceneRenderer.tsx](../src/scenes/SceneRenderer.tsx), [scenes/MediaLayers.tsx](../src/scenes/MediaLayers.tsx), [scenes/media.ts](../src/scenes/media.ts), [scenes/endings.ts](../src/scenes/endings.ts)
- Tests: [scene-assembly](../tests/scene-assembly.test.ts), [videos](../tests/videos.test.ts), [media](../tests/media.test.ts)

## Scene sheets and storyboard

**Read when:** writing or reviewing a scene sheet, publishing the user storyboard review page, shot-by-shot approval.

- Docs: [mark-storyboard-workflow](mark-storyboard-workflow.md) ([scene-sheet contract](mark-storyboard-workflow.md#scene-sheet-contract), [user review page](mark-storyboard-workflow.md#user-storyboard-review-page)), [storyboard-principles](storyboard-principles.md), [sequence-workflow](sequence-workflow.md); [shot-by-shot proposal](reviews/2026-11-01-shot-by-shot-workflow-proposal.md)
- Scripts: [storyboard-page/build.py](../scripts/storyboard-page/build.py), [storyboard-page/clips.mjs](../scripts/storyboard-page/clips.mjs), [template.html](../scripts/storyboard-page/template.html), [example.json](../scripts/storyboard-page/example.json), [shot-projection.py](../scripts/shot-projection.py)
- Per episode: `scripts/<episode>/short/` scene sheets and `review-rows.json`
- Tests: [storyboard-page](../tests/storyboard-page.test.ts)

## Script, research and fact-check

**Read when:** ideation concepts, Boat research, Preaw script, fact-check.

- Docs: [editorial-workflow](editorial-workflow.md), [scriptwriting-principles](scriptwriting-principles.md)
- Per episode: `scripts/<episode>/research.md`, `topic-brief.md`, script files under `short/` or `long/`

## Visual brief, look and findings

**Read when:** Film's medium/look decision, a new shared asset, a renderer capability, or recording a blocker.

- Docs: [film-visual-brief-workflow](film-visual-brief-workflow.md), [boss-asset-workflow](boss-asset-workflow.md) ([QA before push](boss-asset-workflow.md#visual-and-runtime-qa-before-push), [preview labels](boss-asset-workflow.md#preview-labels)), [asset-engineering-principles](asset-engineering-principles.md), [planned-visual-components](planned-visual-components.md), [dev-findings index](dev-findings.md) and [entries](dev-findings/DF-20261031-render-speed.md), [animation studio research](research/animation-studio-pipeline.md); [user-taste](user-taste.md) (read with the [viewer check](sequence-workflow.md#viewer-check) and [look thumbnails](sequence-workflow.md#look-thumbnails))

## Covers and thumbnails

**Read when:** making or reviewing a cover image (Short/Reel cover, long-video thumbnail).

- Docs: [cover-principles](cover-principles.md) (CV01–CV10, [platforms](cover-principles.md#cv-p-platforms)).
- Source: [cover-overlay.tsx](../src/videos/cover-overlay.tsx) (`coversVideo`, `CoverOverlay` = overlay `covers` in [overlays.ts](../src/videos/overlays.ts)); cover data [covers/index.ts](../src/videos/covers/index.ts), [covers/wendigo.ts](../src/videos/covers/wendigo.ts), [covers/everyone-gone.ts](../src/videos/covers/everyone-gone.ts) (`WDG-EP01-SHORT-COVERS`, `EG-EP01-SHORT-COVERS`).
- Scripts: [render.mjs](../scripts/render.mjs) renders `<ID>-COVERS` into `out/<ID>/covers/` with each delivery render; `--covers` for stills only.

## Delivery workflow

**Read when:** selecting deliverables, style profile, tier, delivery record, agent invocation, or finishing a PR.

- Docs: [delivery-workflow](delivery-workflow.md) ([style profile](delivery-workflow.md#style-profile), [visual engine](delivery-workflow.md#visual-engine), [pipeline](delivery-workflow.md#pipeline-tiers), [task file](delivery-workflow.md#task-file), [agent invocation](delivery-workflow.md#agent-invocation), [delivery record](delivery-workflow.md#delivery-record-and-handoff-checks)), [production-requirements](production-requirements.md), [editor-workflow](editor-workflow.md), [editor-principles](editor-principles.md), [contributing](contributing.md); original design [spec](superpowers/specs/2026-10-27-video-delivery-workflow-design.md) and [plan](superpowers/plans/2026-10-27-video-delivery-workflow.md)
- Per episode: `scripts/<episode>/delivery.md`, `build-notes.md`

## Agents, roles and tooling

**Read when:** changing a role config, agent instructions, hooks, usage measurement or Codex offload.

- Docs: [AGENTS.md](../AGENTS.md), [CLAUDE.md](../CLAUDE.md), [GLOSSARY.md](../GLOSSARY.md), [README](../README.md), [scripts/README.md](../scripts/README.md), [workflow audits](reviews/2026-10-27-catbox-workflow-audit.md), [handoff migration](reviews/2026-10-27-written-handoff-migration.md)
- Configs: [.claude/agents/](../.claude/agents/film.md), [.codex/agents/](../.codex/agents/film.toml), [.claude/settings.json](../.claude/settings.json), [package.json](../package.json)
- Skills: [codex](../.agents/skills/codex/SKILL.md) (Claude copy [.claude/skills/codex](../.claude/skills/codex/SKILL.md); [codex-run.sh](../scripts/codex-run.sh))
- This map: [context-map.md](context-map.md)
- Scripts: [usage-report.py](../scripts/usage-report.py), [hooks/agent-run-log.py](../scripts/hooks/agent-run-log.py), [git-hooks/post-checkout](../scripts/git-hooks/post-checkout), [check-links.py](../scripts/check-links.py), [context-map.py](../scripts/context-map.py)
- Tests: [agents](../tests/agents.test.ts) (role config parity), [context-map](../tests/context-map.test.ts)

## Episodes

**Read when:** working on one episode. Script folder holds research, script, delivery record, scene sheets and build notes; `src/videos/<episode>/index.ts` registers its compositions.

| Episode | Scripts | Videos (composition IDs) | Painted source | Tests |
| --- | --- | --- | --- | --- |
| Cat boxes (SVG, legacy) | [cat-boxes/](../scripts/cat-boxes/delivery.md), [storyboards/](../storyboards/cat-boxes/blockout.md) | [cat-boxes](../src/videos/cat-boxes/index.ts) | — ([assets/](../src/assets/backgrounds/CatboxRoom.tsx)) | [catbox-shorts](../tests/catbox-shorts.test.ts), [catbox-long-baseline](../tests/catbox-long-baseline.test.ts) |
| Educational series (hypnic jerk EP01) | [edu-series/](../scripts/edu-series/delivery.md) (concepts bank C1–C6, research, script, brief, storyboard rows) | `EDU-EP01-SHORT` (W2 storyboard; no composition yet) | none yet | none |
| Everyone gone | [everyone-gone/](../scripts/everyone-gone/delivery.md) | `EG-EP01-SHORT` ([episode](../src/videos/everyone-gone/index.ts), Draft W5.3; registry adapter [shots/everyone-gone](../src/painted/shots/everyone-gone.tsx) plate IDs `EG-<shot id>`) · look stills: standalone [look-index](../src/painted/everyone-gone/look-index.ts) `EG-LF01`..`EG-LF05`, `EG-LF05-START`, `EG-LF05-GLASS`; shot plates: [plate-index](../src/painted/everyone-gone/plate-index.ts)) | [everyone-gone/](../src/painted/everyone-gone/set.ts) ([space](../src/painted/everyone-gone/space.ts), [fpov](../src/painted/everyone-gone/fpov.ts), [figure-back](../src/painted/everyone-gone/figure-back.ts), [stall](../src/painted/everyone-gone/stall.ts), [SensorCard](../src/painted/everyone-gone/SensorCard.tsx), [look](../src/painted/everyone-gone/look.tsx), [shots](../src/painted/everyone-gone/shots.tsx) (17 shot plates, `ShotPlate`, `doorOpen` in space), [viaduct](../src/painted/everyone-gone/viaduct.ts), [plate-index](../src/painted/everyone-gone/plate-index.ts) `EG-PL-<shot id>`); EP02 look frames: [ep02/places](../src/painted/everyone-gone/ep02/places.ts) (`คุณ` = kit back view, `tintHoodie`), [ep02/look](../src/painted/everyone-gone/ep02/look.tsx), standalone [ep02/look-index](../src/painted/everyone-gone/ep02/look-index.ts) `EG2-LF01`..`EG2-LF05`, EP02 timed scene sheets [ep02/index](../scripts/everyone-gone/ep02/index.md) + sc01–sc05 (`EG2-SC-R2.0`, voice T-v3, 19 shots, 1928 f; rows `ep02/review-rows.json` SS-R2.0), [ep02/collide](../src/painted/everyone-gone/ep02/collide.ts) (crowd collision and occlusion order, VD13); EP02 W5.2 shot sets (SS-R2.1, 19 shots, 1939 f): [ep02/shots](../src/painted/everyone-gone/ep02/shots.tsx) (`plateOf(id, f)`, `ShotPlate`), [ep02/assets-index](../src/painted/everyone-gone/ep02/assets-index.ts) `EG2-<shot id>`, [ep02/sheet](../src/painted/everyone-gone/ep02/sheet.ts) (`sheetFlip`, `hoodPull`, shot list), [ep02/walk](../src/painted/everyone-gone/ep02/walk.ts) (animated crowd engine, per-frame `crowdViolations`), [ep02/crowds](../src/painted/everyone-gone/ep02/crowds.ts) (Yaowarat), [ep02/monument](../src/painted/everyone-gone/ep02/monument.ts), [ep02/soi-wide](../src/painted/everyone-gone/ep02/soi-wide.ts)) | [eg2-crowd-collision.test.ts](../tests/eg2-crowd-collision.test.ts), [eg2-crowd-paths.test.ts](../tests/eg2-crowd-paths.test.ts) |
| Hanako | [hanako/](../scripts/hanako/) | [hanako](../src/videos/hanako/index.ts) `HANAKO-SHORT` | [hanako/](../src/painted/hanako/look.tsx), [shots/hanako.tsx](../src/painted/shots/hanako.tsx) | [hanako-plates](../tests/hanako-plates.test.ts) |
| Kuchisake-onna | [kuchisake-onna/](../scripts/kuchisake-onna/delivery.md) | [kuchisake-onna](../src/videos/kuchisake-onna/index.ts) `KSO-EP01-SHORT-B`, `-C` | [kuchisake/](../src/painted/kuchisake/cast.ts), [shots/kuchisake.tsx](../src/painted/shots/kuchisake.tsx) | [kuchisake-shots](../tests/kuchisake-shots.test.ts), [kuchisake-timeline](../tests/kuchisake-timeline.test.ts) |
| Alvarenga 438 days | [alvarenga/](../scripts/alvarenga/delivery.md) | [alvarenga](../src/videos/alvarenga/index.ts) `ALV-LOOK` (look frames) | [alvarenga/](../src/painted/alvarenga/cast.ts) ([set](../src/painted/alvarenga/set.ts), [palette](../src/painted/alvarenga/palette.ts)), [shots/alvarenga.tsx](../src/painted/shots/alvarenga.tsx) | — |
| Lake Nyos | [lake-nyos/](../scripts/lake-nyos/delivery.md) | — | [nyos/](../src/painted/nyos/index.ts) | — |
| Onoda 29 years | [onoda/](../scripts/onoda/delivery.md) | — | — | — |
| Among us (1 in 5) | [among-us/](../scripts/among-us/delivery.md) | — | — | — |
| Oldest shipwreck | [oldest-shipwreck/](../scripts/oldest-shipwreck/) | [oldest-shipwreck](../src/videos/oldest-shipwreck/index.ts) `SHIPWRECK-SHORT` | [ship.ts](../src/painted/ship.ts), [sea.ts](../src/painted/sea.ts), [diver.ts](../src/painted/diver.ts), [jar.ts](../src/painted/jar.ts), [shots/shipwreck.tsx](../src/painted/shots/shipwreck.tsx) | [oldest-shipwreck](../tests/oldest-shipwreck.test.ts) |
| Pool depth | [pool-depth/](../scripts/pool-depth/) | [pool-depth](../src/videos/pool-depth/index.ts) `POOLDEPTH-SHORT`, `-BOTNOI` | — | [pool-depth](../tests/pool-depth.test.ts) |
| The Bloop | [the-bloop/](../scripts/the-bloop/) | [the-bloop](../src/videos/the-bloop/index.ts) `BLOOP-EP01-SHORT` | [bloop/](../src/painted/bloop/map.tsx), [shots/bloop.tsx](../src/painted/shots/bloop.tsx) | [bloop](../tests/bloop.test.ts) |
| Wendigo | [wendigo/](../scripts/wendigo/delivery.md) | [wendigo](../src/videos/wendigo/index.ts) `WDG-LOOKS` (eight look-frame scenes), `WDG-ERA-KEYS` (era key stills ERA-K1..K3), `WDG-PROOF` (the 20 timed shots at their frames; a library proof, not the episode), `WDG-EP01-SHORT` (the episode: [scenes and captions](../src/videos/wendigo/episode.ts), [SVG chrome](../src/videos/wendigo/chrome.tsx) registered by name in [overlays.ts](../src/videos/overlays.ts)) | [wendigo/](../src/painted/wendigo/look.ts) look plates, [timed shot table and clocks](../src/painted/wendigo/timed.ts), [timed paint: night tent, tin, sleeper, boot print, lips, lantern prop](../src/painted/wendigo/props.ts), [man cast: parka override, faces, talk envelope](../src/painted/wendigo/cast.ts), [night walk and tent-wall sets](../src/painted/wendigo/night.ts), [North America land rings, Natural Earth 110m](../src/painted/wendigo/land.json) baked by [bake-land.py](../scripts/wendigo/bake-land.py), sound build [build-audio.mjs](../scripts/wendigo/build-audio.mjs) with [audio-lib.mjs](../scripts/wendigo/audio-lib.mjs) and checks [verify-audio.mjs](../scripts/wendigo/verify-audio.mjs), [edit plan](../scripts/wendigo/short/edit-plan.md), [shots/wendigo.tsx](../src/painted/shots/wendigo.tsx) (look and timed plates `WDG-<shot>`) | [wendigo-man.test.ts](../tests/wendigo-man.test.ts), [wendigo-episode.test.ts](../tests/wendigo-episode.test.ts) |
| World Fog | [world-fog/](../scripts/world-fog/delivery.md) | [world-fog](../src/videos/world-fog/index.ts) `WFOG-EP01-SHORT` | [worldfog/](../src/painted/worldfog/cast.ts), [shots/worldfog.tsx](../src/painted/shots/worldfog.tsx) | [world-fog](../tests/world-fog.test.ts) |
| Wow signal | [wow-signal/](../scripts/wow-signal/delivery.md) | — | — | — |
| Zombie condo (3D, retired) | [zombie-condo/](../scripts/zombie-condo/delivery.md) | — | — | — |
| Zombie 7-Eleven | [zombie-7eleven/](../scripts/zombie-7eleven/delivery.md), [film-brief](../scripts/zombie-7eleven/short/film-brief.md) | — | — | — |
| Zombie condo painted | [zombie-condo-paint/](../scripts/zombie-condo-paint/) | [zombie-condo-paint](../src/videos/zombie-condo-paint/index.ts) `ZCPAINT-SHORT-TH`, `-EN` | [zcpaint/](../src/painted/zcpaint/cast.ts), [shots/zcpaint.tsx](../src/painted/shots/zcpaint.tsx) | [zcpaint](../tests/zcpaint.test.ts), [zombie-condo-paint](../tests/zombie-condo-paint.test.ts) |

Painted plate and sheet IDs (`S02-SH01`, `KSO-LF01`, `ZCPAINT-R26-A`, …) are listed by the episode's `src/painted/shots/<episode>.tsx` and [spike/index.ts](../src/painted/spike/index.ts).

## Not mapped on purpose

Covered here so the coverage check stays quiet; add a real entry when one becomes a topic.

- `src/amplitude.json` (no importer found on 2 Nov 2026), `scripts/demo.json`, `scripts/render-options.d.mts`, `scripts/segments.d.mts`, `src/videos/webpack-context.d.ts`, `eslint.config.mjs`, `tsconfig.json`, `package-lock.json`
- Episode-only tooling inside `scripts/<episode>/` (each episode's `build-notes.md` lists it)
