# Environment layer for the painted kit (design, proposed)

Status: **phases 1 and 2 built** (3 Nov 2026). Phase 1: `kit/sky.ts`, `kit/fall.ts`, `kit/fog.ts`, `kit/sea.ts`, sheet `KIT-ENV`. Phase 2: `kit/plates.ts` (27 plates from 9 episodes), sheet `KIT-PLATES`, `scripts/painted-kit/plates.ts`. ENV-P01/P02 applied to the kit README and Film's brief workflow after user review (3 Nov 2026).

## Decision in one line

The kit gains **atmosphere layers and set tools** (sky, falling particles, water/weather, light halos, fog). **Finished sets** (rooms, doors, cabinets, streets) stay in their episode folder and are listed in a **plate gallery** for reference. Nobody draws a background from the gallery by default.

## Why this split

1. Characters must look the same in every shot, so reuse is the goal. A set carries one episode's story, layout and palette, so reuse makes episodes look alike.
2. The inventory confirms it: no finished set was reused in eight episodes. Same-named functions draw different things (`paintSnow` is falling flakes in bloop and a whole dawn clearing in wendigo; `paintLantern` is a paper lantern in kuchisake and a kerosene lantern in wendigo).
3. Atmosphere code is what repeats: sky bands in alvarenga and zcpaint, falling particles in bloop and `sea.ts`, lamp halos in worldfog and `kit/glow.tsx`. Each copy also repeats the same caption-band rule (dim particles below the caption line), which drifts when copied.

## Scope

### In the kit (new or moved)

