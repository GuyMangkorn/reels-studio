# CATBOX-SHORT storyboard index

**27 October 2026 handoff review:** Mark's numeric delta is recorded in revision `CATBOX-SHORT-BOARD-R3`; current handoff status remains `needs-input` pending the Boss/Editor graphic-body dependency and Film/Editor owner-crop resolution. Earlier readiness/BOARD/Pxx labels below are historical provenance. User script approval is recorded separately from handoff/runtime/audio readiness.


Deliverable: `CATBOX-SHORT`; selected script `scripts/cat-boxes/short/script.md` `CATBOX-C01-SHORT-R1`; fact-check `scripts/cat-boxes/short/fact-check.md`.
Film brief: `visual-brief.md` `VB-CATBOX-SHORT-R1`; written handoff revision `CATBOX-SHORT-BOARD-R3`. Source board and IDs are preserved from `short-c01.md` (source Mark revision 1; migrated sheet revision 2; numeric delta R3).

| Scene / selected Short shot IDs | Source beats | Frames at 30 fps | Runtime | Board / timing |
| --- | --- | --- | --- | --- |
| `CATBOX-C01-SHORT-S01` / `SH01–SH04` | `CATBOX-C01-S01-B01`–`B04` | `[0,1350)` / 45 sec | Composition `CATBOX-C01-Short`; `scripts/cat-boxes/short-c01.json` | [scene sheet](sc01.md); timing estimated, VO/subtitle sync absent. |

The five other chapter Shorts and the former 12-scene portrait composition remain in the root-level historical index; they are not selected outputs for this delivery.

## Existing picture QA

The selected C01 45-second input has bounded CLI evidence from PR #38: A-fade preview, one-second samples, frame boundaries, remount/seek parity and loop checks. Images were generated at source commit `68ab92fbaa9a32adf054633fd5a44ad732856264` and are now referenced by immutable commit URL so generated media can remain outside the Git tree. This evidence covers picture/seek only; Short script approval is recorded separately below, while Studio playback, final narration and subtitles synchronized to audio remain unverified.

| Evidence | Image |
| --- | --- |
| C01 one-fps contact | [45-frame sheet](https://github.com/GuyMangkorn/reels-studio/blob/68ab92fbaa9a32adf054633fd5a44ad732856264/out/qa/cat-boxes/pr38/pr-assets/C01-one-fps-contact.jpg) |

**Readiness:** factual scope is `ready-for-storyboard`; the user approved `CATBOX-C01-SHORT-R1` on 27 October 2026 (Asia/Bangkok). Handoff remains `needs-input`: the target owner face/working hand is not recognizable in the prior crop, and the selected projected path does not show the outline/marker, stimulus figures or pairwise figures specified in R3. No Short-specific narration or synced subtitle track exists; this is not release-ready.

The commit-pinned contact sheet documents the prior output only: Mochi and room are visible with screen-space text; the owner is not recognizable and the four graphic bodies are absent. Source inspection shows `short-c01.json` and its relevant renderer files are byte-identical between the evidence source commit `68ab92f` and `main` `b6e7d22`. The prior evidence therefore describes the same source path, but this review made no new render or Studio check. See [R3 scene-sheet evidence and dependencies](sc01.md#runtime-source-and-evidence-boundary).
