# Viewer check (round 2): EDU-EP01-SHORT W5.2 picture draft after the repaint round

- **Check:** [viewer check](../../../docs/sequence-workflow.md#viewer-check), second round, fresh Film invocation (Opus, medium), 2026-11-04. The checker did not paint the draft or the repaint. Stills were looked at cold first, then compared with round 1 ([viewer-check-w52.md](viewer-check-w52.md)) and the "W5.2 repaint round" notes in [build-notes.md](../build-notes.md).
- **Inputs:** `out/edu01/w52/` G1, G2, G3, G45 (re-rendered, 270 px tiles), `situp_before_after.png`, `faller_before_after.png`, `before/1080.png`; raw stills `out/EDU-EP01-SHORT/stills/<frame>.png` cropped full-size for 126/142/159, 371/409/413/450, 512, 542, 596, 611, 666, 1080, 1175, 1233, 1532, 1580, 1748, 1803. Extra stills rendered for this check with `scripts/render.mjs EDU-EP01-SHORT --stills` (one Chrome): 584, 585, 587, 588, 590, 592, 594 (sit-up arc) and 1752, 1765, 1778, 1790, 1796, 1800, 1806, 1810, 1815, 1830 (lie-back arc). [User taste](../../../docs/user-taste.md) UT01–UT12.
- **Scope:** stills only. Captions, the "ภาพจำลอง" tag, the name card and sound are W5.3 overlays and are not in these stills.
- **Result:** **repaint-needed.** Both round-1 blockers are fixed in their held poses: the seated figure now reads as a girl sitting up in bed, and the faller no longer has a ground shadow. The repaint adds one new blocker. In the middle of the sit-up and lie-back arcs the figure turns see-through and a blue ghost hand sticks up through the blanket (f587–588, f1796–1810). Three should-fix items and some nits remain.

## Round-1 findings

| # | Round-1 finding | Status | Evidence (shot / frame) |
| --- | --- | --- | --- |
| 1 | blocker: the sit-up is a rotated lying slab | **fixed in held poses; new blocker in the arcs (N1)** | B04-SH01 f596–611, B04-SH02 f615–717, B07-SH01, B08-SH01 f1748: round shoulder, skin neck, V collar, upper arm from the shoulder, elbow at the waist, mitten hand joined to the forearm and touching the chest; the blanket pools over the lap and reads as bent legs. She sits mid-bed, not on the edge (accepted in round 1). Mid-arc frames fail (see N1). |
| 2 | blocker: faller ground shadow | **fixed** | B03-SH03 f492–533, B03-SH04 f537–548: no disc under the feet; she reads as falling among rising streaks, not standing. |
| 3 | should-fix: B01-SH02 eye looks at the ceiling; front iris on a profile; face in the top quarter | **partly fixed** | f126–159: the face now sits in the frame centre and the bed fills only the lower third (UT02/UT03 ok). The head is still a profile turned up, so the eye still looks up and to the right, not at the viewer. The ear disc still sits on the jaw line. Known and accepted by Boss as unfixed; still a should-fix against the row accept. |
| 4 | should-fix: B03-SH01 ledge pencil line across the dissolve | **fixed** | f371: no diagonal line; the ledge ink arrives with the cliff wash by f409. |
| 5 | should-fix: B03-SH01 → SH02 pop-in between identical framings | **partly fixed** | f409 → f413: SH02 opens about 17 % closer and settles out by f450. Same angle and axis, so it is a small step in size; she still appears on the cut. It now reads as a cut-in rather than a glitch. Downgraded to nit; judge in motion. |
| 6 | should-fix: faller ≈ 125 px at the 270 px tile | **fixed** | f512: about 205 px at 270 px; the face and open mouth read. |
| 7 | should-fix: B07-SH01 pillow reads as a plate | **partly fixed** | f1532, f1580: a white pillow with creases sits behind the near arm, the forearm lies over it and the hand rests on top, so she now holds something soft. It is about half the width of the bed pillow (f1748) and flat white, while the bed pillow has a blue sheen. It reads as a small cushion or a towel more than the pillow she sleeps on. Now a nit (N5). |
| 8 | should-fix: B05 dim makes the paper muddy grey | **fixed** | f1080, f1175, f1233 vs `before/1080.png`: the dim is now a clean dusty rose-lilac, not grey-taupe (UT04). It is warmer than the "cool lilac" asked for; nit only (N6). |
| 9 | nits (B02-SH01 repeat wide, B05 head tilt, drip-like signal, blank f1271, doctor coat/hands/hair arc, faller hair) | **not fixed** (known) | Unchanged in G1/G3/G45. Faller hair still hangs as if standing (f512, f542). |

## New problems from the repaint

| # | Severity | Shot / frames | Finding | Owner |
| --- | --- | --- | --- | --- |
| N1 | **blocker** | B08-SH01 lie-back f1796–1810 (about 15 f, 0.5 s, in the slow final move before the loop seam); B04-SH01 sit-up f587–588 (fast jolt, about 3–5 f) | In the middle of the arc the torso and arm are semi-transparent, so the sheet band and the blanket show through the body. The forearm swings upright and the hand, tinted blue-green, pokes up through or above the blanket like a ghost hand (f1800, f1803, f1806; still faintly visible at f1810). It looks like two half-faded bodies crossfading (the lying `TORSO_O` panel and the seated `TORSO_N`, each at partial alpha) plus an elbow solution that flips the hand upward partway through the rise. Held poses at both ends are clean. | Episode code (`src/painted/edu01/set.ts`: the torso mix and alpha in `sleeperXf`, the `elbowOf` IK and the hand-target path during rot 0..1). Keep the body opaque through the whole arc. Keep the hand on the chest or under the blanket edge. |
| N2 | should-fix | Seated B04-SH01/02, B07-SH01, B08 f1748 (back of the neck); mid-arc f590–594, f1778, f1790; B01-SH02 f126–159 | Grey neck block. When she sits, a grey-brown rectangle shows behind the neck between the hair and the shoulder. Mid-arc the head tips back on a long, slanted grey block, which reads as a stretched neck with the head floating. In the B01-SH02 close-up a grey translucent rectangle sits under the chin with the white collar pencil line sticking out of it. | Episode code first (neck shade in skin value, hidden under the hair; head pivot kept on the neck top during the arc). Boss if the grey block is the kit lying head's neck plate (it also shows faintly in the B01-SH01 wide). |
| N3 | should-fix | B03-SH03 f492–533, B03-SH04 f537–548 (crop f512, f542) | The faller's legs (and partly the extended arm) are see-through: the orange and white streaks show through the trousers, so the lower body looks ghostly now that the figure is larger. | Episode code (draw order of the upward paint-streak FX relative to the figure, or the figure's alpha in `paintFaller`). Boss only if the kit pyjama legs are painted at low opacity. |
| N4 | nit | Seated figure, all held frames | The seated torso has no bust or waist cue (UT08); the front is one straight lavender plane. The faller torso is also a straight box. | Boss (kit intake for the seated body `new: sit on bed edge`; female torso cues are kit gap 3). |
| N5 | nit | B07-SH01 f1532–1580 vs B08-SH01 f1748 | The hugged pillow is about half the size of the bed pillow and a different white (see #7). | Episode code. |
| N6 | nit | B05-SH04–06 f1080–1267 | The dim is a warm rose-mauve, not the cool lilac asked for. It reads clean, so this is a matter of taste only. | Episode code. |

Checked and fine: the sit-up hip scoot (HIP_LYING → HIP_SIT) leaves no gap between the body and the blanket in the held poses. The bed pillow leaves the bed while she hugs it (f1532) and is back for B08 (f1748). The B03-SH02 slip-off shows only the top of her head at the bottom edge by f488, which reads as her dropping out of frame. The B01-SH02 recomposition (face in the centre band, lower third bed) passes UT02/UT03. The faller reads without the shadow: arms thrown up, mouth open, rising streaks.

## Findings by severity and owner

| # | Severity | Shot / frames | Finding | Owner |
| --- | --- | --- | --- | --- |
| N1 | blocker | B08-SH01 f1796–1810; B04-SH01 f587–588 | See-through body and blue ghost hand poking through the blanket mid-arc. | Episode code (`set.ts` sleeper arc). |
| 3 | should-fix | B01-SH02 f126–159 | Eye still looks up, not at the lens (profile head); ear on the jaw. | Episode code (three-quarter lying head) or Boss if built as a kit head. |
| N2 | should-fix | Seated shots, mid-arcs, B01-SH02 | Grey neck block; head floats on a slanted grey slab mid-arc. | Episode code; Boss if it is the kit lying-head neck plate. |
| N3 | should-fix | B03-SH03/04 f492–548 | Faller legs see-through against the streaks. | Episode code (FX order or figure alpha); Boss if kit alpha. |
| 5, 7 | nit | f409→413; f1532–1580 | Small cut-in on the same axis; small white pillow. | Episode code. |
| N4–N6, 9 | nit | as listed | No bust/waist on the seated torso; warm dim; round-1 nits (repeat wide, head tilt, drip signal, blank f1271, doctor coat/hands, faller hair not streaming). | Boss (N4, faller hair); episode code (others). |

## Could not judge from stills

- The full sit-up and lie-back arcs in motion: whether the N1 ghost frames register at speed in the fast jolt (B04-SH01) and how long it shows in B08. The ease of the hip scoot and whether the blanket mound moves with the legs.
- The B03-SH05 jolt curve (lift, overshoot, blanket bounce) and the 3-frame flash.
- The B03-SH03 tumble (±12°), the camera drop and whether the streaks rise fast enough to sell the fall without hair lift.
- Whether the 17 % push-out at B03-SH02 reads as a deliberate settle or a jump cut. The bowed-head nod.
- Dissolves (B03-SH01 room to cloud, B05-SH06 melt) and the B05 dim ramp over time.
- The loop seam f1859 → f0 in motion (round 1 checked f1858 vs f2 only; not re-checked here).
- Captions, tag, name card and their clearance; sound.

## Change log

- 2026-11-04 (Film, viewer check round 2): repaint round of the W5.2 draft. Round-1 blockers #1 (seated pose) and #2 (faller shadow) fixed in the held poses. #4, #6 and #8 fixed. #3 partly fixed; #5 and #7 partly fixed and downgraded to nit; #9 nits unchanged. New blocker N1: a see-through body and ghost hand in the middle of the sit-up and lie-back arcs (f587–588, f1796–1810). New should-fix N2 (grey neck block) and N3 (faller legs see-through). Repaint-needed.
