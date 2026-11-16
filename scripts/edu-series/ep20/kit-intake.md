# EDU-EP20-SHORT — W8.4 kit intake

Owner: Boss. Date: 2026-11-16. Checkout: `c420a2c` plus the existing production working tree. Gate: the user passed Final v4 ("ผ่าน"); Editor's archived delivery uses the 11 pinned scenes. This pass changes catalog data only.

## Filed

- **`PL-EDU-CABIN20`**, `src/painted/kit/plates.ts`: the approved LF20-CABIN-B closed car cabin, cool interior with a warm daylight road window, restrained passenger and floor-tethered coral helium balloon. Source plate `EDU20-B01-SH01`, shot-local `t=1.167 s` → G35. This is the upright pre-result state.
- Full-size still: `$REELS_STORE/projects/shared/KIT/plates/PL-EDU-CABIN20.png`, 1080×1920. SHA256 `8dd2c08d9c3123977f55bc602c1a128f1ca927ed6123d31ccfb795e85cc03f4f`.
- Runtime status: **existing-integrated** in this checkout. The catalog points at an existing registered film plate; no episode imports or painting code changed. `src/painted/kit/car-cabin.ts` already owns cabin geometry, passenger/belt contact, tether geometry and drive motion. No duplicate asset implementation was needed.
- Person/outfit/pose intake **N/A**: `man-crop + hoodie, P31, neutral / right` already exists in `PEOPLE`, `WARDROBE` and the pose catalog. The episode changes hoodie colors only. Animal intake **N/A**: no animal. New independent pose/motion intake **N/A**: the episode's upper-torso/belt/balloon motion already lives in the owning `car-cabin.ts` module; there is no unfiled episode motion to copy.

## Visual and runtime evidence

Command: `npx tsx scripts/painted-kit/plates.ts --only=PL-EDU-CABIN20`, using the script's `scripts/stills.mjs` browser reuse. One new plate rendered and stored; the labelled `KIT-PLATES` gallery was rebuilt with 58 entries. Log: `out/logs/edu20-kit-intake.log`, detailed command log `out/logs/kit-plates.log`.

Viewed through `scripts/qa-sheet.sh`:

- `out/qa/edu20/kit-intake/PL-EDU-CABIN20-270.png`: readable coral balloon and continuous tether to floor ring; passenger seated on the cushion, feet on floor, belt attached; approved cool cabin/warm window look retained.
- `out/qa/edu20/kit-intake/KIT-PLATES-small.png`: labelled gallery; the new cabin appears in the final row with its ID and palette. Source sheet: `out/kit-plates/KIT-PLATES.png` (rebuildable, not an immutable gallery original).

Measured from the actual G35 camera and passenger fill vertices, excluding shadows: lead height **767.768 px**, fill bounds x84.029–481.999 / y81.557–849.325; balloon envelope height **174.910 px**. These exceed the 480 px Short lead minimum and preserve canonical body/balloon dimensions. Numeric cache: `out/qa/edu20/kit-intake/plate-geometry.json`. The existing `measure-cabin.ts` also ran into `geometry.json` as a reference for the three fixed look cameras; those values are not the moving G35 camera measurement.

`caption-zone.py --band 1100:1248` on the clean gallery plate reports mean **0.269**, p95 **0.318** (mean threshold flag). There is no caption in a gallery still; the lower panel/floor produces the mean. No episode caption or picture change follows from this catalog measurement. Result: `out/qa/edu20/kit-intake/caption-zone.json`; overlay in `capzone/`.

Checks: `tests/plates.test.ts` **2/2 passed**, targeted ESLint passed, `git diff --check -- src/painted/kit/plates.ts` passed. Logs: `out/logs/edu20-kit-plates-tests.txt`, `out/logs/edu20-kit-plates-lint.txt`. No new test was added for a catalog row. Full lint/typecheck remains the coordinator's combined-change check. Studio/playback/temporal QA is N/A to this catalog-only change; no timeline or rendered motion was changed. Sound is N/A for a silent gallery still; delivered sound remains untouched.

## Durable evidence and coordinator integration

`store.py archive --path out/qa/edu20/kit-intake --project EDU --kind previews`: 3 images archived, zero conflicts. Store paths:

- `projects/edu/EDU/previews/PL-EDU-CABIN20-270.png`
- `projects/edu/EDU/previews/KIT-PLATES-small.png`
- `projects/edu/EDU/previews/capzone/PL-EDU-CABIN20_capzone.png`

Coordinator: mark W8.4 complete and index this handoff plus `PL-EDU-CABIN20` in `docs/context-map.md`. No source import, pinned scene, review row, task/delivery record, build notes, registry or rule document was changed by Boss. Nothing committed or posted.

Proposed catalog documentation update for the maintenance/docs pass: add `car-cabin.ts` and its shared cabin/balloon/belt/drive APIs to the kit README asset inventory, and name `PL-EDU-CABIN20` in its dated intake history. The current pass leaves that rule-bearing README untouched.
