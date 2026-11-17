# EDU-EP24-SHORT — scene-sheet index
Revision **EDU-EP24-SCENES-R2** · Film, 2026-11-17 · Status **ready-for-dev** · Timing checked-with-audio (voice lock; see [Timeline](#timeline)) · Scene sheet: [sc01.md](sc01.md) · rows: [review-rows.json](review-rows.json) · brief [film-brief.md](film-brief.md) BRIEF-R3 · script [script.md](script.md) SCRIPT-R1 · fact-check FACT-R1 · voice [measure-take3-x125.json](measure-take3-x125.json) (EDU-EP24-NARRATION-R3-X125, Kore style C, atempo 1.25; times computed = R3 / 1.25, ±0.15 s, store `projects/edu/EDU/narration/`) · task [task.md](../task.md)
Target: 30 fps, **2065 frames = 68.83 s** (64.54 s read + 2.53 s inserted gaps + 2.0 s hold − 0.24 s unused take tail; target was about 70 s, inside the user's 80 s cap, and the read is already slow with short gaps so nothing else was added), 1080×1920, one story scene `EDU-EP24-SHORT-S01`, 28 shots (SH01–SH27 plus SH14B), beats B01–B05.

<a id="timeline"></a>
## Timeline: narration placement and inserted gaps
Rule: scene frame = round(measure-file seconds × 30) + the frames of every inserted gap whose cut point precedes it. Editor cuts the x1.25 take at each `cutAfterSec` (the quietest 20 ms in that line gap, per the measure file) and inserts exact silence there. Accuracy of line onsets/ends ±0.15 s (measure file); word-level cuts inside a line (marked est.) ±0.3 s: retime by ear at the first Draft, not by changing the frames of the lines.

| Gap | After line | Cut point (file s) | Scene frame of the cut | Inserted | Total silence line-end → next onset | What fills it |
| --- | --- | --- | --- | --- | --- | --- |
| G1 gasp + board riffle | L05 | 21.13 | 634 | **35 f = 1.17 s** | 42 f = 1.40 s (natural gap 7 f) | YOU's gasp S3 (f633–f644, 0.37 s) then the 1.0 s riffle S4 (f643–f673) ending exactly on the L06 onset; the user set the riffle at 1.0 s |
| G2 groan | L09 | 32.77 | 1018 | **9 f = 0.30 s** | 17 f = 0.57 s (natural gap 8 f) | YOU's groan S7 (0.4 s) before L10, the ER02 beat |
| G3 sepia pause | L15 | 51.22 | 1581 | **9 f = 0.30 s** | 17 f = 0.57 s (natural gap 8 f) | the arrow and the stamp rest on the sepia plate after L15 ends (frames 1578–1590), so the fact lands before the room restarts |
| G4 sigh | L16 | 54.58 | 1690 | **14 f = 0.47 s** | 23 f = 0.77 s (natural gap 9 f) | RIVAL's long sigh S10 (0.55 s) in silence |
| G5 silence after the ka-ching | L18 | 61.40 | 1909 | **9 f = 0.30 s** | 18 f = 0.60 s (natural gap 9 f) | no sound: the ka-ching has ended (frame 1895), the VO number ends at 1902, silence to L19 at 1920 (0.6 s, as decided) |
| **Total inserted** | | | | **76 f = 2.53 s** | | |

Not inserted (reason): no pause before L19 beyond G5, none before L13 or L18 (the natural 0.39 s gaps already mark the turns), no lead-in before L01 (speech starts at 0.21 s = frame 6, the hook frame is already moving), no extra pause on the B04 entry (the hard cut to sepia on "แต่" carries it). Hold: frames 2005–2065 (2.0 s) after speech end 2005; the take's 0.24 s tail is not used. Length: 64.54 + 2.53 + 2.0 − 0.24 = 68.83 s.

| Line | Beat | Scene frames [onset, end) | s | Shots |
| --- | --- | --- | --- | --- |
| L01 | B01 | [6, 117) | 0.20–3.90 | SH01 |
| L02 | B01 | [124, 270) | 4.13–9.00 | SH02, SH03 |
| L03 | B01 | [278, 354) | 9.27–11.80 | SH04 |
| L04 | B01 | [362, 447) | 12.07–14.90 | SH05, SH06, SH07 |
| L05 | B02 | [457, 631) | 15.23–21.03 | SH08, SH09 |
| L06 | B02 | [673, 780) | 22.43–26.00 | SH10, SH11 |
| L07 | B02 | [789, 858) | 26.30–28.60 | SH12, SH13 |
| L08 | B02 | [865, 910) | 28.83–30.33 | SH13 |
| L09 | B03 | [919, 1016) | 30.63–33.87 | SH14, SH14B, SH15 |
| L10 | B03 | [1033, 1168) | 34.43–38.93 | SH16, SH17 |
| L11 | B03 | [1176, 1241) | 39.20–41.37 | SH18, SH19 |
| L12 | B03 | [1248, 1353) | 41.60–45.10 | SH19 |
| L13 | B04 | [1362, 1406) | 45.40–46.87 | SH20 |
| L14 | B04 | [1414, 1504) | 47.13–50.13 | SH20, SH21 |
| L15 | B04 | [1511, 1578) | 50.37–52.60 | SH21 |
| L16 | B05 | [1595, 1682) | 53.17–56.07 | SH22, SH23 |
| L17 | B05 | [1705, 1761) | 56.83–58.70 | SH24 |
| L18 | B05 | [1770, 1902) | 59.00–63.40 | SH25 |
| L19 | B05 | [1920, 2005) | 64.00–66.83 | SH26, SH27 |

Subtitles: one caption per line chunk, shown over [onset, end) of each line; chunking and the edu stroke caption look are Editor's ([caption look](../../../../docs/production-requirements.md#caption-look)). The character sounds S3, S7, S10 carry no caption. Narration file note: the lock file `out/ep24-voice/full3/EDU-EP24-SHORT_narration_kore_r3_x125.wav` (64.54 s) and the per-line cuts under the store `narration/lines-r3/` are named in the measure file; confirm which are x1.25 before use.

## Shot map
| Shot | Beat | [start, end) | f | s | Camera family | Look frame |
| --- | --- | --- | --- | --- | --- | --- |
| SH01 | B01 | [0, 121) | 121 | 4.03 | push on host | — |
| SH02 | B01 | [121, 216) | 95 | 3.17 | reverse single | — |
| SH03 | B01 | [216, 275) | 59 | 1.97 | reverse two-shot | — |
| SH04 | B01 | [275, 356) | 81 | 2.70 | 1 wide | LF01x (same room) |
| SH05 | B01 | [356, 395) | 39 | 1.30 | reverse two-shot | — |
| SH06 | B01 | [395, 419) | 24 | 0.80 | board insert | — |
| SH07 | B01 | [419, 451) | 32 | 1.07 | 1 wide | LF01x |
| SH08 | B02 | [451, 558) | 107 | 3.57 | card insert | — |
| SH09 | B02 | [558, 643) | 85 | 2.83 | reverse single | — |
| SH10 | B02 | [643, 727) | 84 | 2.80 | board insert | — |
| SH11 | B02 | [727, 788) | 61 | 2.03 | reverse two-shot | LF02 |
| SH12 | B02 | [788, 835) | 47 | 1.57 | 3/4 two-shot | — |
| SH13 | B02 | [835, 913) | 78 | 2.60 | reverse single | — |
| SH14 | B03 | [913, 978) | 65 | 2.17 | reverse single | — |
| SH14B | B03 | [978, 1010) | 32 | 1.07 | board insert | — |
| SH15 | B03 | [1010, 1027) | 17 | 0.57 | reverse single | — |
| SH16 | B03 | [1027, 1087) | 60 | 2.00 | 3/4 two-shot | — |
| SH17 | B03 | [1087, 1171) | 84 | 2.80 | reverse close | — |
| SH18 | B03 | [1171, 1217) | 46 | 1.53 | board insert | — |
| SH19 | B03 | [1217, 1361) | 144 | 4.80 | 1 wide pull-back | — |
| SH20 | B04 | [1361, 1473) | 112 | 3.73 | 1 wide, sepia dolly | LF03 |
| SH21 | B04 | [1473, 1590) | 117 | 3.90 | 1 wide, sepia + SVG | LF03 |
| SH22 | B05 | [1590, 1639) | 49 | 1.63 | tray insert | — |
| SH23 | B05 | [1639, 1704) | 65 | 2.17 | reverse single | — |
| SH24 | B05 | [1704, 1764) | 60 | 2.00 | reverse two-shot | — |
| SH25 | B05 | [1764, 1918) | 154 | 5.13 | host close → 1 wide | LF04x |
| SH26 | B05 | [1918, 1970) | 52 | 1.73 | reverse single | — |
| SH27 | B05 | [1970, 2065) | 95 | 3.17 | 1 wide hold | LF04x |

Shot length is short on purpose (average 2.5 s, 28 cuts in 68.8 s): the story is a fast game, every cut changes information (who bids, what the board says, the rule, the sum), and the wide returns four times with a changed state (SH04/SH07 BS03 warm, SH19 BS14 cool + wider grin, SH20–SH21 sepia, SH25–SH27 lit tally + warm on the host).

<a id="sound-plan"></a>
## Sound plan (cue sheet for Ton and Editor)
Music, ambience and SFX follow the brief's [Sound direction](film-brief.md#sound-direction); frames here are scene frames at 30 fps (shot-local frames are in each shot block of [sc01.md](sc01.md)). Every cue is designed from its beat; only END24 is a library file because its description already fits (user choice 2026-11-17, [UT15](../../../../channels/edu/channel.md#ut-edu-end-tag)). Ton makes NEEDS-GEN cues ([fit beats reuse](../../../../docs/sound-generation-workflow.md#fit-beats-reuse)); Ton may check `public/sfx` for a coin clink and a clean cash register before generating.

| Bed / cue | Scene frames | Sound (source, action, material, space, length, feel) | Library / status |
| --- | --- | --- | --- |
| M1 game-show bed | [0, 457) + 2 f tail | light bouncy game-show bed: pizzicato strings and bright marimba carrying a three-note rising "bid" motif, plucked upright bass, brushed snare, soft off-beat tambourine; 124 bpm, major, about 15 s; playful, cheeky "free money?"; −14 dB under VO; stops dead on the L05 onset with no reverb wash | NEEDS-GEN |
| AMB1 meeting room | [0, 1361) and [1598, 2065) | small carpeted office meeting room: low air-conditioner hum, faint fluorescent tick, very distant office murmur through a closed door, no voices understood; dry, 12 s loop, ordinary and safe; main bed after M1 stops; −6 dB under VO | NEEDS-GEN |
| P1 tick pulse | [673, 1248) (fade 8 f at the end) | dry wooden clock tick on the beat with a soft low sub thump every second beat, 124 bpm grid, no melody, 12 s loop; pressure building from L06 to the end of L11; stops at L12 so the refrain is dry | NEEDS-GEN |
| R1 riser | [1033, 1241) peak 1217 | slow rising tension swell: bowed strings sliding up, filtered noise, growing low drone, about 7 s; peaks on "เกินร้อยแล้ว", drops to near-silence at the end of L11 (frame 1241) | NEEDS-GEN |
| D1 held pad | [1362, 1590) fade 8 f under L16 | low soft warm-sepia pad, a single sustained chord with a faint tape wobble, no beat, about 9 s; quiet curiosity, "outside the story"; narration fully clear | NEEDS-GEN |
| AMB2 paused room | [1361, 1598) | AMB1 low-passed and pulled back −10 dB under D1 (time has stopped); a processed copy, no new file | from AMB1 |
| END24 ending | 2014 → about 2056 (picture fade 2047–2065) | pizzicato and marimba tag, 2.5 s source, trimmed to about 1.4 s with a 0.6 s fade-out as in EP02 `sound-mix.py`; starts 0.3 s into the hold; the picture fades with it | library `sfx/stinger/stinger_pizz-tag-ending_01` (user choice) |
| S1a | 362 (SH05 f6), 8 f | bid clink 1 (YOU "ห้าบาท"): a single small coin clink on a glass-topped table, bright and short, close, dry, 0.25 s; quick greedy fun | NEEDS-GEN (Ton checks public/sfx for a coin clink first) |
| S1b | 386 (SH05 f30), 8 f | bid clink 2 (RIVAL "สิบ"): the same clink one step higher in pitch | NEEDS-GEN (same file, pitch step) |
| S1c | 398 (SH06 f3), 8 f | bid clink 3 (YOU "ยี่สิบ"): a third clink, higher again, lands with the flip | NEEDS-GEN (same file, pitch step) |
| S2 | 494 (SH08 f43), 9 f | card flip (host flick on "อีกข้อ"): a stiff card flap snapping down onto a table card, one crisp paper snap with a soft papery slap, close, dry, 0.3 s; the hidden rule was always there | NEEDS-GEN |
| S3 | 633 (SH09 f75), 11 f | gasp (YOU, "ห๊ะ?"): a young man (about 24) small gasp, short, in the silence after L05, never over narration; Gemini TTS designed voice, not Kore | NEEDS-GEN (designed voice, Editor/voice pass) |
| S4 | 643 (SH10 f0), 30 f | board riffle: a fast riffle of a flip-number board, ten plastic card flaps speeding then stopping on one firmer flap on 95, close, dry, 1.0 s; the bidding ran away | NEEDS-GEN |
| S6a | 884 (SH13 f49), 8 f | board flip "ร้อย" (BS12): one flip-card flap, single, heavier than S4 by 3 dB, 0.25 s | NEEDS-GEN (one file, three variations S6a/b/c) |
| S5 | 896 (SH13 f61), 18 f | relief ding ("คุ้ม"): a soft warm single bell ding, like a small desk bell touched lightly, close, short tail, 0.6 s; satisfied, good move | NEEDS-GEN (Ton may check ui_toy-bell-smug_01 by ear; not assumed to fit) |
| S6b | 1001 (SH14B f23), 8 f | board flip "ร้อยห้า" (BS13): the same flap, 3 dB louder and lower than S6a, more thump, 0.25 s | NEEDS-GEN |
| S7 | 1017 (SH15 f7), 13 f | groan (YOU): a short tired groan, young man, in the gap after L09, 0.4 s | NEEDS-GEN (designed voice, same as S3) |
| S6c | 1200 (SH18 f29), 9 f | board flip "ร้อยสิบ" (BS14): the heaviest flap, lowest pitch, 0.3 s; then the sum window a beat after | NEEDS-GEN |
| S8 | 1479 (SH21 f6), 12 f | gavel tap (stamp lands): one soft wooden gavel tap on a sound block, muted, slightly roomy, 0.4 s; "noted", stylised, not a court recording | NEEDS-GEN |
| S9 | 1554 (SH21 f81), 15 f | arrow rise ("ทะลุ"): a quick soft upward whoosh with a light paper-tear tick as the arrow breaks the dashed line, 0.5 s, under narration level | NEEDS-GEN |
| S12 | 1611 (SH22 f21), 36 f | payment (under "คุณชนะร้อยสิบ"): two notes slid onto a wooden tray, then a small handful of coins set down, close, dry, 1.2 s; the bill comes due, quiet under VO | NEEDS-GEN |
| S10 | 1685 (SH23 f46), 17 f | sigh (RIVAL): a long tired exhale, a deeper older male voice (late thirties) than S3/S7, in the gap after L16, 0.55 s | NEEDS-GEN (designed voice) |
| S11 | 1868 (SH25 f104), 27 f | ka-ching (exactly on "สองร้อยสิบห้า" as the tally lights): a vintage cash-register bell ring with the drawer clunk, bright bell, room, close, 0.9 s; the money lands. May peak 4 dB over VO for its first 4 frames only | NEEDS-GEN (Ton checks for a clean single register) |

Silence policy: M1 stops dead at frame 457 and AMB1 alone carries the rule, the gasp and the riffle; P1 and R1 build B03; near-silence for L12 (frames 1248–1361); D1 and AMB2 alone for B04; no music from L16 on; silences at frames 1902–1920 (after the ka-ching) and 2005–2014 (before END24). Ducking: music −8 dB under narration, AMB1 −6 dB, S11 may peak 4 dB above the VO for its first 4 frames only; character sounds (S3, S7, S10) sit in their own gaps and are never over narration. Event frames of word-level cues (S1b, S1c, S2, S5, S6a/b/c, S8, S9, S11, S12) are VO-word onsets; the S11, S8 and the in-line anchors come from the measure file (±0.15 s), the others are syllable-proportion estimates (±0.3 s): Editor checks them against the Thai word onsets at the first Draft. Mix intent per beat: B01 lift, B02 drop (rule) then tighten, B03 build, B04 hold quiet, B05 drop to silence and one hit (S11).

## Board state ledger on screen
| State | Scene frame | Shot | Note |
| --- | --- | --- | --- |
| BS00 | 0–355 | SH04 (seen) | "รวม 0" |
| BS01–BS02 (5, 5/10) | 362–398 | SH06 opens on BS02 | S1a, S1b; BS01 is heard only |
| BS03 (20/10/30) | 398–451 | SH06 flip, SH07 |  |
| BS04–BS11 (riffle to 90/95/185) | 643–673 | SH10 | sum passes 100 at BS07 |
| BS12 (100/95/195) | 884 | set in SH13 (S6a), seen as the opening state of SH14B | S6a |
| BS13 (100/105/205) | 1001 | SH14B flip; SH18 opens on it | S6b |
| BS14 (110/105/215) | 1200 | SH18 flip, SH19, SH20–SH21 (sepia) | S6c; unlit |
| BS14-lit | 1868 | SH25, SH27 | S11 ka-ching |

## Boss / Editor handoff
- **Boss (N1–N13 status):** see the table in [sc01.md](sc01.md#baseline-and-assets). Exists in the checkout, untracked and unintegrated: N1/N12, N2 (static), N3, N4 (static), N5 (static), N7, N9 (still), N11. Missing: N6 bid raise, N8 flap flick, animations (board flip, riffle, flap fall, payment slide-in, stamp-in, arrow rise, sepia grade as a plate option), N10 grin ladder (unknown), N13 front and back slump (approximations only). Boss registers the episode module and builds plates only from this sheet; shot groups: (A) B01 SH01–SH07, (B) B02 SH08–SH13, (C) B03 SH14–SH19 incl. SH14B, (D) B04 SH20–SH21, (E) B05 SH22–SH27. Boss checks SH12/SH16 oblique reads, each shot's lead height against the sheet, and that no painted element crosses a DOM text quad (≥ 24 px).
- **Ton:** the NEEDS-GEN cues in the sound plan (16 cues + 5 beds); S3, S7, S10 are character voices cast by Editor's voice pass (a young man about 24 for S3/S7; a deeper late-thirties voice for S10), not the Kore narrator.
- **Editor:** place the narration per the [timeline](#timeline) (five gaps), blockout from the shot map, DOM overlay (board, card text) on the shot's `YCam` quads, captions, mark `@TamMaiLa`, the 2.0 s hold and the `A_fade` over the last 18 frames; cue placement exactly as the sound plan; first Draft is the half-size cut for the Draft tab.

<a id="open-questions"></a>
## Open questions (for the user; defaults chosen so nothing waits)
None open. Resolved by the user on 2026-11-17: **OQ1** SH22 payment = the default (notes and coins slide into the tray by themselves, no hands); **OQ2** = add a board insert for 100/105 (SH14B, 32 f, taken from the existing shots, no silence added, total unchanged).

Not questions, recorded: the host's note is placed on the side table between SH01 and SH04 (unseen); RIVAL's slump is a head-drop approximation (brief N13 fallback); the in-line word cuts are estimates for the Draft to retime.

## Review page
Rows: [review-rows.json](review-rows.json) (Thai, timed, cites the approved look frames LF01x/LF02/LF03/LF04x); review page: pending (coordinator builds it: `python3 -I scripts/storyboard-page/build.py scripts/edu-series/ep24/short/review-rows.json`, then `python3 -I scripts/storyboard-page/serve.py scripts/edu-series/ep24/short/review-rows.json`, default URL `http://127.0.0.1:8765/`).

## Change log
- 2026-11-17 **EDU-EP24-SCENES-R2** (Film): added the board insert SH14B for 100/105 (user answer to OQ2) cut from SH14 (−22 f) and SH15 (−10 f), no silence added, total unchanged 2065 f = 68.83 s; OQ1 resolved as the default; see the change log in sc01.md.
- 2026-11-17 **EDU-EP24-SCENES-R1** (Film, W5.1): first timed scene sheet and first storyboard rows; supersedes the on-hold note of BRIEF-R2/R3; two earlier stopped Film runs left only `projection-shots.json`/`projection-run.py` (reused; SH18 re-aimed, a `mid` sample added).
