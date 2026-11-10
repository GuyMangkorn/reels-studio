#!/bin/sh
# Renders EDU-EP14 look frames (W3) on one Chrome: sh scripts/edu-series/ep14/render-looks.sh <version> [LF01 LF02 ...]
V=${1:-v1}; shift
IDS=${*:-LF01 LF02 LF02U LF03 LF04 LF05}
for i in $IDS; do printf 'EDU14-%s 0 out/edu14/look-frames/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs src/painted/edu14/look-index.ts
