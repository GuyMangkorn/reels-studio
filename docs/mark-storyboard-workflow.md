<a id="mark-scene-sized-storyboards"></a>
<a id="decision-ownership-and-2d--3d-choices"></a>
<a id="visual-purpose-and-repetition-review"></a>
<a id="scale-and-perspective-on-boards"></a>
<a id="lighting-shadow-and-color-on-boards"></a>
<a id="steps"></a>
<a id="e01-c01-s02--scene-title"></a>
<a id="scene-purpose"></a>
<a id="continuity"></a>
<a id="assets-and-capabilities"></a>
<a id="film-approach-and-marks-added-details"></a>
<a id="art-direction"></a>
<a id="sh01--shot-purpose"></a>
<a id="acceptance-criteria"></a>
<a id="developer-handoff"></a>
<a id="reference-principles"></a>
<a id="มาร์ค-mark-storyboard-รายฉาก"></a>
<a id="หน่วยงานและขอบเขต"></a>
<a id="อำนาจตัดสินใจและการเลือก-2d--3d"></a>
<a id="หน้าที่ภาพและการตรวจความซ้ำ"></a>
<a id="สัดส่วนและ-perspective-ในบอร์ด"></a>
<a id="แสง-เงา-และสีเป็นส่วนหนึ่งของบอร์ด"></a>
<a id="ขั้นตอน"></a>
<a id="ไฟล์ส่งมอบ"></a>
<a id="เกณฑ์ภาพและการตรวจ-render"></a>
<a id="หลักการอ้างอิง"></a>
# Mark: written scene handoffs

**Requirement, updated 27 October 2026:** Mark delivers agent-to-agent scene sheets and a sequence index. These documents replace drawn storyboards and Excalidraw files. The filename and old heading anchors remain for link compatibility; `storyboards/` now holds written production plans. Existing shot and former panel IDs remain stable references to timed states, without a drawing requirement.

