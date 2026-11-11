export type LandscapePixel = {
  x: number;
  y: number;
  color: string;
  alpha: number;
  detail: boolean;
};

const OLIVE = "103,125,105";
const CLAY = "167,106,78";
const SAGE = "137,150,125";

/** A deterministic, five-pixel landscape: desert, woodland, then a small skyline. */
export function createLandscape(width: number, height: number): LandscapePixel[] {
  const size = 5;
  const columns = Math.ceil(width / size);
  const ground = Math.floor(height / size) - 2;
  const cells = new Map<string, LandscapePixel>();
  const noise = (seed: number) => {
    const value = Math.sin(seed * 127.1 + 17.13) * 43758.5453;
    return value - Math.floor(value);
  };
  function pixel(column: number, row: number, color: string, alpha: number, detail = false) {
    if (column < 0 || column >= columns || row < 1 || row > ground) return;
    cells.set(`${column}:${row}`, { x: column * size, y: row * size, color, alpha, detail });
  }
  function block(left: number, top: number, w: number, h: number, color: string, alpha: number) {
    for (let x = left; x < left + w; x++) {
      for (let y = top; y < top + h; y++) pixel(x, y, color, alpha);
    }
  }

  // Sparse ground keeps the strip connected without becoming a solid border.
  for (let x = 0; x < columns; x++) {
    if (noise(x + 20) > .15) pixel(x, ground, SAGE, .22);
    if (noise(x + 70) > .65) pixel(x, ground + 1, SAGE, .12);
  }

  // Stepped mesas and their quieter, distant ridge.
  const ridges = [4, 5, 5, 8, 10, 10, 9, 6, 5, 7, 11, 11, 10, 6, 3, 4, 7, 7, 5, 3];
  const canyonEnd = Math.floor(columns * .44);
  for (let x = 0; x < canyonEnd; x++) {
    const ridge = ridges[Math.min(ridges.length - 1, Math.floor(x / canyonEnd * ridges.length))];
    const edge = Math.min(1, x / 9, (canyonEnd - x) / 9);
    for (let y = ground - ridge; y < ground; y++) {
      const terrace = (ground - y) % 3 === 0;
      pixel(x, y, CLAY, (terrace ? .25 : .13) * edge);
      if (noise(x * 39 + y) > .81 && y > ground - ridge + 1) pixel(x, y, CLAY, .035, true);
    }
  }

  // A small grove bridges canyon and city. Width stays legible on narrow screens.
  for (const [position, tall] of [[.43, 6], [.49, 9], [.55, 7], [.61, 10], [.66, 6]]) {
    const center = Math.round(columns * position);
    for (let y = ground - tall; y < ground - 2; y++) {
      const half = Math.min(3, Math.floor((y - (ground - tall)) / 2));
      for (let x = center - half; x <= center + half; x++) {
        pixel(x, y, OLIVE, noise(x * 17 + y) > .6 ? .31 : .19);
      }
    }
    block(center, ground - 2, 1, 2, CLAY, .28);
    pixel(center - 2, ground - 4, SAGE, .04, true);
    pixel(center + 1, ground - 6, CLAY, .04, true);
  }

  // Rooftops, a stepped tower, and windows that emerge around the pointer.
  const buildings = [[.72, 4, 5], [.76, 5, 8], [.81, 4, 6], [.85, 5, 11], [.90, 4, 7], [.94, 5, 4]];
  for (const [position, buildingWidth, tall] of buildings) {
    const left = Math.round(columns * position);
    const w = Math.max(2, Math.min(buildingWidth, Math.round(columns * .028)));
    block(left, ground - tall, w, tall, OLIVE, .22);
    block(left - 1, ground - tall, w + 2, 1, OLIVE, .32);
    if (tall === 11) {
      block(left + 1, ground - tall - 2, Math.max(1, w - 2), 2, OLIVE, .3);
      pixel(left + Math.floor(w / 2), ground - tall - 3, CLAY, .34);
    }
    for (let x = left + 1; x < left + w; x += 2) {
      for (let y = ground - tall + 2; y < ground - 1; y += 3) pixel(x, y, CLAY, .055, true);
    }
  }
  return [...cells.values()];
}
