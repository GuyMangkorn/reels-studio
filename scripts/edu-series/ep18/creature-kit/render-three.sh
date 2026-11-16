#!/bin/sh
# EDU-EP18 three.js hippo spike cards through one Chrome (WebGL via --gl=angle): sh scripts/edu-series/ep18/creature-kit/render-three.sh <version> [IDS...]
#   IDS default HEAD READ TURN STATES LINEUP. Output out/ep18/kit/<version>/HIPPO3D-<ID>.png, log out/logs/ep18-kit-<version>.log
V=${1:-v7-three}; shift
IDS=${*:-HEAD READ TURN STATES LINEUP}
mkdir -p out/ep18/kit/$V out/logs
for i in $IDS; do printf 'KIT-EP18-HIPPO3D-%s 0 out/ep18/kit/%s/HIPPO3D-%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs scripts/edu-series/ep18/creature-kit/index-three.tsx --gl=angle > out/logs/ep18-kit-$V.log 2>&1
echo "exit $? · $(echo $IDS | wc -w) cards -> out/ep18/kit/$V (log out/logs/ep18-kit-$V.log)"
