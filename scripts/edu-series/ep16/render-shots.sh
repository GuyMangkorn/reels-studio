#!/bin/sh
# EDU-EP16 W5.3 shot stills on one Chrome: sh scripts/edu-series/ep16/render-shots.sh <outdir> <SHOTNO:L> ...   e.g. out/edu16/s/v1 1:0 1:40 13:72   (SHOTNO 1-20; L shot-local frame)
# Clean frames (no dashed band, for caption-zone.py): GUIDES=0 [CALM0=1] sh scripts/edu-series/ep16/render-shots.sh <outdir> ...
D=$1; shift
PROPS='{}'; [ "${GUIDES:-1}" = 0 ] && PROPS='{"guides":false}'
# CALM0=1: no dim plate (bare picture, for the caption-zone numbers before a plate is considered)
[ "${CALM0:-0}" = 1 ] && PROPS=$(printf '%s' "$PROPS" | sed 's/}$/,"calm":0}/; s/{,/{/')
for a in "$@"; do n=${a%%:*}; L=${a##*:}; printf 'EDU16S-%s %s %s/s%02d_%03d.png\n' "$(python3 -I -c "import sys;print(['S01-B01-SH01','S01-B01-SH02','S01-B01-SH03','S01-B01-SH04','S01-B01-SH05','S01-B01-SH06','S01-B01-SH07','S01-B02-SH01','S01-B02-SH02','S01-B02-SH03','S01-B03-SH01','S01-B03-SH02','S01-B03-SH03','S01-B04-SH01','S01-B04-SH02','S01-B04-SH03','S01-B05-SH01','S01-B05-SH02','S01-B05-SH03','S01-B05-SH04'][$n-1])")" "$L" "$D" "$n" "$L"; done | node scripts/stills.mjs src/painted/edu16/shots-index.ts --props="$PROPS"
