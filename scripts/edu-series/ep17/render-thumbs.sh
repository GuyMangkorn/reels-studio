#!/bin/sh
# Renders EDU-EP17 W3 thumbnails on one Chrome: sh scripts/edu-series/ep17/render-thumbs.sh <version> [T1A T1B ...]
# Clean frames for the caption-zone measure: GUIDES=0 sh scripts/edu-series/ep17/render-thumbs.sh <version>-clean
V=${1:-v1}; shift
IDS=${*:-$(grep -o "^  T[0-9][A-Z]:" src/painted/edu17/thumbs.tsx | tr -d ' :')}
PROPS='{}'; [ "${GUIDES:-1}" = 0 ] && PROPS='{"guides":false}'
mkdir -p out/logs
for i in $IDS; do printf 'EDU17-%s 0 out/edu17/thumbs/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs src/painted/edu17/thumbs-index.ts --props="$PROPS" > "out/logs/edu17-thumbs-$V.log" 2>&1
tail -3 "out/logs/edu17-thumbs-$V.log"
