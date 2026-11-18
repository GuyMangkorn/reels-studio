// Hand-kit props as Three.js meshes (KIT-POV-HANDS engine 'three', 18 Nov 2026): the same catalog, sizes and frames as hand-props.ts
// `PROPS`, built from boxes, frustums, spheres, rings and tubes in the toon material with an inverted-hull outline, so a hand and the thing it
// holds sort per pixel (fingers wrap behind a cup, a thumb in front of a phone). Keep each entry's numbers in step with its 2D twin.
import * as THREE from 'three';
import {toonMaterial} from '../edu18/hippo3d';
import {type Frame3, type PropId} from './hand-props';
import {type V3} from './space';

export const srgb = (h: string): V3 => [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
const INK = '#2a1d16';
/** Inverted-hull ink: the back faces pushed out along the normal by `w` metres, flat ink colour. */
export const outlineMat = (w: number, color = INK) => new THREE.ShaderMaterial({
  side: THREE.BackSide,
  uniforms: {uW: {value: w}, uC: {value: new THREE.Vector3(...srgb(color))}},
  vertexShader: 'uniform float uW; void main(){ vec3 p = position + normal * uW; gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }',
  fragmentShader: 'uniform vec3 uC; void main(){ gl_FragColor = vec4(uC, 1.0); }',
});
/** Toon for props: the edu18 steps, but a warm neutral shadow (the hippo look's violet shadow turned white paper and grey panels purple). */
export const toon = (hex: string, rimK = 0.15) => { const m = toonMaterial({color: srgb(hex), rimK}); m.uniforms.uShadow.value.set(0.8, 0.77, 0.75); return m; };

/** A mesh with its outline (`ink` 0: none), in prop-local coordinates. */
const part = (geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], ink: number, at: V3 = [0, 0, 0]): THREE.Object3D[] => {
  geo.translate(...at);
  return ink > 0 ? [new THREE.Mesh(geo, mat), new THREE.Mesh(geo, outlineMat(ink))] : [new THREE.Mesh(geo, mat)];
};
type Faces = Partial<Record<'+x' | '-x' | '+y' | '-y' | '+z' | '-z', string>>;
/** Box of half sizes h centred at `at` (local); face colours in BoxGeometry order (+x -x +y -y +z -z). */
const box = (h: V3, color: string, ink: number, at: V3 = [0, 0, 0], faces: Faces = {}) => {
  const mats = (['+x', '-x', '+y', '-y', '+z', '-z'] as const).map((k) => toon(faces[k] ?? color));
  return part(new THREE.BoxGeometry(h[0] * 2, h[1] * 2, h[2] * 2), mats, ink, at);
};
/** Frustum along local y from y0 (radius r0) to y1 (radius r1); `top` colours the y1 cap. `axis` 'z' stands it along local z instead. */
const frustum = (y0: number, y1: number, r0: number, r1: number, color: string, ink: number, o: {top?: string; at?: V3; axis?: 'y' | 'z'} = {}) => {
  const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, 28);
  g.translate(0, (y0 + y1) / 2, 0);
  if (o.axis === 'z') g.rotateX(Math.PI / 2);
  return part(g, [toon(color), toon(o.top ?? color, 0), toon(color)], ink, o.at);
};
const sphere = (r: number, color: string, ink: number, at: V3 = [0, 0, 0]) => part(new THREE.SphereGeometry(r, 28, 18), toon(color, 0.25), ink, at);
/** A tube through local points (handle, spoke, stem). */
const tubeAlong = (pts: V3[], r: number, color: string, ink: number) =>
  part(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((v) => new THREE.Vector3(...v))), 24, r, 12, false), toon(color), ink);
/** A flat panel (paper, table top, door) as a thin box so the outline has a back to push. */
const slab = (hx: number, hy: number, color: string, ink: number, at: V3 = [0, 0, 0], t = 0.002) => box([hx, hy, t], color, ink, [at[0], at[1], at[2] - t]);

