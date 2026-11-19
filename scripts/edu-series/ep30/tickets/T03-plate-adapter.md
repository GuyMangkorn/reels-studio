# T03 — 26 registered EP30 plates exist (stubs) behind one adapter, with a QA still entry, a lead probe and the calibration sheet
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
Class: capability · Hard: no
Blocked by: T01, T02 · Consumers: every plate ticket (T15–T26); Editor (W5.3 composition)
Model: sonnet, medium

Read first: [index common rules](index.md#common-rules); the EP26 pattern to copy: [edu26/shot.tsx](../../../../src/painted/edu26/shot.tsx), [edu26/shots/index.ts](../../../../src/painted/edu26/shots/index.ts), [edu26/shots-index.tsx](../../../../src/painted/edu26/shots-index.tsx), [shots/edu26.tsx](../../../../src/painted/shots/edu26.tsx); sheet [shot map](../short/scene-sheets/index.md#shot-map) and [units and conventions](../short/scene-sheets/index.md#units-and-conventions).

## Build
The EP26 plate adapter pattern for EP30: a `Shot30` type, one shot file per shot (26 stubs, each owned later by its plate ticket so plate tickets never share a file), the shot table, the registry entry, a standalone QA still entry, a headless lead probe, and the scale calibration sheet the brief asks for. Export the look helpers the plates reuse from `looks.ts` (add `export` only; no behaviour change).
Files: `src/painted/edu30/shot.tsx` (new), `src/painted/edu30/shots/index.ts` (new), `src/painted/edu30/shots/<SHOT-ID>.tsx` × 26 (new stubs: B01-SH01 … B07-SH02), `src/painted/edu30/shots-index.tsx` (new), `src/painted/edu30/calibration.ts` (new), `src/painted/edu30/looks.ts` (exports only), `src/painted/shots/edu30.tsx` (new), `src/painted/registry.ts`, `scripts/edu-series/ep30/short/measure-shots.ts` (new), `docs/context-map.md` (new EP30 W5.2 line naming every new file above)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Shot table | 26 rows `{id, start, N}` exactly as the sheet shot map (global start, frame count); total 2012; contiguous; asserted at module load | index.md Shot map |
| Registry ID | `EDU30-<SHOT-ID>` (e.g. `EDU30-B01-SH01`); no pre-roll (pre = 0); shot-local `L = round(tl × 30)` clamped to [0, N−1] | ticket (EP26 pattern) |
| `Shot30` type | `{id; N; cam(L): YCam; paint(p, L, c, pr?): void; reel(L): {strength; tint; tintMix?; pop?}; shake?(L): {dx; dy; rot}; overscan?: boolean; paper: string}` | ticket |
| Default `reel` | `{strength: 1, tint: 'warm', tintAmount: 1, pop: 0}` (look lock VD30-01a) | brief w32-look-lock |
| Screen order in the plate overlay | `Grade` → `NewsreelPicture` (plate canvas) → `NewsreelOverlay` → `Grain` (0.06) → `NewsreelTitle` for the shot's rows in `TITLES` (T02); nothing else (captions, mark, label, caption shade are the Editor's) | brief technical handoff, Composition seam |
| Shake | the transform `translate(dx, dy) rotate(rot)` applies to the plate canvas element only, inside the newsreel weave; titles and overlay never move | VD30-11 step 5 |
| Overscan (shots with `overscan: true`: B03-SH01, B03-SH02, B04-SH03) | the plate canvas is scaled 1.05 about the frame centre (540, 960) for the whole shot, and the shot's camera compensates exactly: `f' = f / 1.05`, `hy' = 960 + (hy − 960) / 1.05`, so every projected point equals the sheet numbers; margin 27 px x, 48 px y | ticket (VD30-11 "overscan ≥ 24 px") |
| Stub shot files | each exports a `Shot30` with the sheet camera line at L = 0 held still, `paint` = sky wash `#efe6d0` + ground `#8a7253` below the horizon row; plate tickets replace the file body | ticket |
| Paper | `#efe6d0` for B01–B06, `#e8d8b8` for B07 (W3 look values) | looks.ts |
| QA entry `shots-index.tsx` | one composition per shot (`EDU30-<ID>`, N frames) plus `EDU30-SEQ` (2012 f, `shotAt(G)`, hard cuts) and `EDU30-CAL`; input props `guides` (default true: dashed caption band y 1150–1344 and the y 1100 line) and `tag` (default true: shot ID, G and L, "EDU-EP30 preview"); clean frames with `--props='{"guides":false,"tag":false}'` | EP26 pattern; index Caption band |
| Probe | `pr.lead(name, {top, bottom, x})` records feet-to-head spans in px; `measure-shots.ts <SHOT-ID> <L,L,…>` prints one line per lead per frame `SHOT L name top bottom h x` without a browser (as `measure-looks.ts`) | ticket |
| Exports from `looks.ts` | `paintPaddock`, `PadOpts`, `crewAtGun`, `crewAtDam`, `HERO_LF01`, `onBank`, `CAM_LF01`, `CAM_LF02`, `CAM_LF03`, `CAM_A2`, `LF02_MARKS`, `LF02_DAM`, `armsLook` | ticket |
| Calibration sheet `EDU30-CAL` | space P at noon-flat light (`SUN.morning`), no newsreel (strength 0): MEREDITH `P01` front at (−1.2, 0, 0), EMU (`EMU_POSES.stand()`, hero) heading −π/2 side view at (0, 0, 0), G1 `buildLewisGun()` side at (1.2, 0, 0); camera eye (0, 0.9, 6.0), yaw 0, pitch 0, f 1000, hy 960 | brief technical handoff, Scale baseline |

## Proof
- `npx tsc --noEmit -p . > out/logs/T03-tsc.log 2>&1; tail -5 out/logs/T03-tsc.log` · `npm test > out/logs/T03-test.log 2>&1; tail -15 out/logs/T03-test.log` (includes `scripts/context-map.py`)
- Stills: `printf 'EDU30-CAL 0 out/edu30-T03/CAL.png\nEDU30-SEQ 0 out/edu30-T03/SEQ_0000.png\nEDU30-SEQ 1037 out/edu30-T03/SEQ_1037.png\nEDU30-SEQ 2011 out/edu30-T03/SEQ_2011.png\nEDU30-B03-SH01 0 out/edu30-T03/B03-SH01_L0.png\n' | node scripts/stills.mjs src/painted/edu30/shots-index.tsx > out/logs/T03-stills.log 2>&1`
- `scripts/qa-sheet.sh out/edu30-T03/sheet.png --cols 5 --width 270 out/edu30-T03/*.png` and view it; `npx tsx scripts/edu-series/ep30/short/measure-shots.ts CAL 0`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| CAL 0 | man, emu and gun side by side on one ground line, emu head level with the man's head (the brief's joke) | MEREDITH h and EMU h each 283 ± 15 px (f 1000 × 1.70 / 6.0); gun length 213 ± 15 px |
| SEQ 0 / 1037 / 2011 | tag shows B01-SH01 L0 / B04-SH03 L0 / B07-SH02 L127 | exact shot and L |
| B03-SH01 L0 | stub with overscan; tag and guides unscaled | guide line at y 1100 exactly |
| tests | context map, tsc | 0 errors |

## Result (Boss fills)
Commit · proof sheet path · measured numbers · fix passes used · open question, if blocked
