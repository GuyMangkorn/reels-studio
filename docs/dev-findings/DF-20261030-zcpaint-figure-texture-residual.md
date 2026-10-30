# DF-20261030-zcpaint-figure-texture-residual — textured figure passes are not bit-identical between renders (p5.brush residual, up to 9 levels)

- Owner: Boss; first observed: 30 Oct 2026 (pass 8 B09-SH01 f57, RK-24 class; pass 9 B01-SH02 check); last checked: 30 Oct 2026
- Status: open
- Type: determinism and seek parity (runtime)
- Tags: 2D / p5.brush / determinism / seek / figures / rage overlay
- Scope: `src/painted/zcpaint/body6.ts` (`washPaint`, figure parts and textured passes), `src/painted/zcpaint/cast.ts` (`paintRageFront`, the veil helper), `src/painted/zcpaint/corridor.ts` (B01-SH02)
- Consumers: every ZC plate with a figure (B01-SH02 most: rage overlay and charge scale; B02-SH03; B04, B06, B07, B09, B10 figures); not the flat-fill plates (B03 View B and B09-SH02B repeat exactly)

## Symptoms and evidence (`out/painted/zcpaint/p9/det/`, `out/painted/zcpaint/p9/seq/`)
- Two `remotion still` renders of the same frame, decoded RGB (md5 of the decoded RGB; pixel counts by `out/painted/zcpaint/p9/scripts/pixdiff.py`):
  - B03-SH01 TH f14: identical. B09-SH02B f18: identical.
  - B02-SH03 f39: 1 pixel differs, by 1 level.
  - B01-SH02 f23: 46 pixels differ, max channel delta 9, bbox (24, 493) to (975, 903) (head, hair and the charge edge).
- Sequence render against stills, B01-SH02: f30 13 px (max 1); f31 99 px (max 9); f32 69 px (max 8).
- Pass 8 measured B09-SH01 f57 at 9 px, 1 level, the same class.

## Attempts and results
- Not yet isolated. Candidates to check in pass 10: textured passes (`washPaint` and `Paint.part` with texture) that take a seed from the frame and not from the part; the veil helper in `cast.ts` (`ctx.still` seeds, `fillTexture`); the flat `wash` used in `corridor.ts` for the haze.
- Flat fills (`flatKit`, `shadeRegion`) repeated exactly in two plates: they are not the suspect.

## Planning impact
- Film and Mark: the residual is at edge pixels of the head and hair; it is not a visible flicker at 270 px. Do not treat it as a picture defect.
- Editor: report seek parity for figure plates as "within the residual class (up to 9 levels, edge pixels)", not as bit-exact, until this entry closes.
- Boss: the determinism gate for figure plates uses the same measure (two renders plus sequence versus still).

## Revalidation history
- 30 Oct 2026, pass 9 → measured as above → open.
- 2026-10-30, pass 12 (uncommitted, G1 plates, B11 same-plate re-render from one bundle): `ZCP-B02-SH03` f60 identical; `ZCP-B01-SH01` f36 differs by max 8 levels in 24 px over 3 (inside this class). Adjacent frames f60/f61 inside flat cloth boxes: max 19 levels, a camera-resampling pattern rather than this residual (`build-notes` "Boss pass 12 G1", *Checks*).
