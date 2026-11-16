#!/bin/sh
# EDU-EP18 creature comp cards through one Chrome: sh scripts/edu-series/ep18/creature-kit/render.sh <version> [GROUP|CARD-IDS...]
#   no IDs = every card; a group key (HIPPO, SNAKE, MOSQUITO, HEN, DOG, LINEUP) = its cards. Output out/ep18/kit/<version>/<ID>.png, log out/logs/ep18-kit-<version>.log
V=${1:-v1}; shift
mkdir -p out/ep18/kit/$V out/logs
if [ $# -eq 0 ]; then IDS=$(node --import tsx scripts/edu-series/ep18/creature-kit/ids.mts)
elif [ $# -eq 1 ] && ! echo "$1" | grep -q -- '-'; then IDS=$(node --import tsx scripts/edu-series/ep18/creature-kit/ids.mts "$1")
else IDS="$*"; fi
for i in $IDS; do printf 'KIT-EP18-%s 0 out/ep18/kit/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs scripts/edu-series/ep18/creature-kit/index.tsx > out/logs/ep18-kit-$V.log 2>&1
echo "exit $? · $(echo $IDS | wc -w) cards -> out/ep18/kit/$V (log out/logs/ep18-kit-$V.log)"
