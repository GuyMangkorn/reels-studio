# EDU-EP05-SHORT — research packet (W1.1, Boat)

- Deliverable: `EDU-EP05-SHORT` (Short, Thai, "what if" scale physics, concept C6 "ถ้าคุณตัวเล็กเท่ามด", `concepts.md`). Research date: 2026-11-06.
- Central question: what changes when a body shrinks to ant size and keeps the same world? Takeaway: gravity is unchanged; area-dominated effects (air drag, surface tension, heat and water loss, muscle cross-section) outgrow volume-dominated ones (weight).
- Tooling limits: web search and page fetch through summarizing tools only; no page read as raw text. Only the Wikipedia "On Being the Right Size" page was fetched (and it lacked the falling passage). Everything else is `lead-only` (search excerpts). Quantities marked `calc` are Boat's own order-of-magnitude arithmetic, not published figures; Preaw must keep them hedged ("ราว", "ประมาณ").
- Working definition (assumption `A1`): "ant size" = body length about 5 mm, a proportionally shrunk human (4-head cartoon cast included), human tissue density, mass about 1.7 mg (70 kg x (5 mm / 1.7 m)^3). Real ants: roughly 1–10 mg, 2–15 mm depending on species. State the hedge "ประมาณ 5 มิลลิเมตร" if any number is spoken.

## Source registry

| ID | Source | Status | Limits |
| --- | --- | --- | --- |
| SRC001 | Haldane JBS, "On Being the Right Size". Harper's Magazine, Mar 1926, pp. 424–427 (Wikipedia, fetched); text collected 1928 (Possible Worlds). Copies: https://www.marxists.org/archive/haldane/works/1920s/right-size.htm ; https://www.cs.utexas.edu/~witchel/S25-380L/papers/right-size.html | `lead-only` (Wikipedia page inspected for publication data; essay text only via search excerpts) | Date conflict 1926 vs 1928: cite 1926 first publication. Quoted line from excerpts: "You can drop a mouse down a thousand-yard mine shaft; and, on arriving at the bottom, it gets a slight shock and walks away. A rat is killed, a man is broken, a horse splashes." Do not attribute "Nobody has ever dropped a horse…" (ScienceABC only, absent from other copies). Also states insects have no oxygen-carrying bloodstream (Wikipedia summary). Haldane's water-drop passage not opened. |
| SRC002 | Globe and Mail column "Why don't ants die when falling…" https://www.theglobeandmail.com/technology/ants-slow-fall-key-to-survival/article4275684 | `lead-only` (search excerpt) | Popular. Ant terminal velocity about 6.4 km/h (about 1.8 m/s), attributed to a University of Illinois physics department; attribution not checked. No controlled drop experiments on ants found. |
| SRC003 | Ohio State senior-thesis summary, "Ants Can Lift Up to 5,000 Times Their Own Body Weight" https://desis.osu.edu/seniorthesis/?p=15529 ; McGill hyperbook https://www.mcgill.ca/bioengineering-hyperbook/node/53 | `lead-only` | Neck-joint result (Journal of Biomechanics, 2014; authors and numbers not verified): immobilised ants spun in a centrifuge, neck tolerated up to about 5,000x body weight. A joint-strength rig test, not carrying capacity. "10 to 50 times" carrying is in popular sites only; no primary behavioral paper opened. |
| SRC004 | Etruscan shrew pages (Wikipedia mirror, PMC8786385 genome paper, sci.news) https://pmc.ncbi.nlm.nih.gov/articles/PMC8786385 | `lead-only` | Mass 1.2–2.7 g, eats about 1.5–2x body mass per day, cannot go more than a few hours without food, enters torpor (about 12 °C) in cold or hunger. One lineage of encyclopedia-style copies. |
| SRC005 | Surface tension and insects: arXiv 1405.2298; PMC4811005; Ask an Entomologist https://askentomologists.com/2016/03/24/do-insects-get-trapped-in-water-drops-why-arent-they-constantly-drowning/ ; Eötvös number (Wikipedia) | `lead-only` | Bond number compares gravity to surface tension; below 1 surface tension dominates. Insects can be held up (water striders), pulled down or trapped by water; hairs and wax reduce contact. Water-lily beetle Bond number about 0.2 (one study). The "ant stuck in a dew drop" case is from a Q&A site, not a paper. |
| SRC006 | Land MF, "Visual acuity in insects", Annu Rev Entomol 1997 (excerpt via search); ant vision forum posts | `lead-only` | Compound-eye resolution limited by diffraction; ant eyes mostly detect movement, with exceptions (Myrmecia bulldog ants see well). Forum posts are weak. |
| SRC007 | Hummingbird torpor / small-endotherm scaling | `unsearched` | Search returned no hummingbird material. Use only as general knowledge hedge; Boat did not verify. |

