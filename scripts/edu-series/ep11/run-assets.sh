#!/bin/sh
# EDU-EP11 W5.2 proof stills (Boss, 2026-11-09): the inset raster first (public/edu11/inset-g977.png, a cache file filed with store.py), then the
# reference assembly at the listed composition frames. Render stage: stills only. Run from the repo root; frames: FRAMES="0 54 ..." sh run-assets.sh
set -e
D=out/edu11/w52; E=src/painted/edu11/assets-index.ts
mkdir -p $D out/logs public/edu11
printf 'EDU11-INSET-SRC 0 %s/inset-g977.png\n' $D | node scripts/stills.mjs $E --gl=angle > out/logs/edu11-w52-inset.log 2>&1
cp $D/inset-g977.png public/edu11/inset-g977.png
FRAMES=${FRAMES:-"0 54 100 140 220 280 445 500 580 640 685 725 800 840 880 950 977 1078 1095 1103 1155 1190 1282 1320 1330 1336 1341 1400 1430 1475 1505 1530 1560 1700 1760"}
L=""
for f in $FRAMES; do L="${L}EDU11-REF $f $D/g$f.png\n"; done
printf "$L" | node scripts/stills.mjs $E --gl=angle > out/logs/edu11-w52-stills.log 2>&1
echo done
