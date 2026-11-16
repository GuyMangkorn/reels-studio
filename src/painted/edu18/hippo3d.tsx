// EDU-EP18 three.js hippo spike (Boss, 15 Nov 2026, AS-HIPPO3D-SPIKE): renders hippo3d-sdf.ts through @remotion/three.
// Look (v8, round 2): papercut toon (3 flat tones with near-hard steps, cool shadow tint, a thin cut-edge rim, a soft offset drop shadow like
// edu18/paper.ts, no wet glint), no ink outline, so it can sit beside
// the flat papercut dog (dog.ts) and hen (hen.ts). Everything is a pure function of the props (no useFrame, no clock); ThreeCanvas renders on demand.
import {ThreeCanvas} from '@remotion/three';
import {useMemo} from 'react';
import * as THREE from 'three';
import {buildHippo3D, hardParts, H3, HIPPO3D_WATER, skinVerts, type Aff, type Hippo3DPose, type Part, type V3} from './hippo3d-sdf';

const VERT = /* glsl */ `
varying vec3 vN; varying vec3 vV; varying vec3 vCol; varying float vY;
uniform vec3 uColor;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vY = wp.y;
  vec4 mv = viewMatrix * wp;
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
#ifdef USE_COLOR
  vCol = color.rgb;
#else
  vCol = uColor;
#endif
  gl_Position = projectionMatrix * mv;
}`;
// v8 (round 2, papercut): 3 flat tones (shadow / base / lit) with near-hard step edges, no wet glint; the base tone is the palette colour itself,
// so the hide reads as the brief hex like the 2D cut layers. The rim is a thin hard cut-edge highlight on the lit side only.
const FRAG = /* glsl */ `
varying vec3 vN; varying vec3 vV; varying vec3 vCol; varying float vY;
uniform vec3 uLight; uniform vec3 uShadow; uniform vec3 uLit; uniform vec3 uRim; uniform float uRimK; uniform float uSoft; uniform vec2 uStep;
uniform float uWater; uniform vec3 uFoam;
void main() {
  if (uWater > -50.0 && vY < uWater) discard;                      // the water plane is a paper layer behind: cut the skin at the surface
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  float ndl = dot(n, normalize(uLight)) * 0.5 + 0.5;            // half-lambert
  float toShadow = smoothstep(uStep.x + uSoft, uStep.x - uSoft, ndl), toLit = smoothstep(uStep.y - uSoft, uStep.y + uSoft, ndl);
  vec3 col = vCol * mix(mix(vec3(1.0), uShadow, toShadow), uLit, toLit);
  float ndv = clamp(dot(n, normalize(vV)), 0.0, 1.0);
  float rim = smoothstep(0.8, 0.84, 1.0 - ndv) * smoothstep(uStep.y - 0.06, uStep.y, ndl);
  col = mix(col, uRim, rim * uRimK);
  if (uWater > -50.0) {                                             // wet band just above the water and a foam line at it
    float wet = smoothstep(uWater + 0.1, uWater + 0.06, vY);
    col *= mix(1.0, 0.86, wet);
    col = mix(col, uFoam, smoothstep(0.03, 0.022, vY - uWater) * 0.8);
  }
  gl_FragColor = vec4(col, 1.0);
}`;

/** Toon look knobs (sRGB, maths done in display space so the palette matches the 2D cast's hex colours). `step`: half-lambert thresholds shadow|base|lit. */
export const HIPPO3D_LOOK = {shadow: [0.74, 0.7, 0.84] as V3, lit: [1.13, 1.09, 1.04] as V3, rim: [0.93, 0.86, 0.8] as V3, rimK: 0.35, soft: 0.012, step: [0.5, 0.86] as [number, number], light: [-0.55, 0.7, 0.55] as V3, foam: [0.91, 0.86, 0.8] as V3};
export const toonMaterial = (o: {color?: V3; vc?: boolean; water?: number; rimK?: number}) => new THREE.ShaderMaterial({
  vertexShader: VERT, fragmentShader: FRAG, vertexColors: !!o.vc, side: THREE.DoubleSide,
  uniforms: {
    uColor: {value: new THREE.Vector3(...(o.color ?? [1, 1, 1]))}, uLight: {value: new THREE.Vector3(...HIPPO3D_LOOK.light)},
    uShadow: {value: new THREE.Vector3(...HIPPO3D_LOOK.shadow)}, uLit: {value: new THREE.Vector3(...HIPPO3D_LOOK.lit)},
    uRim: {value: new THREE.Vector3(...HIPPO3D_LOOK.rim)}, uRimK: {value: o.rimK ?? HIPPO3D_LOOK.rimK}, uSoft: {value: HIPPO3D_LOOK.soft},
    uStep: {value: new THREE.Vector2(...HIPPO3D_LOOK.step)}, uWater: {value: o.water ?? -99}, uFoam: {value: new THREE.Vector3(...HIPPO3D_LOOK.foam)},
  },
});

