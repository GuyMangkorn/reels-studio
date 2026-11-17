# EDU-EP20-SS-R1 — written preflight (current through SS-R5)

Film,2026-11-16. Scope: written numbers and source inspection only, no new visual/runtime proof. Reproduction scratch/results under `out/edu20-timed-sheets-r1/`; authoritative shot values live in [scene-sheet.md](scene-sheet.md). No production code, audio or image changed.

## Checks

| Check | Result / limit |
| --- | --- |
| coverage | 11 contiguous half-open shots cover 0–1619 exactly (SS-R5; SS-R4 0–1590, SS-R3 0–1504) |
| narration | L01–L13 exactly once/order, original Thai board content unchanged |
| duration | SS-R5: narration R2 ceil(48.0736875*30 = 1442.210625)+176 = 1619 frames; 53.967 sec (SS-R4 E: ceil(1413.2)+176 = 1590; SS-R1..R3: +90 = 1504). Inside the 40–60 s channel target |
| projectionSamples | 33 |
| minimumCalculatedLeadPx | 745 |
| minimumCalculatedBalloonPx | 171 |
| contact | fixed hip/feet/seat/belt endpoint plan; rope0.855m constant acrossu0,+/-.20; runtime lean adapter stillmissing |
| revealOrder | forward355→air497 (animated explainer 520–704)→settled940→braking question1094→rear1274 (main balloon move 1274–1292)→return mechanism 1340 in accel recall (pack front 1356–1386, icon back 1388–1418, after the rear result)→last word 1438 / file end 1442.2→settle upright 1465–1585→black 1618 (SS-R5) |
| captionSafety | all planned subject bounds/anchor samples above their reserved bands, face centres>=140; final glyph strokes and supported-lean extremes require actual frames |
| approval | script/full E/look B explicit; user separately approved all11 unchanged board shots during this pass |
| semanticTiming | estimated; actual E PCM valleys measured, no new phoneme proof or human listening claimed |

## Actual E energy inspection

Loaded the approved47.107229 s PCM16 WAV directly with Python wave,48kHz; no decode rewrite or API call. Computed10ms RMS and located the lowest10ms bin within±150ms of each transformed R1 inter-line gap midpoint. These quiet regions inform picture cuts without cutting the continuous narration. Quiet energy does not identify a Thai word or certify phrase boundaries; event/caption semantics remain estimated. First active RMS0.17s and final low tail remain part of the untrimmed approved file.

| Boundary | R2 midpoint estimate s | Actual E quiet10ms bin s | RMS dBFS |
| --- | --- | --- | --- |
| L01→L02 | 2.412371 | 2.36 | -66.41 |
| L02→L03 | 6.340206 | 6.23 | -67.04 |
| L03→L04 | 11.587629 | 11.72 | -70.95 |
| L04→L05 | 13.78866 | 13.71 | -63.97 |
| L05→L06 | 16.407216 | 16.52 | -72.17 |
| L06→L07 | 21.221649 | 21.21 | -73.07 |
| L07→L08 | 23.603093 | 23.48 | -57.74 |
| L08→L09 | 28.329897 | 28.17 | -60.41 |
| L09→L10 | 33.185567 | 33.16 | -60.74 |
| L10→L11 | 36.345361 | 36.47 | -60.5 |
| L11→L12 | 42.371134 | 42.43 | -83.24 |
| L12→L13 | 44.412371 | 44.40 | -70.77 |

## Projection method and measured-vs-designed boundary

Invoked `python3 -I scripts/shot-projection.py <scratch-shot.json> --min-height480` for every shot at start/mid/end:33 calls. Converted YCam yaw to direction[sin(yaw),0,−cos(yaw)], verticalFOV=2atan(960/f), image shiftY=(hy−960)/1920, keeping one y-up metre baseline. The lead bounds come from the actual static B P31 silhouette capture, inverse-projected onto its z0 billboard; project these representative top/bottom anchors through each planned camera. Balloon bounds are the0.32m upright envelope; forward/rear centre constraints were also projected. No stand-in standing-height proxy was used.

These are **calculated anchor/card projections**. They reproduce the approved start look height within pixel rounding and check named point clearance, not complete future leaned silhouettes, occlusion, anatomy, dynamic belt contact or painted moving frames. Boss must supply supported lean in its owning rig and prove its extremes; a correct anchor estimate is not a rendered pass. Close passenger views intentionally place the upright balloon beyond the right edge; their otherwise large computed hero size is not a visibility claim. Low-tether insert has a raised camera move and its own caption reserve.

