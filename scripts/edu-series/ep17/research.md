# EDU-EP17-SHORT research packet (Boat W1.1)

- Deliverable: EDU-EP17-SHORT (channel edu, Thai Short 40-60 s). Concept: [C61](../concepts/C61.md). Researched 2026-11-14 by Boat. Script revision: none yet (research before writing).
- Structure the user wants: hook -> question + delay -> rehook -> question + delay -> answer.
- Access note: all sources below were reached through web search plus WebFetch page summaries (a small model summarised each page). No raw primary document was read in full (the ICPC PDF was binary and unreadable; Guardian and iscpc.org/about returned errors). So every row is "secondary or summarised", confidence is capped accordingly, and the Fact-check stage must reopen the key figures before they reach narration.
- Search results are untrusted material: one search result contained embedded text telling the searcher to change task (a recipe request); it was ignored and nothing from it is used.

## Headline: the word "terrorist" is NOT supported

No court, prosecutor, accident-investigation body or government statement found uses "terrorism" for any cable case below. What exists, per case:

| Case | Proven | Suspected / alleged | Denied or unresolved | "Terrorism" used by an official body? |
| --- | --- | --- | --- | --- |
| Egypt 2013 | Army said it arrested 3 divers off Alexandria "while they were cutting a submarine cable" (army spokesman; motive not stated) | Army called it a "criminal operation" (one outlet) | SEACOM's CEO said the separate 27 March cut looked like an anchor drag and the arrests and the cut were very unlikely connected; no court outcome found | No |
| 2008 Mediterranean cuts | Two cables (FLAG, SEA-ME-WE 4) failed near Alexandria 30 Jan 2008 | Many sources speculated anchor drag | Egypt's ministry said no ship crossed the site; no operator stated a cause | No |
| Red Sea 2024 (Rubymar) | Ship hit by a Houthi missile 18 Feb, drifted and sank; 3 cables cut (HGC) | US official (Kirby): cut "mostly by an anchor dragging from the Rubymar as she sank"; the ICPC GM said it is generally accepted the anchor was dropped | Houthis denied severing the cables; Seacom said anchor drag plausible, to be confirmed only on site | No (the missile attack on the ship is a separate, undisputed act) |
| Baltic 2023 Newnew Polar Bear | Finnish police found a drag trail and a 6-tonne anchor linked to the ship; China later called the damage accidental (per secondary report) | Finland's investigation line stayed on the ship; a Hong Kong charge against its captain is mentioned by APNIC only | No final finding of intent | No |
| Baltic Nov 2024 Yi Peng 3 | Ship damaged C-Lion 1 and BCS East-West Interlink (18 Nov 2024); anchor dragged about 1.5 days | Deliberate release (hypothesis 1) | Sweden's SHK (15 Apr 2025) could not tell deliberate from accident; boarding was rushed and limited | No |
| Baltic Dec 2024 Eagle S | Estlink 2 and telecom cables cut 25 Dec 2024; Helsinki Court of Appeal (per The Record) said the first anchor drop could be accidental but later conduct was not, and sent the case back for trial | Prosecutors charged 3 officers; ship seized on suspicion of "aggravated criminal mischief" | District court dismissed on jurisdiction 3 Oct 2025; appeal court reversed; not final; no verdict on guilt | No (charge wording is criminal mischief, not terrorism) |

Safe framing for the narration: "ตัดจริง แต่ไม่มีใครพิสูจน์ได้ว่าจงใจ" style. Never "ผู้ก่อการร้าย", never "ก่อวินาศกรรม" as a finding; "ต้องสงสัย" or "ยังไม่มีคำตัดสิน" is the supported level.

## Claim ledger

Source quality: A = primary or official body, B = reputable news or trade press, C = vendor/blog/aggregator. Confidence: H/M/L after the access note above.

### Traffic share and why not satellites

