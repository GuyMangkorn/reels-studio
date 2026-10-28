# ZCONDO research packet

| Field | Value |
| --- | --- |
| Packet revision | `ZCONDO-RESEARCH-R1` |
| Author / stage | Boat, research pass (before Preaw writes) |
| Research date | 28 October 2026 (Asia/Bangkok); all access dates below are this date |
| Deliverables served | `ZCONDO-SHORT-TH`, `ZCONDO-SHORT-EN` (shared research; each script still needs its own exact-revision fact-check) |
| Delivery record | [delivery.md](delivery.md) |
| Story mode | `fiction-with-factual-knowledge`: the zombie outbreak is fiction; the survival tips are real-world claims and must be true |
| Central question (for Preaw) | If you were locked inside a Bangkok-style high-rise unit with the city collapsing, how long could you last, and what would you do first? |
| Learning takeaway candidates | (1) the water still coming out of your tap after a blackout is a finite tank, so store it now; (2) the toilet cistern is drinkable-grade water, the bowl is not; (3) a full freezer buys about two days, the fridge only about four hours, so eat fridge food first; (4) never run a gas camp stove indoors |

This packet does not contain a script. Thai wording below is a *suggestion* for accurate phrasing; Preaw owns the narration.

## 1. Fact-versus-fiction boundary

| Layer | Status | How the script should treat it |
| --- | --- | --- |
| Zombies, infection by bite, zombie attraction to noise/light, corridor outbreak, wrecked city view | `fiction/dramatization` | Story-world rules. Fine as narration within the drama ("ในเรื่องนี้..."), but never phrased as real-world biology or as advice that works on a real threat. Noise/light discipline is a genre convention, not a researched fact. |
| Barricading the door | `fiction/dramatization` staging, with one real safety caveat (ZC-C18) | Show it as drama. Do not present a specific barricade technique as verified, and add no weapon instructions. |
| Water supply, water needs, hidden water, sanitation, food spoilage, stove/CO safety, power tips | `documented fact` (with the qualifications in the ledger) | These are the knowledge payload. Keep the conditions (e.g. "if the toilet tank water is clear and untreated"). |
| Why the power fails | Premise choice (Preaw) | Nothing in the research requires the grid to fail at a particular time. If the script wants the water tips to bite, the story must establish that the power is (or is about to be) out. |

## 2. Source registry

Access date for every entry: 28 Oct 2026. "Inspected" means Boat opened the page itself through a fetch tool (text extraction, not a visual read). "Lead-only" means only search snippets or a secondary summary were seen; do not cite these as verified.

