# DF-20261030-zcpaint-day3-stubble-spots — day-3 stubble dots read as spots at 270 px

- Owner: Boss; first observed: 30 Oct 2026 (pass 8, B10 front and side views, 270 px tiles); last checked: 30 Oct 2026
- Status: fixed in pass 17 (R2.6 overview; look check pending). The density question is answered by the S-P01 decision (fine dots); Boss chose the density, see `Q-R26-O17-2`.
- Type: look (user taste), measure not taken
- Tags: 2D / face / day three / stubble
- Scope: `src/painted/zcpaint/body6.ts` `stubble()` (about 40 dots of 1.7-2.3 px at 50 % skin mix); `cast.ts` `paintDay3Face` (the older 150-dot version, not used by the 6-head figures)

## Symptoms and evidence
- In the B10 front view and the profile at 270 px, the dots read as dark spots on the cheek, not as stubble. The user's words (30 Oct 2026): "หนวดเป็นจุดเล็กๆ" (fine dots). The 7b look check left the density open.
- Not measured. No full-resolution crop of the face was taken in pass 8.

## Next step
- Coordinator asks the user Q-P7b-3 (density and tone). Film may choose a finer dot or a lower contrast; Boss changes `stubble()` only after the answer.

## Pass 17 fix (30 Oct 2026)

- Cause: `stubble()` drew 40 random dots of radius 0.03–0.042 K (K = decal unit); with `hash` placement they clumped into blobs, hexagons 15–20 px across at the bust close.
- Fix (`src/painted/zcpaint/body6.ts`): one jittered dot per 0.03 K cell over the jaw box, radius 0.0045–0.006 K. Measured at bust close (B09-SH02 f30) about 1.2–1.6 px radius, evenly spread; full figure (B09-SH01-TH f57, B09-SH03 f40, B10-SH01 f112) a fine grain at full resolution.
- Evidence: `out/qa/zcp-r26-fix/before-after-crops-labelled.png`, `out/painted/zcpaint/r26-overview2/overview-24-270.png`. Look check pending.
