<!-- Moved from docs/dev-findings.md on 2026-10-29; the index and workflow stay there. -->
# DF-20261026-subpixel-stage-projection — metre-space layer rendered at subpixel CSS size

- Owner: Boss; First observed: 26 October 2026; last checked: 26 October 2026
- Status: `fixed` for the current issue-branch working tree; Type: `implementation-bug`
- Tags: 2D / scale / camera / contact / projection
- Scope: `codex/33-catbox-foundation` HEAD `906a85e` based on `main` `ce2a0b1`, plus uncommitted runtime changes; Remotion `4.0.538`; `src/scenes/projection.ts`, `src/scenes/SceneRenderer.tsx`, `src/assets/backgrounds/CatboxRoom.tsx`, `src/assets/Props.tsx`, `src/rig/physicalScale.ts`, and `scripts/cat-boxes/blockout.json`
- Consumers: `CATBOX-C06-S02` SH01–SH04; Film decision `PROJ-CATBOX-ORTHO-R1`; Mark board R3. This is a rendering implementation issue, not a restriction on 2D, 3D or hybrid production.

<a id="อาการและหลักฐาน-2"></a>
## Symptoms and evidence

- Desired: the BOX-OLD floor anchor, cat floor/seat anchor, room and camera view share one metre-to-pixel mapping in Short and Long.
- Initial implementation laid out vectors in CSS metre units (for example a complete box SVG viewport below 1 CSS pixel) and applied a roughly 1,370× CSS transform to the parent stage for Short. The first rendered Short seated frame visibly placed BOX-OLD off the left edge and separated Mochi from its box, despite both world X positions being at the origin. Applying a CSS drop-shadow on the subpixel SVG stage also scaled the shadow with the parent transform.
- The initial faulty still was overwritten by the corrected frame render. No preserved before-image is available, so this note does not claim a reproducible pixel measurement from that first output.
- Reproduction context: C06-S02 timeline entry `scene[11]`; Short composition frame 15,912 (scene-local frame 1,062), 1080×1920, 30 fps; orthographic view and actor/prop dimensions from `CATBOX-METER-R1`. Before-render layout calculations placed world O at output center X=540, while the first still did not show that result.
- Evidence for the correction: `out/qa/cat-boxes/r3-keyframes/Short-local-000-f14850.png` (historical Short start still), `out/qa/cat-boxes/r3-keyframes/Short-local-1062-f15912.png` (historical Short seated/contact still), full-resolution Short/Long sequence previews and contact sheets above, and projection/anchor assertions in `tests/projection.test.ts` and `tests/animation.test.ts`. Render artifacts are local under ignored `out/`; these two historical PNG paths were absent during the documentation migration, so they are retained as references rather than current accessible evidence. The runtime fix remains in the working tree on `906a85e`, not yet a merged `main` result.
- Root cause: the parent transform and CSS/SVG filter operated on a metre-space DOM subtree whose local dimensions were fractions of one CSS pixel. Layout rounding/rasterization at that scale did not match the intended direct world-to-output mapping. This finding is scoped to this implementation path.

<a id="สิ่งที่ลองและผล-1"></a>
## Attempts and results

- Subpixel metre-stage DOM/SVG plus a parent scale transform → incorrect apparent anchor and prop size in Short.
- Corrected owner: convert world positions and physical asset dimensions directly to output CSS pixels in `orthographicViewAt`, `worldToOutputPoint`, `layoutWorldActor` and `layoutWorldProp`; render the physical room as an output-sized SVG using the active world-view `viewBox`; keep screen-space props outside the camera transform. BOX-OLD remains one library identity, with rear/top and front-wall planes rendered around the actor by the shared asset owner.
- Final CLI QA: Short and Long each rendered 46 seconds / 1,380 frames, with 77 full-resolution stills per composition. Remount comparisons at composition frames 16,050, 15,000 and 15,750 found Long pixel-identical; Short pixel-identical at 16,050 and 15,750, with only five subtitle pixels differing by at most 2 channel values at 15,000 and no geometry displacement. Studio remains unverified under `DF-20261026-studio-emfile`.

<a id="ผลต่อการวางแผน-1"></a>
## Planning impact

- Film: a metre-space 2D DOM/SVG stage needs one projection owner that emits output-pixel layout, or a single SVG world `viewBox`; do not infer 2D infeasibility from the initial subpixel implementation. R4 uses a 1.15m Short view and keeps physical actor/prop sizes unchanged.
- Mark: retain physical contact anchors and shot camera bounds; check Short close crops after occlusion, subtitle clearance, and the SH03 camera cut in F-1/F/F+1. The final cat uses uniform rig scale; `.48m` nose-to-rump remains a design estimate while source-derived body bounds project to about `.45m` at the `.45m` height calibration.
- Follow-up: Boss to commit/push the projection implementation and R4 board/scene-sheet mapping in the issue PR; Film/Mark should verify the finding against the merged baseline before reusing it elsewhere.
- History: 2026-10-26 / `codex/33-catbox-foundation` `906a85e` + working-tree projection fix → Short/Long previews, full-resolution stills, contact sheets and random-remount comparisons recorded above; issue branch only, not yet merged.
