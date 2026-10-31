# DF-20261031-render-session-drift — untouched plate frames differ by 1/255 between render sessions

- Owner: Boss; first observed: 31 Oct 2026 (HANAKO-SHORT polish A re-renders); last checked: 31 Oct 2026, working tree (pre-commit).
- Status: open (characterised, cause not isolated).
- Type: tool-limitation.
- Tags: tooling / render / repeatability / loop seam.
- Scope: `scripts/hanako/render-g1.mjs` (`@remotion/renderer`, Chrome `--gl=angle`), `src/painted/hanako/qa-index.tsx`.
- Consumers: HANAKO-SHORT `HANAKO-B09-SH01` (loop F2595 → F0, layers-off F2383), `HANAKO-B03-SH01` repeat.

## Symptoms and evidence

- B09 frames that no edited code path reaches differ from the earlier render of the same tree by 0–3 channels, maximum 1/255: `B09-SH01-f293` (1 channel), `loop-landing-f0` (3), `layers-off-f204` (0), `layers-off-f045` (2), `B09-SH01-f204` (3). `out/qa/hanako/polish-A/before/g3` vs `after/g3`.
- In the same run, the same composition rendered twice is byte-identical (`repeat-f293`, `repeat-f100`).
- The G3 record ("F2595 → F0 byte-identical, 0 channels") did not reproduce on the pre-edit tree in this session (3 channels, 1/255).

## Attempts and results

- Not isolated. Candidates not tested: GPU/ANGLE rounding across Chrome processes, font load timing, and the order of composition mounts in one process (the loop-landing composition differs from B09 in the same run by 1–3 channels).

## Planning impact

- Strict byte-identity of a loop seam is a per-session claim here. Report it with the session and the channel counts; do not claim cross-session identity.
- Re-test on the delivery render backend before treating repeatability as passed.

## Revalidation history

- 31 Oct 2026: characterised with the before/after pair; open.
