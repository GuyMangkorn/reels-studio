"""BLOOP-EP01-SHORT: plan the narration slots and the est→composition phrase map from the Niwat measurement (Editor, O-1).

Input: scripts/the-bloop/short/tts-measure.json (tts-measure.py). Outputs:
- narration-timeline.json: one narration.py slot per beat (`npm run narration -- --timeline ... --name BLOOP-EP01-SHORT`).
  Slot = lead (B01 only, VO ≈0.3 s in) + head 0.12 s + measured speech + margin + tail (0.2 s; B09 0.67 s pause).
- timing.json: knots (Mark's estimated G → composition frame) for every phrase onset/end, the beat starts, and the
  post-VO block (est silence/rise/rush/fade/black keep their durations after the last phrase). Composition frames are
  integers at 30 fps. The TypeScript builder maps Mark's G values through these knots piecewise-linearly, so offsets
  inside a phrase scale with the phrase length (index.md, Phrase anchors).
Run: python3 -I scripts/the-bloop/short/plan-timing.py
"""
import json, math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
HERE = ROOT / 'scripts/the-bloop/short'
FPS = 30
HEAD = 0.12          # seconds of leading room kept before the first audible sample (narration.py trimHeadSec)
MARGIN = 0.04        # slack inside each slot
TAIL = 0.20          # gap after a beat's speech (est gaps between beats are 1–8 f)
LEAD = {'B01': 0.27}  # the real clip plays first; VO ≈0.3 s in (SD05, script B01)
TAILS = {'B09': 0.67}  # the script's pause before B10 (est [1609,1629))
POST_EST_END = 1782  # est composition length (index.md: durationFrames 1782)
LAST_VO_EST_END = 1678  # B10-a1 est end (silence, rise, rush and fade follow it)

import argparse
ap = argparse.ArgumentParser(description='Plan narration slots and knots from a VO measurement (default: Edge tts-measure.json).')
ap.add_argument('--measure', default='tts-measure.json', help='file in scripts/the-bloop/short/')
ap.add_argument('--tag', default='', help='suffix for the outputs (empty: narration-timeline.json and timing.json, the Edge plan)')
args = ap.parse_args()
suffix = f'-{args.tag}' if args.tag else ''
measure = json.loads((HERE / args.measure).read_text(encoding='utf-8'))
beats = sorted(measure['beats'])
slots, t = [], 0
beat_info = {}
for b in beats:
    m = measure['beats'][b]
    lead = LEAD.get(b, 0.0)
    speech = m['speechOffRaw'] - m['speechOnRaw']
    dur = lead + HEAD + speech + MARGIN + TAILS.get(b, TAIL)
    frames = math.ceil(dur * FPS)
    slots.append({'beat': b, 'durationSec': round(frames / FPS, 4), 'leadSec': lead if lead else None,
                  'trimHeadSec': HEAD, 'subtitle': m['vo']})
    beat_info[b] = {'start': t, 'lead': lead, 'speechOn': m['speechOnRaw']}
    t += frames
for s in slots:
    if s['leadSec'] is None:
        del s['leadSec']
(HERE / f'narration-timeline{suffix}.json').write_text(json.dumps(slots, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')

def comp_sec(beat, raw):
    """Composition seconds of a clip time: slot start + lead + head + (raw - audible onset)."""
    info = beat_info[beat]
    return info['start'] / FPS + info['lead'] + HEAD + (raw - info['speechOn'])

knots = []
for a in measure['anchors']:
    on = round(comp_sec(a['beat'], a['onRaw']) * FPS)
    end = round(comp_sec(a['beat'], a['endRaw']) * FPS)
    knots.append({'id': a['id'], 'beat': a['beat'], 'estOn': a['estOn'], 'estEnd': a['estEnd'], 'compOn': on, 'compEnd': end})
# first knot at zero keeps the real clip (starts at composition frame 0) fixed
for k in knots:
    if k['compEnd'] <= k['compOn']:
        raise SystemExit(f"{k['id']}: empty phrase after rounding")
order_ok = all(knots[i]['estOn'] <= knots[i + 1]['estOn'] and knots[i]['compOn'] <= knots[i + 1]['compOn'] for i in range(len(knots) - 1))
if not order_ok:
    raise SystemExit('knots are not monotonic')
last_end = knots[-1]
shift = last_end['compEnd'] - LAST_VO_EST_END
beat_starts = []
for b in beats:
    first = next(k for k in knots if k['beat'] == b)
    beat_starts.append({'beat': b, 'estStart': first['estOn'] if b != 'B01' else 0, 'compStart': round(beat_info[b]['start'] / FPS * FPS)})
total = POST_EST_END + shift
out = {'fps': FPS, 'head': HEAD, 'tail': TAIL, 'lead': LEAD, 'tails': TAILS, 'knots': knots,
       'beatStarts': beat_starts, 'lastVoEstEnd': LAST_VO_EST_END, 'postShift': shift,
       'compDurationFrames': total, 'estDurationFrames': POST_EST_END,
       'narrationFrames': t}
(HERE / f'timing{suffix}.json').write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print('beat  est-start  comp-start  (frames)')
for b in beat_starts:
    print(b['beat'], b['estStart'], b['compStart'])
print('narration frames', t, 'post shift', shift, 'composition frames', total, '(est 1782; window 1740-1800)')