| ID | Title / organization | Date | URL | Status | Limitations |
| --- | --- | --- | --- | --- | --- |
| `SRC001` | "Water", Ready.gov (FEMA, U.S.) | Update date not captured | https://www.ready.gov/water | inspected | U.S. household guidance; it does not cover hidden in-home water sources |
| `SRC002` | "How to Find Clean Water in an Emergency", CDC (U.S.) | Last updated 25 Jun 2025 | https://www.cdc.gov/water-emergency/about/how-to-find-clean-water-in-an-emergency.html | inspected | U.S. housing assumptions (tank water heaters common) |
| `SRC003` | "Power Outages", Ready.gov (FEMA) | Last updated 4 Jun 2026 (shown as 06/04/2026, U.S. format) | https://www.ready.gov/power-outages | inspected | Food hold times are almost certainly derived from USDA (`SRC004`), so the two are not independent corroboration |
| `SRC004` | "Keep Your Food Safe During Emergencies", USDA FSIS (archived copy) | Archive copy c. 2013 | https://webarchive.library.unt.edu/web/20130313033918/http:/www.fsis.usda.gov/PDF/Keep_Your_Food_Safe_During_Emergencies.pdf | lead-only | The live FSIS page returned HTTP 403. Only snippets were seen: fridge 4 h, full freezer 48 h, half-full 24 h, discard refrigerated perishables after 4 h without power |
| `SRC005` | "Carbon Monoxide (CO) Poisoning Basics", CDC | Last updated 26 Oct 2026 | https://www.cdc.gov/carbon-monoxide/about/index.html | inspected | U.S. guidance; stricter than common Thai indoor-stove practice (see ZC-C13) |
| `SRC006` | "Health Canada cautions campers about portable butane stoves", Health Canada | 26 Jul 2021 | https://recalls-rappels.canada.ca/en/alert-recall/health-canada-cautions-campers-about-portable-butane-stoves | inspected | Covers canister overheating, not CO or ventilation |
| `SRC007` | "Butane canister (lunchbox) cookers", Energy Safe Victoria (Australia) | Published 5 Mar 2015, reviewed 15 Dec 2022 | https://www.energysafe.vic.gov.au/update/safety/butane-canister-lunchbox-cookers | inspected | Tied to a specific uncertified-product recall; the mechanism (oversized pots overheat the canister) is general |
| `SRC008` | "Roof water tank system", Grundfos (pump manufacturer) | Undated | https://www.grundfos.com/ae/learn/research-and-insights/roof-water-tank-system | inspected | Vendor explainer, not Thai-specific; describes a common design, not every building |
| `SRC009` | Kyiv water utility statement on upper-floor booster pumps after outages (via komersant.ua) | c. 2022–2024 | https://komersant.ua/en/u-stolytsi-znovu-ie-voda-podachu-vidnovleno | lead-only (HTTP 403) | Snippet only: upper floors are fed by separate booster pumps that do not work without electricity |
| `SRC010` | Bangkok Post report on Myanmar power cuts (residents renting generators to pump water into apartments) | c. 2022 | https://www.bangkokpost.com/world/2277823/myanmar-ministry-blames-gas-prices-for-worsening-power-cuts | lead-only | Snippet only; a `reported experience` from Yangon, not Bangkok |
| `SRC011` | "Emergency toilets", WREMO (Wellington Region Emergency Management Office, NZ) | Undated | https://wremo.nz/get-ready/home-ready/emergency-toilets | inspected | Written for post-earthquake sewer damage; it covers apartments |
| `SRC012` | "Survival Basics: Sanitation and Waste Management", EM 9334, Oregon State University Extension | Oct 2021 | https://extension.oregonstate.edu/catalog/pub/em-9334-survival-basics-sanitation-waste-management | inspected | Disaster or earthquake context; does not cover manual bucket-flushing |
| `SRC013` | "Helpful Tips for a Water Shutoff" postcard, Alameda County Water District (California) | PDF metadata 24 Feb 2026 | https://www.acwd.org/DocumentCenter/View/7996 | inspected | Planned-shutoff context, where the sewer still works |
| `SRC014` | "Prepare for Water Outages", Seattle Public Utilities | Unknown | https://seattle.gov/documents/Departments/SPU/Services/Water/Prepare_Water_Outages_English.pdf | lead-only (HTTP 404) | Snippet: about 1 gallon poured into the bowl flushes a toilet; fill tubs and buckets beforehand |
| `SRC015` | Sphere Handbook WASH standard / WHO-WEDC Technical Note 9 (minimum water quantities) | Various | https://spherestandards.org/ ; https://cdn.who.int/media/docs/default-source/wash-documents/who-tn-09-how-much-water-is-needed.pdf | lead-only | Pages returned 403, and the WHO PDF text could not be extracted. Secondary summaries give 2.5–3 L/day for drinking and food, and 15 L/day as the household minimum |
| `SRC016` | Health NZ "Protecting your health in an emergency: Sewage disposal" | Unknown | https://info.health.nz/assets/Uploads/flood-advice/ENG-Large-Print/7.-pdf-Protecting-your-health-in-an-emergency-Sewage-disposal-Large-Print.pdf | lead-only | Snippet: bag in the bowl, shredded paper, bleach, dispose when half full |
| `SRC017` | Thai news and academic items on covering water containers against Aedes mosquitoes ("ปิด-เปลี่ยน-ปล่อย-ปรับ", 7-day cycle) | 2003–2014 items | e.g. https://mgronline.com/qol/detail/9560000029957 | lead-only | Secondary and older; no current กรมควบคุมโรค page was inspected |
| `SRC018` | American Red Cross power-outage checklist | Unknown | https://cpp.edu/em/files/en_power-outage-safety-checklist-red-cross.pdf | lead-only (HTTP 404) | Snippets: flashlights not candles; battery or hand-crank radio; charged portable charger |
| `SRC019` | Thai Building Control Act B.E. 2522 / กฎกระทรวงฉบับที่ 33 (2535) as amended by ฉบับที่ 69 (2564): high-rise fire-safety rules | 1992 / 2021 | e.g. https://www.thaipbs.or.th/now/content/4187 (general fire-door explainer) | lead-only | The regulation text was not inspected. Unit-door swing direction and emergency power for domestic water pumps remain unresolved |
| `SRC020` | Thai/expat forum and retail material on condo water (HomePro on low upper-floor pressure; ThaiVisa threads on mains → tank → pump) | Various | https://www.homepro.co.th/homeguru/water-pump-for-professional-home ; https://forum.thaivisa.com/topic/1194301-21st-floor-condo-low-water-pressure-issueneed-advice/ | lead-only | Anecdotal or marketing material. Suggests MWA/PWA rules push buildings to fill a storage tank first and then pump, but this is unconfirmed |
| `SRC021` | Generic web pages on sewage ejector pumps and outages | Various | (search results only) | lead-only, low quality | Repetitive SEO pages; used only to frame a hypothesis |

