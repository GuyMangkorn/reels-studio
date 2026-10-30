# DF-20261030-zcpaint-seated-knee-mitten — seated knee-hug hands as mittens, not knuckled fists (B09)

- Owner: Boss; first observed: 2026-10-30 (Boss pass 17 look check, `out/painted/zcpaint/r26-overview2/overview-24-270.png`: "มือตอนนั่งกอดเข่าไม่ต้องมีนิ้วก็ได้ดูแปลก"); last checked: 2026-10-30 (Boss pass 18, uncommitted worktree `usage-check-agent-tuning-16bd9b`)
- Status: fixed, look check pending
- Type: technique revision (the closed-fist hand `HD-04` is no longer used for the seated knee hug; the fist branch in `handParts` stays for other uses)
- Tags: 2D / painted / hands / BODY-ZCP-6H mitten / seated on the floor / B09-SH01, B09-SH02, B09-SH03
- Scope: `src/painted/zcpaint/body6.ts` (`figSeatFloor`: far and near hand), `src/painted/zcpaint/bust.ts` (`seatFloor`: far and near hand, `MITTEN_6H` imported)

## Symptoms and evidence

- Pass 17 frames (`out/qa/zcp-b18/before-B09-seated-540.png`): the closed fists show four curled finger blocks on the knee, which the user read as fingers that look odd.

## Fix (pass 18)

- Both seated hands per figure use `kind: 'mitten'` with `MITTEN_6H` (0.26 across, 0.36–0.44 long, one hull with the thumb lobe), the same BODY-ZCP-6H mitten the standing figures use. No finger blocks.
- Rendered: `out/qa/zcp-b18/after-B09-seated-540.png` (B09-SH01-TH f57, B09-SH02 f30, B09-SH03 f40). Decoded-RGB diff against pass 17: only these three plates changed among the pass 17 set (B09-SH01 TH and EN f57, B09-SH02 f30, B09-SH03 f40); the others show render-noise levels.

## Limits and revalidation

- Look check pending (user). Film and Mark may revalidate the sheet wording "closed fist" (HD-04) for B09 in the next storyboard revision; Boss does not edit the sheets.
