#!/bin/sh
# ZCONDO render-speed spike: same frames, all presets, both scenes. Retries once (headless Cycles Metal flake, DF-20261028-blender-cycles-water-spike).
cd "$(dirname "$0")/../../.."
B=/Applications/Blender.app/Contents/MacOS/Blender
for scene in corridor balcony; do
  for preset in eevee64 eevee32 cycles40dn; do
    "$B" -b --python assets/blender/zc-render-spike/build.py -- $scene $preset 0,36,104 2>&1 | grep -E "zc-spike|Error|Traceback" \
      || "$B" -b --python assets/blender/zc-render-spike/build.py -- $scene $preset 0,36,104 2>&1 | grep -E "zc-spike|Error|Traceback"
  done
done