/**
 * Papercut drop shadow (the 3D form of edu18/paper.ts paperShadow): three widening low-alpha passes of the same geometry, offset down/right on
 * screen by a fixed amount in view-space metres (so it scales with the hippo like the 2D cut's shadow scales with its height), pushed back in depth
 * so it lands on the parts behind (head on body, legs on belly) and on the background, never on the surface that casts it. A stencil per pass
 * keeps each pixel blended once per pass. Underwater skin casts nothing.
 */
export const HIPPO3D_PAPER_SHADOW = {dx: 0.012, dy: 0.024, blur: 0.024, push: 0.14, op: 0.3, col: [0x2a / 255, 0x20 / 255, 0x30 / 255] as V3};
const SH_VERT = /* glsl */ `
uniform vec2 uOff; uniform float uGrow; uniform float uPush; varying float vY;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0); vY = wp.y;
  vec4 mv = viewMatrix * wp;
  vec3 n = normalize(normalMatrix * normal); float l = length(n.xy);
  if (l > 1e-4) mv.xy += n.xy / l * uGrow;
  mv.xy += uOff; mv.z -= uPush;
  gl_Position = projectionMatrix * mv;
}`;
const SH_FRAG = /* glsl */ `
uniform vec3 uCol; uniform float uA; uniform float uWater; varying float vY;
void main() { if (uWater > -50.0 && vY < uWater) discard; gl_FragColor = vec4(uCol, uA); }`;
const shadowMats = (water: number | undefined) => [[1, 0.42], [0.55, 0.34], [0.15, 0.3]].map(([g, a], k) => {
  const S = HIPPO3D_PAPER_SHADOW, off = 1 - 0.25 * k;
  return new THREE.ShaderMaterial({
    vertexShader: SH_VERT, fragmentShader: SH_FRAG, side: THREE.DoubleSide, transparent: false, depthWrite: false, depthTest: true,
    blending: THREE.CustomBlending, blendSrc: THREE.SrcAlphaFactor, blendDst: THREE.OneMinusSrcAlphaFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
    stencilWrite: true, stencilRef: k + 1, stencilFunc: THREE.NotEqualStencilFunc, stencilZPass: THREE.ReplaceStencilOp,
    uniforms: {uOff: {value: new THREE.Vector2(S.dx * off, -S.dy * off)}, uGrow: {value: S.blur * g}, uPush: {value: S.push}, uCol: {value: new THREE.Vector3(...S.col)}, uA: {value: S.op * a}, uWater: {value: water ?? -99}},
  });
});

const toM4 = (A: Aff) => { const m = A.m; return new THREE.Matrix4().set(m[0], m[1], m[2], A.t[0], m[3], m[4], m[5], A.t[1], m[6], m[7], m[8], A.t[2], 0, 0, 0, 1); };
/** Tapered, gently curved horn (tusk / tooth) along +y in its own frame. */
const hornGeo = (len: number, r: number, curve: number) => {
  const pts = Array.from({length: 9}, (_, i) => { const u = i / 8; return new THREE.Vector2(r * Math.pow(1 - u, 0.8) + 0.002, u * len); });
  const g = new THREE.LatheGeometry(pts, 20), pos = g.getAttribute('position');
  for (let i = 0; i < pos.count; i++) { const y = pos.getY(i) / len; pos.setX(i, pos.getX(i) - curve * len * y * y); }
  g.computeVertexNormals();
  return g;
};

