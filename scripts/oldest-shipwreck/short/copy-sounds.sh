#!/bin/sh
# Copy the SHIPWRECK-SHORT sounds from the shared sound library into public/ (TL02, episode-only).
# Usage: sh scripts/oldest-shipwreck/short/copy-sounds.sh [LIBRARY_DIR]
# Inputs: library IDs below. Outputs: public/audio/<category>/<id>.wav (beds), public/sfx/<category>/<id>.wav (one-shots).
# The NOTICE files beside them are committed; the WAVs are local copies (reproducible from the library).
set -e
lib=${1:-${REELS_STORE:-$HOME/ReelsStore}/library/sound}
cd "$(dirname "$0")/../../.."
copy() { mkdir -p "public/$2"; cp "$lib/$1.wav" "public/$2/$(basename "$1").wav"; }
copy music/bed/bed_underwater-mystery-sparse_01 audio/bed
copy ambience/water/water_underwater-shallow-ambience_01 audio/water
copy ambience/weather/weather_sea-storm-wind-waves_01 audio/weather
copy ambience/weather/weather_rain-thunder-distant_01 audio/weather
copy sfx/water/water_diver-regulator-bubbles_01 sfx/water
copy sfx/weather/weather_thunder-roll-distant_01 sfx/weather
copy sfx/ui/ui_click-tick_01 sfx/ui
copy sfx/reveal/reveal_riser-tension_01 sfx/reveal
copy sfx/impact/impact_cinematic-boom_01 sfx/impact
copy music/stinger/stinger_outro-resolve_01 sfx/stinger
echo "copied 10 sounds from $lib"
