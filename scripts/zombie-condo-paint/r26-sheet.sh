#!/bin/sh
# ZCPAINT model sheet R2.6 (Boss pass 11, CS-ZCP-R26): renders pages A-G of the spike entry (zcpaint-r26-index.ts) with --gl=angle under
# out/painted/zcpaint/r26/, tiles each page for review (scripts/qa-sheet.sh, 540 px), and writes full-resolution crops of the two waist-cut
# closes (F: B02-SH03 collar and chin band, G: B01-SH01 nape). Logs under out/logs/zcp-r26-*.
# Usage: scripts/zombie-condo-paint/r26-sheet.sh [OUTDIR]   (default out/painted/zcpaint/r26)
set -e
D=${1:-out/painted/zcpaint/r26}
mkdir -p "$D" out/logs
npx remotion bundle src/painted/spike/zcpaint-r26-index.ts --out-dir "$D/bundle" > out/logs/zcp-r26-bundle.log 2>&1
for pg in A B C D E F G; do echo "ZCPAINT-R26-$pg 0 $D/R26-$pg.png"; done | node scripts/stills.mjs "$D/bundle" > out/logs/zcp-r26-still.log 2>&1
for pg in A B C D E F G; do
  scripts/qa-sheet.sh "$D/review-$pg.png" --width 540 "$D/R26-$pg.png" > /dev/null
done
ffmpeg -loglevel error -y -i "$D/R26-F.png" -vf crop=480:300:275:860 "$D/crop-B02-SH03-collar.png"
ffmpeg -loglevel error -y -i "$D/R26-G.png" -vf crop=480:300:0:830 "$D/crop-B01-SH01-nape.png"
ls "$D"/review-*.png "$D"/crop-*.png
