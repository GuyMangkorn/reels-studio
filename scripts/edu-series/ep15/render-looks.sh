#!/bin/sh
# Renders EDU-EP15 look stills (W3) on one Chrome: sh scripts/edu-series/ep15/render-looks.sh <version> [LF01 LF02 ...]
# Clean frames for the caption-zone measure: GUIDES=0 sh scripts/edu-series/ep15/render-looks.sh <version>-clean
V=${1:-v1}; shift
IDS=${*:-LF01 LF02 LF03 LF04 LF05A LF05B TK1 TK2 TK4 TK5 TK6 TK7 TK8}
PROPS='{}'; [ "${GUIDES:-1}" = 0 ] && PROPS='{"guides":false}'
for i in $IDS; do printf 'EDU15-%s 0 out/edu15/look-frames/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs src/painted/edu15/look-index.ts --props="$PROPS"
