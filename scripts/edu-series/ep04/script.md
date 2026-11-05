# EDU-EP04-SHORT — ทำไมแถวข้าง ๆ เร็วกว่าเสมอ (why the next queue always seems faster)

- Deliverable: `EDU-EP04-SHORT`; task file [task.md](task.md); series concepts [../concepts.md](../concepts.md) C4.
- Script revision: **EDU-EP04-SCRIPT-R1.3** (Preaw, 2026-11-05): closed ending instead of the loop, on the coordinator's brief (the R1.2 loop line L19 handed back to the hook; drop it). Target ~55 s video at 1.00x. R1.2 text is kept below in [R1.2 (superseded)](#r12-superseded); R1.1 below that in [R1.1 (superseded)](#r11-superseded).
- Inputs: R1.2 (user-approved W1.5, 2026-11-05); fact-check [fact-check.md](fact-check.md) (R1.1 verdicts + R1.2 re-check); research [research.md](research.md) W1.1; measure [voice-measure.md](voice-measure.md) (Kore take 2).
- Story mode: educational explainer on a real everyday phenomenon, acted by fictional 4-head characters. Every switch, price check and slow line is **dramatization**, not a test result. The top-down diagram is a **model drawing** (O5).
- Profile: educational (psychology: perception and memory, with simple probability), painted 2D, 4-head cast, Thai Short 1080×1920 30 fps, ending **`A_fade`** (was `B_loop`).
- Voices: narrator NAR = Gemini TTS Kore (locked, take 2); MAN has three short lines; CSH has one (speaker-neutral wording). MAN/CSH voices not chosen.
- Target ~55 s (user). **Timing: estimated** (N1). R1.3 is not read aloud or audio-tested.
- Status: draft for Boat recheck (N4). Not user-approved.

## Changes R1.2 → R1.3

- **cut L19** "แต่พอเจอร้านที่มีหลายแถว…" (loop hand-off) and its picture (NEW CUSTOMER eyeing a three-lane shop). Clue **CL03 retired** (ID not reused).
- **add L20** (NAR, closing) "ไม่ต้องเปลี่ยนแถวอีกแล้ว… แค่รอให้ถึงคิวของเรา". Restates the single-queue mechanism already spoken in L17 (F014: one line, next free till calls the next person); answers the hook's "เปลี่ยนแถว" as a bookend, not a hand-back. No new claim, no wait-time claim. Then hold ~2.5 s on MAN, fade.
- **add L10a** (NAR) "นี่แค่แบบจำลองง่าย ๆ นะ… ของจริงไม่ได้เท่ากันเป๊ะ": the R1.1 model caveat (old L13, cut in R1.2), restored word for word with its R1.1 fact-check verdict (pass, F002 limits). Uses the freed time; makes the CL01 price-check payoff spoken again.
- Ending `B_loop` → `A_fade`. B06 sound changed from "bouncy muzak creeps back" to a resolve and fade.
- Kept unchanged: L01–L18 and L18a wording; IDs, beats B01–B06, CL01, CL02.
- Net: −8 + 15 + 13 = **+20 NAR syllables, ~+4.6 s** (N1).

## Story core

- **Logline:** a man switches queues twice and lands in the slow one each time. A top-down model shows the odds were against him from the start; attention and memory make it feel worse than it is; a single shared queue takes the choice away, and he finally relaxes.
- **Central question:** why does the next queue always seem faster, and why does switching seem to backfire?
- **Intention / obstacle:** he wants the fastest till; chance, his own eyes and his memory work against him.
- **Feeling:** recognition and laughs at the switching, a small "aha" at the 1/3, a calm, settled close. [R1.3]
- **Takeaway:** with three alike lines, yours wins only about one time in three (a simple model; real lines are not exactly equal), so some other line usually wins; we tend to notice being overtaken and remember the bad waits; many places use one shared line, which feels fairer, and there is no line to switch to.

## Truth and ending

- **Supported (spoken):** 1/3 under identical-lines assumptions (F002, model) with its limits spoken (L10a); switching to an alike line gains nothing in expectation (F003); bad events stick more (F007, general principle); multiple lines feel less fair (F012); some places use a single line (F014, no brand); L20 restates F014's mechanism.
- **Illustrated only:** switching often no gain (F001, silent gag + L05).
- **Kept as hypothesis in VO:** attention asymmetry (F005) under "มีคนอธิบายว่า… มัก…" (L12–L14); "I'm always unlucky" from memory (F009) as "อาจไม่ใช่" (L16).
- **Dropped:** as R1.2 (10%/67%, peak-end, lower mean wait, lower variance, "always better", ALT-A slips = skips, injustice cause old L18, comparative good-days old L20), plus the loop line R1.2 L19.
- **Twist logic:** the reversal is "it isn't (only) bad luck": L06 turns the comedy into a question; L07–L10 answer it with a fair model the viewer can check (three lanes, one wins), stated as conditional ("ถ้า…") and labelled "แบบจำลอง" on screen; L10a admits real lines differ, which the price-check gag (CL01) already showed; L11 turns from odds to feeling.
- **Ending `A_fade`:** L20 "ไม่ต้องเปลี่ยนแถวอีกแล้ว… แค่รอให้ถึงคิวของเรา" closes the idea. It mirrors the hook L01 "คุณเปลี่ยนแถวกี่ครั้ง…" as an answer (bookend), with no hand-back. After L20: hold ~2.5 s on MAN at the till, calm, no speech, then fade (EP02 convention).

## Beat list (estimated video time; story time = one shopping trip, a few minutes)

| Beat | Lines | Est. time | Purpose / causal link |
| --- | --- | --- | --- |
| `EDU-EP04-S01-B01` | L01–L02 | 0.0–3.2 | Hook: the switch always backfires |
| `EDU-EP04-S01-B02` | L03–L06 (+gag) | 3.2–10.0 | Switch, price check, switch again, coins; turn: "not just bad luck" |
| `EDU-EP04-S01-B03` | L07–L10a | 10.0–24.3 | Top-down model: 3 lanes, 1/3; switching to an alike lane re-rolls the same odds; model caveat (CL01 payoff) [R1.3] |
| `EDU-EP04-S01-B04` | L11–L14 | 24.3–34.6 | Attention: overtakes against you get counted (framed hypothesis) |
| `EDU-EP04-S01-B05` | L15–L16 | 34.6–42.1 | Memory: the slow days stick (framed) |
| `EDU-EP04-S01-B06` | L17–L18a, L20 (+hold) | 42.1–53.0 (+~2.5 hold, ~55.5 end) | One shared line, fairness, calm man; closing line; hold and fade [R1.3] |

