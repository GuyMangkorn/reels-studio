# DF-20261030-zcpaint-b09-sh02-feet-frame — R1.4 close framing puts the bare feet at the frame bottom

- Owner: Boss (geometry) and Mark (sheet numbers); first observed: 30 Oct 2026 (pass 15, B09-SH02 moved to the R1.4 framing); last checked: 30 Oct 2026
- Status: open (Mark decision)
- Type: integration-gap (sheet numbers vs bust proportions)
- Tags: 2D / framing / close / seated / bust
- Scope: uncommitted `src/painted/zcpaint/closeups.ts` (`B09_HEAD`, `B09_FLOOR_Y`), `src/painted/shots/zcpaint.tsx` (`camB09Sh02`); bust `seatFloor` in `bust.ts` (shared with WORLD FOG only through `seated: true` in `shots/worldfog.tsx`, not changed)
- Consumers: `ZCP-B09-SH02` (TH [1776, 1821), EN [1740, 1779)); neighbours B09-SH01 (seated section) and B09-SH02B (POV)

## Symptoms and evidence
- Sheet R1.4 (`sc01-b09-b10.md` B09-SH02): head centre (560, 720), head ≈600 px (face y 420–1020), floor line and feet below the frame bottom, camera about (470, 690).
- The R1.3 framing in the code (540, 610; 360 px) keeps the floor line at y 1290 with a bare foot on it: the sheet's R1.4 acceptance ("no floor line or foot in frame") fails.
- Moving to R1.4 (pass 15): the floor line is out of frame, but the bare foot is still in the frame bottom: foot top ≈ y 1820, foot bottom at the frame edge ≈ y 1920 (`out/qa/zcp-p15/b09sh02-bottom-540.png`).
- Cause (measured by the crop): in the seated bust the feet sit 1.83–1.99 head units below the head centre. R1.4's chin at y 1020 needs a head centre at 720, which puts the feet top at ≈1820. The feet clear the frame only at ≥ 2.0 head units, i.e. a head centre near y 820 (chin 1120) or a head ≈660 px (chin ≈1050). No placement meets both acceptance numbers.

## Attempts and results
- R1.3 framing kept → floor and foot visible (rejected by the sheet).
- R1.4 framing built → foot at the bottom edge; no shared-bust change made (the seated bust is also in the WORLD FOG spike path).

## Planning impact
- Mark: decide one of (a) accept the foot tips at the frame bottom; (b) head centre y ≈820 (chin ≈1120, the face acceptance changes); (c) head ≈660 px (chin ≈1050); (d) revert to R1.3 (360 px, floor visible). Boss builds the chosen numbers in three constants.
- Film: the seated close is a tired-face close; a foot at the bottom edge reads as a stray object unless accepted.
- Follow-up: question `Q-P15-1` for the user through the coordinator (see build-notes pass 15).

## Revalidation history
- 30 Oct 2026, pass 15 → crop at full resolution, measured offsets → open.
