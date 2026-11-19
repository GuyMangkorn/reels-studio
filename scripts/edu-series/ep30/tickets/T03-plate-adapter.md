# T03 — 28 registered EP30 plates exist (stubs) behind one adapter, with a QA still entry, a lead probe, the proof entries and the calibration sheet
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready (shot table depends on open Q7/Q8, see below)
Class: capability · Hard: no
Blocked by: T01, T02 · Consumers: every plate ticket (T19–T33); every proof composition (T04–T18); Editor (W5.3 composition)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); the EP26 pattern to copy: [edu26/shot.tsx](../../../../src/painted/edu26/shot.tsx), [edu26/shots/index.ts](../../../../src/painted/edu26/shots/index.ts), [edu26/shots-index.tsx](../../../../src/painted/edu26/shots-index.tsx), [shots/edu26.tsx](../../../../src/painted/shots/edu26.tsx); sheet [shot map](../short/scene-sheets/index.md#shot-map) and [units and conventions](../short/scene-sheets/index.md#units-and-conventions).

## Build
The EP26 plate adapter pattern for EP30: a `Shot30` type, one shot file per shot (28 stubs, each later owned by exactly one plate ticket so plate tickets never share a file), the shot table, the registry entry, a standalone QA still entry, a headless lead probe, the scale calibration sheet, and empty standalone proof entries that T04–T18 fill (so those tickets never share an entry file with a plate). Export the look helpers the plates reuse from `looks.ts` (add `export` only; no behaviour change).
Files: `src/painted/edu30/shot.tsx` (new), `src/painted/edu30/shots/index.ts` (new), `src/painted/edu30/shots/<SHOT-ID>.tsx` × 28 (new stubs), `src/painted/edu30/shots-index.tsx` (new), `src/painted/edu30/calibration.ts` (new), `src/painted/edu30/proof-fx.tsx`, `proof-paddock.tsx`, `proof-dam.tsx`, `proof-cast.tsx`, `proof-props.tsx`, `proof-flock.tsx` (new, each a `registerRoot` entry with no compositions yet), `src/painted/edu30/looks.ts` (exports only), `src/painted/shots/edu30.tsx` (new), `src/painted/registry.ts`, `scripts/edu-series/ep30/short/measure-shots.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Shot table (play order, `{id, start, N}`) | B01-SH01 0 90 · B01-SH02 90 59 · B01-SH03 149 51 · B02-SH01 200 155 · B02-SH02 355 85 · B02-SH03 440 54 · B02-SH04 494 98 · B02-SH06 592 75 · B03-SH05 667 21 · B03-SH01 688 72 · B03-SH02 760 51 · B03-SH03 811 57 · B04-SH01 868 56 · B04-SH02 924 69 · B04-SH03 993 47 · B04-SH04 1040 22 · B04-SH06 1062 24 · B04-SH05 1086 64 · B05-SH01 1150 60 · B05-SH02 1210 84 · B05-SH03 1294 94 · B05-SH04 1388 46 · B06-SH01 1434 110 · B06-SH02 1544 36 · B06-SH03 1580 99 · B06-SH04 1679 58 · B07-SH01 1737 118 · B07-SH02 1855 122; total **1977**, contiguous, asserted at module load. Retired IDs B02-SH05 and B03-SH04 never appear | index Shot map (SCENE-R2) |
| Registry ID | `EDU30-<SHOT-ID>` (e.g. `EDU30-B02-SH06`); no pre-roll; shot-local `L = round(tl × 30)` clamped to [0, N−1] | EP26 pattern |
| `Shot30` type | `{id; N; cam(L): YCam; paint(p, L, c, pr?): void; reel(L): {strength; tint; tintMix?; pop?}; shake?(L): {dx; dy; rot}; overscan?: boolean; paper: string}` | ticket |
| Default `reel` | `{strength: 1, tint: 'warm', tintAmount: 1, pop: 0}` (VD30-01a) | brief w32-look-lock |
| Screen order in the plate overlay | `Grade` → `NewsreelPicture` (plate canvas) → `NewsreelOverlay` → `Grain` (0.06) → `NewsreelTitle` for the shot's rows in `TITLES` (T02); nothing else (captions, mark, label, caption shade are the Editor's) | brief technical handoff, Composition seam |
| Shake | `translate(dx, dy) rotate(rot)` on the plate canvas element only, inside the newsreel weave; titles and overlay never move | VD30-11 step 5 |
| Overscan shots | `overscan: true` on **B03-SH01 and B04-SH03 only** (the two bursts). The plate canvas is scaled 1.05 about (540, 960) for the whole shot and the camera compensates exactly: `f' = f / 1.05`, `hy' = 960 + (hy − 960) / 1.05`, so every projected point equals the sheet numbers; margin 27 px x, 48 px y. B03-SH02 has no shake: round 23 (B03-SH01 local 68) decays by local 70, before the cut at 72 (Film fix: the sheet's "decays across the cut" cannot happen) | VD30-11 step 5; b03 B03-SH01 Cut |
| Stub shot files | each exports a `Shot30` with the sheet camera line at L 0 held still, `paint` = sky wash `#efe6d0` + ground `#8a7253` below the horizon row; plate tickets replace the body | ticket |
| Paper | `#efe6d0` B01–B06, `#e8d8b8` B07 | looks.ts (W3) |
| QA entry `shots-index.tsx` | one composition per shot (`EDU30-<ID>`, N frames) plus `EDU30-SEQ` (1977 f, `shotAt(G)`, hard cuts) and `EDU30-CAL`; input props `guides` (default true: dashed caption band y 1150–1344 and the y 1100 line) and `tag` (default true: shot ID, G and L, "EDU-EP30 preview"); clean frames with `--props='{"guides":false,"tag":false}'` | EP26 pattern; index caption band |
| Proof entries | `proof-<topic>.tsx`: `registerRoot` with a `Proof30` helper that takes `{id, N, cam(L), paint(p, L, c), reel?}` and the same guides/tag props; each later ticket adds its compositions named in its own Proof section | ticket (keeps T04–T18 off the plate files) |
| Probe | `pr.lead(name, {top, bottom, x})` records feet-to-head spans in px; `measure-shots.ts <SHOT-ID> <L,L,…>` prints `SHOT L name top bottom h x` per lead per frame without a browser (as `measure-looks.ts`) | ticket |
| Exports from `looks.ts` | `paintPaddock`, `PadOpts`, `crewAtGun`, `crewAtDam`, `HERO_LF01`, `onBank`, `CAM_LF01`, `CAM_LF02`, `CAM_LF03`, `CAM_A2`, `LF02_MARKS`, `LF02_DAM`, `armsLook`, `KP_EYE`, `KP_AT`, `kp` | ticket |
| Calibration sheet `EDU30-CAL` | space P, `SUN.morning`, newsreel strength 0: MEREDITH `P01` front at (−1.2, 0, 0), EMU-HERO `EMU_POSES.stand()` heading −π/2 at (0, 0, 0), G1 `buildLewisGun()` side at (1.2, 0, 0); camera eye (0, 0.9, 6.0), yaw 0, pitch 0, f 1000, hy 960 | brief technical handoff, Scale baseline |

**Open-question dependency.** The table is SCENE-R2 as written. Q7 (index O8) could move the B04-SH06 / B04-SH05 boundary from 1086 to 1076 or 1096; Q8 (O9) could move B03-SH05 / B03-SH01 from 688 to 704. Either answer changes two rows of the table only; Film then bumps this ticket to r2.

## Proof
- `npx tsc --noEmit -p . > out/logs/T03-tsc.log 2>&1; tail -5 out/logs/T03-tsc.log` · `npm test > out/logs/T03-test.log 2>&1; tail -15 out/logs/T03-test.log` (includes `scripts/context-map.py`)
- `printf 'EDU30-CAL 0 out/edu30-T03/CAL.png\nEDU30-SEQ 0 out/edu30-T03/SEQ_0000.png\nEDU30-SEQ 993 out/edu30-T03/SEQ_0993.png\nEDU30-SEQ 1086 out/edu30-T03/SEQ_1086.png\nEDU30-SEQ 1976 out/edu30-T03/SEQ_1976.png\nEDU30-B03-SH01 0 out/edu30-T03/B03-SH01_L0.png\n' | node scripts/stills.mjs src/painted/edu30/shots-index.tsx --gl=angle > out/logs/T03-stills.log 2>&1`
- `scripts/qa-sheet.sh out/edu30-T03/sheet.png --cols 6 --width 270 out/edu30-T03/*.png` and view it; `npx tsx scripts/edu-series/ep30/short/measure-shots.ts CAL 0`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| CAL 0 | man, emu and gun side by side on one ground line, emu head level with the man's head (the brief's joke) | MEREDITH h and EMU h each 283 ± 15 px (1000 × 1.70 / 6.0); gun length 213 ± 15 px |
| SEQ 0 / 993 / 1086 / 1976 | tag shows B01-SH01 L0 / B04-SH03 L0 / B04-SH05 L0 / B07-SH02 L121 | exact shot and L |
| B03-SH01 L0 | stub with overscan; tag and guides unscaled | guide line at y 1100 exactly |
| tests | context map, tsc | 0 errors |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
