# Boss polish pass, Group C (P08, P10, P11) — HANAKO-SHORT

31 Oct 2026 · base: `main` 3166499 (this worktree `claude/hanako-next-437b9b`, uncommitted) · source: Codex `codex/hanako-polish-c` (`../hanako-polish-c-codex`, older main 59ef2a2, uncommitted; its `out/` is empty now, so its numbers were not re-checked) · brief `boss-polish-brief.md` (rows P08, P10, P11) · SCENE-R3 / FILM-R4 / voice lock v3 · 1080×1920, 30 fps.
**Visual done is not claimed.** The user decides from the sheets. Nothing committed or pushed.

## Scope kept

- **Changed (pixel-verified):** B01-SH02, B02-SH01, B08-SH01 (P08 set + P10 light), B04-SH01, B06-SH01, B07-SH01, B07-SH02, B07-SH03 (P10 light/vignette).
- **Unchanged:** B05-SH01, B05-SH02, B06-SH02 (byte-identical in all frames). B01-SH01, B03-SH01, B09-SH01 differ only by 1/255 on some frames, which is render-session drift (see Evidence). No code path of theirs changed.
- **Not changed:** story, timing, reveals, stable IDs, camera, caption zone, audio, `src/Root.tsx`, registration, the B03 FPOV plate (pass 7), the B05 and WORLD FOG outputs, the user-reverted arm direction (knock and edge-hand code), map art, pin and ring timing (F1256–1276).

## Per-ID status

| ID | Status | Result | Still reads |
| --- | --- | --- | --- |
| **P08** locker corridor (B01-SH02, B02-SH01, B08-SH01) | done, scoped | `paintRestroom` only, RR-WIDE and RR-DOOR (RR-KNOCK returns early): wall and floor as seeded washes (`washAt` 51001–51003); dark dents with thin light lips and damp lower seams with paint chips (52000+, 53000+, 54000+, 55000+); RR-WIDE broken warm reflection (51730–51732); floor-line wash 51700; drain moved up from y 846–855 to 817–826 (inside the 851 screen bound). Door frames, slats, numbers and handles unchanged. | Doors still rectilinear and repeated (planar architecture). Floor-base blotches (Visual flags). |
| **P10** light and vignette, wide/medium plates | done, scoped | New `src/painted/hanako/lighting.tsx`: `SetLight` (world-space haze) replaces the single warm spot in B01-SH02, B02-SH01, B07-SH01, B07-SH03, B08-SH01 and adds pools in B04-SH01 and B06-SH01; `SetVignette` on B01-SH02, B02-SH01, B04-SH01, B06-SH01, B07-SH01/02/03, B08-SH01. B03-SH01 and B09-SH01 are guarded out. | Painted falloff only, no physical light. Corridor plates read darker overall (Visual flags). Contact-shadow redesign not done (B03 frozen, classroom shadows kept). |
| **P11** map (B06-SH01, B07-SH02) | skipped, no art change | Codex's edge-pigment trial was removed by Codex (read as margin stains); no map code changed. These plates change only through the P10 pool and vignette. | Coastline, graticule and pin unchanged. |
| P03–P07, P12 | not in this group | P03–P07 dropped by the brief; P12 backgrounds would change B05, which must stay unchanged. | — |

## Codex hunks not ported

