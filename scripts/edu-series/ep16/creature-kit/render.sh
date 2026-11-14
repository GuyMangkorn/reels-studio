#!/bin/sh
# Creature kit comp cards through one Chrome: sh scripts/edu-series/ep16/creature-kit/render.sh <version> [CREATURE|CARD-IDS...]
#   no IDs = every card of every creature; a creature key (LONGNECK, ANKYLO, DRAGONFLY, TREX) = its cards. Output out/ep16/kit/<version>/<ID>.png
V=${1:-v1}; shift
mkdir -p out/ep16/kit/$V out/logs
if [ $# -eq 0 ]; then IDS=$(node --import tsx scripts/edu-series/ep16/creature-kit/ids.mts)
elif [ $# -eq 1 ] && ! echo "$1" | grep -q -- '-'; then IDS=$(node --import tsx scripts/edu-series/ep16/creature-kit/ids.mts "$1")
else IDS="$*"; fi
for i in $IDS; do printf 'KIT-%s 0 out/ep16/kit/%s/%s.png\n' "$i" "$V" "$i"; done | node scripts/stills.mjs scripts/edu-series/ep16/creature-kit/index.tsx
