"""Headless test runner for char_base.

blender -b --python assets/blender/char_base/test_cb.py -- <mod>
Runs every test_* in tests/test_<mod>.py in file order, each after reset_scene().
Prints PASS/FAIL per test and `CB-TEST <mod>: N passed, M failed`; exits 1 on failure.
"""
import importlib
import os
import sys
import traceback

import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
for _p in (HERE, os.path.join(HERE, "clay_head"), os.path.join(HERE, "..", "char_head"),
           os.path.join(HERE, "..")):
    _p = os.path.normpath(_p)
    if _p not in sys.path:
        sys.path.append(_p)
_t = os.path.join(HERE, "tests")
if _t not in sys.path:
    sys.path.append(_t)


def reset_scene():
    """Factory-empty scene: no objects, no orphan datablocks."""
    try:
        if bpy.context.object and bpy.context.object.mode != "OBJECT":
            bpy.ops.object.mode_set(mode="OBJECT")
    except RuntimeError:
        pass
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.armatures, bpy.data.actions,
                 bpy.data.cameras, bpy.data.lights, bpy.data.curves, bpy.data.images):
        for d in list(coll):
            coll.remove(d)
    for c in list(bpy.data.collections):
        bpy.data.collections.remove(c)
    bpy.ops.outliner.orphans_purge(do_local_ids=True, do_linked_ids=True, do_recursive=True)


def approx(a, b, tol=1e-4):
    return abs(a - b) <= tol


def run(mod):
    m = importlib.import_module("test_" + mod)
    tests = [(n, f) for n, f in vars(m).items() if n.startswith("test_") and callable(f)]
    tests.sort(key=lambda nf: nf[1].__code__.co_firstlineno)
    ok = bad = 0
    for name, fn in tests:
        try:
            reset_scene()
            fn()
            print("PASS " + name)
            ok += 1
        except Exception as e:
            print("FAIL %s: %s" % (name, e))
            traceback.print_exc()
            bad += 1
    print("CB-TEST %s: %d passed, %d failed" % (mod, ok, bad))
    return bad


if __name__ == "__main__":
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    if not argv:
        print("usage: test_cb.py -- <mod>")
        sys.exit(2)
    try:
        failed = run(argv[0])
    except Exception:
        traceback.print_exc()
        print("CB-TEST %s: 0 passed, 1 failed (import error)" % argv[0])
        failed = 1
    sys.stdout.flush()
    if failed:
        sys.exit(1)
