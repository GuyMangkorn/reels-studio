#!/bin/sh
# Renders EDU-EP17 shot-plate stills (Boss W5) on one Chrome: sh scripts/edu-series/ep17/render-shots.sh <version> B01-SH01:0 B01-SH01:56 ...
# Files: out/edu17/build/<version>/<shot>_f<L>.png (L = shot-local frame). Clean frames for scripts/caption-zone.py: GUIDES=0 sh ... <version>-clean ...
V=${1:-v1}; shift
PROPS='{}'; [ "${GUIDES:-1}" = 0 ] && PROPS='{"guides":false}'
mkdir -p out/logs "out/edu17/build/$V"
for a in "$@"; do s=${a%%:*}; l=${a##*:}; printf 'EDU17-S01-%s %s out/edu17/build/%s/%s_f%s.png\n' "$s" "$l" "$V" "$s" "$l"; done \
  | node scripts/stills.mjs src/painted/edu17/build-index.ts --props="$PROPS" > "out/logs/edu17-shots-$V.log" 2>&1
tail -2 "out/logs/edu17-shots-$V.log"
