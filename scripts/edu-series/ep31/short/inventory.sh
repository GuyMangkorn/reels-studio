#!/bin/sh
# Rewrites src/painted/shots/edu31.tsx from the shot files present in src/painted/edu31/shots/ (play order = the index table). Boss W5.2, 2026-11-21.
cd "$(dirname "$0")/../../../.." || exit 1
ids=$(node -e "import('./src/painted/edu31/shots/index.ts').then(m=>console.log(m.EDU31_SHOTS.map(r=>r.id).join(' ')))" 2>/dev/null || grep -o "id: 'B0[0-9]-SH0[0-9]'" src/painted/edu31/shots/index.ts | cut -d"'" -f2)
out=src/painted/shots/edu31.tsx
{
  echo "import type {PaintedShot} from '../shot';"
  for id in $ids; do [ -f "src/painted/edu31/shots/$id.tsx" ] && echo "import {shot as shot_$(echo $id | tr - _)} from '../edu31/shots/$id';"; done
  echo ""
  echo "// edu31 inventory (EDU-EP31-SHORT, play order, registry IDs \`EDU31-<shot id>\`). One shot, one file: list each shot file here and do nothing"
  echo "// else with it, so a fix to one shot repaints only that shot. Written by scripts/edu-series/ep31/short/inventory.sh (W5.2 batch 1: B01-B03)."
  echo "export const edu31Shots: PaintedShot[] = ["
  for id in $ids; do [ -f "src/painted/edu31/shots/$id.tsx" ] && echo "  shot_$(echo $id | tr - _),"; done
  echo "];"
} > $out
grep -c 'shot_' $out
