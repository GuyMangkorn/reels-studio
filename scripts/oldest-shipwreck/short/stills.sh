#!/bin/sh
# Render SHIPWRECK-SHORT stills with --gl=angle from a prebuilt bundle (TL02, episode-only).
# Usage: sh scripts/oldest-shipwreck/short/stills.sh OUTDIR MODE FRAME...   MODE = full (captions, chrome) | bare (plates only)
# Bundle first: npx remotion bundle src/index.ts --out-dir=out/bundle-shipwreck . Logs: out/logs/stills-<MODE>.log
set -e
out=$1; mode=$2; shift 2
cd "$(dirname "$0")/../../.."
mkdir -p "$out" out/logs
if [ "$mode" = bare ]; then
  props='{"narration":null,"audio":[],"captionStyle":{"preset":"none"},"chrome":{"channelLabel":false,"progressBar":false}}'
else
  props='{"narration":null,"audio":[]}'
fi
for f in "$@"; do echo "SHIPWRECK-SHORT $f $out/f$(printf %04d "$f").png"; done |
  node scripts/stills.mjs out/bundle-shipwreck --props="$props" >> "out/logs/stills-$mode.log" 2>&1
echo "rendered $# $mode stills to $out"
