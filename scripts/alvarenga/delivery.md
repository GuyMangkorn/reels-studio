# ALVARENGA 438 DAYS delivery

- Deliverable: `ALV-EP01-SHORT`; selection: Short only, **40–45 s** (user's prompt 2026-11-02: "ภาษาไทย ยาว 40-45 วินาที"), 1080×1920, 30 fps.
- Scope (user, 2026-11-02): editorial stages only this pass — outputs `research.md`, `short/script.md` (scenes with times), `short/fact-check.md`. Downstream stages wait for the user.
- Pipeline: Full; this pass runs W1.1–W1.3.
- Factual claims: named real case (José Salvador Alvarenga, adrift Nov/Dec 2012 → Jan 2014, Mexico → Marshall Islands). Sources named by the user: book *438 Days* (Jonathan Franklin, 2015), The Guardian, BBC. Every number fact-checked.

## Style profile

| Field | Value |
| --- | --- |
| Genre / purpose | mystery-educational (`channel-default`), channel label `ทำไมล่ะ` |
| Visual medium | illustrated 2D, **"2D pastel cut-out"** (user's words); engine mapping is Film's call at the brief (painted 2D + SVG is the `default`; the user's look overrides palette/texture) |
| Voice | **Niwat TTS (Edge, male)** — user's choice in the prompt; sample still due before integration |
| Music / SFX | `default` — shared sound library, calm sea ambience, sparse SFX |
| Captions | outline (`default`) |
| Ending | closing question for comments (user); loop/fade form `default` `B_loop` — Film/Editor confirm |
| Factual claims | named real case |

## User constraints (2026-11-02)

- Hook within 2 s: "เขาออกไปตกปลาแค่วันเดียว… แต่กลับมาอีกทีคือ 14 เดือนต่อมา".
- Body: storm wrecks the engine; survives on turtles and birds, drinks turtle blood and urine; crewmate Ezequiel dies on the way.
- Twist: the crewmate's family sues him — told as an **allegation**, no verdict on guilt.
- End with a question inviting comments.
- Set: one sea + one boat reused for the whole story; no big waves, no fast-moving scenes.
- No visible corpse or explicit blood (monetization-safe).

| Deliverable | Stage / Next owner | Script / research / review | Brief / scene handoff | Evidence / open items |
| --- | --- | --- | --- | --- |
| ALV-EP01-SHORT | W1.3 clean: Recheck R1.1 `ready-for-storyboard` (medium confidence) → W1 script lock done (user approved `ALV-SCRIPT-R1.2`, main hook, 2026-11-02) → **Film** W2.1 brief when the user starts it | research `ALV-RESEARCH-R1`; review [short/fact-check.md](short/fact-check.md) `ALV-FACTCHECK-R1`; script [short/script.md](short/script.md) `ALV-SCRIPT-R1.1` (2026-11-02), timing `estimated` ≈ 45.0 s | — | Sources lead-only (fetch blocked); main hook "ไม่กี่วัน" vs. user's `ALT-HOOK-U` "วันเดียว" (needs-research); death timing omitted |

- 2026-11-02 user (AskUserQuestion): hook = main "ไม่กี่วัน… ได้ขึ้นฝั่งอีกที" (`ALT-HOOK-U` dropped). Script `ALV-SCRIPT-R1.2` approved (W1.4); R1.2 only replaces the S09 closing line with "ถ้าเป็นคุณ… จะทำยังไง" (user request, no comment call).
