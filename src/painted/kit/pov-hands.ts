// First-person (POV) hand kit (KIT-POV-HANDS, 18 Nov 2026): the viewer's own arms enter from the bottom of the frame and do an action,
// often on a prop. Every action is built in world metres for one POV camera (eye 1.6 m, looking down), with five-finger macro hands from
// the gesture kit, elbows solved from the shoulders, and props placed from hand landmarks so the grip matches. Pick an action by id,
// read its thumb line on the reference sheet (scripts/painted-kit/hand-kits.mjs --kit=pov), and reuse `povScene` / `paintPovScene`.
// Rules: .claude/skills/hand-drawing/SKILL.md. No Remotion import.
import {type GestureId, type HandSide} from './hand-gestures';
import {PROPS, frameOf, paintQuad, type Frame3, type PropId} from './hand-props';
import {LANDMARKS, cross3, dist3, dot3, elbowIK, forwardFor, mid3, norm3, paintTube, specHand, toneFromSkin, type HandSpec, type Sk} from './hand-place';
import {macroSkeleton, paintHandMacro, type HandMacro, type MacroTone} from './hands';
import {type Painter} from './painter';
import {add3, scale3, sub3, type V3} from './space';
import {camDepth, type YCam} from './ycam';

/** The POV camera: eye 1.6 m, 10 cm ahead of the shoulders, looking along -z and down 34 degrees; near 4 cm so forearms reaching the lens still draw. */
export const POV_CAM: YCam = {x: 0, y: 1.6, z: -0.1, yaw: 0, pitch: -0.6, f: 860, hy: 900, near: 0.04};
/** The viewer's shoulders (the viewer faces -z, so their right is +x) and the elbow pole (down, out, back). */
export const POV_SHOULDER: Record<HandSide, V3> = {right: [0.19, 1.43, -0.01], left: [-0.19, 1.43, -0.01]};
const POLE: Record<HandSide, V3> = {right: [0.55, -1, 0.5], left: [-0.55, -1, 0.5]};
/** Default viewer: medium skin, a navy tee (sleeve ends near the elbow). */
export const POV_TONE: MacroTone = toneFromSkin('#d9a57c', '#34507a');

export type KitProp = {id: PropId; frame: Frame3; front?: boolean};
/** `plane`: world height of a surface the hands touch (table, desk): the hands cast fingertip and palm shadows on it, and the room gets a table top there. */
export type KitScene = {hands: HandMacro[]; props: KitProp[]; plane?: number};
export type PovAction = {verb: string; th: string; build: () => KitScene};

const n = norm3;
const UP: V3 = [0, 1, 0], DOWN: V3 = [0, -1, 0], FWD: V3 = [0, 0, -1], RIGHT: V3 = [1, 0, 0], LEFT: V3 = [-1, 0, 0];
const at = (sk: Sk, x: number, y: number, z: number): V3 => add3(add3(add3(sk.palmCentre, scale3(sk.toThumb, x)), scale3(sk.normal, y)), scale3(sk.forward, z));
const skOf = (h: HandMacro) => macroSkeleton(h);
/** A hand from a spec; `k` picks its id range. Tone defaults to POV_TONE. */
const H = (k: number, s: Omit<HandSpec, 'base'>): HandMacro => specHand({tone: POV_TONE, ...s, base: 3000 + k * 240});
/** A grip: thumb along `thumb`, back of the hand toward `back`. */
const G = (k: number, gesture: GestureId, side: HandSide, thumb: V3, back: V3, put: HandSpec['put'] | V3): HandMacro => {
  const o = forwardFor(side, thumb, back);
  return H(k, {gesture, side, ...o, ...(Array.isArray(put) ? {wrist: put} : {put})});
};
/** A frame with x along `x` and y along `y` (y squared to x). */
const frameXY = (o: V3, x: V3, y: V3): Frame3 => { const X = n(x), Z = n(cross3(X, n(y))); return {o, x: X, y: cross3(Z, X), z: Z}; };
const toEye = (v: V3) => n(sub3([POV_CAM.x, POV_CAM.y, POV_CAM.z], v));

