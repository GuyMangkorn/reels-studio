# SHIPWRECK-SHORT build notes

## Boss: painted scene type and plates (29 Oct 2026, branch `claude/shipwreck-boss-painted` from `82c3ceb`)

- Timeline field: `scene.painted = {shots: [{shot, atSec, fromSec?, dissolveSec?, label?}]}` with `bg: 'none'`. Types are in `src/scenes/types.ts`; validation and plate state in `src/scenes/painted.ts`. One canvas per composition (`src/painted/PaintedStage.tsx`) under transparent painted scenes.
- Registered plates (`src/painted/registry.ts`, art in `src/painted/shots/shipwreck.tsx`): `SHIPWRECK-SH01` (also the SH09b seam framing), `SHIPWRECK-SH03a`, `SHIPWRECK-SH03b`, `SHIPWRECK-SH04a`, `SHIPWRECK-SH06`. Event times inside a plate (`SH03B`, `SH06`, `SH04A_LEN`) are exported constants. Re-time them to the Premwadee read there.
- Not yet painted: SH02, SH04b, SH05, SH07a, SH07b, SH08, SH09a. Shared modules available for them: `drawJar` (hero + trace), `drawDiver`, `Shafts`, `Spot`, `Bubbles`, `Vignette`, `paintSite`/`paintJarField`.
- Proof compositions in the spike entry `src/painted/spike/index.ts`: `PAINTED-TIMELINE-Shipwreck` (captions), `PAINTED-PLATES-Shipwreck` (bare plates). They are not in the episode registry.
- SH03b drains to a dark slate paper `#363d42`, not light paper, so the drained frames still pass the caption band (0.234 / 0.235). Film to confirm.
- Speed (`--gl=angle`, cached bundle): 447 plate frames as PNGs in 119 s; captioned 447-frame MP4 in 89 s.
- Finding: [DF-20261029-painted-timeline-dissolve](../../docs/dev-findings/DF-20261029-painted-timeline-dissolve.md) (ink rgba alpha ignored; translucent-plate frames not byte-identical).
