"""char_base head registry: head style modules that conform to the face contract (docs/superpowers/specs/2026-10-29-char-base-design.md)."""
import importlib

REQUIRED = ('PARAMS', 'params', 'face_bones', 'make_materials', 'build_head', 'apply_face', 'FACE_PRESETS', 'head_metrics')
REQUIRED_PRESETS = ('neutral', 'tired', 'startle', 'fear', 'focused', 'listening', 'frozen')


def get(name):
    """Import and return the head style module `name` (e.g. 'char_head')."""
    return importlib.import_module(name)


def check(module):
    """Missing contract names of `module` (including presets as 'FACE_PRESETS.<key>'); empty list = conforms."""
    miss = [n for n in REQUIRED if not hasattr(module, n)]
    if hasattr(module, 'FACE_PRESETS'):
        miss += [f'FACE_PRESETS.{k}' for k in REQUIRED_PRESETS if k not in module.FACE_PRESETS]
    return miss
