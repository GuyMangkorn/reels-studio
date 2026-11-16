#!/bin/sh
# Renders the EDU-EP18-SHORT W3 look frames on one Chrome (WebGL for the hippo layer: --gl=angle):
#   sh scripts/edu-series/ep18/short/render-looks.sh <version> [LF01 LF02 ...]      -> out/edu18/looks/<version>/<ID>.png
# Clean frames (no caption-band guides) for scripts/caption-zone.py: GUIDES=0 sh scripts/edu-series/ep18/short/render-looks.sh <version>-clean
V=${1:-v1}; shift
IDS=${*:-$(grep -o "^  LF[0-9A-Z]*:" src/painted/edu18/looks.tsx | tr -d ' :')}
PROPS='{}'; [ "${GUIDES:-1}" = 0 ] && PROPS='{"guides":false}'
mkdir -p out/edu18/looks/$V out/logs
for i in $IDS; do printf 'EDU18-%s 0 out/edu18/looks/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs src/painted/edu18/looks-index.tsx --gl=angle --props="$PROPS" > "out/logs/edu18-looks-$V.log" 2>&1
echo "exit $? · $(echo $IDS | wc -w | tr -d ' ') looks -> out/edu18/looks/$V (log out/logs/edu18-looks-$V.log)"
tail -2 "out/logs/edu18-looks-$V.log"
