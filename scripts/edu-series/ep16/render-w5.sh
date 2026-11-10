#!/bin/sh
# Renders the EDU-EP16 W5.2 asset stills on one Chrome: sh scripts/edu-series/ep16/render-w5.sh <version> [FL1 PS1 ...]
# Clean frames for the caption-zone measure: GUIDES=0 sh scripts/edu-series/ep16/render-w5.sh <version>-clean
V=${1:-v1}; shift
IDS=${*:-FL1 FL2 PS1 PS2 PS3 PR1 SD1 AE1 AE2 AE3 AE4}
PROPS='{}'; [ "${GUIDES:-1}" = 0 ] && PROPS='{"guides":false}'
for i in $IDS; do printf 'EDU16W5-%s 0 out/edu16/w5/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs src/painted/edu16/w5-index.ts --props="$PROPS"
