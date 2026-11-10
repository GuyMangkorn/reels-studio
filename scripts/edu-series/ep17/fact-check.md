# EDU-EP17-SHORT — fact-check (W1.3, Boat, 2026-11-10)

- Script checked: `script.md` **EDU-EP17-SCRIPT-R1** (all lines new); research [research.md](research.md) W1.1. `script.md`, `task.md`, `delivery.md` not edited. Severity per [finding severity](../../../docs/editorial-workflow.md#finding-severity); clarity pass per [clarity pass](../../../docs/editorial-workflow.md#clarity-pass).
- **Verdict R1: `ready-for-storyboard` (factual readiness only, not user approval). Pass, no R2 needed. No must-fix finding** in the spoken script, on-screen text or title. Optional findings O1–O8 below; Preaw may decline any without a reply. Two of them (O1 "แค่ใกล้ ๆ สนาม", O2 "โดดพร้อมกัน") I recommend taking because they are one-word edits that remove an unsupported claim.
- Qualitative confidence: population, areas and the fit-at-4/m² arithmetic high (margin is only 6 %, but every input is known to better than 1 %); atom comparison high (margin about 3,000x, survives a 100x error in any input); Earth/humanity mass high; Seattle events high; "only near the stadium" for Seattle low (not documented, see O1).

## Sources opened this pass

| ID | Source | Status now | What it settled |
| --- | --- | --- | --- |
| SRC001 | UN press release "UN projects world population to peak within this century" (un.org) | `inspected` (release page; the WPP2024 PDF itself not opened) | "8.2 billion in 2024"; peak about 10.3 billion mid-2080s. |
| SRC002 | Statistics Times / INED tables of WPP 2024 | still `lead-only` | Mid-2025 8.23 billion. Not needed for "กว่าแปดพันล้าน". |
| SRC005 | Bangkok area 1,568.7 km² | still `lead-only`: search found no bangkok.go.th page; a government planning document, two Chulalongkorn theses and press all give 1,568.7 (1,568.737 / 1,568.743) | Access gap: BMA page not opened. Impact nil: no area is spoken, the hook margin is 6 % (140 km²), and the three values differ by under 0.001 %. |
| SRC006 | Nonthaburi area | `inspected` as a search excerpt of the provincial agriculture office data sheet (opsmoac.go.th, revised 23 Feb 2026): 622.303 km² (388,939 rai) | Matches 622.3. The 637 km² forest-table figure stays an outlier; at 637 the fill ends at 76 %, not 77 %. |
| SRC007 | PNSN blog "Beast Quake (Taylor's Version)" | `inspected` (re-opened) | KDK "across the street from Lumen Field"; "70,000+" at both events; neither event "caused" or "triggered" an earthquake ("these events were not earthquakes"); any magnitude "at best, very approximate"; fan movement vs loud music as the cause is **still under study**; names only station KDK, says nothing about other stations. |
| SRC008 | Vidale, PNSN blog "One year ago, Seattle Seahawks 12th Man Earthquake" | `inspected` (re-opened) | KDK "a block or so away"; "the roar and stomping of the tens of thousands of feet"; "One-station signals are always hard to verify"; no attendance number, no jumping, no statement about felt-or-recorded elsewhere. |
| SRC012 | NASA NSSDC Earth Fact Sheet | `inspected` | Mass 5.9722 x 10^24 kg (updated 15 Nov 2024). Surface area is not on that page (my knowledge, 510 million km², not spoken). |
| SRC013 | Walpole et al. 2012 | still `lead-only` | 62 kg adult mean. Not needed: even 100 kg each gives 1.4 x 10^-13, same story. |
| SRC014 | NIST CODATA Bohr radius (physics.nist.gov) | `inspected` | a0 = 5.29177 x 10^-11 m, so hydrogen's diameter is about 1.06 x 10^-10 m. Closes the "atom size not sourced" gap. |
| SRC009–011 | Wikipedia Beast Quake; press; BGS Edinburgh | `lead-only`; a new press search for the Swift Quake found only "a seismometer near Lumen Field" and "unclear whether fans dancing or the sound system caused the shaking" | No Seattle distance range exists in anything I could open (CL14). Edinburgh 2024 not used by the script. |

## Line-by-line

| ID | Spoken wording checked | Verdict | Severity | Note |
| --- | --- | --- | --- | --- |
| L01 | "คนทั้งโลก รวมทั้งคุณด้วย… กว่าแปดพันล้านคน" | supported | none | SRC001: 8.2 billion (2024); about 8.3 billion by Nov 2026 (my estimate, not sourced). "กว่า" is true for either. |
| L02 | "ยืนเบียดกันแน่น ๆ ได้หมด ในกรุงเทพฯ กับนนทบุรี" | supported as a model | none | 8.2 billion x 0.25 m² = 2,050 km² against 1,568.7 + 622.3 = 2,191 km² (93.6 %). At 8.3 billion, 2,075 km² (94.7 %): still fits. The condition "เบียดกันแน่น ๆ" plus OT01 states the model. See ruling R1 and O5. |
| L03 | "คนละช่อง แค่ครึ่งเมตร คูณครึ่งเมตร" | supported | none | See ruling R1. |
| V01 | "แน่นจริง" | fiction | none | Character line. |
| L04 | "กรุงเทพฯ เต็มทุกเขต แล้วล้นเข้านนทบุรี" | supported as a model | none | At 4/m² Bangkok alone holds 1,568.7 km² x 4 = 6.27 billion (76.5 % of 8.2 billion), so about 1.9 billion spill over. Order is right. |
| L05 | "แต่ยังไม่ทันเต็มจังหวัด… คนก็หมดแล้ว" | supported | none | (2,050 - 1,568.7) / 622.3 = 77 % (81 % at 8.3 billion). "ยังไม่ทันเต็ม" holds either way. Picture "about three quarters" is right; do not draw it above about 85 %. |
| L06 | "เราว่าเราเยอะแล้ว… โลกใหญ่กว่านั้นอีก" | supported (judgment, no number) | none | 45 km patch against a 12,742 km Earth. |
| L07 | "แต่… ถ้าทุกคนตรงนี้ กระโดดพร้อมกันล่ะ" | supported as a condition | none | "ตรงนี้" keeps the pushes in one place (CL10); people spread worldwide would cancel. Picture must not spread the jump. |
| W-COUNT / V02 | countdown, "ฮึบ!" | fiction / dramatization | none | Covered by OT01 "ภาพจำลอง". |
| L08 | "โลกขยับจริง… แต่น้อยกว่าความกว้างอะตอมเดียว" | supported as a model | none (O6 picture note) | See ruling R4. |
| L09 | "เราว่าเราหนักแล้ว… โลกหนักกว่ามหาศาล" | supported | none (O7 picture note) | See ruling R5. |
| L10 | "พอลงพื้น… โลกก็กลับที่เดิม" | supported as a model | none | Momentum: the people-plus-Earth centre of mass never moves, so once everyone is back at the same spot the Earth is back too. |
| L11 | "แต่… คนแค่สนามเดียว ก็ทำพื้นสั่นได้นะ" | supported | optional (O3) | 2011 is a crowd-only event (SRC008: "roar and stomping"). 2023 is not settled as crowd movement (SRC007: movement vs loud music still under study). "ทำ" is fine for the beat; see O3. "พื้นสั่น", not "แผ่นดินไหว", matches PNSN's "not earthquakes". |
| L12 | "ที่ซีแอตเทิล เกมฟุตบอลอเมริกัน กับคอนเสิร์ตในสนามกีฬา" | supported | none (O4 picture note) | 8 Jan 2011 Seahawks v Saints, 22–23 Jul 2023 Swift concerts, same stadium and same station (SRC007, SRC008). OT05a/b years match. |
| L13 | "คนหลายหมื่นโดดพร้อมกัน… พื้นสั่นจนเครื่องวัดจับได้ แค่ใกล้ ๆ สนาม" | recorded shaking supported; "โดด" specific, "แค่ใกล้ ๆ" unverified | optional (O1, O2) | See rulings R2 and R3. "หลายหมื่น" holds (70,000+). |
| L14 | "ถอยออกไปดูจากอวกาศ…" | supported (picture) | none | |
| L15 | "คนกว่าแปดพันล้านคน… บนโลกใบนี้ เป็นแค่จุดเดียว" | supported as scale | none (O8) | 2,050 km² is about 4 x 10^-6 of Earth's surface (~510 million km², my knowledge). A dot is true; "แค่" is about size, not worth. |

## Rulings on the items Preaw listed (Q1)

**R1. "ครึ่งเมตร คูณครึ่งเมตร" for 4 people/m²: pass.** 0.5 m x 0.5 m = 0.25 m² = exactly 4/m², the density the area is computed at, so the spoken form and OT01 agree. 4/m² is inside the 3–4/m² "low risk" band of SRC003 (tertiary, cited primaries not opened) and close to the 0.3 m² standing allowance in SRC004 (lead-only, 50 x 60 cm); it is tight but a person can stand in 50 x 50 cm, and children are smaller. "แค่" is mildly cheery (adults would be touching) but the next line V01 "แน่นจริง" and "เบียดกัน" already say so. No change. Clarity (ER05): plain; OT03 "50 × 50 ซม." beside the outlined square is what makes the multiplication land, keep it.

**R2. "แค่ใกล้ ๆ สนาม": `unverified` for Seattle, direction true, optional fix (O1).** What the evidence shows: the two Seattle events were recorded by one station, KDK, across the street / "a block or so away" (SRC007, SRC008). Vidale himself calls it a "one-station signal". Nothing I opened says the shaking was or was not recorded or felt farther away, so "only near" is a statement about the absence of a signal elsewhere that no source makes. It is likely true for felt shaking and it matches Edinburgh 2024 (felt only in the immediate vicinity, instruments up to about 6 km; BGS via press, `lead-only`, so even there instruments saw farther than "ใกล้ ๆ"). Not must-fix: the takeaway (a crowd's shaking is local, not planetary) is true. But the picture cue "the city around it is still" asserts an observation that does not exist; and "แค่ใกล้ ๆ" would be false if a viewer reads it as "no instrument elsewhere recorded it".
- **Proposed wording (O1), fewer syllables:** "คนหลายหมื่นโดดพร้อมกัน… พื้นสั่นจนเครื่องวัดข้างสนามจับได้" (the documented fact, "เครื่องวัดข้างสนาม" = KDK). This keeps "ใกล้สนาม" (decision 3) as the instrument's place and drops the negative. The refrain restore at L13 still works because the picture shows one box at the stadium and a pull-back where the jitter shrinks to the stadium (scale picture, no still-city claim).
- Keep as written (acceptable) if Preaw prefers the refrain line: then change the picture so the pull-back does not say "the city around it is still", only that the trace is at the stadium.

**R3. "คนหลายหมื่นโดดพร้อมกัน" next to the shaking: optional fix (O2).** The pairing is fair: stadium crowds did coincide with recorded ground motion. Two gaps. (a) PNSN's description of 2011 is "the roar and stomping of the tens of thousands of feet" (SRC008); no inspected source says "jumping". (b) For 2023 PNSN says movement vs loud music as the cause is still under study (SRC007), and press says it is unclear whether fans dancing or the sound system caused the shaking. The script does not use the word "เพราะ" or "ทำให้", and decision 2's "พื้นสั่นจนเครื่องวัดจับได้" is a record, so the line leaves the viewer with "tens of thousands moving together shake the ground nearby", which is true. Not must-fix.
- **Safer one-word edit (O2), same length:** "คนหลายหมื่นขยับพร้อมกัน" ("ขยับ" is PNSN's own "fan movement" and echoes "โลกขยับ" in L08); or keep "โดด" and rely on the picture. Do not add "เพราะ…" or a music-vs-movement line (ER07).
- Combined with O1, L13 becomes "คนหลายหมื่นขยับพร้อมกัน… พื้นสั่นจนเครื่องวัดข้างสนามจับได้" (+1 syllable, −3 syllables: net −2, about −0.4 s in OQ4).

**R4. "อะตอมเดียว": pass (model, true).** Reproduced the computation: humanity 4 x 10^11 kg (range 3.3–5.1) over Earth 5.9722 x 10^24 kg (SRC012) = 7 x 10^-14; x a 0.3–0.5 m rise = 2–3 x 10^-14 m (4 x 10^-14 at the top of the range). Hydrogen's diameter is about 1.06 x 10^-10 m (SRC014, Bohr radius), so the nudge is about 1/2,500 to 1/5,000 of an atom; every other atom is larger. The claim stays true even if the jump were 30 m or the crowd 100 kg each, so no hedge is needed beyond "ภาพจำลอง" (OT01 runs to the end of L10). "เดียว" is an emphasis, not a count; "น้อยกว่า" is the correct form ("ขยับเท่าอะตอม" would be wrong by 3,000x). The "ขยับจริง" is true in the rigid-Earth momentum model; the real elastic Earth turns the push into tiny waves with the same size of effect. Trim T1 (drop "เดียว") loses nothing factual.

**R5. "หนักกว่ามหาศาล": pass.** Ratio is about 1 : 15 trillion (Earth/humanity ≈ 1.5 x 10^13), "มหาศาล" is an understatement of a factor that large and says no number (CL07 respected). "หนัก" for mass is everyday usage, fine for ER05. The line is also a true single cause for OQ3.

**R6. The title "ถ้าคนทั้งโลกมายืนในกรุงเทพฯ" (N5): pass as a what-if, optional note (O5).** The "ถ้า" frames a scenario, and the video corrects the place at L02/L04 in the first 10–16 s. Literally, Bangkok alone holds only about 6.3 billion at 4/m² (76 % of humanity), so a plain statement "คนทั้งโลกยืนในกรุงเทพฯ ได้" would be false, and that form must not appear on the cover or in the description (it would be `must-fix` there). Keep "ถ้า"; the cover must not show the whole crowd inside the Bangkok border. Optional tighter title: "ถ้าคนทั้งโลกมายืนเบียดกันในกรุงเทพฯ" (carries the density condition) or add "กับนนทบุรี" (longer).

## Optional findings (none holds readiness)

- **O1 (L13 "แค่ใกล้ ๆ สนาม")** as R2. Replace with "…จับได้" plus "ข้างสนาม" on the instrument, or keep and change the picture.
- **O2 (L13 "โดด")** as R3: "ขยับ" is the safe one-word edit.
- **O3 (L11 cause for 2023):** no change needed; just do not let Film or sound say "from the crowd's jumping" for the concert specifically. The stadium sound system may have contributed (SRC007 open question).
- **O4 (L11–L12 pictures):** the shot cue puts "a different stadium at night" at L11, then the 2011 game look. The Seahawks v Saints playoff was an afternoon game (my knowledge, not inspected; kickoff 1:30 pm local); night suits the 2023 concert only. Suggest the match cut lands on a full stadium without a time of day, then night for the concert look. Also "ซีแอตเทิล · 2011 / 2023" is the right label; add "ภาพวาดประกอบ" or keep "ภาพจำลอง" so the drawn stadium crowds are not read as footage.
- **O5 (L02 / L04 plan-area model):** the narration counts area only; the Chao Phraya, canals, roads and building footprints are included (CL06). Nothing spoken says people could stand there, and the 6 % spare (140 km²) is the same order as the water surface, so the claim "fits" is a plan-area count, as the "ภาพจำลอง" tag says. Optional picture note: draw the crowd fill over the river too (or leave the river line faint), not as an empty blue stripe, so the viewer does not read "the river has no people but the crowd still fits" as a precise result.
- **O6 (L08 picture):** a hairline nudge beside an atom drawn as a fuzzy ball must show the nudge as a speck far smaller than the ball (true ratio about 1/3,000). If it is drawn at a visible fraction of the ball, the viewer learns "the Earth moves a bit less than an atom". Draw it sub-visible or add a magnifier; the line says "น้อยกว่า", the picture should agree.
- **O7 (L09 picture, `misleading-analogy` risk, small):** "the crowd's pan does not move" on a balance reads as a balanced scale (equal weights). A balance with a 15-trillion-to-1 mass difference has the Earth's pan down and the crowd's pan flung up as a speck. Suggest Film draw it that way, or a speck on one pan with the other off the page.
- **O8 (label coverage, OT01):** the tag starts at L02, but L01 already shows the crowd pouring in and the man in the crowd, and L14–L15 show the patch shrinking to a dot. Suggest "ภาพจำลอง" on those shots too (the density wording can stay L02–L10).

## Clarity pass (ER05, ER07)

No `too-technical` line. "อะตอม" is school-level and pictured; "เครื่องวัด" is pictured. `misleading-analogy`: only O7 (the balance picture). No beat needs cutting; the qualifications that would empty a beat (food, buildings, river, living there, music vs movement, distance, magnitude) are correctly left out (ER07).

## Sound

Stadium roar, stomps, pen scratch, landing thump and seismograph scratch are dramatization as the script says; none asserts a place or casualty. No real recording is used. If Ton wants the real KDK trace as audio (PNSN published a sped-up version of the Swift record, `lead-only`), it needs a source and a "real recording" label; otherwise keep it designed.

## Uncertainties and gaps

- BMA geography page not opened (Bangkok area via secondary documents); the WPP2024 PDF not opened (UN release page only). Neither moves any spoken claim.
- No Seattle distance range, felt/recorded-elsewhere statement or jumping description exists in what I could open; PNSN event pages / Caplan-Auerbach's posted data would settle O1 and O2 if Preaw wants to keep the sharper wording.
- Walpole mass and the Earth-surface figure not opened; neither is spoken and the conclusions survive a 2x error.
- Timing/open-question lengths are Preaw's estimate; not rechecked here. Edits O1–O2 shorten OQ4 by about 0.4 s.

## Status

`ready-for-storyboard` for EDU-EP17-SCRIPT-R1: no `must-fix`. Factual status for the delivery record: "fact-check R1 done, ready-for-storyboard, optional O1–O8 open". Recheck only if Preaw takes O1/O2 (one line, L13). Not user approval, not audio or visual validation.
