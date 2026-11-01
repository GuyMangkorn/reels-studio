# AMG-EP01-SHORT fact-check and logic check of AMG-SCRIPT-R1

- **Reviewer / date:** Boat, 2026-11-02 (Asia/Bangkok). Independent pass; Boat's research r1 does not count as review of this wording.
- **Object reviewed:** [short/script.md](script.md) `AMG-SCRIPT-R1` (whole file: header, story core, beats, spoken lines L01–L26, P01, on-screen text, clue ledger, single-solution table, claim mapping, sensitivity check, title options, sound and visual notes). Research: [research.md](../research.md) r1 (FP01–FP10, T4, R1, CS01–CS05, F002, F004).
- **Profile:** `amg-fair-play-horror`, story mode `fiction/dramatization`. Only two real-world claims are in use: F004 (mirror reversal, clock face) and F002 (behaviour in a stuck lift). Everything else is checked for internal consistency and fair play, not truth.

## Verdict

**Pass with fixes.** The puzzle has one solution (Green), both true clues are spoken before the challenge, and both red herrings have innocent readings the script states. F004 is supported for the copy's wording and, with FC02, for the clock reveal. F002 is consistent.

Two fixes touch clue or reveal wording, so they go back to Preaw. They are not inline mechanical fixes ([editorial-workflow](../../../docs/editorial-workflow.md#inline-fact-fixes)):
- **FC01:** Pink's L20 timing.
- **FC02:** L26 wording plus a dial with no numerals.

The rest are small wording fixes, title fixes and production notes. Editorial readiness for R1: **`revision-required`** (light). It becomes `ready-for-storyboard` once FC01–FC03 are in R2 and rechecked. Film and Mark are not yet authorized ([delivery.md](../delivery.md)).

## Fixes

Ordered by impact (reveal or clue first).

### FC01 — Pink's line (L20) must happen before the blackout (RH02 logic) — **required, Preaw**

- **Problem:** `L20` `เงาในกระจก… มันขยับก่อนฉัน` has no time marker. It is said after the lights return, so it reads as present tense: "my reflection moves before me" (now).
  - That reading means the thing is still in the mirror after the swap. It contradicts `L04` (`ออกมาแทนที่ใครคนหนึ่ง`) and `L01` (exactly one) and suggests a second alien.
  - The script's own explanation has a hole too. The Truth section says she saw it "when the lights went out", but nobody can see a reflection in the dark.
- **Replacement wording for `L20`:**

  > ตอนไฟจะดับ… เงาในกระจก มันขยับก่อนฉัน

- **Matching edits:**
  - Truth section: "saw her reflection move before she did" → "**just as the lights were going out** she saw her reflection move before she did".
  - RH02 payoff / single-solution row: "she was facing the glass **just before** the blackout and saw the alien move on it (`L04`)".
- **Impact:** about +0.6 s. RH02 stays a red herring (she is tied to the mirror) and keeps its innocent reading. No change to the solution.

### FC02 — The mirrored clock must be read by hand position: no numerals on the dial; reword L26 — **required, Preaw (reveal) + visual note**

- **Problem:** a mirrored dial with numerals still has the right numeral under the hour hand.
  - The hour hand of a mirrored 3:02 points to a back-to-front "3" in the 9 o'clock position. Anyone reading the numerals reads about 3:02, not 8:58.
  - The "nearly nine" error only happens when the dial is read by hand position. SRC019's version of this puzzle depends on it: "There are no numbers on the clock, so Joey makes an error in reading the time since it is a mirror image."
  - The S03-B02 event note ("watch face … mirrored (**numbers reversed**), reading about 8:58") shows numerals. A viewer who pauses on that frame would read 3:02, and the reveal picture would contradict `L18`.
- **Replacement wording for `L26`:**

  > และนาฬิกาที่ลอกมาจากกระจก ตอนบ่ายสามโมงนิดๆ เข็มจะชี้เหมือน… เกือบเก้าโมง

  This ties the error to the copy's watch, not to "a clock in a mirror" in general. `เข็มจะชี้เหมือน` is literally true of hand positions whatever the dial shows. If Preaw keeps the original structure, the minimum change is `จะดูเหมือน` → `เข็มจะชี้เหมือน`.
- **Production notes:**
  - Truth section, tag table and visual note 6: Green's watch is an analog watch with **index marks only, no numerals** (human and copy alike).
  - S03-B02 event: replace "mirrored (numbers reversed), reading about 8:58" with "plain index dial, no numerals; hands at the mirrored positions of 3:02 (hour hand just short of the 9 position, minute hand at the 58-minute mark); crown on the opposite side of the case".
  - If any hand moves on screen, it moves **counterclockwise**. A mirror copy of a running watch runs backwards, which is also why it reads 8:58 two minutes after 9:00.
- **Spoken `L10` (`นาฬิกาเข็ม`) unchanged:** the viewer does not need the dial detail to solve the puzzle.
- **Impact:** about +0.3 s. Reveal logic now holds in words and picture.

### FC03 — Title option 2 states the wrong duration — **required if that title is used**

- `ลิฟต์ค้าง 3 วินาที… มีคนถูกแทนที่` says the lift was stuck for 3 s. In the script the **lights** go out for 3 s (`L03`) and the lift stays stuck.
- **Replacement:**

  > ไฟดับ 3 วินาที… มีคนถูกแทนที่

### FC04 — Green must have no other asymmetric feature (visual note 2) — **required, production note**

- **Problem:** visual note 2 says "Only Green's watch changes". The copy is made from the reflection, so *every* asymmetric feature of Green would flip: hair parting, shirt pocket, a mole.
  - Either Green has none, or each one must flip, and then it becomes an extra picture-only clue (FP10).
- **Replacement for visual note 2, second sentence:**

  > Only Green's watch changes, and only after the blackout. Design Green with no other asymmetric feature (centred or no hair parting, no breast pocket, no mole, no ring), because the copy would mirror every one of them. Anything else that flips is a false clue.

### FC05 — Alarm bell is a sound type, not a real recording — **production note**

- **S02-B01 sound intent**, replace "Alarm-bell button presses (a real lift alarm bell, short rings)" with:

  > Alarm-button presses with short lift-alarm-bell rings (library or generated sound of that type; not a recording of a real incident).

### FC06 — `ผนังกระจก` can read as a glass wall — **recommended, Preaw's call**

- **Problem:** in everyday Thai, `ผนังกระจก` most often means a transparent glass wall. `กระจก` alone in `ส่องกระจก` / `เงาในกระจก` means mirror. The rule in `L05` depends on a *mirror*.
- **Replacement for `L04`:**

  > ในความมืด… บางอย่างจากนอกโลก ที่ซ่อนอยู่ในกระจกเงา ออกมาแทนที่ใครคนหนึ่ง

- **Impact:** same length.

### FC07 — Title option 3 says "watch closely" for a puzzle solved by listening — **recommended**

- `ใครไม่ใช่คน? ดูให้ดี มันพลาดแค่อย่างเดียว` → replacement:

  > ใครไม่ใช่คน? ฟังให้ดี มันพลาดแค่อย่างเดียว

- **Reason:** FP10, the clues are in the words.

### Notes (no change required)

- **N01 — "only one mistake" vs two clues.** `L02` `มันพลาด… อยู่แค่อย่างเดียว` is consistent: the one mistake is the left-right swap, and the wrist and the clock are two symptoms of it.
  - Some commenters may still say "it made two". If Preaw wants to close that, `L25` could open with `มันพลาดอย่างเดียว คือซ้ายขวาสลับ…` (+1 s). Optional.
  - `L02` reads slightly more naturally as `แต่มันพลาด… อยู่แค่อย่างเดียว` (contrast with the hook). Optional style.
- **N02 — `เกือบเก้าโมง` is the morning form (09:00).** A dial does not show a.m./p.m. The copy picking the morning word in an afternoon (`บ่ายสามโมง`) is a second, consistent oddity. Keep it.
- **N03 — Yellow's `ฉันหายใจไม่ออก`** is character panic, not a narrator claim about lift air. SRC014 calls the inside of a stalled lift the safest place, and nothing in the script contradicts that.

## Logic check: Preaw's five edge cases

| # | Question | Finding | Verdict |
| --- | --- | --- | --- |
| E1 | Whose left/right? | `ใส่…ที่หูซ้าย`, `ข้อมือซ้าย`, `ไหล่ขวา`, `ยกข้อมือขวา` all name a body part with a side. Normal Thai reads that as the person's own side; nobody says screen left. Consistent across `L08`, `L10`, `L11`, `L15`, `L17`, `L21`, `L25`. Mark/Film must draw own-side (screen-opposite when facing camera), as the script says. | consistent |
| E2 | Could a human Green just move the watch? | Yes, for the wrist alone (an unbuckle and rebuckle is possible in a few seconds, even in the dark). That is why `CL03` exists. A human moving his watch would still read 15:0x correctly. `เกือบเก้าโมง` needs the mirrored face. The two clues are independent and together leave no innocent reading. | consistent |
| E3 | Clock arithmetic and gap | Reflection across the 12–6 axis maps a reading t to 12:00 − t (SRC019 puzzle; standard result). True 15:02 → hands at the 8:58 positions. `เกือบเก้าโมง` (about 8:45–8:59) holds for true times of about 15:01–15:15. At exactly 15:00 the mirror reads 9:00, which is `เก้าโมง`, not `เกือบ`. So in-story the question must come **at least one minute and at most about 15 minutes** after 15:00. The script's "15:00 to about 15:03" fits. It holds only if the dial is read by hand position (FC02). A running mirrored watch turns counterclockwise, which keeps the reading at 12:00 − t as time passes (FC02 note). | consistent with FC02 |
| E4 | How does the copy know the time? | It reads its own copied watch. Nobody says the time aloud in the lift (`L03` is narration, not heard in-story). The lift has no window or daylight cue. Copying the watch from the reflection some time before the blackout does not matter: the mirrored watch keeps running (backwards). | consistent |
| E5 | Pink's line | True in-story and consistent with `L04` (the thing was on the mirror wall) only if she saw it **before** the dark. As written it reads as present tense and suggests the thing is still in the mirror. | **fix FC01** |

## Fair-play check (FP01–FP10)

| Rule | Check against R1 | Result |
| --- | --- | --- |
| FP01 equal information | Every fact the reveal uses is spoken before `L23`: `L03` 15:00; `L05`–`L06` the rule; `L10` analog watch, left wrist; `L17` right wrist; `L18` "nearly nine". The mirror-clock mechanism is explained only in `L26`. But the wrist clue alone solves the puzzle, and "nearly nine" at 3 p.m. is plainly wrong without the mechanism. | pass |
| FP02 culprit seen early, real part | Green introduced at about 21 s (`L10`), acts and speaks at about 33–34 s. | pass |
| FP03 rule before use | Flaw rule at about 12–15 s (`L05`–`L06`). | pass |
| FP04 no luck or intuition | Reveal names two spoken clues. | pass |
| FP05 no lying narrator | The narrator says only true things in-story. `L13` `ทุกคนยังอยู่ครบ` is true at face value (five bodies present) and fair irony. No character lies. | pass |
| FP06 challenge | `L23` + P01 3.0 s + swatches. | pass |
| FP08 truth on rewatch | `L17`/`L18` each have an innocent first reading (an answer to Blue) and a damning second one. The reveal quotes `ยกข้อมือขวาขึ้นดู`. | pass |
| FP09 contradiction with an earlier stated fact | `L17` contradicts `L10`, and `L18` contradicts `L03`. | pass |
| FP10 no picture-only decisive clue | Both clues are in words. Risks are only in the picture: the numerals on the reveal dial (FC02) and other flipped Green features (FC04). Title 3 "ดูให้ดี" (FC07). | pass after FC02/FC04 |
| Red herrings | RH01 Yellow: innocent, `L09` stated before the blackout, no false statement, no side flip. RH02 Pink: innocent, `L12` + `L04`, valid after FC01. CLR01 Red: left → left. CLR02 Blue: right → right. Neither red herring satisfies the flaw rule. | pass after FC01 |
| Exactly one answer | Green is the only suspect who fails the rule, and he fails twice. Red and Blue pass a side check. Yellow and Pink are cleared by `L01` (exactly one) plus Green's failures. Their behaviour has stated causes and they state nothing false. No second consistent solution found. | **unique: Green** |

## Claim table (exact R1 wording)

| Claim / location | Exact wording checked | Classification | Verdict | Evidence + locator | Reason / correction / story impact |
| --- | --- | --- | --- | --- | --- |
| `F004a` / S01-B02 `L05`–`L06` | `มันลอกแบบได้ทุกอย่าง แต่มันลอกจากเงาในกระจก` / `ซ้ายกับขวาของมัน… เลยสลับกัน` | fiction rule resting on fact (mirror chirality) | supported | SRC018, "In three dimensions": "Reflection in a mirror does result in a change in chirality"; "like a glove stripped off the left hand and turned into a right-hand glove" | The line says the *copy's* left and right are swapped. That is the handedness change, so it is correct. Note: physically a plane mirror reverses depth, not left-right (SRC018 calls "lateral inversion" "somewhat misleading"). The script never says "mirrors swap left and right" in general, so no correction is needed. |
| `F004b` / S03-B02 `L26` | `และเข็มนาฬิกาในกระจก บ่ายสามโมงนิดๆ จะดูเหมือน… เกือบเก้าโมง` | fact (optics + arithmetic) applied in fiction | needs-qualification | SRC019 puzzle and solution ("no numbers on the clock … error in reading the time since it is a mirror image"; "mirrored around 12 o'clock"); arithmetic in E3 | True when the dial is read by hand position, which is guaranteed with no numerals. Fix FC02 (reworded `L26` + no-numeral dial). |
| `F002` / S02-B01 event + `L14` | Yellow jams the alarm button; nobody pries the doors; `ช่วยด้วย! ฉันหายใจไม่ออก!` | behaviour shown; character speech | supported (behaviour); not-factual (L14) | SRC014: "Use the elevator's alarm button or emergency contact button to get help"; "don't attempt to pry open the doors"; "The inside of an elevator is the safest place to be while the elevator is stopped" | Nothing models unsafe behaviour. No spoken safety claim. L14 is panic, not an assertion about air. US source, not Thai official guidance (unchanged from r1). |
| `L03` | `บ่ายสามโมงตรง` | fiction (time word) | not-factual; Thai usage correct | Thai time-of-day words | `บ่ายสามโมง` = 15:00; `เก้าโมง` = 09:00 (N02). |
| `L09` | `เสื้อเหลือง กลัวที่แคบ ปกติเดินบันได` | character trait | not-factual | — | A stated fear that explains her later behaviour. She is cleared, not mocked. OK for CS03. |
| Titles | Options 1–4 | promotional wording | 1, 4 fine; 2 contradicted by the script; 3 misleading for FP10 | script `L03` | FC03, FC07. No title contains "Among Us". |
| Sound | S01–S03 sound intents | dramatized sound | consistent after FC05 | — | No siren, crowd or casualty implied. Lift ambience, shimmer and phone crackle are fictional. The alarm bell should be a type, not a real recording (FC05). No cue marks `L17`–`L18`, and there is no clock tick: correct. |

## CS01–CS05, vocabulary and the `ครับ`/`ค่ะ` tell

- **CS01:** pass. `จากนอกโลก` + mirror skin. No spirit, no blood craving, no illness, no elderly suspect.
- **CS02:** pass. Both tells come from facts established in this lift (wrist, time). No "a real Thai would know" test.
- **CS03:** pass.
  - The 26 spoken lines (`grep` of `> ` lines) contain no `ครับ`, `ค่ะ`, `คะ`, `นะ`, `จ้ะ` or regional forms. The pronoun `ฉัน` is used by Yellow and Pink only.
  - Green's single line has no pronoun or particle, so speech style carries no cue.
  - Red's silence has a stated reason (a call), and Yellow's panic has a stated fear.
  - The tell is an accessory and a clock, not a body difference. Handedness is not used: wearing a watch on the right is not presented as inhuman. The tell is the *change* from left to right.
- **CS04:** pass. Replacement implied only. No gore or transformation.
- **CS05:** pass. No real building, maker or brand. Plain shirts.
- **Game vocabulary:** none in spoken lines, on-screen text or titles. Checked `ประชุม`, `โหวต`, impostor, ejected, vent, task, sus, `ท่อ`, "Among Us". Visual note 4 bans bean-shaped figures and visors.

## Thai readability

All lines are short, spoken-register Thai and easy to follow at narrator pace. Specific points:
- **`L04` `ผนังกระจก`:** see FC06.
- **`L20`:** add the time marker (FC01).
- **`L26`:** the original is compressed (`เข็มนาฬิกาในกระจก บ่ายสามโมงนิดๆ จะดูเหมือน`). The FC02 wording reads more smoothly and names whose watch it is.
- **`L02`:** `แต่` vs `และ` (N01), optional.
- **Fine as written:** `L08`–`L12` (parallel `เสื้อX + detail` pattern, good for rewatch), `L16`, `L18`, `L22`, `L23`, `L25`.

## Sources (inspected 2026-11-02)

| ID | Source | Status | Used for |
| --- | --- | --- | --- |
| SRC014 | Safety+Health (NSC), "The do's and don'ts of elevator safety", 29 Jan 2018: https://safetyandhealthmagazine.com/articles/16645-the-dos-and-donts-of-elevator-safety | re-opened and inspected this pass (fetch summarizer; quotes as returned) | F002 |
| SRC018 | "Mirror image", Wikipedia: https://en.wikipedia.org/wiki/Mirror_image | inspected (tertiary) | F004a chirality; mirror reverses the axis normal to the surface. The page says nothing about clocks. |
| SRC019 | Maths Is Fun, "Clock in the Mirror" puzzle and solution: https://mathsisfun.com/puzzles/clock-in-the-mirror.html , https://mathsisfun.com/puzzles/clock-in-the-mirror-solution.html | solution page inspected; puzzle page seen as a search lead (its premise is quoted on the solution page) | F004b: no-numeral dial misread; "mirrored around 12 o'clock". An educational puzzle site, not a primary optics source. The 12:00 − t arithmetic is checked independently in E3. |

**Leads not used:** exam-prep pages using the "11:60 − mirror time" shortcut (search results only, not opened). They are the same arithmetic.

**Confidence limits:** F004a and F004b are textbook optics and arithmetic. The sources are tertiary or educational, which is adequate for a fiction premise but not a citation for a science lesson. No primary optics text was opened.

## Recheck scope for R2

FC01–FC07 wording at their locations, plus any dependent lines:
- the Truth section;
- the RH02 row;
- the single-solution table;
- the S03-B02 event;
- visual notes 2 and 6;
- the sound intent for S02-B01;
- the timing estimate (about +0.9 s for FC01 + FC02).

## Recheck of AMG-SCRIPT-R2

- **Reviewer / date:** Boat, 2026-11-02 (Asia/Bangkok). Fresh pass on the exact R2 wording in [short/script.md](script.md); the R1 review above does not count as review of R2 lines.
- **Scope (changed lines only, per the R2 change log):** `L04`, `L09`, `L20`, `L25`, `L26`; titles 2 and 3; S03-B02 event and dial notes (tag table, `L10` direction, visual note 6); Green design (visual note 2); S02-B01 sound intent; RH01, RH02, CL03 rows; Green/Yellow/Pink single-solution rows; edge cases 3 and 5; claim mapping; timing estimate; particles and game vocabulary. Unchanged lines (`L01`–`L03`, `L05`–`L08`, `L10`–`L19`, `L21`–`L24`) were not re-reviewed except as dependencies of the solution.

### Verdict

**Pass.** FC01–FC07 are applied as written. The puzzle still has exactly one answer (Green). No new factual claim is unsupported. Editorial readiness for R2: **`ready-for-storyboard`**. That is not user approval, and Film is not authorized yet ([delivery.md](../delivery.md)).

### FC01–FC07 application

| Fix | R2 location | Exact R2 wording / content | Result |
| --- | --- | --- | --- |
| FC01 | `L20`; Truth; S02-B03 purpose/event; RH02 row; Pink row; edge case 5 | `ตอนไฟจะดับ… เงาในกระจก มันขยับก่อนฉัน`; "just as the lights were going out"; mirror normal now | applied verbatim |
| FC02 | `L26`; Truth; tag table; `L10` direction; S03-B02 event; visual note 6; CL03; edge case 3 | `และนาฬิกาที่ลอกมาจากกระจก ตอนบ่ายสามโมงนิดๆ เข็มจะชี้เหมือน… เกือบเก้าโมง`; index-only dial; hands at mirrored 3:02; crown opposite; counterclockwise | applied verbatim |
| FC03 | Title 2 | `ไฟดับ 3 วินาที… มีคนถูกแทนที่` | applied |
| FC04 | Visual note 2; tag table | Boat's sentence verbatim + "(FC04)" | applied |
| FC05 | S02-B01 sound intent | Boat's sentence verbatim | applied |
| FC06 | `L04` | `ในความมืด… บางอย่างจากนอกโลก ที่ซ่อนอยู่ในกระจกเงา ออกมาแทนที่ใครคนหนึ่ง` | applied |
| FC07 | Title 3 | `ใครไม่ใช่คน? ฟังให้ดี มันพลาดแค่อย่างเดียว` | applied |

### Changed-line claim table (exact R2 wording)

| Claim / location | Exact wording | Classification | Verdict | Evidence | Note |
| --- | --- | --- | --- | --- | --- |
| `F004a` / `L25` opener | `มันพลาดอย่างเดียว คือซ้ายขวาสลับ…` | fiction rule resting on fact (chirality of the copy) | supported | SRC018 (chirality change on reflection) | Subject is `มัน` (the copy) and its mistake. It is not a general "mirrors swap left and right" claim. Matches `L05`–`L06` and `L02` (`มันพลาด… อยู่แค่อย่างเดียว`); N01 closed. |
| `L25` rest | `ก่อนไฟดับ นาฬิกาอยู่ข้อมือซ้าย แต่เมื่อกี้ มันยกข้อมือขวาขึ้นดู` | in-story recap | consistent | `L10`, `L17` | Quotes the plant and the decisive line correctly (FP08). |
| `F004b` / `L26` | `และนาฬิกาที่ลอกมาจากกระจก ตอนบ่ายสามโมงนิดๆ เข็มจะชี้เหมือน… เกือบเก้าโมง` | fact (optics + arithmetic) applied in fiction | supported (R1 `needs-qualification` resolved) | SRC019; E3 arithmetic (12:00 − t) | Holds with the index-only dial now specified in all four places. |
| `L04` | `…ที่ซ่อนอยู่ในกระจกเงา ออกมาแทนที่ใครคนหนึ่ง` | fiction | not-factual; consistent | — | `กระจกเงา` now means a mirror without doubt. `ออกมา` keeps it out of the mirror after the swap, which `L20` (past tense) now agrees with. Logline/Truth say "on/clinging to the mirror wall"; the two are compatible for English notes. |
| `L09` | `เสื้อเหลือง กลัวที่แคบ` | character trait | not-factual; RH01 innocent reason intact | — | Still spoken before the blackout (under `L07` `ก่อนไฟดับ`). The cut `ปกติเดินบันได` carried no clue. |
| `L20` | `ตอนไฟจะดับ… เงาในกระจก มันขยับก่อนฉัน` | character speech (in-story true) | consistent | `L04`, `L12` | `ตอนไฟจะดับ` = as the lights were about to go out, while she could still see. |
| S02-B01 sound | alarm-bell type, not a real incident recording | dramatized sound | pass | — | No siren, crowd or casualty implied; no real recording needs a source. |
| Titles 2, 3 | as above | promotional | pass | `L03`, FP10 | No "Among Us". |

### Single-solution re-test (R2 wording)

| Suspect | Flaw-rule check | Innocent reading (stated) | Can be the copy? |
| --- | --- | --- | --- |
| Red | `L08` left → `L21` left: passes | call to his mother (`L22`) | no |
| Yellow | no side detail, no false statement (`L14` is panic) | `L09` `กลัวที่แคบ`, before the blackout | no (by `L01` + Green) |
| Green | `L10` left → `L17` right; `L18` `เกือบเก้าโมงแล้ว` against `L03` 15:00 | none covers both (a moved watch would still read 15:0x) | **yes, forced** |
| Blue | `L11` right → `L15` right: passes | dead phone (`L16`) | no |
| Pink | no side detail, no false statement | `L12` at the mirror; `L20` past tense, saw the thing on the glass (`L04`) | no (by `L01` + Green) |

Green is forced by two independent failures with no innocent reading. `L01` says exactly one, so Yellow and Pink are human. A viewer might read `L20` ("my reflection moved before me") as the thing copying Pink's reflection. That is the intended pull of RH02, and it does not survive the rule check. **Unique: Green.** Edge cases 3 and 5 as written in R2 match R1 findings E3 and E5.

### Timing (estimate only)

- The change-log arithmetic is correct: 60.0 + 0.6 + 0.3 + 1.0 − 1.0 − 0.8 − 0.3 = 59.8 s.
- My own rough syllable count of the changed beats is a little higher than the beat table:
  - S03-B02 (`L24` 7 syl, `L25` about 29, `L26` about 23, plus written pauses and the 1.2 s tail): about 12.5–13 s against the 12.0 s allotted.
  - S02-B03 (`L19` + whispered `L20`): about 5 s against 4.6 s.
- So the total is plausibly **59–61.5 s** before the +5% narrator pace. After the pace adjustment it is about 58.5–60.5 s. That fits ≤ 60 s only marginally; the 0.2 s margin in the script is optimistic.
- This is not a factual issue and not a blocker. The existing cut order covers it after the voice lock. Do not lock frames from either estimate.

### Particles and vocabulary

- All 26 spoken lines were checked with `grep` of the `> ` lines. There is no `ครับ`, `ค่ะ`, `คะ`, `นะ` or `จ้ะ`, and none of `ประชุม`, `โหวต`, `ท่อ`, impostor or "Among Us".
- Titles are clean. "Among Us" appears only in the internal notes that say it is not used.

### `L02` `และ` vs `แต่`

- This does not matter for facts or fair play. `และมันพลาด… อยู่แค่อย่างเดียว` is grammatical and true. `แต่` was only a smoother contrast (style). Keeping `และ` is acceptable.

### Production notes (no script change required)

- **RN01 — mirror shows the true time.** S03-B02 puts Green's reflection in the mirror behind him. If his watch face is readable *in the reflection*, it must show a normal 3:02 (the reflection of a mirrored dial is un-mirrored, and it turns clockwise), not 8:58. The simplest fix is to keep the reflected dial unreadable. This is for Film/Mark when authorized.
- **RN02 — visual note 6 wording.** "Must stay hidden until S03-B02: Green's mirrored watch face." is awkward but its meaning is clear: the face is unreadable before S03-B02. It is Preaw's call, with no fact impact.

### Readiness

`AMG-SCRIPT-R2` with this recheck is **`ready-for-storyboard`**. It goes to Film, then Mark, only after the user authorizes those stages. No user approval is implied, and timing is unverified until the voice lock.

## Review of AMG-SCRIPT-R3

- **Reviewer / date:** Boat, 2026-11-02 (Asia/Bangkok). Fresh, independent pass on the exact R3 wording in [script.md](script.md). The R1 review and R2 recheck above do not count as review of R3.
- **Scope: the whole script** (coordinator instruction), not only changed lines: header, story core, Truth, tag table, beat table and sound intents, all 39 spoken lines (`L01`–`L39`), `P01`, on-screen text, clue ledger, single-solution table, edge cases 1–14, claim mapping, sensitivity check, titles 1–5, sound and visual notes, cut order, open questions Q1–Q2.
- **Sources:** no new source was needed. F004a (SRC018), F004b (SRC019) and F002 (SRC014) were inspected earlier today (see [Sources](#sources-inspected-2026-11-02)) and were not re-opened. Their claim wording is reused only where this pass confirmed it is unchanged (`L05`, `L06`, `L25`, `L26`) or restated (`L36`). The ring clue (`CL04`) uses the same chirality fact. No wedding-ring custom is claimed, so none was researched.

### Verdict

**Pass with fixes.** The puzzle still has exactly one consistent solution (Green). All three true clues are spoken before `L23`. Every red herring and clearing has a stated innocent reason, and none becomes a second solution. No spoken line makes an unsupported real-world claim.

There is one required fix: **FC08**, a sound-intent note. It is an exact wording change with no beat, clue or timing change, so it qualifies for an [inline fix](../../../docs/editorial-workflow.md#inline-fact-fixes). FC09 is a recommendation tied to the user's Q1. FC10–FC13 are optional or production notes.

### Fixes

#### FC08 — The alarm must not stop at the `L18`/`L19` seam — **required (sound intent; inline-eligible)**

Two parts of R3 disagree:
- The Truth section and edge case 9 explain Blue's silence partly by "Yellow's alarm is already ringing".
- The S02-B03 sound intent says `Alarm bell stops (Yellow has let go).` That puts the alarm stop exactly at the start of Pink's beat, right after `เกือบเก้าโมงแล้ว`.

The stop is a sound change on the frame after Green's line, which the script itself bans ("Nothing marks Green's line … no alarm onset"). It also removes one of the two cover reasons for nobody reacting.

Exact replacements in [script.md](script.md):
- **S02-B01 sound intent:** replace `start here and keep ringing intermittently, low, under S02-B01 and S02-B02, so no ring onset marks Green's line.` with `start here and keep ringing intermittently, low, under S02-B01 to S02-B03, so no ring onset or stop marks Green's line.`
- **S02-B03 sound intent:** replace `Alarm bell stops (Yellow has let go).` with `Alarm bell keeps ringing, low and intermittent, under Pink's beat (no stop at the L18/L19 seam).`
- **S02-B04 sound intent:** prepend `Alarm bell stops under L21 (Yellow has let go).`

The alarm still stops before S02-B05, so it does not mark Green's comforting either.

#### FC09 — `L39` register and the gendered assumption — **recommended; user decides with Q1**

- **Fact status:** `not-factual` (fiction implication). `L30` says only that Green married yesterday. It never names the spouse, so `L39` adds new information (a wife). Fiction may decide that, and it is not an error. But the clip never earns it, and since Thai marriage law became gender-neutral in January 2025 (background, not re-sourced this pass) the assumption is avoidable.
- **Register:** `เมีย` is everyday spoken Thai and common in Thai ghost-story narration, but it is the most casual word in an otherwise neutral game-host narration. Some viewers hear it as blunt or crude, which can undercut the quiet chill.
- **Tone:** the line implies the copy goes home to a third person and states nothing violent (CS04 passes). It is not a hidden clue (it comes after `L24`), and it opens no second mystery or sequel.

Preferred exact replacement (same length, neutral, warm):

> แล้วคืนนี้… ใครจะกลับบ้านไปหาคู่ชีวิตของเสื้อเขียว

Alternative that echoes `L30` (about +0.5 s):

> แล้วคืนนี้… ใครจะกลับบ้านไปหาคนที่เสื้อเขียวเพิ่งแต่งงานด้วย

If the user wants "wife" kept explicitly, `ภรรยา` fixes the register but reads stiffer in speech. `เมีย` as written is acceptable; the change is recommended, not required.

#### FC10 — Edge case 9 (nobody reacts to "nearly nine") — **optional, Preaw's call**

Judgement: **acceptable as written once FC08 is applied.** The reasons:
- Blue asked the room, got an answer, and is cut off at once by Pink's whisper while the alarm rings.
- The narrator's description of Pink (`L19`) plays over the moment, so viewers take it as simultaneous action.
- Short-form viewers accept this kind of interruption.
- The weak point is that a careful viewer may comment "why didn't Blue notice, with a 4 p.m. deadline?". That is a plausibility gap, not a logic gap, and it does not create a second solution.

Any reaction from Blue (`หา?`, a frown) would point at Green, and would be the strongest hint in the clip, so do not add one.

If Preaw wants the interruption stated in words without touching Green's line, replace `L19` with:

> ทุกคนหันไปทางเสื้อชมพู… เธอจ้องกระจกไม่วางตา มือกำกิ๊บที่ผมข้างขวาไว้แน่น

Effects of this wording:
- It costs about +1.0 s.
- It keeps the `CLR03` side words, and the subject `เสื้อชมพู` is still spoken.
- It names no reaction to Green.
- **Do not** use `ยังไม่ทันมีใครพูดอะไร…` or `ยังไม่ทันมีใครถามต่อ…`, because both imply that Green's answer needed a reply, which marks it.

#### FC11 — `L34` `สะท้อนแสงไฟ` is a mirror word on the ring line — **optional, Preaw's call**

`สะท้อน` is the same word family as `เงาสะท้อน` and the mirror premise. On the ring line it adds a faint, unintended pointer at Green and invites a picture glint, which Film would then have to hold back. If Preaw wants the ring line to sound more like scenery, replace `L34` with:

> เสื้อเขียวเอื้อมมือไปแตะไหล่เสื้อเหลือง แหวนแต่งงานที่นิ้วนางขวา… ยังใหม่เอี่ยม

The innocent reading is "newlywed", and the line ties back to `L30` `แหวนวงใหม่`. Timing is about the same. `L38` is unchanged by this. The current wording is true and fair, so this is optional.

#### FC12 — Yellow's move must read front/back, not across the lift — **production note (Film/Mark)**

`L37` asks `ซ้ายขวาของใคร ไม่ตรงกัน`. If Yellow's move from the mirror side to the door panel reads on screen as a sideways move (screen left to screen right), some viewers may take `ซ้ายขวา` as a position in the lift and pick Yellow.
- Stage her move along the depth axis (mirror wall at the back, doors at the front), as visual note 7 already implies.
- No narration names a side of the lift for anyone's position; R3 already complies.
- The words `ซ้ายขวาของใคร` (whose left/right) already read as body sides, so no line change is needed.

#### FC13 — `แทนที่` means "replace", not "stand on the same spot" — **notes only (not spoken)**

The RH01 row and edge case 10 argue that `L04` `ออกมาแทนที่` means the copy "stands where its victim stood". In Thai, `แทนที่ใครคนหนึ่ง` means replaced someone, not a literal spot. Yellow's clearance should rest on the reasons that hold:
- the rule check (`L37`);
- `L01` (exactly one copy);
- Green's three failures;
- `L09` (fear stated before the blackout).

Preaw may drop "i.e. it stands where its victim stood" from edge case 10 and the RH01 payoff. Nothing spoken changes.

### Single-solution table and edge cases 1–14 (R3 wording)

| Suspect | Flaw-rule check (own side) | Innocent reading stated before the challenge | Can be the copy? |
| --- | --- | --- | --- |
| Red | `L08` left ear → `L21` `หูซ้าย`: passes | `L28` on a call with his mother in hospital; `L22` the line dropped | no |
| Yellow | no side detail; states nothing false (`L14` is panic) | `L09` `กลัวที่แคบ` + `L29`, before the blackout; groped to the alarm in the dark (`L33`) | no (by `L01` + Green's three failures) |
| Green | `L10` left wrist → `L17` right; `L30` left ring finger → `L34` right; `L18` `เกือบเก้าโมงแล้ว` against `L03` 15:00 | none covers all three (see E-R3-a) | **yes, forced** |
| Blue | `L11` right shoulder → `L15` right: passes | `L16` dead phone; `L31` deadline | no |
| Pink | `L32` right clip → `L19` right: passes (`CLR03`, new) | `L12` at the mirror; `L20` past tense, she saw the thing on the glass (`L04`) | no |

**Unique: Green.** R3 is stronger than R2: three innocents now positively pass a side check (Pink added).

| # | Finding | Verdict |
| --- | --- | --- |
| 1 Whose left | Every side word names a body part with a side (`หูซ้าย`, `ข้อมือซ้าย/ขวา`, `นิ้วนางซ้าย/ขวา`, `ไหล่ขวา`, `ผมข้างขวา`), which Thai reads as the person's own side. No line names a screen side or a side of the lift. | consistent |
| 2 Human moves the watch | Possible for the wrist alone. **E-R3-a (new):** even a human who moved the watch *and* wore it upside down would read 3:02 rotated 180° as 9:02 (`เก้าโมงกว่า`), not `เกือบเก้าโมง`. Only a mirror gives 12:00 − t = 8:58, so `เกือบ` is load-bearing. Keep `L18` and `L26` word for word. | consistent |
| 3 Clock arithmetic | 12:00 − t. For any true time after 15:00:00 and up to about 15:15 the mirrored reading is 8:45–8:59:59, so `เกือบเก้าโมง` is literally right. It is visibly short of nine on the dial from about 15:01. Story-world end about 15:05 is inside the window. `L26` `ตอนบ่ายสามโมงนิดๆ` holds. Blue's `สี่โมง` (`L31`) is narration, not heard in-story, and does not touch the arithmetic. `เก้าโมง` means 09:00 in Thai six-hour time (not 21:00 = `สามทุ่ม`), so the error is six hours either way and is audible. Production note: if S03-B02 shows the present rather than a flashback, the hands may sit at the mirrored 3:03–3:05 positions (8:57–8:55); keep them counterclockwise and short of nine. | consistent |
| 4 Copy knows the time | Reads its own copied watch; nobody says the time aloud in-story. | consistent |
| 5 Pink's line | Past tense (`ตอนไฟจะดับ`); true in-story; not a second alien. | consistent |
| 6 Ring and watch independent | Separate observables, separate beats (`L17`, `L34`); only `CL03` is independent of any human action. The three together leave no innocent reading. | consistent |
| 7 Ring custom | `L30` states where **this** man wears **his** ring; no line claims a Thai or general custom. A viewer who assumes "Thai men wear it on the left" is still pointed at Green, and a viewer from a right-hand custom still sees the change, because the clue is the **change** left → right, stated at both ends. No custom claim, no ambiguity. | not-factual; pass |
| 8 Ring shape / flip | A copy made from a reflection swaps handedness (SRC018 chirality), so a ring on the left ring finger becomes a ring on the right ring finger (`นิ้วนาง` maps to `นิ้วนาง`). A plain band is itself symmetric, so only the hand changes. Any engraving, stone or text would also flip and become a picture-only clue; visual note 2 already bans these. | supported (F004a) |
| 9 No reaction to "nearly nine" | See FC10 (acceptable) and FC08 (required sound fix). Red's and Pink's phones are not mentioned as clocks; nobody else is shown checking the time, so the gap stays small. | acceptable after FC08 |
| 10 Yellow's move | Moving is not a left/right swap; she has no side detail and states nothing false; `L01` allows exactly one copy; Green fails three times, and `CL03` cannot be explained by a human. **No consistent second solution.** Notes: FC12, FC13. | consistent |
| 11 Pink's reflection | Normal optics, not in words (visual note 5). | consistent |
| 12 Green's kindness | Never used as evidence; avoids PA04. | consistent |
| 13 Which hand touches Yellow | Narration names the ring finger, not a preferred hand. Not a handedness tell (CS03). | consistent |
| 14 `L37` vs Yellow | `ซ้ายขวาของใคร ไม่ตรงกัน` asks about body sides, not "who changed". Safe as long as her move is staged front/back (FC12). | consistent |

### Clue `CL04` and first-time solvability

- **Quotes match.** `L38` `ก่อนไฟดับอยู่นิ้วนางซ้าย` matches `L30` `นิ้วนางซ้าย`, and `ตอนแตะไหล่เสื้อเหลือง … นิ้วนางขวา` matches `L34`. `L30` says `แหวนวงใหม่`, while `L34`/`L38` say `แหวนแต่งงาน`. The link is clear from `เพิ่งแต่งงานเมื่อวาน`, so it is fine.
- **Solvable by a first-time viewer: yes.**
  - `CL03` needs no side memory: `บ่ายสามโมงตรง` (~9 s) against `เกือบเก้าโมง` (~53 s).
  - `CL04` is a near pair: about 30 s apart, with both side words spoken.
  - `L37` tells the viewer what to compare.
- **Editorial risk: difficulty, not fairness.** Three clues on one suspect, plus a recap that names the method, will make the puzzle easy for many viewers. That is acceptable for the format.

### Red herrings and clearings

| ID | Innocent explanation (spoken, before `L23`) | Satisfies the rule? |
| --- | --- | --- |
| RH01 Yellow | `L09` + `L29` fear, before the blackout; `L33` she went to the alarm | no (no side change) |
| RH02 Pink | `L12` at the mirror; `L20` past tense; `L04` thing in the mirror | no; also cleared by `CLR03` |
| CLR01 Red | `L28` call to his hospitalised mother | no: left → left |
| CLR02 Blue | `L16` dead phone; `L31` deadline | no: right → right |
| CLR03 Pink | — | no: right → right (`L19` clip change is consistent; gripping the clip is an anxious gesture, not a swap) |

### Recap and reveal (`L36`–`L39`)

| Line | Exact wording | Classification | Verdict | Note |
| --- | --- | --- | --- | --- |
| `L36` | `ทวนกฎอีกที… มันลอกจากเงาในกระจก ซ้ายกับขวาของมัน เลยสลับกัน` | fiction rule resting on F004a | supported (SRC018) | Repeats the second half of `L05` and all of `L06`; subject `มัน` (the copy). Not a general "mirrors swap left and right" claim. |
| `L37` | `ลองเทียบดู ก่อนไฟดับ กับหลังไฟติด… ซ้ายขวาของใคร ไม่ตรงกัน` | instruction to the viewer | true in-story; not an extra clue | Names the method, not a person, colour or object; only Green has a mismatch. It does not mention the clock, so the easiest clue stays the viewer's own find. FC12 for staging. |
| `L23` | unchanged | challenge | pass | FP06. |
| `L24`–`L26` | unchanged | reveal, F004a/F004b | supported (R2) | Wording unchanged from R2. `เมื่อกี้` in `L25` still fits (a few minutes of story time). |
| `L38` | `ส่วนแหวนแต่งงาน ก่อนไฟดับอยู่นิ้วนางซ้าย… ตอนแตะไหล่เสื้อเหลือง กลับอยู่นิ้วนางขวา` | in-story recap resting on F004a | supported | Quotes `L30`/`L34` correctly; third symptom of the one mistake (`L02`, `L25`). |
| `L39` | `แล้วคืนนี้… ใครจะกลับบ้านไปหาเมียของเสื้อเขียว` | fiction implication | not-factual | After the reveal, so no hidden clue; register and gender, see FC09. |

### F002, CS01–CS05, particles and vocabulary (all 39 lines)

- **F002:** consistent.
  - `L33` (Yellow keeps pressing the emergency button) and `L35` `เดี๋ยวก็มีคนมาช่วย` (wait for help) match SRC014.
  - Nobody pries or forces the doors (S02-B01 and S02-B05 events, visual note 7).
  - `L14` is panic, not a claim about air.
  - No spoken safety claim.
- **CS01:** pass. The alien is `จากนอกโลก`. Red's mother in hospital is a stake, not a sign.
- **CS02:** pass. All tells are established in this lift.
- **CS03:** pass.
  - `grep` of the 39 `> ` lines finds no `ครับ`, `ค่ะ`, `คะ`, `นะ`, `จ้ะ` or `จ้า`.
  - `ไหม` in `L22` is a neutral question word.
  - `ฉัน` is used by Yellow and Pink only, and no man uses a pronoun, the copy included.
  - Yellow's claustrophobia is stated, treated with empathy, and cleared.
- **CS04:** pass. Replacement is implied only, and `L39` states no violence.
- **CS05:** pass. No real building, maker or brand.
- **Game vocabulary:** none in the spoken lines, on-screen text or titles 1–5 (`ประชุม`, `โหวต`, `ท่อ`, impostor, "Among Us"). Title 5 "five strangers" matches the logline, and no line says they know each other.
- **Sound:** pass after FC08.
  - The alarm bell is a sound type; the phone crackle, shimmer and hum are fictional; there is no siren, crowd or casualty cue.
  - No sound marks `L17`, `L18`, `L34` or `L35`.
  - There is no clock tick.

### Fair play FP01–FP10 (104 s structure)

| Rule | Result |
| --- | --- |
| FP01 | Pass. All three clues and the rule are spoken before `L23`. |
| FP02 | Pass. Green is introduced at about 25 s and acts twice. |
| FP03 | Pass. The rule is given at about 15–18 s and recapped. |
| FP04 | Pass. |
| FP05 | Pass. `L13` and `L33` are true; no character lies. |
| FP06 | Pass. Recap, then challenge, then the 2.0 s pause. |
| FP08 | Pass. The reveal quotes the plants of all three clues, in story order. |
| FP09 | Pass. Each of `L17`, `L18` and `L34` contradicts an earlier stated fact. |
| FP10 | Pass after the existing visual notes 2, 3 and 5–6, plus FC11 (optional). |

### Thai readability (new and changed lines)

- **Clear at narrator pace:**
  - `L27`, `L28`, `L29`, `L31`, `L33`, `L35`, `L36`, `L38`: clear.
  - `L30` and `L32`: two facts each, joined naturally; the pause in `L32` helps.
  - `L21`: clear.
  - `L19`: clear, with `ไว้แน่น` at the end.
- **`L34` is the longest narration sentence** (about 20 syllables, three actions). It is readable, and the written pause before `สะท้อนแสงไฟ` helps. See FC11.
- **`L37` `ซ้ายขวาของใคร ไม่ตรงกัน`** is an embedded question and needs questioning intonation in the TTS read. Editor checks it at the voice lock. No wording change is needed.

### Timing (estimate only, not a fact issue)

- **My counts.** Syllables at about 5.5 syl/s, plus the written pauses:
  - S03-B01 is about 12.5 s, against 12.3 s allotted.
  - S03-B02 is about 21 s, against 20.5 s.
  - The new S01-B03 stakes match Preaw's figures within ±0.2 s each.
- **Totals.**
  - Before the +5% narrator pace: about **105–107 s**.
  - After the pace: about **100–102 s**.
  - Without `L39`: about −3.4 s.
  - Without `CL04`: about −11 s.
  - Each case stays inside 90–120 s.
- FC10 adds about 1.0 s if used. Do not lock frames from any estimate.

### Readiness

- **`AMG-SCRIPT-R3` as written:** `revision-required` (light). Only FC08 is required, and it is an exact sound-note replacement the coordinator may apply inline with a change-log line. After that the status is `ready-for-storyboard`, with "correction applied, recheck pending" until Boat's next scheduled recheck.
- **Dependencies on the user's answers:**
  - If the user drops `CL04` (Q2), the cut touches `L30`, `L34`, `L35` and `L38` and the clue ledger, and needs a short Boat recheck.
  - If `L39` is kept while `CL04` is dropped, keep `เพิ่งแต่งงานเมื่อวาน` in `L30` so that `L39` still has its plant.
  - A change to `L39` wording alone (FC09) needs no recheck beyond this review.
- **No user approval is implied.** Film is not authorized ([delivery.md](../delivery.md)), and timing is unverified until the voice lock.

## Recheck of AMG-SCRIPT-R4

- **Reviewer / date:** Boat, 2026-11-02 (Asia/Bangkok). Fresh pass on the exact R4 wording in [script.md](script.md), [recheck scope (R4)](script.md#boat-recheck-scope-r4). The R3 review above does not count as review of R4 wording.
- **Scope (changed lines only, per coordinator):** `L19`, `L34`; FC08 sound intents (S02-B01, S02-B03, S02-B04) and the general sound rules; Blue-no-reaction (S02-B03 event, Truth, edge case 9); Yellow staging (visual note 7, edge case 10); Yellow's clearance basis (RH01 row); the ring "no glint" note (S02-B05 event and sound intent); claim-mapping rows `L19`, `L34`, `L38`, `L30`; timing arithmetic. Re-test of the single-solution table. Not reopened: FC09 (`L39` keeps `เมีย`, user decision) and `CL04` (kept by the user); neither creates a factual or logic problem in R4.
- **Sources:** none needed. No changed line makes a real-world claim; `L34`/`L38` still rest on F004a (SRC018, inspected earlier today, not re-opened).

### Verdict

**Pass.** FC08, FC10, FC11, FC12 and FC13 are applied as written. The puzzle still has exactly one consistent solution (Green), and the new `L19` wording adds no clue. Two non-blocking production notes (RN03, RN04) and one timing note follow; none needs a script change before Film.

### FC application

| Fix | Where in R4 | Applied as written? |
| --- | --- | --- |
| FC08 | S02-B01: `… under S02-B01 to S02-B03, so no ring onset or stop marks Green's line.`; S02-B03: `Alarm bell keeps ringing, low and intermittent, under Pink's beat (no stop at the L18/L19 seam).`; S02-B04 opens `Alarm bell stops under L21 (Yellow has let go).`; sound rules: `no alarm onset or stop … stops under L21, FC08`; S02-B03 event `The alarm bell is still ringing, low (FC08).` | **yes, verbatim.** The stop under `L21` lands on an innocent's beat (Red) and before `L34`, so it marks neither Green line. Story logic holds: the alarm rings while Yellow presses (`L33`), stops when she lets go, and in S02-B05 she is crying, not pressing. |
| FC10 | `L19` `ทุกคนหันไปทางเสื้อชมพู… เธอจ้องกระจกไม่วางตา มือกำกิ๊บที่ผมข้างขวาไว้แน่น` | **yes, verbatim.** Blue-no-reaction is consistent across the S02-B03 event (no reaction shot, no frown, no `หา?`), Truth and edge case 9; the rejected openers are recorded as not used. |
| FC11 | `L34` `เสื้อเขียวเอื้อมมือไปแตะไหล่เสื้อเหลือง แหวนแต่งงานที่นิ้วนางขวา… ยังใหม่เอี่ยม` | **yes, verbatim.** No mirror word on the ring line; S02-B05 event says `no glint`, sound intent says no glint "ting"/shimmer; the change log records the removed "catches the light". |
| FC12 | Visual note 7 (front/back, depth axis, never screen left to right, reason given); edge case 10 staging sentence | **yes.** See RN03 for one adjacent sentence. |
| FC13 | RH01 payoff rests on `L09`, `L33`, `L37`, `L01` and Green's three failures; edge case 10 states `แทนที่` = replaced, not "stands on the spot" | **yes.** CS04's `ออกมาแทนที่` (replacement implied) is the correct sense. |
| FC09 | `L39` unchanged (`เมีย`) | not applied (user decision); no logic effect: `L30` `เพิ่งแต่งงานเมื่อวาน` remains its plant. |

### Changed-line claim table (exact R4 wording)

| Line | Exact wording | Classification | Verdict | Note |
| --- | --- | --- | --- | --- |
| `L19` | `ทุกคนหันไปทางเสื้อชมพู… เธอจ้องกระจกไม่วางตา มือกำกิ๊บที่ผมข้างขวาไว้แน่น` | in-story narration | not-factual; consistent | `หันไปทาง` is a direction toward a person, not a body side or a side of the lift. `CLR03` side words (`กิ๊บที่ผมข้างขวา`) kept; subject `เสื้อชมพู` still spoken. Names no reaction to Green. |
| `L34` | `เสื้อเขียวเอื้อมมือไปแตะไหล่เสื้อเหลือง แหวนแต่งงานที่นิ้วนางขวา… ยังใหม่เอี่ยม` | in-story narration (clue `CL04`) | not-factual; consistent | `ยังใหม่เอี่ยม` is true of the copy's ring too (a copy of a new band) and echoes `L30` `แหวนวงใหม่`; it adds no hint. |
| `L38` | unchanged | in-story recap resting on F004a | supported (SRC018) | Still quotes `L34` exactly: `ตอนแตะไหล่เสื้อเหลือง` ↔ `แตะไหล่เสื้อเหลือง`, `นิ้วนางขวา` ↔ `นิ้วนางขวา`; and `L30` `นิ้วนางซ้าย`. |
| `L30` | unchanged | character fact | not-factual | States where **this** man wears **his** ring; no custom claim (edge case 7). |

Claim-mapping rows `L19`, `L34`, `L38`, `L30` in the script match the above.

### Single-solution re-test (R4 wording)

| Suspect | Side check | Changed by R4? | Can be the copy? |
| --- | --- | --- | --- |
| Red | `L08` left → `L21` left: passes | no | no |
| Yellow | no side detail; position move only, staged front/back (FC12); clearance on `L09`, `L33`, `L37`, `L01`, Green's failures (FC13) | notes only | no |
| Green | `L10` left → `L17` right; `L30` left → `L34` right; `L18` `เกือบเก้าโมงแล้ว` vs `L03` 15:00 | `L34` tail only; side word `นิ้วนางขวา` unchanged | **yes, forced** |
| Blue | `L11` right → `L15` right: passes | no | no |
| Pink | `L32` right → `L19` right: passes (`CLR03`) | `L19` opener only; side word unchanged | no |

**Unique: Green.** `L19` introduces no new observable: it names no side, no time, no object and no person other than Pink. "Everyone turns" includes Green but gives him no distinct action, and the narration holds no reaction from Blue, so Green's answer is not marked.

### Particles and vocabulary (changed lines)

`L19` and `L34` contain no `ครับ`, `ค่ะ`, `คะ`, `นะ`, `จ้ะ` or `จ้า`, and no game vocabulary (`ประชุม`, `โหวต`, `ท่อ`, impostor, "Among Us"). A grep of all `> ` lines in R4 for these terms returns zero matches.

### Production notes (no script change required)

- **RN03 — Visual note 7 says Green keeps his S01 position "after the lights return", but S02-B05 has him step over to Yellow.** No logic issue: the step happens on screen, after `L18`, and is not a left/right swap. For Film/Mark clarity, optional exact replacement in visual note 7: replace `The others keep their S01 positions after the lights return, Green included.` with `The others keep their S01 positions when the lights return (S02-B01), Green included; Green's step to Yellow in S02-B05 happens on screen and, like Yellow's move, runs front/back, not across the lift.`
- **RN04 — `L19` `ทุกคน` and Red.** Red is narrated as turned into the corner in `L21`, right after "everyone turns to Pink". Read as simultaneous action this is fine (FC10 rationale). Staging: Mark may show Red glance toward Pink and turn back into the corner, or keep him at the frame edge; do not give him a featured reaction.

### Timing (estimate only, not a fact issue)

- Beat ranges are contiguous: 0–4.5, 4.5–18.7, 18.7–39.9, 39.9–48.6, 48.6–54.1, 54.1–61.7, 61.7–66.4, 66.4–72.6, 72.6–85.1, 85.1–106.1 s. Arithmetic checks: R3 104.4 + 1.0 (`L19`) + 0.2 (S03-B01) + 0.5 (S03-B02) = 106.1 s; without `L39` 102.8 s (−3.3 s, matching the cut order).
- My count for S02-B03 is a little higher than allotted: `L19` about 24 syllables (~4.4 s + ~0.4 s pause) plus whispered `L20` about 13 syllables (~3.5 s with pause) ≈ 8.3 s against 7.6 s. The `L19` opener adds about 6 syllables over R3 (~1.1 s + pause), so +1.0 s is slightly low.
- Total about **106–107 s** before the +5 % narrator pace, about **101–102 s** after; inside 90–120 s with margin. Do not lock frames from any estimate.

### Readiness

- **`AMG-SCRIPT-R4`: `ready-for-storyboard`.** No story- or knowledge-critical factual gap; the single solution holds; all required fixes applied. RN03/RN04 are production notes for Film/Mark, not gates.
- **Authorized scope (research → script → fact-check) is complete.** Next owner: none until the user authorizes Film (then Film, then Mark after the voice lock).
- Not user approval, not audio or visual validation. Timing is unverified until the voice lock.