## Calculations (all `calc`, assumption A1)

- Terminal speed scaling: v = sqrt(2mg / (rho_air Cd A)); at fixed density and shape m ~ L^3, A ~ L^2, so v ~ sqrt(L). Human belly-down terminal speed about 55 m/s (about 200 km/h; widely cited, not re-sourced here). Scale factor sqrt(5 mm / 1.7 m) = 0.054, so about 3 m/s (about 11 km/h). Reynolds number about 1,000, so the quadratic-drag formula is still a fair approximation. Order-of-magnitude: 2–5 m/s.
- Impact: 3 m/s equals a free fall of v²/2g about 0.46 m. Impact stress scales roughly with rho v² (independent of size), so it is like a human stepping off a ~45 cm step. Distance to reach terminal speed is about v²/2g plus drag effects, so under 1 m: after that height every extra storey adds no speed. Ten storeys (about 30 m) and a hundred storeys give the same landing speed.
- Heat: area / volume ~ 1/L, so the shrunk body has about 340x more skin per unit of body (1.7 m / 5 mm). Heat loss ~ area (more, since convective coefficient rises as size falls), heat production ~ mass (if human mass-specific rate kept). To stay at 37 °C the body would need on the order of hundreds of times the human mass-specific metabolic rate; the Etruscan shrew (1.2–2.7 g, eating about 1.5–2x body mass per day) is the real-world frontier and is about 1,000x heavier than a 1.7 mg body. No known endotherm is ant-sized (general knowledge, `hedge`).
- Strength: muscle force ~ cross-section ~ L², weight ~ L³, so force / weight ~ 1/L: 340x better ratio for a proportional shrink. A person who can lift roughly their own weight would geometrically lift several hundred times it; real ants carry 10–50x, so real-body limits (not just geometry) bind. Use as direction, not number.
- Surface tension: capillary length of water sqrt(gamma / rho g) = sqrt(0.072 / (1000 x 9.8)) about 2.7 mm. Bond number about (L / 2.7 mm)²: 5 mm body about 3.4; 1 mm about 0.14. Wetting force about gamma x contact perimeter = 0.072 N/m x 5 mm about 0.36 mN, versus body weight 1.7 mg x 9.8 about 17 microN: about 20x the body weight. Assumes fully wettable skin and a drop big enough to cover a limb; real ants are waxy and hairy, a human skin proportion would not be.
- Eye: diffraction angle about wavelength / pupil. Human pupil 3 mm gives about 0.0002 rad (about 0.01°). A pupil shrunk to 9 microns gives about 0.06 rad (about 3.5°): about 300x blurrier. Direction is solid physics; exact numbers `calc`.

## Claim ledger

