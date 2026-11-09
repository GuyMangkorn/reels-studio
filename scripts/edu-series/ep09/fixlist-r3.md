# EDU-EP09-SHORT fixlist — Draft round 3 (user, 2026-11-09)

Source: user verdicts on the review page, Draft tab, ROWS-R2.1, clips from the round 2b cut (Editor bfa78a5), plus one chat note. Passed: B01-SH01, B01-SH02, B02-SH02, B03-SH01..04, B03-SH07..09, B04-SH01, B05-SH01, B05-SH02, B05-SH03 (FX07 fold fix accepted).

Chat note (verbatim): "ให้ฟีมเข้ามาแก้หน่อย อยากให้ฝ่ามือ ตากับหลาน มีเนื้อเหมือนมือนักเปียโน"

| ID | Shot | User note (verbatim) | Reading |
| --- | --- | --- | --- |
| FX11 | S01-B01-SH03, S01-B02-SH03 | "ฝ่ามือดูไม่มีเนื้อเลย => ให้ดูมีเนื้อได้ไหม" (both rows) | The macro hand body (in TP the camera sees the back of the hand, the user says ฝ่ามือ for the whole hand body) has no flesh: a pale flat polygon with a straight shade band and an oval highlight that reads as a sticker; in SH03 the wrist is a flat tube butting into it. Give it the [pianist hand](#pianist-hand) look in the kit `drawPalm` (src/painted/kit/hands.ts). Third pass on the palm volume (FX05, FX09 before): fix-pass cap, the user decides after this. |
| FX12 | every shot with ELDER's or BOY's hands; dining set first (S01-B01-SH02, SH04, B02-SH02, B03-SH07, SH08, SH09) | chat note above | Same pianist fullness for both characters wherever their hands show. The dining hands draw through the same kit `paintHandMacro` (via `paintTableArm`, src/painted/edu09/dining.ts), so FX11 carries over; at dining size apply the small-size gate below and the wrist taper. ELDER = the same fullness, older surface (spots kept, knuckles a touch more marked); BOY = smoother, rounder. |
| FX13 | S01-B01-SH04 (and every dining shot and LF02, which show the box) | "เอากล่องนมออกจากฉากไปเลยได้ไหม แขนคุณตา จะได้ไม่เหมือนโดนยืด" | Remove the milk box (`JUG`) from SET-DINING entirely. With it gone, re-route ELDER's right arm in the stop so it reads as a natural bent arm, not stretched (see FX13 staging below). No narration, caption or timing refers to the box. |
| FX14 | S01-B02-SH01 | (verdict `change`, no note) | Open: ask the user what to change. Do not guess. The kit palm fix (FX11) will re-render this shot anyway. |

<a id="pianist-hand"></a>
## Pianist hand look (FX11, FX12)

Story and mood first: a warm after-dinner table, a grandfather and grandson testing their own hands; the hands are the heroes of the macro shots and must feel alive and soft, like a pianist's hand resting in the arch: full, round, relaxed, never bony or paper-flat. Under the lamp (behind-above in the macros) light rolls over rounded forms.

Visible face per shot: TP and flat poses show the **back of the hand** (camSide ≥ 0); the palm side shows only when the camera sees the underside (camSide < 0). Both are specified; the back is what the user saw.

- **Back of the hand (dome).** One soft dome from the wrist to the knuckle line, highest over the 2nd–3rd metacarpal: a gradient, not a hard band. Light side gets a broad warm lit area that follows the dome (a curved, lit falloff shaped by the outline, at least 40% of the area), the shadow side a soft core shadow 15–25% of the width in from the edge, then a slightly lighter reflected rim at the very edge (table bounce). No oval highlight patch with its own edge.
- **Thumb web pad.** The fleshy bulge between thumb and index (first dorsal interosseous) bulges out past the straight line thumb-base to index-knuckle: outline bows outward 0.3–0.4 cm (size 1), lit top, soft shadow below it.
- **Little-finger edge.** The hypothenar side rolls down to the table as a rounded edge (outline bow 0.2–0.3 cm), its own core shadow, not a cut edge.
- **Knuckles.** Four MCP heads as soft rounded bumps on the dome (lit tops, tiny shadow downstream), with shallow dimples between them; the outline over the knuckle line undulates (no straight front edge).
- **Wrist and heel.** The wrist tapers in, then the hand flares out into a soft rounded heel (outline curve, not a corner); the forearm tube blends into the hand by a shared gradient over 0.6–0.8 cm, no hard seam band.
- **Palm side (camSide < 0).** Full thenar pad (by the thumb, the largest), full hypothenar pad (by the little finger), a soft rounded palm heel; a soft core shadow in the hollow between the pads; three palm creases (thenar crease, heart line, head line) as thin warm-dark strokes, 0.5–0.7 px at 1080 w per size-1 cm, broken, low contrast.
- **Fingers.** Slender but fleshy: each phalanx slightly fuller at mid-length than at the joints; on the palm side a plump pad bulge per segment; on the back, small soft knuckle shading at PIP/DIP (already present, keep). Keep the approved L4 lengths and SPLIT; volume only, no length change.
- **Colour.** Lit pad tops warm (skin toward a peach highlight, not white), core shadow warm-brown (skin × shade, not grey), reflected rim between them. Same light direction `ls` as the fingers so palm and fingers read as one lit form.
- **Small-size gate (dining).** When the hand is under ~60 px wide at 1080 w: dome gradient + thumb-web bulge + knuckle undulation on the outline only; no creases, no per-knuckle bumps.

Accept (frame check, Boss and Editor): on B01-SH03 L30 and B02-SH03 L0/L110 the hand body shows a continuous light-to-shadow roll with at least three tone steps, the thumb-web and little-finger outlines bow outward, no highlight has a visible edge of its own, the wrist-to-hand join has no hard band; the fingers keep their L4 lengths (FX01–FX03 measures unchanged); BOY's and ELDER's dining hands show the dome and thumb web at their size. Compared side by side with the bfa78a5 frames.

<a id="fx13-staging"></a>
## FX13 staging (S01-B01-SH04, SET-DINING)

- `JUG` and `paintJug` leave the set; the tissue box (0.62, 0.72, −0.30) and the glasses stay; nothing else moves.
- ELDER's right arm: hand path and timing kept (lifts L12, settles L27, lowers L27–47). With the space beside his body free, his elbow comes forward onto the wood instead of trailing over the back edge: elbow (0.20, 0.746, −0.36) → (−0.04, 0.746, −0.34) (`est`, Boss solves against the kit `man-elder` limb lengths). Allowed: lean up to (−0.22, 0, +0.10) m (was −0.18), and the stop point may move up to +0.04 m in x (to (−0.21, 0.72, −0.205)) so it still lands over BOY's right wrist, at least 4 cm short of his left hand.
- Accept: on L27 and L47 ELDER's right upper arm and forearm each measure within ±10% of his left arm's matching segment (world metres, from the solved points), the elbow visibly bent (≥ 25°), the arm leaves the shoulder, not the chair back; no prop near his arms; no finger touched (R02); LF02 re-rendered without the box.
