# Build notes — PAINTED-KIT (phase 1)

## Tools (TL)
| ID | Procedure (repeats seen) | Script / location | Status: episode / promoted (scripts/README.md) |
| --- | --- | --- | --- |
| TL01 | Render fixed stills of the four painted episodes before/after a shared-module change | `scripts/painted-kit/regress.mjs` (`--out=DIR`; set `PUBLIC_DIR` when `public/audio` WAVs are missing, silent stubs are enough) | episode |
| TL02 | Compare two still folders (byte hash, else PSNR) | `scripts/painted-kit/compare.py OLD NEW` | episode |
| TL03 | Render the kit catalog still | `scripts/painted-kit/catalog.mjs --out=DIR` | episode |

## Phase 1 record (30 Oct 2026, Boss)
- Moved with `git mv` into `src/painted/kit/`: `painter.ts`, `camera.tsx`, `glow.tsx`, `screen.tsx`, `hands.ts`, `hash.ts`; split neutral parts of `worldfog/draw.ts` and `worldfog/space.ts` into `kit/draw.ts` and `kit/space.ts`. All importers updated to kit paths (old top-level paths removed, no shims); `worldfog/draw.ts` and `worldfog/space.ts` stay as episode modules that re-export the kit.
- `WFOG_HAND` -> `worldfog/hand.ts`, `ZC_HAND` -> `zcpaint/hand.ts`. Kit `paintPovHand` default tone is `DEFAULT_HAND_TONE` (same values ZCPAINT used as default).
- `Proj` is `Proj<S = unknown>` in the kit; WFOG's `Proj = KitProj<Setup>`; `cardProjector` returns `Proj<never>`.
- Regression: 24 frames (6 each of WFOG, ZCPAINT-EN, BLOOP, SHIPWRECK; `out/kit-baseline` vs `out/kit-after`): 17 byte-identical, 7 differ with PSNR 83-116 dB, the same frames and the same size as a baseline-vs-repeat render of unchanged code (16/24 identical, 83-116 dB): brush/WebGL run-to-run noise, no visual change.
- Risks: duplicate names with different signatures in `kit/hands.ts` vs `painter.ts`/`draw.ts` (`ring`, `capsule`, `solid`, `inkLine`); `public/audio` WAVs are gitignored and absent in worktrees, so stills need stub audio; `kit/painter.ts` and `kit/camera.tsx` import the type `Brush` from `../BrushCanvas` (type-only, BrushCanvas stays outside the kit for now).
- Deferred to phase 2: 4-head cast (`worldfog/cast.ts`, `head.ts`), phone SVG (`worldfog/phone.tsx`), car, shop, room sets, ZC/BLOOP set code, `BrushCanvas`/`plate`/`shot`/`registry`, reconciling the duplicate helpers.

## Phase 2a record (31 Oct 2026, Boss)
- `worldfog/cast.ts` and `head.ts` -> `kit/cast.ts`, `kit/head.ts`; the interior-light model (`VD18`, `modelPart`, ...) moved into `kit/draw.ts` because heads and figures need it. `worldfog/cast.ts` keeps `Who`, `CAST` (4 entries) and thin by-role `drawFigure`/`shoulderHeight`; `worldfog/draw.ts` is a re-export.
- Kit `drawFigure`/`shoulderHeight` take a `CastDef` instead of a role id. The one hard-coded `who === 'worker'` in the hand colour was redundant (`o.coat` already true for the worker) and became `o.coat`.
- Regression (`regress.mjs` now adds 12 WFOG frames every 300 f, 36 total; `out/kit-base2a` vs `out/kit-after2a`): 29/36 byte-identical, others 85-106 dB; same frames differ by the same size in a baseline-vs-repeat render (30/36 identical): renderer noise.
- Not moved: phone SVG, car, shop, rooms, torch/umbrella props beyond what the rig already draws.

## Document proposals (DP)
### DP01 — AGENTS.md#document-index: kit and catalog have no home in the index
- Seen: 30 Oct 2026, Boss; `src/painted/kit/README.md`, `out/kit-catalog/KIT-CATALOG.png`.
- Proposed: add a row "[painted kit](src/painted/kit/README.md) | Building or reviewing painted-2D shots, characters or sets: pick shared helpers from the catalog before drawing new ones | on trigger (F, M, S, E)".
- Affects: Film, Mark, Boss, Editor
- Status: proposed

### DP02 — .claude/skills/painted-2d/SKILL.md: module paths changed
- Seen: 30 Oct 2026, Boss; `src/painted/{painter,camera,glow,screen,hands,hash}` now live in `src/painted/kit/`.
- Proposed: replace those paths with `src/painted/kit/<module>` and add "shared helpers: see src/painted/kit/README.md".
- Affects: Film, Boss, Editor
- Status: proposed

### DP03 — docs/boss-asset-workflow.md#visual-and-runtime-qa-before-push: kit regression check
- Seen: 30 Oct 2026, Boss; `scripts/painted-kit/regress.mjs`, `compare.py`.
- Proposed: add "A change to `src/painted/kit/` renders the fixed regression stills before and after and reports byte-identical or PSNR (>= 80 dB = renderer noise)."
- Affects: Boss
- Status: proposed

