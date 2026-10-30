# Lake Nyos (1986) — Research packet `NYOS-RESEARCH-R1`

- **Deliverable:** `NYOS-EP01-SHORT` (Short only, 50–80 s). Delivery record: `scripts/lake-nyos/delivery.md`.
- **Profile / mode:** `channel-default` mystery-educational; **named real case** (not fiction-with-factual-knowledge). Factual claims present, so Boat passes apply.
- **Research date / access date:** 2026-10-30 (Boat).
- **Status (R1): every source is lead-only (search-engine snippets).** Direct fetches were blocked in this session (see access log). No primary text was opened. Confidence ratings below say how well independent snippets agree and how close they are to a primary source; they are not a substitute for opening it. The exact-revision fact-check must open the primary sources (`SRC001`–`SRC005`) before any claim is passed as `verified`.
- **Evidence classes:** `fact` (documented by the scientific investigation), `report` (a survivor's or witness's experience; not proof of cause), `folklore`, `hypothesis`, `fiction`. **Confidence:** high / medium / low, with the reason.

## Access log (2026-10-30)

| Route | Result |
| --- | --- |
| `curl` to `www.commerce.alaska.gov` (Kling 1987 PDF copy) and `pubs.usgs.gov` (OFR 87-97 PDF) | Proxy `CONNECT` 403 (policy denial) |
| WebFetch `volcano.si.edu`, `pubs.usgs.gov`, `pmc.ncbi.nlm.nih.gov` | Host not in the session's allowed network domains; stopped fetching per tool guidance |
| WebSearch (12 queries) | Worked; snippets and result summaries only |

**To reach R2 (fact-check):** the session needs these hosts allowed: `pubs.usgs.gov` (SRC002), `pmc.ncbi.nlm.nih.gov` (SRC003), `sites.lsa.umich.edu` (Kling papers), `volcano.si.edu`, `www.ngdc.noaa.gov` (SRC006), `www.pnas.org` (SRC004).

## Brief

- **User concept (production material, from the delivery record):** misdirect the viewer toward an invisible thing / a monster / wild animals as the killer, then reveal CO2 released from the lake. User invites other proposals.
- **Central question:** One night in 1986, people and animals in villages around a quiet crater lake died where they were, with no wounds and no damage to houses. What killed them?
- **Learning takeaway:** A deep crater lake can store huge amounts of CO2 from magma in its bottom water. If the layers overturn, the gas comes out at once. CO2 is heavier than air, so it flowed downhill along valleys like an invisible river and suffocated people up to about 25 km away. Pipes now vent the gas slowly.
- **Period/context:** Northwest Cameroon (Menchum area), night of 21 Aug 1986; two years after the smaller Lake Monoun event (15 Aug 1984).

## Key conclusions that shape the telling

1. **The core answer is solid.** The US scientific team's Science paper (Kling et al. 1987, `SRC001`) concluded: the gas was mostly CO2 stored in the deep water, victims died of CO2 asphyxiation, the CO2 was magmatic in origin, and there was no significant direct volcanic activity (abstract text, seen via snippets of ADS/ResearchGate).
2. **The trigger is not known.** Landslide, rain cooling one side, wind, an earthquake, internal gas build-up, and a small underwater eruption (minority view: Tazieff 1988, Sigvaldason 1989) have all been proposed (`SRC007`, `SRC008`). The script must not name one trigger as fact.
3. **The death toll is "about 1,700" or "1,746".** "At least 1,700" is the Science abstract's wording; 1,746 is the commonly cited count (Britannica, Wikipedia). Livestock figures range from ~3,000 to ~8,000 head; use "หลายพันตัว".
4. **Survivors did not know the cause, and outside rumours spread.** Bomb-test / secret-weapon rumours and supernatural explanations (angry spirits, ancestors, a dead "Lake Chief") were reported (`SRC009`, `SRC010`). This makes an "unknown killer" misdirection fair. **No source records anyone blaming a monster or wild animals.**
5. **Lake Nyos degassing:** first permanent pipe 2001, more pipes 2011–2012; a 2020 paper says the lake reached the stage where natural recharge is balanced by discharge (`SRC005`). Residual risk statements vary; avoid "solved forever".