type Build = (ink: number) => THREE.Object3D[];
/** Local builds, frames as in `PROPS` (y long or up axis, z face normal). */
const BUILD: Record<PropId, Build> = {
  cup: (k) => [...frustum(-0.05, 0.045, 0.034, 0.041, '#f3efe6', k, {top: '#6b4226'}),
    ...tubeAlong([[0.038, 0.025, 0], [0.062, 0.018, 0], [0.066, -0.005, 0], [0.058, -0.025, 0], [0.036, -0.03, 0]], 0.006, '#f3efe6', k)],
  glass: (k) => frustum(-0.055, 0.06, 0.03, 0.036, '#cfe4ec', k, {top: '#a8cfe0'}),
  bottle: (k) => [...frustum(-0.11, 0.06, 0.033, 0.033, '#bfe0ea', k), ...frustum(0.06, 0.095, 0.033, 0.013, '#bfe0ea', k), ...frustum(0.095, 0.115, 0.014, 0.014, '#2f78c4', k)],
  phone: (k) => [...box([0.036, 0.075, 0.004], '#2a2c31', k), ...part(new THREE.PlaneGeometry(0.062, 0.132), new THREE.MeshBasicMaterial({color: '#5b8fc9'}), 0, [0, 0.002, 0.0042])],
  pen: (k) => [...frustum(-0.07, 0.07, 0.0045, 0.0045, '#2f4f9a', k), ...frustum(-0.088, -0.07, 0.001, 0.0045, '#d9d2c4', k)],
  ball: (k) => sphere(0.11, '#e8823a', k),
  apple: (k) => [...sphere(0.04, '#c8372d', k), ...tubeAlong([[0, 0.034, 0], [0.002, 0.042, 0], [0.004, 0.05, 0]], 0.002, '#5a3a1e', k)],
  book: (k) => box([0.075, 0.105, 0.015], '#3f6f5a', k, [0, 0, 0], {'+x': '#f1ead8', '-y': '#f1ead8', '+y': '#f1ead8'}),
  'open-book': (k) => [-1, 1].flatMap((s) => {
    const g = new THREE.Group(); // each page tilts up toward +z from the spine, as in the 2D twin
    box([0.075, 0.105, 0.008], '#f4eedd', k, [0.075 * s, 0, 0], {'-z': '#3f6f5a'}).forEach((m) => g.add(m));
    g.rotation.y = -s * Math.atan2(0.18, 1);
    return [g];
  }),
  card: (k) => [...box([0.027, 0.043, 0.0006], '#e9e4d8', k), ...part(new THREE.PlaneGeometry(0.054, 0.012), new THREE.MeshBasicMaterial({color: '#c0473a'}), 0, [0, 0.02, 0.0008])],
  coin: (k) => frustum(-0.001, 0.001, 0.012, 0.012, '#d7b14a', k, {axis: 'z'}),
  key: (k) => [...box([0.004, 0.024, 0.0012], '#b8b4a8', k, [0, 0.032, 0]), ...frustum(-0.0015, 0.0015, 0.013, 0.013, '#c9a646', k, {axis: 'z'})],
  remote: (k) => [...box([0.024, 0.09, 0.011], '#34363c', k),
    ...Array.from({length: 6}, (_, i) => sphere(0.005, i === 0 ? '#d24a3a' : '#9aa0a8', 0, [i % 2 ? 0.009 : -0.009, 0.05 - Math.floor(i / 2) * 0.022, 0.011])).flat()],
  'door-lever': (k) => [...slab(0.45, 0.9, '#c79a6a', k, [0.2, 0.06, -0.055], 0.02), ...box([0.022, 0.06, 0.006], '#a9a9a2', k, [0, 0.09, -0.048]),
    ...frustum(0, 0.042, 0.009, 0.009, '#c8c8c0', k, {axis: 'z', at: [0, 0.09, -0.042]}), ...frustum(-0.06, 0.09, 0.011, 0.011, '#c8c8c0', k)],
  'button-panel': (k) => [...box([0.09, 0.13, 0.012], '#c9ccd1', k, [0, 0.03, -0.024]), ...frustum(0, 0.01, 0.022, 0.02, '#d24a3a', k, {axis: 'z', at: [0, 0, -0.012]})],
  keyboard: (k) => [...box([0.22, 0.07, 0.01], '#3a3d44', k, [-0.05, 0.02, -0.012]),
    ...Array.from({length: 52}, (_, i) => box([0.013, 0.013, 0.002], '#d9dbe0', 0, [-0.05 - 0.198 + (i % 13) * 0.033, 0.02 - 0.05 + Math.floor(i / 13) * 0.033, -0.001])).flat()],
  wheel: (k) => {
    const rim = new THREE.TorusGeometry(0.18, 0.017, 16, 64); // in local x/y, axle z: the wheel frame's own axes
    const hub = frustum(-0.06, 0.02, 0.05, 0.045, '#2b2c30', k, {axis: 'z'});
    const spokes = [Math.PI * 0.5, Math.PI * 1.15, Math.PI * 1.85].flatMap((a) => tubeAlong([[0, 0, 0], [Math.cos(a) * 0.09, Math.sin(a) * 0.09, 0], [Math.cos(a) * 0.17, Math.sin(a) * 0.17, 0]], 0.014, '#2b2c30', k));
    return [...part(rim, toon('#2b2c30'), k), ...hub, ...spokes];
  },
  paper: (k) => slab(0.105, 0.148, '#fbf8f0', k),
  table: (k) => slab(0.8, 0.5, '#b07b4f', k, [0, 0, 0], 0.02),
  door: (k) => slab(0.45, 1.0, '#c79a6a', k, [0, 0, 0], 0.02),
  bill: (k) => [...box([0.036, 0.078, 0.0004], BILL, k), ...part(new THREE.PlaneGeometry(0.044, 0.06), new THREE.MeshBasicMaterial({color: BILL_PALE}), 0, [0, 0.02, 0.0006])],
  bills: (k) => box([0.036, 0.078, 0.006], BILL, k, [0, 0, 0], {'+x': BILL_PALE, '-x': BILL_PALE, '+y': BILL_PALE, '-y': BILL_PALE}),
  spoon: (k) => {
    const bowl = new THREE.SphereGeometry(0.022, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2); // lower half: the bowl, open to +z after the turn
    bowl.rotateX(-Math.PI / 2); bowl.scale(0.8, 1.2, 0.45);
    return [...frustum(-0.06, 0.075, 0.004, 0.003, STEEL, k), ...part(bowl, toon(STEEL), k, [0, 0.1, 0.004]), ...sphere(0.012, '#f4f1e8', k, [0, 0.1, 0.008])];
  },
  pill: (k) => [...frustum(-0.006, 0, 0.0045, 0.0045, '#f2efe8', k), ...frustum(0, 0.006, 0.0045, 0.0045, '#d24a3a', k), ...sphere(0.0045, '#f2efe8', k, [0, -0.006, 0]), ...sphere(0.0045, '#d24a3a', k, [0, 0.006, 0])],
  scissors: (k) => [-1, 1].flatMap((s) => {
    const g = new THREE.Group();
    [...box([0.005, 0.05, 0.001], STEEL, k, [0, 0.07, s * 0.0012]), ...part(new THREE.TorusGeometry(0.012, 0.0035, 10, 28), toon('#d24a3a'), k, [s * 0.018, -0.012, 0])].forEach((m) => g.add(m));
    g.rotation.z = -s * 0.12;
    return [g];
  }),
  tap: (k) => [...frustum(-0.25, 0, 0.016, 0.014, STEEL, k, {at: [0, 0.03, -0.12]}), ...frustum(-0.12, 0, 0.012, 0.012, STEEL, k, {axis: 'z', at: [0, 0.03, 0]}),
    ...frustum(0, 0.03, 0.012, 0.012, STEEL, k), ...part(new THREE.CylinderGeometry(0.006, 0.008, 0.25, 16).translate(0, -0.125, 0), new THREE.MeshBasicMaterial({color: WATER, transparent: true, opacity: 0.75}), 0)],
  box: (k) => [...box([0.15, 0.1, 0.12], CARD, k, [0, -0.1, 0], {'+y': CARD_IN}), ...[-1, 1].flatMap((s) => {
    const g = new THREE.Group(); // a flap hinged on the top edge at z = s * 0.12, opened outward
    slab(0.15, 0.06, CARD_IN, k, [0, 0.06, 0], 0.002).forEach((m) => g.add(m));
    g.rotation.x = s * 0.46; g.position.set(0, 0, s * 0.12);
    return [g];
  })],
  umbrella: (k) => [...frustum(-0.06, 0.58, 0.006, 0.006, '#2b2c30', k), ...frustum(0.42, 0.6, 0.48, 0.02, '#2f6fb0', k)],
};
const BILL = '#d2604f', BILL_PALE = '#efe3d0', STEEL = '#c3c6cc', WATER = '#9fd3ea', CARD = '#c99a62', CARD_IN = '#b88752';

/** One catalog prop placed by its frame (world), as a Three group. `ink`: outline width in metres. */
export const propMesh = (id: PropId, f: Frame3, ink = 0.0016): THREE.Group => {
  const g = new THREE.Group();
  BUILD[id](ink).forEach((m) => g.add(m));
  const v = (a: V3) => new THREE.Vector3(...a);
  g.applyMatrix4(new THREE.Matrix4().makeBasis(v(f.x), v(f.y), v(f.z)).setPosition(v(f.o)));
  return g;
};
