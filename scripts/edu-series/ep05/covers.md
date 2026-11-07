# EDU-EP05-SHORT — cover options (Film, 2026-11-07)

- Revision: **EDU-EP05-COVERS-R1** (Film). Rules: [cover-principles](../../../docs/cover-principles.md) CV01–CV10, [user-taste](../../../docs/user-taste.md) UT02/UT03/UT13.
- Request (user, 2026-11-07): "ทำปกให้หน่อย ฟิล์ม 5 แบบ วาดใหม่ได้" (five covers, new art allowed); then "ขอปก clickbait สัก 1 version นะ" (one clickbait version). Answered with the five CV09 angles A–E plus **F = CLICKBAIT** as a sixth option.
- Inputs: script EDU-EP05-SCRIPT-R1.3a/R1.4 ([script.md](script.md); video title "ถ้าคุณตัวเล็กเท่ามด", never repeated word for word on a cover, CV02), fact-check ([fact-check.md](fact-check.md); L02 "แทบ" margin, L06 "ราว ๆ"), brief EDU-BRIEF-R1.1 ([brief.md](brief.md); set plans, VD02 TINY casting), final cut `out/EDU-EP05-SHORT/EDU-EP05-SHORT.mp4` (R1.11b, frame scan for picking).
- Route (CV07, series precedent EP01–EP04): composition `EDU-EP05-SHORT-COVERS`, data [src/videos/covers/edu-ep05.ts](../../../src/videos/covers/edu-ep05.ts) (registry plates `EDU5-<shot id>` at a shot-local frame, text as overlay). Each option has **Route P** (plate, comp rendered now) and, where the plate is weak, **Route N** (new art for Boss; the user allowed new painting, so the CV07 reason is "a closer, larger subject than any film frame"). A Route N cover must also exist as a film-consistent moment (CV04): it re-frames a moment that happens in the video, it never adds an event.
- Episode cover style: accent `#ffb63a` (morning sun / crumb gold; warm against the green grass and the blue shade), near-white rest, dark outline, scrim from y 1120; Noto Sans Thai 800, headline at y 1340, sub-line at y 1470 (CV08, as EP01–EP04). `@TamMaiLa` top-left from the shared chrome.

## Rough comps (Route P, rendered and viewed)

Rendered `node scripts/render.mjs EDU-EP05-SHORT-COVERS --stills --frames=15,45,75,105,135,165` (cover = scene frame 15 of each 1 s scene).

- Covers: `out/edu05/covers/EDU-EP05-SHORT_cover-{A..F}.png` (1080×1920); store `projects/EDU/covers/EDU-EP05-SHORT_cover-{A..F}.png`.
- Sheets: `out/edu05/covers/sheet-270.png` and `sheet-120.png` (CV10 phone grid); store `projects/EDU/covers/sheet-270.dd506b14.png`, `sheet-120.2c75865e.png` (renamed by the store: an older EP sheet holds the plain name).
- Viewed by Film: both sheets. All six headlines read at 120 px wide. Sub-lines read at 270 px; at 120 px they are soft but the headline carries each idea alone (CV10 exception). F's premise tag "ถ้าตัวเท่ามด" does not read at 120 px (see F).
- Not viewed: the 3:4 centre crop as a separate image (by layout: all text sits in y 1250–1470 and every subject in y 300–1100, both inside y 240–1680); full-size pixel check. No Route N art exists yet, so none of the Route N layouts is viewed.

## Options

Common checks for all six: text is overlay, not painted (CV07); headline ≤ 5 Thai words, cap height ≥ 135 px (sizes 150–220); text centred on x 540 inside x 120–960 (E reduced to 150 for this); last baseline ≤ 1470, clear of the bottom 20 % (y > 1536) and the right 120 px (CV06); no cover shows the crumb lift (the payoff, CV04).

### A — Question: "รอดไหม?" (the grass forest)

