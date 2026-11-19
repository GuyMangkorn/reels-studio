# T35 — an airborne emu's shadow stays on the ground (the B04-SH03 hops)
Deliverable: EDU-EP30-SHORT · Revision: r1 · Status: ready
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
