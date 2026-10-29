"""char_base character presets.

Preset: {'age', 'body': body params, 'head': (head style, params), 'outfit': [(piece, opts)], 'palette': {key: (hex, roughness)},
'look': 'cel'|'clay', 'variants': {name: overrides}}. A variant overrides 'body'/'head'/'palette' per key and replaces 'outfit';
'mat_suffix' keeps its materials apart from the base variant's.
"""
import copy

_ZC_OUTFIT = lambda fold: [('tee', {'color': 'tee', 'fold': fold}), ('shorts', {'color': 'shorts', 'fold': fold * 0.35}), ('barefoot', {})]

PRESETS = {
    # ZCONDO lead (a Thai man about 28, slim): the reference body. heads_tall 7.47696 = 1.72 / 0.23004 (char_head default head height),
    # so the head is built at scale 1.0 with its centre at 1.595 m. Day 3: stubble, darker skin, darker grimy shirt (grime, never blood).
    'zc_you': {
        'age': 'adult',
        'body': dict(height=1.72, heads_tall=7.47696, sex=0.0, mass=0.3, stoop=0.0, stylize=0.0),
        'head': ('char_head', {}),
        'outfit': _ZC_OUTFIT(0.0026),
        'palette': {'tee': ('#2f5656', 0.85), 'shorts': ('#7c7f80', 0.85), 'nail': ('#cfa58a', 0.8)},
        'look': 'cel',
        'variants': {
            'day1': {},
            'day3': {'head': {'stubble': 0.55, 'skin': '#b08462'}, 'palette': {'tee': ('#27474a', 0.85)},
                     'outfit': _ZC_OUTFIT(0.0042) + [('grime', {'on': 'tee'})], 'mat_suffix': '_d3'},
        },
    },
}


def get(name):
    """Deep copy of preset `name`."""
    if name not in PRESETS:
        raise ValueError(f'char_base.presets: unknown preset {name!r} (one of {sorted(PRESETS)})')
    return copy.deepcopy(PRESETS[name])


def resolve(name, variant=None):
    """Preset with variant overrides merged; variant None = the base preset."""
    P = get(name)
    V = P.pop('variants', {})
    if variant is None:
        return P
    if variant not in V:
        raise ValueError(f'char_base.presets: {name} has no variant {variant!r} (one of {sorted(V)})')
    o = V[variant]
    P['body'].update(o.get('body', {}))
    P['head'] = (P['head'][0], dict(P['head'][1], **o.get('head', {})))
    P['palette'].update(o.get('palette', {}))
    if 'outfit' in o:
        P['outfit'] = o['outfit']
    P['mat_suffix'] = o.get('mat_suffix', '')
    P['variant'] = variant
    return P
