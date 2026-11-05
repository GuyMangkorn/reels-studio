#!/bin/sh
# Render draft stills for "SHOT:f1,f2,.." args, then a 270 px sheet: ds.sh SHEET.png B02-SH01:0,12,26 B02-SH02:0,6
out=$1; shift; files=""
for a in "$@"; do s=${a%%:*}; f=${a#*:}; python3 -I scripts/zombie-condo2/draft-stills.py --frames "$f" "$s" >/dev/null; for x in $(echo $f | tr , ' '); do files="$files out/zc2d/$s-$x.png"; done; done
scripts/qa-sheet.sh "$out" --cols ${COLS:-6} $files
