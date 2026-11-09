"""Check that a deliverable's timeline plays the sounds its sound cue sheet names (docs/sound-generation-workflow.md#sound-cue-sheet).

Usage: python3 -I scripts/sound-cues.py scripts/<episode>/sound-cues.json
Reads the cue sheet Ton writes from Film's Sound lines and every quoted sound path (narration excluded) in the sheet's
`sources` (files or folders; default its `video` folder; .ts/.tsx/.json/.py/.mjs/.js, assets.lock.json excluded), so a
mix script that bakes a stem is checked too. Fails when a cue is still NEEDS-GEN or lacks its brief, when a
library pick has no `fit` note, when a briefed sound is missing from the timeline, when the timeline plays a sound no cue,
swap or exemption names, or when a swap has no reason or no approval from Film or the user. A file whose name adds a
suffix to a cue ID (`<id>_lp400.wav`) counts as that cue; an exemption matches by file name.
"""
import glob, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO = re.compile(r"""['"`]([^'"`\s]+\.(?:wav|mp3|m4a|ogg|flac))['"`]""")
CODE = {'.ts', '.tsx', '.json', '.py', '.mjs', '.js'}
ORIGINS = {'generated', 'library'}
APPROVERS = {'film', 'user'}


def used_sounds(sources):
    found = set()
    for source in sources:
        root = os.path.join(ROOT, source)
        paths = glob.glob(os.path.join(root, '**', '*'), recursive=True) if os.path.isdir(root) else [root]
        for path in paths:
            if os.path.splitext(path)[1] in CODE and os.path.basename(path) != 'assets.lock.json':
                with open(path, encoding='utf-8') as f: found.update(AUDIO.findall(f.read()))
    return {src for src in found if 'narration/' not in src}


def matches(src, sound_id):
    stem = os.path.splitext(os.path.basename(src))[0]
    return stem == sound_id or stem.startswith(sound_id + '_')


def check(sheet):
    problems = []
    cues = sheet.get('cues', [])
    swaps = {s.get('cue'): s for s in sheet.get('swaps', [])}
    exempt = {e.get('src'): e for e in sheet.get('exempt', [])}
    names = {c.get('cue') for c in cues}
    for name, swap in swaps.items():
        if name not in names: problems.append(f'swap {name}: no cue with that name')
        if not swap.get('to'): problems.append(f'swap {name}: no `to` sound ID')
        if not swap.get('reason'): problems.append(f'swap {name}: no reason')
        if str(swap.get('approvedBy', '')).lower() not in APPROVERS: problems.append(f'swap {name}: approvedBy must be film or user')
    for src, item in exempt.items():
        if not item.get('reason'): problems.append(f'exempt {src}: no reason')
    expected = {}
    for c in cues:
        name = c.get('cue') or '?'
        sound_id = (swaps.get(name) or {}).get('to') or c.get('id')
        if not c.get('brief'): problems.append(f'cue {name}: no brief (Film\'s description of the sound)')
        if not sound_id or sound_id == 'NEEDS-GEN': problems.append(f'cue {name}: still NEEDS-GEN'); continue
        if c.get('origin') not in ORIGINS: problems.append(f'cue {name}: origin must be generated or library')
        if c.get('origin') == 'library' and not c.get('fit'): problems.append(f'cue {name}: library pick without a fit note')
        expected[name] = sound_id
    used = used_sounds(sheet.get('sources') or [sheet['video']])
    for name, sound_id in expected.items():
        if not any(matches(src, sound_id) for src in used): problems.append(f'cue {name}: {sound_id} is not in the timeline')
    for src in sorted(used):
        if os.path.basename(src) not in {os.path.basename(e) for e in exempt} and not any(matches(src, s) for s in expected.values()):
            problems.append(f'timeline plays {src}, which no cue, swap or exemption names')
    return problems


def main():
    if len(sys.argv) != 2: sys.exit(__doc__)
    with open(sys.argv[1], encoding='utf-8') as f: sheet = json.load(f)
    problems = check(sheet)
    cues = sheet.get('cues', [])
    generated = sum(c.get('origin') == 'generated' for c in cues)
    print(f'{len(cues)} cues: {generated} generated, {len(cues) - generated} from the library, {len(sheet.get("swaps", []))} swaps')
    for p in problems: print('FAIL', p)
    sys.exit(1 if problems else 0)


if __name__ == '__main__':
    main()