/** Hand size for the one-hand phone grip: the kit hand is about 70% of a real hand, too small to span a 7.2 cm phone from thumb to fingertips. */
const PHONE_HAND = 1.45;
/** Height of a banknote stack's centre above a flat palm's centre: palm half-thickness plus half the stack. */
const STACK_LIFT = 0.022;
/** POV actions. `verb`: what the hands do; `th`: Thai label. Right hand is +x (screen right), left hand -x. */
export const POV_ACTIONS = {
  'reach-open': {verb: 'reach out, open hand', th: 'เอื้อมมือ', build: () => ({hands: [H(0, {gesture: 'relaxed', side: 'right', forward: [0.05, -0.15, -1], back: [0, 1, 0.2], wrist: [0.13, 1.16, -0.4]})], props: []})},
  wave: {verb: 'wave hello (palm out)', th: 'โบกมือทักทาย', build: () => ({hands: [H(0, {gesture: 'open-spread', side: 'right', forward: [0.25, 1, -0.15], back: [0, 0.1, 1], wrist: [0.12, 1.3, -0.42]})], props: []})},
  stop: {verb: 'stop! palm out', th: 'ยกมือห้าม', build: () => ({hands: [H(0, {gesture: 'stop', side: 'right', forward: [0.05, 1, -0.2], back: [0, 0.2, 1], wrist: [0.09, 1.28, -0.44]})], props: []})},
  point: {verb: 'point ahead', th: 'ชี้ไปข้างหน้า', build: () => ({hands: [H(0, {gesture: 'point', side: 'right', forward: [-0.08, 0.12, -1], back: [0, 1, 0.1], wrist: [0.15, 1.24, -0.38]})], props: []})},
  'press-button': {verb: 'press a wall button', th: 'กดปุ่ม', build: () => {
    const btn: V3 = [0.06, 1.3, -0.5];
    return {hands: [H(0, {gesture: 'point', side: 'right', forward: [-0.1, 0.05, -1], back: [0.3, 1, 0], put: {landmark: LANDMARKS.indexTip, at: add3(btn, [0, 0, 0.014])}})], props: [{id: 'button-panel', frame: frameOf(btn, UP, [0, 0, 1])}]};
  }},
  'phone-tap': {verb: 'hold a phone (left), tap the screen (right)', th: 'ถือมือถือแล้วแตะจอ', build: () => {
    const l = H(0, {gesture: 'relaxed', side: 'left', forward: [1, 0.25, -0.45], back: [0, -1, -0.25], wrist: [-0.11, 1.12, -0.3]});
    // The phone's long edge runs across the palm (little -> index knuckle) and the curled fingers wrap its far edge, as in a real hold.
    const sl = skOf(l), face = n(scale3(sl.normal, -1)), o = add3(add3(at(sl, -0.004, 0, 0.02), scale3(face, 0.048)), scale3(sl.forward, 0.024));
    const phone = frameOf(o, sub3(sl.fingers.index.joints[0], sl.fingers.little.joints[0]), face), screen = add3(add3(o, scale3(phone.z, 0.006)), scale3(phone.y, 0.01));
    const r = H(1, {gesture: 'point', side: 'right', forward: [-0.55, -0.2, -0.8], back: [0.2, 1, 0.2], put: {landmark: LANDMARKS.indexTip, at: add3(screen, scale3(phone.z, 0.008))}});
    return {hands: [l, r], props: [{id: 'phone', frame: phone, front: true}]};
  }},
  'hold-cup': {verb: 'hold a cup', th: 'ถือแก้วกาแฟ', build: () => {
    const h = G(0, 'grip', 'right', UP, [1, 0, 0.2], [0.17, 1.12, -0.32]);
    const sk = skOf(h), o = LANDMARKS.grip(sk, 0.04);
    return {hands: [h], props: [{id: 'cup', frame: frameXY(o, n(sub3(sk.palmCentre, o)), sk.toThumb)}]};
  }},
  write: {verb: 'write with a pen', th: 'เขียนหนังสือ', build: () => {
    const h = H(0, {gesture: 'hold-pen', side: 'right', forward: [-0.35, -0.55, -1], back: [0.35, 1, 0.1], wrist: [0.1, 1.0, -0.3]});
    const sk = skOf(h), pinch = LANDMARKS.pinch(sk);
    const y = n(add3(add3(scale3(sk.forward, -0.6), scale3(sk.normal, 0.55)), [0.55, 0, 0])); // pen top leans back toward the right shoulder
    const pen = frameOf(add3(pinch, scale3(y, 0.012)), y, sk.toThumb), tip = add3(pen.o, scale3(pen.y, -0.088));
    return {hands: [h], plane: tip[1] - 0.002, props: [{id: 'paper', frame: frameOf(add3(tip, [-0.04, -0.001, 0.02]), FWD, UP)}, {id: 'pen', frame: pen, front: true}]};
  }},
  'pick-coin': {verb: 'pick up a coin', th: 'หยิบเหรียญ', build: () => {
    const h = H(0, {gesture: 'pinch', side: 'right', forward: [0.1, 0.85, -0.5], back: [0.5, -0.48, -0.72], wrist: [0.12, 1.2, -0.38]}); // lifted, coin face to the eye
    const sk = skOf(h), p0 = LANDMARKS.pinch(sk), z = n(sub3(sk.fingers.index.joints[3], sk.fingers.thumb.joints[3]));
    // The coin's edge is in the pinch and its face (normal = the pinch axis) stands out of the pinch away from the palm, rim in the pinch (in 3D the curled fingers hide a centred coin).
    const away = sub3(p0, sk.palmCentre), out = n(sub3(away, scale3(z, dot3(away, z)))), c = add3(p0, scale3(out, 0.011));
    return {hands: [h], props: [{id: 'coin', frame: frameOf(c, out, z)}]};
  }},
  'hold-ball': {verb: 'hold a ball in both hands', th: 'ถือลูกบอลสองมือ', build: () => {
    const c: V3 = [0, 1.14, -0.42];
    const hands = (['right', 'left'] as const).map((side, k) => {
      const s = side === 'right' ? 1 : -1;
      return G(k, 'claw', side, n([0, 1, -0.4]), [s, 0, 0.15], {landmark: LANDMARKS.palm, at: add3(c, [s * 0.118, -0.01, 0.02])});
    });
    return {hands, props: [{id: 'ball', frame: frameOf(c, UP, [0, 0, 1])}]};
  }},
  'open-door': {verb: 'push down a door lever', th: 'เปิดประตู', build: () => {
    const h = G(0, 'grip', 'right', LEFT, n([0, 1, 0.35]), [0.18, 1.08, -0.37]);
    const sk = skOf(h);
    return {hands: [h], props: [{id: 'door-lever', frame: frameOf(LANDMARKS.grip(sk, 0.011), sk.toThumb, [0, 0, 1])}]};
  }},
  'read-book': {verb: 'hold an open book, hands on the pages', th: 'อ่านหนังสือ', build: () => {
    const z = n([0, 0.75, 0.66]), y = n(cross3(z, RIGHT)), o: V3 = [0, 1.13, -0.36], book = frameOf(o, y, z);
    const hands = (['right', 'left'] as const).map((side, k) => {
      // Hands hold the pages open from above at the lower outer corners: the backs face the eye.
      const s = side === 'right' ? 1 : -1, corner = add3(add3(add3(o, scale3(book.x, s * 0.11)), scale3(book.y, -0.075)), scale3(book.z, 0.026));
      return H(k, {gesture: 'relaxed', side, forward: add3(scale3(book.y, 0.7), scale3(book.x, -s * 0.7)), back: book.z, put: {landmark: LANDMARKS.palm, at: corner}});
    });
    return {hands, props: [{id: 'open-book', frame: book}]};
  }},
  'open-bottle': {verb: 'hold a bottle (right), twist the cap (left)', th: 'เปิดขวดน้ำ', build: () => {
    const r = G(0, 'grip', 'right', UP, [1, 0, 0.2], [0.14, 1.04, -0.32]);
    const sk = skOf(r), o = LANDMARKS.grip(sk, 0.033), bottle = frameXY(o, n(sub3(sk.palmCentre, o)), UP);
    const cap = add3(o, scale3(bottle.y, 0.105));
    const l = H(1, {gesture: 'pinch', side: 'left', forward: [0.5, -0.35, -0.8], back: [-0.1, 1, 0.1], put: {landmark: LANDMARKS.pinch, at: cap}});
    return {hands: [r, l], props: [{id: 'bottle', frame: bottle}]};
  }},
  'give-card': {verb: 'hand over a card', th: 'ยื่นบัตร', build: () => {
    const h = H(0, {gesture: 'pinch', side: 'right', forward: [-0.15, -0.1, -1], back: [0.1, 1, 0], wrist: [0.12, 1.2, -0.4]});
    const sk = skOf(h), c = LANDMARKS.pinch(sk), card = frameOf(add3(c, scale3(sk.forward, 0.036)), sk.forward, sk.normal);
    return {hands: [h], props: [{id: 'card', frame: card}]};
  }},
  'receive-apple': {verb: 'receive an apple in cupped hands', th: 'แบมือรับแอปเปิล', build: () => {
    const hands = (['right', 'left'] as const).map((side, k) => {
      const s = side === 'right' ? 1 : -1;
      return H(k, {gesture: 'cupped', side, forward: [-s * 0.15, 0.15, -1], back: [s * 0.25, -1, 0], wrist: [s * 0.055, 1.07, -0.3]});
    });
    const c = mid3(LANDMARKS.rest(skOf(hands[0]), 0.04), LANDMARKS.rest(skOf(hands[1]), 0.04));
    return {hands, props: [{id: 'apple', frame: frameOf(c, UP, [0, 0, 1]), front: true}]};
  }},
  steer: {verb: 'hold a steering wheel at ten and two', th: 'จับพวงมาลัย', build: () => {
    const z = n([0, 0.5, 1]), wheel = frameOf([0, 1.16, -0.42], n(cross3(RIGHT, z)), z);
    const W: Frame3 = {o: wheel.o, x: RIGHT, y: n(cross3(z, RIGHT)), z};
    const hands = (['right', 'left'] as const).map((side, k) => {
      const a = side === 'right' ? Math.PI / 6 : (5 * Math.PI) / 6, radial = n(add3(scale3(W.x, Math.cos(a)), scale3(W.y, Math.sin(a))));
      const tangent = side === 'right' ? n(add3(scale3(W.x, -Math.sin(a)), scale3(W.y, Math.cos(a)))) : n(add3(scale3(W.x, Math.sin(a)), scale3(W.y, -Math.cos(a))));
      const rim = add3(W.o, scale3(radial, 0.18)), o = forwardFor(side, tangent, add3(scale3(radial, 0.6), scale3(z, 0.8)));
      return H(k, {gesture: 'grip', side, ...o, put: {landmark: (sk) => LANDMARKS.grip(sk, 0.017), at: rim}});
    });
    return {hands, props: [{id: 'wheel', frame: W}]};
  }},
  'thumbs-up': {verb: 'thumbs up', th: 'ยกนิ้วโป้ง', build: () => ({hands: [G(0, 'thumbs-up', 'right', UP, [1, 0, 0.3], [0.17, 1.26, -0.4])], props: []})},
  'count-three': {verb: 'count three on the left hand', th: 'นับสาม', build: () => ({hands: [H(0, {gesture: 'three', side: 'left', forward: [0.1, 1, -0.25], back: [0, 0.25, 1], wrist: [-0.12, 1.27, -0.42]})], props: []})},
  knock: {verb: 'knock on a door', th: 'เคาะประตู', build: () => {
    const h = G(0, 'fist', 'right', UP, [1, 0, 0.25], [0.15, 1.3, -0.42]);
    const sk = skOf(h), k = sk.fingers.middle.joints[1];
    return {hands: [h], props: [{id: 'door', frame: frameOf([k[0] - 0.15, k[1] - 0.3, k[2] - 0.013], UP, [0, 0, 1])}]};
  }},
  type: {verb: 'type on a keyboard', th: 'พิมพ์คีย์บอร์ด', build: () => {
    const key: V3 = [0.07, 0.92, -0.38];
    const r = H(0, {gesture: 'relaxed', side: 'right', forward: [-0.15, -0.35, -1], back: [0.1, 1, -0.1], put: {landmark: LANDMARKS.indexTip, at: add3(key, [0, 0.008, 0])}});
    const l = H(1, {gesture: 'relaxed', side: 'left', forward: [0.15, -0.35, -1], back: [-0.1, 1, -0.1], put: {landmark: LANDMARKS.indexTip, at: add3(key, [-0.17, 0.008, 0])}});
    return {hands: [r, l], plane: key[1] - 0.022, props: [{id: 'keyboard', frame: frameOf(key, FWD, UP)}]};
  }},
  wai: {verb: 'wai (palms together)', th: 'ไหว้', build: () => {
    const c: V3 = [0, 1.3, -0.24];
    const hands = (['right', 'left'] as const).map((side, k) => { const s = side === 'right' ? 1 : -1; return H(k, {gesture: 'stop', side, forward: [0, 1, -0.25], back: [s, 0, 0], put: {landmark: LANDMARKS.palm, at: add3(c, [s * 0.002, 0, 0])}}); });
    return {hands, props: []};
  }},
  'look-at-palm': {verb: 'look at own palm', th: 'มองฝ่ามือตัวเอง', build: () => {
    const w: V3 = [0.07, 1.2, -0.3], b = scale3(toEye(w), -1);
    return {hands: [H(0, {gesture: 'open-spread', side: 'right', forward: [0.1, 0.65, -0.75], back: b, wrist: w})], props: []};
  }},
  'turn-key': {verb: 'turn a key in a lock', th: 'ไขกุญแจ', build: () => {
    const h = G(0, 'pinch', 'right', UP, [1, 0, 0.25], [0.12, 1.12, -0.38]);
    const sk = skOf(h), c = LANDMARKS.pinch(sk), z = n(sub3(sk.fingers.index.joints[3], sk.fingers.thumb.joints[3]));
    const key = frameOf(c, sk.forward, z), tip = add3(c, scale3(sk.forward, 0.058));
    return {hands: [h], props: [{id: 'door', frame: frameOf(add3(tip, [-0.25, -0.2, 0]), UP, scale3(sk.forward, -1))}, {id: 'key', frame: key, front: true}]};
  }},
  peace: {verb: 'peace sign, palm out', th: 'ชูสองนิ้ว', build: () => ({hands: [H(0, {gesture: 'peace', side: 'right', forward: [0.1, 1, -0.2], back: [0, 0.2, 1], wrist: [0.16, 1.28, -0.42]})], props: []})},
  toast: {verb: 'raise a glass (left hand)', th: 'ชนแก้ว', build: () => {
    const h = G(0, 'grip', 'left', UP, [-1, 0, 0.2], [-0.14, 1.2, -0.4]);
    const sk = skOf(h), o = LANDMARKS.grip(sk, 0.033);
    return {hands: [h], props: [{id: 'glass', frame: frameXY(o, n(sub3(sk.palmCentre, o)), sk.toThumb)}]};
  }},
  remote: {verb: 'point a TV remote, thumb on the buttons', th: 'กดรีโมท', build: () => {
    const h = G(0, 'grip', 'right', n([-0.1, 0.25, -1]), [1, 0.3, 0], [0.16, 1.1, -0.3]);
    const sk = skOf(h), o = add3(LANDMARKS.grip(sk, 0.012), scale3(sk.toThumb, 0.03));
    return {hands: [h], props: [{id: 'remote', frame: frameOf(o, sk.toThumb, sk.normal)}]};
  }},
  // Added 18 Nov 2026 (kit extension, user): money, food and medicine, everyday tools, weather.
  'pay-cash': {verb: 'hand over a banknote', th: 'จ่ายเงินสด', build: () => {
    const h = H(0, {gesture: 'pinch', side: 'right', forward: [-0.15, 0.05, -1], back: [0.25, 1, 0], wrist: [0.12, 1.2, -0.38]});
    // The note lies flat (face up, along the back of the hand) and runs on from the pinch, so it is seen face-on from above.
    const sk = skOf(h), p0 = LANDMARKS.pinch(sk), z = sk.normal, y = n(sub3(sk.forward, scale3(z, dot3(sk.forward, z))));
    return {hands: [h], props: [{id: 'bill', frame: frameOf(add3(p0, scale3(y, 0.068)), y, z)}]};
  }},
  'count-money': {verb: 'count a stack of banknotes', th: 'นับธนบัตร', build: () => {
    // The stack lies on a flat left palm (fingers under it); the right thumb flicks its far right corner, the arm coming in from the right.
    const l = H(0, {gesture: 'stop', side: 'left', forward: [0.35, 0.1, -1], back: [0.1, -1, 0.1], wrist: [-0.1, 1.08, -0.3]});
    const sl = skOf(l), up = n(scale3(sl.normal, -1)), o = add3(sl.palmCentre, scale3(up, STACK_LIFT));
    // Long edge across the palm, so the fingertips show past the far edge and the hand reads as holding it.
    const bills = frameOf(add3(o, scale3(sl.forward, 0.01)), sub3(sl.fingers.index.joints[0], sl.fingers.little.joints[0]), up);
    const corners = [-1, 1].flatMap((sx) => [-1, 1].map((sy) => add3(add3(bills.o, scale3(bills.z, 0.007)), add3(scale3(bills.y, sy * 0.07), scale3(bills.x, sx * 0.032)))));
    const corner = corners.reduce((a, c) => (c[0] - c[2] > a[0] - a[2] ? c : a)); // far right corner
    const r = H(1, {gesture: 'pinch', side: 'right', forward: [-0.6, -0.3, -0.75], back: [0.3, 1, 0.1], put: {landmark: LANDMARKS.thumbTip, at: corner}});
    return {hands: [l, r], props: [{id: 'bills', frame: bills}]};
  }},
  'eat-spoon': {verb: 'scoop a spoon of rice', th: 'กินข้าวด้วยช้อน', build: () => {
    const h = H(0, {gesture: 'hold-pen', side: 'right', forward: [-0.55, 0.2, -0.8], back: [0.4, 1, 0.3], wrist: [0.15, 1.3, -0.3]});
    const sk = skOf(h), p0 = LANDMARKS.pinch(sk), y = n([-0.65, -0.15, -0.75]), z = n(sub3(UP, scale3(y, dot3(UP, y)))); // bowl ahead and to the left, seen from above
    return {hands: [h], props: [{id: 'spoon', frame: frameOf(add3(p0, scale3(y, -0.01)), y, z)}]};
  }},
  'drink-glass': {verb: 'lift a glass to drink', th: 'ดื่มน้ำ', build: () => {
    const h = G(0, 'grip', 'right', n([-0.1, 1, 0.2]), [1, 0, 0.25], [0.1, 1.24, -0.3]); // lifted toward the mouth, still upright enough to read as a glass
    const sk = skOf(h), o = LANDMARKS.grip(sk, 0.033);
    return {hands: [h], props: [{id: 'glass', frame: frameXY(o, n(sub3(sk.palmCentre, o)), sk.toThumb)}]};
  }},
  'hold-phone': {verb: 'hold a phone in one hand, thumb along the edge', th: 'ถือมือถือมือเดียว', build: () => {
    const h = H(0, {gesture: 'hold-phone', side: 'right', size: PHONE_HAND, forward: [-1, 0.25, -0.45], back: [0, -1, -0.25], wrist: [0.13, 1.12, -0.3]});
    // One-hand grip (grip-area study, Choi et al.: index and the three fingers on the back, wrapping the far side edge; thumb on the screen):
    // the phone's back on the palm, the little finger under its bottom edge as a shelf, so no fingertip comes up through the phone.
    // To touch the screen use phone-tap (the other hand's index): the macro thumb cannot reach across a phone face.
    // Tuned with scripts/painted-kit/prop-contact.ts.
    const sk = skOf(h), face = n(scale3(sk.normal, -1)), o = add3(add3(at(sk, -0.004, 0, 0.02), scale3(face, 0.017)), scale3(sk.forward, 0.024));
    const f0 = frameOf(o, sub3(sk.fingers.index.joints[0], sk.fingers.little.joints[0]), face);
    return {hands: [h], props: [{id: 'phone', frame: {...f0, o: add3(add3(o, scale3(f0.x, 0.024)), scale3(f0.y, 0.052))}}]};
  }},
  'take-pill': {verb: 'a pill in the open palm', th: 'ถือยาเม็ด', build: () => {
    const h = H(0, {gesture: 'cupped', side: 'left', forward: [0.15, 0.25, -1], back: [-0.2, -1, 0.15], wrist: [-0.08, 1.12, -0.3]});
    const sk = skOf(h), up = n(scale3(sk.normal, -1));
    return {hands: [h], props: [{id: 'pill', frame: frameOf(add3(LANDMARKS.rest(sk, 0.0045), scale3(up, 0.002)), n([1, 0, -0.4]), up)}]};
  }},
  'cut-paper': {verb: 'cut paper with scissors', th: 'ตัดกระดาษด้วยกรรไกร', build: () => {
    const l = H(0, {gesture: 'pinch', side: 'left', forward: [0.3, 0.4, -1], back: [-1, 0.2, 0.1], wrist: [-0.12, 1.2, -0.38]});
    const sl = skOf(l), p0 = LANDMARKS.pinch(sl), face = n([0, 0.25, 1]);
    const paper = frameOf(add3(p0, [0.09, -0.06, -0.004]), n([0.2, 1, 0]), face), edge = add3(p0, [0.18, -0.06, 0]);
    // Scissors held like a pistol grip: the rings in the fist, the blades along the fist's axis, reaching the paper edge.
    const A = n([-0.75, 0.25, -0.6]), r = G(1, 'grip', 'right', A, [0.3, 1, -0.2], {landmark: (sk) => LANDMARKS.grip(sk, 0.006), at: sub3(edge, scale3(A, 0.1))});
    const o = LANDMARKS.grip(skOf(r), 0.006);
    return {hands: [l, r], props: [{id: 'paper', frame: paper}, {id: 'scissors', frame: frameOf(o, A, n(cross3(A, face)))}]};
  }},
  'wash-hands': {verb: 'wash hands under a tap', th: 'ล้างมือ', build: () => {
    const hands = (['right', 'left'] as const).map((side, k) => {
      const s = side === 'right' ? 1 : -1;
      return H(k, {gesture: 'relaxed', side, forward: [-s * 0.5, -0.45, -0.8], back: [s * 0.8, 0.6, 0], wrist: [s * 0.09, 1.08, -0.32]});
    });
    const c = mid3(skOf(hands[0]).palmCentre, skOf(hands[1]).palmCentre);
    return {hands, props: [{id: 'tap', frame: frameOf(add3(c, [0, 0.16, -0.06]), UP, [0, 0, 1])}]};
  }},
  'open-box': {verb: 'open a box, hands on its sides', th: 'เปิดกล่อง', build: () => {
    const top: V3 = [0, 1.04, -0.4];
    const hands = (['right', 'left'] as const).map((side, k) => {
      const s = side === 'right' ? 1 : -1;
      return H(k, {gesture: 'relaxed', side, forward: [-s * 0.15, -0.6, -0.75], back: [s, 0.25, 0], put: {landmark: LANDMARKS.palm, at: add3(top, [s * 0.16, -0.06, 0.04])}});
    });
    return {hands, plane: top[1] - 0.2, props: [{id: 'box', frame: frameOf(top, UP, [0, 0, 1])}]};
  }},
  'hold-umbrella': {verb: 'hold an umbrella overhead', th: 'ถือร่ม', build: () => {
    const shaft = n([-0.1, 1, -0.9]), h = G(0, 'grip', 'right', shaft, [1, 0, 0.3], [0.1, 1.22, -0.32]); // tipped forward so the canopy rim is in view
    const sk = skOf(h);
    return {hands: [h], props: [{id: 'umbrella', frame: frameOf(LANDMARKS.grip(sk, 0.006), shaft, [0, 0, 1])}]};
  }},
} satisfies Record<string, PovAction>;
export type PovActionId = keyof typeof POV_ACTIONS;
export const POV_ACTION_IDS = Object.keys(POV_ACTIONS) as PovActionId[];

