# Storyboard SS-R1 — EDU-EP04-SHORT (first pass, untimed)

- Revision **SS-R1** (Film W2.2, 2026-11-05). Inputs: script **EDU-EP04-SCRIPT-R1.3** (user-approved, closed ending), brief **EDU-BRIEF-R1.1** ([brief.md](brief.md); camera lines, set plan, VD decisions), fact-check R1.3 re-check (PASS). Narrator Kore R1.3 take 3 (locked); MAN Algenib, CSH Charon (not generated).
- Status: `ready-for-dev` for the first storyboard review (camera and VO only). **Untimed**: no frames or lengths; brief shot plan lengths are `est`. W3 adds look frames to the same rows; W5.1 times the sheets from the full voice lock. Not user-approved.
- Review rows: [review-rows.json](review-rows.json) (Thai, one row per shot, `lines` cites R1.3 line IDs). Review page: pending.
- Set `SET-CHECKOUT` (world metres, refit for B06), plan model `PLAN` (orthographic, 130 px/m), lane colours teal/amber/coral for lanes 1/2/3 throughout.

| Shot | Lines | Camera (from the brief, est) | Picture direction |
| --- | --- | --- | --- |
| S01-B01-SH01 | L01 | Queue close, arc behind the tills, MAN 2.3–2.6 m | MAN in lane 2 (amber), red basket, eyes dart to lane 1; three tills recede diagonally. LF01. Bookend A |
| S01-B01-SH02 | L02 | Close push on MAN | Suspicious squint; title strip "ทำไมแถวข้าง ๆ เร็วกว่าเสมอ" above his head (VD16) |
| S01-B02-SH01 | L03 | Medium, truck left | Lane 1 shuffles; MAN slides into lane 1, sly mutter |
| S01-B02-SH02 | L04 | Medium over the lane-1 counter | CSH1 lifts the unpriced pineapple, till-1 light red, lane 1 frozen; lane 2 advances 2 slots in depth (VD06, **CL01** plant) |
| S01-B02-SH03 | — (silent gag) | Medium over the lane-3 counter | MAN whooshes to lane 3; `woman-elder` stacks coins one by one; lane 1 moves behind (VD07) |
| S01-B02-SH04 | L05 | Close arc to front | Slow turn to camera, sulking; both other lanes move behind |
| S01-B03-SH01 | L06 | Crane up to pitch −40°, dissolve | Story freeze; rise; dissolve into `PLAN` with lanes aligned (VD10) |
| S01-B03-SH02 | L07 | `PLAN` locked | Three equal lanes, 4 dots each; "ถ้าทุกแถวเท่ากัน"; eyebrow "แบบจำลอง" |
| S01-B03-SH03 | L08, L09 | `PLAN` slow push | Lane 2 "คุณ" + "1/3 · แบบจำลอง"; lanes 1+3 "2/3 · แบบจำลอง"; no race. LF02 |
| S01-B03-SH04 | L10 | `PLAN` held | MAN's dot hops lane 2 → 3; the "1/3 · แบบจำลอง" lockup follows unchanged |
| S01-B03-SH05 | L10a | `PLAN` held | **New (R1.3).** Paper wobble; CL01 price-check sign on till 1 + one big trolley icon in lane 2 pop in; lockup and eyebrow stay; no numbers, no dot moves (VD09a, **CL01** payoff) |
| S01-B04-SH01 | L11 | Medium arc, back in the store | MAN in lane 2 again, neck craned at the others; muzak detuned |
| S01-B04-SH02 | L12 | Close on the eyes | **Attention beat.** Eyes track lane 3, not his own lane (**CL02**) |
| S01-B04-SH03 | L13 | Medium-close, lane 3 in depth | **Attention beat.** Three lane-3 shoppers pass; one red chalk stroke each over his head (VD11) |
| S01-B04-SH04 | L14 | Reverse side, lane 1 visible | **Attention beat.** His lane passes `woman-pixie`; he is still looking right; no stroke; three remain |
| S01-B05-SH01 | L15 | Close push | **Memory beat.** Two bubbles: hot red long wait (sharp), pale smooth checkout (soft, fades to 40%, never gone, no caption). LF03 |
| S01-B05-SH02 | L16 | Close, front | **Memory beat.** "ซวยตลอด" stamp thunks on, cracks on "อาจไม่ใช่" |
| S01-B06-SH01 | L17 | Wide, high till side | Same store refitted: one serpentine queue to three tills; till-2 light green; no clock. LF04 |
| S01-B06-SH02 | L18, L18a | Close at the queue head | MAN calm, eyes shut, small smile; ding; "…สบายจัง", opens eyes, steps out |
| S01-B06-SH03 | L20 + hold | Queue-close size from the till side, push easing to stop | **Closing shot (R1.3 rewrite, was L19).** MAN walks unhurried to till 2, basket on the counter, `woman-ponytail` smiles and scans; end frame MAN relaxed at the till, shared queue behind, eyes not on any other lane; ~2.5 s live hold; fade to black (`A_fade`, VD14/VD15). Bookend B |

