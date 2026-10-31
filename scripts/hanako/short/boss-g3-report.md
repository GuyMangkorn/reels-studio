# Boss G3 — HANAKO-SHORT SCENE-R3

31 Oct 2026 · base `59ef2a2` + preserved G1/G2 working tree · FILM-R4 / voice lock v3 · 1080×1920, 30 fps. **Five production plates implemented; visual done is not claimed.** Evidence: `out/qa/hanako/g3/`; exact source hashes: `source-sha256.txt` there.

## Assets and Editor handoff

- Extended the existing `assets.ts`, `hanako.tsx`, QA entry, render/measure scripts and tests. Plate IDs: `HANAKO-B07-SH01`, `HANAKO-B07-SH02`, `HANAKO-B07-SH03`, `HANAKO-B08-SH01`, `HANAKO-B09-SH01`. Start/length frames: **1588/190, 1778/162, 1940/106, 2046/256, 2302/294**. Available through the existing painted registry; no timeline assembly, `Root.tsx` edit or video registration.
- `CLASSROOM-80S` uses the existing waiting CH-KID artwork, restaged at 560px/m; optional shoulder gesture F1596–1608 and head pivot F1689–1701. No cast redesign/polish. The generic faceless teacher, notebook/attached pen (12-f loop from F1708), date and bilingual labels are shared graphics in `generations.tsx`.
- `MAP-JP` reuses Film's Natural Earth coastline owner. Screen-space book/date slide F1782–1792; half-opacity pin without a ring; 40 seeded, separated land points, two starting F1860, then one every 2 f through F1936. Dot centres exclude a 30px pin radius and plate y>830; all camera samples keep the 8px pop above y860. Existing local Noto Sans JP/Thai fonts serve Japanese text, dates and real door digits.
- `FILM-CARD` contains a stationary popular-image doodle on a generic illustrated poster, exact title `『トイレの花子さん』 1995`, 12-f upward entrance, F1994 title stamp and F2022–2024 projector pulse. Corrected an entrance-direction error found during picture review. A screen-space lower-band falloff now keeps the moving poster caption-safe: before correction, entry mean/p95 reached .329/.729; final maxima are .176/.290.
- B08 uses the shared RR-WIDE set and a CH-KID silhouette variant with the existing four-head envelope, cropped hair, trousers, bags/collar differences, foot shadows and .45 group opacity. Four generation windows match SCENE-R3; G4 is gone at F2301. Silhouettes sit above the set in the camera overlay. The main CH-KID art remains unchanged apart from optional acting controls.
- B09 reuses the LF01 door, kit wrist/knuckle inversion and the **same** cold close-door overlay owner as B01. F2482–2506 hand rise ends at knuckles (733,715), size .66; pose/ink and camera hold through F2595. FILM-R4 key dip .4 / ivory level .2 peak at F2347, return to zero F2383; final amber cool F2581–2595. Hardened Film's existing `SeamGlow` in place to x890–1050 spill / x1050–1066 core and y855 cutoff; no eye is mounted.
- Editor still owns the incoming 15-f B08 dissolve, captions/chrome, narration sync, music/ambience/SFX, the −2dB glow bed dip and music cut at F2482. E5's word-onset ear check remains open. Use `endHoldSec: 0`, `loopFadeFrames: 0`; the 90-f hold is already inside B09's length. These plates are silent.

## Rendered measurements

Rendered with `--gl=angle` using `scripts/hanako/render-g1.mjs --g3`. Viewed the **qa-sheet.sh** parts listed below, covering 1Hz, endpoints and selected event-adjacent frames; paths are relative to `out/qa/hanako/g3/`. Each shot also has a full `*-sheet.png`, `*-labelled.png` and `*-manifest.tsv` identifying SCENE-R3, global F/time and local f. [Summary](../../../out/qa/hanako/g3/G3-summary.png).

