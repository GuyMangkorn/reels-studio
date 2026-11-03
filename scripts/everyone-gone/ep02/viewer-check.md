# Viewer check — EG-EP02-SHORT look frames LF01–LF05

Check per [viewer check](../../../docs/sequence-workflow.md#viewer-check), 2026-11-03, fresh `film` invocation (Opus 5.5, medium) that did not paint the frames. Inputs: brief `EG2-BRIEF-FILM-R1.1`, script VO `L01`–`L19` (`ep02-script.md`), [user taste](../../../docs/user-taste.md) UT01–UT11, stills in the store `EG/previews/look-frames/ep02/` (`sheet-looks.png`, `sheet-details.png`, `LF01.png`–`LF05.png` viewed at 540 px via `scripts/qa-sheet.sh --width 540`). Stills only; nothing painted.

## Measured: caption band (all frames)

`python3 -I scripts/caption-zone.py --band 1150:1248` (default outline thresholds mean ≤ 0.25, p95 ≤ 0.40):

| Frame | mean | p95 | pass |
| --- | --- | --- | --- |
| LF01 | 0.337 | 0.404 | no |
| LF02 | 0.505 | 0.648 | no |
| LF03 | 0.598 | 0.743 | no |
| LF04 | 0.695 | 0.894 | no |
| LF05 | 0.597 | 0.743 | no |

The brief assumed a mid-low key in the low band; every frame is brighter there (LF04 sits on the cream sheets). No glyph, face or hero object crosses the band, so this is a caption-style decision, not a repaint: switch `VD12` to the `box` fallback for the episode, or darken the lower floor/road by a ground gradient. Film decides in the scene sheets.

## Per frame

### LF01 — Yaowarat, empty dawn (S01-B02-SH01; also S01-B01 and S02 inserts)

- **Reads as (1 s, no VO):** a long empty city street of tall Chinese-style signs, one small red-hooded figure from behind in the middle of the road. Outside, empty, early. Place reads (UT01 ok); "Yaowarat" reads as "Chinatown-ish", which is enough.
- **คุณ:** coral hood up, back view, about 10% of frame height. Reads at 540 px, but **does not stand out**: the left red banners and the near-red smear on the road are the same hue family as the hoodie, and the yellow signs are more saturated. Fails brief acceptance 2 ("colour differs from every other pixel mass") and VD02 ("hoodie as the only saturated colour").
- **Defects:** three tall translucent green-yellow smudges and one red smear on the road (x about 40–440, y about 1000–1460 at full size). At phone size they read as stains or ghost shapes standing on the road. That breaks the brief's "nothing is wrong with the picture except absence" and pulls toward a ghost reading of the empty city (OPN201, UT09 by implication). They also cross the caption band. The sky has visible horizontal banding (stepped gradient). The lower 35% is an empty dark road (UT03: not black, but dead weight). Shrine and white sheet are tiny at this framing (acceptable for a wide; the S02 inserts carry them).
- **Mood:** quiet and cool, but flat and clean rather than soft and painted; brush texture is light (UT11 risk, not a fail).
- **Verdict: fix.** (1) Remove the road smudges and the red smear (if they are meant as sign reflections, make them low-contrast, cool, streaked wet-road reflections under each sign, not standing blobs). (2) Drop sign saturation and darken the reds toward maroon/brick and the yellows toward ochre so the coral hoodie is the single most saturated mass; keep the signs lit as warm points by value, not chroma. (3) Dither/grain the sky to remove banding.

### LF02 — pier, empty dawn (S01-B02-SH03, S02-B01-SH04)

- **Reads as:** a covered river pier, empty, grey morning; a small red-hooded figure at the rail looking at the water. Place and inside/outside read instantly (UT01 pass).
- **คุณ:** reads, the only colour in the frame; good. The white sheet on the second pillar sits right beside her head (tangent) and merges with her silhouette at 270 px, so neither reads cleanly.
- **Defects:** strong sky banding; the lower 45% is flat grey floor with nothing in it. Pigeons read as a grey smudge.
- **Mood:** melancholy, hushed: on brief. Rather cold and sterile; a touch of the blue-hour warm points (the two hall lights are white, not warm) would help UT04 ("lights still lit as the only warm points").
- **Verdict: pass with small fixes.** Move the sheet off her head line (lower on the front pillar, or one pillar nearer camera) so it reads as its own white mass; warm the hall lights slightly; dither the sky.

### LF03 — pier, crowded warm morning, same camera (S04-B01-SH06)

- **Matched pair:** **yes, a true locked-off pair.** Roof, pillars, rail, benches, far spire, clouds and `คุณ` sit at the same pixels as LF02; only grade, crowd, boat and pigeons change. The warm shift reads as "the same place, later and alive". Good.
- **Reads as:** the same pier with a few commuters; `คุณ` still at the rail, people pass on the right without touching her (VD11 ok; left is the river rail, so "both sides" cannot apply here).
- **Defects:** (1) The moored boat (blue/white block at the far end) overlaps the pier sheet on the pillar; the sheet now reads as part of the boat, so the "same props in the same pixels" payoff (PAIR201, L16 "เดินผ่านกระดาษแผ่นนั้น") is lost in this plate. The boat also does not read as a boat at 270 px (reads as a counter). (2) Three foreground figures plus five tiny far ones do not sell L15 "เต็มไปด้วยผู้คน": it reads "some people", not "full".
- **Verdict: fix.** Keep the pier sheet unoccluded and readable on its pillar (move the boat further right/behind or lower it); add mid-ground crowd density (two to three depth bands of walkers and seated people on the benches) while keeping a clear gap around `คุณ`.

### LF04 — soi lamp post, poster face-out (S04-B01-SH02; S03-B01 same set, sheet turned away)

- **Reads as:** a missing-person poster on a street pole. `ตามหา` is large, black, crisp and legible even at 270 px (sheet-looks tile). No digits, no face, blank name lines: on spec (VD07, POS203). Face turned away: yes, back of the head only.
- **Hoodie recognition (L14 "แต่คุณจำเสื้อตัวนั้นได้"):** **weak.** Cropped at the shoulders with the hood down, the figure wears what reads as a plain red T-shirt. Nothing shows it is the hoodie we saw hood-up in LF01–LF03. This is the payoff of CL01 and must read without the VO.
- **Defects:** a yellow-green glow blob to the right of the figure's head inside the photo area reads as a halo or lens glare: conflicts with VD03/VD10 "never glowing" and invites a ghost reading. The soi itself is weak as a place (UT01/UT05): the motorbike reads as a kick scooter and the spirit house reads as a birdhouse or mailbox; the poster is rightly the hero (UT02 pass), but a first-time viewer gets "pole in a grey corridor", not "my soi in Bangkok". The large blank cream sheet below sits under the caption band (luma mean 0.695, the brightest of the set).
- **Verdict: fix.** (1) Show the hoodie in the poster figure: frame the figure to mid-back, paint the dropped hood as a coral fold/lump at the nape with its darker inner lining (`#a8432f`), same coral as `คุณ`. (2) Remove the glow blob. (3) Make the soi Thai at a glance: a proper scooter silhouette (seat, body panel), a spirit house on a short pedestal with the pointed roof and a small offering, a few more cable runs. (4) Caption: `box` fallback here regardless.

### LF05 — mother at the pier, no `คุณ` (S05-B01-SH01)

- **Reads as:** the same crowded pier; a man in a blue jacket walks toward the camera on the right; a small woman stands mid-frame holding something white. First read goes to the **man**, not the mother.
- **Mother:** clear, solid, same light as the crowd, no halo, no transparency: **unghostly, pass**. Profile toward the river, sheets at the chest and garland on the wrist read in the detail crop. `คุณ` absent (VD10 ok). Face at about y 880 (above 1000, ok).
- **Problems:** (1) She is about 14% of frame height and shares the frame with a larger, higher-contrast foreground walker, so she does not read as "the one still figure" (brief S05, L17 "คือแม่"). (2) She reads as a young passenger, the same age as the crowd: nothing in the picture says "mother" (age cue). (3) The garland is a tiny red/white dot at phone size; the sheet stack reads as a cup or phone at 270 px.
- **Mood:** warm and tender in colour; the stillness is not yet staged.
- **Verdict: fix.** (1) Remove the foreground walker or move him to a far-edge pass that is cropped and smaller than her; keep crowd motion in the mid-ground behind and beside her. (2) Make her the largest still figure: bring her nearer camera (about 22–30% of frame height) or end the slow push on her. (3) Add an age cue within the kit (grey in the curly hair, softer older build or an older-woman `PEOPLE` entry if one exists; check the kit catalog first, CP-P12). (4) Apply the VD09 fallback now: stack raised and visibly paper (several sheet edges), garland 1.3x with white blossoms.

## Prioritized fixes (max 5)

1. **LF05 — make the mother the subject:** remove or shrink the foreground walker, enlarge her to about 22–30% frame height, add an age cue, enlarge stack and garland (VD09 fallback). Without this the twist line `L17` has no picture.
2. **LF01 — remove the road smudges/red smear and desaturate the signs** so the coral hoodie is the only saturated mass (brief acceptance 2, VD02); the blobs also read as ghosts.
3. **LF04 — make the poster figure's garment read as the same hoodie** (hood-down fold at the nape, coral, framed to mid-back) and remove the glow blob beside the head; firm up the soi cues (scooter, spirit house).
4. **LF03 — keep the pier sheet visible** (boat off it) and densify the crowd to match `L15` "เต็มไปด้วยผู้คน", keeping the gap around `คุณ`.
5. **All — caption style and sky:** every frame fails the outline band check (mean 0.34–0.70): set `VD12` to `box` (or darken the ground in the band); dither the sky banding in LF01–LF03/LF05 and add kit `Grain` so the plates read painted, not flat (UT11).

## User-taste entries touched

- UT01: LF01–LF03, LF05 pass; LF04 soi weak.
- UT02: LF04 poster pass; LF05 mother (the hero of the shot) fails on size and competition.
- UT03: no large black areas; large dead floor/road areas in LF01/LF02 noted, not a fail.
- UT04: LF02 hall lights white not warm (minor); LF04 glow blob is an unbriefed light.
- UT05: LF04 soi under-reads as Thai.
- UT09: LF01 smudges and LF04 glow drift toward a ghost reading the brief forbids.
- UT11: risk across the set (flat, light texture).
- UT06/UT07/UT08: no arm or face faults visible at these sizes; the mother's female cues are adequate.
