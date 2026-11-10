# EDU-EP14-SHORT — research packet (W1.1, Boat)

- Deliverable: `EDU-EP14-SHORT` (Short, Thai, educational, concept C37 "ถ้าฝนตกโดยไม่มีอากาศ", `scripts/edu-series/concepts.md` `### C37`). Research date: 2026-11-09. Mode: non-fiction explainer with a no-air thought experiment. No script is written here.
- Short answer:
  1. **Cloud base: "สองกิโล" is the top of the usual range, not typical.** NWS JetStream (2008 archive) puts low-cloud bases at surface to 2 km (SRC001); cumulus and cumulonimbus are low clouds there. Say "หนึ่งถึงสองกิโล" or "สูงเป็นกิโล". `settled` as a range, `hedge` as "typical".
  2. **No-drag fall speed (own calculation, v = sqrt(2gh), g = 9.81):** 1 km = 140 m/s = 504 km/h; 1.5 km = 172 m/s = 618 km/h; 2 km = 198 m/s = 713 km/h. `model` (vacuum, drop starts at rest at the base, constant g).
  3. **Train hook: "เร็วกว่ารถไฟความเร็วสูงสองเท่า" holds only for a 2 km fall against 320–350 km/h trains (713 / 320 = 2.2; 713 / 350 = 2.0).** Tokaido Shinkansen runs at most 285 km/h in service (2.5x), TGV 320 (SRC008). At 1 km the ratio is only 1.6x. Safest: state the number ("ราวเจ็ดร้อยกิโลต่อชั่วโมง") and drop the ratio, or say "มากกว่าสองเท่า" only with a 2 km start.
  4. **Terminal speed of the largest drops: about 9 m/s = 32 km/h (own conversion).** Gunn and Kinzer 1949 is the reference data set (SRC002, access gap: table not opened); my cross-check with a fit I recalled (Atlas et al. 1973, not inspected) gives 9.1 m/s at 5 mm and 9.4 at 6 mm. "Near 30 km/h" in C37 is right for the largest drops only. A typical 1–2 mm drop is 4–6.5 m/s (14–24 km/h).
  5. **Bicycle comparison: fine for "a brisk cyclist" (about 30 km/h), too fast for a casual ride (about 15–20 km/h, unsourced).** Prefer the number "สามสิบกว่ากิโลต่อชั่วโมง" with the bicycle as colour.
  6. **Shape: not a teardrop. `settled`.** Small drops (under about 2 mm across) are near spheres; larger ones flatten into a hamburger-bun shape, round on top and flat or dented underneath (SRC003, SRC004, SRC005, SRC006). The teardrop comes from drops clinging to a surface (SRC005).
  7. **Maximum size: `disputed` in the figure, `settled` in the mechanism.** Figures: parachute shape from about 4.5 mm (SRC003); limit about 5–5.5 mm (Lenard, via secondary SRC007); about 6 mm (Villermaux and Bossa 2009, via SRC009 and SRC005); largest recorded 8.8 mm (Hobbs and Rangno 2004, via SRC005). Use "ราวครึ่งเซนติเมตรกว่า ๆ". Break-up: the underside is pushed in like a bag or parachute, then it bursts into smaller drops (SRC004, SRC009).
- Tooling limits: web search excerpts plus fetched pages. The NWS cloud chart PDF returned binary; Gunn and Kinzer 1949 table, Villermaux and Bossa full text and Hobbs and Rangno 2004 were not opened (abstract/secondary only). No claim here rests on a Thai source. Calculations are mine and are marked.

## Source registry