## Full spoken script

`…` = short breath pause. Thai text is the TTS text; subtitles = VO unless noted. Silent gags carry no line.

| ID | Spk | Thai (VO / dialogue) | Shot cue (picture) | Note |
| --- | --- | --- | --- | --- |
| L01 | NAR | คุณเปลี่ยนแถวกี่ครั้ง… | Bright supermarket, three tills. MAN in line 2, basket in hand, eyes darting to line 1. | frame: hook (address); seam note removed [R1.3] |
| L02 | NAR | แถวที่คุณย้ายไปก็ช้าทุกที | MAN's face, already suspicious. Title card "ทำไมแถวข้าง ๆ เร็วกว่าเสมอ" (Film's call). | frame: perception, posed as the question |
| L03 | MAN | แถวนั้นไปเร็วกว่า… | Line 1 shuffles forward; MAN slides across into line 1. | dramatization |
| L04 | CSH | เช็กราคาแป๊บนึงนะ | Line 1 cashier holds up an item, lifts the price-check sign; line 1 freezes. Line 2 (his old line) flies past. **CL01** | dramatization |
| — | — | (no line, ~1.5 s) | Silent gag: MAN switches to line 3; the customer at its till starts paying in coins, one by one. Line 1 now moves. | dramatization |
| L05 | MAN | อ้าว… | MAN's slow turn to camera, sulking; both other lines move behind him. | dramatization |
| L06 | NAR | ไม่ใช่แค่คุณซวยหรอก | Freeze on MAN mid-sulk; camera starts to rise. | fact: F002/F003 (odds, not luck); paid off L07–L10a |
| L07 | NAR | ถ้าทุกแถวเหมือนกันหมด… | Crossfade (side to top-down, per Film note) into painted diagram: three lanes of dots locked to the till positions, all equal: same dot count, same till icon. On-screen: "ถ้าทุกแถวเท่ากัน". | fact: F002 assumption (O1) |
| L08 | NAR | โอกาสที่แถวของคุณจะเร็วที่สุด… มีแค่หนึ่งในสาม | One lane lights as "คุณ"; a big "1/3" with the label "แบบจำลอง". | fact: F002 (model, labelled) |
| L09 | NAR | อีกสองในสาม… จะมีสักแถวที่เร็วกว่า | The other two lanes glow together, "2/3" on the same labelled screen ("แบบจำลอง"). | fact: F002 ("some other line") |
| L10 | NAR | ถ้าแถวพอ ๆ กัน ย้ายไปก็แค่ลุ้นใหม่… ด้วยโอกาสเท่าเดิม | MAN's dot hops lanes; the "1/3 · แบบจำลอง" follows him unchanged. | fact: F003 (alike lines, no extra info) |
| L10a | NAR | นี่แค่แบบจำลองง่าย ๆ นะ… ของจริงไม่ได้เท่ากันเป๊ะ | Diagram flickers real-world variance: one big trolley icon, the price-check sign from CL01 in line 1. "แบบจำลอง" label stays. Must not imply a measurement. | frame: model caveat (F002 limits); restored R1.1 L13 verbatim, R1.1 verdict pass [R1.3] |
| L11 | NAR | แต่ทำไมมันรู้สึกเหมือนแพ้ทุกที | Back to side view at the tills. MAN in line, neck craned at the others. | frame: question |
| L12 | NAR | มีคนอธิบายว่า… ตอนรอ เรามักจ้องแถวอื่น | MAN's eyes track the next lane. **CL02** | frame: hypothesis (F005, O2) |
| L13 | NAR | ใครแซงเราไป… เรามักนับไว้เป็นพิเศษ | Each overtaker in the next lane gets a red tally mark over MAN's head. | frame: hypothesis (F005) |
| L14 | NAR | แต่ตอนเราแซงคนอื่น… มักไม่ทันสังเกต | His own lane moves past someone; no tally, he doesn't look. | frame: hypothesis (F005) |
| L15 | NAR | ความจำก็ช่วยซ้ำเติม… วันที่รอจนหัวร้อน มักติดอยู่ในความจำ | Thought-bubble montage: a long wait drawn in hot red, sharp; a smooth checkout beside it in pale, fading colour (picture only, no caption). | fact: F007 (bad events stick; general principle, not a queue study) |
| L16 | NAR | คำว่า "ฉันซวยตลอด" เลยฟังดูจริง… ทั้งที่อาจไม่ใช่ | The words "ซวยตลอด" stamp over MAN, then crack. | frame: hypothesis (F009) |
| L17 | NAR | หลายที่ใช้แถวเดียว… ช่องไหนว่าง ก็เรียกคนถัดไป | One rope-lined queue feeding all three tills; a till light calls "next". MAN at its head. | fact: F014 (no brand, no country) |
| L18 | NAR | ไม่มีแถวข้าง ๆ ให้อิจฉา… หลายคนรู้สึกว่ายุติธรรมกว่า | MAN calm, eyes closed. | fact: F012 (feels fairer; no wait-time claim) |
| L18a | MAN | …สบายจัง | Soft sigh as a till calls him. | dramatization |
| L20 | NAR | ไม่ต้องเปลี่ยนแถวอีกแล้ว… แค่รอให้ถึงคิวของเรา | MAN walks to the free till, unhurried, sets his basket down; the cashier smiles. Final frame: MAN at the till, relaxed, shared queue behind him. Hold ~2.5 s (no speech), then fade to black. | fact: restates F014 mechanism (L17), no wait-time claim; closing, bookends L01 [R1.3] |
| — | — | *(cut L19: loop hand-off "แต่พอเจอร้านที่มีหลายแถว…" and NEW CUSTOMER; CL03 retired)* | — | [R1.3] |

