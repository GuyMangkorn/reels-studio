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

## Narration timing (measured, Editor, 2026-10-28, second pass after listening notes)

Source: `scripts/pool-depth/short/narration-timeline.json` (script R2 wording, unchanged), `npm run narration -- --timeline scripts/pool-depth/short/narration-timeline.json --name POOLDEPTH-SHORT`; voice `th-TH-NiwatNeural` +5%; `edge-tts==7.3.1` in `build/narration-venv` (gitignored). `scripts/narration.py` has additive optional per-beat fields `leadSec`, `closeGaps` ([[rawSec, keepSec]], shortens the silent run nearest rawSec with a 10 ms crossfade) and `trimHeadSec`, and prints a gap report (silent runs of 0.15 s or more inside speech). Text is never edited; only silence is removed or shifted. Rendered AAC 54.016 s, peak -6.3 dBFS, 0 clipped samples; not yet reviewed by ear after this pass.

Intra-phrase gaps found (raw TTS clip, 48 kHz, threshold -40 dBFS) and what was done:

| Beat | Word pair | Gap before | Gap after | Note |
| --- | --- | ---: | ---: | --- |
| B02 | "แสงเดิน" / "เป็นเส้นตรง" | 396 ms | 80 ms | hitch inside one clause |
| B03 | "ถอย" / "จนขอบแก้ว" | 308 ms | 80 ms | hitch |
| B03 | "แล้ว" / "ค่อยเท" | 514 ms | 100 ms | hitch; pour phrase moves earlier, compensated by `leadSec` |
| B03 | "เหรียญ" / "ไม่ได้ขยับเลย" | 230 ms | 120 ms | below 0.25 s, listed for completeness |
| B04 | "มองตรง" / "ลงมา" | 234 ms | 60 ms | inside the key phrase; below 0.25 s but audible |
| B05 | "ครั้งแรกที่ลงน้ำ" / "ให้ลงเท้าก่อน" | 394 ms | 150 ms | script clause space; shortened, not removed |

Untouched natural pauses: sentence ends (B01 "เหรอ?" 152 ms, B05 "ก่อน." ~150 ms, all full stops). Remaining silences inside sentences are 80-150 ms.

| Beat / shot window | Slot | Offsets (`leadSec`, other) | Audible speech in the render (slot-local) | Speech ends at frame | Slack in slot |
| --- | ---: | --- | --- | ---: | ---: |
| B01 / SH01 | 6 s | head trimmed to 0.04 s | 0.04-2.99 s | F90 | 3.0 s |
| B02 / SH02 | 10 s | lead 0.2 | 0.30-7.15 s | F215 | 2.85 s |
| B03 / SH03 | 10 s | lead 0.4 | 0.57-8.63 s | F259 | 1.4 s |
| B04 / SH04 | 12 s | lead 1.18 | 1.36-10.92 s | F328 | 1.1 s |
| B05 / SH05-07 | 9 s | lead 0.55 | 0.74-8.39 s | F252 | 0.6 s |
| B06 / SH08 | 7 s | lead 1.9 | 2.08-3.45 s (F62-F103) | F103 | hold F120-F209 silent |

B03 and B05 fit with margin; no overrun, no word or speed change. Pour onset: stream F150 (G630); "ค่อย" at B03 F146, "เท" at F152 (offset -4/+2 frames); caption "เทน้ำ แล้วเหรียญโผล่" on at F150.

Ending silence (loop point), measured on the rendered MP4:

| | Before (pass 1) | After |
| --- | ---: | ---: |
| Last word ends | 48.54 s (G1456) | 50.44 s (G1513, SH08 F103) |
| Silence from last word to end of video | 5.47 s | 3.57 s (of which the 3 s hold is G1530-G1619, so only 0.57 s lies before it, and SH08 F103 is 17 frames before the hold) |
| Head silence of the restarted video | 0.18 s | about 0.04 s |
| Total silence across the loop restart | about 5.65 s | about 3.6 s (hold floor 3.0 s) |

Trade-off: the B06 line now starts at SH08 F62 (the pull-back eases until F90), so the silence between B05 and B06 grew from 0.66 s to 2.69 s; it lies over the silent camera pull-back. The hold and the loop seam were not changed; the floor of dead air at the loop is the fixed 3 s hold plus the 17-frame speech-free tail the sheet requires.

Cue frames vs audio (composition-global frames):

| Cue | Global frame (pass 1) | Audio anchor in the render | Audio frame |
| --- | ---: | --- | ---: |
| B01 caption off | 60 (60) | "เหรอ" ends 1.24 s | 37 |
| B02 caption 2 on | 336 (339) | "ภาพของก้นสระ" | 336 |
| B03 caption 2 on | 630 (633) | "ค่อยเท" (stream onset 630) | 626-632 |
| B04 unit 1 on | 878 (873) | "ถ้ามองตรงลงมา" | 878 |
| B04 unit 2 stacked on | 987 (986) | "น้ำลึกสองเมตร" | 987 |
| B04 ratio captions off | 1050 | "ราวหนึ่งเมตรครึ่ง" ends | 1048 |
| B04 oblique caption on | 1068 | "มองเฉียง ยิ่งดูตื้นลงไปอีก"; eye swing F1068-F1110 | 1059-1102 |
| B05 caption 2 on | 1203 (1200) | "ดูป้ายบอกความลึก" | 1203 |
| B05 SH06 caption off / SH07 on | 1305 / 1320 | "ก่อน." ends ~1290; "และอย่าพุ่งหัว" 1292-1328 | |
| B06 caption | 1410-1619 | "แล้วน้ำตรงหน้าคุณตอนนี้..." | 1470-1513 |

B04 constraint re-checked: the numeric captions exist only between F878 and F1050 (straight-down state), always with "มองตรงลงมา" (test scans all 1620 frames); the oblique caption starts at F1068 after the bars are gone, with no number. Loop restart: about 3.6 s of silence, then "ดูตื้นแค่เข่า" at G1-G3 with no click (silence on both sides). Picture seam unchanged (clips and picture timing untouched).

## Remaining work (dated 28 October 2026, Asia/Bangkok)

- **Open item: audio editing only.** Picture, captions and runtime binding are in place. The user reported on 28 Oct that the Niwat voice is not good enough and that a new audio-editing principle will be supplied; the remaining stage is the audio edit against that principle (voice choice, gap/pause handling, loop-point silence).
- **Candidate voice route:** the user may generate narration with Botnoi from [short/botnoi-script.md](short/botnoi-script.md) (six per-beat files, exact script R2 wording). Record voice name and license terms in this record before use. Editor places the files, measures gaps/durations and retimes captions.
- **Not done:** listening review by a human, Studio check (`DF-20261026-studio-emfile`), Boss review of the shared fields, user approval of the handoff and render. Not release-ready.
- PR is opened as a **draft** to checkpoint the work; the new audio principle will be applied on this branch.
