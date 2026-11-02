# Fact-check — ALV-EP01-SHORT

| Field | Value |
| --- | --- |
| Revision | `ALV-FACTCHECK-R1` (Boat, 2026-11-02) |
| Checked script | `ALV-SCRIPT-R1` ([script.md](script.md), Preaw, 2026-11-02) |
| Research | `ALV-RESEARCH-R1` ([../research.md](../research.md)) |
| Verdict | **`fixes-required`** (4 wording fixes, FC01-FC04 below; no premise, reveal or learning change). Even after the fixes, the whole record rests on **search-result summaries only**; see [Access and inspected coverage](#access-and-inspected-coverage) |
| Script edited by Boat | No |

## Access and inspected coverage

- **No source page was opened in this pass either.** `WebFetch` to nbcnews.com, cnn.com and simonandschuster.ca failed with host-not-resolvable (host not in the session's allowed network domains). theguardian.com, wikipedia.org, time.com and bbc.* stay blocked as in R1 (not retried). The publisher page and the book text were not reached.
- Evidence this pass = two new rounds of `WebSearch` summaries (English and Spanish). They surfaced these outlets, **seen as titles/URLs/summaries only (`lead-only`)**: UPI (16 Dec 2015), Fox News (suit and denial), Diario de Cuyo (Spanish, 16 Dec 2015, quotes lawyer Cucalón), The New Daily (AU), Complex, Time (URL only), AJC, Scripps, Daily Telegraph (PressReader), Simon & Schuster listing, My Modern Met (Franklin interview), Infobae (2024).
- Many of these repeat AP/UPI/The Sun text. They are **not independent corroboration**. Qualitative confidence: identity, rescue and the existence of the suit are well reported (medium-high); every number and the lawyer's statement are medium to low.
- Nothing contrary was found: no source disputes the suit, the denial, the Marshall Islands landing or the ~14 months.

## Findings

Severity: **High** = changes what the viewer is told about a person or a premise. **Medium** = accuracy or defensibility gap. **Low** = polish or hedge.

| ID | Sev | Where | Finding | Required change (exact Thai) |
| --- | --- | --- | --- | --- |
| FC01 | High | S07 VO and captions (F017) | The reported allegation is that he ate the **remains after Córdoba died** (Fox, Complex, Diario de Cuyo summaries: "ate his remains"; the family does not allege he killed him). "กินเพื่อนร่วมเรือ" can be heard as "killed and ate". Keep "กล่าวหาว่า". | VO: `แต่ปลายปี 2015… ครอบครัวเอเซเกียลฟ้องเขา กล่าวหาว่า เขากินร่างของเพื่อนร่วมเรือหลังเสียชีวิต`. Caption verbatim. Do not shorten to "เขากินเพื่อน". Timing: about +1.0 s (S07 about 5.9 s est.); if over, TRIM-1 plus FC03 below cover it. Sound: the thud moves to "หลังเสียชีวิต" or stays on "เพื่อนร่วมเรือ", Film's choice, still muted. |
| FC02 | Medium | S08 VO (F019) | "ทนายบอกว่าร่างเพื่อนถูกปล่อยลงทะเล" is supported as the lawyer's statement only through a tabloid-derived summary (The Sun, per a search summary; no AP/UPI text seen). Alvarenga's **own** account (Fox, Diario de Cuyo summaries) is that he pushed the body overboard (the book version reportedly after about a week; not used). So the content is attributable to both sides, but "ทนายบอกว่า" rests on one weak relay. Settles question 2: use "ฝ่ายเขา". | VO: `เขาปฏิเสธ ฝ่ายเขาบอกว่าร่างเพื่อนถูกปล่อยลงทะเล… บนเรือมีพยานคนเดียว คือตัวเขาเอง และยังไม่พบรายงานผลคดี` (also carries FC03). The lawyer's name stays off screen. |
| FC03 | Medium | S08 VO and on-screen (F020) | "คำตัดสิน" covers a ruling only; the absence we can support is wider: no ruling, settlement or dismissal was found (re-searched in English and Spanish; results stop at Dec 2015 to 2016 coverage). It is an absence of reports in search results, not proof that nothing exists, and it was checked only through search, not a court or El Diario de Hoy archive. Settles question 4: keep "ยังไม่พบรายงาน", change the object. | VO tail: `และยังไม่พบรายงานผลคดี`. On-screen: `ไม่พบรายงานผลคดี`. Update claim row S08 and Clue payoff text to match. Do not use "ยังไม่ตัดสิน" or "คดียังอยู่". |
| FC04 | Medium | S07 on-screen `ธ.ค. 2015` (F017) | December 2015 is when the suit was **reported** (UPI 16 Dec; 15-16 Dec elsewhere). Complex/Telegraph summaries say the suit came "days after the October release" of the book, so the filing date itself is unconfirmed. VO "ปลายปี 2015" is safe either way. | On-screen: `รายงานข่าว ธ.ค. 2015` (or drop the small line). VO unchanged. |
| FC05 | Low | S06 VO (F005) | The distance has no single value: AP 6,500 mi / about 10,500 km; others 6,700 mi, 9,600-12,500 km (Islands Business, aggregators). It is an estimate of drift, not a tracked route, so "เรือไปเกย… ไกลราวหมื่นกิโลเมตร" states it as fact in the narrator's voice. Settles question 3: **cut** (take TRIM-1 now). It adds a low-medium number, is not needed for the hook payoff (the 14 months carries it) and saves 1.4 s of an over-tight read. If Preaw/user want it kept, the hedged form is acceptable. | VO: `ต้นปี 2014 เรือไปเกยหมู่เกาะมาร์แชลล์`. Optional keep form: `ต้นปี 2014 เรือไปเกยหมู่เกาะมาร์แชลล์ ไกลจากจุดเริ่มต้นราว 10,000 กิโลเมตร ตามการประมาณ`. |
| FC06 | Low | S04 (F010, F011) | S04 and the S06 landing are narrator assertions of what is known only from his account. S03 and S05 carry the attribution, so S04 is covered by the S03 plant. Experts (ABC, Time) called the survival plausible, not proven. Fish are omitted (not denied); reports say some meat was dried in the sun, so "ดิบ ๆ" is "mostly raw", not "only raw". | Optional, no time cost: keep as is. If Preaw wants it tighter: `เขาเล่าว่ากินเต่ากับนกดิบ ๆ ดื่มน้ำฝน เลือดเต่า… หรือแม้แต่ปัสสาวะตัวเอง` (+0.4 s). |
| FC07 | Low | S08 on-screen `พยาน: 1 คน` | True as "only surviving person aboard". Fine. Not an independent fact: it follows from two people on board and one death (F013). | No change. Optional precision: `พยาน: เหลือ 1 คน`. |
| FC08 | Low | Sound S07 | The riser and thud land on the accusation. No fabricated real event; fictional score. | Keep muted as written; do not use a heartbeat, siren or crowd cue. Label S03 storm/engine sounds fictional (already stated). |

## Resolution of the four requested questions

1. **"แค่วันเดียว" vs "ไม่กี่วัน" (F008).** `ALT-HOOK-U` "แค่วันเดียว" is **not supported**. Reported planned length varies: "two-day trip" (UPI, 16 Dec 2015 summary; repeated by several outlets), "about 30 hours" (Factinate and Wikipedia per search summary), "weekend" (publisher framing per summary). None says one day. "ไม่กี่วัน" covers all three; keep the main hook. If the user insists on a number, the most-repeated one is "สองวัน" (`เขาออกไปตกปลาแค่สองวัน…`), still unverified against the book and conflicting with the 30-hour report, so **not recommended**. "กลับมาอีกที" also stays wrong (he landed in the Marshall Islands, not home).
2. **Lawyer attribution.** Use "ฝ่ายเขาบอกว่า" (FC02).
3. **Distance F005.** Cut (FC05).
4. **"ยังไม่พบรายงานคำตัดสิน".** Change to "ยังไม่พบรายงานผลคดี" (FC03).

## Claim-by-claim check (every line and number in S01-S09 and ALT-HOOK-U)

Source column = search-summary leads only. "OK" = supported at the stated confidence by the leads; none is verified from an opened page.

| ID | Text / number | Verdict | Confidence and note |
| --- | --- | --- | --- |
| S01-a | "ไม่กี่วัน" (F008) | OK, hedged | Medium-low. Fits two-day, 30-hour and weekend reports. |
| S01-b | "ได้ขึ้นฝั่งอีกที" (F003) | OK | Medium-high. Landed alive on Ebon Atoll, Marshall Islands. |
| S01-c | "14 เดือนต่อมา" / title "14 เดือน" (F004) | OK | Medium. 438 days = 14.4 months by his count (title of the book, CNN Rewind, many outlets). Early wire reports said 13 months (AP/CNN Feb 2014) and some 15; the 438-day count came later. On-screen `438 วัน (ตามที่เขานับ)` keeps it labelled. |
| S01 OST | `ไม่กี่วัน → 14 เดือน` | OK | As S01-a, S01-c. |
| ALT-HOOK-U | "แค่วันเดียว", "กลับมา", `1 วัน → 14 เดือน` | **Not supported** | See question 1. "14 เดือนต่อมา" in it is fine. |
| S02-a | "ปลายปี 2012" (F002) | OK | Medium. 17 Nov 2012 most reported (one source 18 Nov; one summary 18 Dec, treated as error). "ปลายปี" holds for Nov or Dec. |
| S02-b | "อัลวาเรนกา ชาวประมงในเม็กซิโก" (F001) | OK | Medium-high. On-screen "ชาวประมงเอลซัลวาดอร์ ทำงานในเม็กซิโก" matches (Salvadoran living in Mexico; Costa Azul, Chiapas). |
| S02-c | "เพื่อนหนุ่ม เอเซเกียล" (F007) | OK | Medium. Reported ages 22 (UPI, Diario de Cuyo, Complex), 23, 24: no age is spoken, correctly. "เพื่อน": UPI summary says Córdoba was paid about US$50 to come along, so "ลูกเรือ" is equally true; "เพื่อน" is acceptable and was the colloquial press wording. Name card `เอเซเกียล กอร์โดบา`: spelling Córdoba (a "Córdova" variant exists in Fox). |
| S03 | "เขาเล่าว่า พายุทำเครื่องยนต์พัง… เรือลอยเคว้งกลางแปซิฟิก" (F009) | OK, attributed | Medium. Order of storm and engine failure varies by account, wording "พายุทำเครื่องยนต์พัง" is the user's; acceptable as his account. Pacific is not disputed. |
| S04 | turtle, bird raw; rainwater; turtle blood; own urine (F010, F011) | OK | Medium-high. See FC06. |
| S05-a | "เขาบอกว่า เอเซเกียลกินแบบนั้นไม่ได้… อ่อนแรงลง" (F013) | OK, attributed | Low-medium. Alvarenga's account only. |
| S05-b | "จนเสียชีวิตระหว่างทาง" (F012) | OK, no timing | Low for timing, which is correctly omitted (1 month / 2 months / about 4 months conflict; Fox summary quotes Alvarenga: four months). Death itself is undisputed. "เขาบอกว่า" covers the sentence. |
| S06-a | "ต้นปี 2014" (F003) | OK | Medium. 29/30 Jan 2014. |
| S06-b | "เรือไปเกยหมู่เกาะมาร์แชลล์" | OK | Medium-high. Tile Islet, Ebon Atoll, found by two women (not claimed). |
| S06-c | "ไกลราวหมื่นกิโลเมตร" (F005) | Weak, cut | FC05. |
| S06 OST | `438 วัน (ตามที่เขานับ)` | OK | Medium. Label is correct and important. |
| S07-a | "ปลายปี 2015… ครอบครัวเอเซเกียลฟ้องเขา" (F017, F018) | OK | Medium. Relatives of Córdoba; about US$1 million (amount not spoken). Not "mother": correct. Not merged with Perlera suit: correct. No venue: correct (none found; "Los Angeles" hint unsupported). |
| S07-b | "กล่าวหาว่า เขากินเพื่อนร่วมเรือ" | **Fix** | FC01. |
| S07 OST | `ข้อกล่าวหา`, `ธ.ค. 2015` | Fix small line | FC04. |
| S08-a | "เขาปฏิเสธ" (F019) | OK | Medium-high (Fox headline "denies he ate his shipmate"; Alvarenga reportedly cited a pact not to eat each other, not used). |
| S08-b | "ทนายบอกว่าร่างเพื่อนถูกปล่อยลงทะเล" | **Fix** | FC02. |
| S08-c | "บนเรือมีพยานคนเดียว คือตัวเขาเอง" | OK | Follows from F013; fact, not allegation. |
| S08-d | "ยังไม่พบรายงานคำตัดสิน" (F020) | **Fix** | FC03. |
| S09 | Closing question | N/A | No factual claim; about survival, not guilt. |
| Header | Logline in script.md "alleging he ate his companion" | Note | Internal only; matches FC01 after the audience wording changes. |

## Allegation framing (S07-S08)

- Allegation only: yes ("กล่าวหาว่า" in VO and caption). Denial present before the end: yes. No verdict implied: yes; no image of food, body or court. No outcome claimed: yes, after FC03 (absence of reports, not a status).
- The only risk found was FC01 (reads as "killed"). The reported allegation is eating remains, not causing the death.
- Named living person plus a serious allegation: the script gives the other side and the "no report of outcome" line. Also unused but available if the user wants more balance: his side called the suit a bid to share royalties, and the lawyer said the family cannot prove it (F019). Not required.
- Opposite wording to avoid in later stages: "กินเนื้อคน", "คดียังไม่จบ", "ศาลสั่ง", any court building.

## Monetization-safe wording

Pass with FC01. "กินร่างของเพื่อนร่วมเรือหลังเสียชีวิต" is one flat clause in the allegation, no gore, no method; "cannibal" never spoken. "เลือดเต่า" and "ปัสสาวะ" are one-clause mentions with no red or cup imagery (Film constraint stands). The word "ร่าง" appears once in S07 and once in S08; do not add "ศพ". No visible body in any beat.

## Sound

All sounds are fictional reconstruction (script says so). No real recording, siren, crowd, gunshot or rescue cue is used. The S07 thud/riser asserts nothing. Nothing needs a source.

## Recheck scope after Preaw applies FC01-FC05

Boat rechecks only: S07 sentence, S08 sentence, S07 on-screen, S06 sentence (if kept), claim mapping rows. Timing stays `estimated`; the net change is about +1.0 s (FC01), -1.4 s (FC05 cut), so S06-S08 stays inside the 45 s plan if FC05 is taken.

## Remaining unverified items (plainly)

Because Guardian, BBC, Time (fetch), Wikipedia and the book text/publisher excerpt were unreachable, and NBC, CNN and Simon & Schuster failed DNS:

1. Trip length (F008) is not settled from *438 Days*; only "not one day" can be said, hedged "ไม่กี่วัน".
2. Departure and landing dates (F002, F003) rest on search summaries; "ปลายปี 2012" and "ต้นปี 2014" are hedged to survive the 17/18 Nov, 29/30 Jan conflicts.
3. Duration 438 days is his count via the book title; the calendar arithmetic checks (about 439 days) but no page was opened.
4. Death timing and cause (F012, F013): not stated as numbers; account is his only.
5. The lawyer's exact words and the plaintiffs, court, filing date and amount of the suit (F017-F019) are unseen at source; the AP/UPI original, Time and El Diario de Hoy were not opened. "Ricardo Cucalón said the body was thrown into the ocean" is a tabloid relay.
6. F020 is an absence-of-reports finding from search only.
7. Distance, boat length, ages, weight, radio status: not used (or cut).

## Handoff

- Verdict `fixes-required`: apply FC01-FC05 (Preaw), then Boat rechecks the changed rows; after that the script is supportable at medium confidence with the gaps above visible, and the matching script and review revisions can go to Film. This review adds no user approval (W1.4 is separate).
- Open for the user: keep the main hook (recommended) over `ALT-HOOK-U`.

## Recheck R1.1

Reviewed: `ALV-SCRIPT-R1.1` (`short/script.md`, S06-S08 sections and the R1.1 change log) against `ALV-FACTCHECK-R1`. No new web research; coverage is unchanged (search summaries only; see the unverified list above).

| ID | Result | Text found in R1.1 |
| --- | --- | --- |
| FC01 | Applied verbatim | S07 VO and caption: `...กล่าวหาว่า เขากินร่างของเพื่อนร่วมเรือหลังเสียชีวิต`; "กล่าวหาว่า" kept; wording note forbids "เขากินเพื่อน" |
| FC02 | Applied verbatim | S08 VO: `เขาปฏิเสธ ฝ่ายเขาบอกว่าร่างเพื่อนถูกปล่อยลงทะเล… บนเรือมีพยานคนเดียว คือตัวเขาเอง และยังไม่พบรายงานผลคดี`; lawyer name off screen |
| FC03 | Applied verbatim | VO tail `ยังไม่พบรายงานผลคดี`; on-screen `ไม่พบรายงานผลคดี`; no "ยังไม่ตัดสิน" |
| FC04 | Applied verbatim | S07 small line `รายงานข่าว ธ.ค. 2015` |
| FC05 | Applied (cut form) | S06 VO `ต้นปี 2014 เรือไปเกยหมู่เกาะมาร์แชลล์`; F005 not stated; `438 วัน (ตามที่เขานับ)` on screen only |
| FC06-FC08 | Optional / no change | Not applied, as allowed; S07 sound stays muted (no heartbeat, siren, crowd) |

New text introduced: none. Mechanical updates by Boat: claim-mapping rows S06-S08 and the S08 Claims line, logline-area notes, beat list and twist-logic text that still said "lawyer" or F005 now match R1.1 ("his side"; distance cut). A visual line in S08 now cites the "ฝ่ายเขาบอกว่า" line for the drifting hat; the hat stays a symbolic stand-in, no body. Premise, reveal and learning unchanged. The S09 question is about survival, not guilt.

Verdict: **`ready-for-storyboard`** at **medium** confidence for the stated claims, with the known gaps visible: sources are search-result summaries only (no page opened); F008 trip length hedged as "ไม่กี่วัน"; F012 death timing and cause rest on Alvarenga's account only; F017-F019 lawsuit details and the lawyer relay unseen at source; F020 is an absence-of-reports finding from search only. Timing remains `estimated`. This adds no user approval (W1.4 is separate). Matching revisions for Film: `ALV-SCRIPT-R1.1` and `ALV-FACTCHECK-R1` + Recheck R1.1.
