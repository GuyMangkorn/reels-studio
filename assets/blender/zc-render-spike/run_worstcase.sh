#!/bin/sh
# ZCONDO worst-case render-speed check: B08 worst (Eevee tile 8/4/2 vs Cycles) and character-heavy corridor (Eevee vs Cycles).
# Retries once on failure (headless Cycles Metal flake, DF-20261028-blender-cycles-water-spike).
cd "$(dirname "$0")/../../.."
B=/Applications/Blender.app/Contents/MacOS/Blender
run() { "$B" -b --python assets/blender/zc-render-spike/worstcase.py -- "$@" 2>&1 | grep -E "zc-worst|Traceback|Error:" | grep -v "Not freed"; }
for p in eevee64t8 eevee64t4 eevee64t2 cycles40dn; do run b08worst $p 0,36,70,104 || run b08worst $p 0,36,70,104; done
for c in charots charclose; do
  for p in eevee64 cycles40dn; do run $c $p 1,50,100,150 || run $c $p 1,50,100,150; done
done
echo DONE