- **Promise:** a body the size of an ant, in a world where grass is a forest: can you get through it? (The whole video is that trip.)
- **Text:** headline **รอดไหม?** (accent, 200); sub **ในโลกที่หญ้าสูงเท่าตึก** (white, 88).
- **Route P (rendered):** `EDU5-S01-B01-SH04` l16: TINY just shrunk, standing on the planter soil, hands at her mouth, the blades towering over her, dew beads. Casting `woman-bob + new: morning-pyjamas, P01-like, surprised`.
- **Check:** CV01 one idea (tiny in giant grass) yes; CV03 subject is medium (TINY ≈ 30 % of frame height), clear against the blades; CV04 the sub "หญ้าสูงเท่าตึก" is picture language (blades 20–38 sm vs TINY 1.58 sm = 13–24× her height), not a spoken claim; acceptable as a figure of speech, Boat may veto.
- **Route N (optional upgrade, "tiny on the edge"):** see [handoff N-A](#n-a--tiny-on-the-lip).

### B — Subject: "ติดหยดน้ำ!" (the dew drop)

- **Promise:** water that grabs you and will not let go; the video shows why (surface tension, L09).
- **Text:** headline **ติดหยดน้ำ!** (accent, 192); sub **ดึงยังไงก็ไม่หลุด** (white, 92).
- **Route P (rendered):** `EDU5-S01-B03-SH02` l43: TINY leaning back, hand inside the drop, the drop stretched like jelly toward her. Casting `woman-bob + new: morning-pyjamas, new: brace-pull (as built), angry-strain`.
- **Check:** CV01 yes; CV02 the sub overstates slightly (she does pop free at V04) but it is TINY's own experience in L08–L10 ("ทำไมน้ำมันเหนียวแบบนี้!") and the cover shows the setup only, so CV04 holds; CV03 the drop is the brightest shape on frame; the face is small (UT02 asks for the hero to be large: the drop is).
- **Route N (recommended upgrade):** [handoff N-B](#n-b--face-and-drop-close).

### C — Face: "หนาวจนสั่น" (cold in the shade)

- **Promise:** standing in the shade of grass is enough to freeze you; the video says why (skin vs body, L12).
- **Text:** headline **หนาวจนสั่น** (accent, 192); sub **แค่ยืนในร่มหญ้า** (white, 92).
- **Route P (rendered):** `EDU5-S01-B04-SH02` l100: TINY front, P42 `hug_self`, blue shade, a warmth puff at her head. Casting `woman-bob + new: morning-pyjamas (wet), P42, worried`.
- **Check:** CV04 stays inside C11 (cold "ในร่ม" only, never in sun); CV03 weakest of the six: medium-wide, the face is about 9 % of frame height, the puff reads as a smudge at 120 px and the blue plate is low in contrast under the scrim. Route P is a placeholder; Route N is needed for C to compete.
- **Route N (needed):** [handoff N-C](#n-c--shiver-close-up).

### D — Mystery: "มดยกไหว / แล้วคุณล่ะ?" (the ant and the crumb)

- **Promise:** an ant can carry a load bigger than itself; can you, at that size? Opens the twist without showing it (the lift stays in the video).
- **Text:** headline **มดยกไหว** (accent, 200); sub **แล้วคุณล่ะ?** (white, 96; L16's own opening "แล้วคุณล่ะ…").
- **Route P (rendered):** `EDU5-S01-B05-SH01` l44: the ant passes with its leaf sail held high; TINY crouched beside the crumb, watching. Casting `woman-bob + new: morning-pyjamas, P33-like crouch, surprised`; `new: ant (EDU5 ant.ts) + leaf L1, walk`.
- **Check:** CV01 yes (ant vs load vs tiny human); CV04 "ยกไหว" = L14 "แบกของหนักได้หลายเท่าของตัว" with "บางชนิด" dropped; the picture shows one ant carrying a leaf, so the cover claims only what the video shows; no multiple. CV03: the leaf is big and bright; the ant itself is small at 120 px.
- **Route N (recommended upgrade):** [handoff N-D](#n-d--side-by-side-size-check).

### E — Number: "10 ชั้น = เก้าอี้?" (the fall that is a chair jump)

- **Promise:** a ten-storey fall that lands like hopping off a chair; the video gives the reason (air vs weight, L05–L06).
- **Text:** headline **10 ชั้น = เก้าอี้?** (accent, 150; the "?" carries Boat's "ราว ๆ" hedge); sub **ตกแล้วแรงแค่นี้** (white, 92).
- **Route P (rendered):** `EDU5-S01-B02-SH04` l46: TINY sitting up on the thatch after the landing, mouth open, unhurt. Casting `woman-bob + new: morning-pyjamas, P33-like sit, surprised`.
- **Check:** CV02 headline is 4 units but narrow letterforms forced 150 px (still ≥ 135 px cap, reads at 120 px); CV04 L06 says "ราว ๆ กระโดดลงจากเก้าอี้" (`calc`, fact-check N4d), the "?" keeps it a question; CV09 E angle (number).
- **Route N:** none proposed; a split "tower | chair" diagram would read as a chart, not as the film (UT11 painted, CV07). Keep Route P.

### F — CLICKBAIT: "ตก 10 ชั้น ไม่ตาย!?"

- **Label:** **CLICKBAIT** (user, 2026-11-07). Shock-and-curiosity framing: big absolute-sounding line, red circle and arrow on a speck.
- **Promise:** fall ten storeys and live. The video delivers it literally: L02 "ตกจากตึกสิบชั้น… คุณจะแทบไม่เป็นอะไรเลย", B02 shows the fall from her tenth-floor balcony, L06 and B02-SH04 show the soft landing, unhurt.
- **Text:** line 1 **ตก 10 ชั้น** (white, 170, y 1250); line 2 **ไม่ตาย!?** (accent, 220, y 1450); premise tag **ถ้าตัวเท่ามด** (small dark pill at the top, y 262–328, 40 px).
- **Route P (rendered):** `EDU5-S01-B02-SH03` l16: the facade from the lawn, ten balcony slabs converging up, TINY a speck mid-fall inside the film's ring marker; overlay red `#ff3b30` circle (r 105 at 500, 712) and a curved arrow from the headline to it.
- **Why it stays honest (CV04, fact-check):** (1) "ไม่ตาย" is weaker than the script's own claim ("แทบไม่เป็นอะไรเลย" = barely hurt), so it promises less than the video gives; it avoids "ไม่เจ็บเลย", which would drop Boat's "แทบ" margin. (2) "!?" keeps it a question and a surprise, not a stated fact about real people. (3) The premise "ถ้าตัวเท่ามด" (L03, required line) is on the cover; it only reads at 270 px and up, so on the 120 px grid the title of the video carries it. (4) The circled speck is a real frame of the film (B02-SH03), and the ring is the film's own marker; nothing on the cover is bigger, faster or more dangerous than the video. Not done: no fake blood, no ambulance, no "real story", no number beyond "10" (spoken in L02/L04/L06).
- **Check:** CV01 yes; CV02 two short lines, 4 words; CV03 the subject is a speck (the red circle makes it the subject; weakest subject size of the six); CV05 three text colours (white, gold, pill white) plus the red graphic.
- **Route N (recommended upgrade):** [handoff N-F](#n-f--falling-close-tower-behind).

## Recommendation

- **Pick now from Route P: B "ติดหยดน้ำ!"**: the strongest single picture at 120 px (a bright drop and a body pulling against it), a question the viewer cannot answer from the cover, and a payoff in the video at 0:23–0:34.
- **If Boss paints one new cover: N-D "มดยกไหว / แล้วคุณล่ะ?"**: it sells the twist (the reason to watch to the end) and the side-by-side scale is the episode's one-glance idea. **F (CLICKBAIT)** is the highest-pull text, but its Route P subject is a speck; with N-F it becomes the strongest hook. C should not be picked as Route P.

## Boss handoffs (Route N, new art; not painted, Film does not paint)

Common: painted 3D camera ([painted-3d-camera](../../../docs/film-visual-brief-workflow.md#painted-3d-camera)); sets and units from [brief set plans](brief.md#set-plans-est-until-the-look-frames) (macro sets in set metres `sm`, k 320; TINY `woman-bob` 4-head rig 1.58 sm tall, head ≈ 0.40 sm; ant body 1.6 sm long, back ~0.5 sm, leaf top ~2.0 sm, `ant.ts`; drop D1 Ø 1.1 sm). Camera lines use the sheets' notation `cam: target, yaw, r, eye, f (px), hy (px)` (r, eye in set units; values **est**, Boss tunes to the acceptance numbers). Output: a still plate `EDU5-COVER-<letter>` in `src/painted/edu05/` (look-index style, like `EDU5-LF01`), one frame; then the cover entry switches its `plate`/`local` to it. Every acceptance is measured on the 1080×1920 still and the 120 px sheet. Text zone y 1120–1500 stays free of faces and the hero object (the scrim sits there).

<a id="n-a--tiny-on-the-lip"></a>
### N-A — tiny on the lip (option A)

- **Moment:** B02-SH01 lift-off point (in the film). TINY sits on the planter's outer lip, legs over the edge, looking down the ten-storey drop.
- **Set:** SET-MACRO-PLANTER (sm): lip top y 1.3 at z −6.4; TINY sits at (−0.4, 1.3, −6.4), facing −z (back three-quarter to camera), legs dangling past the lip; 2–3 blade clumps behind her (existing `macro.ts` blades). Beyond the lip: the look-down facade (`facade.ts` `paintFacadeDown`, existing) in haze, lawn 27 m below.
- **Camera:** `cam: (−0.4, 1.6, −6.4), yaw 160, r 3.0, eye 3.4, pitch −35, f 950, hy 520` (est: above and behind her, looking down past her over the edge).
- **Cast:** `woman-bob + new: morning-pyjamas, new: sit-on-edge (legs hanging, hands gripping the lip either side), worried` (look `right`/`back` three-quarter).
- **Exists:** TINY rig, outfit, blades, facade look-down, sky. **New:** the sit-on-edge pose; the composite of macro planter and look-down facade in one frame (two scales: the facade is a backdrop card at its own camera, matched horizon).
- **Accept:** TINY ≥ 18 % of frame height, head at y 450–650; facade slabs visible converging below her feet in y 700–1100; no text-zone overlap.

<a id="n-b--face-and-drop-close"></a>
### N-B — face and drop close (option B)

- **Moment:** L08–L10 (B03-SH02/SH03), the pull.
- **Set:** SET-GARDEN-GRASS (sm): D1 on `B-DEW` contact centre (+2.2, 1.15, −1.0), contact state (c) "pull" stretched toward her (existing `drop.ts` states); TINY braced at (+1.2, 0, −0.6), leaning back 12°, right hand in the drop.
- **Camera:** `cam: T-DROP→midpoint (+1.7, 1.2, −0.8), yaw 25, r 2.6, eye 1.3, f 1100, hy 900` (est: three-quarter front, low, both her face and the drop in a medium close-up; UT13 ≤ 3 sm).
- **Cast:** `woman-bob + new: morning-pyjamas, new: brace-pull (as built in B03), angry` (gritted, eyes squeezed; kit `angry` or `furious`, Boss chooses the one that reads at 120 px).
- **Light:** low sun back-left; the drop's hot rim and caustic (existing).
- **Exists:** all of it (drop states, rig, set). **New:** only the camera framing.
- **Accept:** head ≥ 260 px tall; drop ≥ 380 px wide; face and drop both in y 300–1100; the stretched neck of the drop connects to her wrist on frame.

<a id="n-c--shiver-close-up"></a>
### N-C — shiver close-up (option C)

- **Moment:** L12 (B04-SH02), the warmth puff gag.
- **Set:** SET-GARDEN-GRASS shade pocket (sm): TINY at (−1.4, 0, −0.8), front; cool blue air wash `#6f8fb0`; the sunlit clearing behind her right shoulder as a warm patch.
- **Camera:** `cam: T-TINY (−1.4, 1.30, −0.8), yaw 0, r 1.6, eye 1.3, f 1100, hy 760` (est: medium close-up, head and hands).
- **Cast:** `woman-bob + new: morning-pyjamas (wet, VD10), P42, worried` with shiver offset (`MOTIONS['shiver']` at peak); two cosy orange puffs (`effects.ts` warmth-puff, core `#f4a259`) leaving the top of her head and shoulder, one half-escaped through her fingers.
- **Exists:** rig, pose, puffs, set. **New:** the framing; puff placement for the still.
- **Accept:** head ≥ 330 px tall; puffs ≥ 140 px each and lighter than the background; subject value contrast vs the blue shade ≥ the B03-SH02 cover; nothing important under y 1120.

<a id="n-d--side-by-side-size-check"></a>
### N-D — side-by-side size check (option D, recommended)

- **Moment:** B05-SH01/SH02, the ant stopping beside her (before the lift).
- **Set:** SET-GARDEN-GRASS (sm), backlit clearing: ant stopped at (+1.2, 0, −2.0) profile `right`→ turned to face camera three-quarter, leaf L1 up like a sail (top ~2.0 sm); TINY standing at (−0.6, 0, −1.8), profile toward the ant, crumb C1 (0.85 × 0.60 × 0.50) on the ground at her feet (not lifted).
- **Camera:** `cam: T-PAIR (−0.3, 1.0, −1.9), yaw 0, r 4.2, eye 0.9, f 1000, hy 820` (est: level, side-on, both at the same depth so the heights compare honestly).
- **Cast:** `woman-bob + new: morning-pyjamas, P01-like stand with head tilted up to the leaf, surprised`; `new: ant (EDU5 ant.ts) + leaf L1, idle, antenna toward her`.
- **Exists:** ant, leaf, crumb, rig, set. **New:** the framing and TINY's look-up pose.
- **Accept:** TINY and the leaf top within 15 % of each other in screen height (the leaf slightly taller); ant body ≥ 300 px long; crumb visible at her feet; all in y 300–1100.

<a id="n-f--falling-close-tower-behind"></a>
### N-F — falling close, tower behind (option F, CLICKBAIT)

- **Moment:** L04–L05 (B02-SH02, the drift), placed against the facade so the ten storeys and the person read in one frame.
- **Set:** SET-FACADE (metres): facade plane z 0, slabs every 2.9 m, her balcony at y 27.0. TINY real size 0.005 m (1.58 sm / 320) at (0.3, 14.0, 1.5) (mid-fall, halfway down).
- **Camera:** forced-perspective macro: camera 0.025 m from her, `pos (0.3, 13.99, 1.525)`, looking up past her at the facade, pitch +40, f 900, hy 1000 (est). She fills the lower-middle of the frame; the ten slabs converge up behind her to her balcony at the top. Optional small "10" floor tag next to her balcony slab (overlay, not painted).
- **Cast:** `woman-bob + new: morning-pyjamas, new: drift-spread (as built), shock` (eyes wide, mouth open), hair blown up; 3–5 soft air streaks hugging her (existing `effects.ts` drift streaks; slow, no radial speed lines, VD07).
- **Exists:** facade (`facade.ts` up-view `paintFacadeUp`), TINY drift pose, air streaks. **New:** the composite of a macro-close figure against the human-scale facade (two scales in one frame, as N-A).
- **Accept:** TINY ≥ 30 % of frame height with the face ≥ 200 px; facade slabs readable as a tall building (≥ 6 slabs visible) behind her; her face in y 500–1000; the cover then drops the red circle (the subject is large) and keeps the arrow optional.

## Open items

- User pick of one cover (coordinator asks with the structured-question tool, CV `When`); then `EDU-EP05-SHORT_cover.png` beside the MP4 and in the delivery record.
- If a Route N option is picked, Boss paints it; Film checks the plate against this sheet, then the cover data switches plate.
- Boat may check A's sub "หญ้าสูงเท่าตึก" (figure of speech) and F's "ไม่ตาย" before delivery.

## Change log

- **EDU-EP05-COVERS-R1 (Film, 2026-11-07):** six options A–E + F CLICKBAIT, Route P comps rendered and viewed at 270/120 px, Route N handoffs N-A, N-B, N-C, N-D, N-F.
