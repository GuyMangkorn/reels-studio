# POOLDEPTH-SHORT scene-handoff index

Date: 2026-10-28. Deliverable `POOLDEPTH-SHORT` (Short only, Full tier; delivery record `scripts/pool-depth/delivery.md`). Style profile: explainer-educational with a safety payoff, Niwat TTS, sparse SFX, outline captions, ending `B_loop`.

| Item | Path | Revision |
| --- | --- | --- |
| Script (user-approved 2026-10-27) | `scripts/pool-depth/short/script.md` | `POOLDEPTH-SHORT-R2` |
| Fact-check (factual only) | `scripts/pool-depth/short/fact-check.md` | R2 recheck, `ready-for-storyboard` |
| Film brief | [`visual-brief.md`](visual-brief.md) | `VB-POOLDEPTH-SHORT-R2` (`VD01`–`VD11`, `R2-D1`–`R2-D5`) |
| Tooling record | `scripts/pool-depth/blender-preflight.md` | 2026-10-28 (Blender 5.2.3 LTS, MCP connected; nothing rendered) |
| **Written scene handoff** | [`sc01.md`](sc01.md) | **`POOLDEPTH-SHORT-BOARD-R2`** (Mark; supersedes R1) |

Target checkout: branch `claude/pool-depth-short`, HEAD `634c4bf` (R1 was written at `59809c8`). Boss evidence: `assets/blender/pool-depth/manifest.md`, `scripts/pool-depth/spike-results.md`, `assets/blender/pool-depth/plate-quads-SH05.json`. Cut: 30 fps, 1080×1920, **1620 frames (54 s) estimated**, including a 90-frame `B_loop` hold. Timing is **estimated**, not read aloud.

## Readiness

Written handoff R2 `ready-for-dev` for blockout and clip rendering, against brief `VB-POOLDEPTH-SHORT-R2` (status `ready-for-mark`). This is not user approval of the handoff, not runtime proof, not audio sync and not visual proof. Boss's Blender source exists and spikes S0–S4, D3 and SH03 **pass on stills and numeric checks** (`spike-results.md`); the sheet now carries Boss's measured values where marked *measured*. **No clip is rendered or encoded; no composition or timeline exists; Studio is unverified.** Still unproven: label "ฉากสมมติ" at F0 with no fade, encoded-seam parity, `B_loop` hold with real frames, ripple shimmer in a played clip, SH05 text legibility.

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

3/4 and "2 ม. → 1.5 ม." only in the `SH04` straight-down state, with "มองตรงลงมา" in the same caption unit; oblique views (SH04 oblique, SH01, SH05–SH08) have no ratio, number or depth caption (R2 honesty rule 6; the measured lift at the pool-edge camera is stronger than the R1 estimate and is never captioned); B03 coin has still eye, gentle pour, stationary coin, no keyframes, no hand; SH05 depth plate quad ≥45% of frame width on every frame F0–F99 (45% rule, `plate-quads-SH05.json`); "ฉากสมมติ" on B01 only (coordinator decision Q4b); "ฉากสมมติ" visible from frame 0 through B01; B06 ends on the exact B01 frame 0; B03 and B05 get no extra words or inset; no injury, no head-first dive, no real incident or real organization's sign; no Thai text or numeral captions baked into Blender; Remotion owns text, subtitles, label, chrome and ending; Blender alone owns camera (no Remotion `pictureMove` on these clips).

## Shared elements and dependencies

| ID | Dependency | Owner | Order / consumers | Status |
| --- | --- | --- | --- | --- |
| D1 | Blender 5.2.3 + MCP + EEVEE/Cycles/export | Boss | done (tooling only) | pass; render content never inspected |
| D2 | `assets/blender/pool-depth/` source, `build.py` (Snell solver, deterministic motion, 1080×1920/30 fps/GPU), manifest, clip packaging policy (clips and `renders/` not committed; per-clip record in the manifest) | Boss + coordinator | first; all shots | source `exists-unintegrated`; clips `missing` |
| D3 | Child dummy (idle + seated legs); pool set; sign post with two plates | Boss | after D2; SH01, SH05–SH08 | `exists-unintegrated` (source-ready, stills only, look not final) |
| D4 | "ฉากสมมติ" at frame 0 without fade (eyebrow without fade, or a subtitle line) | Editor / Boss | any time; SH01 | `unknown` |
| D5 | `pool-depth` composition, timeline JSON, Niwat narration, SFX pour asset | Editor | after D2 | `missing` |
| S0–S4 | Spikes (see sheet table) | Boss (Editor for S0 Remotion half) | S0 first; S1/S2/S3 in parallel; S4 last | pass on stills / numeric checks (clip-level and Studio proof open) |

