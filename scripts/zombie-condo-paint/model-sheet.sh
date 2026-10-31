#!/bin/sh
# Render the ZCPAINT model-sheet pages (S-P01) at the given frames and write 540 px review sheets under out/painted/zcpaint/model/.
# Usage: scripts/zombie-condo-paint/model-sheet.sh [FRAME ...]   (default frame 0)
set -e
D=out/painted/zcpaint/model
mkdir -p "$D"
npx remotion bundle src/painted/spike/zcpaint-model-index.ts --out-dir "$D/bundle" > out/logs/zcp-model-bundle.log 2>&1
frames=${*:-0}
for f in $frames; do for pg in A B C; do echo "ZCPAINT-MODEL-$pg $f $D/model-$pg-F$f.png"; done; done |
  node scripts/stills.mjs "$D/bundle" > out/logs/zcp-model-still.log 2>&1
for f in $frames; do
  for pg in A B C; do
    scripts/qa-sheet.sh "$D/qa-$pg-F$f.png" --width 540 "$D/model-$pg-F$f.png" > /dev/null
  done
done
ls "$D"/qa-*.png
