# DF-20261030-zcpaint-collar-neck-close — the close bust's visible neck must be measured at the pitched chin

- Owner: Boss; first observed: 2026-10-30 (Boss pass 11, R2.6 model sheet, page E infected profile); last checked: 2026-10-30
- Status: workaround (the collar band follows the pitched chin; look check pending)
- Type: measurement / geometry (a head pitch moves the chin forward and down; the un-pitched chin gives a wrong neck length)
- Tags: 2D / painted / p5.brush / close bust / collar / neck / head pitch / RK-30
- Scope: `src/painted/zcpaint/bust.ts` (`profile`, `visibleNeckHU`), `src/painted/zcpaint/body6.ts` (`collarStand`, `collarSide`, `collarSeat`); `CS-ZCP-R26` and `FR-ZCP-CLOSE` (`B8`)
- Consumers: every ZCPAINT close bust with a pitched head: B01-SH02 (infected turn), B07-SH01 (profile reach, pitch 0), B09-SH02 (seated, pitch from the sheet); the R2.6 model sheet pages E and F/G

## Symptoms and evidence
- The first `visibleNeckHU` read the chin un-pitched: the infected profile (slump 1, head pitched 0.25 rad) measured 0.093 head, but the pitched chin sits at about x 0.48, u 4.81, past the collar band's front end (x 0.30), so the bare neck in front of the band is about 0.15 head (the model sheet showed the band ending short of the chin).
- Pitched chin, from the decal chin 0.537 head below the head centre and rotated about the neck pivot (SideSheet sense): (0.48, 4.81) at slump 1; un-pitched (0.38, 4.84).
- Measured after the fix (`out/logs/r26-neck-default.log`, chin column): bust profile zc-you 0.054, infected profile slump 1 0.029, front busts 0.090.

## Attempts and results
- Attempt 1: a band to the un-pitched chin: 0.093 on paper, a visible gap at the pitched chin (rejected by the geometry above).
- Attempt 2 (kept): the band top runs under the pitched chin (0.04 head below it) and reaches to the chin's column; `visibleNeckHU` rotates the chin with `head.tilt` about `head.pivot` and measures at the chin's column by default.
- Side effect to review at full resolution: in profile the band reads as a short flat shelf under the chin (model sheet page E). Fallback: front busts only, and the profile neck left bare (B8 then fails in profile).

## Planning impact
- Film/Mark: the close's neck rule (B8) is a front and profile rule; the profile neck is measured at the pitched chin. The infected profile close (B01-SH02) needs the user's look check of the shelf read (`Q-R26-3`).
- Boss: measure any close neck at the head's actual chin (after pitch), never at the decal's rest position.

## Revalidation history
- 2026-10-30, worktree `usage-check-agent-tuning-16bd9b` (uncommitted pass 11): `tests/zcpaint-costume.test.ts` collar test (6 tests with the costume checks) and the R2.6 sheet pages E/B; `npm test` 142 of 142.
- 2026-10-30, pass 12 (uncommitted, G1 plates): `placeClose` (`bust.ts`) now pitches the chin with `head.tilt`, as `visibleNeckHU` does. Before this, the infected silhouette at B01-SH02 would have put its chin about 20 px off the row. Test: `tests/zcpaint-costume.test.ts` "waist-cut closes (G1, R1.4)" (pitched chin 860). Visible neck on the G1 closes: 0.029–0.090 head (`out/logs/g1-measure-2.log`).
- 2026-10-30, pass 12 G1 fixes (uncommitted): the profile band's back edge moved from x −0.28 to 0.12 (the neck's back edge); the B01 silhouette spike was that sliver (the approved R2.6 model sheet page E infected profile shows the same spike and is not regenerated). The infected front neck is a taper (jaw 0.26 to band 0.38) instead of a grey tube. Look check pending.
