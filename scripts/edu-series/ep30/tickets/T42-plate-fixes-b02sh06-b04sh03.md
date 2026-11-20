# T42 — plate fixes: B02-SH06 near field birds culled (T22 fix pass 2) and B04-SH03 spouts in the shallows + one casing spec (T27 fix pass 1)
Deliverable: EDU-EP30-SHORT · Revision: **r2** (`EDU-EP30-TICKETS-R11`: B04-SH03 accepted; B02-SH06 rows H1/H2 restated, see [r2](#r2-film-r11-b02-sh06-only)) · Status: **ready** (B02-SH06 only; T22 fix pass 2, the last)
Class: set (fix bundle, two plates) · Hard: yes (CAT02 bird reading; effects)
Blocked by: none (T22 r8, T27, T28 built) · Consumers: B02-SH06, B04-SH03
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (CAT02); [T22](T22-plate-b02-sh06-heads.md) r8 rows and Result; [T27](T27-plates-b04-burst-jam.md) Result; [T28](T28-plates-b04-gunner-watch.md) Result item 3 (`B04_CASINGS`).

**Fix-pass cap.** This is T22's **second and last** fix pass (cap reached after it) and T27's first. Anything still off in B02-SH06 after this pass is Film's value change or accept, not another pass.

## Why (Film, R10 look check)
- **B02-SH06** (viewed `T22r8-sheet.png`, `T22r8-ll74-box.png`): F1, F1b and F3 pass; the near stalks no longer turn dark. The lower-left dark mass at L 52–74 is the nearest heads-field birds seen from above as the crane rises: their body and wing flats show as dark angular slabs, and at L 52 one reads as a bird lying flat in the wheat (CAT02). The luma row was a proxy; the fix is to remove those birds, not to repaint the ridge stalks (the ridge stalk colour is accepted as built).
- **B04-SH03** (viewed `T27-sheet.png`): flash, stop dead, smoke and the queue pass; the "water kicked up by the spouts" does not read because 10 of 11 strikes land on the dry rim. The casings use their own spec while B04-SH06/SH05 use `B04_CASINGS`; one spec keeps the three shots in agreement.

## Build
Files: `src/painted/edu30/shots/B02-SH06.tsx`, `src/painted/edu30/shots/B04-SH03.tsx` (reads, never writes, `shots/B04-SH06.tsx`).

## Decided values
| Row | What | Value | Source |
| --- | --- | --- | --- |
| H1 | B02-SH06 near-bird cull | compute once, at the L 74 camera (`stackCam(def, 74)`), the screen point of each `headsField` bird's ground anchor; drop from **every** frame each bird whose ground point projects below **y 1450** or whose camera distance at L 74 is **< 6.0 m**. Same set every frame (no popping); the six rising groups and their timing unchanged for the birds kept | ticket |
| H2 | B02-SH06 count | heads up at L 74: **≥ 28** (was 36); log the count kept | ticket |
| H3 | B02-SH06 rest | F1, F1b, F2 stalk fade, F3 even tone, leads and caption rows as r8 built; the F2 luma row is **withdrawn** (R10): lower-left 300 × 300 box luma at L 74 logged only | Film R10 |
| W1 | B04-SH03 strikes | 11 strikes as built (count, seed 9300, minDist 1.5 against `queueAvoid`, x −1.0 … +1.4) with the z rule split: strikes i = 1, 2, 4, 5, 7, 8, 10 at `z = −5.70 − 0.50·r` (in the shallows: spouts), strikes i = 0, 3, 6, 9 at `z = −4.9 − 0.7·r` as built (mud on the rim). Each point keeps its `overWater` test for spout vs mud | Boss T27 note 2 |
| W2 | B04-SH03 casings | import `B04_CASINGS` from `./B04-SH06` and paint the casings of SH03 from it (`paintCasings` with that spec at the shot clock); the plate's own casing spec is deleted. Visible or not, log how many casings land inside the SH03 frame (with the factual right-side ejection most fall uphill, off frame: accepted) | Film R10 (one spec, TF57) |
| W3 | B04-SH03 rest | everything else as built; no GUNNER-1 forearm in frame is accepted (R10, TF55) | Film R10 |

**Judgment for the builder.** B02-SH06: as the crane rises, only heads and necks come out of the wheat; no dark slab, no body seen lying down anywhere in the lower half. B04-SH03: the burst throws several white spouts out of the shallows near the far shore while the mud kicks on the rim; no strike lands within 1.5 m of a bird.

## Proof
- Stills (clean and guides-on) → `out/edu30-T42/`: B02-SH06 L 0, 30, 52, 58, 64, 74; B04-SH03 L 10, 19, 25, 27, 42, 43. Sheet `scripts/qa-sheet.sh … --cols 6 --width 270`; 540 px crops: B02-SH06 lower half at L 52 and L 74, B04-SH03 strike area at L 19 and L 27. `measure-shots.ts B02-SH06 0,74`, `B04-SH03 10`. Archive `out/edu30-T42` as `T42-*.png`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| B02-SH06 L 52, 58, 64, 74 | heads-only field; no dark slab or lying-bird shape in the lower half | viewed at 270 and 540 px; heads kept **≥ 28** (logged); birds dropped logged with ids |
| B02-SH06 L 0, 74 | leads unchanged | EMU-HERO L 0 **594 ± 10**, L 74 **326 ± 10**; MEREDITH L 0 **141 ± 15** to the head top |
| B02-SH06 L 0, 4, 8, 12 | three men read (r8 F1) | unchanged: cover **≤ 25 %** (r8 11.4 %) |
| B04-SH03 L 19 / 25 / 27 | several spouts out of the water, mud on the rim | spouts over water **≥ 6** of 11 (logged by `overWater`); nearest bird to any strike **≥ 1.5 m** over L 0–46 (logged) |
| B04-SH03 L 42 / 43 | stop dead holds | shake 0 at both; smoke centroid moves **≥ 1 px** |
| B04-SH03 L 10 | flash and muzzle unchanged | muzzle **(633, 832) ± 3** |
| caption zone (TF46) | clean B02-SH06 L 0, L 74; B04-SH03 L 10 | pass |
| smoke (TF56) | B04-SH03 L 42 | analytic smoke bound **≤ 0.46**, blast **≤ 0.40** (as built 0.451 / 0.393) |

## Result (Boss fills)
Commit: see git log (`T42`). Proof (store `projects/edu/EDU/previews/`, T42-prefixed): `T42-T42-sheet.png` (B04-SH03 L 10, 19, 25, 27, 42, 43, guides on, viewed), `T42-s03_L*.png` (guides on), `T42-c03_L*.png` (clean), `T42-T42-c03_L19.png` and `T42-T42-c03_L27.png` (540 px, viewed; the double prefix is a naming slip, the files are the 540 px crops).

**B04-SH03 built (W1, W2, W3).** W1: strikes i = 1, 2, 4, 5, 7, 8, 10 at `z = -5.70 - 0.50r`, the rest as built. W2: `B04_CASINGS` imported from `./B04-SH06`, the plate's own `CASINGS`/`A0` deleted.
- Spouts over water: **7 of 11** (row >= 6): pass. Nearest bird to any strike over L 0-46: **1.79 m** (row >= 1.5): pass. Muzzle L 10 **(633, 832)**: pass. Caption zone clean L 10 mean 0.714, p95 0.984; L 42 mean 0.661 (band 1150:1344, max-mean 0.80, max-p95 0.99): pass. Casings landing inside the SH03 frame at some frame: **11 of 11**. Viewed at 270 and 540 px: the spouts in the shallows show as small white marks on the pale water at left and are faint, mud kicks on the rim read; Film judges whether faint is enough.
- Not measured: shake 0 at L 42/43 and smoke centroid >= 1 px and the analytic smoke bound (smoke, shake and blast code untouched; `measure.py` absent, TF56); EMU-HERO and caption rows of B02-SH06 (not built).

**B02-SH06 not built: H1 and H2 conflict (blocked, no fix pass used).** At `stackCam(def, 74)` the heads-field birds have ground y (px) and camera distance (m) as follows: rule "y > 1450 or distance < 6.0 m" drops **27** of 36 (kept **9**, dropped ids 1, 3, 4, 5, 6, 8, 9, 10, 11, 14, 16, 18-24, 26, 28-35); y > 1450 alone drops 12 (kept 24); distance < 6.0 alone drops 26 (kept 10). H2 (>= 28 kept) cannot hold with H1 under any form. Question for Film: relax to y-only (24 kept) or a smaller distance limit, or accept the near birds hidden by a different method (e.g. drop only those under the lower-left dark region, ids with y > 1450 and distance < 3.5 m), or accept B02-SH06 as built (cap reached). Nothing in B02-SH06.tsx changed.

Fix passes used: T27 1 (done), T22 pass 2 not spent.

<a id="r2-film-r11-b02-sh06-only"></a>
## r2 — Film R11 (2026-11-20): B04-SH03 accepted; B02-SH06 only, T22 fix pass 2 (last)
Viewed `T42-T42-sheet.png`, `T42-T42-c03_L19.png`, `T42-T42-c03_L27.png` (B04-SH03) and `T22r8-sheet.png` (B02-SH06 r8).

**B04-SH03: accepted as built (TF69); not re-rendered in r2.** 7 of 11 strikes over water, nearest bird 1.79 m, muzzle (633, 832), caption zone pass, one casing spec. The spouts are faint white on the palest part of the frame (the lit shallows); the miss is carried by the mud kicks on the rim, the flash, the stop dead and the queue that never breaks. A darker spout tone would be a change to the shared T05 spout in `kit/gunfire.ts` for one shot; not taken. Smoke, shake and blast rows: code untouched, analytic values as T27 built (0.451 / 0.393, TF56). T27 closes with fix pass 1.

**B02-SH06: build now.** Boss's measurements show H1's distance term drops 26 of 36 birds (every bird near the crane); the slabs on `T22r8-sheet.png` (L 52 lying shape lower left, dark wedges at L 58, 64, 74 lower left) all sit in the lower quarter of the frame, which is what the y term catches. H1 and H2 are replaced by H1r2 and H2r2; H3 stands.

| Row | What | Value | Source |
| --- | --- | --- | --- |
| H1r2 | near-bird cull | at the L 74 camera (`stackCam(def, 74)`) project each `headsField` bird's ground anchor; drop from **every** frame each bird whose ground point is below **y 1450** (Boss r1 log: 12 dropped, 24 kept). The distance term is **withdrawn**. Same set every frame (no popping); the six rising groups and their timing unchanged for the birds kept | Film R11, TF70 |
| H1b | L 52 backstop | after H1r2, view L 52, 58, 64 at 540 px (lower half). If a dark slab or a lying shape remains, also drop every bird whose ground point is below y 1450 at the L 52 camera (`stackCam(def, 52)`), as long as heads kept stay **≥ 20**; if that union would keep fewer than 20, keep H1r2 alone and log the ids that would have gone | Film R11 |
| H2r2 | count | heads kept **≥ 20** (24 expected from H1r2); log kept count and dropped ids | Film R11, TF70 |
| H3 | rest | unchanged (r1 row) | Film R10 |

**Judgment for the builder.** As r1: as the crane rises only heads and necks come out of the wheat; no dark slab, no body seen lying down in the lower half. Do not repaint stalks, change the camera or move birds; removing birds is the whole fix.

**Proof (r2).** Files: `src/painted/edu30/shots/B02-SH06.tsx` only. Stills (clean and guides-on) → `out/edu30-T42r2/`: B02-SH06 L 0, 4, 8, 12, 30, 52, 58, 64, 74. Sheet `scripts/qa-sheet.sh out/edu30-T42r2/sheet.png --cols 5 --width 270 …`; 540 px crops of the lower half at L 52 and L 74. `measure-shots.ts B02-SH06 0,74`. Archive `out/edu30-T42r2` as `T42r2-*.png`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| B02-SH06 L 52, 58, 64, 74 | heads-only field; no dark slab or lying-bird shape in the lower half | viewed at 270 and 540 px; heads kept **≥ 20** (logged); dropped ids logged |
| B02-SH06 L 0, 74 | leads unchanged | EMU-HERO L 0 **594 ± 10**, L 74 **326 ± 10**; MEREDITH L 0 **141 ± 15** to the head top |
| B02-SH06 L 0, 4, 8, 12 | three men read (r8 F1) | cover **≤ 25 %** (r8 11.4 %) |
| caption zone (TF46) | clean L 0, L 74 | `--band 1150:1344 --max-mean 0.80 --max-p95 0.99` pass |

**Cap and acceptance (decided now, no R12 look check).** This is T22's last pass. If every r2 row passes, B02-SH06 is accepted by this ticket's result; the coordinator views `T42r2-sheet.png` before handing on. If a slab still shows after H1b, B02-SH06 is accepted with the r2 build as it stands (Film R11: fewer slabs than r8; no further Boss pass, no user gate). If a lead or cover row fails (it should not: no camera or cast code changes), revert `B02-SH06.tsx` to r8 (`3d963b8`) and B02-SH06 is accepted as r8 built.

## Result r2 (Boss fills)
Commit: see git log (`T42 r2`) · Status: **done, outcome 2: B02-SH06 accepted as the r2 build stands (slab remains after the backstop; no further pass).** Proof (store `projects/edu/EDU/previews/`, T42r2-prefixed): `T42r2-sheet.png` (L 0, 4, 8, 12, 30, 52, 58, 64, 74, guides on, viewed), `T42r2-s06_L*.png` (guides on), `T42r2-c06_L*.png` (clean), `T42r2-ll52.png` and `T42r2-ll74.png` (540 px lower-half crops, viewed); local `out/edu30-T42r2/`.

- **H1r2 / H2r2:** a bird is dropped from every frame when its ground point `[x, 0, z]` projects below y 1450 at `stackCam(def, 74)`. Dropped **12** of 36 (ids 1, 3, 4, 5, 6, 16, 18, 26, 29, 30, 32, 35); kept **24** (row >= 20): pass. Six groups and timing of the kept birds unchanged.
- **H1b:** at L 52 the same rule drops 15 ids (1, 3, 4, 8, 10, 18, 19, 22, 24, 26, 28, 30, 33, 34, 35); the union with L 74 is 20 ids and would keep **16 (< 20)**, so H1r2 stands alone. Ids that would have gone in addition: 8, 10, 19, 22, 24, 28, 33, 34.
- **Looked at (270 and 540 px):** L 52 lower half clean (heads and necks only, one bird body at the far top of the crop). L 58, 64, 74: heads and necks read, but **dark slabs remain** in the lower half (two oval flats mid-frame at L 74, wedges lower left and right at L 58/64, a dark wedge left at L 64). Per the ticket's cap rule: accepted as the r2 build stands (Film R11: fewer slabs than r8).
- **Leads (`measure-shots.ts B02-SH06 0,74`), unchanged from r8:** EMU-HERO L 0 **594** (594 +- 10), L 74 **326** (326 +- 10); MEREDITH L 0 152 to the hat top = 141.5 to the head top (141 +- 15): pass.
- **Caption zone (band 1150:1344, max-mean 0.80, max-p95 0.99), clean:** L 0 mean 0.696, p95 0.885, pass; L 74 mean 0.750, p95 0.874, pass.
- **Cover (L 0, 4, 8, 12):** the crew, camera and cast code are untouched (only the field-bird list and one import changed), so the r8 figure 11.4 % stands; not re-probed (the ad-hoc probe was never committed). The sheet shows three men at L 0-12.
- Fix passes used: T22 2 of 2 (cap reached). Sonnet medium, 20 Nov 2026.
