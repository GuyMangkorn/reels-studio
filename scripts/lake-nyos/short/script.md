# NYOS-EP01-SHORT — คืนที่ทะเลสาบหายใจออก

- Deliverable: `NYOS-EP01-SHORT` (Thai Short, 9:16, 1080×1920, 30 fps). Episode `lake-nyos`, single story scene. Beat IDs `NYOS-EP01-SHORT-B00`…`B13` (short form `B00`…`B13` in tables). All R1 beat IDs survive; none removed or merged.
- Script revision: **`NYOS-SCRIPT-R2`** (Preaw, 2026-10-31). Length trim of `NYOS-SCRIPT-R1` (≈17% fewer syllables), with a `B06` amendment the same day (user decision: local spirit belief `F024` instead of the bomb rumour `F023`). No new facts beyond `NYOS-RESEARCH-R1`. See [Change log](#change-log--open-questions).
- Delivery record: [../delivery.md](../delivery.md). Profile `channel-default` mystery-educational, named real case; voice Gemini TTS **Sulafat** (user pick, VS-R2); captions outline; ending **`B_loop`** (default).
- Research: [../research.md](../research.md) **`NYOS-RESEARCH-R1`** (Boat, 2026-10-30; lead-only snippets). Review of the previous revision: [fact-check.md](fact-check.md) `NYOS-FACTCHECK-R1` (`FC01`, `FC02` already applied in R1). R2 wording changes await Boat recheck (list below).
- Story mode: **named real case** (Lake Nyos limnic gas disaster, Cameroon, 21 Aug 1986). The "monster / something from the lake" is **the viewer's guess** (`F025`: no source), shown only inside a "จินตนาการ" frame in `B00`, `B05` and the `B07` cross-out (not `B06`, which is real-world belief) and explicitly replaced by the CO2 cloud in `B09`.
- Target: **at most 90 s total, including the `B13` loop hook and a ≈2 s closing hold** (user, 2026-10-31; supersedes 50–80 s). The user allows a somewhat faster voice (≈1.1×).
- **Estimate: ≈95.9–96.5 s at the VS-R3 Sulafat prompted pace → ≈87.2–87.7 s at 1.1× + ≈2 s hold ≈ 89.2–89.7 s total.** Margin under 90 s is only ≈0.3–0.8 s; reserve trims are listed in the [timing note](#timing-note-estimated).
- Timing status: **estimated** (scaled per beat from the measured VS-R3 read of R1, `measure-vo-vs-r3.json`). R2 itself has not been read aloud or TTS-tested.
- Factual review: R2 recheck pending (Boat). User approval: none. User choice kept: `ALT-B` as `B00` (2026-10-30).

## Story core

- **Logline:** One night in 1986, about 1,700 people around a quiet crater lake in Cameroon died, many in their sleep. Houses stood, trees were fine, but cattle, birds and insects died too. The viewer is invited to guess a monster or something that rose from the lake. Something did rise from the lake: the deep water flipped and released the CO2 stored in it, which flowed down the valleys like an invisible river.
- **Central question (hook):** if something came up from the lake behind your village tonight, would you know? → what killed about 1,700 people in one night without breaking anything?
- **Intention / obstacle:** the viewer (standing in for survivors and investigators) wants to name the killer. Obstacles: nothing is broken, and the obvious suspects (a monster, a bomb) are only guesses. Local belief (lakes have spirits, `F024`) is reported as context, not as a suspect. The test: which suspect could also kill birds and insects while leaving houses untouched?
- **Intended feeling:** quiet dread → a shiver at the imagined thing rising from the lake → the click of "it *was* something from the lake, just not a creature" → respect and unease at the ending question.
- **Learning takeaway:**
  1. A deep crater lake can store CO2 from magma in its deep water, held down like a capped soda bottle.
  2. When the water overturned, the gas came out at once; nobody knows for sure what triggered it.
  3. CO2 is heavier than air, so it flowed down valleys like an invisible river and suffocated people and animals (reach shown on screen as "หลาย กม.", no longer spoken).
  4. Since 2001, pipes let Nyos release its gas slowly.

## Truth and ending

- **What happened (per `NYOS-RESEARCH-R1`, snippet-level):** on the night of 21 Aug 1986 (`F001`), survivors reported a rumble from Lake Nyos (`F002`). Mostly-CO2 gas stored in the lake's deep water was released and killed about 1,700 people by asphyxiation (`F003`, `F008`); the CO2 is magmatic, with no significant direct volcanic activity (`F009`). Thousands of livestock, birds and insects died; houses and plants were not damaged (`F004`, `F005`). The gas flowed down valleys (`F007`, `F013`). The lake turned red-brown afterwards (`F015`). Bomb rumours and supernatural explanations followed (`F023`); regional lore treats lakes as homes of spirits (`F024`). Degassing pipes since 2001 (`F021`).
- **Kept uncertain or unused:**
  - Trigger: stated as unknown (`B10`, `F011`). No landslide/rain/quake named.
  - No volcano eruption wording (`F009`). No gas tonnage, cloud speed, fountain height, lake-level drop, depth or distance figure (`F010`, `F012`–`F014`, `FC01`).
  - Deaths "ราว 1,700" only (`F003`); livestock "หลายพันตัว" (`F004`).
  - "หลายคนหลับไปแล้ว ไม่ตื่นอีกเลย" is "many", not all (`F018`).
  - **Dropped in R2 (trim, not a factual ruling):** survivors not knowing what happened (`F023` key conclusion 4), the bomb and "secret weapon" rumours (`F023`; bomb dropped by the 2026-10-31 user decision, `B07` keeps "ระเบิด" only as a narrator hypothetical), and the spoken distance "หลายกิโลเมตร" (`F007`, on-screen only now).
  - Smell reports (`F016`), flames going out (`F017`), skin lesions (`F019`), Monoun (`F020`), named villages beyond Nyos (`F006`), insect silence and named survivors: **not used**.
  - `F024` used generically (`B06`): no named Nyos legend, spirit or chief; no claim that the lore records real eruptions (low confidence). No country named anywhere.
  - Lake Kivu (`F022`): named on screen only; spoken as "อีกทะเลสาบที่ใหญ่กว่ามาก", "มีคนอยู่รอบ ๆ นับล้าน", "ก็มีก๊าซอัดอยู่ที่ก้น", then a hypothetical question. No risk size or extraction claim.
- **Ending (`B_loop`):** the reveal and knowledge land in `B09`–`B12`. `B13` turns to Kivu and closes on "แล้วถ้าวันหนึ่ง มันหายใจออกล่ะ?". The loop seam returns to `B00` "ถ้าคืนนี้… อะไรสักอย่างขึ้นมาจากทะเลสาบหลังหมู่บ้านคุณ…", which reads as the continuation of that question: the still lake at the end becomes the still lake behind your village ([loop-friendly writing](../../../docs/scriptwriting-principles.md#loop-friendly-writing)). Hold the closing line ≈2 s on the still Kivu surface; keep the final ≈0.5 s free of speech.

## Beat list

Story-world time runs from the night of 21 Aug 1986 to the morning after, then to the investigation, 2001 and today. Video time is estimated **at 1.1× of the VS-R3 pace**, including the measured inter-beat gaps (per-beat scaling, see timing note).

| Beat | Est. video time (1.1×) | Purpose | Causal link / what changes |
| --- | --- | --- | --- |
| `B00` | 0.0–5.6 s | Imagined hook: something from the lake behind your village | Opens the question; loop target of `B13` |
| `B01` | 5.6–12.7 s | Anomaly + death toll | Grounds the hook in the real event |
| `B02` | 12.7–19.1 s | Year, place, first clue (rumble from the lake) | Plants the lake as sound source (`CL01`) |
| `B03` | 19.1–25.3 s | Morning: animals dead, even birds and insects | Plants `CL02` (everything that breathes died) |
| `B04` | 25.3–28.7 s | Nothing broken | Plants `CL03` (no destruction); raises the mystery |
| `B05` | 28.7–36.9 s | Imagination: viewer's guesses, ending on "something from the lake" | Misdirection toward a creature; plants double-meaning `CL04` |
| `B06` | 36.9–40.2 s | Local belief: lakes have spirits (`F024`), framed as belief | Real-world context that also looks toward the lake; not a suspect and not tested in `B07` |
| `B07` | 40.3–46.6 s | Test: rule out suspects with the clues | `CL02` rules out a monster; `CL03` rules out a bomb (now a narrator hypothetical, see `B07`) |
| `B08` | 46.6–51.3 s | New clue: the lake turned red-brown | Points the investigation at the lake (`CL05`) |
| `B09` | 51.3–59.0 s | Reveal: deep water flipped up with CO2 | Replaces the monster with the gas; pays off `CL01`, `CL04`, `CL05` |
| `B10` | 59.0–66.8 s | Knowledge: magma CO2 stored like soda; trigger unknown | Explains where the killer came from |
| `B11` | 66.8–74.0 s | Knowledge: heavier than air, invisible river | Explains `CL02`/`CL03` (why everything that breathed died, why houses stood) |
| `B12` | 74.0–78.9 s | Payoff: pipes since 2001 let the lake breathe out slowly | Consequence; sets up the "breathing" metaphor for the loop |
| `B13` | 78.9–87.7 s VO + ≈2 s hold | Loop hook: a much bigger lake with gas at its bottom | Question returns to `B00` |

## Full spoken script

VO is the exact narration text for TTS. Subtitles split the VO into cues without changing words; numbers are written as digits ("1,700", "1986", "2001"). "…" marks a short pause (≈0.3–0.6 s). On-screen labels are not spoken.

### NYOS-EP01-SHORT-B00 · 0.0–5.6 s (est.) — imagined hook (`ALT-B`, user choice 2026-10-30)

**VO:**
> ถ้าคืนนี้… อะไรสักอย่างขึ้นมาจากทะเลสาบหลังหมู่บ้านคุณ… คุณจะรู้ตัวไหม?

- On-screen: label **"จินตนาการ"** (visible for the whole beat; fiction, not the 1986 event).
- Visual intent: a calm night lake behind a painted village; a slow ripple spreads from the centre. No creature shown, no people.
- **Sound intent:** quiet night ambience; one soft low swell on "อะไรสักอย่าง", cut to near-silence on "คุณจะรู้ตัวไหม?". Fiction sound only. Loop pair: `B13` "…มันหายใจออกล่ะ?" → `B00` "ถ้าคืนนี้…"; the ambience here must match the `B13` tail.
- Claim: hypothetical question to the viewer (`F025`, fiction); no factual claim.

### NYOS-EP01-SHORT-B01 · 5.6–12.7 s (est.) — death toll

**VO:**
> คนราว 1,700 คน… ตายในคืนเดียว หลายคนหลับไปแล้ว… ไม่ตื่นอีกเลย

- On-screen: none beyond subtitles (the number carries the beat).
- Visual intent: a painted night village on a hillside, oil-lamp windows going dark one by one. No people, no bodies. A dark lake shape sits at the top of the frame, unremarked.
- **Sound intent:** near-silence: faint night ambience (soft wind, distant crickets); a low, sparse drone enters on "หลายคนหลับไปแล้ว". No stinger.

### NYOS-EP01-SHORT-B02 · 12.7–19.1 s (est.) — year, place and first clue

**VO:**
> ปี 1986… มีคนเล่าว่า ได้ยินเสียงครืน จากทะเลสาบนีออส

- On-screen: **"แคเมอรูน · แอฟริกา"** (country now on screen only), **"21 ส.ค. 1986"**, small label **"ทะเลสาบนีออส"** on the lake.
- Visual intent: quick map pin (Cameroon in Africa) dissolving into a quiet crater lake ringed by hills, villages below in the valleys. A faint ripple on the water on "เสียงครืน".
- **Sound intent:** low drone continues. A short, soft low rumble on "เสียงครืน" (reconstructed; ≈1–1.5 s, no bang), distant and muffled.

### NYOS-EP01-SHORT-B03 · 19.1–25.3 s (est.) — morning, everything that breathes

**VO:**
> เช้ามา… วัวล้มตายหลายพันตัว แม้แต่นกกับแมลงก็ตาย

- Visual intent: grey dawn over a pasture; cattle only as distant still silhouettes in a wide shot; a few fallen birds as small shapes in the grass. No close-ups of bodies.
- **Sound intent:** drone thins; ambience drops to a cold, airless room tone (no birdsong).

### NYOS-EP01-SHORT-B04 · 25.3–28.7 s (est.) — nothing broken

**VO:**
> แต่บ้านไม่พัง… ต้นไม้ก็ไม่เป็นอะไร

- Visual intent: houses intact, doors closed, green trees and maize untouched under morning light (village scope, not the lake shore, per `NYOS-FACTCHECK-R1` on `F005`): an eerily normal picture. A lone survivor's back in silhouette in a doorway (no face, no named person).
- **Sound intent:** a soft single low piano note or pad swell on "ต้นไม้ก็ไม่เป็นอะไร", then hold ≈0.5 s.

### NYOS-EP01-SHORT-B05 · 28.7–36.9 s (est.) — imagination (viewer's guesses)

**VO:**
> ถ้าให้เดา… อะไรฆ่าพวกเขา? สัตว์ประหลาด? หรือ… อะไรสักอย่าง ที่ขึ้นมาจากทะเลสาบ?

- On-screen: **"จินตนาการ"** label for the whole beat; question card optional ("สัตว์ประหลาด?").
- Visual intent: switch to the charcoal imagination treatment. Glowing eyes in the dark tree line ("สัตว์ประหลาด?"); then a huge dark shape rising from the lake surface ("ขึ้นมาจากทะเลสาบ"). The creature is never shown attacking anyone or near a person. R2 drops the "สิ่งที่มองไม่เห็น?" guess and its shimmer image.
- **Sound intent:** riser builds through the two guesses; a deep, wet low swell (designed, fictional) under the lake shape, only inside the "จินตนาการ" window. Cut to near-silence on the final question mark.

### NYOS-EP01-SHORT-B06 · 36.9–40.2 s (est.) — local belief (amended 2026-10-31, user decision)

**VO:**
> ชาวบ้านเชื่อว่า… ทะเลสาบมีวิญญาณ

- On-screen: **"ความเชื่อท้องถิ่น"** small tag (keeps it a reported belief, not a finding and not the narrator's claim).
- Content boundary (`F024`): generic Grassfields lake belief only. No named Nyos legend, spirit, chief or ritual; no claim that the belief records past eruptions (low confidence); no bomb or weapon rumour (`F023` dropped by user decision).
- Visual intent: out of the charcoal "จินตนาการ" treatment, back to the painted real-event look: the still lake at dusk below green hills, seen calmly from the village side, perhaps one or two villagers' backs at a respectful distance looking toward it (no faces, no named people, no costume or ritual detail invented). **No spirit figure, glow, eyes or creature** (keeps the belief separate from the viewer's monster), and **no haze or mist** (haze stays hidden until `B09`). The tone is reverent, not spooky.
- **Sound intent:** the `B05` riser is already cut to near-silence; enter a warm, low sustained pad (soft, unhurried, minor but not threatening) with faint evening lake ambience (light water lapping, distant wind). No whispers, ghostly effects, horror stinger or reverse cymbal: the belief must not be scored as a scare. The tense pulse starts in `B07`.

### NYOS-EP01-SHORT-B07 · 40.3–46.6 s (est.) — test the suspects

**VO:**
> ถ้าเป็นสัตว์ประหลาด… ทำไมนกกับแมลงถึงตายด้วย? ถ้าเป็นระเบิด… ทำไมบ้านไม่พัง?

- On-screen: the suspect cards get crossed out one by one: "สัตว์ประหลาด ✕", "ระเบิด ✕". The "จินตนาการ" creature card fades on its cross-out.
- Story logic (amended 2026-10-31): with the rumour gone from `B06`, "ถ้าเป็นระเบิด…" is the narrator's own hypothetical, introduced and ruled out by `CL03` in the same line; no factual claim that anyone suspected a bomb is made. Do not tag the "ระเบิด" card "ข่าวลือ". **The `B06` belief gets no card and is never crossed out** (belief is not a suspect to debunk).
- Visual intent: callback inserts of `B03` (birds, insects) and `B04` (intact houses) beside each crossed card.
- **Sound intent:** two dry tick/stamp hits on the cross-outs; music pulls to a tense, quiet pulse.

### NYOS-EP01-SHORT-B08 · 46.6–51.3 s (est.) — the lake clue

**VO:**
> เบาะแสอยู่ที่ทะเลสาบ… หลังคืนนั้น น้ำเปลี่ยนเป็นสีแดงอมน้ำตาล

- Visual intent: slow push toward the lake, its surface now rust red-brown against green hills (`F015`; do not present degassing-era photos as 1986).
- **Sound intent:** pulse stops; a low sustained tone swells (short pre-reveal riser).

### NYOS-EP01-SHORT-B09 · 51.3–59.0 s (est.) — reveal

**VO:**
> สีนั้นมาจากน้ำก้นทะเลสาบ ที่พลิกขึ้นมา… พร้อมกับฆาตกรตัวจริง ไม่ใช่สัตว์ประหลาด… แต่คือก๊าซ คาร์บอนไดออกไซด์

- On-screen: **"CO₂ (คาร์บอนไดออกไซด์)"** label on the cloud.
- Visual intent: cutaway of the lake: dark deep layer rolling up to the surface. Reprise the `B05` imagined lake shape for ≈1 s in charcoal, and it **dissolves into a pale, low CO2 haze** (diagrammatic, labelled). From here no creature appears again.
- **Sound intent:** reveal hit on "ฆาตกรตัวจริง" (soft low impact, no explosion); the imagined swell from `B05` reverses/dissolves into a breathy whoosh. Music resolves into a clearer, still-dark motif.
- TTS note: the space in "ก๊าซ คาร์บอนไดออกไซด์" is a deliberate micro-pause so the long word is read on its own; subtitles keep it as one phrase.

### NYOS-EP01-SHORT-B10 · 59.0–66.8 s (est.) — where the gas came from

**VO:**
> มันซึมมาจากแมกมา สะสมในน้ำลึก เหมือนน้ำอัดลมที่ปิดฝาไว้ แต่อะไรทำให้น้ำพลิก… ยังไม่มีใครรู้แน่

- On-screen: **"เปรียบเทียบ"** tag on the soda bottle (analogy label); **"ตัวจุดชนวน: ยังไม่รู้แน่"** on the last line.
- Visual intent: cross-section diagram: magma deep below, bubbles seeping up through the lakebed into a dark bottom layer under lighter water. Side insert of a capped soda bottle. On the trigger line: a question mark over the lake, no landslide/rain/quake drawn.
- **Sound intent:** light, curious low bed (explainer energy, minor key); a faint fizz on "น้ำอัดลม"; drop to near-silence on "ยังไม่มีใครรู้แน่".

### NYOS-EP01-SHORT-B11 · 66.8–74.0 s (est.) — the invisible river

**VO:**
> ก๊าซนี้หนักกว่าอากาศ จึงไหลลงหุบเขา เหมือนแม่น้ำที่มองไม่เห็น… ทำให้คนและสัตว์ขาดอากาศหายใจ

- On-screen: **"หนักกว่าอากาศ"**; distance marker **"หลาย กม."** along a valley line (carries the reach that R2 no longer speaks).
- Visual intent: night map/terrain view: a faint, diagrammatic haze pours off the crater rim and runs down valleys toward the villages, hugging the ground, roofs above it untouched. Lamps dim as it passes (mood only; no flame-going-out moment). End on the village from `B01` under the haze.
- **Sound intent:** low rushing/flowing air texture (reconstructed, under the voice); music low and sorrowful on "ขาดอากาศหายใจ", then a short silence (≈0.5 s).

### NYOS-EP01-SHORT-B12 · 74.0–78.9 s (est.) — payoff: breathing slowly

**VO:**
> ตั้งแต่ปี 2001 ทะเลสาบนี้มีท่อดึงก๊าซขึ้นมา ให้มันค่อย ๆ หายใจออก

- On-screen: **"ท่อระบายก๊าซ"** on the pipe; **"2001"**; **"ทะเลสาบนีออส"** small label (the spoken name is now "ทะเลสาบนี้").
- Visual intent: daylight; a raft on the lake with a pipe sending up a thin fountain of water and gas; calm, recovered hills.
- **Sound intent:** music lifts slightly to a calm, hopeful-but-cautious tone; gentle steady hiss of the fountain (designed).

### NYOS-EP01-SHORT-B13 · 78.9–87.7 s VO (est.) + ≈2 s hold — loop hook (`B_loop`)

**VO:**
> แต่อีกทะเลสาบที่ใหญ่กว่ามาก มีคนอยู่รอบ ๆ นับล้าน ก็มีก๊าซอัดอยู่ที่ก้น… แล้วถ้าวันหนึ่ง มันหายใจออกล่ะ?

- On-screen: **"ทะเลสาบคิวู · รวันดา / คองโก"** label (not spoken).
- Visual intent: wide, much larger lake at dusk with lights of towns along its shore; slow push down beneath the surface into dark water. Hold on the still, dark surface (closing line on screen ≈2 s), then the `B_loop` seam returns to `B00`'s calm night lake behind the village. No monster, no countdown, no disaster imagery.
- **Sound intent:** music falls away to the same faint night ambience as `B00`; one very low, slow "breath" swell under the final question, then silence into the seam. No stinger (keeps the loop smooth).

## Alternative hook options

- **`ALT-B`** is in the script as `B00` (user choice 2026-10-30); R2 changes only "อะไรบางอย่าง" → "อะไรสักอย่าง".
- **`ALT-A`** (not chosen; would replace `B01`) is unchanged from R1 with `FC03` applied: "ฆาตกรรายนี้… มองไม่เห็น ไม่พังบ้านสักหลัง แต่ในคืนเดียว มันคร่าชีวิตคนไปราว 1,700 คน". It adds ≈+1.3 s at R1 estimates and does not fit the R2 budget without another trim.

## Sound / story events (summary for Film, Editor)

- **No real recording** of the event exists in the research; every rumble, flow and breath is **reconstructed/designed**. Show "เสียงจำลอง" if the `B02` rumble could be mistaken for a real recording.
- **Fiction sounds** (the imagined creature's swell) play only inside the `B00` and `B05` "จินตนาการ" windows and the ≈1 s reprise/dissolve in `B09`; never under real-event narration otherwise.
- **No** explosion, siren, scream, gunshot, crowd panic, animal cries or military sounds anywhere.
- **No clue lives only in sound:** the rumble (`CL01`) is spoken; all other clues are spoken and shown.
- **Music:** one sparse, low, minor-key bed family: `B00`–`B04` low drone; `B05` build (riser) → silence; `B06` warm, reverent low pad + lake ambience (no scare cues); `B07`–`B08` tense pulse; `B09` impact and resolve; `B10`–`B11` explainer/sorrowful low; `B12` slight lift; `B13` fall to `B00`'s night ambience for the loop. Duck under voice. Check the shared sound library first.

## Clue ledger

All clues are real evidence (snippet-level in `NYOS-RESEARCH-R1`). The creature is fiction and is not a clue. R2 keeps all five clues; each is still spoken before the reveal in `B09`.

| ID | Plant (beat) | Observable information | Initial interpretation | Post-reveal interpretation | Payoff |
| --- | --- | --- | --- | --- | --- |
| `CL01` | `B02` | A rumble reported from the lake that night | Something stirring in or at the lake (creature?) | The deep water overturning and releasing gas | `B09` |
| `CL02` | `B03` | Cattle, birds and even insects died | A monster or poison? | Only something in the air kills everything that breathes; rules out a monster | `B07`, `B11` |
| `CL03` | `B04` | Houses and trees undamaged | No attacker broke in; rules out a bomb | A gas flow suffocates without breaking anything | `B07`, `B11` |
| `CL04` | `B00`, `B05` (double meaning) | "อะไรสักอย่าง ที่ขึ้นมาจากทะเลสาบ" | A monster rising from the water (imagination) | Literally true: the CO2 came up out of the lake | `B09` |
| `CL05` | `B08` | The lake turned red-brown afterwards | The lake is involved, somehow | Deep bottom water was flipped up to the surface, carrying the gas | `B09` |

Fairness check: the viewer has `CL02` + `CL03` (rules out the two suspects in `B07`), `CL01` + `CL05` (point at the lake) and `CL04` (the wording itself) before `B09` names the gas. The R2 removal of the "สิ่งที่มองไม่เห็น?" guess loses a soft hint, not a clue; "มองไม่เห็น" now first appears in `B11`, after the reveal.

## Claim mapping

Status: **R2 recheck pending (Boat)**. Rows marked **R2-changed** have new wording; unmarked rows are unchanged from R1 and were graded in `NYOS-FACTCHECK-R1`. All sources lead-only (snippets).

| Beat | Factual sentence (Thai) | Claim | Sources | Notes |
| --- | --- | --- | --- | --- |
| B00 | hypothetical question to the viewer | F025 (fiction) | none | **R2-changed** (fiction): "อะไรบางอย่าง" → "อะไรสักอย่าง"; "จินตนาการ" label. |
| B01 | "คนราว 1,700 คน… ตายในคืนเดียว" | F003, F001 | SRC001, SRC011 | supported (snippet), FACTCHECK-R1. |
| B01 | "หลายคนหลับไปแล้ว… ไม่ตื่นอีกเลย" | F018 | SRC012 | supported (snippet). |
| B02 | "ปี 1986" + labels "21 ส.ค. 1986", "แคเมอรูน · แอฟริกา" | F001 | SRC001, SRC002, SRC011 | **R2-changed**: "ที่แคเมอรูน" moved from VO to label; label "แอฟริกาตะวันตก" → "แอฟริกา" (Boat's optional note). |
| B02 | "มีคนเล่าว่า ได้ยินเสียงครืน จากทะเลสาบนีออส" | F002 | SRC011, SRC006, SRC015 | **R2-changed**: "คืนนั้น บางคนเล่าว่า … ดังมาจาก" → "มีคนเล่าว่า … จาก". Still framed as a report; the night is set by `B01`. |
| B03 | "วัวล้มตายหลายพันตัว" | F004 | SRC016, SRC012 | `FC02` applied in R1. |
| B03 | "แม้แต่นกกับแมลงก็ตาย" | F005 | SRC011 | medium. |
| B04 | "แต่บ้านไม่พัง… ต้นไม้ก็ไม่เป็นอะไร" | F005 | SRC011, SRC019 | **R2-changed** (particle "ก็" only). Sentence "คนที่รอดก็ไม่รู้ว่าเกิดอะไรขึ้น" (F023) **removed**. |
| B05 | viewer's guesses (monster, something from the lake) | F025 (fiction) | none | **R2-changed** (fiction): "สัตว์ร้าย" → "สัตว์ประหลาด"; guess "สิ่งที่มองไม่เห็น?" removed; "อะไรบางอย่าง" → "อะไรสักอย่าง". |
| B06 | "ชาวบ้านเชื่อว่า… ทะเลสาบมีวิญญาณ" + tag "ความเชื่อท้องถิ่น" | F024 (folklore) | SRC009 | **R2-changed (B06 amendment, 2026-10-31)**: replaces "ตอนนั้นมีข่าวลือว่าเป็นระเบิด" (F023, removed by user decision). Reported belief, generic; no Nyos-specific legend. Boat: confirm (a) "ชาวบ้าน" (locals of the Nyos area) is a fair reading of a Grassfields regional belief, vs research's "ในความเชื่อท้องถิ่น ทะเลสาบบางแห่ง…" (dropped "บางแห่ง" for length); (b) whether `F023`'s reported supernatural explanations (SRC010) also support it. |
| B07 | "ถ้าเป็นสัตว์ประหลาด… ทำไมนกกับแมลงถึงตายด้วย? ถ้าเป็นระเบิด… ทำไมบ้านไม่พัง?" | F005 (reasoning); bomb = narrator hypothetical | SRC011 | Text unchanged by the B06 amendment, but "ระเบิด" no longer has a spoken origin: it is now a hypothetical, not a report of `F023`. **R2-changed** (wording only): "แต่" dropped, "สัตว์ร้าย" → "สัตว์ประหลาด", "ถึงไม่พัง" → "ไม่พัง". |
| B08 | "หลังคืนนั้น น้ำเปลี่ยนเป็นสีแดงอมน้ำตาล" | F015 | SRC017, SRC012 | supported (snippet), medium. |
| B09 | "สีนั้นมาจากน้ำก้นทะเลสาบ ที่พลิกขึ้นมา" | F015, F010 | SRC017, SRC012 | **R2-changed**: "ที่ถูกพลิกขึ้นมา" → "ที่พลิกขึ้นมา" (intransitive; no implied agent, consistent with the unknown trigger). |
| B09 | "พร้อมกับฆาตกรตัวจริง ไม่ใช่สัตว์ประหลาด… แต่คือก๊าซ คาร์บอนไดออกไซด์" | F008 | SRC001 | **R2-changed**: "และมันพาฆาตกรตัวจริงขึ้นมาด้วย" → "พร้อมกับฆาตกรตัวจริง" (the gas came up with the deep water). high. |
| B10 | "มันซึมมาจากแมกมา สะสมในน้ำลึก" | F008, F009 | SRC001, SRC008 | **R2-changed**: "ก๊าซนี้" → "มัน"; "ใต้ดิน" dropped (Boat: trim 1 stays supported); "ในน้ำก้นทะเลสาบ" → "ในน้ำลึก". Boat: confirm "น้ำลึก" is an acceptable simplification of the bottom layer. |
| B10 | "เหมือนน้ำอัดลมที่ปิดฝาไว้" | F010 | — | Analogy, labelled. |
| B10 | "แต่อะไรทำให้น้ำพลิก… ยังไม่มีใครรู้แน่" | F011 | SRC008 | **R2-changed**: "ส่วน" → "แต่", "คืนนั้น" dropped. |
| B11 | "ก๊าซนี้หนักกว่าอากาศ จึงไหลลงหุบเขา เหมือนแม่น้ำที่มองไม่เห็น" | F013 | SRC012, SRC015 | **R2-changed** ("มันจึง" → "จึง"). "มองไม่เห็น" supported for the valley flow. |
| B11 | label "หลาย กม." | F007 | SRC012, SRC011 | **R2-changed**: VO "ไปไกลหลายกิโลเมตร" removed; reach stays on screen only. |
| B11 | "ทำให้คนและสัตว์ขาดอากาศหายใจ" | F008 | SRC001 | unchanged. |
| B12 | "ตั้งแต่ปี 2001 ทะเลสาบนี้มีท่อดึงก๊าซขึ้นมา ให้มันค่อย ๆ หายใจออก" | F021 | SRC004, SRC005 | **R2-changed**: "ทะเลสาบนีออส" → "ทะเลสาบนี้" (+ label), "คอยดึง" → "ดึง", "ทีละนิด" dropped. Present tense as in R1 (post-2020 status not inspected). |
| B13 | "แต่อีกทะเลสาบที่ใหญ่กว่ามาก มีคนอยู่รอบ ๆ นับล้าน ก็มีก๊าซอัดอยู่ที่ก้น" + label "ทะเลสาบคิวู" | F022 | SRC013, SRC020 | **R2-changed** (word order): "ก้นของมันก็มีก๊าซอัดอยู่" → "ก็มีก๊าซอัดอยู่ที่ก้น". Same content. |
| B13 | "แล้วถ้าวันหนึ่ง มันหายใจออกล่ะ?" | — | — | unchanged; hypothetical, ok in FACTCHECK-R1. |

## Film → Mark handoff (script-only scope; Film/Mark not invoked)

Constraints any later visual pass must keep:

- **Hidden until `B09`:** the word CO2/ก๊าซ and any visible haze. The lake may be present from `B00` but not shown as the cause before `B08`.
- **Creature:** only inside "จินตนาการ" (`B05`, crossed out in `B07`, ≈1 s dissolve in `B09`; `B00` shows no creature), in the charcoal treatment; never attacking or near a person; never shown again after `B09`.
- **R2 shot impact for Film/Mark:** `B05` "สิ่งที่มองไม่เห็น?" shimmer image removed; `B06` (amended 2026-10-31) is now the local-belief beat: calm dusk lake, tag "ความเชื่อท้องถิ่น", no newspaper/whisper rumour imagery, no spirit figure, no haze; `B07` "ระเบิด" card is untagged; `B02` country is label-only; `B11` "หลาย กม." label now carries the reach; `B12` adds a "ทะเลสาบนีออส" label; the loop seam target is `B00`'s lake, not `B01`'s village.
- **Respect:** no corpses in close-up, no gore, no skin lesions, no screaming faces, no named survivors, no country/flag anywhere; the `B06` belief is never shown as spooky, depicted as a figure, or crossed out.
- **No flames-going-out moment** (`F017` unsourced); no explosion, eruption or lava (`F009`).
- **Continuity:** `B01` night village = `B11` end village; `B13` hold must cut cleanly back to `B00`'s night lake.
- **Labels:** "จินตนาการ" (`B00`, `B05`), "ความเชื่อท้องถิ่น" (`B06`), "เปรียบเทียบ" (`B10`), "เสียงจำลอง" if needed (`B02`).

## Timing note (estimated)

**Method.** Per-beat seconds-per-syllable from the measured VS-R3 read of R1 (Sulafat, prompted pace; speech span per beat in `measure-vo-vs-r3.json`), applied to the R2 syllable counts; the measured inter-beat gaps (8.7 s total) are kept. A global-rate check (0.280 s/syllable) gives nearly the same result.

**Syllables (R1 → R2):** B00 22→22, B01 20→20, B02 31→22, B03 17→17, B04 21→11, B05 28→23, B06 18→10 (B06 amendment; was 9), B07 24→22, B08 18→18, B09 37→32, B10 40→32, B11 35→28, B12 28→22, B13 34→32 → **373 → 311 (−16.6%)**.

| | VS-R3 pace (1.0×) | at 1.1× | + ≈2 s hold |
| --- | --- | --- | --- |
| R1 measured | 113.2 s | ≈102.9 s | ≈105 s |
| R2 estimate (with `B06` amendment) | ≈95.9–96.5 s | ≈87.2–87.7 s | **≈89.2–89.7 s** |

At 1.0× (no speed-up) R2 would run ≈98 s with the hold, over the cap; it relies on the ≈1.1× voice.

**Reserve trims** (margin is ≈0.5–1 s; apply in order if the R2 read runs long; each touches a claim line, so Boat rechecks it):
1. Editor tightens the long early inter-beat gaps (`B00`–`B07` gaps ≈0.9 s each in VS-R3) toward ≈0.5 s: ≈−2 s, no text change.
2. `B06` cut entirely (−10 syllables and one gap ≈−3 s at 1.1×). Loses the local belief (`F024`), which the user asked for; ask before using.
3. `B02` drop "ปี 1986…" from VO, keep the "21 ส.ค. 1986" label (−8 ≈−2 s at 1.1×).

**Checks for the read:** "1,700" → "หนึ่งพันเจ็ดร้อย"; "1986", "2001" as full years; "นีออส" (not "ไนออส"); "อะไรสักอย่าง" (replaces the mis-heard "อะไรบางอย่าง"); "สัตว์ประหลาด" (replaces "สัตว์ร้าย", which was heard as "สัปรา"/"สัดร้าย"; "สัด" is a homophone, so an ASR spelling alone is not a mis-read); "ก๊าซ คาร์บอนไดออกไซด์" clean (still the only correct spoken term; the pause is the mitigation). `B05` questions need rising intonation; the `B13` question must sound open, not cheerful.

## Change log / open questions

- **`NYOS-SCRIPT-R2` (Preaw, 2026-10-31):** length trim to fit ≤90 s incl. hold (user, 2026-10-31). No new facts; no beat removed or merged (`B00`–`B13` all survive). Changes:
  - Word swaps for the voice checks: "อะไรบางอย่าง" → "อะไรสักอย่าง" (`B00`, `B05`, `CL04`); "สัตว์ร้าย" → "สัตว์ประหลาด" (`B05`, `B07`, `B09`; also fits the user's "much scarier creature" note); "ก๊าซคาร์บอนไดออกไซด์" → "ก๊าซ คาร์บอนไดออกไซด์" (pause only).
  - Removed content: `B04` "คนที่รอดก็ไม่รู้ว่าเกิดอะไรขึ้น" (F023); `B05` guess "สิ่งที่มองไม่เห็น?"; `B06` "อาวุธลับ" and "ความเชื่อเรื่องวิญญาณ" (F024); `B11` spoken "ไปไกลหลายกิโลเมตร" (F007, label kept); `B02` spoken "ที่แคเมอรูน" (label kept); `B12` "ทีละนิด".
  - Rewordings: `B02`, `B07`, `B09`, `B10`, `B11`, `B12`, `B13` as listed in the claim mapping (**R2-changed** rows).
  - Loop seam target: `B00` (was `B01` before `ALT-B` became `B00`).
  - **Boat recheck scope:** every **R2-changed** row; priority `B06` (now the `F024` belief wording, see amendment below), `B09` ("ที่พลิกขึ้นมา… พร้อมกับฆาตกรตัวจริง"), `B10` ("สะสมในน้ำลึก"), `B12` ("ทะเลสาบนี้"), `B02` label "แอฟริกา". Clues affected: `CL04` wording only. Scenes affected for Film/Mark: `B02`, `B05`, `B06`, `B11`, `B12`, `B13` seam (see handoff).
- **`NYOS-SCRIPT-R2` `B06` amendment (Preaw, 2026-10-31; user decision 2026-10-31):** `B06` carries the local spirit belief only (`F024`), not the bomb rumour (`F023`).
  - `B06` VO "ตอนนั้นมีข่าวลือว่าเป็นระเบิด" → "ชาวบ้านเชื่อว่า… ทะเลสาบมีวิญญาณ" (9 → 10 syllables, ≈+0.25 s at 1.1×); tag "ข่าวลือ" → "ความเชื่อท้องถิ่น"; label, visual intent (calm dusk lake, no spirit figure, no haze, no rumour imagery) and sound intent (reverent pad + lake ambience, no scare cues) rewritten. Beat times from `B07` shift ≈+0.3 s.
  - Dependency check: only `B07` used the bomb rumour. Its text is unchanged; "ถ้าเป็นระเบิด…" is now a narrator hypothetical introduced and ruled out by `CL03` in the same line (fair: no claim that anyone suspected a bomb). No other beat or clue depends on `F023`. The belief gets no suspect card and is never crossed out.
  - Clues affected: none (`CL01`–`CL05` unchanged). Scenes affected for Film/Mark: `B06` (new image, tag), `B07` (bomb card untagged; no belief card), sound bed `B06`→`B07`.
  - **Boat recheck (changed claim):** `B06` → `F024` / `SRC009` (folklore, medium): wording "ชาวบ้านเชื่อว่า… ทะเลสาบมีวิญญาณ" vs research's "ในความเชื่อท้องถิ่น ทะเลสาบบางแห่งเป็นที่อยู่ของวิญญาณ" ("บางแห่ง" dropped for length; "ชาวบ้าน" localises a regional belief); `B07` "ระเบิด" now unsourced hypothetical (no claim). `NYOS-FACTCHECK-R1` row for `B06` (`F023`, `F024`) is superseded for this wording.
- `NYOS-SCRIPT-R1` (Preaw, 2026-10-30): first draft; `FC01`, `FC02` applied inline afterwards; `ALT-B` taken as `B00`.
- **Open questions:**
  1. **Speed-up method:** the estimate assumes ≈1.1× of the VS-R3 pace. Without it R2 is ≈98 s. Editor/user to choose prompted pace vs atempo; if 1.1× is not reached, apply reserve trims 1–3.
  2. **`B06` scope:** resolved by the user decision 2026-10-31 (belief only, no bomb rumour). Remaining choice: if the bomb should be grounded as a real report again, the only sourced origin is `F023` (rumour); a viewer-guess "ระเบิด?" in `B05` (fiction, ≈+0.75 s) would exceed the 90 s cap without another trim. Current choice: narrator hypothetical in `B07`, no added facts.
  5. **`B06` wording:** if Boat prefers the research wording with "บางแห่ง", "ชาวบ้านเชื่อว่า ทะเลสาบบางแห่งมีวิญญาณ" is 12 syllables (≈+0.5 s more → ≈89.7–90.2 s, at or over the cap) and would need reserve trim 1.
  3. **"สัตว์ประหลาด" vs "สัตว์ร้าย":** chosen for clarity and the scarier creature; the original problem may be an ASR homophone, so listen before treating it as a TTS mis-read.
  4. The final read still needs a fresh TTS take of R2 (one request, paid tier confirmed) to move timing from `estimated` to measured.
