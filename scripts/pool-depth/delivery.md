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
- **Candidate voice route:** the user may generate narration with Botnoi from [short/botnoi-script.md](short/botnoi-script.md) (six per-beat files, exact script R2 wording). Record voice name and license terms in this record before use (trial recorded in the Botnoi section below; license unverified). Editor places the files, measures gaps/durations and retimes captions.
- **Not done:** listening review by a human, Studio check (`DF-20261026-studio-emfile`), Boss review of the shared fields, user approval of the handoff and render. Not release-ready.
- PR is opened as a **draft** to checkpoint the work; the new audio principle will be applied on this branch.

## Botnoi narration trial (Editor, 28 October 2026, Asia/Bangkok; trial render, not a replacement)

**Status:** additive trial composition `POOLDEPTH-SHORT-BOTNOI` (same picture and 1620 frames; the Niwat `POOLDEPTH-SHORT` composition, MP3, timeline and amplitude are unchanged). Files: `short/narration-timeline-botnoi.json` (per-beat edit parameters), `scripts/narration_files.py` (assembler, uses the `narration.py` helpers; `narration.py` only moved its `edge_tts` import into `main()`), `short/POOLDEPTH-SHORT-BOTNOI.amplitude.json`, `short/captions-botnoi.json` (retimed cues for scenes 1, 3, 4, 5), registry entry in `src/videos/pool-depth/index.ts`. Source files: `public/narration/botnoi/B01..B06.mp3` (local, ignored; mono, 22.05 kHz MP3). Generated track `public/narration/POOLDEPTH-SHORT-BOTNOI.mp3` (local, ignored). Reproduce: `python3 scripts/narration_files.py --timeline scripts/pool-depth/short/narration-timeline-botnoi.json --name POOLDEPTH-SHORT-BOTNOI --dir public/narration/botnoi`, then `node scripts/render.mjs POOLDEPTH-SHORT-BOTNOI --endings=B_loop` (output `out/POOLDEPTH-SHORT-BOTNOI/`).

**Voice and license (record exactly):** user-stated: purchased with own credits, believes production use is allowed; Botnoi terms not independently verified (not found by web search 2026-10-28); voice name/plan still unknown; keep the Botnoi terms page/plan receipt as evidence. Not recorded as licensed or verified.

**Text check:** only duration and structure were measured, not pronunciation or the spoken words (no listening and no speech recognition available). Syllable counts per segment are consistent with script R2 for every file (about 4.3-5.8 syllables/s, 100-400 ms pauses at the sentence and clause breaks), so no file suggests missing or added words; a human listen is still required.

### Measured files (threshold -40 dBFS, raw files)

| File | Length | Speech start-end | Speech length | Script max | Internal gaps at least 0.15 s (raw file time) | Loudness / peak |
| --- | ---: | --- | ---: | ---: | --- | --- |
| B01 | 3.785 | 0.160-3.692 | 3.53 | 4.5 | 1.550-1.715 (after "จริงเหรอ?") | -19.2 LUFS, 0 dBFS, 4 clipped samples |
| B02 | 7.941 | 0.165-7.788 | 7.62 | 9.0 | 2.942-3.147, 5.464-5.666 (sentence ends); 1.202-1.342 (141 ms) | -17.2 LUFS, 0 dBFS, 1 clipped |
| B03 | 10.243 | 0.165-10.080 | 9.91 (over 9.4) | 9.4 | 1.064-1.438, 2.719-3.156, 5.693-5.915 ("หัว"/"แล้วค่อยเท"), 7.021-7.305; 4.831-4.954 (123 ms) | -16.8 LUFS, 0 dBFS, 2 clipped |
| B04 | 12.042 | 0.166-11.875 | 11.71 (over 10.5) | 10.5 | 2.820-3.196, 9.184-9.536 (sentence ends); 4.234-4.368, 7.792-7.934, 10.590-10.727 (about 135-142 ms); none inside "ถ้ามองตรงลงมา" (3.196-4.234 continuous) | -18.0 LUFS, 0 dBFS, 3 clipped |
| B05 | 10.447 | 0.145-10.309 | 10.17 (over 8.0) | 8.0 | 2.041-2.414, 3.457-3.858, 5.879-6.233, 7.720-7.882, 8.982-9.217 | -18.7 LUFS, 0 dBFS, 2 clipped |
| B06 | 1.927 | 0.163-1.812 | 1.65 | 1.7 | 0.566-0.824 (inside "แล้วน้ำ/ตรงหน้า...", 259 ms) | -16.5 LUFS, 0 dBFS, 1 clipped |

