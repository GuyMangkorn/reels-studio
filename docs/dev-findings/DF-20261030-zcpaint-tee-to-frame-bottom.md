# DF-20261030-zcpaint-tee-to-frame-bottom — the sheet's head size and shoulder line leave the 6-head hips in the lower third; the tee runs to the frame edge

- Owner: Boss (plates); Film and Mark decide the framing; first observed: 30 Oct 2026 (pass 9, B01-SH01 back view); last checked: 30 Oct 2026
- Status: workaround
- Type: spec-conflict (framing) with a Boss workaround
- Tags: 2D / framing / proportions / OTS / 6-head / legs
- Scope: `src/painted/zcpaint/body6.ts` (`teeToFrameBottom`, exported), `src/painted/zcpaint/corridor.ts` (B01-SH01 back view), `src/painted/zcpaint/closeups.ts` (B02-SH03 front close)
- Consumers: B01-SH01 (OTS back view), B02-SH03 (freeze close)

## Symptoms and evidence
- The sheets give a head size and a shoulder line that put the 6-head hips at about 1.0 m above the floor in frame: B01-SH01 head about 280 px at (250, 440) (K about 123), shoulder line y 650; B02-SH03 head about 322 px (K 142), shoulder line y 684. At those head sizes the hips fall at y 1150-1260, and the shorts and legs fill the lower third.
- The same sheets say "upper back to the frame bottom" (B01-SH01) and "tee to the frame bottom" (B02-SH03). The first plate build (pass 9, before the workaround) showed the legs in the lower third, which the sheets do not show.

## Attempts and results
- Workaround (pass 9): a shirt-coloured block from the hem (2.96 heads) to below the frame, painted over the shorts and legs and under the arms, the hands and the bag. It reads as a long teal tee; the arms, bag and face are unchanged. Viewed: `out/painted/zcpaint/p9/b01/beat-b01-sheet-r2.png`, `out/painted/zcpaint/p9/b02/beat-b02-sh03-sheet-r2.png`.
- Not tried: a smaller head at the same staging (changes the sheet's head size), or a lower camera (changes the perspective).

## Planning impact
- Film: confirm the intended framing (legs out of frame by design, or the hips visible). If the hips should show, the head size on B01-SH01 and B02-SH03 changes, not the figure proportions.
- Mark: revalidate the sheet's head and shoulder numbers against the 6-head body (D-P9-1 in build-notes "Boss pass 9").
- Editor: none; the plates are the same for TH and EN.

## Revalidation history
- 30 Oct 2026, pass 9 → workaround in `teeToFrameBottom`, viewed on B01-SH01 f0/f60 and B02-SH03 f0/f39/f83 → workaround; framing open for Film or Mark.

- 2026-10-30, pass 10: the close bust (`DF-20261030-zcpaint-close-bust`) replaces the tee block on the closes; at the sheets head sizes the 6-head legs still show in the lower frame on B01-SH01, B02-SH03 and B07-SH01 (Film decision, Q-P10-1). Not closed.
