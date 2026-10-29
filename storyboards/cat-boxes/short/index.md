# CATBOX-SHORT storyboard index

**27 October 2026 handoff review:** Mark's synchronized scene handoff is `CATBOX-SHORT-BOARD-R6`, matched to Film brief `VB-CATBOX-SHORT-R2`. Written handoff is `ready-for-dev`: shot targets, timing, boundaries, acceptance and Boss dependencies are specified. Boss issues #60/#62/#63 and Editor's R2 timeline integration remain open implementation work. R2 camera/projection/subtitle values are not runtime or render confirmation. Earlier readiness/BOARD/Pxx labels below are historical provenance. User script approval is separate from handoff/runtime/audio readiness.


Deliverable: `CATBOX-SHORT`; selected script `scripts/cat-boxes/short/script.md` `CATBOX-C01-SHORT-R1`; fact-check `scripts/cat-boxes/short/fact-check.md`.
Film brief: [`visual-brief.md`](visual-brief.md) `VB-CATBOX-SHORT-R2` / `VD-CATBOX-SHORT-CROP-R2`; written handoff [`sc01.md`](sc01.md) revision `CATBOX-SHORT-BOARD-R6`. Source board, scene/shot/beat IDs, script, claims and frame ranges are preserved.

| Scene / selected Short shot IDs | Source beats | Frames at 30 fps | Runtime | Board / timing |
| --- | --- | --- | --- | --- |
| `CATBOX-C01-SHORT-S01` / `SH01–SH04` | `CATBOX-C01-S01-B01`–`B04` | `[0,1350)` / 45 sec | Composition `CATBOX-C01-Short`; `scripts/cat-boxes/short-c01.json` | [R6 scene sheet](sc01.md); handoff `ready-for-dev`; R2 camera/projection not applied, subtitle layout unsupported, VO/subtitle sync absent. |

The five other chapter Shorts and the former 12-scene portrait composition remain in the root-level historical index; they are not selected outputs for this delivery.

## Existing picture QA

The selected C01 45-second input has bounded CLI evidence from PR #38: A-fade preview, one-second samples, frame boundaries, remount/seek parity and loop checks. Images were generated at source commit `68ab92fbaa9a32adf054633fd5a44ad732856264` and are now referenced by immutable commit URL so generated media can remain outside the Git tree. This evidence covers picture/seek only; Short script approval is recorded separately below, while Studio playback, final narration and subtitles synchronized to audio remain unverified.

| Evidence | Image |
| --- | --- |
| C01 one-fps contact | [45-frame sheet](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/C01-one-fps-contact.jpg) |

**Readiness:** factual scope is `ready-for-storyboard`; the user approved `CATBOX-C01-SHORT-R1` on 27 October 2026 (Asia/Bangkok); Mark's R6 written handoff is `ready-for-dev`. The handoff names Boss #60/#62/#63 and Editor integration as implementation work. Runtime integration and R2 crop/projection are unverified; the projected path omits required graphic bodies and the subtitle-safe rectangle lacks runtime support. Short-specific narration/audio and subtitle sync remain absent; this is not release-ready.

The commit-pinned contact sheet documents only its historical output: Mochi and some room context are visible with screen-space text; the owner is not recognizable and the four graphic-body classes are absent. It does not prove the R2 crop, camera, poses, graphic placement, subtitle region or current render. Source inspection at `main 9d25208` is documented in R6; no new render or Studio check was made. Exact Boss and Editor dependencies and acceptance evidence are listed in the [R6 scene sheet](sc01.md#dependencies-and-open-items).