Word-pair level labels above are inferred from syllable counts and the energy envelope, not from recognition. The files peak at full scale (a few clipped samples each, likely MP3 decode overshoot). Loudness differs by up to 2.7 LU between files (B01 -19.2 vs B06 -16.5, the loop pair), so a per-beat attenuation-only correction `gainDb` (0, -2.0, -2.0, -1.0, -0.5, -2.5) levels them to about -19 LUFS; no per-word gain.

### Fit to the fixed shot windows

Edits applied in order: trim head to 0.04 s, shorten gaps (`closeGaps`, 10 ms crossfade), pitch-preserving `atempo` where needed (Remotion ffmpeg `atempo`, 3-5%, inside the 8% ceiling), `gainDb`, `leadSec`. No words changed.

| Beat / window | Slot | Speech in render (slot-local) | Edits | Slack | Verdict |
| --- | ---: | --- | --- | ---: | --- |
| B01 / SH01 | 6 s | 0.04-3.57 s (F1-F107) | head trim only | 2.4 s | fits as is |
| B02 / SH02 | 10 s | 0.29-7.91 s (F9-F237) | head trim, lead 0.25 | 2.1 s | fits; sentence 3 "ภาพของก้นสระ" starts F174, ghost marker F200-F230 falls inside it |
| B03 / SH03 | 10 s | 0.03-8.81 s (F1-F264) | head trim, gaps 375->170, 437->100, 123->70, 222->60 ms, tempo 1.04 | 1.2 s | fits; "ค่อย" estimated at F151.7, "เท" F156.9 vs pour onset F150 (+2 / +7 frames; estimate from the energy envelope, not recognition). Without tempo it would be +8/+13 frames late |
| B04 / SH04 | 12 s | 0.04-11.75 s (F1-F352) | head trim only | 0.25 s (7 frames) | fits although speech (11.71 s) exceeds the script's 10.5 s guide; Niwat's 1.18 s lead is not needed. "ถ้ามองตรงลงมา" F92, "น้ำลึกสองเมตร" F208, "ราวหนึ่งเมตรครึ่ง" ends F272, "ส่วนถ้ามองเฉียง" starts F282 (eye swing F288-F330) |
| B05 / SH05-07 | 9 s | 0.03-8.77 s (F1-F263) | head trim, gaps 373->150, 401->100, 354->150, 162->80, 235->100 ms, tempo 1.05 | 0.23 s (7 frames) | fits, tightest beat: speech 8.74 s vs the 8.0 s guide, sentence pauses about 140 ms (shorter than natural), 5% faster. "และอย่าพุ่งหัว" F154 (sheet estimate F156), "ป้ายห้ามดำ" about F246 inside SH07 |
| B06 / SH08 | 7 s | 1.64-3.29 s (F49-F99) | head trim, lead 1.6 | 3.7 s | fits; ends 21 frames before the hold (F120), silence B05 end to B06 start about 1.8 s (Niwat 2.7 s) |

No beat needs a picture or script change. Options if a listening review rejects the B05 compression: ask Botnoi for B05 at a slightly faster speed or split into two takes (the speech cannot lengthen the slot), or Mark/picture changes (not requested).

### Render check (CLI, full range, B_loop)

`out/POOLDEPTH-SHORT-BOTNOI/POOLDEPTH-SHORT-BOTNOI.mp4`: 1080x1920, 30 fps, 1620 frames, h264 54.000 s + AAC 54.016 s, peak -3.2 dBFS, 0 clipped samples. Speech runs measured on the rendered audio match the table (B01 F1-F107, B03 from G(480+1), B04 end F1133, B05 end F1403 vs cut F1410, B06 G1479-G1508). Caption cue vs audio frames (global): caption 2 of SH02 on G354 vs sentence 3 G354; SH04 unit 1 on G873 vs "ถ้ามองตรงลงมา" G872; unit 2 on G989 vs "น้ำลึกสองเมตร" G988; numeric captions off G1050 vs "ครึ่ง" ends G1052; oblique caption G1068 (unchanged) vs "ส่วนถ้ามองเฉียง" G1062; SH05 caption 2 on G1199 vs "ดูป้ายบอกความลึก" G1197. Adjacent frames G872/873, G1049/1050, G1067/1068, G988/989, G1198/1199, G353/354 inspected. B04 constraint: tests `Botnoi captions keep the SH04 straight-down constraint` scan all 1620 frames (no numeric caption outside G870-G1050 or without "มองตรงลงมา"); the oblique caption has no number. Loop point: last word ends G1508, then 3.76 s silence to the end (hold floor 3.0 s; Niwat 3.57 s), restart head silence 0.04 s; about 3.8 s total across the restart. Gap after B01 (speech ends 3.57 s of a 6 s slot, B02 starts 6.28 s) is 2.7 s of silence, as with Niwat. Not listened to by a human; Studio unchecked; no approval.