| Shot | Viewed sheet parts | Frames | Caption mean max / p95 max | Visible artwork height |
| --- | --- | ---: | --- | --- |
| B07-SH01 | `B07-SH01-sheet-01.png` through `-03.png` | 25 | .162 / .172 | A **727 / 757 / 786px**, f0/95/189 |
| B07-SH02 | `B07-SH02-sheet-01.png` through `-02.png` | 21 | .160 / .170 | N/A: map |
| B07-SH03 | `B07-SH03-sheet-01.png` through `-02.png` | 18 | .176 / .290 | N/A: doodle on paper, no body lead |
| B08-SH01 | `B08-SH01-sheet-01.png` through `-04.png` | 40 | .167 / .202 | **307; 291/279; 330/342; 308px** at each group's full-entry frame |
| B09-SH01 | `B09-SH01-sheet-01.png` through `-03.png` | 30 | .190 / .327 | N/A: POV hand |

- `caption-zone.py --band 860:1248`: **134/134 pass**, mean≤.25 / p95≤.40 (`caption-zone.json`). Lead masks isolate owner artwork with shadow/glow disabled; CH-KID A sampled minimum **727px >480px** (`lead-height.json`). Its unchanged head/foot bounds and monotonic camera put the minimum at entry; intermediate frames were not individually raster-measured. B08 uses the accepted **VD16 door/ensemble exception**, not the 480px body rule; each silhouette exceeds 250px. Group-entry raster bottoms are **848/855/857/859px**; geometric foot maximum is 859.2px.
- **Loop F2595 → F0, hook off:** **0 changed RGB channels, max delta 0; byte-identical PNG**. Both frames have alpha **255 throughout**. Independent B09 F2595 repeat is also byte-identical. Viewed `loop-seam-sheet.png`, F2594/F2595/F0, and `glow-crop-sheet.png` (source `glow-peak-crop.png`, 540px wide). Exact endpoint identity uses the wrapped ambient phase on F2595 (2596 modulo 118); earlier frames keep the 118-f flicker. The inherited restroom has no animated drip, only its static floor mark.
- Dip/glow numerical levels are zero from F2383. Layers-off comparison: F2506/F2595 **0 differences**; F2383 retains **1 changed color channel, delta 1/255** (`pixel-checks.json`). Strict repeatability is therefore **not established for every shot/frame**. Five representative stills have 0 RGB-zero pixels. No figure/eye is present in the inspected seam glow; its projected cutoff stays above y860 while lit.
- Five full silent `*-motion.mp4` clips: **1008 frames**, 1080×1920 / 30fps (`motion-metadata.json`). Export is not continuous playback review. Typecheck passes; lint **0 errors / 3 existing look hook warnings**; relevant tests **11/11 pass**. Logs: `out/logs/hanako-g3-*`.

## Still geometric / unverified

- **CH-KID polish deferred:** elliptical hair masses, angular single-piece uniform/lower-body silhouette and capsule sleeves/mittens remain geometric; dark legs merge into the floor. Classroom acting adds no facial rig or new cast art. The B08 derivative has a simple trouser gap but still reads as a diagrammatic silhouette. Teacher is intentionally a generic flat icon; desk, book card and poster are flat geometric shapes. Doodle is deliberately schematic, never a girl standing in the room. No final art-quality verdict is implied.
- No Studio cold-load/playback/backward-scrub check; no exhaustive adjacent-frame jump audit or continuous assembled playback; no B06→B07, B07→B08 dissolve, subtitle/chrome/platform UI, audio/listening/mix or progress-bar-reset proof. B09 word alignment follows the sheet without ear verification. G1 B01's shared close-overlay path was checked through the hook-off landing; its hook-on sequence and look-only LF06 composition were not rerendered as full sequences. G1's earlier CH-KID repeatability limitation remains open.
- Reproduce: `node scripts/hanako/render-g1.mjs --g3` (add `--motion`); `python3 -I scripts/hanako/measure-g1.py --g3` (`--sheets` / `--labels` for review sheets); `python3 -I scripts/caption-zone.py --band 860:1248 out/qa/hanako/g3/B*-f???.png`. No commit, push or PR created.
