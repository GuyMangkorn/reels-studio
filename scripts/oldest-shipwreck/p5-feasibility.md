# SHIPWRECK-SHORT: p5.brush feasibility (Film style test, 29 Oct 2026)

Evidence: `src/painted/spike/Shipwreck.tsx` (`PAINTED-SPIKE-Shipwreck`, spike entry, uncommitted), stills
`out/painted-spike/PAINTED-SPIKE-Shipwreck/s{1,2,3}.png` (frames 45/135/225). Visual check: qa-sheet viewed; not user-approved.
Site facts follow Boat's research (Kekova, EBA, ~30 m, divers, no hull, 30+ jars). Ship look, rig, crew and weather are reconstruction.

## Easy (proved in the stills)

| Beat | How |
| --- | --- |
| Sky, sea, storm sky | Overlapping watercolour bands + a flat `brush.wash` underlayer |
| Ship silhouette, sailing, heeling, bobbing | One `drawShip(x, y, scale, heel)`: hull/sail polygons rotated in code, ink boils |
| Torn sail, rain, spray, foam | Polygon with a missing corner + flapping splines; screen-space rain lines |
| Jars on deck and on the seabed, broken jars | `drawJar` profile (round belly, two handles, flat base, incised band); `bury` clips at a sand line |
| Shallow site: water, sand, rocks, seagrass, fish, particles | Washes + short lines; fish as 4-point polygons |
| Divers | Flat silhouettes, no faces, tape as one spline to a jar |
| Sun halo, lightning flash, sun shafts | Screen-blended Remotion SVG layers above the canvas |
| Sinking (not yet painted) | Same ship function: heel + y offset over time, front swell drawn over it |

## Hard (avoid or hand to Boss)

- Close character acting: no brush rig exists (`missing`). Crew stay distant silhouettes, divers seen from the side or behind, no faces.
- Crowds / crew detail / dense detail (rope work, planking, many jars close up): each fill costs; keep about 30 visible elements per shot.
- Glow and light: p5.brush cannot glow. All light is a Remotion screen layer; it lifts shadows, so keep it off the leads' darks.
- Small circles render as squares: heads, bubbles, fish eyes and the sun use polygons; bubbles, if wanted, go in a Remotion layer.
- Painted text: none. Jar count, dates and depth are captions (Editor).

## Learned while painting

- **Bleed scales with polygon size.** One huge sea polygon at bleed 0.15 left paper-coloured gaps hundreds of px wide. Use bands with bleed 0.03-0.06 over a flat `brush.wash` underlayer of the same hue.
- **Watercolour fills are translucent.** A silhouette hull needs two passes; covering a jar with a sand drift does not hide it. Clip the shape at the sand line instead.
- `brush.noStroke()` in a wash helper disables the next lines: call `brush.set()` (the `ink` helper) after every fill group, or the render throws "No brush or color set".
- `2B` outlines look dotted on small props; `pen` reads cleaner at 1080 px.
- A darker paper per shot (`paper` prop) hides any remaining gaps.
- Speed: one still about 2.7 s wall clock with a cached bundle (first run about 15 s incl. bundle); full 270 frames in 43.8 s incl. bundle. Determinism: frames 135 and 225 rendered twice, `cmp` identical (`--gl=angle`).
- First renders in this worktree timed out on "Waiting for root component" while Chrome Headless Shell had just downloaded; the same command succeeded on retry (once with `--timeout=120000`). Transient, cause unconfirmed.

## Open for Film's brief

- **Rig c. 2500 BC is uncertain.** The single square sail on yard and boom, high curved posts and stern steering oar are a generic placeholder. Film's brief should confirm or change the ship (or keep it vague in silhouette) and label it "ภาพจำลอง".
- Caption band (y 860-1248) background luma, measured: S1 0.251 mean / 0.358 p95, S2 0.309 / 0.368 (flash frame), S3 0.57 / 0.658 (light sand). All exceed the 0.25 / 0.40 default. Leads sit above the band. The brief should choose darker band values (or a caption box) for S3.
- S3 main diver's fins cross x 888 (right rail) near y 300-420; move left if the rail covers it.
- Stone anchors are not drawn: their link to the wreck is unknown (research F007).
