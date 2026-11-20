---
name: gemini-style-pace-word
description: "Gemini TTS style tuning: one pace word is needed, and Kore sounds angry on a flat fast style (edu voice samples, 11 Nov 2026)"
type: feedback
updated: 2026-11-11
---

When tuning a Gemini TTS style prompt: a style with no pace word reads far too slow (about 3.3 syllables/s), one pace word ("speaking rapidly") is enough, and Kore (labelled Firm) sounds angry when the style is flat and fast. The user said `dry deadpan, speaking rapidly` "sounds angry" and asked for a warmer tone; the rest is my reading of that session's nine samples.

**Why:** on 11 Nov 2026 the user compared nine short reads of the EP16 opening by ear before picking the warm edu style now in `channels/edu/channel.md#voice`. Samples: store `projects/edu/EDU/samples/send/`.

**How to apply:** any new Gemini voice sample, every channel: put exactly one pace word in the style, and pair Kore with a warm tone word. The edu channel does not take Achernar ([[voice-achernar-narrator]]) or the generic +5% ([[narrator-pace-plus5]]); its voice is in the channel file.
