# E26-C01-S01 — The laundry shift, timed sheet B (B04–B06: pickup, coin, emperor, street) and handoffs

Deliverable: `EDU-EP26-SHORT` · Revision: `EDU-EP26-SHEET-R2` (part B; part A is [timed-sheet-a.md](timed-sheet-a.md)) · Status: ready-for-dev · Timing: checked-with-audio (the R3 measure, not ear-checked)
Inputs, target, clocks, marks (`LC`, `est`), space W, baseline, caption band, hands, chrome, the CL04 ribbon ledger and the time-passing dissolve: **see [part A](timed-sheet-a.md#clocks-and-conventions-one-home-part-b-links-here)** (one home; not repeated). Extra inputs here: [VD26-20 imperial room](film-brief-r4.md#vd26-20--vespasian-and-titus-painted-unchanged-design) (space I, set `palace.ts`), [VD26-21 street](film-brief-r4.md#vd26-21--the-street-ending-new-roman-street-dusk-new-location) (space S, `street.ts`), [VD26-23 hands](film-brief-r4.md#vd26-23--hands-user-rule-final-18-nov-2026).
Target: 30 fps · this part G [1042, 1894) = 852 frames (the final 60 are the closing hold) · composition offset 0
Evidence: runtime unverified · render/samples none · audio sync measured read only · user approval: LF06, LF07 approved 2026-11-18; this sheet not yet reviewed

## Intent and continuity

Before → after: the customer's praise and Marcus's bluff (B04) pay off "ขาว" and the vow; a coin, sniffed for the smell (B05), is answered by an emperor who did the same to his son (B06); the last picture is Marcus walking home happy with the smell on him while a stranger pinches her nose. Concealed until B06-SH05: the ribbons on the street. Not shown: any proverb caption, text in the world, a ribbon on the shirt, the coin, the customer, Titus, Vespasian or the passer-by.
Previous: B03-SH06 through the time-passing dissolve G [1037, 1047). Next: end of video (series ending sound is Film's choice, UT15).

## Baseline and assets

Link, not copy: baseline, asset table and findings of [part A](timed-sheet-a.md#baseline-and-assets). Additions for part B:

| Asset / capability | Owner path + commit | Status | Gap / consumer |
| --- | --- | --- | --- |
| Imperial room `palace.ts`, Vespasian, Titus, laurel, clavi, bronze bowl | `src/painted/edu26/palace.ts`, `r4-cast.ts`, uncommitted | exists-unintegrated | B06-SH01 to SH04; LF06 approved |
| Street `street.ts`, passer-by (`woman-long + new: stola-dusk`) | `street.ts`, `r4-cast.ts` | exists-unintegrated | B06-SH05; LF07 approved; passer-by turn, lean and nose pinch are painted in picture space on head anchors (animation `missing`) |
| 3D five-finger hand + 3D coin, near arm re-fitted on the drawn shoulder | `r4-hands.ts` + kit `Hands3D` | exists-unintegrated | B05-SH01, B06-SH02, B06-SH03, B06-SH04 (B02-SH04 in part A); hero coin 5.3 cm in B05/B06-SH01 to SH04 and 3.6 × in LF07 are story-size exaggerations, open to Boat |
| Coin-flip transition (B05 → B06-SH01) | none | **missing** / unknown | Boss/Editor; fallback: hard cut with a 6-frame bronze flash (no coin-in-coin graphic match, same story) |
| Customer (`woman-curly + new: stola-madder`), the one saturated red in B04 | none | **missing** | B04-SH01, B04-SH03; Boss paints from VD26-19 (brick-red/madder stola, pinned curls) |
| Dried shirt prop, `evening` balance | none | **missing** | B04-SH01, B04-SH03 (see part A) |

## B04-SH01 — evening: the customer comes to collect

Range and clocks: G [1042, 1125); L0 = G1042; the dissolve pre-roll starts at G1037.
Direction: the evening cut of the time-passing dissolve: low gold beam through the street door, long shadows, empty still stalls (all four changes in part A). The customer's ivory shirt hangs dry on the back pole. Marcus takes it down, walks it to the bench, hands it to the customer, who lifts it up into the door beam; the camera tilts up with the shirt.
Staging (space W): | Entity | Start | Key / end | Facing / contact |
marcus (barefoot, damp hem, `nervous`-neutral) | (−0.90, 0, −0.80) under the pole at L0 | takes the shirt down L0–L14 (G1042–1056); walks to **(−0.50, 0, +0.15)** by L34 (G1076); releases the shirt at L46 (G1088) | faces the customer; both hands on the shirt's edges |
customer (`woman-curly + new: stola-madder`) | enters the door at (−2.90, 0, +0.30) at L16 (G1058) | walks to **(−0.95, 0, +0.55)** by L34; takes the shirt at L40 (G1082); lifts it up into the beam L48–L60 (G1090–1102); peak and hold L60 | faces +x then up at the shirt |
shirt | hanging at (−0.90, 1.85–2.55, −1.25) on the back pole | folded in both hands L14–L40 | **hand-over on clear contact: both hold one edge L40–L46, Marcus lets go at L46** |
Ribbons 2 around Marcus (ledger), lit gold; the customer never reacts to them. Entry prop state: shirt hanging; exit: shirt raised in the customer's hands, Marcus's hands empty.
Camera: `cam: eye (+1.30, 1.50, +0.80), yaw −62, pitch −6, f 900` (the B01-SH05 end angle, light changed) held to L52, then tilts up with the shirt to **pitch +4** by L82 (eased). Projection run: Marcus under the pole 519 px (shirt (792, 524–754)); at the meet Marcus 724 px (head (410, 807)), customer 657 px (head (178, 813)), 232 px apart, faces above the band. Transform owner: world camera.
VO + subtitles: L12 "ตกเย็น ลูกค้ามารับ ยกเสื้อขึ้นส่องแดด", G [1042, 1119). "ตกเย็น" reads 34.6 s (G1038, before the line start; the dissolve carries it); "ส่องแดด" 36.46 s = G1094 (L52): the lift is under way.
Sound: **A2 evening ambience** replaces A1 across the dissolve: a thinner street murmur, a far cart, two or three swift chirps at G1050–1100 (`NEEDS-GEN`); music S03 soft hopeful pad enters at G1042 (low, warm; `NEEDS-GEN`); C16 customer's footsteps, sandals on stone, two steps then a soft stop, G1058–1082; C17 cloth snap as the shirt is opened in the air at G1092 (short, dry, bright, 0.3 s, `NEEDS-GEN`). Stomps and tread sounds are gone (the stalls are empty).
Mix intent: lift the pad softly at G1042; hit on the snap.
Cut: hard cut at G1125 to B04-SH03 (cut on the raised shirt).
Entry → exit: exit: shirt up in the beam, customer's face lit.
Acceptance: | G | Observable | Evidence |
G1042 | evening reads without sound: gold beam, empty flat stalls, dry shirt hanging, Marcus's damp hem | frame sheet at 270 px |
G1088 | one clear contact frame: both hands on one shirt edge, then release | frame |
G1102 | shirt above the face line in the beam; customer is the saturated red | frame |

## B04-SH03 — "ขาวดีนะ ใช้อะไรซักเนี่ย"

Range and clocks: G [1125, 1187); L0 = G1125.
Direction: closer on the customer holding the shirt up in the door beam; the shirt glows white; on "ใช้อะไรซักเนี่ย" she lowers it and turns her gaze to Marcus (off-screen). CL02 payoff ("ขาว"). The shirt is the same fold family as B01-SH06 and reads white against the warm wall: lit side ≥ 0.15 brighter than the neighbouring wall, shadow side cool grey (measured by Editor).
Staging: customer feet (−1.90, 0, +0.30) facing (+0.6, 1); shirt held up at head height **to her right (screen left) of her face** so the face stays clear (R2); lowered to chest L22–L34 (G1147–1159, "ใช้อะไรซัก" 38.22 s = G1147), eyes to Marcus at L22. No Marcus, no ribbon in frame.
Camera: `cam: eye (−1.40, 1.46, +1.40), yaw −35, pitch −6, f 990`, retention drift. Projection run: customer 1,226 px, head y 719, above the band. Transform owner: world camera.
VO + subtitles: L13 "ขาวดีนะ ใช้อะไรซักเนี่ย", G [1125, 1181); "ขาวดีนะ" reads 37.34 s (before the start: use G1125).
Sound: C18 a light tension tick under the question at G1147 (single dry tick, woodblock-like, 0.1 s, `NEEDS-GEN`); then a **6-frame half-beat hold** (G1181–1187) with the pad thinned; C19 Marcus's nervous swallow heard in this hold at **G1182**, before he appears (audio leads the picture).
Mix intent: drop the pad to near-silence in G1181–1187; release at the cut.
Cut: hard cut at G1187 to B04-SH05.
Entry → exit: exit: shirt at chest, her gaze to camera right.
Acceptance: G1125 the shirt reads white next to the wall; G1182 swallow audible before the cut.

## B04-SH05 — "เอ่อ… สูตรลับของร้านครับ"

Range and clocks: G [1187, 1267); L0 = G1187.
Direction: medium close on Marcus; he scratches his head (mitten) and grins; his eyes slide to the jar corner behind him at frame right; the senior in the background gives a thumbs-up (mitten scale). Two readable ribbons behind his head (ledger).
Staging: marcus feet (−0.40, 0, +0.12) facing (+0.2, 1), `nervous`, close-shot `scratch-head` from L8 (G1195); eyes slide to the right at L10 (G1197, on "เอ่อ…"); grin on "สูตรลับ" at L28 (G1215, 40.5 s); senior at (0.0, 0, −1.80) thumbs-up at L34 (G1221); jar corner (+2.2..+2.6, 0, −2.8..−2.2) off-screen right.
Camera: `cam: eye (−0.30, 1.40, +1.30), yaw +10, pitch −3, f 1050`, retention drift. Projection run: Marcus 1,414 px, head y 701; senior 566 px at (457, 803). Transform owner: world camera.
VO + subtitles: L14 "เอ่อ… สูตรลับของร้านครับ", G [1187, 1261).
Sound: music pad continues, low; C20 a small sly pluck after "ครับ" at G1264 (L77; `NEEDS-GEN`, 0.4 s, a single plucked note with a smirk). Swallow already played at G1182.
Mix intent: hold; release the pad at the cut.
Cut: hard cut at G1267 to B05-SH01.
Entry → exit: exit: Marcus grinning, hand on head.
Acceptance: G1215 grin and ribbons visible behind his head (frame).

## B05-SH01 — the first coin, sniffed (CL03 template; 3D hand and coin)

Range and clocks: G [1267, 1446); L0 = G1267. The coin-flip transition's first half is inside this shot's last frames (below).
Direction: profile medium close at the bench's end, camera square to Marcus's profile; the senior's hand drops a coin into Marcus's palm; he lifts it to his nose and sniffs; on "รอดแล้ว" he exhales and his shoulders drop. **CL03 template (LF06 measured values): nose (388, 767), coin centre (436, 767), coin about 42 px** at the sniff hold G [1357, 1411).
Staging (space W): marcus feet (−0.85, 0, −0.35) facing +x, profile showing his right side to the camera; senior feet (+0.05, 0, −0.35) facing −x, only his hand enters from screen right at L13 (G1280). Coin hand = Marcus's near (right) arm: **five-finger 3D hand and 3D coin (5.3 cm story size)**, painted arm to the wrist; the coin dropped into the palm at L22 (G1289, "เหรียญแรก" `LC`, ±6 frames); he studies it L28–L68; lifts on "ยกขึ้นมาดม" 44.76 s = G1343 (L76), reaches the nose at L90 (G1357); sniff = two nostril flares G1360–1375; "ไม่มีกลิ่น" 46.02 s = G1381, exhale and shoulders drop on "รอดแล้ว" 47.04 s = G1411 (L144), `worried` → `relieved`; plain profile mouth. Two ribbons behind his head, none near the coin.
Camera: `cam: eye (−0.58, 1.23, +0.85), yaw 0, pitch 0, f 1000` (estimate; **the screen values above are the contract**, Boss tunes eye height and x until the nose lands on (388, 767) with the coin at (436, 767)). Projection run: Marcus 1,350 px, head top y 635, face above the band. Hold from L90 to L144; **transition push** L161–L178 (G1428–1445): the 3D coin layer scales from (436, 767) at 42 px to at least 1,300 px (ease-in) and covers the frame.
VO + subtitles: L15 "ได้ค่าแรงเหรียญแรก มาร์คุสรีบยกขึ้นมาดม", G [1267, 1361); L16 "ไม่มีกลิ่น… รอดแล้ว", G [1367, 1440); both subtitles continue to display across the transition (G1440 ends the line).
Sound: C21 one coin clink in the palm (small, bright, dry, 0.3 s) at G1289 (`LC`, `NEEDS-GEN`); C22 one sniff held in near-silence at G1360 (short nasal intake, close and dry, 0.4 s, `NEEDS-GEN`), music out G1350–1380; C23 a soft "phew" resolve pluck on "รอดแล้ว" at G1411 (`NEEDS-GEN`); the coin whoosh for the flip starts at G1434 (see B06-SH01).
Mix intent: hold the near-silence G1350–1380; lift on the resolve.
Cut: coin-wipe into B06-SH01 at G1446.
Entry → exit: entry: Marcus empty-handed; exit: coin at his nose, filling the frame.
Acceptance: | G | Observable | Evidence |
G1357–1410 | nose (388, 767) ±10 px, coin (436, 767) ±10 px, 42 px ±6, fingers read on the coin at 540 px | frame + measure |
G1411 | shoulders drop on "รอดแล้ว" | sync |
G1445 | the coin covers the frame | frame |

## B06-SH01 — the emperor weighs a coin (coin-flip reveal)

Range and clocks: G [1446, 1550); L0 = G1446. Space I (imperial room, [VD26-13](film-brief-r3.md#vd26-13--imperial-room-vespasian-and-titus-new-location-needs-look-approval) plan; code `palace.ts`).
Direction: **coin-flip transition** L0–L14 (G1446–1460): the coin fills the frame, flips (rotateY 0 → 180°, edge-on at L5) and the reverse reveals the imperial room; the camera then eases in on Vespasian seated at the marble table, who weighs a coin from the bronze bowl with a pleased squint. No text, no collectors (O5), no ribbons.
Staging: vespasian (`man-elder`, no moustache, white toga with purple band, laurel; `smug`) seated at the table, centre about (0.00, 0.0, −0.90), the bowl of coins on the table; he lifts the coin to his eye line L20 (G1466) and squints at L70 (G1516, `est`).
Camera: `cam: eye (0.00, 1.30, +2.20), yaw 0, pitch −6, f 950` at L0 → `eye (0.00, 1.30, +1.55)` at L103, slow push. Projection run: Vespasian 386 px at the start, 483 px at the end (key beat, the squint, is at the end, so the lead rule is met when it matters). Transform owner: world camera; transition owner: Editor (coin layer).
VO + subtitles: L17 "ตลกคือ จักรพรรดิเวสปาเซียนเก็บภาษีฉี่จริง ๆ", G [1446, 1544). Low-confidence "ภาษีฉี่" (49.18 s): **no event rests on it**; all events use the line start (G1446) and end (G1544).
Sound: music S04 mock-grand comic brass fanfare enters on the flip at G1446 (comic, not solemn; medium-high; `NEEDS-GEN`); C24 coin whoosh-flip G1434–G1456 (a bronze coin spinning past the mic, short doppler, 0.7 s, `NEEDS-GEN`); A3 hushed large-room tone from G1446 (`NEEDS-GEN`). Mix intent: lift at the flip.
Cut: hard cut at G1550 to B06-SH02 (cut on the stand-up).
Entry → exit: entry: coin full-frame; exit: Vespasian seated, coin raised, about to stand.
Acceptance: G1450 coin edge-on; G1466 room readable with Vespasian seated; no text anywhere.

## B06-SH02 — the coin at Titus's nose (LF06, CL03 mirror)

Range and clocks: G [1550, 1648); L0 = G1550.
Direction: two-shot; Titus (`man-crop`, white tunic with two narrow purple stripes) enters screen-left complaining (`disgusted`, close-shot `shrug`); Vespasian stands and holds the coin to his nose. End state = **LF06**, the CL03 mirror of B05-SH01: Titus in profile facing right, nose (388, 767), coin (436, 767), Vespasian's arm from the right.
Staging (space I): titus feet (−1.50, 0, +0.30) at L0 → **(−0.40, 0, +0.30)** facing +x by L22 (G1572); vespasian rises and steps from (0.16, 0, +0.02) (the table's front edge; R2: (0.16, 0, −0.20) is inside the table) to **(0.16, 0, +0.24)** facing (−1, 0.6) by L16 (G1566); coin hand = his **near (left) arm painted to the wrist, ending in the five-finger 3D hand with the 3D coin** (no 3D forearm tube), bones 0.26 m, coin 6 cm ahead of Titus's nose and lifted clear of the fingertips; coin at the nose at L22 (G1572), then hold. All other hands mittens. Titus's nostril lean at L79 (G1629, "เหม็นไหม").
Camera: `cam: eye (0.00, 1.42, +2.90), yaw 0, pitch −3, f 950` (TH-IA two-shot) at L0 → **`eye (−0.08, 1.52, +1.55), yaw 0, pitch −2, f 1000, hy 780`** (LF06, measured) at L40, eased, hold to L97. Projection run (two-shot start): Titus 554 px, Vespasian 614 px, faces (393, 862), (598, 791). LF06 measured: nose (388, 767), coin (436, 767), coin 42 px. Transform owner: world camera.
VO + subtitles: L18 "ลูกชายบ่น เขาเลยเอาเหรียญจ่อจมูกลูก ถามว่าเหม็นไหม", G [1550, 1642). "เหรียญจ่อจมูก" 52.24 s = G1567, "เหม็นไหม" 54.3 s = G1629.
Sound: music holds a sustained comic chord from G1550; C25 a bright coin chime on the nose hold at G1572 (1 s tail, `NEEDS-GEN`).
Mix intent: hit at G1572; hold the chord; release into G1648.
Cut: hard cut at G1648 to B06-SH03.
Entry → exit: exit: coin at Titus's nose, Vespasian's arm extended.
Acceptance: G1572–1647 nose/coin within ±10 px of LF06, arm length natural (no overlong arm, arm anatomy check as in R5), face above band.

## B06-SH03 — "ได้มาจากฉี่" (3D tapping finger)

Range and clocks: G [1648, 1753); L0 = G1648.
Direction: two-shot; Titus sniffs (`suspicious`) and shakes his head on "ลูกบอกไม่"; Vespasian grins and taps the coin with one finger on "ได้มาจากฉี่"; Titus deflates (`surprised` → `arms-crossed`).
Staging (space I): titus (−0.40, 0, +0.30) facing +x; vespasian (0.16, 0, +0.24) facing (−1, 0.6), coin in his fingers at the nose-level hold; **tapping hand = five-finger 3D hand**, one finger tap at L82 (G1730, onset "ได้มาจากฉี่" 57.54 s = G1726 at L78; tap on the stressed syllable); Titus's head shake L2–L20 (G1650–1668), deflate L84–L100.
Camera: `cam: eye (+0.05, 1.45, +1.60), yaw 0, pitch −4, f 950`, hold with retention drift. Projection run: Titus 1,061 px (head (209, 820)), Vespasian 1,161 px (head (618, 680)), faces above the band; Titus's face sits at the left edge, within the frame (no caption there). Transform owner: world camera.
VO + subtitles: L19 "ลูกบอกไม่ เขาก็บอก นั่นแหละ ได้มาจากฉี่", G [1648, 1747); "ลูกบอกไม่" 55.0 s = G1650.
Sound: C26 comic button on "ได้มาจากฉี่" at G1730 (a short brass stab plus a woodblock hit, 0.4 s, `NEEDS-GEN`); music chord releases into the stab.
Mix intent: hit at G1730.
Cut: hard cut at G1753 to B06-SH04.
Entry → exit: exit: Titus arms crossed, Vespasian's finger on the coin.
Acceptance: G1730 the finger tap reads on the coin; Titus's deflation completes by G1748.

## B06-SH04 — "เงินน่ะไม่มีกลิ่นหรอก…" (coin insert)

Range and clocks: G [1753, 1800); L0 = G1753.
Direction: close insert on the coin in Vespasian's fingers catching the lamp light; slow push; nothing else in frame. No ribbons and no caption (user, 18 Nov 2026).
Staging (space I): coin centre about (0.00, 1.36, 0.42) (estimate; Boss derives it from Vespasian's hand), held by his **five-finger 3D hand and 3D coin**; lamp glint sweeps the face of the coin L4–L20 (G1757–1773).
Camera: `cam: eye (+0.05, 1.38, +0.77), yaw −2, pitch −3, f 1200` (about 0.35 m from the coin, coin ≈ 180 px, estimate) pushing to 0.30 m by L46. Transform owner: world camera.
VO + subtitles: L20 first half "เงินน่ะไม่มีกลิ่นหรอก…", G [1753, 1800) of its [1753, 1834); "ไม่มีกลิ่นหรอก" 58.74 s = G1762 (L9). The subtitle shows the full L20 text until G1834.
Sound: C27 a soft glint shimmer at G1757 (high, thin, 0.8 s, `NEEDS-GEN`), then **full silence from G1790** (music, ambience and room tone out) through "…".
Mix intent: drop to silence at G1790; hold to G1800.
Cut: hard cut at G1800 to B06-SH05 (on the "…", 4 frames before "แต่" at G1804).
Entry → exit: exit: coin still, lamp glint ended.
Acceptance: G1790 total silence (audio check); the coin is the only subject.

## B06-SH05 — the street, final frame (LF07) and the 2.0 s closing hold

Range and clocks: G [1800, 1894); L0 = G1800. The VO part is G [1800, 1834); **the 2.0 s hold is G [1834, 1894) (60 frames)**; the composition ends at G1893.
Direction: **LF07** (approved, measured): the street at dusk outside the fullery, looking down the road to the orange slit. Marcus walks home barefoot with the coin in his raised fist, grinning; the CL04 ribbons rise off his shoulders (R2: aimed higher than LF07's so no tip touches her on the push; she is still the punchline); the passer-by turns, leans away and pinches her nose. She is the punchline; no ribbon touches her.
Staging (space S: origin road centre at the fullery door's z; `+x` right, `+y` up, `+z` toward the camera): marcus (`MARCUS_BARE`, damp hem, sandals optionally in the other hand) enters walking from (−0.42, 0, −1.05) at L0 to **(−0.42, 0, −0.45)** facing (0.15, 1) by L22 (G1822), raises the fist with the coin (mitten, painted arm re-fitted on the drawn shoulder, elbow out, bones 0.25/0.28 m) L22–L32 (G1822–1832), coin glint L32; ribbons rise from L10 (G1810) and are full by L26 (G1826); passer-by (`woman-long + new: stola-dusk`, `disgusted`, basket on the far hand) at **(+0.55, 0, −2.10)** facing (−1, 0.45): turns at L14 (G1814), leans away L20–L28 and the nose pinch (mitten) lands at L30 (G1830) and holds to the end. Hold G1834–1893: Marcus on an idle heel-bob, ribbon wave loops, her pinch holds with one small head waft at G1860.
Camera: `cam: eye (+0.10, 1.38, +2.35), yaw 0, pitch +1, f 950, hy 960` at L0, a slow drift to eye z +2.20 by L34 (G1834), then an eased push to **`eye (−0.22, 1.30, +1.05), pitch +3, f 950, hy 880`** (the LF07 end-of-push, measured) arriving at L93 (G1893) and held for the last frame. Measured at the end: Marcus 1,077 px, passer-by 495 px, hero coin 3.6 × the kit coin (55 px) with a warm halo and a four-point glint (story-size, open to Boat), faces above the band. Start (R4, measured): Marcus 561 px, passer-by 702 px at her old mark. Transform owner: world camera.
VO + subtitles: L20 second half "แต่มาร์คุสยังมี", "แต่" at 60.12 s = G1804; the line ends G1834. The subtitle clears at G1834. Chrome stays to G1893.
Sound: A4 dusk street: thin evening murmur, a far cart, swifts, one dog bark at G1858 (est, `NEEDS-GEN`, distant, 0.5 s); the low music is out until the sting; **C28 sting on "มี" at G1826** (est from the line end 1834; short bright brass hit, `NEEDS-GEN`); **ending C29 at G1836–G1890 (54 frames, 1.8 s)**: the imperial brass's last note collapses into a muted-trombone "wah-wah" droop, then the street tail alone G1890–1893 (`NEEDS-GEN`; UT15 is Film's choice, no series ending sound required).
Mix intent: hit at G1826; the droop sits on the hold; release into the street tail; Editor sets the end fade within the last 6 frames.
Cut: none (end of video; no loop seam).
Entry → exit: entry: dusk street with Marcus entering; exit (G1893): LF07 composition: Marcus's fist and coin beside his head, one ribbon pair, passer-by pinching her nose.
Acceptance: | G | Observable | Evidence |
G1826 | ribbons full, sting lands on "มี" | frame + sync |
G1830 | passer-by pinch visible, no ribbon touches her | frame |
G1893 | matches LF07: Marcus 1,077 px ±5 %, passer-by 495 px ±5 %, coin 55 px ±6 | measure |
G1834–1893 | caption cleared, chrome only, droop plays | frame + audio |

## Dependencies and open items (part B)

### Boss builds (from the sheets)

| # | Item | Shots | Status / note |
| --- | --- | --- | --- |
| 1 | Harden the sets: workshop `fullonica.ts`, imperial room `palace.ts`, street `street.ts`; animate the EP26 yaw camera (crane, pushes, whip-pan, tilt) per the camera lines | all | exists-unintegrated; **hard dependency**: animated per-frame camera inside the EP26 painter (`unknown`) |
| 2 | Cast hardening: Marcus (+ barefoot), senior, Vespasian, Titus, passer-by, customer; laurel, clavi, jar, coin, wrung cloth | all | customer **missing**; others exists-unintegrated |
| 3 | 3D five-finger hands + 3D coin layer over painted figures, near-arm re-fit on the drawn shoulder | B02-SH04, B05-SH01, B06-SH02, B06-SH03, B06-SH04 | exists-unintegrated (`r4-hands.ts`); the LF06 forearm seam is already removed in R5 |
| 4 | Animated ribbons layer (rise, reach the nose, wave, strength per the ledger; never on shirt, coin, customer, passer-by) | B02-SH02 to B06-SH05 | animated layer **missing** |
| 5 | Passer-by animation (turn, lean, nose pinch, head waft) | B06-SH05 | **missing** (stills only) |
| 6 | `evening` light balance and the long low beam; dried shirt hanging on the pole | B04-SH01, B04-SH03 | **missing** |
| 7 | Time-passing dissolve (10 frames, light sweep) and coin-flip transition (3D coin scale, rotateY, reveal) | G1037–1047, G1434–1460 | dissolve: `unknown` for the EP26 painter; coin-flip **missing** |
| 8 | **Moot (retired):** the KP-INSET seam fix, the wine inset plate, the rinse cistern and its spout (cistern may stay in the set as dressing, not shown) | B03-SH05, B03-SH03 | retired in R6 |

**Blocker for Boss: none that stops a blockout.** Hard dependencies to confirm first: item 1 (animated camera in the EP26 painter), item 6 (`evening` balance) and item 4 (animated ribbons); each has a named fallback (static camera holds with picture-stage pushes; `door` plus a gold grade; static ribbons with a wave shader).

### Ton's cue list (global frames; Thai VO and every `NEEDS-GEN` is a new sound; library fit checked by Ton)

| ID | G | Shot | Sound (source, action, material, space, length, feel) |
| --- | --- | --- | --- |
| S01 music | 0–438 | B01-SH04 → B02-SH02 | comic pluck groove, 120 bpm, medium-high, bouncy; cuts hard at G438 |
| A1 | 0–1042 | B01 to B03 | workshop room tone, water slosh, faint street; cools at G802 |
| C01 | 4 + 15 k to 124 | B01-SH04 | wet bare-foot stomp on soaked wool, shallow water, close, short, squelchy (3 variants), wince |
| C02 | 78 | B01-SH04 | double stomp + pluck stab on "ใช่ ฉี่" |
| C03 | 147 | B01-SH05 | sandal scuff on stone threshold, two steps + a 1 s street swell |
| C04 | 336 (est, LC) | B01-SH06 | proud brass "ta-da", two bright notes, pompous |
| C05 | 392 | B02-SH01 | ceramic jar base set on stone, hollow dry clunk, 0.4 s |
| C06 | 429–438 | B02-SH02 | lid scrape then small ceramic pop at G438 |
| C07 | 447–471, peak 455 | B02-SH02 | low comic wobble, detuned tuba-like, 0.8 s, visible smell |
| silence | 438–868 | B02 to B03-SH04 | no music (A1 only); B02-SH04 has no SFX |
| C08 | 667 | B02-SH03 | ceramic slide on stone, gritty, 0.3 s |
| C09 | 743 | B02-SH05 | deadpan dry tick or record-stop (candidate `comedy_cartoon-brake_01`, Ton checks fit) |
| C10 | 745–757 | B02-SH05 | whip-pan whoosh, 0.4 s |
| C11 | 802 | B03-SH04 | two-note pluck bending down (hands to feet) |
| C12 | 802–815 | B03-SH04 | bare toes on a wet stone rim, soft pat-pat |
| C13 | 831, 840 | B03-SH04 | slow squelch, foot into murky liquid (second lighter) |
| S02 music | 868–920 | B03-SH02 | plodding squelch-stomp groove locked to the treads, medium; drops at G920 |
| C14 | 868 + 15 k to 920 | B03-SH02 | deep wet tub stomps, duller and wetter than C01 |
| C15 | 1038 | B03-SH06 | one slow squelch, 0.5 s, under the dissolve |
| A2 | 1037–1446 | B04, B05 | evening murmur, far cart, 2 to 3 swift chirps G1050–1100 |
| S03 music | 1042–1350 | B04–B05 | soft hopeful pad, warm; thins G1181–1187; out G1350–1380 |
| C16 | 1058–1082 | B04-SH01 | customer's sandals on stone, two steps + soft stop |
| C17 | 1092 | B04-SH01 | cloth snap, dry, bright, 0.3 s |
| C18 | 1147 | B04-SH03 | light tension tick, 0.1 s |
| C19 | 1182 | B04-SH03 | nervous swallow, close, dry (heard before Marcus appears) |
| C20 | 1264 | B04-SH05 | sly pluck, single note, 0.4 s |
| C21 | 1289 (LC) | B05-SH01 | coin clink in a palm, small, bright, dry, 0.3 s |
| C22 | 1360 | B05-SH01 | one close dry sniff, 0.4 s, in near-silence |
| C23 | 1411 | B05-SH01 | soft "phew" resolve pluck |
| C24 | 1434–1456 | B05 → B06-SH01 | bronze coin spin-by whoosh, 0.7 s |
| S04 music | 1446–1750 | B06 | mock-grand comic brass fanfare, medium-high build; sustained chord G1550–1650 |
| A3 | 1446–1790 | B06-SH01 to SH04 | hushed large-room tone |
| C25 | 1572 | B06-SH02 | bright coin chime, 1 s tail |
| C26 | 1730 | B06-SH03 | brass stab + woodblock on "ได้มาจากฉี่", 0.4 s |
| C27 | 1757 | B06-SH04 | soft thin glint shimmer, 0.8 s; **silence from G1790** (all beds out) |
| A4 | 1800–1893 | B06-SH05 | dusk street murmur, far cart, swifts, dog once G1858 |
| C28 | 1826 (est) | B06-SH05 | short bright brass sting on "มี" |
| C29 | 1836–1890 | B06-SH05 | brass last note collapses into a muted-trombone "wah-wah" droop, 1.8 s; street tail to the end |

Cues retired with the cut lines: grape-squish, clay-cup clink, rinse pour/swish, cloth slap onto the line, the squelch after the rinse.

### Editor's integration

1. Build the 20-shot timeline on G0–1893 from the shot maps (A: 11 shots to G1042; B: 9 shots to G1894); cut points are the frames in each block, with the 10-frame dissolve at G [1037, 1047) and the coin-wipe G [1434, 1460).
2. Ear-check and log: L03 "ด้วยสองมือ" (anchor out of order), L05 "ไหนี่มันฉี่", L15 "เหรียญแรก", L08 "ย่ำผ้า"; do not use the L17 phrase anchor.
3. Place exactly Ton's cue list; keep the silence G438–868 music-free and the full silence from G1790; one 2.0 s hold G [1834, 1894) with the droop.
4. Subtitles: each line's Thai text on its own range (L04 is split at G423 for the cut; L08 at G850; L20 across G1753–1834).
5. QA frames: G0, G78, G438, G455, G802, G868, G1042, G1088, G1357, G1572, G1826, G1893; check CL01 (G318 vs G802), CL03 (G1357+ vs G1572+), the ribbon ledger, caption zone and `@TamMaiLa` + **แต่งเติมจากเรื่องจริง** to the last frame.

### Open items

- User decisions: **none required**. Optional (Film recommends no change): where the customer's shirt was washed is not shown; the time-passing dissolve implies it happened off-screen while Marcus treads another length of cloth (L08 only says he treads cloth). Say if you want the tread cloth to be the shirt itself (repaint LF05 cloth).
- Boat (carried from BRIEF-R4): the 5.3 cm story-size coin, the 3.6 × hero coin in LF07, the street's fountain/stepping stones/balconies as generic reads.
- Estimates to verify at blockout: B01-SH05 end framing (Marcus tight to the left edge), B04 positions, B06-SH04 coin anchor, B05-SH01 camera eye.

## Change log

- R1 (EDU-EP26-SHEET-R1), 2026-11-18, Film, W5. First timed sheet on EDU-EP26-VOICE-R3, B04–B06 and the handoffs. B04-SH01 restaged for the time-passing cut (shirt hung dry on the back pole, Marcus takes it down, evening light); the R4 camera for B04-SH01 reused from the B01-SH05 end angle. B05-SH01 CL03 values taken from BRIEF-R4 VD26-20 (388/436), replacing the older 308/344 in the untimed storyboard. B06-SH05 cut moved to G1800 (4 frames before "แต่") and the droop placed after the VO ends (G1836). Low-confidence anchors L05, L15, L17 and the out-of-order L03 anchor marked; no B06 event uses the L17 phrase anchor.
- R2 (EDU-EP26-SHEET-R2), 2026-11-19, Film, W5.3: accepted B04-SH03 shirt to her right, B06-SH02 Vespasian start (0.16, 0, +0.02), B06-SH05 ribbons aimed higher; B06-SH04 coin at the sheet estimate with the room behind needs no change. **Not accepted:** B06-SH03 deflate (Titus must reach arms crossed by L100).
