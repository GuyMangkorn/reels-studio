#!/bin/sh
# Renders the EDU-EP32-SHORT W3 look frames on one Chrome (scripts/stills.mjs, --gl=angle):
#   sh scripts/edu-series/ep32/short/render-looks.sh <version> [LF02 ...]   -> out/edu32/looks/<version>/<ID>.png
# Without caption and chrome (caption-zone background measure): CAPTION=0 sh scripts/edu-series/ep32/short/render-looks.sh <version>-nocap
V=${1:-v1}; shift
IDS=${*:-LF02}
PROPS='{}'; [ "${CAPTION:-1}" = 0 ] && PROPS='{"caption":false}'
[ -n "$SCALE" ] && PROPS='{"paintScale":'"$SCALE"'}'
mkdir -p out/edu32/looks/$V out/logs
for i in $IDS; do printf 'EDU32-%s 0 out/edu32/looks/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs src/painted/edu32/look-index.ts --gl=angle --props="$PROPS" > "out/logs/edu32-looks-$V.log" 2>&1
echo "exit $? · $(echo $IDS | wc -w | tr -d ' ') looks -> out/edu32/looks/$V (log out/logs/edu32-looks-$V.log)"
tail -2 "out/logs/edu32-looks-$V.log"
