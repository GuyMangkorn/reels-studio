#!/bin/sh
# S-P12 6-head model sheet (BODY-ZCP-6H, Boss pass 7). Renders pages A-C and the bare measure compositions M1-M8 under
# out/painted/zcpaint/s-p12/, tiles the pages for review (scripts/qa-sheet.sh), and prints the artwork height of each measure
# (bbox.py: non-paper pixels of the full frame; no floor, shadow or label is painted in M1-M8).
# Usage: scripts/zombie-condo-paint/s-p12-sheet.sh
set -e
D=out/painted/zcpaint/s-p12
mkdir -p "$D/measure" out/logs
npx remotion bundle src/painted/spike/zcpaint-s-p12-index.ts --out-dir "$D/bundle" > out/logs/zcp-s-p12-bundle.log 2>&1
for pg in A B C; do
  npx remotion still "$D/bundle" "ZCPAINT-S-P12-$pg" "$D/S-P12-$pg.png" --frame=0 --gl=angle >> out/logs/zcp-s-p12-still.log 2>&1
  scripts/qa-sheet.sh "$D/review-$pg.png" --width 540 "$D/S-P12-$pg.png" > /dev/null
done
for m in 1 2 3 4 5 6 7 8 9; do
  npx remotion still "$D/bundle" "ZCPAINT-S-P12-M$m" "$D/measure/S-P12-M$m.png" --frame=0 --gl=angle >> out/logs/zcp-s-p12-still.log 2>&1
  printf 'M%s ' "$m"
  python3 -I scripts/zombie-condo-paint/bbox.py "$D/measure/S-P12-M$m.png" 0 0 1080 1920
done
ls "$D"/review-*.png
