# DF-20261116-painted-seated-card-low-in-cabin — a seated four-head figure sits too low in a real-size car cabin

- Owner: Boss; first observed: 2026-11-16 (EDU-EP21-SHORT W5.2 BG1 and BG2); last checked: 2026-11-16
- Status: workaround (per-lens cheat in EP21; shared kit unchanged)
- Type: tool-limitation
- Tags: 2D / painted / camera / scale / car cabin
- Scope: branch `claude/episode-21-continuation-33d2a4`, uncommitted; `src/painted/edu21/cabin.ts`, `src/painted/edu21/driver.ts`, `src/painted/edu21/car.ts`; kit pose P12 (seated, hands up)
- Consumers: EDU-EP21-SHORT B02-SH05 (windscreen lens), B01-SH02 (P12 face hands), SHEETS-R1; other deliverables with a four-head seated figure in a real-size vehicle are unchecked.

## Symptoms and evidence
- Desired → observed: a seated figure reads as sitting in the cabin from every lens. On the four-head card in a real-size cabin her shoulders sit about 0.87–0.89 m and her chin 0.955 m, which is under the door beltline (0.92 m), the wheel top (1.11 m) and the dash (1.0 m).
- Effects: (1) from a side lens the kit's P12 hands disappear behind the door, so the startle does not read; (2) from a lens looking in through the windscreen she hides behind the wheel and dash unless the camera eye is above about 1.43 m, and that eye height fills the frame with windscreen and loses the bonnet.
- Side and rear lenses hide the mismatch.
- Evidence: Boss BG1 and BG2 sections of `scripts/edu-series/ep21/build-notes.md`; BG2 stills `out/qa/edu21/bg2/final/`.
- Coverage: draft stills only; no video render. Root cause: card proportions against real-world cabin dimensions (confirmed by projection numbers in `bg1-measure.py` and `bg2-measure.py`).

## Attempts and results
- Raised the P12 hand targets to cheek height (SH02); drew the dash, hood and wheel 0.26 m lower for the windscreen lens only (SH05, opt-in cheat). Both pass the caption band and lead checks. Raising the camera to 1.45 m was rejected (loses the bonnet).
- Cost: a per-lens cheat that every later windscreen lens must repeat.

## Planning impact
- Film: pick lenses that avoid a windscreen view of a seated figure, or accept the per-lens cheat; record it in the scene sheet.
- Film (scene sheets): EP21 SH05 uses the cheat (open question Q6).
- Follow-up: user review of a kit change (seated P12 targets, or a seated-in-vehicle card height); not applied.

## Revalidation history
- 2026-11-16, working tree → stills and projection measurements → workaround.
