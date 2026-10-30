# DF-20261030-render-run-noise — identical-code stills differ by a few LSB between runs; byte equality is not a regression test

- Owner: Boss; first observed: 2026-10-30 (WFOG r6 1 s pass: byte comparison flagged frames in shots with no changed code); last checked: 2026-10-30
- Status: workaround (compare passes by the expected-shot list and a PSNR floor; re-render a flagged frame twice before calling it a change)
- Type: tool-limitation (headless Chromium stills with `--gl=angle` are not bit-stable on this machine)
- Tags: QA / stills / pass comparison / determinism / WORLD FOG
- Scope: `scripts/world-fog/stills.mjs` (one bundle, `renderStill` per frame); `scripts/world-fog/pass-sheets.py` (`cmp` byte comparison per tile)
- Consumers: every WFOG 1 s pass comparison; any check that compares stills byte for byte

## Symptoms and evidence
- Two consecutive renders of identical r6 code (S03-SH01 G1650, S03-SH07 G2100 and G2130, S04-SH01 G2160): byte-different on all four; PSNR between the two runs 105–116 dB (`out/qa/world-fog/WFOG-EP01-SHORT/r6/determinism/a` and `b`).
- Pre-change checkout (`bf0dd6e`) vs the r5 pass in the other worktree: 82 of 88 byte-identical; the six differing frames (S02-SH01 G240/270/300, S03-SH01 G1650, S03-SH07 G2100/G2130) are 95–111 dB.
- Intended r6 changes measure 33–51 dB (S01-SH02 G180 51; S02-SH01 43–45; S02-SH03 33–34; S02-SH06 43; S03-SH02 37–41), so the noise and the changes are far apart.

## Attempts and results
- `pass-sheets.py` byte comparison marks the noise frames as changed; a reviewer would read them as edits. Working rule: changes outside the touched shots need a PSNR below 60 dB, and any flagged frame is re-rendered twice before it is reported.
- Not tried: a fixed GL seed or a single-process render. Unknown whether either removes the noise.

## Planning impact
- Film/Mark: a tile flagged as changed outside the shots the handoff touched is render noise until a re-render disagrees; say so in the review.
- Boss: record the PSNR table with each pass in build-notes.

## Revalidation history
- 2026-10-30, worktree `claude/world-fog-next-steps-2817bc` (uncommitted r6): determinism pair rendered and measured as above.
