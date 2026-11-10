#!/bin/sh
# Lock the EP14 sounds once src/videos/edu-ep14 exists (Boss). Run from the repo root.
set -e
python3 -I scripts/store.py use library/sound/music/bed/bed_kalimba-rain-explainer_02.wav public/audio/bed/bed_kalimba-rain-explainer_02.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/ambience/city/city_wet-road-rain-bus_01.wav public/audio/city/city_wet-road-rain-bus_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/comedy/comedy_kalimba-nope_01.wav public/sfx/comedy/comedy_kalimba-nope_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/foley/foley_cotton-sleeve-rustle_01.wav public/sfx/foley/foley_cotton-sleeve-rustle_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/foley/foley_water-balloon-squash_01.wav public/sfx/foley/foley_water-balloon-squash_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/foley/foley_water-balloon-wobble_01.wav public/sfx/foley/foley_water-balloon-wobble_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/foley/foley_water-drop-skin-sting_01.wav public/sfx/foley/foley_water-drop-skin-sting_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/foley/foley_wet-film-creak-rise_01.wav public/sfx/foley/foley_wet-film-creak-rise_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/impact/impact_bb-pellet-tick_01.wav public/sfx/impact/impact_bb-pellet-tick_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/reveal/reveal_glass-pluck-ring_01.wav public/sfx/reveal/reveal_glass-pluck-ring_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/reveal/reveal_rewind-whirr_01.wav public/sfx/reveal/reveal_rewind-whirr_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/music/stinger/stinger_kalimba-drops-tag_01.wav public/audio/stinger/stinger_kalimba-drops-tag_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/stinger/stinger_pizz-tag-ending_01.wav public/sfx/stinger/stinger_pizz-tag-ending_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/stinger/stinger_pizz-shrug_01.wav public/sfx/stinger/stinger_pizz-shrug_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/ambience/tension/tension_airless-glass-drone_01.wav public/audio/tension/tension_airless-glass-drone_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/tension/tension_dark-riser-sub-pulse_01.wav public/sfx/tension/tension_dark-riser-sub-pulse_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/ui/ui_click-tick_01.wav public/sfx/ui/ui_click-tick_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/ui/ui_pop_01.wav public/sfx/ui/ui_pop_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/vehicle/vehicle_bike-pass-rain_01.wav public/sfx/vehicle/vehicle_bike-pass-rain_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/water/water_drop-plip-puddle_01.wav public/sfx/water/water_drop-plip-puddle_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/water/water_film-burst-scatter_01.wav public/sfx/water/water_film-burst-scatter_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/water/water_palm-raindrop-pats_01.wav public/sfx/water/water_palm-raindrop-pats_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/ambience/weather/weather_tin-roof-rain-shelter_01.wav public/audio/weather/weather_tin-roof-rain-shelter_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/sfx/whoosh/whoosh_parachute-ease-out_01.wav public/sfx/whoosh/whoosh_parachute-ease-out_01.wav --episode edu-ep14
python3 -I scripts/store.py use library/sound/ambience/whoosh/whoosh_shaft-fall-air-rush_01.wav public/audio/whoosh/whoosh_shaft-fall-air-rush_01.wav --episode edu-ep14
