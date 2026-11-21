#!/bin/zsh
# EDU-EP32 W4 generation. Run: zsh -ic 'zsh scripts/edu-series/ep32/short/voice-w4-gen.sh cand|narr'
# Fixed bound: cand = 6 calls (3 voices x L04, L07); narr = 1 call (one Kore read). Stops on first failure, no retry. Takes cache in $REELS_STORE/cache/tts.
set -e
PY=/Users/mangkornkatawong/Developer/reels-creator/out/gemini-venv/bin/python; O=out/ep32-voice; mkdir -p $O/cand
g() { [ -f $1 ] || $PY -I scripts/gemini-tts.py say --voice $2 --style "$3" --text "$4" $1; }
if [ "$1" = cand ]; then
  S4='confident smug 1960s spy-movie field agent, clipped and quick, sure of himself'
  S7='clipped radio report from the field, confidence cracking into flat tired defeat on the last words, speaking quickly'
  for v in Algenib Orus Charon; do
    g $O/cand/AGENT_${v}_L04.wav $v "$S4" 'ไม่มีใครระแวงแมวหรอก'
    g $O/cand/AGENT_${v}_L07.wav $v "$S7" 'เป้าหมายอยู่ซ้าย, ซ้าย, มันไปนอนตากแดดแล้วครับ'
  done
else
  g $O/narr_raw.wav Kore 'warm, friendly, smiling storyteller, speaking rapidly' "$(cat $O/narr.txt)"
fi
