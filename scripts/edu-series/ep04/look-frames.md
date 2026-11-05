# EDU-EP04-SHORT look frames v1 (W3, Boss, 2026-11-05)

Not approved, not committed. Brief: EDU-BRIEF-R1.1. PNGs: `out/edu04/look-frames/v1/` (1080x1920): LF01.png, LF02.png, LF03.png, LF04.png, EX01.png (props proof, not a look frame), `qa-sheet.png` (four LF at 270 px).

Render: `printf 'EDU4-LF01 30 out/edu04/look-frames/v1/LF01.png\nEDU4-LF02 60 ...LF02.png\nEDU4-LF03 40 ...LF03.png\nEDU4-LF04 40 ...LF04.png\nEDU4-EX01 10 ...EX01.png\n' | node scripts/stills.mjs src/painted/edu04/look-index.ts` (one Chrome).

| ID | Shot | Source (`src/painted/edu04/`) |
| --- | --- | --- |
| LF01 | S01-B01-SH01 (L01) | `look.tsx` LF01 + `checkout.ts` `paintCheckout`, `b01Cast` (SET-CHECKOUT, 12 figures, 3 lanes), `cast.ts` |
| LF02 | S01-B03-SH03 (L08 state) | `look.tsx` LF02 + `plan.ts` `paintPlan` (PLAN, 130 px/m) + `plan-labels.tsx` (eyebrow, "1/3", "แบบจำลอง", "คุณ") |
| LF03 | S01-B05-SH01 (L15) | `look.tsx` LF03 + `bubbles.ts` `paintHotBubble` / `paintPaleBubble` |
| LF04 | S01-B06-SH01 (L17) | `look.tsx` LF04 + `checkout.ts` `shared: true` (stanchion serpentine, rows z -2.6/-3.55/-4.65/-5.75), `b06Cast` (9 customers) |
| EX01 | props proof | `props.tsx`: `TitleStrip` (VD16), `paintTally` (VD11), `StampText` "ซวยตลอด" (VD12) |

Kit use: PEOPLE `man-parted` (office wardrobe + burgundy tie = `new: rush-hour-blazer`), `man-crop` / `woman-ponytail` / `woman-bob` + `vendor` with store-green apron and badge (`new: store-uniform`), the other 8 shoppers unchanged; `new: shopping-basket`, `new: content` face (`CONTENT`), `new: plan-diagram`, `new: memory-bubble`, `new: tally doodle`, `new: stamp text`, `new: title strip`. Kit intake at W8.4.

## W3 v1 revisions of the brief's `est` values (need Film's note)

- LF01 camera: brief `yaw -30, r 2.6, f 1100` puts the camera inside the till-1 cashier and the till pole. v1 is a high view down the lane-2 axis: `T-MAN, yaw +4 -> +2, r 5.5 -> 5.1, eye 2.4, pitch -10, f 880, hy 740, cx 20`, so all three lane colours fit. Lane-2 S1/S2 are staggered (x -0.30 / -0.32) so MAN is not hidden. MAN is about 290 px tall (head about 70 px), not a lead size.
- LF04 camera: `T-HEAD, yaw +6 -> +3, r 6.2 -> 5.8, eye 2.9, pitch -15, f 960, hy 980`.
- LF03 `hy 1000` (brief 900) so the head sits y 770-1095.
- Added hanging lane signs (1/2/3 bars in lane colour) over each counter for lane reading; not in the set plan.
- Lane-tail belts of LF04 are closed on all three lanes (L17 is before MAN is called).
- Stanchion layout (rows z -2.6 / -3.55 / -4.65 / -5.75, entrance gap x -1.5..-0.5) is Boss's reading of "3 switch-backs 1.10 apart".

## v2 (W3, Boss, 2026-11-05) LF01 and LF04 repainted

Not approved, not committed. v1 untouched. PNGs: `out/edu04/look-frames/v2/` LF01.png, LF02.png and LF03.png (copied unchanged from v1), LF04.png, `qa-sheet.png` (four LF, 270 px). Render: `printf 'EDU4-LF01 30 out/edu04/look-frames/v2/LF01.png\nEDU4-LF04 40 .../LF04.png\n' | node scripts/stills.mjs src/painted/edu04/look-index.ts`.

- LF01 (three lanes kept, lane 1/2/3 signs kept): camera `T-MAN (0, 1.55, -1.3), yaw -6 -> -4, r 3.8 -> 3.5, eye 1.9, pitch -6, f 860, hy 790, cx -90`. MAN moved from lane-2 slot 3 to slot 2 (elder slot 3) so he stands nearer the camera. Measured MAN height at 1080x1920: about 410 px (head about 90 px), v1 290 px. A close camera cannot hold all three lanes and a bigger MAN: this is a compromise, lane 3 shows as its coral stripe, the edge of its sign and its shoppers. Not a full-body hero size; Film to judge.
- LF01 lane stripes widened (0.08 m to 0.25 m, longer, z -5.5..1.5); teal, amber and coral read at 270 px. Hanging signs moved from z -0.8 to z -1.4 so all three sit nearer MAN's depth.
- LF01 clipping fix (user note): in v1 the lane-2 shoppers `shaved` (with trolley) and `curly` stood at x -0.3 with the trolley box over the till-1 cashier; the man's lower body sat inside the grey block. Now `shaved` is behind in lane 2 slot 5 (trolley clear of `elder`), `curly` is lane 3 slot 3, `girl` moved to behind `pixie` in lane 1 (x -2.5, z -2.2; she overlapped the lane-1 rack/counter volume). Cashiers moved 0.15 m outward (`laneX + 1.65`). Check: footprint test of every B01/B06 figure (0.56 m x 0.36 m) against the counter, rack and lamp-pole boxes in checkout.ts, no hit; plus viewed frames. Not a side-view render.
- LF04: camera `T-HEAD, yaw +4 -> +2, r 3.5 -> 3.2, eye 2.0, pitch -3, f 1050, hy 640, cx 0`, centred down the queue, so the cashiers, the till pole and the lamp are out of frame. MAN about 545 px (head about 125 px, closed-eye smile about 2x v1), v1 290 px. Till 2 green: the pole lamp is now behind the close camera, so every lit till repeats its status as a lamp under its hanging sign (`checkout.ts`, only when the light is not off); LF04 shows the green disc under sign II. One line, 9 customers, no clock, no wait numbers.
- Caption band y 1176-1344 (luma, mean / p95): LF01 0.738 / 0.879, LF02 0.921 / 0.923, LF03 0.603 / 0.939, LF04 0.633 / 0.879. Default limits 0.25 / 0.40 fail on all four. Per-look decision (user, 5 Nov 2026): this cream look is checked against a relaxed luma limit instead; the caption layer carries its own outline and shade, so the band is judged on the viewed sheet plus these numbers (no object or face in the band that a caption would hide). The rule documents are not edited.
- Kept: no shorter-wait or average-wait number anywhere; "1/3" always with "แบบจำลอง" (LF02 unchanged).
