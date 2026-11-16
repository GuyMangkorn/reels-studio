# EDU-EP20-SHORT-S01 — timed cabin scene sheet

Deliverable: **EDU-EP20-SHORT** · Revision: **EDU-EP20-SS-R5** (re-anchor of B05-SH03 to the locked narration R2 / VOICE-MEASURE-R3: new L13 words, PX20-B, captions L13a/L13b, END20, sound; supersedes SS-R4, whose PX20/END20 design is kept) · Status: **ready-for-dev (written staging/blockout only)** · Timing: **estimated event semantics; actual audio duration and local quiet regions measured** (SS-R5: L12/L13 onsets/ends measured on R3; L13 word positions from 10 ms RMS valleys of the R2 file cross-checked with the R3 Whisper words, ±3 f, not phoneme-certified).

Inputs: [SCRIPT-R2](../../../scripts/edu-series/ep20/short/script.md) (L13 only changed; user-chosen 2026-11-16), matching [FACT-R2](../../../scripts/edu-series/ep20/short/fact-check.md#fact-r2--changed-claim-recheck-l13-only) (L13 supported; L01–L12 keep FACT-R1), [HOOK-R1](../../../scripts/edu-series/ep20/hook-guide.md), locked [VB-R3](visual-brief.md) / LOOK-R1, [VOICE-MEASURE-R3](../../../scripts/edu-series/ep20/short/voice-measure.md#voice-measure-r3-narration-r2-locked-e--new-l13-editor-16-nov-2026) (narration R2, SS-R4 total rule), [delivery](../../../scripts/edu-series/ep20/delivery.md).

Target: branch `GuyMangkorn/ep20-helium-continuation`, HEAD `c420a2cf7d96f5aa7a3a63c5c744a7dc7c75603b` plus EP20 working changes; **30 fps, 1619 frames (53.967 s), 1080×1920** (SS-R5; SS-R4 was 1590, SS-R3 1504), composition offset0. Frame ranges are half-open.

Evidence: narration R2 `kore-full-selected-E-L13r2.wav` 48.073688 s (L01–L12 sample-identical to the approved E; L13 from the user-picked sample B; full file, seam and L13 pronunciation not yet listened) and user-locked first-shot B look; [written preflight](timing-preflight.md). User approved all11 unchanged storyboard shots with “ผ่านทั้ง 11 ช็อต ใช้ต่อได้”, relayed by coordinator during this pass. No new rendered shots, motion/seek proof or exact-word certification. Review page: **pending coordinator publication**.

## Shared scene contract

### Clock and audio ownership

Composition-global frame G equals scene-local frame S because S01 starts at0. In each shot, local frame L=G−shot start. Narration is one uncut file atG0; do not split the performance at picture cuts. **SS-R5:** Editor references narration R2, store `projects/edu/EDU/narration/edu-ep20-r2/kore-full-selected-E-L13r2.wav`, SHA256 `b6f8490d2af1ea5975ba612dc35cae308719a8296e1126189d441cdc5ce11d68`, 48 kHz mono, 2307537 samples = 48.073688 s. It equals the approved E (`edu-ep20-r1/kore-full-selected-E-slower3.wav`, `ebfe0bd3…`) up to 44.398 s (G1331.9) and carries the new L13 after the seam at 44.401 s (G1332.0). Measured on R3: L12 G1274–1331, L13 G1333–1438 (last energy 47.9286 s = G1437.9), file end **G1442.21**. By the SS-R4 rule (total = ceil(file end) + 176) the speech is contained in **1443** frames and the picture-only ending is **176 frames, G1443–1618**, so the composition ends at **1619 frames = 53.967 s** (SS-R4: 1414 + 176 = 1590). Film keeps the rule rather than the old 1590 total: at 1590 only 147.8 f would remain after the file end and the user's “ending too abrupt” fix would shrink by 0.97 s. No narration is added, moved or padded. Every SS-R4 frame from G1414 on moves by exactly **+29 f** (1443 − 1414); PX20-B keyframes are re-synced to the new L13 words instead (below).

Picture cuts use measured quiet10ms neighborhoods in the actual E PCM; those energy valleys do not prove exact phrase/phoneme boundaries. R2 semantic anchors remain transformed R1 estimates (~±0.103–0.206 s plus local tempo-mapping uncertainty). All caption clause windows and reveal events below are editorial estimates for blockout. Editor checks the actual audible word at each early/late result and may shift values within the documented neighboring quiet/hold windows once, preserving reveal order and total audio. Film does not claim `checked-with-audio` semantic timing merely from PCM analysis.

### Baseline, contact and transforms

Canonical physical baseline and palette belong to [VB-R3 VD20-03/04/05](visual-brief.md). W20 metres, origin passenger floor/root[0,0,0], +x front/right, +y up, +z near camera. Groundy0; passenger standing reference1.76 m/four heads; P31 seated hip[−0.147,0.391,0], cushiontop0.343 m. Hands stay on lap in every shot, never hold a prop. Feet remain on the floor, hip remains on support; lean acts above the hip rather than translating the whole seated card.

**Balloon constraint:** fixed anchorA=[0.62,0.10,0.05]; neckN=[0.62+u,0.10+sqrt(0.855²−u²),0.05]; centre=N+0.195·(N−A)/0.855 (SS-R2 FD20-W53-03: the envelope continues the string line, tilted about N by θ=asin(u/0.855)), radius0.16 m. Thus upright centre[0.62,1.15,0.05], rope length0.855 m; u=+0.20 gives θ=13.53°, N=[0.82,0.9313,0.05], centre[0.8656,1.1209,0.05]; u=+0.14 θ=9.42°, centre[0.7919,1.1358,0.05]; u=±0.25 θ=17.0°; u=−0.20 mirrors in x. At u=0 the result is identical to LF20-CABIN-B. These are illustration choices, not measured physical angles, acceleration or settling times. Render one continuous stringA→N and the same ring. Never independently animate the envelope and neck or create/drop another tether.

**Casting:** `man-crop + hoodie, P31, neutral / right` is the common seated base. Surprise uses the same face controls; rear/forward-supported torso acting is `new: P31 restrained upper-torso lean with fixed hip/feet` (Boss dependency), not a different body/pose identity or an asserted existing preset. Use screen-right facing squared to mid-shot lens, modest gaze/head acting; no orbit/view flip. Belt upper seat anchor[−0.247,1.04,0.07], latch[−0.037,0.461,0.07], lap[−0.257,0.416,0.07] remain attached. Boss supplies a torso-following intermediate shoulder/strap path, with belt in front of clothing and no cut-through. SS-R2 FD20-W53-02: the visible shoulder strap starts at the torso-carried shoulder point `torsoPoint(upper, lean)`, not at the fixed upper anchor; the webbing between the fixed seat anchor and that point is hidden behind the shoulder/seat back and never drawn across the neck.

YCam owns world-to-picture projection for all cabin/cast/string/contact geometry. Camera lines below are design values using the inspected YCam x/y/z/yaw/f/hy fields, radians/metres/px. Interpolate spatial camera values with smoothstep3v²−2v³; no whole-picture CSS zoom. Painting order: far closed pane/scenery→cabin/seat→supported passenger→belt→balloon/string/ring→near door/frame; symbolic SVG inset, labels and captions are screen space above the one painted canvas. No world-derived label gets a second scale owner.

Exterior is a low-contrast repeated straight-road strip behind closed glass, rearward offset−x throughout. Its exact displacement is decorative, not a measured speed (SS-R3 FD20-W53-04, `ROAD_KEYS` in `src/painted/edu20/cabin-look-data.ts`, smoothstep between keys, offset = closed-form integral `roadStripAt(G, ROAD_KEYS)`): 0.0008 m/frame untilG187 (gentle roll, camera A 0.31 px/frame = 9.4 px/s); ease to0.0026 byG352 (acceleration, 3.25×; A 1.02 px/frame = 30.6 px/s, CLOSE 1.41 px/frame = 42.4 px/s); hold throughG1209 (steady: scenery visibly keeps flowing while the balloon stands upright); ease to0.0006 by**G1443** (braking, 4.3× down; A 7.1 px/s; SS-R5 FD20-R5-02 moves this last key from G1414 so the car keeps slowing through the last word of L13 and stops slowing before the END20 settle) and hold thereafter, never below `ROAD_SPEED_FULL` 0.0004 so the strip never fades. Ceiling: no mark moves more than 1.5 px/frame on any SS-R2 camera (largest measured 1.42 px on CLOSE end); strip rows stay ≥451 px above the y860 band and ≥691 px above y1140. The scroll shows only the car's speed change, which the narration already names (acceleration in B01-SH03, slowing in B05-SH01); the balloon direction stays the only answer and remains behind its gates. A change in offset rate never reverses sign or moves the cabin itself. Boss/Editor implement seamless wrap without flicker; no driver or challenge invitation.

### Captions, pressure inset and sound ownership

Caption text below is verbatim approved Thai apart from visual chunk boundaries; ranges are composition-global and every line appears once. Use channel-default outlined white Noto Sans Thai700, no added shade. Ink/stroke must remain x120–888 and inside each shot's reserved band. Production mark goes x120, glyphtop~135; ภาพจำลอง is also kept inside text-safe area. These production label positions supersede the standalone look-spike's internal preview chrome, without repainting the locked scene look. No extra dialogue, vocal reaction or CTA is authorized.

Pressure explainer, when called for (**SS-R4 PX20**, replaces the SS-R1..R3 static card after the user Draft note “the explanation shows only a still picture, no visual animation”): fixed-plane screen-space box **x120–888, y860–1084** (768×224; was 768×200), header ภาพอธิบาย, captions then use y1100–1248. Inside it a simplified side section of the cabin animates the mechanism in sync with the VO: air dots that jitter in place and **pack** toward the higher-pressure side, a pressure tint and wall bar on that side, two small push arrows on the balloon icon whose lengths follow the two sides, and a resultant arrow; the inset balloon tilts with the same tether angle as the main picture's u. Only the already approved Thai strings appear (ภาพอธิบาย, ท้ายรถ, หน้ารถ, แรงดันมากกว่า, แรงดันน้อยกว่า); no numbers or counts. What stays forbidden (DEP20-04 risk, still valid): no streaming wind (dots never travel through and out of the cabin; the whole cloud shifts at most 36 px in accel and then stops), no empty front/vacuum (the low side keeps 0.69× the mean density, never 0), no measured gradient (the density contrast is a deliberately exaggerated illustration under the ภาพอธิบาย header and the frame-level ภาพจำลอง tag), no particle wall. Reversal graphics still appear only after the L12 result (main balloon u 0→−0.20 at G1274–1292; the brake inset opens at G1340 in its accel recall state and flips from G1356). Full numeric contract: [PX20](#ss-r4-px20). Parent owns exact runtime adapter; these are authoring values, not new timeline fields.

Sound design remains [VB-R3 VD20-06](visual-brief.md). Ton owns generated/fitting-library sounds and exact cue sheet, Editor owns playback/ducking/mix/stems. AMB20 is one continuous low enclosed-car/road texture with soft even engine support, no driving aggression; MUS20 is sparse warm muted mallet/plucked wood around94BPM. Both NEEDS-GEN unless Ton proves an exact library fit. SS-R4 added MUS20-OUTRO (ending melody in the MUS20 family) and SFX20-END as its cadence; SS-R5 places them at **G1445** and **G1560** (OUTRO onset + 6 beats at 94 BPM = 115 f); see B05-SH03 Sound. Per-shot Sound entries define continuous states and new cue onsets; do not restart beds per shot or add unbriefed cut whooshes. Narration leads at all times; no generated accent replaces the voice.

<a id="ss-r4-px20"></a>
### SS-R4 PX20 — animated pressure explainer (B03-SH01 accel, B05-SH03 brake)

Story job: the viewer has just seen the balloon go forward (B02) or back (B05-SH02) and asks "what pushed it?". The inset replays the cause as a small moving model, word by word: the car speeds up → the air in the cabin packs toward the rear → the rear side pushes harder → the floating balloon is pushed forward. At B05-SH03 the same model flips: the air packs toward the front, the front pushes harder, the balloon tips back. Mood: calm, clear, a little "aha", not a lab simulation. It is screen-space SVG over the one painted canvas (VD20-05), Editor-authored in the episode overlay (`src/videos/edu-ep20/chrome.tsx` today); no Boss kit change is needed unless Editor wants the particle field reusable.

**Space and units.** Box-local px, origin = box top-left at composition (120,860), +x right = toward หน้ารถ (front), +y down; composition px = box px + (120,860). Every value is a pure function of the composition frame G (seek-safe, no state, no random at runtime); `ss(a,b,G)` = smoothstep 3v²−2v³ of v=clamp((G−a)/(b−a)).

**Static layout (box px).**

| Element | Value |
| --- | --- |
| Card | rect (1.5,1.5) 765×221 rx16, fill CARD #f1e9d9 α0.94, stroke INK #26313b 3px (as draft, 24 px taller) |
| Header | ภาพอธิบาย at (20,34), 22px, LOW #6b7780 (unchanged) |
| Side labels | left column start x20: ท้ายรถ (y100, 28px, INK) above its pressure label (y142, 25px); right column end x748: หน้ารถ / pressure label, same sizes. Pressure label text and colour per state: high side แรงดันมากกว่า HIGH #a8452f, low side แรงดันน้อยกว่า LOW |
| Cabin section | path `M214 196 L214 84 Q218 60 250 56 L470 50 Q512 50 540 80 L554 112 L554 196 Z`, INK 3px, no fill; floor line y196. Rear wall x214 = ท้ายรถ (left), windshield/front x554 = หน้ารถ (right) |
| Wheels | two circles r11 at (268,207) and (500,207), INK 3px, one spoke each; spoke angle = φ(G) (below) |
| Air region | x∈[222,546], y∈[66,188]; exclude the windshield wedge x>500 ∧ y<104 |
| Air dots | 42 home points: 7 columns × 6 rows on x232..536 (step 50.67), y72..184 (step 22.4), each jittered by a seeded hash (seed 20520+i) ±10px x, ±6px y; drop any home point in the wedge (expect 40±2 dots). Dot r4.5, INK α0.7 |
| Balloon icon | ring (384,190) r5 INK 2.5; rope 62px ring→neck; neck N = ring + 62·(sinθ, −cosθ); envelope ellipse rx19 ry23 centred at N + 23·(sinθ, −cosθ), rotated θ; fill #db7566 stroke #9e4e4a 2.5 (draft colours). θ = asin(u_i/0.855), the same tether angle function as the main balloon |
| Draw order | card → pressure tint → dots → cabin path → wheels → wall bars → rope/ring/envelope → push arrows → resultant arrow → labels |

**Animated fields.**

- Signed packing g(G) ∈ [−0.45,+0.45]; + = packed toward the rear (accel), − = toward the front (brake). Dot x = 222 + 324·s′, where s = (x_home−222)/324 and **s′ = s − g·s·(1−s)** (walls fixed, order preserved). Local density ratio rear:front = (1+g)/(1−g) = 2.6 at |g|=0.45; the sparse side keeps 1/(1+0.45) = 0.69× the mean. Max collective shift 0.1125·324 = 36px at |g| 0→0.45.
- Thermal jitter, always on (so the card never freezes): dot i adds (3·sin(2πG/P_i+φ_i), 2·cos(2πG/Q_i+ψ_i)) px with P_i,Q_i ∈ 36..60 frames and phases from the same seeded hash; clamp to the air region minus r.
- Pressure tint: linear gradient across the air region in HIGH, α = 0.16·|g|/0.45 at the high-side wall, 0 at the other wall.
- Wall bars: high side x218 (rear) or x550 (front), y86–188, HIGH 8px round cap, opacity |g|/0.45; low side the draft's dashed LOW 3px line.
- Push arrows (INK 4px, 10px head) pointing at the envelope centre C from each side, along y=C_y: rear arrow from (C_x−24−L_r) to (C_x−24), front arrow from (C_x+24+L_f) to (C_x+24); **L_r = 30·(1+g), L_f = 30·(1−g)** px (16.5–43.5).
- Resultant arrow (HIGH 7px, 14px head) above the roof at y30, tail at x=C_x, head at C_x + 84·r·sign, r ∈ [0,1], sign = +1 front / −1 rear.
- Wheel spin ω(G) in degrees/frame, φ = Σω (closed form of the smoothstep ramps).
- Inset balloon u_i(G) in metres, θ = asin(u_i/0.855): u_i=+0.20 → θ +13.53° (envelope centre +20px x), matching the main balloon's held u in B03-SH01; u_i=−0.20 matches B05-SH03.

**PX20-A keyframes, B03-SH01 (G clock; VO anchors are Editor's audible caption boundaries in `src/videos/edu-ep20/cues.ts`).**

| G | Shot-local L | VO word (caption cue) | Inset state |
| --- | --- | --- | --- |
| 520–528 | 24–32 | อากาศในรถไง (L06a 496–539) | Card fades in 8 f (SFX20-TICK G520 unchanged). g=0 (even dots, jittering), u_i=0 upright, no tint, no bars, no push arrows, r=0; ท้ายรถ / หน้ารถ visible, pressure labels hidden; ω=4°/f |
| 539–590 | 43–94 | ตอนรถเร่ง (L06b 539–567) | ω eases 4→13°/f over 539–567; **g = 0.45·ss(541,590)**: the dot cloud slides and packs rearward (peak 1.1 px/frame) |
| 567–583 | 71–87 | แรงดันอากาศด้านหลัง (L06c 567–594) | Rear tint/bar follow g; แรงดันมากกว่า fades in at left 567–575; rear push arrow grows 0→L_r over 571–583 |
| 594–610 | 98–114 | จะมากกว่าด้านหน้า (L06d 594–637) | แรงดันน้อยกว่า fades in at right 594–602; front push arrow grows 0→L_f over 598–610 (visibly shorter than rear: 43.5 vs 16.5px) |
| 641–671 | 145–175 | มันเลยดันลูกโป่งที่ลอยได้ (L07a 637–684) | **u_i = 0.20·ss(641,671)** (balloon icon tips toward หน้ารถ, θ 0→13.53°); **r = ss(645,665)** (resultant arrow grows to 84px, pointing front) |
| 684–692 | 188–196 | ไปทางหน้ารถ (L07b 684–704) | Hold the full state; dots keep jittering |
| 692–704 | 196–208 | — | Card fades out 12 f (unchanged), so B03-SH02 enters without it |

**PX20-B keyframes, B05-SH03 (brake mirror; SS-R5 re-synced to the narration R2 L13 words).**

Measured L13 word positions (G, narration R2 at G0; 10 ms RMS valleys of the R2 file cross-checked with the R3 Whisper character times offset by the 42.3285 s ASR segment start; ±3 f; not phoneme-certified): **เพราะคราวนี้ 1333–1350** · dip 1351–1355 · **อากาศด้านหน้า 1356–1378** · phrase pause 1379–1385 (−40…−61 dBFS) · **กลับดันแรงกว่า 1386–1409** · **ด้านหลัง 1410–1420** · **นั่นเอง 1421–1438** (last energy G1437.9; file end G1442.2). The SS-R4 table followed R1 E estimates and is superseded.

| G | Shot-local L | VO word (caption) | Inset state |
| --- | --- | --- | --- |
| 1340–1348 | 8–16 | เพราะคราวนี้ (1333–1350; L13a 1332–1384) | Card fades in 8 f (no tick). **Recall state = PX20-A end frame**: g=+0.45, u_i=+0.20, r=1 forward, rear labelled แรงดันมากกว่า, ω=13°/f. The viewer recognises the card before it flips. Opens 48 f after the main balloon has finished its real L12 move (G1274–1292) and shows nothing of braking yet |
| 1356–1386 | 24–54 | อากาศด้านหน้า (1356–1378) | **g = 0.45 − 0.90·ss(1356,1386)** (+0.45→−0.45: the cloud migrates and packs toward หน้ารถ while the voice names the front air, peak 3.65 px/frame, then stops at the กลับ onset); tint/bars and push-arrow lengths follow g; ω eases 13→3°/f over 1356–1396 (the car slowing) |
| 1388–1400 | 56–68 | กลับดันแรงกว่า (1386–1409; L13b from 1384) | Pressure labels cross-fade: left แรงดันมากกว่า→แรงดันน้อยกว่า (HIGH→LOW), right the opposite, on “ดันแรงกว่า” |
| 1388–1418 | 56–86 | กลับดันแรงกว่า → ด้านหลัง (1410–1420) | **u_i = 0.20 − 0.40·ss(1388,1418)** (the icon tips toward ท้ายรถ after the front air has packed: cause before effect, 2 f after g settles); resultant r = 1−ss(1388,1398), then sign −1 and r = ss(1402,1418) (arrow shrinks, flips, regrows toward ท้ายรถ, full length as “ด้านหลัง” ends) |
| 1418–1449 | 86–117 | นั่นเอง (1421–1438) | Hold the brake state; jitter continues through the last word and 11 f after it |
| 1449–1461 | 117–129 | — | Card fades out 12 f, ending 4 f before the END20 settle starts at G1465 (the inset must never show front-high pressure while the main balloon is returning upright) |

**Acceptance (Editor frames, Film review).** qa-sheet at 270 px of G520, 555, 590, 610, 660, 690 and (SS-R5) G1348, 1371, 1400, 1440 plus a 1 s GIF/strip of 539–590 and 1356–1386: dots visibly move between neighbouring stills; rear-packed vs front-packed reads at 270 px without the labels; no dot leaves the air region; low side never empty; inset θ at G690 equals main balloon θ within 1°; card bottom ≤ y1084 and caption ink inside y1100–1248 (`scripts/caption-zone.py`); backward seek of 600 and 1395 (SS-R5; was 1380) byte-identical to forward; no brake-state inset frame (g<0, front-high label or u_i<0) before G1356. No new Thai string.

<a id="ss-r4-end20"></a>
### SS-R4 END20 — extended settle ending (B05-SH03; SS-R5 re-anchored to G1443–1618)

<a id="ss-r5-end20"></a>Story job: after the last word the viewer has the whole rule; the picture now breathes out. Braking is over (SS-R5: the road strip reaches its slow 0.0006 m/frame at G1443 per `ROAD_KEYS`, FD20-R5-02, i.e. the car stops slowing as the voice ends), so by the B04 rule (C82-F005: no acceleration → upright) the balloon swings gently back to upright and the passenger sits back, the camera eases back to the opening comparison view, a short warm melody plays and the picture fades. It closes on the same state as the approved LF20-CABIN-B look (u 0, lean 0, camera A), which also makes a later `_B_loop` seam soft without leaking the braking answer into the opening question.

SS-R5: every SS-R4 END20 frame moves by +29 f (ceil(file end) 1414 → 1443); shapes, durations and amplitudes are unchanged. Shot-local L = G − 1332.

| G | Shot-local L | Picture | Sound |
| --- | --- | --- | --- |
| 1438 | 106 | Last word นั่นเอง ends (last energy G1437.9) | — |
| 1443 | 111 | Speech contained (R2 file end G1442.2). State held: u=−0.20, lean +0.07, camera D, inset still up (brake state) | MUS20 bed release ends: −6 dB at G1409 → off at G1443 (SS-R4 1380→1414 + 29) |
| 1445 | 113 | — | **MUS20-OUTRO** first note (see Sound), 7 f after the last word's energy and 2.8 f after the file end |
| 1449–1461 | 117–129 | Inset fades out (PX20-B) | — |
| 1465–1495 | 133–163 | Passenger lean +0.07→0 by ss(1465,1495), fixed hip/feet/belt (existing lean adapter); expression surprised→neutral, switch at G1475 (or ease 1465–1485 if the face controls interpolate). Starts 27 f after the last word | — |
| 1465–1585 | 133–253 | **Balloon settle**: t=G−1465, **u(t) = −0.20·e^(−t/24)·cos(2πt/72)·(1−ss(1561,1585))**, u=0 from G1585. Crosses 0 at G1483, small forward overshoot +0.045 m (θ +3.0°) at G1501, −0.010 m at G1537, ≈0 (+0.002) by G1573. Same tether constraint, rope 0.855 m, no second string | No swing/creak SFX (silence policy) |
| 1465–1585 | 133–253 | **Camera D→A**: [0.46,0.975,2.3655] yaw0.03 → [0.46,1.04,2.49] yaw−0.022, f1300, hy305, pitch0/cx0, ss(1465,1585); hold A to the end | — |
| 1384–1529 | 52–197 | Caption L13b กลับดันแรงกว่าด้านหลังนั่นเอง holds until G1529, 6 f fade-out G1523–1529 (91 f ≈ 3.0 s after the last word; SS-R4 held 2.9 s after the file end) where the runtime supports it, else hard off at G1529; then no caption | — |
| 1560 | 228 | — | **SFX20-END** (same file) lands as the cadence of the melody: OUTRO onset 1445 + 6 beats at 94 BPM (6 × 19.149 = 114.9 f → 115) |
| 1579–1619 | 247–287 | **A_fade** to black over the last 40 frames (`endFadeSec` 40/30); ภาพจำลอง tag and @TamMaiLa fade with the picture | AMB20 fade G1579–1619 (SS-R4 1550–1590); END −30 dB ≈G1590 (100 ms RMS), audible tail ≈G1604, file end G1618 |

Acceptance: qa-sheet 270 px of G1443, 1469, 1483, 1501, 1537, 1585, 1604, 1618: balloon reaches upright with one small forward swing, never a forward lean that could read as a new answer (|u| ≤ 0.045 forward); passenger back to rest; camera at A matches B04-SH01's held framing (lead ≈745 px); no inset after G1461; picture black at G1618. Audio: voice never overlapped by OUTRO/END (first OUTRO onset G1445 ≥ G1443); mix-levels pass on the tail; seek parity at 1501.

### Runtime seams / implementation handoff

| Element / consumers | Inspected owner / status at target checkout | Required implementation and proof |
| --- | --- | --- |
| Painted runtime/yaw projection, all shots | `src/scenes/SceneRenderer.tsx`, `src/painted/PaintedStage.tsx`, `src/painted/registry.ts`, `src/painted/kit/ycam.ts`: existing-integrated in shared runtime/other episodes | Editor registers EP20 through its own video entry and shot modules; no Root edit. Other-episode integration is not EP20 proof. |
| Cabin/static restraint/helium, all | `src/painted/kit/car-cabin.ts` with `src/painted/edu20/cabin-look-data.ts` and standalone look composition: exists-unintegrated for EP20 production; LOOK-R1 static proof only | Boss hardens existing owner; keep approved B appearance, fixed rope and contacts through extremes; do not duplicate cabin in scenes. |
| Supported leaning passenger and belt following, SH03/04/05/06/07/09/10/11 | P31 and generic lean fields exist in kit, but `paintCabinPassenger` currently hardcodes P31/neutral and has no safe animated contact adapter: missing as cabin capability | Boss supplies fixed-hip/feet torso lean and shoulder-following belt; proof at entry/key/exit and backward seek, no dislocated hands/feet or stretched torso. |
| Scenery movement / ellipsis dissolve | Static scenery exists; EP20 frame-driven scenery and single-canvas state interpolation/dissolve unverified/missing | Boss owns any reusable set parameters; Editor supplies G/local clocks, no second canvas. Prove wrap and no double solid balloon in ellipsis. DF-20261029-painted-timeline-dissolve applies. |
| Pressure inset / captions / episode timeline | Generic SVG/Label/caption support existing-integrated; EP20 static inset, registry and timeline existing-integrated at Draft v1 (`src/videos/edu-ep20/chrome.tsx`, `cues.ts`, `index.ts`); **SS-R4 animated PX20 missing** | Editor rewrites the episode inset as the frame-driven PX20 model (pure function of G, seeded home points, no runtime random) from supported SVG primitives and moves INSET_BRAKE to G1340–1461 (SS-R5; SS-R4 1340–1432). Boss owns a reusable particle/pressure component only if Editor asks for one. No invented JSON fields. |
| Sound cues | NEEDS-GEN / no cue sheet yet | Ton reads all11 Sound entries and returns brief-matching files/levels/cue sheet; Editor places exactly those cues. |

Existing look evidence: LF20-CABIN-B independent pass plus user “ใช้ลุค B นี้ต่อ”; still measurements in [look QA](../../../scripts/edu-series/ep20/cabin-thumbnails-qa.md). This freezes the selected appearance, not absent animation capabilities. Findings DF-20261030-painted-straight-bars, DF-20261030-painted-glass-sheen-veil and DF-20261031-paint-seed-defer retain their scoped application: hard enclosure edges, edge-only sheen, context brush/per-element seeds. No new camera/render benchmark is imported.

## Shot map

| Stable shot | Beat / lines / claims | S=G range | Planned runtime mapping |
| --- | --- | --- | --- |
| EDU-EP20-SHORT-S01-B01-SH01 | L01; C82-F001/F006 | [0,71) | planned one shot module + one scene entry, not integrated |
| EDU-EP20-SHORT-S01-B01-SH02 | L02; C82-F001/F006 | [71,187) | planned one shot module + one scene entry, not integrated |
| EDU-EP20-SHORT-S01-B01-SH03 | L03; C82-F001/F006 | [187,352) | planned one shot module + one scene entry, not integrated |
| EDU-EP20-SHORT-S01-B02-SH01 | L04,L05; C82-F001/F003 | [352,496) | planned one shot module + one scene entry, not integrated |
| EDU-EP20-SHORT-S01-B03-SH01 | L06,L07; C82-F002 | [496,704) | planned one shot module + one scene entry, not integrated |
| EDU-EP20-SHORT-S01-B03-SH02 | L08; C82-F002 | [704,845) | planned one shot module + one scene entry, not integrated |
| EDU-EP20-SHORT-S01-B04-SH01 | L09; C82-F005 | [845,995) | planned one shot module + one scene entry, not integrated |
| EDU-EP20-SHORT-S01-B04-SH02 | L10; C82-F005 | [995,1094) | planned one shot module + one scene entry, not integrated |
| EDU-EP20-SHORT-S01-B05-SH01 | L11; C82-F004/F002 | [1094,1273) | planned one shot module + one scene entry, not integrated |
| EDU-EP20-SHORT-S01-B05-SH02 | L12; C82-F004/F002 | [1273,1332) | planned one shot module + one scene entry, not integrated |
| EDU-EP20-SHORT-S01-B05-SH03 | L13; C82-F004/F002/F005 (settle) | [1332,1619) (SS-R5; SS-R4 [1332,1590), SS-R3 [1332,1504)) | planned one shot module + one scene entry, not integrated |

## EDU-EP20-SHORT-S01-B01-SH01 — คุณว่ามันจะไปทางไหน?

Range and clocks: **S/G[0,71)**, localL[0,71); G=L+0. Composition offset0. Duration71frames (2.367s).

Direction: Invite the first prediction. The passenger and genuinely buoyant object share the closed cabin; neither a forward balloon result nor a pressure explanation is available. Approved board direction remains verbatim in the review rows; this block supplies its numeric implementation detail. Balloon and ring remain above the reserved band; passenger remains picture-left.

Staging: Casting `man-crop + hoodie, P31, neutral / right`; local0–70: balloon u=0; passenger P31 neutral, hands on lap. Eyes shift from forward to balloon during local12–24; no body/prop translation. Entry/exit upright and unforced. supported upper-torso variant as needed, same person and costume. Pelvis, feet, lap hands, seat and ring use the shared contact constraints throughout; entry/exit do not attach or drop a prop.

**Camera:** start [0.46,1.04,2.49]m; yaw-0.022rad, f1300px, hy305px, pitch0/cx0; end [0.46,0.975,2.3655]m; yaw0.03rad, f1300px, hy305px, pitch0/cx0. Interpolate start→end over local0–70; no extra picture push.  One YCam projects world elements; the planned foreground frame stays world geometry, never a 2D scale hack.

**Projection preflight:** Calculated start/mid/end seated lead 745/767/793px; face centrey216/196/174; leadbottomy850/849/849. Upright envelope171/175/180px, anchory807/801/795. Caption reserve x120–888,y860–1248. This is anchor/card calculation through shot-projection.py, not a new painted-frame or animated anatomy validation. Body/balloon keep identity scale; actual supported-lean extremes remain Boss/Editor frame checks.

**VO source:** [SCRIPT-R1 L01](../../../scripts/edu-series/ep20/short/script.md). Continuous E audio, no per-shot performance replacement. No extra narration at a cut.

**Subtitles — estimated display windows, G clock:**

| Range | Exact Thai text |
| --- | --- |
| [0,21) | รถเร่ง... |
| [21,71) | ลูกโป่งจะเอนไปทางไหน? |

**Sound:** local0: AMB20 cabin bed and MUS20 sparse warm wood/mallet pulse begin under the question. No sting or extra voice. Mix intent: hold curiosity, narration leads.

**Cut and continuity:** Opening has no lead-in/logo; the hook caption is visible atG0. Exit cuts to the same ring/neck assembly at the measured quiet neighborhood. Carry the documented exit state into the next block; do not reset physical state merely because the camera changes.

**Acceptance / owner proof:** No direction readable before the result gate; closed glass/one low tether read immediately. Boss proves support/string/belt and camera extremes in the owning modules; Editor proves selected-output captions, continuity, audio word placement and random/backward seek. Film reviews the assembled blockout against this revision before polish. No shot pass is inferred from the look lock.

## EDU-EP20-SHORT-S01-B01-SH02 — ลูกโป่งลอยได้ แต่ผูกไว้ต่ำ

Range and clocks: **S/G[71,187)**, localL[0,116); G=L+71. Composition offset0. Duration116frames (3.867s).

Direction: Prove the scoped object and its continuous low tether. Closed glass remains visible. No hand approaches the balloon or ring. Approved board direction remains verbatim in the review rows; this block supplies its numeric implementation detail. Balloon and ring remain above the reserved band; passenger remains picture-left.

Staging: Casting `man-crop + hoodie, P31, neutral / right`; local0–115: upright u=0. Camera rises along the same continuous neck/string/ring chain, with no detach, grab or release. Passenger remains seated outside the insert emphasis. supported upper-torso variant as needed, same person and costume. Pelvis, feet, lap hands, seat and ring use the shared contact constraints throughout; entry/exit do not attach or drop a prop.

**Camera:** start [0.65,0.98,1.65]m; yaw0rad, f1000px, hy320px, pitch0/cx0; end [0.65,1.03,1.57]m; yaw0.03rad, f1000px, hy320px, pitch0/cx0. Interpolate start→end over local0–115; no extra picture push.  One YCam projects world elements; the planned foreground frame stays world geometry, never a 2D scale hack.

**Projection preflight:** Calculated start/mid/end seated lead 868/895/925px; face centrey180/191/203; leadbottomy919/953/990. Upright envelope200/206/210px, anchory870/900/932. The low tether is the hero in this insert; the actor is contextual and may be cropped horizontally. Caption reserve x120–888,y1040–1248. This is anchor/card calculation through shot-projection.py, not a new painted-frame or animated anatomy validation. Body/balloon keep identity scale; actual supported-lean extremes remain Boss/Editor frame checks.

**VO source:** [SCRIPT-R1 L02](../../../scripts/edu-series/ep20/short/script.md). Continuous E audio, no per-shot performance replacement. No extra narration at a cut.

**Subtitles — estimated display windows, G clock:**

| Range | Exact Thai text |
| --- | --- |
| [71,123) | เอาลูกโป่งฮีเลียมที่ลอยได้ |
| [123,163) | ผูกเชือกไว้กับพื้นรถ |
| [163,187) | แล้วปิดกระจก |

**Sound:** local0: continue AMB20/MUS20 without restart or seam. No rope squeak, door slam or camera whoosh; the low tether is a visual fact. Mix intent: hold.

**Cut and continuity:** Entry is a straight cut from the preceding shot, continuous audio/cabin and consistent front/right axis. No transition SFX or decorative dissolve is added. Carry the documented exit state into the next block; do not reset physical state merely because the camera changes.

**Acceptance / owner proof:** No direction readable before the result gate; closed glass/one low tether read immediately. Boss proves support/string/belt and camera extremes in the owning modules; Editor proves selected-output captions, continuity, audio word placement and random/backward seek. Film reviews the assembled blockout against this revision before polish. No shot pass is inferred from the look lock.

## EDU-EP20-SHORT-S01-B01-SH03 — ก็น่าจะตามคุณไปข้างหลัง?

Range and clocks: **S/G[187,352)**, localL[0,165); G=L+187. Composition offset0. Duration165frames (5.500s).

Direction: Let the passenger embody the plausible guess, while the balloon is at/beyond the right edge so its direction cannot be read. The guess is not presented as the physical result. Approved board direction remains verbatim in the review rows; this block supplies its numeric implementation detail. Balloon deliberately out at/over the right edge; no readable result. Actor remains the lead.

Staging: Casting `man-crop + hoodie, P31, neutral / right`; local0–18: ease passenger upper-torso rearward from neutral to shoulder offset−0.07 m relative to the fixed hip. Hold local18–164, confident gaze front/right. Balloon remains u=0 and concealed by framing; do not animate a false rearward result. supported upper-torso variant as needed, same person and costume. Pelvis, feet, lap hands, seat and ring use the shared contact constraints throughout; entry/exit do not attach or drop a prop.

**Camera:** start [-0.24,1.04,1.95]m; yaw0rad, f1500px, hy300px, pitch0/cx0; end [-0.23,1.035,1.94]m; yaw-0.008rad, f1500px, hy310px, pitch0/cx0. Interpolate start→end over local0–164; no extra picture push. Use a deliberately small drift in this close passenger view to keep the balloon beyond the frame and the head/feet inside the available height. One YCam projects world elements; the planned foreground frame stays world geometry, never a 2D scale hack.

**Projection preflight:** Calculated start/mid/end seated lead 1102/1106/1108px; face centrey169/171/174; leadbottomy1106/1112/1117. Upright envelope252/254/255px, anchory1042/1048/1055. The upright balloon centre is outside the right frame at both endpoints; this exclusion is intentional and is not a failed hero-size criterion. Caption reserve x120–888,y1140–1248. This is anchor/card calculation through shot-projection.py, not a new painted-frame or animated anatomy validation. Body/balloon keep identity scale; actual supported-lean extremes remain Boss/Editor frame checks.

**VO source:** [SCRIPT-R1 L03](../../../scripts/edu-series/ep20/short/script.md). Continuous E audio, no per-shot performance replacement. No extra narration at a cut.

**Subtitles — estimated display windows, G clock:**

| Range | Exact Thai text |
| --- | --- |
| [187,240) | พอรถเร่งไปข้างหน้า |
| [240,270) | คุณเอนติดเบาะ |
| [270,293) | ลูกโป่งก็น่าจะ |
| [293,329) | เอนไปข้างหลังตามคุณ... |
| [329,352) | ใช่ไหม? |

Caption synchronization, 2026-11-16 (coordinator for Film, Editor W5.3 / W6.2 decisions): the table now records the audio-measured runtime windows in `src/videos/edu-ep20/cues.ts`, including the word-boundary L03c split. Thai wording, shot duration, staging and voice are unchanged. Final v4 containing these cues was approved by the user before pinning.

**Sound:** local0: beds continue; reduce music into the next reveal beginningglobal348 (local161), without silencing cabin tone. No seat impact or acceleration whoosh. Mix intent: drop toward the prediction payment.

**Cut and continuity:** Entry is a straight cut from the preceding shot, continuous audio/cabin and consistent front/right axis. No transition SFX or decorative dissolve is added. Carry the documented exit state into the next block; do not reset physical state merely because the camera changes.

**Acceptance / owner proof:** No direction readable before the result gate; closed glass/one low tether read immediately. Boss proves support/string/belt and camera extremes in the owning modules; Editor proves selected-output captions, continuity, audio word placement and random/backward seek. Film reviews the assembled blockout against this revision before polish. No shot pass is inferred from the look lock.

## EDU-EP20-SHORT-S01-B02-SH01 — ผิด! มันไปข้างหน้า

Range and clocks: **S/G[352,496)**, localL[0,144); G=L+352. Composition offset0. Duration144frames (4.800s).

Direction: Pay the prediction with the opposed pair in one stable geography: passenger rearward, balloon forward. Keep hands visibly on lap so the cause becomes the next question. Approved board direction remains verbatim in the review rows; this block supplies its numeric implementation detail. Balloon and ring remain above the reserved band; passenger remains picture-left.

Staging: Casting `man-crop + hoodie, P31, surprised / right`; local0–3: preserve the guess beat. At local3 (global355, estimated L04 onset), start u=0→+0.20 m with smoothstep; arrive local21/global373 and hold to143. Passenger stays rearward−0.07 m, surprised eye opens local8–20, hands stay on lap. At local62/global414 the next force question starts; do not show a person touching the balloon. supported upper-torso variant as needed, same person and costume. Pelvis, feet, lap hands, seat and ring use the shared contact constraints throughout; entry/exit do not attach or drop a prop.

**Camera:** start [0.46,1.04,2.49]m; yaw-0.022rad, f1300px, hy305px, pitch0/cx0; end **D-R [0.36,0.975,2.3655]m** (SS-R2 FD20-W53-01: camera D trucked −0.10 m in x for the rear-lean hold); yaw0.03rad, f1300px, hy305px, pitch0/cx0. Interpolate start→end over local0–143; no extra picture push.  One YCam projects world elements; the planned foreground frame stays world geometry, never a 2D scale hack.

**Projection preflight:** Calculated start/mid/end seated lead 745/767/793px; face centrey216/196/174; leadbottomy850/849/849. Upright envelope171/175/180px, anchory807/801/795. Caption reserve x120–888,y860–1248. This is anchor/card calculation through shot-projection.py, not a new painted-frame or animated anatomy validation. Body/balloon keep identity scale; actual supported-lean extremes remain Boss/Editor frame checks. SS-R2 measured end D-R at the held state (lean −0.07, u +0.20; Boss rig through `scripts/edu-series/ep20/measure-cabin-motion.ts` camera set, Film run 16 Nov 2026): lead784.1px, figure left edge x27.5 (was −28.5 at D), top y64.0, envelope box x682–833,y131–310 untilted (tilt adds about +25px x, estimate), rest-lean figure left x91.5; lean limit −0.09 left x9.2 still in frame.

**VO source:** [SCRIPT-R1 L04](../../../scripts/edu-series/ep20/short/script.md), [SCRIPT-R1 L05](../../../scripts/edu-series/ep20/short/script.md). Continuous E audio, no per-shot performance replacement. No extra narration at a cut.

**Subtitles — estimated display windows, G clock:**

| Range | Exact Thai text |
| --- | --- |
| [352,362) | ผิด! |
| [362,414) | มันกลับเอนไปข้างหน้า |
| [414,465) | แต่ไม่มีใครจับมันดัน |
| [465,496) | แล้วอะไรดัน? |

**Sound:** local0–12: planned music gap continues while cabin tone remains. local13/global365: SFX20-TAP, a single dry soft fingertip-sized wooden tap, enclosed/near, ~0.12 s, light surprise rather than collision; NEEDS-GEN. Reintroduce sparse pulse afterlocal21. Mix intent: gap→small hit→release.

**Cut and continuity:** Entry is a straight cut from the preceding shot, continuous audio/cabin and consistent front/right axis. No transition SFX or decorative dissolve is added. Carry the documented exit state into the next block; do not reset physical state merely because the camera changes.

**Acceptance / owner proof:** Forward payment precedes the mechanism, and the braking result remains absent until its late reveal gate. Boss proves support/string/belt and camera extremes in the owning modules; Editor proves selected-output captions, continuity, audio word placement and random/backward seek. Film reviews the assembled blockout against this revision before polish. No shot pass is inferred from the look lock.

## EDU-EP20-SHORT-S01-B03-SH01 — อากาศรอบมันเป็นคนดัน

Range and clocks: **S/G[496,704)**, localL[0,208); G=L+496. Composition offset0. Duration208frames (6.933s).

Direction: Explain the surrounding air only after the forward result. Keep the character and real tether visible above a labelled screen-space schematic; this is not a dense wall of air. Approved board direction remains verbatim in the review rows; this block supplies its numeric implementation detail. Balloon and ring remain above the reserved band; passenger remains picture-left.

Staging: Casting `man-crop + hoodie, P31, surprised / right`; local0–207: hold u=+0.20 m and passenger rearward−0.07 m. Introduce the explainer after local24/global520, after the air answer begins, and animate it word by word per [PX20-A](#ss-r4-px20) (SS-R4): even jittering air → packs rearward on ตอนรถเร่ง → rear higher → front lower → inset balloon tips to u_i +0.20 with a forward resultant; card out G692–704. Keep pressure out of the cabin atmosphere and keep the same anchor. supported upper-torso variant as needed, same person and costume. Pelvis, feet, lap hands, seat and ring use the shared contact constraints throughout; entry/exit do not attach or drop a prop.

**Camera:** start [0.46,1.04,2.49]m; yaw-0.022rad, f1300px, hy305px, pitch0/cx0; end **D-R [0.36,0.975,2.3655]m** (SS-R2 FD20-W53-01: camera D trucked −0.10 m in x for the rear-lean hold); yaw0.03rad, f1300px, hy305px, pitch0/cx0. Interpolate start→end over local0–207; no extra picture push.  One YCam projects world elements; the planned foreground frame stays world geometry, never a 2D scale hack.

**Projection preflight:** Calculated start/mid/end seated lead 745/767/793px; face centrey216/196/174; leadbottomy850/849/849. Upright envelope171/175/180px, anchory807/801/795. Caption reserve x120–888,y1100–1248. This is anchor/card calculation through shot-projection.py, not a new painted-frame or animated anatomy validation. Body/balloon keep identity scale; actual supported-lean extremes remain Boss/Editor frame checks. SS-R2 measured end D-R at the held state (lean −0.07, u +0.20; Boss rig through `scripts/edu-series/ep20/measure-cabin-motion.ts` camera set, Film run 16 Nov 2026): lead784.1px, figure left edge x27.5 (was −28.5 at D), top y64.0, envelope box x682–833,y131–310 untilted (tilt adds about +25px x, estimate), rest-lean figure left x91.5; lean limit −0.09 left x9.2 still in frame.

**VO source:** [SCRIPT-R1 L06](../../../scripts/edu-series/ep20/short/script.md), [SCRIPT-R1 L07](../../../scripts/edu-series/ep20/short/script.md). Continuous E audio, no per-shot performance replacement. No extra narration at a cut.

**Subtitles — estimated display windows, G clock:**

| Range | Exact Thai text |
| --- | --- |
| [496,524) | อากาศในรถไง |
| [524,546) | ตอนรถเร่ง |
| [546,594) | แรงดันอากาศด้านหลัง |
| [594,637) | จะมากกว่าด้านหน้า |
| [637,684) | มันเลยดันลูกโป่งที่ลอยได้ |
| [684,704) | ไปทางหน้ารถ |

**Sound:** local0: cabin/wood pulse continue quietly. local24/global520: SFX20-TICK, one subdued woodblock tick with short rounded transient and ~0.18 s room tail, indicates explanatory inset, not moving wind; NEEDS-GEN. No repeated UI pops on every arrow, no hiss or whoosh for the moving air dots (SS-R4: the dot motion stays silent; the voice carries it). Mix intent: hold clarity.

**Cut and continuity:** Entry is a straight cut from the preceding shot, continuous audio/cabin and consistent front/right axis. No transition SFX or decorative dissolve is added. Carry the documented exit state into the next block; do not reset physical state merely because the camera changes.

**Acceptance / owner proof:** Forward payment precedes the mechanism, and the braking result remains absent until its late reveal gate. Boss proves support/string/belt and camera extremes in the owning modules; Editor proves selected-output captions, continuity, audio word placement and random/backward seek. Film reviews the assembled blockout against this revision before polish. No shot pass is inferred from the look lock.

## EDU-EP20-SHORT-S01-B03-SH02 — ถ้ายังวิ่งเร็ว มันจะเอนค้างไหม?

Range and clocks: **S/G[704,845)**, localL[0,141); G=L+704. Composition offset0. Duration141frames (4.700s).

Direction: Challenge the speed interpretation. Return attention to scenery continuing rearward behind the closed window, then to the still-forward balloon. Remove pressure graphics. Approved board direction remains verbatim in the review rows; this block supplies its numeric implementation detail. Balloon and ring remain above the reserved band; passenger remains picture-left.

Staging: Casting `man-crop + hoodie, P31, neutral / right`; local0–140: same forward u=+0.20 m and rear-supported passenger. Gaze shifts to the window local15–36, then balloon local75–100; body does not chase it. Exterior offsets continue monotonically rearward. Schematic absent from entry. supported upper-torso variant as needed, same person and costume. Pelvis, feet, lap hands, seat and ring use the shared contact constraints throughout; entry/exit do not attach or drop a prop.

**Camera:** start [0.46,1.04,2.49]m; yaw-0.022rad, f1300px, hy305px, pitch0/cx0; end **D-R [0.36,0.975,2.3655]m** (SS-R2 FD20-W53-01: camera D trucked −0.10 m in x for the rear-lean hold); yaw0.03rad, f1300px, hy305px, pitch0/cx0. Interpolate start→end over local0–140; no extra picture push.  One YCam projects world elements; the planned foreground frame stays world geometry, never a 2D scale hack.

**Projection preflight:** Calculated start/mid/end seated lead 745/767/793px; face centrey216/196/174; leadbottomy850/849/849. Upright envelope171/175/180px, anchory807/801/795. Caption reserve x120–888,y860–1248. This is anchor/card calculation through shot-projection.py, not a new painted-frame or animated anatomy validation. Body/balloon keep identity scale; actual supported-lean extremes remain Boss/Editor frame checks. SS-R2 measured end D-R at the held state (lean −0.07, u +0.20; Boss rig through `scripts/edu-series/ep20/measure-cabin-motion.ts` camera set, Film run 16 Nov 2026): lead784.1px, figure left edge x27.5 (was −28.5 at D), top y64.0, envelope box x682–833,y131–310 untilted (tilt adds about +25px x, estimate), rest-lean figure left x91.5; lean limit −0.09 left x9.2 still in frame.

**VO source:** [SCRIPT-R1 L08](../../../scripts/edu-series/ep20/short/script.md). Continuous E audio, no per-shot performance replacement. No extra narration at a cut.

**Subtitles — estimated display windows, G clock:**

| Range | Exact Thai text |
| --- | --- |
| [704,764) | แต่ถ้าตอนนี้รถยังวิ่งเร็วอยู่ |
| [764,824) | คุณว่าลูกโป่งจะเอนค้างแบบนั้น |
| [824,845) | ไปตลอดไหม? |

**Sound:** local0: preserve ambience; thin the pulse for the renewed question. No new SFX or pressure hiss. Mix intent: lift the question without masking its ending.

**Cut and continuity:** Entry is a straight cut from the preceding shot, continuous audio/cabin and consistent front/right axis. No transition SFX or decorative dissolve is added. Carry the documented exit state into the next block; do not reset physical state merely because the camera changes.

**Acceptance / owner proof:** Forward payment precedes the mechanism, and the braking result remains absent until its late reveal gate. Boss proves support/string/belt and camera extremes in the owning modules; Editor proves selected-output captions, continuity, audio word placement and random/backward seek. Film reviews the assembled blockout against this revision before polish. No shot pass is inferred from the look lock.

## EDU-EP20-SHORT-S01-B04-SH01 — รอให้หยุดแกว่งก่อน

Range and clocks: **S/G[845,995)**, localL[0,150); G=L+845. Composition offset0. Duration150frames (5.000s).

Direction: Compare the identical low anchor before/after an unspecified waiting interval. Show a visible time ellipsis, then a settled upright balloon while straight travel continues. Approved board direction remains verbatim in the review rows; this block supplies its numeric implementation detail. Balloon and ring remain above the reserved band; passenger remains picture-left.

Staging: Casting `man-crop + hoodie, P31, neutral / right`; local0–69: small diminishing illustrative swing u=+0.20→+0.14 m (not a measured transient). local70–94/global915–939: single-canvas state dissolve across an unspecified story-time interval, from the residual lean state to u=0 and neutral passenger. Show ภาพข้ามช่วงรอ at x120,y760 during local60–110. By local95/global940 the string is upright and remains so through149. No countdown, snap, real-time settling claim or two simultaneous solid balloons. supported upper-torso variant as needed, same person and costume. Pelvis, feet, lap hands, seat and ring use the shared contact constraints throughout; entry/exit do not attach or drop a prop.

**Camera:** start [0.46,1.04,2.49]m; yaw-0.022rad, f1300px, hy305px, pitch0/cx0; end [0.46,1.04,2.49]m; yaw-0.022rad, f1300px, hy305px, pitch0/cx0. Hold the selected C20-A camera for the whole shot: the unchanged anchor position is the experimental comparison, and the state dissolve is the only picture change. One YCam projects world elements; the planned foreground frame stays world geometry, never a 2D scale hack.

**Projection preflight:** Calculated start/mid/end seated lead 745/745/745px; face centrey216/216/216; leadbottomy850/850/850. Upright envelope171/171/171px, anchory807/807/807. Caption reserve x120–888,y860–1248. This is anchor/card calculation through shot-projection.py, not a new painted-frame or animated anatomy validation. Body/balloon keep identity scale; actual supported-lean extremes remain Boss/Editor frame checks.

**VO source:** [SCRIPT-R1 L09](../../../scripts/edu-series/ep20/short/script.md). Continuous E audio, no per-shot performance replacement. No extra narration at a cut.

**Subtitles — estimated display windows, G clock:**

| Range | Exact Thai text |
| --- | --- |
| [845,908) | ลองวิ่งตรงด้วยความเร็วคงที่ |
| [908,958) | รอให้ลูกโป่งหยุดแกว่ง |
| [958,995) | มันกลับมาตั้งตรง |

**Sound:** local0: AMB20 remains continuous; MUS20 simplifies acrosslocal60–110 ellipsis, with no ticking count, clock sound or silence duration implying physical settling. No settling foley required. Mix intent: ease/release.

**Cut and continuity:** Entry is a straight cut from the preceding shot, continuous audio/cabin and consistent front/right axis. The within-shot state dissolve is the explicitly labelled story-time ellipsis, not a second mounted canvas or a measured settling interval. Carry the documented exit state into the next block; do not reset physical state merely because the camera changes.

**Acceptance / owner proof:** Forward payment precedes the mechanism, and the braking result remains absent until its late reveal gate. Boss proves support/string/belt and camera extremes in the owning modules; Editor proves selected-output captions, continuity, audio word placement and random/backward seek. Film reviews the assembled blockout against this revision before polish. No shot pass is inferred from the look lock.

## EDU-EP20-SHORT-S01-B04-SH02 — ตัวแปรคือการเร่ง

Range and clocks: **S/G[995,1094)**, localL[0,99); G=L+995. Composition offset0. Duration99frames (3.300s).

Direction: Reinforce acceleration rather than speed. The upright balloon and steady passenger coexist with continuing forward journey; do not preview braking. Approved board direction remains verbatim in the review rows; this block supplies its numeric implementation detail. Balloon and ring remain above the reserved band; passenger remains picture-left.

Staging: Casting `man-crop + hoodie, P31, neutral / right`; local0–98: u=0; neutral P31, pelvis/feet/belt supported. Scenery continues monotonically rearward at constant apparent offset rate. No acceleration arrow, oscillation or move to rear is introduced. supported upper-torso variant as needed, same person and costume. Pelvis, feet, lap hands, seat and ring use the shared contact constraints throughout; entry/exit do not attach or drop a prop.

**Camera:** start [0.46,1.04,2.49]m; yaw-0.022rad, f1300px, hy305px, pitch0/cx0; end [0.46,0.975,2.3655]m; yaw0.03rad, f1300px, hy305px, pitch0/cx0. Interpolate start→end over local0–98; no extra picture push.  One YCam projects world elements; the planned foreground frame stays world geometry, never a 2D scale hack.

**Projection preflight:** Calculated start/mid/end seated lead 745/767/793px; face centrey216/196/174; leadbottomy850/849/849. Upright envelope171/175/180px, anchory807/801/795. Caption reserve x120–888,y860–1248. This is anchor/card calculation through shot-projection.py, not a new painted-frame or animated anatomy validation. Body/balloon keep identity scale; actual supported-lean extremes remain Boss/Editor frame checks.

**VO source:** [SCRIPT-R1 L10](../../../scripts/edu-series/ep20/short/script.md). Continuous E audio, no per-shot performance replacement. No extra narration at a cut.

**Subtitles — estimated display windows, G clock:**

| Range | Exact Thai text |
| --- | --- |
| [995,1031) | ตัวที่ทำให้เอน |
| [1031,1094) | คือการเร่ง ไม่ใช่ความเร็ว |

**Sound:** local0: same quiet cabin and sparse music; no motor stop or dead room that implies the car stopped. No new accent. Mix intent: hold the counterexample.

**Cut and continuity:** Entry is a straight cut from the preceding shot, continuous audio/cabin and consistent front/right axis. No transition SFX or decorative dissolve is added. Carry the documented exit state into the next block; do not reset physical state merely because the camera changes.

**Acceptance / owner proof:** Forward payment precedes the mechanism, and the braking result remains absent until its late reveal gate. Boss proves support/string/belt and camera extremes in the owning modules; Editor proves selected-output captions, continuity, audio word placement and random/backward seek. Film reviews the assembled blockout against this revision before polish. No shot pass is inferred from the look lock.

## EDU-EP20-SHORT-S01-B05-SH01 — ทายอีกครั้ง ตอนรถชะลอ

Range and clocks: **S/G[1094,1273)**, localL[0,179); G=L+1094. Composition offset0. Duration179frames (5.967s).

Direction: Reopen the prediction through the restrained passenger leaning forward. Keep the balloon outside the close framing; scenery still travels the same direction. Approved board direction remains verbatim in the review rows; this block supplies its numeric implementation detail. Balloon deliberately out at/over the right edge; no readable result. Actor remains the lead.

Staging: Casting `man-crop + hoodie, P31, neutral / right`; local0–114: neutral passenger and concealed upright balloon. local115–149/global1209–1243: ease upper torso to shoulder offset+0.07 m, supported within the belt; hold through178. Face intent becomes expectant. Do not depict the balloon rearward in this shot. The visual cue is the passenger, not a reversing road. supported upper-torso variant as needed, same person and costume. Pelvis, feet, lap hands, seat and ring use the shared contact constraints throughout; entry/exit do not attach or drop a prop.

**Camera:** start [-0.24,1.04,1.95]m; yaw0rad, f1500px, hy300px, pitch0/cx0; end [-0.23,1.035,1.94]m; yaw-0.008rad, f1500px, hy310px, pitch0/cx0. Interpolate start→end over local0–178; no extra picture push. Use a deliberately small drift in this close passenger view to keep the balloon beyond the frame and the head/feet inside the available height. One YCam projects world elements; the planned foreground frame stays world geometry, never a 2D scale hack.

**Projection preflight:** Calculated start/mid/end seated lead 1102/1106/1108px; face centrey169/171/174; leadbottomy1106/1112/1117. Upright envelope252/254/255px, anchory1042/1048/1055. The upright balloon centre is outside the right frame at both endpoints; this exclusion is intentional and is not a failed hero-size criterion. Caption reserve x120–888,y1140–1248. This is anchor/card calculation through shot-projection.py, not a new painted-frame or animated anatomy validation. Body/balloon keep identity scale; actual supported-lean extremes remain Boss/Editor frame checks.

**VO source:** [SCRIPT-R1 L11](../../../scripts/edu-series/ep20/short/script.md). Continuous E audio, no per-shot performance replacement. No extra narration at a cut.

**Subtitles — estimated display windows, G clock:**

| Range | Exact Thai text |
| --- | --- |
| [1094,1130) | ทีนี้ทายอีกรอบ |
| [1130,1186) | ถ้ารถยังวิ่งไปข้างหน้า |
| [1186,1217) | แต่กำลังชะลอ |
| [1217,1273) | คราวนี้คุณเอนไปหน้า... |

**Sound:** local0: continue beds, thin toward question. Begin music anticipation gap atlocal170/global1264 throughglobal1289; cabin remains. No brake squeal, siren or violent seat hit. Mix intent: drop before answer.

**Cut and continuity:** Entry is a straight cut from the preceding shot, continuous audio/cabin and consistent front/right axis. No transition SFX or decorative dissolve is added. Carry the documented exit state into the next block; do not reset physical state merely because the camera changes.

**Acceptance / owner proof:** The late rearward result reads without mirroring the car or reversing the journey. Boss proves support/string/belt and camera extremes in the owning modules; Editor proves selected-output captions, continuity, audio word placement and random/backward seek. Film reviews the assembled blockout against this revision before polish. No shot pass is inferred from the look lock.

## EDU-EP20-SHORT-S01-B05-SH02 — ลูกโป่งกลับไปท้ายรถ!

Range and clocks: **S/G[1273,1332)**, localL[0,59); G=L+1273. Composition offset0. Duration59frames (1.967s).

Direction: Land the late reversal in the familiar two-subject view: passenger toward front/right, balloon toward rear/left. Ease into the tendency, never snap or yank. Approved board direction remains verbatim in the review rows; this block supplies its numeric implementation detail. Balloon and ring remain above the reserved band; passenger remains picture-left.

Staging: Casting `man-crop + hoodie, P31, surprised / right`; local0: enter familiar paired view with u=0. At local1/global1274 (estimated L12 onset), ease u=0→−0.20 m throughlocal19/global1292; hold through58. Passenger forward+0.07 m and hands on lap. Camera eases to a stop bylocal35/global1308, allowing opposed silhouettes to read. No rebound/overshoot trajectory is asserted. supported upper-torso variant as needed, same person and costume. Pelvis, feet, lap hands, seat and ring use the shared contact constraints throughout; entry/exit do not attach or drop a prop.

**Camera:** start [0.46,1.04,2.49]m; yaw-0.022rad, f1300px, hy305px, pitch0/cx0; end [0.46,0.975,2.3655]m; yaw0.03rad, f1300px, hy305px, pitch0/cx0. Interpolate start→end over local0–35, then hold through58; do not continue drifting after the reversed pair lands. One YCam projects world elements; the planned foreground frame stays world geometry, never a 2D scale hack.

**Projection preflight:** Calculated start/mid/end seated lead 745/767/793px; face centrey216/196/174; leadbottomy850/849/849. Upright envelope171/175/180px, anchory807/801/795. Caption reserve x120–888,y860–1248. This is anchor/card calculation through shot-projection.py, not a new painted-frame or animated anatomy validation. Body/balloon keep identity scale; actual supported-lean extremes remain Boss/Editor frame checks.

**VO source:** [SCRIPT-R1 L12](../../../scripts/edu-series/ep20/short/script.md). Continuous E audio, no per-shot performance replacement. No extra narration at a cut.

**Subtitles — estimated display windows, G clock:**

| Range | Exact Thai text |
| --- | --- |
| [1273,1332) | ส่วนลูกโป่งกลับเอนไปท้ายรถ! |

**Sound:** local0–16: anticipation gap continues. local17/global1290: SFX20-ANSWER, two small warm wooden/mallet notes rising gently, ~0.45 s, near and dry with a soft enclosed tail; NEEDS-GEN. It responds to the revealed opposition, not dangerous driving. Mix intent: light hit then release.

**Cut and continuity:** Entry is a straight cut from the preceding shot, continuous audio/cabin and consistent front/right axis. No transition SFX or decorative dissolve is added. Carry the documented exit state into the next block; do not reset physical state merely because the camera changes.

**Acceptance / owner proof:** The late rearward result reads without mirroring the car or reversing the journey. Boss proves support/string/belt and camera extremes in the owning modules; Editor proves selected-output captions, continuity, audio word placement and random/backward seek. Film reviews the assembled blockout against this revision before polish. No shot pass is inferred from the look lock.

## EDU-EP20-SHORT-S01-B05-SH03 — กฎเดิม แค่ฝั่งที่ดันเปลี่ยน

Range and clocks: **S/G[1332,1619)**, localL[0,287); G=L+1332. Composition offset0. Duration287frames (9.567s). SS-R5: was [1332,1590), 258 frames; the 29 added frames are the longer new L13 (speech to G1438, file end G1442.2); the picture-only ending stays 176 frames (G1443–1618). SS-R3 was [1332,1504).

Direction: Reuse the same pressure rule after the result. Hold the reversed pair; the explainer returns in its accel state and visibly flips to front-higher (PX20-B), clears, then the ending breathes out: the balloon swings gently back upright, the passenger sits back, the camera eases to the opening view, a short melody closes and the picture fades (END20, SS-R4). Approved board direction remains verbatim in the review rows; this block supplies its numeric implementation detail. Balloon and ring remain above the reserved band; passenger remains picture-left.

Staging: Casting `man-crop + hoodie, P31, surprised / right`; local0–132 (G1332–1464): hold u=−0.20 m, passenger forward+0.07 m, same camera as preceding exit. Pressure explainer per [PX20-B](#ss-r4-px20) (SS-R5 word sync): in local8/global1340 (recall of the accel state, during เพราะคราวนี้), air packs to the front G1356–1386 on อากาศด้านหน้า, labels swap G1388–1400 and the inset balloon tips to u_i −0.20 with the resultant flipping rear/left G1388–1418 on กลับดันแรงกว่า…ด้านหลัง, hold through นั่นเอง, out local117–129/global1449–1461. Last word ends G1438, file end G1442.2. Then [END20](#ss-r5-end20): local133–253/global1465–1585 lean +0.07→0, damped balloon settle u −0.20→0 with one +0.045 m forward overshoot, camera D→A; hold upright at A; A_fade G1579–1619. No CTA, new speech, scenery reversal or last-frame reset. supported upper-torso variant as needed, same person and costume. Pelvis, feet, lap hands, seat and ring use the shared contact constraints throughout; entry/exit do not attach or drop a prop.

**Camera:** start [0.46,0.975,2.3655]m; yaw0.03rad, f1300px, hy305px, pitch0/cx0; hold through local133/global1465; then ease (smoothstep) to end **A [0.46,1.04,2.49]m; yaw−0.022rad**, f1300px, hy305px, pitch0/cx0 by local253/global1585 and hold to 286 (SS-R5; SS-R4 1436–1556, hold to 257). SS-R4: the explanation keeps the opposed silhouettes on D; the pull-back to A happens only while the pair resolves to upright, so it reads as the story exhaling, and lands on the approved LF20-CABIN-B framing. One YCam projects world elements; the planned foreground frame stays world geometry, never a 2D scale hack.

**Projection preflight:** Calculated start (D, G1332) / settle start (D, G1465) / end (A, G1585–1618) seated lead 793/793/745px; face centrey174/174/216; leadbottomy849/849/850. Upright envelope180/180/171px, anchory795/795/807 (D and A values from the SS-R1 33-sample run; A equals B04-SH01; mid-move values between them are interpolation estimates, not a new run). These projection samples use the planned D/A cameras; verify the actual tilted envelope/torso against its anchors during blockout. Caption reserve x120–888,y1100–1248. This is anchor/card calculation through shot-projection.py, not a new painted-frame or animated anatomy validation. Body/balloon keep identity scale; actual supported-lean extremes remain Boss/Editor frame checks.

**VO source:** [SCRIPT-R2 L13](../../../scripts/edu-series/ep20/short/script.md) (user-chosen, 2026-11-16; FACT-R2 supported). Continuous narration R2 (`kore-full-selected-E-L13r2.wav`), no per-shot performance replacement; the new L13 is spoken G1333–1438 (seam G1332.0 inside the L12→L13 quiet, before this shot's first word). No extra narration at a cut.

**Subtitles — estimated display windows, G clock:**

| Range | Exact Thai text |
| --- | --- |
| [1332,1384) | เพราะคราวนี้ อากาศด้านหน้า |
| [1384,1529) | กลับดันแรงกว่าด้านหลังนั่นเอง |

SS-R5 windows (measured, not estimated): L13a covers its spoken words G1333–1378 and the phrase pause; the switch at G1384 sits at the deepest frame of the 1379–1385 pause (−61 dBFS), 2 f before กลับ (G1386). L13b covers G1386–1438 and holds 91 f after the last word; 6 f fade G1523–1529 if the runtime can, otherwise hard off at G1529 (Editor's current cue model). Text and split unchanged from the SCRIPT-R2 text sync; the runtime `cues.ts` still carries the R1 strings and must change with these windows.

**Sound (SS-R5; SS-R4 design kept, frames +29 after the voice):** local0: cabin bed continues; no extra tick on returning inset, no sound for the moving dots. MUS20 bed holds −6 dB under เพราะคราวนี้ / อากาศด้านหน้า and releases G1409 (−6 dB, during กลับดันแรงกว่า) → off at G1443 (SS-R4 1380→1414). **local113/global1445: MUS20-OUTRO** (Ton's file `stinger_marimba-outro-falling-open_01`, 116 f, −6 dB, ends G1561): a short warm melody, solo soft muted marimba lead with a few plucked-wood answer notes, ~6 beats at 94 BPM, gently descending contour that mirrors the balloon coming to rest, quietly satisfied, no drums/pad/strings, dry intimate room, same key and tonic as MUS20 (F), ending open on G4 (last attack file 3.54 s = G1551); melody tail may overlap END by ≤14 frames (≤G1574). It starts 7 f after the last word's energy (G1438) and 2.8 f after the file end, never under the voice. **local228/global1560: SFX20-END** (same file `stinger_wood-two-note-tag-end_01`, −6 dB, 58 f, ends G1618), the episode's UT15 ending sound and the melody's final cadence on beat 7 (onset + 6 beats = 115 f; F4→F3 resolves the open G4): −30 dB ≈G1590, audible tail ≈G1604. AMB20 continues and fades G1579–1619 (file 1620 f, still long enough; endFrame 1619). No swing/creak SFX for the settling balloon. Mix intent: after the voice the melody may come forward (about −20 LUFS short-term, Editor confirms with mix-levels), release, and let the final picture breathe.

**Cut and continuity:** Entry is a straight cut from the preceding shot, continuous audio/cabin and consistent front/right axis. No transition SFX or decorative dissolve is added. SS-R5 exit: upright balloon, rest passenger, camera A, faded to black by G1618 (`A_fade`, 40 frames, G1579–1619). A later `_B_loop` would meet G0 in the same calm state; no braking result leaks into the opening question.

**Acceptance / owner proof:** The late rearward result reads without mirroring the car or reversing the journey. Boss proves support/string/belt and camera extremes in the owning modules; Editor proves selected-output captions, continuity, audio word placement and random/backward seek. Film reviews the assembled blockout against this revision before polish. No shot pass is inferred from the look lock.

## Handoff and change log

**Boss:** harden one reusable cabin/balloon/contact family against the locked look and all action extremes; retain current calibration. Do not replace whole-shot art or invent episode clocks in the library. Return existing-integrated/exists-unintegrated/missing statuses with actual evidence and the named C/M issues. Film owns staging changes.

**SS-R2 W5.3 Film decisions on Boss W5.2** (evidence viewed: `out/edu20-w52/drive-sheet.png`, `ext-upper-sheet.png`, `crop-sheet.png`, `motion-geometry.json`; Film camera candidates `out/edu20-film/d-candidates.json`):

| Decision | Choice and reason | Boss change and acceptance |
| --- | --- | --- |
| FD20-W53-01 camera D crop | Keep the SS-R1 lean −0.07 (it is the visible cause of the forward answer; −0.039 reads as posture, not a push). Truck only the end camera of B02-SH01, B03-SH01 and B03-SH02 to **D-R x0.36** (y, z, yaw0.03, f, hy unchanged). A pure truck keeps the A→D push, pan direction, light and apparent sizes (lead 784 vs 785 px); a yaw change was rejected because it alters the pan the approved board relies on. D (x0.46) stays for B01-SH01, B04-SH02 and B05-SH02/SH03, whose held leans (0 / +0.07) keep x≥35.7 px. | Boss: add D-R to the measure camera set and a D-R extremes still. Accept: figure left ≥24px at lean −0.07 (calculated 27.5), envelope right ≤888px with tilt, lead ≥480px, nothing above the caption band changes; viewed qa-sheet at 270px. |
| FD20-W53-02 shoulder strap | **Not acceptable.** In the accel frames (crop X1, X3) the strap from the fixed upper anchor rises vertically in front of the neck and under the jaw: it reads as a strap at the throat and a dark bar beside the face, exactly where the surprised face carries B02. | Boss, `paintPassengerBelt` in `src/painted/kit/car-cabin.ts`: when lean≠0, start the drawn strap at `torsoPoint(passenger, upper, lean)` (the shoulder point carried with the torso, same carry as the chest bend), keep the BELT_CHEST bend and the fixed latch/lap; do not draw the fixed anchor→shoulder link. Lean 0 stays byte-identical to LF20-CABIN-B (SHA 45eb3d34…). Accept at lean ±0.07 and ±0.09 on cameras A, D-R, D, CLOSE: upper strap angle within ±8° of rest, no strap pixels over the neck/chin skin, chest point on the hoodie, latch/lap 0px drift. |
| FD20-W53-03 balloon tilt | **Tilt along the string.** The episode teaches that the air pushes the balloon forward; an upright envelope on a slanted string shows a kink at the knot and reads as a stuck sticker, while a balloon continuing its string line reads as one tethered body being pushed, which is the physical shape (buoyancy and push resolve along the tether). The tilt is small (13.5° at u 0.20) so the look B silhouette stays. | Boss, `tetheredBalloonAt` / `paintTetheredBalloon`: centre = N + 0.195·unit(N−A); envelope, knot and highlight rotate rigidly by θ about N; u=0 byte-identical. Re-measure face gap: brake u −0.20 must keep ≥25px on A, D and CLOSE (estimate about 45–50px at A/D); lower `BALLOON_U_MAX` if the ±0.25 limit falls under 25px. Rope stays 0.855 m. |
| FD20-W53-04 road-strip speeds (SS-R3, after Boss W5.2b) | SS-R1 speeds 0.0007→0.0012 m/frame gave 8→14 px/s on camera A (1.71×): a drift whose change does not read inside a shot. Raise the steady top to 0.0026 (3.25× the opening 0.0008, 4.3× the post-brake 0.0006) so the acceleration in B01-SH03, the continuing flow in B02–B04 and the slowing in B05-SH01 read through scroll alone. Top capped by the closest camera (CLOSE ~544 px/m: 1.5 px/frame ⇒ ≤0.00276); low end kept ≥0.0004 so the strip never fades. Key frames G0/G187/G352/G1209/G1414 unchanged. | Data only (`ROAD_KEYS`); no kit change. Evidence: `scripts/edu-series/ep20/measure-road-strip.ts` → `out/edu20-film/road-ss-r3.json` (largest mark step A 1.04, D 1.08, CLOSE 1.40/1.42 px/frame; rows unchanged); 1 s window-crop pairs `out/qa/edu20/film-ssr3/speed-pairs-1s.png` viewed. Boss: `tests/car-cabin.test.ts` lines 101–105 hard-code the SS-R1 speeds and must be re-derived from `ROAD_KEYS`. |

**SS-R4 Film decisions on Draft review round 1** (user notes 16 Nov 2026, relayed by coordinator: (a) “the ending is too abrupt”, user chose to stretch the ending picture and add a melody, no new narration; (b) “the explanation shows only a still picture, no visual animation”; evidence viewed: `out/qa/edu20/draft/sheet-0-every-shot.png`, `600.png`, `1480.png`):

| Decision | Choice and reason | Owner change and acceptance |
| --- | --- | --- |
| FD20-R4-01 PX20 animated explainer | The static card states the conclusion but never shows the cause. A small moving model (air dots that pack, push arrows that differ, balloon icon that tips) lets the eye see "more air behind pushes harder" while the voice says it, and the brake flip shows "the side changes" literally. Packing, not streaming, keeps the physics honest: the air shifts and stays shifted while accelerating; it is not a wind. Exaggerated density is disclosed by the ภาพอธิบาย header; no new Thai strings. | **Editor**: replace `PressureInset` in `src/videos/edu-ep20/chrome.tsx` with the [PX20](#ss-r4-px20) model; INSET_ACCEL stays G520–704; INSET_BRAKE becomes G1340–1432 (in 8, out 12). Accept per PX20 acceptance list. **Boss**: none unless Editor requests a reusable component. |
| FD20-R4-02 END20 extended settle | 3 s of a frozen reversed pair after the last word felt cut off. Braking ends at G1414 (road strip already holds its slow speed), so the B04 rule returns the balloon upright: a gentle damped swing is the truthful and calm close, and landing on the approved look frame (camera A, u 0, lean 0) rhymes with the opening. Total 1590 frames = 53.0 s, inside the 40–60 s channel target. | **Editor**: TOTAL 1590, B05-SH03 [1332,1590), drive keys for lean release and the damped u(t) in `src/painted/edu20/drive.ts`, camera D→A in the B05-SH03 plate, L13b to G1500, `endFadeSec` 40/30, END_FADE 1550–1590, AMB20 fade 1550–1590, `sound-mix.py` moves to the new cue sheet. **Boss**: confirm `tetheredBalloonAt` accepts small positive u after negative (no hysteresis), the lean adapter eases +0.07→0 with belt following, and `roadStripAt` stays seamless past G1504 (closed form; expect no change). |
| FD20-R4-03 Ending sound | UT15 lets Film choose: the ending sound stays SFX20-END, but now as the cadence of a short MUS20-family melody instead of a tag on the last word's tail (which also clears the G1405 overlap Editor flagged). | **Ton**: MUS20-OUTRO NEEDS-GEN per B05-SH03 Sound; measure MUS20 and END keys; return the updated cue sheet (`totalFrames` 1590, END frame 1531, AMB20 end 1590) with levels. |

**SS-R4 handoff rows** (done in the Draft round 1 re-cut; their frames from G1414 on are superseded by the SS-R5 rows below):

| Owner | Task | Inputs | Done when |
| --- | --- | --- | --- |
| Ton | Generate/pick MUS20-OUTRO (onset G1416, ≈115 f, 94 BPM, MUS20 key, open last note); move SFX20-END to G1531, key-match it; extend AMB20 to G1590 with fade 1550–1590 (file is 1620 f, no new file) | This sheet B05-SH03 Sound, `scripts/edu-series/ep20/short/sound-cues.json` | Cue sheet updated and validated (`sound-cues.py`), files in store, `listened` recorded honestly |
| Boss | Three capability checks in FD20-R4-02 (balloon sign change, lean release, road strip past G1504) with a 270 px still set at G1440/1472/1556 on camera D→A | `src/painted/kit/car-cabin.ts`, this sheet END20 | Measured numbers + viewed sheet; no kit change expected |
| Editor | PX20 inset rewrite, END20 timeline/drive/camera/caption/fade, sound-mix to Ton's new cue sheet; then half-size Draft re-cut of B03-SH01 and B05-SH03 only (scene cache), stills per PX20/END20 acceptance | This sheet SS-R4, Ton cue sheet | Draft clips + qa-sheets viewed, caption-zone pass, seek parity at 600/1380/1472, mix-levels on the tail |
| Film | Review the re-cut B03-SH01/B05-SH03 frames against PX20/END20 before the coordinator republishes | Editor's sheets | Written verdict per shot |

**SS-R5 Film decisions on narration R2 / VOICE-MEASURE-R3** (inputs read: voice-measure.md R3 section and `voice-measure.json`, R3 Whisper words `out/voice/edu-ep20-r2/asr-l13.json`, 10 ms RMS of `out/voice/edu-ep20-r2/kore-full-selected-E-L13r2.wav` SHA `b6f8490d…` G1329–1442, `sound-cues.json` SS-R4, `src/videos/edu-ep20/cues.ts` and `src/painted/edu20/cabin-look-data.ts` read only; nothing rendered or viewed, none needed for a written re-anchor):

| Decision | Choice and reason | Owner change and acceptance |
| --- | --- | --- |
| FD20-R5-01 total 1619 | Keep the SS-R4 rule: ceil(G1442.21) + 176 = **1619 f = 53.967 s**. The 176 f picture-only ending is the user's “ending too abrupt” fix; keeping 1590 would cut it to 147.8 f and squeeze the settle. 53.967 s stays inside 40–60 s. B01–B05-SH02 ranges unchanged; B05-SH03 [1332,1619) | Editor: TOTAL 1619, B05-SH03 end 1619 |
| FD20-R5-02 braking ends with the voice | The narration now explains the braking state until G1438, so the car keeps slowing until the speech is contained: `ROAD_KEYS` last key `{at: 1414}` → `{at: 1443, speed: 0.0006}` (data only). Without it the balloon would hold its brake lean for 51 f of constant speed before the settle, which contradicts the B04 rule the ending teaches. Affects only G>1209 (the 1209→1443 ease is gentler, still monotonic down, never below 0.0004) | Editor edits `src/painted/edu20/cabin-look-data.ts`; Boss re-derives `tests/car-cabin.test.ts` speed expectations from `ROAD_KEYS` if they hard-code 1414 |
| FD20-R5-03 PX20-B word sync | Re-timed to the measured L13 words: recall in during เพราะคราวนี้ (G1340), air packs front on อากาศด้านหน้า (1356–1386), labels swap and the icon tips back on กลับดันแรงกว่า…ด้านหลัง (1388–1418), hold through นั่นเอง, out 1449–1461. Still after the L12 real balloon motion (1274–1292) and still clear 4 f before the settle | Editor: `INSET_BRAKE` 1340–1461 and the PX20-B key frames per [PX20](#ss-r4-px20) |
| FD20-R5-04 END20 and sound +29 | Every END20 and post-voice sound frame moves by exactly +29 f, the same shift as the containing frame (1414→1443); shapes unchanged. OUTRO 1445, END 1560 (= 1445 + 115, six 94 BPM beats), AMB20 fade 1579–1619, MUS20 bed off at 1443 | Ton cue sheet, Editor drive/camera/fade/mix |

**SS-R5 handoff rows:**

| Owner | Task | Inputs | Done when |
| --- | --- | --- | --- |
| Ton | Re-time the cue sheet only (no new generation): `totalFrames` 1619, `narration` → `edu-ep20-r2/kore-full-selected-E-L13r2.wav` (`b6f8490d…`); MUS20 automation `(1301,−6),(1380,−6),(1414,OFF)` → `(1301,−6),(1409,−6),(1443,OFF)`, endFrame 1443; **MUS20-OUTRO frame 1445, frameLocal 113, endFrame 1561**; **SFX20-END frame 1560, frameLocal 228, endFrame 1618**; AMB20 endFrame 1619, linear fade 1579–1619 (file 1620 f, no new file); SFX20-TAP/TICK/ANSWER unchanged (365/520/1290). Then the open fixlist mix-levels re-measure on the re-cut stems | This sheet B05-SH03 Sound and END20, `scripts/edu-series/ep20/short/sound-cues.json` | `sound-cues.py` passes, `sceneSheets` EDU-EP20-SS-R5, `listened` honest; OUTRO's sixth-beat downbeat confirmed at file 3.83 s (= G1560) on the file's own grid |
| Editor | (1) Narration source → R2 file (`store.py use`, commit the final narration). (2) TOTAL 1619, B05-SH03 [1332,1619). (3) `cues.ts`: L13a `[1332,1384) 'เพราะคราวนี้ อากาศด้านหน้า'`, L13b `[1384,1529) 'กลับดันแรงกว่าด้านหลังนั่นเอง'`, empty cue `[1529,1619)`. (4) `INSET_BRAKE` 1340–1461 and PX20-B keys 1356/1386, 1388/1400, 1388/1418 (u_i), 1388/1398 + 1402/1418 (resultant), ω 1356–1396. (5) END20 drive keys: lean ss(1465,1495), face switch G1475, balloon u(t) with t=G−1465 and release ss(1561,1585), camera D→A ss(1465,1585). (6) `ROAD_KEYS` last key 1443 (FD20-R5-02). (7) END_FADE 1579–1619 (`endFadeSec` 40/30 unchanged). (8) `sound-mix.py` to Ton's SS-R5 cue sheet. Then the half-size Draft re-cut of B05-SH03 only through the scene cache (B05-SH02 unchanged; re-cut it too only if the scene cache key changes with the narration file) | This sheet SS-R5, Ton's SS-R5 cue sheet | qa-sheets viewed at G1348/1371/1400/1440 (PX20-B) and G1443/1469/1483/1501/1537/1585/1604/1618 (END20); `caption-zone.py` on G1360 and G1420 (L13a/L13b ink inside x120–888, y1100–1248; L13b is the longest Thai line of the shot, wrap allowed inside the band); seek parity 600/1395/1501; mix-levels on the tail; listen once to the 44.401 s seam and L13 and record it |
| Boss | No new capability: the SS-R4 checks (sign change of u, lean release, closed-form road strip) hold for the shifted frames; only confirm `roadStripAt` with the 1443 key stays seamless to G1618 | `src/painted/kit/car-cabin.ts`, `ROAD_KEYS` | Measured numbers, no kit change expected |
| Film | Review the re-cut B05-SH03 against PX20-B (SS-R5) and END20 before the coordinator republishes | Editor's sheets | Written verdict |

**Ton:** create/fit AMB20, MUS20, SFX20-TAP, SFX20-TICK, SFX20-ANSWER and SFX20-END from their Sound descriptions and exact local/global cue clocks, file durable media and return one cue sheet with levels targets. No extra character voices/accelerating-car stunts. Ton may work in parallel with Boss after coordinator dispatch.

**Editor:** register episode/one-shot modules and timeline with stable IDs; implement single-canvas integration, continuous E audio and caption timing; use the written range 1619 (SS-R5; SS-R4 1590, SS-R3 1504) and output ending behavior once. Recheck audible reveal anchors before claiming sync. W3.3 all11 unchanged shots were explicitly approved during this pass. Assemble the half-size Draft through render.mjs/scene cache in required stage order, not a bypass render.

R1, Film,2026-11-16: first timed written sheet after explicit SCRIPT-R1, full E and B-look approvals. Converts existing11 stable shots without changing their published Thai title/VO/seen/sound. Adds written numeric contact/camera/event/sound/caption handoffs and independently measured E energy valleys; labels semantic uncertainty and absent runtime capabilities. No production source, audio or render changed.

SS-R2, Film,2026-11-16: W5.3 follow-up to Boss W5.2 capability. FD20-W53-01 end camera D-R [0.36,0.975,2.3655] for B02-SH01/B03-SH01/B03-SH02 (lean −0.07 kept; head crop −28.5→+27.5px calculated); FD20-W53-02 shoulder strap starts at the torso-carried shoulder point (throat strap rejected); FD20-W53-03 envelope tilts along the string. Shot IDs, ranges, event frames, captions, VO, Sound and all Thai fields unchanged. No production source, audio or render changed by Film.

SS-R3, Film,2026-11-16: FD20-W53-04 road-strip speeds after Boss W5.2b: 0.0008 → 0.0026 (G187–352) → hold to G1209 → 0.0006 by G1414, same key frames; edited `ROAD_KEYS` only. Shot IDs, ranges, event frames, captions, VO, Sound and all Thai fields unchanged.

SS-R4, Film,2026-11-16: Draft review round 1. FD20-R4-01 PX20 animated pressure explainer (packing air dots, push arrows, tipping balloon icon, word-synced; brake mirror G1340–1432 after the L12 result; box y860–1084); FD20-R4-02 END20 settle ending (lean release, damped balloon return to upright, camera D→A, A_fade 40 f), total 1504→1590 frames (53.000 s), B05-SH03 [1332,1590); FD20-R4-03 MUS20-OUTRO G1416 with SFX20-END moved G1405→G1531 as its cadence. Narration, VO, captions text, shot IDs and the other 10 shot ranges unchanged; review-rows Thai `seen`/`sound`/`flag` changed for B03-SH01 and B05-SH03 only, each with a `changed` line. No production source, audio or render changed by Film.

SCRIPT-R2 text sync, Preaw, 2026-11-16: the user explicitly chose L13 "เพราะคราวนี้ อากาศด้านหน้ากลับดันแรงกว่าด้านหลังนั่นเอง" (was "อากาศรอบมัน เปลี่ยนฝั่งที่ดันแรงกว่าแล้วไง"). B05-SH03 VO source, PX20-B VO-word column, END20 caption row and subtitle text updated; caption split at the phrase break, "เพราะคราวนี้ อากาศด้านหน้า" / "กลับดันแรงกว่าด้านหลังนั่นเอง". Shot IDs, ranges, keyframes, caption windows and sound unchanged; every L13 frame is still the R1 E-take estimate and needs re-anchoring by Film/Editor after the L13 re-voice and remeasure. The new wording states front-higher pressure, which the PX20-B flip already shows. Revision label SS-R4 left for Film to bump.

SS-R5, Film, 2026-11-16: re-anchor to narration R2 / VOICE-MEASURE-R3 (SCRIPT-R2 L13, FACT-R2 supported). FD20-R5-01 total 1590→1619 by the SS-R4 rule (ceil(G1442.21)+176), B05-SH03 [1332,1619); FD20-R5-02 `ROAD_KEYS` braking end 1414→1443; FD20-R5-03 PX20-B re-synced to the measured L13 words (in 1340, pack front 1356–1386, labels 1388–1400, icon/resultant 1388–1418, out 1449–1461); FD20-R5-04 END20 and post-voice sound +29 f (settle 1465–1585, OUTRO 1445, END 1560, A_fade/AMB20 fade 1579–1619, MUS20 off 1443); captions L13a [1332,1384), L13b [1384,1529). Shot IDs, Thai text, B01–B05-SH02 ranges and their events unchanged. No production source, audio or render changed by Film. Review page: pending.