## Source registry (R1)

All entries: **lead-only (snippet)**, accessed 2026-10-30. Primary sources are named so R2 can open them.

| ID | Source | Type / limits |
| --- | --- | --- |
| `SRC001` | Kling, G.W. et al. (1987). "The 1986 Lake Nyos Gas Disaster in Cameroon, West Africa." *Science* 236:169–175. doi:10.1126/science.236.4798.169. Leads: https://ui.adsabs.harvard.edu/abs/1987Sci...236..169K ; https://www.researchgate.net/publication/6050331 | Primary, peer-reviewed. Abstract wording seen in snippets ("at least 1700", hypolimnion CO2, asphyxiation, magmatic, no significant direct volcanic activity). Body text (survivor reports) not seen directly; a search summary attributes the rotten-egg/gunpowder smell and warm sensation to this paper — unconfirmed. |
| `SRC002` | Tuttle, M.L., Clark, M.A., Kling, G.W. et al. (1987). *The 21 August 1986 Lake Nyos gas disaster, Cameroon: final report of the United States scientific team.* USGS Open-File Report 87-97. https://pubs.usgs.gov/publication/ofr8797 | Primary (US government). Catalogue record only; full PDF blocked. |
| `SRC003` | Baxter, P.J., Kapila, M., Mfonfu, D. (1989). "Lake Nyos disaster, Cameroon, 1986: the medical effects of large scale emission of carbon dioxide?" *BMJ* 298:1437–1441. https://pmc.ncbi.nlm.nih.gov/articles/PMC1836556/ | Primary, medical. Abstract via snippet: 845 survivors seen at/admitted to hospital; findings compatible with an asphyxiant gas; skin lesions in 161 (19%), first thought to be acid burns, linked to CO2-induced coma. Full text blocked. |
| `SRC004` | Kling, G.W. et al. (2005). "Degassing Lakes Nyos and Monoun: Defusing certain disaster." *PNAS*. https://www.pnas.org/doi/10.1073/pnas.0502274102 | Primary. Snippet only (pipe history, projections). |
| `SRC005` | Halbwachs, M. et al. (2020). "Final step of the 32-year Lake Nyos degassing adventure: Natural CO2 recharge is to be balanced by discharge through the degassing pipes." *J. African Earth Sciences* 167:103575. https://ui.adsabs.harvard.edu/abs/2020JAfES.16703575H/abstract | Primary. Abstract summary only. |
| `SRC006` | NOAA NCEI Hazard database, Lake Nyos event. https://www.ngdc.noaa.gov/hazel/view/hazards/volcano/event-more-info/1719 | Secondary (government compilation). Snippet: rumble ~20 s, fountain ~90 m, gas volume given in m³ (unit conflict with tonnes elsewhere). |
| `SRC007` | Sigurdsson, H. et al. (1987). "Origin of the lethal gas burst from Lake Monoun, Cameroun." *J. Volcanol. Geotherm. Res.* 31:1–16. https://www.usgs.gov/publications/origin-lethal-gas-burst-lake-monoun-cameroun | Primary. Abstract summary: 37 deaths, burst from a 96 m-deep crater, linked to a landslide from the eastern rim; not an eruption. |
| `SRC008` | Trigger literature: "A trigger mechanism for the Lake Nyos disaster" (JVGR 1999, https://www.sciencedirect.com/science/article/abs/pii/S0377027399000177); EARTH Magazine "Benchmarks" (https://www.earthmagazine.org/article/benchmarks-august-15-1984-august-21-1986-african-killer-lakes-erupt/); Wikipedia "Lake Nyos disaster" | Mixed primary abstract + secondary. Snippets list landslide, rain, wind, earthquake, internal gas, small eruption; EARTH says Monoun's trigger "has never been determined". |
| `SRC009` | Shanklin, E. (1989). "Exploding lakes and maleficent water in Grassfields legends and myth." *J. Volcanol. Geotherm. Res.* 39:233–246; and Shanklin (2007) "Exploding lakes in myth and reality" (https://www.researchgate.net/publication/240675567) | Primary anthropology. Abstract/secondary snippets: lakes seen as homes of ancestors and spirits that can cause death; migration stories may encode past lake outbursts; Shanklin says this is not conclusive. Full text not seen. |
| `SRC010` | Bressan, D. "The Deadly Cloud At Lake Nyos", *Forbes*, 21 Aug 2019 (https://www.forbes.com/sites/davidbressan/2019/08/21/the-deadly-cloud-at-lake-nyos/); Massey Univ. *Australasian J. Disaster & Trauma Studies* 2011-1 (Fomine) (https://trauma.massey.ac.nz/issues/2011-1/fomine.htm) | Secondary. Rumours of secret weapons / atomic explosions; supernatural attributions; Nyos residents blaming the deceased "Lake Chief". |
| `SRC011` | Britannica, "Lake Nyos disaster" (https://www.britannica.com/event/Lake-Nyos-disaster); History.com "Gas cloud kills Cameroon villagers" | Tertiary. 1,746 dead, ~3,000 cattle, "innumerable birds, insects"; vegetation unaffected; ~21:30 rumble 15–20 s. |
| `SRC012` | Wikipedia "Lake Nyos disaster" (https://en.wikipedia.org/wiki/Lake_Nyos_disaster) | Tertiary aggregator; used only to locate upstream citations (1,746 / 3,500 livestock; 100,000–300,000 t CO2, "up to 1.6 Mt"; ~100 km/h initial rise; ~1 m lake drop; villages Nyos, Kam, Cha, Subum; Joseph Nkwain account). |
| `SRC013` | Lake Kivu journalism (Gulf News, Kuwait Times/AFP, reset.org on KivuWatt, equaltimes.org) | Secondary; no peer-reviewed source opened. ~2 million people around the lake; methane + CO2 in deep water; KivuWatt extracts methane; dispute whether extraction lowers or raises risk. |
| `SRC014` | Low-reliability blogs (explorersweb, allthatsinteresting, atlasobscura, nzsurvivor, spacegroup) | Leads only. Not used to support any claim. |

## Claim ledger (R1)

Usable Thai wording is a proposal for Preaw, not script text. Copies of Wikipedia across sites count as one source.

| ID | Claim and usable wording | Evidence | Class | Confidence | Notes / limits |
| --- | --- | --- | --- | --- | --- |
| `F001` | Date: night of **21 Aug 1986**. "คืนวันที่ 21 สิงหาคม 1986" | `SRC001` abstract, `SRC002` title, `SRC011` | fact | high | — |
| `F002` | Time: about **21:30** local, a rumble from the lake. "ราวสามทุ่มครึ่ง" | `SRC011` (History.com), `SRC006` (rumble ~20 s) | report/fact | medium | Time comes from survivor reports compiled later; say "ราว". |
| `F003` | Deaths: **about 1,700** (often cited 1,746). "คนตายราว 1,700 คน" or "1,746 คน" | `SRC001` "at least 1700"; `SRC011`/`SRC012` 1,746 | fact | high (≈1,700); medium (exact 1,746) | Do not say "1,800" (rounded in some media). |
| `F004` | Livestock: **thousands** (~3,000 cattle; other figures 3,500–8,000). "วัวควายตายหลายพันตัว" | `SRC011`, `SRC012`, other secondaries disagree | fact (range) | medium | Use no exact number. |
| `F005` | Small animals, **birds and insects** also died; **plants and houses were not damaged**. "นก แมลง ก็ตาย แต่บ้านไม่พัง ต้นไม้ไม่เป็นอะไร" | `SRC011` (Britannica) | fact (tertiary) | medium | Good clue: no wounds, no destruction. Check in `SRC002` for R2. |
| `F006` | Villages: **Nyos, Kam, Cha, Subum** (also Fang, Mashi named). Nyos and Cha nearest and hardest hit. | `SRC012`, SDSU volcano page, others | fact | medium | Village lists vary. Safe: name Nyos ("หมู่บ้านนีออส") + "หมู่บ้านรอบ ๆ". |
| `F007` | Reach: lethal **up to ~25 km** (some say 23 km concentrated). "ไกลถึงราว 25 กิโลเมตร" | `SRC012`, `SRC011` | fact | medium | Use "ราว". |
| `F008` | Cause: mostly **CO2 stored in the deep (bottom) layer** of the lake; victims died of **CO2 asphyxiation**. "ก๊าซคาร์บอนไดออกไซด์ที่สะสมอยู่ก้นทะเลสาบ ทำให้ขาดอากาศหายใจ" | `SRC001` abstract (snippet quoting it in full) | fact | high | Premise-critical. Open `SRC001` in R2. |
| `F009` | The CO2 is **from magma** deep below, seeping in via springs over years (decades or longer); **not a volcanic eruption** of lava. "ก๊าซจากแมกมาใต้ดินซึมเข้าทะเลสาบมาเรื่อย ๆ" | `SRC001` ("magmatic sources", "no significant, direct volcanic activity"); EARTH Magazine (springs, decades or centuries) | fact | high (magmatic, no eruption); medium (timescale) | Minority view (Tazieff) argued a volcanic release; do not present as a dispute in 80 s, but do not call it "volcano erupted". |
| `F010` | **Stratification:** the cold, gas-heavy bottom water stayed below; the lake (about 200 m deep) acts like a sealed soda bottle. "ก้นทะเลสาบอัดก๊าซไว้เหมือนขวดน้ำอัดลม" | `SRC001`/`SRC004` (via snippets); intake depths 207–209 m (`SRC004` figure caption) | fact + analogy | medium | Soda-bottle analogy is a common teaching image (label as analogy, not a claim). |
| `F011` | **Trigger unknown:** landslide, cold rain, wind, earthquake or gas build-up proposed. "ยังไม่มีใครรู้แน่ว่าอะไรเป็นตัวจุดชนวน" | `SRC008` (one snippet attributes a landslide/earthquake proposal to a Kling-coauthored abstract; which paper is unclear) | hypothesis | high that it is unresolved | Do not assert one trigger. |
| `F012` | Gas amount: **~100,000–300,000 tonnes** CO2 (some say up to 1.6 Mt). | `SRC012`; `SRC006` gives m³ (unit conflict) | fact (range) | low–medium | Skip numbers in the Short, or say "หลายแสนตัน" only after R2 check. The user's "volume" request: no inspected km³ figure; do not use "1.2 km³". |
| `F013` | Cloud **rose fast (~100 km/h reported) then sank and flowed down valleys** because CO2 is heavier than air (~1.5×). "ก๊าซหนักกว่าอากาศ ไหลลงหุบเขาเหมือนแม่น้ำที่มองไม่เห็น" | Heavier-than-air: basic physics, `SRC012`; 100 km/h: `SRC012` and copies only | fact (heavier, valleys); low (speed) | high / low | Drop the 100 km/h figure. A "20–50 km/h" figure in the brief has **no source found**: do not use. |
| `F014` | A **water fountain** (~90–100 m) and the lake level **dropped ~1 m**; a surge hit the shore. | `SRC006`, `SRC012` | fact/report | low–medium | Optional; "25 m wave" not found. |
| `F015` | **Lake turned red/brown** afterwards (iron from deep water oxidising). "น้ำในทะเลสาบเปลี่ยนเป็นสีแดงอมน้ำตาล" | Secondary snippets only (photos widely reproduced) | fact (likely) | medium-low | Strong visual clue; confirm in `SRC001`/`SRC002`. |
| `F016` | Survivors reported a smell of **rotten eggs or gunpowder** and a **warm feeling** before losing consciousness. "บางคนเล่าว่าได้กลิ่นไข่เน่า หรือกลิ่นดินปืน" | Attributed to `SRC001` by a search summary; `SRC012` | report | medium | It is a **report**. CO2 is odourless; the smell may come from trace sulphur or be a CO2 sensation effect (not settled). Never say "the gas smelled of rotten eggs". |
| `F017` | **Flames went out** (lamps/fires). | Atlas Obscura only (`SRC014`) | report (unsourced) | low | Physically plausible but not sourced. **Do not use** until found in a primary source. |
| `F018` | Many died **at night in their homes / sleep**; survivors woke after hours in a coma (6–36 h reported). "หลายคนหลับไปแล้วไม่ตื่นอีกเลย" | Night timing `F001/F002`; Joseph Nkwain account (`SRC012`; Subum survivor, woke unable to speak, daughter died); coma duration only in explorersweb | fact (night) / report | medium | "Died in their sleep" is a fair generalisation for many, not all (some were outdoors). Use "หลายคน". |
| `F019` | **Skin lesions** in 19% of hospitalised survivors; first thought acid burns, **linked to coma** (pressure/heat), not chemical burns. | `SRC003` abstract | fact (medical) | medium-high | Debated at the time. Do not show burns; safe: avoid. |
| `F020` | **Lake Monoun, 15 Aug 1984:** 37 killed by a similar gas burst, ~95 km from Nyos. "สองปีก่อน ทะเลสาบโมนูนก็เคยฆ่าคน 37 คน" | `SRC007` abstract | fact | high (37, date); medium (landslide link) | Distance not inspected; skip it. |
| `F021` | **Degassing:** first permanent pipe at Nyos 2001; two more 2011–2012; by ~2019 the lake was largely emptied of hazardous gas and recharge is balanced by the pipes. "ตั้งแต่ปี 2001 มีท่อค่อย ๆ ปล่อยก๊าซออก" | `SRC004`, `SRC005` (abstracts) | fact | medium-high (2001); medium (status) | Avoid "safe forever"; Nyos's natural dam has also been flagged as weak (not inspected). |
| `F022` | **Lake Kivu** (Rwanda/DR Congo) holds dissolved CO2 and methane; ~2 million people live around it; methane is extracted for power (KivuWatt). | `SRC013` | fact (journalism) | medium | Optional outro hook. Risk size and extraction effect are disputed; say "ยังมีทะเลสาบอีกแห่งที่ใหญ่กว่ามาก". |
| `F023` | **Rumours afterwards:** bomb test, secret weapon; **supernatural explanations** (spirits, ancestors, the late "Lake Chief"). | `SRC010` | report | medium | Fair misdirection material. Name no country (the Israel rumour is unfounded and political). |
| `F024` | **Local lake lore:** Grassfields stories treat lakes as homes of ancestors/spirits that can bring death; migration stories may recall past lake outbursts. | `SRC009` (abstract + secondary) | folklore | medium (beliefs exist); low (that they record real eruptions) | Do not invent a specific Nyos legend, name or creature. Say "ในความเชื่อท้องถิ่น ทะเลสาบบางแห่งเป็นที่อยู่ของวิญญาณ". |
| `F025` | **Monster / wild animals as the killer.** | No source | fiction | — | No survivor or rumour on record blames a monster or animal. See boundary below. |

## Misdirection beats: fair vs fabricated

| Beat | Ruling | Basis |
| --- | --- | --- |
| "Nobody knew what killed them" / survivors woke not knowing | **Fair** | `F018`, `F023` |
| "No wounds, houses intact, plants fine — but animals and insects dead too" | **Fair clue** (points away from attackers and toward air) | `F005` |
| "People blamed spirits / a bomb / a secret weapon" | **Fair** if framed as rumour or belief (`F023`, `F024`) | — |
| "Local belief: lakes are homes of spirits" | **Fair** as folklore, generic, no invented specifics | `F024` |
| "Was it a wild animal?" posed as the **viewer's** question, then ruled out by the clue that cattle, birds and insects also died with no marks | **Fair** as a rhetorical question to the viewer | Not a historical claim |
| "Villagers thought a monster came from the lake" | **Fabricated** — no source | `F025` |
| "A beast attacked the village" shown as what happened | **Fabricated** | — |
| "Smell of rotten eggs = the gas" | **Overstated** — it is a reported sensation; CO2 is odourless | `F016` |
| "Flames went out" | **Unsourced** — hold | `F017` |
| "Volcano erupted under the lake" | **Contradicted** by the main investigation | `F009` |

## Fact-vs-fiction boundary for the twist

- **Allowed:** a shadowy "monster" or eyes in the dark presented as **imagination / the viewer's guess**, with a sketch treatment and on-screen label such as "จินตนาการ"; a question "สัตว์ร้าย? ผี? หรืออาวุธลับ?" voiced as the narrator asking, then answered by clues.
- **Not allowed:** the narrator asserting a creature or animal was seen, blamed or involved; inventing a named legend or spirit of Lake Nyos; showing victims as attacked; leaving the monster standing after the reveal. The reveal replaces the monster with the CO2 cloud (`F008`, `F013`).
- **Must keep:** trigger uncertainty (`F011`) if the script says what started it; "about" on numbers.

## Respectful-handling notes

- Real mass-casualty event. No corpses in close-up, no gore, no "skin lesion" imagery, no jokes. Bodies of cattle can be implied (silhouettes, wide shots).
- The "monster" is the viewer's misdirection, never a caricature of victims' beliefs. Present spirit beliefs and rumours neutrally, not as superstition to mock.
- Do not name the Israel bomb rumour or any country.
- Do not name individual survivors in the Short (Joseph Nkwain's account is only in secondary text). If used later, open a primary interview first.
- Prefer "ขาดอากาศหายใจ" to sensational wording; avoid "ทะเลสาบปีศาจ" as a narrator label (fine as a quoted nickname: media call it a "killer lake").

## Sound notes

- No real recording of the event is known; any rumble, gurgle or wind is **reconstructed** (label like fictional visuals: "เสียงจำลอง" where it could be mistaken for real).
- A low rumble at the release is supported as a **survivor report** (`F002`, ~15–20 s). No explosion bang, sirens, screams, gunshots or crowd panic: none are reported, and CO2 victims typically collapsed silently.
- **Silence is a fair clue:** rescuers reported no insect noise afterwards (`F005`, secondary). Dropping ambient insects to silence is supported in spirit; confirm in R2 before stating it in narration.
- Monster growls or animal sounds are **fiction**, only inside the labelled imagination beat; they must not overlap the real-event narration.

## Supported story angles

1. **Clue chain (recommended):** night → morning silence → people, cattle, birds and insects dead, but no wounds and houses standing → "beast? spirit? weapon?" → the lake turned red-brown → reveal: the lake "breathed out" CO2, which flowed downhill. Payoff: pipes now let the lake breathe slowly.
2. **Invisible river:** CO2 heavier than air pours down valleys and pools in low ground (`F013`), killing up to ~25 km away (`F007`).
3. **Loop hook (B_loop):** "และนี่ไม่ใช่ครั้งแรก" (Monoun 1984, `F020`) or "ยังมีอีกทะเลสาบที่ใหญ่กว่า" (Kivu, `F022`).

## Open questions / residual gaps

1. **All evidence is snippet-level.** Premise-critical `F008`, `F009`, `F003` rest on the Science abstract as quoted in snippets; R2 must open `SRC001`/`SRC002`/`SRC003` (hosts listed in the access log).
2. `F015` red water, `F016` smell, `F005` insects and silence: need a primary locator.
3. `F017` flames: unsourced; hold.
4. Gas volume and speed (`F012`, `F013`): conflicting units; no reliable speed. Keep qualitative.
5. Current degassing status after 2020 (`F021`) and dam weakness: not inspected.
6. No source supports a local monster or animal theory (`F025`); the misdirection must stay the viewer's guess.

## Change log

- `NYOS-RESEARCH-R1` (2026-10-30, Boat): first packet. Lead-only sources because fetches were blocked by network policy.
