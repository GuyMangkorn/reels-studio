# Gemini TTS reference

Source: [Gemini API speech generation](https://ai.google.dev/gemini-api/docs/speech-generation), [voice design](https://ai.google.dev/gemini-api/docs/voice-design), [pricing](https://ai.google.dev/gemini-api/docs/pricing); read 2026-10-30.

## Voices

30 prebuilt voices with the docs' descriptor. Gender is community-reported, not in the docs: confirm with `scripts/gemini-tts.py voices` (returns gender and pitch) before casting.

| Female | Male |
| --- | --- |
| Zephyr (Bright), Kore (Firm), Leda (Youthful), Aoede (Breezy), Callirrhoe (Easy-going), Autonoe (Bright), Despina (Smooth), Erinome (Clear), Laomedeia (Upbeat), Achernar (Soft), Gacrux (Mature), Pulcherrima (Forward), Vindemiatrix (Gentle), Sulafat (Warm) | Puck (Upbeat), Charon (Informative), Fenrir (Excitable), Orus (Firm), Enceladus (Breathy), Iapetus (Clear), Umbriel (Easy-going), Algieba (Smooth), Algenib (Gravelly), Rasalgethi (Informative), Alnilam (Firm), Schedar (Even), Achird (Friendly), Zubenelgenubi (Casual), Sadachbia (Lively), Sadaltager (Knowledgeable) |

- **Age:** no age field. Prebuilt voices are adult; `Leda` reads youngest, `Gacrux` oldest. For an elderly character, design a voice (`design`, e.g. "A Thai woman in her late seventies, warm and gentle, slightly hoarse and breathy, speaks slowly, native Thai accent."; worked 2026-10-30). A child description is refused by safety policy (tested 2026-10-30).
- **Extended library:** `voices` lists 2,114 voices in 39 locales (2026-10-30), **none th-TH**, so `--lang th-TH` returns nothing; filter by `--gender`, `--pitch` (low/medium/high), `--search` instead. Each entry carries accent, persona and context (Audiobook, News…).
- **Designed voices:** stored as `voice_…` IDs, 200 per project, expire 1 year after last use. Voice replication (cloning from a recording) also exists; use it only with the speaker's consent and a separate approval.

## Style phrases

Short English, one sustained delivery per line. Emotion + pace + volume:

| Mood | Example style |
| --- | --- |
| excited | `excited and thrilled, fast and energetic` |
| sad | `sad and heartbroken, slow and quiet` |
| whisper | `tense secretive whisper` |
| fear | `terrified, shaky and breathless` |
| angry | `angry, sharp and loud` |
| calm narrator | *(empty)* or `calm documentary narrator` |

Keep age, gender, accent and character identity out of style: they belong to the voice. Meta-instructions such as "keep the same timbre" increase drift.

## Inline tags

English angle-bracket tags inside the Thai text, at the point they happen. Human vocal sounds only (no SFX).

- Breath: `<breath>` `<heavy breath>` `<exhales>` `<pant>` `<phew>` `<sigh>` `<yawn>`
- Laughter: `<cackle>` `<cheer>` `<chuckle>` `<giggle>` `<laugh>` `<snicker>`
- Distress: `<argh>` `<cry>` `<gasp>` `<groan>` `<growl>` `<grunt>` `<hiss>` `<moan>` `<scream>` `<shout>` `<shriek>` `<sob>` `<whimper>` `<tsk>`
- Body and voice: `<cough>` `<sneeze>` `<snort>` `<throat-clearing>` `<whispering>`
- Pauses: `<short pause>` `<long pause>`
- Backchannel in a two-speaker turn: `|อืม|` between pipes.