- `assets.ts`: `paintCorridor` washes (B03-only corridor background, B03 frozen); `paintCabinet` and `paintBook` surround and `propWash` helpers (B05-SH01, B06-SH02: P04/P06/P12 scope); `paintEdgeHand` sleeve and kit change (P03); `KNOCK_DIR`/`KNOCK_ELBOW` inlining and `paintKnockHand` (user-reverted arm direction); `cast`, `kidHand`, `paintKid`, `paintNotebook`, `paintClassroom` (Group A and B03 code already in main).
- `look-r3.tsx`: LF04 folder rewrite (surround and paper; B05-SH02 scope, P05/P12). The map helpers Codex touched are already identical in main.
- `shots/hanako.tsx`: B03 FPOV path (main's `fpovCamera`, `paintFpovChest`, `FpovTag`, `B03_GROUP_RISE` label kept); SVG `TeacherIcon`, `Doodle`, poster and `KidSilhouette` overlays (superseded by the Group A brush paint in main); B03 label y 342.
- `look.tsx`, `look-r4.tsx`, `kit/hands.ts`, `registry.ts`, `p5-brush.d.ts`, painted-2d `SKILL.md`, `build-notes.md`: outside Group C; `look.tsx` and `look-r4.tsx` are already identical to main.
- Codex `render-polish-c.mjs` and `measure-polish-c.py`: not ported; the main `render-g1.mjs` (`HANAKO_OUT`) and `measure-g1.py` were used instead.

## Changed files

- `src/painted/hanako/lighting.tsx` (new, untracked): `SetLight`, `SetVignette`. Same code as Codex; only the header comment differs.
- `src/painted/hanako/assets.ts`: `paintRestroom` only, 4 hunks (+23 / −5).
- `src/painted/shots/hanako.tsx`: import line and the light/vignette call sites (B03 guarded by `!kids`, B09 returns early in KnockOverlay).
- `scripts/hanako/pixel-diff.py` (new): before/after channel-difference counts, used for this pass.
- `scripts/hanako/short/boss-polish-C-report.md` (this report); `scripts/hanako/build-notes.md` (short Group C notes appended).
- Not touched: `scripts/hanako/handoff.md` (already modified in this worktree before this pass).

## Evidence

- Before: `out/qa/hanako/polish-c/before/{g1,g2,g3}` (325 stills, main 3166499). After: `out/qa/hanako/polish-c/after/{g1,g2,g3}` (325 stills, port). Fresh re-render of the untouched-path shots: `out/qa/hanako/polish-c/rerun-after/{g1,g2}`.
- Render: `HANAKO_OUT=<dir> node scripts/hanako/render-g1.mjs [--g2|--g3]` (ANGLE, one frame per `renderStill`, i.e. independent seeks).
- Diff: `python3 -I scripts/hanako/pixel-diff.py BEFORE AFTER OUT.json`. JSON: `out/qa/hanako/polish-c/diff-g{1,2,3}.json`.

Pixel change per shot (channel bytes; "max ≥8" is the largest per-frame count):

| Shot | Frames changed | Max channel delta | Max ≥8 per frame |
| --- | --- | --- | --- |
| B01-SH01 | 2 / 15 | 1 (drift) | 0 |
| B01-SH02 | 13 / 13 | 93 | 2.83 M |
| B02-SH01 | 13 / 13 | 136 | 2.72 M |
| B03-SH01 | 9 / 15 | 1 (drift) | 0 |
| B04-SH01 | 21 / 21 | 32 | 0.37 M |
| B05-SH01, B05-SH02, B06-SH02 | 0 / 22, 0 / 30, 0 / 21 | 0 | 0 |
| B06-SH01 | 21 / 21 | 31 | 0.24 M |
| B07-SH01 | 25 / 25 | 50 | 0.91 M |
| B07-SH02 | 21 / 21 | 11 | 323 |
| B07-SH03 | 18 / 18 | 33 | 0.28 M |
| B08-SH01 | 40 / 40 | 99 | 2.95 M |
| B09-SH01 | 4 / 30 | 1 (drift) | 0 |

Measured (after = port, before = main):

- **Lead height (`measure-g1.py`, magenta isolation):** B03-SH01 f0/100/201 = 917 / 1028 / 1043 px, identical before and after (≥ 480 pass). B07-SH01 f0/95/189 = 733 / 763 / 792 px, identical (≥ 727 gate).
- **Caption band 860–1248 (`caption-zone.py`):** 313 of 313 picture frames pass in both runs; max mean .207, max p95 .331 in both. Per changed shot the mean is equal or lower: B01-SH02 .163 → .147, B02-SH01 .205 → .191, B08-SH01 .167 → .147, B07-SH03 .178 → .172, B07-SH01 .168 → .164, B04-SH01 .133 → .127. The six `lead-*` frames are magenta masks (mean .265–.271), identical before and after; they are not picture frames.
- **Loop seam F2595 → F0 (hook off):** byte-identical before and after (0 channels). F2595 repeat byte-identical.
- **Global tone (full-frame 1×1 area mean, RGB):** B01-SH02 f133 57/77/76 → 47/64/63; B08-SH01 f170 61/79/76 → 47/65/64; B04-SH01 f063 26/34/37 → 25/34/37.
- **Session drift:** the fresh re-render of B01-SH01, B03-SH01 and B09-SH01 with the same code differs from the after set by the same ±1/255 pattern (B01-SH01 + B03-SH01 re-render: 12 of 30 frames, max 1; B09-SH01: 5 of 30, max 1). That matches DF-20261031-render-session-drift. These paths are untouched, so the 1/255 deltas are not from the port. Not isolated to a root cause.

Sheets (labelled before on top, after on bottom, viewed):

- `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/hanako/polish-c/sheets/B01-SH02-before-after.png`
- `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/hanako/polish-c/sheets/B02-SH01-before-after.png`
- `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/hanako/polish-c/sheets/B04-SH01-before-after.png`
- `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/hanako/polish-c/sheets/B06-SH01-before-after.png`
- `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/hanako/polish-c/sheets/B07-SH01-before-after.png`
- `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/hanako/polish-c/sheets/B07-SH02-before-after.png`
- `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/hanako/polish-c/sheets/B07-SH03-before-after.png`
- `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/hanako/polish-c/sheets/B08-SH01-before-after.png`
- Full-resolution crop (pixel judgement, locker base, before | after): `/Users/mangkornkatawong/Developer/reels-creator/.claude/worktrees/hanako-next-437b9b/out/qa/hanako/polish-c/crops/B08-SH01-f100-base-before-after.png`

## Visual flags (for the user; not claimed as done)

1. **Corridor plates darker overall.** The vignette (0.09–0.17 opacity beyond about 225–900 px from centre) lowers the full-frame mean by about 10–14 levels (about 15–18 %) in B01-SH02 and B08-SH01. It is intended P10 falloff, but it is the largest global change in this pass.
2. **Floor base in B08-SH01 (full-res crop).** Dark irregular blotches and a pale haze band sit under the locker line at about plate y 800–840, above the caption band (860). They read more as wet stains than as a reflection. Candidate for lighter pigment.
3. **B02-SH01 door.** Small paint chips and dents are visible on the door face at 270 px. Small change.
4. **B04-SH01, B06-SH01, B07-SH03.** A warm top-left pool now sits over the dark set and reads as a light source.
5. **B07-SH01.** The amber top-left spot is now a narrower set pool, so the warm falloff is weaker.

## Code checks

- `npm run typecheck`: exit 0 (`out/logs/hanako-polish-c-typecheck.log`).
- `npm run lint`: 0 errors, 3 warnings, all pre-existing react-hooks warnings in `look-r3.tsx`, `look-r4.tsx`, `look.tsx` (`out/logs/hanako-polish-c-lint.log`).
- `npm test`: 241 of 241 pass (`out/logs/hanako-polish-c-test.log`). Codex reported 209 on its older base; this count is on current main.
- `git diff --check` on changed tracked files: clean. Trailing-whitespace scan of the new files: clean.

## Editor handoff mapping

- Shared capability: `SetLight`, `SetVignette` (`src/painted/hanako/lighting.tsx`). Consumers: the shots above in `src/painted/shots/hanako.tsx`.
- Shared art owner: `paintRestroom` (`src/painted/hanako/assets.ts`). Consumers: B01-SH02 (RR-WIDE), B02-SH01 (RR-DOOR), B08-SH01 (RR-WIDE, plus its kid silhouettes in paint). B01-SH01 and B09-SH01 use RR-KNOCK, which returns before the changed code.
- No type, validator or registry change. No timeline, audio, caption or registration change.

## Not verified (limitations)

- No Studio cold load, play/pause, backward scrub or unordered seek. Stills only, one `renderStill` per frame.
- No assembled timeline. Neighbour dissolves (for example B06→B07, B07→B08) and the B01-SH01 → B01-SH02 cut were not checked.
- Frames are the listed samples (about 1 Hz plus event frames), not every adjacent pair. No continuous playback review.
- No audio, subtitle, platform-chrome or listening check.
- The look is not approved. Floor blotches, corridor darkness and the warm pools are open for the user.
- Render determinism is single-backend (ANGLE). Session-to-session drift of ±1/255 exists on untouched frames and was not isolated.
- Codex's evidence (`out/` in its worktree) is empty, so its own numbers were not re-checked; all numbers here are fresh on main 3166499 and the port.
- B05 and WORLD FOG were verified only through the pixel diff and the import check (no importer of the changed modules outside Hanako).
