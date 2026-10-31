# Boss — HANAKO arm restore, 31 Oct 2026

## Scope and restoration

Restored the taper-pass POV arm look in B01-SH01, B02-SH01 and B09-SH01, as selected by the user. B01/B09 use dir −2.2, the sheet elbow `(0.34, 1.30, 0.42)` projected through RR-KNOCK to `(1424, 986)` plate px, elbow x tracking the wrist while y stays fixed, sleeve start `(1700, 1100)`, scale 2 and the default .32 cuff. B02 retains dir −2.9, elbow `(1115, 1000)`, sleeve start `(1140, 1250)` and scale 1.8. All three use the taper-pass seeded solid fills. Knuckle anchors, sizes, animation keys, B02 envelope, tones and loop timing were kept. The optional `sleeveCuffFraction` and `crispFill` kit parameters and their default behavior remain, along with their applicable tests. The armdir projection test was updated for the restored geometry.

## Render evidence

Rendered `out/qa/hanako/armrevert/restored/` with the same composition/frame list and ANGLE backend as `out/qa/hanako/armdir/before/`. All nine matching PNGs are byte-identical, with **0 different RGB pixels, 0 different channels, maximum channel difference 0/255**: B01 f000/f018; B02 f000/f113/f126; B05-SH01 f051 and B05-SH02 f111; B09 f293; LOOP-LANDING f000. The restored B09 f293 and LOOP-LANDING f000 are also byte-identical to each other. Pixel/byte results: `out/logs/armrevert-pixels.log`. WORLD FOG `WFOG-PREVIEW-S02-SH02` f30 is byte-identical to the stored pre-armdir default render. This proves these samples, not every frame or rendering session.

Viewed `out/qa/hanako/armrevert/before-restored.png` at 270 px per image, left stored before / right restored, rows B01 f000/f018, B02 f000/f113/f126, B09 f293 and loop f000. Each pair visually matches. B01/B09 again show the horizontal forearm and grey right-edge sleeve; B02 remains cropped at the right edge. No frame difference remains in these samples; the optional kit APIs and their tests remain in code compared with the earlier revision. The restored look reintroduces exposed skin and the flatter arm, as requested. B02 remains a narrow cropped sleeve, and these samples do not establish full motion, continuous playback, audio, Studio seek behavior or final visual acceptance. No lead character is visible in these hand-only shots, so lead-height measurement is N/A.

## Checks

- Typecheck and lint passed; lint reports the same three React hook warnings. All 223 tests passed. Logs: `out/logs/armrevert-{typecheck,lint,test}.log`.
- Caption-zone y860:1248 passed all six restored B01/B02/B09 samples; mean .182–.205, p95 .237–.331. See `out/logs/armrevert-caption.json`; no claim is made for unsampled frames.
- The stored comparison is exact at every requested sample; no parameter remains known to be inexact. B03 and the excluded handoff/brief were not edited for this task. The comparison does not constitute a full-sequence or publication QA pass.
