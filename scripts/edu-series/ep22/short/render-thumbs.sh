#!/bin/sh
# Renders EDU-EP22 W3 thumbnails and asset checks on one Chrome: sh scripts/edu-series/ep22/short/render-thumbs.sh <version> [TH-A TH-B ...]
# Finished look frames (W3.1 part 2) paint clean by default: sh scripts/edu-series/ep22/short/render-thumbs.sh <version> LF01 LF01b LF02
# Clean frames for the caption-zone measure: GUIDES=0 sh scripts/edu-series/ep22/short/render-thumbs.sh <version>-clean
V=${1:-v1}; shift
IDS=${*:-$(grep -o "^  '[A-Z0-9-]*':" src/painted/edu22/looks.ts | tr -d " ':")}
PROPS='{}'; [ "${GUIDES:-1}" = 0 ] && PROPS='{"guides":false}'
mkdir -p out/logs
for i in $IDS; do printf 'EDU22-%s 0 out/edu22/thumbs/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs src/painted/edu22/thumbs-index.ts --props="$PROPS" > "out/logs/edu22-thumbs-$V.log" 2>&1
tail -3 "out/logs/edu22-thumbs-$V.log"
