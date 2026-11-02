# EVERYONE-GONE EP01 (C1) — research packet (Boat, W1.1)

- Deliverable: `EG-EP01-SHORT`; concept C1 "ประตูที่ไม่เปิดให้คุณ" ([concepts.md](concepts.md#c1--ประตูที่ไม่เปิดให้คุณ)); research date 2026-11-03; checkout `ff7dcfa`.
- Mode: `fiction-with-factual-knowledge` (default, labelled). Central question: why would an automatic door refuse to open for the protagonist? Learning takeaway: what an automatic door actually detects.
- Scope: facts only, no script text. Confidence is qualitative.

## Source registry

| ID | Source | Status | Notes / limits |
| --- | --- | --- | --- |
| SRC001 | BEA, sensor catalog (manufacturer), https://absupply.net/pdf/BEA_SensorCATALOG.pdf | **lead-only**: PDF text not extractable by my tools; claims known only via a search summary (Doppler principle, "detects motion only", 24.150 GHz, minimum speed 5 cm/s, IR emitter of several LEDs + receiver) | Manufacturer primary, but not opened. Re-check by hand before an on-screen number. |
| SRC002 | Pepperl+Fuchs, MotionScan datasheet, https://files.pepperl-fuchs.com/webcat/navi/productInfo/doct/tdoct5670b_eng.pdf | **lead-only** (link 302s to a 404; PDF saved but text not extractable) | Per search summary: radar field opens the door, active IR guards against closing on a person. Dual-technology claim only. |
| SRC003 | sensorsdoor.blogspot.com, "How Does a Radar Sensor Work in Automatic Sliding Doors?" (2025-08), https://sensorsdoor.blogspot.com/2025/08/how-does-radar-sensor-work-in-automatic.html | inspected | Promotional blog, low trust. Supports: continuous microwave 24/5.8 GHz band, Doppler shift, speed/direction/size thresholds, some models separate approaching from leaving. Silent on stationary persons. Use only as a secondary pointer. |
| SRC004 | USPTO patent 7495556, "Sensor for use with automatic doors", https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/7495556 | **lead-only** (scanned image, no text) | Would be a good primary for the background of sensor types; needs manual read. |
| SRC005 | BTS Skytrain official, https://www.bts.co.th/eng/traintime-frequency/ (page says "Effective from 1st January 2026"), accessed 2026-11-03 | inspected (partial) | Gives service hours 05:00 to 01:00 and last trains from Siam (00:02, 00:15). First-train times and headway values were missing from the extracted text. |
| SRC006 | Wikipedia, "BTS Skytrain", https://en.wikipedia.org/wiki/BTS_Skytrain | inspected (first 100k of 239k chars) | Tertiary. Infobox headway Sukhumvit Line 2.40 to 6.00 min; Asok (E4) interchange with MRT Blue Line; Phrom Phong (E5); platform screen doors from 2014. |
| SRC007 | Travel guides via search (thailand.go.th BTS guide, TAT news 2020) | lead-only (snippets) | First Sukhumvit train 05:15 (Silom 05:30); conflicts with SRC005's 05:00 service start. |
| SRC008 | Travel/street-food guides (Time Out Bangkok, khaosanroad.com morning guide) via search | lead-only (snippets) | Jok (rice porridge) is a common Bangkok breakfast; 07:00 to 09:00 suggested for street food; morning stalls near Phrom Phong on Sukhumvit Rd. |
| SRC009 | Freesound "Electric Eye" entry-chime listing | lead-only | Shows generic shop chimes are often a separate beam-triggered entry chime; nothing on any Thai chain. |

Not found: any inspected source on pressure mats; the current standard (e.g. ANSI/BHMA A156.10) text; any source on the specific door/chime hardware of Thai convenience stores. All are open gaps.

## 1. Automatic-door sensors

| ID | Claim | Scope / conditions | Source | Confidence | Usable wording (fact) |
| --- | --- | --- | --- | --- | --- |
| F001 | Microwave (radar) door sensors emit microwave energy and detect the Doppler shift in the reflection from something that is moving. | Motion sensors; typical bands 5.8 / 10.5 / 24 GHz. | SRC003 (inspected, weak), SRC001 (lead, manufacturer says "Doppler Effect Principle", "motion only") | Medium: mechanism is textbook, but my best sources are weak or not opened. | "ประตูส่งคลื่นไมโครเวฟออกไป แล้วดูว่าคลื่นที่สะท้อนกลับมาเปลี่ยนความถี่ไหม ถ้าเปลี่ยน แปลว่ามีบางอย่างขยับ" |
| F002 | Radar detects movement, not a body as such. Something still, or slower than the sensor's minimum speed, may not trigger it. The door cannot tell a person from a trolley or a swinging sign. | Manufacturer spec example: min speed 5 cm/s (BEA, lead-only). SRC003 only says thresholds exist. | SRC001 lead, SRC003 | Medium-low on the numbers; high on the general principle. | Say "สิ่งที่ขยับ", never "คน" or "ร่างกาย". Do not show 5 cm/s on screen until SRC001 is read. |
| F003 | Passive infrared (PIR) sensors respond to a change in infrared radiation in view, i.e. a warm body against a cooler background; they need a temperature contrast and are affected by ambient temperature and sunlight. | PIR in doors is less common than radar; some sources say slower than radar. | search summary of SRC003-type pages; general physics | Medium-low (no primary opened). | "อินฟราเรดแบบรับ ดูว่าความร้อนในมุมมองเปลี่ยนไหม" |
| F004 | Active infrared (emitter + receiver) sends IR light into a zone and detects the return or a broken beam. Doors commonly use it as a presence/safety sensor to stop the door closing on someone, often together with radar for opening. | Dual-technology units are common (radar opens, IR keeps it from closing). | SRC001 (lead), SRC002 (lead) | Medium. | Safe line: "บางประตูใช้สองระบบ ระบบหนึ่งสั่งเปิด อีกระบบกันประตูหนีบ" |
| F005 | Pressure/floor mats: a mat under the floor detects weight/pressure of someone stepping on it, which opens the door. Older or specific installations. | Not verified here. No inspected source. | none | **Unresolved**. Usable only as "general knowledge, not source-checked"; recommend not to state it, or to say "บางที่ใช้แผ่นพื้นรับน้ำหนัก" only after a source is found. Not likely to be used at a Bangkok convenience store frontage (unverified). |
| F006 | Sensors can be fooled or blind by their own conditions: highly reflective surroundings cause false triggers; sunlight/heat affect PIR; dust/fog affect active IR; a person standing still may not trigger radar. | Manufacturer troubleshooting notes (BEA, search summary only). | SRC001-family (lead) | Medium-low. | Options for the "ignores you" explanation below. |

### What would make a sensor ignore a person (real, not fiction)
1. Radar: person completely still (or moving below the minimum speed); moving away rather than toward the door on a unidirectional unit; person outside the angled detection field. (F002, F003 summary)
2. PIR: no temperature contrast with background, or covered by glass/clothing in the sensor's path.
3. Sensor fault, misaim or disabled mode (e.g. a lock/exit-only setting); the door is simply not powered.
4. Because a real door acts on motion in its field, a real person walking, waving or jumping in front of a working radar door would be expected to open it. The story's "door won't open for you while waving and jumping" is therefore **not what a fault would normally look like**; it is the fiction's premise. State this on the boundary list below.

Story-angle note (not a rewrite): concept beat 4 says the door "sees" a moving body or heat change, "if it opens, something with a body is there". The accurate version: it opens when it detects motion (or heat change), which is usually a person, not necessarily a person. Door opening alone proves "something moved in the field", not "a person exists". This is a premise/reveal impact: the logic "no body, no detection" is fine as a lie-in-fiction but the claim "a door only opens for people" is false (wind, a cat, a cart, a fault all trigger it). Recommend narration claims only the sensing principle, and lets the twist be emotional, not a proof.

## 2. Bangkok details usable as fair clues (no brand use)

| ID | Detail | Status | Source | Confidence / limit |
| --- | --- | --- | --- | --- |
| F101 | BTS Sukhumvit Line serves Asok (E4, interchange with MRT Blue Line) and Phrom Phong (E5); platform screen doors since about 2014. | documented | SRC006 | Medium-high; tertiary. |
| F102 | BTS service hours run from 05:00 to 01:00 per official page; first Sukhumvit train 05:15 per older guides. At 07:00 the BTS is in service. | documented, but first-train time conflict | SRC005, SRC007 | Medium. Use "ตอนเจ็ดโมง รถไฟฟ้าวิ่งอยู่แล้ว", not an exact minute. |
| F103 | Headway on the Sukhumvit Line is roughly 2.4 to 6 minutes depending on time of day (infobox). The morning-peak value at 07:00 on a given day is not verified. | documented range | SRC006 | Medium-low for 07:00. Avoid a specific number; "ทุกไม่กี่นาที" is safe. |
| F104 | Train sound: rails/steel viaduct hum, doors-closing chirp, station announcements in Thai and English. | general/unverified | none inspected | **Unverified**. Any sound design is stylised; label as reconstructed (sound-workflow rule). |
| F105 | Early-morning life at 07:00: street-food stalls and jok/rice breakfasts are common; stalls near Phrom Phong on Sukhumvit Rd in the morning; iced coffee and rice-pot steam are ordinary scenes. | reported (travel guides) | SRC008 | Medium-low; generic. Fair as atmosphere, not as a claim about a particular stall. |
| F106 | Typical 07:00 soundscape: motorbikes, birds, vendor carts, fridge/compressor hums, cicadas/crows. | general | none inspected | Atmospheric only; treat as fiction sound design. |
| F107 | Shop-door entry chime: generic stores use a separate chime triggered by a beam or the door contact, not by the radar itself; the chime sound of any Thai chain is **not verified**. | generic only | SRC009 (lead) | Low. Do not state that the chime belongs to the door sensor or to a named brand. Fiction treats it as a device sound. |
| F108 | Brand rule: the Film annotation already drops logo/livery; "7-Eleven" in narration is also off-limits if the brand rule applies to audience-facing words (Film/Preaw to confirm). | project rule | concepts.md Film annotation | N/A. |

## 3. Fact-versus-fiction boundary (must be presented as fiction)

Hold these as fiction in narration and visuals; none is established by the sources:

1. Bangkok emptied of all people, and the viewer waking in it (the whole premise).
2. A BTS train running a normal timetable with no one aboard. Real trains are normally run by a driver and a control centre (operation mode not source-checked), so an unmanned train is the story's logic, not a documented capability.
3. Appliances, food and a rice pot still running with no people; "ice coffee still sweating" is a story clue, not physics evidence of "just now" (condensation depends on temperature/humidity).
4. A working door that is activated by invisible people while it refuses the protagonist.
5. A door that refuses a person who is waving and jumping within its field. Real doors usually open to motion (see section 1, point 4); present as the story's impossibility, not as sensor behaviour.
6. The twist that the viewer is the one who vanished. A door's non-response is a fair clue for the story but is not evidence of anyone's existence; do not claim it as proof.
7. The chime playing for nobody (beat 3) and "as someone passing" (beat 5): sound-design fiction; label recorded/synthesised.
8. The sequence "the day restarts at 07:00" loop is fictional.

Safe to state as fact in narration, with the softened wording above: F001 (radar sees moving things via Doppler), F004 (IR used as presence/safety, often combined), F102 (BTS runs at 07:00), F101 (station names if shown).
Must not state as fact: F002's specific speed, F005 pressure mats, "ประตูเปิดเฉพาะคน", a specific chain's door chime, exact BTS minute-level headway.

## Open items before fact-check

1. Read SRC001/SRC002/SRC004 by hand (or find a second primary: a door-sensor datasheet in text form) so F001-F004 become inspected-primary.
2. If pressure mats stay in the SVG diagram, source them.
3. Confirm BTS first train and 07:00 headway from the official timetable PDF if either appears on screen.
4. Ask Film/Preaw: brand rule for the spoken word "เซเว่น", and whether the sensor SVG shows microwave only (safest) or microwave + IR.

## Supported angles and impacts

- Supported: "the door reacts to motion/heat change in its field" as the knowledge beat; the twist as fiction-logic layered on a true mechanism.
- Premise/reveal impact flagged: F002 and boundary item 5 (the door should normally open for a waving, jumping person); the writer may keep it as the uncanny clue but must not present a real sensor as capable of refusing it. No plot change made here.
- Sound: F104/F106/F107 need fiction labels; no real recordings are proposed.
