# CATBOX delivery record

**Selection:** Short + YouTube Long. Resolved from the user's earlier explicit request for both versions and reaffirmed by the request to rework CATBOX under the new workflow on 27 October 2026 (Asia/Bangkok).

**Scope:** one standalone Short and one Long. The selected Short is existing C01 Short S01 (45 seconds), a complete, supported mini-story; the selected Long is the six-chapter episode (9 minutes). C02–C06 Short cuts and the former 12-scene portrait `Short` composition remain historical outputs from the earlier Shorts-first scope; they are not selected deliverables in this record.

**Migration rule:** keep old mixed-format source files and root storyboard packs as dated provenance. New packs below contain only the selected wording/boards. Editorial beat IDs, claim IDs, clue IDs, study language and authored artwork IDs are preserved. Runtime JSON remains at the existing paths because the current renderer imports those files directly; authoring folders add no runtime loader.

| Deliverable ID | Target / timing | Script + factual review | Visual brief + storyboard | Runtime binding | Readiness, approval and gaps |
| --- | --- | --- | --- | --- | --- |
| `CATBOX-SHORT` | 40–60s; selected timeline 45s / 1,350 frames; VO/audio `estimated` | [Short script](short/script.md) `CATBOX-C01-SHORT-R1`; [migration/fact-check record](short/fact-check.md), reusing Boat `FC-R5-C01` after unchanged-wording check | [Short brief](../../storyboards/cat-boxes/short/visual-brief.md) `VB-CATBOX-SHORT-R1`; [Short boards](../../storyboards/cat-boxes/short/index.md) `CATBOX-SHORT-BOARD-R2` | Composition `CATBOX-C01-Short`; input `short-c01.json`; 1080×1920 / 30fps. `Short` generic remains the historical 540s portrait timeline. | Factual scope ready for storyboard. User script approval pending; no narration or synced subtitle file. Prior C01 CLI picture QA is linked in the index; no new visual change was rendered. Not release-ready. |
| `CATBOX-LONG` | 9–10min; selected timeline 9:00 / 540s / 16,200 frames; VO/audio `estimated` | [Long overview](long/episode-script.md) `CATBOX-LONG-R1` + [six Long-only scripts](long/); [migration/fact-check record](long/fact-check.md), reusing FC-R5-C01 and FC-R4 after unchanged-wording check | [Long brief](../../storyboards/cat-boxes/long/visual-brief.md) `VB-CATBOX-LONG-R1`; [12-scene Long boards](../../storyboards/cat-boxes/long/index.md) `CATBOX-LONG-BOARD-R1` | Composition `Long`; input `blockout-long.json`; 1920×1080 / 30fps; `Root.tsx` binds Long to this source snapshot. | Existing script wording is fact-checked within the documented source limits. User script approval pending; Long-only boards are provisional pending visual review; full Long VO, subtitle sync, render, Studio, seek and visual QA remain unverified. Not release-ready. |

## Migration map

| Previous source | Selected pack | Change |
| --- | --- | --- |
| `ch01-script.md` R5, `## Short S01` | `short/script.md` `CATBOX-C01-SHORT-R1` | Copied exact Short S01 beat text; Long passages and mixed-version claim table excluded. |
| `ch01-script.md` R5, Long U01/U02; `ch02-script.md`–`ch06-script.md` R4, Long U01/U02 | `long/ch01-script.md`–`long/ch06-script.md` `CATBOX-Cxx-LONG-R1` | Copied exact Long sections; Short passages excluded. |
| `short-c01.md` / `.excalidraw` | `storyboards/cat-boxes/short/sc01.md` / `.excalidraw` | Same C01 Short shots; metadata paths now identify the selected pack. |
| 12 existing `ch01-sc01`–`ch06-sc02` boards | `storyboards/cat-boxes/long/` | Same Long shots/panels and scene IDs; script paths now identify Long-only files. |

Workflow reference: [PR #54](https://github.com/GuyMangkorn/reels-studio/pull/54). Merge that workflow contract before merging this migration.