## 3. Claim ledger

Confidence is qualitative. "Usable wording" is a suggestion; the exact script wording still needs Boat's fact-check.

### Water supply in the building

**ZC-C01: How water reaches a high-rise unit.** `documented fact` (general design), `needs-qualification` for Thai condos in general
- Assertion: in many high-rises, water is pumped up to a roof tank and then flows down to most floors by gravity. The few floors just under the roof tank do not get enough gravity pressure, so they need a booster pump. Water reaches the roof tank through a transfer pump or straight from the mains.
- Evidence: `SRC008` (inspected). Thai lead `SRC020` suggests mains feed a ground or basement tank, which is then pumped up (unconfirmed).
- Contrary / limits: building designs vary. Some buildings use direct booster or pressure-tank systems with no roof tank, and then water can stop almost at once when power fails. No Thai engineering standard was inspected. Do not say *every* condo works this way.
- Confidence: moderate for the general mechanism, low for "typical Thai condo".
- Usable wording (TH): "คอนโดสูงหลายแห่ง ใช้ปั๊มดันน้ำขึ้นไปเก็บในถังบนดาดฟ้า แล้วปล่อยลงมาตามท่อ"

**ZC-C02: What happens when the power fails.** `documented fact` (mechanism) + `hypothesis` (timing)
- Assertion: without electricity the pumps stop. Gravity-fed floors keep getting whatever is left in the roof tank, but the tank cannot refill. Floors fed by a booster pump (the top floors) lose pressure first. The water still running after a blackout is a finite remainder.
- Evidence: `SRC008` (gravity supply, top-floor booster); `SRC009` lead (upper-floor boosters need electricity); `SRC010` lead (reported experience: residents rent generators to pump water into apartments).
- Contrary / limits: **how long the water lasts cannot be stated.** It depends on tank size, how many residents draw water, and whether the building has a generator connected to its domestic pumps. Thai fire rules require emergency power for life-safety systems. Whether domestic water pumps are covered is unverified (`SRC019`). In a panic, every resident filling containers at once would drain the tank faster (inference). The top floors losing water first follows from the booster design and is not a universal rule.
- Confidence: moderate for the mechanism; no supported number of hours.
- Usable wording (TH): "ไฟดับ = ปั๊มหยุด น้ำที่ยังไหลอยู่คือน้ำที่เหลือค้างในถังบนตึก ใช้หมดแล้วไม่มีใครปั๊มขึ้นไปเติม" / avoid: "น้ำจะไหลอีก X ชั่วโมง", "ชั้นล่างมีน้ำใช้ได้เรื่อยๆ"
- Usable wording (EN): "When the power dies, the pumps die. Whatever still comes out of your tap is what's left in the tank on the roof, and nobody's refilling it."

