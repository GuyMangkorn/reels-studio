#!/bin/bash
# Copy the shared-library sounds used by ZCPAINT-SHORT into public/ (sfx -> public/sfx, ambience/music -> public/audio),
# and add a NOTICE block (library ID, generator, licence, listened status) to the folder NOTICE files. Idempotent.
# Usage: bash scripts/zombie-condo-paint/copy-sounds.sh   (run from the repository root)
set -euo pipefail
LIB="${SOUND_LIBRARY:-/Users/mangkornkatawong/Documents/ChatGPT/sound-library}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

# Library IDs as <type>/<category>/<id>. Generated IDs were filed by the Editor (Stable Audio 3, not listened);
# the rest are existing library entries picked by their sidecar text and measurement (not listened).
IDS=(
  sfx/foley/foley_door-latch-hinge_01
  sfx/foley/foley_footsteps-run-slam_01
  sfx/creature/creature_neck-creak-wet_01
  sfx/impact/impact_door-slam-body_01
  sfx/foley/foley_deadbolt-clack_01
  sfx/foley/foley_bag-drop-tile_01
  sfx/foley/foley_cabinet-scrape-thud_01
  sfx/impact/impact_power-cut-whoomp_01
  sfx/water/water_tap-fill-containers_01
  sfx/foley/foley_lid-snaps-three_01
  sfx/tension/tension_clock-pulse_01
  sfx/water/water_bucket-pour-gurgle_01
  sfx/foley/foley_cistern-lid-tap_01
  sfx/foley/foley_fridge-seal-pop_01
  sfx/foley/foley_fridge-seal-thump_01
  sfx/foley/foley_packaging-rustle_01
  sfx/foley/foley_can-setdown-laminate_01
  sfx/mechanical/mechanical_canister-handling_01
  sfx/stinger/stinger_low-muted-hit_01
  sfx/impact/impact_knuckle-rap_01
  sfx/impact/impact_sub-hit-short_01
  sfx/foley/foley_fist-blow-door_01
  music/tone/tone_thin-unresolved_01
  ambience/city/city_distant-fire-crackle_01
  ambience/room/room_shop-fridge-hum_01
  ambience/nature/nature_wind-eerie-street_01
  ambience/room/room_dark-empty-building_01
  ambience/bed/bed_dark-drone-sub_01
  sfx/electric/electric_light-flicker-buzz_01
  sfx/reveal/reveal_riser-tension_01
  sfx/tension/tension_heartbeat-slow_01
  sfx/reveal/reveal_glass-shimmer-soft_01
  sfx/ui/ui_click-tick_01
)

for id in "${IDS[@]}"; do
  type="${id%%/*}"
  rest="${id#*/}"                       # category/id
  case "$type" in
    sfx) dest="$ROOT/public/sfx/$rest.wav" ;;
    *)   dest="$ROOT/public/audio/$rest.wav" ;;
  esac
  mkdir -p "$(dirname "$dest")"
  cp "$LIB/$id.wav" "$dest"
  echo "copied $id"
done

notice_block() {
  local file="$1"; local marker="ZCPAINT-SHORT (Editor, 30 Oct 2026)"
  if [ -f "$file" ] && grep -q "$marker" "$file"; then return; fi
  {
    echo ""
    echo "$marker: library copies used by scripts/zombie-condo-paint (copy-sounds.sh)."
    echo "Generator: audio-studio-mcp (MIT) / Stable Audio 3 medium, generated locally; library entries listed in the sidecars."
    echo "Licence: Stability AI Community License (generated audio; commercial-use eligibility is the user's decision, see the library NOTICE.md)."
    echo "Status: picked by measurement (scripts/zombie-condo-paint/measure-sfx.py); NOT listened to by a person."
    printf '  %s\n' "${IDS[@]}"
  } >> "$file"
}
notice_block "$ROOT/public/sfx/NOTICE"
notice_block "$ROOT/public/audio/NOTICE"
echo "done: ${#IDS[@]} files"
