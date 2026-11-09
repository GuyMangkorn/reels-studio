#!/bin/sh
# EDU-EP11 spikes SP1-SP4 (Boss, 2026-11-09): render every still, then the measures. Run from the repo root.
# Stills only (render stage: n/a, no video). Output: out/edu11/spikes/, logs: out/logs/edu11-*.
set -e
S=out/edu11/spikes; E=src/painted/edu11/spike-index.ts
mkdir -p $S/seek out/logs public/edu11-spike
printf 'EDU11-SP3-FREEZE 0 %s/inset-f877.png\n' $S | node scripts/stills.mjs $E --gl=angle > out/logs/edu11-freeze.log 2>&1
cp $S/inset-f877.png public/edu11-spike/inset-f877.png   # the inset raster is a public/ file (spike artifact, not for commit)
L=""
for f in 866 869 872 875 877 878 1000 1211 1216 1221 1224 1228 1232 1236 1238 1240; do L="${L}EDU11-SP3 $f $S/sp3-f$f.png\n"; done
L="${L}EDU11-SP3-F0 0 $S/sp3-f0hud.png\nEDU11-SP1-F0 0 $S/sp1-f0.png\nEDU11-SP1-R0 0 $S/sp1-r0.png\nEDU11-SP1-R05 0 $S/sp1-r05.png\nEDU11-SP1-R1 0 $S/sp1-r1.png\n"
L="${L}EDU11-SP2-F286 0 $S/sp2-f286.png\nEDU11-SP2-F600 0 $S/sp2-f600.png\nEDU11-SP2-F790 0 $S/sp2-f790.png\nEDU11-SP2-F600-YAW 0 $S/sp2-f600-yaw.png\nEDU11-SP2-F600-CLOSE 0 $S/sp2-f600-close.png\nEDU11-SP4-CATCH 0 $S/sp4-catch.png\nEDU11-SP4-JAWS 0 $S/sp4-jaws.png\n"
printf "$L" | node scripts/stills.mjs $E --gl=angle > out/logs/edu11-stills.log 2>&1
# seek parity: f1228 alone in a fresh Chrome, and f1240 -> f1228 -> f866 -> f1000 in another
printf 'EDU11-SP3 1228 %s/seek/a-f1228.png\n' $S | node scripts/stills.mjs $E --gl=angle > out/logs/edu11-seek-a.log 2>&1
printf 'EDU11-SP3 1240 %s/seek/b-f1240.png\nEDU11-SP3 1228 %s/seek/b-f1228.png\nEDU11-SP3 866 %s/seek/b-f866.png\nEDU11-SP3 1000 %s/seek/b-f1000.png\n' $S $S $S $S | node scripts/stills.mjs $E --gl=angle > out/logs/edu11-seek-b.log 2>&1
node --import tsx scripts/edu-series/ep11/spikes/measure-anchors.ts > out/logs/edu11-anchors.json
python3 -I scripts/edu-series/ep11/spikes/measure-pixels.py $S > out/logs/edu11-pixels.json
python3 -I scripts/caption-zone.py --band 1176:1344 $S/sp1-f0.png $S/sp1-r1.png $S/sp2-f286.png $S/sp2-f790.png $S/sp3-f1228.png $S/sp3-f1236.png $S/sp4-catch.png $S/sp4-jaws.png > out/logs/edu11-capzone.json
scripts/qa-sheet.sh $S/sheet-sp1.png --cols 4 --width 400 $S/sp1-f0.png $S/sp1-r0.png $S/sp1-r05.png $S/sp1-r1.png
scripts/qa-sheet.sh $S/sheet-sp2.png --cols 5 --width 400 $S/sp2-f286.png $S/sp2-f600.png $S/sp2-f790.png $S/sp2-f600-yaw.png $S/sp2-f600-close.png
scripts/qa-sheet.sh $S/sheet-sp3.png --cols 6 --width 220 $S/sp3-f866.png $S/sp3-f872.png $S/sp3-f877.png $S/sp3-f878.png $S/sp3-f1211.png $S/sp3-f1216.png $S/sp3-f1221.png $S/sp3-f1224.png $S/sp3-f1228.png $S/sp3-f1232.png $S/sp3-f1236.png $S/sp3-f1240.png
scripts/qa-sheet.sh $S/sheet-sp4.png --cols 2 --width 540 $S/sp4-catch.png $S/sp4-jaws.png
