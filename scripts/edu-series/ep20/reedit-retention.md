# EDU-EP20-SHORT re-edit retention

Revision: EDU-EP20-RETENTION-R1, Editor, 2026-11-16. Scope: canonical narration source and delivery reference stills after the user selected cover P5 / text A. No picture, performance, runtime narration path, timeline, asset lock, shared module or scene pin was edited. Coordinator owns Git staging/commit and record/context-map integration.

## Canonical narration source

- Approved runtime source remains `public/narration/EDU-EP20-SHORT-narration-E.wav`, locked to `projects/edu/EDU/narration/edu-ep20-r2/kore-full-selected-E-L13r2.wav`; SHA256 `b6f8490d2af1ea5975ba612dc35cae308719a8296e1126189d441cdc5ce11d68`. It is narration R2, the locked E read plus the approved L13 replacement. The existing index still plays this WAV with its existing empty runtime amplitude array.
- Added canonical retention source **`public/narration/EDU-EP20-SHORT.mp3`**, SHA256 `a95549feda97bcdc8ebf9309840a9c7919f85f6b05596071d5eda1f26baa73ad`. Encoding uses the Remotion-bundled FFmpeg selected by `scripts/narration.py`: `-i <approved WAV> -map 0:a:0 -c:a libmp3lame -b:a 192k`. No gain, tempo, trim, padding, TTS call or narration wording change. This is the required Git source exception; the original lossless approved take already has its single immutable store home, so no additional MP3 store copy was created.
- Existing `narration.py` PCM decoding verifies **2,307,537 mono samples at 48 kHz** before and after MP3 encoding: exact decoded duration **48.0736875 s**; ffprobe container duration **48.073688 s**. Zero-lag PCM correlation is **0.9999982602**, signal-to-encoding-error ratio **30.4402 dB**. MP3 is lossy, so neither encoded bytes nor decoded samples are claimed identical to the WAV. Equal decoded sample count and zero-lag alignment establish no conversion timing shift; this is not a new listening or pronunciation review.
- Added **`src/videos/edu-ep20/EDU-EP20-SHORT.amplitude.json`**, SHA256 `c0e630aa377889e25ab57f887a6191881dcd8c57d006d86af9356c0588ce458d`. Uses the existing `narration.py` convention: decode the canonical MP3 to mono 48 kHz; RMS over 1,600 samples per 30 fps frame; divide by the peak RMS; round to four decimals. **1,443 values**, including the final partial block; range **0.0003–1.0**. The envelope covers the narration duration, not the video's silent ending tail.

Runtime status of the canonical MP3/envelope: **exists-unintegrated** intentionally. They are retention inputs for Git and later re-editing, not replacements in this approved timeline. Integration would be a later edit with the usual pinned-scene checks. Both new files are untracked and ready for the coordinator to commit; this Editor pass did not commit them. Conversion evidence: `out/logs/edu20-retention-audio.txt`, `out/qa/edu20/retention/audio-identity.json`.

## Delivered-picture reference set

Ran the existing tool, without a video render:

```bash
python3 -I scripts/reference-frames.py EDU-EP20-SHORT --mp4 EDU-EP20-SHORT=/Users/mangkornkatawong/ReelsStore/publish/edu/EDU/EDU-EP20-SHORT/EDU-EP20-SHORT.mp4
```

The tool uses `render.mjs --stills --gl=angle --timeout=180000`, one Chrome, and archived **12 full-size PNGs plus `hashes.tsv`** to:

`projects/edu/EDU/reference/EDU-EP20-SHORT/c420a2cf7d96-dirty-202611162210/`

Frames: **G0, 150, 300, 450, 600, 750, 900, 1050, 1200, 1350, 1500, 1618**. These are five-second samples plus the last frame; they are a re-edit reference set, not one-per-scene samples or continuous playback QA. Per-frame SHA256 and PSNR against the actual published MP4 are in `hashes.tsv`. Finite PSNR range **50.626611–52.465297 dB**, above the README's approximately 35 dB match guide; G1618 is byte-equivalent black after the comparison conversion (PSNR infinity). No prior reference set existed for a byte-identical historical comparison.

Viewed `out/qa/edu20/retention/sheet-reference-5s.png` through `qa-sheet.sh`, four columns at 270 px per frame. The upright/forward/rearward balloon states, pressure inset, split Thai captions, final settle and black tail agree with the approved delivery. Durable sheet: **`projects/edu/EDU/previews/ep20/retention/sheet-reference-5s.png`**. The prior unchanged delivery geometry/caption measurements in `delivery-qa.md` still apply: A lead 734.8–745.2 px, CLOSE up to 1108.9 px; 35/35 caption cues in the safe box. No new visual or text decision was made.

Stills render time **15.69 s**. Logs: `out/logs/edu20-retention-references.txt`, `out/logs/reference-EDU-EP20-SHORT.log`, `out/logs/render-render-2026-11-16T15-10-21-858Z-b31300c3.jsonl`. The reference directory's dirty version records the exact pre-commit working-tree state; the coordinator must retain its link when committing final sources rather than implying the baseline commit alone reproduces it.

`pin.mjs list` before/after outputs are byte-identical: **11 A_fade scenes remain pinned**. Evidence: `out/logs/edu20-retention-pins-before.txt`, `edu20-retention-pins-after.txt`. No video, sound mix, cover, pin or publish file changed in this pass. No test suite was rerun for derived retention data; real-source decode/sample checks, actual still renders, MP4 comparisons and the pin snapshot are the applicable verification. No new listening, Studio or temporal QA is claimed.

## Coordinator integration

Index this handoff, canonical MP3 and amplitude JSON in `docs/context-map.md`, and commit them with the production sources. Preserve the runtime WAV's existing asset lock and immutable source. Record the reference set and sampled PSNR in the final task/delivery/build notes. All Editor jobs are complete; no approval or production re-render is needed for these retention-only inputs.
