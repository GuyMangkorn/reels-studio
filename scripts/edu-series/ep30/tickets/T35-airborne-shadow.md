# T35 — an airborne emu's shadow stays on the ground (the B04-SH03 hops)
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: blocked (one proof range, see Result)
Class: capability · Hard: no
Blocked by: T06 (done: `emuHop` returns `{pose, offset}`) · Consumers: T08 (same file `flock.ts`, builds after this), T16 (queue hops), T27 (B04-SH03 hops); any later flier or jumper painted through `paintBeast`
Model: sonnet, medium

Read first: [common rules](index.md#common-rules); [T06 r3 decisions](T06-emu-wings-reactions.md) (hop shadow note); [survival/beast.ts](../../../../src/painted/survival/beast.ts) (`BeastPlace`, the "ground shadow first" block); [edu30/flock.ts](../../../../src/painted/edu30/flock.ts) (`EmuMember`, `paintEmu`).

## Build
`paintBeast` puts the body and its shadow on the same `ground` (shadow at ground + 0.01), so a hopping bird carries its shadow up with it (T06 Result, "Hop shadow"). Add a height above the ground that lifts the body only. Shared library change with an unchanged default: every existing caller (all episodes) paints exactly as before.
Files: `src/painted/survival/beast.ts`, `src/painted/edu30/flock.ts`, `src/painted/edu30/proof-flock.tsx` (adds `FL30-hop`), `tests/beast-air.test.ts` (new), `docs/context-map.md` (add the test to the entry that lists `survival/beast.ts`)

## Decided values
| What | Value | Source |
| --- | --- | --- |
| `BeastPlace.air?: number` | metres above `ground`; default 0. The body (every part, flat, joint and anchor) is placed at `ground + air`; the ground shadow ring and the per-foot contact shadows stay at `ground + 0.01` / `ground + 0.012` world | ticket |
| Shadow under an airborne body | radii `rs`, `rl` × (1 − 0.6 × air) and opacity × max(0.5, 1 − 1.2 × air), air clamped to 0..1 m; per-foot contact shadows × max(0, 1 − 4 × air) (gone at 0.25 m) | ticket |
| Contact darkening | the `pl[1] < 0.6` darkening stays in body-local height (unchanged) | ticket |
| `EmuMember.air?: number` | passed through `paintEmu` to `paintBeast`; default 0 | ticket |
| Hop use | consumers place `at` on the ground point, add `emuHop`'s `offset` x and z to it, and pass `offset[1]` as `air` (T16, T27) | T06 r3 |
| Default | `air` absent or 0: the stroke list of `paintBeast` is identical to the pre-change build (hash test), so no locked look moves | look lock |

References: the T06 store still `projects/edu/EDU/previews/KP-hop.png` (shadow lifted with the bird, the defect).

## Proof
- `node scripts/test.mjs tests/beast-air.test.ts`: (a) `air` 0 and absent give the same stroke hash as the pre-change `paintBeast` for one emu build and one non-emu build from another episode; (b) at `air` 0.25 the shadow ring's world y is `ground + 0.01` and the body's lowest foot is at `ground + 0.25 + its pad height`; (c) shadow radius ratio 0.85 and opacity ratio 0.7 at 0.25 m.
- `npx tsc --noEmit -p . > out/logs/T35-tsc.log 2>&1; tail -5 out/logs/T35-tsc.log` · `npm test > out/logs/T35-test.log 2>&1; tail -15 out/logs/T35-test.log`
- `FL30-hop` in `proof-flock.tsx` (10 f, the KP camera and set as `looks.ts` `kp`, newsreel off): one EMU-HERO through `paintEmu` at the KP mark, frames 0–9 of `emuHop(f, {side: 1, dist: 0.6})` with `offset[1]` as `air` (no `looks.ts` edit: T06 → T07 → T15 own it). Stills L 0 and 3 to `out/edu30-T35/` through `node scripts/stills.mjs src/painted/edu30/proof-flock.tsx --gl=angle`, a stand frame (`air` 0, no hop) for the diff, then `scripts/qa-sheet.sh out/edu30-T35/sheet.png --cols 3 --width 270 out/edu30-T35/*.png` and view it.

| Frame | What must be visible | Measured number and its pass range |
| --- | --- | --- |
| FL30-hop stand frame vs the same frame rendered from the checkout before the change | unchanged | mean abs pixel difference ≤ 2 |
| FL30-hop L 3 | both feet off the ground, a smaller, paler shadow on the ground under the bird with a clear gap between pads and shadow | shadow centre y within ± 4 px of the stand frame's; gap pads-to-shadow ≥ 20 px (logged) |

## Result (Boss fills)
Commit: this branch's T35 commit (see index) · proof sheet `projects/edu/EDU/previews/T35-sheet.png` (stand-after, L3, L6, L0; also `T35-hop-L00/L03/L06.png`, `T35-stand-before.png`, `T35-stand-after.png`) · fix passes: 0.

Built: `BeastPlace.air` (body offset `ay` in `W`, ring at local y `0.01 - ay`, per-foot at `0.012 - ay`), `EmuMember.air` through `paintEmu`; `FL30-hop` (10 f) and `FL30-stand` (1 f, added for the diff, the ticket named only FL30-hop) in `proof-flock.tsx`; `tests/beast-air.test.ts` (3 tests pass; golden hashes taken from the pre-change `paintBeast`, emu `5b025d09...`, raptor `eed0377c...`); the context-map entry lists the test. `npx tsc`: 22 errors, none in touched files (pre-existing). `npm test`: 277/296 pass, the 19 failures are identical with and without the change (beast-joints HIPPO x3, animation, painted, etc.).

Reading chosen where the ticket was silent: the per-foot contact shadow factor `max(0, 1 - 4 air)` multiplies the wash opacity (150), not the radius; it is skipped at 0.25 m.

Measured (KP camera, `out/logs/T35-measure.ts`):
| Frame | Number | Range | Result |
| --- | --- | --- | --- |
| stand, before vs after the change | mean abs diff 0.0001 | <= 2 | pass |
| L3 gap pads to shadow top (pad bottom y 1045.1, shadow top 1153.9) | 108.9 px (centre: 150.4) | >= 20 | pass |
| L3 shadow centre y vs stand frame (1195.5 vs 1146.7) | 48.8 px | within 4 | **not met as written** |

Open question (Film): the shadow-centre range cannot hold. `emuHop` L3 moves the ground point by `side * dist * lat` = 0.3 m toward the camera (heading PI), so a correct ground shadow sits 48.8 px lower on screen than at the stand mark. At the same ground point the shadow centre equals an `air` 0 bird's (the ring only shrinks about its centre). Proposed range: shadow centre y equals that of an air-0 bird at the same ground point, within 4 px (holds by construction, tested through the ring check in `tests/beast-air.test.ts`). Film to confirm or give another range; no code change expected.
