# Viewer check — EDU-EP01-SHORT W5.2 picture draft

- **Check:** [viewer check](../../../docs/sequence-workflow.md#viewer-check), fresh Film invocation (Opus, medium), 2026-11-04. The checker did not paint the draft.
- **Inputs:** `out/edu01/w52/` G1, G2, G3, G45 (69 key stills, start+2 / mid / end-2 per shot, 270 px tiles) and `sit.png`; raw stills `out/EDU-EP01-SHORT/stills/<frame>.png` cropped full-size for 142, 371, 450, 512, 564, 611, 1580, 1691, 2 vs 1858; locked look frames LF01 v2, LF02 v5, LF03 v2, LF04 v3, LF05 v2 (store `projects/edu/EDU/previews/look-frames/ep01/`) tiled beside the matching draft frame; timed sheet [scene-sheets.md](scene-sheets.md) R1.1; row "seen" in [review-rows.json](review-rows.json); [user taste](../../../docs/user-taste.md) UT01–UT12.
- **Scope:** stills only. Captions, the "ภาพจำลอง" tag and the "hypnic jerk" name card are Editor overlays and are not in these stills.
- **Result:** **repaint-needed.** Two blockers (the sit-up figure and the faller's ground shadow) and six should-fix items. The look matches all five locked frames (bedroom, cliff, thought room, icons and doctor are close to identical to LF01–LF05), and the loop seam holds.

## Per shot

| Shot | Frames | Reads as, without narration | Verdict | Findings (row / pose / user taste) |
| --- | --- | --- | --- | --- |
| S01-B01-SH01 | 2, 62, 122 | "A young woman asleep on her back in a moonlit blue bedroom." Reads in 1 s. | pass | Matches LF01. UT01, UT03 ok. |
| S01-B01-SH02 | 126, 142, 159 | "A big upturned face on the pillow, looking at the ceiling." | **fail** | **Should-fix:** the accept says "eyes fully open by L24 and looking at the lens". The head is a profile turned up, so the eye looks at the ceiling and the hook question ("คุณก็เคย… ใช่ไหม") is not put to the viewer. The eye is a front-view iris on a profile face (known risk confirmed, f142), and the ear disc sits on the jaw line. **Should-fix:** the face sits in the top quarter of the frame with the bed rail and floor filling the lower 60 % (UT02): re-anchor the 1.8 zoom on the face centre. |
| S01-B02-SH01 | 163, 217, 272 | "Same sleeping woman, same wide shot." | pass (nit) | **Nit:** the sheet asks for "side-on medium, face into pillow"; the draft is the B01-SH01 wide with her face up, so the shot looks like a repeat. Room softening is visible. |
| S01-B02-SH02 | 276, 302, 329 | "The room dims; the clock light goes out." | pass | Dimming reads; no limb-wise change. |
| S01-B03-SH01 | 333, 371, 409 | "The bedroom melts into a pink and violet cloud cliff." | pass (should-fix) | **Should-fix (f371):** a thin white pencil line of the ledge runs diagonally across the whole dissolve, through her body and the floor, and reads as a stray string or scratch. Fade the line in with the cliff, not ahead of it. Dream feel holds otherwise. |
| S01-B03-SH02 | 413, 450, 488 | "A small girl from behind at the tip of a cliff over a cloud sea." | pass (should-fix) | Matches LF02 v5 (back of head, whorl, heels). **Should-fix (409 → 413):** B03-SH01 ends on the empty cliff and B03-SH02 opens on the identical framing with her in it, so she pops into the picture on the cut. Either let her fade in during the last frames of SH01 or have SH02 open on a different framing. The bow is still not in the still (LF02 v5 note); judge in motion. LF02 nits (flat shoulder panel with a corner past the arm) remain. |
| S01-B03-SH03 | 492, 512, 533 | "A girl in pyjamas balancing on a little disc among pastel streaks." | **fail** | **Blocker (f492–533, crop at f512):** the kit's soft ground shadow stays under her feet as a grey-green puddle with a dark streak. She reads as standing on a hoverboard or skating, not falling; this is the hero shot of the dream fall. **Should-fix:** the figure is about 125 px tall at the 270 px tile; the accept asks for ≥ 200 px. **Nit:** the hair hangs as if standing (no lift from the fall); the poses across the three stills are near-identical, so the ±12° tumble does not show in stills. Pose P39 `fall_stumble` reads (arms thrown out, mouth open), no arm faults beyond that. |
| S01-B03-SH04 | 537, 542, 548 | "She hangs frozen among the streaks." | pass (inherits) | Inherits the B03-SH03 ground shadow blocker. |
| S01-B03-SH05 | 552, 564, 577 | "Back in bed, she jolts awake, eyes wide." | pass | Flash visible at f552; at f564 the eyes are wide (full iris) and the head is lifted. Same angle as the opening shot. |
| S01-B04-SH01 | 581, 596, 611 | "A cardboard cut-out of her sitting up in bed." | **fail** | **Blocker (f596, f611; crop at f611):** the sit-up is the lying torso rotated upright: one flat lavender rectangle with square corners, no neck (a grey block behind the hair), the head placed forward of the torso, no hips or thighs, the arm a faint tube and the hand on the chest a floating dot. Known risk confirmed. She sits mid-mattress with legs under the blanket rather than at the bed edge (the sheet's `new: sit on bed edge`); that is acceptable if the figure itself reads. |
| S01-B04-SH02 | 615, 666, 717 | Same cut-out, sitting still. | **fail** (inherits) | Same blocker for 106 frames at the medium size. Name card placement could not be judged (overlay); her head is at the window and moon, so the card in the upper zone must clear it. |
| S01-B05-SH01 | 721, 780, 840 | "A worried girl sits on a bed fragment on warm paper; a big '?' appears." | pass (nit) | Matches LF03 v2. **Nit:** no head tilt visible; the "?" grows top right, not behind her. |
| S01-B05-SH02 | 844, 862, 880 | "Two thought bubbles with '?' above her." | pass | Reads at once. |
| S01-B05-SH03 | 884, 945, 1006 | "A soft pink brain with eyes and a sun-to-moon slider." | pass | Not anatomical, as the row asks. The snag in the slider is motion only. |
| S01-B05-SH04 | 1010, 1080, 1151 | "The brain looks down at a tiny sleeper; the paper turns grey." | pass (should-fix) | **Should-fix (f1080–1151):** the dim turns the warm paper a muddy grey-taupe (UT04 "clean colour, not a muddy pool"); dim toward a cool lilac or lower value of the same cream instead. |
| S01-B05-SH05 | 1155, 1175, 1196 | "The brain drips a pink line onto the sleeper." | pass (nit) | **Nit (f1175):** the signal reads as a pink drip or tongue rather than a quick flash; check in motion. |
| S01-B05-SH06 | 1200, 1233, 1267 | "The bubbles melt away, only the '?' remain over her." | pass | Paint run reads. |
| S01-B06-SH01 | 1271, 1342, 1413 | "Coffee, a tangle, a moon with a clock." | pass | Matches LF04 v3. **Nit:** f1271 is blank paper (icons arrive on the word); fine in motion if short. |
| S01-B06-SH02 | 1417, 1449, 1481 | "A dumbbell joins; the other three fade." | pass | No arrows. |
| S01-B07-SH01 | 1485, 1532, 1580 | "The cut-out sits in bed holding a white plate." | **fail** | Inherits the sit-up blocker. **Should-fix (f1532, f1580):** the "pillow hug" is a white oval floating at the chest with the dot hand on it; no arm goes round it, so it reads as a plate or a bowl. The smile does not read at 270 px on the profile. |
| S01-B07-SH02 | 1584, 1609, 1635 | "She lies awake looking at the ceiling, calm." | pass | No fear cue. |
| S01-B07-SH03 | 1639, 1691, 1744 | "A friendly doctor in a white coat with a stethoscope." | pass (nit) | Matches LF05 v2 as approved. **Nits:** the lower half of the coat is translucent (body and wall show through); the mitten hands read as paddles at the hips; one stray hair arc across the fringe. UT08 cues present. |
| S01-B08-SH01 | 1748, 1803, 1858 | "She lies back down and closes her eyes." | pass (inherits at start) | f1748 shows the cut-out sitting figure (blocker). Mid lie-back at f1803 reads. **Loop seam:** f1858 vs f2 differ by a mean 2.76/255 (max 184 at small edges); faces in both are half-lidded, wall and light match. Passes at still level. |

## Findings by severity and owner

| # | Severity | Shot / frames | Finding | Owner |
| --- | --- | --- | --- | --- |
| 1 | blocker | B04-SH01 f596–611, B04-SH02 all, B07-SH01 all, B08-SH01 f1748 (≈ 8 s of 62 s) | Sit-up figure is a rotated lying slab: rectangular torso, no neck, head forward of the body, no lap, dot hand. Paint a seated side-view figure (bent hips, thighs along the mattress, rounded back, neck, upper arm from the shoulder, hand that touches the chest). | Episode code now (`src/painted/edu01/set.ts`, the sleeper sit pivot `sleeperXf`/`PIV`); the reusable seated side pose (`new: sit on bed edge`, P31 hands in lap) goes to Boss through kit intake. |
| 2 | blocker | B03-SH03 f492–533, B03-SH04 f537–548 | The faller keeps the kit's ground shadow under her feet; she reads as standing on a disc, not falling. | Boss: add a shadow-off option to the kit figure (`src/painted/edu01/parts.ts:64` notes the kit has none). Episode workaround if Boss is not available: do not paint it in the fall shots. |
| 3 | should-fix | B01-SH02 f126–159 | Eyes look at the ceiling, not the lens (accept fails); front iris on a profile; face in the top quarter with an empty lower frame. | Episode code (head turn toward camera, zoom anchor). Boss only if the kit has no three-quarter face for a lying head. |
| 4 | should-fix | B03-SH01 f371 | Ledge pencil line crosses the whole dissolve as a stray white string. | Episode code (cliff line alpha follows the cliff wash). |
| 5 | should-fix | B03-SH01 f409 → B03-SH02 f413 | Girl pops in on a cut between identical framings. | Episode code. |
| 6 | should-fix | B03-SH03 | Faller ≈ 125 px tall at 270 px, accept asks ≥ 200 px. | Episode code (scale). |
| 7 | should-fix | B07-SH01 f1532–1580 | Pillow reads as a plate; no arm wraps it. | Episode code, together with #1. |
| 8 | should-fix | B05-SH04 f1080–1151 (into B05-SH05/06) | Dim makes the paper muddy grey-taupe (UT04). | Episode code. |
| 9 | nit | B02-SH01; B05-SH01; B05-SH05; B06-SH01 f1271; B07-SH03; B03-SH03 hair | Face not into pillow (repeat of the wide); no head tilt; drip-like signal; blank first frame; translucent coat, paddle hands, stray hair arc; hair hangs as if standing. | Episode code. |

## Could not judge from stills

- Motion: the sit-up and lie-back arcs, the B03-SH03 tumble and camera drop, streak direction and speed (rising vs falling read), the B03-SH05 jolt curve (lift, overshoot, blanket bounce), the slider snag, the "?" wobble, the doctor's nod.
- Timing: the B03-SH01 dissolve curve, the 3-frame flash, the B03-SH04 freeze length, the B08 0.5 s hold, eyelid timing in B01/B02.
- The B03-SH02 head bow before the lean (only carried by motion).
- The loop seam on the exact frames f1859 → f0 (checked f1858 vs f2 only), and the push-in reset across it.
- Captions, the "ภาพจำลอง" tag and the name card, and their clearance from the window and moon in B04-SH02.
- Sound.

## Change log

- 2026-11-04 (Film, viewer check): W5.2 picture draft, 23 shots. Repaint-needed: blockers #1 sit-up slab (B04, B07-SH01, B08 start) and #2 faller ground shadow (B03-SH03/04); six should-fix items; look matches LF01–LF05; loop seam passes at still level.
