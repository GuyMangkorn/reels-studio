# POOLDEPTH-SHORT scene-handoff index

Date: 2026-10-28. Deliverable `POOLDEPTH-SHORT` (Short only, Full tier; delivery record `scripts/pool-depth/delivery.md`). Style profile: explainer-educational with a safety payoff, Niwat TTS, sparse SFX, outline captions, ending `B_loop`.

| Item | Path | Revision |
| --- | --- | --- |
| Script (user-approved 2026-10-27) | `scripts/pool-depth/short/script.md` | `POOLDEPTH-SHORT-R2` |
| Fact-check (factual only) | `scripts/pool-depth/short/fact-check.md` | R2 recheck, `ready-for-storyboard` |
| Film brief | [`visual-brief.md`](visual-brief.md) | `VB-POOLDEPTH-SHORT-R1` (`VD01`–`VD11`) |
| Tooling record | `scripts/pool-depth/blender-preflight.md` | 2026-10-28 (Blender 5.2.3 LTS, MCP connected; nothing rendered) |
| **Written scene handoff** | [`sc01.md`](sc01.md) | **`POOLDEPTH-SHORT-BOARD-R1`** (Mark) |

Target checkout: branch `claude/pool-depth-short`, HEAD `59809c8`. Cut: 30 fps, 1080×1920, **1620 frames (54 s) estimated**, including a 90-frame `B_loop` hold. Timing is **estimated**, not read aloud.

## Readiness

Written handoff `ready-for-dev` for blockout and the Boss spikes. This is not user approval of the handoff, not runtime proof, not audio sync and not visual proof. No Blender asset, clip, composition or timeline exists. Spikes S0 pipeline, S1 refraction, S2 coin demo, S3 diagram geometry and S4 loop seam are **unresolved dependencies**; all numeric values in the sheet are design estimates until Boss's `build.py` and the spikes confirm them.

## Scene / shot order and timeline mapping

| Story scene | Beat | Shot IDs (`POOLDEPTH-SHORT-S01-…`) | Frames (composition = scene-local offset) | Planned `Scene` entry | Clip frames |
| --- | --- | --- | --- | --- | ---: |
| S01 | B01 hook | `SH01` | `[0,180)` | `scene[0]` | 180 |
| S01 | B02 mechanism | `SH02` | `[180,480)` | `scene[1]` | 300 |
| S01 | B03 coin demo | `SH03` | `[480,780)` | `scene[2]` | 300 |
| S01 | B04 numbers | `SH04` (states: straight down `[0,288)`, oblique `[288,360)`) | `[780,1140)` | `scene[3]` | 360 |
| S01 | B05 payoff | `SH05` sign / `SH06` feet / `SH07` pictogram | `[1140,1240)` / `[1240,1320)` / `[1320,1410)` | `scene[4]`–`scene[6]` | 100 / 80 / 90 |
| S01 | B06 loop line + hold | `SH08` (speech `[0,120)`, hold `[120,210)` shot-local) | `[1410,1620)` | `scene[7]` | 210 |

The six story beats map to eight runtime `Scene` entries (B05 is split into three clips). Total 1620 = 8 clips. Every runtime scene is `bg:'none'`, `actors:[]`, a full-frame `Scene.media` clip with no projection. Planned timeline path and composition ID (`src/videos/pool-depth/index.ts`, unique ID): **not created**, Editor decision. Runtime evidence column: none yet.

Boundaries: no neighbor scenes. The only continuity boundary is the loop seam `SH08` last frame → `SH01` frame 0, and the camera-continuous cut `SH07` → `SH08`. Both are described in the sheet.

## Constraints carried from the brief (all verified present in the sheet)