Findings: `DF-20261026-studio-emfile` (open): CLI stills and contact sheets only; Studio unverified. Others recorded in the sheet.

## Blockout brief (for Editor, when D2 exists)

Assemble the eight clips in order with placeholders (solid color + frame counter clips are acceptable) to check durations, caption cue ranges, the label at G0 and the seam before any polish. Review: label at G0 and G1619→G0; no ratio caption in SH04 after F270; pour onset aligned to "เทน้ำ"; SH05 caption continues across the cut into SH06. Review revision: none yet. Frame mapping evidence: none yet.

## Open questions

| # | Question | Owner |
| --- | --- | --- |
| Q1 | Does `B_loop`'s 3 s hold add frames after the last scene or live inside `scene[7]` (the sheet assumes inside, total 1620)? Does the rendered ending dip to dark (code keeps opacity 1; comment says dip)? | Editor |
| Q2 | Label at F0 mechanism (eyebrow without fade vs subtitle line)? Is a video clip allowed to loop-seam cleanly (S0 includes remount/seek parity and clip length covering the hold)? | Editor / Boss |
| Q3 | SH02 "meet at the apparent marker": back-extension × the vertical through the true marker (same as SH04 oblique). **Closed (R2):** Boss's S3 pass builds exactly this (line crosses the marker vertical at z -1.17871 in SH02 and -1.31197 in SH04, ghost ball equal within 6e-8 u) and the brief R2 raises no objection; Film may reopen. | Film / Boss (closed) |
| Q4 | **Closed (R2):** sign text is `1.0 m`, rendered by Remotion on the quad of `plate-quads-SH05.json` (coordinator Q4a; blank plate in Blender); "ฉากสมมติ" on B01 (SH01) only, not on SH05–SH08 (Q4b; brief honesty rule 4). New open item Q9 below. | Film / coordinator (closed) |
| Q5 | Audio will move B03 pour onset, B04 cue timing and B05 shot lengths. Agree that the static pre-roll (`trimStartSec`) in SH03, and cue shifts that keep order in SH04, are the retiming levers, not pour speed. | Editor / Boss |
| Q6 | Pour SFX asset, license and onset (proposed, not supplied). Music: none required. | Editor |
| Q7 | **Narrowed (R2):** Cycles passed S1 and the D3 oblique check; frame time is measured on stills (`spike-results.md`: about 4.7–6.2 h estimated for 1,620 frames, none rendered). The EEVEE fallback is not needed now; if ever used it covers SH01/SH05–SH08 only, never SH03 (SH03 stays Cycles). | Film / Boss |
| Q8 | **Narrowed (R2):** B04 oblique angle 40° is built and passes S3 (SH02 uses 50°); it stays unless Film changes it. Packaging decided (coordinator Q8b): clips and renders are not committed; Boss records codec, size, SHA-256, frames and command per clip in the manifest. | Film (angle) |
| Q9 | SH05 legibility: Editor overlays `1.0 m` on the quad and checks cap height ≈100 px or more and text width ≈70% of the quad (estimates). On failure return `VD07` to Film (fallback: F0 camera about 0.15 m closer, re-run `build.py -- d3`). | Editor / Film |

Change log:

- `POOLDEPTH-SHORT-BOARD-R2` (2026-10-28, Mark): revised against `VB-POOLDEPTH-SHORT-R2` (Film rulings `R2-D1`–`R2-D5`) and Boss's measured values. Per-shot changes are listed in the change log of [`sc01.md`](sc01.md): SH01 measured layout and camera target, no sign-post claim; SH03 coin x 2.3 cm / 1.5 mm, aim `(0,0,9)` cm, mug box, caption-zone check, pitcher on -y and no hand, measured reveal (≈95%); SH04 eye swing at constant height and dashed extension; SH05 45% plate rule, target x 1.4, text on the quad; SH06 ankle z -0.158, hip joint; sign yaw -40°. Q3 closed, Q4 closed, Q7/Q8 narrowed, Q9 added. Story, timing, VO, subtitles, claims and honesty rules unchanged.
- `POOLDEPTH-SHORT-BOARD-R1` (2026-10-28): first scene handoff. Drawings are retired; no `BOARD`/`Pxx` provenance exists for this deliverable. Script and fact-check unchanged in R2.
