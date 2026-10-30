"""Bake the BLOOP map coastline (DEP02 MAP, brief VD06) from a Natural Earth 1:110m coastline GeoJSON.

Usage: python3 -I scripts/the-bloop/bake-map.py COASTLINE.geojson src/painted/bloop/coast.json

Projection (index Shared constants, MAP space): plate carree, mapXY(lon, lat) = ((lon - 145) * 9.4, 300 + (36 - lat) * 9.4),
longitudes wrapped into [145, 340] E so the Pacific sector, Antarctica, South America and South Georgia stay in one path
(M01: the baked path covers lon 145 E -> 340 E). Output is a list of polylines in plate world px (one flat [x, y, x, y, ...]
list per line), simplified by Douglas-Peucker at 0.6 px and rounded to 0.1 px. Natural Earth data is public domain; the
NOTICE beside the output records the source, the retrieval date and the file hash. Stdlib only.
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


def wrap(lon):
    return lon + 360.0 if lon < LON0 else lon


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


def polylines(geometry):
    kind = geometry["type"]
    if kind == "LineString":
        return [geometry["coordinates"]]
    if kind == "MultiLineString":
        return geometry["coordinates"]
    return []


def main(src, dst):
    with open(src, encoding="utf-8") as fh:
        data = json.load(fh)
    lines = []
    points_in = 0
    for feature in data["features"]:
        for line in polylines(feature["geometry"]):
            current = []
            previous = None
            for lon, lat in line:
                points_in += 1
                lon = wrap(lon)
                inside = LON0 <= lon <= LON1
                # A jump of more than 60 degrees is an antimeridian wrap in the source: start a new piece.
                if previous is not None and abs(lon - previous) > 60:
                    if len(current) > 1:
                        lines.append(current)
                    current = []
                if inside:
                    current.append(project(lon, lat))
                elif len(current) > 1:
                    lines.append(current)
                    current = []
                previous = lon
            if len(current) > 1:
                lines.append(current)
    simplified = []
    for line in lines:
        s = douglas_peucker(line, TOLERANCE)
        if len(s) > 1:
            simplified.append(s)
    flat = [[round(v, 1) for pt in line for v in pt] for line in simplified]
    xs = [pt[0] for line in simplified for pt in line]
    ys = [pt[1] for line in simplified for pt in line]
    out = {
        "id": "MAP-COAST-110M",
        "source": "Natural Earth 1:110m coastline (public domain); see NOTICE beside this file",
        "projection": "plate carree; mapXY(lon, lat) = ((lon - 145) * 9.4, 300 + (36 - lat) * 9.4); lon wrapped to [145, 340] E",
        "lonRangeE": [LON0, LON1],
        "pointsIn": points_in,
        "lines": flat,
        "bbox": [round(min(xs), 1), round(min(ys), 1), round(max(xs), 1), round(max(ys), 1)],
    }
    with open(dst, "w", encoding="utf-8") as fh:
        json.dump(out, fh, separators=(",", ":"))
        fh.write("\n")
    total = sum(len(line) // 2 for line in flat)
    print(f"Wrote {dst}: {len(flat)} lines, {total} points (from {points_in} source points), bbox {out['bbox']}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
