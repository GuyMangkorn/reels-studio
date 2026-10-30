#!/bin/sh
# ZCPAINT production plate stills (Boss pass 10): bundles the pass 10 review entry (zcpaint-p10-index.ts, one composition per registered
# plate) and renders the listed frames with --gl=angle. Names follow the preview-label rule: <PLATE>_f<frame>.png (f = plate frame).
# Usage: scripts/zombie-condo-paint/plate-stills.sh OUTDIR PLATE_ID:FRAME[,FRAME...] ...   (e.g. ZCP-B02-SH03:0,39,83)
set -e
OUT=$1; shift
mkdir -p "$OUT" out/logs
npx remotion bundle src/painted/spike/zcpaint-p10-index.ts --out-dir "$OUT/bundle" > out/logs/zcp-p10-plate-bundle.log 2>&1
for spec in "$@"; do
  id=${spec%%:*}; frames=${spec#*:}
  for f in $(echo "$frames" | tr ',' ' '); do
    npx remotion still "$OUT/bundle" "ZCPAINT-P10-PLATE-$id" "$OUT/${id}_f$f.png" --frame="$f" --gl=angle >> out/logs/zcp-p10-plate-still.log 2>&1
  done
done
echo "$OUT"
