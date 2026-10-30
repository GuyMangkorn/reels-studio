# DF-20261030-zcpaint-persp-floor-clip-behind-camera — PERSP-2D floor quads must stay in front of the camera

- Owner: Boss; first observed: 30 Oct 2026 (pass 8, B10 figure cast); last checked: 30 Oct 2026
- Status: workaround
- Type: technique (projection)
- Tags: 2D / perspective / B10 / clipping
- Scope: `src/painted/zcpaint/interior.ts` (`B10_PERSP`, `floorQuad`), `space.ts` `persp`
- Consumers: B10-SH01 (camera at Y 3.25)

## Symptoms and evidence
- `persp(F, eye, {Y: 3.25, d: 0.52}, VP)` maps a point at Y ≥ 3.25 to negative depth. The pass 5 floor fill uses `P(3.3, 0, 0)` and `P(3.3, 0, back)`, which project far off the frame. The fill still paints correctly, but the polygon is not safe for clipping.
- A clip quad with Y 3.3 returned no polygons (measured: quad corners at about (-98298, -57745)). The entry floor quad Y 0.18 to 1.5 has positive depth and clips the figure's cast to 14 polygons inside the floor band (y 1474-1842).

## Rule
- Use only floor points with Y < 3.25 (camera) for any clip or cast quad. Clip to the entry (Y 0.18-1.5).

## Implication for Film and Mark
- B10 floor shadows are clipped to the entry floor. The bathroom floor beyond the P1 doorway receives no cast in this pass (unverified).
