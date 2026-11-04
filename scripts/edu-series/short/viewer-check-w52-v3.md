# Viewer check (round 3): EDU-EP01-SHORT W5.2 picture draft after repaint round 2

- **Check:** [viewer check](../../../docs/sequence-workflow.md#viewer-check), third and final round, fresh Film invocation (Opus, medium), 2026-11-04. The checker did not paint the draft or either repaint. Stills were looked at cold first, then compared with round 2 ([viewer-check-w52-v2.md](viewer-check-w52-v2.md)) and the "W5.2 repaint round 2" notes in [build-notes.md](../build-notes.md).
- **Inputs:** `out/edu01/w52/` `arc_sit.png` (f584–612, every 2nd frame), `arc_lie.png` (f1752–1830, every 2nd frame), `fix2.png` (f142, f512, f542, f1796), G1, G2, G3, G45 (270 px tiles, rendered 22:56–22:58 after repaint round 2). Full-size crops made for this check (ffmpeg, scratch only) from `out/EDU-EP01-SHORT/stills/`: 594/596/598/600/602/611/615 (sit-up end), 1748/1752/1756/1776/1790/1800/1810/1820/1830/1858 (lie-back), 588/590/1778/1786/1790/1792 (mid-arc neck), 142, 512, 542, 1532. [User taste](../../../docs/user-taste.md) UT01–UT12.
- **Scope:** stills only. Captions, the "ภาพจำลอง" tag, the name card and sound are W5.3 overlays and are not in these stills.
- **Result:** **pass to the user's Draft review, with notes.** No blocker remains. N1 (ghost torso/hand) and N3 (see-through faller legs) are fixed. N2 (grey neck) is fixed in the held seated poses but still shows as a grey-lavender block through the middle of both arcs and under the chin in the B01-SH02 close-up. The remaining items are should-fix or nit. Under the viewer-check rule a shot goes back to the painter once and then goes to the user with the remaining findings in its row note; this is the third round, so put the items below in the row notes and let the user decide.

## Round-2 findings

| # | Round-2 finding | Status | Evidence (shot / frame) |
| --- | --- | --- | --- |
| N1 | blocker: see-through torso and blue ghost hand mid-arc | **fixed** | arc_sit f584–612 and arc_lie f1752–1830: the torso and arm are opaque in every sampled frame, the sheet band no longer shows through the body, and no hand sticks up through or above the blanket. In the lie-back the hand stays on the lap (f1752–1790) and then is under the blanket (f1792 on). f1796 in fix2 is clean. |
| N2 | should-fix: grey neck block (seated, mid-arc, B01-SH02) | **partly fixed** | Held seated poses (f600–717, f1748–1756): the neck now reads as skin under the hair; no grey-brown rectangle behind it. Mid-arc (f588, f590, f1778–1792): a wide grey-lavender translucent block still joins the chin to the collar, wider than the neck, so it reads as a thick neck or a scarf while the head tips back. The head no longer floats clear of the shoulder. B01-SH02 f126–159: the lavender-grey block with the white collar line still sits under the chin (listed below as the known B01-SH02 item). |
| N3 | should-fix: faller legs see-through | **fixed** | f512, f542 crops: the trousers are opaque; no orange or white streak runs through the legs. The darker paint mottling on the trousers remains (listed below). |
| N4 | nit: no bust/waist on the seated torso | unchanged | Seated frames f600–717, f1748. |
| N5 | nit: hugged pillow small and flat white | unchanged | f1532, f1580: it still reads as a white bib or towel at the chest more than the bed pillow. |
| N6 | nit: warm rose-mauve dim | unchanged | G3 f1080–1267. |
| 3 | should-fix: B01-SH02 eye up, profile head | unchanged (known) | f126–159. |
| 5, 9 | nits from round 1 and 2 | unchanged (known) | G1, G2, G45. |

## New problems from repaint round 2

| # | Severity | Shot / frames | Finding | Owner |
| --- | --- | --- | --- | --- |
| N7 | nit | B04-SH01 f598 → f600 (the end of the sit-up arc) | Pop between the arc and the held pose: at f598 the hand rests forward on the lap (the arc's lap target); at f600 the forearm is raised and the hand is on the chest (the held pose). It moves about 90 px in 2 frames. Inside the fast jolt it may read as a startled hand-to-chest gesture rather than a glitch; judge in motion. The lie-back has no matching pop: the B08 held pose (f1748) already has the hand on the lap, the same as the arc start (f1752). | Episode code (`set.ts` sleeper hand target: ease lap → chest over 4–6 f, or end the arc on the chest). |
| N8 | nit | B08-SH01 f1790 → f1792 | The hand goes from on top of the blanket to under it between two sampled frames (the rot 0.8 draw-order switch). At this size it reads as the hand slipping under the cover. Judge in motion. | Episode code. |

Checked and fine: the hand is on an arm and the arm starts at the shoulder in every sampled arc frame. The blanket covers the lap and legs in every arc frame and does not cut the torso. The lie-back starts from the same pose as the B08 held frame (f1748 = f1752–1756) with no jump. The head stays on the neck through both arcs (no floating head). The loop end f1858 matches the lying pose of f2 (same head, blanket fold band and pillow). G2: the faller is opaque and the rising streaks sit behind her; the head top at the bottom edge of B03-SH02 f488 still reads as her dropping out. G3 and G45: no change and nothing newly broken.

## Findings by severity and owner

| # | Severity | Shot / frames | Finding | Owner |
| --- | --- | --- | --- | --- |
| SH02 | should-fix | B01-SH02 f126–159 | Lavender-grey shoulder block with a white collar line under the chin; the profile eye looks up at the ceiling, not at the viewer; ear on the jaw line. The close-up is the first face of the episode, so it is the most visible remaining item. | Episode code (three-quarter lying head / drop the old shoulder panel in the close-up); Boss if built as a kit head. |
| N2 | should-fix | B04-SH01 f586–598; B08-SH01 f1776–1794 | Grey-lavender neck block mid-arc, wider than the neck. About 0.4 s in the fast sit-up and about 0.6 s in the slow lie-back before the loop seam. | Episode code (`set.ts`: draw the mid-arc neck in the same skin value and width as the held neck). |
| FT | nit | B03-SH03/04 f492–548 | Faller trouser mottling: darker blotches in the kit pyjama legs. Opaque now; reads as paint texture, slightly dirty. | Boss (kit pyjama legs). |
| N7, N8 | nit | f598→600; f1790→1792 | Hand pop at the end of the sit-up; hand slips under the blanket in one step. | Episode code. |
| N4, N5, N6 | nit | as listed | No bust/waist on the seated torso; small white hugged pillow; warm dim. | Boss (N4); episode code (N5, N6). |
| 5, 9 | nit | as in round 2 | Small cut-in f409→413; repeat wide, head tilt, drip signal, blank f1271, doctor coat/hands, faller hair not streaming. | as in round 2. |

## Could not judge from stills

- Whether the mid-arc neck block and the N7 hand pop register at speed (the sit-up is a jolt of about 15 frames; the lie-back is slow and ends at the loop seam).
- Whether the hand sliding under the blanket (N8) reads as a tuck or a vanish.
- The B03-SH05 jolt curve, overshoot, blanket bounce and the 3-frame flash.
- The B03-SH03 tumble, camera drop and streak speed; faller hair not lifting.
- Dissolves (B03-SH01 room to cloud, B05-SH06 melt), the B05 dim ramp over time, the B03-SH02 cut-in in motion.
- The loop seam f1859 → f0 in motion (stills f1858 and f2 match).
- Captions, tag, name card and their clearance; sound.

## Change log

- 2026-11-04 (Film, viewer check round 3): after repaint round 2. N1 and N3 fixed. N2 fixed in held poses, still present mid-arc (should-fix) and in the B01-SH02 close-up. New nits N7 (sit-up hand pop f598→600) and N8 (hand under blanket in one step f1790→1792). No blocker: pass to the user's Draft review with SH02, N2 and the nits in the row notes.