| ID | Claim | Status | Basis and wording notes |
| --- | --- | --- | --- |
| C01 | Hook, as written: "ตกจากตึกสิบชั้น คุณจะไม่เป็นอะไรเลย" (shrunk to ant size, fall ten storeys, unharmed) | `hedge` (physics supports; wording needs a premise) | Supported if the body shrinks proportionally in mass: terminal speed about 3 m/s (SRC001 principle, SRC002 real ant about 1.8 m/s, `calc`). Premise needed: body keeps human density; if only size shrinks and mass stays 70 kg the claim is false. Safe numeric: "ตกจากตึกสิบชั้นก็แค่เหมือนก้าวลงจากขั้นบันได" (about 45 cm equivalent). "ไม่เป็นอะไรเลย" is acceptable as a hook but "ไม่เป็นอะไรเลย" on a hard floor still assumes no sharp object and no wind into a wall; add "แทบไม่เป็นอะไร" if the line needs safety margin. Hook keeps its shape at ten storeys: no smaller height needed. |
| C02 | Haldane: a mouse survives a thousand-yard mine shaft, a rat dies, a man breaks, a horse splashes | `verified-lead` | SRC001, quote from several copies. Quote only with attribution "เจ. บี. เอส. ฮาลเดน (1926)". A thousand yards is about 900 m; the mouse claim is rhetorical (mouse terminal speed about 8–10 m/s is lead memory only, not checked here). Hedge: "นักชีววิทยาชื่อ ฮาลเดน เขียนไว้ว่า…" |
| C03 | Falling is not slowed because the body is "light": the cause is area relative to weight | `verified-physics` | Gravity is the same for any size. Drag ~ area ~ L², weight ~ L³, so small things reach a low terminal speed and impact damage is small. Say "อากาศหน่วงตัวเล็กได้มากกว่าน้ำหนัก", not "แรงโน้มถ่วงน้อยลง" or "ตัวเบา". |
| C04 | A real ant's terminal velocity is about 6 km/h | `hedge` | SRC002 only (popular, attribution unchecked). Say "ราว ๆ 6 กม./ชม." or avoid the number. |
| C05 | Ants are never hurt by falls | `unsupported` | No controlled data. Say "ล้มหรือตกแล้วมักไม่เป็นอะไร". |
| C06 | At ant size water is a trap: a drop clings and holds you | `hedge` | Surface tension force about 20x body weight (`calc`, A1); Bond number below 1 means surface tension rules (SRC005). Real small insects are trapped by drops (Q&A source). Wording: "แรงตึงผิวน้ำแรงพอจะดึงตัวติดไว้", "อาจติดได้". Not "มันกลืนคุณ" or "จมน้ำเสมอ". Wettable skin is the premise; a waxy, hairy ant escapes more easily. |
| C07 | Dew drop as big as a boulder / "the skin of water is strong enough to trap you" | `hedge` | Real dew drops are about 1–3 mm, near the capillary length (2.7 mm): about a body length of the tiny character. "ใหญ่เท่าก้อนหิน" is dramatization; label as exaggerated visual if shown larger than the body. |
| C08 | Tiny bodies lose heat fast: surface area to volume rises as size falls | `verified-physics` | Area / volume ~ 1/L (about 340x for 1.7 m to 5 mm). Safe line: "ตัวยิ่งเล็ก ผิวยิ่งเยอะเมื่อเทียบกับตัว ความร้อนหนีเร็วขึ้นมาก". Real ants are cold-blooded (general knowledge), so they do not shiver to keep warm; the cartoon character does as a human. |
| C09 | The shrunk person would need to eat constantly | `hedge` | Direction supported by shrews (SRC004): Etruscan shrew eats about 1.5–2x its own mass per day and starves in hours. An ant-sized endotherm is beyond any real warm-blooded animal; the actual need is `calc` only. Wording: "ต้องกินแทบตลอดเวลา" at most; never state a crumb quantity as a fact. "Crumb bigger than their head" is a gag, label dramatization. |
| C10 | Shrews and hummingbirds are real small warm-blooded animals that eat very often | `hedge` | Shrew: SRC004. Hummingbird: SRC007 unsearched; torpor at night is widely known but Boat did not verify. If hummingbird is spoken, note it as unverified or drop it. |
| C11 | "Shiver in sunlight" | `hedge` | Small things also heat fast in direct sun (same area/volume rule) and dry out; both directions are true. Do not state sunlight makes you cold. Safe: "ในร่มเย็น ตัวเล็กหนาวเร็วมาก". |
| C12 | Ants carry 10–50x their body weight | `hedge` | SRC003: popular sites; no primary behavioral paper opened. Safe: "ราว ๆ 10 ถึง 50 เท่าของน้ำหนักตัว สำหรับบางชนิด" or "หลายสิบเท่า". Avoid "all ants". |
| C13 | Ants can bear 5,000x body weight | `hedge` | Neck joint in a lab centrifuge test (SRC003), not lifting. Do not conflate with C12. |
| C14 | Ants are strong because strength grows with cross-section and weight with volume | `verified-physics` | F/W ~ 1/L. Muscle tissue is not stronger; the scale advantage is geometric. Do not say "กล้ามเนื้อมดแข็งแรงกว่า". Small-body gains do not scale to humans in reverse: a human cannot lift 50x. |
| C15 | Shrunk to ant size, you would be about as strong relative to your weight as an ant | `unsupported` | Geometry only; real limits (joints, exoskeleton versus bone, oxygen supply) differ. Say "ตัวเล็กได้เปรียบเรื่องแรงเมื่อเทียบน้ำหนัก" without a multiple. |

## Extra checkable small-scale facts (hook or twist candidates)

