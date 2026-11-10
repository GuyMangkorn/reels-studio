#!/bin/sh
# Renders EDU-EP16 look stills (W3) on one Chrome: sh scripts/edu-series/ep16/render-looks.sh <version> [LF01 LF02 ...]
# Clean frames for the caption-zone measure: GUIDES=0 sh scripts/edu-series/ep16/render-looks.sh <version>-clean
V=${1:-v1}; shift
IDS=${*:-LF01 LF02 LF03 LF04A LF04B LF05 CR1 CR2 CR3 CR4 MK1 MK2 MK3 MK4}
PROPS='{}'; [ "${GUIDES:-1}" = 0 ] && PROPS='{"guides":false}'
for i in $IDS; do printf 'EDU16-%s 0 out/edu16/look-frames/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs src/painted/edu16/look-index.ts --props="$PROPS"