Rules carried from the brief: "แบบจำลอง" on every 1/3 and 2/3 and through L10a; no number outside `PLAN`; the plan never races; tallies are strokes, never digits; the pale memory stays visible; the refit and the closing shot show no clock, timer or faster queue; no brand; no muzak return after L20.

## W3 look-frame check: L20 end frame (Film, 2026-11-05)

Inputs: SS-R1 (user 20/20 ok, no notes), LF01–LF04 v2 (user-approved; `out/edu04/look-frames/v2/`, viewed as a 270 px sheet), brief R1.1 VD14/VD15 and acceptance criterion 7. The L20 end frame is not painted yet, so this is a plan check of S01-B06-SH03's end-hold frame against the approved looks. Note: under script R1.3 the end frame is **MAN served at till 2 in the refit store**, not a top-down diagram; "1/3" stays inside `PLAN` only (LF02), so a big "1/3" in the end frame would break the no-number-outside-`PLAN` rule.

| Check | Result | Evidence / note |
| --- | --- | --- |
| Palette | pass | Same refit set as LF04 v2: cream floor, mint counters, amber lane-2 stripe, red/yellow bunting, fluorescent key; till-2 green as the lamp under the hanging "II" sign (LF04 v2 convention, since the pole lamp may sit behind the till-side camera); green glow ≤ 0.3 on his shoulder (VD14). Lane-sign bars are lane IDs, not data |
| Cream look | pass | Store family of LF01/LF04 v2 (flat cream fluorescent, B06 warmer grade); no `PLAN` paper look in the end frame |
| Caption band y 1176–1344 | pass (relaxed cream limit, user 5 Nov 2026) | L20 caption sits on counter/floor cream like LF01/LF04 v2 (band mean 0.738 / 0.633); MAN's face, the basket on the counter and the cashier's smile stay above y 1160; no caption in the ~2.5 s hold |
| Closed ending | pass | `A_fade` (VD15): live hold, ~1 s fade to black, no loop match to S01-B01-SH01, no muzak return, no end card; no clock/timer/display in frame |
| Bookend size (criterion 7: MAN head within ±10% of S01-B01-SH01 first frame) | **fix FX-L20-01 (Film, applied below)** | LF01 v2 measured head ≈ 90 px at f 860, r 3.5 (≈ 0.37 m effective head; LF04 v2 gives the same, 125 px at f 1050, r 3.2). The brief's SH03 line `f 1100, r 2.8→2.3` gives ≈ 1100 × 0.37 / 2.3 ≈ 177 px, about 2× LF01: fails |

