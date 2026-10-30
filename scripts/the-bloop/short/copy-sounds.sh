#!/usr/bin/env bash
# BLOOP-EP01-SHORT: copy the sounds this episode uses from the shared sound library (and the processed NOAA
# excerpts and generated picks) into public/audio/bloop/, and write its NOTICE. Run from the repository root:
#   bash scripts/the-bloop/short/copy-sounds.sh
# Library paths come from sound-library/INDEX.md; the NOAA source copy is the SHA-256-checked file in out/logs/sources.
set -euo pipefail
LIB="${SOUND_LIBRARY:-/Users/mangkornkatawong/Documents/ChatGPT/sound-library}"
OUT="${AUDIO_STUDIO_OUT:-/Users/mangkornkatawong/Documents/ChatGPT/audio-studio-mcp/outputs}"
DEST="public/audio/bloop"
mkdir -p "$DEST"
for id in bed_underwater-mystery-sparse_01 bed_dark-drone-sub_01 water_deep-ocean-roomtone_01 \
  ice_iceberg-crack-groan-underwater_01 quake_seafloor-rumble-muffled_01 pulse_underwater-soft-thump_01 \
  hum_low-travelling-flat_01 creature_deep-swallow-gulp_01 reveal_riser-tension_01 reveal_glass-shimmer-soft_01 \
  ui_click-tick_01 whoosh_heavy-cinematic_01; do
  rel=$(grep -m1 "^| \`$id\` " "$LIB/INDEX.md" | awk -F'`' '{print $4}')
  test -n "$rel" || { echo "no INDEX row for $id" >&2; exit 1; }
  cp "$LIB/$rel" "$DEST/$id.wav"
done
cp "$OUT/noaa-bloop-b01-clip.wav" "$DEST/noaa-bloop-b01-clip.wav"
cp "$OUT/noaa-bloop-b03-clip.wav" "$DEST/noaa-bloop-b03-clip.wav"
cp "out/logs/sources/bloop-wav-2026-10-30/bloop.wav" "$DEST/noaa-bloop-source.wav"
shasum -a 256 "$DEST/noaa-bloop-source.wav" | cut -c1-64 | grep -q '^ecc057a98dfcb0e2a35affc54e906d9a0ee8870bc9592c8fffce873bad5b374f$'
echo "copied $(ls "$DEST" | wc -l) files to $DEST"
