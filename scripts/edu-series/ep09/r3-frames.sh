#!/bin/sh
# R3 frame check: $1 = out dir name (under out/edu09/r3/); renders the nine QA frames, the sheets and two crops.
set -e
d=out/edu09/r3/$1; mkdir -p $d
F=233,310,330,395,511,621,170,650,1450
node scripts/render.mjs EDU-EP09-SHORT --stills --frames=$F --timeout=180000 > out/logs/r3-$1.log 2>&1
for f in 233 310 330 395 511 621 170 650 1450; do cp out/EDU-EP09-SHORT/stills/$f.png $d/$f.png; done
scripts/qa-sheet.sh out/edu09/r3/$1-sheet.png --cols 6 $(for f in 233 310 330 395 511 621; do echo $d/$f.png; done)
scripts/qa-sheet.sh out/edu09/r3/$1-reg.png --cols 3 $(for f in 170 650 1450; do echo $d/$f.png; done)
ffmpeg -v error -y -i $d/233.png -vf "crop=900:700:100:300" $d/c233.png
ffmpeg -v error -y -i $d/621.png -vf "crop=700:600:380:400" $d/c621.png
