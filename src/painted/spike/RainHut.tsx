import {Easing, interpolate} from 'remotion';
import {BrushCanvas, hash, type PaintContext} from '../BrushCanvas';

type Pt = [number, number];

// Spike shot: a stilt hut over a lagoon at dusk in the rain, slow push-in. Coordinates are in a 1080x1920 frame.
const paint = ({brush, t, width: W, height: H, still, boil}: PaintContext) => {
  const push = interpolate(t, [0, 5], [1, 1.06], {easing: Easing.inOut(Easing.cubic)});
  brush.push();
  brush.translate(W / 2, H * 0.55);
  brush.scale(push);
  brush.translate(-W / 2, -H * 0.55);

  let washId = 0;
  const wash = (color: string, opacity: number, pts: Pt[], bleed = 0.25, texture = 0.5) => {
    still(++washId);
    brush.noStroke();
    brush.fill(color, opacity);
    brush.fillBleed(bleed);
    brush.fillTexture(texture, 0.4);
    brush.polygon(pts);
    brush.noFill();
  };

  // Sky: two overlapping washes, cold above, a little warmth at the horizon.
  wash('#5c6f8f', 200, [[-60, -60], [W + 60, -60], [W + 60, 900], [-60, 980]], 0.2, 0.6);
  wash('#c9a98a', 110, [[-60, 760], [W + 60, 700], [W + 60, 1060], [-60, 1060]], 0.3, 0.4);
  // Far hills.
  wash('#3f4f66', 170, [[-60, 1030], [180, 930], [420, 990], [700, 900], [W + 60, 1000], [W + 60, 1060], [-60, 1060]], 0.15);
  // Lagoon.
  wash('#2f4a57', 210, [[-60, 1050], [W + 60, 1050], [W + 60, H + 60], [-60, H + 60]], 0.2, 0.55);

  // Drifting wave strokes: phase per wave from a fixed hash, so they move but do not jump.
  boil(1);
  brush.set('HB', '#d4e0e2', 1.4);
  for (let i = 0; i < 28; i++) {
    const y = 1090 + hash(i) * 780;
    const len = 60 + hash(i + 50) * 140 * (y / 1400);
    const x = ((hash(i + 100) * (W + 400) + t * (14 + hash(i + 7) * 18)) % (W + 400)) - 200;
    brush.line(x, y, x + len, y + 2);
  }

  // Stilt hut.
  const hutX = 330, hutY = 820, hutW = 420, hutH = 300;
  boil(2);
  brush.set('2B', '#2a2420', 1.3);
  for (const px of [hutX + 30, hutX + 150, hutX + 270, hutX + 390]) brush.line(px, hutY + hutH, px + 4, hutY + hutH + 330);
  wash('#8a6a4a', 230, [[hutX - 40, hutY + hutH], [hutX + hutW + 60, hutY + hutH], [hutX + hutW + 60, hutY + hutH + 26], [hutX - 40, hutY + hutH + 26]], 0.1, 0.3);
  wash('#a57d55', 235, [[hutX, hutY], [hutX + hutW, hutY], [hutX + hutW, hutY + hutH], [hutX, hutY + hutH]], 0.1, 0.45);
  wash('#6b3b2e', 240, [[hutX - 70, hutY + 10], [hutX + hutW / 2, hutY - 210], [hutX + hutW + 70, hutY + 10]], 0.12, 0.5);
  // The one warm light: window plus a breathing glow.
  const glow = 0.85 + 0.15 * Math.sin(t * 2.1);
  wash('#ffcf73', Math.round(90 * glow), [[hutX + 90, hutY + 60], [hutX + 260, hutY + 60], [hutX + 260, hutY + 200], [hutX + 90, hutY + 200]], 0.6, 0.2);
  wash('#ffd98a', 245, [[hutX + 130, hutY + 90], [hutX + 220, hutY + 90], [hutX + 220, hutY + 175], [hutX + 130, hutY + 175]], 0.05, 0.15);
  // Ink outlines boil.
  boil(3);
  brush.set('2B', '#241c18', 1.5);
  brush.noFill();
  brush.polygon([[hutX, hutY], [hutX + hutW, hutY], [hutX + hutW, hutY + hutH], [hutX, hutY + hutH]]);
  brush.polygon([[hutX - 70, hutY + 10], [hutX + hutW / 2, hutY - 210], [hutX + hutW + 70, hutY + 10]]);
  brush.rect(hutX + 130, hutY + 90, 90, 85);
  // Window reflection on the water, broken by the waves.
  boil(4);
  brush.set('marker', '#f0c060', 1.4);
  for (let k = 0; k < 6; k++) {
    const y = 1180 + k * 42;
    const wob = Math.sin(t * 3 + k * 1.7) * 18;
    brush.line(hutX + 140 + wob, y, hutX + 210 + wob - k * 6, y);
  }
  brush.pop();

  // Rain in screen space (not pushed in): each streak falls on its own fixed lane.
  boil(5);
  brush.set('pen', '#e4ebf0', 0.9);
  for (let i = 0; i < 140; i++) {
    const speed = 1500 + hash(i + 300) * 700;
    const x0 = hash(i + 200) * (W + 300) - 150;
    const y = ((hash(i + 400) * (H + 200) + t * speed) % (H + 200)) - 100;
    const x = x0 - (y / H) * 120;
    brush.line(x, y, x - 10, y + 70);
  }
};

export const RainHut = () => <BrushCanvas paint={paint} paper="#e8dfcc" />;
