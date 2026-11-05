# Viewer check: EDU-EP01-SHORT W5.4, after the Draft verdict repaint

- **Check:** [viewer check](../../../docs/sequence-workflow.md#viewer-check), fresh Film invocation (Opus, medium), 2026-11-05. The checker did not paint the repaint. Judged as a first-time viewer from stills only; no art or code edited.
- **Inputs:** 181 full-size stills rendered with `node scripts/render.mjs EDU-EP01-SHORT --stills --frames=...` (log `out/logs/vc-w54-stills.log`, 84.7 s), copied to `out/edu01/vc-w54/stills/`. Every 2nd frame through the jolt (f550-578), cliff (f411-479) and lie-back (f1750-1858); every frame of the sit-up handover f579-600, then every 2nd to f614. Sheets (270 px) and crops (near 1:1) in `out/edu01/vc-w54/`.
- **Scope:** the user's nine Draft change verdicts plus anything else a viewer would notice. Stills include captions and overlays.
- **Result:** 8 of 9 verdict items pass; item 4 (B03-SH02 back view yoke) fails. **Must-fix: 1. Nits: 6.**

## Verdict items

| # | Item | Result | Frames | What a viewer sees |
| --- | --- | --- | --- | --- |
| 1 | Hair one clean shape, no black thing | **PASS** | f0-60 (`i1_open`, `c_open`), f550-578 (`i1_jolt`, `c_jolt`), f1750-1859 (`i1_lie_a/b`, `c_lie`, `c_lie2`) | One solid dark hair mass in every sampled frame; the only marks are the small fringe zigzag at the hairline, which reads as bangs. No extra black patch. |
| 2 | Pillow puffy at the jolt | **PASS** | f555, f562, f575 (`c_jolt`) | Rounded, shaded white pillow with a soft top and a dented middle; reads as a pillow, not a flat slab. |
| 3 | Neck not grey; skin continues into shirt (lying) | **PASS** | f0-60, f550-578, f1770-1859 (`c_lie2`, `c_lie3`) | Neck is the same skin tone as the face and runs into the collar V; no grey or lavender block in any sampled lying or mid-arc frame. |
| 4 | Head/neck/chest one body on the cliff (no detached chest/yoke) | **FAIL (must-fix)** | f431, f461, f471, f475, f477 (`c_cliff`, `c_yoke`) | Back view: a lavender collar/yoke shape sits under the hair and pokes out past the right shoulder like a flap, with a darker diagonal hatched band across the upper back below it, so the upper back reads as a separate piece laid over the torso. A dark grey-purple oval shows at the nape under the hair (reads as a hole). When the figure tips forward (f471-479) the flap grows and the left upper arm outline rises beside the hair, so shoulders look lopsided. |
| 5 | No cut neck on the sit-up | **PASS** | f579-600 every frame, f602-614 (`i5_sit`, `c_sit`, `c_sitneck` f584/591/594/598) | Neck is continuous skin from jaw into collar in every frame; no seam, gap or grey band. Nit: a lighter rectangular panel edge shows on the shoulder of the shirt (f591-598). |
| 6 | Fall neck and face same colour, no cut line | **PASS (nit)** | f495, f525 (`c_fall`, `crop/z495.png`); f730 (`crop/f730.png`) | Measured 8x8 averages at f495: face 210/192/169 and 216/195/170, neck 220/196/173 and 222/198/177, so the same hue within about 4% lightness. The only line is the chin outline. At small size the neck still looks a touch warmer because the lower face is shaded; not a cut. f730 standing figure: neck matches face. |
| 7 | Nose belongs to the face | **PASS** | f650 (`c_fall` tile 4) | Profile nose is part of the face outline, same skin, no separate shape. |
| 8 | Brain cute, a little darker/heavier | **PASS** | f900, f950 (`c_brain`) | Rose-mauve cloud brain with two round eyes and a fold line between them; heavier pink than the bubble around it, still soft. The fold line makes it look slightly worried, which fits "brain switch". |
| 9 | No neighbour regressions | **PASS** | f370, f780, f830, f860, f1000-1260, f1300-1450, f1500-1610, f1660-1740 (`i9_nb`, `c_nb`) | No new faults compared with the round-3 record. Known items still visible (below). |

## Other things a viewer would notice

| # | Severity | Shot / frames | Finding | Owner |
| --- | --- | --- | --- | --- |
| V1 | nit | B08-SH01 f1806-1814 (`c_lie3`) | A pale translucent round disc (the hand under the shirt/blanket) shows through the chest for about 5 frames during the lie-back. | Episode code (`set.ts` lie-back arc). |
| V2 | nit | B08-SH01 f1802-1804 (`c_lie3`) | Neck looks long and the chest very thin, with dark wall showing between neck and blanket, for 2-3 frames mid-arc. | Episode code. |
| V3 | nit | B03-SH03 f495, f525; B05-SH01 f730 | The standing/falling figure's hair has a darker blotch top-right and a thin grey arc stroke on the left side. Not the lying figure's black-thing fault, but the same kind of mark. | Boss (kit hair) or episode code. |
| V4 | nit | B04-SH01 f591-598 | Lighter rectangular panel edge on the shirt shoulder. | Boss (kit shirt). |
| V5 | nit (known) | B07-SH03 f1660-1740 (`c_nb` tile 1) | Doctor's white coat is see-through (pink top and coat outlines show through) and the hands are round discs at the hips with no visible sleeve or arm, so they read as floating. | Episode code / Boss. |
| V6 | nit (known) | B05-SH06 f1260 | Frame is empty cream with only the caption at the end of the wash-out. | Episode code. |

## Count

- Must-fix: 1 (item 4, B03-SH02 cliff back-view yoke/nape).
- Nits: 6 (V1-V6; V5 and V6 carried from earlier rounds).

Routing per the viewer-check rule: item 4 returns to Boss once with the line above as the note; then the shot goes to the user with any remaining finding in its row note.