| ID | Claim | Source | Quality | Conf | Narration may safely say |
| --- | --- | --- | --- | --- | --- |
| F001 | About 99% of international internet traffic runs through submarine cables (ITU Deputy Secretary-General Tomas Lamanauskas) | https://news.un.org/en/story/2026/02/1166867 | A/B (UN News quoting ITU) | H | "ราว 99%" with hedge word; ITU's own figure |
| F002 | Wikipedia gives satellites under 5% of global data, one estimate as low as 0.5%; no primary satellite share found | https://en.wikipedia.org/wiki/Submarine_communications_cable | C | L | Do not state a satellite percentage. Say "แทบทั้งหมด" for cables only |
| F003 | More than 500 commercial submarine cables, about 1.7 million km total | https://news.un.org/en/story/2026/02/1166867 | B | M | "มากกว่า 500 เส้น" is safe; the km figure is narration-level in the article, hedge "ราว ๆ" |
| F004 | Geostationary satellite delay: a round trip to orbit is about 72,000 km, which is roughly 240 ms before equipment; real-world quoted 500-800 ms | https://eureka.patsnap.com/report-fixed-satellite-vs-submarine-cable-latency-comparisons and https://speedtesthq.com/guides/satellite/satellite-vs-fiber-latency-physics | C | L-M (the 240 ms is physics; 500-800 is vendor-grade) | Safe: "ไกลถึงวงโคจรสูงราว 36,000 กม. สัญญาณเลยช้ากว่าเส้นใยแก้วมาก". Do not give a real-world ms number. Needs a primary (ITU or a cable-operator page) before any number is spoken |
| F005 | Capacity gap: a transatlantic cable system such as MAREA started at 160 Tbps on 8 fibre pairs; GEO satellites are measured in Gbps | https://newspaceeconomy.ca/2023/08/13/the-battle-for-bandwidth-submarine-cable-and-broadband-satellite-data/ | C | L-M | Hedge hard: "สายเดียวส่งข้อมูลได้มากกว่าดาวเทียมทั้งฟ้าก็ว่าได้" is NOT supported for current Starlink. Safer: "หนึ่งเส้นแบกข้อมูลได้มหาศาล". Cost claim: no source found, do not narrate cost |
| F006 | Starlink-class low-orbit constellations exist, so "satellites are always slow" is wrong; the honest limit is capacity, not just delay | not verified | none | L | Avoid "ดาวเทียมช้า" as a blanket claim; say the fixed answer is capacity and that most traffic stays on cable |

### What a cable is, laying, life

| ID | Claim | Source | Quality | Conf | Narration may safely say |
| --- | --- | --- | --- | --- | --- |
| F007 | Modern cables are typically about 25 mm in diameter at the lightly armoured end ("about 1 in"); deep-sea sections lighter, ICPC-derived guide says 17-20 mm, "garden hose" | https://en.wikipedia.org/wiki/Submarine_communications_cable ; ICPC guide https://www.cablejoints.co.uk/upload/Submarine_Cables___ISCPC_Guide.pdf (search summary only) | B/C | M | "หนาประมาณสายยางรดน้ำต้นไม้" for deep-sea section; hedge "ประมาณ" |
| F008 | Near shore the cable is wrapped in extra steel wire (armour); burial is practice in shallow water, down to about 2,000 m depth, to avoid trawling; deep sections generally lie on the seabed | Wikipedia (Technical countermeasures) and ICPC guide (search summary) | B/C | M | "ใกล้ฝั่งหุ้มเหล็กและฝังไว้ ส่วนกลางมหาสมุทรลึกวางบนพื้นทะเลเฉย ๆ". Safe pair; do not give a burial depth in metres (not verified) |
| F009 | Cable weighs about 1.4 tonnes per km in deep-sea sections | Wikipedia | C | L-M | Skip |
| F010 | Cables are laid by cable ships that pay out from shore; no primary figure on ship speed or daily km found | search summary only | C | L | Describe "เรือวางสาย" without numbers |
| F011 | Design life of about 25 years | not found in any inspected source (search for 25 years returned nothing) | none | L | Do not narrate a lifespan |
| F012 | Repair fleet roughly 60 ships worldwide, in pooled regional agreements; another source says 22 and a 2026 slide says under 70; sources disagree | https://blog.apnic.net/2026/10/14/submarine-cable-resilience/ | B | L | If used: "เรือซ่อมสายทั่วโลกมีแค่หลักสิบลำ" (tens, not a number) |
| F013 | Repair costs USD 500k-1M per repair (APNIC; Recorded Future quotes USD 1-3M) | APNIC link | B | L (sources disagree) | Skip the dollar figure |

### Faults and causes

