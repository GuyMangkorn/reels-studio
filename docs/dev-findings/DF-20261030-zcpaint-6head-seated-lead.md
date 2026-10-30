# DF-20261030-zcpaint-6head-seated-lead — seated lead and sofa numbers in the sheets do not match the 6-head geometry

- Owner: Boss; first observed: 30 Oct 2026 (pass 7, S-P12 6-head model sheet); last checked: 30 Oct 2026
- Status: open (pass 9: the seated neck is fixed, torso 1.8 heads and chin 0.27 head above the shoulder line; B09-SH01 at d 0.60 and 20 deg is 488.8 px (was 484.4), B09-SH03 lift 497.6 px, B07 sofa at d 0.75 594.9 px (was 614.0); Mark to revalidate the sheet's head and neck numbers)
- Type: spec-conflict (sheet numbers) and measure definition
- Tags: 2D / lead / seated / proportions / measure
- Scope: `src/painted/zcpaint/body6.ts` `figSeatFloor`, `figSeatSofa`, `topPx`, `skullTopPx`; sheet `storyboards/zombie-condo-paint/short/sc01-b09-b10.md` (B09 rows, RK-28) and `sc01-b06-b08.md` (B07 row); brief `VB-ZCPAINT-SHORT-R2.5` `BODY-ZCP-6H`
- Consumers: S-P12 model sheet (look check only); B09-SH01 and B09-SH03 (`ZCP-B09-*`, not rebuilt); B07-SH02; B06 walk for the 480 px rule

## Symptoms and evidence
- The sheet's seated knee at 0.5 m cannot be reached with the brief's landmark thigh (hip 3.0 to knee 1.75 heads is 1.25 heads vertical). Pass 7 uses the spike's thigh 1.42 heads and shin 1.48 heads (two-bone knee, knee about 0.41 m high).
- B09 at d 0.55 (`SEC-2D-LL` U 565, 517.6 px/m), artwork top = hair tufts included (`topPx`):
  - upright 505 px (skull only 487 px);
  - head pitched down 20° (the sheet row): 488 px by geometry, 497 px by bbox on `ZCPAINT-S-P12-M4` (pass 7b);
  - pitched down 12°: 498 px (bbox 505, `M5`); lifted 15° (SH03): 502 px (bbox 511, `M6`).
  The rule (≥ 480 px) holds at every pitch above only because the hair tufts count. Skull-only at 12° is 479.5 px.
- B07 sofa: the sheet gives head top z 1.27 m and lead 594 px. Geometry gives the artwork top at 1.44 m (617 px bbox, `M7`) and the skull at 1.40 m. The sheet's own 1.27 m does not reproduce its 594 px.
- Floor contact: with the hip joint at 0.2 head the thigh (radius 0.32 head) sank 0.12 head (15 px at 447 px/m) into the floor. Pass 7 raised the hip to 0.34 head.

## Attempts and results
- Hip 0.34 head and torso 1.45 heads (the standing hip-to-shoulder length): seated skull crown 3.32 heads, sheet 3.34. Contact checked on `S-P12-C`.
- Sofa thigh 8.5° from horizontal, shin vertical, both feet on the floor (`figSeatSofa`, unit test).
- The lead measure counts visible artwork (`bbox.py` on bare compositions, no floor and no shadow). Geometry and bbox agree within 5 px.

## Planning impact
- Mark: revalidate RK-28 and the B07 head-top and lead values against the geometry above; the sheets' seated lead should state whether hair tufts are counted.
- Film: the brief's `BODY-ZCP-6H` thigh and knee values (landmark table) and the seated knee height need one reconciled set; pass 7 used the spike's values.
- User (30 Oct 2026, look check via coordinator): B09-SH01 head pitch 20° (sheet row) accepted; the rule holds by 8 px (geometry) and 17 px (bbox). Hair tufts must stay in the lead measure.
- Boss: no production plate rebuilt; re-measure after any pitch or hip change with `scripts/zombie-condo-paint/s-p12-sheet.sh`.

## Revalidation history
- 30 Oct 2026, pass 9 → `topPx` at d 0.60 (`out/logs/zcp-p9-seated-lead.log`, `out/painted/zcpaint/p9/measure/`); neck tube length 0.27 head (`tests/zcpaint-body6.test.ts`); the crown height is unchanged on the floor figure → open for the sheet numbers.
- 30 Oct 2026, pass 7b → bbox re-measured (`out/logs/zcp-s-p12-run5.log`); the seated geometry is unchanged, only the sleeves and the infected body moved.
- 30 Oct 2026, pass 7 → geometry (`out/logs/zcp-s-p12-body6-test-1.log`) and bare-composition bbox (`out/painted/zcpaint/s-p12/measure/`) → open.
