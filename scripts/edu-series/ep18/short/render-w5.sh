#!/bin/sh
# Renders the EDU-EP18-SHORT W5 Boss QA cards and the post photo (src/painted/edu18/w5-index.tsx) on one Chrome (--gl=angle for the hippo):
#   sh scripts/edu-series/ep18/short/render-w5.sh <version> [ID:f,f,... ...]   -> out/edu18/w5/<version>/<ID>_f<frame>.png
# Without IDs it renders the default frame set below (start, marks and end of every movement; F-1/F/F+1 at the charge halt and the snake entry).
V=${1:-v1}; shift
SET=${*:-"EDU18-W5-B01-SH01:0,1,2,8,14,60,96,118,126 EDU18-W5-B01-SH02:0,18,35 EDU18-W5-B01-SH03:0,4,12,21,22,23,26,29,30,31 EDU18-W5-B01-SH05:0,22,30,40,55 EDU18-W5-B02-SH01:0,29,35 EDU18-W5-B02-SH03:0,42,56,70,90,118 EDU18-W5-B04-SH02:0,40 EDU18-W5-B04-SH03:0,6,20,27,57,87 EDU18-W5-B04-SH04:0,20,40,56,59,60,61,70,89 EDU18-W5-GATE:0,1,2,3,4,5,6,7 EDU18-W5-LICK:0,2,3,4,5,6,7,8 EDU18-W5-B02-SH02:0,4,7,10,14,34,55 EDU18-W5-B06-SH02:0,14,40,41,42,47,68 EDU18-W5-B06-SH03:0,8,16,50,85 EDU18-W5-ZOOM:0 EDU18-W5-POST500:0 EDU18-POST-PHOTO:0"}
mkdir -p out/edu18/w5/$V out/logs
for item in $SET; do
  id=${item%%:*}; frames=$(echo "${item#*:}" | tr ',' ' ')
  for f in $frames; do printf '%s %s out/edu18/w5/%s/%s_f%s.png\n' "$id" "$f" "$V" "$id" "$f"; done
done | node scripts/stills.mjs src/painted/edu18/w5-index.tsx --gl=angle > "out/logs/edu18-w5-$V.log" 2>&1
echo "exit $? -> out/edu18/w5/$V (log out/logs/edu18-w5-$V.log)"
tail -2 "out/logs/edu18-w5-$V.log"
