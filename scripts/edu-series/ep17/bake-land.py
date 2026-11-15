"""Bake the whole-world land rings for the EDU-EP17 data globe (N8) from the store copy of Natural Earth 1:110m land.

  python3 -I scripts/edu-series/ep17/bake-land.py [--tol 0.35]

Input:  $REELS_STORE/library/data/natural-earth/ne_110m_land.geojson (public domain; provenance in src/painted/bloop/NOTICE).
Output: src/painted/edu17/land.json  {"rings": [[lon, lat, lon, lat, ...], ...]} in degrees, simplified (Douglas-Peucker, tol deg),
        rings under 4 points or smaller than 0.5 deg^2 dropped (Antarctica kept). No clipping: the globe projects each point on the sphere.
"""
import json, os, sys

tol = float(sys.argv[sys.argv.index('--tol') + 1]) if '--tol' in sys.argv else 0.35
store = os.environ.get('REELS_STORE', os.path.expanduser('~/ReelsStore'))
src = os.path.join(store, 'library/data/natural-earth/ne_110m_land.geojson')
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.normpath(os.path.join(here, '../../../src/painted/edu17/land.json'))

def dp(pts, t):
    if len(pts) < 3: return pts
    (x0, y0), (x1, y1) = pts[0], pts[-1]
    dx, dy = x1 - x0, y1 - y0; n = (dx * dx + dy * dy) ** 0.5 or 1e-9
    i, dm = 0, -1.0
    for k in range(1, len(pts) - 1):
        d = abs(dy * pts[k][0] - dx * pts[k][1] + x1 * y0 - y1 * x0) / n
        if d > dm: i, dm = k, d
    if dm <= t: return [pts[0], pts[-1]]
    return dp(pts[:i + 1], t)[:-1] + dp(pts[i:], t)

def area(r):
    return abs(sum(r[i][0] * r[i - 1][1] - r[i - 1][0] * r[i][1] for i in range(len(r)))) / 2

g = json.load(open(src))
rings = []
for f in g['features']:
    geom = f['geometry']
    polys = [geom['coordinates']] if geom['type'] == 'Polygon' else geom['coordinates']
    for poly in polys:
        r = [tuple(p) for p in poly[0]]
        h = len(r) // 2
        s = dp(r[:h + 1], tol)[:-1] + dp(r[h:], tol)  # closed ring: simplify its two halves
        if len(s) >= 4 and area(r) >= 0.5:
            rings.append([round(v, 2) for p in s[:-1] for v in p])
json.dump({'id': 'EDU17-LAND-110M', 'source': 'Natural Earth 1:110m land (public domain); see src/painted/bloop/NOTICE', 'units': 'lon/lat degrees [lon, lat, ...]',
           'tolDeg': tol, 'rings': rings}, open(out, 'w'), separators=(',', ':'))
print(f'{len(rings)} rings, {sum(len(r) // 2 for r in rings)} points -> {out} ({os.path.getsize(out)} bytes)')
