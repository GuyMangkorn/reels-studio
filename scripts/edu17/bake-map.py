#!/usr/bin/env python3 -I
"""Bake the EDU-EP17 geographic map data (N2): L0 globe, L1 Thailand + region, L2 metro, in lon/lat degrees.

Usage: python3 -I scripts/edu17/bake-map.py --raw out/ep17/raw --out src/painted/edu17 [--date 2026-11-11]

Raw inputs (download steps and URLs: scripts/edu-series/ep17/build-notes.md "Map data"; raw files stay outside git):
  Natural Earth (public domain), https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/
    ne_110m_land, ne_10m_land, ne_50m_admin_0_boundary_lines_land,
    ne_10m_admin_1_states_provinces, ne_10m_rivers_lake_centerlines, ne_10m_admin_0_countries
  OpenStreetMap via Overpass (ODbL, © OpenStreetMap contributors), q4.json (province + Nonthaburi amphoe relations, out geom),
    q5.json (Bangkok's 50 khet relations, out geom), q6.json (motorway + trunk + river ways in the metro bbox, out geom)

Output (coordinates are [lon, lat, lon, lat, ...] flat arrays in degrees, rounded to the stated digits):
  map-l0.json  NE 110m land, whole globe, no clipping; rings that enclose a pole carry "pole": -1/1.
  map-l1.json  NE 10m land clipped to the L1 window, admin-0 boundary lines, Thailand admin-1 lines, rivers; Thailand extent.
  map-l2.json  metro: OSM rings of Bangkok and Nonthaburi, 56 district rings + deduplicated district lines, roads, rivers, canals,
               fine coast (NE 10m land clipped to the metro window), NE 10m admin-1 rings for comparison, anchors and ring areas.
  NOTICE.md    data credit (written once; edit the date through --date).

Clipping: land rings are clipped to a rectangle (Sutherland-Hodgman) and every clipped ring is scanned for edges that lie on the
window boundary (DF-20261030-map-land-clip-closure): the report lists their count, longest length and which window sides they
touch. A closure edge is legitimate land boundary only when it is outside every shot's visible area; the geo.ts tests assert that.
"""
import argparse, json, math, os, sys

ap = argparse.ArgumentParser()
ap.add_argument('--raw', required=True)
ap.add_argument('--out', required=True)
ap.add_argument('--date', default='2026-11-11')
A = ap.parse_args()

L1_WIN = (84.0, -12.0, 126.0, 42.0)     # lon0, lat0, lon1, lat1 : covers every L1-visible frame (h <= 2,400 km) with margin
L2_WIN = (99.0, 12.0, 102.2, 15.6)      # fine coast window (drawn over the L1 land in the same colour: no visible window edge)
METRO_BBOX = (13.45, 100.20, 14.20, 101.00)
LAT0 = 13.8
KX = math.cos(math.radians(LAT0))


def load(name):
    with open(os.path.join(A.raw, name)) as f:
        return json.load(f)


def polys_of(geom):
    if geom['type'] == 'Polygon':
        return [geom['coordinates']]
    if geom['type'] == 'MultiPolygon':
        return geom['coordinates']
    return []


def lines_of(geom):
    if geom['type'] == 'LineString':
        return [geom['coordinates']]
    if geom['type'] == 'MultiLineString':
        return geom['coordinates']
    return []


def dp(pts, tol):
    """Iterative Douglas-Peucker on (lon * cos(lat0), lat); keeps both ends."""
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
            stack.append((a, idx))
            stack.append((idx, b))
    return [pts[i] for i in range(n) if keep[i]]


def simplify_ring(r, tol):
    """Simplify a closed ring (last point == first) by splitting at the point farthest from the start."""
    r = r[:-1] if r[0] == r[-1] else r
    if len(r) < 4:
        return r
    k = max(range(len(r)), key=lambda i: (r[i][0] - r[0][0]) ** 2 + (r[i][1] - r[0][1]) ** 2)
    out = dp(r[:k + 1], tol)[:-1] + dp(r[k:] + [r[0]], tol)[:-1]
    return out


def flat(pts, nd):
    return [round(v, nd) for p in pts for v in (p[0], p[1])]


