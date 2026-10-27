# POOLDEPTH research packet (Boat, rev R1)

- **Deliverable:** `POOLDEPTH-SHORT` (Short only, Full tier, 40-60s). Shared research file; no Long selected.
- **Inputs read:** `delivery.md`, `topic-brief.md` (rev R1). Both treated as production material.
- **Research date:** 2026-10-27 (access date for every source below).
- **Story mode:** explainer-educational with a safety payoff; no fiction asserted as fact. The hook "child jumps toward knee-deep water" is a dramatization, not a claim.
- **Status:** research complete for optics; **safety claim only partly supported (see Q3 and boundary table).** Premise impact flagged in section 6.

## 1. Source registry

Quality: A = textbook/standards-grade, B = reputable institution page, C = expert/commentary or secondary, L = lead-only (not opened or snippet only).

| ID | Source | Status | Quality | What it gave / limits |
| --- | --- | --- | --- | --- |
| SRC001 | OpenStax, University Physics Vol. 3, sec. 2.3 "Images Formed by Refraction", https://openstax.org/books/university-physics-volume-3/pages/2-3-images-formed-by-refraction | inspected (via fetch summary) | A | Apparent-depth relation h_i = (n_air/n_water) h_o, small-angle (sin = tan) assumption, worked example: n=1.33 gives about 0.75 h_o, fish 2.0 m reads about 1.5 m; says apparent depth depends on viewing angle. |
| SRC002 | Wikipedia "Apparent depth", https://en.wikipedia.org/wiki/Apparent_depth | inspected | C (secondary; cites Hecht, Born and Wolf, not opened) | Same ratio for small incidence angles; as angle nears 90 degrees apparent depth shrinks toward zero while reflection increases. Used only to corroborate SRC001 and for the oblique trend. |
| SRC003 | scubageek.com "Index of Refraction of Water", https://scubageek.com/articles/wwwh2o.html | inspected | B/C (hobby site transcribing NBS data) | Sodium D line vs air: 1.3337 at 10 C, 1.3330 at 20 C; salinity adds about 0.00019 per g/kg (0.0077 at 40 g/kg, 18 C). Cites Tilton and Taylor, J. Res. NBS 20, 419 (1938) and Dorsey (1940), **neither opened** (upstream leads). |
| SRC004 | Parachute (Canada), "Diving", https://parachute.ca/en/injury-topic/summer-sports/diving/ | inspected | B | Know depth before diving; first entry feet first; depth should be twice diver's height; 95% of diving injuries in water 1.5 m (5 ft) or shallower; injuries likelier where depths are not posted. No mention of refraction. |
| SRC005 | Public Health Seattle & King County, "Injuries guidance for the public", https://kingcounty.gov/en/dept/dph/health-safety/environmental-health/healthy-water-air-soil/water-recreation-program/injuries-guidance-public | inspected | B | "No Diving" sign or depth under 5 ft: never dive; hitting floor/wall can cause neck/spine injury. Undated. No refraction. |
| SRC006 | Marc Green, visualexpert.com "Diving accidents", https://visualexpert.com/Resources/divingaccidents.html | inspected | C (expert-witness site, no citations for this point, footer 2024) | Says a diver looking into a pool is "likely to overestimate the depth". **Contradicts the brief's perceptual premise** and is uncited. |
| SRC007 | Help Hope Live, https://helphopelive.org/?p=2404 | inspected | C (advocacy/fundraising; page internally inconsistent on ranking; first published 2016, footer 2026) | States water "often looks deeper than it really is" and that misjudging depth causes spinal injuries. Uncited for that sentence. |
| SRC008 | UAB Medicine, "Diving safety: Tips...", https://www.uabmedicine.org/?p=58141 | inspected | B | Neurosurgeon J. Godzik: shallow dives are dangerous because the body cannot decelerate; check depth; avoid diving into unfamiliar/shallow water even if it appears safe. Undated. No refraction. |
| SRC009 | KiwiCo "Disappearing Coin Trick", https://www.kiwico.com/diy/stem/quick-easy-experiments/disappearing-coin-trick | inspected | C | Coin under a clear glass vanishes from the side when water is added; reappears from the top. Explanation given is bending/bouncing back of light; it does not mention apparent depth. |
| SRC010 | Search-result summaries (consumer-news syndications of Consumer Reports 2017 lifeguard-visibility test; Tes classroom coin activity; physics homework pages) | lead-only (snippets) | L | Consumer Reports attributes poor view of swimmers from a low lifeguard seat to glare and refraction; Tes ties a coin activity to pools looking shallower. Syndicated copies are one report, not independent. Not used for claims. |
| SRC011 | NIST / Quan and Fry (1995, Applied Optics) seawater index; Hecht Optics; Tilton and Taylor 1938; Red Cross, AAP, WHO drowning guidance | **not opened / not found** | L | Named as upstream leads only. No Red Cross, WHO or CDC page linking apparent depth to drowning was found. |

