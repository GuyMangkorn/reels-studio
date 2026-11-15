#!/usr/bin/env python3
"""EDU-EP17-SHORT cue re-placement v1 -> v2 (Editor, W5.3 redraft, 2026-11-15; SHEETS-R1.2 "Cue re-placement"). Reads the 71-row table of scene-sheets.md, checks it against the stated rule
(v2 shot start + frameLocal with the sync rows) and rewrites scripts/edu-series/ep17/sound-cues.json in place (totalFrames 1709, sceneSheets R1.2, frame/frameLocal/endFrame, levels.checks seconds via
the piecewise-linear cut map). Special cases (S9, S10, S12, END1) set after. Idempotent: refuses to run on a sheet already at 1709. Run: python3 -I scripts/edu-series/ep17/cue-remap.py"""
import json, re
P = 'scripts/edu-series/ep17/sound-cues.json'
d = json.load(open(P))
assert d['totalFrames'] == 1829, 'already remapped'
md = open('scripts/edu-series/ep17/scene-sheets.md').read()
retime = md.split('<a id="r12-retime"></a>')[1].split('The shot clock')[0]
V1, V2, LEN2 = {}, {}, {}
for m in re.finditer(r'^\| (B0\d-SH0\d) \| (\d+)–(\d+) \((\d+)\) \| (\d+)–(\d+) \((\d+)\)', retime, re.M):
    s = m.group(1); V1[s] = (int(m.group(2)), int(m.group(3))); V2[s] = (int(m.group(5)), int(m.group(6)))
assert len(V1) == 25
table = md.split('The table applies the rule (Film, computed from sound-cues.json at its W5.3 state):')[1].split('## Caption plan')[0]
ROWS = {}
for m in re.finditer(r'^\| (\S+) \| (B0\d-SH0\d) \| (\d+) \(L(\d+)\) \| (\d+) \(L(\d+)\) \| (?:(\d+) → (\d+)|—) \|', table, re.M):
    ROWS[m.group(1)] = dict(shot=m.group(2), v1=int(m.group(3)), l1=int(m.group(4)), v2=int(m.group(5)), l2=int(m.group(6)), e1=m.group(7) and int(m.group(7)), e2=m.group(8) and int(m.group(8)))
assert len(ROWS) == 71, len(ROWS)
cuts1 = sorted({v[0] for v in V1.values()} | {1829}); cuts2 = sorted({v[0] for v in V2.values()} | {1709})
def g(x):  # piecewise-linear v1 G -> v2 G between cuts
    for a, b, c, e in zip(cuts1, cuts1[1:], cuts2, cuts2[1:]):
        if a <= x <= b: return c + (x - a) * (e - c) / (b - a)
bad = []
for c in d['cues']:
    r = ROWS[c['cue']]; assert r['shot'] == c['shot'] and r['v1'] == c['frame'], c['cue']
    assert r['v2'] == V2[c['shot']][0] + r['l2'], c['cue']
    c['frame'], c['frameLocal'] = r['v2'], r['l2']
    if 'endFrame' in c:
        assert r['e1'] == c['endFrame'], (c['cue'], r['e1'], c['endFrame'])
        c['endFrame'] = r['e2']
    else: assert r['e1'] is None, c['cue']
SPECIAL = {  # sheet notes: stop/fade rules for cues whose v1 file would run past a v2 cut or an event (Ton's files are not edited; Editor trims in the mix)
    'S10-motorway': dict(endFrame=541, fadeOutFrames=3),   # SD30: stop at G541, 75 f file from G468 would run 2 f past the cut
    'S12-riser': dict(endFrame=830, fadeOutFrames=6),      # SD32: fade out G824-830 so it peaks on the L97 arrival
    'S9-heli': dict(endFrame=446, fadeOutFrames=6),        # fade out by L66 (G446), the page-turn
}
for c in d['cues']:
    c.update(SPECIAL.get(c['cue'], {}))
    for key in ('brief', 'level'):
        if key in c: c[key] = re.sub(r'\bG(\d{3,4})(?:-(\d{3,4}))?\b', lambda m: 'G%d' % round(g(int(m.group(1)))) + ('-%d' % round(g(int(m.group(2)))) if m.group(2) else ''), c[key])
    if c['cue'] == 'S14-drag': c['brief'] = c['brief'].replace('L113', 'L103')
d['totalFrames'] = 1709; d['sceneSheets'] = 'EDU-EP17-SHEETS-R1.2'
for k in d['levels']['checks']:
    for key in ('fromSec', 'toSec'): k[key] = round(g(k[key] * 30) / 30, 2)
FIX = {'S2 chime': (0, 10), 'S16': (1045, 1076)}   # accent windows follow their cue, not the piecewise cut map (S2 is <= 10 f at G0; S16 starts on its cue G1045)
for k in d['levels']['checks']:
    if k.get('note') in FIX: k['fromSec'], k['toSec'] = (round(x / 30, 2) for x in FIX[k['note']])
first = d['levels']['checks'][:2]   # B01 speech windows start on the L01 onset (segment A shift 0.0 f), not at the cut-map value
for k in first: assert k['beat'] == 'B01' and round(k['fromSec'] * 30) == 10; k['fromSec'] = 0.4
json.dump(d, open(P, 'w'), ensure_ascii=False, indent=1); open(P, 'a').write('\n')
print('remapped', len(d['cues']), 'cues,', len(d['levels']['checks']), 'checks')
