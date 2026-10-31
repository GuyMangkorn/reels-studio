# HANAKO-SHORT: Editor E3 report (sound audit, library, wiring)

**Status:** E3 done in the worktree, uncommitted (no commit or push). Scope: sound audit, `NEEDS-GEN` generation and filing, `audio` wiring in `src/videos/hanako/index.ts`, locks, checks. Not E4 (seam pixel check, progress-bar reset) and not E5 (B09 read, B05|B06 ear check). No plate, caption or script change.
**Listening:** nothing was listened to by a person. Every pick is a measured pick (`listened: no`). The levels below are analytic or measured on ffmpeg output, not heard.
**Reproduction inputs:** scene sheet `scripts/hanako/short/scene-sheet.md` (Sound lines, shot map); library `~/ReelsStore/library/sound/` (INDEX rows added for 13 files); `src/videos/hanako/index.ts`; `src/videos/hanako/assets.lock.json` (22 new entries). Raw takes: `~/ReelsStore/library/sound/_raw/hanako-*.wav` with `.wav.json` sidecars (seeds in §3).

## 1. Result (for the coordinator)

- 22 sounds on the composition clock: 9 reused from the shared library, 13 generated (the `NEEDS-GEN` list). 43 `audio` tracks in `index.ts`.
- Every cue is locked with `store.py use` (`public/audio/<category>/<id>.wav`). `store.py verify`: 0 problems.
- Changed files: `src/videos/hanako/index.ts` and `src/videos/hanako/assets.lock.json` (the whole `src/videos/hanako/` directory is still untracked from E2), `scripts/hanako/build-notes.md` (tracked; E3 entry appended), `public/audio/NOTICE` (tracked, not ignored; HANAKO-SHORT block appended), and this report (new). Nothing committed or pushed.
- Checks: typecheck 0 errors; lint 0 errors (3 warnings, all in Boss-owned `src/painted/hanako/look*.tsx`, not in this change); tests 241 pass, 0 fail.
- Runtime audio: two Remotion renders of `HANAKO-SHORT` (F0–F299 and F2290–F2595, see §6). No clipping measured; render A integrated loudness −16.9 LUFS, true peak −3.4 dBFS.
- Capability gaps for Boss (not faked): a keyframed track volume (the B09 −2 dB room-tone dip, F2323–F2383), and a per-beat narration gain (the EP08a runtime gap).
- Open questions are in §9.

## 2. Audit: scene-sheet cue → library ID or generated

