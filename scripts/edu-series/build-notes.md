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
