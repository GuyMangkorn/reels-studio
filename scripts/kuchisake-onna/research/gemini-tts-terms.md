# Gemini TTS (paid tier): terms, SynthID, data use

Fetched 2026-11-01 from the URLs below. Page contents were read through a fetch-and-summarise tool, so wording is paraphrased; re-read the linked page before relying on any clause. Not legal advice.

## 1. Terms governing output

- **Gemini API Additional Terms of Service** — https://ai.google.dev/gemini-api/terms — effective 2026-03-23; page last updated 2026-04-28 UTC.
  - Output ownership: Google states it will not claim ownership of generated content. It notes Google may generate the same or similar content for others (so no exclusivity).
  - Use: the user must comply with applicable law and is responsible for how generated content is used and shared. Services are for professional or business use, 18+.
  - Other restrictions: no building competing models or reverse engineering; no bypassing safety features; follow the Prohibited Use Policy.
  - Attribution: only where content comes back in an API call with citation metadata (grounding/citations). Nothing found requiring attribution for TTS audio.
  - Voices / synthetic content: the terms do not mention voices, likeness or synthetic-media labelling.
  - Explicit "commercial use / publishing on YouTube is allowed" sentence: UNVERIFIED. The terms imply business use and no Google ownership claim, but I did not see a sentence that names publishing. Confirm by reading the page.
- **Google APIs Terms of Service** — https://developers.google.com/terms — last modified 2021-11-09. Says additional API-specific terms control on conflict; it does not mention the Gemini API. Whether it also applies to the Gemini API: UNVERIFIED (the Gemini terms page is the operative one).
- **Generative AI Prohibited Use Policy** — https://policies.google.com/terms/generative-ai/use-policy — last modified 2024-12-17.
  - Bans fraud and deception, and impersonating a real person (living or dead) without clear disclosure and with intent to mislead.
  - Bans misrepresenting content origin to deceive, e.g. claiming it was made solely by a human.
  - No general AI-labelling requirement found. It allows relaxations for educational, documentary, scientific or artistic purposes; fiction is not named.
  - A fictional horror narrator using prebuilt voices does not trip these rules on a plain reading (paraphrase, not a legal conclusion).
- **Voices**: https://ai.google.dev/gemini-api/docs/speech-generation (last updated 2026-10-28 UTC) lists Erinome ("Clear") and Despina ("Smooth") as prebuilt voices. No usage or disclosure restriction on prebuilt voices was found there. Only voice replication needs reference plus consent audio.

## 2. SynthID and disclosure

- **Gemini TTS is watermarked (Google primary sources):**
  - https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-flash-tts/ (2026-04-15): all audio from Gemini 3.1 Flash TTS carries an imperceptible SynthID watermark woven into the audio.
  - https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-text-to-speech/ (2026-09-23): says every clip from the Gemini Audio models is watermarked, inaudible and built into the output. Rolling out in the Gemini API and AI Studio.
  - Which exact model ID the project calls (and whether Erinome/Despina outputs on it are covered): UNVERIFIED. Models older than the two above (2.5 preview TTS) were not covered by any page I read.
  - The speech-generation docs page (2026-10-28) does not mention SynthID.
- **Robustness**: https://deepmind.google/models/synthid/ (date not shown) says the audio watermark is inaudible and survives noise and MP3 compression and speed changes. That page names Lyria and NotebookLM, not Gemini TTS, so applying it to TTS is an inference.
  - Survival of mixing with music/SFX, AAC re-encode and YouTube upload: UNVERIFIED (no page addresses it).
  - https://ai.google.dev/responsible/docs/safeguards/synthid (2025-04-09) is about SynthID Text and says nothing on audio.
- **Google disclosure requirement**: none found in the Gemini terms or Prohibited Use Policy (see section 1). The watermark is automatic and the creator cannot remove it without risking policy trouble (bypassing safeguards, paraphrase of the terms).
- **YouTube altered/synthetic content policy** — https://support.google.com/youtube/answer/14328491 (date not shown, footer 2026):
  - Disclosure is required for realistic content, e.g. making a real person appear to say or do something they did not, or realistic events that did not happen.
  - Not required for clearly unrealistic content, AI-assisted scripts/ideas, captions, audio repair, or cloning your own voice.
  - Synthetic narration voices are not addressed directly (the fetch tool said so; its note that "by inference" a real person's voice is covered is an inference, not page text).
  - A clearly fictional horror short with a generic prebuilt narrator does not appear to meet the "realistic, real person or real event" trigger, but this is my reading, not a Google statement. The toggle is allowed anyway and harmless; whether the project wants it on is the user's call. Labels may also be added automatically to non-music AI audio per the fetch summary (UNVERIFIED detail).

## 3. Paid-tier data and training

- https://ai.google.dev/gemini-api/terms (2026-04-28): for Paid Services Google says it does not use prompts or responses to improve its products; it logs them briefly for policy-violation detection and legal requirements. Unpaid Services (AI Studio free, free quota) may use inputs and outputs for improvement and human review.
- https://ai.google.dev/gemini-api/docs/pricing (2026-10-30): the "Used to improve our products" row shows No for the Paid tier and Yes for the Free tier on every TTS model listed (Gemini 3.8 Flash and Flash-Lite TTS, 3.1 Flash TTS Preview, 2.5 Flash/Pro Preview TTS).
- https://ai.google.dev/gemini-api/docs/usage-policies (2026-06-09): output is retained 55 days for policy-violation detection; logged data is not used to train models except those used for policy enforcement.
- Caveat: a key or project must actually be on billing/paid quota for each call. Calls through free-tier keys or unpaid AI Studio use would be treated as Unpaid Services. Confirm the key.

## Open items for the user

1. Confirm the API key used for the script text is a billed (paid-tier) project, since scripts are unreleased.
2. Read the Gemini API Additional Terms yourself for an explicit statement on commercial publication; I only found implied permission (business use, no ownership claim). Decide if that is enough.
3. Confirm the exact TTS model ID in use is one of the models Google says is SynthID-watermarked (3.1 Flash or 3.8 Flash/Flash-Lite TTS); older preview models are UNVERIFIED.
4. SynthID survival after mixing with BGM and YouTube re-encode is UNVERIFIED; do not rely on it for provenance claims. No action is required from you since the watermark is not removed.
5. Decide whether to switch on YouTube's altered/synthetic content toggle. Reading suggests it is not required for clearly fictional horror with a generic voice; toggling on is the conservative option.
6. Record the Google terms version (effective 2026-03-23) in delivery.md; these pages change.

Not legal advice. This is a good-faith reading of public Google pages as fetched on 2026-11-01; consult counsel for commercial-risk decisions.