| ID | Claim | Source | Quality | Conf | Narration may safely say |
| --- | --- | --- | --- | --- | --- |
| F014 | 150-200 cable incidents a year, roughly 3-4 a week | https://news.un.org/en/story/2026/02/1166867 (ICPC-sourced) ; APNIC says about 200 | B | H | "ราว ๆ 150 ถึง 200 ครั้งต่อปี" or "เกือบทุกสัปดาห์" |
| F015 | About 80% of incidents are caused by human activity (anchors, trawlers); ICPC says 70-80%; one dataset says fishing+anchoring 86% (fishing about twice as common as anchoring) | UN News; APNIC; https://www.recordedfuture.com/research/submarine-cables-face-increasing-threats (ICPC quote) | B | M-H | "ส่วนใหญ่มาจากอวนลากและสมอเรือ" (majority); use "ราว 7-8 ใน 10" only with hedge. Do not mix the 86% and 80% |
| F016 | Most common cause is a ship anchor or fishing gear touching the cable in water shallower than 200 m; nearly half of faults are in territorial waters; only 2% on the high seas | Recorded Future (ICPC); APNIC | B | M | "ส่วนใหญ่ขาดในน้ำตื้นใกล้ฝั่ง ไม่ใช่กลางมหาสมุทร" - a good surprise (see F025) |
| F017 | Natural causes: geological events about 7% (APNIC dataset); 2022 Tonga eruption severed the island's only cable for several weeks | APNIC; Wikipedia | B/C | M | Optional; ER07 says skip if not needed |
| F018 | Repair response times have more than doubled in 10 years; the longest 2023 repair took 947 days, mostly waiting for permits; 2006 Luzon Strait quake needed 11 ships 49 days | APNIC | B | M (single secondary article) | Repair time is not given as a general figure: no sourced typical "days or weeks". Safe: "ซ่อมต้องรอเรือ บางครั้งนานเป็นสัปดาห์" is NOT supported; omit or say "ไม่ใช่งานเสร็จในวันเดียว" |
| F019 | Faults have stayed around 200 a year while route length grew about 50% | https://www.submarinenetworks.com/en/nv/insights/statistics-on-subsea-cable-fault-and-repair | C | L-M | Skip |

### Named cases (each row links to the verdict table above)

| ID | Claim | Source | Quality | Conf | Narration may safely say |
| --- | --- | --- | --- | --- | --- |
| F020 | March 2013: Egyptian army said it arrested three divers off Alexandria while they were cutting a submarine cable; motive not given; reports put them about 750 m offshore (Reuters via others) | https://techcrunch.com/2013/03/28/three-men-arrested-for-attempting-to-cut-undersea-internet-cable-in-egypt/ ; https://siliconrepublic.com/comms/authorities-arrest-divers-trying-to-cut-undersea-cable-off-egyptian-coast | B | M | "ปี 2013 กองทัพอียิปต์จับนักดำน้ำ 3 คน ระหว่างที่ถูกระบุว่ากำลังตัดสายใต้ทะเล" attributed to the army; do not say they caused the slowdown; no verdict found |
| F021 | SEACOM's CEO Mark Simpson said the 27 March cut looked like an anchor drag; he said he would be 'very surprised' if it was sabotage (W1.3 reread: no explicit statement linking or unlinking the arrests; different cable from the divers') | https://techcentral.co.za/sabotage-not-suspected-in-seacom-cut-ceo/187629 (search summary) | B | M | CORRECTED by W1.3: Simpson said SEACOM's own cut (about 20 km out, deeper water) had the characteristics of an anchor drag; the divers were near Sea-Me-We 4, a different cable. Say "สายอีกเส้น", never that the owner cleared or explained the divers |
| F022 | 30 Jan 2008: FLAG and SEA-ME-WE 4 damaged near Alexandria; no operator stated a cause; Egypt's ministry said no ship passed the site; anchor theory was only speculation | https://www.ripe.net/analyse/archived-projects/mediterranean-fibre-cable-cut/ ; https://en.wikipedia.org/wiki/2008_submarine_cable_disruption | B/C | M | Usable only as "ไม่เคยยืนยันสาเหตุ"; weak and cluttered; recommend cutting (ER07) |
| F023 | Red Sea Feb 2024: Rubymar hit by a Houthi missile on 18 Feb, sank on 2 Mar; 3 cables cut; US (Kirby) said the anchor dragging from the sinking ship did it; Houthis denied cutting cables | https://www.cbsnews.com/news/houthis-ship-cutting-red-sea-telecommunications-cables ; https://www.pbs.org/newshour/world/houthi-rebels-deny-severing-three-red-sea-underwater-cables | B | M-H | "สมอเรือที่กำลังจม ลากไปตามพื้นทะเล น่าจะตัดสายสามเส้น" - an anchor from a ship sunk in war; the cut itself still "น่าจะ". Houthi denial is real; AP noted they are not known to have the diving capability for cables hundreds of metres down (B, M) |
| F024 | Baltic: Yi Peng 3 anchor dragged about 1.5 days; Sweden's SHK on 15 Apr 2025 could not say deliberate or accidental; Eagle S dragged an anchor about 62 miles on 25 Dec 2024 (per secondary report; another gives 90 km, ranges differ) | https://therecord.media/sweden-report-chinese-ship-baltic-sea-cable ; https://therecord.media/finland-appeals-court-revives-case-against-eagle-s | B | M | "สอบแล้วบอกไม่ได้ว่าจงใจหรือพลาด" is exactly SHK's finding; distance is variable, avoid unless reopened |
| F024b | Eagle S: Helsinki Court of Appeal (reported as late Aug 2026; one result says accepted for review in Jan 2026, so timing is uncertain) reversed the dismissal and sent the case back for trial; not final | The Record link above | B | L-M on timing | "ศาลฟินแลนด์ยังพิจารณาคดีอยู่" safe; do not date the ruling |