/** The POV camera for a scene: same eye, turned to the middle of the action (palms and props), so the action sits mid-frame and the arms
 *  come in from the bottom corners. */
export const povCam = (scene: KitScene, base: YCam = POV_CAM): YCam => {
  const pts = [...scene.hands.map((h) => macroSkeleton(h).palmCentre), ...scene.props.map((q) => q.frame.o)];
  const c = scale3(pts.reduce((a, v) => add3(a, v), [0, 0, 0] as V3), 1 / pts.length), d = sub3(c, [base.x, base.y, base.z]);
  const yaw = Math.atan2(d[0], -d[2]) * 0.6, pitch = Math.max(-1.0, Math.min(-0.35, Math.atan2(d[1], Math.hypot(d[0], d[2]))));
  return {...base, yaw, pitch, f: 1050, hy: 1010};
};
/** A plain room around the viewer: floor, back wall and, when the scene has a `plane`, a table top at that height. */
export const paintPovRoom = (p: Painter, cam: YCam, scene: KitScene) => {
  paintQuad(p, cam, 8000, frameOf([0, 1.5, -2.6], UP, [0, 0, 1]), 3, 1.5, '#e4d8c3', false);
  paintQuad(p, cam, 8010, frameOf([0, 0, -0.8], FWD, UP), 3, 1.8, '#b89f80', false);
  if (scene.plane !== undefined) paintQuad(p, cam, 8020, frameOf([0, scene.plane, -0.62], FWD, UP), 0.75, 0.42, '#a8774c');
};

