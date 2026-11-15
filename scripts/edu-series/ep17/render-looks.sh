#!/bin/sh
# Renders EDU-EP17 W3 finished look frames on one Chrome: sh scripts/edu-series/ep17/render-looks.sh <version> [LF01 LF01R ...]
# Clean frames for the caption-zone measure: GUIDES=0 sh scripts/edu-series/ep17/render-looks.sh <version>-clean
V=${1:-v1}; shift
IDS=${*:-$(grep -o "^  LF[0-9A-Z]*:" src/painted/edu17/looks.tsx | tr -d ' :')}
PROPS='{}'; [ "${GUIDES:-1}" = 0 ] && PROPS='{"guides":false}'
mkdir -p out/logs
for i in $IDS; do printf 'EDU17-%s 0 out/edu17/looks/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs src/painted/edu17/looks-index.ts --props="$PROPS" > "out/logs/edu17-looks-$V.log" 2>&1
tail -3 "out/logs/edu17-looks-$V.log"
