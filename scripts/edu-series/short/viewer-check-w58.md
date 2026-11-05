# Viewer check: EDU-EP01-SHORT W5.8, lying neck/collar repaint

- **Check:** [viewer check](../../../docs/sequence-workflow.md#viewer-check), fresh Film invocation (Opus, medium), 2026-11-05. The checker did not paint the repaint. The builder notes ("W5.8 repaint") were read before looking, so Part 1 is not fully blind. Stills only; no art or code edited, nothing committed or published.
- **Inputs:** 130 full-size stills from `node scripts/render.mjs EDU-EP01-SHORT --stills --frames=...` (log `out/logs/vc-w58-stills.log`, 57.6 s), copied to `out/edu01/vc-w58/stills/`. Every frame f575-605 and f1795-1858, 3-8 per other lying shot, seated f613/650/700/1483/1530/1581. Crops are 1:1 or 2-4x nearest-neighbour, all in `out/edu01/vc-w58/`. Stills include captions and overlays.
- **Result:** Part 1 PASS (no must-fix), Part 2 PASS (one pop from before this fix, see N3), Part 3 PASS (52.24 dB). User complaint: **PASS**. The white collar wire, the skin spike at the shoulder, the box foot and the jaw seam are gone from every lying frame. Smaller items a user could still read as "growing out" are listed under nits.

## Part 1: unanchored, lying figure

| Shot | Frames | What a viewer sees at the neck, collar and shirt |
| --- | --- | --- |
| S01-B01-SH01 | f0, f30, f60, f90, f123 | The neck is one warm skin band that runs from under the chin into the shirt. No white V, no box edge, no outline across the neck. Remaining: (a) the throat edge ends in a pointed skin tip that lies over the shirt's cut top-left corner (about 935,240 in `out/edu01/w58/c0_ba.png`), so the skin looks like it slightly overshoots the shirt (N1); (b) a 2-3 px pale-blue tooth of background at the nape where hair, neck and shirt meet, at about x 545, y 890 (N2). |
| S01-B01-SH02 | f124-160 (8 frames) | Close-up. Same neck, clean of strokes. N2 is clearest here: a navy/blue triangle about 8x10 px pokes up between the hair's lower edge and the neck (`z_cu140.png`, right panel). The face plate and neck plate have slightly different skin tones, so a soft tonal seam runs from below the cheek down to the throat. It reads as the jaw, not a box. A short dark tick where the head outline stops under the chin (N4). |
| S01-B02-SH01 / SH02 | f161, f220, f273, f274, f310, f330 | Same as B01-SH01; nothing new. |
| S01-B03-SH01 | f331, f345, f360, f375 | Bedroom part clean at f331. During the dissolve, cloud texture crosses the face (f345-360, as in W5.6 N3) and at f375 a pale-blue horizontal cloud strip crosses the jaw/neck. This reads as the dream dissolve, not as an object. |
| S01-B03-SH05 | f550, f560, f570, f578 | Clean. f550 is lit brighter (hair dark grey). |
| S01-B07-SH02 | f1582, f1610, f1636 | Clean, same as B01. |
| S01-B08-SH01 end | f1830-1858 every frame | Clean and steady. Neck-region frame-to-frame PSNR is 42-49 dB, and identical (inf) from f1844 to f1858. The only dip, f1835→1836 at 27 dB, is the eye closing, not the neck (`c_b08_1834-1837.png`). |

## Part 2: transitions and seated shots

| Item | Result | Evidence |
| --- | --- | --- |
| B08-SH01 lie-back f1795-1830, every frame | **PASS (nits)** | `c_lieback_1795-1830.png`, `c_lieback_neck_1795-1830.png`, `c_lieback_zz.png`. Smooth arc and no white collar wire at any frame. The neck widens steadily into the lying neck with no spike. Nits: the sleeve disc pops off in one frame (N3). A thin dark line (the head outline) runs diagonally down across the neck skin f1803-1808 (N4). From f1806 a small blue notch sits between neck and shirt top. A faint dark vertical hairline runs along the shirt's left edge f1812-1813. |
| B04-SH01 rise f575-605, every frame | **PASS (nits)** | `c_rise_575-605.png`, `c_rise_neck_579-590.png`, `c_rise_collar.png`. Smooth. The collar stroke fades in from f588 and is full by f591. Its tip ends at the shirt edge (2-3 px proud at f592, `c_collar_wire.png`), the same as W5.6, which passed. The sleeve disc pops on in one frame (N3). The dark outline line crosses the neck f580-583 (N4). From f594 it is the W5.6 picture: PSNR vs W5.6 is 105-113 dB at f594-605 and 74.8 dB at f590. |
| Seated B04-SH02 / B07-SH01 unchanged vs W5.6 | **PASS** | PSNR vs `out/edu01/vc-w56/stills/`: f613 107.0, f650 110.0, f1483 107.6, f1530 116.1, f1581 104.3 dB. The pictures are identical. |

## Part 3: loop seam

- **PASS.** f1858 vs f0: PSNR 52.24 dB, the same as W5.7. f1844-1858 are identical in the neck region.

## Is the user's complaint resolved?

**PASS.** Compared with W5.6 (lying PSNR vs W5.6 is 35.5-43.8 dB, so the lying look did change), the white V wire on the lying shirt, the skin spike at the shoulder corner, the flat box foot of the neck and the outline running down the nape are gone in every lying shot. What a user could still read as "growing out", most likely first:
1. **N1, the throat's pointed skin tip** lying over the shirt's cut corner, in every lying wide and at the B08 rest. It looks like the neck pokes past the shirt.
2. **N2, the blue tooth at the nape**, most visible in the B01-SH02 close-up.
3. **N3 and N4 in motion**: the sleeve disc blinking on or off, and the dark outline across the neck during the rise and the lie-back.

## Nits, ranked

1. **N1 throat tip over the shirt corner** (all lying shots; B01-SH02, B08 f1813-1858). The throat edge is straight and ends in a point above the shirt's cut top-left corner. Suggest rounding the shirt's top-left into a shoulder that covers the throat end, or ending the throat inside the shirt.
2. **N3 sleeve disc pop** (B04-SH01 f583→584, B08-SH01 f1804→1805). The pale shoulder/sleeve disc appears or disappears in one frame. This was already present in W5.6 (`c_pop_w56_vs_w58.png`, top row W5.6, bottom row W5.8) and is not caused by this repaint. At speed it can read as something jumping out of the shirt.
3. **N2 nape tooth** (all lying shots; about 8x10 px in B01-SH02 f124-160, 2-3 px in the wides). A blue background sliver between hair and neck.
4. **N4 outline across the neck in transitions** (B04-SH01 f580-583, B08-SH01 f1803-1808). The head outline still runs down across the neck while rot is between 0 and about 0.2. At rest there is only a short tick under the chin.
5. **Carried over from W5.6:** the crown notch and cheek "v" (W5.6 N1, N2) remain, and the B03-SH01 dissolve blotches remain (W5.6 N3, plus the f375 cloud strip across the jaw).

## Images

All in `out/edu01/vc-w58/`: `s1_lying.png` (overview), `z_cu140.png` (close-up neck, N2), `c_wide1.png`, `z_b01b02.png`, `z_others.png`, `c_lieback_neck_1795-1830.png`, `c_lieback_zz.png`, `c_rise_575-605.png`, `c_rise_neck_579-590.png`, `c_collar_wire.png`, `c_pop_w56_vs_w58.png`, `c_b08_1834-1837.png`, plus `stills/`.
