#!/bin/sh
# Agent-view sheet: downscale frames and tile them into one PNG, so an agent reads one small image instead of many full-size frames.
# Usage: scripts/qa-sheet.sh OUT.png [--cols N] [--width PX] FRAME.png...   (defaults: 4 columns, 270 px per 9:16 tile; one frame = plain downscale)
# Not a replacement for Boss's labelled review contact sheets (docs/boss-asset-workflow.md#visual-and-runtime-qa-before-push).
set -e
out=$1; shift
cols=4; width=270
while [ $# -gt 0 ]; do
  case $1 in
    --cols) cols=$2; shift 2 ;;
    --width) width=$2; shift 2 ;;
    *) break ;;
  esac
done
[ $# -gt 0 ] || { echo "usage: $0 OUT.png [--cols N] [--width PX] FRAME.png..." >&2; exit 2; }
n=$#
[ "$n" -lt "$cols" ] && cols=$n
rows=$(( (n + cols - 1) / cols ))
height=$(( width * 16 / 9 / 2 * 2 ))
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT
i=0
for f in "$@"; do
  i=$((i + 1))
  ffmpeg -v error -y -i "$f" -vf "scale=$width:$height:force_original_aspect_ratio=decrease,pad=$width:$height:(ow-iw)/2:(oh-ih)/2:color=gray,format=rgb24" "$tmp/$(printf %04d $i).png"
done
mkdir -p "$(dirname "$out")"
if [ "$n" -eq 1 ]; then
  ffmpeg -v error -y -i "$1" -vf "scale=$width:-2" -frames:v 1 -update 1 "$out"
else
  ffmpeg -v error -y -framerate 1 -i "$tmp/%04d.png" -vf "tile=${cols}x${rows}:padding=4:color=gray" -frames:v 1 -update 1 "$out"
fi
echo "$out: $n frames, ${cols}x${rows} tiles, ${width}px wide"