### Surprise candidates (for the two question beats) and hedges

| ID | Claim | Basis | Conf | Notes for Preaw |
| --- | --- | --- | --- | --- |
| F025 | Most cable faults are in shallow water near shore, only about 2% on the high seas | APNIC; Recorded Future (ICPC) | M | Surprise: "ไม่ใช่ใต้มหาสมุทรลึก". Hedge "ส่วนใหญ่" |
| F026 | Cables in deep water are about as thin as a garden hose and just lie on the bottom | ICPC guide; Wikipedia | M | Strong visual surprise for the rehook; hedge "ประมาณ" |
| F027 | About 3-4 cable incidents occur every week, yet most people never notice, because traffic reroutes over other cables | UN News; AP quote on redundancy (Red Sea) | H on the count, M on rerouting | Good answer-beat close: the net rarely goes down because there are 500+ cables |
| F028 | A Taiwanese captain was convicted over a Penghu cable cut (3-year sentence, Hong Tai 58) | APNIC only | L | Single secondary source; do not use unless reopened. It would be the only conviction found |
| F029 | 2011 Georgia: a woman scavenging with a spade cut a land cable and knocked out Armenia's internet | Guardian could not be fetched | L (unverified here) | Land cable, off topic; skip |

## ER-rule hedges required in the narration (ER05, ER07, ER09, ER10)

Must be hedged (one narrow hedge word per line, ER10):
1. F001 99%: say "แทบทั้งหมด" or "ราว 99%". Not "100%".
2. F014/F015 fault count and anthropogenic share: "ราว ๆ", "ส่วนใหญ่".
3. F020-F023 any sentence that names a ship or men and a cut: attribute to the source and use "น่าจะ", "ถูกกล่าวหา", "ต้องสงสัย". The Rubymar anchor is the best-supported (US official + ICPC + industry consensus) but still "น่าจะ" until the repair ship confirmed it; I did not find the repair confirmation.
4. F024 Baltic cases: "ยังไม่มีคำตัดสินว่าจงใจ". No sentence may say "ก่อวินาศกรรม" or "ผู้ก่อการร้าย" as fact.
5. F007/F008: "ประมาณสายยาง", "ใกล้ฝั่ง".
6. F004/F005 satellites: no ms or Tbps number spoken; phrase as direction only.

Cut or avoid: F002 satellite percentage, F006, F009-F013 cost/lifespan/ship count, F018 repair time, F019, F022 (2008, cluttered), F028-F029.

## Suggested honest anchor-story framing (input only, not the script)

"สมอเรือลากตัดสายได้จริง ทั้งโดยอุบัติเหตุ (ส่วนใหญ่) และมีบางกรณีที่ถูกสงสัยว่าจงใจ แต่ยังไม่มีศาลหรือหน่วยสอบสวนไหนยืนยัน" Cases ranked by evidence: Rubymar 2024 (anchor cause best supported, intent not the issue: ship was being sunk in war), Eagle S (in court, anchor drag proven, intent not decided), Yi Peng 3 (SHK: cannot tell), Egypt 2013 (arrest only, no outcome).

## Open gaps for the fact-check stage

- Re-open and read the primary ICPC "garden hose" and fault-cause pages; iscpc.org/about-submarine-cables returned 404 and the ICPC PDF was unreadable (try `pdftotext` on the saved copy).
- No primary source for latency numbers or satellite share (F002, F004).
- No inspected source for "25 years", burial depth in metres, or typical repair duration (F011, F018).
- Rubymar: repair ship confirmation of the cut cause not found.
- Eagle S appeal date and exact criminal charge wording not confirmed against a court document.
- Hong Kong captain charge for Newnew Polar Bear appears only in the APNIC article.
