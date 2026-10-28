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

**Voice decision (user, 28 Oct 2026):** after the trial render the user chose to continue with the Botnoi voice ("ใช้ Botnoi ต่อ"). `POOLDEPTH-SHORT-BOTNOI` is the selected-voice composition; the Niwat composition `POOLDEPTH-SHORT` is kept as the fallback until the Botnoi version is listened to and approved. This records the voice choice only: no listening approval, no license verification, not release-ready.

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


## Botnoi sound design (Editor, 28 October 2026, Asia/Bangkok; `POOLDEPTH-SHORT-BOTNOI` only)

**Decision record:** the user asked for sound effects and background music (28 Oct 2026). This supersedes the earlier defaults "no pour SFX / no music" in the visual brief (`VD09`), `sc01.md` and the style profile above for the **Botnoi composition only**; the Niwat composition `POOLDEPTH-SHORT` is untouched (no `sfx`, no `audio`; a test pins this). Scope and tier unchanged. Not listened to by a human; measured only. No approval, no release claim.

**Mechanism (no new runtime fields):** registry `src/videos/pool-depth/index.ts` exports `botnoiSfx` (per-scene `scene.sfx[]`) and `botnoiAudio` (`video.audio[]`) and applies them to the Botnoi composition only ([toolkit 10a](../../docs/remotion-toolkit.md#10a-footage-stills-music-entry-transitions-and-caption-styles)). Static per-entry `volume`; ducking through `duckUnderNarration` with the Botnoi amplitude envelope (toolkit duck: full duck when the envelope is at least 0.08, plus or minus 8 frames). Sounds were searched in the shared library first: no water, pour, feet or reveal sound existed (generated), `whoosh_air-swish-rising_01`, `whoosh_fast-slide_01` and `ui_pop_01` were reused; the existing 32 s music beds were not used because no bar-aligned way to reach 54 s with a seamless wrap exists, so a 54 s bed was generated.

### Cue plan

Frames are composition-global (30 fps). Levels are the entry `volume` (20 log10: 0.1 = -20 dB, 0.2 = -14 dB). "Gap" = narration envelope at most 0.03 (measured on `POOLDEPTH-SHORT-BOTNOI.amplitude.json`). Files copied to `public/sfx` / `public/audio` with a `NOTICE`.

| Cue | Picture event (frame) | Sound ID (library path) | Level | Notes |
| --- | --- | --- | ---: | --- |
| Pool ambience A | SH01 / B01, G0-G210 (fade-out G174-G210) | `water_pool-hall-ambience_01` (`ambience/water/`, derived 54 s `water_pool-hall-bed-53s_01`) | 0.10, duck 0.6 | pool space; no events; gone during the diagrams |
| Pool ambience B | SH06-SH08 / B05-B06, G1230 fade-in 1 s to G1620 | same file, `trimStartSec` 41 (file time = composition time) | 0.10, duck 0.6 | runs to the loop point without a fade |
| Music bed | whole video G0-G1620 | `bed_pool-curious-sparse_01` (`music/bed/`, derived 54 s `bed_pool-curious-sparse-53s_01`) | 0.20, duck 0.4 | sparse marimba/glass bell/pad, 90 bpm, no vocals; no fades |
| Ray draw | SH02 F0, G181 (speech starts G188) | `whoosh_air-swish-rising_01` (`sfx/whoosh/`) | 0.18 | quiet air swish in the gap before B02 |
| Ghost marker | SH02 F199, G379 (gap G377-G381) | `ui_pop_01` (`sfx/ui/`) | 0.10 | marker pop is inside sentence 3, so very low |
| Pour | SH03 F150, G630 stream onset | `water_mug-pour-soft_01` (`sfx/water/`, new) | 0.20 | file starts at stream onset; "ค่อยเท" is G626-G632, so the quiet first 0.3 s of the file sits under it; fades out 400 ms |
| Coin rises | SH03 F176, G656 (gap G656-G664; coin visible G640, 80% at G685) | `reveal_glass-shimmer-soft_01` (`sfx/reveal/`, new) | 0.25 | soft accent, 300 ms fade-out; the tail decays under "ภาพของเหรียญ" |
| State change | SH04 F273, G1053 (gap G1052-G1063; eye swing starts G1068) | `whoosh_fast-slide_01` | 0.16 | straight-down to oblique; 8 frames long, fits the gap |
| Sign cut | SH05 F0, G1140 (gap G1133-G1141) | `ui_pop_01` | 0.10 | cut to the pictogram |
| Feet enter water | SH06 F42 start, entry peak G1291 (gap G1289-G1293; feet reach final depth F55 = G1295) | `water_pool-feet-enter-soft_01` (`sfx/water/`, new) | 0.11 | soft entry with small ripples, **no splash** (brief SH06: no splash/injury imagery); file trimmed 0.4 s so only the last 9 frames before the peak lie over "ก่อน"; the tail runs under "และอย่าพุ่งหัว" so it is the quietest cue |

Not added (restraint): sounds on SH04 bar growth (inside "ถ้ามองตรงลงมา" and "น้ำลึกสองเมตร"), SH07 plate, SH08 pull-back (ambience and music carry it).

### Generation and library additions

audio-studio MCP, Stable Audio 3 medium, `steps` 8, `cfg` 1.0, `variations` 3 (SFX) or 2 (ambience, music); seeds 1101 (pour), 2201 (feet), 3301 (shimmer), 4401 (ambience), 5501 (music); prompts and seeds are in each library sidecar. Candidates picked by measurement only (duration, peak, 50 ms RMS envelope, spectral centroid/flatness); **no listening was possible** (`listened: no` in every sidecar): pour v1 (quiet 0.3 s onset, steady, monotone decay), feet v1 (a distinct +7 dB entry at 0.7 s; v2, v3 were flat), shimmer v1 (v2 needed a -1.76 dB ceiling, near-clip), ambience v1 (stable -34/-35 dB RMS), music v1 (steady -18 dB after a 1 s swell; v2 builds from -27 to -17 dB). Processed to 48 kHz: SFX trim + peak -1 dBFS + fades; ambience loudness -14 LUFS + 2 s loop crossfade (28 s); music loudness -14 LUFS (54 s, linear). Added to `/Users/mangkornkatawong/Documents/ChatGPT/sound-library/` (sidecars with `library` block, `INDEX.md` rows): `sfx/water/water_mug-pour-soft_01`, `sfx/water/water_pool-feet-enter-soft_01`, `sfx/reveal/reveal_glass-shimmer-soft_01`, `ambience/water/water_pool-hall-ambience_01`, `music/bed/bed_pool-curious-sparse_01`. License: Stability AI Community License of the weights (library `NOTICE.md`; commercial-use eligibility is the user's decision).

Beds are built by `scripts/pool-depth/short/build-sound-beds.py` (ffmpeg + Python, reproducible): ambience is tiled to exactly 54.000 s and both beds get a 2 s equal-power wrap crossfade by rotation (`out = X[2:54] + crossfade(X[52:54], X[0:2])`), so the last sample neighbours the first and file time equals composition time. The two 15.5 MB WAVs are **not committed** (generated, reproducible); the 6 small SFX copies and the two `NOTICE` files are the only new media.

### Mix and measurements (render `out/POOLDEPTH-SHORT-BOTNOI/POOLDEPTH-SHORT-BOTNOI_B_loop.mp4`, CLI full range)

Target: [EP08a](../../docs/editor-principles.md#ep08a-shape-audio-emphasis-by-story-beat) default delivery check, integrated about -14 LUFS with true peak at most -1 dBTP. **Not met, deliberately not forced:** the Botnoi narration is leveled to about -19 LUFS (the edit levels files, never riding gain) and Remotion has no limiter, so the render measures **-19.5 LUFS integrated, LRA 5.0 LU, true peak -3.1 dBFS, no clipping**. Voice-only render: -19.0 LUFS, -3.3 dBFS. Reaching -14 would need about +5.5 dB and a limiter in a post-render master (not done); platform playback normalization decides what that means. Remotion places the mono narration at 0.703 gain (-3 dB) in each stereo channel (measured by regression), so speech reads -21.2 dBFS RMS per channel.

Narration intelligibility proxy (added sound = render minus gain-compensated narration, RMS over speech frames, per channel, left/right):

| Measure | Value |
| --- | --- |
| Music plus beds plus SFX under speech (all speech frames) | -36.4 / -37.1 dBFS against speech -21.2 = margin **15.3 / 15.9 dB** |
| Same sounds in speech gaps | -31.8 / -32.7 dBFS |
| Music alone in speech (model, duck 0.4) | about -37.6 dBFS; beds -48 to -52 dBFS (model checked against the render within 1 dB) |
| Weakest 1 s window with at least 20 speech frames | 11.4 dB (G1275, feet) left / 12.1 dB (G1320) right |
| Per cue, 1.2 s window, speech frames only | ray 13.2, ghost 15.2, pour 13.5, shimmer 14.3, state change 16.1, sign 15.3, feet 11.2 dB (left channel; right is 0.5-2.5 dB higher) |

The pour (broadband, centroid 3.7 kHz) and the feet tail sit in the consonant band, so their 11-14 dB margins are the ones to listen to first. A level-only proxy; not a measure of Thai consonant clarity.

**Loop seam (B_loop):** picture unchanged, the video stream is byte-identical to the previous render (`ffmpeg -map 0:v -f md5` equal), so the SH08 -> SH01 picture seam and all frame counts (1620) are as before. Audio: the beds are one continuous 54.000 s waveform; sample step across the wrap in the rendered audio is 0.0044 (left) / 0.0080 (right) against an RMS step of 0.0094 within plus or minus 0.5 s, so there is no click. Pool ambience and music are both present at the end (G1230 onward) and at G0, with no cue near the seam (last cue G1282) and no fade-out. What a repeat sounds like (**predicted from the construction, not heard**): the last 2 s of the music crossfade (G1560-G1620) into the material that starts the track, the pool bed is a 28 s noise loop with the same 2 s blend, and after about 3.5 s of silence for the voice the line "ดูตื้นแค่เข่า..." starts at G1 over a continuing bed. The music may sound like a doubled marimba pattern for those 2 s (two unaligned streams); that is the one place to listen to.

### Ending: dead air before the loop restarts (user note, 28 Oct 2026)

Rules checked: [production requirements](../../docs/production-requirements.md#outputs-and-story-timing) require `B_loop` to "hold the closing line ... for about 3 seconds" (a requirement for the A/B endings; the user's explicit duration overrides it with a recorded reason); `C_seamless` (no hold; last 15 frames blend into frame 0; the closing beat must land before the blend window) is an optional third ending chosen by the style profile; the sheet requires B06 speech to end at least 15 frames before the hold (SH08 F120). Mark's sheet also keeps an identical-frame state from F90 (ease done) to F209.

| | Before | After (applied) |
| --- | ---: | ---: |
| B06 `leadSec` (`narration-timeline-botnoi.json`) | 1.60 | 1.78 |
| B06 speech (SH08-local) | F49-F99 | F55-F104 (ends G1514, 16 frames before the hold at F120) |
| Last word to end of video | G1508 -> 3.76 s (112 frames) | G1514 -> 3.53 s (106 frames) |
| Silence B05 end to B06 start | about 1.8 s | about 1.98 s (over the silent pull-back) |
| Total video | 1620 frames, 54.000 s | 1620 frames, 54.000 s |
| Hold | 90 frames (3.0 s) | unchanged |

Applied: option (a), 6 frames (0.2 s) at the limit of the sheet rule, plus (c): music and pool bed run through the whole tail and wrap continuously, so the remaining 3.5 s is filled with sound instead of dead air. **Option (b) was not applied**: shortening the hold below "about 3 seconds" is outside the requirement and needs the user's explicit approval with a recorded reason (for example a 1.5 s hold would end the video 45 frames sooner; the F90-F209 frames are identical, so no Blender re-render is needed, but the scene-7 duration, the amplitude length 1620 and tests that pin 1620 frames for the Botnoi video would need an additive variant). The other approval-gated route is `C_seamless`: no hold, the last 15 frames blend into frame 0, the closing line must end before that window (current speech end is 106 frames from the end, so it fits). Because SH08 already ends on frame 0 imagery, `C_seamless` would also remove the "identical frames" tail from the picture (Mark/Boss to confirm which frames to cut) and shorten the video by up to 90 frames. Neither was done without approval.

### Not verified

No human listening (cue taste, pour/feet masking of consonants, the doubled-marimba blend at G1560-G1620, whether the pool bed reads as a pool, level of the music); Studio playback not checked (`DF-20261026-studio-emfile`); loudness target of -14 LUFS not reached (see above); no Thai intelligibility test, only a level proxy; library sounds unlistened; license eligibility of the Stability AI Community License is the user's call. No approval and not release-ready.

Reproduce: `python3 scripts/pool-depth/short/build-sound-beds.py` (needs the library masters and ffmpeg), `python3 scripts/narration_files.py --timeline scripts/pool-depth/short/narration-timeline-botnoi.json --name POOLDEPTH-SHORT-BOTNOI --dir public/narration/botnoi`, `node scripts/render.mjs POOLDEPTH-SHORT-BOTNOI --endings=B_loop`. The pre-sound render is kept as `out/POOLDEPTH-SHORT-BOTNOI/POOLDEPTH-SHORT-BOTNOI-voiceonly.mp4` (it still has the old B06 lead, speech ends G1508).

### User override: shorter `B_loop` hold for the Botnoi version (28 October 2026, Asia/Bangkok)

**User approval (chat):** "ลด hold 1.5 วินาที". Reason: the silence before the loop restarts is too long. This is a recorded override of the "hold the closing line for about 3 seconds" default in [production requirements](../../docs/production-requirements.md#outputs-and-story-timing), for `POOLDEPTH-SHORT-BOTNOI` only. The Niwat `POOLDEPTH-SHORT` keeps 1620 frames and its tests. The approval covers the hold length only, not listening, the render or release.

**What could be applied:** exactly 1.5 s (45 frames, last frame SH08 F164) breaks the seam. Measured on the Blender clips (grey, 270x480, mse against `shot-01.mp4` frame 0): `shot-08.mp4` F119, F149, F179 and F209 match (mse 0.24, 0.24, 0.24, 0.28; a normal frame-to-frame step is about 20), F164 gives 74.3 and F194 gives 74.3 (half a ripple period out of phase). Whole ripple periods only: the hold can be 30 frames (1.0 s, last frame F149) or 60 frames (2.0 s, last frame F179). The approval was for 1.5 s, so Editor stayed on the longer side and did not go below the approved length: **hold 60 frames (2.0 s)**. Going to 1.0 s is below the approved value and needs a new approval; an exact 1.5 s would need a mid-hold skip of 15 frames (a visible ripple pop, mse about 74) or a Blender re-render with a 45-frame period, neither done.

| | Before (3 s hold, sound render) | After (2 s hold) |
| --- | ---: | ---: |
| Total frames / duration | 1620 / 54.000 s | **1590 / 53.000 s** (video 53.000 s, AAC 53.013 s) |
| SH08 (`scene[7]`) | 210 frames, clip F0-F209 | 180 frames, clip F0-F179 (`BOTNOI_SH08_FRAMES`, registry only) |
| Hold | F120-F209 = 90 frames (3.0 s) | F120-F179 = 60 frames (2.0 s); hold start unchanged |
| Last word ends | G1514 (SH08 F104, 16 frames before the hold) | unchanged |
| Silence from last word to end of video | 106 frames, 3.53 s | **76 frames, 2.53 s** (voice-only render before this session's changes: 3.76 s) |
| Picture seam, last kept frame vs SH01 F0 (clip level) | F209: mse 0.28 | F179: mse 0.24 |
| Rendered frames, crop 1080x1500 mse, last frame vs G0 (includes the caption/label change) | G1619: 85.9 | G1589: 85.8 (same) |
| Bed files | 54.000 s | 53.000 s (rebuilt: `build-sound-beds.py`, `-53s_01`) |
| Audio wrap step (rendered) | 0.0044 L / 0.0080 R | 0.0043 L / 0.0080 R (RMS step 0.0094) |
| Integrated loudness / true peak | -19.5 LUFS / -3.1 dBFS | -19.5 LUFS / -3.1 dBFS (LRA 4.6 LU), no clipping |
| Margin under speech (all speech frames L/R, weakest cue) | 15.3 / 15.9 dB, feet 11.2 | unchanged: 15.3 / 15.9 dB, feet 11.2 dB |

Unchanged by the trim: all SFX cues (last cue G1282), captions (scene-7 cue runs the whole scene; B04 constraint test now scans 1590 frames), `narration-timeline-botnoi.json` and the amplitude JSON (still 1620 frames long; the last 30 frames are silent and fall past the composition end, so nothing pins 1620 for Botnoi any more: the test asserts amplitude length at least 1590). The `POOLDEPTH-SHORT-BOTNOI.mp3` is still 54.016 s and is cut at the composition end. New tests: Botnoi total 1590 and SH08 6 s, SH08 last frame is whole-period phase, hold at least 45 frames.

Renders in `out/POOLDEPTH-SHORT-BOTNOI/`: `POOLDEPTH-SHORT-BOTNOI_B_loop.mp4` and `POOLDEPTH-SHORT-BOTNOI.mp4` (current, 1590 frames, 2 s hold), `POOLDEPTH-SHORT-BOTNOI-sound-hold3s.mp4` (sound design, 1620 frames, 3 s hold), `POOLDEPTH-SHORT-BOTNOI-voiceonly.mp4` (voice only, 1620 frames, earlier B06 timing). Earlier numbers in the sound-design section above refer to the 1620-frame render. Still not listened to; no approval of the render.
