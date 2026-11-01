#!/bin/sh
# ZCPAINT-SHORT Editor stills (pass 1): bundles the real registry (src/index.ts, so the ZCPAINT-SHORT-* compositions are the
# ones the Studio shows), then renders listed composition frames with --gl=angle (painted scenes need it).
# Output: out/samples/zombie-condo-paint/<ID>/<REVISION>/<BEAT>_f<frame>.png (ignored by Git), plus a TSV manifest.
# Usage: scripts/zombie-condo-paint/editor-stills.sh REVISION ID BEAT:FRAME[,BEAT:FRAME...] [ID BEAT:FRAME...]
# Example: scripts/zombie-condo-paint/editor-stills.sh editor-pass1 ZCPAINT-SHORT-TH B01:45,B02:180
set -e
REV=$1; shift
mkdir -p out/logs
BUNDLE=out/zcpaint-editor/bundle
if [ ! -f "$BUNDLE/index.html" ]; then
  npx remotion bundle src/index.ts --out-dir "$BUNDLE" > out/logs/zcp-editor-bundle.log 2>&1
fi
while [ $# -gt 0 ]; do
  ID=$1; shift; SPEC=$1; shift
  DIR="out/samples/zombie-condo-paint/$ID/$REV"
  mkdir -p "$DIR"
  for item in $(echo "$SPEC" | tr ',' ' '); do
    beat=${item%%:*}; f=${item#*:}
    echo "$ID $f $DIR/${beat}_f$f.png"
    printf '%s\t%s\t%s\t%s\n' "$ID" "$beat" "$f" "$DIR/${beat}_f$f.png" >> "$DIR/manifest.tsv"
  done | node scripts/stills.mjs "$BUNDLE" 2>> out/logs/zcp-editor-still.log
done