**FX-L20-01 (Film decision; supersedes the brief R1.1 SH03 camera `est` for the W5.1 timed sheet):** `cam: T-TILL2 (+0.20, 1.40, −0.50), yaw −25→−18 arc, r 3.9→3.6 slow push easing to near-stop, eye 1.80, pitch −5, f 860, hy 760` (est). Head at end ≈ 860 × 0.37 / 3.6 ≈ 88 px (target band 81–99 px, r 3.26–3.98 at f 860). Reason: LF01 v2 (approved) moved the opening to a wider compromise framing; the bookend follows the approved opening, and the wider r also keeps the cashier (+1.50, 0, −0.20) and the shared queue behind MAN in frame. Shot ID, timing, line L20 and staging unchanged. Owners: Film writes it into the W5.1 sheet (brief camera line updated in the same pass); Boss/Editor measure the end-hold head height and the cashier/register overlap at blockout (unchecked: the till-2 register (+0.85, 0.85, −0.15) must not cover MAN's basket hand). Fallback: if the counter crowds the frame at r 3.6, keep f 860 and lower yaw to −14.

Verdict: **pass with FX-L20-01 applied in plan**; no change to review rows (no Thai text, shot or line changes).

## W4.x B02 retime to the generated MAN/CSH voices (Film, 2026-11-05)

Why: the user asked Film to fit B02 to the generated voices. Inputs: [voice-measure.md](voice-measure.md#r13-man-and-csh-lines-w4x-film-casting-man-algenib-csh-charon) (L03 Algenib 1.47 s speech, starts at 0.00 in the clip; L04 Charon 1.72 s, speech 0.29–2.01; L05 **take 2** 0.90 s, speech 0.40–1.30; leading silence trimmed at the cut), narrator Kore R1.3 take 3 regap file (`projects/edu/EDU/narration/ep04/2026-11-05_ep04-r13-kore-take3-regap028.wav`). Narrator spans from `silencedetect -35 dB d 0.18` on that file (est; segment-to-line mapping by order, not checked by ear): L01 0.00–1.51, L02 1.79–3.76, L06 4.04–5.16, L07 starts 5.44, last speech ends 46.74. Script text, shot IDs, order, beats and reveals unchanged; no voice regenerated. 30 fps, global frames from video start; plan-level timing for W5.1, which re-times every shot from the full voice lock.

| Shot | Global frames (len) | Shot-local cues (frames) | Sound |
| --- | --- | --- | --- |
| S01-B01-SH01 | 0–56 (56 f, 1.87 s) | L01 NAR f3–f48 | muzak low, store ambience |
| S01-B01-SH02 | 56–121 (65 f, 2.17 s) | L02 NAR local f0–f59 (global 56–115); title strip wipe local f0–f6, off by f62 | small riser under L02 |
| S01-B02-SH01 | 121–171 (50 f, 1.67 s) | lane-1 shuffle local f0–f20; MAN slide local f2–f40; L03 MAN local f3–f47 | whoosh local f2; muzak continues; L03 +4 dB |
| S01-B02-SH02 | 171–233 (62 f, 2.07 s) | pineapple lift local f0–f8; till-1 red flash ×3 local f4–f34; L04 CSH local f4–f56; lane 2 advances 2 slots local f6–f50 (criterion 2); MAN glare local f50–f62 | record scratch or scanner error beep local f2; lane-2 rapid scan beeps local f10–f48; L04 +3 dB |
| S01-B02-SH03 | 233–269 (36 f, 1.20 s; was est 1.5) | whoosh-in local f0; 4 coins at local f8, f15, f22, f29; lane 1 moves behind from local f6 | coin clinks one by one, no voice |
| S01-B02-SH04 | 269–311 (42 f, 1.40 s) | turn to camera local f0–f14; L05 take 2 local f6–f33; sulk hold to f42 | sad-trombone sting local f26–f42, ends on the cut |
| S01-B03-SH01 | 311–360 (49 f, 1.63 s) | freeze on SH04's last frame at local f0; L06 NAR local f6–f40; crane from local f0; dissolve to `PLAN` local f34–f49 | music cuts to silence at local f0 (hard cut); soft wind rise from local f4 |
| S01-B03-SH02 | starts 360 | L07 NAR starts global 359 (0.27 s after L06) | — |

- **New B02 window (script L03–L06 + gag): 4.03–12.00 s (f121–f360, 7.97 s)**; was est 3.2–10.0. The start moves because L01+L02 measure 3.83 s (script est 3.2), not because of B02. Dialogue gaps are 0.10–0.20 s (comic cutting), shorter than the narrator's 0.28 s.
- **Total estimate ≈ 58.2 s** = 11.97 (to L07) + 41.30 (narrator L07 → last speech) + 2.42 (L18a 2.14 + 0.28 gap) + 2.50 end hold. Inside 60 s, about 3 s over the ~55 s trim target. The Editor's ~57 s left out dialogue gaps and acting time. B02 is near its floor: speech 5.21 s + gag 1.20 s + four 0.2 s gaps = 7.21 s minimum, so only ~0.4 s more could come out of B02 by hurting the gag or the turn.
- **Without a script trim, reaching ~55 s needs work outside B02 (not applied, decisions open):** (a) Editor at the voice-lock edit: re-gap take 3's 13 in-line comma pauses to ~0.15 s and the 16 between-line pauses to ~0.22 s (saves ~2.6 s est); (b) Film: end hold 2.5 → 2.0 s (saves 0.5 s; VD15 live hold stays). (a)+(b) ≈ 55.1 s est.
- Risks: narrator span mapping is by segment order and unchecked by ear; MAN/CSH clips are unheard (wording/timbre unchecked); L05's sting overlapping the speech tail by 7 f must not mask "อ้าว…" (Editor mix check); SH03 at 1.2 s holds 4 coins, not 5–6 (gag readable at 270 px still to check at blockout).

## Change log

- **SS-R1 W4.x B02 retime (2026-11-05, Film):** B02 fitted to generated MAN/CSH voices (L05 take 2); B02 window 4.03–12.00 s (f121–f360); gag 1.5 → 1.2 s; total est ≈ 58.2 s, ~55 s needs pause tightening + 2.0 s hold (open). Shot IDs, lines, order and reveals unchanged; review-rows.json unchanged (rows carry no timing fields yet).

- **SS-R1 W3 check (2026-11-05, Film):** L20 end-frame check against LF01–LF04 v2: palette, cream look, caption band and closed ending pass; bookend size fixed in plan by FX-L20-01 (SH03 camera f 860, r 3.9→3.6). Shot IDs, lines and timing unchanged.

- **SS-R1 (2026-11-05, Film W2.2):** first untimed pass from script R1.3 and brief R1.1; 20 shots; every R1.3 line placed once (L01–L10, L10a, L11–L18a, L20; silent gag in S01-B02-SH03).
