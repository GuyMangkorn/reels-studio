# DF-20261030-painted-glass-sheen-veil — window pane sheen veils a dark cart in a window plate; per-plate `sheen` option

- Owner: Boss; first observed: 2026-10-30 (Boss r4, S03-SH06 jammed-caster read); last checked: 2026-10-30 (Boss r4)
- Status: workaround (`Glass` takes an optional `sheen`; the default keeps the window look byte-for-byte)
- Type: tool-limitation
- Tags: 2D / painted / p5.brush / window / overlay / lighting / contact
- Scope: uncommitted worktree `claude/wordfog-post-merge-main-959703`; `src/painted/worldfog/layers.tsx` (`Glass` `sheen`), `src/painted/shots/worldfog.tsx` (`windowPlate` `sheen`, `jam`, `lowBank`), `src/painted/worldfog/outside.ts` and `assembly.ts` (jam read)
- Consumers: WFOG-EP01-SHORT S03-SH06 (sheen 0, lowBank 0.2); every other CAM-GLASS-OUT window plate keeps sheen 1; brief `VB-WFOG-EP01-SHORT-R4` VD07 (window overlays); sheet `SS-R3.3` S03-SH06 Q4

## Symptoms and evidence
- Desired: the jammed caster's tyre core at G2050 has mean luma <= 0.12 (SS-R3.3 Q4, near-black rubber). Observed: 0.31 (r3, grey tyre under the low fog bank), then 0.20 with the near-black `#121516` tyre and the low bank at 0.2 (the pane sheen still on).
- Cause (measured, labelled frame G2050): `Glass` paints a `#cfd8d6` gradient from the glass line 320 px upward at opacity 0.2 (plate px). The insert camera is scale 3 about (577, 1219), so the gradient reaches the cart; at the caster it is about 0.13 opacity, which lifts a near-black tyre by about +0.10 luma.
- Reproduce: `node scripts/world-fog/stills.mjs --out=DIR --frames=2050` (production entry), then `python3 -I scripts/world-fog/qa-measure.py lum FRAME 520 670 532 740`.
- Coverage: CLI stills from the production entry (two browser runs, opposite frame order, byte-identical). Studio not run.
- Root cause: confirmed by measurement (sheen 0.2 -> 0 with the bank at 0.2: core 0.094 and 0.095; the pane wash was the remaining lift).

## Attempts and results
- Estimate only (not rendered): a darker tyre under the same sheen would land near 0.14 (0.87 x near-black + 0.13 x the pane wash), still above 0.12; the sheen option was used instead.
- Optional `sheen` on `Glass` (default 1 leaves the SVG stop at 0.2) and sheen 0 for S03-SH06: core 0.094 and 0.095; with the torch pool brightened (`#ecdcb0` at 110) the ground band is 0.398 (target >= 0.35). Result: pass.
- Cost: the pane wash is removed from this 36-frame insert only; the window look elsewhere is unchanged by this option.

## Planning impact
- Film: a painted window overlay lifts the darks of props in the lower frame, so a dark close insert behind glass needs sheen 0 (or a brief-level choice of the pane wash). Reviewed by Film: not yet.
- Mark: S03-SH06 keeps the sheet's caster read values (size, core, ring, hub). The glass in the insert is flatter than the other window shots.
- Follow-up: none for Boss unless Film wants the pane wash kept in close inserts; then the caster target needs a layer that sits above the pane wash.

## Revalidation history
- 2026-10-30 Boss r4 (worktree, uncommitted) -> measured at G2050 (core L 0.095 / R 0.094, dark core 64 x 112 px, ground band 0.398) -> workaround; Film/Mark adoption: not yet read.
