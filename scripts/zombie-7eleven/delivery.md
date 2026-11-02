# ZOMBIE-7ELEVEN delivery

- Deliverable: `Z7-EP01-SHORT`; selection: Short only, target about **115–120 s** (user, 2026-11-02: asked to extend the 90 s R2 to 120 s), 1080×1920, 30 fps. Episode `zombie-7eleven`.
- Profile: fiction survival thriller with a sound-rule twist; fantasy allowed (user, 2026-11-02: "ซอมบี้มันก็แฟนตาซี"). Fiction only, no factual claims (Boat checks continuity and clue fairness only). Genre and style profile were not chosen by the user in words: recorded as `default` (channel-default story profile), open to correction.
- Tier: Full ([pipeline](../../docs/delivery-workflow.md#pipeline-tiers)); Boat research is `N/A` (fiction, no facts to research).
- Visual engine: Painted 2D (p5.brush) + SVG inserts (`default`). Cast, proportions, arm poses, camera and new-asset rules: project defaults (`default`).
- Voice: Gemini TTS, narrator **Kore** (user pick, 2026-11-02, after hearing the 3-voice sample Kore/Orus/Sulafat, store `~/ReelsStore/projects/ZOMBIE-7ELEVEN/voice-sample/`). Narrator +5% tempo (atempo=1.05) applies. Sample read ran 3.2–3.5 syl/s including pauses (≈16.6 s for ≈54 syllables), so the full script may run ≈130–140 s against the 115–120 s target: Preaw/Film/Editor to check on the full read before the length lock.
- Ending: **no loop** (user, 2026-11-02); the story ends on a clean escape. Fade vs hard cut: open, Film proposes.
- Comment prompt: none (user, 2026-11-02).
- Realism rule (user, 2026-11-02): show no real-store door-device mechanism; door sounds are shown by door movement, heads turning and an on-screen sound word.
- Brand note: "เซเว่น" is not spoken in narration since R3; it stays in the title and picture. Swap or blur signage if the platform is strict.
- Music / SFX / captions / chrome: not chosen yet (defaults apply at Film/Editor; sound duties per [sound workflow](../../docs/sound-generation-workflow.md#role-responsibilities)).

| Deliverable | Stage / Next owner | Script / research / review | Brief / scene handoff | Evidence / open items |
| --- | --- | --- | --- | --- |
| Z7-EP01-SHORT | W1 script lock, voice picked (Kore) → **Film** brief; then Editor full voice read and length lock | Script `Z7-SCRIPT-R4.1` ([short/script.md](short/script.md), Preaw, ≈448 syllables, ≈116 s **estimated**, not read aloud); Boat `Z7-FACTCHECK-R4` needs-revision (minor), fixes applied in R4.1; `Z7-FACTCHECK-R4.1` ready-for-storyboard, 0 fixes ([short/factcheck.md](short/factcheck.md)) | None yet | User approved the R4.1 direction and text 2026-11-02 (hook `B00` changed by the user's approval, 6-frame shoulder included). Open: Film brief, full voice read (length risk ≈130–140 s) |

## Log

- 2026-11-02: R2 (90 s, CCTV hook) → user asked about 120 s; Preaw recommended 120 → `R3` (clue ledger CL01–CL06); user approved changing locked hook `B00` (on-screen `ซอมบี้ 50 | คุณ 1` from frame 0, narration voices the self-opening door) → `R3.1`; Boat `Z7-FACTCHECK-R3.1` → `R3.2` (Z7F-01/02/03/05, "ทำงานคนเดียว"); Boat `R3.2` ready-for-storyboard.
- 2026-11-02: user rejected the "pull the chime box off" scene as too detail-sensitive; new direction `R4`: sound as a lure (phone alarm), escape the opposite way, no loop, customer alive. Boat `R4` → `R4.1`.
