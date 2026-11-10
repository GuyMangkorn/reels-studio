#!/bin/sh
# Renders EDU-EP14 W5.2 shot frames on one Chrome: sh scripts/edu-series/ep14/render-build.sh <version> SH01:48 SH07:70 ...
# Each arg is <shot number>:<shot-local frame>; the shot id is looked up from the shot table (S01-Bbb-SHnn by order). Output: out/edu14/build/<version>/<name>_<frame>.png
V=${1:-v1}; shift
IDS="S01-B01-SH01 S01-B01-SH02 S01-B01-SH03 S01-B01-SH04 S01-B01-SH05 S01-B01-SH06 S01-B01-SH07 S01-B01-SH08 S01-B01-SH09 S01-B02-SH01 S01-B02-SH02 S01-B02-SH03 S01-B03-SH01 S01-B03-SH02 S01-B03-SH03 S01-B04-SH01 S01-B04-SH02 S01-B04-SH03 S01-B05-SH01 S01-B05-SH02 S01-B05-SH03"
for a in "$@"; do
  n=${a%%:*}; f=${a##*:}
  id=$(echo $IDS | cut -d' ' -f$n)
  printf 'EDU14-%s %s out/edu14/build/%s/%02d_%s_%s.png\n' "$id" "$f" "$V" "$n" "$id" "$f"
done | node scripts/stills.mjs src/painted/edu14/build-index.ts