export type Hippo3DProps = {pose: Hippo3DPose; res?: number; part?: Part; water?: number | null};
/** The scene graph for one pose: skin (marching cubes) plus tusks, teeth and eyes on the same rig frames. Returns the vertices for camera fitting. */
export const useHippo3D = ({pose, res = 128, part = 'all', water = null}: Hippo3DProps) => useMemo(() => {
  const wy = water ?? undefined, skinMat = toonMaterial({vc: true, water: wy});
  const M = buildHippo3D(pose, {res, part, material: skinMat});
  const group = new THREE.Group();
  group.add(M.mc);
  for (const h of hardParts(M.rig)) {
    let mesh: THREE.Mesh;
    if (h.kind === 'eye') mesh = new THREE.Mesh(new THREE.SphereGeometry(h.r, 24, 16), toonMaterial({color: H3.eye, rimK: 0, water: wy}));
    else if (h.kind === 'glint') mesh = new THREE.Mesh(new THREE.SphereGeometry(h.r, 12, 8), new THREE.MeshBasicMaterial({color: new THREE.Color().setRGB(0.98, 0.95, 0.9, THREE.SRGBColorSpace)}));
    else mesh = new THREE.Mesh(hornGeo(h.len, h.r, h.kind === 'tusk' ? 0.35 : 0.1), toonMaterial({color: H3.tusk, rimK: 0, water: wy}));
    const d = new THREE.Vector3(...h.dir).normalize(), q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.lengthSq() > 0 ? d : new THREE.Vector3(0, 1, 0));
    mesh.matrixAutoUpdate = false;
    mesh.matrix.copy(toM4(h.frame).multiply(new THREE.Matrix4().compose(new THREE.Vector3(...h.at), q, new THREE.Vector3(1, 1, 1))));
    group.add(mesh);
  }
  // papercut drop shadow: the same geometry again with the three shadow passes, drawn after the opaque hippo (renderOrder 1 + pass)
  const sm = shadowMats(wy);
  for (const m of [...group.children] as THREE.Mesh[]) {
    if (!(m as THREE.Mesh).isMesh || (m.material as THREE.MeshBasicMaterial).isMeshBasicMaterial) continue;   // the eye glint casts nothing
    m.renderOrder = 1;
    sm.forEach((mat, k) => { const c = new THREE.Mesh(m.geometry, mat); c.matrixAutoUpdate = false; c.matrix.copy(m.matrix); c.renderOrder = 2 + k; group.add(c); });
  }
  return {group, verts: skinVerts(M, 2), ms: M.ms, tris: M.tris, rig: M.rig};
}, [pose, res, part, water]);

export type View3D = {yawDeg: number; elevDeg: number; fovDeg?: number};
/**
 * Perspective camera that frames `verts` (optionally only those above `aboveY`) in a w x h canvas: `fill` of the canvas on the limiting axis,
 * or an exact pixel size on one axis (`px` + `axis`), centred at (cx, cy) in canvas pixels. Iterates the projection 4 times.
 */
export const fitCamera = (verts: V3[], w: number, h: number, v: View3D, o: {fill?: number; px?: number; axis?: 'w' | 'h'; cx?: number; cy?: number; aboveY?: number}) => {
  const above = o.aboveY === undefined ? verts : verts.filter((p) => p[1] >= o.aboveY!), vs = above.length ? above : verts;   // nothing above: fit the whole skin
  const fov = v.fovDeg ?? 20, cam = new THREE.PerspectiveCamera(fov, w / h, 0.05, 400);
  const yaw = (v.yawDeg * Math.PI) / 180, el = (v.elevDeg * Math.PI) / 180;
  const dir = new THREE.Vector3(Math.cos(el) * Math.sin(yaw), Math.sin(el), Math.cos(el) * Math.cos(yaw));   // yaw 0 = camera on +z (sees the hippo's left side, head to screen right)
  const c = new THREE.Vector3(); vs.forEach((p) => c.add(new THREE.Vector3(...p))); c.multiplyScalar(1 / vs.length);
  let dist = 12;
  const target = c.clone();
  const tmp = new THREE.Vector3();
  for (let it = 0; it < 5; it++) {
    cam.position.copy(target).addScaledVector(dir, dist); cam.lookAt(target); cam.updateMatrixWorld(true); cam.updateProjectionMatrix();
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const p of vs) { tmp.set(p[0], p[1], p[2]).project(cam); x0 = Math.min(x0, tmp.x); x1 = Math.max(x1, tmp.x); y0 = Math.min(y0, tmp.y); y1 = Math.max(y1, tmp.y); }
    const pw = ((x1 - x0) / 2) * w, ph = ((y1 - y0) / 2) * h;
    const k = o.px ? (o.axis === 'w' ? pw / o.px : ph / o.px) : Math.max(pw / (w * (o.fill ?? 0.85)), ph / (h * (o.fill ?? 0.85)));
    // move the target so the box centre lands on (cx, cy)
    const ndcX = (x0 + x1) / 2 - ((o.cx ?? w / 2) / w) * 2 + 1, ndcY = (y0 + y1) / 2 + ((o.cy ?? h / 2) / h) * 2 - 1;
    const right = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 0), up = new THREE.Vector3().setFromMatrixColumn(cam.matrixWorld, 1);
    const halfH = Math.tan((fov * Math.PI) / 360) * dist, halfW = halfH * (w / h);
    target.addScaledVector(right, ndcX * halfW).addScaledVector(up, ndcY * halfH);
    dist *= k;
  }
  cam.position.copy(target).addScaledVector(dir, dist); cam.lookAt(target); cam.updateMatrixWorld(true); cam.updateProjectionMatrix();
  (cam as unknown as {manual: boolean}).manual = true;
  return cam;
};

