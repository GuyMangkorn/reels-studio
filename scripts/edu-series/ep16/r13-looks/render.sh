#!/bin/sh
# Film R13 look frames (one Chrome): sh scripts/edu-series/ep16/r13-looks/render.sh <version> [IDS]
V=${1:-v1}; shift
IDS=${*:-AS-BEASTS LF-SH02 LF-SH03 LF-SH05 LF-SH08 LF-SH10 LF-SH11 LF-SH16}
mkdir -p out/ep16/r13/looks/$V out/logs
for i in $IDS; do printf 'R13-%s 0 out/ep16/r13/looks/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs scripts/edu-series/ep16/r13-looks/index.tsx
