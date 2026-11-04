# EDU-SERIES build notes

## W3.1 LF02 v5 back-of-head fix (2026-11-04, Film)

User approved this repaint (2026-11-04) after [viewer-check-lf-v3](short/viewer-check-lf-v3.md) failed LF02 on facing direction; the user keeps the v3 look over v4, so the scene, palette, cliff and figure scale are v3's. References viewed again (the three in `projects/EDU/references/web/`): from behind, a bob's back hem sits close to the collar with at most a dark sliver of neck; the hair is one dark mass to the shoulders. Painter: `paintBowedHeadBack` and `paintDreamer` in `src/painted/edu01/set.ts`; nothing else changed.

| Fix (viewer check v3) | Change |
| --- | --- |
| 1 no skin at the nape | Notch under the hem filled in `mix(hair, '#4a3c64', 0.26)` (hair shadow, no skin mixed in) from the hem to the collar; curtains closed to an inner edge of ±0.3 K (the build-notes fallback). |
| 2 back of a bob, not bangs | Back hem shortened to v 0.85–0.91 K and uneven (six points, not mirrored) with short lighter strand tips; side curtains run lower (outer to v 1.1–1.15 K, under the shoulders). |
| 3 show the bow | Whole head rolled 6 degrees about the nape (0, 0.95) K, top toward the cliff edge; crown moved down to (0.08, −0.24) K so the radiating strands fill more of the shape. Dome kept 1.14 × 1.0 K: a flatter 0.92 K dome and a 10 degree roll both exposed a grey crescent of the rig head underlay at the top left (tried, dropped). |
| 4 back-of-shirt cue, soften the flat panel | Opaque (`p.flat` + `solid`) only across the shoulder tops down to 1.05 K under the shoulder line (it must still hide the rig neck and the rig's V-collar line); below that a translucent wash (150) that lets the rig's painted shirt through, a cool shadow wash down the left side; crew collar band (pale rib line plus a darker stitch line 0.09 K under it) and a broken centre back seam. A light wash on the right shoulder was tried and dropped (read as a stain). |
| 5 feet facing away | The rig's front-view foot ovals painted out in the ledge's local tone (sampled from the v3 render, left `#dcc4c3`, right `#dcd2d2`), then a small cool contact shadow, a narrow heel (0.17 × 0.1 K) and a trouser hem over it. Foot centres measured on the v3 render (±0.46 K from `a.feet`, 0.13 K above). |

Casting line: `woman-bob + new: pyjama (shoulder 0.42), P01 back, new: bowed head back (v5)`.

Render: `printf 'EDU1-LF02 0 out/edu01/look/v5/LF02.png\n' | node scripts/stills.mjs src/painted/edu01/look-index.ts`. Determinism: two renders differ by max 1/255 on 7 channels. Caption zone 860–1248 mean 0.78 / p95 0.93 (fail, unchanged from v3; the W5 caption-shade decision stands). ESLint clean on `set.ts` (the unused `skin` parameter was dropped from `paintBowedHeadBack`). Store `projects/EDU/previews/look-frames/ep01/v5/`: `LF02.png`, `LF02-540.png`, `LF02-head-crop.png` (2x native crop x 450–690, y 350–650), `head-crop-v3-v5.png`, `sheet-v3-v5.png` (v3 | v5 at 270 px), `LF02-feet-crop.png` (4x crop x 500–620, y 735–795).

Frame check (viewed: 270 px sheet, 540 px still, 2x head crop, 4x feet crop): the skin notch is gone; at 270 px the head is one dark bob mass set between the shoulders with no face read; at 2x the crown strands, the short uneven back hem over a dark nape and the collar band with the centre seam show. The bow is still moderate: the 6 degree roll and lower crown are visible at 2x and 540 px but at 270 px "looking down" is carried mainly by the pose at the edge, not by the head alone. Feet read as heels under hems at 2x; at 270 px they are too small to matter.

Open: (a) fresh-eyes viewer check of v5 (not by the author); (b) the v3 shoulder cap still juts slightly past the right arm (a squared corner, visible at 2x; geometry unchanged from v3, left for the user's verdict); (c) faint remnants of the rig foot-oval ink at the outer edges at 4x, and the pencil stipple along the lip is interrupted under the feet (not visible at 540 px); (d) kit gap unchanged: a `bowed` back-view head state in `src/painted/kit/back.ts` (Boss, proposed) and a back-view foot (heel) in the rig so shots after SH02 do not repaint the feet.

## W3.1 LF02 v4 dream rework (2026-11-04, Film)

**Dropped by user choice (2026-11-04):** the user picked the v3 picture (the first tile on `sheet-v4.png`) over both v4 looks. LF02 renders the v3 path again (`paintDreamCliff` in `look.tsx`); the v4 code (`paintDreamV4`, `stampCloud`, `paperChip`, `floatRock`, the dream `Spot`, `EDU1-LF02B`) was removed so nothing dead remains; the v4 stills stay in the store as the record. Re-rendered LF02 equals the filed `v3/LF02.png` exactly (pixel diff max 0). Also fixed the two unused-variable ESLint errors in `set.ts` (`N` in `paintLyingHead`, `h` in `paintBedroom`; output unchanged). The section below is the record of the attempt.

User feedback on v3 (via coordinator): what still feels strange is the scene itself; "it is supposed to be a dream". Read again before painting: brief story-first line (the dream is made "of the same paint", read as imagined from the material, CL02), VD04 row (cloud washes, half-painted ledge, **no hard edge on the cliff**), review row S01-B03-SH02 (wide, small figure from behind at an unfinished ledge whose edge melts into paper, looking down into the clouds), concepts C2 (room melts into an abstract watercolour dreamscape), user taste UT01 (place reads at a glance), UT03, UT11. The v3 bowed-head painter is kept unchanged (`paintDreamer` wraps it).

Painter: `paintDreamV4(p, t, look)` in `src/painted/edu01/set.ts`, plus a screen-blended `Spot` halo for `kind="dream"` in `look.tsx` (`DREAM_GLOW` 600, 640, r 460, level 0.3). Shared by both looks:
- wet-in-wet colour blooms (eight `blob` washes, bleed 0.8) instead of horizontal sky bands, so there is no horizon line;
- a glow with no source behind her (four warm-white rings plus the `Spot`);
- the ledge as a floating tongue of paper: pale top face, rose underside that thins in three bleeding layers into cool lilac and a pencil contour, then breaks into drifting paper chips (`paperChip`; three of them float upward);
- small white specks drifting up through the glow; the dim drop straight under the edge kept for height.

| Look | Cloud sea and extras | Verdict |
| --- | --- | --- |
| `island` (picked, `EDU1-LF02`) | one cloud shape stamped in six rows (`stampCloud`) that grow toward the viewer (scale 0.55 → 1.8), the drop under the edge left open; three rocks floating in the air (`floatRock`, 86/52/34 px) | Reads as a dream at 270 px (floating rocks and ledge, repeated clouds, glow) and still reads as height: the rows shrink toward the edge, so the eye measures the drop. The figure stays the clearest shape. |
| `well` (alternative, `EDU1-LF02B`) | the same cloud stamped in six rings round a glowing hollow far below the edge (a funnel) | Strongly unreal, but the rings mass into a busy foam texture at 270 px that pulls the eye off the figure and reads less as clouds. Kept in the store for the user's comparison. |

Measured (v4 `island`): determinism max 1/255 on 8 channels across two renders; caption zone 860–1248 mean 0.68 / p95 0.88 (fail, as every look; the W5 caption-shade decision stands; lower than v3's 0.78 / 0.93 because the zone now crosses the rose underside). Figure and head unchanged from v3 (hair 128 × 107 px, feet y ~776).

Frame check (viewed): `sheet-v4.png` (v3 | v4 island | v4 well at 270 px) and the 540 px single still. Tried and dropped in this pass: a paper-white `p.flat` under the ledge (read as a flat pale lens); underside washes with bleed 0.3–0.35 (bled about 200 px above the lip into a maroon mound behind her); one rose wash with a straight bottom (hard edge, now three bleeding layers); rocks with a white top and faint cone (read as saucers).

Store: `projects/EDU/previews/look-frames/ep01/v4/` (`LF02.png` = island, `LF02-alt-well.png`, `sheet-v4.png`, `LF02-540.png`).

Open: viewer check of v4 by a fresh invocation; the narrow nape notch from v3 is unchanged (same risk); a darker mottle in the underside's left rose (watercolour pooling) is left as texture; `stampCloud` and `floatRock` are proposed for the kit (ENV layers) at intake if the user keeps the look.

## W3.1 LF02 v3 references: back view, bowed head (2026-11-04, Film)

User correction (via coordinator, 4 Nov 2026): the first v3 head attempt looked very strange (a V-shaped dip under a fringe-like hem read as a face in a V-neck); stop, study real back views, then repaint. References (internal shape study only, never composited) in the store with a sidecar each (source URL, licence, what was learned):

- `projects/EDU/references/web/2026-11-04_bob-rear-view-slight-bow.jpg` (Wikimedia Commons, CC BY-SA 4.0): black jaw-length bob, head tipped slightly forward.
- `projects/EDU/references/web/2026-11-04_bob-rear-view-upright.jpg` (Wikimedia Commons, CC BY-SA 4.0, Alex Neman): upright black bob, crew-neck tee.
- `projects/EDU/references/web/2026-11-04_nape-bowed-updo.jpg` (Wikimedia Commons, CC BY 2.0): hair up, head bowed, nape and ears.

Search note: a free photo of a standing person bowing the head at a ledge, seen from behind, was not found on Commons; a stock-site download was refused by the permission system and not retried. The shapes below come from the three references plus the bow geometry they show.

Shapes to copy (head units `K`, the cast's 4-head proportion kept):

1. **Hair silhouette = a bell, not a dome or helmet:** rounded top narrower than the base, widest at about 70 % of the hair height, a nearly straight horizontal hem with small rounded corners. No arch or split in the hem, no uneven fringe-like ends (those read as a face's bangs).
2. **Crown:** only a short pale parting line from the top edge down about 15 % of the hair height. Never a dot or whorl in the middle of the mass (read as an eye in v1/v2).
3. **Strands:** long near-vertical streaks, gently converging toward the parting at the top, fine light highlights in the lower half on the lit side; the mass stays one even dark value.
4. **Neck and nape:** under the hem a neck column narrower than the hair (about 0.45 of the hair width), in shadowed skin. Upright, almost no neck shows (hem nearly on the collar); bowed, the nape lengthens to about 0.15–0.2 of the hair height. Its sides run into the collar; never a square patch.
5. **Collar:** a shallow U crew curve at the neck base. A V reads as the front of a shirt.
6. **Shoulders:** they slope down and out from the collar (trapezius, about 15–20 degrees), then round over into the arms; real head width is about 0.6 of the shoulder width (the 4-head cast keeps its larger head). Rounded/hunched shoulders lift their inner tops slightly so they overlap the lower corners of the hair: the head sits down between them.
7. **The bow itself:** the head's top drops (crown lower relative to the shoulders than upright) while the hem stays horizontal; the cue is the longer nape plus the head sunk between the shoulders, not a tilt of the hair mass.

Second user correction (via coordinator, 4 Nov 2026): the repaint from points 1–7 "still looks strange"; study the perspective of a bowed head before painting. Points 4 and 7 above are superseded by the construction sheet below (a bowed head shows a **short** neck, not a longer one, and the bob hem does not stay level).

### LF02 v3 bowed-head construction sheet

Sketch: store `projects/EDU/previews/look-frames/ep01/v3/construction-sketch.png` (viewed; side view above, back view below, head units `K`). Painter: `paintBowedHeadBack` in `src/painted/edu01/set.ts` draws the whole head from these numbers (the rig head is only an underlay hidden by it, like `paintLyingHead` in LF01).

1. **Side view, tilt:** skull = ellipse 1.0 × 1.15 K, long axis tilted 40 degrees forward (face down toward the drop). The crown rotates toward the face and down; the occiput and nape now face the camera behind her. The neck leans forward from the shoulders to the skull base, so from behind it is foreshortened.
2. **Back view, skull and hair silhouette:** hair dome = half ellipse 1.12 × 1.0 K centred at the head centre; sides widen to ±1.2 K at v +0.3; below that the bob splits: the **side hair falls forward** past the jaw and hangs as two curtains to v +1.05 (outer ±1.0–1.18 K, inner ±0.46–0.62 K), while the **back hair ends higher** because the hem swings forward off the tipped skull.
3. **Crown:** at (0.06, −0.42) K, inside the mass (no longer on the top edge, because it rotated toward the camera). Strands radiate from it with no dot: up and over the top edge, sideways out to the edge then down the curtains (the forward fall), and down to the nape hairline (short, bulging with the occiput).
4. **Nape hairline = lowest edge of the back hair:** a soft W at v +0.66–0.72 between ±0.46 K, with two small points of hair at ±0.3 K.
5. **Neck:** a short skin column ±0.45–0.5 K from the hairline to the collar (visible length about 0.4–0.5 K, shorter than upright because it leans away), its top in the shadow of the hair mass (a cool wash v +0.6–0.85).
6. **Ears:** move up and back relative to the shoulders, but the forward-falling bob curtains cover them in this cut; not drawn (an ear would read as a handle at 27 px of head at 270 px).
7. **Shoulders and collar:** shoulder line at v +0.9 K (the head sinks so the nape hairline sits just above it); a shallow U crew collar dipping to v +1.2 K; the shoulders are nearer the camera than the forward head, so they overlap the curtain ends, then slope down and out about 15–20 degrees into the arms. For this shot the cast shoulder is widened 0.34 → 0.42 (`SLEEPER` copy in `paintDreamCliff`) so the shoulders are wider than the hair, as in the references.
8. **Light:** key from the upper right (`PAPER_LIGHT`): strands on the right half lighter; the shadow under the hair falls on the nape and the shoulder tops.

### LF02 v3 and LF04 v3 result

Render: `printf 'EDU1-LF02 0 out/edu01/look/v3/LF02.png\nEDU1-LF04 0 out/edu01/look/v3/LF04.png\n' | node scripts/stills.mjs src/painted/edu01/look-index.ts` (one Chrome). Store: `projects/EDU/previews/look-frames/ep01/v3/` (LF02, LF04, `sheet-v3.png` = v2 LF02 | v3 LF02 | v3 LF04 at 270 px, `construction-sketch.png`, `LF02-head-crop.png` = 2x native crop of the head).

| Look | Change | Casting line | Measured |
| --- | --- | --- | --- |
| LF02 | Bowed head per the construction sheet (`paintBowedHeadBack` draws the whole head; rig `nod [-0.18, -1.02]` keeps the rig head under it and centred on the torso, which `lean 0.1` had pushed 14 px off); cast shoulder 0.34 → 0.42 for this shot; shoulder caps and crew collar in the rig's lit shirt tone (`toneOf`, opaque). Strata: the four ruled pencil dashes became three broken contours that bend toward the edge (two pieces each). Cliff edge, bare paper and cloud depth unchanged from v2. | `woman-bob + new: pyjama (shoulder 0.42), P01 back, new: bowed head back` | hair 128 × 107 px (x 506–634, y 381–488; v2 head 106 px tall); figure hair top y 381 to feet y ~776 (395 px); determinism: two renders differ by max 1/255 on 3 channels; caption zone 860–1248 mean 0.78 / p95 0.93 (fail, unchanged decision: caption shade at W5) |
| LF04 | Dumbbell floor shadow moved up under the plates' bottom rims and widened (`ell(x + 16, y + 60, 178, 16)`), so both plates rest on it | `new: icons x4` | caption zone mean 0.90 / p95 0.91 (fail, same decision) |

Frame check (viewed): 270 px sheet `sheet-v3.png` and the 540 px single still. At 270 px the head now reads as a dark bob seen from behind, set down between rounded shoulders, with no dot or pale square; the strata no longer read as text lines. At 540 px the crown's radiating strands and the forward-falling side curtains show; the narrow shadowed nape between the curtains is the remaining risk (a small skin notch under dark hair can still be taken for a face in shadow at 270 px); the bow itself is moderate, carried by the sunk head rather than a visible tilt.

Tried and dropped (same session): (a) a full-head overlay with a V-shaped dip under an uneven hem (read as a face in a V-neck); (b) a broad shirt panel over the whole upper torso (flat colour mismatch, read as a bib or scarf; `solid` alone let the rig neck show through, so the cap now gets `p.flat` first); (c) shoulder caps narrower than their inner collar points (crossed into pointed "ears").

Open: a fresh-eyes viewer check of v3 (W3.1 rule: never author and check in one invocation); if the nape still reads as a face, the next step is to close the curtains further (inner edge ±0.3 K) so only a sliver of neck shows. Kit gap (Boss, proposed): a `bowed` back-view head state in `src/painted/kit/back.ts` built from this sheet, so W5 plates and the B03 shots after SH02 do not need the per-shot painter.

## W3.1 look frames v2 (2026-11-04, Film)

Repaint of the viewer-check fails ([viewer-check-lf-v1](short/viewer-check-lf-v1.md)) plus the LF04 dumbbell note; LF03 code unchanged (re-rendered, same picture). User decisions (question tool, 4 Nov 2026): doctor = long hair or bun woman with clear female cues, stethoscope, soft window light, softer smile; pyjama keeps long trousers. Source `src/painted/edu01/` (`cast.ts`, `set.ts`, `look.tsx`). Render: `for i in 1 2 3 4 5; do echo "EDU1-LF0$i 0 out/edu01/look/v2/LF0$i.png"; done | node scripts/stills.mjs src/painted/edu01/look-index.ts` (one Chrome; `scripts/render.mjs --stills` bundles only `src/index.ts`, and the look compositions live in the standalone entry). Store: `projects/EDU/previews/look-frames/ep01/v2/` (LF01–LF05 + `sheet-v2.png`).

| Look | Change (fix id from the viewer check) | Casting line / layers | Lead (measured from the still, px) |
| --- | --- | --- | --- |
| LF01 bedroom | (1) episode-local lying head `paintLyingHead` (profile face up, bob fanned on the pillow, fringe, nose and coloured lips, half-lid arc with lashes, `lid` 0.6; rig head no longer drawn here); (2) `ROOM` v2: U 520 → 640, mattress top 1010, legs 1300, window y 150–720, moon (880, 300), rug from y 1470 (23.4 % of the frame); (3) duvet ends at the mattress edge (hem y ~1110–1146) with fold shadows; (4) clock glow: amber on the table top, wall amber glazes removed, `Spot` r 230 → 150 | `woman-bob + new: pyjama, P36, sleepy (lid 0.6)`; `new: lying head`; kit ENV-SKY moon, `Spot` | head + hair 264 × 262 px (x 228–492, y 706–968), was about 200 px wide; bed y 760 (headboard top) – 1300 |
| LF02 dream cliff | (1) bowed head: rig `nod [0, -0.85]`, `lean 0.1`, painted back-of-head overlay with the crown whorl, radiating strands and the nape under an arched hem; (2) cliff = bare-paper rock (`p.flat`) with the far end painted, dry-brush drags at the paint edge, HB pencil lip, edge and strata contours; free diagonal strokes removed; (3) depth: cool `DEPTH` washes below the horizon, a dark gap under the ledge, rows of small pale cumulus that shrink toward the horizon | `woman-bob + new: pyjama, P01 back, bowed`; `new: cloud-dream plate` v2; figure U 250 → 280 | figure 404 px (hair top y 372 to feet y 776), head 106 px |
| LF04 trigger icons | dumbbell: round plates at a three-quarter angle with rim thickness, hub, knurled grip and floor shadow | `new: icons x4` | unchanged rows; dumbbell y ~1400–1560 |
| LF05 doctor | (1) recast `woman-long + doctor`, no tie, rose blouse with a V collar, full lips, cheek blush; bust shading and the coat fronts pinched at the waist painted over the rig (`paintDoctorTorso`); (2) teal stethoscope round the neck (`paintStethoscope`; dark slate vanished on the black hair); (3) window: brighter glass, sheer curtain, a two-pane light patch on the wall and a warm glaze on her shoulder; (4) soft closed smile: `happy` with mouth `flat` (kit `full` lips) plus lifted corners | `woman-long + doctor (no tie, rose blouse) + new: stethoscope, P01, happy (soft)` | figure U 980, hair top y 312, cut at the shins |

Findings:
- **Caption zone** (`scripts/caption-zone.py`, default band 860–1248): still fails on every look (LF01 mean 0.37 / p95 0.74; LF02 0.78 / 0.93; LF03 0.82 / 0.91; LF04 0.90 / 0.91; LF05 0.86 / 0.95). The caption shade decision from v1 still stands (W5, Editor/coordinator).
- **Determinism:** LF01, LF02, LF05 rendered twice: max channel difference 1/255 on 14 channels (LF02), LF01 and LF05 identical.
- **Kit gaps (Boss, proposed):** the rig has no female torso shape (UT08 cues are painted per shot), no stethoscope gear, no soft closed smile preset, and its P36 profile head with a bob reads as a helmet when rotated; `paintLyingHead` is a static painter (no jolt or eyes-open state beyond `lid`), so B01-SH02 (eyes open toward camera), B02, B03-SH05 jolt and B07-SH02 need it hardened or rigged before W5.
- **Tried and dropped:** p5.brush `charcoal` and `2B` strokes for the dry brush read as hatch marks or text dashes at 540 px; `marker` 2.6–2.8 strokes read as dry paint. A `hardFill` paper rock with a bottom edge left a hard horizontal line; the rock is now a wedge bounded by its pencil edge and faded with cool washes.
- **Lead size still small in LF02** (wide by design, row "small figure on a ledge"): the bowed head reads at 540 px, weaker at 270 px; left for the user.

## W3.1 look frames v1 (2026-11-04, Film)

Source: `src/painted/edu01/` (`cast.ts`, `set.ts`, `look.tsx`, standalone entry `look-index.ts`; compositions `EDU1-LF01`–`EDU1-LF05`, frame 0). Render: `for i in 1 2 3 4 5; do echo "EDU1-LF0$i 0 out/edu01/look/LF0$i.png"; done | node scripts/stills.mjs src/painted/edu01/look-index.ts`. Store: `projects/EDU/previews/look-frames/ep01/v1/` (LF01–LF05 + `sheet-v1.png`).

| Look | First shot | Casting line / kit layers | Lead (measured from the still, px) |
| --- | --- | --- | --- |
| LF01 bedroom | S01-B01-SH01 | `woman-bob + new: pyjama, P36, sleepy`; kit: ENV-SKY moon disc (`paintSkyDisc`), `Spot` (clock glow overlay, 0.26); `new: bedroom set` | lying figure about 820 px long at U 520 (est 1.58 m); face centre about y 790, above the band |
| LF02 dream cliff | S01-B03-SH02 | `woman-bob + new: pyjama, P01 (back view, nod down)`; `new: cloud-dream plate` with pencil under-drawing below the painted cliff | standing figure about 400 px at U 250 (wide) |
| LF03 idea space | S01-B05-SH01 | `woman-bob + new: pyjama, P31, worried (eyes up-right)`; `new: idea-space ground`, `new: bed-edge vignette`, brush "?" | seated figure about 690 px at U 520; face centre about y 760 |
| LF04 trigger icons | S01-B06-SH01 + SH02 end | `new: icons x4` (cup, scribble ball, moon + clock 1:50, dumbbell) | icons about 300 px; row y 360–720 (steam to the cup top), dumbbell y 1360–1560 |
| LF05 doctor | S01-B07-SH03 | `woman-pixie + doctor, P01, happy` (kit, unchanged); `new: doctor vignette ground` (window light, plant shelf) | figure 1.57 m at U 980, cut at the shins; face centre about y 600 |

Findings:
- **Caption zone** (`scripts/caption-zone.py`, default white-outline thresholds): every look fails (LF01 mean 0.36 / p95 0.68 from the lit duvet in the band; LF02–LF05 mean 0.72–0.90 on paper/cloud). The brief sets no caption colour. Needs a decision before W5 (Editor/coordinator, user): dark-fill captions on the paper and dream grounds, or the kit `CaptionShade` band while a caption is up (as EG-EP02).
- **Determinism:** LF01 and LF03 rendered twice: max channel difference 1/255 on 0.0001 % of channels (LF01), identical (LF03).
- **Washes vs objects:** shaped objects (blanket, mattress, curtains, rug) need an opaque `p.flat` underlayer before the textured passes; `washAt` alone left them translucent (mattress line visible through the blanket) and large `washAt` bleeds turned the rug and moon pool into blobs. Helper `body()` in `set.ts`.
- **Amber over blue reads green:** a thin `paintHalo` in `#e8a35c` over the ink-blue wall painted a green patch; the clock glow is the wall colour mixed toward amber plus a screen-blend `Spot`.
- **P36 lying head:** the kit's rotated profile head reads as a face-up head on the pillow at 270 px, but the hair mass sits under the head and the half-lid eye reads fairly open; left to the viewer check.
- **Pyjama:** long trousers instead of the brief's shorts (rig has no shorts); open question for the user.
- **Viewer check (2026-11-04, fresh Film):** LF01 fail (sleeper's head/face unreadable, no female cue, rug fills the lower 40 %), LF02 fail (no look-down, cliff not "unfinished", no sense of height), LF03 pass, LF04 pass (dumbbell reads as "H"), LF05 fail (doctor reads male, no stethoscope). Details and fixes: [viewer-check-lf-v1](short/viewer-check-lf-v1.md).
- Not done in this pass: the [thumbnails](../../docs/sequence-workflow.md#look-thumbnails) step (skipped on coordinator instruction) and the [viewer check](../../docs/sequence-workflow.md#viewer-check) (needs a fresh Film invocation).

## W4.1-W4.2 voice lock and W1.4 length check (Editor, 2026-11-04)

- Voice: Gemini TTS Achernar (user's liked narrator), atempo 1.08 (EG-EP01 awake style; 1.05 alternative kept). Text `out/edu-voice/text.txt`: script VO with `…` -> `,`, one line per row, L06 omitted (non-verbal), L16 ends on "ว่าตอนที่คุณ" with no closing punctuation.
- Requests: 2 full reads (no audition clips, one per style). Take 1, "soft, warm and close to the mic, hushed and calm like a bedtime explainer, ..., natural everyday pace": 79.16 s raw, too slow (speech plus ~16 s gaps). Take 2 (chosen), style "natural everyday storytelling, soft and warm but clear and conversational, calm quiet wonder, awake, steady brisk pace, short natural pauses, no audible breathing; same narrator throughout, do not speed up": 68.96 s raw, 18.4 s of it silence >= 0.15 s. The slow bedtime style would have failed the length check; keep the brisk style for re-reads.
- Post: [short/voice-regap.py](short/voice-regap.py) (Whisper venv python for numpy): line gap 0.28 s, comma 0.14 s, reveal pauses 0.55 s (before L09 and L12), 3.2 s jolt gap before L07, 0.5 s tail, atempo, loudnorm. Result 59.53 s, -16.2 LUFS, LRA 2.2, TP -1.5. Its `LINE` table holds raw-take silence starts for this take only; a new take needs the table redone.
- Length check (W1.4): 59.53 s vs 40-60 s target (limit 63 s) pass, and it includes the 3.02 s jolt gap placeholder; Preaw trims not needed. Estimate was 49-53 s; the read is longer mainly in B06 (6.7 s vs 4.5 est).
- Measure: [short/narration-measure.json](short/narration-measure.json), onsets from silences, checked against Whisper (faster-whisper in this venv fails on file paths with `av` metadata_errors: pass a decoded numpy array, as `out/edu-voice/tr.py` does). Whisper mis-transcribed some words (Thai-English mix), so alignment uses it only as a +-0.2 s cross-check.
- Open: L06 gasp (narrator Achernar vs separate character voice) not generated; Film sets the jolt gap (fall ~1.5 s + silence ~0.5 s + jolt) and Editor re-gaps; "ฮิปนิก เจิร์ก" read by TTS was not listened to by an agent, user listens at W4.3; Gemini TTS: the style tail "do not speed up" kept.
- Store: `projects/EDU/audio/voice-lock-v1/` holds lock-v1.wav (1.08), alt-x1.05.wav, raw take 2 (+json), raw take 1.


## W4 alternative voice: Kore (Editor, 2026-11-04, user request "ลอง kore หน่อย")

- One full Gemini read (1 request), voice Kore, same text and same awake style prompt as the Achernar lock; same post (regap, atempo 1.08, loudnorm). Achernar lock untouched.
- Raw take 70.52 s (Achernar raw was shorter: Kore reads slower). Locked take **61.97 s** (over the 60 s soft target, under the 63 s limit), -16.1 LUFS, LRA 2.7, TP -1.5, speech end 61.32 s, tail 0.65 s. Achernar lock is 59.53 s, so Kore is +2.4 s; B08 ends 61.32 s vs 58.75 s.
- [short/voice-regap.py](short/voice-regap.py) now takes an optional 4th argument (JSON of raw silence starts -> line) and merges silences less than 0.01 s apart; default table (Achernar) unchanged. Kore table = `lineGaps` in [short/narration-measure-kore.json](short/narration-measure-kore.json). Line gaps were identified with Whisper word order (Thai tokens fragmented, used only to match gap order).
- Store: `projects/EDU/audio/voice-lock-v1/EDU-EP01-SHORT-narration-kore-v1.wav` (+ `.json` measure), `...-raw-gemini-kore.wav/.json`. Not listened to by an agent; W4.3 not ticked.
- **Silence audit (Editor, 2026-11-04, user: "lingering silence somewhere")**: `silencedetect` on `kore-v1` at -45 dB / 0.3 s finds only intended silences: lead 0.38 s, 13 line gaps 0.31-0.33 s (measure JSON 0.26-0.30 s), reveal pauses 0.565 s (L08->L09 at 27.67 s, L11->L12 at 39.51 s), **jolt gap 3.01 s (L05 end 16.33 s -> L07 onset 19.31 s, 2.99 s by line times)**, tail 0.65 s. At -38 dB no silence of 0.2 s or more sits inside any line; at -30 dB the longest in-line holds are 0.43 s (L11 comma at 34.3 s) and 0.35 s (L01 at 1.0 s), ordinary commas. No dead air in the raw take (all raw gaps map to the regap table). No v2 built; nothing to cut. The only silence a listener would call lingering is the 3 s jolt placeholder (Film retimes it in W5.1); the two 0.55 s reveal pauses are the next longest.

## W5.1 timed scene sheets (2026-11-04, Film)

- Output: [short/scene-sheets.md](short/scene-sheets.md) EDU-SHEETS-R1; `review-rows.json` start/end (frames) and `timingEstimated: false`, facts line updated.
- Method: frames = round(s x 30) from [narration-measure-kore.json](short/narration-measure-kore.json); shot start = line (or phrase) onset - 4 f. Phrase onsets inside L05, L07, L11, L13, L15 come from `ffmpeg silencedetect noise=-36dB d=0.07` on `kore-v1.wav` (estimate +-4 f; Editor confirms with Whisper words). The measure file has line-level times only.
- Result: B01-SH02 (37 f) and B04-SH01 (30 f) are the tightest shots; B05-SH04 (145 f) the longest, because L11 is one 4.6 s phrase. Total 1860 f = 62.00 s; target 60 s missed by 2 s, limit 63 s met.
- Jolt gap: kept 2.99 s; fall 45 f + silence 15 f + jolt 29 f = 89 f. The library has `pulse_underwater-soft-thump_01` for the thump, so the brief's NEEDS-GEN thump is dropped. Wind and fall accent come from existing library files (`outdoor_wind-open-roundabout_01`, `whoosh_air-swish-rising_01`). Still NEEDS-GEN: warm pad (matched head/tail), plucked notes, the gasp.
- Gasp: separate character voice via Gemini TTS `<gasp>` tag (gemini-tts skill), not Kore. Untested; the tag may return words.
- Caption: shade ladder at W5.3; all look frames fail `caption-zone.py`, so every spoken shot is shaded.
- Open (Film, for Boss/Editor): `new: sit on bed edge` and the 10 f nod on the bowed head are not in the kit; both are in the Boss list.

## W5.1 Editor jobs: L06 gasp and phrase-onset check (Editor, 2026-11-04, against EDU-SHEETS-R1)

- Gasp: Gemini TTS (gemini-tts skill), text `<gasp>` only, style `young woman suddenly startled awake, one sharp inhale through the mouth, no words, very short`, three prebuilt voices other than Kore/Achernar: Aoede, Leda, Zephyr (3 requests; raw takes 0.72-0.92 s in `out/edu-gasp/gasp-<Voice>.wav` + cache `$REELS_STORE/cache/tts/`). Not listened to by a human; ranked by Whisper (no words) and by the energy envelope.
- Trim: Aoede 0.21-0.63 s of the raw take (0.42 s), Leda 0.07-0.50 s (0.43 s), Zephyr 0.07-0.55 s (0.48 s); 10 ms fade in, 80 ms fade out, no atempo, mono to stereo 48 kHz 24-bit, peak -1.2 dBFS (library sfx master rule; sheet asked -3 dBFS peak and 3 dB under the narrator, so mix it at timeline volume about -2 dB for peak and about -3 dB for level). Mean level -15.7 / -15.2 / -17.9 dB against the Kore narration's mean -16.1 dB and peak -1.5 dB.
- Whisper on the raw takes: Aoede no words (clean gasp, onset 0.24 s, decays by 0.5 s); Leda hears a Japanese "ha" syllable (breath-like, still no Thai or English word); Zephyr hears "Oh" (word-like, ranked last).
- Filed: `~/ReelsStore/library/sound/sfx/vocal/vocal_gasp-young-woman_01` (Aoede, best), `_02` (Leda), `_03` (Zephyr) with sidecars and INDEX rows. New category `vocal` added to the library README.
- Phrase onsets, method: Whisper `medium` (faster-whisper, Thai, decoded numpy from the Kore take) syllable starts, plus a 10 ms RMS envelope (-40 dB crossing after at least 50 ms of silence). Whisper's first token often snaps to the end of the previous segment, so it reads early where the gap is long; the envelope onset reads late where the phrase starts softly. Both are quoted below; a frame is flagged only when it differs by more than 3 f.

| Onset | Sheet f | Whisper f | Envelope f | Diff > 3 f? | Corrected f |
| --- | --- | --- | --- | --- | --- |
| L05 p1 | 335 | 333 | 335 | no | |
| L05 p2 | 415 | 410 (snapped to prior end) | 414 | no | |
| L07 p1 | 579 | 579 | 580 | no | |
| L07 p2 | 613 | 617 | 616 (loud body from f622) | yes, +3 to +4 | 617 |
| L11 p1 | 1012 | 1012 | 1012 | no | |
| L11 p2 | 1157 | 1155 | 1157 | no | |
| L13 p1 | 1273 | 1274 | 1274 | no | |
| L13 p2 (dumbbell, "และ") | 1417 | 1415 (snapped) | 1420 | no, borderline +3 | 1419-1420 suggested |
| L15 p1 | 1580 | 1586 | 1590 (faint noise from f1580, speech from f1590) | yes, +6 to +10 | 1586 |
| L15 p2 | 1641 | 1641 | 1641 | no | |
| L13 cup "คาเฟอีน" | 1333 | 1334 | 1333 | no | |
| L13 scribble "ความเครียด" | 1359 | 1358 | 1359 | no | |
| L13 moon+clock "การอดนอน" | 1387 | 1390 | 1390 | no, borderline +3 | 1390 suggested |

- **R1.1 (2026-11-04, Film):** applied the onset check above: L07 p2 f613 -> f617, L13 p2 f1417 -> f1419, L15 p1 f1580 -> f1586, icon 'moon and clock' f1387 -> f1390. Shot boundaries B04-SH01/SH02 609 -> 613, B06-SH01/SH02 1413 -> 1415, B07-SH01/SH02 1576 -> 1582 (each = onset - 4). All 23 shots contiguous, 1860 f unchanged; review-rows.json start/end updated. L05 p2, L11, L13 p1, L07 p1 unchanged (diff <= 3 f).

- L15 p1 and L07 p2: the sheet onset sits on a faint low-level breath (-41 to -46 dB) that precedes the word by 0.2 to 0.3 s. For a shot that starts 4 f before the phrase, Film decides whether to move; L15 p1 would move B07-SH02 start from 1576 to about 1582 (7 f shorter on the shot before and longer after). Sheet not edited.

## W5.2 Boss assets and plates (2026-11-04, Boss)

Composition `EDU-EP01-SHORT` (`src/videos/edu-ep01/index.ts`, C_seamless, loopBlend 15, chrome channel mark only), 23 scenes = review-rows boundaries (tests/edu01.test.ts). Plates `EDU1-<shot id>` = `plateOf(id, f)` in `src/painted/edu01/plates.tsx` (pure of shot-local frame) via `src/painted/shots/edu01.tsx`; new parts in `parts.ts`; look painters in `set.ts` extended with optional params (defaults = locked look frames).

Built (kit intake KIT-P01 `new:` names): `new: sit on bed edge` and `new: lie-back motion` (lying torso rotates about hip PIV (720,916), rot 0..1, arms/hand/hug), `new: jolt motion` (lift 56 px, drop, -6 overshoot, blanket jump, wide eyes, 3 f flash), lying-head `wide`/open-eye almond/`smile`, wallSoft mist 0.25..0.62, room-to-cloud bleed (dream layer over bedroom, ledge late), shared dim curve (`dimCurve`, DimLayer multiply + saturation overlay), bowed head `roll`/`dip` (nod L8-18), back-view lean + slip off frame, `new: cloud-air ground`, `new: upward paint-streak FX`, `new: falling pose in pyjama`, `new: idea bubble`, `new: brain-cloud`, `new: sun/moon switch`, `new: relaxed mini-figure`, icon pops with fade-to-60 %, doctor nod. Breath phase 0 on the ambient clock; B08 camera ends 1.000 and frozen last 15 f; test checks the camera seam only.

Not done / honest limits: (1) the sit-up torso is a rotated slab with a short neck and a floating-looking head (needs a kit seated/long-sit body); (2) kit gaps 1-3 (kit `bowed` head, back heel, female torso cues) NOT moved into `src/painted/kit`, still episode-local; (3) the faller keeps the kit ground shadow under the feet (no shadow-off); (4) B03-SH01 mid-dissolve shows faint pencil lines of the ledge; (5) `S01-B01-SH02` eyes look along the face (profile), not at the lens; (6) caption-zone fails every shot (mean 0.33-0.90), shade at W5.3; (7) no seek/sequence parity run and no whole-clip render (stills only); (8) tag, name card, captions, sound are W5.3.

### W5.2 repaint round (2026-11-04, Boss, after the fresh viewer check [viewer-check-w52](short/viewer-check-w52.md))

- **Sit-up (blocker 1), `new: sit on bed edge`:** episode-local seated upper body in `set.ts` (`paintBedroom`): torso contour in a torso frame (`TORSO_N`, mixed from the locked lying panel `TORSO_O` over the first 20 % of the rise so nothing pops), neck in skin, V collar on the neckline, lit front/shaded back/waist folds, round shoulder, upper arm + elbow + forearm with cuff, mitten hand + thumb that attach to the arm (IK elbow, `elbowOf`), hip scoots from `HIP_LYING` (863, 916) to `HIP_SIT` (670, 985) while turning (`sleeperXf`; `PIV` removed), blanket pools over the lap with the sheet band faded out, hair fan dark when upright. B07-SH01: pillow modelled (shade, light, seam, creases) and the near arm lies over it. She sits mid-bed with legs under the blanket (not on the mattress edge): the kit has no long-sit body, so a kit-intake body is still open.
- **Faller (blocker 2):** kit `FigPose.noShadow` (new, optional, default absent = shadow as before; `npm test` 463/463). `paintFaller` uses it and U 330 -> 520 (figure 822 px = about 205 px at the 270 px tile).
- B01-SH02: zoom 2.4 -> 2.46 anchored on the head (face fills the frame centre); `lens` option puts the iris centred in the eye. This is still a profile head: a true three-quarter lying head was not built, so the eye reads as looking out of the picture only roughly.
- B03-SH01: ink ignores layer alpha, so the pencil lines now wait until the ledge is >= 0.25 and fade toward the paper (`CliffOpts.ledge` path in `paintDreamCliff`; LF02 default unchanged). B03-SH02 opens 17 % closer and settles over 44 f, so the cut changes framing.
- B05-SH04/05/06 dim: paper plates dim cool (`Plate.dimCool`, lilac multiply, light desaturation) instead of neutral grey.
- Not fixed: faller hair does not stream upward (kit hair is fixed); nits (B02-SH01 repeat framing, B05 head tilt, drip signal, doctor coat/hands) untouched; caption-zone still fails (W5.3 shade); no motion/seek check of the new sit-up arc (stills only).
- Evidence: `out/edu01/w52/` G1, G2, G3, G4, G5, G45 (re-rendered), `situp_before_after.png`, `faller_before_after.png`, `before/`.

### W5.2 repaint round 2 (2026-11-04, Boss, after [viewer-check-w52-v2](short/viewer-check-w52-v2.md))

- **N1 ghost body/hand:** cause was the arm painted on `p.layer(arms)` (half alpha) after the blanket with a lap hand target that points up when lying. Now the arm is always opaque; for rot < 0.8 it is painted before the blanket (cloth covers it) with the hand target easing from "at her side" to the lap (`side`), and for rot >= 0.8 after blanket and pillow. Checked as stills every 2nd frame f584-612 and f1752-1830 (`out/edu01/w52/arc_sit.png`, `arc_lie.png`): no transparency, hand always on an arm.
- **N2 neck:** the lying head's neck plate and the sit-up neck are skin (mix 0.28 toward shade, was 0.5/grey), narrower. The old lying shoulder panel still shows as a lavender-grey block under the chin in the B01-SH02 close-up (locked lying look, left).
- **N3 faller:** all streaks (back and pale front set) are painted before her. The kit pyjama legs keep their mottled paint, so a little streak colour may still read through the trousers; not changed (kit-level).

### W5.2 repaint round 3 (2026-11-04, Boss, user: "extra head layer comes up with her when she wakes")
- **Duplicated layer:** the hair fan that lies spread on the pillow (`paintLyingHead` step 1, drawn under the head) kept its full lying extent while she rose, so it read as a second dark head-shaped blob behind and below the real head, rising with her (f584-612, f1752-1830). Not a second head: one head, one neck, one torso were drawn at every frame.
- **Fix:** the fan draws in toward the head with `rot` (u x 0.55, v x 0.7 upright) so it becomes a bob behind the head; fan colour already moves to the dark hair tone. Neck skin lightened (head neck plate shade 0.28 -> 0.10 upright; sit-up neck toward a warm violet 0.10) to remove the grey block mid-arc.
- N7 hand pop (draw-order switch at rot 0.8) not eased: no cheap fix without bringing back the ghost; judge in motion.
- Rendered every frame f580-615 and f1750-1832; `out/edu01/w52/arc_sit.png` (f580-614 step 2, row by row) and `arc_lie.png` (f1750-1830 step 2). Labels not burned in (ffmpeg has no drawtext).

### W5.2 repaint round 4 (2026-11-04, Boss, user: still stacked at the neck, black piece trailing from the hair)
- Assumption dropped: the lying head cannot just be rotated upright (its hair fan, neck plate and pillow-side shade are baked in). `paintLyingHead` got `lyingMix` (1 lying, 0 seated). `paintBedroom` ramps it 1 -> 0 over rot 0.03..0.13 (about 3 frames of the sit-up, same ramp reversed in the lie-back, both are functions of `rot` so B04 and B08 are symmetric): the fan shrinks to nothing and is not drawn, the neck plate and the pillow-side shade are not drawn. Seated head = skull, bob cap, ear, face, eye; ONE skin neck (`7285`, torso frame, face skin tone) joined to the torso, which reaches its seated shape by rot 0.1 (was 0.2) so the old lavender panel no longer shows under the chin. rot 0 (all lying frames, loop seam) is unchanged: f1858 vs f2 PSNR 35.13 dB as before.
- Checked every frame f580-615 and f1750-1832 as stills; `arc_sit.png` (every frame f580-615, row by row, 9 per row), `arc_lie.png` (f1750-1832 step 2), `handover.png` (f582, f586, f592, f1784 crops at native size). N7 hand pop still not eased.
