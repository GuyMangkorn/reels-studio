#!/bin/sh
# Scene-asset cards through one Chrome: sh scripts/edu-series/ep16/assets/render.sh [CARD-IDS...]   (no IDs = all)
mkdir -p out/ep16/assets out/logs
if [ $# -eq 0 ]; then IDS=$(node --import tsx scripts/edu-series/ep16/assets/ids.mts); else IDS="$*"; fi
for i in $IDS; do printf 'AS-%s 0 out/ep16/assets/%s.png\n' "$i" "$i"; done | node scripts/stills.mjs scripts/edu-series/ep16/assets/index.tsx
