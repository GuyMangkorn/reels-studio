"""Bake the BLOOP land fill (FR05) from a Natural Earth 1:110m land GeoJSON into src/painted/bloop/land.json.

Usage: python3 -I scripts/the-bloop/bake-land.py LAND.geojson src/painted/bloop/land.json

Same projection and window as bake-map.py (mapXY(lon, lat) = ((lon - 145) * 9.4, 300 + (36 - lat) * 9.4); longitudes
in [145, 340] E). Each ring is unwrapped so consecutive longitudes differ by less than 180 deg, then clipped to the window
for the shifts -360, 0 and +360 (Sutherland-Hodgman against the two vertical edges), so antimeridian rings (Russia, Fiji,
Antarctica) fill correctly. Output: a list of flat [x, y, x, y, ...] rings in plate world px, simplified at 0.6 px.
Natural Earth data is public domain; see src/painted/bloop/NOTICE. Stdlib only.
"""
import json
import math
import sys

LON0, LON1 = 145.0, 340.0
SCALE = 9.4
LAT_TOP = 36.0
Y0 = 300.0
TOLERANCE = 0.6


def project(lon, lat):
    return ((lon - LON0) * SCALE, Y0 + (LAT_TOP - lat) * SCALE)


def unwrap(ring):
    out = [(ring[0][0], ring[0][1])]
    for lon, lat in ring[1:]:
        prev = out[-1][0]
        d = (lon - prev + 180.0) % 360.0 - 180.0
        out.append((prev + d, lat))
    return out


def clip_edge(poly, inside, cross):
    out = []
    if not poly:
        return out
    prev = poly[-1]
    for cur in poly:
        if inside(cur):
            if not inside(prev):
                out.append(cross(prev, cur))
            out.append(cur)
        elif inside(prev):
            out.append(cross(prev, cur))
        prev = cur
    return out


def cross_at(x_edge):
    def f(p, q):
        t = (x_edge - p[0]) / (q[0] - p[0])
        return (x_edge, p[1] + (q[1] - p[1]) * t)
    return f


def clip_window(poly):
    poly = clip_edge(poly, lambda p: p[0] >= LON0, cross_at(LON0))
    poly = clip_edge(poly, lambda p: p[0] <= LON1, cross_at(LON1))
    return poly


def douglas_peucker(points, tol):
    if len(points) < 3:
        return points
    (x1, y1), (x2, y2) = points[0], points[-1]
    dx, dy = x2 - x1, y2 - y1
    length = math.hypot(dx, dy) or 1e-9
    best, index = -1.0, 0
    for i in range(1, len(points) - 1):
        x, y = points[i]
        d = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / length
        if d > best:
            best, index = d, i
    if best <= tol:
        return [points[0], points[-1]]
    left = douglas_peucker(points[: index + 1], tol)
    right = douglas_peucker(points[index:], tol)
    return left[:-1] + right


def rings(geometry):
    if geometry["type"] == "Polygon":
        return [geometry["coordinates"][0]]
    if geometry["type"] == "MultiPolygon":
        return [poly[0] for poly in geometry["coordinates"]]
    return []


def main(src, dst):
    with open(src, encoding="utf-8") as fh:
        data = json.load(fh)
    out_rings = []
    points_in = 0
    for feature in data["features"]:
        for ring in rings(feature["geometry"]):
            points_in += len(ring)
            base = unwrap(ring)
            # A ring that winds once around the pole (Antarctica) ends 360 deg from where it starts after unwrapping, so
            # its closing edge would run across the whole window at lat -64 (a grey bar, DF-20261030-map-land-clip-closure).
            # Close it through the pole row (lat -90), which lies below the map window.
            if abs(base[-1][0] - base[0][0]) > 180.0:
                base = base + [(base[-1][0], -90.0), (base[0][0], -90.0)]
            for shift in (-360.0, 0.0, 360.0):
                shifted = [(lon + shift, lat) for lon, lat in base]
                clipped = clip_window(shifted)
                if len(clipped) < 3:
                    continue
                projected = [project(lon, lat) for lon, lat in clipped]
                # open ring: the closing edge is implicit in the SVG path; a closed ring would collapse in the DP test
                simplified = douglas_peucker(projected, TOLERANCE)
                if len(simplified) >= 3:
                    out_rings.append(simplified)
    flat = [[round(v, 1) for pt in r for v in pt] for r in out_rings]
    xs = [pt[0] for r in out_rings for pt in r]
    ys = [pt[1] for r in out_rings for pt in r]
    out = {
        "id": "MAP-LAND-110M",
        "source": "Natural Earth 1:110m land (public domain); see NOTICE beside this file",
        "projection": "plate carree; mapXY(lon, lat) = ((lon - 145) * 9.4, 300 + (36 - lat) * 9.4); lon wrapped to [145, 340] E",
        "lonRangeE": [LON0, LON1],
        "pointsIn": points_in,
        "rings": flat,
        "bbox": [round(min(xs), 1), round(min(ys), 1), round(max(xs), 1), round(max(ys), 1)],
    }
    with open(dst, "w", encoding="utf-8") as fh:
        json.dump(out, fh, separators=(",", ":"))
        fh.write("\n")
    total = sum(len(r) // 2 for r in flat)
    print(f"Wrote {dst}: {len(flat)} rings, {total} points (from {points_in} source points), bbox {out['bbox']}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
