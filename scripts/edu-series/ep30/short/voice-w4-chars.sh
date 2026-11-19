#!/bin/zsh
# EDU-EP30 W4 character voice samples (sample stage only). Run: zsh -ic 'zsh scripts/edu-series/ep30/short/voice-w4-chars.sh <out_dir>'
# Fixed bound: 10 calls, stops on first failure (no retry). Cached takes in $REELS_STORE/cache/tts.
set -e
PY=/Users/mangkornkatawong/Developer/reels-creator/out/gemini-venv/bin/python; O=$1; mkdir -p $O
g() { [ -f $O/$1.wav ] || $PY -I scripts/gemini-tts.py say --voice $2 --style "$3" --text "$4" $O/$1.wav; }
M='ยิง!'; G='โธ่เอ๊ย, ติดตอนนี้เนี่ยนะ!'
g MEREDITH_orus_L22 Orus "crisp, firm military command, short and sharp, confident" "$M"
g MEREDITH_alnilam_L22 Alnilam "crisp, clipped officer barking one order, straight and serious" "$M"
g MEREDITH_iapetus_L22 Iapetus "clear, authoritative, heroic war-film command, straight" "$M"
g GUNNER_zubenelgenubi_L23 Zubenelgenubi "exasperated ordinary soldier, groaning in disbelief, casual" "$G"
g GUNNER_umbriel_L23 Umbriel "exasperated ordinary soldier, tired and disbelieving, easy-going" "$G"
g GUNNER_schedar_L23 Schedar "exasperated ordinary soldier, annoyed and incredulous, even" "$G"
E='unbothered, cheerful deadpan, matter-of-fact'
g EMU_puck_L19_a Puck "$E" 'สามคนเหรอ, เรามีสองหมื่นนะ'
g EMU_puck_L19_b Puck "$E" 'สามคนเหรอ... เรามีสองหมื่นนะ'
g EMU_puck_L21_a Puck "$E" 'ไว้มาใหม่นะ!'
g EMU_puck_L21_b Puck "$E, cheerful wave-off like a shopkeeper seeing off a customer" 'ไว้มาใหม่นะ!'