| ID | Fact | Status | Notes |
| --- | --- | --- | --- |
| X01 | Vision: a human-style eye shrunk to 5 mm scale blurs the world (diffraction limit, about 300x worse resolution, `calc`) | `hedge` | Direction from SRC006: compound eyes are diffraction limited, ants see little detail. As a sting: "ตาเล็กเกินจะมองคมชัด โลกจะพร่าเหมือนฝ้า". Tension with the beautiful painted macro look: keep it narration-only or a short soft-focus beat, label as dramatization of the blur. |
| X02 | Breathing: insects use air tubes (tracheae) rather than blood-carried oxygen (Haldane, Wikipedia summary); a human lung and bloodstream are not designed for ant size | `hedge` | Only the insect side is supported (SRC001 via Wikipedia). "Human would suffocate" is `unsupported`. Safe: "แมลงหายใจต่างจากเรา" or skip. |
| X03 | Desiccation: tiny bodies lose water fast through skin (same area / volume rule), so a dew drop is a drink and a hazard | `hedge` | Physics direction only, no source opened. Safe as a one-line irony after C06 ("น้ำที่ติดตัวคือภัย แต่ขาดน้ำก็อันตรายกว่า") but treat as `hedge`. |
| X04 | Stickiness: small things cling (hairs, adhesion, capillary films) so "static cling" gags are physically grounded | `unsupported` (no source opened) | Plausible, not sourced. Use only as visual gag, not narrator fact. |
| X05 | Sound: very small animals hear and make sound by vibration of the ground or air, not like loud speech | `unsupported` | Not researched. Do not state it. |

## Myths to avoid and wording hedges for Preaw

1. "แรงโน้มถ่วงเบาลง / ตัวเบาเลยไม่เจ็บ" is wrong. Gravity is unchanged (C03). Say air drag beats weight.
2. "มดตกจากตึกไหนก็ไม่ตาย" (C05) and "ตกจากเครื่องบินไม่เป็นอะไร" are overclaims; ants in cold, wind or on a wet or sharp surface still die.
3. "มดแข็งแรงกว่าคน 50 เท่าเพราะกล้ามเนื้อดีกว่า" and the 5,000x neck figure as carrying capacity (C12–C14).
4. "คนตัวมดจะอุ่นสบายแบบมด" — ants are cold-blooded; the warm-blooded cartoon would chill (C08, C11).
5. "อากาศหนืดเหมือนน้ำผึ้ง" — the air feels thick only to much smaller (sub-millimetre) bodies; at 5 mm and 3 m/s Reynolds is about 1,000, so avoid.
6. A body shrunk without losing mass would be crushed by its own weight on contact; the survival claim needs proportional mass loss (C01 premise). If Preaw wants a safety line: "สมมติว่าตัวหดเล็กลงทั้งตัวและน้ำหนัก".
7. Haldane quote: cite as 1926 essay, do not add the "horse" line from ScienceABC; do not put "ลงเหมืองพันหลา" unless converted ("ราว 900 เมตร").
8. Say "ราว", "ประมาณ", "ถ้า" before every `calc` quantity (3 m/s, 340x, 20x). Prefer ratios in words ("หลายร้อยเท่า") over decimals.

## Impact on concept (flags, not rewrites)

- Premise: the hook survives at ten storeys; add the proportional-shrink premise somewhere in the script (C01).
- Beat 3: the "hand sticks like jelly" idea is supported in direction (C06); keep "อาจ" and drop "ตายเพราะน้ำ".
- Beat 4: "shiver in sunlight" and "eat a crumb bigger than head" are dramatized (C09, C11); label as gags or reword to "เย็นเร็วในร่ม".
- Beat 5 payoff: the ant carries a load easily: safe with C12 hedge; avoid the 5,000x number.
- Strongest hook alternative: none better than the current hook; X01 (blurred world) is the best twist but fights the planned beauty look; advise only as a spoken aside.

## Coverage and gaps

- Inspected: Wikipedia "On Being the Right Size" (publication data only). Everything else is search-excerpt level; no primary paper opened (Haldane text, Land 1997, the 2014 ant neck paper, any Bond-number or insect-drop paper).
- Open for fact-check revision: hummingbird/torpor, ant carrying primary study, dew drop size, human terminal speed citation, any sound/visual cue for the fall (e.g., a sharp thud would contradict C01).
- Qualitative confidence: high on scaling directions (C03, C08, C14), medium-low on the specific numbers (calc), low on the strength multiples and shrew/hummingbird figures.
