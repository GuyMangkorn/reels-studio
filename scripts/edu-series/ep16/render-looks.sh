#!/bin/sh
# Renders the EDU-EP16..18 survival-series look stills (W3, Film) on one Chrome: sh scripts/edu-series/ep16/render-looks.sh <version> [IDS]
# Clean frames for the caption-zone measure: GUIDES=0 sh scripts/edu-series/ep16/render-looks.sh <version>-clean
V=${1:-v1}; shift
IDS=${*:-LF16-VIL-NIGHT LF16-VIL-MORN AS-CAST AS-HEN}
PROPS='{}'; [ "${GUIDES:-1}" = 0 ] && PROPS='{"guides":false}'
mkdir -p out/survival/look-frames/$V out/logs
for i in $IDS; do printf 'SURV-%s 0 out/survival/look-frames/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs src/painted/survival/look-index.ts --props="$PROPS"
