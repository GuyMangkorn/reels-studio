# EP07 draft fix list, round 3 (user review of draft v3, 2026-11-08)

Source: user verdicts on EDU-EP07-ROWS-R1.2, draft v3. 15 shots ok, 3 change.

| ID | Shot | User note | Fix |
| --- | --- | --- | --- |
| G1 | S01-B03-SH02 | "ไม่ต้องมี effect ตอนชนกันก็ได้" (no effect needed at the collision) | Remove the merger flash/burst/spikes/shock ring at the collision. Keep the stars spiralling in; at contact just cut to the merged object or let them meet with no flash. Keep the round 2 star polish. Timing and shot length unchanged. |
| G2 | S01-B04-SH02 | "ปากไม่ขยับตอนพูด" (mouth does not move while speaking) | Mouth must animate during the spoken line(s) of this shot (use the kit's talk/mouth cycle keyed to the placed narration/dialogue window from the timed sheet). Check which speaker is on screen. |
| G3 | S01-B05-SH02 | "ท่อนแขนที่จับสากต้องอ้อมอีกทางนึงไหมนะ" (should the forearm holding the pestle wrap round the other way?) | Check the elbow/forearm bend direction of the pestle-holding arm; the forearm should bend the natural way for a pounding grip (elbow out/down, forearm up to the fist). Fix the IK bend side for this shot, keep the fist at the fixed grip point (round 2 behaviour must not regress). |

Rules: stills only, no video render, no commit. Measure fist-to-pestle drift again for B05-SH02, re-check loop seam PSNR (G1797 vs G0, was 36.81 dB). Run eslint on src/painted/edu07 and the relevant tests. Add "EP07 W5.3 fix round 3" to build-notes.md and a task.md sub-line. B05-SH02 is on its third fix pass (user raised this note himself/herself, so proceed) but say plainly if the arm cannot be solved.

## G3 staging (Film, 2026-11-08)

Cause (frame evidence `out/ep07-w53r3/draftcmp.png` = draft v3 G1650, `G3-detail.png`, wide `dbg-lout1.png`; `out/EDU-EP07-SHORT/stills/1650.png` is a later Boss still, not the draft): the bend is already right. In the close low camera (eye 0.70) the fist (`gripW`, z -0.36) projects in front of VEN's face (z -0.86), so her own head card, the pestle (layer 530-532) and the mortar wall (540) are painted over the forearm. By true depth the forearm next to the fist is in front of her head and the pestle, so this is a layer-order fix. A yaw nudge does not help: at az 22 the head and fist move left together (92 vs 110 px at 1080 w), and changing the side the pestle is on would change the set in every shot.

Fix (layer order only, gated to this shot):
1. `soi.ts` `SoiOpts.ven`: add `armFront?: boolean` (default false; doc: "redraw the pounding forearm over the head and pestle, by true depth (B05-SH02 close low camera)").
2. `soi.ts`, mortar/pestle block: when `out.ven && pounding && o.ven?.armFront`, paint after the pestle ink (532) and before the mortar front wall (540), on new layers 535/536. The forearm runs from elbow `E = 2*out.ven.lUpper - out.ven.lShoulder` (the kit IK elbow, derived; no kit change) to `fp = camPoint(c, gripW)`. Draw it as a tapered quad, 0.040*u at the elbow to 0.034*u at the wrist (`u = camUnit(c, VEN_AT)`), fill `handCol` (fill 535) with an `edgeC` rotring ink at 0.6 (ink 536). The wall at 540 then covers the part below the rim, and the fist at 550-554 covers the wrist joint.
3. `shots/S01-B05-SH02.tsx`: call `paintSoi(p, cam(L), {..., ven: {armFront: true}})`. Leave `cam`, `strokeK: 0.68`, the seam clock and every other shot as they are.
Acceptance: at G1618/1636/1650/1680, a bare forearm about 100-130 px long (1080 w) runs from the fist down to the right, over the hair and face edge, to the mortar rim or CUS's shoulder. Fist-to-pestle drift stays 0 px (`gripW` is not changed). Shot length (63 frames) and timing do not change. Loop seam G1797 vs G0 ≥ 36.8 dB (SH03 is not touched). The other pounding shots give byte-identical stills (the option defaults off).