/** Elbow (world) of a POV hand. */
export const povElbow = (h: HandMacro): V3 => { const side: HandSide = h.side === 1 ? 'right' : 'left'; return elbowIK(POV_SHOULDER[side], h.wrist, POLE[side]); };
/** Wrist reach from its shoulder (m); a POV arm holds together up to 0.55. */
export const povReach = (h: HandMacro) => dist3(POV_SHOULDER[h.side === 1 ? 'right' : 'left'], h.wrist);

/** Paint a POV scene (`crisp`: flat fills for the SVG painter; default painted): props behind, each arm far to near (hand and forearm, then its sleeve), props marked `front`. `sleeve` is the tee colour. */
export const paintPovScene = (p: Painter, cam: YCam, scene: KitScene, sleeve = POV_TONE.sleeve, crisp = false, look: HandMacro['look'] = 'classic') => {
  const arms = scene.hands.map((h) => {
    const E = povElbow(h), S = POV_SHOULDER[h.side === 1 ? 'right' : 'left'];
    return {h: {...h, elbow: E, crisp, look, ...(scene.plane !== undefined ? {plane: scene.plane, shadowAlpha: 0.35} : {})} as HandMacro, E, S};
  });
  // The tee sleeve (cuff just below the elbow -> shoulder) goes over the forearm's elbow end, so it is painted after its hand.
  const sleeveOf = ({h, E, S}: (typeof arms)[number], k: number) => paintTube(p, cam, 2900 + k * 4, add3(h.wrist, scale3(sub3(E, h.wrist), 0.82)), S, 0.042, 0.058, sleeve);
  const propsAt = (front: boolean) => scene.props.filter((q) => !!q.front === front).forEach((q, k) => PROPS[q.id].paint(p, cam, 9000 + (front ? 600 : 0) + k * 300, q.frame));
  propsAt(false);
  [...arms].map((a, k) => ({a, k})).sort((x, y) => camDepth(cam, y.a.h.wrist) - camDepth(cam, x.a.h.wrist)).forEach(({a, k}) => { paintHandMacro(p, cam, a.h); sleeveOf(a, k); });
  propsAt(true);
};