Subtitle differences: none. On-screen text: "ถ้าทุกแถวเท่ากัน" (L07), "1/3 · แบบจำลอง" (L08, L10), "2/3" on the same labelled screen (L09), "แบบจำลอง" label kept through L10a, "ซวยตลอด" (L16); title per Film. No end card text required (Film's call; channel mark per project default).

## Sound intent (English notes; narration unchanged)

| Beat | Sound |
| --- | --- |
| B01 | Light, bouncy supermarket muzak at low level, till beeps; tiny riser under L02. |
| B02 | Muzak continues; quick whoosh on each switch; a hard stop (record scratch or price-scanner error beep) on L04's freeze; coin clinks one by one in the silent gag; a sad-trombone sting on L05; muzak cuts to silence on the L06 freeze. |
| B03 | Airy pad as the camera rises, soft plucks as lanes appear; a clean chime on "1/3" (L08); a small "boing" on the lane hop (L10); a light wobble/glitch tick as the trolley and price-check icons flicker in on L10a [R1.3]. Illustration only, asserts nothing. |
| B04 | Muzak back but slightly detuned; a tick per tally mark (L13); silence on the no-tally overtake (L14) so the absence reads. |
| B05 | Muffled, warm-blurry tone for memory; a sharp hit on the red memory, a soft fade on the pale one; a crack on "ซวยตลอด" (L16). |
| B06 | Muzak resolves to a calm, warm, slower version; one gentle till "ding" calling MAN (L18a); under L20 the music settles on a soft resolving chord; during the ~2.5 s hold the chord rings out and fades with the picture to silence. No stinger, no muzak return [R1.3]. |

## Clue ledger (fictional dramatization, not evidence)

| ID | Plant | Observable | First read | Payoff |
| --- | --- | --- | --- | --- |
| CL01 | L04 | Price-check sign stops line 1 | Bad luck | L10a: the sign reappears in the diagram; real lines are not exactly equal (model caveat) [R1.3] |
| CL02 | L12 | MAN watches the other lanes, not his own | Impatience | L13–L14: why overtakes feel one-sided |
| CL03 | — | *(retired in R1.3 with the loop line L19)* | — | — |

## Notes

- **N1 Timing (estimated):** rate taken from the locked Kore take 2 read of the 16 R1.2 NAR lines: ~184 NAR syllables (my count) in 39.76 s speech (~4.6 syl/s) and 42.0 s with gaps, i.e. **~0.228 s per syllable including gaps**. Caution: the "~46.0 s video" in voice-measure.md covers NAR only; MAN/CSH lines (L03, L04, L05, L18a, ~15 syllables) were not in that read, ~4.5 s with gaps, so R1.2's full video was nearer **~50.5 s**. R1.3: NAR 184 − 8 (L19) + 15 (L10a) + 13 (L20) = **~204 syllables ≈ 46.5 s**; + MAN/CSH ~4.5 s + silent gag ~1.5 s + end hold ~2.5 s ≈ **~55 s video at 1.00x** (budget 55 s; range ~54–56 s). Needs new Kore reads of L10a and L20 and a full measured cut.
- **N2 Claims used as fact:** F002 (L07–L09, labelled model; limits in L10a), F003 (L06, L10), F007 (L15, general principle), F012 (L18), F014 (L17; mechanism restated in L20). F001 illustrated only.
- **N3 Hypothesis framing:** F005 (L12–L14, "มีคนอธิบายว่า", "มัก"); F009 (L16, "อาจไม่ใช่"). Not used: F001 (spoken), F004, F006, F008, F010, F011, F013, SRC001 injustice argument, any SRC003 percentage.
- **N4 Boat recheck, priority:** (a) L20 "ไม่ต้องเปลี่ยนแถวอีกแล้ว… แค่รอให้ถึงคิวของเรา": confirm it reads as a description of the single-queue setup (one line, so nothing to switch to) and not as a promise of a shorter or guaranteed wait (no F010/F011 claim) or "single queue is always better" (F013). (b) L10a restored verbatim from R1.1 L13 (R1.1 verdict pass); confirm it still sits right after L10 and that the trolley/price-check flicker picture implies no measurement. (c) Removal of L19/CL03: no fact impact expected.
- **N5 Voice and edit impact:** the locked Kore take 2 WAV contains R1.2 L19; the edit drops it. L10a and L20 need new Kore lines with the same style prompt (2 short reads, or one request with both) matched to take 2's tone and level. MAN/CSH voices still open.
- **N6 Film:** the rise is a crossfade, not a true overhead; "1/3" and "2/3" show or share the "แบบจำลอง" label every time; L10a brings back the trolley and CL01 price-check sign in the diagram; the B06 final frame is a clean end (MAN at the till, calm), held ~2.5 s then faded, no new character.
- **Open questions:** CSH voice gender (wording neutral); whether the single-queue set in B06 is the same store refitted or a different shop (Film's call).

## R1.2 (superseded)

Kept unchanged for review of the R1.3 ending change; headings demoted. Its link to "R1.1 (superseded)" points to the section below.

### EDU-EP04-SHORT — ทำไมแถวข้าง ๆ เร็วกว่าเสมอ (why the next queue always seems faster)

- Deliverable: `EDU-EP04-SHORT`; task file [task.md](task.md); series concepts [../concepts.md](../concepts.md) C4.
- Script revision: **EDU-EP04-SCRIPT-R1.2** (Preaw, 2026-11-05): length trim of the user-approved R1.1 after the W1.4 measured read ([voice-measure.md](voice-measure.md): ~64 s speech at 0.28 s gaps, ~68 s video, target 40–60 s; user chose ~55 s). Whole lines cut only; no line reworded, no claim added. Every kept line keeps its R1.1 wording. R1.1 text is kept below in [R1.1 (superseded)](#r11-superseded).
- Inputs: R1.1 (approved by the user, W1.5); fact-check [fact-check.md](fact-check.md) (R1.1); research [research.md](research.md) W1.1; measure [narration-measure.json](narration-measure.json).
- Story mode: educational explainer on a real everyday phenomenon, acted by fictional 4-head characters. Every switch, price check and slow line is **dramatization**, not a test result. The top-down diagram is a **model drawing** (O5).
- Profile: educational (psychology: perception and memory, with simple probability), painted 2D, 4-head cast, Thai Short 1080×1920 30 fps, ending `B_loop`.
- Voices (concept): dry, knowing male narrator (NAR); the man (MAN) has three short lines; the cashier (CSH) has one. Speaker-neutral wording for CSH.
- Target ~55 s (user). **Timing: estimated** from the R1.1 measured read (see N1). R1.2 itself is not read aloud or audio-tested.
- Status: draft for Boat recheck of the cuts (N4). Not user-approved.

### Cuts R1.1 → R1.2

- cut L06: the silent gag plus MAN's "อ้าว…" already show the second switch backfiring; saves ~1.9 s. F001 no longer spoken (illustrated only).
- cut L08: the crossfade to top-down shows "from above, three lanes"; L09's assumption line opens the model. Saves ~2.1 s.
- cut L13: spoken model caveat; the assumption stays spoken in L09 ("ถ้าทุกแถวเหมือนกันหมด") and L12 ("ถ้าแถวพอ ๆ กัน"), and "แบบจำลอง" stays on screen with every 1/3 and 2/3. Saves ~3.5 s. **Boat to confirm (N4a).**
- cut L18: the "why" behind the overtake asymmetry (injustice); L15's "มีคนอธิบายว่า" and the "มัก" lines still carry the hypothesis. Saves ~3.0 s.
- cut L20: the comparative "good days stick less"; L19 alone carries F007 (bad waits tend to stick). Saves ~3.1 s.
- Merged: none. Total saved ~13.7 s (method in N1).

### Story core

- **Logline:** a man switches queues twice and lands in the slow one each time. A top-down model shows the odds were against him from the start; attention and memory make it feel worse than it is; a single shared queue takes the choice away, and he finally relaxes.
- **Central question:** why does the next queue always seem faster, and why does switching seem to backfire?
- **Intention / obstacle:** he wants the fastest till; chance, his own eyes and his memory work against him.
- **Feeling:** recognition and laughs at the switching, a small "aha" at the 1/3, a calm payoff, a knowing smile at the loop.
- **Takeaway:** with three alike lines, yours wins only about one time in three (a simple model), so some other line usually wins; we tend to notice being overtaken and remember the bad waits; many places use one shared line, which feels fairer.

### Truth and ending

- **Supported (spoken):** 1/3 under identical-lines assumptions (F002, model); switching to an alike line gains nothing in expectation (F003); bad events stick more (F007, general principle); multiple lines feel less fair (F012); some places use a single line (F014, no brand).
- **Illustrated only after the trim:** switching often no gain (F001, silent gag + L05); real lines are not exactly equal (picture only, see N5).
- **Kept as hypothesis in VO:** attention asymmetry (F005) under "มีคนอธิบายว่า… มัก…" (L12–L14); "I'm always unlucky" from memory (F009) as "อาจไม่ใช่" (L16).
- **Dropped:** as R1.1 (10%/67%, peak-end, lower mean wait, lower variance, "always better", ALT-A slips = skips), plus the spoken caveat (old L13), the injustice cause (old L18, SRC001) and the comparative good-days line (old L20).
- **Twist logic:** the reversal is "it isn't (only) bad luck": L06 turns the comedy into a question; L07–L10 answer it with a fair model the viewer can check (three lanes, one wins), stated as conditional ("ถ้า…") and labelled "แบบจำลอง" on screen; L11 turns from odds to feeling.
- **Ending `B_loop`:** L19 "แต่พอเจอร้านที่มีหลายแถว…" hands straight back to the hook L01 "คุณเปลี่ยนแถวกี่ครั้ง…". After L19: hold ~2.5 s on the new customer eyeing a three-lane shop across the way (no speech in the last ~0.5 s), then the shared loop seam to the L01 frame.

### Beat list (estimated video time; story time = one shopping trip, a few minutes)

| Beat | Lines | Est. time | Purpose / causal link |
| --- | --- | --- | --- |
| `EDU-EP04-S01-B01` | L01–L02 | 0.0–3.6 | Hook: the switch always backfires |
| `EDU-EP04-S01-B02` | L03–L06 (+gag) | 3.6–10.0 | Switch, price check, switch again, coins; turn: "not just bad luck" |
| `EDU-EP04-S01-B03` | L07–L10 | 10.0–22.0 | Top-down model: 3 lanes, 1/3; switching to an alike lane re-rolls the same odds |
| `EDU-EP04-S01-B04` | L11–L14 | 22.0–33.4 | Attention: overtakes against you get counted (framed hypothesis) |
| `EDU-EP04-S01-B05` | L15–L16 | 33.4–41.5 | Memory: the slow days stick (framed) |
| `EDU-EP04-S01-B06` | L17–L19 (+hold) | 41.5–51.8 (+~2.5 hold, ~54.3 end) | One shared line, fairness, calm man; new customer's glance loops to L01 |

### Full spoken script

`…` = short breath pause. Thai text is the TTS text; subtitles = VO unless noted. Silent gags carry no line. "R1.1 ID" maps to the superseded table.

| ID | R1.1 ID | Spk | Thai (VO / dialogue) | Shot cue (picture) | Note |
| --- | --- | --- | --- | --- | --- |
| L01 | L01 | NAR | คุณเปลี่ยนแถวกี่ครั้ง… | Bright supermarket, three tills. MAN in line 2, basket in hand, eyes darting to line 1. Loop seam lands here. | frame: hook (address) |
| L02 | L02 | NAR | แถวที่คุณย้ายไปก็ช้าทุกที | MAN's face, already suspicious. Title card "ทำไมแถวข้าง ๆ เร็วกว่าเสมอ" (Film's call). | frame: perception, posed as the question |
| L03 | L03 | MAN | แถวนั้นไปเร็วกว่า… | Line 1 shuffles forward; MAN slides across into line 1. | dramatization |
| L04 | L04 | CSH | เช็กราคาแป๊บนึงนะ | Line 1 cashier holds up an item, lifts the price-check sign; line 1 freezes. Line 2 (his old line) flies past. **CL01** | dramatization |
| — | — | — | (no line, ~1.5 s) | Silent gag: MAN switches to line 3; the customer at its till starts paying in coins, one by one. Line 1 now moves. | dramatization |
| L05 | L05 | MAN | อ้าว… | MAN's slow turn to camera, sulking; both other lines move behind him (carries cut L06's picture). | dramatization |
| — | L06 | — | *(cut L06: picture already shows the second switch failing)* | — | — |
| L06 | L07 | NAR | ไม่ใช่แค่คุณซวยหรอก | Freeze on MAN mid-sulk; camera starts to rise. | fact: F002/F003 (odds, not luck); paid off L07–L10 [R1.1] |
| — | L08 | — | *(cut L08: the crossfade shows "from above, three lanes")* | — | — |
| L07 | L09 | NAR | ถ้าทุกแถวเหมือนกันหมด… | Crossfade (side to top-down, per Film note) into painted diagram: three lanes of dots locked to the till positions, all equal: same dot count, same till icon. On-screen: "ถ้าทุกแถวเท่ากัน". | fact: F002 assumption (O1) |
| L08 | L10 | NAR | โอกาสที่แถวของคุณจะเร็วที่สุด… มีแค่หนึ่งในสาม | One lane lights as "คุณ"; a big "1/3" with the label "แบบจำลอง". | fact: F002 (model, labelled) |
| L09 | L11 | NAR | อีกสองในสาม… จะมีสักแถวที่เร็วกว่า | The other two lanes glow together, "2/3" on the same labelled screen. | fact: F002 ("some other line") |
| L10 | L12 | NAR | ถ้าแถวพอ ๆ กัน ย้ายไปก็แค่ลุ้นใหม่… ด้วยโอกาสเท่าเดิม | MAN's dot hops lanes; the "1/3 · แบบจำลอง" follows him unchanged. | fact: F003 (alike lines, no extra info) |
| — | L13 | — | *(cut L13: spoken caveat; assumption stays in L07/L10 and the on-screen label)* | — | — |
| L11 | L14 | NAR | แต่ทำไมมันรู้สึกเหมือนแพ้ทุกที | Back to side view at the tills. MAN in line, neck craned at the others. | frame: question |
| L12 | L15 | NAR | มีคนอธิบายว่า… ตอนรอ เรามักจ้องแถวอื่น | MAN's eyes track the next lane. **CL02** | frame: hypothesis (F005, O2) [R1.1] |
| L13 | L16 | NAR | ใครแซงเราไป… เรามักนับไว้เป็นพิเศษ | Each overtaker in the next lane gets a red tally mark over MAN's head. | frame: hypothesis (F005) [R1.1] |
| L14 | L17 | NAR | แต่ตอนเราแซงคนอื่น… มักไม่ทันสังเกต | His own lane moves past someone; no tally, he doesn't look. | frame: hypothesis (F005) [R1.1] |
| — | L18 | — | *(cut L18: injustice cause; hypothesis stays framed by L12)* | — | — |
| L15 | L19 | NAR | ความจำก็ช่วยซ้ำเติม… วันที่รอจนหัวร้อน มักติดอยู่ในความจำ | Thought-bubble montage: a long wait drawn in hot red, sharp; a smooth checkout beside it in pale, fading colour (picture only). | fact: F007 (bad events stick; general principle, not a queue study) [R1.1] |
| — | L20 | — | *(cut L20: comparative line; L15 carries F007)* | — | — |
| L16 | L21 | NAR | คำว่า "ฉันซวยตลอด" เลยฟังดูจริง… ทั้งที่อาจไม่ใช่ | The words "ซวยตลอด" stamp over MAN, then crack. | frame: hypothesis (F009) |
| L17 | L22 | NAR | หลายที่ใช้แถวเดียว… ช่องไหนว่าง ก็เรียกคนถัดไป | One rope-lined queue feeding all three tills; a till light calls "next". MAN at its head. | fact: F014 (no brand, no country) [R1.1] |
| L18 | L23 | NAR | ไม่มีแถวข้าง ๆ ให้อิจฉา… หลายคนรู้สึกว่ายุติธรรมกว่า | MAN calm, eyes closed. | fact: F012 (feels fairer; no wait-time claim) [R1.1] |
| L18a | L23a | MAN | …สบายจัง | Soft sigh as a till calls him. | dramatization |
| L19 | L24 | NAR | แต่พอเจอร้านที่มีหลายแถว… | Behind MAN, a NEW CUSTOMER glances through the window at a three-lane shop across the way; her eyes dart. **CL03**. Hold ~2.5 s, no speech in the last ~0.5 s, loop seam to L01. | frame: loop hand-off |

Subtitle differences: none. On-screen text: "ถ้าทุกแถวเท่ากัน" (L07), "1/3 · แบบจำลอง" (L08, L10), "2/3" on the same labelled screen (L09), "ซวยตลอด" (L16); title per Film.

#### Old → new ID mapping

L01→L01, L02→L02, L03→L03, L04→L04, L05→L05, L06 cut, L07→L06, L08 cut, L09→L07, L10→L08, L11→L09, L12→L10, L13 cut, L14→L11, L15→L12, L16→L13, L17→L14, L18 cut, L19→L15, L20 cut, L21→L16, L22→L17, L23→L18, L23a→L18a, L24→L19. Beat IDs B01–B06 and clue IDs CL01–CL03 unchanged.

### Sound intent (English notes; narration unchanged)

| Beat | Sound |
| --- | --- |
| B01 | Light, bouncy supermarket muzak at low level, till beeps; tiny riser under L02. |
| B02 | Muzak continues; quick whoosh on each switch; a hard stop (record scratch or price-scanner error beep) on L04's freeze; coin clinks one by one in the silent gag; a sad-trombone sting on L05; muzak cuts to silence on the L06 freeze. |
| B03 | Airy pad as the camera rises, soft plucks as lanes appear; a clean chime on "1/3" (L08); a small "boing" on the lane hop (L10). Illustration only, asserts nothing. |
| B04 | Muzak back but slightly detuned; a tick per tally mark (L13); silence on the no-tally overtake (L14) so the absence reads. |
| B05 | Muffled, warm-blurry tone for memory; a sharp hit on the red memory, a soft fade on the pale one; a crack on "ซวยตลอด" (L16). |
| B06 | Muzak resolves to a calm, warm version; one gentle till "ding" calling MAN; on L19 the original bouncy muzak creeps back under the new customer's glance into the loop seam. |

### Clue ledger (fictional dramatization, not evidence)

| ID | Plant | Observable | First read | Payoff |
| --- | --- | --- | --- | --- |
| CL01 | L04 | Price-check sign stops line 1 | Bad luck | L06–L10: the odds model; spoken caveat cut, so the "real lines differ" payoff is picture-only if Film keeps the sign flicker in the diagram (N5) |
| CL02 | L12 | MAN watches the other lanes, not his own | Impatience | L13–L14: why overtakes feel one-sided |
| CL03 | L19 | New customer eyeing a multi-lane shop | Throwaway gag | Loops to L01; the cycle restarts |

### Notes

- **N1 Timing (estimated, scaled from the measured R1.1 read):** R1.1 measured ~50.5 s of speech without pauses for ~254 syllables (~5.0 syl/s, Charon provisional, 1.00x) and ~64.0 s with 48 gaps at 0.28 s. Each cut line was costed at the same rate: syllables / 5.0 + 0.28 s per pause it carried (line end + each `…`). Cuts: L06 ~1.9 s, L08 ~2.1 s, L13 ~3.5 s, L18 ~3.0 s, L20 ~3.1 s = ~13.7 s. R1.2 ≈ **~50.3 s speech** (~199 syllables) + ~1.5 s silent gag + ~2.5 s end hold ≈ **~54 s video** at 1.00x, ~52 s at atempo 1.05. Needs a new measured read.
- **N2 Claims used as fact:** F002 (L07–L09, labelled model), F003 (L06, L10), F007 (L15, general principle), F012 (L18), F014 (L17). F001 now illustrated only.
- **N3 Hypothesis framing:** F005 (L12–L14, "มีคนอธิบายว่า", "มัก"); F009 (L16, "อาจไม่ใช่"). Not used: F001 (spoken), F004, F006, F008, F010, F011, F013, SRC001 injustice argument, any SRC003 percentage.
- **N4 Boat recheck, priority:** (a) cut L13: is the model still hedged enough with only the spoken conditionals (L07 "ถ้าทุกแถวเหมือนกันหมด", L10 "ถ้าแถวพอ ๆ กัน") plus the on-screen "แบบจำลอง" label? R1.1 fact-check said L07 was "paid off by L09–L13". If not, the cheapest swap is to restore L13 and cut L11 (~2.3 s) instead. (b) L15 now stands without its comparative partner (old L20): it says bad waits tend to stick, which is the F007 principle; confirm it does not now read as an absolute. (c) L12–L14 lost the "อาจเพราะ" cause line: confirm the hypothesis framing still holds from L12. (d) Shot cue for L15 keeps a pale smooth-checkout image beside the red one (picture only): confirm the picture does not assert more than F007.
- **N5 Film:** the rise is a crossfade, not a true overhead; "1/3" and "2/3" show or share the "แบบจำลอง" label every time; the second-switch picture now sits under L05 (old L06 cut); the old L13 diagram flicker (trolley, CL01 price-check sign) is optional picture under L10 or dropped (Film's call; must not imply a measurement).
- **Open questions:** CSH voice gender (wording neutral); whether the single-queue set in B06 is the same store refitted or a different shop (Film's call).

## R1.1 (superseded)

Kept unchanged for review of the R1.2 trim; headings demoted two levels.

### EDU-EP04-SHORT — ทำไมแถวข้าง ๆ เร็วกว่าเสมอ (why the next queue always seems faster)

- Deliverable: `EDU-EP04-SHORT`; task file [task.md](task.md); series concepts [../concepts.md](../concepts.md) C4.
- Script revision: **EDU-EP04-SCRIPT-R1.1** (R1 by Preaw, W1.2; wording/hedge fixes by Boat, W1.3, 2026-11-05; see [fact-check.md](fact-check.md)). Changed lines are marked `[R1.1]` in the Note column.
- Inputs: concept C4 (concepts.md R1, Preaw pitch + Film annotation); research [research.md](research.md) W1.1 (Boat, 2026-11-05; F001–F014, open points O1–O6); coordinator brief W1.2 (hard rules: no press percentages, 1/3 labelled "แบบจำลอง", single queue = "หลายที่ใช้" + fairness only, no variance claim F011).
- Story mode: educational explainer on a real everyday phenomenon, acted by fictional 4-head characters. Every switch, price check and slow line is **dramatization**, not a test result. The top-down diagram is a **model drawing** (O5).
- Profile: educational (psychology: perception and memory, with simple probability), painted 2D, 4-head cast, Thai Short 1080×1920 30 fps, ending `B_loop`.
- Voices (concept): dry, knowing male narrator (NAR); the man (MAN) mutters three short lines; the cashier (CSH) has one. Speaker-neutral wording for CSH so W4 can cast either voice.
- Target 40–60 s, aim ~50 s. **Timing: estimated** from syllables only (see Notes N1). No read-aloud or audio test.
- Status: draft for W1.3 Boat fact-check. Not user-approved (W1.5).

#### Story core

- **Logline:** a man switches queues twice and lands in the slow one each time. A top-down model shows the odds were against him from the start; attention and memory make it feel worse than it is; a single shared queue takes the choice away, and he finally relaxes.
- **Central question:** why does the next queue always seem faster, and why does switching seem to backfire?
- **Intention / obstacle:** he wants the fastest till; chance, his own eyes and his memory work against him.
- **Feeling:** recognition and laughs at the switching, a small "aha" at the 1/3, a calm payoff, a knowing smile at the loop.
- **Takeaway:** with three alike lines, yours wins only about one time in three (a simple model), so some other line usually wins; we tend to notice being overtaken and remember the bad waits; many places use one shared line, which feels fairer.

#### Truth and ending

- **Supported:** 1/3 under identical-lines assumptions (F002, model); switching to an alike line gains nothing in expectation (F003); switching is common and often no gain (F001, no figures); bad events weigh and stick more (F007, general principle); multiple lines feel less fair (F012); some places use a single line (F014, no brand).
- **Kept as hypothesis in VO:** attention asymmetry (F005) under "มีคนอธิบายว่า… มัก…" (L15–L18); "I'm always unlucky" from memory (F009) as "อาจไม่ใช่" (L21).
- **Dropped:** "10% / 67%" (O6); peak-end (F008, O3); lower mean wait (F010: out per brief, fairness only); lower variance (F011); "single queue is always better" (F013); slips = skips (F004, time; optional ALT-A below).
- **Twist logic:** the reversal is "it isn't (only) bad luck": L07 turns the comedy into a question; L09–L12 answer it with a fair model the viewer can check (three lanes, one wins); L13 admits real lines differ, which the price-check gag (CL01) already showed.
- **Ending `B_loop`:** L24 "แต่พอเจอร้านที่มีหลายแถว…" hands straight back to the hook L01 "คุณเปลี่ยนแถวกี่ครั้ง…". After L24: hold ~2.5 s on the new customer eyeing a three-lane shop across the way (no speech in the last ~0.5 s), then the shared loop seam to the L01 frame.

#### Beat list (estimated video time; story time = one shopping trip, a few minutes)

| Beat | Lines | Est. time | Purpose / causal link |
| --- | --- | --- | --- |
| `EDU-EP04-S01-B01` | L01–L02 | 0.0–4.0 | Hook: the switch always backfires |
| `EDU-EP04-S01-B02` | L03–L07 | 4.0–14.0 | Switch, price check, switch again, coins; turn: "not just bad luck" |
| `EDU-EP04-S01-B03` | L08–L13 | 14.0–28.5 | Top-down model: 3 lanes, 1/3; switching to an alike lane re-rolls the same odds; model caveat |
| `EDU-EP04-S01-B04` | L14–L18 | 28.5–37.5 | Attention: overtakes against you get counted (framed hypothesis) |
| `EDU-EP04-S01-B05` | L19–L21 | 37.5–44.0 | Memory: the slow days stick (framed) |
| `EDU-EP04-S01-B06` | L22–L24 (+hold) | 44.0–50.0 (+~2.5 hold) | One shared line, fairness, calm man; new customer's glance loops to L01 |

#### Full spoken script

`…` = short breath pause. Thai text is the TTS text; subtitles = VO unless noted. Silent gags carry no line.

| ID | Spk | Thai (VO / dialogue) | Shot cue (picture) | Note |
| --- | --- | --- | --- | --- |
| L01 | NAR | คุณเปลี่ยนแถวกี่ครั้ง… | Bright supermarket, three tills. MAN in line 2, basket in hand, eyes darting to line 1. Loop seam lands here. | frame: hook (address) |
| L02 | NAR | แถวที่คุณย้ายไปก็ช้าทุกที | MAN's face, already suspicious. Title card "ทำไมแถวข้าง ๆ เร็วกว่าเสมอ" (Film's call). | frame: perception, posed as the question (research Thai note) |
| L03 | MAN | แถวนั้นไปเร็วกว่า… | Line 1 shuffles forward; MAN slides across into line 1. | dramatization |
| L04 | CSH | เช็กราคาแป๊บนึงนะ | Line 1 cashier holds up an item, lifts the price-check sign; line 1 freezes. Line 2 (his old line) flies past. **CL01** | dramatization |
| — | — | (no line, ~1.5 s) | Silent gag: MAN switches to line 3; the customer at its till starts paying in coins, one by one. Line 1 now moves. | dramatization |
| L05 | MAN | อ้าว… | MAN's slow turn to camera, sulking. | dramatization |
| L06 | NAR | ย้ายอีกที… ก็ช้าอีกที | MAN stuck; both other lines move. | fact: F001 (switching often no gain; no figure) |
| L07 | NAR | ไม่ใช่แค่คุณซวยหรอก | Freeze on MAN mid-sulk; camera starts to rise. | fact: F002/F003 (odds, not luck); paid off L09–L12 [R1.1] |
| L08 | NAR | ลองมองจากข้างบน… มีสามแถว | Crossfade (side to top-down, per Film note) into painted diagram: three lanes of dots locked to the till positions. | frame: setup of model |
| L09 | NAR | ถ้าทุกแถวเหมือนกันหมด… | All three lanes equal: same dot count, same till icon. On-screen: "ถ้าทุกแถวเท่ากัน". | fact: F002 assumption (O1) |
| L10 | NAR | โอกาสที่แถวของคุณจะเร็วที่สุด… มีแค่หนึ่งในสาม | One lane lights as "คุณ"; a big "1/3" with the label "แบบจำลอง". | fact: F002 (model, labelled) |
| L11 | NAR | อีกสองในสาม… จะมีสักแถวที่เร็วกว่า | The other two lanes glow together, "2/3". | fact: F002 ("some other line", not "the other line always") |
| L12 | NAR | ถ้าแถวพอ ๆ กัน ย้ายไปก็แค่ลุ้นใหม่… ด้วยโอกาสเท่าเดิม | MAN's dot hops lanes; the "1/3" follows him unchanged. | fact: F003 (alike lines, no extra info) |
| L13 | NAR | นี่แค่แบบจำลองง่าย ๆ นะ… ของจริงไม่ได้เท่ากันเป๊ะ | Diagram flickers real-world variance: one big trolley icon, the price-check sign from CL01. | frame: model caveat (F002 limits) |
| L14 | NAR | แต่ทำไมมันรู้สึกเหมือนแพ้ทุกที | Back to side view at the tills. MAN in line, neck craned at the others. | frame: question |
| L15 | NAR | มีคนอธิบายว่า… ตอนรอ เรามักจ้องแถวอื่น | MAN's eyes track the next lane. **CL02** | frame: hypothesis (F005, O2) [R1.1] |
| L16 | NAR | ใครแซงเราไป… เรามักนับไว้เป็นพิเศษ | Each overtaker in the next lane gets a red tally mark over MAN's head. | frame: hypothesis (F005) [R1.1] |
| L17 | NAR | แต่ตอนเราแซงคนอื่น… มักไม่ทันสังเกต | His own lane moves past someone; no tally, he doesn't look. | frame: hypothesis (F005) [R1.1] |
| L18 | NAR | อาจเพราะการโดนแซง… มันรู้สึกไม่ยุติธรรม | MAN's face hardens; a small storm cloud. | frame: hypothesis (F005 via SRC001 injustice argument) [R1.1] |
| L19 | NAR | ความจำก็ช่วยซ้ำเติม… วันที่รอจนหัวร้อน มักติดอยู่ในความจำ | Thought-bubble montage: a long wait drawn in hot red, sharp. | fact: F007 (bad events stick; general principle, not a queue study) [R1.1] |
| L20 | NAR | ส่วนวันที่จ่ายเงินลื่น ๆ… มักติดความจำน้อยกว่า | A smooth checkout in pale, fading colour, blowing away. | fact: F007 (comparative only: bad sticks more than good), framed "มัก" [R1.1] |
| L21 | NAR | คำว่า "ฉันซวยตลอด" เลยฟังดูจริง… ทั้งที่อาจไม่ใช่ | The words "ซวยตลอด" stamp over MAN, then crack. | frame: hypothesis (F009) |
| L22 | NAR | หลายที่ใช้แถวเดียว… ช่องไหนว่าง ก็เรียกคนถัดไป | New set or same store refit: one rope-lined queue feeding all three tills; a till light calls "next". MAN at its head. | fact: F014 (no brand, no country) [R1.1] |
| L23 | NAR | ไม่มีแถวข้าง ๆ ให้อิจฉา… หลายคนรู้สึกว่ายุติธรรมกว่า | MAN calm, eyes closed. | fact: F012 (feels fairer; no wait-time claim) [R1.1] |
| L23a | MAN | …สบายจัง | Soft sigh as a till calls him. | dramatization |
| L24 | NAR | แต่พอเจอร้านที่มีหลายแถว… | Behind MAN, a NEW CUSTOMER glances through the window at a three-lane shop across the way; her eyes dart. **CL03**. Hold ~2.5 s, no speech in the last ~0.5 s, loop seam to L01. | frame: loop hand-off |

Subtitle differences: none. On-screen text: "ถ้าทุกแถวเท่ากัน" (L09), "1/3 · แบบจำลอง" (L10), "2/3" (L11), "ซวยตลอด" (L21); title per Film.

ALT-A (optional, not in the main cut, needs time): after L17, NAR "ทั้งที่โดยรวม… คนแซงกับคนโดนแซง มีพอ ๆ กัน" (F004, excerpt-based; Boat to confirm before use).

#### Sound intent (English notes; narration unchanged)

| Beat | Sound |
| --- | --- |
| B01 | Light, bouncy supermarket muzak at low level, till beeps; tiny riser under L02. |
| B02 | Muzak continues; quick whoosh on each switch; a hard stop (record scratch or price-scanner error beep) on L04's freeze; coin clinks one by one in the silent gag; a sad-trombone sting on L05. |
| B03 | Muzak ducks out as the camera rises; airy pad, soft plucks as lanes appear; a clean chime on "1/3" (L10); a small "boing" on the lane hop (L12). Illustration only, asserts nothing. |
| B04 | Muzak back but slightly detuned; a tick per tally mark (L16); silence on the no-tally overtake (L17) so the absence reads. |
| B05 | Muffled, warm-blurry tone for memory; a sharp hit on the red memory, a soft fade on the pale one; a crack on "ซวยตลอด". |
| B06 | Muzak resolves to a calm, warm version; one gentle till "ding" calling MAN; on L24 the original bouncy muzak creeps back under the new customer's glance into the loop seam. |

#### Clue ledger (fictional dramatization, not evidence)

| ID | Plant | Observable | First read | Payoff |
| --- | --- | --- | --- | --- |
| CL01 | L04 | Price-check sign stops line 1 | Bad luck | L13: real lines are not equal (model caveat) |
| CL02 | L15 | MAN watches the other lanes, not his own | Impatience | L16–L18: why overtakes feel one-sided |
| CL03 | L24 | New customer eyeing a multi-lane shop | Throwaway gag | Loops to L01; the cycle restarts |

#### Notes

- **N1 Timing (estimated):** about 245 spoken Thai syllables; at ~6 syl/s ≈ 41 s speech, plus ~5 s breath pauses, ~2.5 s silent gag and freeze beats, ~2.5 s end hold ≈ **51 s**, about **49 s** with the narrator speed-up (atempo 1.05). Needs W1.4 read-aloud or test audio.
- **N2 Claims used as fact:** F001 (L06, no figure), F002 (L09–L11, labelled model), F003 (L07, L12), F007 (L19–L20, general principle), F012 (L23), F014 (L22).
- **N3 Reworded to hypothesis:** F005 (L15–L18, "นักจิตวิทยาเสนอว่า", "มัก"); F009 (L21, "อาจไม่ใช่"). Not used: F004 (ALT-A only), F006, F008, F010, F011, F013, any SRC003 percentage.
- **N4 Boat check, priority:** (a) L15 "นักจิตวิทยาเสนอว่า" for F005: the asymmetry traces to Larson (operations research) and an untraced Don Norman attribution; is "psychologists suggest" fair, or should it be "มีคนอธิบายว่า"? (b) L18 "เพราะ" states a cause: confirm SRC001's injustice argument supports it as a hedged explanation, or soften to "อาจเพราะ". (c) L20 "มักลืมไปง่าย ๆ" extends F007 (bad remembered more) to "good forgotten easily". (d) L07 "ไม่ใช่คุณซวยหรอก" is unhedged; the model says odds, not luck, but real lines differ. (e) L22 "หลายที่" vs F014 "banks and some shops"; no Thai examples checked.
- **N5 Film:** the rise is a crossfade, not a true overhead of the cast (Film annotation C4); the "1/3" must show the "แบบจำลอง" label every time it is on screen; the CL01 price-check sign reappears in the L13 diagram.
- **Open questions:** CSH voice gender (wording neutral); whether the single-queue set in B06 is the same store refitted or a different shop (story reads either way; Film's call).
