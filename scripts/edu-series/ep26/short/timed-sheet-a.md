# E26-C01-S01 — The laundry shift, timed sheet A (B01–B03: vow, jar, tread)

Deliverable: `EDU-EP26-SHORT` · Revision: `EDU-EP26-SHEET-R2` (part A of two; part B is [timed-sheet-b.md](timed-sheet-b.md)) · Status: ready-for-dev · Timing: checked-with-audio (the R3 measure, **not ear-checked** by Editor)
Inputs: [EDU-EP26-SCRIPT-R3](script.md) (L09 and L11 cut) + [EDU-EP26-FACTCHECK-R3](fact-check-r3.md) (ready) · [EDU-EP26-BRIEF-R4](film-brief-r4.md) (VD26-18 to VD26-23, on [BRIEF-R3](film-brief-r3.md)) · [voice-measure-r3.md](voice-measure-r3.md) / [.json](voice-measure-r3.json) (`EDU-EP26-VOICE-R3`) and [timeline-r3.json](timeline-r3.json) · delivery record [../delivery.md](../delivery.md) · untimed rows [storyboard.md](storyboard.md)
Target: checkout `5e40444` plus uncommitted EP26 files · 30 fps · **durationFrames 1894** (61.133 s speech, +2.0 s hold) · 1080 × 1920 portrait · composition offset 0
Evidence: runtime unverified · render/samples none · audio/subtitle sync: measured read only (Whisper onsets about ±0.2 s) · user approval: looks LF04–LF07, KP-MARCUS approved 2026-11-18 (ROWS-R5); voice locked 2026-11-18; this sheet not yet reviewed

## Intent and continuity

Before → after: the viewer knows from "ใช่ ฉี่" that the laundry uses urine; Marcus does not. He swears a clean vow with his hands (B01), is handed the jar and recoils (B02), then the vow flips to his feet in the tub (B03), and the picture jumps to the evening with the work done off-screen. Concealed: that the shirt turns out white (B04). Not shown: the wine inset, the rinse cistern and any diagnostic liquid colour (F002 not shown, F004), any "Pecunia non olet" caption, any on-screen time card.

Previous scene: none (opening). Next: B04 (part B) at global frame 1042 through a time-passing dissolve (below).

### Clocks and conventions (one home; part B links here)

