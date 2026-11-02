# ONODA 29 YEARS delivery

- Deliverable: `ONO-EP01-SHORT`; selection: Short only, **40–45 s** (user's prompt 2026-11-02: "ภาษาไทย ยาว 40-45 วินาที"), 1080×1920, 30 fps.
- Scope (user, 2026-11-02): editorial stages only this pass — outputs `research.md`, `short/script.md` (scenes with times), `short/fact-check.md`. Downstream stages wait for the user.
- Pipeline: Full; this pass runs W1.1–W1.3.
- Factual claims: named real case (2nd Lt. Hiroo Onoda, Lubang Island, Philippines, Dec 1944/1945 → March 1974). Sources named by the user: autobiography *No Surrender: My Thirty-Year War* (Onoda, 1974; Eng. tr. 1974), NYT, BBC. Every number fact-checked.

## Style profile

| Field | Value |
| --- | --- |
| Genre / purpose | mystery-educational (`channel-default`), channel label `ทำไมล่ะ` |
| Visual medium | illustrated 2D, **"2D pastel cut-out"** (user's words); engine mapping is Film's call at the brief (painted 2D + SVG is the `default`; the user's look overrides palette/texture) |
| Voice | **Niwat TTS (Edge, male)** — user's choice in the prompt; sample still due before integration |
| Music / SFX | `default` — shared sound library, jungle ambience, sparse SFX |
| Captions | outline (`default`) |
| Ending | closing question for comments (user); loop/fade form `default` `B_loop` — Film/Editor confirm |
| Factual claims | named real case |

## User constraints (2026-11-02)

- Hook within 2 s: "สงครามจบไปแล้ว 29 ปี… แต่ทหารคนนี้ยังรบอยู่".
- Body: ordered never to surrender; believed leaflets saying the war was over were enemy tricks; fellow soldiers disappeared one by one.
- Twist: his former commanding officer (Yoshimi Taniguchi) had to fly in and personally rescind the orders before he came out.
- State that he caused villagers' deaths; do not portray him as a pure hero.
- End with a question inviting comments.
- Sets: jungle, small camp, leaflets; few sets. No clear fighting or shooting scenes.

| Deliverable | Stage / Next owner | Script / research / review | Brief / scene handoff | Evidence / open items |
| --- | --- | --- | --- | --- |
| ONO-EP01-SHORT | W1 script lock done (user approved `ONO-SCRIPT-R1`, main hook, 2026-11-02) → **Film** W2.1 brief when the user starts it | research `ONO-RESEARCH-R1` (`research.md`; all sources lead-only, fetch blocked); script `ONO-SCRIPT-R1` (`short/script.md`, ≈ 44.5 s `estimated`) | — | open: civilian toll unresolved (hedged "ราว 30 คน ตามที่มีรายงาน"); hook main "เกือบ 29 ปี" vs `ALT-HOOK-U` "29 ปี" (user picks) |

- 2026-11-02 user (AskUserQuestion): hook = main "สงครามจบไปเกือบ 29 ปี… แต่ทหารคนนี้ยังรบอยู่" (`ALT-HOOK-U` dropped); script `ONO-SCRIPT-R1` approved (W1.4).
