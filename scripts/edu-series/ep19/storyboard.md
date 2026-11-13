# Storyboard — EDU-EP19-SHORT (first pass, VO-relative timing)

Deliverable: `EDU-EP19-SHORT` · Revision: **EDU-EP19-ROWS-R1.0** (Film, 2026-11-12, W2.2: first storyboard pass) · Status: **draft for the user's storyboard review (W2.3)**; timing **estimated, VO-relative** until the W4 voice lock, so not `ready-for-dev` for plates (W5.1 writes integer frames on the locked read). Readiness is not user approval, runtime or visual proof.
Inputs: [script.md](script.md) EDU-EP19-SCRIPT-R1 + R1.1 change log (user-approved 2026-11-12) · [fact-check.md](fact-check.md) R1 (O4, O7, R4 binding as picture notes) · [film-brief.md](film-brief.md) **EDU-EP19-BRIEF-R1** (VD01–VD14, N1–N12, cues A1–E1, [truth limits](film-brief.md#truth-limits)) · task record [task.md](task.md).
Target: this worktree at `120cfd4` · 30 fps · **about 47–49 s estimated** (W1.4 read 43.24 s raw scaled to x1.08, plus the script's non-narration beats) · 1080×1920 · composition offset 0 (one scene, S01).
Evidence: nothing painted or rendered; every camera below projected with `scripts/shot-projection.py` (`up: y`, pinhole, hy 960) on the brief's anchors; no voice lock (timing from the W1.4 length-check read).
Rows file: [review-rows.json](review-rows.json) **EDU-EP19-ROWS-R1.0** (Thai, `untimed: true`). Review page: pending.

## Units, clocks and conventions

- **Timing.** Each shot names its VO span and key events "on the word X" (VO-relative, `estimated`); the seconds in the shot map are planning estimates (±0.5 s per shot). W5.1 replaces them with integer frames, half-open ranges `[start, end)`, global = scene-local (offset 0) and shot-local `+n`.
- **Space** `P` = SET-POOL19 in metres, origin C0 at the deep-right inner corner on the coping top, +x right (toward the right deck), +y up, +z toward the shallow end; water surface y −0.15 ([projection contract](film-brief.md#projection-contract-and-scale-baseline), [set plan](film-brief.md#set-plan--set-pool19-condo-pool-metres-est)).
- **Camera lines** `cam: pos (x, y, z) → (…), look-at (x, y, z) → (…), f px`; moves are smoothstep-eased over the stated span; f 1000 ⇒ vfov 87.7°.
- **Screen.** Pixels, origin top-left, y down. Caption band y 1176–1344; faces, the mouth at the waterline, hands, the ring and rope above y 1160 ([caption-zone rule](film-brief.md#caption-zone-rule)); LBL (816–1020, 148–204) "ภาพจำลอง"; `@TamMaiLa` top-left.
- **Projected numbers** are given at the key state named; "lead" = the projected figure height feet to head top including the submerged part (brief in-water rule).

## Casting

| Role | Casting line | Notes |
| --- | --- | --- |
| WOMAN | `woman-curly + new: swimsuit-cover-up, new: lounger-recline, neutral` | Plum one-piece, mustard open cover-up, tortoiseshell sunglasses (N1). Pose chain: recline, `neutral` (SH01) → `new: lower-sunglasses`, `surprised` (SH02) → sit-up, `worried` (SH08) → `stand-up` + P38 rush, `shock` (SH09) → `new: edge-stop`, `scared` (SH10–SH11) → P05 point_side + shout, `shock` (SH12) → `new: throw-underhand`, `worried` (SH14) → `new: rope-pull`, `worried` (SH16) → P34 kneel, hand on his shoulder, `relieved` (SH18) |
| MAN | `man-parted + new: swim-shorts, new: arms-press-down, neutral` | 1.80 m, upright in the deep end at M0, head tilted back (`new: head-tilt-back`), calm face, eyes up; plain mouth in profile; never `scared`/`terrified`. End: `new: edge-hold-cough`, `tired` → `relieved` (SH18). No voice until V05 |
| BOY | `boy-school + new: rash-guard-swim, new: splash-play, laugh` | Chest-deep in the shallow end at B0; still and `surprised` from SH13 |
| Helpers | `man-crop + new: swim-shorts, P38, worried`; `woman-ponytail + new: swimsuit, P38, worried` | Jog up the right deck from +z (SH14 bg, SH16, SH17); stop at the coping |
| Crowd in water | `PEOPLE` (`man-buzz`, `woman-bob`, `woman-long`, `girl-school`, `man-spiky`, `woman-pixie`, `man-shaved`) + `new: swimwear` variants on `new: crowd-in-water` (N5) | 7 heads and shoulders, all turned to the boy until SH13 |
| Deck extras | `man-elder + new: swim-shorts, P31 family recline, neutral`; `woman-elder + new: swimsuit, P31 family recline, happy`; 2 edge sitters (`woman-long`, `man-spiky` variants) | Loungers at z 4.0 and 6.5; left-deck edge |
| Voices | NAR Kore; V01 BOY playful; V02–V04 WOMAN; V05 MAN cough | Editor's casting at the voice lock |
| Kit layers | none fits (no pool plate); ENV-SEA `paintWater` may serve as the water band base inside N2 | ENV-P02 |

## Shot map

| # | Shot | Beat | Lines | Est. s | Camera | One-line read | Claims / clues |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | S01-B01-SH01 | B01 | V01, L01, L02 | 6.5 | high wide from the shallow end → glide past the boy → water-height profile | The loud boy, then the quiet man nobody sees | F07; K01, K02, K03 |
| 2 | S01-B01-SH02 | B01 | V02 | 0.8 | MCU, front | She lowers her sunglasses: "เอ๊ะ?" | — |
| 3 | S01-B01-SH03 | B01 | L03 | 3.2 | low medium from the deep-end deck, front | Arms out, silent; the crowd behind faces the boy | F01; K01 |
| 4 | S01-B02-SH04 | B02 | L04, L05 | 5.5 | water-height close, left profile | The mouth at the waterline; a wave covers it; a gasp | F02, F04 |
| 5 | S01-B02-SH05 | B02 | L06 | 1.8 | above, front medium | Hands flat on the surface: why no wave? | F05 |
| 6 | S01-B02-SH06 | B02 | L07 | 3.4 | split-level at the surface, front | Under water the arms press down; a hand cannot come up | F02, F05 |
| 7 | S01-B03-SH07 | B03 | L08 | 2.2 | water-height medium, left profile | The head dips to the eyes, longer | F03 |
| 8 | S01-B03-SH08 | B03 | L09 | 3.3 | over her shoulder | He bobs 3 m away; the sunny pool still faces the boy | F03 |
| 9 | S01-B03-SH09 | B03 | V03 | 1.4 | low side, she runs right → left | "เฮ้ย!" She springs up and rushes to the edge | — |
| 10 | S01-B04-SH10 | B04 | L10 | 2.3 | from the water behind him, looking up at her | Knees bent to jump, she stops | F12 |
| 11 | S01-B04-SH11 | B04 | L11 | 2.9 | high over her shoulder | His hand clutches the water short of the edge | F12 |
| 12 | S01-B05-SH12 | B05 | V04 "ช่วยด้วย!" | 0.8 | MCU, front | She shouts and points | K04 |
| 13 | S01-B05-SH13 | B05 | V04 "มีคนจมน้ำ!" | 1.0 | high wide from the deep end | Every head turns to the corner; the sun comes back | K01, K04 |
| 14 | S01-B05-SH14 | B05 | L12 (a) | 1.8 | side medium | She lifts the ring off the post and throws | F11; K03 |
| 15 | S01-B05-SH15 | B05 | L12 (b) | 1.3 | low front medium at the man | The ring lands across his arms | F11 |
| 16 | S01-B05-SH16 | B05 | W-THROW | 1.4 | high side | Hand over hand she pulls him to the edge; helpers arrive | — |
| 17 | S01-B05-SH17 | B05 | L13 | 3.9 | SH01's first wide again, slow push | The boy stands still; every head faces the corner | F13; K01 |
| 18 | S01-B05-SH18 | B05 | L14, V05, hold | 6.0 | low at the edge | He coughs, alive; she kneels; the boy stares | F01, F13; K04 |

Total ≈ 49.3 s (estimate; the x1.15 pace would run about 3 s shorter).

## Voice, subtitles and on-screen text

- VO and dialogue: verbatim from the script in each shot block. Subtitles = VO; V01–V04 subtitled; V05 and W-THROW have none.
- OT01 "ภาพจำลอง" in LBL from the first frame to the last. No other overlay text (D3: OT02, OT03 off). Diegetic depth mark only if Q-F1 = yes.

## Rules for every shot

- **R01 Truth limits** as the brief ([truth limits](film-brief.md#truth-limits)): he is upright, the top of his head never under, calm face, no waving; she never leaves the deck; the ring lands on his arms; no taught posture; no imagined struggle; nothing copyable.
- **R02 Sun and shade.** Full sun SH01–SH02; cloud shadow over the deep half SH03–SH12 (shallow half and boy still sunny); sun back over the corner from SH13 +4 f (the turn).
- **R03 Contact.** Boy's feet on y −1.05; her feet on y 0 every frame; the man's mouth at y −0.15 except the dips named; the ring state per the props table.
- **R04 Ambient clocks.** Ripples, caustics, cloud drift, crowd idle and the man's press strokes run on ambient clocks; named events are shot-local.
- **R05 Screen.** Faces, the mouth line, hands, ring and rope above y 1160; the band over open water, the tinted submerged body or tiles.

**Props and hands (entry → exit per shot).** Sunglasses: on her nose SH01 → lowered by her right index finger SH02 → pushed up onto her hair at SH09's spring-up and stay there. Ring: on the R0 hook SH01–SH13 → lifted with both hands at SH14 "เรียกคน", the rope's free end gripped in her left hand, ring thrown with the right hand underhand on "โยน" → floating SH15 → across his right forearm SH15 end → against his chest SH16–SH18 (his forearms over it). Rope: free end in her left hand from SH14; both hands hand over hand SH16; dropped on the deck at SH18 when she kneels (rope still visible on the tiles). Her hands are free in SH10–SH12 (nothing held); in SH18 her right hand on his shoulder, left on her knee.

## Per-shot staging

**1. S01-B01-SH01 — the loud one, then the quiet one** (est. 6.5 s). VO: V01 BOY "ช่วยด้วยยย! ฮ่า ๆ" at the first frame; L01 "มีคนกำลังจมน้ำตาย… อยู่ห่างคุณแค่สามเมตร"; L02 "แต่คุณจะคิดว่า… เขากำลังเล่นน้ำอยู่".
- Camera P01 (V01 + L01): `cam: pos (−2.4, 4.2, 19.0) → (−2.5, 3.9, 17.6), look-at (−2.6, −0.5, 7.0), f 1000`, push about 8 % through L01 (holds on the boy). P02 → P03 (L02, from "แต่" to "เล่นน้ำ"): glide via (−3.4, 2.6, 9.5) (1.1 m to the boy's right, 2.6 m up: "past the boy") down to `pos (−3.7, 0.85, 2.0), look-at (−0.5, −0.1, 1.1), f 1050`; the look-at slides from the boy to the man; settles on "อยู่". The hook's one big move.
- Projected: P01 boy head (292, 1099) lead 137 px (VD04 exception), the man (612, 809) back view about 18 px head, her (792, 763) small front, ring (735, 748) beside her. P03 man lead 609 px, head top (518, 953), mouth (473, 1077) above the band, her on the lounger behind him (692, 628–791), ring post (339, 627).
- Staging: BOY at B0 `front`, `new: splash-play`, laughing, slapping water, yelling on V01; crowd heads all turned to him, two laughing; deck extras looking at him; WOMAN on L1 reclined, sunglasses on, `front`, watching him; MAN at M0 `back` in P01 (head tipped back, still) → `left` profile at P03 (chin up 25°, mouth on the line, arms out on the surface, a small press ring every 0.6 s). Full sun.
- Key states: P01 frame 0 the yell and the splash read first (UT: stakes at frame 0); "สามเมตร" the camera still on the boy; "แต่" the glide starts; "เล่นน้ำ" the man fills the frame, calm, she behind him not looking.
- Sound: A1 + M1 full from frame 0; S1 splashes on V01; on "แต่" U1 duck in (A1 and M1 low-passed, falling over the glide); A2 lapping comes up as the camera reaches the water.
- Entry → exit: frame 0 the wide in mid-splash → the man in left profile at water height, her behind.

**2. S01-B01-SH02 — someone notices** (est. 0.8 s). VO: V02 WOMAN "เอ๊ะ?".
- Camera: `cam: pos (−0.4, 0.95, 2.6) → (−0.35, 0.95, 2.45), look-at (1.75, 0.85, 1.35), f 1500` (over the water near the right edge; 5 % push). Her head top (489, 870); MCU lead well over 480 px (head and shoulders to the frame bottom).
- Staging: WOMAN `front` reclined on L1 in sun stripes; `new: lower-sunglasses` (right index finger pulls them down) on "เอ๊ะ", eyes slide screen-left (toward the man), brows up (`surprised`).
- Sound: U1 duck holds; a small cushion creak as she lifts her head (part of A2 bed, Editor).
- Entry → exit: sunglasses on → lowered, eyes screen-left.

**3. S01-B01-SH03 — the rule** (est. 3.2 s). VO: L03 "ไม่โบกมือ ไม่ร้องช่วยด้วย… คนจมน้ำจริง ๆ มักเงียบ".
- Camera: `cam: pos (−1.25, 0.9, −1.4) → (−1.3, 0.85, −1.15), look-at (−1.7, −1.0, 4.5), f 1150`, arc 6° to the left over the span. Man head (517, 902), mouth (521, 1047), lead 599 px; crowd heads beyond at y 650–770.
- Staging: MAN `front`, arms out to the sides flat on the surface, chin up, eyes up, still; behind him the sunny shallow half: every swimmer faces the boy (backs and sides to us), the boy splashing small at about (734, 650). The cloud shadow slides over the deep half from frame left (VD07).
- Key: "เงียบ" the camera settles; nothing in his body moves except a press ring.
- Sound: U1 duck under; A2 lapping close; the crowd a distant muffled bed.
- Entry → exit: front medium, sun → shade arriving on him.

**4. S01-B02-SH04 — the mouth at the waterline** (est. 5.5 s). VO: L04 "ดูปากเขาสิ… แทบไม่พ้นน้ำ"; L05 "ลมที่ได้มา ต้องเอาไว้หายใจ… แทบไม่เหลือไว้ตะโกน".
- Camera: `cam: pos (−2.75, −0.08, 1.10) → (−2.6, −0.08, 1.12), look-at (−1.42, −0.12, 1.20), f 1700` (7 cm above the water; slow push 10 %). Head top (663, 582), mouth (513, 997) on the surface line at y ≈ 990; lead (head and neck to the frame bottom through the waterline) over 480 px.
- Staging: MAN `left` profile, chin up 25°, plain mouth, eye open looking up; the waterline crosses at the lips. Events: on "แทบไม่พ้นน้ำ" a small wave rolls over the mouth (8–10 f) and clears; one quick gasp as it clears; on "หายใจ" a breath in (chest lift under the tint); on "ตะโกน" the mouth dips under again before any sound (10 f) and comes back.
- Look: cloud shade; under-water half cooler and lower in value (N3).
- Sound: P1 pulse starts on "ดูปาก"; S2 tiny gasp on the wave clearing; A2 lapping close; U1 under.
- Entry → exit: mouth on the line → mouth back on the line after the second dip.

**5. S01-B02-SH05 — why no wave?** (est. 1.8 s). VO: L06 "แต่… ทำไมไม่โบกมือ".
- Camera: `cam: pos (−1.4, 0.75, −0.6) → (−1.4, 0.80, −0.75), look-at (−1.4, −0.25, 1.3), f 1050` (from the deep-end coping looking down; pull back 8 %). Head (540, 755), mouth (540, 943), hands (208, 927) and (872, 927), lead 662 px.
- Staging: MAN `front`, both hands flat on the surface at shoulder width plus, fingers spread, press rings; looks almost like floating. 
- Sound: P1; one S3 press.
- Entry → exit: hands flat, still.

**6. S01-B02-SH06 — what the arms are doing** (est. 3.4 s). VO: L07 "แขนกดน้ำไว้ ดันหัวให้ลอย… เลยแทบยกมาโบกไม่ได้".
- Camera: split-level on the surface `cam: pos (−1.4, −0.13, 0.0) → (−1.4, −0.13, 0.15), look-at (−1.4, −0.60, 1.3), f 850` (push 10 %). Head top (540, 402), mouth on the line at (540, 669), hands (73, 668) and (1007, 668), feet (540, 1432); lead 1030 px. The band crosses the submerged hips (tinted, low detail).
- Staging: MAN `front`; above the line: head back, calm; below (tinted): torso upright, legs hanging, forearms angled down pressing. On "กดน้ำ" two press strokes, each lifting the chin 3 cm; on "ยกมาโบก" the right hand lifts 10 cm off the surface, the chin sinks to the line at once, the hand goes back to pressing (F05 illustrated, no new claim).
- Sound: S3 presses on each stroke; P1; U1.
- Entry → exit: pressing → pressing (the hand back down).

**7. S01-B03-SH07 — this cannot last** (est. 2.2 s). VO: L08 "แต่… ท่านี้ ฝืนได้ไม่นานนะ".
- Camera: `cam: pos (−3.5, −0.05, 1.6) → (−3.3, −0.05, 1.55), look-at (−1.4, −0.30, 1.3), f 1200`. Head top (540, 685), mouth (473, 875), lead 962 px.
- Staging: MAN `left` profile. On "ท่านี้" the head dips until the waterline is at the eye (20–24 f, the long dip; the top of the head never goes under), then comes back to the mouth line on "นะ".
- Sound: S4 soft swell on "แต่…" into the dip; S5 muffled whoomp on the dip; P1 quickens slightly; U1 deepest here.
- Entry → exit: mouth on the line → back, a little lower than before.

**8. S01-B03-SH08 — the clock, and only she sees** (est. 3.3 s). VO: L09 "ตั้งแต่เริ่มจม จนหายลงใต้น้ำ… อาจไม่ถึงสองนาที".
- Camera: `cam: pos (3.0, 2.0, 0.9) → (2.85, 1.95, 0.95), look-at (−1.0, −1.0, 2.6), f 950`. Man head (826, 772), mouth (839, 839), about 300 px; WOMAN OTS head top (637, 1014), her back and shoulders to the frame bottom (lead well over 480 px); the crowd beyond at y 576–650.
- Staging: WOMAN `back`, sitting up on L1, sunglasses down, staring at him. MAN `right` profile 3.2 m away, bobbing: up chin barely out on "เริ่มจม", down to the nose on "ใต้น้ำ", up again. Beyond: the sunny shallow half, every head toward the boy. Near shade, far sun.
- Sound: P1, U1, A2 faint.
- Entry → exit: she sits up staring → her weight shifts forward (into SH09).

**9. S01-B03-SH09 — "เฮ้ย!"** (est. 1.4 s). VO: V03 WOMAN "เฮ้ย!".
- Camera: `cam: pos (0.6, 1.0, 4.6) → (0.4, 1.0, 4.4), look-at (0.5, 0.75, 1.4), f 1100` (truck follows her). At the edge stop she is 536 px (head top (406, 664)).
- Staging: WOMAN `left`: on "เฮ้ย" springs off L1 (kit `stand-up` fast), pushes the sunglasses up, two quick steps (`run-right-to-left`, P38) to E1 at the right coping, feet on the tiles.
- Sound: the duck **cuts** on "เฮ้ย": A1 full; S6 lounger creak and two wet foot slaps; P1 out.
- Entry → exit: on the lounger → standing at E1, toes at the coping.

**10. S01-B04-SH10 — she almost jumps** (est. 2.3 s). VO: L10 "แต่… ถ้าคุณกระโดดลงไปช่วย".
- Camera: from the water behind the man, `cam: pos (−3.1, 0.06, 2.6) → (−3.0, 0.06, 2.5), look-at (0.1, 0.2, 1.25), f 1150`. WOMAN head top (555, 495), face (555, 560), feet (555, 1026), lead 531 px; MAN `back` foreground left, head top (242, 940), mouth line (187, 1121) above the band.
- Staging: WOMAN `front` at E1: on "กระโดด" knees bend, arms swing back, weight forward (`new: edge-stop` A); on "ช่วย" she stops herself: arms come forward, weight back onto her heels (B). Both feet on the tiles every frame (truth limit 5). MAN still pressing, his back to us.
- Sound: **near-silence**: A1 drops out on "แต่", only A2 faint lapping.
- Entry → exit: standing at E1 → crouched-stopped at E1.

**11. S01-B04-SH11 — he may grab you** (est. 2.9 s). VO: L11 "เขาอาจคว้าคุณไว้… แล้วดึงจมลงไปด้วยกัน".
- Camera: `cam: pos (0.95, 2.25, 1.9) → (0.9, 2.2, 1.85), look-at (−1.2, −0.4, 1.3), f 1250` (high over her right shoulder). Man head (519, 753), mouth (563, 838), hands (481, 698) / (610, 1027); her toes at the bottom edge.
- Staging: MAN `right`, his near press stroke sweeps toward the coping and closes on water 0.4 m short of it on "คว้า" (VD09); nothing else happens; no one is pulled; on "ด้วยกัน" his hand is back on the surface pressing. WOMAN `back`, still, feet at E1.
- Sound: T1 low tone under the line; S7 small slap-splash on "คว้า"; A2.
- Entry → exit: she stands at E1 → same, he pressing.

**12. S01-B05-SH12 — the first real "ช่วยด้วย"** (est. 0.8 s). VO: V04 WOMAN "ช่วยด้วย!" (first half).
- Camera: `cam: pos (−1.5, 0.9, 3.4) → (−1.45, 0.9, 3.3), look-at (0.1, 1.25, 1.3), f 1400`. Head top (540, 771), face (540, 872), lead 883 px.
- Staging: WOMAN `front` at E1, turned to the whole pool, P05 point_side with the right arm toward the man (screen left), mouth wide (`shock`), left hand cupped at her mouth.
- Sound: V04 in the clear over A1; the crowd starts to hush.
- Entry → exit: standing, pointing.

**13. S01-B05-SH13 — every head turns** (est. 1.0 s). VO: V04 "มีคนจมน้ำ!" (second half).
- Camera: `cam: pos (−3.4, 3.4, −4.2) → (−3.4, 3.3, −3.9), look-at (−4.4, −0.6, 11.0), f 1600` (high behind the deep end; the man and she are below the frame). Boy head (543, 856), lead 121 px (VD04 exception).
- Staging: the whole sunny pool seen from the corner's side: on "มีคนจมน้ำ" (+4 f) every head turns toward the camera (toward the corner), the boy stops splashing and stares, the two elders sit up, the helpers on the right deck start to run (N11). The cloud shadow lifts off the deep end (sun back, R02).
- Sound: S8 chatter cuts off, wordless gasps; M1 is already gone.
- Entry → exit: heads toward the boy → heads toward us.

**14. S01-B05-SH14 — throw** (est. 1.8 s). VO: L12 (first part) "ตะโกนเรียกคน… โยนของที่ลอยน้ำ".
- Camera: `cam: pos (2.9, 1.05, 3.0) → (2.8, 1.05, 2.85), look-at (−0.1, 0.55, 0.4), f 1050`. WOMAN at E2 head top (771, 650), lead 487 px; ring on the post (907, 843); man far left (178, 1035).
- Staging: WOMAN `left`: on "เรียกคน" one step from E1 to E2, lifts the ring off the R0 hook with both hands, the rope's free end into her left hand; on "โยน" an underhand throw with the right hand toward the man (`new: throw-underhand`), the rope uncoiling from the coil. Helpers running up in the background (sunny).
- Sound: S9 ring knock off the hook, rope whoosh; A1 back under the narration at low level.
- Entry → exit: ring on the hook → ring in the air leaving frame left.

**15. S01-B05-SH15 — it lands on his arms** (est. 1.3 s). VO: L12 (end) "หรือยื่นให้เกาะ".
- Camera: `cam: pos (−1.9, 0.4, −0.5) → (−1.85, 0.4, −0.4), look-at (−1.0, −0.25, 1.4), f 1150` (low from the deep-end wall side). Man head (741, 750), mouth (709, 969), lead 888 px; ring lands at (516, 922) across his right forearm (384, 913).
- Staging: MAN `front`; the ring drops into frame from top left and lands flat across his right forearm (O4: he does not reach for it); the rope tightens from frame left; his forearm and the ring rise together, the ring tips against his chest.
- Sound: S9 plop; **M2 warm bed enters on the plop**; A2.
- Entry → exit: pressing, alone → the ring against his chest, the rope taut.

**16. S01-B05-SH16 — pulled in from the deck** (est. 1.4 s). W-THROW, no narration.
- Camera: `cam: pos (−0.3, 2.2, 3.7) → (−0.2, 2.15, 3.55), look-at (−0.3, −0.1, 1.0), f 1100`. WOMAN at E3 head top (802, 396), lead 535 px; MAN mid-tow head (334, 926).
- Staging: cut-on-turn (written): the tow has turned him to face her. WOMAN `left` at E3, a step back from the coping, standing, feet on the tiles, hand over hand (`new: rope-pull`, no stance emphasis, R4). MAN `right`, towed from M0 to E4 (1.0 m), the ring against his chest, his forearms over it. The two helpers arrive along the deck from frame right and stop at the coping beside her.
- Sound: S10 rope rasp and water against the tile; S11 helpers' steps; M2.
- Entry → exit: he is 1.3 m out → his hands on the coping at E4.

**17. S01-B05-SH17 — the shouter had air** (est. 3.9 s). VO: L13 "คนที่ยังร้องช่วยด้วยได้ ก็ต้องช่วย… แต่เขายังมีลมพอจะร้อง".
- Camera: the **exact SH01 P01 camera** `pos (−2.4, 4.2, 19.0) → (−2.3, 3.9, 17.8), look-at (−2.6, −0.5, 7.0), f 1000 → 1050` (VD11). Boy head (292, 1099) → (225, 1141), lead 137 → 162 px (VD04 exception); the corner group small at (689, 784).
- Staging: the same wide in full sun, but every head now faces the deep corner, where the group (man at E4, woman, helpers) is small; the BOY stands chest-deep at B0, still, mouth closed, looking at the corner; a small bob of the water around him. On "ร้อง" the camera's push ends near him.
- Sound: M2 thins; the boy's small water movement; A1 at a hush.
- Entry → exit: the first frame again, now facing the other way.

**18. S01-B05-SH18 — alive** (est. 6.0 s). VO: L14 "คนที่เงียบต่างหาก… ที่ไม่เหลือลมจะร้องแล้ว"; V05 MAN (cough); hold about 2.5 s.
- Camera: `cam: pos (1.0, 0.55, −0.9) → (0.95, 0.55, −0.8), look-at (−0.55, 0.0, 2.8), f 1300` (push 5 %). MAN at E4 head top (761, 949), mouth (724, 1085), lead 818 px; WOMAN kneeling head top (273, 504), knee (288, 1070), 566 px; BOY far behind between them (548, 810).
- Staging: MAN `front` 3/4, forearms on the coping, the ring against his chest; WOMAN at K1 `right` (P34 kneel), right hand on his shoulder, the rope on the tiles. On L14's end (after "แล้ว") V05: two wet coughs with a head dip, then a big breath, `tired` → `relieved`; she exhales with him (`relieved`). Behind them the BOY has stopped and stares. Hold on idle-breathe.
- Sound: near-silence with A2 lapping; V05 in the clear; then **E1 ending resolve** after the cough (never over it); no loop seam.
- Entry → exit: he arrives at the edge → alive, breathing, hold to the end.

## Acceptance (checks for W5 and W6)

| Check | Observable | Evidence |
| --- | --- | --- |
| Truth limits | Top of his head never under (SH07 dip stops at the eye line); her feet on y 0 in every frame of SH09–SH18; the ring lands within 0.3 m of his right hand and he never reaches up for it; no text other than OT01 (and the depth mark if chosen) | Frame stepping on the Draft; `scripts/qa-sheet.sh` sheets of SH07, SH10, SH15 |
| Hook | Frame 0 shows the boy mid-yell and the splash; the man is visible but unremarked in SH01 P01 | qa-sheet of SH01 first and last frames |
| Waterline | In SH04 the mouth sits on the line at L04 and the wave crosses it on "แทบไม่พ้นน้ำ" | still at 540 px wide |
| Sun/shade | SH03–SH12 deep half in shade, shallow half sunny; sun back from SH13 | qa-sheet |
| Captions | Band y 1176–1344 calm in every shot: `scripts/caption-zone.py` mean ≤ 0.25, p95 ≤ 0.4; no face in the band | measured numbers |
| Lead size | ≥ 480 px in every shot except the VD04 wides | measured on clean frames |
| Sound | Duck in on SH01 "แต่", out on SH09 "เฮ้ย"; silence on SH10; E1 after the cough, not over it | Draft listen |

## Dependencies and open items

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Boss | N1–N12 (brief, [new assets](film-brief.md#new-assets-and-missing-capability-boss-dependencies)); look frames LF01 (SH01 P01) and LF02 (SH04) after this pass is on the page | missing |
| Ton | Cues A1, M1, A2, U1, S1–S11, M2 (loop/regen), E1 as described in the brief's [sound table](film-brief.md#sound-direction); check `tension_heartbeat-slow_01`, `hum_low-travelling-flat_01`, `bed_warm-pad-felt-third_01` against their descriptions | NEEDS-GEN / not listened |
| Editor | W4 voice lock (pace pick 1.08 / 1.15; V01–V05 voices); then Film W5.1 timed sheets | pending |
| User | Q-F1 depth mark; Q-F2 cloud shadow | open (recommendations apply if unanswered) |
| Preaw / Boat | VD03 (L01 shot cue), VD09 + SH06 hand-lift (illustrations inside F05/F12) | for information |

Element captures: none (no pool, swimwear or in-water assets exist to capture); the kit cast cards (`KIT-CAST-CARDS`) show the four people in their clothes only.

## Change log

- 2026-11-12 EDU-EP19-ROWS-R1.0 (Film, W2.2): first storyboard pass, 18 shots, VO-relative timing (≈ 49 s estimated at x1.08), cameras projected with `scripts/shot-projection.py`.