- **G** = composition frame (offset 0). **L** = shot-local frame = G − shot start. Ranges half-open `[start, endExclusive)`. Frames = `floor(seconds × 30 + 0.5)` of [voice-measure-r3](voice-measure-r3.md). Cuts sit on line start frames unless the shot says otherwise.
- Marks: `LC` = the event rests on a low-confidence anchor of the R3 measure (L05 18.34 s, L15 42.98 s, L17 49.18 s) or on an anchor that conflicts with the text order; give the event ±6 frames and ear-check. `est` = no anchor, placed from line start/end. Unmarked anchored events are Whisper onsets (about ±6 frames).
- **Space W** (metres, origin floor centre, `+x` right from the intake camera, `+y` up, `+z` toward the intake camera; code `src/painted/edu26/fullonica.ts`): [VD26-18](film-brief-r4.md#vd26-18--the-new-workshop-a-sun-baked-fullery-new-fullonica-r4) owns the set plan. Camera line: `cam: eye (x,y,z) m, yaw° (0 looks −z, + turns toward +x), pitch° (+ up), f px at 1080 × 1920`. Screen coordinates are pixels, origin top left, Y down.
- **Baseline:** Marcus 1.62 m (head scale 0.97), senior 1.70 m, customer 1.62 m, coin drawn 5.3 cm ([VD26-20](film-brief-r4.md#vd26-20--vespasian-and-titus-painted-unchanged-design) story size). Projection: `python3 -I scripts/shot-projection.py`, run 2026-11-18 on every world-space shot of A and B (estimates and results in each shot block; look frames LF04–LF07 are the measured ones). Caption band: captions sit at about y 1230–1344 (safe box x 120–888, bottom ≤ 1344); every face below is above y 880.
- **Hands:** mittens except 3D five-finger hands in B02-SH04, B05-SH01, B06-SH02, B06-SH03, B06-SH04 ([VD26-23](film-brief-r4.md#vd26-23--hands-user-rule-final-18-nov-2026)). **Chrome:** `@TamMaiLa` top left and **แต่งเติมจากเรื่องจริง** from G0 to G1893.
- **Subtitles:** the Thai VO line of each shot, in the channel's outline caption preset, displayed for the line's own range (shot block gives it); Editor splits long lines by phrase.

### Smell cue CL04: continuity by picture alone (B03 to B05)

Requirement: with L11 gone, no shot says "the smell stays", so the ribbons carry it. One ribbon family (olive-yellow, the B02-SH02 / LF07 hue and wave, rising off Marcus's shoulders, hem and, in the tub, off the liquid), **never on the customer's shirt, the coin, the customer, the senior's body or the passer-by**. Rule: every shot with Marcus's body in frame carries at least one ribbon, two wherever head or torso shows.

| Shot | Ribbons | Where | Strength (of the B02-SH02 value, estimate) |
| --- | --- | --- | --- |
| B02-SH02 / B02-SH04 / B02-SH05 | 3 | jar mouth → nose, then around head | 100 % (plant) |
| B02-SH03 | 2 | Marcus's shoulder, foreground left | 70 % |
| B03-SH04 hands part | 1 | off his right forearm | 60 % |
| B03-SH04 feet part | 2 | off the liquid at the feet | 60 % |
| B03-SH02 (LF05, approved) | 2 to 3 | off the liquid, as painted | as painted |
| B03-SH06 | 3 thin | off both shoulders and the stall edge, in front of the light well | 70 % (R4 said "faint": raised so the cut to evening keeps the cue) |
| B04-SH01 | 2 | at Marcus's shoulder, lit gold by the door beam; the customer never reacts | 60 % |
| B04-SH05 | 2 | behind his head, left | 55 % (R4 said "one very faint": raised) |
| B05-SH01 | 2 | behind his head, left, none near the coin | 55 % |
| B06-SH05 (LF07, approved) | 3 then a pair at the end | off the shoulders, as painted | 100 % (payoff) |

A tester who only sees B03-SH06 → B04-SH01 → B05-SH01 must still see the olive-yellow wave on Marcus in each: that is acceptance A-CL04 below.

### Time-passing cut, B03-SH06 → B04-SH01 (Boat's optional note, adopted)

A cross-dissolve **G [1037, 1047)** (10 frames; overlap handles 5 frames each side: B03-SH06 holds its last pose to G1046, B04-SH01 pre-rolls from G1037) carrying four picture changes, so the white shirt does not read as an instant result (F003) and no spoken line or card is needed:

1. Light: setback grey-green with the overhead light-well shaft → low gold raking beam through the street door (`evening` balance, Boss builds), long shadows, dust motes in the beam; the shaft slides along the floor during the dissolve.
2. The stalls are empty and still (no treader, liquid flat, no stomp ripples), the tread cloth hung on the poles.
3. The customer's ivory shirt, dry, hangs on the back pole (z −1.25), hem lit gold.
4. Marcus's tunic hem stays damp-dark to the knee and he is still barefoot.

Painted-shot dissolves use `painted.shots[].dissolveSec` (≈0.33 s here), never `transitionIn`: [DF-20261029-painted-timeline-dissolve](../../../../docs/dev-findings/DF-20261029-painted-timeline-dissolve.md) (workaround, 2026-10-29; revalidate on the EP26 painter before using, status `unknown` for `r4-look-index` paths).

## Baseline and assets

| Asset / capability | Owner path + commit | Status | Gap / consumer |
| --- | --- | --- | --- |
| Workshop set W, three stalls, bench, jars, poles, light moods `morning` / `setback` / `door` | `src/painted/edu26/fullonica.ts`, uncommitted on `5e40444` | exists-unintegrated (still entries `r4-look-index.tsx`) | Boss hardens and animates; all of A |
| Light balance `evening` (door balance warmed gold, low beam) | none | **missing** | new for B04-SH01 and B04-SH05; Boss; fallback: `door` plus a gold colour grade (reads as time passing, loses the long shadow) |
| Marcus (`MARCUS`, `MARCUS_BARE`), senior, customer's shirt, jar, wrung cloth | `src/painted/edu26/r4-cast.ts` | exists-unintegrated | Boss; KP-MARCUS and KP-MARCUS-CLOSE approved |
| Dried shirt hanging on a pole | none (the plain `paintWrungCloth` exists) | **missing** (small prop) | B04-SH01 only; Boss |
| Smell ribbons, animated (rise, reach the nose, wave) | `paintRibbons` in `r4-cast.ts` is a still painter | still **exists-unintegrated**; animated layer **missing** | B02-SH02 plant, ledger above, B06-SH05; Boss |
| 3D hand + coin over a painted figure, near arm re-fitted on the drawn shoulder | `src/painted/edu26/r4-hands.ts`, kit `Hands3D` | exists-unintegrated | B02-SH04 (part A); five shots in all |
| Yaw camera with per-frame eye/yaw/pitch/f interpolation inside the EP26 painter | kit painted 3D camera | unknown for the EP26 paths (stills use static `WS` entries) | Boss inspects first; crane, whip-pan, pushes depend on it |
| Whip-pan, match cut, painted dissolve | `painted.shots[].dissolveSec` and picture-stage move | unknown | Boss/Editor |
| Customer (`woman-curly + new: stola-madder`) | none | **missing** (designed, not painted) | part B; the one saturated red in B04 |

Findings: [DF-20261029-painted-timeline-dissolve](../../../../docs/dev-findings/DF-20261029-painted-timeline-dissolve.md) (dissolve), [feet-frame finding](../../../../docs/dev-findings/DF-20261030-zcpaint-b09-sh02-feet-frame.md) (B03-SH04 feet whole with margin). Fallbacks and reveal impact are in the shot blocks.

## Shot map

Retired in this revision: **B03-SH05** (L09, wine inset, `KP-INSET` unused) and **B03-SH03** (L11, rinse). Never reused. Kept IDs are stable. The runtime mapping is for Editor to fill (`planned`: one painted `shots[]` entry per row, in this order).

| Shot | Beat / line | Scene-local range G `[start, end)` | Frames | Claims / clues | Runtime mapping |
| --- | --- | --- | ---: | --- | --- |
| `B01-SH04` | B01 L01 | [0, 140) | 140 | F001 spoken, hook | planned, painted shot 1 |
| `B01-SH05` | B01 L02 | [140, 242) | 102 | irony setup | planned 2 |
| `B01-SH06` | B01 L03 | [242, 360) | 118 | CL01 plant (hands), CL02 plant (ขาว) | planned 3 |
| `B02-SH01` | B02 L04a | [360, 423) | 63 | jar handed over | planned 4 |
| `B02-SH02` | B02 L04b | [423, 516) | 93 | CL04 plant | planned 5, look `LF04` |
| `B02-SH04` | B02 L05 | [516, 620) | 104 | — | planned 6 |
| `B02-SH03` | B02 L06 | [620, 695) | 75 | — | planned 7 |
| `B02-SH05` | B02 L07 | [695, 767) | 72 | turn "ผิดจ้ะ" | planned 8 |
| `B03-SH04` | B03 L08a | [767, 850) | 83 | CL01 payoff, F005 | planned 9 |
| `B03-SH02` | B03 L08b | [850, 926) | 76 | F005 tread | planned 10, look `LF05` |
| `B03-SH06` | B03 L10 | [926, 1042) | 116 | CL04 residue | planned 11 |

Part B continues at G1042 ([timed-sheet-b.md](timed-sheet-b.md)). Sum check: A is 1042 frames; B is 852; total 1894.

## B01-SH04 — hook crane, bare feet in the tub

Range and clocks: G [0, 140); L0 = G0.
Direction: frame 0 is already the hook: high and close, looking down into the middle stall, the senior's bare feet treading cloth in grey-teal water (TH-WC angle); the crane backs and down to the whole shop under the morning shaft (TH-WA). No ribbons. Subtitle band clear: the lead (senior, head) sits at y 800 at the end.
Staging: | Entity | Space W | Start | Key / end | Facing / contact |
senior (`man-buzz + new: fuller-apron`, `happy`) | metres | feet (−0.175, 0.0, −2.80) in the middle stall | in place; treads one foot per 15 frames from L4 (even, 120 bpm); double stomp at L78 (see sound) | faces +z (toward camera); hands braced on the partitions (y 1.08) |
Camera: `cam: eye (−0.10, 2.05, −1.45), yaw +3, pitch −36, f 860` at L0 → `eye (−1.55, 1.70, +0.90), yaw +22, pitch −11, f 830` at L130, ease-in-out, hold L130–L139. Transform owner: world camera (crane). Measured end: senior 347 px, face y 799 (establishing, not a lead; the shop is the subject).
VO + subtitles: L01 "ช่างซักผ้าโรมัน ซักผ้าด้วยฉี่ ใช่ ฉี่ ฟังไม่ผิดหรอก", G [0, 134). Anchor "ใช่ ฉี่" 2.6 s = G78.
Sound: music S01 comic pluck groove in at L0 (120 bpm, medium-high; `NEEDS-GEN`). Ambience A1 workshop room tone with water slosh (loop; `NEEDS-GEN`). Cue C01 wet tread stomp, one per 15 frames from L4 to L124: bare foot on soaked wool in shallow water, close, short and squelchy, the sound that makes the viewer wince (`NEEDS-GEN`, 3 variants). Cue C02 at L78 "ใช่ ฉี่": a double stomp on the beat plus a short pluck stab on top (the deadpan underline). Groove continues across the cut.
Mix intent: hit at L78; hold the groove; stomps lift slightly at L0.
Cut: hard cut at G140 to B01-SH05.
Entry → exit: entry: tub, treading cloth, morning shaft; exit: whole shop framed, senior in the middle stall, door at the left edge.
Acceptance: | G | Observable | Evidence |
G0 | feet in water fill the picture; chrome visible; no ribbon | frame |
G78 | double stomp lands on "ใช่ ฉี่" | sync check |
G139 | wide shop, three stalls, door left, shaft on the floor | frame |

## B01-SH05 — Marcus steps in

Range and clocks: G [140, 242); L0 = G140.
Direction: medium on the street door from the jar corner; Marcus crosses the bright threshold in a clean sky-blue tunic and sandals and beams at the room; the senior glances over and smiles (the viewer knows, he does not).
Staging: marcus (`man-spiky + new: marcus-tunic`, `happy`, sandals) feet (−2.90, 0, +0.40) at the threshold at L7 (G147, "วันนี้เป็นวันแรก") → (−0.80, 0, +0.55) by L50, walking, then stops facing the room and the lens (3/4 front, beaming; **R2**: facing −x showed his back); senior in the middle stall (−0.175, 0, −2.80) treading, `happy`, glances toward the door at L61 (G201, "ยังไม่มีใครบอกเขา") and smiles by L70.
Camera: `cam: eye (+1.50, 1.55, +1.00), yaw −52, pitch −7, f 800` at L0 → `eye (+1.30, 1.50, +0.80), yaw −62, pitch −6, f 900` at L101 (push in, eased). Projection run: Marcus at the door 328 px at L7 (entrance, below the lead rule by design), 697 px at the end (face (187, 810), tight on the left edge; Editor may shift yaw −3° to recentre). Transform owner: world camera.
VO + subtitles: L02 "วันนี้เป็นวันแรกของมาร์คุส และยังไม่มีใครบอกเขา", G [140, 236); the 4-frame gap holds to G242. Ribbons: none yet.
Sound: A1 continues with street murmur swelling at the door (C03 at G147: sandal scuff on a stone threshold, two steps, dry, close; plus a short door-open street murmur, 1 s, `NEEDS-GEN`). Stomps C01 continue far, −9 dB. Groove continues.
Mix intent: lift the street murmur at G147, drop it to room tone by G200.
Cut: hard cut at G242 to B01-SH06.
Entry → exit: entry: Marcus outside the door; exit: Marcus at (−0.80, 0, +0.55) beaming, senior smiling.
Acceptance: G147 Marcus's first foot crosses the threshold (frame); G201 the senior's look and smile (frame).

## B01-SH06 — the vow (CL01 template)

Range and clocks: G [242, 360); L0 = G242.
Direction: medium close at the bench's near side; Marcus lifts the customer's ivory shirt from the reed basket, drapes it over his left forearm and raises both hands chest-to-shoulder height, palms toward himself, `smug`. **CL01 template: mitten centres at screen (380, 900) and (700, 900).** Face above the band (head top y 700).
Staging: marcus feet (−0.42, 0, +0.12) facing (0, +1) toward the camera; basket right of him; both hands on world anchors **(−0.447, 1.073, 0.38) and (−0.153, 1.073, 0.38)** (projected to (380, 900) / (700, 900) at this camera); his right (screen-left) hand is the raised mitten, the left forearm carries the shirt (screen right). Shirt lifted L4–L20 (G246–262, from the basket), hands rise L60–L76 (G302–318, "ด้วยสองมือนี้เลยครับ", est: see VO), hold to L117. Pose `new: vow-two-hands`. Ribbons: none.
Camera: `cam: eye (−0.30, 1.40, +1.30), yaw 0, pitch −4, f 1000, hy 643` (R2: anchors y 1.39 was mouth height on the four-head rig; screen spots unchanged) held with the retention drift (±0.03 m, eased). Projection run: Marcus 1,291 px, head y 700. Transform owner: world camera.
VO + subtitles: L03 "ผมจะทำให้เสื้อตัวนี้ขาวที่สุดในโรม ด้วยสองมือนี้เลยครับ", G [242, 354). **Anchor conflict:** the measure lists "ด้วยสองมือ" at 8.58 s (G257), earlier than "ขาวที่สุด" 9.08 s, which contradicts the text order; treat as unreliable: the vow raise is `est` from the line end (phrase about 1.5 s) at G302–318, `LC`, Editor ear-checks.
Sound: C04 proud brass "ta-da" sting, two bright notes, short and a little pompous, at G336 (`est`, `LC`, phrase end ≈ G350) (`NEEDS-GEN`). Groove continues through (music cuts later at the lid). Ambience A1 room tone.
Mix intent: hit at the sting; hold the groove.
Cut: hard cut at G360 to B02-SH01 (jar scene, same bench; the shirt is folded onto the bench stack during the cut).
Entry → exit: entry: shirt in the basket; exit: shirt over the left forearm, both hands raised at the CL01 spots. Prop state at exit: shirt in left forearm, hands empty.
Acceptance: G318 mitten centres within ±8 px of (380, 900) and (700, 900), face above y 880 (frame + measured).

## B02-SH01 — the jar handed over

Range and clocks: G [360, 423); L0 = G360.
Direction: two-shot across the bench, the LF04 camera, wider in time. The senior smiles and sets the lidded jar in front of Marcus.
Staging: senior feet (+0.42, 0, −0.98) facing (−0.55, 1); marcus feet (−0.42, 0, +0.12) facing (0.7, 1), shirt now folded on the cloth stack at the bench's right end, hands empty and hanging, `happy` → `neutral` on the jar; lidded jar carried by the senior then set at **(+0.10, 0.86, −0.36)** (base on the bench top y 0.86) at L32 (G392, on "ให้ใบหนึ่ง" 12.96 s = G389). Ribbons: none until the lid opens.
Camera: `cam: eye (0.00, 1.45, +1.62), yaw 0, pitch −8, f 900, hy 820` (LF04, measured), slow retention push of 0.10 m. Transform owner: world camera.
VO + subtitles: L04 "รุ่นพี่ยิ้ม ยื่นไหให้ใบหนึ่ง ฝาเปิดปุ๊บ กลิ่นมาถึงก่อนคำอธิบาย" starts here; the subtitle runs G [360, 510) across this shot and the next (split at the cut).
Sound: C05 jar base set on stone, one hollow dry ceramic clunk, close, 0.4 s, at G392 (`NEEDS-GEN`). Groove continues.
Mix intent: hold; the groove stays for one more beat.
Cut: hard cut at G423 to B02-SH02, same camera (a cut-in on the lid action, 6 frames before "ฝาเปิดปุ๊บ" G429).
Entry → exit: exit: jar lidded on the bench, senior's hand on the lid.
Acceptance: G392 the jar base meets the bench (contact shadow, no fused hand).

## B02-SH02 — the smell arrives (LF04, CL04 plant)

Range and clocks: G [423, 516); L0 = G423.
Direction: **LF04** (approved): the senior lifts the lid (mitten, painted lid, senior at 2.6 m); three olive-yellow ribbons rise from the jar mouth and reach Marcus's nose in one path; his face flips to the yuck face; he recoils, near open mitten fanning the smell. The gag is in the silence and the face.
Staging: lid lift L0–L15 (G423–438), lid clear at L15; ribbons rise L15–L32 (G438–455), reach the nose at L32 (G455, "กลิ่นมาถึงก่อน" 15.18 s); yuck face from L32; recoil from the waist, head cock −9°, L32–L52 (G455–475); fan mitten up at L47 (G470); hold to L92. marcus (−0.42, 0, 0.12) facing (0.7, 1); jar (0.10, 0.86, −0.36), lid off.
Camera: `cam: eye (0.00, 1.45, +1.62), yaw 0, pitch −8, f 900, hy 820` (LF04, measured), slow push 0.12 m over the shot. Transform owner: world camera.
VO + subtitles: continues L04, G [423, 510); gap to G516. "ฝาเปิดปุ๊บ" 14.3 s = G429; the pop is est G438 (word onset + 0.3 s).
Sound: **music S01 cuts out at G438** and stays out through the smell (the silence is the gag). C06 lid scrape (ceramic on ceramic, gritty, 0.4 s) from G429 and a small ceramic pop at G438 (`NEEDS-GEN`). C07 low comic wobble, a soft detuned tuba-like tone, 0.8 s (24 frames), G447 to G471, peak at the ribbon arrival G455: it makes the smell visible to the ear (`NEEDS-GEN`). Ambience A1 only.
Mix intent: drop at G438; hit at G455; release to room tone.
Cut: hard cut at G516 to B02-SH04.
Entry → exit: exit: Marcus leaning back, three ribbons around his head, fan mitten up.
Acceptance: G438 the lid is off; G455 ribbons touch the nose, yuck face; music absent from G438 (audio check).

## B02-SH04 — "ไหนี่มันฉี่ใช่ไหม" (3D pinch hand)

Range and clocks: G [516, 620); L0 = G516.
Direction: medium close on Marcus; he pinches his nose and points at the jar off-screen right; `disgusted`; ribbons around his head.
Staging: marcus (−0.42, 0, 0.12); pinch hand = five-finger 3D hand (`Hands3D`, thumb and finger on the nose; the fingers are the gag), on at L6 (G522); pointing hand = mitten, rises to point screen right at L34 (G550, "ไหนี่มันฉี่" `LC`), holds to L90. Ribbons 3, as in the ledger.
Camera: `cam: eye (−0.35, 1.40, +0.75), yaw −6, pitch −3, f 1050, hy 720` (R2: face off the band), retention drift. Projection run: face y 533, well above the band. Transform owner: world camera.
VO + subtitles: L05 "พี่… ไหนี่มันฉี่ใช่ไหม", G [516, 614). Voice is nasal (the actor's).
Sound: silence under the line: no SFX, no music; room tone only (A1 low).
Mix intent: hold silence.
Cut: hard cut at G620 to B02-SH03.
Entry → exit: exit: nose pinched, point held toward the jar.
Acceptance: G522 the 3D thumb and finger read on the nose (frame check at 540 px); G550 point (`LC`, ±6 frames).

## B02-SH03 — "ของดีนะ ใส่เยอะ ๆ"

Range and clocks: G [620, 695); L0 = G620.
Direction: medium on the senior across the bench with the open jar; he beams, pats the jar and slides it a hand's width toward Marcus; Marcus's shoulder in the near-left foreground with two ribbons.
Staging: senior (+0.42, 0, −0.98) facing (−0.55, 1), `happy`, one `present` hand on the jar; pat at L20 (G640, est), slide L47–L55 (G667–675, "ไม่ต้องเกรงใจ" 22.24 s = G667), jar ends 0.12 m nearer Marcus on the stone (stays grounded). marcus shoulder at (−0.42, 1.30, +0.12) foreground.
Camera: `cam: eye (+0.10, 1.47, +0.90), yaw +8, pitch −10, f 950`. Projection run: senior 785 px, face (569, 672) above the band. Transform owner: world camera.
VO + subtitles: L06 "ของดีนะ ใส่เยอะ ๆ ไม่ต้องเกรงใจ", G [620, 689).
Sound: C08 ceramic jar slides on stone, short and gritty, 0.3 s, at G667 (`NEEDS-GEN`). Room tone only.
Mix intent: hold.
Cut: hard cut at G695 to B02-SH05.
Entry → exit: exit: jar 0.12 m nearer Marcus, senior's hand on it.
Acceptance: G667 slide starts on the jar's base with the base still on the stone (frame).

## B02-SH05 — "ผิดจ้ะ" whip-pan to the tub

Range and clocks: G [695, 767); L0 = G695.
Direction: medium on Marcus holding the jar at arm's length, forced smile, ribbons around him. On "ผิดจ้ะ" a **whip-pan** up and across (yaw 0° → toward the back wall, pitch −8° → −20°) ending on the empty middle stall; the pan lands and holds before the match cut.
Staging: marcus (−0.42, 0, 0.12); the jar in both hands at chest height, arms straight (the B02-SH03 jar picked up; entry prop state: jar on the bench, exits the shot in his hands, then set down off-screen before B03-SH04). Whip-pan L48–L60 (G743–755): `cam` start `eye (−0.40, 1.42, +1.10), yaw 0, pitch −8, f 950` → end yaw −2, pitch −20 aimed at the middle stall (−0.175, 0.9, −2.80), eased out, blurred in the middle frames (**R2**: Marcus blocked the stall from the start eye, so under the streaks a hidden eye move lands at `eye (−0.175, 1.75, −1.55), yaw 0, pitch −48`, which frames the stall; the viewer sees only the whip); hold L60–L71 on the stall.
Camera: as staged; projection run: Marcus head y 623, lead 1,370 px at the start. Transform owner: world camera.
VO + subtitles: L07 "มาร์คุสคิดว่านี่แย่สุดแล้ว ผิดจ้ะ", G [695, 761); "ผิดจ้ะ" 24.76 s = G743.
Sound: C09 deadpan dry tick or record-stop on "ผิดจ้ะ" at G743 (candidate library `comedy_cartoon-brake_01`, Ton checks the fit; else `NEEDS-GEN`); C10 whoosh G745–G757 for the pan, 0.4 s. Room tone only.
Mix intent: hit at G743; release.
Cut: hard cut at G767 to B03-SH04 (hands part).
Entry → exit: exit: camera on the empty middle stall, flat grey-teal liquid.
Acceptance: G743 tick on "ผิดจ้ะ"; G755 the stall is framed with the liquid and rim readable (frame).

## B03-SH04 — hands become feet (CL01 match cut)

Range and clocks: G [767, 850); L0 = G767. Hands state L0–L34 (G767–801); **match cut at L35 (G802, "เปลี่ยนเป็นสองเท้า" 26.72 s)**; feet state L35–L82.
Direction: hands state: Marcus's two raised, empty hands at exactly the B01-SH06 spots, `worried`, looking at his own hands with dread; the match cut puts his two bare feet on the middle stall's front rim at the same screen spots; he then steps down into the liquid (right foot first). The light goes grey-green (`setback`) at the cut.
Staging: hands state: marcus (−0.42, 0, 0.12), hands at **(−0.447, 1.073, 0.38) and (−0.153, 1.073, 0.38)**, empty (jar set down, shirt on the bench stack); the same camera as B01-SH06. Feet state: feet centres on the stall rim at **(−0.35, 0.62, −2.30) and (−0.05, 0.62, −2.30)** (rim y 0.62, toes toward −z, ankle-deep once in): both feet whole with margin; sandals set on the side wall; right foot dips into the liquid at L64 (G831, `est`: phrase "ลงไปยืนในอ่าง" has no anchor, between 26.72 s and 28.94 s), left foot at L73 (G840). Ribbons: 1 (hands state), 2 (feet state) per the ledger. Barefoot from here to the end.
Camera: hands state `cam: eye (−0.30, 1.40, +1.30), yaw 0, pitch −4, f 1000, hy 643`; feet state **`cam: eye (−0.20, 0.83, −1.80), yaw 0, pitch −25, f 1000, hy 1024`** (R2: the rig stance is about 0.18 m, not 0.30 m), retention drift. **Projection run (R6): the feet land at screen (380, 906) and (700, 906), within 6 px of the CL01 spots** (R4's estimate eye (−0.18, 1.10, −1.90) projected to (239, 1430)/(770, 1430) and is retired). Transform owner: world camera; cut owner: Editor.
VO + subtitles: L08 starts here "สองมือที่สัญญาไว้ เปลี่ยนเป็นสองเท้า ลงไปยืนในอ่าง ย่ำผ้าในน้ำผสมฉี่", G [767, 920) across this shot and the next. Anchors: "สองมือที่สัญญาไว้" reads 25.34 s (before the line start): use G767. "ย่ำผ้า" 28.94 s = G868 (resolved at 1.00 in this re-run; one listen).
Sound: C11 two-note pluck that bends down (hands to feet) at G802 (`NEEDS-GEN`); C12 toes on a wet stone rim, soft pat-pat, 0.4 s, G802–G815; C13 slow squelch as the right foot enters the liquid at G831 and again lighter at G840 (`NEEDS-GEN`). Room tone cools. Music absent.
Mix intent: hit at G802; hold.
Cut: match cut inside the shot at G802; hard cut at G850 to B03-SH02.
Entry → exit: entry: hands empty and raised at the CL01 spots; exit: both feet in the liquid, shins submerged, ribbons off the liquid.
Acceptance: | G | Observable | Evidence |
G801 vs G802 | the same two screen spots, ±8 px, hands then feet | overlay of the two frames |
G802 | both feet fully in frame with margin (feet-frame finding) | frame |
G849 | both feet in the liquid | frame |

## B03-SH02 — the tread (LF05)

Range and clocks: G [850, 926); L0 = G850.
Direction: **LF05** (approved, measured): high 3/4 from the stall wall toward the senior; Marcus stands in the middle stall to mid-shin and treads, right mitten on his nose, left braced on the partition's near end; the senior treads the right-hand stall and wrings cloth with two fists at the belly; shins seen through the murky liquid, ripples, foam, splash drops, light-well glints, drip-line cloth over the stalls (the plain tread cloth, not the customer's shirt), gutter and basket in the foreground; faint ribbons off the water. F005 shown: feet tread, hands work.
Staging: marcus feet in the middle stall, centre about (−0.17, 0.0, −2.75), left palm on **(+0.33, 1.12, −2.55)**; senior `LF05_SENIOR` (x ≈ 0.95, z −2.80) facing (−0.8, 1), wringing; tread cycle one step per 15 frames locked to the groove; "ย่ำผ้า" 28.94 s = G868 (L18): the first full-weight stomp plus splash. The numbers in `src/painted/edu26/r4-looks.ts` (LF05) own the exact anchors.
Camera: **`cam: eye (−0.20, 2.00, −1.95), yaw +22, pitch −30, f 760, hy 520, cx −40`** (LF05, measured), retention drift. Transform owner: world camera.
VO + subtitles: continues L08 to its end, G [850, 920); gap to G926.
Sound: music S02 returns as a plodding squelch-stomp groove locked to the treads, medium energy, enters on **G868**; C14 deep wet stomps with each step, each 15 frames from G868 (`NEEDS-GEN`, 3 variants, duller and wetter than C01, deeper in the tub); S02 holds to G920.
Mix intent: lift at G868; at G920 the groove drops to wet room tone (the beat of near-silence before "แม่ครับ").
Cut: hard cut at G926 to B03-SH06.
Entry → exit: exit: Marcus mid-tread, nose held, ribbons off the liquid.
Acceptance: G868 the first stomp lands with the splash; look matches LF05 (side-by-side frame); the water reads as water at 540 px (viewer check).

## B03-SH06 — "แม่ครับ… ผมสมัครงานผิดร้านแน่เลย"

Range and clocks: G [926, 1042); L0 = G926; the dissolve handle runs to G1047 (see the time-passing section).
Direction: medium close on Marcus in the stall, slightly low looking up at him, the light well behind. He lifts his eyes to the ceiling on "แม่ครับ…" and the treading slows to a bob; `sad` / `worried`. Three thin ribbons (ledger) rise off his shoulders against the light well: this is the shot that carries CL04 into the evening cut.
Staging: marcus feet (−0.15, 0.0, −2.75) facing (0, +1), eyes up at L0 (G926); tread slows from 15 to about 30 frames per step by L40; he hangs his head at L110 (G1036, line end).
Camera: `cam: eye (−0.15, 1.30, −1.75), yaw 0, pitch +6, f 1050, hy 760` (R2: face off the band), retention drift. Projection run: face y 742, above the band. Transform owner: world camera.
VO + subtitles: L10 "แม่ครับ… ผมสมัครงานผิดร้านแน่เลย", G [926, 1036). "แม่ครับ" 30.84 s = G925 (reads at the line start); "สมัครงานผิดร้าน" 32.58 s = G977.
Sound: near-silence from G920 (room tone only); C15 one slow squelch after the line at G1038 (`NEEDS-GEN`, 0.5 s, under the dissolve). Music absent from G920.
Mix intent: drop at G920 to room tone; release into the evening pad at G1042.
Cut: **cross-dissolve G [1037, 1047)** into B04-SH01 (see the time-passing section; transform owner: painted-shot dissolve).
Entry → exit: exit: Marcus head hung, three ribbons, flat liquid still rippling.
Acceptance: | G | Observable | Evidence |
G926 | eyes up, light well behind, 3 ribbons on the shoulders | frame |
G1036 | line ends with a held pose, no tread splash | frame |
G1042 | mid-dissolve: both worlds readable (grey-green and gold) | frame |

## Dependencies and open items (part A)

| Owner | Dependency / acceptance | Status |
| --- | --- | --- |
| Boss | `evening` balance, dried-shirt prop, animated ribbons, animated EP26 yaw camera, 3D hand layer (B02-SH04) | see asset table; handoff list in part B |
| Editor | ear-check the anchors marked `LC` (L03 "ด้วยสองมือ", L05) and L08 "ย่ำผ้า"; verify the 10-frame dissolve and the L04 split at G423 | open |
| Film | element captures: stills only (`projects/edu/EDU/ep26-r5-looks/`: LF04, LF05, KP-MARCUS, KP-MARCUS-CLOSE, approved); no new capture this pass | provided |

Editor scene sample proposal: G [360, 520) (jar, silence, the face) and G [1020, 1070) (the time-passing dissolve).

## Change log

- R1 (EDU-EP26-SHEET-R1), 2026-11-18, Film, W5. First timed sheet on EDU-EP26-VOICE-R3 (1894 frames). **Retired B03-SH05** (L09, wine inset, KP-INSET no longer used) **and B03-SH03** (L11, rinse cistern). B03 restaged as the tread (B03-SH04, B03-SH02, B03-SH06) straight into the evening with a visible time-passing dissolve; CL04 continuity moved into the ribbon ledger (B03-SH06 ribbons raised from "faint" to three thin, B04-SH05 and B05-SH01 raised from "one very faint" to two). B03-SH04 feet camera replaced by eye (−0.20, 0.97, −1.43) after the projection run (the R4 estimate missed the CL01 spots by 150–350 px). B01-SH05 end camera moved in and Marcus's stop point moved nearer to meet the lead rule. Supersedes the R5 untimed values for those shots only; every other shot keeps its R5 staging and look.
- R2 (EDU-EP26-SHEET-R2), 2026-11-19, Film, W5.3: accepted Boss deviations from the W5.2 build: B01-SH05 end facing the lens; CL01 anchors y 1.073 and vow camera hy 643 (B01-SH06, B03-SH04 hands); B03-SH04 feet eye (−0.20, 0.83, −1.80) hy 1024; B02-SH04 hy 720; B03-SH06 hy 760; B02-SH05 hidden whip landing eye (−0.175, 1.75, −1.55) pitch −48. **Not accepted, Boss fix pending (sheet text unchanged):** B01-SH04 L0 feet filling the frame; B03-SH06 eyes-up and ribbon contrast; B03-SH04 exit shins. See [build notes W5.3](../build-notes.md).
