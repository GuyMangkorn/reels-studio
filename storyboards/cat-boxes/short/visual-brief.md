# Visual brief — CATBOX-SHORT

Deliverable: `CATBOX-SHORT`; duration target 40–60 seconds, selected timeline 45 seconds.
Revision: `VB-CATBOX-SHORT-R2`; status: `ready-for-mark` (Film crop contract defined; runtime crop and subtitle placement remain unrendered).
Script: `scripts/cat-boxes/short/script.md` `CATBOX-C01-SHORT-R1`; fact-check basis: `scripts/cat-boxes/short/fact-check.md`, Boat `FC-R5-C01`.
Source brief: `storyboards/cat-boxes/visual-brief.md` `VB-CATBOX-R5`, decision `VS01`; current handoff: [`short/sc01.md`](sc01.md) `CATBOX-SHORT-BOARD-R5`.
Target checkout: `codex/59-catbox-short-crop`, based on `main` `9d25208`. Scope: one C01 Short S01; Long and historical chapter Shorts are out of scope.

## Visual intent and progression

Keep the fictional cat in a drawn empty outline distinct from the study participants and paper stimuli. The home action and readable upper-third evidence cards support one another; the research diagram is visibly labeled. End on the limit of the evidence: a cat's choice does not establish its thought or motive. Preserve the R5 staging decision to keep Mochi and the living room visible while cards explain the reviewed results.

| Beat / Short frame range | Visible action and change | Claim / visual boundary |
| --- | --- | --- |
| `CATBOX-C01-S01-B01` / `[0,210)` | Establish fictional empty-frame clip; owner redirects attention to the question. | `F001/F003`; label fiction; do not show an invisible wall as a fact. |
| `CATBOX-C01-S01-B02` / `[210,600)` | Assemble three stimulus types and separate 30 completing cats from 9 selecting cats. | `F001/F002`; schematic label; no 561 or 16-tally detail. |
| `CATBOX-C01-S01-B03` / `[600,1020)` | Show Kanizsa/control and square/control as separate comparisons. | `F003`; non-significance is not equality; no invented graph/effect size. |
| `CATBOX-C01-S01-B04` / `[1020,1350)` | Hold on the unresolved reason; the paper frame remains an illustration. | `F001/F003`; do not imply the test reads subjective belief. |

## R2 Film crop and camera contract

Decision `VD-CATBOX-SHORT-CROP-R2`: use one fixed-plane, 2D orthographic portrait view for all four R5 shots. Retain the R5 owner anchor `(-0.95, 0)m`, approved two-foot crouch with an estimated `0.893m` eye line, `1.70m` standing-size baseline, Mochi's `(-1.20, 0)m` floor anchor and unchanged `0.2833m` standing-height estimate. Keep Mochi in the current sit pose and retain both actors' physical scale. This is a close feature crop: the owner's crown, outer side-head and lower body are intentionally clipped, while both eyes, nose, mouth and the attached compact hand remain on-screen. It changes no beat, reveal, script text, subtitle wording, timing, shot ID or scene order.

**World baseline:** `CATBOX-METER-R1` / `PROJ-CATBOX-ORTHO-R1`; metres; origin O at BOX-OLD floor contact; +X right, +Y up, +Z toward viewer; actors and room on fixed plane Z=0 with layer ordering. Keep the selected `CATBOX-C01-Short` composition at 1080×1920 / 30 fps. Existing `short-c01.json` orthographic projection and camera-move implementation are `existing-integrated` at `9d25208`; this crop remains a design estimate pending an Editor render.

**Base short view:** `projection.views.short.bounds = {left:-1.41875, right:-0.85625, bottom:-0.01846, top:0.98154}` metres. The resulting view is `0.5625m × 1.0m`, exactly 9:16. Camera offsets are relative to the view center; `x` stays `0m` and `y` eases from `0m` to `+0.0015m` and back. `zoom` eases from `1.000` to `1.003` and back. Keep frame-safe limits at `x=0m`, `0≤y≤0.0015m`, and `1.000≤zoom≤1.003`; wider pan or zoom can clip Mochi or the owner's right eye.

