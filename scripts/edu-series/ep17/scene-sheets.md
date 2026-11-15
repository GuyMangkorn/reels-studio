# Timed scene sheets and index — EDU-EP17-SHORT (EDU-EP17-SHEETS-R1.2)

- **Deliverable:** `EDU-EP17-SHORT` (channel **edu**) · **Revision:** EDU-EP17-SHEETS-R1.2 (Film W5 retime to the v2 voice re-lock, 2026-11-15; R1.1 Film W5 plate review; R1.0 Film W5.1) · **Status:** `ready-for-dev`, voice-timed to narration **v2** (candidate B). Every shot block is retimed to the new G anchors; staging, cameras, IDs and picture intent are unchanged except the retimes listed in [R1.2 retime](#r12-retime) (SD28–SD36). Four shots need a Boss retime before they can play at the new length (B01-SH01, B01-SH03, B02-SH03, B04-SH04); the rest fit by trimming end frames or holding. · **Timing:** `checked-with-audio` on paper: line onsets, line ends and the 25 measured pauses are `meas` from [measure-v2.json](measure-v2.json) `placement_proposal` (G = 30·t_file + 30·c_seg); in-line word anchors are `meas` where a −30 dB gap marks them (ffmpeg `silencedetect` −30 dB / 0.05 s run by Film on the placed `public/narration/EDU-EP17-SHORT-narration-v2.wav`, log `out/logs/ep17-sd30-v2.txt`, not kept) and `est` (old anchor mapped by its syllable position inside the measured phrase, ±4 f) where marked. The tightest anchor is the L01|L02 boundary (0.125 s gap, medium confidence in measure-v2).
- **Evidence:** runtime: none at this timing (the W5.3 draft cut is v1-timed, 1829 f, and is superseded) · audio: Film cannot listen; the v2 file is placed by the Editor and measured by Film with silencedetect only · render/samples: none · projection: unchanged from R1.1 (no camera position changed; only move ranges, `projection-run.py` not re-run) · audio/subtitle sync: none · user approval: script R1.2.1 (2026-11-14), storyboard 25/25 (2026-11-15), look lock LF01–LF07 (2026-11-15), NAR candidate B (2026-11-15), V01–V03 / W-SKY gaps kept and the L04 ellipsis accepted as read (2026-11-15). This sheet revision is not user-approved.
- **Inputs (by revision):** script **EDU-EP17-SCRIPT-R1.2.1** ([script.md](script.md): beats B01–B06, lines L01–L19, V01–V03, W-SKY, W-HOLD, N1 trims T1–T5, clue ledger K01/K02); fact-check [fact-check.md](fact-check.md) R1.1 + R1.2.1 recheck (`ready-for-storyboard`); brief **EDU-EP17-BRIEF-R1.2.1** ([film-brief.md](film-brief.md): VD01–VD15, N1–N15, [projection contract](film-brief.md#projection-contract-and-scale-baseline), [sound direction](film-brief.md#sound-direction), [caption-zone rule](film-brief.md#caption-zone-rule)); storyboard **EDU-EP17-ROWS-R1.2** ([storyboard.md](storyboard.md), untimed; this file supersedes its numbers); voice re-lock [measure-v2.json](measure-v2.json) (W4 redo, 2026-11-15; supersedes [measure.json](measure.json)) and [narration-notes.md](narration-notes.md) Step 3; built shot clock `src/painted/edu17/clock.ts` and shot files `src/painted/edu17/shots/` (read for the built L frames); cue sheet [sound-cues.json](sound-cues.json) (v1 G frames; re-placement rule [below](#cue-re-placement)).
- **Target:** this worktree, branch `claude/underwater-cable-question-f0f950` at `64291e8` + uncommitted EP17 files · 30 fps · `durationFrames` **1709** (56.97 s) · 1080×1920 · composition `EDU-EP17-SHORT` (registered by the Editor, never in `src/Root.tsx`) · ending closed: W-HOLD 60 f, no loop seam.
- **Review rows:** [review-rows.json](review-rows.json) **EDU-EP17-ROWS-R2.2** (timed, `start`/`end` in G frames; R2.2: v2 timings, Q6 closed, the user's 2026-11-15 voice answers recorded, the v1 draft clips removed). Review page: pending.

## Units and conventions

- **Spaces, origins, axes, sizes:** the brief's [projection contract](film-brief.md#projection-contract-and-scale-baseline) (`R` yard, `W` = R + (0, +1.5, +14), `D` cutaway block, `G` globe, `B` bubble, `F` Red Sea, `FS` flashback seabed). Built values win over the brief's est values: `bedY(z)` and `cableAt(z)` in `src/painted/edu17/sea.ts`; block `floorY(x)` in `cutaway.ts`; phone centre (−0.40, 1.10, −0.60) at 25° in `yard.ts`; FS cables C1–C3 along (cos 25°, 0, −sin 25°) through the FS origin at offsets −2.5 / 0 / +2.5 m along the normal **n** = (sin 25°, 0, cos 25°) = (0.423, 0, 0.906) (`redsea.ts`).
- <a id="yaw-sign"></a>**Yaw sign (fixed once, for every camera line in this file).** `sheet(at, yaw, r, eye, f, hy[, pitch])`: **yaw is the LOOK yaw** (0 looks toward −z, +90 looks toward +x); the camera stands at at + r·(sin(−yaw), 0, cos(−yaw)) at absolute height `eye`, looking level along the yaw, tilted by `pitch` (deg, + looks up). Kit `camMove` takes the orbit **azimuth** az = −yaw; `sheetCam` in `src/painted/edu17/palette.ts` does that conversion, so Boss types these numbers unchanged into `sheetCam`. `look(pos, target, f, hy[, pitch])` = `lookAtCam`: yaw from pos → target in plan, pitch given (not derived from the heights). Negative yaw puts the camera on the +x side of its target. `f` and `hy` in px (picture x = 540 + f·right/depth, y = hy − f·up/depth).
- **Clocks:** `G` = composition frame; shot-local `L` = G − shot start; ranges half-open `[start, end)`. Every event clock is a pure function of G or L (seek-safe). Moves ease `easeInOutSine` over the stated L range unless written; arrivals `easeOutCubic`.
- **One shot = one timeline scene** (scene ID = shot ID, `S01-` prefix in the rows). Cuts are hard except two 6 f in-canvas dissolves that **start at the cut** (R1.2, SD29: the Editor's renderer behaviour accepted): G132–138 (B01-SH02 → SH03) and G164–170 (B01-SH03 → SH04). The incoming plate ramps 0 → 1 from its own L0; the outgoing plate keeps running underneath on its own clock, which `stage.tsx` clamps at L = len + 2.
- **Frame zones** (brief): caption band y 1176–1344 (stroke captions, kept calm by staging); faces, phone screen, contacts, the hose/cable comparison, labels and the bubble above y 1160; LBL (816–1020, 148–204); CARD (60–620, 168–236); BUB (90–990, 200–900); mark top-left x < 330, y < 140 clear.
- **Lead size:** MAN ≥ 480 px when visible; recorded exceptions B01-SH02 (404 px, then exits), B06-SH04 end (490 px tableau, passes).
- **Numbers marked `est`** are design values not checked by a run; everything else in a Camera line was run through `projection-run.py` (pinhole, at Film's 1.72 m baseline).

## Casting, props and hands

Casting unchanged from the storyboard: MAN `man-spiky + park-casual, new: hose-water, neutral` (no cap, sock = skin, flip-flops `#2b3a5a`), poses `new: hose-water`, P09 hands_on_hips, P30 visor_look_far, `new: hose-pinch`; SISTER `woman-long, P07, happy` on the phone screen only. No animals.

| Prop | State and owner hand, by G | Possible? |
| --- | --- | --- |
| Hose end | Right-hand grip at the end in every yard shot (N3 anchor). **SPRAY** (thumb half over the opening, fan) G0–229; **FLOW** (thumb off, end lowered, water pours at his feet) G229–665; **STOP** (pinched at G665, then held bent in the right fist) G665–1579; **SPRAY** again from G1579. Slack loop to the tap stays on the ground. | yes: one hand holds the end throughout; P09 rests the right fist (with the bent end) on the hip |
| Left hand | Slack hose at the hip (`hose-water`) G0–288; on the hip (P09) G288–353; visor at the brow (P30) G353–380; seen from behind G380–541; both hands lift the end and the left thumb and forefinger pinch it (`hose-pinch`) G660–702; P09 from G702; on the hose again (`hose-water`) from G1579 | yes |
| Phone + tripod | Fixed on the plank, centre (−0.40, 1.10, −0.60), screen turned 25° toward him; never moves. Screen: SISTER waves (P07) G0–36, then laughs/talks; same call through B06 | yes |

## Narration placement (Editor)

The narration is **one continuous read**, candidate B (store `projects/edu/EDU/audio/2026-11-15_ep17-nar-v2-B-fullread-x1.05.wav`, 50.256 s; no pause surgery, the read's own pauses). The Editor's [narration-place.py](narration-place.py) splits it at five cut points and places six segments; each gap is extended to the v1 slot length with crossfaded room tone from the cut gap (never digital silence). Output `public/narration/EDU-EP17-SHORT-narration-v2.wav` = **1709 f**. Placement: G = 30 · t_file + c. Values from [measure-v2.json](measure-v2.json) `placement_proposal`.

| Segment | Lines | File in → out (s) | c (f) | File start on timeline (s) | First onset G | Last voiced G | Shift vs v1 at first onset / last end (f) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A | L01, L02, L03 | 0.000 → 7.577 | +5.07 | 0.169 | 12.0 (L01) | 226.1 (L03) | 0.0 / −31.3 |
| B | L04 | 7.577 → 9.918 | +58.20 | 9.517 | 291.7 (L04) | 348.9 | −31.3 / −50.3 |
| C | L05, L06, L07 | 9.918 → 19.580 | +78.27 | 12.527 | 382.7 (L05) | 657.2 (L07) | −50.3 / −78.5 |
| D | L09, L10 | 19.580 → 24.886 | +109.65 | 23.235 | 705.5 (L09) | 850.4 (L10) | −78.5 / −84.2 |
| E | L12, L13, L14, L15 | 24.886 → 41.157 | +132.45 | 29.301 | 884.8 (L12) | 1360.5 (L15) | −84.2 / −108.6 |
| F | L17, L18, L19 | 41.157 → 50.256 | +150.63 | 46.178 | 1392.1 (L17) | 1648.2 (L19) | −108.9 / −120.1 |

| Take | Store file (`projects/edu/EDU/audio/`) | Voiced span in file (s) | Voiced onset G | Voiced end G | File start on timeline (s) | Treatment |
| --- | --- | --- | --- | --- | --- | --- |
| V01 MAN | `2026-11-15_ep17-char-v01-algenib.wav` | 0.152–1.793 ("ห๊ะ" 0.15–0.45, "ใต้ทะเล?" 1.07–1.79) | 234.7 | 283.9 | 7.672 | trim to 0.10–1.85 s, 3 f fades; in the clear |
| V02 MAN | `2026-11-15_ep17-char-v02-algenib.wav` | 0.302–1.406 | 664.5 | 697.6 | 21.849 | trim 0.25–1.46 s; in the clear |
| V03 MAN | `2026-11-15_ep17-char-v03-algenib.wav` | 0.292–0.880 | 860.8 | 878.4 | 28.402 | trim 0.24–0.88 s, 2 f fade-out; in the clear |
| Sister laugh | `2026-11-15_ep17-sister-laugh-aoede.wav` | 0.258–1.867 (bursts 0.26–1.05, 1.65–1.87) | 1579.3 | 1627.5 | 52.385 | onset = L19 onset − 4 f; small-phone-speaker filter (band-pass ~400–4000 Hz, slight room), −12 dB under NAR |

**Gaps set by placement** (voiced end → next voiced onset, kept from v1 by the user's 2026-11-15 decision): L03 → V01 8.6 f · V01 → L04 7.8 f · L04 → L05 33.8 f (W-SKY) · L07 → V02 7.3 f · V02 → L09 7.9 f · L10 → V03 10.4 f · V03 → L12 6.4 f · L15 → L17 31.6 f (the B05-SH05 reaction) · L19 → end 60.8 f (W-HOLD 60 f). Lead: L01 onset G12. Every other pause is the read's own (0.125–0.62 s, no longer a uniform 0.38 s): notably L01|L02 is only 3.8 f (medium confidence), L15's "…" is 18.6 f, and **L04's "…" has no pause at all** (read continuous; user accepted it as read, 2026-11-15).

**Word anchors (G, v2):** L01 12 · "คนต่างประเทศ" 34 `est` · L01 "…" 51–57 · "ดาวเทียม" 87 `est` · "นะ" 98 `est` · L01 ends 102.3 · L02 106.1 · "วิ่ง" 109 `est` · "ที่นอน" 126 `est` · "ก้นทะเล" 141 · L02 ends 155.7 · L03 164.2 · "ข้าม" 170 `est` · "ราว ๆ" 192 · "ไปทางนี้" 213 `est` · L03 ends 226.1 · V01 "ห๊ะ" 235–244, "ใต้ทะเล?" 262–284 · L04 291.7 · "ไม่ใช้ดาวเทียมล่ะ" 328 `est` (no gap) · L04 ends 348.9 · L05 382.7 · "เฮลิคอปเตอร์" 397 `est` · "…" 416–424 · "ขนได้" 424 · "ทีละนิด" 434 `est` · L05 ends 448.6 · L06 457.3 · "คือทางด่วน…" 492 · "ทางด่วน" 497 `est` · L06 ends 529.9 · L07 544.6 · "…" 566–573 · "สายที่แบก…" 573 · "หนาแค่" 611 · L07 ends 657.2 · V02 664.5–697.6 · L09 705.5 · "ล่ะ" 729 `est` · L09 ends 735.4 · L10 747 · "…" 763–772 · "มันมัก…" 772 · "น้ำตื้น" 800 `est` · "ไม่ใช่กลางทะเลลึก" 826 · L10 ends 850.4 · V03 860.8–878.4 · L12 884.8 · "…" 909–916 · "สมอ" 916 · "อวนลาก" 934 · "ครูดพื้น" 952 · "เกี่ยว" 964 · "ขาด" 980 `est` · L12 ends 986.3 · L13 996.7 · "ทะเลลึก" 1013 `est` · "…" 1025–1032 · "มันกลัวเรือ" 1032 · "เรือ" 1045 `est` · L13 ends 1053.6 · L14 1067.9 · "…" 1112–1120 · "เรือลำหนึ่ง" 1120 · "ขีปนาวุธ" ends 1158 · "แล้วสาย…" 1166 · "สาย" 1172 / "ขาด" 1180 / "สามเส้น" 1186 `est` · L14 ends 1199.2 · L15 1210.5 · "…" 1237–1256 · "แต่" 1256 · "น่าจะ" 1296 · "สมอ" 1314 `est` · "ลากพื้น" 1350 · L15 ends 1360.5 · L17 1392.1 · "เสียหาย" 1427 `est` (−20 dB dip 1425.5–1427.3) · L17 ends 1483.5 · L18 1495.2 · "ไม่รู้ตัว" 1508 `est` · "…" 1523–1534 · "เพราะ…" 1534 · "อ้อม" 1550 · L18 ends 1571.6 · laugh 1579.3–1627.5 · L19 1583.3 · "…" 1615–1622 · "ก็อาจ" 1622 · "อ้อม" 1639 `est` · L19 ends 1648.2.

## Total runtime

| Segment | Frames | Notes |
| --- | --- | --- |
| Lead before L01 | 12 | A1 + S1 + S2 chime only (silence policy 1) |
| Narration span L01 onset → L19 end | 1636.2 | the read as measured (1490.6 f, 0.231–49.918 s) + the room-tone extensions |
| of which room tone: V01 / W-SKY / V02 / V03 / B05-SH05 | 53.1 + 20.1 + 31.4 + 22.8 + 18.2 = 145.6 | each = kept v1 slot gap − the read's own gap there |
| Tail: W-HOLD | 60.8 | L19 end → last frame |
| **Total** | **1709** | **56.97 s**, 25 shots (v1: 1829 f, −120 f) |

Inside the script's 54–60 s window: no trim question ([Q6](#q6-length) closed).

<a id="r12-retime"></a>
## R1.2 retime (v1 → v2 G table and Boss work)

Cut rule: every cut keeps its v1 relation to the voice (the same offset from the same line onset, word or voiced end; v1 values in the old column). Shot-local frames that Boss authored keep their L frames unless a row below says otherwise. **Class:** `fit` = plays as built (trim end frames or hold); `N` = one-constant Boss edit (the shot file's `const N` or move range set to the new length, so a whole-shot camera move ends at the cut instead of being cut short; until done the move is simply cut early or held, acceptable for a draft); `sync` = a Film retime of an authored beat to keep it on its word (picture fits without it, but drifts > 6 f); `fix` = **cannot play at the new length as built** (an authored beat falls past the cut).

| Shot | v1 G (len) | v2 G (len) | Δlen | Cut rule | Frames cut / added (shot-local, built) | Class and Boss work |
| --- | --- | --- | --- | --- | --- | --- |
| B01-SH01 | 0–119 (119) | 0–102 (102) | −17 | L02 onset − 4 | cut L102–118 (push-in tail L102–111 + still L112–118) | **fix**: signal events −12 f (spring L84, tip L94, squash L94–98, bend L98–102; S3 L84, S4 L94); `N`: push range L56–112 → L56–102 (SD28) |
| B01-SH02 | 119–149 (30) | 102–132 (30) | 0 | splash L27 (on "ที่นอน" 126 `est` + 3) | none; L30–32 shown under the start-at-cut dissolve | fit |
| B01-SH03 | 149–190 (41) | 132–164 (32) | −9 | L03 onset (164.2) | cut L35–40 (built still); L32–34 shown only under the dissolve G164–170 | **fix**: pulse arrival L35 → L29 (`lin(L, 12, 29)`, trail from L29) or the pulse never reaches centre (SD29) |
| B01-SH04 | 190–260 (70) | 164–229 (65) | −5 | V01 onset − 6 | cut L65–69 (still L58–70 → L58–65) | fit |
| B01-SH05 | 260–319 (59) | 229–288 (59) | 0 | L04 onset − 4 | none | fit |
| B02-SH01 | 319–403 (84) | 288–353 (65) | −19 | L04 end + 4 | cut L65–83 (last 12 % of the arc travel) | `N` 84 → 65 |
| B02-SH02 | 403–430 (27) | 353–380 (27) | 0 | L05 onset − 3 | none | fit |
| B02-SH03 | 430–607 (177) | 380–541 (161) | −16 | L07 onset − 4 | cut L161–176 | **fix**: every event at or after L56 −12 f (SD30); helicopter drift and stage push end L78 → L66; `N` 177 → 161 |
| B03-SH01 | 607–689 (82) | 541–607 (66) | −16 | "หนาแค่" − 4 | cut L66–81 (truck tail) | `N` 82 → 66; `sync` pulse L43 → L34 (SD31) |
| B03-SH02 | 689–738 (49) | 607–660 (53) | +4 | V02 onset − 5 | add L49–52 (clamped truck end = hold) | `N` 49 → 53 |
| B03-SH03 | 738–780 (42) | 660–702 (42) | 0 | L09 onset − 4 | none | fit |
| B04-SH01 | 780–808 (28) | 702–729 (27) | −1 | "ล่ะ" (729 `est`) | cut L27 | `N` 28 → 27 (optional) |
| B04-SH02 | 808–937 (129) | 729–853 (124) | −5 | L10 end + 2.6 | cut L124–128 (drift tail) | `sync` climb arrival L104 → L97 on "ไม่ใช่กลางทะเลลึก" (SD32); `N` 129 → 124 |
| B04-SH03 | 937–965 (28) | 853–881 (28) | 0 | L12 onset − 4 | none | fit |
| B04-SH04 | 965–1092 (127) | 881–993 (112) | −15 | L13 onset − 4 | cut L112–126 | **fix**: anchor and trawl events −10 f (SD33); `N` 127 → 112 |
| B04-SH05 | 1092–1167 (75) | 993–1064 (71) | −4 | L14 onset − 4 | cut L71–74 (u 0.993 → LF07) | `sync` boat bobs −7 f (SD34); `N` 75 → 71 |
| B05-SH01 | 1167–1278 (111) | 1064–1162 (98) | −13 | "แล้วสาย" − 4 | cut L98–110 (move tail) | `N` 111 → 98 |
| B05-SH02 | 1278–1325 (47) | 1162–1207 (45) | −2 | L15 onset − 4 | cut L45–46 | `N` 47 → 45 (optional) |
| B05-SH03 | 1325–1363 (38) | 1207–1252 (45) | +7 | "แต่" − 4 | add L38–44 (push held) | `N` 38 → 45 (SD35) |
| B05-SH04 | 1363–1473 (110) | 1252–1364 (112) | +2 | L15 end + 4 | add L110–111 (the drag formula continues, camera already held) | fit |
| B05-SH05 | 1473–1497 (24) | 1364–1388 (24) | 0 | L17 onset − 4 | none | fit |
| B06-SH01 | 1497–1607 (110) | 1388–1491 (103) | −7 | L18 onset − 4 | cut L103–109 | `N` orbit 110 → 103; spark 7 L99 → L96 so its 6 f flicker completes (SD36) |
| B06-SH02 | 1607–1695 (88) | 1491–1579 (88) | 0 | L19 onset − 4 | none | fit |
| B06-SH03 | 1695–1737 (42) | 1579–1618 (39) | −3 | "ก็อาจ" − 4 | cut L39–41 | `N` 42 → 39 (optional) |
| B06-SH04 | 1737–1829 (92) | 1618–1709 (91) | −1 | end = L19 end + 60.8 | cut L91 (last hold frame) | fit |

The shot clock `SHOT_TABLE` in `src/painted/edu17/clock.ts` takes the v2 column (Boss), and `TOTAL` in `src/videos/edu-ep17/index.ts` becomes 1709 (Editor).

## Staging deviations (Film decisions from the projection run and the W3 picks)

These win over the storyboard's est numbers; the brief owns everything not listed.

- **SD01 Yaw sign** fixed as [above](#yaw-sign) (the W3 finding (5); `sheetCam` already implements it).
- **SD02 B01-SH01 end = LF01** (whole figure, head y 612, feet y 1826, 1214 px), not "cropped at the waist" (W3 finding (3)). The caption band crosses his shorts, legs and the trailing hose, as in the locked LF01 (user accepted the LF01 band, 2026-11-15).
- **SD03 B01-SH02 re-staged:** the storyboard cameras put his head at y 1604 at the start and passed him by the end. New `look()` cameras behind his right side (same side of the MAN↔phone line as LF01); he sits bottom-left, 404 px (recorded exception) and exits frame left by L20.
- **SD04 B01-SH03 passes through LF02** (the locked mid-descent still) as a middle key.
- **SD05 B03-SH01 and B03-SH02 (lower) cameras lifted onto the built floor:** the storyboard had them at y −46 / eye −45.4, under `bedY(−300)` = −41.27 (the same defect the W3 pass fixed in B01-SH03). The cable now crosses at y 901 (SH01) and 1060–1100 (SH02, 40 px).
- **SD06 B04-SH02 sink camera above the floor:** the storyboard eye −44 at z −412 sat 0.28 m under `bedY(−412)` = −43.72; now eye −34.0 → −41.72 (2.0 m over the floor).
- **SD07 B04-SH04 faces the shore (yaw 160 → 168):** at the storyboard yaw 70 → 78 the snag point K left the frame (x 1498, y 1273 in the band) and the anchor's drag, which must cross the cable along x, would read as depth motion. Facing the shore, the cable recedes up the slope and the anchor enters screen-left and crosses it laterally (K at (695, 905) → (450, 895)), continuing B04-SH02's shoreward view.
- **SD08 B04-SH05 = the locked LF07 strip camera** (`cutCam(u)`, Q5 resolved by the look lock), replacing the R1.1 line.
- **SD09 B05-SH03 eye 1.30, hy 640** (storyboard 1.50 / 660 put the phone's bottom at y 1319, in the band; now 1025).
- **SD10 B05-SH04 staged in FS and backing down the chain** at a constant yaw −25 (looking along −n, the drag direction), ending r 10, hy 700 so the furrow's crossings of C1–C3 sit at y 885 / 960 / 1138, above the band. Chain geometry below (compressed: no depth claimed).
- **SD11 B05-SH02 truck 1.0 m** (storyboard 3 m in 1.6 s was a 2 m/s slide).
- **SD12 B02-SH02 hy 1240** (storyboard 1500 put his face at y 966; now 707 = the storyboard's "head ≈ y 700").
- **SD13 B02-SH01 arcs 8° about M0** (his feet), not about the far target, which swung the camera behind him (x 390 → 726).
- **SD14 Globe in screen terms:** the built globe is a `GlobeView` {cx, cy, r px, lon, lat} (`globe.ts`), so globe camera lines use it instead of "r 3.4, eye 0.35". The L18 junction uses the built line numbering: the line that sparks = code **L16** (yard → north), its neighbour = code **L4** (Singapore → Hong Kong), slide point **J (112°E, 17°N)** where they run 1.8° apart (brief "L7/L8" are pre-code names).
- **SD15 END1 1.9 s** (brief 2.2 s), so the closing figure rings out inside the 60 f hold instead of being cut.
- **SD16 B01-SH05 = LF01R** (long lens; user picked it, 2026-11-15); the storyboard's R1.1 fallback is dropped.
- **SD17 Hose FLOW state** between V01 and V02 (see props): V01 "stops the spray" by lifting the thumb, so V02's pinch has water to stop. New cue S1b (below).
- **SD18 Globe `lat` is the code literal (R1.1; Boss W5 pass-2 finding).** `GlobeView.lat` is the negated facing latitude, so LF03 {lon 112, lat 10} faces 10°S. Globe camera lines in this file give `GlobeView` literals for the LF03-derived views (B01-SH04 end, B06-SH01: kept exactly, the locked LF03 picture is what was approved), and a **target point** centred with `facing()` where a shot must centre a place (B01-SH04 start on the yard dot, B06-SH02 on J). No picture changes; evidence `w6-boss/sheet-B01-SH04.png`, `sheet-B06-SH01.png`.
- **SD19 B01-SH04 start centred on the incoming pulse (R1.1).** Start view puts the yard dot at (469, 872), where B01-SH03's built pulse ends ((467, 875) → (470, 871) over L35–43), not at (540, 960): the accept test is dot-under-pulse (≤ 40 px) across the G187–193 dissolve, which this meets; B01-SH03's pulse is not moved.
- **SD20 B06-SH02 slide point (R1.1).** R1.0 put the slide at J (112°E, 17°N), which lies on code L16 *past* the spark (110.5°E, 15.5°N), so the pulse would ride the dead stretch. The rider now leaves L16 just short of the spark (≈ 110.2°E, 15.0°N) and lands on L4 at 17°N (≈ 113.2°E), slide ≈ 55 px at r 1100 over L57–75; the camera still centres J. A dim spark mark stays at the break (see the B06-SH02 block) so the detour reads as going around it.
- **SD21 B05-SH04 end hold (R1.1).** The camera arrives at at = A(51) and holds framing from L61 while the anchor drags on to L110 (following A(L) would put the C3 crossing at y ≈ 1300, in the band). Anchor near (540, 740–820) at the end.
- **SD22 B05-SH04 hull broadside (R1.1, Film).** The hull silhouette rides with the chain top (the sheet's 0.2 m/s drift would break the chain) and is turned **broadside** (long axis along screen x, seen from below: flat keel, pointed bow, square stern), because the end-on silhouette read as a kite or arrowhead, not a ship (`w6-boss/sheet-B05-SH04.png`). A ship dragging its anchor beam-on is plausible, and the shot is compressed staging, so no depth is claimed.
- **SD23 LF06 corner wedge left in the locked still (R1.1).** The locked LF06 still keeps its small unpainted wedge bottom-right (y > 1700); it is a reference, not shipped. B05-SH02 paints sand from 5 m behind the lens (`near: 5`) and has no wedge; that is the binding picture.
- **SD24 B02-SH03 left hand (R1.1).** From behind, the left hand rests on the slack hose (`hose-flow` + slack), not P09: P09's elbows went wide behind the bubble. The props table's "seen from behind G430–607" covers it.
- **SD25 B02-SH02 camera tune accepted (R1.1).** `look((−0.80, 0.95, −0.85), (0, 1.55, 0), 954, 1150)` → hy 1180 at L27 (R1.0: x −0.55, f 900 → 954, hy 1240 → 1270), near 0.05: the R1.0 camera sat behind the sister's phone (covered his face) and near-clipped the wall. Re-run `out/logs/ep17-projection-w5.txt`: face (540, 690), within 17 px of SD12's 707; feet off frame at the end (medium shot, UT13).
- **SD26 B01-SH02 end (R1.1).** MAN is still partly in frame bottom-left at L33 (head (39, 1396), below the band; card-width difference from the run's (−78, 1330)). Accepted: he reads as leaving frame while the line dives; the dissolve takes him out.
- **SD27 B04-SH02 bared stretch at the horizon (R1.1).** At L104 the bared stretch K projects to (642, 710) and reads as a thin lit dash. Accepted: L10's point is the place (shallows, hulls, chains), the brief forbids claiming a bare near-shore cable (cable look, F007/F008), and B04-SH04 shows the stretch close at 3.2 m. The arrival frame still needs the hull chains to read (fix list).
- **SD28 B01-SH01 signal line −12 f (R1.2, fix).** The v2 read reaches "ดาวเทียม" at L87 `est` and the shot ends at L102 (L01|L02 gap only 3.8 f), so the built line (spring L96, bend done L114) would be cut mid-squash. Every signal event moves −12 f with its durations unchanged: spring L84, tip L94 (easeOutCubic), squash L94–98, bend down L98–102; the bend completes on the cut instead of holding 5 f, and B01-SH02 picks the curl up over the wall. S3 at L84, S4 at L94. The 3 % push-in runs L56–102.
- **SD29 Start-at-cut dissolves; B01-SH03 pulse at L29 (R1.2, fix).** The Editor's renderer starts the 6 f dissolve at the incoming cue and keeps the outgoing plate running (clamped at its L len + 2), so R1.2 accepts it instead of the centred dissolves: G132–138 and G164–170. B01-SH03 is 32 f, so the built pulse arrival (L35) would never be painted (the outgoing clamps at L34). The pulse now reaches the centre point at L29 (`lin(L, 12, 29)`, trail after L29) and rides (467, 875) → (470, 871) through L29–34; SD19's dot-under-pulse test applies over G161–170. Camera keys L0 / L19 (LF02) / L31 unchanged.
- **SD30 B02-SH03 second half −12 f (R1.2, fix).** At 161 f the built fold (L133–170) runs past the cut. Every event at or after L56 moves −12 f: crate swing L44–62 (starts on "ขนได้" L44), page-turn L66–77 (ends on the L06 onset L77), motorway from L77, squeeze L121–138, roll L138–158 (37 f = 1.23 s, ≤ 1.5 s), hold L158–161. Helicopter drift `sine(L, 10, 66)`, first stage push 1.0 → 1.10 over L0–66, second 1.0 → 1.08 over L77–161; helicopter lift L14–30 unchanged ("เฮลิคอปเตอร์" L17 `est`).
- **SD31 B03-SH01 pulse L43 → L34 (R1.2, sync).** Keeps the pulse 2 f after "สายที่แบก" (L32), as in v1.
- **SD32 B04-SH02 arrival L104 → L97 (R1.2, sync).** The climb lands on "ไม่ใช่กลางทะเลลึก" (L97): `u = sine(L, 18, 97)`, drift `sine(L, 97, 124)`. Hulls and chains stay from L70 (on "น้ำตื้น" L71 `est`). Climb = 79 f, 64 % of the shot; end framing unchanged.
- **SD33 B04-SH04 anchor and trawl −10 f (R1.2, fix).** The built break (L113) falls past the new cut (L112). Anchor run and trawl pass are evaluated at L + 10 (speeds unchanged): anchor enters L34 ("สมอ" L35), otter board and net L53–85 ("อวนลาก" L53), fluke reaches K L87 ("เกี่ยว" L83, +4), lift taut L87–101, cable parts L103 ("ขาด" L99 `est`, +4) with the sand puff and the glow stopping at KD, drag on to the cut at L112. Camera move over L0–112. S14's baked snap stays on the break (S14 at L34).
- **SD34 B04-SH05 boat bobs −7 f (R1.2, sync).** Bobs at L39, L43, L47, L51 (from "มันกลัวเรือ" L39), S16 on "เรือ" L52 `est`; the deep glow L21–27 stays ("ทะเลลึก" L20 `est`).
- **SD35 B05-SH03 7 f longer (R1.2).** The v2 read pauses 18.6 f after "ฟังเหมือนจงใจ…"; the shot holds his suspicious look through it (cut 4 f before "แต่"); the 5 % push runs over L0–45.
- **SD36 B06-SH01 spark 7 at L96 (R1.2).** At 103 f the L99 spark would lose its last 2 flicker frames at the cut; L96 completes it by L101.

## Sound plan (whole video; per-shot cues in the shot blocks)

Cue IDs and descriptions: brief [sound direction](film-brief.md#sound-direction) (Ton makes every NEEDS-GEN cue and checks every library ID by ear; Editor places exactly this sheet). Ducking per brief: NAR on top; A1/A2/A5 −14 dB under NAR, −8 dB in gaps; M1/M2 −16 dB under NAR. **R1.2:** Ton made all 71 cues for the v1 timeline (W5.3, [sound-cues.json](sound-cues.json), 0 NEEDS-GEN); the "Source" column is the design history. The G ranges below are v2; [cue re-placement](#cue-re-placement) moves each placed cue.

| Layer | Source | G ranges |
| --- | --- | --- |
| M1 explainer bed | `bed_curious-explainer-light_01` (lib, 95 bpm; Ton confirms by ear, else NEEDS-GEN per brief) | in at 2 on G12 · 2.5 G102–229 · ducked −20 dB G229–288 · 2 G288–350 · out G350–356 · 2.5 G380–541 · **stops dead G541** · back at 1.5 G697 · 1 G702–747 · 2.5 G747–853 · ducked −20 G853–881 · 3 G881–993 · 2.5 G993–1045, downbeat on S16 G1045, 2 to G1064 · out G1064–1070 · warm 2 G1388–1579 · 1.5 G1579–1630 · fades out G1630–1649 |
| M2 dark pulse | NEEDS-GEN (brief) | 1.5 G1064–1256 · thins G1256–1364 · out G1364 |
| M3 held note | NEEDS-GEN (brief) | G541–660 alone, release G660–672 |
| A1 seaside yard | NEEDS-GEN | G0–132 (−8 until G12, then −14) · G229–541 (−10 under V01, −16 in W-SKY G353–380, −10 in the bubble) · G607–660 faint in the split's upper half · G660–729 · G853–881 · G1207–1252 (−14) · G1364–1388 (−8) · G1579–1709, fades to silence G1679–1709 |
| A2 shallows (a hush, b engines) | NEEDS-GEN | G132–158 (a+b) · G801–853 (a+b, fades in) · G881–993 (a+b) |
| A2a low-passed (flashback) | A2 stem (a), Editor low-pass | G1162–1207 · G1269–1364 |
| A3 deep hush | NEEDS-GEN | G143–164 · G541–660 · G729–821 |
| A5 open sea | NEEDS-GEN | G1064–1162 · G1252–1269 (fades under the descent) |
| S1 hose spray loop | NEEDS-GEN | G0–132 (−6 dB in B01-SH02) · G1579–1709 |
| **S1b hose flow loop (new, SD17)** | NEEDS-GEN: a garden hose running freely with no thumb on it, water pouring onto sandy soil by his feet with a soft gurgle / continuous / water on sand and a clay pot base / outdoors, close / 6 s loop / "idle, forgotten" | G229–665 under yard shots only (−18 dB; out in the bubble G380–541 and under the sea/split) |
| END1 | NEEDS-GEN (brief; **1.9 s**, SD15) | onset G1650 (ends G1707) |

**Mix intent (EP08a):** B01 hold (place) → lift on the dive → hit on the globe shimmer → drop for V01; B02 hold → drop to near silence (W-SKY) → comic lift (bubble); B03 hard drop (music stops) → hold on M3 → small hit (pinch); B04 thin → lift (riser) → drop (V03) → lift to the peak (drag) → hit (S16) → release; B05 drop to a serious hold → small turn hit (S19) → release into the yard; B06 warm lift → hold → release to END1 and silence.

<a id="cue-re-placement"></a>
### Cue re-placement (v1 sound-cues.json → v2)

**Rule (Ton places, Editor checks):** every cue in [sound-cues.json](sound-cues.json) keeps its `shot`; `frame` = v2 shot start (the [retime table](#r12-retime)) + `frameLocal`, where `frameLocal` is unchanged except in the four retimed shots and the sync rows (B01-SH01 local ≥ 90: −12; B01-SH03 L35 → L29; B02-SH03 local ≥ 56: −12; B03-SH01 L43 → L34; B04-SH04 local ≥ 40: −10; B04-SH05 L59 → L52; B05-SH01 L109 → L96; B06-SH01 L99 → L96). `endFrame`: within 6 f of a v1 cut it keeps its offset from that cut (the cut maps to its v2 cut); otherwise it maps like a frame inside the shot that contains it and is clipped to that shot's v2 end. `totalFrames` 1709, `sceneSheets` EDU-EP17-SHEETS-R1.2; the `levels.checks` `fromSec`/`toSec` map by the same rule (×30 → G → v2 G ÷ 30). Per-segment narration offsets (for checks tied to speech): segment A 0.0 f, B −31.3, C −50.3, D −78.5, E −84.2, F −108.9 at their first onsets (table under [Narration placement](#narration-placement-editor)). The table applies the rule (Film, computed from sound-cues.json at its W5.3 state):

| Cue | Shot | v1 G (L) | v2 G (L) | v1 end → v2 end | Note |
| --- | --- | --- | --- | --- | --- |
| A1-B01 | B01-SH01 | 0 (L0) | 0 (L0) | 149 → 132 |  |
| S1-B01 | B01-SH01 | 0 (L0) | 0 (L0) | 149 → 132 |  |
| S2-chime | B01-SH01 | 0 (L0) | 0 (L0) | — |  |
| M1-in | B01-SH01 | 12 (L12) | 12 (L12) | 400 → 350 |  |
| S3-zip | B01-SH01 | 96 (L96) | 84 (L84) | — | SD28 |
| S4-brake | B01-SH01 | 106 (L106) | 94 (L94) | — | SD28 |
| S5-dive | B01-SH02 | 137 (L18) | 120 (L18) | — |  |
| A2a-B01 | B01-SH03 | 149 (L0) | 132 (L0) | 175 → 158 |  |
| A2b-B01 | B01-SH03 | 149 (L0) | 132 (L0) | 175 → 158 |  |
| A3-B01 | B01-SH03 | 160 (L11) | 143 (L11) | 190 → 164 |  |
| S6-B01a | B01-SH03 | 184 (L35) | 161 (L29) | — | SD29 |
| S7-globe | B01-SH04 | 196 (L6) | 170 (L6) | — |  |
| S6-B01-glow1 | B01-SH04 | 226 (L36) | 200 (L36) | — |  |
| S6-B01-glow2 | B01-SH04 | 234 (L44) | 208 (L44) | — |  |
| S6-B01-glow3 | B01-SH04 | 242 (L52) | 216 (L52) | — |  |
| A1-B01b | B01-SH05 | 260 (L0) | 229 (L0) | 607 → 541 |  |
| M1-B01b | B01-SH05 | 260 (L0) | 229 (L0) | 406 → 356 |  |
| S1-last-dribble | B01-SH05 | 260 (L0) | 229 (L0) | 272 → 241 |  |
| S1b-B01 | B01-SH05 | 260 (L0) | 229 (L0) | 403 → 353 |  |
| S8-twinkle | B02-SH02 | 415 (L12) | 365 (L12) | — |  |
| M1-B02c | B02-SH03 | 430 (L0) | 380 (L0) | 607 → 541 |  |
| S24-pop | B02-SH03 | 430 (L0) | 380 (L0) | — |  |
| S9-heli | B02-SH03 | 440 (L10) | 390 (L10) | — | fade out by L66 (G446), the page-turn |
| S10-motorway | B02-SH03 | 530 (L100) | 468 (L88) | — | SD30; stop at G541 (3 f fade): 75 f file from L88 would run 2 f past the cut |
| A3-B03 | B03-SH01 | 607 (L0) | 541 (L0) | 738 → 660 |  |
| M3-hold | B03-SH01 | 607 (L0) | 541 (L0) | 750 → 672 |  |
| S6-B03 | B03-SH01 | 650 (L43) | 575 (L34) | — | SD31 |
| A1-B03 | B03-SH02 | 689 (L0) | 607 (L0) | 808 → 729 |  |
| S1b-B03 | B03-SH02 | 689 (L0) | 607 (L0) | 743 → 665 |  |
| S11-pinch | B03-SH03 | 740 (L2) | 662 (L2) | — |  |
| M1-B03 | B03-SH03 | 775 (L37) | 697 (L37) | 826 → 747 |  |
| A3-B04 | B04-SH02 | 808 (L0) | 729 (L0) | 900 → 821 |  |
| M1-B04 | B04-SH02 | 826 (L18) | 747 (L18) | 965 → 881 |  |
| S12-riser | B04-SH02 | 826 (L18) | 747 (L18) | — | SD32: fade out G824–830 (or Ton trims the tail to 83 f) so it peaks on the L97 arrival |
| A2a-B04 | B04-SH02 | 880 (L72) | 801 (L72) | 937 → 853 |  |
| A2b-B04 | B04-SH02 | 880 (L72) | 801 (L72) | 937 → 853 |  |
| S13-chains | B04-SH02 | 880 (L72) | 801 (L72) | 937 → 853 |  |
| A1-V03 | B04-SH03 | 937 (L0) | 853 (L0) | 965 → 881 |  |
| A2a-B04b | B04-SH04 | 965 (L0) | 881 (L0) | 1092 → 993 |  |
| A2b-B04b | B04-SH04 | 965 (L0) | 881 (L0) | 1092 → 993 |  |
| M1-B04b | B04-SH04 | 965 (L0) | 881 (L0) | 1173 → 1070 |  |
| S14-drag | B04-SH04 | 1009 (L44) | 915 (L34) | — | SD33; baked snap lands L103 |
| S15-trawl | B04-SH04 | 1028 (L63) | 934 (L53) | — | SD33 |
| S16-hit | B04-SH05 | 1151 (L59) | 1045 (L52) | — | SD34; on "เรือ" `est` |
| A5-sea | B05-SH01 | 1167 (L0) | 1064 (L0) | 1278 → 1162 |  |
| M2-pulse | B05-SH01 | 1167 (L0) | 1064 (L0) | 1473 → 1364 |  |
| S17-groan | B05-SH01 | 1276 (L109) | 1160 (L96) | — | cut − 2, as v1; carries across the cut |
| A2a-B05 | B05-SH02 | 1278 (L0) | 1162 (L0) | 1325 → 1207 |  |
| S18-thump1 | B05-SH02 | 1289 (L11) | 1173 (L11) | — |  |
| S18-thump2 | B05-SH02 | 1297 (L19) | 1181 (L19) | — |  |
| S18-thump3 | B05-SH02 | 1304 (L26) | 1188 (L26) | — |  |
| A1-B05 | B05-SH03 | 1325 (L0) | 1207 (L0) | 1363 → 1252 |  |
| A5-descent | B05-SH04 | 1363 (L0) | 1252 (L0) | 1380 → 1269 |  |
| S19-turn | B05-SH04 | 1367 (L4) | 1256 (L4) | — |  |
| S20-runout | B05-SH04 | 1369 (L6) | 1258 (L6) | — |  |
| A2a-B05b | B05-SH04 | 1380 (L17) | 1269 (L17) | 1473 → 1364 |  |
| S14-furrow | B05-SH04 | 1424 (L61) | 1313 (L61) | 1473 → 1364 |  |
| A1-B05c | B05-SH05 | 1473 (L0) | 1364 (L0) | 1497 → 1388 |  |
| M1-B06 | B06-SH01 | 1497 (L0) | 1388 (L0) | 1768 → 1649 | fade G1630–1649 |
| S21-spark1 | B06-SH01 | 1520 (L23) | 1411 (L23) | — |  |
| S21-spark2 | B06-SH01 | 1535 (L38) | 1426 (L38) | — |  |
| S21-spark3 | B06-SH01 | 1548 (L51) | 1439 (L51) | — |  |
| S21-spark4 | B06-SH01 | 1560 (L63) | 1451 (L63) | — |  |
| S21-spark5 | B06-SH01 | 1572 (L75) | 1463 (L75) | — |  |
| S21-spark6 | B06-SH01 | 1585 (L88) | 1476 (L88) | — |  |
| S21-spark7 | B06-SH01 | 1596 (L99) | 1484 (L96) | — | SD36 |
| S22-glitch | B06-SH02 | 1620 (L13) | 1504 (L13) | — |  |
| S23-glide | B06-SH02 | 1664 (L57) | 1548 (L57) | — |  |
| A1-B06 | B06-SH03 | 1695 (L0) | 1579 (L0) | 1829 → 1709 | fade to silence G1679–1709 |
| S1-B06 | B06-SH03 | 1695 (L0) | 1579 (L0) | 1829 → 1709 | fade to silence G1679–1709 |
| END1 | B06-SH04 | 1769 (L32) | 1650 (L32) | — | ends G1707 |

## Caption plan

Shared edu caption look (stroke, no band), `bottomEdgeY` 1344, band y 1176–1344, inside the caption-safe box x 120–888, ≤ 2 lines. Cue = `[phrase onset, voiced end + 6)` capped at the next onset; text verbatim from the script except L03, which shows the number as the script directs ("Subtitle shows 99%"). V01–V03 are subtitled (script). No caption during W-SKY, B05-SH05 or W-HOLD.

| Cue | G [start, end) | Thai |
| --- | --- | --- |
| L01a | 12–56 | วิดีโอคอลหาคนต่างประเทศ… |
| L01b | 56–106 | เสียงคุณแทบไม่ได้ขึ้นดาวเทียมนะ |
| L02 | 106–162 | มันวิ่งไปตามสายที่นอนอยู่ก้นทะเล |
| L03 | 164–232 | เน็ตข้ามประเทศ ราว ๆ 99% ไปทางนี้ |
| V01 | 234–290 | ห๊ะ? ใต้ทะเล? |
| L04a | 291–328 | ทำไมต้องลากสายลงทะเล… |
| L04b | 328–355 | ไม่ใช้ดาวเทียมล่ะ |
| L05a | 382–422 | ดาวเทียมเหมือนเฮลิคอปเตอร์… |
| L05b | 424–455 | ขนได้ทีละนิด |
| L06a | 457–492 | สายใต้ทะเลเส้นเดียว |
| L06b | 492–536 | คือทางด่วนหลายสิบเลน |
| L07a | 544–572 | แต่กลางทะเลลึก… |
| L07b | 572–609 | สายที่แบกเน็ตข้ามโลก |
| L07c | 610–663 | หนาแค่ประมาณสายยางรดน้ำ |
| V02 | 664–704 | แค่นี้เองเหรอ? |
| L09 | 705–741 | แล้วอะไรทำมันขาดล่ะ |
| L10a | 747–769 | แปลกตรงที่… |
| L10b | 772–825 | มันมักขาดตรงน้ำตื้นใกล้ฝั่ง |
| L10c | 825–856 | ไม่ใช่กลางทะเลลึก |
| V03 | 860–884 | เอ๊ะ? |
| L12a | 884–915 | เพราะตรงนั้นมีเรือ… |
| L12b | 915–964 | สมอกับอวนลากครูดพื้น |
| L12c | 964–992 | เกี่ยวสายขาด |
| L13a | 996–1031 | สายไม่ได้กลัวทะเลลึก… |
| L13b | 1032–1060 | มันกลัวเรือ |
| L14a | 1067–1118 | แต่ปี 2024 ในทะเลแดง… |
| L14b | 1119–1164 | เรือลำหนึ่งโดนขีปนาวุธ |
| L14c | 1166–1205 | แล้วสายขาดสามเส้น |
| L15a | 1210–1243 | ฟังเหมือนจงใจ… |
| L15b | 1256–1294 | แต่ทำเนียบขาวบอกว่า |
| L15c | 1295–1366 | น่าจะโดนสมอเรือลำนั้นเอง ลากพื้น |
| L17a | 1392–1427 | สายใต้ทะเลทั่วโลก |
| L17b | 1427–1490 | เสียหายราว ๆ สัปดาห์ละสามสี่ครั้ง |
| L18a | 1495–1529 | แต่คุณแทบไม่รู้ตัว… |
| L18b | 1534–1578 | เพราะเน็ตอ้อมไปเส้นอื่น |
| L19a | 1583–1621 | สายที่เขาคุยอยู่ตอนนี้… |
| L19b | 1622–1654 | ก็อาจกำลังอ้อมอยู่ |

- Start = floor(phrase onset); end = round(voiced end + 6), capped at the next cue's start. Boundaries resting on `est` anchors: L04a|L04b at G328 (no pause in the read; syllable 8 of 13, dips at G305 and G337 do not mark it), L17a|L17b at G1427 (a −20 dB dip G1425.5–1427.3 after "โลก", syllable 6 of 17). The L01b|L02 switch at G106 rests on the medium-confidence 3.8 f gap. L01a runs straight into L01b (the "…" pause 51–57 is shorter than v1's).
- Captions cross cuts where the cue does: L01b 4 f into B01-SH02, L03 3 f into B01-SH05, L04b 2 f into W-SKY (as v1), L07b 2 f into B03-SH02, L07c 3 f into B03-SH03, V02 2 f into B04-SH01, L10c 3 f into B04-SH03, L14b 2 f into B05-SH02 (as v1), L15c 2 f into B05-SH05 (as v1), L19a 3 f into B06-SH04. No caption in W-SKY (G353–380 after L04b), B05-SH05 (after G1366) or W-HOLD (after G1654).
- **Band checks for Editor (W5.3, `scripts/caption-zone.py --band 1176:1344` + a viewed sheet; report, do not darken):** B01-SH01 end and B06-SH04 end (his body and the hose cross the band, accepted with LF01), B02-SH03 (his shoulders, accepted with LF04), B01-SH04 start (the close globe fills the band), B05-SH02 (cables cross the band, accepted with LF06).

## Shot map

| Shot | Beat | G [start, end) (len) | Voice | Claims / clues | Look |
| --- | --- | --- | --- | --- | --- |
| B01-SH01 | B01 | 0–102 (102) | L01 | F001 hook; K01, K02 planted | LF01 (end) |
| B01-SH02 | B01 | 102–132 (30) | L02a | F001 | — |
| B01-SH03 | B01 | 132–164 (32) | L02b | F008 (deep floor) | LF02 (mid) |
| B01-SH04 | B01 | 164–229 (65) | L03 | F001 hedged; "99%" subtitle | LF03 (end) |
| B01-SH05 | B01 | 229–288 (59) | V01 | dramatization | LF01R |
| B02-SH01 | B02 | 288–353 (65) | L04 | OQ3 question | — |
| B02-SH02 | B02 | 353–380 (27) | W-SKY | delay | — |
| B02-SH03 | B02 | 380–541 (161) | L05, L06 | F005 direction only, F006 | LF04 |
| B03-SH01 | B03 | 541–607 (66) | L07a | F007 (deep section) | LF02 set |
| B03-SH02 | B03 | 607–660 (53) | L07b | F007, F026; K02 paid | — |
| B03-SH03 | B03 | 660–702 (42) | V02 | dramatization | LF01R set |
| B04-SH01 | B04 | 702–729 (27) | L09 | OQ4 question | — |
| B04-SH02 | B04 | 729–853 (124) | L10 | F016, F025 "มัก" | — |
| B04-SH03 | B04 | 853–881 (28) | V03 | K01 paid | — |
| B04-SH04 | B04 | 881–993 (112) | L12 | F015, F016 | — |
| B04-SH05 | B04 | 993–1064 (71) | L13 | refrain (rhetorical) | LF07 |
| B05-SH01 | B05 | 1064–1162 (98) | L14a | F023 plain; LBL, CARD, grade | LF05 |
| B05-SH02 | B05 | 1162–1207 (45) | L14b | F023 (3 cables) | LF06 |
| B05-SH03 | B05 | 1207–1252 (45) | L15a | framing, not a finding; LBL | — |
| B05-SH04 | B05 | 1252–1364 (112) | L15b | F023 attributed + "น่าจะ" | LF06 set |
| B05-SH05 | B05 | 1364–1388 (24) | (gap) | LBL off | — |
| B06-SH01 | B06 | 1388–1491 (103) | L17 | F014 hedged | LF03 set |
| B06-SH02 | B06 | 1491–1579 (88) | L18 | F027 "แทบ" | LF03 set |
| B06-SH03 | B06 | 1579–1618 (39) | L19a, laugh | F027 | LF01R set |
| B06-SH04 | B06 | 1618–1709 (91) | L19b, W-HOLD | F027 "อาจ"; bookend | LF01 set |

Screen layers: **LBL "ภาพจำลอง"** G1064–1364 (first frame of the L14 shot to the last frame of the L15 shot, B05-SH03 included); **CARD "2024 · ทะเลแดง"** G1064–1207; **reconstruction grade** G1064–1207 and G1252–1364; `@TamMaiLa` every frame. Rules 1–7 of the [storyboard](storyboard.md#rules-for-every-shot) apply to every shot.

---

## Shot sheets

Picture intent is each row's `seen` text in [review-rows.json](review-rows.json) plus its look frame; the blocks add numbers. All painted through `ycam` (`paintSorted`, cards squared to the lens); globe and bubble are fixed planes.

### B01-SH01 · 0–102 · the call by the sea (pre-roll + L01)

- **Time:** L01 onset L12; "คนต่างประเทศ" L34 `est`; first phrase ends L51 ("…" pause L51–57); "ดาวเทียม" L87 `est`; "นะ" L98 `est`; L01 ends L102 (= the cut; its last 0.3 f plays over B01-SH02).
- **Staging (R):** MAN at M0, back three-quarter to the lens, `new: hose-water`, neutral, SPRAY on pot P2 (x 0.62); head turned 15° toward the phone. SISTER on screen: P07 wave L0–36, then laugh/talk. Self-view tile top-right of the screen. **Signal line (N5, SD28):** springs out of the phone top at L84, rises 2.5 m to y 3.6 toward the sky top-right by L94 (`easeOutCubic`), squash at the tip L94–98, bends down toward the beach L98–102; the cut lands as the bend completes (R1.1: L96 / L106 / L106–110 / L114 + hold).
- **Camera (R):** start `sheet((−0.40, 1.10, −0.60), −12, 0.42, 1.14, 1000, 820)`, near 0.05 → middle key at L34 pos (−0.45, 1.45, 0.25) `est` (beside his left shoulder, no pass through his card) → end LF01 `sheet((−0.30, 1.10, −0.55), 3, 1.95, 1.68, 1000, 640)` at L56; then a 3 % push-in (r 1.95 → 1.89) L56–102 (R1.2: was L56–112 + still L112–119). Run: start phone 381 px (y 725–1106, x 540); end head (772, 612), chin 912, feet 1826, lead 1214 px; phone y 891–971 at x 489; hose end (807, 1040).
- **Sound:** A1 from L0 (−8 dB, −14 from L12); S1 spray from L0; **S2** call chime at L0, two soft rising tones from the small phone speaker, **≤ 11 f** so it ends before L01 (brief 0.6 s shortened for the 12 f lead), "she's on the line"; M1 enters at energy 2 on L12; **S3** signal zip at L84 / G84 (0.5 s, airy rising zip with a light synth tone, "off it goes, up"); **S4** cartoon brake at L94 / G94 (0.35 s, squeaky rubbery skid bending down, "nope, not up there"). Mix: hold, then a small comic hit.
- **Cut:** hard cut at L102 (G102, 4 f before L02) as the line's down-bend completes.
- **Entry → exit:** frame 0 phone close, sister waving, spray fan beside it, no text → OTS wide with the line curling down; MAN SPRAY.
- **Accept:** L0 shows phone, sister, spray and bay with no text; no frame where his card fills > 60 % of the frame or pops (near pass L20–45); the line is occluded by the coconut CP1 trunk where it passes behind it; head and phone above y 1160.

### B01-SH02 · 102–132 · the line dives into the sea (L02a)

- **Time:** L02 onset L4 (G106.1); "วิ่ง" L7 `est`; splash L27 (G129, 3 f after "ที่นอน" L24 `est`); dissolve G132–138 (start at the cut, SD29).
- **Staging (R):** the line's head runs from the wall top over the beach (≈ 6 m/s world) L7–27 and enters the water at (−0.6, −1.5, −14) with a splash ring L27–33. MAN SPRAY, small (SD03).
- **Camera (R):** `look((1.4, 3.4, 2.8), (−0.3, 0.0, −6), 1000, 700, −16)` → `look((1.1, 3.0, 1.2), (−0.6, −1.5, −14), 1000, 700, −12)` over L0–33 (crane forward and down along the line). Run: start head (289, 933), chin 1043, feet 1336, 404 px (exception), wall top y 1018, water entry (610, 703); end entry (540, 777) centred, MAN out frame left from about L20.
- **Sound:** A1; M1 2.5; S1 −6 dB; **S5** splash-whoosh placed at L18 / G120 with its splash on L27 / G129 (whoosh from L19; 0.9 s: air whoosh into one clean splash, then a muffled bubble roar going under, "diving in").
- **Cut:** in-canvas dissolve 6 f G132–138 from the splash ring to B01-SH03 (this plate runs on underneath, L30–32, clamped at L32).
- **Entry → exit:** line curling over the wall → splash ring at the water entry.
- **Accept:** the line visibly enters the water at L27; the band sits over sand and water from L10.

### B01-SH03 · 132–164 · down to the cable (L02b)

- **Time:** "ก้นทะเล" L9; L02 ends L24; camera settled L31; pulse at centre **L29** (G161, SD29); cut L32; pulse-match dissolve G164–170 (this plate runs on underneath L32–34, clamped).
- **Staging (W):** bubbles and hull silhouettes overhead L0–14; caustics fade by L20; the signal line threads into the buried ridge at z −16 and the cable takes the glow; cable path `cableAt(z)`.
- **Camera (W), three keys:** L0 `sheet((0, −2, −20), 0, 6, −0.8, 1000, 760)` → L19 LF02 `look((1.6, −6.0, −96), (0.16, −36.27, −140), 900, 560, −30)`, near 0.2 → L31 `sheet((0.5, −38.8, −190), 4, 7, −37.7, 1000, 820)`, still L31–32, then L32–34 under the dissolve (piecewise `easeInOutSine`, velocity matched at L19; keys unchanged). Run: start cable z −20 at (438, 1099), surface y 627; end camera 1.02 m over `bedY(−183)`, cable at (362, 988) → (438, 902) (lower centre).
- **Sound:** A2 (a+b) L0–26 crossfading to A3 L11–32 (G143–164); M1 2.5; **S6** data pulse tick at L29 / G161 (0.3 s soft round sonar-like tick, "a message passing").
- **Cut:** pulse-match dissolve 6 f G164–170: the pulse at (467, 875) → (470, 871) dissolves into the globe's yard dot at (469, 872) (≤ 40 px, SD19).
- **Accept:** cable readable at every depth; shallows-to-deep falloff continuous; no numbers.

### B01-SH04 · 164–229 · the globe (L03)

- **Time:** L03 onset L0 (G164.2); "ข้าม" L6 `est`; "ราว ๆ" L28; "ไปทางนี้" L49 `est`; L03 ends L62.
- **Staging (G, fixed plane):** the warm yard dot (100.9°E, 12.6°N) under the arriving pulse at L0; lines L1–L16 light in a ripple outward from the dot L6–32; pulses on every line by L54. No labels.
- **Camera (globe view):** start `facing(yard dot)` at r 1500 with the dot at (469, 872) (SD18, SD19) → `{540, 640, 490, lon 112, lat 10}` (LF03, code literal) over L0–58, `easeInOutSine`; still L58–65 (R1.2: L65–69 of the built still are cut). Bottom edge at the end y 1130 (above the band).
- **Sound:** no ambience; M1 2.5; **S7** `reveal_glass-shimmer-soft_01` (lib) at L6 / G170 as the lines light; **S6** ×3 soft at L36, L44, L52 (G200, G208, G216).
- **Cut:** hard cut at L65 (G229, 6 f before V01).
- **Accept:** LF03 at L58–64; continents read; no straight bars from clipped rings; dot within 40 px of B01-SH03's pulse across the G164–170 dissolve.

### B01-SH05 · 229–288 · "ห๊ะ? ใต้ทะเล?" (V01)

- **Time:** V01 voiced L6–55 (G234.7–283.9): "ห๊ะ" L6–15, "ใต้ทะเล?" L33–55. Unchanged length.
- **Staging (R):** L0 thumb off the hose: SPRAY → FLOW (last dribble L0–6, end drops to waist height); face neutral → surprised on L6; looks at the phone (camera-right of him, screen-left) L6–20; turn-head over his left shoulder toward the sea L30–40, held.
- **Camera (R):** LF01R `sheet((0.05, 1.2, 0), 124, 4.2, 1.85, 2500, 720, −8)` → `sheet((0.05, 1.2, 0), 120, 3.95, 1.85, 2500, 720, −8)` over L0–59 (6 % push, 4° arc). Run: head (557, 448) → (556, 453), chin 703 → 724, feet 1436 → 1501, lead 988 → 1048 px; phone y 845–955 → 878–995 at x 367 → 318; hose end (298, 914) → (280, 944).
- **Sound:** S1 stops at L0 (G229) with a small last dribble (to G241), S1b flow from L0 (−18); M1 ducked −20; A1 −10; V01 in the clear.
- **Cut:** hard cut at L59.
- **Accept:** face above y 1160; lead ≥ 480; hose end in frame; the wall reads as a calm band.

### B02-SH01 · 288–353 · why not satellites? (L04)

- **Time:** L04 onset L4 ("ทำไม", G291.7); "ไม่ใช้ดาวเทียมล่ะ" L40 `est` (the read has no pause at the "…"; accepted by the user); L04 ends L61.
- **Staging (R):** P09 hands on hips (right fist holds the flowing end at the hip; S1b), shake-head L4–22, face worried (profile edge); trawler drifts +x 0.3 m/s.
- **Camera (R):** `look((1.3, 2.6, 2.6), (−1.5, 0.5, −6), 1000, 560)` → `look((0.87, 2.6, 2.59), (−1.5, 0.5, −6), 1000, 560)` over L0–65 (8° arc about M0 + 6 % push, SD13; R1.2 `N` 84 → 65). Run: MAN (390, 866–1464) 598 px → (485, 883–1513) 630 px; boat B2 (807, 659) → (769, 659).
- **Sound:** A1 −14; M1 2; S1b −18; no SFX.
- **Cut:** hard cut at L65 (G353, L04 end + 4 f).
- **Accept:** horizon reads long; band over wall and sand; lead ≥ 480.

### B02-SH02 · 353–380 · the sky (W-SKY)

- **Time:** no voice; satellite blink L12 (G365); bubble seed L24. Unchanged length (the 33.8 f W-SKY gap kept).
- **Staging (R):** cut on action: his left hand rises into P30 visor L0–8; face suspicious squint; a tiny satellite (≤ 14 px) at (860, 260) blinks once L12–15; at L24 a 12 px bubble seed appears at that spot.
- **Camera (R):** `look((−0.80, 0.95, −0.85), (0, 1.55, 0), 954, 1150)` → tilt-up hy 1150 → 1180 over L0–27, near 0.05 (SD25 replaces the R1.0 line; SD12). Run (W5 re-run): face (540, 690). **P30:** the left hand is a flat palm-down mitten shading the brow (fix list), not on the hair.
- **Sound:** M1 out (faded G350–356); A1 −16; **S8** `reveal_glass-pluck-ring_01` (lib) at L12 / G365; near silence.
- **Cut:** hard cut at L27 into the bubble.
- **Accept:** face above y 1160; satellite clear of LBL and the mark; no music.

### B02-SH03 · 380–541 · helicopter vs motorway (L05, L06)

- **Time:** bubble pop L0; L05 onset L3 (G382.7); "เฮลิคอปเตอร์" L17 `est`; "…" L36–44; "ขนได้" L44; "ทีละนิด" L54 `est`; L05 ends L69; page-turn L66–77; L06 onset L77; "คือทางด่วน" L112; fold L121–158; L06 ends L150.
- **Staging (R behind, B inside):** MAN from behind, head and shoulder lower right (bubble owner), FLOW. Bubble in BUB (90–990, 200–900), tail to his head, pops on L0–6 (ui pop). Inside (fixed plane, px): toy helicopter lifts one crate of four glowing cubes L14–30, bobs; crate swings L44–62. Page-turn wipe L66–77. Motorway (≈ 20 light lanes) from L77; lanes squeeze to the centre line L121–138 and roll into one thin glowing cable crossing the bubble by L158 (1.23 s); hold to L161. Picture-stage push 1.0 → 1.10 (L0–66), 1.0 → 1.08 (L77–161); helicopter drift L10–66. (SD30: every event at or after built L56 moved −12 f.)
- **Camera (R):** `sheet((−0.1, 1.5, −3), 2, 4.1, 1.85, 760, 740)` → yaw 6 (LF04) over L0–161 (R1.2 `N` 177 → 161). Run: head (681, 829) → (819, 828), chin 1122 → 1114 (above the band); shoulders in the band (accepted with LF04).
- **Sound:** A1 −10; M1 back at 2.5 on L0 (G380); **S24** `ui_pop_01` (lib) at L0; **S9** toy helicopter flutter L10–66 / G390–446 (2 s file, passing left to right, faded out by the page-turn); **S10** motorway to cable L88–161 / G468–541 (2.5 s file stopped at the cut with a 3 f fade: a broad traffic wash tightening into one low hum across the fold).
- **Cut:** hard cut at L161 (G541, 4 f before L07).
- **Accept:** LF04; the fold reads as many lanes into one line in ≤ 1.5 s; bubble bottom above y 1160.

### B03-SH01 · 541–607 · the deep cable (L07a: "แต่กลางทะเลลึก… สายที่แบกเน็ตข้ามโลก")

- **Time:** L07 onset L4 ("แต่", G544.6); "…" pause L26–32; "สายที่แบก" L32; phrase ends L62.
- **Staging (W deep):** the cable on the ooze crossing the frame left to right, one pulse riding it (centre at L34, SD31; built L43); a sea pen; dark.
- **Camera (W):** `sheet((−0.37, −41.26, −300), 90, 1.6, −41.01, 1000, 745)` → `at (−0.46, −41.33, −303)` (3 m truck along the cable) over L0–66 (R1.2 `N` 82 → 66); `at` follows `cableAt(z)`, eye = cable y + 0.25 (SD05). Run: cable at (540, 901), y 869–936 across the frame; camera 0.26 m over the floor.
- **Sound:** hard cut: M1 stops dead at L0 (G541); M3 held note begins L0; A3; **S6** tick once at L34 / G575.
- **Cut:** hard cut at L66 (G607, 4 f before "หนาแค่").
- **Accept:** cable readable; band over ooze.

### B03-SH02 · 607–660 · hose vs cable (L07b: "หนาแค่ประมาณสายยางรดน้ำ")

- **Time:** "หนาแค่" L4 (G611); L07 ends L50 (G657.2).
- **Staging:** over-under split (N15): wavy waterline seam wipes up from the frame bottom to y 860 over L0–10, holds. Upper (R): the hose in his right hand, sunlit, FLOW (a thin stream from the end, off frame left). Lower (W deep): the cable. Both 40 px, parallel, left ends aligned at x ≈ 300.
- **Camera:** upper `sheet((0.18, 0.95, −0.30), 90, 0.50, 0.95, 1000, 640)`; lower `sheet((−0.46, −41.33, −303), 90, 0.50, −41.33, 1000, 1080)` (SD05); both truck 0.1 m along z over L0–53 (R1.2 `N` 49 → 53; until changed the truck ends at L49 and holds 4 f). Run: hose y 620–660 (40 px), cable y 1060–1100 (40 px), both above 1160.
- **Sound:** M3 continues alone; S1b faint in the upper half (−20 dB, G607–665); A3 under.
- **Cut:** hard cut at L53 (G660, 5 f before V02).
- **Accept:** one still at L20 proves 40 px ±2 for both; cable bottom y 1100 < 1160. Fallback: match cut hose → cable on the same screen line.

### B03-SH03 · 660–702 · "แค่นี้เองเหรอ?" (V02)

- **Time:** V02 voiced L4.5–37.6 (G664.5–697.6). Unchanged length.
- **Staging (R):** `new: hose-pinch`: both hands lift the end to chest height L0–5; the left thumb and forefinger pinch it at L5 (pinch point (392, 917)); the flow sputters out L5–15 (FLOW → STOP); face surprised, eyebrows up.
- **Camera (R):** `sheet((0.05, 1.30, 0), 123, 1.55, 1.45, 1000, 740)` → r 1.47 (5 % push) over L0–42. Run: head (558, 561), chin 843, feet 1701, lead 1140 px; pinch (392, 917).
- **Sound:** M3 releases L0–12 (G660–672); **S11** hose pinch placed at L2 / G662, its squeak on the L5 pinch (0.5 s, rubbery squeak-boing with a little water sputter, "light comedy, disbelief"); S1b stops at L5; V02 in the clear; M1 returns at 1.5 at L37 / G697.
- **Cut:** hard cut at L42 (4 f before L09).
- **Accept:** pinch contact above y 1160; lead ≥ 480.

### B04-SH01 · 702–729 · the dark open sea (L09)

- **Time:** L09 onset L3.5 (G705.5); "ล่ะ" L27 `est` (the cut).
- **Staging (R):** P09, STOP end in the right fist; slight lean forward, peering past the boats at the dark open-sea band.
- **Camera (R):** `look((0.40, 1.78, 1.30), (−30, 0, −600), 1000, 600)` → 6 % push (f 1000 → 1060) over L0–27 (optional `N` 28 → 27; else L27 is simply cut). Run: back of head (287, 646), boat B2 (557, 679).
- **Sound:** A1; M1 thin at 1.
- **Cut:** hard cut at L27 (G729) on "ล่ะ" (the question ends under the dive).
- **Accept:** boats in frame (K01 not pointed at).

### B04-SH02 · 729–853 · not the deep: the shallows (end of L09 + L10)

- **Time:** L09 ends L6; L10 onset L18 ("แปลกตรงที่", G747); "…" L34–43; "มันมัก…" L43; "น้ำตื้น" L71 `est`; "ไม่ใช่กลางทะเลลึก" L97 (arrival, SD32); L10 ends L121.
- **Staging (W):** empty, still deep with the calm cable L0–18; climb along the cable up the slope; from L70 (as built) three hulls overhead, anchor chains hanging to the sand, the cable a buried ridge with a bared stretch z −52 → −58 (K at `cableAt(−53.5)` = (−0.58, −5.19, −53.5)).
- **Camera (W):** sink L0–18 `sheet(cableAt(−420), 0, 8, −34.0 → −41.72, 1000, 760)` (SD06); turn yaw 0 → 180 L18–40 while rising; climb L18–97 to `sheet((0.8, −6.5, −58), 180, 9, −5, 1000, 700)` (SD32; built L18–104); drift 2 % L97–124 (`N` 129 → 124). Run: turn key cable at (540, 1030); end K (642, 714), cable z −60 (712, 792), hull (576, 518); camera 1.09 m over `bedY(−67)`. Climb = 79 f, 64 % of the shot.
- **Sound:** A3 L0–92 (G729–821) → A2 (a+b) from L72 (G801); **S12** climb riser L18–101 / G747–830 (slow soft airy riser, muffled, a faint bright top near the surface, peaking on the L97 arrival; the 89 f file faded out G824–830 or trimmed by Ton); **S13** chain clinks from L72 / G801 as the chains enter frame; M1 2.5.
- **Cut:** hard cut at L124 (G853, L10 end + 2.6 f).
- **Accept:** cable continuous through the move; hulls and chains read by L97; band over sand.

### B04-SH03 · 853–881 · "เอ๊ะ?" (V03)

- **Time:** V03 voiced L7.8–25.4 (G860.8–878.4). Unchanged length.
- **Staging (R):** turn-head-right L0–20 (back of head → profile by L10, on "เอ๊ะ"), face worried as the profile comes round; STOP end in the right fist.
- **Camera (R):** `look((0.42, 1.78, 1.25), (1.5, 0, −60), 1000, 700)` → 5° arc (yaw +5) over L0–28. Run: head (184, 748), chin 1090; boat B2 (488, 780).
- **Sound:** M1 ducked −20; A1; V03 in the clear.
- **Cut:** hard cut at L28 (4 f before L12).
- **Accept:** boats all readable; profile above y 1160.

### B04-SH04 · 881–993 · anchor and net (L12)

- **Time:** L12 onset L4 (G884.8); "…" L28–35; "สมอ" L35; "อวนลาก" L53; "ครูดพื้น" L71; "เกี่ยว" L83; "ขาด" L99 `est`; L12 ends L105.
- **Staging (W shallows):** hulls overhead. Anchor (0.6 m, N7) on its chain from boat B2 off frame top: enters screen-left at L34 at (K.x + 2.4, bed + 0.3, K.z), ploughing a furrow along −x; fluke reaches K at L87 and lifts the cable 0.4 m taut L87–101; the cable parts at L103 with a sand puff, the glow stops at the break (KD); the anchor drags on to the cut at L112. Otter board and net bag scrape past in the background at z −47.5, L53–85, moving the same screen direction. (SD33: anchor run and trawl evaluated at L + 10; built L44 / L97 / L97–111 / L113 / L63–95.)
- **Camera (W):** `sheet((−0.08, −4.9, −53.5), 160, 3.2, −4.75, 1000, 760)` → `sheet((−0.88, −4.9, −53.5), 168, 3.2, −4.75, 1000, 760)` over L0–112 (SD07; R1.2 `N` 127 → 112). Run: K (695, 905) → (450, 895), lifted K (450, 772); anchor entry (76, 783); cable toward shore (841, 766); hull (712, 185); camera 0.6 m over the floor.
- **Sound:** A2; M1 at 3; **S14** anchor drag from L34 / G915 (3 s file: chain rattle, gritty sand drag, strain, one taut muffled snap at L103 / G984, carrying past the cut); **S15** trawl scrape L53–112 / G934–993 (2 s).
- **Cut:** hard cut at L112 (G993, 4 f before L13).
- **Accept:** the anchor reads as an anchor at ≥ 120 px; contact at K above y 1160 at L87–103; the break is clear.

### B04-SH05 · 993–1064 · the rule (L13: "สายไม่ได้กลัวทะเลลึก… มันกลัวเรือ")

- **Time:** L13 onset L4 (G996.7); "ทะเลลึก" L20 `est`; "…" L32–39; "มันกลัวเรือ" L39; "เรือ" L52 `est`; L13 ends L61.
- **Staging (D):** the cutaway block as in the storyboard set (shore −x screen-left, deep +x screen-right, KD at x −2.4). L21: the deep cable's glow brightens a touch and holds; the shallow half dims slightly. L39–55: the four boats bob once in sequence (L39, L43, L47, L51; SD34, built L46/50/54/58), their chains tug taut and slack. Ambient: ripple on the top face, slow bob, particles in the shallow water only.
- **Camera (D):** `cutCam(u)`, u = easeInOutSine(L / 71) (SD08; R1.2 `N` 75 → 71) = target (0.2, −2.6, 0), yaw −12.9 → −20.9 (camera on the deep +x side), horizontal r 10.71 → 12.31, eye 6.18 → 7.50, pitch −28, f 1150, hy 560. Run: block top front edge (69, 620)–(974, 737) → (153, 616)–(879, 776); base front corner y 1143 → 1131 (above the band at every u); trawler top y 454 → 495; KD (290, 693) → (328, 690); deep cable (757, 1037) → (715, 1026).
- **Sound:** M1 2.5; **S16** `stinger_low-muted-hit_01` (lib) at L52 / G1045 on "เรือ", on M1's downbeat; then M1 at 2. No place sound.
- **Cut:** hard cut at L71 (G1064, 4 f before L14).
- **Accept:** LF07 at L70; faces sort with no popping through the arc; shore left / deep right at every frame; no number or label.

### B05-SH01 · 1064–1162 · the Red Sea (L14a)

- **Time:** L14 onset L4 (G1067.9); "…" L48–56; "เรือลำหนึ่ง" L56; "ขีปนาวุธ" ends L94.
- **Staging (F):** the listing damaged ship (N10) broadside, list 9° away, down by the stern, scorch patch, thin smoke drifting −x; grey swell. LBL top-right and CARD top-left from L0; grade on.
- **Camera (F):** `sheet((−4, 6, 0), 16, 260, 3, 1300, 900)` → `sheet((−4, 6, 0), 12, 200, 3, 1300, 900)` (LF05) over L0–98 (R1.2 `N` 111 → 98). Run: ship x 171–890 → 53–1004, superstructure top y 799 → 769, waterline y ≈ 915; clear of LBL and CARD.
- **Sound:** M1 out L0–6; M2 at 1.5 from L0; A5; **S17** hull groan at L96 / G1160 (2.5 s, distant deep metallic creak, "heavy, sad, not scary"; it carries across the cut, low-passed from L98); no hit on "ขีปนาวุธ".
- **Cut:** hard cut at L98 (G1162, 4 f before "แล้วสาย").
- **Accept:** LF05; no missile, fire, flag, crew or name; grade, LBL, CARD on.

### B05-SH02 · 1162–1207 · three cables go dark (L14b)

- **Time:** "แล้วสาย" L4 (G1166); C1 dark L11 ("สาย" L10 `est`), C2 L19 ("ขาด" L18 `est`), C3 L26 ("สามเส้น" L24 `est`): built frames kept, within the ±4 f estimate; L14 ends L37.
- **Staging (FS):** plain grey floor, C1–C3 lit; each goes dark over 3 f on its frame (`dark` 0 → 3).
- **Camera (FS):** `sheet((0, 0.2, 0), 25, 6, 1.4, 1000, 820)` (LF06) → `at (0.906, 0.2, 0.423)` (1.0 m truck along the right vector, SD11) over L0–45 (optional `N` 47 → 45). Run: cable midpoints C1 (288, 1004), C2 (540, 1053), C3 (976, 1139) → (157, 1004), (373, 1053), (748, 1139).
- **Sound:** A2a low-passed; M2; **S18** `pulse_underwater-soft-thump_01` (lib) at L11, L19, L26 (G1173, G1181, G1188) (each cable's signal tick stops with it).
- **Cut:** hard cut at L45 (G1207, 4 f before L15).
- **Accept:** LF06; each change readable on the part of its cable above y 1160; LBL, CARD, grade on.

### B05-SH03 · 1207–1252 · sounds deliberate (L15a: "ฟังเหมือนจงใจ…")

- **Time:** L15 onset L3.5 (G1210.5); phrase ends L30; the read's "…" pause L30–49 runs to the cut and 4 f into B05-SH04 (SD35).
- **Staging (R):** medium-close, face suspicious, eyes narrowed at the phone (screen-left); STOP end in the right fist. Normal colour; LBL stays on; CARD off from L0.
- **Camera (R):** `sheet((0, 1.45, 0), 125, 1.40, 1.30, 1000, 640)` → r 1.33 (5 % push) over L0–45 (SD09; R1.2 `N` 38 → 45, SD35). Run: head (540, 340), chin 644, feet 1569, lead 1229 px; phone y 805–1025 at x 180.
- **Sound:** A1 −14; M2 continues (pulse only, the suspicious hold).
- **Cut:** hard cut at L45 (G1252, 4 f before "แต่").
- **Accept:** LBL on; no grade; face and phone above y 1160.

### B05-SH04 · 1252–1364 · probably its own anchor (L15b)

- **Time:** "แต่" L4 (G1256); "น่าจะ" L44; "สมอ" L62 `est` (descent done L61); "ลากพื้น" L98; L15 ends L108.5.
- **Staging (FS, compressed; no depth claimed):** ship anchor (stockless, 2.5 m, N7) shackle at A(L) = n·s + (0, 1.2, 0), s = −3.0 − 0.0167·L m (dragging along −n, away from the lens); a furrow from s = +6 to the anchor already cuts across C1–C3 (crossings at s = +2.5, 0, −2.5), the three cables pressed into it and dark. Chain straight from the shackle up along −n at 35° to the surface (FS y 44.2), meeting it at A − 55.6·n + (0, 43, 0); the hull a dark **broadside** silhouette above, riding with the chain top (SD22), chain at its bow hawse. Grade and LBL on.
- **Camera (FS):** backs down the chain at constant yaw −25 (SD10): `sheet(chain top − (0, 3, 0), −25, 20, 40.0, 1000, 600)` → `sheet(A(61), −25, 10, 1.6, 1000, 700)` over L0–61 (at slides down the chain line, `easeInOutSine`); then holds framing from L61 while the anchor drags on to the cut at L112 (SD21; the built `sOf(L)` simply continues 2 f). Run (end state with A(51)): anchor (540, 740); furrow crossings C1 (540, 885), C2 (540, 960), C3 (540, 1138); chain to the top of frame. Start: chain top (540, 390), surface y ≈ 429.
- **Sound:** **S19** turn sting at L4 / G1256 (0.6 s, two soft muted marimba notes, the second a step up and left open, "wait, it's not what it sounds like"); M2 thins from L4; **S20** chain run-out L6–51 / G1258 (1.5 s, long rattle settling to a strained creak); S14 drag texture under the furrow L61–112 / G1313–1364; A5 L0–17 fading into A2a (G1269).
- **Cut:** hard cut at L112 (G1364, L15 end + 4 f).
- **Accept:** chain continuous from the hull to the anchor; the furrow crosses all three cables and reads at 1×; LBL and grade on; same drag look (anchor, furrow, sand plume) as B04-SH04.

### B05-SH05 · 1364–1388 · "oh, the anchor" (gap after L15)

- **Time:** no voice (the 31.6 f L15 → L17 gap kept). Unchanged length.
- **Staging (R):** LBL off on L0, grade off; face surprised, eyebrows up L0–6; glance toward the boats (turn-head-right) L6–18, held.
- **Camera (R):** `sheet((0.05, 1.25, 0), 123, 1.91, 1.42, 1000, 760)` → yaw 127 (4° arc) over L0–24. Run: head (555, 599), chin 827, feet 1520, lead 921 px.
- **Sound:** A1 back at −8; M2 out at L0; no SFX.
- **Cut:** hard cut at L24 (4 f before L17).
- **Accept:** label off from L0; lead ≥ 480.

### B06-SH01 · 1388–1491 · breaks every week (L17)

- **Time:** L17 onset L4 (G1392.1); caption split L39 `est`; L17 ends L95.5.
- **Staging (G):** warm light lift; red sparks flicker on 7 near-coast segments at L23, L38, L51, L63, L75, L88, L96 (each 6 f; SD36, built L99).
- **Camera (globe view):** `{540, 640, 490, lon 112 → 120, lat 10}` over L0–103 (slow 8° orbit; R1.2 `N` 110 → 103). Bottom y 1130.
- **Sound:** M1 returns warm at 2 on L0 (G1388); **S21** spark crackle on each spark (4 variations, 0.15 s; G1411, 1426, 1439, 1451, 1463, 1476, 1484).
- **Cut:** hard cut at L103 (G1491, 4 f before L18).
- **Accept:** sparks mostly near coasts; no numbers.

### B06-SH02 · 1491–1579 · the reroute (L18)

- **Time:** L18 onset L4 (G1495.2); spark L13; "ไม่รู้ตัว" L17 `est`; "…" L32–43; "เพราะ…" L43; "อ้อม" L59; L18 ends L81. Unchanged length; spark and glide keep their built frames (glide L57 is 2 f before "อ้อม").
- **Staging (G):** close on the coast between the yard and Hong Kong (SD14). L13: spark on code line L16 at (110.5°E, 15.5°N); L16 dims to grey from the spark to Hong Kong over L13–23. A pulse on L16 approaches; at L57 it leaves L16 just short of the spark (≈ 110.2°E, 15.0°N) and slides sideways onto code line L4 at 17°N (≈ 113.2°E) over L57–75, then keeps going to Hong Kong (SD20). A dim red mark stays at the spark point L21–88 (radius ≤ 8 px, alpha ≈ 0.6) so the pulse visibly goes around the break.
- **Camera (globe view):** `facing(J)` at (540, 640), r 1100 → 1155 over L0–88 (5 % push; J at the view centre; SD18).
- **Sound:** M1 2; **S22** glitch at L13 / G1504 (0.3 s); **S23** glide at L57 / G1548 (0.6 s, rising then settling).
- **Cut:** hard cut at L88 (4 f before L19).
- **Accept:** the reroute reads at 1×; the dimmed line stays grey to the end of the shot.

### B06-SH03 · 1579–1618 · still talking (L19a: "สายที่เขาคุยอยู่ตอนนี้…")

- **Time:** sister's laugh voiced L0–48 (G1579.3–1627.5; bursts L0–24 and, after the cut, B06-SH04 L3–10); L19 onset L4 (G1583.3); phrase ends L36.
- **Staging (R):** `new: hose-water` again, SPRAY on (thumb back) from L0; face laugh L0–20 → happy + talk to the phone; sister on screen laughing.
- **Camera (R):** `sheet((0, 1.25, 0), 126, 2.15, 1.45, 1000, 700)` → yaw 122 (4° arc) over L0–39 (optional `N` 42 → 39; else the last 0.5 % of the arc is cut). Run: head (540, 574), chin 772, feet 1374, lead 800 px; phone y 883–992; hose end (332, 943).
- **Sound:** A1, S1 back from L0, S1b out; M1 1.5; sister's laugh from L0 through the small phone speaker (placement table).
- **Cut:** hard cut at L39 (G1618, 4 f before "ก็อาจ").
- **Accept:** lead ≥ 480; warm grade; phone screen above y 1160.

### B06-SH04 · 1618–1709 · the line goes around (L19b + W-HOLD)

- **Time:** "ก็อาจ" L4 (G1622); "อ้อม" L21 `est`; L19 ends L30.2; **W-HOLD L31–91** (G1649–1709, 60 f; 60.8 f after the voiced end).
- **Staging (R):** MAN SPRAY, talking; the faint dashed signal line draws from his phone L18–32, dips over the beach into the bay at (−0.6, −1.5, −14) and bends along a curve toward the headland (bookend of B01-SH01); holds with ambient motion (boat bob, palms, spray) to the last frame.
- **Camera (R):** `sheet((−0.3, 1.1, −0.6), 3, 2.2, 1.7, 1000, 640)` → `sheet((−0.4, 1.0, −1.0), −8, 4.55, 3.6, 1000, 440)` over L0–44, `easeOutCubic` (crane up and back); **still L44–91** (built L91 cut). Run: start head (745, 628), lead 1064 px; end head (613, 977), chin 1098, feet 1467, lead 490 px (tableau); phone y 1023–1061; line entry (632, 732); boat B2 (652, 558).
- **Sound:** M1 fades out L12–31 (G1630–1649); **END1** at L32 / G1650 (1.9 s, SD15: the S2 two-note interval on warm marimba with a soft glass bell, a third note resolving down to the root, "the call is still going, all is well"); A1 and S1 carry the hold, fade to silence L61–91 (G1679–1709).
- **Cut:** last frame G1708; closed hold, no loop seam.
- **Accept:** line curved (bookend); camera moves 0 px in L44–91; chin above y 1160; END1 ends before G1709 (G1707).

## Boss and Editor handoff (W5.2 / W5.3)

- **Boss (asset status at `64291e8` + uncommitted `src/painted/edu17/`):** `exists-unintegrated` at look-frame grade, no motion: N1 yard + hose + phone (`yard.ts`), N2 boats (`boats.ts`), N6 sea + cable (`sea.ts`), N8 globe (`globe.ts`; sparks, dimming and the J slide `missing`), N9 helicopter (`analogy.ts`; motorway fold `missing`; bubble `edu15/bubble.ts`), N10 ship and N11 flashback seabed (`redsea.ts`), N12 cutaway (`cutaway.ts`; boat bob and chain tug `missing`), N13 grade, LBL, CARD (`frame.tsx`, `edu14/grade.tsx`, `Label.tsx`). `missing`: N5 signal line (+ data pulse, the B06-SH04 curve), N7 underwater anchors, chains, furrow, sand plume, trawl (W and FS), N14 poses `hose-water` and `hose-pinch`, N15 split seam, the W-SKY satellite, the B05-SH04 chain and hull silhouette in FS, hose FLOW and STOP states.
- **Build order (proposal):** (1) N15 equal-scale proof for B03-SH02 (one still, 40 px both) before other B03 work (brief); (2) N14 poses + hose states, then the ten yard shots on the existing yard (B01-SH01/05, B02-SH01/02, B03-SH03, B04-SH01/03, B05-SH03/05, B06-SH03/04); (3) N5 signal line (B01-SH01, B01-SH02, B06-SH04); (4) W shots on `sea.ts` + N7 (B01-SH03, B03-SH01, B04-SH02, B04-SH04); (5) globe motion (B01-SH04, B06-SH01, B06-SH02); (6) bubble contents (B02-SH03); (7) cutaway motion (B04-SH05); (8) B05 (SH01, SH02, SH04 + chain descent). Half-size draft cut once every shot exists (W5).
- **R1.2 (v2 retime):** Boss applies the `fix`, `sync` and `N` rows of the [retime table](#r12-retime) and the v2 `SHOT_TABLE` before the next draft; Editor swaps in narration v2, `TOTAL` 1709 and the v2 captions; Ton (or Editor) re-places the cue sheet by [rule](#cue-re-placement). A v2 draft cut can be made before Boss lands the four `fix` shots only as a timing check: B01-SH01 would lose the line's bend, B01-SH03 its pulse, B02-SH03 its fold end and B04-SH04 its break.
- **Editor:** narration segments and takes per the placement table; captions per the caption plan; screen layers LBL/CARD/grade per the shot map; the cue sheet from this file's Sound lines once Ton delivers; caption-band checks listed under the caption plan.
- **Ton (W5.2s, in parallel with Boss):** NEEDS-GEN: M2, M3, A1, A2 (a, b), A3, A5, S1, **S1b (new)**, S2 (≤ 11 f), S3, S4, S5, S6, S9, S10, S11, S12, S13, S14, S15, S17, S19, S20, S21 (×4), S22, S23, END1 (1.9 s). Library checks by ear: M1 `bed_curious-explainer-light_01`, S7 `reveal_glass-shimmer-soft_01`, S8 `reveal_glass-pluck-ring_01`, S16 `stinger_low-muted-hit_01`, S18 `pulse_underwater-soft-thump_01`, S24 `ui_pop_01`.

## Dependencies and open items

| Owner | Item | Status |
| --- | --- | --- |
| user (via coordinator) | <a id="q6-length"></a>**Q6 length:** R1.1 asked keep 1829 f (60.97 s) or trim to ≤ 1800 f; the user answered "keep" (W5.3), and the v2 re-lock (candidate B) makes the video 1709 f (56.97 s), inside the 54–60 s window, so no trim option is needed. | closed (2026-11-15) |
| user (via coordinator) | **Q8 L01 → L02 seam, ear check on the v2 draft (R1.2; review page Q8; page Q7 records the answered voice decisions):** the read leaves only 3.8 f between "…ดาวเทียมนะ" and "มันวิ่ง…", so B01-SH01 must cut on L01's last syllable and the signal line's brake lands on the cut. Option: add 6–8 f of room tone at the L01\|L02 boundary (Editor; +6–8 f total, B01-SH01 keeps its built bend hold for those frames). Film recommends **no change** (the brake on the cut reads as the gag; the user asked for no pause surgery). | open (question in the R1.2 report) |
| Boss | N1–N15 per the handoff above; projection re-run after any camera tune beyond ±10 % (`projection-run.py`) | open |
| Ton | NEEDS-GEN cues + library checks above | open |
| Editor | placement, captions, cue sheet, band checks | open |
| Film | W5 draft review against this sheet; Q4 (LF01R long lens) and Q5 (cutaway arc) answered by the look lock 2026-11-15; W5 plate review (11 Boss questions) ruled in R1.1 (SD18–SD27); v2 retime R1.2 (SD28–SD36) | Q4, Q5 closed; plate review done; draft review open (needs a v2 draft cut) |
| Boss | **R1.2 retime:** `SHOT_TABLE` to the v2 column of the [retime table](#r12-retime); `fix` B01-SH01 (SD28), B01-SH03 (SD29), B02-SH03 (SD30), B04-SH04 (SD33); `sync` B03-SH01 (SD31), B04-SH02 (SD32), B04-SH05 (SD34), B06-SH01 spark 7 (SD36); `N` constants per the table | open |
| Editor + Ton | **R1.2 audio/timeline:** narration `EDU-EP17-SHORT-narration-v2.wav`, `TOTAL` 1709, captions per the v2 caption plan (`cues.ts`), cues re-placed per [cue re-placement](#cue-re-placement) and the stem re-mixed; dissolves stay start-at-cut (SD29) | open |
| Boss | R1.1 fix list: B01-SH01 (+ every shot showing the screen) sister screen live; B02-SH02 P30 visor hand; B04-SH02 hull chains at L80–104; B05-SH04 broadside hull + furrow banks; B06-SH02 spark mark | open |

Element captures: look frames in the store `projects/edu/EDU/previews/EDU-EP17-SHORT/looks-w3/` (`f1-clean/` LF02, LF03, LF05, LF06, LF07, LF07S1–S3; `f2-clean/` LF01, LF01R, LF04), painted by `src/painted/edu17/looks.tsx` at the uncommitted W3.1 state; illustrative only (no motion, no timing). Editor scene sample proposal: B04-SH02 (the twist move) and B03-SH02 (the equal-scale split).

## Change log

- 2026-11-15 EDU-EP17-SHEETS-R1.0 (Film W5.1, fresh invocation): first timed sheets from the W4 voice lock ([measure.json](measure.json)); 25 shots, 1829 f (60.97 s); narration split into six whole segments with the inserted gaps for V01, W-SKY, V02, V03 and the B05-SH05 reaction; V01–V03 and the sister's laugh placed; captions timed; every world-space camera run through `scripts/shot-projection.py` (`projection-run.py`, new). Camera and staging changes SD01–SD17 (yaw sign; B01-SH01 end = LF01; B01-SH02, B04-SH04, B05-SH04 re-staged; B03 and B04-SH02 deep cameras above the built floor; B04-SH05 = LF07 strip; B05-SH03 phone out of the band; B05-SH02 slower truck; B02-SH02 hy; B02-SH01 arc about M0; globe in `GlobeView` terms and the J pair; END1 1.9 s; B01-SH05 = LF01R; hose FLOW state + new cue S1b). Superseded storyboard numbers: B01-SH02 `camMove((−1.5, 0.3, −8), −14, 10.5, 4.2)` → `((−0.5, −1.0, −13), −10, 9.5, 3.2)`; B03-SH01 `at (0.6, −46, −300)` eye −45.4; B03-SH02 lower `at (0.6, −46, −303)` eye −46; B04-SH02 sink eye −44; B04-SH04 yaw 70 → 78 at (−1.0, −5.4, −51) → (1.2, −5.6, −55); B04-SH05 yaw −6 → −14, r 12.0 → 13.8, eye 3.0 → 3.4, hy 380; B05-SH02 3 m truck; B05-SH03 eye 1.50, hy 660; B05-SH04 hawse (70, −3, 0) F → anchor (0, 1.2, 0) FS, yaw 90 → 25; B02-SH02 hy 1500; END1 2.2 s. Review rows ROWS-R2.0 (timed).
- 2026-11-15 EDU-EP17-SHEETS-R1.1 (Film W5 plate review, fresh invocation, from Boss W5 passes 1–2 frames `w5-boss/`, `w6-boss/`): SD18–SD27 accept the built globe `lat` literal, B01-SH04 start at the pulse, the B06-SH02 slide point before the spark, the B05-SH04 end hold, the LF06 still wedge, the B02-SH03 left hand, the B02-SH02 camera tune, the B01-SH02 end and the B04-SH02 thin bared stretch; B05-SH04 hull turned broadside (SD22); B06-SH02 spark mark added; Camera lines for B01-SH04, B02-SH02, B06-SH02 and B05-SH04 restated. Fix list to Boss (sister screen, P30 visor hand, B04-SH02 chains, B05-SH04 hull and furrow, B06-SH02 mark). Timing, narration, IDs and length unchanged.
- 2026-11-15 EDU-EP17-SHEETS-R1.2 (Film W5 retime, fresh invocation): retimed to the v2 voice re-lock (NAR candidate B, [measure-v2.json](measure-v2.json) `placement_proposal`, `public/narration/EDU-EP17-SHORT-narration-v2.wav`, 1709 f = 56.97 s; user 2026-11-15: V01–V03 / W-SKY / B05-SH05 slot gaps kept, the L04 ellipsis accepted as read). Every cut keeps its v1 relation to the voice; new shot table, word anchors (Film silencedetect −30 dB on the v2 file), 37 captions, LBL/CARD/grade ranges, hose/hand G ranges, sound plan G ranges, per-shot Sound lines and a per-cue [re-placement](#cue-re-placement) of the 71 placed cues. Dissolves now start at the cut (SD29). Retimes SD28 (B01-SH01 signal −12 f), SD29 (B01-SH03 pulse L29), SD30 (B02-SH03 second half −12 f), SD31 (B03-SH01 pulse L34), SD32 (B04-SH02 arrival L97), SD33 (B04-SH04 anchor/trawl −10 f), SD34 (B04-SH05 bobs −7 f), SD35 (B05-SH03 +7 f hold), SD36 (B06-SH01 spark 7 L96). Q6 closed; review-page Q7 records the user's voice answers; Q8 (L01|L02 seam ear check) added. Cameras, staging, IDs, narration text and conceal/reveal unchanged. Review rows ROWS-R2.2.
