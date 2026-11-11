#!/bin/sh
# Renders EDU-EP15 shot frames (W5.2) on one Chrome. Usage: sh scripts/edu-series/ep15/render-shots.sh <outdir> SH:L[,L...] ...   e.g. v1 S01-B01-SH01:0,64,112 S01-B01-SH02:36
# Clean frames for the caption-zone measure: GUIDES=0 sh scripts/edu-series/ep15/render-shots.sh <outdir> ...   (frames land in out/edu15/build/<outdir>/<SH>_<L>.png)
# Half-size draft stills for contact sheets are the same frames downscaled by scripts/qa-sheet.sh (docs/render-rules.md render stage).
OUT=${1:-v1}; shift
PROPS='{}'; [ "${GUIDES:-1}" = 0 ] && PROPS='{"guides":false}'
for a in "$@"; do
  id=${a%%:*}; for L in $(echo "${a#*:}" | tr ',' ' '); do printf 'EDU15-%s %s out/edu15/build/%s/%s_%03d.png\n' "$id" "$L" "$OUT" "$id" "$L"; done
done | node scripts/stills.mjs src/painted/edu15/build-index.ts --props="$PROPS"
