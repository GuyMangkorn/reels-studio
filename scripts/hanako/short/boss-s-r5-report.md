# HANAKO-SHORT: Boss `S-R5` report (SCENE-R5, B08-SH01 light dips)

- Role: Boss (shared implementation, plate `Overlay`). Date: 31 Oct 2026.
- Revision: `HANAKO-SHORT-SCENE-R5`, block `B08-SH01`, item I4 ([mark-fear-proposal.md](mark-fear-proposal.md)). Sign-offs: `F-R5-S` (Film, pass with conditions), `B-R5-S` (Boat, pass with conditions C1–C4).
- Checkout: worktree `claude/hanako-next-437b9b`, uncommitted on top of prior work. Nothing committed or pushed.
- Status: **code and picture done; the caption condition is blocked by an Editor cue decision (Q1).** Not user approval, not audio validation, not Studio/seek validation.

## 1. What changed

| File | Change |
| --- | --- |
| `src/painted/shots/hanako.tsx` | New export `b08LightDip(F)`: 0.45 on F2129–F2131 and F2136–F2138, else 0. B08-SH01 plate `Overlay` renders one full-frame `<svg><rect fill="#060c0d" opacity={b08LightDip(F)}/></svg>` only while the level is above 0. It sits after the `CameraLayer` (not camera-tracked) and before `SetVignette`/`Grade`/`Grain`, the same order as the B09 key dip (`KnockOverlay`). Every other frame renders the R4 output. |
| `tests/hanako-plates.test.ts` | New test: exactly six dipped frames in [2046, 2302), all at 0.45, all inside [2127, 2147). |
| `docs/dev-findings/DF-20261030-painted-screen-layers-overlay.md` | Revalidation line (31 Oct 2026): still a workaround. `PaintedStage.tsx` is unchanged from HEAD. |

Not touched: `FilmPoster` and B07-SH03, sound, `src/videos/hanako/index.ts`, `timeline.json`, `build-cues.py`, captions, scene sheet, review rows.

Workaround recheck: `DF-20261030-painted-screen-layers-overlay` still holds. `PaintedStage` mounts canvas, `Overlay` and labels only, so the dip lives in the plate `Overlay`.

## 2. Checks

| Check | Result | Evidence |
| --- | --- | --- |
| `npm run typecheck` | exit 0 | `out/logs/s-r5-typecheck.log` |
| `npm run lint` | exit 0, 0 errors, 3 warnings in `look-r3.tsx`, `look-r4.tsx`, `look.tsx` (untouched files) | `out/logs/s-r5-lint.log` |
| `npm test` | 248 pass, 0 fail (includes the new B08 dip test) | `out/logs/s-r5-test.log` |
| Control stills (before the change) | F2128, F2130, F2134, F2137, F2140 | `out/qa/hanako/B08-SH01-R5/before/` |
| Stills (after) | `node scripts/render.mjs HANAKO-SHORT --stills --frames=2128,2130,2134,2137,2140 --gl=angle`, exit 0, one Chrome, 16 s | `out/logs/s-r5-after-stills.log` |
| Edge run | every frame F2127–F2141 in one run, exit 0 | `out/logs/s-r5-seq-stills.log`, `out/qa/hanako/B08-SH01-R5/seq/` |

## 3. Measured numbers

**Dip state, every frame F2127–F2141** (sRGB mean luma, Rec.709 on gamma values; ratio to F2128 = 58.549):

| Frame | State | Ratio | Frame | State | Ratio |
| --- | --- | --- | --- | --- | --- |
| F2127 | plate | 1.000 | F2134 | plate | 1.002 |
| F2128 | plate | 1.000 | F2135 | plate | 1.001 |
| F2129 | **dip** | 0.637 | F2136 | **dip** | 0.637 |
| F2130 | **dip** | 0.637 | F2137 | **dip** | 0.638 |
| F2131 | **dip** | 0.637 | F2138 | **dip** | 0.638 |
| F2132 | plate | 1.001 | F2139 | plate | 1.002 |
| F2133 | plate | 1.002 | F2140 | plate | 1.002 |