Frames are composition frames (the scene sheet's F-numbers). `reused` = existing library file; `generated` = filed by E3 (`--picked` notes in the INDEX sidecars).

| Cue | Shot | Frame(s) | Sound | Library ID | Source | Volume | Duck |
| --- | --- | --- | --- | --- | --- | --- | --- |
| K1–K3 | B01-SH01 | F4, F18, F31 | knuckle knock | `impact_knuckle-rap_01` | reused | 0.70 | none |
| RT1 | B01, B02 | F0–F417 | room tone, dropped F409–F417 | `room_dark-empty-building_01` | reused | 0.08 | 0.5 |
| SD1 | B01-SH02 | F117–F305, fade-in 30 f, drop F297–F305 | very low sub drone | `bed_sub-drone-fade-in_01` | generated (NEEDS-GEN) | 0.09 | 0.5 |
| RS1 | B02-SH01 | F393–F417 | soft reverse swell, ends on «ค่ะ» | `reveal_reverse-swell-airy_01` | generated (NEEDS-GEN) | 0.30 | 0.5 |
| MB1 | B03-SH01 | F443–F645 | music-box motif, 70 bpm | `tension_music-box-motif-minor_01` | generated (NEEDS-GEN) | 0.12 | 0.35 |
| NR1 | B03-SH01 | F467 | notebook paper rustle (optional) | `foley_notebook-paper-rustle_01` | generated (NEEDS-GEN) | 0.20 | 0.5 |
| WH1 | B03-SH01 | F585–F645 | children's whispers | `tension_whispers-children-murmur_01` | generated (NEEDS-GEN) | 0.12 | 0.2 |
| HT1 | B04-SH01 | F645–F900 | held note (music thins) | `tone_soft-sustain-reflective_01` | reused | 0.10 | 0.35 |
| PN1, PN2 | B04-SH01 | F707, F820 | panel landings | `whoosh_fast-slide_01` | reused | 0.25 | none |
| RU1 | B04-SH01 | F742 | distant muffled rumble | `tension_rumble-distant-muffled_01` | generated (NEEDS-GEN) | 0.25 | 0.2 |
| DS1 | B04-SH01 | F851 | single muffled wooden door slam | `impact_door-slam-wood-muffled_01` | generated (NEEDS-GEN) | 0.30 | 0.2 |
| HT2 | B05-SH01 | F900–F1005 | held note, near-silent | `tone_soft-sustain-reflective_01` (trim 8.5 s) | reused | 0.05 | 0.35 |
| DR1 | B05-SH01 | F903 | metal filing drawer | `foley_drawer-filing-open_01` | generated (NEEDS-GEN) | 0.25 | 0.5 |
| PT1–PT3 | B05-SH01 | F951, F967, F983 | paper tab flicks | `foley_paper-tab-flick_01` | generated (NEEDS-GEN) | 0.25 | 0.5 |
| PT4 | B05-SH02 | F1027 | cover (paper flick) | `foley_paper-tab-flick_01` | generated (NEEDS-GEN) | 0.25 | 0.5 |
| PG1, PG2 | B05-SH02 | F1078, F1100 | flips | `whoosh_page-flip-paper_01` | generated (NEEDS-GEN) | 0.25 | 0.5 |
| RI1 | B05-SH02 | F1016–F1127 | riser, stops dead on «ต้นเรื่อง» | `reveal_riser-tension_01` | reused | 0.25 | 0.5 |
| CB1 | B06-SH01 | F1172–F1364, fade-out 15 f | cold bed | `tension_drone-sparse-piano_01` | reused | 0.10 | 0.35 |
| TK1 | B06-SH01 | F1264 | pin landing tick | `ui_click-tick_01` | reused | 0.25 | none |
| SH1 | B06-SH02 | F1391 | soft sub hit («ไม่ใช่ข่าว») | `impact_sub-hit-short_01` | reused | 0.30 | none |
| WP1 | B06-SH02 | F1430–F1588 | warm pad, felt-piano third | `bed_warm-pad-felt-third_01` | generated (NEEDS-GEN) | 0.12 | 0.35 |
| MY1 | B07-SH01 | F1588–F1940 | mystery bed (100 bpm) | `bed_mystery-investigation_01` | reused | 0.12 | 0.35 |
| MY2 | B07-SH03 | F1940–F2046 | same bed, lift (trim 11.73 s) | `bed_mystery-investigation_01` | reused | 0.16 | 0.35 |
| PG3, PG4 | B07 | F1653, F1782 | page-flip whoosh | `whoosh_page-flip-paper_01` | generated (NEEDS-GEN) | 0.30, 0.25 | 0.5 |
| TK2–TK6 | B07-SH02/03 | F1860, F1874, F1890, F1906, F1922 | optional ticks, very low | `ui_click-tick_01` | reused | 0.12 | none |
| PJ1 | B07-SH03 | F2022 | projector shutter click | `mechanical_projector-shutter-click_01` | generated (NEEDS-GEN) | 0.30 | 0.5 |
| RT2 | B08-SH01, B09 | F2046–F2596 | room tone returns low, to seam | `room_dark-empty-building_01` (trim 6.667 s, then whole file) | reused | 0.08 | 0.5 |
| MB2 | B08-SH01 | F2046–F2127, F2147–F2482 | music-box motif, slower; silent dip F2127–F2147; cut F2482 | `tension_music-box-motif-slow_01` (trim 3.367 s after dip) | generated (NEEDS-GEN) | 0.12 | 0.35 |
| WH2 | B08-SH01 | F2217–F2295 | whispers return | `tension_whispers-children-murmur_01` | generated (NEEDS-GEN, same file as WH1) | 0.12 | 0.2 |
| — | B09-SH01 | F2323–F2383 | room-tone bed −2 dB under the glow | — | **not wired** (capability gap, §6) | — | — |

Sheet items not in the NEEDS-GEN list but handled: B05 `drawer/paper foley` split into the drawer and the flick files; B05-SH02 cover/flip uses the flick (F1027) and the page flip (F1078, F1100) so the same single file is not repeated six times.

## 3. Generated sounds (audio-studio MCP, `sound-generation` skill)

Procedure per the skill: search first (INDEX read; no existing `whoosh`/`drone` match fit the NEEDS-GEN specs), `variations` 2–4, `steps` 8, `cfg` 1, SFX fields filled, `TrackType` prefix by the server. Candidates were compared with `scripts/zombie-condo-paint/measure-sfx.py` (peak, RMS, onset, peak time, tail); measurements use a mono downmix, so they can read up to ~4 dB above the generator's stereo peak. Pick rule: the measured shape of the request (no transient where a fade is wanted, peak near the cue end, one event per file).

| Library ID | Generator call (seed) | Pick (measured reason) | Process |
| --- | --- | --- | --- |
| `bed_sub-drone-fade-in_01` | sfx 10 s, seeds 1001–1003 | v3: crest 7.8 dB, peak 0.66 s; v1 peak 1.8 s; v2 no fade | 8 s, fade-in 1000 ms, fade-out 300 ms, loudnorm −14 LUFS (output −12.8: ceiling-limited) |
| `reveal_reverse-swell-airy_01` | sfx 1.2 s then 0.8 s (seeds 1002–1004; 1102–1104) | 0.8 s v1: peak 0.76 s, tail 0.01 s (stops at its end); 1.2 s takes peaked at ~1.05 s | peak −1 dBFS, untrimmed (keeps the F417 end) |
| `tension_whispers-children-murmur_01` | sfx 4 s, seeds 2001–2003 | v2: no burst; v3 burst at 1.65 s (−2.7 dB) | peak −1 dBFS, fade-in 50 ms; fade-out on the cue |
| `tension_music-box-motif-minor_01` | instrument 8 s, bpm 70, seeds 2101–2103 | v1: notes end ~6.7 s (B03 is 6.73 s) | loudnorm −14 LUFS (dynamic mode) |
| `tension_music-box-motif-slow_01` | instrument 16 s, bpm 56, seeds 2201–2203 | v3: loudest note 13 s, tail 2.8 s; v2 sustains 15.6 s (not sparse) | loudnorm −14 LUFS (dynamic mode) |
| `bed_warm-pad-felt-third_01` | music 8 s, bpm 70, seeds 3001–3003 | v2: quietest, crest 15.3 dB | loudnorm −14 LUFS |
| `tension_rumble-distant-muffled_01` | sfx 3 s, seeds 4001–4003 | v2: peak 0.72 s, tail 1.17 s, −6.6 dB; v3 peaks at 0.3 s | trim silence (→ 2.06 s), fade-out 50 ms, peak −1 dBFS |
| `impact_door-slam-wood-muffled_01` | sfx 2 s, seeds 4101–4103 | v2: crest 24.5 dB, not the loud v3 | trim silence (→ 1.2 s), peak −1 dBFS |
| `foley_drawer-filing-open_01` | sfx 2.5 s, seeds 5001–5003 | v1: not hot (peak −0.9 dB mono; v3 +0.2 dB); peak 1.86 s | cut to 2.0 s (first flick at F951 lands after the stop), fade-out 80 ms |
| `foley_paper-tab-flick_01` | sfx 1.2 s, seeds 5101–5103 | v1: first event at 0–0.1 s; second transient at 0.8 s | cut to first event, 0.3 s, fade-out 20 ms (the untrimmed take is superseded, kept in `_raw`) |
| `whoosh_page-flip-paper_01` | sfx 1.5 s, seeds 6001–6003 | v1: peak 0.53 s, tail 0.24 s; v3 hot (+0.5 dB) | trim silence (attack to file start, 0.57 s) |
| `foley_notebook-paper-rustle_01` | sfx 1.2 s, seeds 7001–7003 | v3: peak 0.52 s, tail 0.44 s; v2 loud attack at 0.27 s | cut to 0.8 s, fade-out 60 ms |
| `mechanical_projector-shutter-click_01` | sfx 1.5 s, seeds 8001–8003 | v1: click at 0 s; second click at 1.0 s | cut to first event, 0.25 s, fade-out 10 ms (the 1.05 s take is superseded, kept in `_raw`) |

Filed with `scripts/sound-library.py file` (copy, `library` block, INDEX row); `sound-library.py index`: 105 sidecars, 105 rows, 0 mismatches. Generated files are in the library under `ambience/bed`, `sfx/{reveal,tension,impact,foley,whoosh,mechanical}`, `music/bed`, `instrument/tension`. License: Stability AI Community License (generated audio; eligibility is the user's decision; `public/audio/NOTICE` block added).

Reused (already in the library, not regenerated): `room_dark-empty-building_01` (−14.1 LUFS, −1.0 dBTP, 12.5 s, seam checked §5), `impact_knuckle-rap_01` (peak −6.0 dBFS), `whoosh_fast-slide_01` (peak −1.0), `ui_click-tick_01` (peak −1.0), `impact_sub-hit-short_01` (−16.6 LUFS, −3.0 dBTP), `reveal_riser-tension_01` (−12.3 LUFS, 3.69 s), `tension_drone-sparse-piano_01` (−14.0 LUFS, 31.85 s), `bed_mystery-investigation_01` (−14.0 LUFS, 31.85 s), `tone_soft-sustain-reflective_01` (−14.0 LUFS, 12.0 s, fades out at its end: last 0.5 s −69 dBFS RMS).

Library candidates considered and not used: `bed_dark-drone-sub_01` (E2: not an exact match for the sheet's "no pitch movement, fades in" spec; the generated drone is the sheet's spec). `quake_seafloor-rumble-muffled_01` (possible rumble; its seafloor/earthquake description reads as a disaster event, and the sheet asks for a storybook-muffled rumble; not auditioned). `bed_sad-aftermath-ambient_01` (the sheet's Film candidate for B08; the sheet's own B08 cue is the B03 motif slower, so the motif was generated; see §9). `tone_thin-unresolved_01` (rejected by the sheet). `foley_door-pound-wood_01`, `impact_door-slam-body_01` (steel door, not wooden or muffled; no low-pass step exists in `process_audio`).

## 4. Wiring (`src/videos/hanako/index.ts`)

- `video.audio` (composition clock), 43 tracks. One-shots are tracks with `startSec` (no `endSec`, they play to the end of their file). Beds are tracks with `startSec`/`endSec`, `trimStartSec` where a file is continued, `fadeInSec`/`fadeOutSec` for the EP08a drop/lift edges. `duckUnderNarration` = depth while the narration speaks (`ROOM` 0.5, `BED` 0.35, `FX` 0.5, whispers 0.2; the knocks, which land before the narration starts at F45, are unducked).
- No `loop` flag. Room tone is split at its 12.5 s file boundary so each piece is a whole number of periods (see §5). The held note is split by `trimStartSec` (8.5 s) so the level step at F900 is a continuous file.
- Why `audio` and not `scene.sfx`: the scene timeline JSON is written by `build-cues.py` (E2 output). Keeping the SFX on the composition clock avoids regenerating it, and each cue lands on its sheet frame via `sec(frame) = frame / 30`.
- Validation: `validateVideoStyle` (via `collectEpisodes` in the registry test) accepts the array. Gains are all ≤ 0.30 except the knocks (0.70, peak −9.1 dBFS). Paths are `audio/<category>/<id>.wav` under `public/`.
- Header comment updated (E3 paragraph, the two capability gaps). E4/E5 items remain listed as open.

## 5. Mix cue sheet (EP08a) and the loop seam

Narration (`HANAKO-SHORT.mp3`): −16.0 LUFS integrated, −0.5 dBTP, amplitude envelope 2461 frames at 30 fps from F45. The voice level is fixed by the runtime (no per-beat gain, gap §6); the planned voice rides are recorded here as 0 dB for every beat.

| Beat | Frames | Mix intent (sheet) | Voice | Beds (nominal LUFS, vs −16 narration; duck while speaking) | SFX |
| --- | --- | --- | --- | --- | --- |
| B01 hook | 0–304 | hold; knocks before speech | 0 dB | room tone −36; sub drone −33.7 (duck −6 dB) | knocks F4/F18/F31 at −9 dBFS peak (the hook accent before F45) |
| B02 | 304–443 | lift → drop to silence F409–F417 | 0 dB | room tone to F409, then silent | swell F393–F417 (−10.5 dBFS peak), no flinch SFX |
| B03 | 443–645 | lift (music enters low) | 0 dB | music box −32.4 (duck −9 dB) | notebook F467, whispers F585–F645 (duck −14 dB) |
| B04 | 645–900 | hold; hit at the second story (F851) | 0 dB | held note −34 (duck −9 dB) | panels F707/F820, rumble F742, slam F851 (−10.5 dBFS) |
| B05 | 900–1172 | drop before the reveal; riser → hit on «ต้นเรื่อง» | 0 dB | held note −40 (near-silent); bed near-silent F1127–F1172 | drawer F903, flicks F951/F967/F983/F1027, flips F1078/F1100, riser F1016–F1127 |
| B06 | 1172–1588 | drop (cold bed out F1349–F1364), hit «ไม่ใช่ข่าว» F1391, lift (warm pad) | 0 dB | cold bed −34; warm pad −32 (duck −9 dB) | tick F1264, sub hit F1391 (−13.5 dBFS peak, soft) |
| B07 | 1588–2046 | lift (B07-SH03 F1940: bed +2.5 dB) | 0 dB | mystery bed −32.4 → −29.9 | page flips F1653 (−10.5 dBFS), F1782; ticks F1860–F1922 (very low); projector F2022 |
| B08 | 2046–2302 | release (room tone returns); silent dip F2127–F2147 | 0 dB | room tone −36; music box slow −32.5 | whispers F2217–F2295 |
| B09 hold | 2302–2596 | release → dip (visual) → room tone; music cut F2482 | 0 dB | music −32.5 to F2482, then room tone only | none; no knock, no stinger |

Ratios: at the planned volumes the beds sit 16–18 dB under the voice in pauses and 25–27 dB under it while the voice speaks (duck). Two distinct bed levels per section at least (0.05, 0.08, 0.09, 0.10, 0.12, 0.16), one `drop` → `hit` (B05 riser stop → «ต้นเรื่อง»; B06 cold bed out → sub hit), B07 lift is a +2.5 dB step on a file-position continuous split (the splits use `trimStartSec` at the join so no phase jump).

Stacked-peak bound (script `mix_levels.py`, upper bound: narration peak at −0.5 dBTP plus every active track at volume × file peak × duck gain, fades ignored): worst −0.18 dBFS at F52 (the hook, the narration start plus room tone and drone). Measured renders are below this (§6).

**Loop seam F2595 → F0 (sound-continuous, room tone only):** F2595 is the last sample of room-tone piece `RT2` (`trimStartSec` 6.667 s then the whole 12.5 s file, F2221–F2596, so the piece ends exactly on the file's last sample). F0 is the first sample of `RT1` (`file 0`). No other cue is active at F2595 or F0 (music ends F2482; the first event is the knock at F4). The file seam was checked numerically: wrap step 0.58× the median step; the largest step within 10 ms of the wrap is 5.42× the median, below the file-wide 99.99th percentile (6.67×), so it is ordinary texture, not a seam click. Level: RMS first 0.5 s −12.7 dBFS, last 0.5 s −11.3 dBFS (texture, not a level step). Not listened.

## 6. Numbers and runtime evidence

Measured on library files (ffmpeg ebur128 / volumedetect; `measure-sfx.py`): listed in §3.

Runtime renders (Remotion CLI, `HANAKO-SHORT`, `--gl=angle`, `--concurrency=4`; MP4 audio is AAC 48 kHz stereo; outputs in `out/hanako-e3/`, ignored):

- Render A, `mix-f0-f299.mp4`, frames 0–299 (10.0 s): integrated −16.9 LUFS, true peak −3.4 dBFS, RMS −20.1 dB. Window peaks: 0–0.13 s (before the first knock) −22.7 dBFS peak, room tone RMS −32.6 dB; knock windows 0.13–0.5 s, 0.5–1.0 s, 1.0–1.5 s peak −8.9, −8.9, −9.0 dBFS (predicted −9.1 for each knock: the knocks land at F4, F18 and F31 in the output); 1.5–3.9 s (speech plus drone) peak −3.4 dBFS.
- Render B, `mix-f2290-f2595.mp4`, frames 2290–2595 (10.2 s, 306 frames; `exit 0`): integrated −18.5 LUFS, true peak −3.3 dBFS, astats peak −3.3 dBFS. Windows (composition frames): F2290–F2320 peak −3.6 dBFS, RMS −19.7 dB (VO over the B08 music box and room tone); F2380–F2470 RMS −22.7 dB; F2566–F2580 RMS −35.5 dB and F2580–F2590 RMS −32.7 dB, both after the VO ends at F2505, i.e. room tone only.
- Seam level (measured, not heard): render B's last window (F2580–F2590, room tone only, RMS −32.7 dB) against render A's first window (F0–F4, room tone only, RMS −32.6 dB). The B09 → B01 level is continuous and the room tone is the only sound on both sides. The predicted room-tone level is −34.7 dBFS RMS (0.08 × the file's −12.7 dBFS RMS), which these windows match.
- Not separable in the MP4: the B09 music cut at F2482 and the −2 dB room-tone dip are not confirmed by these numbers (the VO overlaps the cut, and no stems exist). The cut and the bed entries are checked in the code (`endSec` F2482) and in the analytic table only.

Clipping: no sample at or above 0 dBFS in either render (true peak −3.4 and −3.3 dBFS, AAC decoded). The analytic stack bound (−0.18 dBFS at F52) is above the measured renders, so it is conservative.

## 7. Checks run (logs under `out/logs/`)

- `npm run typecheck` (`tsc --noEmit`): exit 0 (`out/logs/hanako-e3-typecheck.log`).
- `npm run lint` (`eslint src tests`): 0 errors, 3 warnings, all in `src/painted/hanako/look.tsx`, `look-r3.tsx`, `look-r4.tsx` (Boss-owned, unchanged by E3): `out/logs/hanako-e3-lint.log`.
- `npm test`: 241 pass, 0 fail (`out/logs/hanako-e3-test.log`); the registry test validates the `audio` array.
- `python3 -I scripts/store.py verify`: `7276 stored, 116 locked, 0 problems` (after the 22 `store.py use` locks).
- `python3 -I scripts/sound-library.py index`: 105 sidecars, 105 index rows, 0 mismatches.

## 8. Unverified and limitations

- **Not listened to.** No sound here, generated or reused, was heard. Every pick is by measurement (`listened: no` in the library sidecars). A human listen is needed for: the sub drone (is it a drone or a hum?), the reverse swell (airy and reversed?), whispers (unintelligible, no words?), the music boxes (sparse and in key with each other?), the warm pad (narration-safe?), the rumble and slam (muffled and not a disaster sound?), the flicks and page flips (single events), the projector click.
- **Narration intelligibility** under the beds was not heard. The duck depths are set by the EP08a palette, not by a listen.
- **Seam:** checked numerically at the file wrap (§5), not by ear and not on a looped playback. E4 owns the seam pixel and listen check.
- **Loop semantics:** no `loop` is used; the room tone is split so the composition end and start meet on file boundaries. The actual loop playback of the composition in the Studio player was not tested.
- **Renders:** two frame ranges only (F0–F299, F2290–F2595); the full export is not rendered. The E2 report had no MP4; `render.mjs` then normalizes loudness of the final export in place, so the final loudness of a full export will differ from the render-A numbers.
- **Generated loudness:** `tension_music-box-motif-*` and `bed_sub-drone-fade-in_01` used loudnorm dynamic or ceiling-limited modes (the sub drone sits at −12.8 LUFS, not −14).
- **Measurement caveat:** the repo's `measure-sfx.py` downmixes to mono; its peaks can read above the generator's stereo peak (up to ~4 dB on the door slam).
- **Analytic table** (`out/hanako-e3/mix-levels.txt`) is an upper bound, not a render.
- **License:** generated audio is under the Stability AI Community License; commercial eligibility is the user's decision (`public/audio/NOTICE`, library `NOTICE.md`).

## 9. Open questions (returned to the coordinator; not asked here)

1. **B08 music source.** The scene sheet gives the B08 cue two ways: `B08-SH01` says "B03 motif, slower (NEEDS-GEN)" with Film candidate `bed_sad-aftermath-ambient_01`, while the B06 note says `bed_sad-aftermath-ambient_01` is "kept for B08". E3 followed the B08 section (slower music box). If the user prefers the existing bed, swap the `MB2` track to `music/bed/bed_sad-aftermath-ambient_01` (not in `public/audio` yet; one `store.py use`).
2. **B09 pause.** The lead's note reads "silence F2320–F2347 before «กลับมา»". The sheet keeps music low through that pause (`B09-SH01` Sound line) and only dips the room tone under the glow (−2 dB, not wired). E3 kept the sheet's version. Confirm, or ask Mark to write a music drop F2320–F2347 (a `drop` → `hit` on F2347).
3. **Rumble.** E3 generated `tension_rumble-distant-muffled_01`. The library `quake_seafloor-rumble-muffled_01` is a close description with a seafloor/earthquake reading. Confirm the generated file.
4. **B05 cover/flip.** The sheet says "cover and flip foley (NEEDS-GEN as SH01)". E3 used the paper flick for the cover (F1027) and the page-flip whoosh for the two flips (F1078, F1100). Confirm.
5. **Repeated cues.** The three paper tab flicks (F951/F967/F983) and the five soft ticks (F1860–F1922) use one file each. The sheet asks for them; the ear check (E5 ear pass) decides whether the set is "noise".
6. **B05|B06 join (E5).** The riser stops at F1127 on «ต้นเรื่อง» (Editor may snap ≤ 3 f by ear). Not changed here.

## 10. Capability gaps (Boss; not faked)

- **Keyframed track volume.** `AudioTrack.volume` is a static number (`src/scenes/types.ts`). The B09 room-tone dip (−2 dB, F2323–F2383, `VD21`) needs a volume envelope; E3 did not split the bed into many tiny entries. Requested: an optional envelope on `video.audio[]` (or a `volumeKeys` field), or Boss confirms the dip is dropped.
- **Per-beat narration gain.** The narration plays at one fixed level (EP08a runtime gap). The planned voice rides (`0.7` intimate, `1.25` payoff) are not wired; the mix here is built around a fixed voice.

## 11. Proposals (rule documents not edited; the user reviews)

- `docs/sound-generation-workflow.md` / `library.md`: the sidecar `--picked` note is now used for every E3 file; a rule to record the measured comparison (already the skill's step 4) would help the next episode.
- `docs/editor-principles.md` (EP08a runtime mapping): one sentence that a file-continuous split at a level step is the standard way to get a lift without a keyframe (already implied; currently not written).
- `scripts/zombie-condo-paint/measure-sfx.py`: the mono downmix can overstate peaks; a `-ac 2` or per-channel peak would match the generator's numbers.

## 12. Reproduction

- Candidates: `mcp__audio-studio__generate_audio` calls as in §3 (sfx/instrument/music, `variations` 3, seeds listed). Raw takes in `~/ReelsStore/library/sound/_raw/`.
- Measures: `python3 -I scripts/zombie-condo-paint/measure-sfx.py <takes>` (TSV, stdout) → `out/logs/hanako-e3-measure.tsv`.
- Processing: `mcp__audio-studio__process_audio` with the settings in §3; the titles are the library IDs (suffix `_2` where a title was reused).
- Filing: `python3 -I scripts/sound-library.py file <processed.wav> <type>/<category>/<id> --description … --tags … --first-used-by "Reels Creator / HANAKO-SHORT" --picked …`.
- Locks: `python3 -I scripts/store.py use --episode hanako library/sound/<type>/<category>/<id>.wav public/audio/<category>/<id>.wav` (22 entries), then `python3 -I scripts/store.py verify`.
- Wiring: `src/videos/hanako/index.ts` (`audio`). Export for the analytic table: `out/hanako-e3/export-audio.mts` (`node --import tsx`) → `out/hanako-e3/audio-tracks.json`.
- Analysis scripts (scratch, stdlib): `mix_levels.py` (stacked-peak and headroom table → `out/hanako-e3/mix-levels.txt`), `seam_check.py` (wrap step and RMS of a WAV). Both live in the session scratchpad, not the repo.
- Renders: `node_modules/.bin/remotion render src/index.ts HANAKO-SHORT out/hanako-e3/mix-f0-f299.mp4 --frames=0-299 --gl=angle --timeout=180000 --concurrency=4 --overwrite` (and `--frames=2290-2595` for render B), logs in `out/logs/hanako-e3-render-*.log`.
- Checks: `npm run typecheck`, `npm run lint`, `npm test` (logs as in §7).
