#!/bin/sh
# ZCPAINT bust model sheet (close-shot bust, `src/painted/zcpaint/bust.ts`, Boss pass 10). Renders pages A-E of the spike entry
# (zcpaint-p10-bust-index.ts) under out/painted/zcpaint/p10/bust/, then tiles them into one model sheet for review (scripts/qa-sheet.sh).
# Usage: scripts/zombie-condo-paint/bust-sheet.sh [OUTDIR]   (default out/painted/zcpaint/p10/bust)
set -e
D=${1:-out/painted/zcpaint/p10/bust}
mkdir -p "$D" out/logs
npx remotion bundle src/painted/spike/zcpaint-p10-bust-index.ts --out-dir "$D/bundle" > out/logs/zcp-p10-bust-bundle.log 2>&1
for pg in A B C D E; do echo "ZCPAINT-P10-BUST-$pg 0 $D/page-$pg.png"; done | node scripts/stills.mjs "$D/bundle" > out/logs/zcp-p10-bust-still.log 2>&1
set --
for pg in A B C D E; do set -- "$@" "$D/page-$pg.png"; done
sh scripts/qa-sheet.sh "$D/bust-model-sheet.png" --cols 5 --width 330 "$@" > /dev/null
echo "$D/bust-model-sheet.png"
