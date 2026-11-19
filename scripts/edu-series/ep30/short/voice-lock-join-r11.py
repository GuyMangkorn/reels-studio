"""EDU-EP30-VOICE-R1.1 join fix (O1): move the 0.2 s gap between L17 and L18 to after "แปด" so the year "1908" is spoken unbroken.
Line files untouched; edits only the assembled preview. Input: preview-R1.wav + timing-R1.json (the output of voice-lock-build.py, kept as a copy).
Run from the checkout root: python3 -I scripts/edu-series/ep30/short/voice-lock-join-r11.py   -> out/ep30-voice/{preview.wav,timing.json}"""
import json, wave
D = 'out/ep30-voice/'; GAP = 0.2; CUT_IN_L18 = 0.775  # file offset of the middle of L18's 0.65-0.90 s pause after "แปด"
t = json.load(open(D + 'timing-R1.json')); L = {r['line']: r for r in t['lines']}
w = wave.open(D + 'preview-R1.wav'); sr = w.getframerate(); p = w.getparams(); raw = w.readframes(w.getnframes()); b = p.sampwidth * p.nchannels
at = lambda s: int(round(s * sr)) * b
# the hole is the exact-zero run (apad) around the rounded L17 end; find its real sample bounds
l17_end = at(L['L17']['end']) - at(0.01)
while any(raw[l17_end:l17_end + at(0.19)]): l17_end += b
l18_start = l17_end + at(GAP); cut = l18_start + at(CUT_IN_L18)
hole = raw[l17_end:l18_start]
assert not any(hole), 'L17/L18 hole is not silent'
out = raw[:l17_end] + raw[l18_start:cut] + bytes(len(hole)) + raw[cut:]
assert len(out) == len(raw)
o = wave.open(D + 'preview.wav', 'wb'); o.setparams(p); o.writeframes(out); o.close()
t['join_fix'] = {'rev': 'R1.1', 'moved_gap_s': GAP, 'from': L['L17']['end'], 'to': round(L['L18']['start'] + CUT_IN_L18, 3)}
L18 = L['L18']; L18['start'] = round(L['L17']['end'], 2); L18['gap_after_year'] = [round(L['L17']['end'] + CUT_IN_L18, 3), round(L['L17']['end'] + CUT_IN_L18 + GAP, 3)]
json.dump(t, open(D + 'timing.json', 'w'), indent=1)
print('ok', len(raw) / b / sr, len(out) / b / sr)
