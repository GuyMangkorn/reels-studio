# HANAKO-SHORT polish brief (Boss) — DRAFT for user review

31 Oct 2026. Source: `boss-g1-report.md`, `boss-g2-report.md`, `boss-g3-report.md`, user QA review of the G1–G3 sheets. Base: all 14 `SCENE-R3` plates implemented, runtime checks green, **visual not approved**. One polish pass over all 14 shots: lighting, shadows, added detail, paint treatment, de-geometrising.

## Scope and limits

- **In:** look of existing plates. **Out:** story, timing, reveals, stable IDs, shot order, camera moves, caption zone (y 860–1248), narration, audio, `src/Root.tsx`, video registration (Editor, later).
- Keep green: caption-zone 100%, lead heights (G1 min 909 px; G3 classroom ≥ 727 px), loop F2595 → F0 pixel-identical, tests, typecheck, lint.
- Fix reusable art in the owning module (`src/painted/hanako/assets.ts`, `look*.tsx`, `kit/hands.ts`); shots select IDs only.

## Revision (user, 31 Oct 2026)

POV/close-up plates keep their `hardFill` look (user: the originals read well). **Dropped:** P03, P04, P05, P06, P07 (B01-SH01, B05-SH01, B05-SH02, B06-SH02, B09-SH01 are POV/close-up). **Kept:** P01, P02, P09 (cast, SVG icons, classroom in wide/medium shots), P08 (corridor wide shots B01-SH02, B02-SH01, B08-SH01), P10 light/shadow for wide/medium shots only, P11 low priority. **Added P12:** in those POV/close-up plates only the foreground subject may stay `hardFill`; the background behind it (wall, floor, haze, dark surround) must be a painted wash (`washAt`, bleed + texture), never `hardFill`. Audit B01-SH01, B05-SH01, B05-SH02, B06-SH02, B09-SH01 backgrounds and fix any flat-filled one. Codex's group B result (`hanako-polish-b-codex`) is not to be ported.

## Root cause (measured 31 Oct 2026)

`assets.ts` calls `hardFill` 66×, `washAt` 4×, `inkLine` 13×. `hardFill` (`kit/draw.ts:30`) is a flat, no-bleed, no-texture fill for straight architecture. Cast and props therefore read as vector shapes. `generations.tsx` draws `KidSilhouette`/`TeacherIcon` as SVG (22 elements) inside wide shots.

**Rule now in `.claude/skills/painted-2d/SKILL.md` (user approved):** `hardFill` only for straight architecture edges (frames, mullions, lockers); cast, props, paper, hands use `washAt` + `inkLine`; characters inside a painted set are brush-painted, never SVG; crisp SVG only for close-up/FPOV inserts. Read the skill first.

Quality reference: `look.tsx` (LF01/LF04, user-approved looks).

## Work items (by owner art, then shots)

| ID | Art | Shots | Problem | Fix direction |
| --- | --- | --- | --- | --- |
| P01 | `CH-KID` | B03-SH01, B07-SH01 (pupils), B08-SH01 | elliptical hair masses, angular one-piece uniform, capsule sleeves/mittens, dark legs merge into floor | wash body + hair, one thin ink line, one cel shade, collar/sleeve/bag detail, legs separated from floor by rim/shadow value. Keep four-head proportions, 1.30/1.25 m at 700 px/m, no face features, `VD15` |
| P02 | `KidSilhouette`, `TeacherIcon`, `Doodle` (SVG in `generations.tsx`) | B07-SH01–03, B08-SH01 | SVG shapes inside painted wide shots | move to brush; B07-SH03 child in the film frame gets paper-cut wash style, not clip-art |
| P03 | Hands/arms (`kit/hands.ts`, `assets.ts`) | B01-SH01, B05-SH01, B09-SH01 | polygon palm + capsule fingers, sleeve gap | hand pose from kit anchors (LF01), soft wash skin + one ink line, continuous cardigan sleeve (keep the existing cardigan fix) |
| P04 | Cabinet/drawer, folders | B05-SH01 | rectangular, no depth | wall/inner-shadow washes, edge wear, label card, paper-edge detail; keep projected 2D depth |
| P05 | Blank ruled page (`LF04`) | B05-SH02 | flat white rectangle | paper wash with fibre, fold shadow, faint ruling; no smudge (keep the F1127 byte-identical stop) |
| P06 | Book spread | B06-SH02 | regular dot columns, flat | uneven print texture, gutter shadow, page curl hint, lamp warmth falloff (lamp ramp F1430–1460 unchanged) |
| P07 | Door/vent (`LF01`) | B01-SH01, B09-SH01 | flat door and vent slats | wash grain, edge wear, vent depth shading; keep seam glow + key dip (`VD21`, no eye) |
| P08 | Locker corridor | B01-SH02, B02-SH01, B08-SH01 | clean planes | floor reflection wash (keep drain/feet ≤ 859 rule), ceiling-light haze, locker dents/wear |
| P09 | Classroom set | B07-SH01 | flat blackboard/desk | chalk-dust wash, desk grain, light falloff |
| P10 | Light and shadow pass | all 14 | one source per shot not always readable | per shot: one warm source in cool world, glow off faces, contact shadows under feet/props, vignette tuned, no new bright mass in the caption band |
| P11 | Map | B06-SH01, B07-SH02 | stable; low priority | edge wash/texture only, do not move pin timing (F1256–1276) |

Keep as is (geometric on purpose): architecture edges, B04 paper-cut house/stall silhouettes only if Film's brief says paper-cut (check `FILM-R4`).

## Evidence required

1. `scripts/qa-sheet.sh` sheets per group, before/after pairs for P01, P03, P04, P05, P06; viewed, not only generated.
2. Re-measured lead height, `caption-zone.py`, loop seam, repeatability. The G1/G3 repeat difference (1/255 in 1–2 channels) is open: isolate the cause or record it again.
3. Report `boss-polish-report.md`: per ID `done` / `partial` / `skipped` and what still reads geometric. Visual done is not claimed; the user decides from the sheets.

## Invocation plan

- By shot group (AI01), not one run: A = P01 + P02 + P09 (cast, B03/B07/B08), B = P03 + P04 + P05 + P06 (hands/props, B01/B05/B06/B09), C = P07 + P08 + P10 + P11 (set and light, all shots). Run A and B one after another (shared `assets.ts`), then C.
- Executor: judgement-heavy painting goes to Claude Boss or a Claude check of every Codex sheet; Codex only for mechanical moves (SVG → brush ports, measurement scripts).
- Codex runs without `&` so Claude Code reports completion; the log goes to `out/logs/`.
