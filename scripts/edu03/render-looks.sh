#!/bin/sh
# EDU-EP03-SHORT W3 look stills and spike S1 (one Chrome, scripts/stills.mjs). Output: out/edu03/look/. Usage: sh scripts/edu03/render-looks.sh [OUTDIR]
set -e
out=${1:-out/edu03/look}
mkdir -p "$out" out/logs
printf '%s\n' \
  "EDU3-LF01 30 $out/LF01.png" \
  "EDU3-LF01-DOGVIEW 30 $out/LF01-dogview.png" \
  "EDU3-S1-NORMAL 0 $out/S1-normal.png" \
  "EDU3-S1-DOG 0 $out/S1-dog.png" \
  "EDU3-S1-BLUE-NORMAL 0 $out/S1-blue-normal.png" \
  "EDU3-S1-BLUE-DOG 0 $out/S1-blue-dog.png" \
  "EDU3-LF02 40 $out/LF02.png" \
  "EDU3-LF03 30 $out/LF03.png" \
  "EDU3-LF03-NORMAL 30 $out/LF03-normal.png" \
  | node scripts/stills.mjs src/painted/edu03/look-index.ts > out/logs/edu03-still.log 2>&1
tail -n 7 out/logs/edu03-still.log | cut -c1-160
