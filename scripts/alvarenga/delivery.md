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
| ALV-EP01-SHORT | W1.3 clean: Recheck R1.1 `ready-for-storyboard` (medium confidence) → W1 script lock done (user approved `ALV-SCRIPT-R1.2`, main hook, 2026-11-02) → W2.1 Film brief done (`ALV-BRIEF-R1.1`, 2026-11-02) → W2.2 Film storyboard rows done (`ALV-SB-R1`, 2026-11-02, untimed, 16 shots) → **coordinator** W2.3 build and publish the page | research `ALV-RESEARCH-R1`; review [short/fact-check.md](short/fact-check.md) `ALV-FACTCHECK-R1`; script [short/script.md](short/script.md) `ALV-SCRIPT-R1.1` (2026-11-02), timing `estimated` ≈ 45.0 s | [short/visual-brief.md](short/visual-brief.md) `ALV-BRIEF-R1.1` on `ALV-SCRIPT-R1.2`, ready-for-storyboard; storyboard rows [short/review-rows.json](short/review-rows.json) + [short/index.md](short/index.md) `ALV-SB-R1` (draft, untimed); engine = painted 2D + SVG (`default`) with user's pastel cut-out finish; 3 look frames due (L1–L3) | Sources lead-only (fetch blocked); main hook "ไม่กี่วัน" vs. user's `ALT-HOOK-U` "วันเดียว" (needs-research); death timing omitted |

- 2026-11-02 user (AskUserQuestion): hook = main "ไม่กี่วัน… ได้ขึ้นฝั่งอีกที" (`ALT-HOOK-U` dropped). Script `ALV-SCRIPT-R1.2` approved (W1.4); R1.2 only replaces the S09 closing line with "ถ้าเป็นคุณ… จะทำยังไง" (user request, no comment call).
- 2026-11-02 storyboard review page published: https://claude.ai/artifact/24s4A8qF2xHEpssU6t1BeA · scene-sheet revision `ALV-SB-R1` (untimed first pass, 16 shots) · artifact version 1 · verdicts live in its `db` under `reviews/<shot ID>@<stage>` with `rev` · rebuild: `python3 -I scripts/storyboard-page/build.py scripts/alvarenga/short/review-rows.json`, republish `out/review-pages/ALV-EP01-SHORT/index.html` to the same URL with `capabilities {db:{}}`.
- 2026-11-02 user storyboard verdicts on `ALV-SB-R1` (review page v1): 12 shots ok; S03-SH02 ok with the suggestion "FPOV มุมมองตนอบู่บนเรือได้นะ" (not adopted, option kept); change: S04-SH01 "ทำเป็นเต่านก โดนตาก ตาเป็น X X ได้ การ์ตูนหน่อย"; S04-SH03 "มีสีแดงได้ หรือสีเหลืองได้ ไม่ใช่คลิปเด็กอยู่แล้ว" (red/yellow allowed on survival props; Film chose yellow-amber, blood unshown); S05-SH01 "ภาพกลางได้ นั่งแบบคนอิดโรยหมดแรง"; S05-SH02 "ค่อยซูมออกแล้วล้มลงก็ได้ แบบหมดแรง" (overrides the brief's prone-pose rejection; collapse hidden behind the gunwale). Film applied them as `ALV-SB-R2` + `ALV-BRIEF-R1.2` (2026-11-02). Boss flags: X-eyed dead turtle and seabird props, seated-collapse motion and hat drop, S05 plate padding for the zoom-out, `man-buzz-long` beard length (`HeadStyle` has none). Preaw note: script S04 visual line still says the turtle is alive (VO unchanged). Look frames L1–L3 (W3.1) painted in `src/painted/alvarenga/`, composition `ALV-LOOK`, stills in the asset store `projects/alvarenga/previews/look-frames/`; look lock (W3.2) and the page republish are pending.
- 2026-11-02 review page republished: https://claude.ai/artifact/24s4A8qF2xHEpssU6t1BeA · `ALV-SB-R2` + look frames L1–L3 · artifact version 2.
