# POOLDEPTH delivery record

**Selection:** Short only. Resolved from the user's request on 27 October 2026 (Asia/Bangkok): "a new short educational Shorts". No Long.

**Style profile (coordinator defaults, user may override):** genre explainer-educational with a safety payoff; medium open for Film (user allows Blender-only or 2D rig); voice Niwat TTS; music/SFX sparse; captions outline; ending `B_loop`; factual claims: general scientific knowledge plus a safety claim, so Boat research and fact-check are required.

**Tier:** Full (Boat research → Preaw script → Boat fact-check → Film → Mark → Boss → Editor). This record covers the editorial stages only; downstream stages are not started.

| Deliverable ID | Target / timing | Script + factual review | Brief + handoff | Runtime binding | Readiness / approval / gaps |
| --- | --- | --- | --- | --- | --- |
| `POOLDEPTH-SHORT` | 40–60s; 54 s composition (1620 frames); speech measured 2026-10-28: last word ends 48.54 s, then a silent tail with the 3 s `B_loop` hold | [topic brief](topic-brief.md) R1, research R1, `short/script.md` `POOLDEPTH-SHORT-R2`; `short/fact-check.md` reviewed R2 (R1 was `revision-required`, kept as history): `ready-for-storyboard` (factual only). | Film brief `VB-POOLDEPTH-SHORT-R2`; Mark handoff `POOLDEPTH-SHORT-BOARD-R2` (`ready-for-dev`) | `integrated-unreviewed` (Editor, 2026-10-28, `claude/pool-depth-short` HEAD `434d165` + uncommitted working tree): composition `POOLDEPTH-SHORT` (1080x1920, 30 fps, 1620 frames, ending `B_loop`), registry `src/videos/pool-depth/index.ts`, timeline input `scripts/pool-depth/short/timeline.json` (8 `Scene.media` clips `public/pool-depth/shot-01..08.mp4`, local and gitignored). Subtitles: script R2 wording and BOARD-R2 caption groups, wired. Audio: **measured** (see Narration timing below): Niwat `th-TH-NiwatNeural` +5% generated with `edge-tts==7.3.1` (project-local venv `build/narration-venv`, ignored), `public/narration/POOLDEPTH-SHORT.mp3` (local, ignored) + committed `scripts/pool-depth/short/POOLDEPTH-SHORT.amplitude.json`, wired in `src/videos/pool-depth/index.ts`; caption cues retimed to the audio; no SFX, no music; not listened to by a human reviewer. Samples: 8 scene samples under ignored `out/samples/pool-depth/POOLDEPTH-SHORT/BOARD-R2-integration-2/` (set 1 `-integration-1` is superseded for SH01/SH04); full 1620-frame CLI render, contact sheets and cut/seam frames under `out/qa/pool-depth/`. Studio unverified (`DF-20261026-studio-emfile`). Shared additions pending Boss review: `eyebrowStyle`, empty caption cue, `quadTexts` | Script R2 user-approved 2026-10-27 (script only). Runtime bound and CLI-rendered, but audio measured by tool only (no listening review), no user approval of the handoff or the render, no Studio check, not release-ready. Script header factual-status line still says recheck pending (Preaw to update). |

## User decisions (dated 27 October 2026, Asia/Bangkok)

- **Script approval:** the user approved `POOLDEPTH-SHORT-R2` in chat ("อนุมัติ script R2"). Approval covers the script only, not runtime, audio or visual validation.
- **Visual medium:** the user chose Blender-only ("ใช้ Blender ล้วน"). Recorded as the style-profile visual medium; Film must verify Blender-to-runtime support in the active checkout before promising it.
- **Next stage:** Film visual/technical brief for `POOLDEPTH-SHORT` against script R2 / fact-check R2. Mark, Boss and Editor not started.

## Narration timing (measured, Editor, 2026-10-28)

Source: `scripts/pool-depth/short/narration-timeline.json` (script R2 wording, unchanged), `npm run narration -- --timeline scripts/pool-depth/short/narration-timeline.json --name POOLDEPTH-SHORT`; voice `th-TH-NiwatNeural` rate +5%; `edge-tts==7.3.1` in `build/narration-venv` (gitignored); MP3 54.024 s (ffprobe), rendered AAC 54.016 s; peak -6.3 dBFS, 0 clipped samples. Regenerating gave identical silence boundaries (deterministic). `scripts/narration.py` gained an optional per-beat `leadSec` (additive; default behavior unchanged).

