# DF-20261031-painted-opaque-cast — a single p5.brush wash leaves dark figures see-through

- Owner: Boss; first observed: 31 Oct 2026 (HANAKO-SHORT polish A, B03-SH01 child cast); last checked: 31 Oct 2026, working tree on `claude/plate-creation-scene-r3-344e6c` (pre-commit).
- Status: workaround (in use in `src/painted/hanako/assets.ts` `cast()`).
- Type: implementation-bug (against the skill's `washAt` + `inkLine` default for cast).
- Tags: 2D / painted / texture / cast / figures.
- Scope: `src/painted/kit/draw.ts` (`washAt`, `solid`), `src/painted/hanako/assets.ts`, `src/painted/hanako/generations.tsx`.
- Consumers: HANAKO-SHORT `HANAKO-B03-SH01`, `HANAKO-B07-SH01`, `HANAKO-B07-SH03`, `HANAKO-B08-SH01`. Film/Mark decision: none changed; the look still needs the user verdict.

## Symptoms and evidence

- After `washAt(..., 255, ...)` for a dark kid body, the locker dividers and wall stayed visible through the hair and legs (`out/qa/hanako/polish-A/iter2`, `iter3`).
- Four `solid()` passes still showed a locker divider through the hair (`iter5`). Eight passes removed it (`iter6`).

## Attempts and results

- `washAt` at 255 with low bleed and texture: translucent (rejected).
- `solid(…, 4, .02)` plus `washAt` glaze: partly visible divider (rejected).
- `solid(…, 8, .02, .03)` plus `washAt` glaze (`cast()`): opaque; glaze keeps the paper grain. Bleed on the glaze and border kept small so the figure does not extend past its measured feet.

## Planning impact

- Film/Mark: dark cast needs the opaque base; the watercolour glaze is texture only, so the rendered figure reads as flat-tinted blocks until a texture pass is designed.
- Proposal for the skill (not applied, user review): see `scripts/hanako/build-notes.md` (2026-10-31, Boss polish pass).

## Revalidation history

- 31 Oct 2026: measured on B03-SH01 f100 (kid crop) and B07-SH01 f100 (desk, teacher); no other episode revalidated.
