# DF-20261030-painted-layer-order — an opaque underlayer hides earlier marks; ink fades toward the plate paper

- Owner: Boss; first observed: 2026-10-30 (BLOOP SH07 ghost under the map wash: the ghost did not show; SH11 morph outline); last checked: 2026-10-30 (Boss, working tree, base `3130527`)
- Status: workaround (paint order by hand; no shared fix yet)
- Type: tool-limitation
- Tags: 2D / painted / p5.brush / layering / ink
- Scope: `src/painted/sea.ts` (`bands` lays an opaque `flat` underlayer first), `src/painted/painter.ts` (`makePainter` fades ink toward the plate's `fade` colour, not the local water), `src/painted/bloop/sets.ts` (`paintMapOcean`, `paintIce`)
- Consumers: BLOOP-EP01-SHORT SH07 (ghost under the map wash, VD08), SH11 (ICE morph, DF-20261030-painted-glaze-pickup), SH13 (far ice)

## Symptoms and evidence
- Desired: the `CR-DREAM` ghost painted before the map ocean and still visible through it (sheet SH07: "painted under the map wash").
- Observed: `bands()` starts with an opaque `flat` underlayer over the whole ocean, so the ghost painted first was hidden completely (first render of `BLOOP-PLATE-SH07`, frames 0–101).
- Observed: a morph outline (`paintIce` ink) drawn at 6 % layer alpha showed as a dark box on the cold water, because ink mixes toward the plate paper (`#0a171d`), not the water behind it.

## Attempts and results
- `paintMapOcean(p, {between})` draws the opaque underlayer, then the caller's marks, then the translucent wash bands (`bands` logic inline). The ghost shows through at about 50 % minus the wash opacity.
- `paintIce(..., {ink: false})` until the morph is ≥ 0.85; the outline appears then (a small pop, accepted).
- Not solved: `layer(alpha)` still mixes ink toward the plate paper; a per-call fade colour would be a shared change in `painter.ts` (not made).

## Planning impact
- Film: a translucent overlay on a painted ghost needs the underlayer order; state it in the brief when a mark sits under a wash.
- Mark: SH07 and SH11 unchanged; the morph outline arrives near L58.
- Follow-up: Boss decides whether `makePainter` should take a per-layer fade colour (affects every `layer()` use: ZCPAINT, WORLD FOG, SHIPWRECK).

## Revalidation history
- 2026-10-30 (Boss, working tree): CLI stills of SH07 and SH11 before and after → workaround. Merge status: not merged.
