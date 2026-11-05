# EDU-SERIES build notes

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
- Not done in this pass: the [thumbnails](../../docs/sequence-workflow.md#look-thumbnails) step (skipped on coordinator instruction) and the [viewer check](../../docs/sequence-workflow.md#viewer-check) (needs a fresh Film invocation).

## EP02 W3.1 look frames v1 (2026-11-05, Film)

Source: `src/painted/edu02/` (`cast.ts` cook + bib apron, `world.ts` world-metre paint helpers, `kitchen.ts` SET-KITCHEN, `macro.ts` CELL and EYE sets, `look.tsx`, standalone entry `look-index.ts`; compositions `EDU2-LF01` (48 f), `EDU2-LF02` (126 f), `EDU2-LF03` (102 f), spike `EDU2-SPK-CELL`). Every comp runs its shot's yaw-camera move (painted 3D camera). Render (render.mjs bundles only the registry, so the standalone entry goes through the one-Chrome stills CLI): `printf 'EDU2-LF01 24 out/edu02/look/v1/EDU2-LF01_f24.png\n' | node scripts/stills.mjs src/painted/edu02/look-index.ts`. Store: `projects/EDU/previews/look-frames/ep02/v1/` (look stills `EDU2-LF01_f24`, `EDU2-LF02_f110`, `EDU2-LF03_f45` + `_540` copies, start/middle/end frames, spike, `sheet-LF0n.png`, `sheet-v1.png`).

| Look | Shot (frame) | Casting line / kit layers | Lead / subject (projected from the camera, px) | Caption band 860–1248 (`caption-zone.py`, no shade) |
| --- | --- | --- | --- | --- |
| LF01 kitchen | S01-B01-SH02 (f24 of 48) | `woman-curly + new: kitchen-apron, P07 (knife raised in the right hand), smug`, front view squared to the lens, `headCock 6`; kit: ENV-GLOW (`paintHalo`) pendant and window sun; `new: SET-KITCHEN`, `new: knife` | head top y 243 → island back edge y 844: visible cook 561 px (521 at f0, 606 at f47); eyes y 406; onion top y 788 (838 at f47); board edge in the band (allowed) | mean 0.614, p95 0.87: fail |
| LF02 cell macro | S01-B03-SH01 (f110 of 126) | `new: cell-macro set` (CELL space): beads, teal sac with notched enzymes, neighbours at 0.24 strength | hero cell y 263–703 (f110), 448–646 at f0 | mean 0.854, p95 0.902: fail (brightest ground of the episode) |
| LF03 eye macro | S01-B04-SH02 (f45 of 102) | `new: eye-macro plate` (EYE space): the cook's left eye, gold nerve lines + sparks, lilac gas veils, tear wave (from f53), drop (from f87) | eye opening about x 75–1000, y 330–760; centre y 560 | mean 0.406, p95 0.441: fail |

Spikes (brief "smallest spikes"):
- **1 Cell model reads at 270 px:** pass for SH01 (beads and sac separate and nameable at 270 px on `sheet-LF02.png`; the hero is the only full-colour cell). SH02 key state (`EDU2-SPK-CELL`): the open sac and orange beads next to teal enzymes read; the lilac mist is faint and the blade is a plain grey plane; both to strengthen at W5.2.
- **2 Eye macro:** reads as an eye at a glance (UT01/UT02). Sparks read as gold stars at f45; the tear wave reads as a pale band sweeping across (f71), more a band than water; open for the viewer check.
- **5 Captions and lead:** numbers above. No face, onion, eye or doodle in the band on the look frames (LF01 onion top 838 at the last frame, 2 px clear).

Findings:
- **Washes only darken.** A light colour laid as `washAt` over a darker ground (gold light on the island, lilac gas on brown skin) painted a brown or grey smudge. Light patches and the gas are now flat veils (`hardFill` on `p.layer(alpha)`), stacked at two or three sizes for a soft edge. A light colour needs enough blue to stay lilac over brown skin (`#9a80ff` at 0.3 per layer).
- **Macro sets and the near plane.** `YCAM_NEAR` is 0.3 m, so EYE (set-m ≈ 1 cm, camera 0.3 m away) clipped everything: the first LF03 render was plain skin. The eye is projected through a ×10 copy of the set (same picture); CELL clears the near plane as authored.
- **Cell depth.** With the authored 0.25 cell depth, each cell's front ring and back face separated by the parallax and read as stray lines; drawn at ±0.06.
- **LF01 framing.** At the brief's `r 1.9, f 1000` the island front and an empty island top filled the lower half and the lead measured 441 px; the longer lens from further back fixes both (brief R1.1). The window sits just off the left edge on this arc, so the key reads only as the warm rim and the light patches (UT04 risk for the viewer check).
- **Sclera shade bug** (fixed): the upper-lid shadow on the eyeball was not clipped to the eye opening and painted a beige box over the lid.
- **Determinism:** LF01 f24 and LF03 f45 rendered twice: max channel difference 9/255, PSNR 76.6 dB (run noise per DF-20261030-render-run-noise; no flicker source found).
- Not done in this pass: [thumbnails](../../docs/sequence-workflow.md#look-thumbnails) (skipped: the user asked for the look frames now, coordinator instruction) and the [viewer check](../../docs/sequence-workflow.md#viewer-check) (needs a fresh Film invocation that did not paint them).
