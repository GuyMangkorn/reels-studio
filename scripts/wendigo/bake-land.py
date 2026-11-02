"""Bake the North America land rings (WDG D12, S02-B02-SH01) from Natural Earth 1:110m land into src/painted/wendigo/land.json.

Usage: python3 -I scripts/wendigo/bake-land.py NE_110M_LAND.geojson src/painted/wendigo/land.json

Reuses the unwrap / clip / simplify code of scripts/the-bloop/bake-land.py (DF-20261030-map-land-clip-closure) with a wider
window: longitudes -200..-20 E (160..340) instead of BLOOP's Pacific window, so Alaska, the Arctic coast and Labrador are not clipped.
The output stays in lon/lat degrees (the plate projects them with its own Lambert conic); rings outside lon -170..-50 / lat 14..84 are dropped, the
Americas ring is cut at lat 14, and Greenland, Hawaii and islands wholly north of 74 N are left out (the plate's fit, see `keep`). Simplified at 0.05 deg. Natural Earth is
public domain; source and SHA-256 are in src/painted/bloop/NOTICE and the store file library/data/natural-earth/ne_110m_land.geojson. Stdlib only.
"""
import importlib.util
import json
import pathlib
import sys

spec = importlib.util.spec_from_file_location("bloop_bake_land", pathlib.Path(__file__).resolve().parent.parent / "the-bloop" / "bake-land.py")
bake = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bake)
bake.LON0, bake.LON1 = 160.0, 340.0  # clip_window reads these module globals
TOL = 0.05
BOX = (-170.0, -50.0, 14.0, 84.0)  # lon0, lon1, lat0, lat1 of the plate
LAT0 = 14.0  # the plate ends at Central America: the Americas ring is cut at lat 14 (a short edge across the isthmus, drawn below the map frame)
LAT_MAX_ISLAND = 74.0  # Arctic islands wholly north of 74 N are left out so the plate fits x 150-930, y 170-700 (scene sheet R2.1)


def lat_cross(p, q):
    t = (LAT0 - p[1]) / (q[1] - p[1])
    return (p[0] + (q[0] - p[0]) * t, LAT0)


def keep(pts):
    lons, lats = [a for a, _ in pts], [b for _, b in pts]
    if min(lats) > 58.0 and min(lons) > -75.0:
        return False  # Greenland
    if min(lats) > LAT_MAX_ISLAND:
        return False  # Ellesmere, Devon and the islands north of 74 N
    if max(lons) < -150.0 and max(lats) < 25.0:
        return False  # Hawaii
    return True


def main(src, dst):
    data = json.load(open(src, encoding="utf-8"))
    out, points_in = [], 0
    for feature in data["features"]:
        for ring in bake.rings(feature["geometry"]):
            points_in += len(ring)
            for shift in (-360.0, 0.0, 360.0):
                clipped = bake.clip_window([(lon + shift, lat) for lon, lat in bake.unwrap(ring)])
                clipped = bake.clip_edge(clipped, lambda q: q[1] >= LAT0, lat_cross)
                if len(clipped) < 3:
                    continue
                pts = [(lon - 360.0 if lon > 180.0 else lon, lat) for lon, lat in clipped]  # back to -180..180 (window is 160..340)
                if not any(BOX[0] <= lon <= BOX[1] and BOX[2] <= lat <= BOX[3] for lon, lat in pts):
                    continue
                if min(lon for lon, _ in pts) < -175.0 and max(lon for lon, _ in pts) > 0:
                    continue  # ring still straddles the antimeridian in this representation
                if not keep(pts):
                    continue
                if pts[0] == pts[-1]:
                    pts = pts[:-1]  # open ring: a closed one collapses in the simplifier
                simp = bake.douglas_peucker(pts, TOL)
                if len(simp) >= 3:
                    out.append(simp)
    flat = [[round(v, 2) for pt in r for v in pt] for r in out]
    doc = {"id": "MAP-LAND-NA-110M", "source": "Natural Earth 1:110m land (public domain); see src/painted/bloop/NOTICE", "units": "lon/lat degrees [lon, lat, ...]", "windowLonE": [160, 340], "pointsIn": points_in, "rings": flat}
    with open(dst, "w", encoding="utf-8") as fh:
        json.dump(doc, fh, separators=(",", ":"))
        fh.write("\n")
    print(f"Wrote {dst}: {len(flat)} rings, {sum(len(r) // 2 for r in flat)} points (from {points_in}); lon {min(r[i] for r in flat for i in range(0, len(r), 2))}..{max(r[i] for r in flat for i in range(0, len(r), 2))}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