### DP04 — scripts/README.md: new scripts
- Seen: 30 Oct 2026, Boss.
- Proposed: list `scripts/painted-kit/{regress.mjs,compare.py,catalog.mjs}` (TL01-TL03 above) if a second episode uses them.
- Affects: all
- Status: proposed

### DP05 — docs/character-proportion-principles.md and docs/delivery-workflow.md: recurring cast rule
- Seen: 31 Oct 2026, Boss; user decision relayed 30 Oct 2026 (recurring character keeps head and body in every video, only outfit/accessories/props change).
- Proposed: add "A recurring character is a kit `CastDef` (src/painted/kit/README.md#recurring-cast). Per video change `outfit` and props only; changing `head`, `height` or body proportions is a look change that needs user approval."
- Affects: Film, Mark, Boss
- Status: proposed

## Pass 3 record (1 Nov 2026, Boss, branch claude/wendigo-script-r3 checkout; uncommitted)
- Built: `kit/shot-templates.ts` (twoShot, threeShot, talkingCloseUp, sideWalk, povShot, drawShotTemplate), `kit/casting.ts` (parseCasting, formatCasting, CARD_POSES, CARD_EXPRESSIONS, roleLabel), `kit/template-reel.ts`, `shots/kit-templates.tsx` (KIT-SHOT-TEMPLATES, six `kit-template-*` plates), `kit/cast-cards-sheet.tsx` (KIT-CAST-CARDS). Tests: `tests/shot-templates.test.ts`, `tests/casting.test.ts` (21).
- Regression: `kit/regress.mjs` before/after 29/36 byte-identical; the same code run twice gives 27/36, so the 7 PSNR 83–110 dB differences are render noise (DF-20261030-render-run-noise).
- TL: a template returned `-follow * 0` as a camera offset; `strictEqual` in node:test reads -0 as unequal to 0. Write offsets as `follow * (a - b)` so a zero offset is +0.
- TL: `const fail = (): never` does not narrow the type after `if (!isX(v)) fail()`; return an Error and `throw` it.
- TL: `rm "$D"/*.png` with an unset D is blocked by the safety check; overwrite by copy instead.
- Finding: a 7-head expression strip at STRIP_K 26 on 76 px cells merges curly and spiky hair (woman-curly, man-spiky, girl-school). STRIP_K 20 clears it. Use K <= 20 for seven heads per 560 px card.
- Finding: at 3.2x zoom the nurse cap reads as a flat white box; the close-up uses `office` clothing for now.
- Finding: `store.py archive` stores media only (MEDIA extensions); text evidence stays in out/.
- Not verified: Remotion Studio (cold load, play, scrub) was not opened for KIT-SHOT-TEMPLATES; seek evidence is fresh-session stills in non-sequential order plus MP4 frame comparison (PSNR ~40 dB, H.264).

## EDU-EP08 kit intake record (8 Nov 2026, Boss, KIT-P01; uncommitted on claude/education-ep8-continue-39be3d)
- Filed: `WARDROBE.eva-suit` + `WARDROBE_INFO` (`bulk`), `kit/eva.ts` (suit, gloves, neck ring, bubble / visor / 1966 helmets, detached helmet prop), pose P46 `zero-g-neutral`, motions `zero-g-drift`, `pat-check`, `rail-tow`, `paintFigureAt({roll})`, ENV-EARTH (`earth.ts`), ENV-GLITTER (`glitter.ts`), screen layers `TimerRing` / `Stamp`, sheets `ZEROG-*`, PLATES `PL-EDU-ORBIT`, `PL-EDU-RING-CLOSE`, `PL-EDU-CHAMBER-1966`, `PL-EDU-AIRLOCK` (stills in the store). Episode code under `src/painted/edu08/` is unchanged.
- Review: `glitterMarks` `emit` is pure (the birth time reduces to `(cycle - base) * life`, no state, ignored in snapshot mode); the `MEAS` hook is episode-owned (`edu08/suit.ts`), writes a module global after painting and never feeds back into the picture; no kit module reads it.
- Regression: `regress.mjs` HEAD vs the working tree, 36 frames, PSNR 69-90 dB (2 byte-identical), render noise level (see DF-20261030-render-run-noise); the same working-tree code run twice gives 2/36 byte-identical, PSNR min 69.0 dB, so the 69-90 dB differences are render noise.
- Proposed (maintenance window, not implemented; status proposed):
  - P1 `woman-bob` neutral mouth is upturned and reads as a smile; flatten the neutral mouth curve for that head (head change: user approval, recurring character "คุณ").
  - P2 `dry(p)` in `edu08/stage.ts` builds a no-op painter from `makePainter` over a no-op Proxy; promote a shared `makeNullPainter` in `kit/painter.ts` for measuring anchors without drawing.
  - P3 the kit `'o'` mouth is a fixed-size round hole whatever `open` is; scale it with `open` (and clamp to the lip width).