/** Soft round contact shadow (radial alpha texture on a ground quad), papercut-style: a blurred cut, not a cast shadow. */
const shadowTex = (() => { let t: THREE.DataTexture | null = null; return () => {
  if (t) return t;
  const n = 64, d = new Uint8Array(n * n * 4);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const r = Math.hypot(i / (n - 1) - 0.5, j / (n - 1) - 0.5) * 2, a = Math.max(0, 1 - r) ** 1.6; const q = (j * n + i) * 4; d[q] = 42; d[q + 1] = 32; d[q + 2] = 48; d[q + 3] = Math.round(255 * a); }
  t = new THREE.DataTexture(d, n, n); t.needsUpdate = true; return t; }; })();

export type Hippo3DViewProps = Hippo3DProps & {
  width: number; height: number; view?: View3D; fit?: Parameters<typeof fitCamera>[4];
  /** water plane at this y (opaque, flat colour) */ waterColor?: string; waterFar?: string;
  /** orthographic px-per-metre camera instead of the fit: world point `at` lands on canvas pixel `px` */ ortho?: {pxPerM: number; at: V3; px: [number, number]};
  shadow?: boolean; style?: React.CSSProperties;
};
/** One hippo in its own transparent WebGL canvas (a screen layer over a painted card or plate). */
export const Hippo3DView = ({width, height, view = {yawDeg: 40, elevDeg: 8}, fit = {}, waterColor, waterFar, ortho, shadow = false, style, ...hp}: Hippo3DViewProps) => {
  const H = useHippo3D(hp);
  const camera = useMemo(() => {
    if (ortho) {
      const {pxPerM: k, at, px} = ortho, cam = new THREE.OrthographicCamera(-px[0] / k, (width - px[0]) / k, px[1] / k, -(height - px[1]) / k, 0.1, 200);
      cam.position.set(at[0], at[1], at[2] + 50); cam.lookAt(at[0], at[1], at[2]); cam.updateMatrixWorld(true); cam.updateProjectionMatrix();
      (cam as unknown as {manual: boolean}).manual = true;
      return cam as THREE.OrthographicCamera | THREE.PerspectiveCamera;
    }
    return fitCamera(H.verts, width, height, view, fit) as THREE.OrthographicCamera | THREE.PerspectiveCamera;
  }, [H, width, height, view, fit, ortho]);
  const scene = useMemo(() => {
    const s = new THREE.Group();
    s.add(H.group);
    if (hp.water != null && waterColor) {
      const g = new THREE.PlaneGeometry(400, 400, 1, 1); g.rotateX(-Math.PI / 2); g.translate(0, hp.water, 0);
      // ShaderMaterial colours are written as given: the sRGB components pass straight through (near colour fading to far with distance)
      const m = new THREE.ShaderMaterial({uniforms: {uN: {value: new THREE.Vector3(...srgb(waterColor))}, uF: {value: new THREE.Vector3(...srgb(waterFar ?? waterColor))}},
        vertexShader: 'varying float vD; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vD = -mv.z; gl_Position = projectionMatrix * mv; }',
        fragmentShader: 'varying float vD; uniform vec3 uN; uniform vec3 uF; void main(){ gl_FragColor = vec4(mix(uN, uF, smoothstep(4.0, 40.0, vD)), 1.0); }', depthWrite: false});
      // v8: the water is the paper layer under the hippo (no depth); the skin cuts itself at the surface, so the drop shadow can fall on the water
      const wm = new THREE.Mesh(g, m); wm.renderOrder = 0; s.add(wm);
    }
    if (shadow) {
      const g = new THREE.PlaneGeometry(4.4, 1.9); g.rotateX(-Math.PI / 2); g.translate(-0.1, 0.004, 0);
      s.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({map: shadowTex(), transparent: true, opacity: 0.55, depthWrite: false})));
    }
    return s;
  }, [H, hp.water, waterColor, waterFar, shadow]);
  return (
    <ThreeCanvas width={width} height={height} style={style} camera={camera} linear flat dpr={1} gl={{alpha: true, antialias: true, preserveDrawingBuffer: true, stencil: true}}>
      <primitive object={scene} />
    </ThreeCanvas>
  );
};
const srgb = (h: string): V3 => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
export {HIPPO3D_WATER};
