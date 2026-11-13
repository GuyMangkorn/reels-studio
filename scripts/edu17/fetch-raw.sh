#!/bin/sh
# Downloads the raw map data for scripts/edu17/bake-map.py into out/ep17/raw (kept out of git; the baked JSON in src/painted/edu17 is what is committed).
# Natural Earth (public domain): GitHub mirror of the official vector set. OpenStreetMap (ODbL): Overpass API; the three queries sit in scripts/edu17/overpass/.
# Overpass needs a User-Agent (a bare curl gets HTTP 406); use a generic client name. Files are saved as q4.json, q5.json, q6.json (names bake-map.py reads).
set -eu
OUT="${1:-out/ep17/raw}"
mkdir -p "$OUT"
B=https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson
for f in ne_110m_land ne_10m_land ne_50m_admin_0_boundary_lines_land ne_10m_admin_1_states_provinces ne_10m_rivers_lake_centerlines ne_10m_admin_0_countries; do
  curl -sSL -o "$OUT/$f.geojson" "$B/$f.geojson"
done
Q="$(dirname "$0")/overpass"
for p in "q4:q4-provinces-amphoe" "q5:q5-bangkok-khet" "q6:q6-roads-rivers"; do
  curl -sS -m 290 -A "map-bake-script/1.0" --data-urlencode "data@$Q/${p#*:}.overpassql" https://overpass-api.de/api/interpreter -o "$OUT/${p%%:*}.json"
  sleep 3
done
ls -l "$OUT"