| Shot | Lead px start/mid/end | Face y start/mid/end | Lead bottom y start/mid/end | Upright balloon px start/mid/end | Anchor y start/mid/end |
| --- | --- | --- | --- | --- | --- |
| EDU-EP20-SHORT-S01-B01-SH01 | 745/767/793 | 216/196/174 | 850/849/849 | 171/175/180 | 807/801/795 |
| EDU-EP20-SHORT-S01-B01-SH02 | 868/895/925 | 180/191/203 | 919/953/990 | 200/206/210 | 870/900/932 |
| EDU-EP20-SHORT-S01-B01-SH03 | 1102/1106/1108 | 169/171/174 | 1106/1112/1117 | 252/254/255 | 1042/1048/1055 |
| EDU-EP20-SHORT-S01-B02-SH01 | 745/767/793 | 216/196/174 | 850/849/849 | 171/175/180 | 807/801/795 |
| EDU-EP20-SHORT-S01-B03-SH01 | 745/767/793 | 216/196/174 | 850/849/849 | 171/175/180 | 807/801/795 |
| EDU-EP20-SHORT-S01-B03-SH02 | 745/767/793 | 216/196/174 | 850/849/849 | 171/175/180 | 807/801/795 |
| EDU-EP20-SHORT-S01-B04-SH01 | 745/745/745 | 216/216/216 | 850/850/850 | 171/171/171 | 807/807/807 |
| EDU-EP20-SHORT-S01-B04-SH02 | 745/767/793 | 216/196/174 | 850/849/849 | 171/175/180 | 807/801/795 |
| EDU-EP20-SHORT-S01-B05-SH01 | 1102/1106/1108 | 169/171/174 | 1106/1112/1117 | 252/254/255 | 1042/1048/1055 |
| EDU-EP20-SHORT-S01-B05-SH02 | 745/767/793 | 216/196/174 | 850/849/849 | 171/175/180 | 807/801/795 |
| EDU-EP20-SHORT-S01-B05-SH03 | 793/793/745 (SS-R5: D to G1465, A from G1585; values reused from the D and A rows, mid-move not re-run) | 174/174/216 | 849/849/850 | 180/180/171 | 795/795/807 |

## State and reveal preflight

All hands stay on the lap; no carried prop and no hand-to-ring action. Pelvis[−.147,.391,0], floor contacts and seat cushion.343m are invariant. Belt seat/latch endpoints remain fixed while Boss must implement its torso-following route. Balloon neck usesA+[u,sqrt(.855²−u²),0]; bothu=+.20 and−.20 preserve the same rope length and remain buoyant above the same anchor. No physics response time is claimed.

B01 hides the directional answer in its passenger close view; first forward action begins355 after the question/guess, and before air explanation497. B04 uses explicit nonnumerical waiting ellipsis rather than an instant upright snap while forward scenery continues. B05 passenger-only view hides the balloon untilL12 cue1274; only after that result does reversed pressure return1344. No early braking preview, ground-frame reverse journey or unsafe challenge introduced.

## Source/runtime evidence

Inspected `src/painted/kit/car-cabin.ts`, `src/painted/edu20/cabin-look-data.ts`, `cabin-look.tsx`, `kit/ycam.ts`, `figure-at.ts`, `poses.ts` and `motions.ts`. Static cabin/balloon/restraint exist in the standalone look but animated contact-safe cabin adapter is absent: current passenger function hardcodes P31/neutral. Shared SceneRenderer imports PaintedStage and owns one-canvas integration; no EP20 production registry/timeline was found in src/videos or painted registry. Thus the sheet records integrated shared support separately from the new episode dependencies. No unimplemented field is presented as runtime JSON.

## Review/publication and verification scope

Review rows carrySS-R1 integer ranges andtimingEstimated:true while retaining exact old shot title/VO/seen/sound/flag fields, so timing alone does not change the storyboard content verdict hash. LOOK-R1 source/image unchanged. The published page is pending coordinator refresh; user separately approved all11 unchanged storyboard shots with “ผ่านทั้ง 11 ช็อต ใช้ต่อได้”, relayed by coordinator during this pass. Boss/Editor integration and assembled blockout are the next runtime/visual proof.

No test suite is needed for this written authoring pass. Meaningful checks are the contiguous coverage/text/constraint/reveal assertions,33 projections, actual PCM energy analysis, relative links/context-map and diff whitespace. No broad lint/typecheck rerun or unrelated baseline fixes.

## SS-R4 update — 2026-11-16

