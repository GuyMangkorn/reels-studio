#!/bin/sh
# Renders the EDU-EP30-SHORT W3 look frames, thumbnails and KP-EMU stills on one Chrome (scripts/stills.mjs, --gl=angle):
#   sh scripts/edu-series/ep30/short/render-looks.sh <version> [LF01a LF01b TP2 ...]   -> out/edu30/looks/<version>/<ID>.png
# Thumbnails at half size: SCALE=0.5 sh scripts/edu-series/ep30/short/render-looks.sh <version> LF01a TP2 TP3 LF02 TD2 LF03 TA2
# Without caption, title and chrome (caption-zone background measure): CAPTION=0 sh scripts/edu-series/ep30/short/render-looks.sh <version>-nocap
V=${1:-v1}; shift
IDS=${*:-LF01a LF01b LF02 LF03 KP-stand KP-walk KP-peck KP-run KP-bow KP-look}
PROPS='{}'; [ "${CAPTION:-1}" = 0 ] && PROPS='{"caption":false}'
[ -n "$SCALE" ] && PROPS='{"paintScale":'"$SCALE"'}'   # thumbnails: SCALE=0.5 paints at half size (draft)
mkdir -p out/edu30/looks/$V out/logs
for i in $IDS; do printf 'EDU30-%s 0 out/edu30/looks/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs src/painted/edu30/look-index.ts --gl=angle --props="$PROPS" > "out/logs/edu30-looks-$V.log" 2>&1
echo "exit $? · $(echo $IDS | wc -w | tr -d ' ') looks -> out/edu30/looks/$V (log out/logs/edu30-looks-$V.log)"
tail -2 "out/logs/edu30-looks-$V.log"
