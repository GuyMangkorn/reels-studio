# BLOOP-EP01-SHORT — Fact-check `BLOOP-FACTCHECK-R2` (current) and `BLOOP-FACTCHECK-R1` (history)

- **Deliverable:** `BLOOP-EP01-SHORT` (Short only). Delivery record: [../delivery.md](../delivery.md).
- **Current review:** `BLOOP-FACTCHECK-R2` of [`script.md`](script.md) **`BLOOP-SCRIPT-R2`** (Preaw, 2026-10-29). The R1 review of `BLOOP-SCRIPT-R1` is kept unchanged below as history.

## `BLOOP-FACTCHECK-R2` — review of `BLOOP-SCRIPT-R2`

- **Script reviewed:** `BLOOP-SCRIPT-R2`, whole file. Coverage:
  - Changed VO in `B01`, `B02`, `B03`, `B04`, `B06`, `B08`, `B09` and the new `B10`.
  - All on-screen labels: the `B02` map label, "จินตนาการ" in `B04`–`B07`, "ภาพประกอบ", "เสียงจำลอง" in `B07`–`B08`, "เสียงจริง เร่ง 16 เท่า", and `LBL-B10`.
  - Story events, picture intent and sound intent in every beat, plus the clue ledger, claim mapping, Film handoff, trim list and working title.
  - Unchanged `B05` and `B07` VO: the wording was compared with R1 and is identical, so the R1 verdicts are reused. No new contrary evidence applies.
- **Research revision:** [`../research.md`](../research.md) **`BLOOP-RESEARCH-R1`** (all sources `lead-only`). Also checked against the user's ending direction in the delivery handoff log (2026-10-29: `A_fade`, realistic creature tease). That direction is a user decision. This review judges only how to keep it honest.
- **Reviewer / date:** Boat, 2026-10-29.
- **Result for `BLOOP-SCRIPT-R2`: `verification-incomplete`.**
  - All four required VO changes and both required label rules from R1 are applied with the exact wording.
  - No new required VO change.
  - `LBL-B10` is ruled **L1, required** (below). Preaw syncs the `B10` label line and the header status in the next script revision. That is a mechanical edit.
  - The status cannot reach `ready-for-storyboard` while no primary source has been opened.
  - Not ready for Film/Mark on factual grounds. User approval: none.

### Access attempt (R2 pass)

One attempt per blocked host, as instructed. No further retries.

| Source | Route | Result |
| --- | --- | --- |
| `SRC001` `https://pmel.noaa.gov/acoustics/sounds/bloop.html` | curl via agent proxy | `CONNECT tunnel failed, response 403` |
| `SRC002` host `https://webarchive.library.unt.edu/` | curl via agent proxy | blocked (no response, same proxy denial) |

**Inspected coverage: still zero primary or secondary pages.** Every verdict rests on `BLOOP-RESEARCH-R1` snippet leads. Verdict convention: same as R1. `unverified (wording OK)` means the wording fits the lead-level evidence and only the access gap remains.

### Premise / reveal / learning issues (first)

1. **The `B10` tease is the only remaining premise risk.** `B09` ends the explanation with "สัตว์ยักษ์ตัวนั้นมีแค่ในจินตนาการ". Then `B10` asks "คุณคิดว่ามันคืออะไรกันแน่?". "กันแน่" means "really / after all", so the question can be heard as reopening the answer. The question is followed by the same creature, now realistic, rising behind the hydrophone that recorded the sound. That is also the last thing seen before black.
   - With **no label**, the picture contradicts the narrator's own last factual sentence. It also places the creature where the source of the recording would be.
   - Shorts viewers who arrive late, scrub, or only see the last seconds get no spoken explanation at all. For them, an unlabelled realistic creature is the claim.
   - Platforms auto-replay Shorts even with `A_fade`. So in practice the swallow and black are followed by the `B01` real clip and its "เสียงจริง" label. An unlabelled realistic creature in front of the real recording is the pairing the research boundary rules out: the creature shown as the source of the real sound, unframed.
   - **Fix: `LBL-B10` = L1** (below). It keeps the look the user chose and makes the tease a labelled "what if". The question itself asserts nothing (`not-factual`), and the research boundary allows "a playful … ending tease … if it is clearly a joke or a question, not an assertion". The user's wording needs no change once the creature is labelled.
2. **The reveal and learning takeaway are now correctly hedged.** `B08` uses "ตรงกับ" and "น่าจะ", and `B09` uses "ตรงกับเสียง…". The phrasing "proved" or "คือ" no longer appears. The twist and clues are unchanged. The explanation is complete before `B10`, and `B10` plants or pays off nothing.
3. **Minor causal wording in `B06`** (recommended, not blocking). The R1 trim cut the question, so "เพราะ" now attaches to `B05`'s direction line. See row `B06-1`.

### Claim-by-claim review (R2 wording)

