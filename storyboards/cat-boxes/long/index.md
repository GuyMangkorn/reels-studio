<a id="catbox-long-storyboard-index"></a>
# CATBOX-LONG written scene-handoff index

**27 October 2026 handoff migration:** Drawings are retired; this written source retains its timing and stable IDs. Current handoff status: `needs-input` until Mark audits coordinate/anchor/camera details against the [written-handoff migration](../handoff-migration.md). Earlier readiness/BOARD/Pxx labels below are historical provenance. This edit creates no element captures, scene samples or new runtime/visual/audio approval.


Deliverable: `CATBOX-LONG`; script `scripts/cat-boxes/long/episode-script.md` `CATBOX-LONG-R1`; six Long chapter scripts `CATBOX-C01-LONG-R1`–`C06-LONG-R1`; fact-check migration record `scripts/cat-boxes/long/fact-check.md`.
Film brief: `visual-brief.md` `VB-CATBOX-LONG-R1`; retained planning revision: `CATBOX-LONG-BOARD-R1`; source scene and shot IDs are preserved.

| Order | Chapter / scene | Composition range at 30fps | Source beats | Mark written scene sheet · Long pack R1 |
| ---: | --- | --- | --- | --- |
| 1 | `C01 / C01-S01` | 00:00–00:45 · `[0,1350)` | `CATBOX-C01-U01-B01–B04` | [ch01-sc01.md](ch01-sc01.md) |
| 2 | `C01 / C01-S02` | 00:45–01:30 · `[1350,2700)` | `CATBOX-C01-U02-B01–B04` | [ch01-sc02.md](ch01-sc02.md) |
| 3 | `C02 / C02-S01` | 01:30–02:15 · `[2700,4050)` | `CATBOX-C02-U01-B01–B04` | [ch02-sc01.md](ch02-sc01.md) |
| 4 | `C02 / C02-S02` | 02:15–03:00 · `[4050,5400)` | `CATBOX-C02-U02-B01–B04` | [ch02-sc02.md](ch02-sc02.md) |
| 5 | `C03 / C03-S01` | 03:00–03:45 · `[5400,6750)` | `CATBOX-C03-U01-B01–B04` | [ch03-sc01.md](ch03-sc01.md) |
| 6 | `C03 / C03-S02` | 03:45–04:30 · `[6750,8100)` | `CATBOX-C03-U02-B01–B04` | [ch03-sc02.md](ch03-sc02.md) |
| 7 | `C04 / C04-S01` | 04:30–05:15 · `[8100,9450)` | `CATBOX-C04-U01-B01–B04` | [ch04-sc01.md](ch04-sc01.md) |
| 8 | `C04 / C04-S02` | 05:15–06:00 · `[9450,10800)` | `CATBOX-C04-U02-B01–B04` | [ch04-sc02.md](ch04-sc02.md) |
| 9 | `C05 / C05-S01` | 06:00–06:45 · `[10800,12150)` | `CATBOX-C05-U01-B01–B04` | [ch05-sc01.md](ch05-sc01.md) |
| 10 | `C05 / C05-S02` | 06:45–07:30 · `[12150,13500)` | `CATBOX-C05-U02-B01–B04` | [ch05-sc02.md](ch05-sc02.md) |
| 11 | `C06 / C06-S01` | 07:30–08:15 · `[13500,14850)` | `CATBOX-C06-U01-B01–B04` | [ch06-sc01.md](ch06-sc01.md) |
| 12 | `C06 / C06-S02` | 08:15–09:00 · `[14850,16200)` | `CATBOX-C06-U02-B01–B04` | [ch06-sc02.md](ch06-sc02.md) |

The timeline source is `scripts/cat-boxes/blockout-long.json`, 12 × 45 seconds / 540 seconds; `src/Root.tsx` registers it for `Long` (1920×1080, 30fps). Runtime `Scene[]` entries do not carry the story-scene IDs, so this table maps scene order 1–12 to zero-based `scene[0]`–`scene[11]`. Timing and shot maps are estimates inherited from the matched Long blocks.

**Historical planning readiness:** the 12 source sheets were historically marked `ready-for-dev` in the mixed-format source pack; source beat IDs and Long action content are retained, while the selected copies now show Long panels only. The Long-only migration is `provisional` until Mark audits the written staging/coordinate/camera contract and Mark/Film review Editor's actual blockout. The 9-minute Long composition has no render/Studio/seek/visual QA in PR #38, so runtime and release readiness remain `unverified`. No new Long visual approval is claimed.
