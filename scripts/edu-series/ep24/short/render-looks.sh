#!/bin/sh
# Renders the EDU-EP24-SHORT W3 look frames on one Chrome (scripts/stills.mjs, --gl=angle):
#   sh scripts/edu-series/ep24/short/render-looks.sh <version> [LF01x LF02 LF03 LF04x]   -> out/edu24/looks/<version>/<ID>.png
# Without caption and mark (caption-zone background measure): CAPTION=0 sh scripts/edu-series/ep24/short/render-looks.sh <version>-nocap
V=${1:-v1}; shift
IDS=${*:-LF01x LF02 LF03 LF04x}
PROPS='{}'; [ "${CAPTION:-1}" = 0 ] && PROPS='{"caption":false}'
mkdir -p out/edu24/looks/$V out/logs
for i in $IDS; do printf 'EDU24-%s 0 out/edu24/looks/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs src/painted/edu24/look-index.ts --gl=angle --props="$PROPS" > "out/logs/edu24-looks-$V.log" 2>&1
echo "exit $? · $(echo $IDS | wc -w | tr -d ' ') looks -> out/edu24/looks/$V (log out/logs/edu24-looks-$V.log)"
tail -2 "out/logs/edu24-looks-$V.log"