| Row / claim | Exact wording checked (R2) | Class | Verdict | Evidence + locator | Reason / correction / story impact |
| --- | --- | --- | --- | --- | --- |
| `B01-1` / `F001`, `F003` | "เสียงนี้… ไมค์ใต้ทะเลจับได้ปี 1997" | fact | unverified (wording OK) | `SRC002` snippet; `SRC005`, `SRC006` | Unchanged from R1, verdict reused. "เสียงนี้" depends on `AUD-1`. |
| `B01-2` / `F007` | "มันดังเกินกว่าเสียงสัตว์ทุกชนิดที่เรารู้จัก" | fact (comparative) | unverified (wording OK) | `SRC004` (quoting NOAA), `SRC012` | This is the R1 recommended wording, applied. It compares sound with sound, which is the correct scope. Trim option 2 (back to "สัตว์ทุกตัวที่เรารู้จัก") is still acceptable. With no loop seam, the line no longer needs to match a closing line. |
| `B01-3`, `B03-L` / `F006` | Label "เสียงจริง เร่ง 16 เท่า" with the real clip in `B01`, `B03` only | fact (media provenance) | unverified; **blocks Editor use** | `SRC002`, `SRC003` | The scope has narrowed to `B01`/`B03`, which is correct. The `B09` replay was removed, so the R1 `B09` fallback is retired. `AUD-1` is unchanged. |
| `B02-1` / `F003` | "ไมค์พวกนี้ โนอาหย่อนไว้ลึกใต้แปซิฟิก เพื่อฟังแผ่นดินไหวใต้ทะเล" | fact | unverified (wording OK) | `SRC002`, `SRC005`, `SRC006` | The trim of "แถวเส้นศูนย์สูตร" is fact-neutral. "ลึก" fits the SOFAR-channel moorings. Still no Navy/SOSUS label: correct. |
| `B02-L1` / `F003` | Map label "เส้นศูนย์สูตร" on the equator line, with hydrophone dots in the eastern equatorial Pacific | fact (geography) | supported (label); dots unverified (OK as illustration) | `SRC002` ("Equatorial Pacific … array"), `SRC005`, `SRC006` ("many hundreds of kilometers apart") | The label names the line, which is correct. **Visual note for Film:** the leads describe an array spread across the eastern equatorial region, units hundreds of km apart, with exact mooring positions not inspected. So scatter the dots **around** the equator line, not all exactly on it, and give them no coordinates. The script says "on the equator", which is acceptable at map scale. `CL06` is intact (shown in `B02`, spoken in `B06`). |
| `B02-2` / `F002` | "แต่ปีนั้น มันได้ยินเสียงนี้ซ้ำหลายครั้ง" | fact | unverified (wording OK) | `SRC002` | Unchanged, verdict reused. |
| `B02-3` | "ไฮโดรโฟน = ไมค์ใต้น้ำ" | definition | supported | standard term; `SRC006` | Unchanged. |
| `B03-1` / `F006` | "เสียงบลูปของจริงต่ำมาก ที่ได้ยินนี่ถูกเร่ง 16 เท่า…" | fact | unverified (wording OK) | `SRC002`, `SRC003` | Unchanged, verdict reused. |
| `B03-2` / `F007` | "เสียงจริงไต่สูงขึ้นเรื่อย ๆ นานราวหนึ่งนาที" | fact | unverified (wording OK) | `SRC004` | This is the R1 recommended wording, applied, and the "one minute" now refers to the real-time sound. **Presentation condition (required for Editor):** the VO word "เสียงจริง" here means the real-time sound, while the on-screen label "เสียงจริง เร่ง 16 เท่า" means the genuine recording. The real clip and its label must end by the near-silence after "16 เท่า…", as the script's sound intent already plans. They must not stay on screen under "เสียงจริงไต่สูงขึ้น… นานราวหนึ่งนาที", or viewers will take the few-second clip as the minute-long rise. |
| `B03-3` / `F007`, `F008` | "ฟังคล้ายเสียงสัตว์ร้อง" | report (perception) | unverified (wording OK) | `SRC004`, `SRC012` | Unchanged. |
| `B04-1` / `F005` | "มันดังจนไมค์หลายตัวได้ยิน จากไกลกว่าห้าพันกิโลเมตร" | fact | unverified (wording OK) | `SRC001`/`SRC004` | Unchanged. This is the source-to-sensor range only. |
| `B04-2` / `F008` | "นักวิทยาศาสตร์บางคนก็สงสัยว่าอาจเป็นสัตว์" | report | unverified (wording OK); **R1 required change applied** | `SRC012`, `SRC010` | "ก็" removes the "still (today)" reading. Trim option 1 "นักวิทยาศาสตร์บางคนก็สงสัยว่าเป็นสัตว์" is still pre-approved. |
| `B04-3` / key conclusion 2 | "ส่วนชาวเน็ต… จินตนาการไปถึงสัตว์ยักษ์" + "จินตนาการ" label on every creature frame through the `B07` crack | report + fiction | not-factual: OK | `SRC011`, `SRC009` | The R1 required label rule is applied. |
| `B04-S` / sound | Creature groan/call, fiction, only inside the "จินตนาการ" frame | fiction (sound) | not-factual: OK | research sound notes | Conditions are carried over exactly. |
| `B05-1` / `F011` | "แต่ทิศของเสียง ชี้ไกลลงไปทางใต้… ทางขั้วโลกใต้" | fact (direction) | unverified (wording OK) | `SRC001` | Unchanged, verdict reused. The broad-arrow visual condition is in the script. |
| `B06-1` / `F015` | "เพราะทะเลลึกมี "ช่องเสียง" ที่พาเสียงต่ำไปได้ไกลมาก" | fact (mechanism) + causal connector | mechanism supported; connector needs-qualification (**recommended**, clarity) | `SRC006`; textbook SOFAR physics | The mechanism is correct. Without the cut question, "เพราะ" directly follows "ทิศของเสียง ชี้ไกลลงไปทางใต้…". Read literally, the channel is the reason the direction points south, which is not a real causal link. Most viewers will infer "it could travel that far because…", so this is not blocking. Fixes, either is fine: **"มาถึงได้ เพราะทะเลลึกมี "ช่องเสียง" ที่พาเสียงต่ำไปได้ไกลมาก"** (+3 syllables, preferred), or drop "เพราะ" (−1). Still no depth numbers on screen: correct. |
| `B06-2` / `F003`, `F015` | "ไมค์พวกนี้ถูกหย่อนไว้ในช่องนั้นพอดี" | fact | unverified (wording OK) | `SRC005`, `SRC006` | Unchanged. |
| `B07-1`, `B07-2` / `F010`–`F012` | "หลายปีต่อมา ไมค์ที่ไปฟังใกล้แอนตาร์กติกา… เจอเสียงที่ลายคลื่นคล้ายกันมาก จากภูเขาน้ำแข็งยักษ์ที่กำลังแตกร้าว" | fact | unverified (wording OK) | `SRC001`, `SRC007` | The wording is identical to R1, so the verdict is reused. **Trim option 3 pre-checked:** "ไมค์ใกล้แอนตาร์กติกา" is acceptable. The Scotia Sea and Bransfield Strait hydrophones are near Antarctica. |
| `B07-S`, `B08-S` / sound | "เสียงจำลอง" whenever the reconstructed crack or tick is audible above the bed | reconstruction | not-factual: OK | research sound notes | The R1 required label rule is applied in `B07` and extended to `B08`. Correct. |
| `B08-1` / `F010`, `F012` | "ราวปี 2012 โนอาสรุปว่า บลูปตรงกับเสียง "แผ่นดินไหวน้ำแข็ง"" | fact (NOAA conclusion) | unverified (wording OK) | `SRC001`, `SRC008`, `SRC009` | Unchanged. It is OK now that the hedges are in place. **Caption:** keep "ราวปี 2012" in the caption. Do not shorten it to "2012". |
| `B08-2` / `F003`, `F010` | "ไมค์ที่ฟังแผ่นดินไหว ก็น่าจะได้ยินแผ่นดินไหวจริง ๆ… ของน้ำแข็ง" | fact (hedged) | unverified (wording OK); **R1 required change applied** | `SRC001` ("consistent with") | `CL05` payoff preserved. |
| `B09-1` | "สัตว์ยักษ์ตัวนั้นมีแค่ในจินตนาการ" | judgment | not-factual: fair judgment; **R1 required change applied** | `F010`; research fiction boundary | This scoping is also the basis for the `LBL-B10` ruling: the `B10` creature is "ตัวนั้น", so by the narrator's own words it is imagination. |
| `B09-2` / `F007`, `F010` | "เสียงที่ไต่สูงเหมือนสัตว์ร้อง ตรงกับเสียงน้ำแข็งแตกร้าว…" | fact (hedged cause) | unverified (wording OK); **R1 required change applied** | `SRC001`, `SRC004` | This is the takeaway line, and it is now hedged correctly. |
| `B09-P` | Last explanatory image: ice and the hydrophone, no creature | presentation | OK | research fiction boundary | Correct. The explanation lands before the question, with a 0.6–0.7 s pause. |
| `B10-1` | "คุณคิดว่ามันคืออะไรกันแน่?" (user's wording) | rhetorical question | not-factual: OK **with `LBL-B10` = L1** | research fiction boundary ("a question, not an assertion") | It asserts nothing and does not withdraw `B08`–`B09` in words. With a labelled creature it reads as a playful "what if". Without the label, see premise issue 1. No change to the user's wording is required. |
| `B10-2` / `LBL-B10` | Realistic Painted 2D creature rising behind the hydrophone, camera rush into its mouth, fade to black | fiction (user-chosen tease) | not-factual; **label required (L1)** | `B09-1`; research fiction boundary | See the ruling below. Design conditions already in the script (an invented creature, not a real species; no "เสียงจริง"; no real clip; no data graphics; the tease starts only after `B09` and the question) are confirmed as required. |
| `B10-S` / sound | Sub rumble on the rise, water-pressure whoosh on the rush, swallow, then hard silence. Class: fiction | fiction (sound) | not-factual: OK with conditions | sound-generation-workflow role duties; research sound notes | Fictional sound is labelled like fictional visuals: every `B10` creature sound plays only while the L1 "จินตนาการ" label is visible, including the swallow. The sub rumble must not reuse or resemble the real Bloop clip, the `B02` quake rumble, or the `B07`–`B08` reconstructed ice crack/groan. Otherwise the tease implies that the ice sound, or the real recording, came from the creature. |
| Title | "เสียงสัตว์ยักษ์ใต้ทะเล ที่ไม่ใช่สัตว์" | framing | unverified (OK as framing) | `F010`; `B09-1` | Rechecked against the R2 hedges and the tease. "ไม่ใช่สัตว์" is flatter than NOAA's "consistent with". As framing, though, it matches the narrator's own judgment in `B09` ("สัตว์ยักษ์ตัวนั้นมีแค่ในจินตนาการ"). It also anchors the takeaway against a misreading of the tease. Acceptable as the working title. If it is published as the platform title, it needs this review's recheck of that exact text and of any thumbnail (a realistic creature thumbnail would need the same "จินตนาการ" label). |
| Captions | "NOAA"; "1997", "16 เท่า", "5,000 กิโลเมตร", "ราวปี 2012" | format | supported (format) | — | They match the VO. 1997 = พ.ศ. 2540 and 2012 = พ.ศ. 2555, if the open question about Thai-era dates is taken up. |

### `LBL-B10` ruling: **L1, required**

Ruling: show a "จินตนาการ" label from the first frame any part of the `B10` creature is discernible until the picture is fully black. Option L2 (no label) is **not acceptable** on factual-presentation grounds.

Reasoning on the risk that viewers take the final creature as real:

- **The realistic treatment removes the only visual fiction cue.** In `B04`–`B07` the sketch style and the label both mark the creature as imagination. In `B10` the user deliberately chose a solid, real-looking creature, so the label is the only marker left. The fiction rule for `B04`–`B07` (label on every visible creature frame) applies equally to the same creature in `B10`.
- **Without the label, the picture contradicts the narrator.** Seconds after "สัตว์ยักษ์ตัวนั้นมีแค่ในจินตนาการ", it would show that creature as real. It would also stage it behind the hydrophone that recorded the sound, which is where the source would be. Together with "…กันแน่?", the closing message becomes "maybe it was a monster after all". That contradicts `F010` and breaks the research fiction boundary: the creature would stand at the end unframed and as an implied source.
- **The ending is what partial viewers see.** In Shorts many viewers see the last seconds without the explanation, through scrubbing, a late join or an auto-replay. On replay the black cuts straight into the `B01` real clip labelled "เสียงจริง". An unlabelled realistic creature right before the real recording is the strongest misreading in the video.
- **L1 costs the user's direction nothing.** It changes neither the look, the camera rush, the question nor the fade. It also adds no spoken words or timing.

Conditions for L1 (Film/Mark/Editor carry them):

1. **Exact text:** "จินตนาการ", the same word and type style as the `B04`–`B07` label, so viewers recognise the same marker. It may be small, but it must be legible on a phone at 1080×1920. It sits inside the caption-safe box (x 120–888, y 288–1248), clear of the question caption.
2. **Timing:** it appears no later than the creature's first discernible frame. It stays through the rise, the rush and the swallow, and it may fade out only together with the picture, into full black. It is never shown alone with "เสียงจริง".
3. **Sound:** every `B10` creature sound plays inside the label window (see `B10-S`).
4. **Separation from the real clip:** no creature appears in any `B01` frame. A `B_loop` or `C_seamless` version, if one is ever wanted, needs its own seam check. A seam must never join the creature to the real clip.

### Sound implications (R2)

| ID | Cue | Verdict | Change from R1 |
| --- | --- | --- | --- |
| `AUD-1` | Real NOAA clip, `B01` and `B03` only, labelled "เสียงจริง เร่ง 16 เท่า" | unverified; **blocks Editor use** | Scope narrowed (the `B09` replay was removed). The requirements are unchanged: download from the PMEL page, confirm 16× and NOAA authorship, check the public-domain status, and write a `NOTICE` with URL, date and the credit "Audio: NOAA PMEL". The R1 fallback for `B01` and `B03` still applies. The R1 `B09` fallback is retired. |
| `AUD-2` | `B02` rumble, `B06` hum, `B08` click/tick | OK (illustrative) | Unchanged. The `B08` ice tick follows the "เสียงจำลอง" rule. |
| `AUD-3` | `B04`–`B05` creature call | OK with conditions | Unchanged. |
| `AUD-4` | `B07`–`B08` ice crack | label rule applied | Closed. |
| `AUD-6` | `B10` rumble, whoosh, swallow | OK with conditions | New. See `B10-S`. |
| `AUD-5` | Military/ship/casualty sounds | none present | Unchanged. |

### Required and recommended changes after R2

| Row | Type | Wording / condition |
| --- | --- | --- |
| `LBL-B10` | **required** (presentation; Preaw syncs the script, Film/Mark plan it) | The `B10` "On-screen label" line changes from "pending Boat's ruling" to: "จินตนาการ" from the creature's first visible frame until black (L1, FACTCHECK-R2), plus conditions 1–4 above. |
| `B10-S` | **required** (sound condition) | Creature sounds only inside the label window. They must not resemble the real clip, the `B02` rumble or the `B07`–`B08` ice sound. |
| `B03-2` | **required** (Editor presentation condition) | The real clip and its "เสียงจริง เร่ง 16 เท่า" label end before "เสียงจริงไต่สูงขึ้น…". |
| `B06-1` | recommended | "มาถึงได้ เพราะทะเลลึกมี "ช่องเสียง" ที่พาเสียงต่ำไปได้ไกลมาก" (+3 syllables) or drop "เพราะ" (−1) |
| `B02-L1` | recommended (visual) | Scatter the hydrophone dots around the equator line, not exactly on it, with no coordinates. |
| Header | sync | The script header records `BLOOP-FACTCHECK-R2`: `verification-incomplete`. |

No VO wording change is required. The user's `B10` question stays as written. Timing impact: L1 adds none, and the optional `B06` change adds ≈+0.5 s to the ≈59.0 s estimate. If that pushes the read over 60 s, take the drop-"เพราะ" option, or use the trims already cleared (`B04` option 1, `B01` option 2, and `B07` option 3, now pre-checked).

### Readiness and recheck scope

- **Factual status:** `verification-incomplete` for `BLOOP-SCRIPT-R2`, because `pmel.noaa.gov` and `webarchive.library.unt.edu` are still blocked. No story-critical wording error remains once `LBL-B10` = L1 is applied. When the user allows those hosts, open `SRC001`/`SRC002` and re-verify `F001`–`F007`, `F010`–`F012` and `AUD-1` against the exact page text. Only then can a matching revision reach `ready-for-storyboard`.
- **Next revision:** if R3 only syncs the `LBL-B10` line and the header (with or without the `B06` option), Boat rechecks those lines only. Any other wording change, a published title or a thumbnail needs its own recheck.
- **Script-only scope:** Film/Mark handoff is N/A this pass. When it is opened, Film receives `BLOOP-SCRIPT-R2` (or the synced R3) with this review and the conditions above.

---

<a id="bloop-factcheck-r1-history"></a>
## `BLOOP-FACTCHECK-R1` (history; reviewed `BLOOP-SCRIPT-R1`, unchanged)

- **Deliverable:** `BLOOP-EP01-SHORT` (Short only). Delivery record: [../delivery.md](../delivery.md).
- **Script reviewed:** [`script.md`](script.md) **`BLOOP-SCRIPT-R1`** (Preaw, 2026-10-29). Coverage: every beat `B01`–`B09`, including VO, captions/number formatting, on-screen labels, story events, picture intent, sound intent, the clue ledger, claim mapping and the trim list. The script title was also checked.
- **Research revision:** [`../research.md`](../research.md) **`BLOOP-RESEARCH-R1`** (all sources `lead-only`).
- **Reviewer / date:** Boat, 2026-10-29. Profile `channel-default`, mystery-educational, named real case. Boat pass applies.
- **Result for `BLOOP-SCRIPT-R1`: `revision-required`.** Four wording changes are required (`B04`, `B08`, `B09` ×2). Even after they are applied, the best attainable status for R2 is **`verification-incomplete`**. No primary source has been opened (see Access below), and the real-audio licence is unconfirmed. This is not `ready-for-storyboard`. User approval: none (not part of this review).

### Access attempt this pass

On 2026-10-29 Boat made one retry per route, as instructed. No further retries.

| Source | Route | Result |
| --- | --- | --- |
| `SRC001` `https://pmel.noaa.gov/acoustics/sounds/bloop.html` and `https://www.pmel.noaa.gov/…` | curl via agent proxy | `CONNECT tunnel failed, response 403` |
| `SRC001` `https://pmel.noaa.gov/acoustics/sounds/bloop.html` | WebFetch | `getaddrinfo ENOTFOUND` (host outside session's allowed domains) |
| `SRC002` UNT End-of-Term archive URL | curl / WebFetch | 403 / `ENOTFOUND` |

**Inspected coverage: zero primary or secondary pages.** Every verdict below rests on `BLOOP-RESEARCH-R1` search-snippet leads. The user must allow `pmel.noaa.gov` and `webarchive.library.unt.edu` in the session network settings before anything can be upgraded to `supported`.

Verdict convention used here: `unverified (wording OK)` means the wording matches the lead-level evidence and its scope, so the script needs no change for it, but the evidence itself is unopened. Only the access gap remains for those rows.

### Premise / reveal / learning issues (first)

1. **The reveal is stated more firmly than NOAA's wording** (`B08` wordplay, `B09` "คือ"). NOAA's lead wording is "consistent with icequakes". R1 stacks four certainty markers in 13 s: "สรุปว่า… ตรงกับ", "ได้ยินแผ่นดินไหวจริง ๆ" and "คือน้ำแข็งแตกร้าว". Viewers would leave with "proved". Two required hedges fix this (rows `B08-2` and `B09-2`). The twist itself is unchanged and no clue or beat moves.
2. **`B09` "สัตว์ยักษ์มีแค่ในจินตนาการ" is false as written.** Read literally, it says giant animals exist only in imagination, but blue whales and giant squid are real. It must be scoped to this creature (row `B09-1`). No story impact.
3. **`B04` "นักวิทยาศาสตร์บางคนยังสงสัย…" can be heard as "some scientists *still* suspect an animal".** That would undercut the reveal. Use a zero-syllable fix (row `B04-2`).
4. **Real audio dependency** (`B01`/`B03`/`B09`). The licence and the 16× speed are lead-only. This blocks Editor use and does not block the script, but the fallback wording below is ready if clearance fails.

### Claim-by-claim review

| Row / claim | Exact wording checked (R1) | Class | Verdict | Evidence + locator | Reason / correction / story impact |
| --- | --- | --- | --- | --- | --- |
| `B01-1` / `F001`, `F003` | "เสียงนี้… ไมค์ใต้ทะเลจับได้ปี 1997" | fact | unverified (wording OK) | `SRC002` snippet ("repeatedly recorded during summer, 1997"); `SRC005`, `SRC006` | Year only, no day/month: correct scope. "เสียงนี้" asserts the real clip, see `AUD-1`. |
| `B01-2` / `F007` | "มันดังเกินกว่าสัตว์ทุกตัวที่เรารู้จัก" | fact (comparative) | unverified; **recommended** tweak | `SRC004` (quoting NOAA), `SRC012` | The leads compare the *sound* with known animal *sounds/calls*. "ทุกตัว" is acceptable colloquially as "any animal we know", so this is not blocking. A more precise version: **"มันดังเกินกว่าเสียงสัตว์ทุกชนิดที่เรารู้จัก"** (+2 syllables). Keep R1 if timing is tight. Keep the same wording at the loop seam. |
| `B01-3` / label | "เสียงจริง เร่ง 16 เท่า" | fact (media provenance) | unverified; blocks Editor use | `SRC002`, `SRC003` snippets; `F006` | Correct label *if* the file is NOAA PMEL's 16× WAV. The `SRC003` Commons note about the sampling rate was not understood, so a Commons copy may not be the same speed. Source the file from the PMEL page itself, see `AUD-1`. |
| `B02-1` / `F003` | "ไมค์พวกนี้ โนอาหย่อนไว้ลึกใต้แปซิฟิก แถวเส้นศูนย์สูตร เพื่อฟังแผ่นดินไหวใต้ทะเล" | fact | unverified (wording OK) | `SRC002` ("Equatorial Pacific Ocean autonomous hydrophone array"); `SRC005` (moorings in eastern equatorial Pacific since May 1996, SOFAR-channel hydrophones); `SRC006` (~600–1,200 m) | Leaving out volcanoes is fine. **Visual note for Film:** put the hydrophone dots in the **eastern** equatorial Pacific (toward South America), not mid-Pacific. Do not label it as the Navy/SOSUS. |
| `B02-2` / label | "ไฮโดรโฟน = ไมค์ใต้น้ำ" | fact (definition) | supported (general term) | Standard definition; `SRC006` | No change. |
| `B02-3` / `F002` | "แต่ปีนั้น มันได้ยินเสียงนี้ซ้ำหลายครั้ง" | fact | unverified (wording OK) | `SRC002` ("repeatedly recorded") | Low–moderate confidence. Matches the scope. The three design pulses are abstract and flagged as not the recording, which is fine. |
| `B03-1` / `F006` | "เสียงบลูปของจริงต่ำมาก ที่ได้ยินนี่ถูกเร่ง 16 เท่า…" | fact | unverified (wording OK) | `SRC002`, `SRC003` snippets | Not stating the reason ("too low to hear") is correct, because that reason is low-confidence. No Hz, correct. |
| `B03-2` / `F007` | "และมันไต่สูงขึ้นเรื่อย ๆ นานราวหนึ่งนาที" | fact | needs-qualification (**recommended**, clarity) | `SRC004` ("rose in frequency over about one minute") | "มัน" comes right after "ที่ได้ยินนี่ถูกเร่ง", so it could point to the sped-up clip, which plays for only seconds. The one-minute rise belongs to the real-time sound. Replacement with the same syllable count: **"เสียงจริงไต่สูงขึ้นเรื่อย ๆ นานราวหนึ่งนาที"**. If the clip is visibly short on screen, this becomes required. The illustrative climbing line must show no Hz or time axis numbers. |
| `B03-3` / `F007`, `F008` | "ฟังคล้ายเสียงสัตว์ร้อง" | report (perception) | unverified (wording OK) | `SRC004`, `SRC012` | Perception, not cause. Fine. |
| `B04-1` / `F005` | "มันดังจนไมค์หลายตัวได้ยิน จากไกลกว่าห้าพันกิโลเมตร" (caption "5,000 กิโลเมตร") | fact | unverified (wording OK) | `SRC001`/`SRC004` snippets ("multiple sensors at a range of over 5,000 km") | This is the source-to-sensor range. Do **not** turn it into the distance between sensors: `SRC012`'s "sensors up to ~4,800 km apart" is a different, unreconciled figure and is not used. Visual: the ring may reach several equatorial dots. Do not pin an origin point before `B05`. |
| `B04-2` / `F008` | "นักวิทยาศาสตร์บางคนยังสงสัยว่าอาจเป็นสัตว์" | report | needs-qualification (**required**) | `SRC012` (Lobel "most likely biological"; Fox 2002 on animal-like frequency changes), `SRC010`; contrary context `F009` (Fox suspected ice by 2001, lead only) | "บางคน" is the right scope. Without "แม้แต่", "ยัง" can be heard as "still" (present day). Replacement: **"นักวิทยาศาสตร์บางคนก็สงสัยว่าอาจเป็นสัตว์"** (same syllable count). **Trim-list proposal "แม้แต่นักวิทยาศาสตร์ยังสงสัย" is rejected**: it drops "บางคน" (overgeneralises) and drops what they suspected. If a trim is needed, use **"นักวิทยาศาสตร์บางคนก็สงสัยว่าเป็นสัตว์"** (−1 syllable; "สงสัยว่า" = "suspected", which matches Lobel's view). |
| `B04-3` / key conclusion 2, `F013` (myth part), `F014` context | "ส่วนชาวเน็ต… จินตนาการไปถึงสัตว์ยักษ์" + creature visual | report (popular speculation) + fiction (creature) | unverified (wording OK) | `SRC011` (pop pieces 2009/2016 are themselves examples of the creature/Cthulhu speculation); `SRC009` (2012 mermaid mockumentary used the Bloop; NOAA answered public queries) | Fair split: scientists wondered "animal", the public and internet imagined "giant". No dates or Lovecraft detail asserted, which is correct. Limitation: "bigger than a blue whale" speculation also appeared in press (`F007`), so the giant idea was not *only* online. The line does not say "only", so no change. **Label consistency fix (presentation, required):** `B04` says the "จินตนาการ" label runs "into `B05`", but the creature stays visible through `B07`'s crack. The label must stay on screen for **every** frame the creature is visible, through `B07`, as the Film handoff already says. |
| `B04-S` / sound | Creature groan/whale-like call, "fiction" in cue sheet | fiction (sound) | not-factual: OK with conditions | Research sound notes | Viewers never see the cue sheet. Conditions: play the cue only while the on-screen "จินตนาการ" label and the sketch treatment are visible; it must not resemble the real Bloop's rising sweep; it never plays with the "เสียงจริง" label. Omitting it is also fine. |
| `B05-1` / `F011` (`F004` unused) | "แต่ทิศของเสียง ชี้ไกลลงไปทางใต้… ทางขั้วโลกใต้" | fact (direction) | unverified (wording OK) | `SRC001` snippet (arrival-azimuth estimate between Bransfield Strait and the Ross Sea, or Cape Adare); `SRC004` (older ~50°S 100°W, unverified) | Every lead estimate lies far south of the equatorial array, so "direction points toward the South Pole" fits both the old and the current estimates. It reads as a direction, not as "at the Pole". No change. **Visual condition:** the arrow stays broad and must not end on the Pole, on a pin, or on coordinates (the old 50°S 100°W point is open ocean, not ice, and the current estimate is a sector). `CL04`'s "where the giant icebergs are" must stay a narrative inference, not an on-screen claim before `B07`. |
| `B06-1` / `F015` | "ไกลขนาดนั้น มาถึงได้ยังไง? ทะเลลึกมี "ช่องเสียง" ที่พาเสียงต่ำไปได้ไกลมาก" | fact (mechanism) | supported (mechanism, textbook level); `SRC006` lead | `SRC006` snippet; standard SOFAR physics | No change. The optional label "ช่องเสียงใต้ทะเล" is fine. **No depth numbers on screen**: the axis depth varies by latitude and shallows toward polar water, and `SRC006`'s 600–1,200 m is lead-only. |
| `B06-2` / `F003`, `F015` | "ไมค์พวกนี้ถูกหย่อนไว้ในช่องนั้นพอดี" | fact | unverified (wording OK) | `SRC005` ("SOFAR-channel hydrophones"), `SRC006` | No change. |
| `B07-1` / `F010`, `F012` | "หลายปีต่อมา ไมค์ที่ไปฟังใกล้แอนตาร์กติกา… เจอเสียงที่ลายคลื่นคล้ายกันมาก" | fact | unverified (wording OK) | `SRC001` snippet (Scotia Sea / Bransfield Strait hydrophones; spectrograms very similar); `SRC007` (A53a recordings 2007–08) | "หลายปีต่อมา" avoids the disputed 2005/2011/2012 start, and "คล้ายกันมาก" matches "very similar". Correct. The two side-by-side patterns stay labelled "ภาพประกอบ" unless a real spectrogram with source and licence is used (that would need a new check). |
| `B07-2` / `F010`, `F011` | "จากภูเขาน้ำแข็งยักษ์ที่กำลังแตกร้าว" | fact | unverified (wording OK) | `SRC001` snippet ("large icebergs as they crack and fracture") | No iceberg is named: correct. The creature-cracks-into-iceberg visual works as a labelled reveal metaphor. Show no name, date or "A53a" tag. |
| `B07-S` / sound | Reconstructed ice crack/groan on "แตกร้าว" | reconstruction | needs-qualification (**required**, labelling) | Research sound notes | The VO says the mics "found a sound", so a crisp crack landing on that line will be heard as the recorded icequake. Show "เสียงจำลอง" on screen **whenever the crack is audible above the bed**, not only "in the clear". Real hydrophone icequakes are low rumbles, and the crack is a stylisation. |
| `B08-1` / `F010`, `F012` | "ราวปี 2012 โนอาสรุปว่า บลูปตรงกับเสียง "แผ่นดินไหวน้ำแข็ง"" | fact (NOAA conclusion) | unverified (wording OK) | `SRC001` snippet ("consistent with icequakes…"); `SRC008` (Nov 2012 coverage), `SRC009` (NPR July 2012 still "unidentified") | NOAA did publish this as its explanation, so "สรุปว่า" is accurate. "ตรงกับ" (matches, a pattern match) is within the research's usable wording. It is acceptable once `B08-2` and `B09-2` add the hedge. A closer optional calque: "…บลูปสอดคล้องกับเสียง "แผ่นดินไหวน้ำแข็ง"" (+2 syllables). "ราวปี 2012" is correct. The caption "(icequake)" is fine. |
| `B08-2` / `F003`, `F010` | "ไมค์ที่ฟังแผ่นดินไหว ก็ได้ยินแผ่นดินไหวจริง ๆ… ของน้ำแข็ง" | fact asserted as wordplay | needs-qualification (**required**) | `SRC001` ("consistent with") | "จริง ๆ" asserts as fact that the 1997 mics heard an icequake. The evidence says the sound is consistent with one, and no source event was identified (`F011`). Keep the wordplay and add the hedge: **"ไมค์ที่ฟังแผ่นดินไหว ก็น่าจะได้ยินแผ่นดินไหวจริง ๆ… ของน้ำแข็ง"** (+2 syllables). `CL05` payoff preserved. Visual: the ring travelling north to the equatorial hydrophone is fine as illustration. Add no date or iceberg name. |
| `B09-1` / fiction boundary | "สัตว์ยักษ์มีแค่ในจินตนาการ" | judgment | contradicted as literally worded → **required** | General knowledge (giant animals such as blue whales exist); `F010` | Scope it to this creature: **"สัตว์ยักษ์ตัวนั้นมีแค่ในจินตนาการ"** (+2 syllables). Scoped this way, it is a fair judgment: no evidence of a creature was ever found, and NOAA's explanation is ice. |
| `B09-2` / `F007` + `F010` | "เสียงที่ไต่สูงเหมือนสัตว์ร้อง คือน้ำแข็งแตกร้าว…" | fact (cause) | needs-qualification (**required**) | `SRC001` ("consistent with"), `SRC004` | "คือ" states identity as proven, and this is the takeaway line viewers keep. Preferred replacement: **"เสียงที่ไต่สูงเหมือนสัตว์ร้อง ตรงกับเสียงน้ำแข็งแตกร้าว…"** (+2 syllables). It echoes `B08` "ตรงกับ" and avoids repeating `B08-2`'s "น่าจะ". Preaw's fallback "…น่าจะเป็นน้ำแข็งแตกร้าว…" is also acceptable. |
| `B09-3` | "ฟังอีกทีสิ ยังเหมือนสัตว์ไหม?" + real clip in hold | rhetorical + media | not-factual (OK); clip depends on `AUD-1` | — | The question invites listening and asserts nothing. The final frame (ice + hydrophone, no creature) fits the fiction boundary. |
| Title | "เสียงสัตว์ยักษ์ใต้ทะเล ที่ไม่ใช่สัตว์" | framing | unverified (OK as framing) | `F010` | The working title is acceptable framing of NOAA's explanation. If it is used as the published title, recheck it against the final R2 hedges. |
| Captions | "โนอา" → "NOAA"; "1997", "16 เท่า", "5,000 กิโลเมตร", "2012" | fact (format) | supported (format) | — | Matches the VO. For the open question: 1997 = **พ.ศ. 2540** and 2012 = **พ.ศ. 2555** (correct conversions, +543). |

### Sound implications

| ID | Cue | Verdict | Requirement |
| --- | --- | --- | --- |
| `AUD-1` | Real NOAA Bloop clip in `B01`, `B03`, `B09`/hold, labelled "เสียงจริง เร่ง 16 เท่า" | unverified; **blocks Editor use**, not the script | Before use: download the file **from the PMEL page** (`SRC001`/`SRC002`), not from a Commons mirror. Confirm that the page says the file is NOAA-produced and sped up 16×, check NOAA's site disclaimer for public-domain status (17 U.S.C. §105 lead only), and record URL, access date and credit "Audio: NOAA PMEL" in a `NOTICE` beside the asset (production-requirements licences). |
| `AUD-2` | `B02` rumble, `B06` hum, `B08` click/tick | OK (illustrative) | They do not imitate the Bloop and assert no event. |
| `AUD-3` | `B04` creature call | OK with conditions | See `B04-S`. |
| `AUD-4` | `B07`–`B08` ice crack | required label | See `B07-S`. |
| `AUD-5` | Military/ship/casualty sounds | none present | Keep it that way. |

**Fallback if `AUD-1` cannot be cleared** (Boat-acceptable wording; Preaw owns the rewrite). Use no real clip, and label any reconstructed Bloop-like sound "เสียงจำลอง", never "เสียงจริง".

- `B01`: "เสียงประหลาดเสียงหนึ่ง… ไมค์ใต้ทะเลจับได้ปี 1997 มันดังเกินกว่าเสียงสัตว์ทุกชนิดที่เรารู้จัก"
- `B03`: "เสียงบลูปของจริงต่ำมาก ไฟล์ที่โนอาเปิดให้ฟังถูกเร่ง 16 เท่า… เสียงจริงไต่สูงขึ้นเรื่อย ๆ นานราวหนึ่งนาที ฟังคล้ายเสียงสัตว์ร้อง"
- `B09`: replace "ฟังอีกทีสิ" with a line that does not claim the viewer is hearing the recording. Example: "ลองนึกถึงเสียงนั้นอีกที ยังเหมือนสัตว์ไหม?"

### Required changes for `BLOOP-SCRIPT-R2` (summary)

| Row | R1 | Replacement |
| --- | --- | --- |
| `B04-2` | นักวิทยาศาสตร์บางคนยังสงสัยว่าอาจเป็นสัตว์ | นักวิทยาศาสตร์บางคนก็สงสัยว่าอาจเป็นสัตว์ |
| `B08-2` | ไมค์ที่ฟังแผ่นดินไหว ก็ได้ยินแผ่นดินไหวจริง ๆ… ของน้ำแข็ง | ไมค์ที่ฟังแผ่นดินไหว ก็น่าจะได้ยินแผ่นดินไหวจริง ๆ… ของน้ำแข็ง |
| `B09-1` | สัตว์ยักษ์มีแค่ในจินตนาการ | สัตว์ยักษ์ตัวนั้นมีแค่ในจินตนาการ |
| `B09-2` | เสียงที่ไต่สูงเหมือนสัตว์ร้อง คือน้ำแข็งแตกร้าว… | เสียงที่ไต่สูงเหมือนสัตว์ร้อง ตรงกับเสียงน้ำแข็งแตกร้าว… (or …น่าจะเป็นน้ำแข็งแตกร้าว…) |
| `B04-3` label | "จินตนาการ" from `B04` "into `B05`" | "จินตนาการ" on every frame the creature is visible, through the `B07` crack |
| `B07-S` label | "เสียงจำลอง" if ice sound heard "in the clear" | "เสียงจำลอง" whenever the reconstructed crack is audible above the bed |

**Recommended (not blocking):** `B01-2` "มันดังเกินกว่าเสียงสัตว์ทุกชนิดที่เรารู้จัก" (keep the loop seam identical) and `B03-2` "เสียงจริงไต่สูงขึ้นเรื่อย ๆ นานราวหนึ่งนาที".

**Timing impact (estimate only):** required changes add about +6 syllables, and the recommended ones about +2 more (≈+1.1–1.5 s at 5.5 syl/s). That takes R1's ≈59.8 s estimate to about 61 s, so Preaw needs a trim. Fact-neutral trims: "ไกลขนาดนั้น มาถึงได้ยังไง?" (`B06`) and "แถวเส้นศูนย์สูตร" (`B02`; this loses part of `CL06` but is not an error). The `B04` trim is acceptable only in the form given in `B04-2`.

### Recheck scope for R2

- Recheck `B04`, `B08`, `B09` and any trimmed beat. Also recheck the loop seam (`B09` → `B01`) and the labels in `B04`–`B07`.
- Any new fact (Lovecraft, mermaids, coordinates, Hz, depth numbers, a real spectrogram) needs research first. `F004`/`F013` stay unverified.
- When access is allowed, open `SRC001`/`SRC002` and re-verify `F001`–`F007` and `F010`–`F012` against the exact page text, together with the audio provenance and speed (`AUD-1`). Only then can a later revision reach `ready-for-storyboard`.
- The script header still reads "not yet fact-checked". Preaw should update it to this review's result in R2 (Boat does not edit the script).

### Change log

- `BLOOP-FACTCHECK-R1` (2026-10-29, Boat): first exact-revision review of `BLOOP-SCRIPT-R1` against `BLOOP-RESEARCH-R1`, all beats. Result `revision-required`, with a ceiling of `verification-incomplete` because `pmel.noaa.gov` and `webarchive.library.unt.edu` were still blocked (one retry each via curl and WebFetch).
- `BLOOP-FACTCHECK-R2` (2026-10-29, Boat): exact-revision recheck of `BLOOP-SCRIPT-R2` against `BLOOP-RESEARCH-R1` and FACTCHECK-R1. All changed beats, the new `B10`, the labels and the title were checked. Result `verification-incomplete`. `LBL-B10` ruled L1 (required). There is no required VO change. One access attempt per blocked host failed (proxy 403). The R2 section was added above, and the R1 headings were demoted one level, with their text unchanged.
