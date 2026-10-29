# SHIPWRECK-SHORT build notes

## Boss: painted scene type and plates (29 Oct 2026, branch `claude/shipwreck-boss-painted` from `82c3ceb`)

- Timeline field: `scene.painted = {shots: [{shot, atSec, fromSec?, dissolveSec?, label?}]}` with `bg: 'none'`. Types are in `src/scenes/types.ts`; validation and plate state in `src/scenes/painted.ts`. One canvas per composition (`src/painted/PaintedStage.tsx`) under transparent painted scenes.
- Registered plates (`src/painted/registry.ts`, art in `src/painted/shots/shipwreck.tsx`): `SHIPWRECK-SH01` (also the SH09b seam framing), `SHIPWRECK-SH03a`, `SHIPWRECK-SH03b`, `SHIPWRECK-SH04a`, `SHIPWRECK-SH06`. Event times inside a plate (`SH03B`, `SH06`, `SH04A_LEN`) are exported constants. Re-time them to the Premwadee read there.
- Not yet painted: SH02, SH04b, SH05, SH07a, SH07b, SH08, SH09a. Shared modules available for them: `drawJar` (hero + trace), `drawDiver`, `Shafts`, `Spot`, `Bubbles`, `Vignette`, `paintSite`/`paintJarField`.
- Proof compositions in the spike entry `src/painted/spike/index.ts`: `PAINTED-TIMELINE-Shipwreck` (captions), `PAINTED-PLATES-Shipwreck` (bare plates). They are not in the episode registry.
- SH03b drains to a dark slate paper `#363d42`, not light paper, so the drained frames still pass the caption band (0.234 / 0.235). Film to confirm.
- Speed (`--gl=angle`, cached bundle): 447 plate frames as PNGs in 119 s; captioned 447-frame MP4 in 89 s.
- Finding: [DF-20261029-painted-timeline-dissolve](../../docs/dev-findings/DF-20261029-painted-timeline-dissolve.md) (ink rgba alpha ignored; translucent-plate frames not byte-identical).

## Editor: narration, plates, assembly and sound (29 Oct 2026, branch `claude/shipwreck-editor-2a02dd` from `a334f34`)

- **Voice:** `scripts/narration.py` takes `--voice` and `--rate` (defaults Niwat, +5%, so other episodes are unchanged) and retries Edge TTS `NoAudioReceived` (it failed on roughly half the requests on 29 Oct 2026, then succeeded on retry).
- **Read and pacing:** Premwadee +5% reads R1.1 in 46.2 s of speech per beat, but pauses only 80–130 ms on "…". To author the script's pauses, the narration is 21 slots (split only at pauses or events the picture or sound needs) with 49.6 s of speech plus 6.2 s of pauses and the 3 s hold: **59.17 s, 1,775 frames**. Per-slot clips run about 0.2 s longer than the same words inside a beat (phrase-final lengthening), so merge phrases where no pause is needed. No trim was applied (under 60 s). R2 after the user's read notes (29 Oct 2026): 22 slots; `narration.py` gained per-slot `cuts` and `gains`; details in the [edit plan](../../storyboards/oldest-shipwreck/short/edit-plan.md). Total length and all beat starts are unchanged.
- **Single source:** `scripts/oldest-shipwreck/short/narration-timeline.json` holds each slot's beat, VO, duration, slot-local caption cues, plate cues and SFX; `src/videos/oldest-shipwreck/index.ts` groups the slots into nine beat scenes and holds the beds. Cue offsets inside merged slots come from measured silence gaps.
- **Plates added** (`src/painted/shots/shipwreck.tsx`, staging and timing only, shared modules unchanged): `SHIPWRECK-SH02`, `-SH04b`, `-SH05`, `-SH07a`, `-SH07b`, `-SH08`, `-SH09a`, `-SH09b`. `SH01.serves` is now `['SH01']`, because SH09b has its own plate. SH09b's clock is `min(0, tl - end)`, so it paints SH01 at clock 0 with SH01's camera from the B_loop hold start. The wide shots (SH02, SH08) paint the SH01 field at 0.8 about (540, 850) under a surface glow, so every shot camera keeps `s >= 1`, which the painted tests require.
- **Retimed constants:** `SH03B` (flash 0.35, freeze 1.27 on "หรืออาจไม่ใช่เลย", drain 1.33–2.8), `SH04A_LEN` 3.4, `SH06` (mix 0.5–1.75, landing on "รูปทรงเดียวกัน"). The freeze test in `tests/painted.test.ts` now reads `SH03B.freezeAt`.
- **Caption band:** three frames failed before the fix (SH02 first frame p95 0.441, SH08 first frame 0.443, SH09b mid-ease 0.443): pushes about a high focus moved lit sand into the band. Fixed by pushing about the field base (y 820) and starting SH09b at s 1.9. The brief's SH02 "slow tilt down" is dropped for the same reason (pull-back only).
- **Sound:** five sounds generated and filed in the shared library (`listened: no`, picked by envelope and spectrogram): `water_underwater-shallow-ambience_01`, `weather_sea-storm-wind-waves_01`, `water_diver-regulator-bubbles_01`, `weather_thunder-roll-distant_01`, `bed_underwater-mystery-sparse_01`. Reused from the library: `weather_rain-thunder-distant_01`, `ui_click-tick_01` (not low-passed: there is no runtime filter, so it is used at gain 0.12), `reveal_riser-tension_01`, `impact_cinematic-boom_01`. `stinger_outro-resolve_01` is copied but unused (it would sit on the stressed number). The last ambience entry runs exactly two 14.5 s loop periods, so it ends on frame 0's phase.
- **Known limitation seen:** in the SH07a→SH07b and SH09a→SH09b in-canvas dissolves, the incoming plate's ink outlines show at near-full presence over the outgoing plate, because ink fades by colour mix and not alpha ([DF-20261029-painted-timeline-dissolve](../../docs/dev-findings/DF-20261029-painted-timeline-dissolve.md)). This is visible for about 0.3 s per dissolve.
- **Minor:** `paintParticles` (`src/painted/sea.ts`) drops particles whose x goes negative at negative times. Only SH09b's ease uses negative clock values (at most about 6% of particles, for under 2 s). Left as-is.

### Tools (TL)

| ID | Script | Use |
| --- | --- | --- |
| TL01 | `scripts/oldest-shipwreck/short/stills.sh` | `--gl=angle` stills from `out/bundle-shipwreck`, `full` or `bare` (plates only) |
| TL02 | `scripts/oldest-shipwreck/short/check-cues.py` | Caption cue starts vs speech onsets in the narration file |
| TL03 | `scripts/oldest-shipwreck/short/lead-height.py`, `lead-geometry.ts` | Lead extents: clay mask on frames, and geometry with the shot cameras |
| TL04 | `scripts/oldest-shipwreck/short/copy-sounds.sh` | Copy the library sounds into `public/` (WAVs local, NOTICE committed) |