Access limits: physicsclassroom.com, exploratorium.edu returned 403; helphopelive "5 unforgettable facts" returned 404 (the `?p=2404` page worked); uab.edu had a certificate error. Fetch tool returns summaries produced by a small model, so quoted wording is confirmed only where a short phrase is shown above.

## 2. Claim ledger

| ID | Assertion and scope | Source and locator | Class | Confidence and limits |
| --- | --- | --- | --- | --- |
| F001 | Light from an underwater object bends away from the normal when it leaves water into air; the eye assumes straight-line rays, so the object appears at a shallower position than it is. | SRC001 sec. 2.3; SRC002 | documented fact (standard optics) | High. Flat water surface, light passing water to air. |
| F002 | Viewed (nearly) straight down, apparent depth = real depth x n_air/n_water, about 0.75 for n=1.33. A 2.0 m depth reads about 1.5 m. | SRC001 worked example; SRC002 | documented fact, approximation | High for near-vertical view. Paraxial (small angle) only; a person standing at the edge and looking at the floor is usually not near-vertical, so "3/4" is a best-case straight-down figure, not what a swimmer sees. |
| F003 | At steeper (oblique) viewing the formula no longer holds; apparent depth depends on viewing angle and becomes smaller as the view approaches the surface plane, while surface reflection grows. | SRC001 (depends on angle); SRC002 (toward zero near 90 degrees) | documented fact (trend) | Medium-high for direction. **Boat-derived illustration (not from a source):** for the point seen along a ray, d'/d = tan(theta_w)/tan(theta_a) with sin(theta_a) = n sin(theta_w); n=1.33 gives about 0.63 at 45 degrees and about 0.50 at 60 degrees from vertical. Derived by Boat from Snell's law; label as illustrative, not as a measured pool figure. |
| F004 | Refractive index of water is about 1.33 (visible light, ordinary temperatures). | SRC001, SRC002; SRC003 (1.3330 at 20 C vs air) | documented fact | High. |
| F005 | Index varies slightly with temperature (1.3337 at 10 C vs 1.3330 at 20 C), wavelength and salinity (about +0.0077 at 40 g/kg); these shift the 3/4 ratio by well under 1 percentage point (0.7498 vs 0.7502; seawater about 0.747 by Boat's arithmetic). | SRC003 (Tilton and Taylor, Dorsey upstream unopened) | documented fact, secondary transcription | Medium-high. Chlorine/pool chemicals not researched; expected negligible but **unverified**. |
| F006 | Misjudging water depth is a recognized risk in diving injuries; guidance is to know the depth, check posted markers, enter feet first the first time, and never dive where shallow or marked "No Diving". | SRC004, SRC005, SRC008 | documented guidance | High that the guidance exists. These pages do not mention refraction. |
| F007 | Most diving injuries occur in shallow water (95% in 1.5 m / 5 ft or less); injuries are likelier where depths are not posted. | SRC004 | reported statistic (Canada, Parachute) | Medium. Single organizational page, underlying study not opened; Canada, not Thailand. |
| F008 | Refraction is *the cause of* diving injuries or drownings. | none | **unsupported** | No inspected source shows refraction-induced shallow-looking water causing injuries or drowning. Optics is established; the causal safety link is an inference. |
| F009 | Pools look shallower than they are. | F001-F003 (optics) | documented optics; **perceptual claim unproven** | The optical image *is* raised. Whether people actually perceive a pool as shallower is not established by any inspected source, and SRC006 and SRC007 assert the opposite (looks deeper). Treat as open. |
| F010 | Drowning in particular is made more likely by apparent-depth illusion. | none | **unsupported** | Inspected safety sources concern diving/spinal injury, not drowning. SRC010 lifeguard-visibility lead concerns spotting swimmers, a different refraction effect (viewing light *out of* water), and is lead-only. |
| F011 | Demonstration: an object at the bottom of a container looks raised when viewed through water; a coin hidden from view behind a mug's rim becomes visible after water is added. | physics basis F001 (SRC001); procedure itself only in lead-only Tes snippet (SRC010) | demonstrable physics; procedure lead-only | Physics sound. Do not cite the KiwiCo glass trick (SRC009) as the apparent-depth demo: it is viewed from the side through the glass wall and its stated explanation differs. |

## 3. Answers to the four research questions

**Q1. Apparent-depth formula, validity, oblique behavior.** Apparent depth is real depth multiplied by n_air/n_water, about 0.75 for water (F002, SRC001). It is a small-angle (near-vertical view) approximation; at oblique angles apparent depth is smaller, falling toward zero near grazing view, with strong surface reflection hiding the bottom (F003, SRC001-SRC002). Boat's Snell-law arithmetic gives about 0.63 at 45 degrees and 0.50 at 60 degrees (illustrative, derived). "Yes it looks even shallower when angled" is supported; do not claim a single exact percentage for a real pool.

**Q2. Refractive index.** About 1.33 (F004). Temperature: 1.3337 at 10 C to 1.3330 at 20 C (SRC003). Salinity: about +0.0077 at 40 g/kg. Effect on the 3/4 ratio is smaller than a rounded script number can show, so "about 1.33" and "about three quarters" need no temperature or salinity caveat on screen (F005). Pool chemicals unchecked.

**Q3. Is "pools look shallower, a drowning-risk factor" supported?** Only in part.
- The optics (looks shallower on a straight-down view) is solid (F001-F002).
- Reputable safety sources support: misjudging depth contributes to diving injuries, and the actions to take (check markers, feet first, no diving in shallow or unmarked water) (F006-F007).
- **No inspected source links the refraction illusion to drowning** (F008, F010). No inspected source links refraction to diving injuries either; the safety pages do not discuss refraction.
- Two lower-quality sources (SRC006, SRC007) claim water looks *deeper*, the opposite of the brief's perceptual premise; both are uncited. This conflict is unresolved (F009).
- Safe stance: state the optics as fact; state the safety advice as guidance from safety organizations; connect them only as "do not trust your eyes for depth", not as a proven cause.

**Q4. Everyday demonstration.** A safe, correct one: put a coin in an opaque mug or bowl, step back until the rim hides the coin, then pour in water; the coin "rises" into view because light from it bends at the surface (F011). Alternative: look straight down at a ruler or object in a clear cup of water; it looks shallower. A pencil/straw looks "broken" at the surface, which shows bending but not depth directly, so it is a weaker depth demo. Avoid the glass-side "disappearing coin" (SRC009) for this claim. Procedure sources are lead-only; the physics is supported by SRC001. No safety hazard beyond spilled water; no inspected age guidance.

## 4. Safe-to-say wording for the 40-60s Thai Short

Safe (each tied to a claim ID):
- S1 (F001): แสงจากก้นสระโค้งงอเมื่อออกจากน้ำสู่อากาศ สมองเลยเข้าใจว่าก้นสระอยู่สูงกว่าที่เป็นจริง. Wording limit: "light bends at the surface" not "your brain lies".
- S2 (F002, F004): มองตรงลงมา ความลึกที่เห็นประมาณสามในสี่ของความลึกจริง (ดัชนีหักเหน้ำประมาณ 1.33) เช่นน้ำลึก 2 เมตรดูเหมือนราว 1.5 เมตร. Must carry "มองตรงลงมา" (near vertical) and "ประมาณ"; do not present 3/4 as what a person at the pool edge sees.
- S3 (F003): ยิ่งมองเฉียง ยิ่งดูตื้นขึ้นอีก; the exact numbers (0.63, 0.50) are Boat illustrations and are not needed on screen; if shown, label "ตัวอย่างจากการคำนวณ".
- S4 (F006, F007): หน่วยงานความปลอดภัยแนะนำให้รู้ความลึกก่อนกระโดดหรือดำน้ำ ดูป้ายบอกความลึก ลงเท้าก่อนครั้งแรก และห้ามดำน้ำที่ตื้นหรือมีป้ายห้าม. If a number is used, "การบาดเจ็บจากการดำน้ำส่วนใหญ่เกิดในน้ำลึกไม่เกิน 1.5 เมตร (รายงานของ Parachute แคนาดา)" and attribute it.
- S5 (F011): coin-and-mug demo as a "try it" beat.

Not safe / needs rewording:
- Do not say refraction causes drowning, or that the illusion is a "drowning-risk factor" (F008, F010). Do not say "คนจมน้ำเพราะสระดูตื้น".
- Do not say "สระดูตื้นกว่าจริงเสมอ" or that everyone perceives it (F009; conflict SRC006/SRC007). Prefer "แสงทำให้ภาพก้นสระยกสูงขึ้น" (optical image) over "ตาเราเห็นผิดแน่นอน".
- Do not state 3/4 for every viewing angle or distance.
- Do not cite the lifeguard/Consumer Reports finding as pool-floor depth illusion; it is a different effect and lead-only.
- Any safety line should be advice ("อย่าเดาความลึกด้วยตา") not a causal story.

## 5. Fact-versus-fiction boundary

| Element | Class |
| --- | --- |
| Refraction, 1.33, about 3/4 (straight down), oblique gets shallower | documented fact with stated conditions |
| Coin-in-mug demonstration | demonstrable physics |
| Safety guidance (markers, feet first, no shallow diving) | documented guidance from named organizations |
| Child jumping toward "knee-deep" water (hook) | dramatization; must not be presented as a real incident or statistic |
| Brain "tricked / ตาโกหก" | rhetorical framing; physics is the light path, not a perceptual-science finding |
| Refraction as cause of injury/drowning | unsupported inference; keep out of narrator assertion |

## 6. Premise and learning-takeaway impacts (flag, not rewritten)

1. **Working title/hook "สระน้ำตื้นแค่ไหน ทำไมตาเราโกหก"** implies people see water as shallower and are fooled into danger. Optics supports "image raised"; perceptual direction in real pools is disputed by two weak sources (SRC006, SRC007). Suggest reframing the claim as "the light path makes the floor look higher; so do not judge depth by eye", which stays true under either perceptual outcome. This keeps the takeaway intact.
2. **Brief core idea "Payoff: step in carefully, never judge depth by eye, check the depth markers"** is supported by guidance (F006). Keep.
3. **"3/4" is a straight-down value.** A beat that shows a child at the edge looking obliquely must not imply 3/4; either show a vertical view or say "ยิ่งเฉียง ยิ่งตื้น".
4. **Do not frame as drowning.** Supported safety content is diving/shallow-water entry injuries. Learning takeaway should be "ลงน้ำอย่างระวัง ดูป้ายความลึก" rather than a drowning-prevention claim.
5. Visual risk for Film later: a ray diagram must draw rays bending away from the normal in the air (rays flatter to the surface) and an apparent floor above the true floor; a straight-down diagram supports 3/4 only.

## 7. Remaining gaps and open questions

- No peer-reviewed or standards-body source linking apparent depth to injuries or drowning was found; Red Cross, AAP, WHO, CDC pages not opened. A later pass could target those directly if the script wants a stronger safety line.
- Perceptual direction (looks shallower vs deeper) unresolved; no controlled study found.
- Upstream optics sources (Hecht, Born and Wolf, Tilton and Taylor, Dorsey, Quan and Fry) not opened.
- Pool chemistry effect on index not checked (expected negligible).
- Thai-specific pool safety guidance (e.g., Thai Red Cross or Ministry of Public Health) not searched.
- Timing and Thai wording are Preaw's; Boat will check the named script revision claim by claim, including the hook and on-screen text.

## 8. Readiness

Research R1 is sufficient for Preaw to write the Short **provided** the script (a) limits the 3/4 figure to a near-vertical view, (b) frames the safety payoff as guidance, not causation, and (c) avoids asserting that people perceive pools as shallower with certainty. Premise-critical gap: none blocking if those limits are followed; F008/F010 remain unresolved and must stay out of narrator assertions. This is not user approval, script review or runtime validation.