| ID | Source | Status | Limits |
| --- | --- | --- | --- |
| SRC001 | NWS JetStream "Cloud Classifications", web archive 2008: https://webarchive.library.unt.edu/eot2008/20080923093937/http:/www.srh.noaa.gov/jetstream/synoptic/clouds_max.htm | `lead-only` (search excerpt) | Official. Low clouds (Cu, Sc, St, Cb) bases surface to 6,500 ft (0–2 km); Ns listed as mid-level; over mountains the base can be higher. Archived 2008 copy. |
| SRC002 | Gunn R, Kinzer GD. "The terminal velocity of fall for water droplets in stagnant air." J Meteorology 6:243–248 (1949), doi:10.1175/1520-0469(1949)006<0243:TTVOFF>2.0.CO;2 | `lead-only` (abstract and citing papers) | Primary, over 1500 drops, accuracy better than 0.7 %; "gold standard" per later papers (par.nsf.gov, asr.copernicus.org excerpts). Table not read. |
| SRC003 | NASA GPM "Anatomy of a raindrop": https://gpm.nasa.gov/science/anatomy-of-a-raindrop | `inspected` | Agency outreach. Under 1 mm roughly round; 2–3 mm shape affected; over 4.5 mm parachute shape then break-up; round on top, flat below. No speeds. Ambiguity: "1 mm in size" (radius or diameter not stated). |
| SRC004 | USGS Water Science School "Raindrop shape is determined by drop size, and air resistance": https://www.usgs.gov/media/images/raindrop-shape-determined-drop-size-and-air-resistance | `inspected` | Agency, public domain. Radius under 1 mm spherical; larger like a hamburger bun; at about 4–4.5 mm radius it becomes parachute-like, bag, then breaks up. Its radius figure is much larger than other sources' diameters, so I do not use the USGS size numbers. |
| SRC005 | Wikipedia "Raindrop": https://en.wikipedia.org/wiki/Raindrop | `inspected` (tertiary) | Used only to find upstream: Villermaux and Bossa 2009 (about 6 mm limit), Pruppacher and Pitter 1971 (under 2 mm near spherical; levitated drops up to 10 mm possible in a wind tunnel), Hobbs and Rangno 2004 (8.8 mm near Kwajalein, 1999), 3 mm drop about 8 m/s (UvA 2005). Teardrop explained as drops clinging to surfaces. |
| SRC006 | Pruppacher HR, Pitter RL. J Atmos Sci 28:86–94 (1971) | `lead-only` (via SRC005) | Primary; not opened. |
| SRC007 | Physics Factbook "Diameter of a Raindrop" (Volynets 2001): https://hypertextbook.com/facts/2001/IgorVolynets.shtml | `inspected` (secondary) | Quotes Heidorn (Weather Doctor) on Lenard: limit just over 5 mm, unstable above 5.5 mm, bun shape, up to about 2 mm spheres. Sources inside it disagree (3, 4, 5, 8 mm); Davis's collision explanation is weak. Do not treat as independent of Lenard. |
| SRC008 | Train speeds: search excerpts of Railway Gazette and press on N700S (285 km/h in service, 360 km/h test) and TGV (320 km/h) | `lead-only` | Press. UIC criterion at least 250 km/h for new high-speed track. Thai high-speed design speed not found; do not claim a Thai number. |
| SRC009 | Villermaux E, Bossa B. "Single-drop fragmentation determines size distribution of raindrops." Nature Physics 5:697–702 (2009); Science News "Raindrops go it alone"; APS DFD abstract | `lead-only` (abstract and press) | Primary. Lab drops in an upward air stream: drop inflates into an upside-down bag, then bursts; a 6 mm drop gives fragments of about 1 to just under 4 mm; drops 6 mm or larger likely to shatter before the ground. Barros, Prat, Testik (Nature Physics 2010) dispute the size-distribution thesis (collisions matter), not the bag break-up picture. |

## Claim ledger

