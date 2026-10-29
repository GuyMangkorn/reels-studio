# Visual brief — SHIPWRECK-SHORT (painted 2D, Light tier)

Deliverable: `SHIPWRECK-SHORT` (Thai Short, 1080×1920, 30 fps); delivery record: [scripts/oldest-shipwreck/delivery.md](../../../scripts/oldest-shipwreck/delivery.md); target 45–60 s, **56.5 s estimated** (53.5 s VO + 3.0 s hold, 1,695 frames). Timing is `estimated` until the Niwat read exists.
Revision: `VB-SHIPWRECK-SHORT-R1` (Film, 29 Oct 2026). Status: **needs-feasibility**. The painted scene type is `missing` and the in-canvas dissolve is untested. The look check is pending, because the user has not yet picked the style stills (see Q1).
Script: [short/script.md](../../../scripts/oldest-shipwreck/short/script.md) `SHIPWRECK-SHORT-R1.1` (user-approved 29 Oct 2026). Fact-check: [short/fact-check.md](../../../scripts/oldest-shipwreck/short/fact-check.md) on R1, whose required fixes are applied in R1.1 (the R2 recheck of those two phrases is Boat's). Research r2.
Profile: channel-default, mystery-educational, Painted 2D (p5.brush), Edge TTS Premwadee +5% (user choice), outline captions, chrome on, ending `B_loop`. Tier Light: Mark `N/A` (this shot list replaces scene sheets); Boss only for the named gaps below.
Target checkout: `claude/shipwreck-short-82a71a` @ `f1b46dd` + uncommitted spike `src/painted/spike/Shipwreck.tsx`. Scope: the whole Short, single story scene `S01`, beats `B01`–`B09`.

## Visual intent

Quiet wonder at a ghost-ship site. The present-day seabed is cool blue-green and sunlit. The labelled reconstruction (B03) is cold slate. The Egyptian match (B06–B07) turns warm ochre, the only warm key, which carries the twist. Watercolour washes are motionless. Thin ink lines boil only on leads, the jars and the ship. The camera always drifts or pushes slowly. **No hull, timber or ship outline on the seabed in any beat.** The age number does not appear before B07, and nothing hints at Egypt before B06. Style evidence: stills `out/painted-spike/PAINTED-SPIKE-Shipwreck/s2.png` (storm) and `s3.png` (site), plus [p5-feasibility.md](../../../scripts/oldest-shipwreck/p5-feasibility.md). The golden-hour still `s1.png` is not used, because the script has no calm crossing. It is kept as a rejected test.

## Sound direction

- **Music:** one sparse underwater-mystery bed (airy pad, soft marimba or glass bell, low cello drone; no drums; 85–90 bpm), ducked under the voice. Arc:
  - B01: enters very low on the question.
  - B02: low and steady.
  - B03: out, while the storm plays.
  - B04: re-enters as a single low pulse.
  - B05: thins to nothing before "ร้อยสองร้อยปี".
  - B06: riser, then a warm colour.
  - B07: fullest phrase, with a swell on the number.
  - B08: holds, easing on "แต่ทีมเองบอกว่า".
  - B09: back to the B01 colour, fading out by about 55.0 s so only ambience carries the `B_loop` seam.

  Library: `bed_pool-curious-sparse_01` (marimba, glass bell, pad, 90 bpm, 54 s, non-loop) is the closest fallback. `bed_mystery-investigation_01` is too busy, and its ticking clashes with the B04 ticks. **Gap:** generate `bed_underwater-mystery-sparse_01` (music, about 60 s, 85 bpm), then shape it with Editor's volume automation.
- **Ambience:**
  - Present-day seabed (B01, B02, B04–B09): muffled low hum, faint distant bubbles, soft current. **Gap:** `water_underwater-shallow-ambience_01`, 15 s loop. `water_pool-hall-ambience_01` is an indoor room and does not fit.
  - B03 only: `weather_rain-thunder-distant_01` (library), plus **gap** `weather_sea-storm-wind-waves_01` (8 s) for wind and swell.
- **SFX:**
  - B02, B05, B08: diver regulator bubbles. **Gap:** `water_diver-regulator-bubbles_01`, 3–4 s.
  - B03: thunder roll on the lightning frame. **Gap:** `weather_thunder-roll-distant_01`, 4 s. The library bed's thunder cannot be synced.
  - B04: three soft ticks on the features, using `ui_click-tick_01` low-passed at low gain.
  - B06: `reveal_riser-tension_01`, ending on "รูปทรงเดียวกัน", into `impact_cinematic-boom_01` at low gain. Fallback: `stinger_twist-reveal_01`.
  - B07: optional `stinger_outro-resolve_01` swell on the number.
  - No whooshes on seabed cuts.
- **Silence:**
  - Hard cut to near-silence on "หรืออาจไม่ใช่เลย". Storm sound starts and ends inside the labelled B03 span.
  - About 0.6 s silence after "ร้อยสองร้อยปี", with only faint ambience.
  - No sound on the loop seam other than continuous ambience.
- **Status:** no library file has been listened to by a person yet. All gaps above go to Editor as generation requests.

## Visual progression

| Beats | Visible action | Information / emotion change | Form / reason | Repetition / return |
| --- | --- | --- | --- | --- |
| B01 | Jar scatter on a rocky, sandy slope under sun shafts; nothing else | Anomaly: a wreck with no ship | Present-day establishing shot; the absence is the hook | Becomes the loop frame (B09) |
| B02 | Wider view: surface glow, slope dropping away, two distant divers, rising bubbles | Where, how deep, only jars | Context and person scale | Same jar field, wider |
| B03 | Ship heels in a storm, then slips under; the picture drains to paper on the doubt line | A possibility, cause unknown | **Reconstruction**, labelled "ภาพจำลอง" on every frame | The only ship and sea-surface beat |
| B04 | Sand settles and light shifts, then the hero jar: base, handles, incised lines lit one by one | Wood gone; the jar is the clue (`CL01`, `CL02`) | Time-lapse, then a demonstration close-up | First close-up |
| B05 | A small diver hovers over one jar in a shaft, then a held silence | Misdirection (`CL03`) | Person against an old object; scale shows the doubt | Diver returns as an observer, not an actor |
| B06 | The hero-jar silhouette match-dissolves onto a warm, page-like ground with a faint pyramid | Twist: same forms in Egyptian finds | Match dissolve (shape continuity carries the claim) | New warm key, first time |
| B07 | Two jars side by side with feature lines linking them, then back to the sunlit seabed jar | Method (typology) and result | Comparison diagram, painted | Returns home with the answer |
| B08 | Slow pull-back over the whole field; shafts move | Record, with the caveat | Wide summary | Echoes B02, now known |
| B09 | Dark jar mouth, then ease back to the B01 framing | Open mystery (residue) | Close-up into the unknown, then the loop | Seam to B01 |

Factual status: the B03 ship, crew, weather and sinking are invented, and labelled as such (U03, F006). The jar forms follow F004. The slope follows F014. The B06 pyramid is allowed because the attributed VO names Giza. Anchors are not drawn (F007). No logos.

## Scene decisions

| ID | Decision | Why / fallback |
| --- | --- | --- |
| VD01 | All picture is p5.brush in one `BrushCanvas` per frame. Shots switch by time inside one paint function. | User-chosen engine; the spike proves the sea, storm, jars and divers. Fallback: none needed for the medium. |
| VD02 | All light and glow (sun shafts, lightning flash, feature spot, bubbles, jar-mouth vignette) are screen-blended Remotion SVG layers above the canvas. They use the same camera transform as the canvas. Peak opacity is ≤0.3. Exception: the lightning flash may reach 0.85 for ≤6 frames, because it is the one cold-light moment. | p5.brush cannot glow, and small circles render as squares, so bubbles are SVG. |
| VD03 | **Ship (B03):** generic small cargo boat in dark silhouette. Long, low hull with high curved posts, a single mast with a small, partly torn square sail, and a stern steering oar. No deck rail pattern, no readable jars, at most two tiny crew silhouettes. | No hull survives, so the type and rig for c. 2500 BC are **uncertain** (fact-check: "do not add details that read as evidence"). Fallback if the user prefers: bare mast with the sail lowered. See Q2. |
| VD04 | **"ภาพจำลอง" label** on every B03 frame, including the dissolve out. White Thai text with a dark outline, at about x 120, y 300–350: inside the safe box, above the caption band, and clear of the top UI. Remotion layer, never painted. | Boat condition. The runtime eyebrow sits at y ≈163, inside the top UI margin, so a position option is a Boss gap. |
| VD05 | **Seabed:** a rocky slope that is partly sand and partly rock, falling from upper left to lower right. Sand patches lie above y 860. Shaded rock shelves fill the lower frame. Jars are half-buried (clipped at the sand line), some broken. | F014, and the shaded rock keeps the caption band dark (VD07). |
| VD06 | **Hero jar (B04, B06, B07, B09):** ovoid body, flat base, two side handles, raised clay belt at the widest part, two parallel incised lines on the upper part, zigzag in the middle. Lying on a rock ledge with its base clear of sand. | F004 form note. The broken and plain variants stay in the field. |
| VD07 | **Captions:** `outline` preset, `position: 'middle'` (centred at y 960, band y 860–1248), cue text verbatim from the script. Band background must measure mean ≤0.25, p95 ≤0.40 (`scripts/caption-zone.py`) on every shot's first frame and longest cue. The spike measured S3 sand at 0.57 / 0.658. Fixes: dark rock shelf under the band, shafts fading to 0 by y 820, the warm B06–B07 ground vignetted dark below y 840, and the flash gradient falling to ≤0.1 by y 860. | Readability. Fallback: `captionStyle.preset: 'box'` for the whole video if any shot still fails. |
| VD08 | **Transitions:** cuts by default. Dissolves (B03 out to paper, B06 match, B07 return, B09 ease-back) are done in-canvas as wash-opacity ramps of the incoming plate over the outgoing one, because two canvases cannot coexist. | Untested; this is a Boss spike. Fallback: hard cut on the same jar outline (the match still reads). |
| VD09 | **Loop:** SH09b ends on the SH01 frame-0 framing and light. Time-varying elements (shafts, caustics, particles, fish) use phases that match at both ends. | `B_loop`: hold, then the shared seam. |

## Timed shot list (estimated; re-time to the Premwadee read)

Engine: **P** = p5 canvas (washes, ink, motion); **R** = Remotion layer (glow, label, captions, chrome). Every shot also has R for the captions and chrome. Lead ≥480 px tall (jar group or ship incl. mast) unless noted.

| Shot | Beat | s | Content / framing | Camera | Light | Key events | Engine | Captions (verbatim cues) | Transition / audio |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SH01 | B01 | 0.0–6.0 | Jar scatter on the slope from slightly above (spike S3 framing). 8–11 jars, near jars ≥220 px, group y 480–850. No divers. | Push 1→1.05 | Shafts from upper right; caustics on the sand | Nothing but jars (the absence) | P + R shafts | ซากเรือที่ไม่เหลือตัวเรือ… / อาจเป็นซากเรืออับปางที่เก่าแก่ที่สุดเท่าที่เคยพบ / แล้วจะรู้อายุมันได้ยังไง? | Open cold on ambience; music in low on the question |
| SH02 | B02 | 6.0–12.0 | Wider: surface glow at the top, slope dropping right, the same jar field smaller, two distant diver silhouettes (no faces) | Slow tilt down / pull back | Surface glow, shafts | Bubbles rise from the divers | P + R bubbles, shafts | ก้นทะเลนอกเกาะเคโควา ประเทศตุรกี / ลึกราว 30 เมตร / ตัวเรือหายไปหมดแล้ว… / เหลือแค่ไหดินเผา กว่า 30 ใบ | Cut; bubble SFX |
| SH03a | B03 | 12.0–14.4 | Storm sea; ship silhouette (VD03) mid-frame, hull ≈720 px, ship incl. mast ≥480 px tall, y 330–830; big swell in front | Bob and drift | Slate sky, cold | Ship heels, sail tears and flaps, rain | P + R label | เรือลำนี้จมเพราะอะไร ยังไม่มีใครรู้แน่ | Hard cut in; storm audio starts; music out |
| SH03b | B03 | 14.4–17.0 | Same set, closer swell | Slight push | Lightning flash on "อาจเป็นแบบนี้" | Ship heels further and slips behind the swell (lead shrinks by intent). On "หรืออาจไม่ใช่เลย" the picture freezes and drains to paper | P + R flash, label | อาจเป็นแบบนี้… หรืออาจไม่ใช่เลย | Thunder on the flash; hard cut to near-silence on the doubt; label stays until the last drained frame |
| SH04a | B04 | 17.0–20.6 | SH01 field, slightly lower angle | Very slow push | Light shifts across the sand (time passing) | Sand settles over the jars; no planks or ghost hull | P + R shafts | ที่รู้คือ ไม้ผุสลายไปหมด… / ไม่มีไม้ให้ตรวจอายุด้วยคาร์บอน | Paper → seabed dissolve (VD08); ambience thinner; low pulse |
| SH04b | B04 | 20.6–24.5 | Hero jar (VD06) on a ledge, ≥600 px long, y 360–830 | Slow drift | Soft top light; R spot (≤0.3) moves base → handles → lines | Each feature gets a boiling ink trace on its word | P + R spot | เบาะแสหลักคือตัวไห: / ก้นแบน… หูจับสองข้าง… มีลายขีดบนผิว | Cut; three ticks on the three words |
| SH05 | B05 | 24.5–31.0 | Small diver (≈180–250 px, scale shown by intent) above one jar in a shaft; group ≥480 px | Slow drift, then hold | One shaft | Diver hovers; no face or hand acting | P + R shaft, bubbles | แต่ไหพวกนี้ เคยหลอกได้แม้แต่หัวหน้าทีมสำรวจ / เขาเล่ากับบีบีซีว่า / ตอนแรกนึกว่ามันอายุแค่… ร้อยสองร้อยปี | Music thins out; silence after the last word |
| SH06 | B06 | 31.0–36.5 | Hero-jar silhouette fixed in frame; seabed dissolves to a warm page-like ground with a faint pyramid silhouette (no text) | Locked, then slight push | Teal → warm ochre | Match dissolve lands on "รูปทรงเดียวกัน" | P (in-canvas dissolve) | จนเขาไปเห็นไหรูปทรงเดียวกัน / ในงานวิจัยโบราณคดีอียิปต์… / บางแบบคล้ายที่พบที่กีซา | Riser ends into a low boom on "รูปทรงเดียวกัน"; warm music colour |
| SH07a | B07 | 36.5–40.6 | Two upright jars side by side (left teal seabed jar, right ochre reference), each ≥480 px tall, y 300–830 | Locked, then slow push | Split key | Three pale ink lines link base, handles and lines on "เทียบรูปทรงและลาย" | P | นี่แหละวิธีหาอายุ: / เทียบรูปทรงและลายของไห กับไหที่รู้อายุแล้ว | Cut; fuller music |
| SH07b | B07 | 40.6–43.5 | Back to the hero jar on the seabed in sunlight | Slow push | Shafts brighten (≤0.3) | — | P + R shafts | ผลคือราว… 4,400–4,700 ปี | Dissolve; swell on the number |
| SH08 | B08 | 43.5–49.5 | Pull back over the whole field on the slope; distant divers | Pull-back | Shafts moving | No logo or branding | P + R | กินเนสบันทึกให้เป็นซากเรืออับปางที่เก่าที่สุดเท่าที่รู้จัก / แต่ทีมเองบอกว่า ตัวเลขนี้ยังเป็นผลเบื้องต้น | Cut; music eases |
| SH09a | B09 | 49.5–52.2 | Close on one jar mouth: dark interior with a stain inside the rim | Slow push in | R vignette into the dark mouth | — | P + R | และบางใบ ยังมีคราบอยู่ข้างใน… | Cut; music back to the B01 colour |
| SH09b | B09 | 52.2–56.5 | Ease back to the exact SH01 frame-0 framing; hold from 53.5 | Pull-out, then hold | SH01 light | Seam matches SH01 (VD09) | P + R | ที่ยังไม่มีใครรู้ว่าคืออะไร (held) | In-canvas dissolve; music out by ≈55.0; ambience only into the seam |

13 shots, 56.5 s. If the TTS read runs over 60 s, the script's trim order applies. Shots re-time to the cue boundaries, with no story change.

## Technical handoff

- **Projection contract:** each shot is a painted 2D plate in composition pixels (1080×1920), with origin at the top-left (`BrushCanvas` undoes the centre origin). The camera is a picture-stage push/drift owned by one `camera(shot, tl)` function, which the canvas and every R layer share (as the spike does). Rain and particles are screen-space, after `pop()`. Shot-local clock for picture; composition clock for audio and captions.
- **Scale baseline** (Film estimate, not a claim; never stated on screen):
  - Jar about 0.6 m long, unsourced.
  - Diver about 2.3 m from head to fin tip, about 4 jar lengths at the same depth.
  - Ship about 10 m (F006 inference); crew silhouettes about 1/6 of the hull length.
  - Seabed pseudo-perspective: haze line y ≈470; jar length ≈ 250 px × (y − 380)/380 at its sand line, ±25 %.
  - Calibration view: SH01. The spike's sizes deviate within that tolerance; Boss conforms.
- **Dev findings:** index checked 29 Oct 2026; no painted-2D entry exists. `DF-20261028-zcondo-sp01-corridor-plate` (middle captions readable in the band) supports VD07. The spike's lessons are in p5-feasibility.md: bleed scales with polygon size, so use bands plus a flat underlayer; fills are translucent, so clip rather than cover; set the ink after fills.
- **Runtime status (this checkout):**
  - `BrushCanvas` and the spike: `exists-unintegrated` (no reference outside `src/painted/`).
  - Painted scene type, painted label slot, `src/videos/oldest-shipwreck/`: `missing`.
  - Captions `outline`/`middle`/`box` and `B_loop`: reported `existing-integrated` in remotion-toolkit 10a; Editor verifies.
- **Measured spike cost:** 270 frames in 43.8 s incl. bundle, so the 1,695 frames should take about 5 min (estimate). Determinism: frames 135 and 225 matched on re-render.

**Boss dependencies (before Editor):**
1. **Painted scene type in the timeline:** types, validator, `SceneRenderer` dispatch, and a registry of paint functions by ID with a shot-local clock. Captions, chrome, label and audio stay Remotion. Proof: one painted shot in a registered composition renders, seeks and stays deterministic.
2. **Reusable painted modules moved from the spike into `src/painted/`:**
   - `drawJar`: bury, broken, hero features (belt, incised lines, zigzag) and a per-feature trace progress.
   - `drawShip`: simplified per VD03.
   - `drawDiver`: silhouette.
   - The seabed/sea band-plus-underlayer helpers.
   - The `wash`/`ink` painter helpers.
   - The shared camera, with the R overlay layers (shafts, flash, spot, bubbles, vignette) following it.
3. **In-canvas dissolve spike** (VD08). Acceptance: SH03b→SH04a and SH06 sampled every 3 frames, with no flicker in the motionless washes and the jar outline identical across the match.
4. **Label slot** at y 300–350 (eyebrow position option or a painted-scene field).
5. Typings for any new p5.brush calls.

**Acceptance for every shot:**
- Leads above the band and ≥480 px unless noted.
- Caption-zone pass (VD07).
- Label visible on all B03 frames.
- No hull on the seabed.
- Deterministic re-render.
- One-second contact sheet plus the qa-sheet viewed.
- Loop seam SH09b → SH01 checked.

## Open for the user

- **Q1 look check — answered 29 Oct 2026:** user approved the s2/s3 look with the listed fixes (darker S3 sand for the caption band; fill the empty lower halves and remove the ink blotches in S1/S2).
- **Q2 ship rig — answered 29 Oct 2026:** small, partly torn square sail, labelled "ภาพจำลอง".
- **Q3 voice — answered 29 Oct 2026:** Edge TTS Premwadee (female) at +5%. Timing is still estimated; the B01–B02 sample ran 12.0 s against 12.0 s estimated.

Change log: coordinator for Film, 29 Oct 2026 — recorded user answers to Q1 and Q2; Q3 answered later the same day (Premwadee +5%).