Mark runs in the [Full tier](delivery-workflow.md#pipeline-tiers); Light and Edit-only deliverables skip scene sheets (Film's timed shot list or Editor's edit plan replaces them). Numeric staging detail scales with the shot: world-space/3D/contact/reveal shots need the full numeric contract; a footage cut or full-screen card needs source, in/out, timing and framing only. Mark receives the selected deliverable's script, matching Boat review and Film visual/technical brief. Film owns the approach, Mark owns detailed shot direction, Boss owns shared assets/capabilities, and [Editor](editor-workflow.md) owns scene integration and editing. Follow [delivery selection](delivery-workflow.md), [sequence continuity](sequence-workflow.md), [production requirements](production-requirements.md) and [scale/projection](scale-and-perspective-principles.md). A missing brief goes to Film through the coordinator; an explicitly requested draft handoff labels provisional choices and factual gaps.

## Units and scope

| Unit | Meaning | Stable ID example |
| --- | --- | --- |
| Episode / deliverable | Story and selected editorial version | `E01-LONG` |
| Chapter | Segment within Long; a Short adaptation needs its own selected deliverable | `E01-LONG-C01` |
| Story scene | Purposeful continuous event in time/place; detailed handoff and sample unit | `E01-LONG-C01-S02` |
| Shot | Continuous camera view before a cut | `E01-LONG-C01-S02-SH03` |
| Key state | Timed before/action/after state within a shot; retained legacy `Pxx` IDs are valid | `E01-LONG-C01-S02-SH03-P02` |

A story scene may map to several runtime `Scene` entries. Record that mapping rather than equating story scenes with JSON array entries. Write a separate scene-sheet set/index per selected editorial version, preserving its own script, timing, claims and neighbors. Scope remains the assigned episode/chapter/scene and its needed boundaries.

## Ownership and readiness

- **Film:** defines medium/composition strategy, physical-size baseline, named coordinate spaces, origin/axes/units, projection and camera approach. Return missing conventions to Film; a bare XYZ tuple is ambiguous without them.
- **Mark:** specifies shot composition, actor/prop placement, facing/gaze, contact, paths, camera start/key/end states, light/color changes and exact event frames within Film's baseline. Routine crop/staging/timing refinements belong here. Material approach, interface or reveal changes synchronize brief/handoff revisions with their owners.
- **Boss:** implements and verifies shared art/geometry, logical bounds/pivots/anchors, coordinate conversion, camera/effect/transition capabilities and runtime contracts. A named asset/API is a requirement until source and integration are inspected.
- **Editor:** turns the matching scene sheets into a deterministic timeline, assembles blockout before polish, integrates supported library elements, performs runtime QA and sends scene samples under [Editor workflow](editor-workflow.md).

`ready-for-dev` means the written scope, shot direction, timing confidence, dependencies, entry/exit and observable acceptance criteria are complete. It permits implementation/blockout; it does not record user approval, audio sync or runtime/visual validation. Planning adds no blanket approval gate.

<a id="pre-handoff-checks"></a>
**Requirement — checks before `ready-for-dev`.** Mark runs these on the written numbers, before Boss or Editor builds anything:

- **Projection:** for every world-space shot, run `python3 -I scripts/shot-projection.py` with the shot's camera and the anchors of the lead and key props (feet and head, or bounds), at Film's physical-size baseline rather than stand-in proportions. Record the lead's height in px, its screen side and any overlap with the caption band in the shot block. Fix a result that contradicts the shot's intent (wrong side, lead below the [lead-size rule](boss-asset-workflow.md#latest-production-rules), face or reveal in the caption band) before handoff.
- **Props and hands:** list each carried or moved prop's state (held in which hand, placed where) at every shot's entry and exit, and confirm each action is possible with that state (a hand holding a bag cannot also drag a cabinet).

## Authoring steps

1. **Read matching inputs:** AGENTS.md, delivery record, script/review, Film brief, sequence index, neighbors and relevant [dev findings](dev-findings.md). Record paths/revisions, beat/clue/claim/decision IDs and unresolved factual/projection questions. Complete when scope and constraints are explicit.
2. **Plan visual progression:** map each beat to visible action, audience information/emotion before → after and reason for the shot or intentional return. Compare consecutive/recurring actions across the assigned scope; revise repetition without progression or return treatment changes to Film. Complete when every beat has a justified visual purpose beyond crop/text swaps.
3. **Inspect assets and contracts:** check target checkout, registries, types, validation, shared owner and renderer. Record `existing-integrated`, `exists-unintegrated`, `missing` or `unknown` with path/commit/limitations. Group missing work for Boss with consumers, dependencies, qualitative difficulty, story-preserving fallback and proof criteria. Complete when every required element has a supported selection or explicit gap.
4. **Write shot direction:** fill the scene-sheet contract below. Separate actor motion, spatial camera motion and picture-stage transforms. Use named anchors and coordinates for placement/contact; specify depth/layers and hidden/revealed information. Complete when Editor can stage the shot without inventing direction, distance, contact or camera ownership.
5. **Place timing/audio:** use integer frames at project fps and half-open ranges `[startFrame, endFrameExclusive)`. Name shot-local, scene-local and composition-global clocks/offsets. State sound onset, action, reveal and hold, full Thai VO/dialogue or an exact accessible source range, and subtitle text/display ranges. Complete when shot durations cover the scene and sound/image order is consistent; label estimates honestly. Integer event frames come from the measured read of the [voice lock](delivery-workflow.md#voice-lock); before it, write staging with VO-relative timing ("on the word X") labelled `estimated`. Boss builds plates only from the timed sheet.
6. **Prepare blockout handoff:** index every assigned scene, critical frames, representative physical dimensions/anchors, shared dependencies, entry/exit states and selected-output acceptance criteria before detail polish. Editor assembles it; Film/Mark review action, framing, scale, timing, information delivery and cuts before polish. Record placeholders/unverified motion and follow-ups rather than inferring a storytelling pass from full duration.
7. **Show available elements:** use the capture guidance below when it clarifies the handoff. Complete when supplied captures have provenance or unavailable/missing elements are stated; an image is not a prerequisite for drafting the document.
8. **Deliver and review:** link the written pack, revisions, readiness and open items. Compare previous exit → entry and exit → next entry. Review Editor's actual frames/playback against the named handoff; record expected → observed → owning asset/camera/timeline. Preserve story, facts, timing, reveals and stable IDs; document agreed revisions rather than rewriting the handoff to fit a defect.

## Scene-sheet contract

**Requirement:** a scene sheet is read by agents who act on it, so it states each fact once, in the place Editor looks for it. The tables and fields are authoring instructions, not supported runtime JSON fields; numeric staging may be an explicit design estimate. For a fixed 2D shot, write `depth: fixed plane; layer order: ...`; XYZ depth is required only when meaningful to the chosen representation.

- **One home per fact.** Shot data (range, staging, camera, VO, subtitles, entry/exit, acceptance) lives only in that shot's block; the shot map holds IDs, ranges and claims. Do not restate a shot's values in another section.
- **Link, then state the difference.** Baseline, projection, palette, lighting method and fallback that Film's brief or the sequence index already own are linked, not copied; the sheet adds only values a shot needs or a deviation with its reason. Where a number must be repeated for Editor's convenience, mark the copy `(brief: <decision ID>)` so the owner wins on conflict.
- **Status once.** The header carries the sheet's status and the evidence line. Mark an individual value only when it differs (`verified`, `measured`); do not repeat "design-only / unrendered / unverified" through the body.
- **Current values only.** Superseded values, review narrative and migration notes go to the change log at the end, never into the shot blocks.
- **Language.** Headings, field names and notes are English; Thai VO, subtitles and on-screen text stay Thai and verbatim.
- **Omit what does not apply** (a fixed-plane shot has no XYZ depth; a shot with no cut has no transition field). Roles skipped by the tier are recorded in the delivery record, not here.
- **Default size:** about 600–800 words per shot plus one shared section; a longer sheet needs a reason (for example a shot with several numeric paths). Split a scene whose sheet outgrows this.

The header's `Status` and `Evidence` lines must agree with the delivery record's [Stage / Next owner](delivery-workflow.md#delivery-record-and-handoff-checks) cell; Mark updates both in the same change.

```markdown
# <scene ID> — <title>
Deliverable: <ID> · Revision: <rev> · Status: draft / needs-input / ready-for-dev · Timing: estimated / checked-with-audio / checked-with-blockout
Inputs: script + fact-check <paths, exact revisions, beat/claim ranges> · Film brief <path/revision, decision IDs> · delivery record <path>
Target: <branch/commit> · <fps> fps · durationFrames <n> · <format> · composition offset <n>
Evidence: runtime <unverified | link> · render/samples <...> · audio/subtitle sync <...> · user approval <...>

## Intent and continuity
Audience information/emotion before → after; visible action; concealed information; things not to show
Previous/next scene IDs + revisions; intentional cut/time jump/axis crossing + reason (unavailable neighbors: unverified)

## Baseline and assets
Link Film/library baseline + projection revision; add only scene constants: units, origin, axes, anchors, screen boxes, actor sizes
| Asset/capability ID | Owner path + commit | Integration status | Gap/dependency/consumer |
Relevant finding IDs + revalidation; fallback + story/reveal impact

## Shot map
| Shot (+ legacy panels) | Beat | Scene-local range [start, endExclusive) | Claims/clues | Runtime mapping (planned/verified path + index/frame range) |

## SH01 — <purpose>
Range and clocks: scene-local [start, endExclusive); shot-local offset; composition offset
Direction: composition, focal point, visible action, hidden/revealed information, subtitle-safe region (portrait: [caption-safe box](production-requirements.md#vertical-caption-safe-zone))
Staging: | Entity/anchor | Space/unit | Start | Key/end + local frames | Facing/gaze/contact |
  depth/layers; actor paths (separate from camera): start/key/end frames, easing/holds, attach/detach
Camera: projection/bounds or position/target/FOV; start/key/end frames; transform owner; picture moves and their layers
Look: only what differs from the brief (palette/value hierarchy, motivated lights, shadows, beat-driven changes)
VO + subtitles: full Thai VO (or exact accessible source range); subtitle text + frame ranges; SFX asset/onset/clock/license or proposed
Sound: ambience/music state; cues with shot-local frame + library ID or `NEEDS-GEN` request; ducking/continuity ([duties](sound-generation-workflow.md#role-responsibilities))
Mix intent: hold / lift / drop / hit / release per beat ([EP08a](editor-principles.md#ep08a-shape-audio-emphasis-by-story-beat)); Editor sets levels
Cut/transition: purpose, type, start/end frames, overlap, active subtitle/audio; existing implementation or Boss requirement
Entry → exit: state at the first and last frame (actor/prop positions, pose/contact, set/light states, spanning audio)
Acceptance: | Frame + named clock | Observable image/sound/contact/reveal | Evidence |

## Dependencies and open items
| Owner | Dependency / acceptance | Status |
Element captures: paths + asset/view/pose/source revision, or unavailable; Editor scene sample: representative shot/frame proposal

## Change log
<date> <revision> — what changed and why; superseded values; migration notes
```

Sheets written before 27 October 2026 in the earlier eight-section form remain valid for their revision; reformat a sheet to this contract when it is next revised, not as a mass rewrite.

In screen space, state whether positions use pixels or normalized coordinates and whether origin is top-left with Y down. In world space, inherit Film's axis convention and units. Use a named floor/seat/grip anchor rather than an unexplained artwork center. For 3D paths include meaningful XYZ; for screen-space paths use XY with explicit layer/depth. A value such as `x=0.3` without a space/unit is incomplete.

Camera intent must distinguish pan/push of the projected picture from camera travel in the world. Changes in apparent size must follow the shared projection and physical ratios under the scale guide. Screen readability is resolved through framing/staging, not ad hoc actor resizing. Record near/far/contact/key reveal frames when relevant.

## Deliverables

Retain the selected-variant paths from [delivery workflow](delivery-workflow.md#files-and-stable-ids):

```text
storyboards/<episode>/short/{visual-brief.md,index.md,sc01.md,review-rows.json}
storyboards/<episode>/long/{visual-brief.md,index.md,ch01-sc01.md,...,review-rows.json}
```

`index.md` owns scene order and source revisions; shared element/consumer/dependency links; blockout brief/status; shot → timeline index/frame mapping; findings and open items. Mark maintains plans; Editor updates runtime mapping/sample/sequence evidence; Boss updates shared capability/asset evidence. Keep detailed shot data in its scene sheet.

### Element captures at Mark handoff

When available and useful, show captures of the actual selected characters, props, sets or key poses, preferably from an existing preview/demo. Reuse a small labeled contact sheet where several assets need review; it is an element preview, not a storyboard. Record asset ID, view/pose, source path/revision, capture method and limitations in the index. Store generated captures under `out/handoffs/<episode>/<deliverable>/elements/` and embed them in the handoff message with absolute local paths where supported.

Mark may capture an existing preview; building a missing asset/preview capability belongs to Boss under assigned production scope. Label missing elements and any placeholders; a viewport/isolated element does not prove final composition, motion, lighting or contact. Captures are illustrative; written scene sheets own shot direction. Drawing or Excalidraw production is not part of this handoff.

<a id="user-storyboard-review-page"></a>
### User storyboard review page

**Default:** after Mark marks a scene-sheet revision `ready-for-dev`, the coordinator publishes one review page per revision so the user can check the plan before plates are rendered.

- **First pass — Requirement (user, 31 Oct 2026):** the user sees a storyboard right after the script, before the [voice lock](delivery-workflow.md#voice-lock), to judge camera and VO only. Mark's pre-lock staging pass also writes `review-rows.json` with `"untimed": true` and no `start`/`end`: per shot the full Thai VO and a `seen` cell that leads with the camera (shot size, angle, movement) and then what is seen; no times or lengths appear. Mark reports `review page: pending`; the coordinator builds and publishes it the same way, at the URL that later timed revisions reuse. In the Light tier, Film writes these rows from the brief's shot list. The first pass is not a gate: the voice lock and later stages continue while it is open, and its `change` notes enter the next scene-sheet revision.

- **Form:** a private HTML artifact (the Artifact tool in Claude Code), written for the user in Thai. Agent-facing sheets stay in English; the page is a reading view and never the source of shot direction.
- **Build — Requirement (31 Oct 2026):** the layout is fixed in `scripts/storyboard-page/template.html` (taken from the WORLD FOG SS-R2 page). With each `ready-for-dev` revision Mark writes the rows in Thai as `review-rows.json` beside the index (schema and example: `scripts/storyboard-page/example.json`) and reports `review page: pending`. The coordinator runs `python3 -I scripts/storyboard-page/build.py <review-rows.json>` and publishes the `index.html` it prints, with its `pv/` files and `capabilities: {"db": {}}`, to the same artifact URL for each later revision of that deliverable. A layout change goes into the template, never into one page; a hand-written page does not count as the review page.
- **Content:** one table, one row per shot, with beat-name group rows. Columns: shot ID with Thai start time and length · short Thai title · full Thai VO · what is seen (one or two plain sentences, camera folded in) with any brief deviation or open item flagged · sound (a few words) · review. Keep cells short enough to scan; the scene sheet keeps the detail. The page carries no painted storyboard art, because nothing is normally rendered when Mark hands off; rendered captures enter only through the preview column. A shot without a capture may show a plain SVG schematic (frame, horizon, figure boxes, caption band) drawn from the scene sheet, labelled as a schematic.
- **Previews:** once Boss or Editor previews exist, add a preview column that shows each row's captures as thumbnails (click to enlarge), matched by shot ID and labelled under [preview labels](boss-asset-workflow.md#preview-labels), with the revision they were rendered against and a note when a capture predates the reviewed revision; a row without one reads `ยังไม่มี`. Publish downscaled copies as the artifact's own files; only existing captures appear, never drawn storyboard art. The coordinator republishes the page when previews arrive or the revision changes.
- **Feedback:** each shot has a pass/change verdict and a free-text note, stored in the artifact's `db` capability (`reviews/<shot ID>`, fields `status`, `note`, `rev`, `updatedAt`) so the coordinator reads them back with `ArtifactData`; a copy-all button covers viewers without `db`. User-owned open questions from the index appear as their own items.
- **Recording:** add the page URL and its scene-sheet revision to the index items table. The coordinator relays `change` notes to Mark as a new revision request and records each verdict as user feedback with its date; a full set of `ok` verdicts is recorded as user approval of that revision only.
- **Not a gate:** the page adds no approval gate to `ready-for-dev` unless the delivery record asks for one. Boss and Editor may start blockout while review is open; changes from review follow the normal revision rules. **Default:** Boss paints finished-grade plates for a beat only after that beat's review notes are in, and the coordinator sends them as one batched revision of 3–5 shots, so a look note costs one fix pass instead of one per shot.

### Legacy material

On migration, remove repository drawing files and their live links, retain written scene sheets/briefs/timing/IDs, and preserve dated historical evidence. Previous `BOARD` revision strings and `Pxx` IDs remain provenance only. Audit required coordinate/camera details before reusing old sheets: missing details keep the current handoff `needs-input`; deleting drawings does not certify readiness or create samples. Scene samples follow [Editor workflow](editor-workflow.md#scene-samples-for-the-user).

## Visual criteria and render review

Use [shot-direction principles](storyboard-principles.md), [cinematography](cinematography-principles.md) and [editing principles](editor-principles.md) for purpose, continuity, rhythm and information control. Test timing with actual blockout/audio before claiming pacing or synchronization. Stills establish only their depicted state.

Identify handoff revision, selected composition, shot ID and frame/clock. Check start/action/reveal/end, critical adjacent frames and previous → changed → next playback. Check Thai readability, focal point, physical ratios, camera movement and contact. Missing audio/tooling/neighbors remain unverified with owners/follow-up. Report technical constraints to Film/Boss/Editor; revise plans with a change log when the intended shot changes.
