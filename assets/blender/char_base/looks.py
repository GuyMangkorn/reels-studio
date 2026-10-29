"""char_base looks: material factories per look ('cel' now; 'clay' later). Material names are `<prefix>_<key>`, so characters never share one."""
import bpy

LOOKS = ('cel',)


def _check(look):
    if look not in LOOKS:
        raise ValueError(f'char_base.looks: unknown look {look!r} (one of {LOOKS})')


def _mat(name, color, rough=0.6):
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    return m


def srgb(h):
    h = h.lstrip('#')
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)


def cornea(prefix):
    m = bpy.data.materials.get(f'{prefix}_cornea')
    if m:
        return m
    m = bpy.data.materials.new(f'{prefix}_cornea')
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new('ShaderNodeOutputMaterial')
    tr = nt.nodes.new('ShaderNodeBsdfTransparent')
    gl = nt.nodes.new('ShaderNodeBsdfGlossy')
    gl.inputs['Roughness'].default_value = 0.10
    mx = nt.nodes.new('ShaderNodeMixShader')
    mx.inputs[0].default_value = 0.05
    nt.links.new(tr.outputs[0], mx.inputs[1])
    nt.links.new(gl.outputs[0], mx.inputs[2])
    nt.links.new(mx.outputs[0], out.inputs[0])
    return m


def cloth_bump(m, scale, strength):
    nt = m.node_tree
    if nt.nodes.get('cb_bump'):
        return
    bsdf = nt.nodes['Principled BSDF']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (scale, scale, scale * 0.35)
    nz = nt.nodes.new('ShaderNodeTexNoise')
    nz.inputs['Scale'].default_value = 1.0
    nz.inputs['Detail'].default_value = 6.0
    bp = nt.nodes.new('ShaderNodeBump')
    bp.name = 'cb_bump'
    bp.inputs['Strength'].default_value = strength
    bp.inputs['Distance'].default_value = 0.004
    nt.links.new(tc.outputs['Object'], mp.inputs['Vector'])
    nt.links.new(mp.outputs['Vector'], nz.inputs['Vector'])
    nt.links.new(nz.outputs['Fac'], bp.inputs['Height'])
    nt.links.new(bp.outputs['Normal'], bsdf.inputs['Normal'])


def skin_sss(m, weight=0.12):
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Subsurface Weight'].default_value = weight
    b.inputs['Subsurface Radius'].default_value = (1.0, 0.35, 0.2)
    b.inputs['Subsurface Scale'].default_value = 0.006
    b.inputs['Specular IOR Level'].default_value = 0.45


def materials(look, prefix, palette, head_mod, hp, origin):
    """Head materials (head style, `prefix`) + body skin (`skin`, head skin moves to `skin_head`) + one material per palette key.
    palette: {key: (hex, roughness)}. Body materials are not finished yet: outfit material hooks run, then finish()."""
    _check(look)
    M = head_mod.make_materials(hp, prefix, origin, look=look)
    M['skin_head'] = M['skin']
    M['skin'] = _mat(f'{prefix}_body_skin', srgb(hp['skin']), 0.8)
    for k, (hx, rough) in palette.items():
        M[k] = _mat(f'{prefix}_{k}', srgb(hx), rough)
    M['_body'] = ['skin'] + list(palette)
    return M


def finish(look, M):
    """Apply the look's shading to the body materials (cel: char_head Shader-to-RGB banding)."""
    _check(look)
    import char_head
    for k in M.pop('_body'):
        char_head.toon(M[k])


def head_mats(M):
    """Materials dict for the head style's build_head (head skin keeps its own material, e.g. stubble)."""
    d = dict(M)
    d['skin'] = M['skin_head']
    return d
