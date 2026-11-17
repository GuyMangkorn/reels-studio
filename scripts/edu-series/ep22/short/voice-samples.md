# EP22 opening voice audition

- Revision: **EDU-EP22-VOICE-SAMPLES-R1**, Editor, 2026-11-16. Scope: **EDU-EP22-SHORT**, channel `edu`; [SCRIPT-R3](script.md). A user pick here is a pace pick only: it is not script approval and not a voice lock.
- Settings: `gemini-3.8-flash-tts`, **Kore**, style exactly `warm, friendly, smiling storyteller, speaking rapidly`. **One API call**, exit 0, no `--fresh`, no fallback key, no retry; one earlier attempt failed before any request (missing `GEMINI_API_KEY` in the shell). No full narration, video or music bed.
- Machine-readable record: [voice-samples.json](voice-samples.json).

## Scope cut (cap)

L01–L04 is 61 syllables, about 14 s at this source rate (4.17 syllables/s); L01–L03 is 42 syllables, about 10.1 s at x1.00. Both exceed the [10 s audition cap](../../../../docs/delivery-workflow.md#voice-audition-cap), so the sample is **L01–L02 only (34 syllables, SCRIPT-R3 table)**. L03–L04 were not sampled; hear them only in the full read after the pick.

TTS input (ellipses become commas in the TTS text only):

```text
ถ้าคุณเป็นขันที ชิมอาหารให้ฮ่องเต้จีน, คุณต้องชิมก่อนทุกจาน
แต่ฮ่องเต้องค์สุดท้าย, ไม่แตะโต๊ะเกือบสามสิบจานนั้นเลยนะ
```

## Candidates

Both are `atempo` of the same take (no trimming). MP3s are listening derivatives of the WAVs. Choice pending.

| Candidate | Listen (MP3) | WAV | Duration | 34 syl / container | 34 syl / gross span | 34 syl / baseline (line gap removed) | LUFS |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| Kore x**1.05** | `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/brave-visvesvaraya-700270/out/ep22-voice-samples-r1/EP22_L01-L02_kore_x1.05.mp3` | `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/brave-visvesvaraya-700270/out/ep22-voice-samples-r1/EP22_L01-L02_kore_x1.05.wav` | **7.781 s** | 4.37/s | 4.69/s (span 7.25 s) | **4.89/s** (6.95 s) | -16.0 |
| Kore x**1.00** | `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/brave-visvesvaraya-700270/out/ep22-voice-samples-r1/EP22_L01-L02_kore_x1.00.mp3` | `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/brave-visvesvaraya-700270/out/ep22-voice-samples-r1/EP22_L01-L02_kore_x1.00.wav` | **8.160 s** | 4.17/s | 4.46/s (span 7.62 s) | **4.66/s** (7.30 s) | -16.1 |

Method: 10 ms RMS windows, -40 dBFS; gross span = first to last above-threshold window; the one L01→L02 low-energy gap (about 0.30–0.32 s, near 4.1–4.6 s) is removed for the baseline. Measurements: `measurements.json`, `measure-auditions.py` in the store.

## Store

`/Users/mangkornkatawong/ReelsStore/projects/edu/EDU/samples/ep22/2026-11-16_r1-7dd90bbc46066467/` holds the normalized source, both WAVs and MP3s, sidecar, TTS input, measurements, generation log and manifest. `out/ep22-voice-samples-r1/` is a cache.

## Limits

- Nobody has listened. Thai pronunciation and delivery are **unchecked**; no Whisper pass was run. Words worth hearing: ขันที, ฮ่องเต้ (tone and vowel length), องค์สุดท้าย, สามสิบ.
- Two lines cannot show full-read rate stability or late drift. Compare with the channel's usual 1.08/1.15 only by ear; EP21 picked 1.05.
- Dry audition: no Film sound bed or Ton cue sheet.
