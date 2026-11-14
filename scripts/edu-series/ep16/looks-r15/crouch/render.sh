#!/bin/sh
# Crouch probe stills: sh scripts/edu-series/ep16/looks-r15/crouch/render.sh [OUTDIR] IDS...
OUT=${OUT:-out/ep16/r15/crouch}; mkdir -p $OUT out/logs
for i in "$@"; do printf '%s 0 %s/%s.png\n' "$i" "$OUT" "$i"; done | node scripts/stills.mjs scripts/edu-series/ep16/looks-r15/crouch/index.tsx
