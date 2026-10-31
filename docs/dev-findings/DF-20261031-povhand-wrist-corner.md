# DF-20261031-povhand-wrist-corner — a POV fist's wrist-side palm corner drops below the envelope the sheet asks for

- Owner: Boss; first observed: 31 Oct 2026 (HANAKO-SHORT S1-R4, `B02-SH01` viewer's fist); last checked: 31 Oct 2026
- Status: workaround (Film's anchor, size and direction kept; the bottom envelope is not met and is recorded for Film)
- Type: tool-limitation (`paintPovHand` geometry: palm corners and thumb base sit near the wrist, so a low wrist puts the hand's bottom low)
- Tags: 2D / painted / hands / POV / envelope
- Scope: uncommitted working tree on `claude/plate-creation-scene-r3-344e6c` (base `59ef2a2`); `src/painted/kit/hands.ts` (`paintPovHand`, palm corners `P(0, ±0.5·Wp)`, thumb base `P(0.18·Lp, 0.42·Wp)`); `src/painted/hanako/plates-r4.tsx` (`FIST`, `fistKnuckles`)
- Consumers: HANAKO-SHORT `HANAKO-B02-SH01` (screen layer); the B01/B09 knock hand uses the same helper at other anchors (not re-measured)

## Symptoms and evidence

- Film `VD29`: knuckle anchor (990, 745) at F304, size 0.80, dir −2.4 rad, envelope "fist bottom ≤ y 850, left extent ≥ x 892".
- Measured from the paint points (no pixel fit): left extent 922.3 at every key (passes). Bottom of the hand points with 888 < x < 1000 reaches y 892.2 at F421 (x 978.6). Right of the caption-safe box (x > 888), so no fist pixel sits in the caption box.
- Arithmetic: wrist = knuckles − 120·(cos dir, sin dir) = (1078.5, 826); the wrist-side palm corner is about wrist_y + 76·|cos dir| ≈ 882 and the thumb base lies at y ≈ 859.
- Evidence: `scripts/hanako/short/boss-s1r4-report.md`; test `wrist-side corner measured bottom` in `tests/hanako-plates.test.ts`.

## Attempts and results

- Not changed: anchor, size and direction (Film's numbers). A lower-bound bottom ≤ 850 at this anchor needs `|cos dir|` small, which means dir ≈ −2.9 rad; that turns the fingers toward the seam, so it is a Film decision, not a Boss default.

## Planning impact

- Film: decide between accepting the bottom at y ~892 (outside the caption-safe box, so the caption rule holds) and a dir change to about −2.9 rad with a fresh look check.
- Mark: none unless Film changes the anchor or direction.

## Revalidation history

- 31 Oct 2026: measured on the S1-R4 plate code (`FIST` base 1200, size 0.80, dir −2.4). Not re-measured for the B01/B09 knock hand.
