#!/usr/bin/env python3 -I
"""Bake the Japan outline for HANAKO-SHORT (map space, 1080x1920 px) from Natural Earth 1:50m land.

Source (public domain, https://www.naturalearthdata.com/about/terms-of-use/), retrieved 31 Oct 2026:
  https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson
Usage: python3 -I scripts/hanako/bake-map.py <ne_50m_land.geojson> src/painted/hanako/japan.json
Keeps the islands of Japan whose bbox lies inside lon 129-145.9 E, lat 30-46 N and area > 0.04 deg^2 (drops the
continent, Sakhalin and the Kurils so no territorial claim is drawn). Projection: equirectangular with cos(37.5 deg).
"""
import json, math, sys

src, out = sys.argv[1], sys.argv[2]
PXLAT = 54.0                       # px per degree latitude
PXLON = PXLAT * math.cos(math.radians(37.5))
LON0, X0 = 129.5, 170.0            # lon 129.5 E -> x 170
LAT0, Y0 = 45.6, 150.0             # lat 45.6 N  -> y 150
TOL = 1.1                          # simplify tolerance, px

def proj(lon, lat):
    return ((lon - LON0) * PXLON + X0, (LAT0 - lat) * PXLAT + Y0)

def dp(pts, tol):
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    n = math.hypot(dx, dy) or 1e-9
    best, idx = 0, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / n
        if d > best: best, idx = d, i
    if best > tol:
        return dp(pts[:idx + 1], tol)[:-1] + dp(pts[idx:], tol)
    return [pts[0], pts[-1]]

def area(r):
    return abs(sum(r[i][0] * r[(i + 1) % len(r)][1] - r[(i + 1) % len(r)][0] * r[i][1] for i in range(len(r)))) / 2

g = json.load(open(src))
rings = []
for f in g["features"]:
    geom = f["geometry"]
    polys = geom["coordinates"] if geom["type"] == "MultiPolygon" else [geom["coordinates"]]
    for poly in polys:
        r = poly[0]
        lons = [p[0] for p in r]; lats = [p[1] for p in r]
        if min(lons) < 129 or max(lons) > 145.9 or min(lats) < 30 or max(lats) > 46: continue
        if area(r) < 0.04: continue
        px = [proj(*p) for p in r]
        k = max(range(len(px)), key=lambda i: math.hypot(px[i][0] - px[0][0], px[i][1] - px[0][1]))
        s = dp(px[:k + 1], TOL)[:-1] + dp(px[k:], TOL)
        rings.append([round(v, 1) for p in s for v in p])
rings.sort(key=lambda r: -len(r))
iw = proj(141.4, 39.65)
json.dump({"id": "MAP-JP-50M", "source": "Natural Earth 1:50m land (public domain); see NOTICE beside this file",
           "projection": f"equirectangular; x=(lon-{LON0})*{PXLON:.3f}+{X0}, y=({LAT0}-lat)*{PXLAT}+{Y0}",
           "iwatePin": [round(iw[0], 1), round(iw[1], 1)], "rings": rings},
          open(out, "w"), separators=(",", ":"))
print(len(rings), "rings", sum(len(r) // 2 for r in rings), "points; Iwate", iw)
