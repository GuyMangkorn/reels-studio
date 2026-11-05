# Viewer check: EDU-EP01-SHORT W5.6, head/neck shadow and lie-back repaint

- **Check:** [viewer check](../../../docs/sequence-workflow.md#viewer-check), fresh Film invocation (Opus, medium), 2026-11-05. The checker did not paint the repaint and read the build notes ("W5.6 repaint") only after Part 1. Stills only; no art or code edited, nothing committed or published.
- **Inputs:** 101 full-size stills from `node scripts/render.mjs EDU-EP01-SHORT --stills --frames=...` (log `out/logs/vc-w56-stills.log`, 56.8 s), copied to `out/edu01/vc-w56/stills/`. Every frame f579-605 (B04-SH01 sit-up), every 3rd f550-578 (B03-SH05), every 4th f1746-1858 (B08-SH01), 3-5 per other shot. B08-SH01 lie-back also checked every frame (f1779-1814) from the draft clip `out/EDU-EP01-SHORT/clips/S01-B08-SH01_draft.full.mp4` (clip frame n = f1715+n). Sheets 270 px, crops near 1:1, all in `out/edu01/vc-w56/`. Stills include captions and overlays.
- **Result:** all user items pass (a: 5/5, b: 2/2), seam pass. **Must-fix: 0. Nits: 5.**

## Part 1: unanchored, per shot

| Shot | Frames | Reads as | Figure findings |
| --- | --- | --- | --- |
| S01-B01-SH01 | f0-123 | Girl asleep in a moonlit bedroom, eyes closed, then flicker open | Clean. Hair one dark mass; small stepped black notch at the crown hairline (nit N1); small "v" ink mark on the lower cheek (N2). No shadow on head or neck. |
| S01-B01-SH02 | f124-160 | Close-up of her face, eyes open on "คุณก็เคยใช่ไหม?" | Clean neck (plain skin into collar). N1 and N2 are most visible here because of the size: the stepped notch reads as a separate black block on top of the hair; the "v" floats on the jaw with no ear shape. |
| S01-B02-SH01 | f161-273 | Same wide, eyes open then closing | Clean; same N1/N2 at small size. |
| S01-B02-SH02 | f274-330 | Wide, frame dims slightly | Clean. |
| S01-B03-SH01 | f331-410 | Dream clouds dissolve in over the sleeping girl, then the pink cloud sky | Dissolve: at f345 white cloud puffs cross the lower hair and jaw; at f360-375 the hair goes translucent grey-brown with cloud blotches through it (N3). Reads as the picture melting into the dream, not as an object on the head. Stray white wisps below the bed at f345-360 (N5). |
| S01-B03-SH05 | f550-578 | Wide, eyes snap open (jolt) | Clean head and neck in all sampled frames. |
| S01-B04-SH01 | f579-605 | She sits up sharply | Smooth arc, no pops in every-frame stills. Neck short and plain at f579-590; no pale disc at f579-580. |
| S01-B04-SH02 | f613-718 | Sitting up, "hypnic jerk" title | Clean. |
| S01-B07-SH01 | f1483-1581 | Sitting up, hand on blanket | Clean. |
| S01-B07-SH02 | f1582-1636 | Lying, eyes closing ("ถ้าสะดุ้งถี่จนนอนไม่หลับ") | Clean, same look as B01. |
| S01-B08-SH01 | f1746-1858 | Sitting, lies back to sleep | Lie-back f1770-1830: neck stays short through the arc, no grey band, no disc on the chest; every-frame clip check f1779-1814 shows a smooth arc with no jumps. |

## Part 2: user items

| # | Item | Result | Frames | What a viewer sees |
| --- | --- | --- | --- | --- |
| a1 | B01-SH01 head/neck shadow, black thing | **PASS** | f0, f60, f123 (`c_heads_wide.png` row 1) | No navy shade on jaw or side of head; neck is plain skin running into the collar. Only remaining marks: crown notch (N1), cheek "v" (N2). |
| a2 | B01-SH02 | **PASS** | f124, f140, f160 (`c_closeup_b01sh02.png`) | Neck plain, no grey band, no pale ear disc. N1 is the strongest candidate left for "a black thing stuck to the head" (see N1). |
| a3 | B02-SH01 | **PASS** | f161, f220, f273 (`c_heads_wide.png` row 2) | Clean. |
| a4 | B02-SH02 | **PASS** | f274, f310, f330 (`c_heads_wide.png` row 3) | Clean. |
| a5 | B03-SH01 | **PASS (with N3)** | f331, f345, f360, f375 (`c_heads_b03sh01.png`) | No shade on the head/neck. Builder's known leftover at f360: hair grey-brown and blotchy under the cloud layer. It reads as the cross-dissolve (the whole frame is washing out to clouds), not a black object; the blotches are lighter than the hair, not darker. A viewer pausing at f360 could call it "dirty hair". |
| b1 | B08-SH01 neck not stretched on lie-back | **PASS** | f1770-1830 every 4th (`c_lieback_b08.png`), f1779-1814 every frame (`c_b08_everyframe_1779-1814.png`) | Head stays on the shoulders; neck length about constant from sitting to lying. |
| b2 | B08-SH01 neck shadow does not come back | **PASS** | same, plus f1838-1858 (`s8_b08b.png`) | No grey or navy band under the jaw at any point of the lie-back or the final rest. |
| S | Loop seam f1858 vs f0 | **PASS** | `c_seam.png`; PSNR 52.28 dB | Same pose, face, pillow and blanket; no visible difference. |

Shared-code consumers: B04-SH01 (f575-605), B03-SH05, B07-SH02 all pass, no new defect.

## Nits, ranked

1. **N1 crown notch (all lying shots; strongest in B01-SH02 f124-160).** The fringe at the top of the lying head is a stepped, notched black block that sits proud of the hair outline, like a clip or comb. Of everything left, this is what most likely still reads as "a black thing stuck to the head". Suggest blending it into the hair silhouette or showing it as a few strands.
2. **N2 cheek "v" (all lying shots; B01-SH02 f124-160).** The ear is now only a small ink "v" on flat skin at the lower cheek, with no ear shape, so it reads as a stray mark or dimple.
3. **N3 B03-SH01 f345-375 dissolve blotches** on hair and jaw (see a5). Acceptable as a dissolve; a cleaner fix is to dissolve the figure as a whole before the cloud texture crosses it.
4. **N4 lying neck shape (B01, B02, B07-SH02, B08 rest).** The neck is a flat pale trapezoid with a hard straight edge into the collar; reads slightly box-like at close-up size (B01-SH02).
5. **N5 B03-SH01 f345-360** white cloud wisps below the bed float on the floor area before the dream fills the frame.

## Sheets viewed

`out/edu01/vc-w56/`: `s1_b01.png`, `s2_b02.png`, `s3_b03.png`, `s4_b04.png`, `s5_b04b.png`, `s6_b07.png`, `s7_b08.png`, `s8_b08b.png`, `c_heads_wide.png`, `c_closeup_b01sh02.png`, `c_heads_b03sh01.png`, `c_rise_b04.png`, `c_heads_b03sh05_b07sh02.png`, `c_lieback_b08.png`, `c_b08_everyframe_1779-1814.png` (draft clip), `c_seam.png`.
