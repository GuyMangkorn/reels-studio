# Visual brief — EDU-EP18-SHORT (ยาช่วยชีวิตอยู่ในครัว / oral rehydration)

Deliverable: `EDU-EP18-SHORT`, channel `edu`; series task file [../task.md](../task.md). Thai Short 1080×1920, 30 fps, **1737 f (57.90 s)**, ending **closed, 2 s hold** on เก่ง, ยาย and the cup after one cluck.
Revision: **EDU-EP18-BRIEF-R1.1** (Film, 2026-11-14; R1 same day). Status: brief ready; timed scene sheet ready for look frames (W3); not ready-for-dev until the user passes the look frames, the card layout and the under-house setting.
Script: [script.md](script.md) **R2.2** (user-locked; recipe text and safety text unchanged). Voice lock: `~/ReelsStore/projects/edu/EDU/voice/ep18_narration_kore_x1.05.5bfff882.wav` (R2.2), R2.2 character takes; W-PHONE 2.0 s, W-SHOP 1.7 s, end hold 2 s (user, 14 Nov 2026). The answer window L07 onset → L09 onset is kept at **266 f (8.87 s; design 8.88 s)**.
Style profile and series decisions: as the [EP16 brief](../ep16/film-brief.md). Scene sheet: [storyboard.md](storyboard.md) EDU-EP18-SHEET-R1 · rows [review-rows.json](review-rows.json) (review page: pending) · timing [measure.json](measure.json).

## Visual intent

A tender night: เก่ง is sick from unboiled stream water; the phone cannot call, the shop runs out, and the useless phone's torch finds the answer on the kitchen shelf: sugar, salt, boiled water. The recipe must be **legible and exact** on screen; the safety line must be visible the whole time the recipe is taught. Morning resolves it warmly. Clue path: the jars sit dark on the shelf from shot 4 (K02), the torch (K03) finds them in shot 17, the hands use them in shot 18, the push-in pays them in shot 21.

## Sound direction

Family per [EP16 sound direction](../ep16/film-brief.md#sound-direction). **M18** tender kalimba + soft phin + low pad ≈ 72 bpm; out under W-PHONE, darker through L05–L06, a small rising run when the beam lands on the jars, warm resolve from L08 into the morning. Night ambience A-IN (crickets outside, lamp flutter, shallow breath), shop A-SH, morning A-MM with hens. Recipe foley close and precise (pour, six spoon taps with knife scrapes, one salt scrape, stir) so the count is heard as well as seen. Ending: hen cluck then **E-TAG** (shared with EP16).

## Visual progression

| Beat | Shots | Light | Camera | Read |
| --- | --- | --- | --- | --- |
| B01 hook | 1–4 | night → morning → bright stream → night lamp | signature, quick cuts | medicine is in the kitchen; he drank raw water |
| B02 no phone | 5–8 | moonlight, phone glow | ladder wide, screen insert, high wide | no signal; torch only |
| B03 no shop | 9–10 | single shop lamp | medium → CU on the bare shelf | medicine runs out |
| B04 danger | 11–16 | oil lamp, then torch beam | close, slow pushes | diarrhoea is dangerous; water and salt are lost |
| B05 recipe | 17–19 | torch on the jars in shot 17 only (script W-KITCHEN); lamp only in 18–19 (R1.1) | CU, overhead, held medium | the recipe, sipping, the safety line |
| B06 payoff | 20–22 | warm morning | medium, push in, arc | the medicine was in your kitchen |

## Scene decisions

- **VD18-01 Night scenes under the house** (SET-UNDER in the [EP16 set plan](../ep16/film-brief.md#set-plan--set-vil-vil-metres-est)): the bamboo platform with the mat, the oil lamp, the kitchen shelf behind ยาย (K02 in frame from shot 4), the door to the yard (hens in the morning). Script says "his mat"; the location is Film's staging choice (rows Q1).
- **VD18-02 Recipe card RCP** at the top of frame, three lines popping on the measured word onsets (f1264, f1302, f1352), numerals 88 px; footnote "ช้อนชามาตรฐาน" with line 3; full size to f1394, then a compact chip top right to f1530 so faces read in shot 19 (rows Q3).
- **VD18-02/03 layout (R1.1):** every screen layer stays inside x 120–888 (card 120–888, chip 528–888); the safety sentence breaks into two 44 px lines (detail in the sheet's On-screen text).
- **VD18-03 Safety strip SAF** "ในชีวิตจริง: ดื่มไม่ได้ หรืออาการหนัก ต้องรีบหาหมอ" f1264–1515 under the card; second line "มีซองเกลือแร่ ใช้ซองก่อน" f1426–1515. Kept on screen even while the L08b subtitle repeats it (safety text wins over de-duplication; rows Q2).
- **VD18-04 Overhead recipe shot (shot 18)**: hands only, pitch −58°, bottle and spoon between y 695 and 1110 (below the card and strip, above the caption band; `shot-projection.py`). Exactly six level teaspoons of sugar and half a level teaspoon of salt, each scraped flat with the knife; cooled boiled water, no steam.
- **VD18-05 Jug as the body:** the jug level falls in shot 15 (three dissolves) and refills in shot 19 (DF-20261029-painted-timeline-dissolve); no body diagrams.
- **VD18-06 Torch beam** from the phone (ENV-FOG `paintFogCone` + ENV-GLOW halo) follows the phone in ยาย's hand (shots 8, 16, 17): beam-follows-hand is `unknown` at runtime (Boss).
- **VD18-07 Long-neck silhouette (shot 5)** is a sky layer placed in screen space (x 600, base y 1000, 150 px), not a world object, so it stays above the caption band.

<a id="set-plan--set-shop"></a>
## Set plan — SET-SHOP (metres, est)

Origin at the shop floor centre; +x right seen from the door, +y up, +z toward the door. Glass pharmacy cabinet x 0.5..1.7, y 0.9..2.1, back wall z −2.45; counter z −1.2; shopkeeper mark (0.4, 0, −1.6); entry mark (0.4, 0, −0.5); one hanging lamp (0.5, 2.4, −1.2) with moths; bead curtain at the door z +1.5.

## Technical handoff

New EP18 needs (detail in the [sheet](storyboard.md#new-assets-for-boss)): SET-UNDER dressing, SET-SHOP, far herd and silhouette layers, torch beam following the hand, phone screen, recipe card + chip + safety strip (crisp SVG Thai), props (bottle, teaspoon, knife, cup, cloth, fan, pill boxes), lying and sipping poses. Text legibility and the caption zone are acceptance items in the sheet. Runtime status as in the EP16 brief. Look frames (W3): LF-UNDER-NIGHT (shot 4), LF-SHOP (shot 9), LF-RECIPE (shot 18 at +100 with the card), LF-UNDER-MORNING (shot 20).

## Change log

- 2026-11-14 R1 (Film): first brief from script R2.2 and the R2.2 voice lock; recipe window kept at 266 f.
- 2026-11-14 R1.1 (Film, user verdicts on W3 look frames 14 Nov 2026): B05 light split (torch only in shot 17, lamp only in 18–19), screen-layer layout inside x 120–888 with a two-line safety strip; shot-level changes in the sheet R1.1.