def ring_area_km2(r):
    """Planar shoelace on an equirectangular projection at the ring's mean latitude (error well under 0.5 % for a province)."""
    la = sum(p[1] for p in r) / len(r)
    kx, ky = 111.320 * math.cos(math.radians(la)), 110.574
    s = 0.0
    for i in range(len(r)):
        x1, y1 = r[i][0] * kx, r[i][1] * ky
        x2, y2 = r[(i + 1) % len(r)][0] * kx, r[(i + 1) % len(r)][1] * ky
        s += x1 * y2 - x2 * y1
    return abs(s) / 2


def centroid(r):
    return (sum(p[0] for p in r) / len(r), sum(p[1] for p in r) / len(r))


# ---- clipping -----------------------------------------------------------------------------------------------------------------
def clip_ring(r, win):
    """Sutherland-Hodgman against the rectangle `win` (lon0, lat0, lon1, lat1)."""
    x0, y0, x1, y1 = win
    pts = r[:-1] if r[0] == r[-1] else list(r)
    for side in range(4):
        if not pts:
            break
        out = []
        for i in range(len(pts)):
            a, b = pts[i - 1], pts[i]
            ina, inb = inside(a, side, win), inside(b, side, win)
            if inb:
                if not ina:
                    out.append(cut(a, b, side, win))
                out.append(b)
            elif ina:
                out.append(cut(a, b, side, win))
        pts = out
    return pts


def inside(p, side, w):
    return (p[0] >= w[0], p[1] >= w[1], p[0] <= w[2], p[1] <= w[3])[side]


def cut(a, b, side, w):
    if side in (0, 2):
        X = w[0] if side == 0 else w[2]
        t = (X - a[0]) / (b[0] - a[0])
        return (X, a[1] + t * (b[1] - a[1]))
    Y = w[1] if side == 1 else w[3]
    t = (Y - a[1]) / (b[1] - a[1])
    return (a[0] + t * (b[0] - a[0]), Y)


def clip_line(line, win):
    """Cohen-Sutherland style: returns polylines (segment-wise clip, joined while consecutive segments stay inside)."""
    x0, y0, x1, y1 = win
    out, cur = [], []
    for i in range(len(line) - 1):
        a, b = line[i], line[i + 1]
        seg = liang(a, b, win)
        if seg is None:
            if len(cur) > 1:
                out.append(cur)
            cur = []
            continue
        p, q = seg
        if cur and cur[-1] == p:
            cur.append(q)
        else:
            if len(cur) > 1:
                out.append(cur)
            cur = [p, q]
    if len(cur) > 1:
        out.append(cur)
    return out


def liang(a, b, w):
    t0, t1 = 0.0, 1.0
    dx, dy = b[0] - a[0], b[1] - a[1]
    for p, q in ((-dx, a[0] - w[0]), (dx, w[2] - a[0]), (-dy, a[1] - w[1]), (dy, w[3] - a[1])):
        if p == 0:
            if q < 0:
                return None
        else:
            t = q / p
            if p < 0:
                if t > t1:
                    return None
                t0 = max(t0, t)
            else:
                if t < t0:
                    return None
                t1 = min(t1, t)
    return ((a[0] + t0 * dx, a[1] + t0 * dy), (a[0] + t1 * dx, a[1] + t1 * dy))


def boundary_edges(r, win, min_deg=0.05):
    """Edges of a clipped ring that lie on the window boundary (the closure edges of DF-20261030-map-land-clip-closure)."""
    eps = 1e-9
    found = []
    for i in range(len(r)):
        a, b = r[i - 1], r[i]
        for name, v, pa, pb in (('W', win[0], a[0], b[0]), ('E', win[2], a[0], b[0]), ('S', win[1], a[1], b[1]), ('N', win[3], a[1], b[1])):
            if abs(pa - v) < eps and abs(pb - v) < eps:
                L = math.hypot((b[0] - a[0]) * KX, b[1] - a[1])
                if L >= min_deg:
                    found.append((name, round(L, 3)))
    return found