| R5 scene / shot | Scene-local camera keys at 30 fps | Camera movement |
| --- | --- | --- |
| `scene[0]` / `CATBOX-C01-SHORT-S01-SH01` `[0,210)` | F0, F105, F210 | `(x:0,y:0,zoom:1.000)` → `(0,+0.0015,1.003)` → `(0,0,1.000)` |
| `scene[1]` / `CATBOX-C01-SHORT-S01-SH02` `[210,600)` | F0, F195, F390 | `(0,0,1.000)` → `(0,+0.0015,1.003)` → `(0,0,1.000)` |
| `scene[2]` / `CATBOX-C01-SHORT-S01-SH03` `[600,1020)` | F0, F210, F420 | `(0,0,1.000)` → `(0,+0.0015,1.003)` → `(0,0,1.000)` |
| `scene[3]` / `CATBOX-C01-SHORT-S01-SH04` `[1020,1350)` | F0, F165, F330 | `(0,0,1.000)` → `(0,+0.0015,1.003)` → `(0,0,1.000)` |

**Projected placement estimates:** At the base crop, the eye centers land around X `730px` and `1071px`, Y `170px`; at maximum zoom they remain about X `730–1072px`, Y `170–171px`, inside the R5 face box. Nose and mouth stay on-screen; the lower edge of the smile is estimated near Y `566px`, just below the face target box but clear of the subtitle region. Hair/head silhouette bounds are approximately X `404–1373px`; the right edge and crown are intentionally outside the portrait crop. The hand center target is about X `600px`, Y `530px` (world anchor approximately `(-1.106, 0.706)m` at the base view). Its `~233px` hand glyph fits the R5 `[480,720]px` / 240px target with only a few pixels' margin.

Mochi's seated visible solid height is estimated from the current `24`-unit body drop: `0.2833m × 184/208 ≈ 0.2505m`. It projects to about `481px` at the base view and `482px` at maximum zoom. The floor contact appears about `35px` above the bottom at base and `31px` at maximum zoom. Its complete projected silhouette is approximately X `14–741px`; the camera frame itself does not crop the silhouette. The crop reveals the central sofa section, floor and wall; the room window is outside this close view. These are measured-from-source design estimates, not rendered evidence.

## Screen-space overlays and subtitle-safe region

Keep the R5 graphic field at X `[86,468]px`, Y `[422,634]px`; the attached hand target at X `[480,720]px`, Y `[410,650]px`; and the face/eyes target at X `[720,1080]px`, Y `[170,550]px`. The proposed subtitle-safe rectangle is X `[86,468]px`, Y `[690,1050]px`. It leaves a 56px vertical gap after the graphic field, a 40px gap below the hand box, and ends well above Mochi's projected silhouette (about Y `1404–1885px`). It does not overlap the face/hand targets. At the current 51px Noto Sans Thai font with 1.65 line-height (about 84px per line), the 360px height supports up to four lines without shrinking type; the longest current cue is estimated to wrap into no more than three. Use line wrapping only: preserve every existing Thai cue string, cue order and `atSec` value.

**Runtime boundary:** `src/scenes/Subtitles.tsx` currently fixes portrait captions at `bottom:134px`, `left:6%`, `width:88%`; no per-scene safe-region position exists in `Scene`, validation or renderer. Per-scene subtitle placement is therefore `missing` at `9d25208`, not integrated. The `[86,468] × [690,1050]` region is a design-only handoff, not an implemented field. Boss owns the smallest shared per-scene subtitle-layout capability if required; Editor owns mapping the existing cue strings/times to it and verifying Noto Sans Thai glyphs and overlaps. No code or cue changes are included here.

The R5 point/crouch pose IDs are design-only and `missing` at `9d25208`; Issue #62 owns the shared pose implementation. Projected graphic bodies are `exists-unintegrated` for this scene path; Issue #60 owns that dependency. Editor must verify the crop and safe region with actual frames before any visual-pass claim.

## Evidence and open review

The previous C01 contact sheet is pinned to source commit `68ab92f`; it does not show the R5 owner crop, crouch, compact hand, graphic bodies or subtitle-safe region. The new camera/face crop, projected measurements, room recognition, subtitle wrapping and overlap are all **unrendered design estimates**. Keep audio/subtitle synchronization, Studio seeking and final visual QA unverified. R5 records the current script approval; this brief makes no audio or release approval claim.

See [Short index](index.md) and [delivery record](../../../scripts/cat-boxes/delivery.md).
