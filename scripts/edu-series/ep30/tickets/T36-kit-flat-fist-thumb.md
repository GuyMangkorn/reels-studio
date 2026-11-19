# T36 — an unshaped kit figure can close a thumbed fist on a held point (the GUNNER-1 grip and stock), and T11's proofs show the thumb
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready (new in TICKETS-R4, from the T11 thumb question)
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
