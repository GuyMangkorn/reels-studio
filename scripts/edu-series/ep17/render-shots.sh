#!/bin/sh
# EDU-EP17 W5.3 shot stills on one Chrome: sh scripts/edu-series/ep17/render-shots.sh <outdir> <SHOTNO:L> ...   e.g. out/qa/edu-ep17/s/v1 2:2 5:15 12:16   (SHOTNO 1-22; L shot-local frame)
# Clean frames (no dashed band, for caption-zone.py): GUIDES=0 sh scripts/edu-series/ep17/render-shots.sh <outdir> ...
D=$1; shift
PROPS='{}'; [ "${GUIDES:-1}" = 0 ] && PROPS='{"guides":false}'
mkdir -p "$D"
for a in "$@"; do n=${a%%:*}; L=${a##*:}; printf 'EDU17S-%s %s %s/s%02d_%03d.png\n' "$(python3 -I -c "import re;print(re.findall(r\"\\['(S01-B\\d\\d-SH\\d\\d)'\", open('src/videos/edu-ep17/clock.ts').read())[$n-1])")" "$L" "$D" "$n" "$L"; done | node scripts/stills.mjs src/videos/edu-ep17/shots-index.ts --props="$PROPS"
