# DF-20261030-zcpaint-g2-far-tube-neck — a `far` tube takes the cel tone and reads as a grey box on a close bust

- Owner: Boss; first observed: 2026-10-30 (Boss pass 12 G1 look check, B01-SH02 charge: "grey neck box"); last checked: 2026-10-30 (pass 13 G2, uncommitted worktree `usage-check-agent-tuning-16bd9b`)
- Status: workaround (infected neck non-far; the collar band still reads as a wide flat ring at charge scale; look check open)
- Type: implementation (cel tone of a `far` part) + visual (flat collar ring at a large scale)
- Tags: 2D / painted / p5.brush / close bust / neck / collar / cel tone / RK-30
- Scope: `src/painted/zcpaint/bust.ts` (`standing`, neck tube `far: !inf`), `src/painted/zcpaint/body6.ts` (`collarStand`, `drawFig`)
- Consumers: B01-SH02 (pf 23–47, the rage front and charge); page E of the R2.6 model sheet (the reference, rendered before this change)

## Symptoms and evidence

- Pass 12 G1 (charge, pf 47): the infected neck was a `far` straight tube, so the whole neck took the cel tone (a grey box). The pass 12 fix replaced it with a taper (no `far`), which read as a pale blob, and the user asked to match page E (G2 binding).
- Pass 13 G2: the page E tube with `far: true` still reads as a grey box at charge scale (`out/qa/zcp-g2/after1/ZCP-B01-SH02_f47.png`, crop `cmp-b01-f47-neck.png`). With `far: false` (`after2`) the centre is pale and the cel shade shows only as two side bands.

## Cause

- `far: true` makes the part draw in the cel tone for its whole length (`paintPart`); the tube is then a flat mid tone against the cream wall. A small reference render (page E at 1/5 scale) hides the box.
- A straight tube under a wide collar stand gives the stand a flat ring read from above at large scale.

## Next (Boss, pass 14)

- Decide the neck tone with the user (Q-G2-4): skin tone with a single shade side, or no side bands.
- The collar ring: check the band height and top arc at 1:1 against page E scaled to the same head width (scale the reference by head width, not by pixels).
- Re-run the guard shots after any change to `bust.ts` (B01-SH01 uses the bust path for YOU only; the infected branch is the only change).

## Revalidation history

- 2026-10-30, pass 13 G2 (uncommitted): infected tube non-far; `tsc`, `eslint`, `npm test` and the WORLD FOG and guard checks in `build-notes` "Boss pass 13 G2".
