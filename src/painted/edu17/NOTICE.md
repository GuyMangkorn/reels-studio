# Map data notice (EDU-EP17, `src/painted/edu17/map-l*.json`)

Baked by `scripts/edu17/bake-map.py`. Raw downloads are not in Git.

- **Natural Earth** (public domain, https://www.naturalearthdata.com/about/terms-of-use/): 1:110m land (L0), 1:10m land, 1:50m admin-0 boundary
  lines, 1:10m admin-1 states and provinces, 1:10m rivers and lake centerlines (L1; the fine coast of L2). Retrieved 2026-11-11 from
  https://github.com/nvkelso/natural-earth-vector (`geojson/`).
- **OpenStreetMap** (Open Database Licence 1.0, https://www.openstreetmap.org/copyright): the province boundaries of Bangkok and Nonthaburi,
  the 50 khet of Bangkok and the 6 amphoe of Nonthaburi, motorway and trunk roads, rivers and canals in lat 13.45-14.20, lon 100.20-101.00.
  Extract date 2026-11-11 (Overpass API, `timestamp_osm_base` 2026-11-11). Geometry is simplified (about 9 m for boundaries, 22-44 m for roads and water).

**- **OpenStreetMap, built-up land use** (fix pass B, 2026-11-12; `map-landuse.json`, bake `scripts/edu17/bake-landuse.py`, query `scripts/edu17/overpass/q7-landuse.overpassql`):
  `landuse` residential, commercial, industrial and retail polygons (ways and multipolygon outers) in lat 13.45-14.20, lon 100.20-101.00, kept when the centroid lies in Bangkok or
  Nonthaburi and the area is at least 1 ha, simplified to about 22 m. Extract date 2026-11-12 (`timestamp_osm_base` 2026-11-12T00:40:36Z). Same ODbL licence and the same credit
  as above; the file is a Derived Database under ODbL (share-alike applies to the data, not to the video).

**Credit to carry in the video description (Q-F1 = a, 2026-11-11): "© OpenStreetMap contributors"**.
The derived map files (`map-l2.json`) are a Produced Work / Derived Database under ODbL; the share-alike duty applies to the data, not to the video.