| ID | Module | Contents | Source today |
| --- | --- | --- | --- |
| ENV-SKY | `kit/sky.ts` | `paintSkyBands(p, W, {from, to, bands, top, horizon})`: graded flat bands, optional sun/moon disc | `alvarenga/set.ts:27`, `zcpaint/balcony.ts:200` |
| ENV-FALL | `kit/fall.ts` | `paintFall(p, kind, {W, H, t, count, color, wind, captionBand})` with `kind` = `snow`, `rain`, `dust`, `ash`, `bubbles`; one seeded loop, one caption-band rule | `bloop/sets.ts:31`, `sea.ts:122,181` |
| ENV-SEA | `kit/sea.ts` | re-export of `src/painted/sea.ts` (water, seabed, storm, caustics); the file itself stays, see [Build notes](#build-notes) | `src/painted/sea.ts` |
| ENV-GLOW | `kit/fog.ts` | painted-canvas halo `paintHalo(p, {x, y, r, color, level})`; overlay `Spot`/`Shafts` stay in `glow.tsx` | `worldfog/outside.ts:317` |
| ENV-FOG | `kit/fog.ts` | `paintFogBank(p, {y, height, color, density, drift, t})` and a beam-fog cone | `worldfog/outside.ts:279` |

Every layer is a pure function of the frame (painted-2d contract), seeded per call, takes colours as arguments (no palette baked in) and ships with a catalog sheet in `kit/catalog.tsx` like the cast and pose sheets.

### Stays in the episode

Finished sets and their constants (camera setups, room coordinates, palettes), set-specific props (the Hanako cabinet, the WORLD FOG shop), and episode-only motion. `kit/space.ts` already holds the shared projection; episode `space.ts` files keep only their set numbers.

### Plate gallery (phase 2)

Chosen for agent use (user, 3 Nov 2026: whichever an agent can use most easily, extra code is fine). Two parts, one source:

1. **Index (primary):** `kit/plates.ts` exports `PLATES`, one typed entry per finished set: `id`, `episode`, `kind` (`interior`, `exterior`, `vehicle`, `sea`, ...), `time` (`day`, `dusk`, `night`), `mood` tags, `palette` (3–5 hex), `kitLayers` used, `shot` (registered painted shot) and `t` (shot-local seconds); `plateStill(id)` gives the store path. An agent finds candidates with one `grep` or a filter call and reads only the matches, at no image cost ([CB01](../../../AGENTS.md#context-budget)).
2. **Sheet (secondary):** a `KIT-PLATES` catalog composition renders the stills from `PLATES` as one labelled contact sheet; agents view it through `scripts/qa-sheet.sh` at 270 px tiles ([CB03](../../../AGENTS.md#context-budget)) only after the index has narrowed the choice.

An entry is added when its episode is delivered; `tests/plates.test.ts` fails on a `shot` that is no longer registered. Film reads it as reference before a look frame. It is never a default and has no reuse requirement.

## Promotion rule (proposed for kit README and Film's brief workflow)

**ENV-P01 — Promote on the second use.** An atmosphere layer or set tool moves into the kit when a second episode needs it (same rule as [TL01](../../contributing.md#tools-and-document-improvements)). A finished set is never promoted; it gets a gallery entry when its episode is delivered.

**ENV-P02 — Check the kit first.** Before painting a plate, Film lists the kit layers it uses (`sky: ENV-SKY, fall: snow`) in the scene sheet, next to the casting line. A layer written new in the episode records why the kit layer did not fit.

These two rules were applied (user, 3 Nov 2026) to [src/painted/kit/README.md](../../../src/painted/kit/README.md) and [film-visual-brief-workflow](../../film-visual-brief-workflow.md) after review ([DP01](../../contributing.md#tools-and-document-improvements)).

## Migration

1. Add `kit/sky.ts`, `kit/fall.ts`, `kit/fog.ts`, `paintHalo`; unit-test seeding and the caption-band rule.
2. Expose `sea.ts` as `kit/sea.ts` (re-export).
3. Delivered episodes keep their own code (user, 3 Nov 2026: new episodes only), so no pinned shot is repainted. The new layers are proven with catalog sheets plus one side-by-side still per layer against the episode code it replaces, rendered in a test composition, not by switching the episode.
4. Add catalog sheets and context-map entries.
5. Phase 2: `PLATES` index, seeded from the existing `look-index.ts` / `plate-index.ts` files, and the `KIT-PLATES` sheet.

## Verification

- `npm test` (types, context map, new unit tests).
- Catalog sheet stills of each layer, viewed through `scripts/qa-sheet.sh`.
- Side-by-side stills of each layer against the episode code it replaces: visually matching, or the difference recorded.

## Decisions

1. Gallery: typed `PLATES` index first, generated `KIT-PLATES` sheet second (user, 3 Nov 2026).
2. Migration: new episodes only; delivered episodes keep their code (user, 3 Nov 2026).
3. ENV-P01/P02 approved and applied (user, 3 Nov 2026).

## Build notes

- **Shared files untouched.** `scripts/segments.mjs` hashes each composition's transitive runtime imports, so editing or moving `sea.ts` or `glow.tsx` would invalidate the pinned scenes of delivered episodes (shipwreck, alvarenga, bloop, worldfog). Phase 1 therefore adds new files only: `kit/sea.ts` re-exports `sea.ts`, and `paintHalo` lives in `kit/fog.ts`.
- **Sheet check.** `KIT-ENV` frames 0 and 45 rendered with `scripts/stills.mjs` and viewed through `scripts/qa-sheet.sh`. First pass: snow, dust, ash and bubbles were too small to read at plate scale, so their lengths and weights were raised and bubbles became rings; tile margins spilled into neighbours until the gap was widened to 70 px. Kit rain matches the old `sea.ts` rain.

### Phase 2 build notes

- **Clean plates, not episode frames.** Delivered compositions bake captions into every frame, and adding a caption switch would touch the shared scene renderer that every pinned segment hashes. Each entry therefore names a registered shot and a shot-local time; `src/painted/plates-index.tsx` paints that plate with its `Overlay`, with no timeline, captions or labels.
- **Store is immutable.** The script renders only plates the store lacks, and files them at `projects/KIT/plates/<id>.png`. The sheet is not stored; `--sheet-only` rebuilds it from the stored stills (verified: a second default run renders 0, and `--sheet-only` redraws all 27).
- **Curation.** 45 candidates (about one per scene) were rendered and viewed; duplicates, diagrams, and character close-ups that showed no set were dropped, leaving 27. The palette is the script's ffmpeg suggestion; ids, titles, kind, time, mood and layers were tagged by hand from the sheet.

## Evidence

| Element | Copies | Shared today |
| --- | --- | --- |
| Sky bands | `alvarenga/set.ts:27`, `zcpaint/balcony.ts:200` | No |
| Falling particles | `bloop/sets.ts:31`, `sea.ts:122` `paintParticles`, `sea.ts:181` `paintRain` | Partly |
| Water / storm / seabed | `sea.ts` (bloop, alvarenga, shipwreck, `plate.ts`) | Yes, outside `kit/` |
| Halo / fog | `worldfog/outside.ts:279,317`, `kit/glow.tsx` | Partly |
| Finished sets (doors, cabinets, rooms, streets) | hanako, zcpaint, kuchisake, worldfog, wendigo | Never reused |