The steps are hard: plate about 58.6, dip about 37.3, no intermediate values. The dips fall exactly on F2129–F2131 and F2136–F2138.

**Acceptance: mean luminance vs F2128 (`scene-sheet` R5 acceptance: 0.55 ± 0.05)**
- Raw sRGB mean ratio: F2130/F2128 = **0.637**, F2137/F2128 = **0.638**. Outside the literal window by about 0.04. **Literal check fails.**
- Cause: the dip is alpha over sRGB values, so mean(after) = 0.55 · mean(before) + 0.45 · Y(#060c0d). Y(#060c0d) ≈ 10.8 of 255, and the mean is about 58.5, so the raw ratio is about 0.55 + 0.083 = 0.633 (measured 0.637).
- Colour-corrected transmittance, (mean(after) − 0.45 · 10.8) / mean(before): F2130 **0.554**, F2137 **0.554**. This matches the spec'd 0.45 key of #060c0d. The colour and opacity were not changed to hit the raw number.
- Linear-light ratio is about 0.38 and does not apply: the browser composites in sRGB.

**Full-frame residual against the control model** (F2130 and F2137 each, vs the pre-change render of the same frame, model = 0.55 · control + 0.45 · #060c0d):
- 99.91% of 2,073,600 pixels within ±2; 99.96% within ±4.
- 751 pixels above 8, all in rows 0–99. That is the channel label at top left, drawn above the plate and therefore not dimmed. No residual in the middle or lower frame, so no shape, shadow, glow or door change appears at the door-3 seam or elsewhere.

**Non-dip frames vs control:**
- F2128 and F2134: byte-identical to the control.
- F2140: 4 channel bytes differ by at most 1 level. A solo re-render differs from the control by 2 bytes at most 1 level, so this is render-to-render noise, not a code effect.

**Subtitle band y 1176–1220:**
- F2128 vs F2130: band mean ratio 0.69. The band dims with the plate, as expected for a full-frame dip. The band mean ratio is above the full-frame figure because the band is darker, so the fixed dark-colour term is a larger share.
- **Caption ink: this is not a caption test in this window.** The built timeline shows no caption from F2127 on (see Q1). Both F2128 and F2130 have 0 band pixels with luma ≥ 200, so "unchanged" holds only because nothing is drawn there.
- Caption timing in the built timeline: F2126 band has 11,989 pixels with luma ≥ 200 (max 255); F2127 has 0. The caption text changes at F2127.

**Layer-order proof (captions above a plate-Overlay dip):** the existing B09 key dip (`KnockOverlay`, 0.4, same plate-`Overlay` mechanism) at composition F2347, where «และเธอจะกลับมาอีกครั้ง…» is on screen (F2303–F2392). Caption ink in the band reaches luma 255 (8,108 pixels ≥ 240) while the plate band median is 35. Captions are not dimmed. This shows the mechanism, not the B08 frames.

## 4. Sheets (viewed)

- `out/qa/hanako/B08-SH01-R5/B08-SH01_sheet_F2128-F2140_after.png`: the five requested frames, 270 px, in order F2128, F2130, F2134, F2137, F2140. Dark-light-dark-light visible. No caption on any tile (see Q1).
- `out/qa/hanako/B08-SH01-R5/B08-SH01_sheet_F2127-F2141_edges.png`: all fifteen frames F2127–F2141, 180 px, 8 columns, row-major. Shows the step timing; door 3 is the centre tile, with no shape or glow.
- `qa-sheet.sh` does not burn labels. Tiles are in the order above, and files are named `B08-SH01_still_F<frame>.png` (`F` = composition-global frame).

## 5. Sign-off conditions

| Condition | Status |
| --- | --- |
| Two dips only (Film, Boat C2) | **met**: test plus per-frame luma, F2129–F2131 and F2136–F2138 |
| Nothing else during or after the dips: no shape, shadow, door movement or seam glow (Film, Boat C1) | **met for picture**: full-frame residual and non-dip frames match the control |
| Opacity ≤ 0.45, step changes (Boat C2) | **met**: 0.45 and 0, hard steps |
| No caption change F2127–F2147 (Film, Boat C3) | **not met in the built timeline**: caption text changes at F2127. Not caused by S-R5; see Q1 |
| No further light or sound event after F2139 (Film (a)) | picture met (no dip after F2139); sound is Editor's |
| Subtitle acceptance F2128–F2140 | cannot be measured as written in this window; see Q1 |
| Photosensitivity: 2 dips at 0.45 in about 0.3 s | by design (Film (c)); not measured |

## 6. Unverified

- Audio: not touched; not listened to. The BZ1/BZ2 buzz is wired in `src/videos/hanako/index.ts` by Editor and was not checked by me.
- Studio and seek: not run. The dip is a pure function of F, but Studio seek parity was not checked.
- Full sequence QA: not run. Coverage is contiguous F2127–F2141 plus F2128/F2130/F2134/F2137/F2140. Neighbours B07-SH03 and B09-SH01 were not reviewed with this change.
- Caption over an actual B08 dip: not visible, because no caption is on screen in the window (Q1). Shown by the B09 mechanism only.
- Lead height and contact: no figure or camera change; not re-measured.
- Full render: not run. Stills only.
- Perceived flicker in motion: not reviewed by a person.

## 7. Open questions

- **Q1 (blocking the caption condition).** The built B08 caption «ฮานาโกะซังอาจไม่เคยมีตัวตนจริง…» runs F2055–F2127 and is blank from F2127 to F2147. The sheet's cue is [2066, 2147). The difference comes from Editor E2 building cues from the voice-lock measure (`editor-e2-report.md`, "Built cues use the voice-lock values"). Two differences: start F2055 vs F2066, end F2127 vs F2147. Where to fix: `scripts/hanako/short/build-cues.py` cue `B08-01` and `timeline.json` scene 8 `subtitleCues`. Options: (a) hold the text to F2147, as the sheet and Film/Boat conditions read; then re-run the caption band check (ink luma 255, not dimmed); (b) keep the F2127 blank and amend the sheet's cue and the Film/Boat condition wording. **Owners: Editor with Mark, Film and Boat.** Boss did not change caption data.
- **Q2 (acceptance definition).** The literal raw sRGB mean ratio is 0.637, outside 0.55 ± 0.05. The colour-corrected transmittance is 0.554, inside. Film to say which measure the acceptance means. The spec'd colour and opacity are unchanged.
- **Q3 (artifacts).** The QA folder `out/qa/hanako/B08-SH01-R5/` is under `out/`. File it with `store.py archive` before the worktree is removed, if it is kept.

## 8. Evidence index

- Logs: `out/logs/s-r5-typecheck.log`, `s-r5-lint.log`, `s-r5-test.log`, `s-r5-before-stills.log`, `s-r5-after-stills.log`, `s-r5-seq-stills.log`, `s-r5-seq-luma.txt`, `s-r5-measure.json`, `s-r5-f2140-noise.json`, `s-r5-pixel-diff.json`, `s-r5-aux-b09-stills.log`, `s-r5-aux-2126.log`, `s-r5-recheck-2140.log`.
- Stills: `out/qa/hanako/B08-SH01-R5/` (after), `before/` (control), `seq/` (F2127–F2141), `aux/` (B09 F2347, B08 F2126, solo F2140), `crops/`.
- One-off measurement scripts are session scratch and not in the repo (`measure_dip.py`, `residual.py`, `seq_luma.py`). `scripts/hanako/pixel-diff.py` (existing, untracked) was used for the control diff.