**ZC-C03: Fill containers right away.** `documented fact` (standard outage advice)
- Assertion: before or at the start of a water outage, fill bathtubs, buckets, pitchers and bottles. Keep sealed or covered containers for drinking and cooking, and use tub or bucket water for flushing.
- Evidence: `SRC013` (inspected); `SRC014` lead.
- Limits: many Bangkok condo bathrooms are shower-only with no bathtub. This is an observation, and no statistic was inspected. The script should say containers (ถัง, กะละมัง, หม้อ, ขวด) rather than assume a tub. Cover stored water (ZC-C15).
- Usable wording (TH): "รองน้ำใส่ทุกอย่างที่มี ถัง กะละมัง หม้อ ขวด แล้วปิดฝาไว้"

### Water needs and hidden water

**ZC-C04: How much water a person needs.** `documented fact`
- Assertion: store at least one gallon (about 3.8 L) per person per day for several days, covering drinking and sanitation. Children, nursing mothers and sick people may need more, and in very hot weather needs can double.
- Evidence: `SRC001` (inspected). `SRC015` lead: about 2.5–3 L/day for drinking and food alone, and about 15 L/day as the humanitarian household minimum.
- Limits: in Bangkok heat with the air-conditioning off, the "can double" caveat applies. `SRC001` also says not to ration drinking water unless authorities order it. A story that has the viewer sip as little as possible would contradict that guidance (see ZC-C22).
- Usable wording (TH): "คนหนึ่งควรมีน้ำอย่างน้อยวันละประมาณ 4 ลิตร ทั้งดื่มและใช้ ยิ่งร้อนยิ่งต้องมากกว่านั้น". "Approximately 4 L" is a rounding of 3.8 L; keep the word "ประมาณ".
- EN: "at least a gallon, about four litres, per person per day"

**ZC-C05: Hidden drinkable water in the unit.** `documented fact`, `needs-qualification` for Thai units
- Assertion: usable in-home sources include water in the **toilet tank (cistern), not the bowl**, if it is clear and has not been treated with colouring toilet cleaners; melted ice made from clean water; the liquid in canned fruit and vegetables; and the tap water-heater tank.
- Evidence: `SRC002` (inspected).
- Limits: Thai condos commonly use instantaneous electric shower heaters with no storage tank. This is an observation; `SRC020`-type retail pages are leads only. **Do not use the water-heater-tank tip for a Thai condo** unless the story shows a unit with a storage heater. `SRC002` gives no treatment step for in-home sources, so do not add "boil it first" as a CDC instruction. Boiling is generic advice that would need its own source and a working stove (see ZC-C13).
- Usable wording (TH): "น้ำในแท็งก์ชักโครก (ถังด้านหลัง ไม่ใช่ในโถ) ถ้าใสและไม่ได้ใส่น้ำยา ก็เป็นน้ำสำรองได้" / "น้ำแข็งในช่องฟรีซ ละลายแล้วก็คือน้ำดื่ม"

**ZC-C06: Pool water.** `documented fact`
- Assertion: pool or spa water is for hygiene and cleaning only, never for drinking.
- Evidence: `SRC002`.
- Use: optional. A condo pool seen from the balcony could serve as a visual beat, but going there contradicts the stay-in-the-unit premise.

**ZC-C21: The toilet bowl is not a water source.** `documented fact`. `SRC002` lists bowl water among the sources to avoid.

**ZC-C22: Do not ration drinking water.** `documented fact` with tension against the story
- `SRC001`: never ration drinking water unless ordered to do so by authorities. Plot impact: frame survival as **saving water for washing and flushing** and planning supply, not as drinking less. A fictional collapse has no authorities, but the real-world tip should not teach dehydration.

### Sanitation

**ZC-C07: Manual flush with a bucket.** `documented fact` (conditional)
- Assertion: if the toilet cannot refill but the drains still work, pour about 1.2 gallons (about 4.5 L) of water quickly into the bowl from about 30–60 cm high. The surge creates a siphon and flushes.
- Evidence: `SRC013` (inspected); `SRC014` lead (about 1 gallon).
- Limits: it only works while the building's drainage works. Reusing washing or rinse water (greywater) for this is a reasonable inference that no inspected source states explicitly. Keep drinking water for drinking. The plumber figures of 1.6 gal and 3–5 gal for old toilets are lead-only.
- Usable wording (TH): "ชักโครกไม่มีน้ำ ไม่ได้แปลว่าใช้ไม่ได้ เทน้ำใช้แล้วสักถังเล็กๆ ลงโถแรงๆ ทีเดียว มันจะกดลงไปเอง"

