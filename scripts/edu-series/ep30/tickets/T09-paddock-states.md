# T09 — the paddock set has continuous light, eaten and stubble states, blast lean, track ruts, a high view that does not stripe, and the fence seen from the track
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: blocked (two proof rows outside range, questions Q-A to Q-D in Result; the build itself is complete)
Class: set · Hard: no
Blocked by: T03 (`proof-paddock.tsx` exists) · Consumers: every space-P shot (B01, B02, B03, B05, B06)
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); brief [set plans, space P](../short/film-brief.md#set-plans-metres-estimates) and [known limits](../short/film-brief.md#w32-look-lock) (P2 stripes); b05 B05-SH04 Staging and Camera (fence reverse); [paddock.ts](../../../../src/painted/edu30/paddock.ts) (`PadLight`, `SUN`, `paintPadGround({eaten})`, `paintWheatRidges`, `paintWheatTexture`, `paintNearStalks`, `paintFence`).

## Build
Add the set states the timed sheets need to the locked paddock painter without changing the LF01a look at default options, and prove the reverse view across the fence from the track (B05-SH04).
Files: `src/painted/edu30/paddock.ts`, `src/painted/edu30/proof-paddock.tsx` (adds `P30-*` compositions), `tests/edu30-paddock.test.ts` (new)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| Light mix | every function taking `light?: PadLight` also accepts a number m 0..1 (0 `'morning'`, 1 `'west'`); sun = normalise(lerp(SUN.morning, SUN.west, m)); every sky and ground colour pair that differs between the two lights mixes by m (`mixColor`); shadow direction and length follow the sun vector | b06 B06-SH03 (time-lapse), b05 B05-SH03 |
| `stubble` option 0..1 on `paintWheatRidges`, `paintWheatTexture`, `paintNearStalks` | stalk height `WHEAT_H × (1 − 0.8 s)` (s 1 → 0.17 m), colour mix toward straw `#b89a62` by s, stroke count × (1 − 0.4 s); default 0 | b06 B06-SH03/SH04 |
| Eaten schedule (plates pass `eaten`) | B01: 0.3 · B02-SH01: 0.4 · B02-SH02 … B03-SH03: 0.4 · B05-SH01/SH02: 0.6 · B05-SH03, B05-SH04, B06-SH01, B06-SH02: 0.7 · B06-SH03: 0.7 → 1.0 over the jumps · B06-SH04: 1.0 | sheets; brief space P (patch grows B02 → B06) |
| Stubble schedule | 0 everywhere except B05-SH03 and B05-SH04: 0.4 · B06-SH03: 0.4 → 1.0 over the jumps · B06-SH04: 1.0 | b06 B06-SH03 ("wheat state 0.4 → 1.0") |
| Light schedule | m 0 everywhere except B05-SH03, B05-SH04: 1 · B06-SH03: 0 for local 0–58, the jump states local 59–94, 1 from local 95 · B06-SH04: 1 | b05, b06 Staging |
| `lean` option on `paintNearStalks` | `lean?: (x, z) => number` rad, tilt of each stalk away from `leanFrom` (V3) in the ground plane; B03-SH01 passes T04 `blastLean` for stalks 1–3 m ahead of the muzzle (0, 0.72, −1.1) | VD30-11 step 6 |
| Track ruts | in `paintPadGround`: two ruts along x at z 8.6 and 10.4, 0.25 m wide, `#6a4a32` (mixed toward the west ground tone by m), only on the track band z 7.5–11.5 | brief space P |
| High-view wheat (camera pitch ≤ −20°) | `paintWheatRidges` paints no ridge rows beyond 30 m from the camera; instead a flat wash (the ridge base colour) plus `paintWheatTexture` n 1400, d0 30, d1 200 and seeded broken patches (2–6 m, value ± 6 %); ridges within 30 m unchanged | brief w32 known limit (P2 stripes) |
| Fence from the track (B05-SH04) | camera on the track verge (−0.2, 1.35, 7.9) → (−0.25, 1.35, 7.7) looking north (yaw −6.6 → −4): ground under the lens is the track (z 7.5–11.5, ruts) then the verge z 6.0–7.5 (dry grass `#b59a6a`, sparse tussocks, 40 seeded marks), the fence at z 6.0 drawn **after** the birds (posts and three wires in front of the bodies; top wire y 1.02), the paddock beyond in west light, stubble 0.4, eaten 0.7. The gate gap x −4..−1 stays as locked (open gate swung to (−3.2, 8.6), behind the lens plane at z 8.6 → not in frame); F2 at x −1.4 stands just inside the gap edge with no wire in front, accepted | b05 B05-SH04; paddock.ts `paintFence` |
| Truck dust in B05-SH04 (Film fix) | not painted: the truck is on the track at x ≈ 36–40, z 9.5, behind the lens plane and about 85° off axis, so neither it nor a physical dust plume can be in frame; the receding putter in the sound carries the departure | b05 B05-SH04 Truck row |
| Defaults | with none of the new options set, output equals the locked painter | look lock |

References (store): `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (default look), `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TP2.png` (the striping to remove), `projects/edu/EDU/previews/EDU-EP30-W3-r1/thumbs/TP3.png` (west light).

## Proof
- `node scripts/test.mjs tests/edu30-paddock.test.ts`: light 0 and 1 give the same colours as `'morning'` and `'west'`; stubble 0 gives the locked stroke list.
- `proof-paddock.tsx` (newsreel off): `P30-LF01` (CAM_LF01, defaults), `P30-P2` (B02-SH01 start camera `eye (0, 22, 12), yaw 0, pitch −40, f 820, hy 960`, eaten 0.4), `P30-P3-m` at m 0, 0.5, 1 (B05-SH03 start camera `eye (−1.0, 1.55, 2.4), yaw 160, pitch 0, f 900, hy 820`, stubble 0.4, 0.7, 1.0), `P30-ruts` (eye (−2, 1.5, 14), yaw 0, pitch −10, f 900, hy 860), `P30-fence-rev` (B05-SH04 start camera, m 1, five 1.0 m test posts standing in for the fence birds at their x).
- `printf 'P30-LF01 0 out/edu30-T09/lf01.png\n…' | node scripts/stills.mjs src/painted/edu30/proof-paddock.tsx --gl=angle > out/logs/T09-stills.log 2>&1`; `scripts/qa-sheet.sh out/edu30-T09/sheet.png --cols 4 --width 270 out/edu30-T09/*.png`

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| P30-LF01 | the locked paddock | mean abs pixel difference vs a pre-change render ≤ 2 |
| P30-P2 | paddock and far flock from high, no regular stripes | row-mean luma over y 450–900, linear trend removed: peak-to-peak ≤ 12 (0–255) |
| P30-P3-m 0 / 0.5 / 1 | shadows swing from short NE-cast to long +x-cast; wheat shortens to stubble | fence-post shadow length at m 1 ≥ 2.5 × at m 0 (logged px) |
| P30-ruts | two dark ruts on the track | 2 ruts detected in the track band |
| P30-fence-rev | wires in front of the test posts, top wire near (501, 1033), a post near (1020, 991) | both within ± 30 px of the sheet projection |

## Result (Boss fills)
Commit: this commit on the Boss worktree branch (see index) · fix passes: 0 · proof sheets (store `projects/edu/EDU/previews/EDU-EP30-T09/`): `T09-sheet.png` (all eight frames), `T09-sheetB.png`, `T09-sheetC.png`, frames `T09-lf01.png`, `T09-p2.png`, `T09-p3-m0.png`, `T09-p3-m05.png`, `T09-p3-m1.png`, `T09-ruts.png`, `T09-fence-rev.png`, `T09-lean.png` (extra), baseline `T09-lf01-base.png`; local `out/edu30-T09/`.
Checks: `node scripts/test.mjs tests/edu30-paddock.test.ts` 8/8 pass (golden stroke-list hashes recorded from the pre-T09 `paddock.ts` for ridges, texture, stalks, fence, gum, camp, sky at default options). `npx tsc --noEmit -p .`: 0 errors in `src/painted/edu30/*` or the new test (other errors pre-existing: `three`, `@remotion/three` missing in this checkout). `npm test`: 228/244 pass; the 16 failures are the same environmental ones as T03 (`Cannot find module '@remotion/three'` through the registry imports).
Measured (proof frames viewed on the sheets):
| Frame | Number | Range | Result |
| --- | --- | --- | --- |
| P30-LF01 | mean abs diff vs pre-change render **0.000** | <= 2 | pass |
| P30-P2 | row-mean luma p2p, y 450-900, trend removed: **38.96** (63.64 before the value bands were dropped in the high view) | <= 12 | **outside** (Q-A) |
| P30-P3 | post shadow px at m 0 / 0.5 / 1: 168.9 / 76.3 / 632.5, ratio m1/m0 **3.75** | >= 2.5 | pass (the m 0.5 shadow is shorter than m 0: the lerped sun is near the zenith at the midpoint) |
| P30-ruts | 2 dark runs (luma 82 on a 118 track) in the track band along columns x 300, 540, 800 | 2 | pass |
| P30-fence-rev | top wire at x -0.5: (501, 1023) vs (501, 1033): within 30 px; post (1020, 991): nearest locked post x 0 top at (753, 987), **267 px off** | within 30 px | wire pass, post **outside** (Q-B) |
Built (all in `paddock.ts`, defaults unchanged): `PadLightArg`, `lightM`, `sunOf`, `shadowOf`, `skyColors`; light mix in `paintPadSky`, `paintGum` (canopy shadow follows the sun for a numeric light only), `paintCamp`; `stubble` on `paintWheatRidges`, `paintWheatTexture`, `paintNearStalks`; `lean` + `leanFrom` on `paintNearStalks`; `eaten` on ridges and texture; ruts z 8.6 / 10.4, 0.25 m, `#6a4a32`; high view (pitch <= -20 deg): ridges stop at 30 m, flat wash, texture n 1400 d 30..200, world-gridded broken patches (2-6 m, +-6 %), and the ground value bands are dropped; `paintVerge`; `postShadow`, and `paintFence(..., light?)` draws post shadows only when `light` is passed. `proof-paddock.tsx`: `P30-LF01`, `P30-P2`, `P30-P3-m0/m05/m1`, `P30-ruts`, `P30-fence-rev`, `P30-lean`, and `paintPaddockStates` (the paddock stack with the new options, used by the proofs).
Questions for Film (values the ticket left undecided or that conflict; none resolved by Boss):
- Q-A (P2 stripes): after removing the ridge rows and the ground value bands beyond 30 m, the stripes are gone (frame viewed, far field is flat with patches) but the literal measure stays 38.96 because rows 450-900 also contain the eaten patch (about -28 luma), the flock marks and two gums. Excluding the patch rows 640-790 gives 18.4; a strip x 240-310 gives 29.5. Decide the measure (columns, rows, or patch and flock off) or widen the range.
- Q-B (post at (1020, 991)): the locked posts stand at multiples of 3 m, so there is a post at x 0 (753, 987) and none near u 1020 (that would be x 0.6, where F3 stands). Decide whether the sheet number is a typo or the fence should shift (it would move the gate gap).
- Q-C (rut colour): "mixed toward the west ground tone by m" names no west ground tone and no ground colour differs between the lights, so the ruts are a constant `#6a4a32`. Give the tone or drop the clause.
- Q-D (undecided counts): the fifth test post x (only F2, HERO, F3, F4 at x -1.4, -0.5, 0.5, 1.4 are on the sheet; four posts were drawn), the tussock count (12 used) and the shadow colour/width (`mix(verge, #3a2c1c, 0.6)`, 0.14 m, chosen so it reads in the frame).
Also for Film: (1) the locked wire weight (0.7) is invisible in B05-SH04 at 1080 px (2-3 luma contrast against the verge); decide a wire weight for that view. (2) `paintPaddock` in `looks.ts` does not pass `eaten`/`stubble` to the ridges, so the plates (T29, T30, T32) need a composition like `paintPaddockStates` (in the proof file) or a `PadOpts` extension; and from the track side the clearing must be painted before the fence (it is last in `paintPaddock`). (3) `eaten` on ridges/texture is an addition: the ridges follow the grown patch only when `eaten` is passed; without it the locked rectangle still applies.
