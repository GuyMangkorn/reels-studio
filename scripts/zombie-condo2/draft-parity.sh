#!/bin/sh
# W5.2 seek parity: render frame F of ZC2D-<shot> alone (own Chrome) and inside a contiguous range (one run), then PSNR of the two PNGs (>= 60 dB accepted: render jitter, not frame order).
# Usage: draft-parity.sh SHOT FRAME [...]   e.g. draft-parity.sh B02-SH04 30 60
shot=$1; shift; mkdir -p out/zc2d/parity
for f in "$@"; do
  printf "ZC2D-$shot $f out/zc2d/parity/$shot-$f-alone.png\n" | node scripts/stills.mjs src/painted/zc2kit/draft-index.ts >/dev/null
  list=""; for k in $(seq $((f-3)) $((f+3))); do [ $k -ge 0 ] && list="$list
ZC2D-$shot $k out/zc2d/parity/$shot-$k-range.png"; done
  printf "$list\n" | node scripts/stills.mjs src/painted/zc2kit/draft-index.ts >/dev/null
  echo "$shot f$f $(ffmpeg -i out/zc2d/parity/$shot-$f-alone.png -i out/zc2d/parity/$shot-$f-range.png -lavfi psnr -f null - 2>&1 | grep -o 'average:[^ ]*')"
done
