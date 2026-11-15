# EDU-EP17-SHORT fact-check (Boat W1.3)

- Deliverable `EDU-EP17-SHORT`, channel edu. Checked: **EDU-EP17-SCRIPT-R1** (Preaw), with Boat inline fixes applied as **R1.1** (2026-11-14). Wording in the table is R1.1; the R1 wording is shown where it changed.
- Verdict for R1.2.1 (L14, L15, F023 recheck, see [R1.2.1 recheck](#r121-recheck)): **ready-for-storyboard**, no must-fix, one optional fix applied. Verdict for R1.1: **ready-for-storyboard** (no must-fix open). R1 as written had **one must-fix (L15)**, now fixed. Not user-approved; readiness is factual only. Timing is estimated, not read aloud.
- Terms: no line, shot or note uses "ผู้ก่อการร้าย" or "ก่อวินาศกรรม" as a finding. Inspected sources show none; Egypt 2013 sources themselves use "sabotage" as press framing only.

## Inspected-source registry

| ID | Source | Access | Used for |
| --- | --- | --- | --- |
| S1 | UN News, 2 Feb 2026, https://news.un.org/en/story/2026/02/1166867 | page read via WebFetch (summarising model; quotes returned verbatim, not full text) | ITU Deputy SG Lamanauskas: "About 99 per cent of the international internet traffic goes through submarine cables." Article text: "typically 150 to 200 cable incidents each year, averaging about three to four per week"; "around 80 per cent ... caused by human activity, from ship anchors or fishing trawlers" |
| S2 | ICPC, Submarine Cable Protection and the Environment, issue 1, https://iscpc.org/publications/submarine-cable-protection-and-the-environment/ICPC_Submarine_Cable_Protection_Environment_issue_1.pdf | **raw PDF text extracted by me (python zlib; no pdftotext on this machine)**, read by keyword | "typically no wider than a garden hose"; "Between 65-75% of all telecommunication cable faults occur in water depths shallower than 200m and result from fishing and shipping activities"; natural hazards "less than 10% of faults"; owners "develop mesh networks consisting of multiple cables" |
| S3 | TeleGeography FAQ, https://www2.telegeography.com/submarine-cable-faqs-frequently-asked-questions | page read via WebFetch | "For most of its journey across the ocean, a cable is typically as wide as a garden hose"; "roughly 200 faults each year, according to ... ICPC"; fishing vessels and dragged anchors "two-thirds of all cable faults"; buried near shore, laid on seafloor in deep water |
| S4 | TechCrunch 28 Mar 2013, https://techcrunch.com/2013/03/28/three-men-arrested-for-attempting-to-cut-undersea-internet-cable-in-egypt/ | WebFetch | Army spokesperson: "The armed forces foiled an attempt and arrested three divers while they were cutting a submarine cable." Off Alexandria; no motive given; line said to belong to Telecom Egypt |
| S5 | TechCentral 28 Mar 2013, https://techcentral.co.za/sabotage-not-suspected-in-seacom-cut-ceo/187629 | WebFetch (full text not reproduced by tool; two fetches agree) | Mark Simpson, SEACOM CEO: the SEACOM break (about 20 km offshore, "much deeper water") had the characteristics of an anchor dragged along the seabed; on sabotage "You can never say never, but I'd be very surprised". The divers were arrested hundreds of metres from shore, suspected of targeting **Sea-Me-We 4**, not SEACOM's cable |
| S6 | Web search summaries (Reuters/MENA via Silicon Republic, NBC, Salon etc.), search 2026-11-14 | snippets only, lead level | Divers were on a fishing boat; Alexandria security director (MENA) said under questioning they cut it "by mistake"; another report said salvaging wrecks; no court outcome found |
| S7 | Search summaries (MAREA 160 Tbps/8 fibre pairs; TeleGeography analysis ~21 Gbps per Starlink satellite; whole constellation estimates 24 Tbps to >300 Tbps, contested) | snippets only | direction of L05-L06 only |

Not reachable: iscpc.org "about" page (404), cablejoints guide URL (returns an HTML 404 page, not the PDF; the saved copy cited in research.md did not exist), BBC (fetch blocked). Not needed after S2/S3.

## Verdicts per line (R1.1 wording)

Severity: must-fix / optional. "Clarity" is the ER05 pass.

| Line | Wording checked | Class | Verdict | Evidence | Reason / correction | Sev |
| --- | --- | --- | --- | --- | --- | --- |
| L01 | "เสียงคุณแทบไม่ได้ขึ้นดาวเทียมนะ" (R1: "ไม่ได้ขึ้น", unhedged) | narrator assertion | supported after fix (R1: needs-qualification) | S1 | ITU says ~99% of international traffic; 1% plus remote, ship, plane users means "ไม่ได้ขึ้น" is false for some callers. Q1 answered: add "แทบ". L03 repeats "ราว ๆ", one hedge per line, fine. Hook stays plain, middle-school level | optional (applied) |
| L02 | "มันวิ่งไปตามสายที่นอนอยู่ก้นทะเล" | narrator | supported | S1, S3 | Near shore the cable is buried, in deep water it lies on the seafloor; "นอนอยู่ก้นทะเล" is true as a plain description. Film: do not show the near-shore cable bare if the shot claims burial (see L10) | optional |
| L03 | "เน็ตข้ามประเทศ ราว ๆ เก้าสิบเก้าเปอร์เซ็นต์ ไปทางนี้"; subtitle "ราว 99%" (R1: "99%") | narrator + on-screen number | supported | S1 | Figure is ITU's, for "international internet traffic", matches "เน็ตข้ามประเทศ". On-screen number now carries the hedge | optional (applied) |
| V01-V03 | character lines | fiction | N/A | | Character belief only | |
| L04 | "ทำไมต้องลากสายลงทะเล… ไม่ใช้ดาวเทียมล่ะ" | question | supported (no claim) | | | |
| L05 | "ดาวเทียมเหมือนเฮลิคอปเตอร์… ขนได้ทีละนิด" | analogy, direction | supported, direction only | S3, S7 | One satellite handles on the order of tens of Gbps (S7 ~21 Gbps for Starlink, S7 estimate); one modern cable 160+ Tbps (S7 MAREA). Per satellite the direction is right by about three orders of magnitude. Not supported if heard as "all satellites together are small" (constellation totals are contested, S7); the line does not say that. No "slow" claim. Q2 answer: safe | optional |
| L06 | "สายใต้ทะเลเส้นเดียว คือทางด่วนหลายสิบเลน" | analogy | supported, direction only | S7 | "หลายสิบเลน" is not read as a number by a lunch listener and understates the real ratio, so no wrong takeaway. Clarity: plain, no term, `ER05 pass`. Wording preference (optional, Preaw may decline): "ดาวเทียมแต่ละดวง" in L05 to stay literally true against constellations | optional |
| L07 | "แต่กลางทะเลลึก… สายที่แบกเน็ตข้ามโลก หนาแค่ประมาณสายยางรดน้ำ" | narrator | supported | S2 ("typically no wider than a garden hose"), S3 | Applies to the deep-water section; armoured near-shore sections are thicker (not claimed). Scope kept by "กลางทะเลลึก". One hedge "ประมาณ". Hose-to-cable match cut fine at ~20 mm | |
| L09 | "แล้วอะไรทำมันขาดล่ะ" | question | supported (no claim) | | | |
| L10 | "แปลกตรงที่… มันมักขาดตรงน้ำตื้นใกล้ฝั่ง ไม่ใช่กลางทะเลลึก" | narrator | supported | S2 (65-75% of faults in water <200 m, from fishing and shipping), S3 | "มัก" matches 65-75%. "ใกล้ฝั่ง" vs "<200 m": shelf water can extend off shore; fine for a plain description | |
| L12 | "เพราะตรงนั้นมีเรือ… สมอกับอวนลากครูดพื้น เกี่ยวสายขาด" | narrator | supported (majority cause) | S1 (~80% human activity), S2, S3 (two-thirds) | Sources range 65-80%; L10's "มัก" carries the majority. Clarity on "อวนลาก": a common Thai word (trawl net dragged along the bottom), plain, `ER05 pass`; no gloss needed. "ขาด" for a snag: sources say "faults"; fine in a story line | |
| L13 | "สายไม่ได้กลัวทะเลลึก… มันกลัวเรือ" | rhetorical refrain | supported as a "mostly" rule | S2 | Natural hazards are under 10% of faults (S2) and can hit deep cables (canyon flows, quakes), so "ไม่ได้กลัวทะเลลึก" is slightly stronger than the data; the preceding "มัก" and rhetorical tone cover it. Q4 answer: acceptable, direction true | optional |
| L14 | "แต่ปี 2013 ทหารอียิปต์บอกว่า… จับนักดำน้ำสามคนที่กำลังตัดสาย" (R1: "ทหารอียิปต์จับนักดำน้ำสามคน… บอกว่ากำลังตัดสาย") | narrator, attributed real case | supported after fix (R1: needs-qualification) | S4 | The army spokesperson said it arrested three divers "while they were cutting a submarine cable", off Alexandria, no motive. R1 order let "บอกว่า" read as the divers speaking; attribution now comes first. No court outcome found; S6 says detainees reportedly claimed a mistake, so do not add or imply intent or innocence. Flashback "ภาพจำลอง" is correctly labelled; night, patrol light and "shallow" are invented staging (reports: hundreds of metres off shore, a fishing boat) | optional (applied) |
| L15 | "ฟังเหมือนจงใจ… แต่สายอีกเส้นที่ขาดช่วงนั้น เจ้าของบอกว่า น่าจะโดนสมอเรือลาก" (R1: "แต่เจ้าของสายที่ขาดบอกว่า…") | narrator, attributed real case | supported after fix (R1: **contradicted as implied**) | S5, S4 | R1 put the army's arrest and SEACOM's anchor reading back to back and called SEACOM "เจ้าของสายที่ขาด", which a viewer takes as the divers' own cable. S5: the arrests were near Sea-Me-We 4, hundreds of metres from shore; SEACOM's cut was about 20 km out in deeper water and was Simpson's reading of its own break. Presenting it as the answer to the divers misrepresents a real case. R1.1 says "สายอีกเส้น", keeping "น่าจะ" (Simpson said "had the characteristics of" an anchor drag). Still true to the brief: no sabotage, no terrorism, no claim the divers cut the failing cable or did not | **must-fix (applied)** |
| L17 | "สายใต้ทะเลทั่วโลก เสียหายราว ๆ สัปดาห์ละสามสี่ครั้ง" (R1: "ขาด") | narrator | supported after fix | S1 (150-200 incidents, 3-4 a week), S3 (~200 faults), S2 ("faults") | The sources count incidents/faults, not all complete breaks. "เสียหาย" is accurate; Q5 answered. L10/L12 keep "ขาด" for the snag story, acceptable | optional (applied) |
| L18 | "แต่คุณแทบไม่รู้ตัว… เพราะเน็ตอ้อมไปเส้นอื่น" | narrator | supported | S2 (mesh networks of multiple cables) | Rerouting is the stated design basis. Places with few cables do notice (islands, some coasts); "แทบ" covers the general viewer. Rerouting evidence is mostly industry statement, qualitative confidence medium | optional |
| L19 | "สายที่เขาคุยอยู่ตอนนี้… ก็อาจกำลังอ้อมอยู่" | possibility | supported (hedged "อาจ") | S1, S2 | At any moment some cable is probably in repair; "อาจ" is right. Pun สาย is wordplay only | |
| Subtitles | "ราว 99%", "2013", "ภาพจำลอง", "2013 · อียิปต์" | on-screen | supported | S1, S4 | | |
| Notes / add-backs | A1 L08 "วางอยู่บนพื้นทะเลเฉย ๆ" supported (S3, deep water lies on the seafloor); A2 L11 "ตรงนั้นหุ้มเหล็กหนากว่า" not reopened by me (armour near shore only from Wikipedia/guide summaries): recheck before use; A3 L16 fine | | | | | |
| Sound | no sound claims made in script | | N/A | | A siren or patrol-boat sound in B05 is labelled fictional by the "ภาพจำลอง" card; do not add a real news recording | |

## Clarity pass (ER05)

- L05-L06: plain, everyday comparison, no term, ER05 pass; `misleading-analogy` not triggered (direction true). Optional literal fix noted above.
- "อวนลาก" (L12): not too-technical; one common word with a picture of a net scraping the bottom.
- No `too-technical` line found. ER07: no beat needs cutting; L15 still has an answer. ER09: L15 gets +3 syll (≈ +0.5 s), OQ6 stays under 10 s.

## Impacts and flags for Preaw (not rewritten by Boat)

1. **OQ6 / B05 premise (optional, no must-fix):** the beat "did the divers do it on purpose?" is no longer answered by L15 as R1 implied. The honest answer is unknown (no outcome found). L15 now says: the cut on another cable that week looked like an anchor. If you want the twist to be honest and clear, retitle OQ6 as "Is that what broke the net?" or accept that L15 tells viewers the other cut was probably an anchor. Logline and B05 were synced to R1.1.
2. L15 shows a "different shot of the seabed" with a drag mark and snapped end: that is a depiction of a likely anchor drag, not footage of SEACOM's cut. Mark it as the same "ภาพจำลอง" (optional, one on-screen label).
3. SEACOM's break was in "much deeper water" (depth not stated) while the refrain says deep sea is safe; the story does not claim a depth, so no conflict, but Film should not draw that shot as shallow bay.
4. research.md F021 summary ("very unlikely linked to the arrests") overstated S5; corrected in the research file note below.

## Uncertainty and access limits

- S1, S3, S4, S5 were read through a summarising fetch tool (verbatim quotes returned, not full pages). S2 is the only raw primary text I read. All three figures used in narration (99%, 3-4 a week, garden hose) are corroborated by at least two independent organisations (ITU/UN, ICPC, TeleGeography). The UN News 3-4 a week is ICPC-derived, so S1/S3 are not fully independent on frequency.
- Egypt 2013: outcome of the case not found; no later official finding. The sentence stays an attribution, nothing more.
- Capacity figures (S7) are search-snippet level; they only support direction.

## Readiness

R1.1 = `ready-for-storyboard` (factual only) for Film W2, conditional on Preaw accepting or declining the optional notes. No user approval implied. Recheck if L14/L15 wording changes again.

<a id="r121-recheck"></a>
## R1.2.1 recheck: L14, L15, F023, B05 on-screen text (Boat, 2026-11-14)

Sources opened (summarising fetch; verbatim quotes returned): R-S1 CBS News (updated 6 Mar 2024; Kirby to David Martin) https://www.cbsnews.com/news/houthis-ship-cutting-red-sea-telecommunications-cables ; R-S2 AP via PBS NewsHour (Houthi denial, cables, Seacom "plausible", repair ship) https://www.pbs.org/newshour/world/houthi-rebels-deny-severing-three-red-sea-underwater-cables ; R-S3 gCaptain/Bloomberg (ICPC, drift ~2 weeks, 3 cables) https://gcaptain.com/rubymar-anchor-seen-as-likely-cause-of-severed-red-sea-cables ; R-S4 Kentik (cut time 24 Feb ~09:46/09:51 UTC, inferred; Rubymar drifting with anchor down; "leading theory") https://www.kentik.com/blog/what-caused-the-red-sea-submarine-cable-cuts/ ; R-S5 Middle East Eye (18 Feb hit, 2 Mar sank, Houthi denial, analysts split). Not found: repair-ship confirmation (Seacom planned repairs early Q2).

| Line | Claim | Verdict | Evidence | Finding (severity) |
| --- | --- | --- | --- | --- |
| L14 | 2024, Red Sea, ship hit by missile | supported | R-S1, R-S3, R-S5 (18 Feb) | none |
| L14 | "สายขาดสามเส้น" | supported | R-S1, R-S3: three cables. R-S2: HGC named four, Seacom and TGN-Gulf are one cable at the site, so three. R-S4: EIG was already down from a December fault, so only two had visible impact (not a script issue) | none |
| L14 | "แล้ว" sequence | supported as sequence only | hit 18 Feb, cuts 24 Feb. Thai "แล้ว" can be read as "and so", but L15 raises the cause question immediately and L14 names no attacker | optional: leave |
| L15 | "ทำเนียบขาว" for Kirby | fair | R-S1: "White House national security communications adviser"; "สหรัฐฯ" would be vaguer, not more correct | none, keep |
| L15 | "น่าจะโดนสมอเรือลำนั้นเอง" | supported, hedged | Kirby "mostly" (CBS) / "most likely" (other outlets); ICPC "generally accepted"; Seacom "plausible", only confirmed on site; no repair confirmation | none; "น่าจะ" carries it |
| L15 | "ลากพื้นตอนจม" | timing not supported | Kirby said "as she sank", but Kentik dates the cuts to 24 Feb, the ship sank 2 Mar after drifting about two weeks with the anchor down (R-S3, R-S4) | optional, applied: "ตอนจม" cut; picture "sinking hull" → "abandoned, drifting hull" |
| L15 | "ฟังเหมือนจงใจ" with denial unspoken | fair framing | Houthis denied (R-S2, R-S5), no evidence given; no one is named in narration, the line voices a viewer reaction and L15 gives the counter-reading. Missile attack itself is the attacker's own claimed act and unnamed here | optional: a short denial add-back is not needed; if wanted, "ฮูตีปฏิเสธ" costs ~4 syll and ≈ +0.7 s on the 3.4 s OQ6 window |
| B05 | "ภาพจำลอง", "2024 · ทะเลแดง" | supported | label on every flashback shot; listing ship, no missile, no attacker, anchor drag across three cables is a depiction, not footage | none |

Cause remains unconfirmed in the sources (R-S4 "leading theory"); the script keeps it as an attributed "น่าจะ". No "terrorist" or "sabotage" wording in L14 or L15. Sound: B05 cue sheet carries no missile, alarm or guilt stinger (checked).

Verdict: L14 supported; L15 supported after the optional cut. R1.2.1 = `ready-for-storyboard` (factual only, not user-approved).