3/4 and "2 ม. → 1.5 ม." only in the `SH04` straight-down state, with "มองตรงลงมา" in the same caption unit; oblique views have no ratio; B03 coin has still eye, gentle pour, stationary coin, no keyframes; "ฉากสมมติ" visible from frame 0 through B01; B06 ends on the exact B01 frame 0; B03 and B05 get no extra words or inset; no injury, no head-first dive, no real incident or real organization's sign; no Thai text or numeral captions baked into Blender; Remotion owns text, subtitles, label, chrome and ending; Blender alone owns camera (no Remotion `pictureMove` on these clips).

## Shared elements and dependencies

| ID | Dependency | Owner | Order / consumers | Status |
| --- | --- | --- | --- | --- |
| D1 | Blender 5.2.3 + MCP + EEVEE/Cycles/export | Boss | done (tooling only) | pass; render content never inspected |
| D2 | `assets/blender/pool-depth/` source, `build.py` (Snell solver, deterministic motion, 1080×1920/30 fps/GPU), manifest, clip packaging policy (`*.mp4` gitignored) | Boss + coordinator | first; all shots | `missing` |
| D3 | Child dummy (idle + seated legs); pool set; sign post with two plates | Boss | after D2; SH01, SH05–SH08 | `missing` |
| D4 | "ฉากสมมติ" at frame 0 without fade (eyebrow without fade, or a subtitle line) | Editor / Boss | any time; SH01 | `unknown` |
| D5 | `pool-depth` composition, timeline JSON, Niwat narration, SFX pour asset | Editor | after D2 | `missing` |
| S0–S4 | Spikes (see sheet table) | Boss (Editor for S0 Remotion half) | S0 first; S1/S2/S3 in parallel; S4 last | unresolved, not run |

Findings: `DF-20261026-studio-emfile` (open): CLI stills and contact sheets only; Studio unverified. Others recorded in the sheet.

## Blockout brief (for Editor, when D2 exists)

Assemble the eight clips in order with placeholders (solid color + frame counter clips are acceptable) to check durations, caption cue ranges, the label at G0 and the seam before any polish. Review: label at G0 and G1619→G0; no ratio caption in SH04 after F270; pour onset aligned to "เทน้ำ"; SH05 caption continues across the cut into SH06. Review revision: none yet. Frame mapping evidence: none yet.

## Open questions

| # | Question | Owner |
| --- | --- | --- |
| Q1 | Does `B_loop`'s 3 s hold add frames after the last scene or live inside `scene[7]` (the sheet assumes inside, total 1620)? Does the rendered ending dip to dark (code keeps opacity 1; comment says dip)? | Editor |
| Q2 | Label at F0 mechanism (eyebrow without fade vs subtitle line)? Is a video clip allowed to loop-seam cleanly (S0 includes remount/seek parity and clip length covering the hold)? | Editor / Boss |
| Q3 | SH02 "meet at the apparent marker": Mark uses the back-extension × the vertical through the true marker (same as SH04 oblique). Confirm this meets S3's wording. | Film / Boss |
| Q4 | Sign plate shows "1.0 m" (digits + Latin unit letter). Keep the letter, or digits only? Add "ฉากสมมติ" to SH05–SH08 (the same dummy) as a taste call? | Film |
| Q5 | Audio will move B03 pour onset, B04 cue timing and B05 shot lengths. Agree that the static pre-roll (`trimStartSec`) in SH03, and cue shifts that keep order in SH04, are the retiming levers, not pour speed. | Editor / Boss |
| Q6 | Pour SFX asset, license and onset (proposed, not supplied). Music: none required. | Editor |
| Q7 | Cycles frame time on M1 8-core GPU is unmeasured for ~1,600 frames; accept EEVEE + scripted raised floor for SH01/SH05–SH08 only if S1 fails (dramatization-only). Never for SH03. | Film / Boss |
| Q8 | B04 oblique angle is a design 40° (SH02 uses 50°); Film may change. Packaging policy for Blender clips. | Film / coordinator |

Change log: `POOLDEPTH-SHORT-BOARD-R1` (2026-10-28), first scene handoff; no prior revision. Drawings are retired; no `BOARD`/`Pxx` provenance exists for this deliverable. Brief, script and fact-check unchanged.
