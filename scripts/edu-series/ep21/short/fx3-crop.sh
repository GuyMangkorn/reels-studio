#!/bin/sh
# EDU-EP21-SHORT W5.2f FX3 (Boss, 2026-11-17): B03-SH08 tyre crop at 2x the 270 px tile scale (full-res crop x 100-920, y 420-1240,
# downscaled to 410 px), side by side in the order given, 4 px gaps. Usage: fx3-crop.sh SRC_DIR OUT.png L...
set -e
src=$1; out=$2; shift 2
in=""; n=0
for L in "$@"; do in="$in -i $src/B03-SH08_l$L.png"; n=$((n + 1)); done
f=""; s=""
i=0; while [ $i -lt $n ]; do f="$f[$i:v]crop=820:820:100:420,scale=410:410,pad=414:410:0:0:gray[t$i];"; s="$s[t$i]"; i=$((i + 1)); done
ffmpeg -v error -y $in -filter_complex "${f}${s}hstack=inputs=$n" "$out"
