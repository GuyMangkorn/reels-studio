#!/bin/sh
# Render stills from a painted spike/entry file and print decoded-RGB md5 per frame (PNG bytes are not comparable).
# Usage: scripts/zombie-condo-paint/render-frames.sh ENTRY.ts OUTDIR ID:f,f,f [ID:f,f ...]
# Writes OUTDIR/<ID>_F<n>.png and OUTDIR/md5.txt. Run before and after a shared-code change and diff the md5.txt files.
set -e
entry=$1; out=$2; shift 2
mkdir -p "$out"
npx remotion bundle "$entry" --out-dir "$out/bundle" > "$out/bundle.log" 2>&1
: > "$out/md5.txt"
for spec in "$@"; do
  id=${spec%%:*}; frames=${spec#*:}
  for f in $(echo "$frames" | tr ',' ' '); do
    png="$out/${id}_F${f}.png"
    npx remotion still "$out/bundle" "$id" "$png" --frame="$f" --gl=angle >> "$out/still.log" 2>&1
    sum=$(ffmpeg -v error -i "$png" -f rawvideo -pix_fmt rgb24 - | md5 -q)
    echo "$id F$f $sum" >> "$out/md5.txt"
  done
done
cat "$out/md5.txt"
