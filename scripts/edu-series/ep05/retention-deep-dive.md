# EDU-EP05-SHORT — retention deep dive (2026-11-08)

- Trigger: user, 2026-11-08: "แกะลงไปลึก ๆ" why EP05 had 20.2 % swiped away against 33.6–36.6 % for EP02/EP03, and why viewers stuck with it. Follows [lessons-learned.md](lessons-learned.md) (LL01–LL05, applied as ER01–ER04).
- Inputs: the three posted MP4s in `$REELS_STORE/publish/EDU/EDU-EP0{2,3,5}-SHORT/` (only covers changed after posting); caption events and cuts from the compositions (`edu2CaptionEvents`, `edu3CaptionEvents`, `edu5CaptionEvents`); [channel-performance](../../../docs/channel-performance.md); outside sources in [Sources](#sources).
- Frame sheets in `$REELS_STORE/projects/EDU/research/`: `hook-first3s.png` (0, 0.5, 1, 1.5, 2, 3 s, rows EP02/EP03/EP05), `ep02-shots.png`, `03-shots.png`, `05-shots.png` (one frame per shot).
- **Evidence level:** n = 3 videos, no retention curve for EP05, different post dates and channel age. Everything below is a ranked hypothesis, not a proven cause.

## Two separate questions

1. **Swiped away** is decided in the first seconds in the feed. Only the opening (frame 0 to about 3–5 s) can explain 20 % vs 34–37 %.
2. **Average % watched** (~91 % vs 60–66 %) is decided by the body. Different causes, so they are analysed separately.

## What is ruled out (measured)

| Factor | EP02 | EP03 | EP05 | Reading |
| --- | --- | --- | --- | --- |
| Voice | Gemini Kore | Gemini Kore | Gemini Kore | Same narrator: not the cause. |
| Length | 59.0 s | 52.4 s | 66.3 s | EP05 is the **longest** and held best: length is not the cause. |
| Cuts | 23 (one per 2.6 s) | 15 (3.5 s) | 19 (3.5 s) | EP02 cuts fastest and held worst: cut rate is not the cause. |
| Speech density | 11.7 Thai chars/s | 9.8 | 10.9 | Similar. |
| Frame 0 | onion on a board, cook's head cropped | boy and dog, wide park | girl small on a balcony, wide | All three are calm, everyday frames. EP05's is arguably the weakest. Frame 0 does not explain the gap. |
| Engine / look | painted 2D flat | painted 2D flat | painted 2D flat | Same look. |

## Swipe-away: the first 5 seconds, side by side

| | EP02 onion | EP03 dog | EP05 ant |
| --- | --- | --- | --- |
| Line 1 | 0.3 s "หัวหอมไม่ได้ทำให้คุณร้องไห้…" | 0.3 s "ลูกบอลสีแดง ที่คุณซื้อให้หมา…" | 0.2 s "ถ้าคุณตัวเล็กเท่ามด…" |
| Complete claim by | 3.9 s "…จนกว่าคุณจะทำร้ายมันก่อน" | ~5 s "ในสายตามัน อาจดูคล้ายหญ้า มากกว่าที่คุณคิด" | 4.6 s "ตกจากตึกสิบชั้น… คุณจะแทบไม่เป็นอะไรเลย" |
| What the viewer learns | "until you cut it": what everyone already knows. The twist resolves into a truism. | A hedged ("อาจ", "มากกว่าที่คุณคิด"), half-known fact ("dogs see colour differently"). | A claim most people believe is false, about their own body, with death as the stake. |
| Who it is for | anyone who cooks; low stakes (tears) | dog owners only | everyone (every viewer has a body and fears falling) |
| Picture at ~1.5–2 s | cut to the cook smiling with a knife | cut to a dog close-up | cut to a vertigo POV down a ten-storey facade: the stakes as a picture |
| Imagining needed | none | some (dog's view) | a "what if" the viewer runs in their head, with "คุณ" as the hero |

**Reading:** the gap is in **line 1–2 and the 1.4 s cut**, not frame 0. EP05 is the only hook that (a) is understood in one breath with no prior knowledge, (b) contradicts a belief people hold with certainty, (c) puts the viewer's own body at risk and (d) shows that risk as a picture within 1.5 s. EP02 opens a gap and closes it within 4 s with a truism; EP03 opens a soft, hedged gap for a niche audience.

## Hold: the body, as a map of open questions

An open question is something the viewer is waiting to learn. Seconds with no open question are where people leave.

| Video | Open questions in order | Longest stretch with no new question |
| --- | --- | --- |
| EP05 | fall → "แทบไม่เป็นอะไร?" (1.5–17 s) → "แต่ข้างล่าง… หยดน้ำค้าง" (20.5) → stuck (23.5) → "ศัตรูต่อไปคือความหนาว" (34.3) → hunger (41.6) → ant carries a load (46.1) → "แล้วคุณล่ะ…" (54.9) → flip (55.9) | ~3 s: each answer opens the next problem in the same breath ("แต่…", "ศัตรูต่อไป…") |
| EP02 | "why?" (0–9.6 s) → mechanism block 11–28 s (cell, enzyme, sulphur compound, gas, nerve endings, cornea: **6 terms in 17 s**, cook off screen in 3 shots) → "แล้วเคล็ดลับ?" (29.3) → tip list with weak answers ("ผลยังไม่ตรงกัน", "หลักฐานยังไม่ชัด") → simile ending | ~17 s (11–28 s), the reported sharpest drop is at ~15 s |
| EP03 | "why grass?" (0–5 s) → owner shouts (5.5–12) → explanation 12.8–35 s (red/green, blue/yellow, cone types, "not black and white") → nose finds it (35.6) → blue ball → call to action | ~20 s of explanation after the only question is answered at ~16 s |

Other differences in the body (frame sheets):

| | EP02 | EP03 | EP05 |
| --- | --- | --- | --- |
| Places | kitchen (≈18 of 23 shots from similar counter angles), cell diagram, eye close-up, fridge | one park, plus its desaturated "dog view" | balcony, facade, air, grass floor, giant dewdrop, cold shade, bread, ant: a new world every ~10 s |
| Stakes | tears | a toy | falling, drowning, freezing, starving |
| Viewer's role | watches a cook ("คุณ" ×3) | dog owner ("คุณ" ×2) | is the hero ("คุณ" ×5; the girl is the stand-in) |
| Terms | 7 distinct, packed in one block | 2 | 1 real term (แรงตึงผิวน้ำ), only after she is stuck |
| Ending | simile, calm | "ครั้งหน้าที่ซื้อของเล่น ลองถามตัวเองว่า…" (a call to action that releases the viewer) | the rule flips: weakness becomes strength, best moment last |

## Ranked answer: what made EP05 sticky

1. **The hook leaves a question the viewer cannot answer but feels close to (swipe-away).** "ถ้าคุณตัวเล็กเท่ามด… ตกจากตึกสิบชั้น… แทบไม่เป็นอะไร" contradicts a certainty, about a scene anyone can picture, shown as a vertigo picture at 1.4 s; then the smart objection is answered at 4.6 s, so the gap stays open and fair. EP02's gap closes into a truism by 3.9 s; EP03's is hedged and half-known. Lab evidence: a salient, near-answerable question plus a violated expectation makes people wait for the answer (SRC13, SRC15–SRC17); surprise keeps people from zapping ads (SRC19). Confidence: medium (the only metric that differs in the first seconds fits it; n = 3; untested on Shorts).
2. **A survival game, never a lecture (hold).** One problem → answer → "แต่…" next problem, every ~10 s, with no stretch over ~3 s without an open question. EP02's 17 s term block and EP03's 20 s explanation tail are exactly where the others lose people. Jargon lowers interest even when it is defined (SRC30, SRC31); concrete wording predicts interest and recall (SRC36). Confidence: medium (EP02's reported drop sits inside its block; EP05's curve is still missing).
3. **The scene is easy to picture, and the stakes are physical.** Everyone can run "me, tiny, falling" in their head; a toy or onion tears carry less. Not because of "คุณ": all three hooks say it, and second-person wording did not predict headline clicks (SRC22). Not fear either: fear words lowered clicks (SRC21), and EP05's claim is a reassuring surprise about a feared situation. Imagining yourself in an easy scene does raise engagement (SRC25), and hard-to-picture scenes backfire (SRC26). Confidence: medium-low.
4. **Every chapter is a new world to look at.** Scale is the spectacle (grass as a forest, a drop as a boulder); the others repeat one set. Confidence: medium-low (the picture alone did not save EP02, which has more cuts).
5. **The best moment is last.** The flip at 54–60 s pulls people to the end; the others wind down to tips or a call to action. Confidence: medium-low.

Not the cause (measured): voice, length, cut rate, speech speed, frame 0, art style.

## Confounders

- **Topic demand:** "what if you were tiny" is a proven genre; the feed already has an audience for it.
- **Post age and channel momentum:** EP05 was reported one day after posting; EP02/EP03 earlier. Swipe rate is fairly stable over time, views are not.
- **Feed sample:** new Shorts go to a small seed audience first, then reach grows or tapers (SRC07). Swipe rate is measured on whoever was shown it, so EP05 holding 20 % at 24k views is not a like-for-like comparison with 1.3k. YouTube has never said how much swipe rate weighs in ranking (SRC05–SRC09).
- **Views are not engaged views:** public views count every start, including swipes and replays (SRC03, SRC04); compare engaged views.
- **% watched excludes swipers and may include loops:** average percentage viewed is computed only over engaged views (SRC01). EP05's ~91 % may contain replays.

## What would test it (next episodes)

| ID | Test | Measure |
| --- | --- | --- |
| DD01 | Next hook: write two versions, one EP05-style ("ถ้าคุณ…" + certainty-breaking claim + body stakes + stakes picture by 1.5 s) and keep the other as the control in the script notes; post the EP05-style one. | swiped away < 25 %? |
| DD02 | Open-question map in every script pack: list each open question with its start/end time; no gap > ~5 s; no explanation block > ~6 s without the character in trouble on screen. | retention curve: no drop inside blocks |
| DD03 | No list of tips or "evidence unclear" items in the body: an unclear item is cut, not narrated (Boat keeps accuracy by omission). | % watched in the second half |
| DD04 | End on the flip or the strongest picture, never a call to action. | end-of-video retention, replays |
| DD05 | From YouTube Studio for EP02, EP03 and EP05: engaged views, the 0–3 s retention curve, traffic sources (Shorts feed vs search) and audience geography. | where EP05 dips; whether audiences differ |

DD01–DD04 overlap ER01–ER04 and ER05; they are recorded here as tests, not new rules (DP01).

<a id="outside-evidence"></a>
## Outside evidence

Full registry and findings: [retention-sources.md](retention-sources.md) (SRC01–SRC42). What it changes here:

- **What the metric is:** "Viewed vs swiped away" = staying "past the initial seconds of a Short"; no threshold is published (SRC01, SRC02). Seconds 0–3 matter most, but no exact cut-off is known.
- **Well supported (lab):** a salient, near-answerable question and a violated expectation increase waiting and information seeking (SRC13, SRC15–SRC17); jargon and abstraction lower interest and fluency (SRC30–SRC33, SRC36).
- **Weaker than expected:** "คุณ" framing (SRC22) and fear wording (SRC21) do not by themselves raise attention; survival framing helps memory, not attention (SRC29).
- **Ad research (vendor, low-medium):** two or more shots in the first 5 s and faces early (SRC38). EP05 has three shots by 4.6 s (EP02 three, EP03 two by 5 s); its first face is small.
- **Not tested on Shorts:** every mechanism above; treat the ranking as hypotheses for DD01–DD05.