def land_in_window(feats, win, tol, nd):
    rings, holes, edges = [], 0, []
    x0, y0, x1, y1 = win
    for f in feats:
        for poly in polys_of(f['geometry']):
            r = [tuple(p[:2]) for p in poly[0]]
            lons, lats = [p[0] for p in r], [p[1] for p in r]
            if max(lons) < x0 or min(lons) > x1 or max(lats) < y0 or min(lats) > y1:
                continue
            holes += len(poly) - 1
            c = clip_ring(r, win)
            if len(c) < 3:
                continue
            e = boundary_edges(c, win)
            s = simplify_ring(c + [c[0]], tol)
            if len(s) < 3:
                continue
            e2 = boundary_edges(s, win)
            if e2:
                edges.append({'points': len(s), 'edges': e2})
            rings.append(flat(s, nd))
    return rings, holes, edges


# ---- OSM assembly -------------------------------------------------------------------------------------------------------------
def way_geom(m):
    return [(g['lon'], g['lat']) for g in m['geometry']]


def assemble(ways):
    """Join way polylines (lists of (lon, lat) whose ends share exact coordinates) into closed rings."""
    ways = [w for w in ways if len(w) > 1]
    rings, used = [], [False] * len(ways)
    ends = {}
    for i, w in enumerate(ways):
        ends.setdefault(w[0], []).append(i)
        ends.setdefault(w[-1], []).append(i)
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
        rings.append(ring)
    return rings


def rel_outer_ways(rel, simp=None, tol=0.0):
    ws = []
    for m in rel['members']:
        if m['type'] == 'way' and m.get('role') in ('outer', '') and m.get('geometry'):
            g = way_geom(m)
            ws.append((m['ref'], dp(g, tol) if tol else g))
    return ws


