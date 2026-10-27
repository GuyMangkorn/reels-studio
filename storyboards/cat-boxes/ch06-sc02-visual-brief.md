# Visual brief — CATBOX-C06-S02

## R5 user-directed Short scale update (27 October 2026)

The R3/R4 `0.45m` / `0.316m` cat-height figures below are historical Short framing estimates. For PR #38's requested Short pass, the shared rig now uses Mochi `1.70/6m` (`0.2833m`) against the owner's `1.70m`, and the main Short's S1–S12 plus all six chapter Shorts use the same metre-space scale without per-scene actor-size overrides. This implements the user's requested ~6:1 owner/cat physical-height ratio; Short framing supplies the lead size. Source VO, script claims and subtitle wording are unchanged.

This shared scale change also affects any composition that imports the same physical-scale registry. Long output was not rendered or reviewed in this Short-only pass, so its resulting scale/framing is unverified and needs a later review. The original R3/R4 Long treatment and evidence below are retained as historical source, not a Long pass claim.

Revision: `VB-C06-S02-R3` | Status: `blockout-integrated` (Mark board R4; bounded Short/Long CLI proof recorded in index; script approval pending)
Script: `scripts/cat-boxes/ch06-script.md` R4, `CATBOX-C06-U02-B01`–`B04`; episode script R5
Fact-check: `scripts/cat-boxes/episode-fact-check.md` FC-R4, including F012 (the return to the old box and the unresolved reason are fictional; no causal answer is added)
Board/sheet: `ch06-sc02.excalidraw` / `ch06-sc02.md` revision 4; Mark completed the R4 source and checked the current Short keyframes. Excalidraw MCP `create_view` returned `Diagram displayed` but no screenshot/export, so visual export review remains unverified.
Target runtime checkout: `codex/33-catbox-foundation` at `906a85e`, based on `main` `ce2a0b1`; Boss's R4 projection/crop changes are in the issue working tree; final Short/Long CLI evidence is recorded in `index.md`.
Scope: C06-S02, with the C06-S01 exit and C01-S01 CL01 box placement as continuity boundaries; other scene sheets are not revised by this brief
Timing: estimated 45 seconds at 30 fps, `[0,1350)`; SH01 `[0,300)`, SH02 `[300,690)`, SH03 `[690,1050)`, SH04 `[1050,1350)`. VO is unapproved and subtitle cues are unsynced estimates.

Revision note R2: superseded R1's `Y=[0,3.40] m` Long and `Y=[0,1.40] m` Short bounds because they placed floor/contact at the bottom edge under subtitles. View heights and physical model were unchanged; vertical bounds shifted to put contact above subtitles (`Long Y=[-0.85,2.55] m`; `Short Y=[-0.30,1.10] m`).

Revision note R3: Short bounds use a 1.15 m view height (`Y=[-0.275,+0.875] m`, centerY `0.30 m`) rather than R2's 1.40 m. Boss measured the visible cat after box occlusion at about `0.316 m`; at 1.15 m it projects to about `527 px` (~47 px above the 480 px target). With centerY `0.30 m`, floor `Y=0` lands at row ~1461, leaving ~157 px above the estimated two-line subtitle top (~1618). Long remains 3.40 m high with `Y=[-0.85,+2.55] m`. Physical dimensions and decision IDs `CATBOX-METER-R1` / `PROJ-CATBOX-ORTHO-R1` are unchanged.

R3 Short camera path: keep `centerX=-0.20 m` through scene-local F689, yielding `X=[-0.523,+0.123] m`; the cat's head/front paws at about `X=[-0.49,-0.30] m` remain visible and roughly 82% of BOX-OLD's 0.38 m width stays in frame as a clue. Make an intentional camera cut at F690 to `centerX=-0.55 m`, follow to `-0.25 m` at F870 and settle at `0 m` by F1049. Mochi's world path holds at `X=-0.55 m` through F689 and walks continuously to the box seat at `X=0`; do not reset or resize the actor. In R4 stills, F0 keeps the cat/box clue readable and F15912 places the cat body inside the same box image.

R4 inlay and payoff timing: keep the flat `catbox-outline` in the upper band at normalized Short `x≈0.75, y≈0.31` from scene-local 0–23s; keep the text card above Mochi's ears/action at `y≈0.28`. Do not show the closing card `ครั้งนี้ยังไม่รู้` at frame 0: reveal it at scene-local 35s / F1050 (SH04 start) through scene end; retain the approved subtitle cue `กล่องมีหลายหน้าที่` at35s and `เหตุที่เลือกใบนี้ ยังไม่รู้` at40s. Hide unrelated props with their authored `startSec/endSec`; reuse only approved cue wording from the script/sheet. R4 stills show the closing card above the action and subtitles remain clear in the checked Short keys; confirm again in full motion.