| Beat / shot window | Slot | Clip length incl. TTS tail | Audible speech (slot-local) | Speech ends at frame | Slack in slot | `leadSec` |
| --- | ---: | ---: | --- | ---: | ---: | ---: |
| B01 / SH01 | 6 s (180 f) | 4.01 s | 0.18-3.13 s | F94 | 2.9 s | 0 |
| B02 / SH02 | 10 s (300 f) | 8.11 s | 0.18-7.28 s | F218 | 2.7 s | 0 |
| B03 / SH03 | 10 s (300 f) | 9.89 s | 0.19-9.02 s | F271 | 1.0 s | 0 |
| B04 / SH04 | 12 s (360 f) | 10.78 s (11.78 s with lead) | 1.18-10.92 s | F328 | 1.1 s | 1.0 s |
| B05 / SH05-SH07 | 9 s (270 f) | 8.98 s (9.00 s with lead) | 0.59-8.49 s | F255 | 0.5 s | 0.4 s |
| B06 / SH08 | 7 s (210 f) | 2.38 s | 0.18-1.54 s | F46 | hold F120-F209 silent | 0 |

Overrun finding: none. The clip lengths of B03 (9.89/10) and B05 (8.98/9) look tight only because of trailing TTS silence; audible speech ends 0.98 s and 0.5 s before the slot end. No word, speed or boundary change was needed. Chosen alignment: B04 delayed 1.0 s inside its slot (the generated "ส่วนถ้ามองเฉียง" would otherwise be spoken at F237, 1.6 s before the fixed eye swing F288-F330 and during the ratio bars) and B05 delayed 0.4 s (puts "และอย่าพุ่งหัวลงน้ำตื้น" at B05 F155, the sheet's est. F156, instead of F143; the no-diving plate still arrives about 25 frames after it, the sheet's accepted error).

Cue frames vs audio (composition-global frames; speech times are from the rendered audio):

| Cue | Global frame (old) | Audio anchor | Audio frame |
| --- | ---: | --- | ---: |
| B01 caption off | 60 (105) | sentence 1 "จริงเหรอ?" ends 1.37 s | 41 |
| B02 caption 2 on | 339 (370) | "ภาพของก้นสระ..." 5.31 s | 339 |
| B03 pour onset (picture, fixed) | 630 | "แล้ว" 4.35 s = F610, "ค่อยเท" 5.11 s = F633 (B03-local F153); "เทน้ำเบา ๆ" F159-F177 | offset: speech +3 f after stream onset, jug enters F120-F150 during "แล้ว" |
| B03 caption 2 on | 633 (630) | "ค่อยเท" | 633 |
| B04 unit 1 on | 873 (870) | "ถ้ามองตรงลงมา" 3.09 s | 873 |
| B04 unit 2 stacked on | 986 (975) | "น้ำลึกสองเมตร" 6.88 s | 986 |
| B04 ratio captions off | 1050 (unchanged) | "ราวหนึ่งเมตรครึ่ง" ends 8.95 s; bars dissolve F1050-F1068 | 1048 |
| B04 oblique caption on | 1068 (1080) | "มองเฉียง ยิ่งดูตื้นลงไปอีก" 9.13-10.93 s; swing F1068-F1110 | 1054-1108 |
| B05 caption 2 on | 1200 (1190) | "ดูป้ายบอกความลึก" 1.96 s | 1199 |
| B05 SH06 caption off | 1305 (unchanged) | "ให้ลงเท้าก่อน" ends ~5.1 s | 1293 |
| B05 SH07 caption on | 1320 (unchanged) | "และอย่าพุ่งหัวลงน้ำตื้น" 5.18-6.5 s | 1295-1335 |
| B06 caption | 1410-1619 (unchanged) | "แล้วน้ำตรงหน้าคุณตอนนี้..." 0.18-1.55 s | 1415-1457 |

Seam and hold with audio: speech ends at 48.54 s (G1456). Audio is silent from there to the end (5.47 s), so the 3 s hold (G1530-G1619) carries no speech and the audio tail does not overlap it; the closing caption stays on screen. On a loop restart the viewer hears about 5.5 s of silence (2.5 s before the hold plus the hold), then 0.18 s of lead-in and "ดูตื้นแค่เข่า" at G3; no click or level step (both sides are digital silence; the AAC adds 16 ms past the picture end). The picture seam is unchanged: this change touches captions and audio only, the clips are the same.