**ZC-C08: When not to flush; sewage concerns.** `documented fact` for earthquake/sewer damage; `hypothesis` for condo pumps
- Assertion: when sewer pipes may be damaged, do not flush even if water still runs, because waste can end up in your own or a neighbour's space (`SRC011`). OSU advises avoiding toilets even if home lines are intact, because street pipes may be broken (`SRC012`).
- Condo-specific mechanism (`hypothesis`, `SRC021` low quality): drainage inside a building usually runs down by gravity, but any basement sewage lift or treatment pump needs power. If it stops or the line blocks, the lowest outlets back up first. Not verified for Thai buildings.
- Usable wording: "ถ้ากดแล้วน้ำไม่ลง หรือมีน้ำเสียย้อนขึ้นมา หยุดใช้ชักโครก เปลี่ยนเป็นถุงทันที". Avoid asserting that a blackout makes sewage back up into your unit.

**ZC-C09: Bag-in-toilet and two-bucket toilets.** `documented fact`
- Assertion: in an apartment, WREMO recommends a two-bucket system: one bucket for urine (diluted and poured onto green space) and one bin-liner-lined bucket for faeces, covered with dry material after each use. A sturdy bag lining the toilet bowl, with dry absorbent material such as shredded paper or sawdust, is a last resort (`SRC011`). OSU says to double-bag and seal the waste, store it away from food and water, and keep washing hands, or use sanitizer with at least 60% alcohol when water is short (`SRC012`).
- Limits: WREMO discourages the bowl-bag method for the general public because of infection risk. Bleach dosing comes only from the `SRC016` lead, so do not state quantities. Emptying "into the communal bin" requires leaving the unit, which conflicts with the premise. A sealed bag stored on the balcony away from food and water is consistent with `SRC012`'s storage advice; the balcony location itself is an inference.
- Usable wording (TH): "เอาถุงขยะหนาๆ ครอบโถ ใส่กระดาษฉีกรองไว้ ใช้เสร็จมัดปากถุง ซ้อนอีกชั้น แยกเก็บให้ห่างจากอาหารและน้ำ แล้วล้างมือทุกครั้ง"

### Food

**ZC-C10: Fridge and freezer hold times.** `documented fact`
- Assertion: with the doors kept closed, a refrigerator keeps food cold for about 4 hours and a full freezer holds its temperature for about 48 hours (`SRC003`; `SRC004` lead adds about 24 hours for a half-full freezer). Throw out food exposed to 40°F (4°C) or higher for 2 hours or more, or with an unusual odour, colour or texture (`SRC003`). `SRC004` lead: discard refrigerated perishables (meat, fish, eggs, milk, soft cheese, leftovers) after 4 hours without power.
- Derived ordering (`inference` from these hold times): eat fridge perishables first, then thawing freezer food, and keep canned and dry food for last. This order follows directly from the numbers, but no inspected source states it.
- Limits: the hold times assume closed doors and a normal room. A Bangkok unit with no air-conditioning is hot, so treat the figures as "about" or an upper bound. Do not say a half-full freezer lasts 48 hours.
- Usable wording (TH): "ตู้เย็นไฟดับ เก็บความเย็นได้แค่ราว 4 ชั่วโมง ถ้าไม่เปิดประตู ช่องฟรีซที่แน่นๆ อยู่ได้ราว 2 วัน ของสดกินก่อน ของกระป๋องเก็บไว้ทีหลัง"
- EN: "A closed fridge stays cold for about four hours; a full freezer, about two days."

**ZC-C11: No taste or smell test.** `documented fact`. `SRC003`: "When in doubt, throw it out!" Usable: "ไม่แน่ใจ = ทิ้ง อย่าชิมเพื่อเช็ก". The "don't taste-test" wording comes from `SRC004`-derived leads; `SRC003` says to throw out food with an unusual odour, colour or texture.

**ZC-C12: Refrigerated medicines.** `documented fact`, optional. `SRC003`: if the power is out for more than a day, discard medication that should be refrigerated, unless its label says otherwise. Only include this if the script names medicine; it is too much detail for a 40–60 s Short.