def main():
    out_dir = A.out
    os.makedirs(out_dir, exist_ok=True)
    report = []

    # ---------------- L0: NE 110m land, whole globe ----------------
    g0 = load('ne_110m_land.geojson')
    l0 = []
    for f in g0['features']:
        for poly in polys_of(f['geometry']):
            r = [tuple(p[:2]) for p in poly[0]]
            if r[0] == r[-1]:
                r = r[:-1]
            pole = 0
            if min(p[1] for p in r) < -85:
                pole = -1
            elif max(p[1] for p in r) > 85:
                pole = 1
            ring = {'pole': pole, 'xy': flat(r, 2)} if pole else {'xy': flat(r, 2)}
            l0.append(ring)
    l0.sort(key=lambda o: -len(o['xy']))
    with open(os.path.join(out_dir, 'map-l0.json'), 'w') as f:
        json.dump({'id': 'MAP-L0-110M', 'source': 'Natural Earth 1:110m land (public domain)', 'coords': 'lon, lat degrees, 2 digits; rings closed implicitly',
                   'rings': l0}, f, separators=(',', ':'))
    report.append(f'L0: {len(l0)} rings, {sum(len(o["xy"]) // 2 for o in l0)} points, pole rings {sum(1 for o in l0 if o.get("pole"))}')

    # ---------------- L1: Thailand and region ----------------
    g10 = load('ne_10m_land.geojson')
    l1_land, holes, edges = land_in_window(g10['features'], L1_WIN, 0.004, 3)
    l1_land.sort(key=lambda r: -len(r))
    report.append(f'L1 land: {len(l1_land)} rings, {sum(len(r) // 2 for r in l1_land)} points, holes dropped {holes}')
    report.append(f'L1 land closure edges on the window boundary (>=0.05 deg): {json.dumps(edges)}')

    adm0 = []
    for f in load('ne_50m_admin_0_boundary_lines_land.geojson')['features']:
        for ln in lines_of(f['geometry']):
            for seg in clip_line([tuple(p[:2]) for p in ln], L1_WIN):
                adm0.append(flat(dp(seg, 0.004), 3))

    th = None
    for f in load('ne_10m_admin_0_countries.geojson')['features']:
        p = f['properties']
        if p.get('ADM0_A3') == 'THA' or p.get('ISO_A3') == 'THA':
            th = f
    lons = [pt[0] for poly in polys_of(th['geometry']) for pt in poly[0]]
    lats = [pt[1] for poly in polys_of(th['geometry']) for pt in poly[0]]
    th_ext = {'lon': [min(lons), max(lons)], 'lat': [min(lats), max(lats)]}
    th_rings = [flat(simplify_ring([tuple(p[:2]) for p in poly[0]], 0.004), 3) for poly in polys_of(th['geometry'])]
    th_rings.sort(key=lambda r: -len(r))

    th_adm1, ne_bkk, ne_non = [], None, None
    for f in load('ne_10m_admin_1_states_provinces.geojson')['features']:
        p = f['properties']
        if p.get('iso_a2') != 'TH':
            continue
        for poly in polys_of(f['geometry']):
            r = [tuple(q[:2]) for q in poly[0]]
            th_adm1.append(flat(simplify_ring(r, 0.004), 3))
        if p['name'] in ('Bangkok Metropolis', 'Bangkok'):
            ne_bkk = [tuple(q[:2]) for q in polys_of(f['geometry'])[0][0]]
        if p['name'] == 'Nonthaburi':
            ne_non = [tuple(q[:2]) for q in polys_of(f['geometry'])[0][0]]

    rivers = []
    for f in load('ne_10m_rivers_lake_centerlines.geojson')['features']:
        for ln in lines_of(f['geometry']):
            for seg in clip_line([tuple(p[:2]) for p in ln], L1_WIN):
                rivers.append({'name': f['properties'].get('name'), 'xy': flat(dp(seg, 0.004), 3)})

    # ---------------- L2: OSM metro ----------------
    q4, q5, q6 = load('q4.json'), load('q5.json'), load('q6.json')
    rels4 = {e['id']: e for e in q4['elements']}
    ids_amphoe = (2688299, 2688300, 2688301, 2689552, 2689553, 2689554)

    # district lines: every way once (shared ways between neighbours deduplicated by OSM id), simplified per way so both sides agree
    TOL_D = 0.00008
    way_store = {}
    dist_ways = {}

    def district(rel, province):
        ways = rel_outer_ways(rel, tol=TOL_D)
        for wid, g in ways:
            way_store[wid] = g
        dist_ways[rel['id']] = [wid for wid, _ in ways]
        rings = assemble([g for _, g in ways])
        closed = [r for r in rings if r[0] == r[-1]]
        if len(closed) != 1:
            report.append(f'WARN district {rel["id"]} {rel["tags"].get("name:en")}: {len(rings)} rings, {len(closed)} closed')
        r = max(closed or rings, key=len)
        r = r[:-1] if r[0] == r[-1] else r
        t = rel['tags']
        return {'id': rel['id'], 'nameEn': t.get('name:en', '').replace(' District', ''), 'nameTh': t.get('name', ''), 'province': province,
                'areaKm2': round(ring_area_km2(r), 1), 'centroid': [round(c, 4) for c in centroid(r)], 'ring': flat(r, 5)}

    districts = [district(e, 'bangkok') for e in q5['elements']]
    districts += [district(rels4[i], 'nonthaburi') for i in ids_amphoe]
    districts.sort(key=lambda d: (d['province'], d['nameEn']))
    if sum(1 for d in districts if d['province'] == 'bangkok') != 50 or sum(1 for d in districts if d['province'] == 'nonthaburi') != 6:
        report.append('WARN district count is not 50 + 6')

    def province(rid, key, member_ids):
        """Province land ring = the ways used by exactly one district (shared ways cancel). The OSM province relation of Bangkok adds a 77 km2
        maritime triangle (two province-only ways down to lat 13.219); it is not land and is reported in areasKm2.osmBangkokRingWithSea."""
        use = {}
        for did in member_ids:
            for wid in set(dist_ways[did]):
                use[wid] = use.get(wid, 0) + 1
        outer = [way_store[w] for w, c in use.items() if c == 1]
        rings = assemble(outer)
        r = max(rings, key=len)
        closed = r[0] == r[-1] and len(rings) == 1
        if len(rings) != 1:
            report.append(f'WARN province {key}: {len(rings)} outer rings from district boundary ways')
        r = r[:-1] if r[0] == r[-1] else r
        full = assemble([g for _, g in rel_outer_ways(rels4[rid], tol=TOL_D)])
        fr = max(full, key=len)
        fr = fr[:-1] if fr[0] == fr[-1] else fr
        return {'id': key, 'osmRelation': rid, 'closed': closed, 'areaKm2': round(ring_area_km2(r), 1), 'osmRingAreaKm2': round(ring_area_km2(fr), 1), 'ring': flat(r, 5)}, r

    pb, rb = province(92277, 'bangkok', [e['id'] for e in q5['elements']])
    pn, rn = province(1908796, 'nonthaburi', list(ids_amphoe))
    kb = [p for d in districts if d['province'] == 'bangkok' for p in zip(d['ring'][0::2], d['ring'][1::2])]
    report.append(f'Bangkok khet union bbox lon {min(p[0] for p in kb)}..{max(p[0] for p in kb)} lat {min(p[1] for p in kb)}..{max(p[1] for p in kb)}')
    bb = lambda r: {'lon': [round(min(p[0] for p in r), 4), round(max(p[0] for p in r), 4)], 'lat': [round(min(p[1] for p in r), 4), round(max(p[1] for p in r), 4)]}
    pb['bbox'], pn['bbox'] = bb(rb), bb(rn)

    seen, dlines = set(), []
    for wid, g in sorted(way_store.items()):
        if wid in seen:
            continue
        seen.add(wid)
        dlines.append(flat(g, 5))

    roads, rivs, canals = [], [], []
    for e in q6['elements']:
        t = e.get('tags', {})
        g = [(p['lon'], p['lat']) for p in e.get('geometry', [])]
        if len(g) < 2:
            continue
        if t.get('highway'):
            roads.append({'class': t['highway'], 'ref': t.get('ref', ''), 'xy': flat(dp(g, 0.0002), 5)})
        elif t.get('waterway') == 'river':
            nm = t.get('name:en', '')
            (rivs if nm.endswith('River') else canals).append({'name': nm, 'xy': flat(dp(g, 0.0002 if nm.endswith('River') else 0.0004), 5)})

    coast, holes2, edges2 = land_in_window(g10['features'], L2_WIN, 0.0004, 4)
    # open coast polylines without the window-boundary (closure) edges, so an outline never draws the clip window
    coast_lines = []
    for fr in coast:
        pts = [(fr[i], fr[i + 1]) for i in range(0, len(fr), 2)]
        run = []
        for i in range(len(pts)):
            a, b = pts[i - 1], pts[i]
            on_edge = any(abs(a[k] - v) < 1e-9 and abs(b[k] - v) < 1e-9 for k, v in ((0, L2_WIN[0]), (0, L2_WIN[2]), (1, L2_WIN[1]), (1, L2_WIN[3])))
            if on_edge:
                if len(run) > 1:
                    coast_lines.append(run)
                run = []
            else:
                if not run:
                    run = [a]
                run.append(b)
        if len(run) > 1:
            coast_lines.append(run)
    coast_lines = [[round(v, 4) for p in ln for v in p] for ln in coast_lines]
    report.append(f'L2 coast: {len(coast)} rings, {sum(len(r) // 2 for r in coast)} points, holes dropped {holes2}')
    report.append(f'L2 coast lines (open, no window edges): {len(coast_lines)}')
    report.append(f'L2 coast closure edges on the window boundary (>=0.05 deg): {json.dumps(edges2)}')

    ne_rings = {}
    if ne_bkk:
        ne_rings['bangkok'] = {'areaKm2': round(ring_area_km2(ne_bkk), 1), 'ring': flat(ne_bkk, 4)}
    if ne_non:
        ne_rings['nonthaburi'] = {'areaKm2': round(ring_area_km2(ne_non), 1), 'ring': flat(ne_non, 4)}

    def inpoly(x, y, r):
        c = False
        for i in range(len(r)):
            (x1, y1), (x2, y2) = r[i - 1], r[i]
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
                c = not c
        return c

    anchors = {'MC': (13.815, 100.600), 'K02': (13.755, 100.622), 'M0': (13.737, 100.560), 'NonCentre': (13.95, 100.42)}
    anchor_report = {}
    for k, (la, lo) in anchors.items():
        anchor_report[k] = {'lat': la, 'lon': lo, 'inBangkok': inpoly(lo, la, rb), 'inNonthaburi': inpoly(lo, la, rn)}

    areas = {'bangkok': pb['areaKm2'], 'nonthaburi': pn['areaKm2'], 'sum': round(pb['areaKm2'] + pn['areaKm2'], 1),
             'bangkokKhetSum': round(sum(d['areaKm2'] for d in districts if d['province'] == 'bangkok'), 1),
             'nonthaburiAmphoeSum': round(sum(d['areaKm2'] for d in districts if d['province'] == 'nonthaburi'), 1),
             'osmBangkokRingWithSea': pb['osmRingAreaKm2'], 'osmNonthaburiRing': pn['osmRingAreaKm2'],
             'neBangkok': ne_rings.get('bangkok', {}).get('areaKm2'), 'neNonthaburi': ne_rings.get('nonthaburi', {}).get('areaKm2')}

    with open(os.path.join(out_dir, 'map-l1.json'), 'w') as f:
        json.dump({'id': 'MAP-L1-REGION', 'source': 'Natural Earth 1:10m land, 1:50m admin-0 boundary lines, 1:10m admin-1 and rivers (public domain)',
                   'coords': 'lon, lat degrees, 3 digits; rings closed implicitly', 'window': list(L1_WIN), 'thailandExtent': th_ext,
                   'land': l1_land, 'thailand': th_rings, 'adm0Lines': adm0, 'thaiAdm1': th_adm1, 'rivers': rivers}, f, separators=(',', ':'))
    with open(os.path.join(out_dir, 'map-l2.json'), 'w') as f:
        json.dump({'id': 'MAP-L2-METRO', 'source': 'OpenStreetMap contributors (ODbL) for districts, province rings, roads, rivers; Natural Earth 1:10m land for the fine coast',
                   'osmExtract': A.date, 'coords': 'lon, lat degrees, 5 digits (coast 4); rings closed implicitly', 'coastWindow': list(L2_WIN),
                   'areasKm2': areas, 'anchors': anchor_report,
                   'provinces': [pb, pn], 'districts': districts, 'districtLines': dlines, 'roads': roads, 'rivers': rivs, 'canals': canals,
                   'coast': coast, 'coastLines': coast_lines, 'neAdm1': ne_rings}, f, separators=(',', ':'))
    with open(os.path.join(out_dir, 'NOTICE.md'), 'w') as f:
        f.write(f"""# Map data notice (EDU-EP17, `src/painted/edu17/map-l*.json`)

Baked by `scripts/edu17/bake-map.py`. Raw downloads are not in Git.

- **Natural Earth** (public domain, https://www.naturalearthdata.com/about/terms-of-use/): 1:110m land (L0), 1:10m land, 1:50m admin-0 boundary
  lines, 1:10m admin-1 states and provinces, 1:10m rivers and lake centerlines (L1; the fine coast of L2). Retrieved {A.date} from
  https://github.com/nvkelso/natural-earth-vector (`geojson/`).
- **OpenStreetMap** (Open Database Licence 1.0, https://www.openstreetmap.org/copyright): the province boundaries of Bangkok and Nonthaburi,
  the 50 khet of Bangkok and the 6 amphoe of Nonthaburi, motorway and trunk roads, rivers and canals in lat 13.45-14.20, lon 100.20-101.00.
  Extract date {A.date} (Overpass API, `timestamp_osm_base` 2026-11-11). Geometry is simplified (about 9 m for boundaries, 22-44 m for roads and water).

**Credit to carry in the video description (Q-F1 = a, 2026-11-11): "© OpenStreetMap contributors"**.
The derived map files (`map-l2.json`) are a Produced Work / Derived Database under ODbL; the share-alike duty applies to the data, not to the video.
""")
    report.append(f'L1 Thailand extent {json.dumps(th_ext)}')
    report.append(f'L2 areas km2 {json.dumps(areas)}')
    report.append(f'L2 bbox bangkok {pb["bbox"]} nonthaburi {pn["bbox"]}; ring closed: {pb["closed"]}, {pn["closed"]}')
    report.append(f'L2 districts {len(districts)} lines {len(dlines)} roads {len(roads)} rivers {len(rivs)} canals {len(canals)}')
    report.append(f'anchors {json.dumps(anchor_report)}')
    for d in districts:
        if d['province'] == 'nonthaburi':
            report.append(f'  amphoe {d["nameEn"]}: {d["areaKm2"]} km2 centroid {d["centroid"]}')
    print('\n'.join(report))
    for n in ('map-l0.json', 'map-l1.json', 'map-l2.json'):
        print(n, os.path.getsize(os.path.join(out_dir, n)), 'bytes')


main()
