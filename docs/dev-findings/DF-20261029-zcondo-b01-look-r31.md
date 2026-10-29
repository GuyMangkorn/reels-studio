<!-- Moved from docs/dev-findings.md on 2026-10-29; the index and workflow stay there. -->
# DF-20261029-zcondo-b01-look-r31 — B01 look target: infected darker than the window by lighting, not by darkening her shirt

- Owner: Boss; first observed: 2026-10-28 (`DF-20261028-zcondo-sp01-corridor-plate` open note); last checked: 2026-10-29; status: `workaround` (target met on the blockout); type: `tool-limitation`
- Tags: 3D / Blender / Eevee / lighting / light-linking / silhouette
- Scope: `main` `80c73c5` + working tree; `assets/blender/zc-corridor/build.py` (`ZC_LOOK=sp01|r31`, `look` command), Blender 5.2.3 LTS headless Eevee 64 on the M1; user instruction 29 Oct 2026 (“เริ่มเลย”, relayed by the coordinator).
- Consumers: ZCONDO-SHORT `B01-SH01`/`B01-SH02` (`VD-ZC-01` R3.1 look target); future `S-02`/`S-06` production lighting.

## Symptoms and evidence
- Target (brief R3.1): at shot F36 (clip F51) infected mean luminance ≤ about ¼ of the window pane's on the plate, with a visible rim on head and shoulders, by lighting, shirt unchanged. SP01 measured nothing; it read grey by eye.
- Measurement: Eevee 64 beauty PNG plus a Workbench flat-colour mask of the same frame (figure = `zc-inf*`, pane = `zc-corr_window`); Rec.709 luma on the PNG's 8-bit display values (and, separately, linearised). Figure 10,313 px, pane 16,828 px (the pane is clipped to ≈1.0, so "window brighter" cannot raise the denominator).
  - `sp01` lighting: figure/pane **0.285** display (0.104 linear), clip F51.
  - `r31` lighting: **0.234** display (0.075 linear) at clip F51; 0.229 at F15; 0.231 at F119. Figure median 0.19, p95 0.54 (bright edge band).
- What worked: (1) light-link the corridor strip lights so they do not light the infected (`light_linking.receiver_collection` + `collection_objects[].light_linking.link_state = 'EXCLUDE'`); (2) cut the far-window area light from 700 W to 100 W; it was bouncing off the floor into her hem and shirt (700 W gave 0.294 even with linking; 350 W 0.262); (3) a 600 W grazing rim area light at (13.6, −0.95, 2.45) aimed down at her head and shoulders raises the top surfaces without lifting the mean far (0.186 without, 0.234 with). Darkening the floor (×0.4) changed little (0.259 at 350 W).
- Not met / caveats: the rim reads on the shoulders and arms; the hair is black, so no rim shows on the head (needs a hair spec/shader tuned in `S-03`, see `DF-20261028-zcondo-eevee-worstcase`). The 100 W window leaves the corridor near the window slightly darker than in SP01; the pane stays clipped white with a soft halo. Placeholder primitive figure only: a real shirt texture, hair and skin will move the number. The SP01 plate was **not** re-rendered with `r31`; re-render B01-SH01 before production.
- Reproduce: `ZC_LOOK=r31 Blender -b --python assets/blender/zc-corridor/build.py -- look 51` (also `ZC_LOOK=sp01`); results merge into `assets/blender/zc-corridor/sp01-manifest.json` keys `look/*`. Evidence (local, Git-ignored): `out/qa/zombie-condo/sp02/look/{sp01,r31}/{beauty,mask}_F51.png` and crops.
- Coverage: Blender CLI stills at clip F15, F51, F119 only; no full-plate flicker run with the new lights, no Remotion/Studio check.

## Planning impact
- Film: `VD-ZC-01` R3.1 look target is met on the blockout by lighting alone; keep the measurement method (plate luma, mask) for the production plate.
- Mark: no sheet change.
- Follow-up (Boss): hair rim; re-measure on the production `zc-infected` in `S-02`; re-render B01-SH01 with `r31`.

## Revalidation history
- 2026-10-29 / `main` `80c73c5` + working tree: results above. Film/Mark adoption: pending.
