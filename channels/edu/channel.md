# Edu channel

**Status:** channel file ([channels](../README.md)); Default for every deliverable whose `delivery.md` names channel `edu`. The values below were moved here from the shared documents on 11 Nov 2026 without changing them; each keeps its date and evidence. Where this file is silent, the shared documents apply.

## Identity

| Field | Value |
| --- | --- |
| Channel ID | `edu` |
| Channel mark | `@TamMaiLa`, top-left on every deliverable (code default `defaultChrome` in `src/scenes/media.ts`; placement in [production requirements](../../docs/production-requirements.md#thai-subtitles-narration-and-channel-label); user, 3 Nov 2026) |
| Direction | Education (user, 11 Nov 2026: the channel's direction is education from here on) |
| Genre / purpose | Educational Shorts in Thai: one surprising, true answer told through a character who meets each problem on screen ([script rules](script.md)) |
| Factual claims | General knowledge or a named real case, so Boat researches, fact-checks and runs the [clarity pass](../../docs/editorial-workflow.md#clarity-pass) on every script |
| Episode records | `scripts/edu-series/` (series `delivery.md`, `task.md`, `concepts.md`; one folder per episode); deliverable IDs `EDU-EPnn-SHORT`; publish folder `publish/EDU/` |
| Earlier work | Mystery and horror episodes made under the same mark before 11 Nov 2026 (WORLD FOG, KSO and others) keep their own records and are not re-labelled |

## Rules of this channel

- **Script:** [script.md](script.md) (ER01–ER10: hook, levels, one rule that flips, audience level, open-question map, short answers, hedges, pitch check).
- **Numbers:** [performance.md](performance.md); the coordinator adds a row per posted video ([performance record](../../docs/delivery-workflow.md#performance-record)).
- **Look:** the [project defaults](../../docs/delivery-workflow.md#project-defaults) (painted 3D camera, the four-head cast) with the [retention camera](../../docs/cinematography-principles.md#retention-camera). No `look.md` yet.
- **Captions:** the shared [caption look](../../docs/production-requirements.md#caption-look), which came from EDU-EP02/EP03. No channel override.
- **Edit and cover:** the shared [editor principles](../../docs/editor-principles.md) and [cover principles](../../docs/cover-principles.md). No `edit.md` or `cover.md` yet.

## Voice

**Default (user, 6 Nov 2026).** Narrator **Kore**, one continuous read with the EDU-EP02/EP03 style "fast-paced, quick brisk delivery with short pauses between phrases, playful deadpan female narrator, dry and matter-of-fact, speaking quickly without dragging", no atempo (the model sets the pace); a line or episode whose mood needs another tone records it. Gemini TTS through the [gemini-tts skill](../../.agents/skills/gemini-tts/SKILL.md); the [sample before every full read](../../docs/delivery-workflow.md#sample-before-full-read) still applies. Evidence: [EP02 voice measure](../../scripts/edu-series/ep02/voice-measure.md), [EP03 voice measure](../../scripts/edu-series/ep03/voice-measure.md).

## Sound

<a id="ut-edu-end-tag"></a>
- **UT15 — Education series ending sound is Film's choice.** **Default** for every EDU-SERIES deliverable (user, 9 Nov 2026: "education project ไม่จำเป็นต้องมีเสียงเครื่องสายตอนจบคลิปแบบ ep2 ก๋ได้ เอาที่ฟีมอยากใช้เลย"; replaces the 7 Nov 2026 Requirement to close on the EP02 strings tag). Film designs the closing sound for the episode's story and mood and names it in the scene sheet's sound plan; Editor places it in the stem from the first Draft. The EP02 tag `sfx/stinger/stinger_pizz-tag-ending_01` (pizzicato and marimba, 2.5 s) stays in the library as one option, not a requirement. Evidence of the old rule: EP02 close (`scripts/edu-series/ep02/sound-mix.py`); EP03–EP06 carried the tag (6–7 Nov 2026).