## Preview evidence and intent

The local A-fade MP4 `out/qa/cat-boxes/preview-c06-a-fade.mp4` is a valid 15-second, 540×960 R2 clip (frames 15750–16199; C06-S02 local 900–1349), not the final R4 render. R4 full-resolution Short stills `out/qa/cat-boxes/r3-keyframes/Short-local-000-f14850.png` and `Short-local-1062-f15912.png` were inspected by Boss/Film: F0 keeps Mochi's ear-to-front-paw silhouette visible with a partial BOX-OLD clue; F15912 shows the cat body inside the same box image. The upper card is clear of the cat and subtitle band, and the payoff card is absent at F0. Final CLI previews now cover F14820–16199 in both formats (46s/1380frames each); one-second, adjacent-frame and dense sit/cut sheets were inspected. CLI remount checks at F16050/F15000/F15750 reproduce geometry; one Short subtitle edge differs by5pixels with maximum channel delta2. See `index.md` and `out/qa/cat-boxes/projection-final/review-metrics.json`; Studio remains unverified.

Keep the ending honest: Mochi returns to the same old box, the owner writes `ครั้งนี้ยังไม่รู้`, and the audience still cannot infer a specific motive. Maintain the fiction label, C01's planted box identity, and the owner-left → sofa → box-right direction in Long. The Short framing should lead on Mochi and the box; keep the owner offscreen or as a cropped secondary hand/note while preserving the written closing line. Do not show the owner and cat at nearly equal physical height simply to meet the Short size rule.

## Scene decisions

| Scene / beat | Decision ID | Element / medium | Short and Long framing | Why / fallback |
|---|---|---|---|---|
| C06-S02 SH01–SH02 | `VD-C06-S02-01` | Existing 2D owner, cat, room and study cards on a shared orthographic 2D stage | Long keeps owner-left and evidence in the room; Short uses the authored close crop for the current focal and omits a competing full-height owner when Mochi is the lead | The beat is a fixed front/side illustration with no orbit or unseen side reveal. This preserves the channel's cut-out language and avoids adding a 3D dependency without a spatial need. |
| C06-S02 SH03 | `VD-C06-S02-02` | BOX-OLD remains one shared library identity; the current complete 2D box image may use an internally layered back shell/front rim if that shared asset structure proves clearer | Long keeps the old box at screen-right; Short crops around Mochi and that same box as he enters | Layered 2D art can show the cat passing behind the front rim while keeping one asset owner and common anchors. Do not duplicate scene-specific box drawings. |
| C06-S02 SH04 | `VD-C06-S02-03` | 2D writing/card action, cat-in-box pose, and fixed screen-space subtitle | Long holds the room axis; Short holds the closing note with a cat/box crop, owner not staged as a co-lead | Preserve the unresolved payoff and a readable final line. A close crop meets projected lead size through the camera/view bounds, not by enlarging Mochi relative to the box. |

## Shared scale baseline — proposed design estimates

Coordinate contract `CATBOX-METER-R1`: one world unit is one metre in a **right-handed** system. The origin `O` is the ground contact under the center of BOX-OLD's named `floorAnchor`. `+X` runs screen-right from the owner/sofa toward the box, `+Y` is up, and `+Z` points toward the viewer/foreground; a notional orthographic camera is on `+Z` looking toward `-Z`, with the image plane in `XY`. The illustrated ground is the `Y=0` contact line. This is a 2D orthographic set: `Z` is only an authored layer/occlusion coordinate, not a walkable depth axis or a source of perspective scaling. Background, cut-outs and props share one pixel↔metre mapping. All values below are **design estimates for this stylized set**, not sourced anthropometry and not measurements of a real owner, cat, sofa or box. Boss should measure the actual visible solid bounds (excluding SVG canvas padding, shadow and glow) before assigning library conversions.

