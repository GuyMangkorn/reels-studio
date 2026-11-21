#!/bin/sh
# Renders the EDU-EP31-SHORT W3 look frames on one Chrome (scripts/stills.mjs, --gl=angle):
#   sh scripts/edu-series/ep31/short/render-looks.sh <version> [LF01 LF02 ...]   -> out/edu31/looks/<version>/<ID>.png
# CCTV-STILL-01 first: CAPTION=0 sh scripts/edu-series/ep31/short/render-looks.sh still LF02, then
#   cp out/edu31/looks/still/LF02.png public/edu31/cctv-still-01.png  (LF05, LF05B, LF06 and LF07 map that image)
# Caption band guides: GUIDES=1. Without caption and chrome (caption-zone background measure): CAPTION=0.
V=${1:-v1}; shift
IDS=${*:-LF01 LF02 LF03 LF04 LF05 LF05B LF06 LF07 PR01 TT01}
PROPS='{}'
[ "${CAPTION:-1}" = 0 ] && PROPS='{"caption":false}'
[ "${GUIDES:-0}" = 1 ] && PROPS='{"guides":true}'
mkdir -p out/edu31/looks/$V out/logs
for i in $IDS; do printf 'EDU31-%s 0 out/edu31/looks/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs src/painted/edu31/look-index.ts --gl=angle --props="$PROPS" > "out/logs/edu31-looks-$V.log" 2>&1
echo "exit $? · $(echo $IDS | wc -w | tr -d ' ') looks -> out/edu31/looks/$V (log out/logs/edu31-looks-$V.log)"
tail -2 "out/logs/edu31-looks-$V.log"
