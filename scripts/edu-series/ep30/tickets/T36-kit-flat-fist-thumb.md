# T36 — an unshaped kit figure can close a thumbed fist on a held point (the GUNNER-1 grip and stock), and T11's proofs show the thumb
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: built, Film look check pending (r1 built 2026-11-20; two rows could not follow the ticket's words, see Result)
Class: capability · Hard: yes (hand)
Blocked by: T11 (done; same files `edu30/cast.ts`, `proof-cast.tsx`, `tests/edu30-cast.test.ts`) · Consumers: T11 (proof re-render), T12, T17, T18 (crew fists, the cocking pull, the order chop), T24 (B03-SH01 back view), T27 (B04-SH03 right forearm and mitten), T29 (B05-SH01/SH02 right profile), T22, T23 (through T12); any later unshaped figure holding a prop
Model: sonnet, medium

Read first: [common rules](index.md#common-rules) (Hard-ticket checks); [T11 r4 decisions](T11-seated-gunner.md) (why); [hand-drawing skill](../../../../.claude/skills/hand-drawing/SKILL.md) §1, §2, §4, §7; [UT14](../../../../docs/user-taste.md) (a closed fist is a round shape with the thumb across and two or three short strokes); [kit/draw.ts](../../../../src/painted/kit/draw.ts) `fistParts`; [kit/cast.ts](../../../../src/painted/kit/cast.ts) (`Arm.fist`, `Arm.exact`, the shaped-path fist block, the unshaped oval hand); [kit/back.ts](../../../../src/painted/kit/back.ts) (the back-view hand `ell`).

## Build
The unshaped kit figure draws every hand as a plain skin oval, so `Arm.fist` (the thumb side) is invisible outside `InteriorLight.shaped`. Add an opt-in flat fist to the unshaped front/profile/three-quarter path and the back view: the `fistParts` outline filled flat in the hand's skin colour, its three finger creases and the thumb crease in the figure's ink line, centred on the held point. Shared kit change with an unchanged default: no existing character, episode or locked look moves. Then switch T11's `grip`/`stock` path to it and record the thumb checks T11 could not.
Casting line: `new: flat-fist-thumb` (kit hand), on GUNNER-1 `man-crop + new: aus-army-1932-gunner`, `new: seated-gunner`.
Files: `src/painted/kit/cast.ts`, `src/painted/kit/back.ts`, `src/painted/edu30/cast.ts` (pass the option on the `grip`/`stock` chains only), `src/painted/edu30/proof-cast.tsx` (no new entry; re-render), `tests/kit-flat-fist.test.ts` (new), `tests/edu30-cast.test.ts`, `docs/context-map.md` (add the new test to the entry that lists `kit/cast.ts`)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| New field | `Arm.flatFist?: boolean`; default absent = today's oval exactly. Takes effect only with `fist: 1 \| −1` set and the light not `shaped` (the shaped path keeps its own fist) | ticket |
| Shape | `fistParts(o, ang, hu, fist)` as the shaped path calls it (same `ang` = the forearm direction, same `hu`): `back` filled flat with the skin colour the oval uses (`skinShade` in back.ts, the unshaped hand fill in cast.ts), no form shading; `creases` (3) and `thumbCrease` stroked in the figure's ink line weight | UT14; draw.ts |
| Placement | `fistParts` builds from its origin forward 0.093 hu along `ang`; the origin is set to `T − 0.045 · hu · (forearm unit vector)` so the fist's centre (u ≈ 0.045) sits on the held point (`T` = the grip or stock point for `Arm.exact`). The fist never reaches more than 0.05 hu past `T` (the shaped path's fist reached 0.1 m past the wrist: Boss, T11 r3) | ticket; T11 Result |
| Size | fist bbox across the forearm 0.069 hu, along it 0.097 hu (`fistParts` as built), within ± 15 % of the oval it replaces (0.072 × 0.092 hu); the forearm end is drawn under the fist, no gap (`arm check` attached) | ticket |
| Thumb side | `fist` from `mittenThumbSide(side, 'back')` as T11 already passes; the picture's thumb crease lies on that side | hand-drawing §2 |
| Back view (`back.ts`) | the same opt-in through the pose's `rArm`/`lArm` `flatFist` + `fist`; drawn in place of the back-view `ell` at the `hand` point, same placement rule; fingers into depth read as the knuckle side with the thumb crease on the §1/§2 side | hand-drawing §1, §2 |
| T11 use | `paintSeatedGunner` sets `flatFist: true` on both `Arm.exact` chains when `grip` and `stock` are given; without them (LF01a, LF02 R4 locked calls) nothing changes | T11 r4 decision 2 |
| Default | `flatFist` absent: the `paintFigure`/`paintFigureAt` and back-view stroke lists are identical to the pre-change build (hash test on three existing characters from other episodes and the LF01a gunner call) | look lock |

References (store): `projects/edu/EDU/previews/T11-cropfront-j0.png`, `T11-cropright-j0.png`, `T11-crop34-j0.png`, `T11-cropback-j0.png` (the plain ovals to replace); `projects/edu/EDU/previews/EDU-EP30-W3-r1/LF01a.png` (must not change).

**Judgment for the builder (Hard, hand).** The fist wraps the grip: the knuckle side faces where the hand line says, the thumb crease lies across on the stated side, and the fist sits on the grip point, not ahead of it. At figure scale the fist is small (about 14–25 px in these proofs): the thumb crease must still be distinguishable from the finger creases at the `--width 540` crop. If it is not, report the pixel sizes and set `blocked`; do not enlarge the hand.

## Proof
- `node scripts/test.mjs tests/kit-flat-fist.test.ts`: (a) `flatFist` absent gives the pre-change stroke hash for three existing characters and the LF01a gunner call; (b) with `flatFist` the fist centre is within 0.01 hu of `T` and no fist point lies more than 0.05 hu past `T` along the forearm; (c) thumb crease on the `fist` side in the hand frame for `fist` +1 and −1. `node scripts/test.mjs tests/edu30-cast.test.ts` (T11's tests unchanged, all pass).
- `npx tsc --noEmit -p . > out/logs/T36-tsc.log 2>&1; tail -5 out/logs/T36-tsc.log` · `npm test > out/logs/T36-test.log 2>&1; tail -15 out/logs/T36-test.log`
- Re-render T11's proofs `C30-gunner-front|back|right|34` frames 0 and 1 (`node scripts/stills.mjs src/painted/edu30/proof-cast.tsx --gl=angle`) to `out/edu30-T36/`, `scripts/qa-sheet.sh out/edu30-T36/sheet.png --cols 4 --width 270 out/edu30-T36/*.png` plus `--width 540` crops of every hand; archive `--path out/edu30-T36` with files named `T36-*.png`.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| LF01a gunner (locked call, `looks.ts`) vs pre-change | unchanged | mean abs pixel difference ≤ 2 |
| C30-gunner-front j 0 | RIGHT fist on the grip, LEFT on the stock, thumbs across | `thumb check: GUNNER-1 RIGHT: screen right ok`, `thumb check: GUNNER-1 LEFT: screen left ok`; `arm check: GUNNER-1 r/l: attached ok`; fist centre within 3 px of the projected grip / stock (logged) |
| C30-gunner-back j 0 / j 1 | fists on grip and stock seen from behind | `thumb check: GUNNER-1 RIGHT: screen left ok`, `LEFT: screen right ok`; arm ratio ≤ 1.05 |
| C30-gunner-right j 0 | near RIGHT fist on the G2-style grip | `thumb check: GUNNER-1 RIGHT: screen right ok`; far LEFT mostly hidden (`thumb check: GUNNER-1 LEFT: hidden`) |
| C30-gunner-34 j 0 / j 1 | near RIGHT fist on the grip, far LEFT on the stock | thumb lines as the front view; lead 563–623 px to the hat crown (T11 r4); arm ratio ≤ 1.05 |
| every crop at 540 px | thumb crease readable apart from the finger creases | crease lengths and fist size in px logged per hand |

Result goes to Film for a look check at the index Look checks (fist reads as a closed fist, not a paw or a ball) before T12 dispatches.

## Result (Boss fills)

Commit: see `git log` on branch `worktree-agent-aea0e4818090654d0` (T36 commit; started from `claude/ep30-continuation-493a12` at `ea37ad9`). Files: `src/painted/kit/draw.ts` (new `flatFistAt`), `kit/cast.ts` (`Arm.flatFist`, unshaped front/profile/3/4 path), `kit/back.ts` (back view), `edu30/cast.ts` (`flatFist: true` on the `grip`/`stock` chains only), `tests/kit-flat-fist.test.ts` (new), `docs/context-map.md`. `tests/edu30-cast.test.ts` unchanged, 4/4 pass.

**Proof.** Store `projects/edu/EDU/previews/`: `T36-sheet.png` (8 frames, 270 px), `T36-crops.png` (hand crops front, back, right, 3/4 at 540 px), `T36-gunner-{front,back,right,34}-j{0,1}.png`, `T36-crop-*.png`. Local `out/edu30-T36/`; logs `out/logs/T36-{flat,cast,tsc,test}.log`.

**Tests (kit-flat-fist, 4/4).** (a) `flatFist` absent: stroke-list hashes equal the build before T36 (`ea37ad9`) for `man-crop` front, `man-parted` back, `man-elder` right (`39e4b2d3867d`, `ef68705b3b89`, `73a01e4ee318`) and the LF01a gunner call (`8ac3d266aa4a`); identical strokes means pixel difference 0 (no LF01a pixel render was made). (b) fist centre within 0.01 hu of `T` (measured 0.0005 hu), reach past `T` 0.048 hu, bbox 0.097 x 0.069 hu at six forearm angles and both sides. (c) thumb crease on the `side` edge in the hand frame for fist +1 and -1.

**Per-hand lines (measured on the drawn strokes; fist centre to the projected point; fist size; thumb-crease offset from the centre).** Rule (hand-drawing section 2): back of a RIGHT hand = thumb counter-clockwise of wrist-to-fingers; back of a LEFT hand = clockwise. All 16 hand-frames agree with it.
| Frame | Hand | Fingers (screen) | Thumb lies | Centre error | Fist px | Thumb offset px |
| --- | --- | --- | --- | --- | --- | --- |
| front j0/j1 | RIGHT | (-0.91, -0.42) | down | 0.84 | 27.4 x 19.3 | (-2.4, 5.7) |
| front j0/j1 | LEFT | (-0.84, -0.54) | up | 0.84 | 27.4 x 19.3 | (3.5, -5.1) |
| back j0/j1 | RIGHT | (1.00, -0.01) | up | 3.28 | 106.7 x 75.1 | (-1.2, -23.9) |
| back j0/j1 | LEFT | (0.16, -0.99) | right | 3.28 | 106.7 x 75.1 | (23.5, 4.6) |
| right j0/j1 | RIGHT | (1.00, 0.04) | up | 1.35 | 44.0 x 30.9 | (0.0, -9.9) |
| right j0/j1 | LEFT | (0.41, -0.91) | right | 1.35 | 44.0 x 30.9 | (8.8, 4.4) |
| 3/4 j0/j1 | RIGHT | (0.81, 0.59) | up | 1.42 | 46.3 x 32.6 | (5.8, -8.6) |
| 3/4 j0/j1 | LEFT | (0.93, -0.36) | down | 1.42 | 46.3 x 32.6 | (3.4, 9.8) |
Right view: the far LEFT fist is drawn (not hidden): the gun's near side does not cover the stock point in the proof camera.
thumb check (rule, code `mittenThumbSide` and picture agree): GUNNER-1 RIGHT and LEFT ok in all four views. arm check: arm ratios unchanged from T11 (the tests above call the same solve; `edu30-cast` ratio test passes, max <= 1.05); the forearm capsule ends on the fist (viewed in the crops, no gap).

**Values I could not follow as written (Film to decide).**
1. The ticket's thumb words (`screen right` / `screen left` for front, 3/4, right; `screen left` / `screen right` for back) do not describe these frames: the forearms lie nearly horizontal on screen (fingers point sideways), so the thumb crease lies above or below the fist, not left or right (table above). Line, code and picture agree with the section 2 rule, so I recorded the measured sides and did not change the arm solve. Question: accept the measured sides as the thumb check for T11's proofs, or is a different arm direction wanted?
2. Front j0 fist is 27 x 19 px (thumb crease about 10 px long against finger creases about 4.5 px), small but the thumb crease reads as the longer stroke on the back-side edge in the 540 px crop; at 3/4 and right 44-46 px it is clear. The ticket's blocked-if-unreadable rule is not triggered, but Film judges it at the look check.
3. Fist-centre error is 3.3 px in the back view (0.0037 hu at 880 px/m, inside the 0.01 hu bound; the ticket's 3 px applies to the front view, 0.84 px).

**Repo checks.** `tsc`: 22 errors, none in changed files (missing `three` / `@remotion/three` types in this checkout, test typing already in `ea37ad9`). `npm test`: 295 pass, 20 fail, all in modules this ticket does not touch (12 need `@remotion/three`, which is not installed in the shared `node_modules`; `beast-joints` hippo "Maximum call stack"; store adopt; loudness); the context-map test failed on my new test until the map entry was added and passes now. Fix passes used: 0. Open: Film's look check (fist reads as a closed fist, not a paw or a ball) before T12.