### Cooking without electricity

**ZC-C13: Gas camp stoves indoors.** `documented fact`. **The safety note is required if the script shows cooking.**
- Assertion: CDC says never to use a portable gas camp stove indoors (`SRC005`, updated 26 Oct 2026). Ready.gov says camp stoves and charcoal grills belong outdoors, at least 20 feet (about 6 m) from windows (`SRC003`). CO symptoms are headache, dizziness, weakness, upset stomach, vomiting, chest pain and confusion, and high exposure can cause unconsciousness or death (`SRC005`).
- Contrary / limits: in Thailand, portable butane stoves (เตาแก๊สปิกนิก/เตาแก๊สกระป๋อง) are widely used indoors for หมูกระทะ and shabu. That is everyday practice, not evidence of safety. The official guidance inspected is U.S.-based and stricter, and no Thai agency guidance was inspected. A balcony right next to the sliding door does not meet the 20-ft standard. Condo rules and fire risk also argue against it.
- **Story impact:** the "kitchen" beat should pivot to **no-cook food** (canned food, instant noodles soaked in room-temperature water, bread, fruit, nuts). If a stove appears, it should be framed as a mistake or a warning, not a tip. Flag to Preaw: an "instant noodles on a camp stove in the kitchen" tip would be `contradicted`.
- Usable wording (TH): "อย่าจุดเตาแก๊สปิกนิกในห้องปิด แก๊สคาร์บอนมอนอกไซด์ไม่มีกลิ่น ไม่มีสี ฆ่าคุณได้ก่อนซอมบี้จะมาถึง" (the "colourless, odourless" property is standard CO knowledge, but `SRC005`'s inspected excerpt did not quote it, so it needs one more locator at fact-check) / "บะหมี่แช่น้ำธรรมดาก็นิ่มได้ แค่รอนานหน่อย" (room-temperature soaking is `unverified` general knowledge, low risk; fact-check will confirm or drop it)

**ZC-C14: Butane canister overheating.** `documented fact`
- Assertion: an oversized pot or pan reflects heat onto the butane canister and can overheat it, risking fire or explosion if the safety device fails (`SRC007`). Use only pots that fit the stove's grate so they don't cover the canister, and keep the stove away from other heat sources (`SRC006`).
- Use: only if a stove appears on screen. Film/Mark must not show an oversized pot covering the canister as normal use.

### Water hygiene in a Thai climate

**ZC-C15: Cover stored water against mosquitoes.** `documented fact` (Thai public-health messaging), sources lead-only
- Assertion: open stored water lets Aedes mosquitoes (dengue vectors) breed. Thai campaigns say to cover containers and clean or change stored water about every 7 days (`SRC017`).
- Limits: secondary and older sources; no current กรมควบคุมโรค page was inspected. Safe wording without numbers: "รองน้ำแล้วปิดฝา กันยุงลายมาวางไข่". Avoid "ลูกน้ำเกิดใน 7 วัน" as a biology claim unless rechecked.

### Barricade, door and fire safety

**ZC-C18: Unit doors and barricading.** `unverified` (door swing in Thai condos) + `documented principle` (fire doors) + `fiction` (barricade efficacy)
- Door swing: Boat did not find a Thai source on whether condo unit entrance doors open inward or outward. Residential entry doors commonly open inward (lead only, a U.S. explainer). **Do not state a Thai building-code rule.** If the script needs it, the scene can simply show the door opening inward without narration asserting it as a norm.
- Fire stair doors: these generally open in the direction of escape and close by themselves (`SRC019` lead; regulation text not inspected). The script should not suggest wedging fire doors open or shut.
- Real-world safety caveat (`inference`): a barricade that cannot be cleared quickly also blocks your own fire escape, and a camp stove plus a blocked door is the worst combination. Suggested optional line (TH): "กั้นประตูได้ แต่ต้องรื้อออกได้เร็วถ้าไฟไหม้"
- No weapon or violence instructions anywhere (assignment constraint).

**ZC-C19: Zombie behaviour.** `fiction`. Attraction to sound or light, bite infection and the speed of spread are story-world rules. When the narration gives "keep quiet, kill the lights" advice, tie it to the story-world ("ในโลกนี้ พวกมันตามเสียง"), not to real-world fact.

### Power and communication

**ZC-C16: Light sources.** `documented fact` (partial)
- Have flashlights for every household member (`SRC003`). Prefer flashlights over candles because candles can start fires (`SRC018` lead). Usable: "ใช้ไฟฉาย อย่าใช้เทียน". The candle half rests on a lead source and needs a locator at fact-check.

**ZC-C17: Phone, power bank, radio, appliances.** `documented fact` (partial)
- Plan for a portable charger or power bank (`SRC003`). A battery or hand-crank radio is a standard kit item for updates (`SRC018` lead). Unplug appliances and electronics to avoid damage from surges when power returns (`SRC003`).
- Phone-saving settings (low-power mode, lower brightness, airplane mode when there is no signal) are `unverified` general device knowledge; no source was inspected. They are low risk, but avoid specific battery-life numbers.
- Usable wording (TH): "พาวเวอร์แบงก์คือชีวิต เปิดโหมดประหยัดแบต เปิดเครื่องเฉพาะตอนจำเป็น" / "ถอดปลั๊กเครื่องใช้ไฟฟ้าไว้ กันไฟกระชากตอนไฟกลับมา" (the last line fits a hopeful-ending beat)

## 4. Supported story angles (for Preaw, not prescriptive)

1. **Hook candidate:** the tap still runs after the lights go out, but that is the last of the water in the roof tank (ZC-C02). The story question is how long it lasts, and the action is to fill everything now (ZC-C03).
2. **Reveal-style payoff:** the cleanest drinking water left in the unit is behind the toilet, in the cistern and not the bowl (ZC-C05, ZC-C21). Strong, true and surprising; keep the "clear, no cleaner" condition.
3. **Clock device:** the fridge gives you 4 hours and the full freezer 2 days, so the menu is decided by physics (ZC-C10). This gives a natural beat order: fridge → freezer → cans.
4. **Danger twist:** the thing most likely to kill you is not the zombie but the camp stove in a sealed room (ZC-C13). It works as a counter-intuitive tip and keeps viewers from copying a dangerous act.
5. **Balcony beat:** pure fiction and visuals. It can double as the place for sealed waste bags, away from food and water (ZC-C09, inference).
6. **Comment prompt:** an open question such as "อะไรคือของชิ้นแรกที่คุณจะรองน้ำใส่?" invites survival answers without needing claims.

## 5. Open questions and gaps

| ID | Gap | Impact | Suggested handling |
| --- | --- | --- | --- |
| `GAP01` | No Thai engineering or MWA source on condo water systems; no data on whether Thai condo generators power domestic water pumps | Medium: the water hook rests on a general mechanism | Keep the wording to "หลายตึก" / "ถ้าไฟดับ"; give no duration |
| `GAP02` | USDA FSIS live page not inspected (403); hold times come from Ready.gov, which derives them from USDA | Low: figures are consistent | Use "ราว/ประมาณ"; recheck at fact-check if access returns |
| `GAP03` | Sphere/WHO litre figures lead-only | Low | Use the Ready.gov gallon (ZC-C04) instead |
| `GAP04` | Thai unit-door swing direction and กฎกระทรวง 33 text not inspected | Low: avoid stating a code | Don't narrate the door rule |
| `GAP05` | No Thai agency guidance on indoor butane stoves inspected | Medium if cooking is shown | Follow CDC (strictest); pivot to no-cook food |
| `GAP06` | Mosquito 7-day cycle from secondary and older sources | Low | Say "cover the water" without numbers |
| `GAP07` | Instant versus tank water heaters in Thai condos is an observation, not data | Low | Drop the water-heater tip for the TH/EN condo setting |
| `GAP08` | EN version: an imperial-first audience may expect "a gallon"; the TH version uses "≈4 ลิตร" | Wording only | The EN script can say "a gallon, about four litres" |

**Research readiness:** every premise-critical tip has inspected evidence with its limitations recorded, or is visibly flagged as unresolved (water timing, Thai-specific building design, door rules). The packet is ready for Preaw to write. This does not establish a factual review of any script wording; Boat's exact-revision fact-check of `short/script.md` (TH and EN, separately) is still required.
