#!/bin/sh
# Renders the EDU-EP21-SHORT W3.1 look frames on one Chrome (scripts/stills.mjs, --gl=angle):
#   sh scripts/edu-series/ep21/short/render-looks.sh <version> [LF01 LF02 LF03]      -> out/edu21/looks/<version>/<ID>.png
# Clean frames (no caption-band guides) for scripts/caption-zone.py: GUIDES=0 sh scripts/edu-series/ep21/short/render-looks.sh <version>-clean
V=${1:-v1}; shift
IDS=${*:-LF01 LF02 LF03}
PROPS='{}'; [ "${GUIDES:-1}" = 0 ] && PROPS='{"guides":false}'
mkdir -p out/edu21/looks/$V out/logs
for i in $IDS; do printf 'EDU21-%s 0 out/edu21/looks/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs src/painted/edu21/look-index.ts --gl=angle --props="$PROPS" > "out/logs/edu21-looks-$V.log" 2>&1
echo "exit $? · $(echo $IDS | wc -w | tr -d ' ') looks -> out/edu21/looks/$V (log out/logs/edu21-looks-$V.log)"
tail -2 "out/logs/edu21-looks-$V.log"
