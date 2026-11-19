# E30-C01-S01 — timed scene-sheet index (EDU-EP30-SHORT)

Deliverable: `EDU-EP30-SHORT` · Revision: **`EDU-EP30-SCENE-R1`** · Status: **ready-for-dev** · Timing: **checked-with-audio** (measured on the voice-lock files; no blockout yet)
Inputs: script [EDU-EP30-SCRIPT-R1](../script.md) (L01–L18, user-approved, L17 = 1908) + fact-check [EDU-EP30-FACTCHECK-R1](../fact-check.md) · voice lock [EDU-EP30-VOICE-R1](../voice-lock.md) (Kore x1.05, FARMER Algenib, EMU Puck; 67.07 s; user-approved, no cut) · Film brief [EDU-EP30-BRIEF-R2](../film-brief.md) (VD30-01–VD30-11, VD30-01a, -04a, -05a, -05b; look lock W3.2) · storyboard [EDU-EP30-BOARD-R2](../storyboard.md) / rows ROWS-R5 (26/26 passed, Q6 = three-quarter) · delivery record [../../delivery.md](../../delivery.md)
Target: branch `claude/ep-30-continue-7be3d3` at `e09c995` plus the uncommitted look assets in `src/painted/edu30/` · **30 fps** · **durationFrames 2012** (67.07 s) · 1080 × 1920 · composition offset 0 (one story scene = the whole Short)
Evidence: runtime unverified (no plate, no blockout) · render/samples none · audio sync: every frame below measured from `out/ep30-voice/` (= store `projects/edu/EDU/narration/ep30-voice-r1/`) with [vo-anchors.py](../vo-anchors.py) (envelope, 10 ms) plus Whisper word times where marked `±3 f` · projection: [projection-run.py](../projection-run.py) on [projection-shots.json](../projection-shots.json), all 26 shots, output `out/logs/ep30-projection.txt` · user approval: script, voice, looks and the untimed storyboard approved; this timed revision not yet reviewed (review page: pending)

Shot sheets: [b01.md](b01.md) (B01, 3 shots) · [b02.md](b02.md) (B02, 5) · [b03.md](b03.md) (B03, 4) · [b04.md](b04.md) (B04, 5) · [b05.md](b05.md) (B05, 3) · [b06.md](b06.md) (B06, 4) · [b07.md](b07.md) (B07, 2). User rows: [../review-rows.json](../review-rows.json) `EDU-EP30-ROWS-R6` (timed).

## Units and conventions