| ID | Claim (C37 wording) | Status | Evidence | Note |
| --- | --- | --- | --- | --- |
| CL01 | Rain clouds are about 2 km up ("สูงสองกิโล") | `hedge` | SRC001: low-cloud bases 0–2 km | 2 km is the ceiling of the low range; tropical downpours often come from lower bases (not sourced). Say "หนึ่งถึงสองกิโล". Clouds are also thick; drops can begin higher than the base, so this is a "from the base" figure. |
| CL02 | No-air fall from 2 km is about 200 m/s, about 700 km/h | `model` (own calc) | 198 m/s = 713 km/h | Vacuum, constant g, start at rest. "ราวเจ็ดร้อย" is fine; "ร้อยเมตรต่อวินาที" is not. 1 km: 504 km/h. |
| CL03 | "เร็วกว่ารถไฟความเร็วสูงสองเท่า" | `hedge` | 713 vs 285 / 320 / 350 km/h = 2.5 / 2.2 / 2.0 (own calc), SRC008 | True only for a 2 km start and fast trains. Drop the ratio or hedge to "ราวสองเท่า". Name no Thai line. |
| CL04 | Beat 1: leaf punched, car roof dented like a pellet | `model`, dramatization | own calc: 5 mm drop mass 0.065 g, kinetic energy about 1.3 J at 198 m/s; a 2 mm drop (4.2 mg) about 0.08 J | Energy is the same order as a weak air-gun or BB pellet for the biggest drop, far less for ordinary drops. "Punches through a leaf" and "dents a roof" are unsupported; label as imagined or say "ซ่า/เจ็บเหมือนกระสุนลม". Also: water in a true vacuum would boil and freeze, and no clouds would form, so it is a thought experiment, not physics of an airless Earth. Logline "shred roofs and skin" is unsupported: cut it. |
| CL05 | Drag grows with speed until it matches weight; speed stops rising | `settled` | SRC002 context, SRC007 | Mechanism is textbook. Time and distance to reach terminal speed not computed or sourced; do not state. |
| CL06 | Largest drops fall at about 9 m/s, about 30 km/h | `settled` for largest; `hedge` as "raindrop speed" | SRC002 (data), own fit check 9.1 m/s at 5 mm; SRC005: 3 mm about 8 m/s; own conversion 9 m/s = 32.4 km/h | Typical 1 mm 4 m/s (14 km/h), 2 mm 6.5 m/s (24 km/h), by the fit (own calc, fit not inspected; same values appear in a general page). Beat 5's drop on her hand is likely a 1–3 mm drop, about 15–29 km/h. Say "ใหญ่ที่สุดราวสามสิบกิโลต่อชั่วโมง". |
| CL07 | "เท่าจักรยาน" | `hedge` | no cycling source inspected | 32 km/h is a brisk ride. Use as image, number carries the fact. |
| CL08 | Raindrops are not tear-shaped | `settled` | SRC003, SRC004, SRC005, SRC006, SRC007 | Teardrop is the shape of a drop hanging or on a surface (SRC005). Counts as independent: NASA, USGS, Pruppacher and Pitter via SRC005 (Lenard is repeated through SRC007). |
| CL09 | Big drops are bun-shaped | `settled` | SRC004 (hamburger bun), SRC007 (Lenard) | Round top, flatter or dented underside (SRC003). Start of flattening about 2 mm across (SRC005, SRC007); NASA "2–3 mm". |
| CL10 | Drop "puffs up like a bag" then bursts | `hedge` wording | SRC004, SRC009 | The real picture: the underside is pushed up into a hollow, parachute or inverted bag with a rim, which then bursts. "พองเหมือนถุง" suggests inflating outward; use "ท้องบุ๋มเข้าเหมือนร่มชูชีพกลับด้าน" or "ถุงคว่ำ". |
| CL11 | Size limit about half a centimetre | `disputed` (4.5 to 6 mm limit) | SRC003 4.5 mm, SRC007 5–5.5 mm, SRC009 about 6 mm | Say "ราวครึ่งเซนติเมตรกว่า ๆ" or "ห้าหกมิลลิเมตร". Drops up to 8.8 mm were recorded once (SRC005, Hobbs and Rangno 2004) and wind-tunnel drops can survive a while, so "never" is too strong; "ราวครึ่งเซนติเมตรขึ้นไปแตกแล้ว" is fair. |
| CL12 | A "ball-sized" raindrop can never happen | `hedge` | SRC005, SRC009 | No source shows drops anywhere near ball size (about 2 cm or more); largest recorded 8.8 mm. Say "ไม่เคยมีใครวัดได้ถึงหนึ่งเซน" only if Boat rechecks Hobbs and Rangno. |
| CL13 | Break-up mechanism is air pushing on the drop as it falls | `settled` | SRC004, SRC009 | Collisions with other drops add to the size distribution (Barros et al. 2010 via SRC009); do not say air alone sets the whole distribution. |
| CL14 | Final line "ถูกเบรกมาตลอดทาง" | `hedge` wording | CL05 | The drop speeds up first, then holds a steady speed. Use "ถูกอากาศเบรกไม่ให้เร็วไปกว่านี้". |

## Wording fixes for Preaw (C37 and the hook)

1. Cloud height: "หนึ่งถึงสองกิโล", or keep "สองกิโล" with "ราว" and treat it as the high end.
2. Hook ratio: "สองเท่า" only with 2 km and trains of 320 km/h or more; safer to give the number "ราวเจ็ดร้อยกิโลต่อชั่วโมง" and name no train.
3. Logline "shred roofs and skin" and beat 1 "punches through a leaf, dents a car roof": cut or label as imagined; evidence supports only a sting like a pellet for the biggest drops.
4. Speed gauge "near 30": say it is the biggest drops; ordinary rain is 15–25 km/h. The gauge on the hand-drop should read lower than the biggest drop, or label it "ใหญ่ที่สุด".
5. Bicycle: keep as image beside "สามสิบกว่ากิโลต่อชั่วโมง".
6. Beat 4: "puffs up like a bag" becomes a parachute or upside-down bag; size "ราวห้าถึงหกมิลลิเมตร"; do not say "never".
7. Beat 3 "ball-sized": say "ใหญ่เท่าลูกบอล" as a question only; no narrator claim of impossibility beyond "ไม่เคยพบ".
8. Last line: "เบรกมาตลอดทาง" becomes "ถูกอากาศเบรกไว้".
9. Keep "terminal velocity" unsaid; mark the no-air world as a thought experiment ("สมมติว่า").

## Premise, reveal and learning impact

- Premise and reveal survive: air drag sets a speed cap and a size cap. Only the dramatic numbers soften (train ratio, roof damage). Flag: the hook's "สองเท่า" is the premise-critical number; Preaw chooses between number-only and a hedged ratio.

## Uncertainties and access gaps

- Gunn and Kinzer table, Villermaux and Bossa paper, Pruppacher and Pitter 1971 and Hobbs and Rangno 2004 were not opened; W1.3 should try them again or keep hedges.
- NWS cloud chart PDF unreadable; JetStream figure via an archived 2008 excerpt.
- Cyclist speeds and Thai tropical cloud-base heights are unsourced.
- Sound and visuals: no real recording is claimed; the no-air silence and pellet hits are dramatization and need labelling in the script; the gauge needle at 700 is a model value, not a measurement.