Film, written only. Total frames 1504→1590 after the Draft round 1 ending note; B05-SH03 is [1332,1590). New camera state A at the end equals the SS-R1 A projection (B04-SH01 row), so no new projection run was needed; the D→A move G1436–1556 interpolates between two measured cameras. Ending settle u(t) stays within [−0.20, +0.045] m, inside the rope/face-gap limits already measured for ±0.20 (brake face gap 44–48 px, Editor W5.3). Inset box grows to y860–1084, still above the y1100 caption reserve. No runtime, audio or image changed.

## SS-R5 update — 2026-11-16

Film, written only. Input: narration R2 `kore-full-selected-E-L13r2.wav` (SHA `b6f8490d…`, 2307537 samples, 48.073688 s) and VOICE-MEASURE-R3. L01–L12 audio is sample-identical to E up to 44.398 s, so B01–B05-SH02 ranges, cuts, captions and events stay valid; only B05-SH03 is re-anchored. Nothing rendered or viewed: this is a frame-number re-anchor and every value below is arithmetic on measured audio, so no picture evidence is claimed or needed until Editor's re-cut.

| Check | Result |
| --- | --- |
| containing frame | 2307537/48000×30 = 1442.210625 → ceil 1443; 1443+176 = **1619** f = 53.967 s; shift of every post-voice SS-R4 frame = 1443−1414 = **+29** |
| L12 / seam / L13 | L12 G1274–1331 (measured R3), seam G1332.0 (−68 dBFS frame, inside the L12→L13 quiet), L13 G1333.4–1437.9; B05-SH02 [1273,1332) still holds all of L12 and B05-SH03 starts before the first L13 sound |
| L13 word frames | 10 ms RMS of the R2 file, max per 30 fps frame: speech 1333–1350, dip 1351–1355 (−34…−47), speech 1356–1378, pause 1379–1385 (−40…−61, deepest 1384), กลับ 1386–1389, stop gap 1390–1393, speech 1394–1409, dip 1410 (−24), speech 1411–1419, dip 1419–1421, speech 1422–1437, tail −33…−76 at 1437–1442. Whisper (segment offset 42.3285 s) agrees within ±2 f for กลับ 1386, ด้านหลัง 1410, นั่นเอง 1421; its อากาศ onset (1350) is 6 f earlier than the energy onset (1356), and the energy value is used. Word assignment: เพราะคราวนี้ 1333–1350, อากาศด้านหน้า 1356–1378, กลับดันแรงกว่า 1386–1409, ด้านหลัง 1410–1420, นั่นเอง 1421–1438 |
| PX20-B order | card in 1340 > main balloon move end 1292 (no braking shown before L12's real motion); recall state until 1356; g<0 only after 1371; u_i starts 1388 after g settles 1386; out ends 1461 < settle 1465 |
| PX20-B speed | dot peak shift 324×0.25×0.90×1.5/30 = 3.645 px/frame (unchanged from SS-R4) |
| captions | L13a [1332,1384) switches in the deepest pause frame 1384, 2 f before กลับ 1386; L13b [1384,1529) holds 91 f (3.03 s) after the last word (SS-R4 86.8 f after its file end); same text and band y1100–1248, glyph check on Editor frames |
| END20 settle | t=G−1465: u(1483)=0.000, u(1501)=+0.0446 m (θ +2.99°), u(1537)=−0.0100, u(1573)=+0.0022, zero from 1585; forward bound ≤0.045 kept |
| sound | MUS20 off 1443; OUTRO 1445 (≥1443, 7.1 f after last energy), file end 1561, last attack 1551.2; END 1445+114.89 → **1560**, end 1618, −30 dB ≈1590; AMB20 fade 1579–1619 within its 1620 f file |
| fade | A_fade 1579–1619 (40 f), black at 1618; camera reaches A at 1585 (6 f into the fade, as SS-R4 1556 vs 1550) |
| locals | B05-SH03 L = G−1332: 1340→8, 1356→24, 1384→52, 1388→56, 1418→86, 1438→106, 1443→111, 1445→113, 1449→117, 1461→129, 1465→133, 1529→197, 1560→228, 1579→247, 1585→253, 1618→286; duration 287 |
| road strip | FD20-R5-02 last `ROAD_KEYS` key 1414→1443 (data, Editor); only G>1209 changes; speeds stay within 0.0006–0.0026, ceiling 1.5 px/frame unaffected |
| seek | Editor: backward-seek parity at 600, 1395 and 1501 (all values remain pure functions of G) |
