#!/bin/sh
# Brief POV caption check (VB-ZCPAINT-SHORT VD-ZC-CAP): brightness under the caption text only, x 150-930, y 1140-1248,
# limits mean <= 0.45, p95 <= 0.60. Measure frames WITHOUT caption glyphs (the shade may be on); glyphs inflate p95.
# Usage: scripts/zombie-condo-paint/capzone-undertext.sh OUTDIR FRAME.png...   (writes OUTDIR/ut-<frame>.png crops)
set -e
out=$1; shift
mkdir -p "$out"
for f in "$@"; do
  ffmpeg -loglevel error -y -i "$f" -vf crop=780:1920:150:0 "$out/ut-$(basename "$f")"
done
python3 -I scripts/caption-zone.py --band 1140:1248 --max-mean 0.45 --max-p95 0.60 "$out"/ut-*.png
