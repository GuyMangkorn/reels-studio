# DF-20261030-p5brush-large-fill-mottle — a textured p5.brush fill on a large polygon mottles; a wash does not

- Owner: Boss; first observed: 30 Oct 2026 (pass 3, ZCPAINT sets); last checked: 30 Oct 2026 (pass 5 unchanged)
- Status: workaround
- Type: tool-limitation
- Tags: 2D / texture / flatness / tooling
- Scope: `src/painted/zcpaint/sets.ts` `flatKit`; measured with `scripts/zombie-condo-paint/flatness.py`; `out/painted/zcpaint/flattest/`
- Consumers: ZCPAINT sets B04–B10, POV backdrops, the B03 View B floor and walls; WORLD FOG untouched (its own fills)

## Symptoms and evidence
- Desired: flat, clean sets as clean as the characters (user, 30 Oct 2026). Observed: a nine-pass textured fill on a 1000 x 400 px area is mottled (luma SD 0.016); `brush.wash(color, 255)` on the same area is flat (SD 0.000).
- Reproduce: `out/painted/zcpaint/flattest/clean0.png` (textured) vs `clean1.png` (wash); `python3 -I scripts/zombie-condo-paint/flatness.py FRAME.png 100 1400 1000 1800`.
- Coverage: the set plates in pass 3 and the POV plates in pass 5 (flat kit everywhere on backgrounds and sets); characters keep their textured passes.

## Attempts and results
- Approach → outcome: `brush.wash` for every background and set fill; ink outlines keep the boil; paper grain stays in the `Grain` layer. Measured neighbour area SD 0.0213 → 0.0072 (pass 3).
- Remaining: wash-only fills carry no texture, so large flat areas read as plain colour; the look check decides whether that is too plain.

## Planning impact
- Film: backgrounds and sets are flat by rule (`MK-ZC-ST-08`); a brief that asks for a texture on a large area must name the cost.
- Mark: none.
- Follow-up: Film may record this in the painted-2d skill gotchas (proposed, not applied).

## Revalidation history
- 30 Oct 2026, pass 3 → measured (flatness.py) → workaround → pass 5 kept the flat kit on every new plate.
