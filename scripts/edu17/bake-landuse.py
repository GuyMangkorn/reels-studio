#!/usr/bin/env python3 -I
"""EDU-EP17 fix pass B (B-MR1): bakes the built-up land use of Bangkok and Nonthaburi into src/painted/edu17/map-landuse.json.

  python3 -I scripts/edu17/bake-landuse.py --raw out/ep17/raw --out src/painted/edu17

Input q7.json (Overpass, query scripts/edu17/overpass/q7-landuse.overpassql: OSM landuse residential, commercial, industrial, retail, ways and multipolygon relations in
13.45-14.20 N, 100.20-101.00 E) and map-l2.json (the two province rings). Same simplification family as bake-map.py (Douglas-Peucker; 22 m here, roads are 22 m too).
A polygon is kept when its centroid lies inside the Bangkok or Nonthaburi ring and its area is at least 1 ha; holes of multipolygons are dropped (a park inside a residential
block is painted over, the L2 look has no scale to show it). Output: closed rings as flat [lon, lat, ...] arrays in degrees. Licence: ODbL, credit in NOTICE.md.
"""
import argparse, json, math, os

ap = argparse.ArgumentParser()
ap.add_argument('--raw', required=True)
ap.add_argument('--out', required=True)
A = ap.parse_args()
KX = math.cos(math.radians(13.8))
TOL, MIN_KM2 = 0.0002, 0.01


def dp(pts, tol):
    n = len(pts)
    if n < 3:
        return list(pts)
    xy = [(p[0] * KX, p[1]) for p in pts]
    keep = [False] * n
    keep[0] = keep[-1] = True
    stack = [(0, n - 1)]
    while stack:
        a, b = stack.pop()
        if b <= a + 1:
            continue
        (x1, y1), (x2, y2) = xy[a], xy[b]
        dx, dy = x2 - x1, y2 - y1
        L = math.hypot(dx, dy) or 1e-12
        best, idx = -1.0, a
        for i in range(a + 1, b):
            d = abs(dy * xy[i][0] - dx * xy[i][1] + x2 * y1 - y2 * x1) / L
            if d > best:
                best, idx = d, i
        if best > tol:
            keep[idx] = True
            stack.append((a, idx)); stack.append((idx, b))
    return [pts[i] for i in range(n) if keep[i]]


def simplify_ring(r, tol):
    r = r[:-1]
    k = max(range(len(r)), key=lambda i: (r[i][0] - r[0][0]) ** 2 + (r[i][1] - r[0][1]) ** 2)
    return dp(r[:k + 1], tol)[:-1] + dp(r[k:] + [r[0]], tol)[:-1]


def assemble(ways):
    ways = [w for w in ways if len(w) > 1]
    rings, used, ends = [], [False] * len(ways), {}
    for i, w in enumerate(ways):
        ends.setdefault(w[0], []).append(i); ends.setdefault(w[-1], []).append(i)
    for i in range(len(ways)):
        if used[i]:
            continue
        used[i] = True
        ring = list(ways[i])
        while ring[0] != ring[-1]:
            tail = ring[-1]
            nxt = next((j for j in ends.get(tail, []) if not used[j]), None)
            if nxt is None:
                break
            used[nxt] = True
            w = ways[nxt]
            ring += (w if w[0] == tail else w[::-1])[1:]
        if ring[0] == ring[-1] and len(ring) >= 4:
            rings.append(ring)
    return rings


def area_km2(r):
    kx, ky = 111.320 * KX, 110.574
    s = 0.0
    for i in range(len(r) - 1):
        s += r[i][0] * kx * r[i + 1][1] * ky - r[i + 1][0] * kx * r[i][1] * ky
    return abs(s) / 2


def inside(x, y, flat):
    c, n = False, len(flat) // 2
    j = n - 1
    for i in range(n):
        xi, yi, xj, yj = flat[2 * i], flat[2 * i + 1], flat[2 * j], flat[2 * j + 1]
        if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
            c = not c
        j = i
    return c


l2 = json.load(open(os.path.join(A.out, 'map-l2.json')))
stage = [p['ring'] for p in l2['provinces']]
raw = json.load(open(os.path.join(A.raw, 'q7.json')))
rings, seen = [], 0
for e in raw['elements']:
    if e['type'] == 'way' and e.get('geometry'):
        cand = [[(g['lon'], g['lat']) for g in e['geometry']]]
        cand = [c for c in cand if c[0] == c[-1] and len(c) >= 4]
    elif e['type'] == 'relation':
        cand = assemble([[(g['lon'], g['lat']) for g in m['geometry']] for m in e.get('members', []) if m['type'] == 'way' and m.get('role') in ('outer', '') and m.get('geometry')])
    else:
        continue
    for r in cand:
        seen += 1
        a = area_km2(r)
        if a < MIN_KM2:
            continue
        cx, cy = sum(p[0] for p in r) / len(r), sum(p[1] for p in r) / len(r)
        if not any(inside(cx, cy, s) for s in stage):
            continue
        s = simplify_ring(r, TOL)
        if len(s) < 3:
            continue
        rings.append((a, [round(v, 5) for p in s for v in p]))
rings.sort(key=lambda t: -t[0])
out = {'id': 'map-landuse', 'osmExtract': raw['osm3s']['timestamp_osm_base'], 'builtUpKm2': round(sum(a for a, _ in rings), 1), 'rings': [r for _, r in rings]}
path = os.path.join(A.out, 'map-landuse.json')
json.dump(out, open(path, 'w'), separators=(',', ':'))
print(f'seen {seen} rings, kept {len(rings)}, built-up {out["builtUpKm2"]} km2 (stage 2,203 km2), {os.path.getsize(path)} bytes')