| Asset | Proposed reference size | Current source evidence | Status / calibration needed |
|---|---|---|---|
| Owner (`HUMAN-2D`) | Standing sole-to-head: 1.70 m | `src/rig/Character.tsx`, 320×430 SVG viewBox; limb/head geometry determines actual visible bounds | Design estimate. Measure the neutral standing solid bound in the shared rig. |
| Mochi (`CAT-2D`) | Neutral standing sole-to-ear: 0.45 m; shoulder height 0.27 m; nominal nose-to-rump length 0.48 m | `src/rig/Animal.tsx`, `src/rig/physicalScale.ts`; source body bounds are about 210 units wide × 208 units high, excluding tail | 0.48 m remains the nominal design estimate; uniform source-bound calibration at 0.45 m height gives `0.45 × 210 / 208 ≈ 0.454 m` (~6% shorter). Boss preserves uniform rig proportions; do not stretch X to force the nominal estimate. Record standing/seated solid bounds separately. |
| Sofa (`SOFA-2D`) | Seat top 0.45 m above floor; seat depth 0.55 m; usable length 1.60 m | `src/assets/props/Sofa.tsx`; current seat surface is `0.65 × composition height` and width is `0.43 × composition width` | Design estimate. Replace viewport-relative seat geometry with a shared physical anchor/mapping or document the existing asset as uncalibrated. |
| BOX-OLD | Exterior footprint 0.38×0.38 m; outside height 0.32 m; clear opening about 0.30×0.30 m | `src/assets/Props.tsx`, 240×240 SVG viewBox; pivot `(120,228)`, floor `(120,226)`, seat `(120,172)`, grip `(53,91)` in SVG pixels | Design estimate. Solid bounds/anchors are image-space only; Boss must convert them to metres once in the asset owner and verify cat seat contact. |

## Projection and implementation contract

Decision `PROJ-CATBOX-ORTHO-R1`: use an orthographic 2D stage for this scene; the room, sofa, actors and BOX-OLD remain front-facing planes. There is no authored depth parallax and no perspective camera in the active CATBOX preview. The same world sizes must feed both outputs. The aspect ratio chooses the visible orthographic bounds and crop; it must not apply an actor-only scale override.

Proposed camera view rectangles, measured from `O` and to be verified against measured solid bounds:

| Output | Camera view rectangle from `O` | Pixels per metre | Expected use |
|---|---|---:|---|
| Long 1920×1080 | `X=[-3.60,+2.44] m`, `Y=[-0.85,+2.55] m` (6.04×3.40 m; center `(-0.58,0.85) m`) | ~318 px/m | Room-wide owner-left / sofa / Mochi / old box. Place the sofa center near `X=-1.20 m`, owner near `X=-2.20 m`, and BOX-OLD at `X=0`; the floor anchor maps to about row 810, owner 1.70 m projects to ~541 px and Mochi 0.45 m to ~143 px before pose/occlusion. |
| Short 1080×1920, C06-S02 cat-led crop | Base view height 1.15 m, width 0.647 m, centerY `0.30 m`; translate centerX by shot (`X` bounds are centerX ±0.3234 m) | ~1669.6 px/m | Focus on Mochi and BOX-OLD; the F15912 visible cat bound of ~0.316 m projects to ~527 px. Early centerX `-0.20 m` gives `X=[-0.523,+0.123] m` and keeps about 82% of the box width in frame. The owner at `X≈-2.20 m` is outside this crop. Do not scale Mochi independently. |

These rectangles are framing estimates tied to the named box-floor origin, not measured room extents. Long keeps 0.85 m of illustrated ground below the `Y=0` contact line; Short keeps 0.275 m below it. A `0.55 m` sofa seat depth remains an asset dimension; the current side-view 2D plane does not project that depth. Mark/Boss should refine actor/sofa/box positions against solid bounds while retaining `O`, the axes, and the owner-left → box-right direction.

### Subtitle-safe floor placement

`src/scenes/Subtitles.tsx` places Short text 134 px from the bottom at 51 px / 1.65 line height, and Long text 58 px from the bottom at 44 px / 1.65 line height. A two-line cue's approximate top is Short row 1618 and Long row 871 after the current stroke. R3 floor rows (Short ~1461; Long ~810) leave about 157 px and 61 px above those subtitle bands. These are estimates from CSS bounds; Boss must verify actual line wraps/stroke in the full-resolution render, including the longest C06 cues. If a cue wraps to more lines, adjust camera bounds/crop rather than moving the floor or enlarging the cat.

The camera formula for this 2D orthographic mapping is `pixelsPerMetre = viewportHeightPx / viewHeightMetres`. The R4 candidate now implements this through `src/scenes/projection.ts` (`orthographicViewAt`, `worldPositionAt`, `layoutWorldActor`, `layoutWorldProp`), `src/rig/physicalScale.ts`, the `projection`/`world` types and validator, and `SceneRenderer` dispatch. This exists in the issue branch only and still needs final render/seek proof before it is treated as a production capability. The whole-picture `pictureMove` is a separate normalized CSS transform after projection; screen-space inlays/subtitles remain outside the physical mapping. Preserve those ownership boundaries and do not use the old actor-only portrait scale override.

### 3D option considered

The user permits 3D props. A 3D open box could provide an actual interior, front-rim occlusion and contact if a later camera move reveals new sides. It is **not recommended for this C06-S02 brief**: the approved shot holds a fixed front/side view, the current box image plus a shared foreground rim can tell the action, and the clean checkout has no direct Three.js/R3F dependency or `src/three` stage. A 3D box would require a new shared stage, coordinate conversion, 2D-cat depth adapter, lighting/shadow and alpha-order proof. Reconsider it only if Mark finds that a non-orbiting 2D layered BOX-OLD cannot make the sit/reveal legible; the smallest spike would render one C06-S02 entry/sit/reveal in both formats with F-1/F/F+1 contact and occlusion checks.

