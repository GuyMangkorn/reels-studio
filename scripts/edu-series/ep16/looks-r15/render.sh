#!/bin/sh
# EDU-EP16 R1.5b look frames through one Chrome (scripts/stills.mjs): [OUT=dir] sh scripts/edu-series/ep16/looks-r15/render.sh [IDS...]   (no IDs = all labelled frames; default OUT out/ep16/r15/looks)
OUT=${OUT:-out/ep16/r15/looks}
mkdir -p "$OUT" out/logs
if [ $# -eq 0 ]; then IDS="LF16R15-SH16C-REVEAL LF16R15-SH16C LF16R15-SH16C-K LF16R15-SH16D LF16R15-SH16D-TURN LF16R15-SH16D-OFF LF16R15-SH16C-REVEAL-CLEAN LF16R15-SH16C-CLEAN LF16R15-SH16D-CLEAN"; else IDS="$*"; fi
for i in $IDS; do printf '%s 0 %s/%s.png\n' "$i" "$OUT" "$i"; done | node scripts/stills.mjs scripts/edu-series/ep16/looks-r15/index.tsx
