#!/bin/sh
# EDU-EP11 look frames LF01-LF05 (Boss, 2026-11-09): render every still, then the measures and the sheets. Run from the repo root.
# Render stage: stills only. Needs public/edu11-spike/inset-f877.png (LF03/LF04 inset stand-in): regenerate it with run-spikes.sh (SP3-FREEZE) first.
set -e
D=out/edu11/lf; E=src/painted/edu11/lf-index.ts
mkdir -p $D out/logs
L=""
for id in LF01 LF01b LF01b-f219 LF01b-f221 LF02 LF03 LF03-noinset LF03-brief-layout LF04 LF05-jaws LF05-catch LF05-catch-f1042 LF05-catch-f1045; do L="${L}EDU11-$id 0 $D/$id.png\n"; done
printf "$L" | node scripts/stills.mjs $E --gl=angle > out/logs/edu11-lf-stills.log 2>&1
node --import tsx scripts/edu-series/ep11/spikes/measure-lf.ts > out/logs/edu11-lf-anchors.json
python3 -I scripts/caption-zone.py --band 1176:1344 $D/LF01.png $D/LF01b.png $D/LF02.png $D/LF03.png $D/LF04.png $D/LF05-jaws.png $D/LF05-catch.png > out/logs/edu11-lf-capzone.json
scripts/qa-sheet.sh $D/sheet-lf.png --cols 4 --width 270 $D/LF01.png $D/LF01b.png $D/LF02.png $D/LF03.png $D/LF04.png $D/LF05-jaws.png $D/LF05-catch.png
scripts/qa-sheet.sh $D/sheet-lf05.png --cols 2 --width 540 $D/LF05-jaws.png $D/LF05-catch.png
