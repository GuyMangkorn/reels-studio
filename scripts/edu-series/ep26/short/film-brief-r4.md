# EDU-EP26-SHORT — Film visual brief R4

- `EDU-EP26-BRIEF-R4`, Film, 2026-11-18. Status `ready-for-review` (untimed; look proposals painted, user picks pending). It is not approval and not picture proof.
- Replaces [BRIEF-R3](film-brief-r3.md) for this deliverable after the user's three answers (AskUserQuestion, 2026-11-18): (1) the approved workshop look LF01–LF03 does **not** carry over, design a completely new look set for the Marcus story; (2) the final frame is a **new street exterior** with a passer-by holding their nose, Marcus keeps the CL04 ribbons; (3) **no "Pecunia non olet" caption anywhere**.
- Inputs unchanged: [EDU-EP26-SCRIPT-R2](script.md) (20 lines, Thai locked), [script notes](script-notes.md), [research staging boundaries](../research.md#story-and-staging-boundaries), [fact-check on the R2 candidate](fact-check-r2-candidate.md). Channel `edu` ([channel.md](../../../../channels/edu/channel.md); no `look.md`). Checkout `5e40444` plus this pass's uncommitted files.
- Shots: [storyboard.md](storyboard.md) and [review-rows.json](review-rows.json), both `EDU-EP26-ROWS-R4`, same 22 shot IDs.

## What carries over from BRIEF-R3 (by reference)

Kept as written: visual intent and chapter-light logic ([BRIEF-R3 visual intent](film-brief-r3.md#visual-intent)), the sound direction ([BRIEF-R3 sound](film-brief-r3.md#sound-direction)) with one change below, the visual progression table, [VD26-11 smell cue CL04](film-brief-r3.md#vd26-11--the-smell-cue-cl04-answering-the-film-question), [VD26-12 wine inset](film-brief-r3.md#vd26-12--wine-comparison-l09), [VD26-13 imperial room](film-brief-r3.md#vd26-13--imperial-room-vespasian-and-titus-new-location-needs-look-approval) (set plan, cast and O5 limits; re-lit and painted here), [VD26-14 coin mirror CL03](film-brief-r3.md#vd26-14--the-coin-mirror-cl03) (screen values re-measured below).

**Retired:** VD26-08 (workshop carry-over), VD26-10's anchors in the old VD26-06 axes (re-planned in VD26-18), VD26-15's proverb option, VD26-16 (doorway final frame), LF01–LF03 as look references (store `projects/edu/EDU/ep26-wash-bench-look-r1/` stays as history).

**Sound change.** Ambience gains the **street at dusk** (thin evening murmur, a far cart, a dog once, swifts) for B06-SH05; the ending droop plays over it. Everything else as BRIEF-R3.

## VD26-18 — The new workshop: a sun-baked fullery (`new: fullonica-r4`)

Story first: Marcus thinks he is joining a respectable, bright, busy trade; the place should look cheerful at a glance and only reveal its trick in the tubs. Warm Pompeian palette in place of the retired indigo: ochre plaster (`#d9a65c`) over a terracotta-red dado (`#a4472f`), crushed-terracotta floor, dark timber beams, a **light well** in the roof that drops a hard morning sun shaft onto a row of **three masonry tread stalls** along the back wall, dyed cloth (saffron, madder, indigo, white) on two drying poles overhead, the street door bright at frame left. Colour accents belong to the story: Marcus's sky-blue tunic, the terracotta jar.

| Element | Space W, metres (origin floor centre; `+x` right from the intake camera, `+y` up, `+z` toward the camera; estimates, code `src/painted/edu26/fullonica.ts`) |
| --- | --- |
| Room | x −3.0..+3.0, z −3.2..+2.4, ceiling 3.4; light well x −1.4..+1.2, z −3.0..−1.7 |
| Tread stalls | x −1.75..−0.80, −0.65..+0.30, +0.45..+1.40; z −3.2..−2.30; front wall top y 0.62; partitions (0.12 thick) top y 1.08 = where the treader's hands brace; liquid surface y 0.36, grey-teal `#86a39b` with a froth edge, **no diagnostic colour** (F004); a wad of cloth in each |
| Rinse cistern (F002, "อีกอ่าง") | x −2.95..−2.15, z −3.0..−1.55, rim 0.80, clear blue water, bronze spout from the left wall at y 1.2 |
| Street door | left wall x −3.0, z −0.3..+1.1, height 2.45; sun spill on the floor |
| Folding bench | x −0.80..+0.80, z −0.70..−0.12, top 0.86; folded cloth stack at its right end, reed basket by the right leg |
| Jar corner | right wall: three tall lidded jars on the floor near (+2.2..+2.6, −2.8..−2.2), a shelf of small pots at y 1.6, paddle, bucket |
| Drying poles | y 2.6 at z −1.25 and z +1.4 (the near pole is drawn only for cameras behind it) |
| Props (UT12) | jar corner, shelf pots, cloth stack, reed basket, broom, stool by the door, bucket, paddle, spout: 9, each with a contact shadow |

Light moods (one set, three balances): `morning` (sun shaft from the well, B01–B02), `setback` (grey-green cast, B03), `door` (backlit door, cooler interior; the evening pickup B04 uses the `door` balance warmed to gold at the timed pass).

Thumbnails ([look thumbnails](../../../../docs/sequence-workflow.md#look-thumbnails)): `TH-WA` wide from the bench under the sun shaft, `TH-WB` from the jar corner toward the backlit door with Marcus entering, `TH-WC` high angle down into the middle stall. **Film recommends TH-WA** for the room read and TH-WC's angle for B01-SH04 frame 0. LF04 and LF05 are painted on the TH-WA balance; a different pick repaints them.

## VD26-19 — Marcus and the senior (redesigned)

- **MARCUS** `man-spiky + new: marcus-tunic`, 1.62 m, head scale 0.97, about 17: sky-blue knee tunic (`#4f86c0`), rope belt, sandals in B01–B02, barefoot from B03; messy spiky black hair, olive skin; plain mouth (`line`), profile side detail on. Expressions `happy`, `smug`, `disgusted`, `worried`, `relieved`. Key poses on `KP-MARCUS` (four views) and `KP-MARCUS-CLOSE` (vow, nose pinch + point, bluff scratch, coin sniff).
- **SENIOR** `man-buzz + new: fuller-apron`, 1.70 m, about 45: balding with a grey beard, sand tunic, leather apron, bare feet; `happy` throughout.
- **CUSTOMER** (B04 only, not painted this pass): `woman-curly + new: stola-madder`, madder-red stola, pinned curls; she must read against the warm wall, so her stola is the one saturated red in B04.

## VD26-20 — Vespasian and Titus (painted, unchanged design)

As VD26-13: Vespasian `man-elder` without the moustache, grey fringe, white toga with a purple band read, laurel wreath; Titus `man-crop`, white tunic with two narrow purple stripes. Room re-lit: lamp key from the left with a soft wall glow (no glow disc), window gold back right. Thumbnails `TH-IA` (square two-shot, lamp) and `TH-IB` (angled from the curtained door, window light); **Film recommends TH-IA**; LF06 is painted on it.

**CL03 measured on LF06** (1080 × 1920; R5 re-measure after the arm fix, camera eye x −0.08, Vespasian feet (+0.16, 0, +0.24) with his near left arm reaching, coin 6 cm ahead of the nose and lifted clear of the pinch): Titus's nose (388, 767), coin centre (436, 767), coin about 42 px. R4 values (308/344) retire. B05-SH01 repeats these screen values with Marcus at the timed pass (BRIEF-R3's estimates 560/790 retire). The coin is drawn at 5.3 cm (the kit coin is 2.4 cm, scale 2.2) so the hero coin reads; a story-size exaggeration inside the labelled reconstruction (open to Boat).

## VD26-21 — The street ending (`new: roman-street-dusk`, new location)

Story first: Marcus walks home happy with his first coin and no idea; the street tells us everyone else knows. Space S (metres): origin on the road centre at the fullery door's z; `+x` right, `+y` up, `+z` toward the camera; basalt road x −1.3..+1.3 with ruts, raised sidewalks y 0.32, house fronts at x ±2.6 in mixed ochre, red and cream to z −42, shop openings with shutters, wooden balconies, stepping stones at z −4.0, a public fountain on the right sidewalk at z −6.5, the fullery the first house on the left with cloth hanging outside its door. Dusk: deep blue sky, a last orange slit at the street's end, the right fronts catching warm light, two lamp-lit shops.

- **PASSERBY** `woman-long + new: stola-dusk`, 1.60 m: dusty rose stola, ochre shawl, bread basket on the far hand; she turns toward Marcus, leans away and pinches her nose (`disgusted`). She is the punchline; the ribbons never touch her.
- B06-SH05 camera (TH-SA / LF07): eye (+0.10, 1.38, +2.35), yaw 0°, pitch +1°, f 950, hy 960. Marcus feet (−0.42, 0, −0.45) facing (0.15, 1), raised fist with the coin; passer-by feet (+0.62, 0, +0.15) facing (−1, 0.45). Measured leads: Marcus 561 px, passer-by 702 px; both faces above the caption band. **R5 (LF07 only):** the camera moves 1.3 m down the same axis to eye (−0.22, 1.30, +1.05), pitch +3°, f 950, hy 880; the passer-by stands deeper at (+0.55, 0, −2.10) facing (−1, 0.45). Marcus 1,077 px, passer-by 495 px; raised fist authored on the drawn shoulder (elbow out, 0.25/0.28 m bones); hero coin 3.6 × the kit coin (8.6 cm, 55 px) with a warm halo and a four-point glint, a story-size exaggeration on the payoff beat only (open to Boat).
- Thumbnails `TH-SA` (down the street) and `TH-SB` (across from the fullery door, later dusk). **Film recommends TH-SA**; LF07 is painted on it.

## VD26-22 — Labels and captions (decided)

**แต่งเติมจากเรื่องจริง** under the `@TamMaiLa` mark from frame 0 to the end, as BRIEF-R3. **No "Pecunia non olet" caption anywhere** (user, 18 Nov 2026); B06-SH04 shows the coin only. No world text.

## VD26-23 — Hands (user rule, final, 18 Nov 2026)

POV shots use five-finger 3D hands (`Hands3D`); EP26 has no POV shot. Elsewhere mittens are the default and Film picks the 3D hand only where the fingers must read. Choices, per shot:

| Shot | Hands | Reason |
| --- | --- | --- |
| B02-SH04 | Marcus's pinching hand 3D; pointing hand mitten | The nose pinch is the gag and needs a thumb and finger on the nose |
| B05-SH01 | Marcus's coin hand 3D (coin 3D) | He picks the coin up and holds it at his nose: fingers on a 5 cm coin |
| B06-SH02 | Vespasian's coin hand 3D (coin 3D, forearm tube in the toga colour) | The CL03 mirror of B05; the pinch at Titus's nose is the image |
| B06-SH03 | Vespasian's tapping hand 3D | A finger taps the coin on "ได้มาจากฉี่" |
| B06-SH04 | Vespasian's fingers 3D | Close insert on the coin in his fingers |
| All other shots, incl. B01-SH06 vow, B02-SH02 lid lift (senior at 2.6 m), B03 braced hands and wringing, B04-SH05 scratch, B06-SH05 raised fist | Mittens | The gesture reads from the arm and mitten; the lid is a painted prop |

Hand placement uses the kit's body-frame method (`placeMidHand`) for every hand, so wrists and coins sit on world anchors in both cases (`src/painted/edu26/r4-hands.ts`).

## VD26-17R — Look frames painted this pass (W3)

| ID | Shot | Proves | Store (`projects/edu/EDU/ep26-r4-looks/`) |
| --- | --- | --- | --- |
| `TH-WA`, `TH-WB`, `TH-WC` | B01-SH04 / B01-SH05 | Workshop framing and light options | `TH-W*.png` |
| `TH-IA`, `TH-IB` | B06-SH02 | Imperial room options | `TH-I*.png` |
| `TH-SA`, `TH-SB` | B06-SH05 | Street ending options | `TH-S*.png` |
| `LF04` | B02-SH02 | New workshop, Marcus's yuck face (worried brow, scrunched eyes, grimace; R5), near open mitten fanning the smell, open jar, CL04 jar → nose with a darker under-pass, senior with the lid | `LF04.png` |
| `LF05` | B03-SH02 | R5: high 3/4 camera at the stall wall (eye (−0.20, 2.00, −1.95), yaw +22°, pitch −30°, f 760, hy 520, cx −40). Marcus in the middle stall to mid-shin, right mitten holding his nose, left braced on the partition; shins seen through the murky liquid, ripple rings, foam and splash drops; senior treading the next stall and wringing cloth (F005); drip-line cloth over the stalls, gutter and basket in the foreground; grey-green cast, faint ribbons | `LF05.png` |
| `LF06` | B06-SH02 end | CL03 with the 3D coin pinch at Titus's nose | `LF06.png` |
| `LF07` | B06-SH05 | Street ending, CL04 on Marcus, passer-by pinches her nose | `LF07.png` |
| `KP-MARCUS`, `KP-MARCUS-CLOSE` | B01-SH06, B02-SH04, B04-SH05, B05-SH01 | Marcus in four views and four close key poses | `KP-*.png` |
| `KP-INSET` | B03-SH05 | R5: VD26-12 wine inset, 420 px circle centred (790, 470) over the LF05 plate (covers the senior for the line); inside, `woman-curly + new: grape-treader` (red tunic) knee-deep in a wooden vat in a daylight vineyard, laughing with a clay cup at her lips. Review still composited with ffmpeg (`inset-composite.sh` in the store folder) | `projects/edu/EDU/ep26-r5-looks/KP-INSET.png` |

Source: `src/painted/edu26/r4-looks.ts` (registry), sets `fullonica.ts`, `palace.ts`, `street.ts`, cast and props `r4-cast.ts`, hands `r4-hands.ts`, entry `r4-look-index.tsx` (compositions `EDU26-R4-<id>` and `-Background`). Measures: `scripts/edu-series/ep26/short/measure-r4-looks.ts`; evidence in [build notes](../build-notes.md#w35-r4-look-proposals-2026-11-18).

## Technical handoff (changes to BRIEF-R3's seam table)

| Seam | Proposal | Status |
| --- | --- | --- |
| Workshop set | `fullonica.ts` (look-defining, Film); Boss hardens after the pick | `exists-unintegrated` (still entry only) |
| Tread stalls, liquid over shins | Stall back part → treader → liquid from the feet forward → front wall (hides submerged legs by paint order) | `exists-unintegrated` |
| Imperial room, street | `palace.ts`, `street.ts` | `exists-unintegrated` |
| Cast | `r4-cast.ts` (Marcus, senior, Vespasian, Titus, passer-by; laurel, clavi, jar, coin, ribbons, wrung cloth) | `exists-unintegrated` |
| 3D hand and coin over a painted figure in a yaw-camera set | `r4-hands.ts` + kit `Hands3D` layer per still | `exists-unintegrated`; R5: LF06 seam removed by using the near arm (painted to the wrist, 3D hand only; the far arm's forearm hides behind a 3/4 body). Painted arms on world-placed hands are re-fitted on the drawn shoulder (`fitArms` in `r4-looks.ts`, bone 0.26 m); Boss hardens this into the kit (the world shoulder of a 3/4 or side body does not land on the painted one) |
| Jar lid in hand | Painted prop at figure scale; a 3D lid prop does not exist in the kit (`hand-props.ts` has no lid) | `missing` if a later shot needs it close |
| Wine inset, coin-flip transition | As BRIEF-R3 | `missing` / `unknown` |

## Open questions

- **User.** Thumbnail picks settled (TH-WA, TH-IA, TH-SA; 18 Nov 2026). Open: approve LF04–LF07, KP-INSET, Marcus's look and key poses.
- **Boat.** As BRIEF-R3 (laurel, purple band, striped tunic, coin bowl), plus: a 5.3 cm coin as a readable story size; the street's fountain, stepping stones and balconies as generic Roman-town reads (no named site).
- **Editor (voice lock).** As BRIEF-R3.

## Change log

- R4, 2026-11-18, Film. New look set on the user's three answers: VD26-18 new fullery (retires the VD26-05/06 carry-over and LF01–LF03 references), VD26-19 Marcus/senior redesign, VD26-20 imperial room painted and CL03 measured, VD26-21 new street ending with the passer-by, VD26-22 no proverb caption, VD26-23 hand choices per the user's final hand rule (18 Nov 2026; the coordinator's two earlier hand messages were withdrawn), VD26-17R painted thumbnails, look frames and key poses. BRIEF-R3 stays as history.
- R5, 2026-11-18, Film (W3.5 fix round on the viewer check and two user notes). Thumbnail picks recorded; LF04 fan hand and yuck face, LF05 repaint, LF06 near-arm reach and coin lift (CL03 re-measured), LF07 closer camera and 3.6 × hero coin, KP-MARCUS-CLOSE sniff coin, KP-INSET painted; arm anatomy check on every still (user: arms too long in the workshop and LF06, sniff arm detached), numbers in the build notes. Store `projects/edu/EDU/ep26-r5-looks/`.
