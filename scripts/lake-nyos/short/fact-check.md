# NYOS-EP01-SHORT — Fact-check `NYOS-FACTCHECK-R1`

- **Deliverable:** `NYOS-EP01-SHORT`. Delivery record: [../delivery.md](../delivery.md).
- **Reviewed:** script `NYOS-SCRIPT-R1` (`short/script.md`, Preaw, 2026-10-30): VO `B01`–`B13`, on-screen labels, visual intent, sound intent, `ALT-A`, `ALT-B`. Research `NYOS-RESEARCH-R1` (`research.md`).
- **Reviewer / date:** Boat, 2026-10-30. Exact-revision review: wording below is quoted from `NYOS-SCRIPT-R1`.
- **Verdict (this revision only):** **`revision-required`**: two single-value fixes (`FC01`, `FC02`) plus one alternative-hook fix (`FC03`, only if `ALT-A` is chosen). All are [inline-eligible](../../../docs/editorial-workflow.md#inline-fact-fixes) (no beat, clue, twist or timing change). After they are applied, the status is `correction applied, recheck pending`; at recheck the script is expected to reach `ready-for-storyboard` **at snippet-level evidence** (see access limit). No premise, reveal or learning-takeaway claim is contradicted.
- **Not recorded here:** user approval (none), timing (`estimated`, untested), hook choice (pending user).

## Access limit (2026-10-30)

One fetch attempt each, per coordinator instruction; no other hosts tried.

| Source | URL tried | Result |
| --- | --- | --- |
| `SRC001` Kling et al. 1987, *Science* | https://www.science.org/doi/10.1126/science.236.4798.169 | DNS blocked (host outside the session's allowed domains) |
| `SRC002` USGS OFR 87-97 | https://pubs.usgs.gov/publication/ofr8797 | DNS blocked |
| `SRC003` Baxter et al. 1989, *BMJ* | https://pmc.ncbi.nlm.nih.gov/articles/PMC1836556/ | DNS blocked |

To open them the session needs `www.science.org` (or `www.commerce.alaska.gov` PDF copy), `pubs.usgs.gov` and `pmc.ncbi.nlm.nih.gov` allowed. **No primary text was opened.** Six WebSearch queries were run; results are search-engine summaries of pages, graded **snippet-supported** below. Snippets that quote a primary source's own text (`SRC001`, `SRC002`) are closer to the original than encyclopedic copies, but they are still not inspected text; the quotation and locator cannot be confirmed.

### New leads from this pass (lead-only, snippet)

| ID | Lead | What the snippet says | Limit |
| --- | --- | --- | --- |
| `SRC015` | USGS OFR 87-97 report PDF, https://pubs.usgs.gov/of/1987/0097/report.pdf (= `SRC002` full text) | People near the lake "came out of their homes, experienced a warm sensation, smelled rotten eggs or gunpowder, and rapidly lost consciousness"; "none of the survivors in the valley saw a visible cloud"; one witness on high ground saw a white cloud and a water wave rise from the lake | Snippet of primary text; not opened |
| `SRC016` | Kling et al. 1987 PDF copy, commerce.alaska.gov (= `SRC001`) | Text: "Many people smelled the odor of rotten eggs or gunpowder, experienced a warm…"; one summary attributes "lethal … up to 10 km" and "about 1700 people and 3000 cattle" to this paper | Snippet; the 10 km figure's exact wording and scope are unknown |
| `SRC017` | SDSU "How Volcanoes Work", Lake Nyos page, https://volcanoes.sdsu.edu/Nyos.html | Post-event "murky reddish brown water", attributed to oxidation of iron-rich bottom water lifted during the August 1986 event | University teaching page (secondary); independent of Wikipedia wording |
| `SRC018` | Eos science update on Cameroon lakes (eos.org) | Present-day red colouring of Nyos from iron oxides stirred up by the **degassing pipes** | Secondary; shows modern red-water photos may be degassing-era, not 1986 |
| `SRC019` | *Time* 1986 "Cameroon: the lake of death" (time.com archive); Massey *AJDTS* 2011-1 (Fomine, = `SRC010`) | Huts and buildings intact, forests unscathed; survivors woke to "no disturbances, no violence"; first thought a chemical/biological weapon; bomb-test rumours; blame on the departed chief, spirits, ancestors | Contemporary journalism + secondary scholarship; snippets |
| `SRC020` | Lake Kivu summaries (Wikipedia "Lake Kivu", earthdate.org, others) | Area ≈2,700 km²; volume ≈2,000× Nyos; ≈2 million people in the basin; dissolved CO2 and methane | Tertiary/secondary |
| `SRC021` | El Imparcial (2026-05-27) headline: residents believed a demon lived in Nyos's depths | Sensational; no source given; contradicts nothing in the script because the creature stays the viewer's guess | **Lead only; not usable.** Does not change `F025` |

## Claim review

Verdict vocabulary per [editorial workflow](../../../docs/editorial-workflow.md#fact-check--โบ็ต). "snippet" = graded on search summaries, not inspected text.

| Claim / location | Exact wording checked | Class | Verdict | Evidence + locator | Reason / correction / story impact |
| --- | --- | --- | --- | --- | --- |
| `F003`, `F001` / `B01` VO | "คนราว 1,700 คน… ตายในคืนเดียว" | fact | supported (snippet) | `SRC001` abstract "at least 1700"; `SRC016`; `SRC011`/`SRC012` 1,746 | "ราว" covers 1,700–1,746. Deaths occurred in the one-night release; later hospital deaths are not counted separately in any source seen. |
| `F018` / `B01` VO | "หลายคนหลับไปแล้ว… ไม่ตื่นอีกเลย" | fact (night) / report | supported (snippet) | `F001`/`F002` night timing; `SRC015` (some came out of homes and collapsed) | "หลายคน" keeps it from implying all. No change. |
| `F001` / `B02` VO + on-screen | "ปี 1986 ที่แคเมอรูน"; "21 ส.ค. 1986"; "แคเมอรูน · แอฟริกาตะวันตก" | fact | supported (snippet) | `SRC001`/`SRC002` titles ("Cameroon, West Africa") | Note: UN geoscheme puts Cameroon in Middle/Central Africa; "แอฟริกาตะวันตก" matches the primary title. Optional: "แอฟริกา" alone avoids the ambiguity. |
| `F002` / `B02` VO | "คืนนั้น บางคนเล่าว่า ได้ยินเสียงครืน ดังมาจากทะเลสาบนีออส" | report | supported (snippet) | `SRC011`, `SRC006`; `SRC015` witness account | Framed as report. |
| `B02` sound | reconstructed low rumble ≈1–1.5 s | reconstructed | not-factual (ok) | `F002` | Consistent with reports; label "เสียงจำลอง" if it could pass as a recording. |
| `F004` / `B03` VO | "วัวควายล้มตายหลายพันตัว" | fact | **needs-qualification** | `SRC016` ≈3,000 cattle; `SRC012` 3,500 livestock | Number fine. "ควาย" (buffalo) is not reported; the herds were cattle. **`FC02`.** |
| `F005` / `B03` VO | "แม้แต่นกกับแมลงก็ตาย" | fact | supported (snippet) | `SRC011` "innumerable birds, insects"; secondary "even the flies dropped dead" | Medium: tertiary/secondary only. |
| `F005` / `B04` VO | "แต่บ้านไม่พัง ต้นไม้ไม่เป็นอะไร" | fact | supported (snippet) | `SRC011` vegetation unaffected; `SRC019` huts intact, forests unscathed | Scope: villages and valleys. A surge hit the south shore of the lake (`F014`, `SRC015`); keep visuals of intact trees in villages, not at the shoreline. |
| `F023` / `B04` VO | "คนที่รอดก็ไม่รู้ว่าเกิดอะไรขึ้น" | report | supported (snippet) | `SRC019` survivors found "no disturbances, no violence"; early weapon suspicion | Fair generalisation (answers script open question 3). |
| `F025` / `B05` VO + label | "ถ้าให้เดา… อะไรฆ่าพวกเขา? สัตว์ร้าย? สิ่งที่มองไม่เห็น? หรือ… อะไรบางอย่าง ที่ขึ้นมาจากทะเลสาบ?" + "จินตนาการ" | fiction (viewer's guess) | not-factual (ok) | — | Posed as the viewer's guess, labelled for the whole beat, creature never near a person. Designed swell limited to this window: ok. |
| `F023`, `F024` / `B06` VO + tag | "ตอนนั้นมีทั้งข่าวลือเรื่องระเบิด อาวุธลับ และความเชื่อเรื่องวิญญาณ" + "ข่าวลือ / ความเชื่อ" | report / folklore | supported (snippet) | `SRC010`, `SRC019` (bomb-test rumours; chemical/biological weapon suspicion; departed chief, spirits, ancestors) | Rumour/belief framing is correct; no country named, no invented legend. Trim 2 (drop "อาวุธลับ") also stays supported. |
| `F005` reasoning / `B07` VO + cross-outs | "แต่ถ้าเป็นสัตว์ร้าย… ทำไมนกกับแมลงถึงตายด้วย? ถ้าเป็นระเบิด… ทำไมบ้านถึงไม่พัง?" | inference | supported (snippet) | as `B03`/`B04` | Sound reasoning on supported clues; "ระเบิด ✕" rules out a blast, not every rumour, which matches the line. |
| `F015` / `B08` VO | "หลังคืนนั้น น้ำเปลี่ยนเป็นสีแดงอมน้ำตาล" | fact | supported (snippet), medium | `SRC017` "murky reddish brown water" after the August 1986 event; `SRC012` | Two independent secondary leads now agree; no primary locator. **Visual reference:** red-water photos of Nyos may be degassing-era (`SRC018`); Film should not present a modern photo as 1986. |
| `F015`, `F010` / `B09` VO | "สีนั้นมาจากน้ำก้นทะเลสาบ ที่ถูกพลิกขึ้นมา…" | fact (causal) | supported (snippet), medium | `SRC017` (iron-rich bottom water lifted, then oxidised); `SRC012` | Causal wording is accurate as a simplification (the colour is iron from deep water reaching air). No change; optional precision: "สีนั้นมาจากเหล็กในน้ำก้นทะเลสาบ ที่ถูกพลิกขึ้นมา…" (+2 syll). |
| `F008` / `B09` VO + label | "และมันพาฆาตกรตัวจริงขึ้นมาด้วย ไม่ใช่สัตว์ร้าย… แต่คือก๊าซคาร์บอนไดออกไซด์"; "CO₂ (คาร์บอนไดออกไซด์)" | fact | supported (snippet), high agreement | `SRC001` abstract (deep-water CO2, asphyxiation) | Premise-critical; every lead agrees. Creature dissolves into the cloud and never returns: ok. |
| `F009` / `B10` VO | "ก๊าซนี้ซึมมาจากแมกมาใต้ดิน สะสมในน้ำก้นทะเลสาบ" | fact | supported (snippet) | `SRC001` "magmatic", no significant direct volcanic activity; EARTH (springs) | Not called an eruption. Trim 1 (drop "ใต้ดิน") stays supported. |
| `F010` / `B10` VO + tag | "เหมือนน้ำอัดลมที่ปิดฝาไว้" + "เปรียบเทียบ" | analogy | not-factual (ok) | — | Labelled analogy. |
| `F011` / `B10` VO + on-screen | "ส่วนอะไรทำให้น้ำพลิกคืนนั้น… ยังไม่มีใครรู้แน่"; "ตัวจุดชนวน: ยังไม่รู้แน่" | hypothesis status | supported (snippet) | `SRC008`; EARTH; search summaries ("trigger remains unclear") | No trigger drawn: ok. |
| `F013` / `B11` VO + on-screen | "ก๊าซนี้หนักกว่าอากาศ มันจึงไหลลงหุบเขา เหมือนแม่น้ำที่มองไม่เห็น"; "หนักกว่าอากาศ" | fact + simile | supported (snippet) | physics; `SRC012` valleys to the north; `SRC015` "none of the survivors in the valley saw a visible cloud" | "มองไม่เห็น" is supported for the flow in the valleys (answers script open question 2). A white cloud was seen rising **at the lake** (water mist), so the `B09` cloud at the surface is fair. |
| `B09`/`B11` visual | pale translucent haze, labelled CO₂ | visualisation | needs-qualification (visual note) | `SRC015` | The valley flow was invisible to survivors. Keep the valley haze faint/stylised and treat it as a diagram, not what people saw; Film decides the treatment. No VO change. |
| `F007` / `B11` VO + on-screen | "ไปไกลถึงราว 25 กิโลเมตร"; "~25 กม." | fact | **needs-qualification** | 25 km: `SRC012`, popular sources; "victims all within 19 km": one secondary; "up to 10 km": attributed to `SRC001` by a summary | Three different figures and the primary-attributed one is the smallest. A single number is not supported at this access level. **`FC01`.** |
| `F008` / `B11` VO | "ทำให้คนและสัตว์ขาดอากาศหายใจ" | fact | supported (snippet) | `SRC001` abstract | — |
| `B11` visual | lamps dim as the haze passes | mood | not-factual (ok) | `F017` unsourced | The script already forbids a flame-going-out moment; keep it ambiguous. |
| `F021` / `B12` VO + on-screen | "ตั้งแต่ปี 2001 ทะเลสาบนีออสมีท่อคอยดึงก๊าซขึ้นมา ให้มันค่อย ๆ หายใจออกทีละนิด"; "ท่อระบายก๊าซ", "2001" | fact + metaphor | supported (snippet) | `SRC004`, `SRC005` | Pipes lift gas-rich bottom water so the gas escapes: "ดึงก๊าซขึ้นมา" is a fair simplification. No "safe forever" claim. Present tense rests on the 2020 status paper; post-2020 operation not inspected (limit, not an error). |
| `F022` / `B13` VO + label | "แต่ยังมีอีกทะเลสาบ ที่ใหญ่กว่ามาก มีคนอยู่รอบ ๆ นับล้าน ก้นของมันก็มีก๊าซอัดอยู่"; "ทะเลสาบคิวู · รวันดา / คองโก" | fact | supported (snippet) | `SRC013`, `SRC020` (≈2,700 km², volume ≈2,000× Nyos; ≈2 million people; dissolved CO2 + methane) | "นับล้าน" is softer than ≈2 million: ok. "คองโก" = DR Congo; optional on-screen precision "รวันดา / คองโก (DRC)". |
| `B13` VO | "แล้วถ้าวันหนึ่ง มันหายใจออกล่ะ?" | hypothetical | not-factual (ok) | `SRC013` (risk debated) | An open question, no probability or date asserted; no disaster imagery. Ok. |
| `ALT-A` | "ฆาตกรรายนี้… มองไม่เห็น ไม่มีกลิ่น แต่ในคืนเดียว มันคร่าชีวิตคนไปราว 1,700 คน" | fact claim in hook | **needs-qualification** (only if chosen) | `SRC015`, `SRC016` (survivors smelled rotten eggs/gunpowder); CO2 itself odourless | Pure CO2 is odourless, but the viewer hears "this killer had no smell" while survivors reported a smell. **`FC03`.** |
| `ALT-B` | "ถ้าคืนนี้… อะไรบางอย่างขึ้นมาจากทะเลสาบหลังหมู่บ้านคุณ… คุณจะรู้ตัวไหม?" + "จินตนาการ" | hypothetical | not-factual (ok) | — | Second-person hypothetical, labelled. Ok. |

## Required fixes (exact Thai replacements)

| ID | Location | Replace | With | Impact |
| --- | --- | --- | --- | --- |
| `FC01` | `B11` VO | "ไปไกลถึงราว 25 กิโลเมตร…" | "ไปไกลหลายกิโลเมตร…" | Learning point keeps "far, downhill"; −3 syllables. No clue/reveal change. |
| `FC01` | `B11` on-screen | "~25 กม." | delete the distance marker (or "หลาย กม.") | Visual only. |
| `FC02` | `B03` VO | "วัวควายล้มตายหลายพันตัว" | "วัวล้มตายหลายพันตัว" | −1 syllable; `CL02` unchanged. |
| `FC03` | `ALT-A` (only if chosen) | "มองไม่เห็น ไม่มีกลิ่น" | "มองไม่เห็น ไม่พังบ้านสักหลัง" | Keeps the invisible-killer hook; plants `CL03` early. |

`FC01` is reversible: if `SRC001`/`SRC002` are opened and give a firm maximum lethal distance, the number can return as "ราว N กิโลเมตร".

## Optional notes (no verdict impact)

- `B02` label: "แอฟริกา" alone avoids the West/Central Africa ambiguity.
- `B09`: "สีนั้นมาจากเหล็กในน้ำก้นทะเลสาบ…" is slightly more precise.
- `B08` visual: do not use present-day degassing-era red-water photos as 1986 reference without saying so.
- `B09`/`B11` visual: the valley flow was invisible; keep the haze diagrammatic.
- Sound: all event sounds are reconstructed; no siren, explosion, crowd or animal cries are implied. The design matches `F002` and the research sound notes. "เสียงจำลอง" on `B02` is recommended if the rumble sounds documentary.
- `SRC021` (demon-in-the-lake headline) is unsourced; it does not license narrating a local monster belief.

## Coverage

All 13 beats' VO, every on-screen label, visual and sound intent with factual implications, both alternatives and the script's open questions 1–3 were checked against `NYOS-SCRIPT-R1` wording. Premise/reveal claims (`F003`, `F008`, `F009`, `F011`) and the clue chain (`F005`, `F015`) are snippet-supported with agreement across independent leads; none was checked against opened primary text. Remaining gap: open `SRC001`/`SRC002` for `F007` distance, `F015` colour locator and `F005` birds/insects before publication if the hosts are allowed.

## Change log

- `NYOS-FACTCHECK-R1` (Boat, 2026-10-30): first exact-revision review of `NYOS-SCRIPT-R1`. Primary fetches blocked; graded snippet-supported. Verdict `revision-required` (`FC01`, `FC02`; `FC03` if `ALT-A`).
