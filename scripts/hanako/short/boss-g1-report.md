# Boss G1 — HANAKO-SHORT SCENE-R3

31 Oct 2026. Base `59ef2a2` + working-tree changes (source hashes: `out/qa/hanako/g1/source-sha256.txt`). Scope: B01-SH01, B01-SH02, B02-SH01, B03-SH01; FILM-R4, voice lock v3, 1080×1920 / 30 fps. **Plates implemented; visual done is not claimed.**

## Assets and Editor handoff

- Production plates: `HANAKO-B01-SH01`, `HANAKO-B01-SH02`, `HANAKO-B02-SH01`, `HANAKO-B03-SH01`, exported by `src/painted/shots/hanako.tsx` and available in the painted registry. Shot-local seconds drive every state. Start/duration frames: 0/117, 117/187, 304/139, 443/202.
- Owning art: `src/painted/hanako/assets.ts`; approved close-door art hardened in `look.tsx`. Kit `wristAtKnuckles` solves the same knuckle anchor returned by `paintPovHand`: rest (733,715), contacts (660,740), size .66→.54, press only f4/18/31. Plate camera adds the specified 5px jolt. Existing kit consumers retain their drawing implementation.
- Local **Noto Sans JP** variable font for Japanese text and digits, existing Noto Sans Thai for Thai; font source/hash and OFL accompany the font in `public/fonts/`. Hook and labels stay outside the camera. Japanese line starts F251; reply light peaks F417, returns to zero F435. Plate-owned Grade/Grain and lower-door light falloff keep the caption band quiet.
- `CH-KID`: 1.30m/1.25m at 700px/m, four-head proportions, fixed back/three-quarter artwork, no face features. L's mittens and sleeves use the same moving notebook-edge anchors; R leans 10° with arms behind the torso. Ground shadows follow feet. Lower uniforms remain dark and without details (VD15). The children capture is **LF07**, represented by `out/qa/hanako/g1/B03-SH01-f036.png`; LF04 is not reused.
- **LF04 smudge is B05-SH02 blank-page art**, unused by this group; deferred to its owning group. LF02 shards/paper and Hokkaido are also outside this group.
- `src/Root.tsx` unchanged; no Hanako video registration or timeline assembly. Editor selects the plate IDs and adds the 15-frame B01-SH02 incoming dissolve, audio and subtitle cues. Standalone review entry: `src/painted/hanako/qa-index.tsx`.

## Rendered evidence

Rendered with `--gl=angle` through `node scripts/hanako/render-g1.mjs`; output `out/qa/hanako/g1/`. Inspected all four **qa-sheet.sh** sheets below (270px tiles), including one-second samples, shot endpoints and selected event frames. Matching `*-labelled.png` and `*-manifest.tsv` carry shot ID, SCENE-R3, global F/time and local f. Full frame list: `frames.json`.

| Shot | Viewed sheet under `out/qa/hanako/g1/` | Frames | Caption mean max | Caption p95 max | Lead height |
| --- | --- | ---: | ---: | ---: | --- |
| B01-SH01 | `B01-SH01-sheet.png` | 15 | .196 | .342 | N/A: POV hand |
| B01-SH02 | `B01-SH02-sheet.png` | 13 | .163 | .189 | N/A: empty set |
| B02-SH01 | `B02-SH01-sheet.png` | 13 | .208 | .238 | N/A: empty set |
| B03-SH01 | `B03-SH01-sheet.png` | 15 | .172 | .231 | L: **909 / 963 / 1018px** at f0/100/201 |

`caption-zone.py`: **56/56 pass**, band y860–1248, mean ≤.25 / p95 ≤.40 (`caption-zone.json`). Lead measurement: isolated owner artwork against magenta, shadow disabled, no glow or padding (`lead-height.json`, `lead-f*.png`; reproduce with `python3 -I scripts/hanako/measure-g1.py`). The 909px sampled minimum exceeds 480px; intermediate frames were not individually raster-measured. L's fixed pose and monotonic 1.00→1.12 camera preserve its geometric minimum at entry.

Four representative frames have 0 RGB-zero pixels and 0 nonopaque pixels (`pixel-checks.json`). Hand-anchor inversion and reply-envelope regression tests pass. `npm run typecheck` passes; lint has 0 errors / 3 existing look-file hook warnings; selected tests **7/7 pass**. Logs: `out/logs/hanako-g1-*`.

## Limits / outstanding checks

- **Strict determinism fails:** B03 f100 versus an independent repeat differs in **2 color channels**, maximum **1/255** (decoded RGB; `repeatability.json`). PNG `cmp` fails. Cause is unisolated; no byte-identical claim. Re-test on the delivery render backend before treating repeatability as passed.
- No Studio cold-load/playback/scrub checks, continuous video review, exhaustive adjacent-event checks, actual timeline dissolve/neighbor continuity, B09→B01 seam proof, audio listening/mix, subtitle/chrome integration or new user look verdict. Plate samples do not establish any of these.
- Look-only LF01 consumers inherit the corrected fist/font; their separate look compositions were not re-rendered. Shared production consumers were checked by painted tests; no rendered parity claim for other episodes.

[Summary image](../../../out/qa/hanako/g1/G1-summary.png)