- **Clocks.** Composition-global = scene-local (offset 0). Shot-local = global − shot start. Ranges are half-open `[start, endExclusive)`. Frame of a time t = `int(t × 30 + 0.5)`.
- **Spaces** (brief: [set plans](../film-brief.md#set-plans-metres-estimates)): **P** paddock (origin ground at G1 tripod centre, north = −z), **D** farm dam (origin outer foot of the south bank, north = −z; R4 marks in [lf02-r4](../film-brief.md#lf02-r4)), **A** arms wall (origin wall foot under the emblem centre, wall plane z 0 facing +z), **T** truck-local (B05: space P axes translated to the truck's ground centre; the truck drives toward +x on the track centre line z 9.5). Metres, +y up, +z toward the master camera.
- **Camera lines** use the kit `YCam` (`src/painted/kit/ycam.ts`): `eye (x, y, z)` m, `yaw` deg (0 looks −z, + toward +x; 180 looks +z), `pitch` deg (+ up), `f` px at 1080 × 1920, `hy` principal row. A move interpolates every field linearly with ease-in-out unless the shot says otherwise. Camera transforms are owned by the plate (`YCam` per frame); picture-stage transforms (newsreel weave, VD30-11 shake) are owned by the plate's screen-space overlay and never move captions, the mark, the label or titles ([DF-20261030-painted-screen-layers-overlay](../../../../../docs/dev-findings.md#df-20261030-painted-screen-layers-overlay)).
- **Screen space**: px, origin top-left, Y down. Caption band (two lines) y 1150–1344; faces, gun actions and the relief emu head stay above y 1100 (brief: projection contract).
- **Sizes** (brief: [technical handoff](../film-brief.md#technical-handoff)): men 1.70 m (`man-elder` 1.64), seated gunner hat top 1.20 m, kneeling 1.25 m, emu 1.70 m standing / 1.5 m running / back 1.05 m, Lewis gun 1.28 m, truck 5.2 × 2.0 m, cab roof 2.1 m, tray deck 1.1 m. Lead px below are the projection tool's feet-to-head spans at these sizes (point model); a painted measure, where one exists, is quoted beside it and wins.
- **Clocks for motion**: flock walk/peck/run phases, wheat sway and water ripples on the ambient clock; story events (head turns, burst rounds, scatter, jam, time-lapse) on the story (shot) clock ([DF-20261030-painted-story-hold-ambient-clock](../../../../../docs/dev-findings.md#df-20261030-painted-story-hold-ambient-clock)).
- **Casting lines** follow [storyboard: cast and continuity](../storyboard.md#cast-and-continuity); shot blocks name only the pose and expression per shot.
- **Chrome** on every frame 0–2011: `@TamMaiLa` top-left and the label "แต่งเติมจากเรื่องจริง · ภาพและเสียงจำลอง ไม่ใช่ฟุเทจจริง" under it, outside the newsreel layer (VD30-10). Not repeated in the shot blocks.

## Voice anchors (measured)

All values global frames; `env` = envelope edge (±1 f), `±3 f` = Whisper word time checked against the syllable onsets. Line file starts are in [voice-lock.md](../voice-lock.md); the speech on/off frames below are where the voice is audible.

| Line | Speech [on, off) | Anchors used by the sheets |
| --- | --- | --- |
| L01 NARR | [2, 178) | "ปืนกล" 47 env · "นกอีมู" 70 env · pause 86–93 · "แล้ว" 93 · "ถอนทัพ" 106 env · pause 117–125 · "ไม่ใช่" 125 · pause 146–152 · "สอง" 152 · "รอบ" 167 env |
| L02 NARR | [206, 351) | "ปี" 206 · "บุฟเฟต์" 335 ±3 |
| L03 FARMER | [358, 431) | phrase 1 [358, 394) · phrase 2 "เรียก" 402 env |
| L04 NARR | [450, 588) | "เต็มกำลัง" 473 env · pause 490–496 · "แมเจอร์เมเรดิธ" 496 · "ทหารอีกสองนาย" 527 env · "ปืนกลสองกระบอก" 560 env |
| L05 NARR | [608, 649) | pause 619–624 · "สองสัปดาห์ก็จบมั้ง" 624 |
| L06 NARR | [671, 773) | pause 686–695 · **"ยิง" F = 695** env · **"…" E = 722** env (pause 722–727) · "นกแตกฝูง" 727 |
| L07 EMU | [781, 849) | "แยกวง!" [781, 803) · "เจอกันหลังไร่!" 823 |
| L08 NARR | [862, 901) | — |
| L09 NARR | [919, 1029) | pause 961–971 · "นกเป็นพัน" 971 · "เหมือนต่อคิว" 1001 ±3 · "ต่อคิว" 1009 ±3 |
| L10 NARR | [1046, 1099) | **"ยิง" F = 1046** env · **"…" E = 1079** env (pause 1079–1084) · "ปืนกล" 1084 · "ติด" 1096 env |
| L11 NARR | [1108, 1175) | pause 1146–1153 · "ปืนดันไม่ยอม" 1153 |
| L12 NARR | [1195, 1333) | pause 1255–1264 · "รถตามไม่ทัน" 1264 · "ทางกระเด้ง" 1294 env · "เล็งไม่ได้" 1315 ±3 |
| L13 NARR | [1353, 1441) | "รัฐมนตรี" 1382 env · "ถอนทัพ" 1402 ±3 · pause 1411–1415 · "รอบที่หนึ่ง" 1415 env |
| L14 NARR | [1458, 1559) | pause 1489–1497 · "นกพวกนี้" 1497 · "รถ" 1543 env · "ถัง" 1547 env |
| L15 EMU | [1567, 1600) | — |
| L16 NARR | [1617, 1754) | "กลับมา" 1639 ±3 · "ภาคสอง" 1648 env · pause 1662–1665 · "ลากยาว" 1665 · pause 1700–1713 · "แล้วก็ถอนอีก" 1713 · "รอบที่สอง" 1736 env |
| L17 NARR | [1766, 1879) | "ปี 1908" 1838 ±3; **the spoken year ends at 1879, inside the L18 file** (see open item O1) |
| L18 NARR | [1886, 1951) | "วันนี้" 1886 env · pause 1919–1925 · "ไม่เคยถอยสักรอบ" 1925 env · hold [1951, 2012) |

**VD30-11 round frames** (brief [gunfire beats](../film-brief.md#vd30-11)): F and E above; one round every **3 frames** (600 rounds/min, inside the brief's 3–4 frame range; a 4-frame spacing would leave fewer rounds in the measured phrase). B03-SH01: 11 rounds at global 695, 698 … 725 (F to cut − 2). B04-SH03: 11 rounds at global 1046, 1049 … 1076, everything still from E = 1079. Both bursts are 1.0 s, short of the brief's estimate (B03 1.2–1.6 s, B04 1.3–1.5 s), because the measured phrases are shorter; VD30-11 adds no run time, so the bursts fit the read rather than the read stretching.

## Shot map

The per-shot frame table. Claims follow the brief's [visual progression](../film-brief.md#visual-progression) claim links.

| Shot | Beat / VO | Global [start, endExclusive) | Frames (s) | Claims / clues | Runtime mapping |
| --- | --- | --- | ---: | --- | --- |
| B01-SH01 | B01 / L01a | [0, 90) | 90 (3.00) | F001, F002 | planned: `src/painted/edu30/` plate per shot (Editor names the composition) |
| B01-SH02 | B01 / L01b | [90, 149) | 59 (1.97) | F001, CL02 | planned |
| B01-SH03 | B01 / L01c | [149, 200) | 51 (1.70) | CL02 plant | planned |
| B02-SH01 | B02 / L02 | [200, 355) | 155 (5.17) | F001 year, F003, F004 | planned |
| B02-SH02 | B02 / L03 | [355, 440) | 85 (2.83) | — | planned |
| B02-SH03 | B02 / L04a | [440, 494) | 54 (1.80) | F002 | planned |
| B02-SH04 | B02 / L04b | [494, 604) | 110 (3.67) | F002 | planned |
| B02-SH05 | B02 / L05 | [604, 660) | 56 (1.87) | CL01 plant | planned |
| B03-SH01 | B03 / L06a | [660, 727) | 67 (2.23) | F007 | planned |
| B03-SH02 | B03 / L06b | [727, 778) | 51 (1.70) | F007 | planned |
| B03-SH03 | B03 / L07 | [778, 856) | 78 (2.60) | — | planned |
| B03-SH04 | B03 / L08 | [856, 912) | 56 (1.87) | — | planned |
| B04-SH01 | B04 / L09a | [912, 968) | 56 (1.87) | F005 | planned |
| B04-SH02 | B04 / L09b | [968, 1037) | 69 (2.30) | F005 | planned |
| B04-SH03 | B04 / L10a | [1037, 1084) | 47 (1.57) | F005 | planned |
| B04-SH04 | B04 / L10b | [1084, 1108) | 24 (0.80) | F005 | planned |
| B04-SH05 | B04 / L11 | [1108, 1186) | 78 (2.60) | — | planned |
| B05-SH01 | B05 / L12a | [1186, 1262) | 76 (2.53) | F006 | planned |
| B05-SH02 | B05 / L12b | [1262, 1346) | 84 (2.80) | F006 | planned |
| B05-SH03 | B05 / L13 | [1346, 1450) | 104 (3.47) | F001, F011, CL02 | planned |
| B06-SH01 | B06 / L14 | [1450, 1561) | 111 (3.70) | F010 | planned |
| B06-SH02 | B06 / L15 | [1561, 1612) | 51 (1.70) | — | planned |
| B06-SH03 | B06 / L16a | [1612, 1711) | 99 (3.30) | F001, CL01 | planned |
| B06-SH04 | B06 / L16b | [1711, 1762) | 51 (1.70) | F001, CL02 | planned |
| B07-SH01 | B07 / L17 | [1762, 1884) | 122 (4.07) | F013 (1908) | planned |
| B07-SH02 | B07 / L18 + hold | [1884, 2012) | 128 (4.27) | CL02 payoff | planned |

**Total:** 26 shots, contiguous, 2012 frames = 67.067 s = the voice-lock preview (`preview.wav` 67.0669 s; table total 67.07 s). Longest shots: B02-SH01 (crane, 5.17 s), B07-SH02 (ending + 2.0 s hold), B07-SH01 (crane reveal); every shot of 3 s or longer moves its camera ([retention camera](../../../../../docs/cinematography-principles.md#retention-camera)).

## Staging deviations from BOARD-R2 (Film, this pass)

Each came from the projection run or from the measured timing; story, reveals and IDs are unchanged.

| ID | Shot | BOARD-R2 → SCENE-R1 | Reason |
| --- | --- | --- | --- |
| SD01 | B01-SH01 | Frame 0 = LF01 exactly; the arc runs 134.5° → 128.5° with a push (r 4.17 → 3.8 m) instead of ending on LF01 | The locked look is the hook frame; arcing the other way pushes EMU-HERO out of frame left (x 103 at the end) |
| SD02 | B01-SH03, B02-SH02, B06-SH02 | Board yaws 180 / 186→180 / 168→174 corrected to 0 / −1→−8.5 / −12→−7 | In the kit convention the board yaws looked away from the subject (subject behind the camera) |
| SD03 | B02-SH03 | Camera on the track centre line (−0.2, 0.4, 9.8), yaw −85, f 850 (was (−0.2, 0.4, 11.4), yaw −110, f 800) | Cab height 458 px at f 800, below the lead rule; the old yaw looked away from the track |
| SD04 | B02-SH04 | Line-up south of the track at z 12.6, facing +z, the parked truck behind them; camera at z 15.2 (was z 8.0 / camera z 10.6) | The board camera stood inside the parked truck |
| SD05 | B03-SH04 | The feather lands on G1's pan magazine (0, 0.97, 0.15), not on the barrel shroud | The shroud projects into the caption band (y 1264–1391) |
| SD06 | B04-SH02–SH05 | Queue path follows the east and south shores (not across the water); queue on the wet rim z −4.9; MEREDITH and GUNNER-2 withdraw behind G1 during B04-SH02 (off screen) to (−7.2, 0.9, −3.6) and (−6.4, 0.7, −4.0); queue head walks (4.6 → 4.0) in B04-SH02, (3.6 → 3.0) in B04-SH03 and stands at (1.6, 0.33, −4.9) in B04-SH05 (brief: (3.0, 0.6, −5.2)); the B04-SH05 lens sits on the gun's line of fire, 3.2 m in front of the queue head, with G1 behind it (was beside the gun) | The brief's path crossed the dam; in the R4 marks the two men stood in G1's line of fire down the shore; from beside the gun the queue head was 203 px, now 505 px, and the birds staring at the gun stare into the lens |
| SD07 | B04-SH04 | Re-derived on the R4 G1 mark: eye (−5.45, 1.0, −4.45), yaw −5, pitch −32, f 1100; casing stone (−5.4, 0.33, −4.9) | Board camera was on the retired crest mark |
| SD08 | B04-SH03 / SH04 | Cooling ticks dropped; the ring decays in 9 frames | Measured: E → "ปืนกล" is 5 frames and E → "ติด" 17 frames; the click must land on dead silence |
| SD09 | B01-SH03, B02-SH03, B05-SH03, B06-SH04 | Boom placed after "รอบ" (not under it); fanfare 0.8 s (was 2 s); bugle one 1.0 s file (was 2.5 s) | Measured gaps to the next line; the bugle is the same file in both retreats |
| SD10 | B06-SH03 | Truck returns entering frame **left** (rows R5 said right) | From the retreat vantage +x is screen left; it left toward +x in B05-SH03 |
| SD11 | B07-SH01 | Crane starts at eye y 1.0, pitch 4 (was y 1.4, pitch 18) and ends on LF03 (f 1200, not the board's 950) | The board start already showed the whole emblem; LF03 is the locked end frame |
| SD12 | B03-SH01 / B04-SH03 | 11 rounds, 1.0 s each (brief est. 11–15 / 12–14 rounds) | Measured phrases; no run time added (VD30-11) |

## Sound plan (summary; per-shot cues in the shot blocks)

Music, beds, SFX language, silences and the ending follow the brief's [sound direction](../film-brief.md#sound-direction) (UT15 ending: Film's choice, B07-SH02). Cue IDs: `MUS-nn` music, `BED-01` projector whirr, `AMB-P/D/A` ambience, `SFX-<shot>-<n>`. Everything is `NEEDS-GEN` for Ton except where a block names a library ID with its fit reason; the cue sheet is Ton's after this revision ([cue sheet](../../../../../docs/sound-generation-workflow.md#sound-cue-sheet)).

| Cue | Global range | Notes |
| --- | --- | --- |
| BED-01 projector whirr + crackle | [0, 1762) then wind-down [1762, 1786) | Under every 1932 shot; it is the newsreel's "silence" |
| MUS-01 march intro (snare roll, brass sting) | [0, 106) | Cut dead on "ถอนทัพ" 106 |
| MUS-02 jaunty march | [200, 494); resumes [604, 695) | Stops for the B02-SH04 drum taps; drops out on round 1 of B03-SH01 |
| MUS-03 march low under EMU | [790, 856) | Re-enters after the scatter, low |
| MUS-04 ambush pizzicato vamp | [912, 1079) | Ducks 12 dB at F 1046, stops dead at E 1079 |
| MUS-05 galop | [1186, 1401) | Tuba slide into "ถอนทัพ" 1402 |
| MUS-06 admiring brass chorale | [1458, 1559) | Swell on "ถัง" 1547, cut at 1559 |
| MUS-07 slower detuned march | [1665, 1762) | After the trailer hit |
| MUS-08 anthem-style brass pad (full range) | [1766, 1919) | Pulls back at 1919 so "ไม่เคยถอยสักรอบ" lands dry |
| SFX-B07-SH02-3 ending button | [1972, 2012) | Major chord + snare flam, rings to the end |

Planned silences (whirr only): [106, 149) under "ถอนทัพ ไม่ใช่รอบเดียวนะ"; after the B03 burst [727, 741) under the start of "นกแตกฝูง" with the ring; [1079, 1096) from E to the click (ring gone by 1088); [1559, 1567) before the bow line; [1919, 1951) under "ไม่เคยถอยสักรอบ" (pad out, boom after).

## Caption plan

Editor owns line breaks (`scripts/caption-breaks.mjs`) and the [caption look](../../../../../docs/production-requirements.md#caption-look); text is the script's Thai, verbatim, with numerals as written in the script ("1932", "1908"). Bold lines per the script: L01a "ออสเตรเลียเคยส่งทหารพร้อมปืนกลไปรบกับนกอีมู… แล้วต้องถอนทัพ", L14 and L17. Suggested cue ranges = the speech ranges above split at the shots' VO phrases (shot blocks list them); a cue may hold up to 8 frames past its speech, never past the next cue. Title overlays (VD30-09) sit at y 260–520 and never overlap a caption.

## Baseline and assets

Baseline, projection, palette, light and fallbacks: brief [technical handoff](../film-brief.md#technical-handoff) and [scene decisions](../film-brief.md#scene-decisions); the sheets add only shot values.

| Asset / capability | Owner path (checkout `e09c995` + uncommitted) | Status | Gap / consumer |
| --- | --- | --- | --- |
| Newsreel layer `strength`, `tint`, `tintAmount`, `seed` | `src/painted/edu30/newsreel.tsx` | exists-unintegrated (look asset) | Boss hardens into `kit/screen.tsx`; add exposure-pop input (VD30-11); consumers all B01–B06 shots, B07-SH01 burn-out |
| Emu (stand, walk, peck, run, bow, look), EMU-HERO tuft and bib | `src/painted/edu30/emu.ts` | exists-unintegrated | Missing poses: startle, flap, hop + splash (B03-SH01, B04-SH03), head-cock (B04-SH05), wing flap small (B05-SH03, B06-SH04), neck-sac boom puff (B01-SH03), blink |
| Flock instancing, far mass | `src/painted/edu30/flock.ts` | exists-unintegrated | Per-bird delayed pose switch (B03-SH01); queue spacing/shuffle (B04-SH02); 60-bird render time (Boss) |
| Paddock set, dam set, arms wall | `edu30/paddock.ts`, `dam.ts`, `arms.ts` | exists-unintegrated | Eaten-patch growth and stubble state (B02–B06), time-lapse sun/shadow (B06-SH03), track ruts, camp; dam east approach and shore path (SD06) |
| 1932 cast outfits, seated-gunner arms | `edu30/cast.ts` | exists-unintegrated | `new: binoculars-at-eyes` (B03-SH04), `new: recoil-jolt` (VD30-11), salute P21 back/front check |
| Lewis gun (`magTurn`), bell tent, truck, crew gear | `edu30/props.ts` | exists-unintegrated | Recoil offset, jam action (click/puff), truck pedestal G2, truck as `YCam.body` rider (VD30-08) |
| Gunfire effects (flash, halation, pop, smoke, casings, shake, blast dust, spurts, water spouts) | — | missing (brief [kit check](../film-brief.md#vd30-11)) | Boss; B03-SH01, B04-SH03, B05-SH02 (two pops) |
| Title overlay style (VD30-09) | — | missing | Boss; B02-SH01, B03-SH01, B04-SH01, B05-SH01, B05-SH03, B06-SH04 |
| Yaw camera, `YCam.body`, `squareToCam`, `PEOPLE`, poses | `src/painted/kit/` | existing-integrated | — |

Relevant findings (consulted at the brief, not revalidated here): DF-20261030-painted-screen-layers-overlay, DF-20261030-painted-story-hold-ambient-clock, DF-20261030-p5brush-large-fill-mottle, DF-20261029-painted-timeline-dissolve (B07 burn-out inside one plate), DF-20261116-brush-scale-cumulative, DF-20261031-paint-seed-defer (gunfire marks as plain fills), DF-20261030-qa-plate-overlay-clock (shake on the shot clock).

## Dependencies and open items

| ID | Owner | Dependency / acceptance | Status |
| --- | --- | --- | --- |
| O1 | Editor | **Voice-lock split defect.** The L17/L18 cut falls inside the spoken year: L17's file ends on "…ปีพัน(เก้า)" and L18's file starts with "(เก้า)ร้อยแปด" (L18 file 0.00–0.65 s), so the preview has a 0.2 s hole inside "1908" at 61.77–61.97 s. Fix without re-generating or cutting: move the 0.2 s gap to after "แปด" (re-cut L17/L18 at the 62.62–62.87 s pause). The sheets already time L17's speech to 1879 and L18 to 1886, so no frame here changes. Check every line cut by ear (voice-lock.md says none was) | **resolved 2026-11-19 (Editor, VOICE-R1.1, user decision: gap moved to after "แปด")**: year unbroken 61.77-62.42 s (frames 1853-1873), gap in the pause 62.42-62.87 s, total 2012 frames; the year's tail is 6 frames earlier than the 1879 above, L18 from 1886 unchanged. Remaining: ear-check of the L13/L14 join | resolved |
| O2 | User / coordinator | GUNNER-2's `man-buzz` beard reads as a dark mask under the full tint (brief open question 5); unchanged until asked. Affects B01-SH01, B02-SH04, B02-SH05, B03-SH04, B04-SH01 | open |
| O3 | Boss | Every `missing` item above with its fallback (brief VD30-01, VD30-11 fallback order); proof stills per shot block acceptance | open |
| O4 | Ton | Cue sheet from the Sound lines; one library candidate (`comedy_record-scratch_01`, B03-SH04) pending the fit check | open |
| O5 | Boat (low) | Lewis ejection side and rate (brief open question 7); a correction changes only the casing arc side and the round spacing | open |
| O6 | Preaw (housekeeping) | script.md notes still say 1912 where L17 says 1908 (brief open question 3); captions follow L17 | open |
| O7 | Editor | Commit the final narration and lock the `public/` audio at W5/W8 ([re-editing](../../../../../README.md#re-editing)) | open |

Element captures: the locked looks (store `projects/edu/EDU/previews/EDU-EP30-W3-r1/`, `-r2/`, `LF02.58933d6b.png`; brief [look frames](../film-brief.md#look-frames)) are the only captures; no new capture in this pass. Editor scene sample proposal: B04-SH03 → B04-SH04 (frames 1037–1108: burst, stop dead at E, click on "ติด"), the beat with the tightest sync.

## Change log

- 2026-11-19, Film, `EDU-EP30-SCENE-R1`: first timed scene sheets from VOICE-R1 (67.07 s, 2012 frames). All 26 BOARD-R2 shots kept in order with their IDs, reveals and passed content; shot lengths re-timed to the measured read (BOARD-R2 was untimed, script estimate 59.4 s). VD30-11 round frames fixed (F 695 / 1046, E 722 / 1079, 3-frame spacing, 11 rounds each). Projection run on every shot; deviations SD01–SD12 recorded above. Voice-lock defect O1 found (L17/L18 split inside "1908"). Rows ROWS-R6 written (timed). Review page: pending.
