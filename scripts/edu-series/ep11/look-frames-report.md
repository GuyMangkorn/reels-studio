# EDU-EP11 look frames LF01–LF05: Boss report (2026-11-09)

Request **EDU-EP11-LFREQ-R1** against brief **R1.2** and rows **ROWS-R1.2** (not edited). Render stage: **stills only**, `scripts/stills.mjs`, one Chrome (`--gl=angle`), 1080×1920. Rerun: `sh scripts/edu-series/ep11/spikes/run-lf.sh` (about 1.5 min; needs `public/edu11-spike/inset-f877.png`, regenerate with `run-spikes.sh`; the file is deleted now). Logs `out/logs/edu11-lf-*`. Stills and sheets in `out/edu11/lf/` (store: see the end). Nothing committed, nothing in `src/Root.tsx`.

Checks done: `npx tsc --noEmit` (no error from `src/painted/edu11`, `kit/gear.ts`, `kit/cast.ts`), `python3 -I scripts/context-map.py`; `npm test` not run. Viewer check: **not run** (coordinator's job); my own 270 px read against user taste is under each LF. Every number below is measured (anchors through a stub painter, `caption-zone.py --band 1176:1344`).

| LF | Verdict | One line |
| --- | --- | --- |
| LF01 | **pass** | lead 800.8 px, caption mean 0.289 |
| LF01b | **partial** | numbers pass (lead 796, feet gap 85 px, no arm pop); the "weightless, not electrified" read is **not** reached: the hair fan and the leaning pose read as shock |
| LF02 | **pass with 2 deviations** | lead 484.7, shell bottom 1159.9 (needs `hy 768`), arrow moved off her face by moving her 0.16 m left |
| LF03 | **built, plan conflict** | showman 607.5 px (hat included), but INSET covers the rope cut and most of the assistant, who is half out of frame |
| LF04 | **pass with the known exception** | passengers 468.6 and 428.8 px, cage reads as a passenger lift |
| LF05 | **pass** | jaws and catch share no shape or colour; pawl tip (925, 1097) vs (915, 1098) |

## Two things Film must settle first

1. **`hy` means two different things in the brief.** The YCam `hy` is the **horizon row**. LF01, LF01b, LF02, LF05-jaws (eye = target height or a camera already spiked) work as written. For LF03, LF04 and LF05-catch the brief's own estimates (showman head ≈ 625 and feet ≈ 1143; pawl tip ≈ (915, 1098)) only come out if `hy` is the **target's picture row**: horizon row = `hy` + f·(target.y − eye)/r (LF03 1399, LF04 2091, catch 526). I used that conversion (`horizonHy` in `hall.ts`); with the literal value the platform lands at row 693 and the pawl at y 1320. Please write the horizon row, or name the convention, in the next brief.
2. **LF03 layout collides with slot INSET.** At the brief's camera the rope cut projects to **(982, 1056)** (brief ≈ (1030, 1086)), which is inside INSET x 760–1040, y 640–1138, so the one picture of "the cut" is hidden. The assistant (feet x 1.45) has his head at x 1061 and about half his body past the right edge, and his torso is under INSET as well. Options: INSET to the left/lower, or the trestle and rope cut about 0.5 m toward the platform (x ≈ 0.95). `LF03-alt.png` shows the second option with the INSET removed (assistant feet x 0.95, axe overhead, visible).

## LF01 SET-CAR @ f0

`out/edu11/lf/LF01.png`. Camera as written. Casting `woman-long + office (tie off), P10, neutral`, feet (0.05, 0, −0.30), hair rest. Steel values VD32 in two zones split at the handrail (y 0.90), side walls extended to z +1.4 (floor and ceiling too; the right-edge dark strip is gone), right-wall plaque (no text), display "20", amber bell with 30 % glow, three-step wall-base ramp kept. No HUD.

| Check | Result |
| --- | --- |
| Lead ≥ 700 | **800.8 px** (head top 709.9, feet 1510.7) |
| Caption mean 0.25–0.32 | **0.289** (p95 0.558, not targeted) |
| Display, bell, face readable at 270 px | yes (display "20" and amber dot visible on the sheet; face neutral, looking down) |
| Reads "lift, alone, evening", no motion | yes; the phone in her hand is small (two thin shapes at the chest): fine at 540, a dark speck at 270 |

## LF01b SET-CAR float @ f220

`LF01b.png` (+ `LF01b-f219.png`, `LF01b-f221.png`, not on the sheet). Camera as written. P46 + `zero-g-drift` (t = 220/30 s), `scared`, `hairRise` 1, HUD 18 / needle 24 % / tag, no pill, light 85 %.

| Check | Result |
| --- | --- |
| Lead ≥ 700 | **796.1 px** |
| Feet gap ≥ 40 | **85 px** (floor row 1608.8, feet 1523.8) with the soft floor shadow |
| Phone separate from hands | yes, free at (895, 798) px, hands far away (rotation 40°/s from f140: 107° at f220) |
| Grip | right hand centre (181, 1105) vs rail grip point (188, 1103): on the rail |
| No arm pop | max hand jump **3.0 px** (f219→220) and **2.9 px** (f220→221) |
| Caption mean | 0.312 (p95 0.468) |
| Weightless, not electrified at 270 px | **not reached.** The hair fan is a ring of spikes (as SP1, unchanged) and with the roll the body leans like a push, so it reads "startled / shocked". Film and the user judge; my suggestion is the SP1 option (b), a calmer hair fan (about 1 h), or a smaller roll and a second floating object |

Deviations (stand-ins, all allowed): `float-grab-rail` is P46 with `rArm` set to the rail point (the kit's two-bone IK) and the whole-card roll **pivoting at the grip** (−13.5°, head toward the rail). With the pivot at the grip and the brief's lift 0.15 m the feet rose 186 px (≈ 0.34 m) off the floor, so **lift is −0.04 m** to land the gap at 85 px; the card still reads "just off the floor". The phone sits at (0.62, 1.50, −0.20) instead of ≈ (0.28, 1.72, −0.20): the brief's point lies on the hair fan and, higher, under the HUD slot.

## LF02 SET-SHAFT @ f400

`LF02.png`. CAM-SHAFT-CLOSE, y_car 44.50. Section as SP2 plus landing variants (`landingVariant` in `shaft.ts`: `LV[(n·7+3) mod 3]`, every 4th floor B), work-light dots, streaks as a screen layer (12 strokes, 42 %, `#dfe6ec`, length 69 px = 23 px/frame × 3, never over the car), two identical white down-arrows with ink edge (x 925–995 and 505–575, y 700–960), HUD 15 / needle 47.7 % / readout pill / tag. WOMAN crouched P35 stand-in, right hand on the rail, `angry`, hair rise 1.

| Check | Result |
| --- | --- |
| Crouched lead ≥ 480 | **484.7 px** |
| Shell bottom ≤ 1160 | **1159.9** with `hy 768`; at the written `hy 770` it is 1161.9 (the shell edge is 0.1 m under the floor). Suggest `hy 768` |
| Rails both visible | x 100.7 and 984.3 (brief ≈ 95 / 980) |
| Arrows equal | both 70 × 260 px (±0), clear of the HUD (HUD ends y 600, arrows start 700) |
| Falling hinted | streaks yes; **only one landing is in frame at r 5.0** (≈ 1.5 storeys), so the three variants are not seen together here; B and C show in the wide frames |
| Caption mean | 0.242 (p95 0.444); no mean target for this frame |

Deviation: at crouch feet x −0.20 (set plan) her face and torso fall exactly under the arrow x 505–575. I moved her feet to **x −0.36** (shoulders at x 308–429), so the arrow stands to her right. Film: either keep her at −0.36, or move the arrow to ≈ x 400–470.

## LF03 SET-HALL1854 @ f980

`LF03.png` (INSET in place), `LF03-noinset.png`, `LF03-alt.png`. Set: timber hall floor, far wall, iron columns x ±4, arched glass roof with ribs and light shafts (ENV-FOG cones, 40 %), textless bunting at y 6.5, platform (deck y 2.40, back and side rails, crates and barrel), notched uprights x ±1.00 (pitch 0.10, tooth tops up), hoist rope up the centre and down the right upright to the winch, trestle. No building name anywhere. Sepia palette, light tint and vignette over the figures.

New looks (look check of N12 and N14): **showman** `man-parted + new: 1850s showman, P05` (frock coat to the knee, waistcoat, cream cravat bow, top hat), pointing down-right; **assistant** `man-buzz` own apron + `cap`, axe raised; **crowd ×4** back view, `new: 1850s crowd dress` (men: frock coat + top hat; women: bonnet + long skirt).

| Check | Result |
| --- | --- |
| Showman ≥ 480 | **607.5 px** (head-top row 525 includes the hat; feet 1132.6; brief est 518 / 1143) |
| Rope cut above 1160 and visible | above yes (**y 1055.7**, x 981.8), **visible: no, hidden under INSET** (see top) |
| Era against LF01 | yes: warm sepia against cool steel |
| Caption mean | 0.517 (p95 0.743): bright sepia frame, edu stroke carries the captions; no target in the request |
| Crowd | head tops at rows 1291.8, 1348.3, 1376.0, 1202.7; the two brief points at z 3.4–3.6 are 1.4–1.7 m from the lens, so the crowd is large and the z 3.6 figure is mostly out of frame |

Deviations: assistant facing: the request says "right view", the brief set plan says he faces −x toward the rope; I used **left view** (facing the rope). Axe: wind-up held overhead (hands at 0.12–0.20 m behind the grip line) instead of back over the shoulder, which went out of frame. Showman arm: P05 with the screen-right arm re-aimed down-right by hand target. INSET is the stand-in raster (6 px white border, x 760–1040, y 640–1138, content scaled inside the border; the file is deleted per instruction, so a rerun needs `run-spikes.sh` first). Crowd faces are not shown (backs).

User-taste self-check at 270 px: UT01 yes (hall + platform + top hat); UT05 era reads; UT12 the hall is lived-in only in the upper half, the lower half is flat floor and crowd silhouettes (Minor); the showman hand is a plain mitten (UT14 ok).

## LF04 SET-STORE1857 @ f1180

`LF04.png`. Cast-iron front: closed ground storey with arched blank shop windows below y 4.2, bay cut open x −2…+2 from y 4.2, plaster back wall with floor lines at 4.2 / 8.4 / 12.6, timber guides, shadow gathering over the top (hoist hidden), open cage car 1.6 × 2.2 m at y 5.85 (iron bars, floor plank, roof plate; **no rope, no catch**), two passengers (`new: 1850s crowd dress`, front, `neutral`; one top hat and frock coat, one bonnet and long skirt). Caption "1857" only; INSET stand-in. No store, street or maker name; the gas lamp, street and kerb pedestrians are below the frame.

| Check | Result |
| --- | --- |
| Passengers ≈ 440 px | **468.6 px** (man, hat included) and **428.8 px** (woman): the lead-size exception (VD24) stays, both under 480 for the woman |
| Cage reads as a passenger lift in a store at 270 px | yes (cage with two people, cast-iron arches under it); the upper storeys of the front are mostly out of frame (the bay is 4 m, frame 4.15 m at 260 px/m) |
| Nothing readable except "1857" | yes |
| Caption mean | 0.654 (p95 0.704): bright frame |

Self-check: the cage roof seen from below is a big dark plate (reads as a canopy; fine); the passengers are a little small and quiet next to the large plain wall (Minor, UT12).

## LF05 two brakes

`LF05-jaws.png`, `LF05-catch.png`, `sheet-lf05.png` (2-up), plus `LF05-catch-f1042.png` and `LF05-catch-f1045.png`.

| Check | Result |
| --- | --- |
| Jaws: bitten on the smooth T-rail, no bloom, HUD 20 / needle 2 % / tag, label "ภาพประกอบ" in LBL, no governor | yes; bite centre (484, 784), block rows 506–1061 |
| Catch: rope, spring and pawl in frame, pawl in the notch, amber outline on pawl and notch only | yes; **pawl tip (925.4, 1097.0)** vs ≈ (915, 1098); spring flat (199, 391) → (634, 653); the draped cut rope runs from (−30, 91) off the left edge to the frayed end (283, 325); notch pitch 150.8 px |
| Order rope slack → spring → pawl | **f1042** rope slack, spring still bowed, pawl out; **f1045** spring flat, pawl out; **f1050** pawl in the notch |
| Share no shape, colour or angle | yes: sepia timber, sawtooth, curved hook and leaf spring against cool steel, smooth rail, symmetrical wedge block |
| Bite, pawl tip, notch pocket above 1160 | yes (pawl 1097, jaws bite 784) |
| Caption mean | catch 0.628 (p95 0.722), jaws 0.412 (p95 0.898) |

Notes: the leaf spring is drawn as a straight leaf from (0.50, 2.88) to (0.77, 2.72); the hook outline of the pawl is the SP4 shape. The rope end is only slightly frayed (three strands); the brief did not size it.

## Fix round 1 (viewer check, 2026-11-09): LF03 and LF01b repainted

**Convention (coordinator, from now on):** `hy` in any camera line is written as the **horizon row**. My conversions for LF03 (1399), LF04 (2091) and the LF05 catch (526) stay as built.

**LF03** (`LF03.png`, `LF03-noinset.png`; the old brief layout is kept as `LF03-brief-layout.png`). The 0.5 m shift toward the platform cannot clear INSET: INSET covers x 760–1040 and the assistant is about 180 px wide at 352 px/m, so he would have to stand at feet x ≤ 0.34 m, inside the showman's x range. The fix that does clear it is to **mirror the staging**: trestle, winch, assistant and the rope down the **left** upright, assistant facing right toward the platform, and shifted 0.7 m toward it (feet x −0.75). The showman now points down-left. INSET is untouched.

| Check | Result |
| --- | --- |
| Rope cut outside INSET | **(332.2, 1060.2)**, INSET starts at x 760 |
| Assistant fully in frame and outside INSET | head (259.6, 985.4), body x about 160–370, lead 630.3 px (head top 908.8, feet 1539.1) |
| Axe clear of his face | hands moved 0.34–0.42 m behind the grip line, haft rises behind the head, blade toward the rope; viewed on the sheet |
| Arms less stiff | assistant: bent elbows (via points); showman: pointing arm with a slight bend, other hand on the hip |
| Showman | lead 607.5 px (unchanged) |
| Caption mean | 0.514 (p95 0.743) |

Deviation: the mirror changes the brief's side (rope and assistant on screen-right, set plan). Film should accept it or move INSET (the original right-hand layout works with INSET elsewhere). The lower half of the assistant is partly hidden by the crowd figure and the trestle is behind it, as intended foreground depth.

**LF01b** (`LF01b.png`, `LF01b-f219.png`, `LF01b-f221.png`). Calm hair fan: new optional kit field `HeadStyle.hairCalm` (with `hairRise`): 3 broad soft waves instead of 6 spikes, wider and lower (`head.ts`, proposed intake with `hairRise`). Roll **−7°** (was −13.5°) about the grip. Face: `scared` with a closed flat mouth and a straight look. Second and third floating objects near the phone: a **pen** (824, 924) and a **tissue** (942, 566), drifting and spinning slowly. Lift +0.05 m restores the gap.

| Check | Result |
| --- | --- |
| Lead ≥ 700 | **811.1 px** |
| Feet gap ≥ 40 | **84.1 px** |
| Grip | hand (188.9, 1101.9) vs grip (187.8, 1103.4) |
| No arm pop | max hand jump 3.0 px (f219→220), 2.9 px (f220→221) |
| Phone, pen, tissue separate from hands | yes (phone (895, 798), pen (825, 924), tissue (942, 566)) |
| Caption mean | 0.317 (p95 0.530) |
| Weightless at 270 px | **better, not certain**: the cloud-like hair, closed mouth, three drifting objects and a smaller lean read as floating; the diagonal arm to the rail is still the least weightless part (Minor). Open hands are not available: the kit's open mitten exists only for `InteriorLight.shaped`, so the hands stay plain mitten ovals |

Consequence for other shots: B01-SH03 to B03 should use `hairCalm` too, or LF01b and the section shots disagree (LF02 still has the spiky fan). Say if you want LF02 repainted with it.

## What was built (all uncommitted)

| Path | What |
| --- | --- |
| `src/painted/edu11/lf.tsx`, `lf-index.ts` | LF compositions (standalone entry; not in `src/Root.tsx`), slots as DOM (LBL, HUD, CAP, INSET), shaft streaks and arrows |
| `src/painted/edu11/hall.ts` | SET-HALL1854 (N3), showman (N12), crowd and passenger dress (N14), axe prop (N13, wind-up pose only) |
| `src/painted/edu11/store.ts` | SET-STORE1857 (N4) |
| `src/painted/edu11/car.ts`, `shaft.ts`, `brakes.ts` | promoted from the spikes: steel zones, wall extension, plaque, `grip` roll pivot, landing variants, crouch options, catch rope/spring order and the R1.2 catch camera |
| `src/painted/kit/head.ts` (`hairCalm`), `gear.ts`, `cast.ts` | **proposed kit intake:** `HatKind` gains `top` (top hat) and `bonnet` (front, side, back views via the same parts); `Gear.hat.kind` now uses `HatKind`. No existing character changes. Needs a kit-README line and a test at intake ([kit intake](../../../src/painted/kit/README.md#kit-intake)); the earlier `hairRise` field is still pending intake too |
| `scripts/edu-series/ep11/spikes/run-lf.sh`, `measure-lf.ts` | renders, measures and sheets |
| `docs/context-map.md` | EP11 row extended |

Not built (not needed by a still): N10 and N15 poses beyond the stand-ins, N16 faces, the full `axe-chop` motion, `hat-raise`, the pose mix. Stand-ins used: `float-grab-rail` (P46 + IK hand + grip-pivot roll), `rail-crouch` → P35, INSET → the spike raster.

## Fix round 2 (user note, 2026-11-09): LF03 assistant looks at the rope

The assistant now faces **left** (left view: head, gaze and body consistent) and the rope he cuts is on his left. Staging: shift −0.45 m (feet x −1.00), rope cut 0.3 m to his left at **(97.3, 1061.9)** (in frame, outside INSET x 760–1040), wind-up with hands behind the head and a shorter haft (head extension 0.40 m), so the axe clears his face; the blade points left, at the rope. Assistant head (196.6, 986.1), lead 629.2 px (feet 1538.8), fully in frame; showman unchanged (607.5 px); caption mean 0.521 (p95 0.743). The axe head ends beside the showman's left coat edge without covering him. Rerender: `LF03.png`, `LF03-noinset.png` (the round-1 numbers for LF03 above are superseded by these).

Review-page source: rebuild from `out/edu11/lf/LF03.png` (also in the store at `$REELS_STORE/projects/edu/EDU/look-frames/EDU-EP11-SHORT/LF03.17c18903.png` (the store keeps earlier rounds under the plain and older hashed names)).

## Fix round 3 (user note, 2026-11-09): LF03 axe on the rope side

The axe is now raised **in front of the assistant, on the rope side (left)**: hands forward and up (lower hand 0.30 m, upper 0.52 m in front of his chest line), haft rising to the left, blade pointing left at the rope; nothing overlaps the showman's body or the assistant's face. To keep the axe in frame the assistant stands at feet x **−0.75** (shift −0.70 m) and the cut is 0.3 m to his left at **(180.9, 1061.3)** (in frame, outside INSET x 760–1040). The showman's pointing arm now points steeply down toward the assistant so his hand does not meet the assistant's head (arm still fairly straight: Minor). Head stays left. Assistant head (283.4, 985.4), lead 630.3 px, fully in frame; showman 607.5 px; caption mean 0.515 (p95 0.743). Supersedes the LF03 numbers of rounds 1 and 2.
