# ALV-EP01-SHORT — storyboard index (first pass, untimed)

Deliverable: `ALV-EP01-SHORT` · Revision: `ALV-SB-R2` · Status: **draft** (storyboard pass with the user's R1 verdicts applied; not a timed scene sheet) · Timing: untimed; the voice lock (W4) gives the frames, Film writes timed sheets at W5.1
Inputs: [script.md](script.md) `ALV-SCRIPT-R1.2` · [fact-check.md](fact-check.md) `ALV-FACTCHECK-R1` + Recheck R1.1 · [visual-brief.md](visual-brief.md) `ALV-BRIEF-R1.2` (VD01–VD14) · [../delivery.md](../delivery.md)
Target: branch `claude/sticky-progress-check-a74b34`, base `1644c6c` · 30 fps · 1080×1920
Evidence: runtime unverified · look frames L1–L3 rendered as stills (W3.1, `ALV-LOOK`; asset store `projects/alvarenga/previews/look-frames/`), no shot renders · audio/subtitle sync not measured · user approval not given · review page: https://claude.ai/artifact/24s4A8qF2xHEpssU6t1BeA (published ALV-SB-R1, v1; R2 republish pending) (rows: [review-rows.json](review-rows.json), Thai)

One shot = one timeline scene. IDs `S0n-SHmm` (beat = script scene `ALV-EP01-SHORT-S0n`). The Thai VO, claims and on-screen texts are the script's, unchanged; claim IDs follow the script's claim mapping (Film adds none).

## Shared constants (estimates; brief owns the baseline)

Spaces and projection: brief "Technical handoff" (`world` metres, origin mid-hull at the waterline, +X right, +Y up; `screen` px, origin top-left, Y down, 1080×1920). All numbers below are `estimated` and unchecked; `scripts/shot-projection.py` is not run in this pass (fixed orthographic side-on plane, no perspective; Film runs the lead-height and caption-zone check at W5.1 with the measured frames). Scale tiers: wide 150 px/m (6 m boat ≈ 900 px, standing Alvarenga ≈ 267 px, seated ≈ 200 px), medium 300 px/m, insert 450 px/m. Horizon y ≈ 760 in wide tiers. Boat centre x ≈ 540, waterline y ≈ 860 (wide). Lead and boat stay in y 350–1000; caption block bottom y 1150–1248; text slots inside x 120–888, y 288–1248 (VD14). Lead-size risk: a 267 px standing man in a wide may fall under the lead-size rule; if the check fails the S06 and S08 crops tighten (framing, not actor resize).

Time-of-day tint table (VD04; one owner in the episode module; hex values are proposals for the L1–L3 look frames, Film fixes them there):

| Key | Used in | Sky (top → horizon) | Sea band | Hull / accent | Note |
| --- | --- | --- | --- | --- | --- |
| T1 dawn | S01, S02, S09 | pale blue `#BFD6E6` → peach `#F6D3B8` | dusty blue `#8FB2C8` | cream hull `#F3E6CF`, stripe sage `#9DBAA0`; hat mustard `#E0A93B` | S09 equals S01 |
| T2 storm | S03 | grey-violet `#8B8AA3` → `#B7B3C6` | same blue-grey, flat, **no swell** `#7D93A8` | hull unchanged | darkest key, still pastel |
| T3 day | S04, S05-SH01 | soft sky `#CFE3EE` → cream `#F7F0DC` | `#9CC0D0` | as T1 | bright |
| T4 dusk | S05-SH02, S07, S08 | apricot `#F2B88F` → blue-grey `#9FA9BE` | `#7F93AC` | hat stays the one saturated colour | S08 figure silhouette needs an opaque base |
| T5 reef | S06 | aqua `#BFE6E0` → cream `#F8F1DC` | aqua `#8CCDC8` | sand `#EBDDBB`, palms sage | cooler and brightest |

No red in any tint, hat or stamp (monetization). User review (2026-11-02, S04-SH03): red or yellow is allowed on the survival props (not a kids' clip); Film uses a yellow-amber cup liquid and keeps blood unshown (script must-not-be-seen).

## Shot staging, camera and sound (screen px, wide tier unless stated; frame numbers wait for the voice lock)

Casting from the brief; pose IDs from the kit. Sound IDs are from the brief's library check; `NEEDS-GEN` = Editor generates (`sound-generation` skill).

| Shot | Casting / props | Staging (start → end) | Camera | Tint | Sound line |
| --- | --- | --- | --- | --- | --- |
| S01-SH01 | `man-buzz, P31, neutral`; boat | boat centre (540, 860); man seated at stern thwart, head ≈ y 660; no travel, bob < 1° | static wide, push 0 → 4 % over the shot, picture layer | T1 | ambience `NEEDS-GEN` calm-sea bed from frame 0; `bed_warm-pad-felt-third_01` enters on "14 เดือน" |
| S02-SH01 | `man-buzz, P31` + `man-spiky, P01, happy`; hat worn | man seated stern; Ezequiel standing at bow (≈ x 320); faint coast strip at the left horizon; name card slides in from top into slot A (x 120–888, y 300–360) | slow lateral drift 0 → 40 px | T1 | pad continues; `whoosh_page-flip-paper_01` for the card; far gull `NEEDS-GEN` |
| S02-SH02 | `man-spiky, P01, happy` + `man-buzz, P31` (medium, 300 px/m) | Ezequiel centre, hat at head level ≈ y 560; small card `เอเซเกียล กอร์โดบา` slides into slot B beside him | push 0 → 3 % | T1 | pad; `whoosh_page-flip-paper_01` low |
| S03-SH01 | `man-buzz, P32, worried`; sky + rain only | man seated, elbows on knees; rain streaks fall at a slow constant angle; water band identical to T1 shape | static wide | T1 → T2 across the shot | `weather_rain-thunder-distant_01` (thunder cut or faded); pad out |
| S03-SH02 | outboard only (insert, 450 px/m); FPOV from the stern thwart is allowed by the user (suggestion) but not used: it needs a face-on outboard (new asset) | motor centred; smoke wisp rises and stops | static | T2 | `NEEDS-GEN` outboard sputter then stop; 0.3 s silence after "พัง"; label `เครื่องยนต์พัง` in slot A |
| S03-SH03 | boat only | boat at (540, 880), ≈ 60 % of the wide scale (small, far; baseline-scale exception for emptiness, recorded) | slow pull-out 4 % | T2 | rain thinner, wind low; no music |
| S04-SH01 | sun-dried cartoon turtle and seabird (`X X` eyes) as flat cut-outs; boat | turtle on its back (flippers up) on the thwart at ≈ x 380, bird limp with wings out on the gunwale at ≈ x 700, both in the sun with small heat squiggles; no wound, no blood, no hands; no animal movement beyond the squiggles | medium (300 px/m), slow drift | T3 | `bed_warm-pad-felt-third_01` warmer; no wing flap (R2); card `เต่า · นก · น้ำฝน` slot A with `whoosh_page-flip-paper_01` |
| S04-SH02 | `man-buzz, P18, worried` hands + container | container held up at head height; drops fall into it | insert crop (450 px/m), static | T3 | `NEEDS-GEN` rain drops into container (short) |
| S04-SH03 | `man-buzz, P19, sad`; plain cup with a flat yellow-amber liquid `#D9B44A` | cup at mouth, head tilts away 5–8°; liquid level visible, no drip or splash; red is allowed by the user but not used (script conflict, see brief VD07) | medium, push 0 → 3 % | T3 | near silence; sea bed only |
| S05-SH01 | `man-spiky, P33, sleepy` + head-down `nod`, hat on, shading his face; `man-buzz` (mid-length hair), `P01, sad`, far thwart | medium: camera s 2.0 on the 150 px/m plate, push ≤ 3 %; Ezequiel seated on the floor against the starboard gunwale (plate x ≈ 400), drained, slumped; Alvarenga on the far thwart (plate x ≈ 655, ≈ 1.7 m away; camera focus plate x ≈ 530 so both stay in the 270–800 crop) | static, push ≤ 3 % | T3 | `tone_soft-sustain-reflective_01` single low note; sea bed |
| S05-SH02 | same plate and start framing as SH01; Ezequiel `P33` → `lie` 0 → ≈ 0.6 (slumps sideways) behind the near hull card; hat slips onto the seat (≈ x 400, y 800); `man-buzz` `P01, sad` unchanged | slow zoom out s 2.0 → 1.0 (to the S05 wide), then the slump: he goes below the near gunwale and is hidden; last frame: empty seat plus hat, Alvarenga alone; no frame shows a prone figure | zoom-out then locked | T3 → T4 | same note held; silence ≈ 0.3 s after the VO; hard cut SH01 → SH02 at the same frame (no dissolve; dissolve is the fallback, DF-20261029-painted-timeline-dissolve) |
| S06-SH01 | `man-buzz-long, P01, sleepy` → `P30, neutral`; boat bow; reef; palm islet | boat bow at the shallows (≈ x 480); man stands, ≈ 300 px/m so he reads ≈ 530 px tall, head ≈ y 450; islet low on the horizon at the right | push-in 0 → 6 % | T5 | `bed_warm-pad-felt-third_01` lifts; reef surf and birds `NEEDS-GEN`; cards in slots A and B |
| S07-SH01 | boat, hat in boat, SVG document | empty boat; hat on the seat; document slides from y −400 to rest at y ≈ 420, centred, stamp `ข้อกล่าวหา`, small line `รายงานข่าว ธ.ค. 2015` | static, push ≤ 2 % | T4 | music out on "แต่ปลายปี 2015…"; `whoosh_fast-slide_01` on the card; `reveal_riser-tension_01` kept low under "ฟ้องเขา"; `stinger_low-muted-hit_01` on "เพื่อนร่วมเรือ" (check it is not horror) |
| S08-SH01 | `man-buzz-long, P44, sad` silhouette, shore, boat, hat | figure at the foreground left (≈ x 260), silhouette; boat mid-distance; hat drifts 0 → 120 px away from the boat | static wide | T4 | `bed_sad-aftermath-ambient_01`; sea bed |
| S08-SH02 | same figure from behind the shoulder; boat | figure at the left of frame (≈ 450 px tall at medium), boat small at the right; labels `พยาน: 1 คน` (slot A) → `ไม่พบรายงานผลคดี` (slot A, one text per slot) | push 0 → 3 % | T4 | `tone_thin-unresolved_01`; near-silence on the last clause |
| S09-SH01 | boat only, S01 composition and camera start | boat centre (540, 860), no figure; text `ถ้าเป็นคุณ จะทำยังไง?` slot A held to the end | same framing and push as S01-SH01 (0 → 4 %) | T1 | music fades to the S01 sea bed; no stinger |

## Look frames (W3.1)

L1 open sea (S02-SH01), L2 storm sky (S03-SH03), L3 islet and shore (S06-SH01): stills in the asset store `projects/alvarenga/previews/look-frames/`; code `src/painted/alvarenga/`, plates `src/painted/shots/alvarenga.tsx`, composition `ALV-LOOK`. Awaiting the user's look-lock (W3.2) and the `man-buzz-long` confirmation.

## Visual progression, in short

S01 → S09 are one boat; progress is light (T1 → T2 → T3 → T4 → T5 → T4 → T1), who is aboard (1 → 2 → 1 → empty), and the hat (worn S02 → resting S05 → in the boat S07 → drifting S08). The wides in S01, S03-SH03 and S09 differ in information (hook, lost coast, the question); S04 and S08 split into vignettes so no two consecutive shots repeat a crop.

## Open items

| Owner | Item | Status |
| --- | --- | --- |
| user | confirm the `man-buzz-long` look at the L3 frame (S06-SH01) and the L1–L3 look lock | open (VD05, W3.2) |
| Film | S05 pair: first shot is now medium on a wide plate; confirm both men fit at s 2.0 at the scene-sheet pass | open |
| Film | S03 has three shots in about 4 s; merge SH01 and SH02 if the measured read is too tight | open, decide at W5.1 |
| Film | shot-projection and lead-size checks | not run (untimed pass) |
| Boss | missing assets: boat, hat (3 states + head-to-seat drop), dead turtle and seabird with `X X` eyes, container, cup with liquid, islet and reef, `man-buzz-long` (beard length not in `HeadStyle`), thwart seat, seated-collapse motion (`lie` behind the hull), plate padding for the S05 zoom-out. Film wrote look-frame versions in `src/painted/alvarenga/` | brief VD02/05/06/07/08/13 |
| Editor | sound `NEEDS-GEN`: sea bed loop, outboard sputter, reef surf and birds, gull, rain-in-container (wing flap dropped in R2) | open |
| coordinator | build and publish the page (W2.3); look frames L1–L3 are added by Film at W3.1 | done 2026-11-02 |

## User verdicts on ALV-SB-R1 (2026-11-02, storyboard tab)

12 shots ok, 4 change, 1 ok with a suggestion; 11 passed shots unchanged.

| Shot | Verdict | User note | Applied in R2 |
| --- | --- | --- | --- |
| S03-SH02 | ok + suggestion | "FPOV มุมมองตนอบู่บนเรือได้นะ" | not adopted (needs a face-on outboard); option recorded |
| S04-SH01 | change | "ทำเป็นเต่านก โดนตาก ตาเป็น X X ได้ การ์ตูนหน่อย" | sun-dried cartoon turtle and bird, X eyes |
| S04-SH03 | change | "มีสีแดงได้ หรือสีเหลืองได้ ไม่ใช่คลิปเด็กอยู่แล้ว" | cup shows a flat yellow-amber liquid; red allowed, not used |
| S05-SH01 | change | "ภาพกลางได้ นั่งแบบคนอิดโรยหมดแรง" | medium, drained seated pose |
| S05-SH02 | change | "ค่อยซูมออกแล้วล้มลงก็ได้ แบบหมดแรง" | zoom out, then slump behind the gunwale (user overrides the prone-pose rejection) |

## Change log

- `ALV-SB-R1` (2026-11-02, Film): first storyboard pass, 16 shots in 9 beats, untimed.
- `ALV-SB-R2` (2026-11-02, Film): user verdicts on R1 applied to S04-SH01, S04-SH03, S05-SH01, S05-SH02 (above); S03-SH02 FPOV noted; look frames L1–L3 added (W3.1); brief to `ALV-BRIEF-R1.2`; other 11 shots unchanged.