## Calibration and acceptance for Mark/Boss

1. Make a calibration panel with the owner, Mochi, sofa seat and BOX-OLD on the same floor plane. Label each dimension as measured, estimated or design choice; measure solid silhouettes rather than the full SVG viewBoxes.
2. Map floor/hip/seat/grip anchors into `CATBOX-METER-R1` once in shared owners. Do not use `portrait.scale` on Mochi to satisfy the 480 px rule. Remove or supersede that C06-only inflation in the implementation after the common baseline is calibrated.
3. Mark's C06-S02 board/sheet revision 4 keeps the narrative/beat ranges, make SH03’s walk into the old box and SH04’s sit readable, and document the camera-only Short path (`-0.20` through F689; cut to `-0.55` at F690; `-0.25` at F870; settle at `0` by F1049). Keep Mochi's world path continuous (`-0.55` to the box seat at `0`); mark the F690 camera change as an intentional cut, not an actor reset. Place the Short outline at `x≈0.75,y≈0.31`, keep the card at `y≈0.28`, and reveal the closing card only at F1050/35s; retain the approved subtitle cues and safe band. Long preserves the owner-left → sofa → box-right axis. Flag other CATBOX sheets as scale-audit consumers, not as passed.
4. Boss has an R4 projection/physical-scale implementation in the issue worktree. Verify it against the R4 stills and final Short/Long renders: Short view height 1.15m/centerY .30, cat 0.316m visible bound ≥480px after occlusion, and floor/box contact above the two-line subtitle top; keep a uniform cat rig ratio (source-body estimate .454m vs nominal .48m). Check start/mid/end, the C06-S01→C06-S02 boundary, F-1/F/F+1 at F690/F870/F1049, box rim/seat contact, inlay visibility, subtitle-safe crop and backward/random seek parity. Recalibrate camera bounds only if actual render evidence requires it; do not change actor scale to force the threshold.
5. Fallback if the single timeline cannot carry a Short-specific crop: retain the Long physical blocking and create a focused shared portrait-view capability, or revise the future Short cut to a cat-only close-up. Do not inflate an actor or shrink the box per scene to force a composition.

## Evidence and open items

- Existing in the R4 issue worktree: `PHYSICAL_ACTOR_SPECS` and `src/scenes/projection.ts` implement the estimated metre scale and orthographic world-to-pixel mapping; `projection`/`world` types, validation and `SceneRenderer` dispatch are present. `pictureMove` remains a separate whole-picture effect. These changes are not yet merged into `main`. Direct-pixel projection replaces the failed subpixel CSS stage recorded in [DF-20261026-subpixel-stage-projection](../../docs/dev-findings.md#df-20261026-subpixel-stage-projection).
- Remaining limits: physical dimensions remain design estimates; source bounds and box-seat conversion are implemented and checked in the bounded C06-S02 renders. Studio playback/interactive seeking remains unverified under `EMFILE`, native board export is unverified, and the other eleven scenes have not been scale-audited. The previous scene is not in physical units, so cross-cut physical continuity is unverified.
- `DF-20261026-duplicate-types` is a local dependency-environment finding, not evidence for choosing the medium; clean `npm ci` and typecheck pass on this branch. Studio `EMFILE` and CLI-vs-Studio coverage are catalogued in [DF-20261026-studio-emfile](../../docs/dev-findings.md#df-20261026-studio-emfile); the duplicate-types finding is a checkout-scoped workaround.
- The A-fade preview is low-resolution and has no approved audio. Scene timing and subtitles remain estimates. This brief does not change script facts or timing.

## Handoff and review status

- **Mark:** board/sheet R4 records the final crop, continuous world path, camera cut, layered box and inlay/payoff timing. Source JSON IDs/indices and diff checks pass. Native Excalidraw export inspection remains unverified.
- **Boss:** shared projection/anchors, uniform rig scale and layered BOX-OLD are integrated in scene[11]. Short/Long CLI previews, adjacent-frame/cut/sit checks and remount evidence are linked from the sequence index. No actor-only portrait inflation remains in C06-S02.
- **Follow-up:** scene acting/handwriting polish, approved audio/subtitle sync, the other eleven scene scale audits and separate publishable Short assembly remain open. 3D remains available for a future Film decision when the shot benefits.

This brief preserves script facts, timing and the unresolved ending. The bounded blockout proof does not establish approved narration or whole-episode physical continuity.
