# EG-SCRIPT-R1.2 (L16 cut 2026-11-03; R1.1 fact-check fixes applied, recheck pending) — "ประตูที่ไม่เปิดให้คุณ"

- Owner / date: Preaw, 2026-11-03 (Asia/Bangkok). First revision.
- Deliverable / episode: `EG-EP01-SHORT` / `EG01`; Short only, 1080×1920, 30 fps. [Delivery record](../delivery.md). Task file: [task.md](../task.md) (stage W1.2).
- Inputs: concept [C1](../concepts.md#c1--ประตูที่ไม่เปิดให้คุณ) (R1, picked by user 2026-11-03); [research.md](../research.md) (Boat W1.1, 2026-11-03, checkout `ff7dcfa`; claims F001–F108, sensor sources weak / lead-only); coordinator script rules in the delivery handoff log (2026-11-03).
- Story mode: **`fiction-with-factual-knowledge`** (labelled default for an open fictional brief). Everything that happens to "คุณ" is fiction; only the sensor explanation in S03 is presented as fact.
- Profile / tier: mystery-educational, painted 2D (p5.brush) WORLD FOG look + SVG sensor insert; project defaults for the rest / Full pipeline.
- Narration: second person `คุณ`, one narrator (NARR). No dialogue.
- Ending: **user override 2026-11-03: no loop, the video ends on `คนที่หายไป… คือคุณ` (L20b); L21 removed.** The seamless-loop proposal below is superseded; Film chooses the closing frame (hold or fade) and records it. No `ข้อมูลจริง` tag on the sensor card (user, 2026-11-03).
- Target / timing: about 50 s of speech, **about 55–57 s total, `estimated`** (syllable count about 235 at about 4.8 syllables/s plus written pauses and two SFX gaps). Not read aloud or audio-tested. R1.2: L16 cut (about 2.3 s of speech by the R1 estimate); the locked narration already omits it, so timing now comes from the Editor voice lock, not this estimate. Within the Short range 40–60 s; `B_loop` would add a 3 s hold (about 59–60 s, at the top of the range).
- Factual status: **not fact-checked**; next is Boat W1.3. Sensor wording is deliberately general because the research sources are weak (research.md open item 1).
- User approval: none yet (W1.4). Readiness here is not approval.

## Story core

**Logline:** You wake at seven in a Bangkok with no one in it, yet the trains run and the rice pot still steams. A convenience-store door opens for nobody and stays shut for you, and how its sensor works tells you who really vanished.

**Central question (hook):** Where did everyone go? It turns into: why won't the door open for me?

**Intention / obstacle:** You want to find people / an explanation. The obstacle: the world keeps behaving as if people are there (BTS running, food warm, a door opening by itself), and the one test you can run, the automatic door, ignores you.

**Feeling:** quiet unease (silence you can hear) → curiosity (signs of life) → frustration and a chill at the door → calm "oh, that's how it works" in the sensor beat → cold, still realisation → a soft, endless loop.

**Knowledge takeaway (fact):** Many automatic doors have a sensor that keeps sending out microwaves; when something moves, the reflected wave comes back at a slightly different frequency The door is not looking for people; it is waiting for **something that moves**.

**Plot function of the knowledge:** it is the key to the twist. If the door reacts to anything that moves, then a door that stays still while you wave and jump means that, for it, nothing is there. And a door that opens "for nobody" means something did move past you. Remove the knowledge beat and the twist has no logic.

## Truth and ending

- **What actually happens (fiction):** You have died or otherwise left the world in the night; the story never says how. Bangkok is full and normal. You cannot see or hear people; they cannot see you; objects that react to people (the door) do not react to you. Each morning you wake at seven and live the same empty morning again.
- **The twist:** `ทุกคนไม่ได้หายไปไหน… คนที่หายไป คือคุณ`. The planted door at S01-B02 opened for a real person you could not see; the door at S02-B01 stays still because, to it, there is nothing in front of it.
- **Verified facts used:** radar/microwave door sensors detect motion through a change in the reflected wave (F001, medium confidence, weak sources); radar detects motion, not people as such (F002 general principle). BTS runs at 07:00 (F102), implied only, no minute or headway spoken.
- **Remaining uncertainty:** sensor sources are lead-only or low-trust; the siren analogy (old L16) was cut in R1.2, so no Doppler-for-sound claim is spoken. The boundary that a real working radar door **would** open for a waving, jumping person (research.md section 1 point 4, boundary item 5) is respected: the narration scopes the refusal to `ประตูบานนี้` inside the fiction and never says a real sensor can ignore a moving person.

## Scene and beat progression

Story-world time: one morning, about 07:00 to a few minutes later, then "tomorrow morning". Video time below is estimated.

| Beat ID | Purpose | Causal link / what changes | Est. video time |
| --- | --- | --- | --- |
| `EG01-S01-B01` | Hook: anomaly (silent Bangkok at 7) | Sets the question: where is everyone? | 0–4 s |
| `EG01-S01-B02` | Context + first clue: no one seen, empty BTS, the shop door opens by itself | You explain the door away as a fault (misdirection) | 4–13 s |
| `EG01-S01-B03` | Signs of "just now": steaming pot, unmelted ice | Hypothesis: everyone vanished moments ago; you go to the shop to test | 13–20 s |
| `EG01-S02-B01` | Test: the same door ignores you, the reflection shows only the street, then the door opens and chimes for no one you can see | Hypothesis breaks: the door works, just not for you | 20–31 s |
| `EG01-S03-B01` | Knowledge: how the sensor detects movement | Gives the rule to re-read S01-B02 and S02-B01 | 31–42 s |
| `EG01-S04-B01` | Apply rule + twist + loop line | Door is not broken; someone walked past you; you are the one who vanished; the morning repeats | 42–56 s |

## Full spoken script and required story events

**Only the Thai lines labelled NARR are spoken.** English text is production direction. Captions follow the spoken Thai verbatim (no shortened cues in R1); `…` marks a spoken pause and is shown in captions as written. Line IDs `L01`–`L21` (with `L20a`/`L20b`) are stable; `L16` was removed in R1.2 and its ID is not reused.

**Voice (NARR):** one narrator for the whole video. Project default Gemini TTS narrator (Sulafat or Orus per [project defaults](../../../docs/delivery-workflow.md#project-defaults); Editor and user choose at W4 voice lock). Base style for every line: `calm, close, quietly curious second-person storytelling, soft and intimate, unhurried but not slow`. Per-line cues below adjust it. Tags are Gemini TTS markup suggestions (`<short pause>`, `<long pause>`, `<whispering>`); Editor adapts them to the [gemini-tts skill](../../../.agents/skills/gemini-tts/SKILL.md).

### EG01-S01-B01 — Hook, 0–4 s estimated

**Event:** Frame 0: empty Sukhumvit soi, morning daylight, eye level. Across the street a generic convenience store with a closed glass sliding door (no logo, no livery). You (the protagonist) are in frame or the shot is your POV. No people, no traffic. This frame is also the seam target for `C_seamless`.

| Line | Fact / fiction | NARR (spoken) | Emotion cue |
| --- | --- | --- | --- |
| `L01` | fiction | คุณตื่นมาเจ็ดโมงเช้า… | soft, close, a little sleepy; `<short pause>` after |
| `L02` | fiction | กรุงเทพฯ เงียบ… จนได้ยินเสียงตู้เย็น | hushed, slight wonder; tiny pause after `เงียบ`; land `ตู้เย็น` quietly |

### EG01-S01-B02 — Nobody, the train, the door, 4–13 s estimated

**Event:** You walk the soi. A BTS train crosses the viaduct overhead on time; its windows show no passengers. Then, across the street, the convenience-store door slides open by itself with a soft entry chime, holds, closes. Nobody visible at it (CL01). Same vantage on the door as S02-B01 (mirror, per Film annotation).

| Line | Fact / fiction | NARR (spoken) | Emotion cue |
| --- | --- | --- | --- |
| `L03` | fiction | คุณไม่เห็นใครเลยสักคน | plain, a touch of unease |
| `L04` | fiction (BTS at 07:00 = F102, implied) | รถไฟฟ้ายังวิ่งผ่านตามปกติ… แต่ในขบวน คุณมองไม่เห็นใครเลย | matter-of-fact, then quieter on `ว่างเปล่า`; `<short pause>` after `ตามปกติ` |
| — | SFX gap | (door slides open across the street, soft chime; about 0.6 s, no speech) | — |
| `L05` | fiction | ฝั่งตรงข้าม ประตูร้านสะดวกซื้อ เปิดเอง… | noticing, mildly puzzled |
| `L06` | fiction (character's guess, not a claim) | เซนเซอร์คงรวน | light, dismissive shrug, almost a mutter |

### EG01-S01-B03 — Just now, 13–20 s estimated

**Event:** A street stall at the soi corner: a rice-porridge pot with steam rising, stools pushed back. A table with a glass of iced coffee, ice cubes still whole (CL03). Hold each object briefly; no people.

| Line | Fact / fiction | NARR (spoken) | Emotion cue |
| --- | --- | --- | --- |
| `L07` | fiction | หม้อข้าวต้มริมทาง ยังมีไอร้อน | observant, slow |
| `L08` | fiction | กาแฟเย็นบนโต๊ะ น้ำแข็งยังไม่ละลาย | observant, growing unease |
| `L09` | fiction (misdirection, hedged by `เหมือน`) | เหมือนทุกคน… เพิ่งหายไปเมื่อกี้นี้เอง | half-whisper, unsettled; `<short pause>` after `ทุกคน`, `<long pause>` after the line |

### EG01-S02-B01 — The door test, 20–31 s estimated

**Event:** You cross to the same store. Same fixed vantage as S01-B02. You stand in front of the closed door. You wave; you jump. The door stays shut. Close on the glass: it reflects the empty street behind you, and **not you** (CL04; must read on rewatch, not shout on first watch). Then the door slides open by itself, the chime sounds dry and close, it holds, and it closes again. You did not move toward it in that moment (CL05).

| Line | Fact / fiction | NARR (spoken) | Emotion cue |
| --- | --- | --- | --- |
| `L10` | fiction | คุณข้ามไปที่ร้านนั้น | steady, purposeful |
| `L11` | fiction | คุณโบกมือ… กระโดด… ประตูก็ยังนิ่ง | rising frustration on `โบกมือ… กระโดด…`, flat on `ยังนิ่ง`; `<short pause>` at each `…` |
| `L12` | fiction | กระจกสะท้อนแค่ถนนว่างๆ | quiet, almost absent-minded (do not stress it) |
| — | SFX gap | (door slides open, chime dry and close; about 0.8 s, no speech) | — |
| `L13` | fiction | แล้วจู่ๆ มันก็เปิด… ทั้งที่คุณไม่เห็นใครเลย | startled breath on `จู่ๆ`, then low and cold; `<short pause>` after `เปิด` |

### EG01-S03-B01 — How the door sees, 31–42 s estimated

**Event:** Crisp SVG insert (diagram card): a sensor box above a door sends out waves; a plain shape (not a person) moves into the field and the returning waves bunch up / change spacing; a still field returns unchanged waves. No siren icon (L16 cut in R1.2). No numbers on screen (no GHz, no speed threshold). Return to the painted door at the end of L17.

| Line | Fact / fiction | NARR (spoken) | Emotion cue |
| --- | --- | --- | --- |
| `L14` | **fact** (F001) | ประตูอัตโนมัติหลายบาน มีเซนเซอร์ที่คอยส่งคลื่นไมโครเวฟออกมา | calm, clear, explanatory; warmer than the story lines |
| `L15` | **fact** (F001) | ถ้ามีอะไรขยับ คลื่นที่สะท้อนกลับจะเปลี่ยนความถี่ | clear, slight emphasis on `ขยับ` and `เปลี่ยนความถี่` |
| `L17` | **fact** (F002 general principle) | ประตูแบบนี้ไม่ได้มองหาคน… มันรอแค่สิ่งที่ขยับ | slower, deliberate, the key line; `<short pause>` after `คน` |

### EG01-S04-B01 — The twist and the loop, 42–56 s estimated

**Event:** Back to the fixed door vantage. Replay or echo of the S01-B02 door opening, now read as someone passing (do not show the person; at most a faint disturbance of air or the door's own motion). Then you, alone in front of the glass that does not reflect you. On `คือคุณ`: cut to near silence and hold. On L20, the camera settles back toward the frame-0 composition (empty soi, closed door) so the seam lands on frame 0.

| Line | Fact / fiction | NARR (spoken) | Emotion cue |
| --- | --- | --- | --- |
| `L18` | fiction (scoped to `ประตูบานนี้`) | แต่สำหรับประตูบานนี้… ตรงหน้ามันไม่มีอะไรขยับเลย | even, quiet, cooling; `<short pause>` after `บานนี้` |
| `L19` | fiction | มันไม่ได้เสีย… มันแค่เปิดให้ใครบางคน ที่เดินผ่านคุณไป | slow, low, a chill on `เดินผ่านคุณไป`; `<short pause>` after `เสีย` |
| `L20a` | fiction | ทุกคนไม่ได้หายไปไหน… | very still, almost tender; `<long pause>` after |
| `L20b` | fiction | คนที่หายไป… คือคุณ | quietest line, close to a whisper, no drama; `<short pause>` after `หายไป`; then about 1.2 s silence |

(`L20a`/`L20b` keep one ID family because they are one sentence split by a pause.)

## Ending proposal

- **Selected: `C_seamless`.** The last line and the hook are written as a pair: `…แล้วพรุ่งนี้เช้า… คุณก็จะตื่นมาอีก` → `คุณตื่นมาเจ็ดโมงเช้า…`. The repeated `ตื่นมา` is deliberate: the opening becomes the "tomorrow" the last line promised, so the restart plays as the trap repeating, not as the video restarting. This is the [loop-friendly](../../../docs/scriptwriting-principles.md#loop-friendly-writing) case "the ending is the cause the opening shows".
- **Why over `B_loop`:** (1) the reveal lands before the seam, and the 1.2 s silence after `คือคุณ` gives the twist its absorbing beat inside the script, so the 3 s hold is not needed; (2) the story is itself a loop, so a seamless restart carries meaning; (3) it keeps the estimate at about 55–57 s instead of about 59–60 s; (4) a rewatch immediately re-shows the S01-B02 door, which is the clue the twist re-reads.
- **Constraints for Film/Editor:** the last visual state must return to the frame-0 composition (empty soi, closed door, same vantage); no goodbye or call to action; keep the final about 0.5 s free of speech. Frame 0 must not show anything that contradicts "you just woke up" if the loop picks up there (Film decides whether frame 0 is the soi or a waking beat; the seam then needs that same state at the end).
- **`B_loop` fallback:** same wording works standalone (L21 is a complete sentence). Use it if Film cannot make the last state match frame 0.
- `A_fade`: not proposed.

## Clue ledger

All clues are **fictional story construction**, not real evidence. None claims that a door's behaviour proves anything about a real person.

| ID | Plant (beat / line) | Observable information | Initial reading | Post-reveal reading | Payoff |
| --- | --- | --- | --- | --- | --- |
| `CL01` | S01-B02 / L05–L06 | The shop door opens by itself with a chime; nobody visible | Sensor fault (`เซนเซอร์คงรวน`) | Someone you cannot see walked in | S04-B01 / L19 `มันไม่ได้เสีย… มันแค่เปิดให้ใครบางคน` |
| `CL02` | S01-B02 / L04 | BTS runs on time, carriages look empty | The city emptied but machines keep going | The train is full; you cannot see the passengers | S04-B01 / L20a `ทุกคนไม่ได้หายไปไหน` |
| `CL03` | S01-B03 / L07–L09 | Steam from the pot, ice not melted | Everyone vanished moments ago | They never left; they are right here | L20a; L09's hedge `เหมือน` keeps the narrator honest |
| `CL04` | S02-B01 / L12 + visual | The glass reflects only the empty street, not you | The street is empty (stated flatly) | You are not in the reflection: you are not "there" | L20b `คือคุณ`; rewatch clue (visual must hold it, quietly) |
| `CL05` | S02-B01 / L13 | Door opens while you stand still; `ทั้งที่คุณไม่เห็นใครเลย` | Ghostly / broken door | Someone moved through its field, next to you | L17 rule + L19 |
| `CL06` | S01-B01 / L02 + sound | You hear the fridge hum but no voices, no traffic | A silent, empty city | You hear machines, not people: you are on the other side | Rewatch atmosphere; sound only reinforces, never carries the clue alone (L02 states it) |

**Narrator fairness:** every "nobody" line is phrased as your perception (`คุณไม่เห็นใคร`, `เหมือน…`, `กระจกสะท้อนแค่…`), so the narrator never states a falsehood the twist later contradicts.

## Fact versus fiction

| Lines | Classification | Note |
| --- | --- | --- |
| L01–L13, L18–L21 | **fiction** | Whole premise (research.md section 3, items 1–8). The empty-looking train, warm food, a door ignoring a moving person, the chime for nobody and the daily restart are story logic only. |
| L04 (BTS running at 07:00) | fiction scene resting on a fact | F102 implied; no minute, first-train time or headway spoken. |
| L06 `เซนเซอร์คงรวน` | character's guess | Not a claim that sensors glitch in this way. |
| L14, L15, L17 | **fact** | F001, F002 (general principle). Hedged: `หลายบาน` (not all doors), `สิ่งที่ขยับ` (never `คน`/`ร่างกาย`). |
| L16 | **removed (R1.2)** | Siren/Doppler-for-sound analogy cut by user 2026-11-03; no longer spoken or shown. |
| Not stated anywhere | — | Pressure mats (F005), PIR / active IR (F003/F004), any frequency or speed number, chain brand, that a door opens only for people, that a real sensor can ignore a moving person. |

## Claim mapping

Sources per research.md; all sensor sources are weak (SRC003 inspected low-trust; SRC001/SRC002/SRC004 lead-only). **Flagged for Boat W1.3.**

| Location / exact wording | Claim | Source | Hedge applied | Boat check |
| --- | --- | --- | --- | --- |
| L14 `ประตูอัตโนมัติหลายบาน มีเซนเซอร์ที่คอยส่งคลื่นไมโครเวฟออกมา` | F001 (microwave/radar sensor, continuous emission) | SRC003 (inspected, weak); SRC001 (lead) | `หลายบาน`, no band numbers | checked R1.2 (no "ตลอด" since R1.1); does "หลายบาน" overstate prevalence |
| L15 `ถ้ามีอะไรขยับ คลื่นที่สะท้อนกลับจะเปลี่ยนความถี่` | F001 (Doppler shift on reflection from a moving object) | SRC003; SRC001 (lead, "Doppler Effect Principle") | `อะไร` = anything, not a person | needed |
| ~~L16~~ (removed R1.2) | — (claim withdrawn; analogy cut) | — | — | none; L15 now leads straight into L17 |
| L17 `ประตูไม่ได้มองหาคน… มันรอแค่สิ่งที่ขยับ` | F002 (radar detects motion, not a body; cannot tell a person from other moving things) | SRC001 (lead), SRC003 | uses `สิ่งที่ขยับ` per coordinator rule; no speed threshold | needed: confirm the general principle wording |
| L18 `แต่สำหรับประตูบานนี้… ตรงหน้ามันไม่มีอะไรขยับเลย` | — (fiction logic) | — | scoped to `ประตูบานนี้` so it is not read as real sensor behaviour (boundary item 5) | check presentation does not mislead |
| L04 `รถไฟฟ้ายังวิ่งผ่านตามปกติ` | F102 (BTS in service at 07:00) | SRC005 | no minute, no headway | check |
| S03 SVG labels (proposed, see visual notes) | F001/F002 | as above | no numbers, no person icon | check the drawn knowledge too |

## Sound intent (English notes; narration unchanged, sound never replaces a clue)

Library checked 2026-11-03 (`~/ReelsStore/library/sound/INDEX.md`): possible candidates `reveal_riser-tension_01` (S03→S04 rise, stops dead), `foley_glass-door-push_01` (manual sliding door; may not suit an automatic door's motor glide), `tension_heartbeat-slow_01` (optional under S02). No automatic-door glide, generic entry chime, fridge hum, BTS pass-by or morning city tone found; those are new requests for Editor (generated or licensed, labelled reconstructed per research F104/F106/F107).

| Beat | Music mood / energy | Ambience / silence | Stinger / effect |
| --- | --- | --- | --- |
| S01-B01 | No music, or a single very soft sustained pad, energy 1/10 | Near silence; a close fridge/compressor hum is the loudest thing; faint birds | none; the hum is the hook's sound |
| S01-B02 | Soft, sparse, curious (single piano or mallet notes), energy 2/10 | Distant BTS rails pass overhead (steel viaduct hum, no announcements); soi room tone | Door glide + **soft, distant entry chime** (stinger 1, gentle, slightly reverberant) |
| S01-B03 | Same motif, slightly lower and slower, energy 2/10 | Pot steam hiss, ice settle tick in the glass; still no human sound | none; drop music to almost nothing after L09 for the pause |
| S02-B01 | Tension thins out; optional slow heartbeat low in the mix, energy 3/10 | Closer storefront hum; your own footsteps and a scuff on the jump (you can hear yourself) | Door glide + **dry, close entry chime** (stinger 2, louder and drier than stinger 1, same sound so they mirror) |
| S03-B01 | Clean, light, clear tone (soft pulse/arp), energy 3–4/10; a low drone starts under the end of L15 and rises through L17 (R1.2: L16 cut) | Ambience ducked under the diagram | Subtle soft sweep or tick on each wave animation; drone rise (candidate `reveal_riser-tension_01`) |
| S04-B01 | Drone holds under L18–L19, then **cuts to silence on `คือคุณ`** (about 1.2 s true quiet); L21 over a very soft return of the S01 pad | Fridge hum returns faintly with L21 so the seam into S01-B01 is continuous | Optional faint echo of chime 1 under L19 (the earlier door, re-heard as someone passing); no stinger on the reveal itself |

**Seam:** the audio under the last about 0.5 s must match frame 0's ambience (fridge hum, no music hit) so `C_seamless` does not click. **Chime:** a generic two-tone entry chime, not a copy of any chain's recognisable chime (brand rule, F107/F108).

## Visual handoff notes (for Film)

- **Must be seen:** empty soi and BTS (S01-B02); the store door opening by itself (S01-B02) from the same vantage used in S02-B01 and S04-B01; steaming pot and iced coffee with whole ice (S01-B03); waving and jumping at a still door (S02-B01); glass reflection without you (S02-B01, quiet); the door opening while you stand still (S02-B01); the SVG sensor card (S03-B01).
- **Must stay hidden until S04-B01:** any visible person, silhouette or ghost; any sign that you are dead (no body, no accident, no injury, no text). The reflection clue must not be framed as a reveal on first watch.
- **SVG card (proposed labels, audience-facing Thai):** `เซนเซอร์`, `คลื่นไมโครเวฟ`, `สะท้อนกลับ`, `ขยับ → คลื่นที่สะท้อนกลับเปลี่ยนความถี่`. The moving object is a neutral shape, **not a person** (claim is `สิ่งที่ขยับ`). Radar only: no pressure mat, no IR beam, no numbers.
- **Brand:** generic convenience store, no logo, livery or chain colours; never say or show a chain name.
- **Protagonist:** "คุณ" is the viewer; Film chooses POV vs. back/over-shoulder framing and casts from the kit (casting line at brief). Keep the face neutral or unseen so viewers can project.
- **Seam:** last frame state = frame 0 (see ending).
- **Captions:** verbatim; place in the caption-safe box (portrait `position: 'middle'` rule); stage the door and the reflection above or beside the band.

## Editorial self-check, change log and open items

**Self-check (Preaw):** hook in the first line with the anomaly in the opening caption from frame 0 (`กรุงเทพฯ เงียบ` is spoken at about 1.6–2.5 s; the full line is captioned from frame 0); causal chain: clue (door) → explained away → more signs → test at the same door → rule → re-read → twist; knowledge is the twist's key; every clue is planted before the reveal and has two readings; the narrator never lies; loop line paired with hook.

**Change log:**
- R1 (2026-11-03): first script from C1. Changes from the concept: brand name removed (`ร้านสะดวกซื้อ`); takeaway narrowed to radar/Doppler and `สิ่งที่ขยับ` (concept's "if it opens, something with a body is there" dropped per research F002 note); the S01-B02 door and the test door are the same store; added the reflection clue (CL04) and the siren analogy (L16); ending moved from `B_loop` to `C_seamless`; loop line shortened to `แล้วพรุ่งนี้เช้า… คุณก็จะตื่นมาอีก` (concept's `เจ็ดโมงเช้า` repeat removed to avoid a double "เจ็ดโมงเช้า" at the seam). Iced coffee uses "ice not melted" instead of condensation (research boundary item 3).

**Boat recheck scope (W1.3):** L14, L15, L16 (new), L17, L04; the S03 SVG labels; presentation of L18 against boundary item 5; that no line implies a door proves someone's existence.

**Open questions:**
1. Boat: is `หลายบาน … ส่งคลื่นไมโครเวฟออกมาตลอด` acceptable on weak sources, or should L14 soften further (e.g. `ประตูอัตโนมัติหลายบาน ใช้เซนเซอร์คลื่นไมโครเวฟ`)?
2. Boat: source for the siren analogy (L16), or cut it (saves about 2.3 s).
3. Coordinator/user: on-screen marker. R1 proposes none for the obviously fictional story; optionally a small `ข้อมูลจริง` tag on the S03 card to separate the fact beat. Decide at W1.4.
4. Coordinator/user: confirm `C_seamless` (or `B_loop` fallback) at script approval.
5. Timing: estimate only; Editor's narration read at W4 decides whether L16 or L12 needs trimming to stay under 60 s.

- R1.1 (2026-11-03, coordinator inline): Boat fact-check fixes applied (L04, L14, L16, L17, SVG label 4). User approval: script approved with no loop, ending on L20b, L21 removed; no fact tag. Speech is about 3 s shorter than estimated.
- R1.2 (2026-11-03, Preaw): **L16 removed** (user decision via structured question; locked narration already omits it). No other line rewritten, no renumbering; L15 now runs straight into L17. Follow-ups: takeaway, uncertainty, S03 event (no siren icon), fact/claim tables and the S03 drone start (now under the end of L15) updated; open items 2 and 5 resolved by the cut. Boat recheck: L14–L15 wording unchanged; only their neighbour changed (L15 → L17 directly).
