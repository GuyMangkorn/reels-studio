# DF-20261030-painted-story-hold-ambient-clock — a story hold on one clock freezes the fog, ripple and breath; split event and ambient clocks

- Owner: Boss; first observed: 2026-10-30 (Boss r10, SS-R5.1 holds, WFOG-EP01-SHORT); last checked: 2026-10-30 (Boss r10, uncommitted worktree `claude/world-fog-next-steps-2817bc`)
- Status: workaround (each plate reads two clocks: `storyAt` for event logic, `ambientAt` for continuous motion). Revalidate after any new hold or stretch.
- Type: design-limitation (one clock per plate) and tool-limitation (QA entry drew caption scrims)
- Tags: 2D / painted / hold / story clock / fog drift / lens ripple / breath / QA
- Scope: `src/painted/worldfog/space.ts` (`STORY_CLOCK`, `storyAt`, `ambientAt`, `pchip`, `frontAt`, `fogAt`, `lampAt`); `src/painted/shots/worldfog.tsx` (`clocksAt`, `plate`, `windowPlate`, S03-SH07 event frame `e`); `src/painted/worldfog/outside.ts` (`OutsideOpts.ambient`); `shop.ts` (`paintShop` `ambient`); `layers.tsx` (`Halos` `ambient`); `assembly.ts` (`asmPoseAt(G, A)`, `heldLook`, `pose.g` = ambient); `qa.tsx` (picture-only timeline)
- Consumers: WFOG-EP01-SHORT S03-SH03 (hold f120–f159), S03-SH04 (f42–f45), S03-SH05 (f72–f99), S03-SH06A (f120–f215, extra eyes-only blink f170–f174), S03-SH07 (f72–f127), S04-SH01 (talk-span stretch, ambient only); unheld shots take A = G

## Symptoms and evidence
1. Symptom (design check before r10): a hold keyed only on the story clock would freeze every term that reads `G / 30`: the outside fog drift `t`, the lamp halo shimmer, the fog-lens ripple phase (`fogWarp` reads `pose.g`), the veil patches and the held breath. The sheet asks for fog and breath to keep running through holds (SS-R5.1 C-2, "never frozen").
2. Fix: plates get `G` (event key: holds and stretches per RK-2) and `A` (ambient: story start minus shift, plus the shot-local frame; continuous). Events (lamps, FOG-STATE, lens amount, pose, beam, door, cart) read `G`; drift, ripple, veil and breath read `A`. For an unheld shot `A = G`.
3. Event logic inside a hold must follow the event clock. S03-SH07's glance, occupant nod and occupant look were shot-local frames in r9b; read on raw `f` they would snap after the hold (the glance would be past its return at f84). They now read `e = G − storyAt('S03-SH07', 0)`, held at e71 over f72–f127, then the r9b story from e72 (= f128).
4. Tool lesson: the WFOG-QA entry drew the timeline's caption scrims (`media`, the box y 1020–1280), so a picture-only frame carried a caption box wherever the caption windows fell. Parity frames now mask y 1000–1300 (`scripts/world-fog/parity-psnr.py`); the QA entry drops `media` from a copy of the timeline. The validator rejects an empty `media` array, so the key is deleted, not emptied.

## Checks (r10)
- Parity (154 pairs of unchanged-length shots at the same story key, r9b → r10, chrome off, luma PSNR of y 300–1920 with the scrim band masked): 146 byte-identical (inf dB). Non-identical: S02-SH01 f0 (53.6 dB; story key 510 lies inside the S02-SH00A fog ramp, fog level 1.967 vs 2.0 for f0–f5), S02-SH06 f60 (52.5 dB), S02-SH08 f75–f135 (53–67 dB), S02-SH10 f75 (41.4 dB): all four in shots whose narrator mouth windows changed per C-12. Table: `out/logs/r10-parity-picture.tsv`.
- Determinism: S03-SH07 G2800 luma PSNR 111.3 dB between two renders (1-byte PNG size difference); S04-SH01 G3200 byte-identical.
- Not verified: Studio cold load and scrub (no interactive session); the production `src/index.ts` render (blocked: `audio/room/room_shop-fridge-hum_01.wav` absent in this worktree, 404).

## Film / Mark implications
- Film: a hold that holds only the event (glance, pose, beam) keeps the fog and breath moving; the cue windows of S02-SH06, S02-SH08 and S02-SH10 changed per C-12 (mouth frames only).
- Mark: any future hold or stretch on a plate must name both clocks in the sheet (event key and ambient key); a hold on the event key alone freezes the fog.
