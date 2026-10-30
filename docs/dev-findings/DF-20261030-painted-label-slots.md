# DF-20261030-painted-label-slots — painted fact labels had one slot, so two concurrent labels overlapped

- Owner: Boss; first observed: 2026-10-30 (BLOOP brief VD12, sheet SH11 G1222–G1240 "จินตนาการ" + "เสียงจำลอง"; DEP03); last checked: 2026-10-30 (Boss, uncommitted working tree, base `3130527`)
- Status: fixed (uncommitted; not merged)
- Type: integration-gap
- Tags: 2D / painted / labels / text / timeline
- Scope: `src/scenes/types.ts` (`PaintedLabel`), `src/scenes/painted.ts` (`validateLabel`), `src/painted/Label.tsx` (`slot`), `src/painted/PaintedStage.tsx` (`labelSlots`); tests `tests/bloop.test.ts`
- Consumers: BLOOP-EP01-SHORT (SH11, SH12; slot 2 at y 360–410 in Short). Existing single-string labels (`SHIPWRECK`, `WORLD FOG`) keep slot 1 and render exactly as before.

## Symptoms and evidence
- Desired: two fact labels on screen at once, each in its own box, and a label keeps its box while it stays on (the sheet's "slot 2" for "เสียงจำลอง" across the SH11 → SH12 cut).
- Observed: `PaintedStage` rendered every label at the same box (`top: 300`), so two texts overlapped.

## Attempts and results
- Approach: a cue `label` is a text (slot 1) or `[slot1, slot2]`, where `null` leaves a slot empty. `PaintedLabel` takes `slot` and stacks a box `height + 10` below. `PaintedStage` merges the labels of the visible plates per slot (first text per slot kept, so the dissolve keeps the old behaviour).
- Verified: `validateLabel` accepts one or two slots and rejects three slots, `['']` and `[null, null]`; `paintedStateAt` returns the array unchanged. CLI stills of `BLOOP-QA-SEQUENCE` at G1230 (two labels) and G1260 (slot 2 only) under `out/qa/the-bloop/seq/` (see build notes for the frames).
- Not verified: Studio playback and the rendered Thai glyph positions at phone size (measure with `caption-zone.py` and the QA sheet).

## Planning impact
- Film: concurrent labels are supported; the label keeps its slot only if the cue writes `null` in that slot (the editor must keep the array form when a label leaves slot 1 and stays on).
- Mark: SH11 fallback (VD12, swap the label at G1222) is no longer needed.
- Follow-up: Editor writes the two-slot cues; Film confirms the slot 2 position reads as a second label, not a subtitle.

## Revalidation history
- 2026-10-30 (Boss, working tree): unit tests and CLI stills → fixed within the stated scope. Merge status: not merged.
