export type StudyKind = "lens" | "magnetic" | "interference";
export type StudyPointer = { x: number; y: number; active: boolean };
export type StudyRenderer = (elapsed: number, pointer: StudyPointer, reduced: boolean) => boolean;

const PAPER = "#f0eee5";
const OLIVE = "88,111,94";
const CLAY = "167,106,78";

function cover(image: HTMLImageElement, width: number, height: number) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  return { width: image.naturalWidth * scale, height: image.naturalHeight * scale };
}

export function createLens(context: CanvasRenderingContext2D, width: number, height: number, image: HTMLImageElement): StudyRenderer {
  function imageAtPixelSize(size: number) {
    const buffer = document.createElement("canvas");
    buffer.width = Math.max(1, Math.ceil(width / size));
    buffer.height = Math.max(1, Math.ceil(height / size));
    const ctx = buffer.getContext("2d")!;
    const crop = cover(image, width, height);
    const scaleX = buffer.width / width;
    const scaleY = buffer.height / height;
    ctx.drawImage(image, (width - crop.width) / 2 * scaleX, (height - crop.height) * .46 * scaleY, crop.width * scaleX, crop.height * scaleY);
    return buffer;
  }
  const coarse = imageAtPixelSize(24);
  const fine = imageAtPixelSize(2);
  const cells: { x: number; y: number; reveal: number }[] = [];
  const step = 6;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) cells.push({ x, y, reveal: 0 });
  }

  return (elapsed, pointer, reduced) => {
    context.imageSmoothingEnabled = false;
    context.globalAlpha = 1;
    context.drawImage(coarse, 0, 0, width, height);
    let changing = false;
    const fade = Math.exp(-elapsed / 420);
    for (const cell of cells) {
      const distance = Math.hypot(cell.x + step / 2 - pointer.x, cell.y + step / 2 - pointer.y);
      const brush = pointer.active && !reduced ? Math.min(1, Math.max(0, (110 - distance) / 42)) : 0;
      const previous = cell.reveal;
      cell.reveal = reduced ? 0 : Math.max(brush, cell.reveal * fade);
      if (cell.reveal < .008) cell.reveal = 0;
      if (Math.abs(previous - cell.reveal) > .0001) changing = true;
      if (cell.reveal === 0) continue;
      context.globalAlpha = cell.reveal;
      const w = Math.min(step, width - cell.x);
      const h = Math.min(step, height - cell.y);
      context.drawImage(fine, cell.x / width * fine.width, cell.y / height * fine.height, w / width * fine.width, h / height * fine.height, cell.x, cell.y, w, h);
    }
    context.globalAlpha = 1;
    return changing;
  };
}

export function createMagnetic(context: CanvasRenderingContext2D, width: number, height: number): StudyRenderer {
  const tiles: { x: number; y: number; dx: number; dy: number; energy: number; color: string; alpha: number }[] = [];
  const spacing = 13;
  for (let y = spacing / 2; y < height; y += spacing) {
    for (let x = spacing / 2; x < width; x += spacing) {
      const band = (Math.sin(x * .018 + Math.sin(y * .025) * 2) + 1) / 2;
      tiles.push({ x, y, dx: 0, dy: 0, energy: 0, color: band > .72 ? CLAY : OLIVE, alpha: .28 + band * .32 });
    }
  }
  return (elapsed, pointer, reduced) => {
    context.fillStyle = PAPER;
    context.fillRect(0, 0, width, height);
    const ease = 1 - Math.exp(-elapsed / 95);
    let changing = false;
    for (const tile of tiles) {
      const dx = tile.x - pointer.x;
      const dy = tile.y - pointer.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const energy = pointer.active && !reduced ? Math.max(0, 1 - distance / 155) ** 2 : 0;
      const targetX = (dy / distance * 38 + dx / distance * 12) * energy;
      const targetY = (-dx / distance * 38 + dy / distance * 12) * energy;
      tile.dx += (targetX - tile.dx) * ease;
      tile.dy += (targetY - tile.dy) * ease;
      tile.energy += (energy - tile.energy) * ease;
      if (Math.abs(targetX - tile.dx) + Math.abs(targetY - tile.dy) > .015 || Math.abs(energy - tile.energy) > .001) changing = true;
      context.save();
      context.translate(tile.x + tile.dx, tile.y + tile.dy);
      context.rotate(tile.energy * .85);
      context.fillStyle = `rgba(${tile.color},${tile.alpha + tile.energy * .3})`;
      const size = 6 + tile.energy * 3;
      context.fillRect(-size / 2, -size / 2, size, size);
      context.restore();
    }
    return changing;
  };
}

export function createInterference(context: CanvasRenderingContext2D, width: number, height: number): StudyRenderer {
  let waves: { x: number; y: number; age: number }[] = [];
  let last = { x: -1000, y: -1000, active: false };
  const points: { x: number; y: number; base: number }[] = [];
  for (let y = 3; y < height; y += 6) {
    for (let x = 3; x < width; x += 6) {
      const first = Math.hypot(x - width * .3, (y - height * .35) * 1.7);
      const second = Math.hypot(x - width * .73, (y - height * .8) * 1.2);
      points.push({ x, y, base: (Math.sin(first * .055) + Math.cos(second * .07)) / 2 });
    }
  }
  return (elapsed, pointer, reduced) => {
    context.fillStyle = PAPER;
    context.fillRect(0, 0, width, height);
    if (!reduced && pointer.active && (!last.active || Math.hypot(last.x - pointer.x, last.y - pointer.y) > 22)) {
      waves.push({ x: pointer.x, y: pointer.y, age: 0 });
      waves = waves.slice(-5);
      last = { ...pointer };
    }
    if (!pointer.active) last.active = false;
    waves = reduced ? [] : waves.filter(wave => wave.age < 1900);
    for (const wave of waves) wave.age += elapsed;
    for (const point of points) {
      let ripple = 0;
      for (const wave of waves) {
        const distance = Math.hypot(point.x - wave.x, point.y - wave.y);
        const front = distance - wave.age * .19;
        ripple += Math.sin(front * .11) * Math.exp(-front * front / 2800) * (1 - wave.age / 1900);
      }
      const value = Math.max(-1, Math.min(1, point.base + ripple * 1.8));
      const size = 2.3 + (value + 1) * .85;
      context.fillStyle = `rgba(${value > .48 ? CLAY : OLIVE},${.19 + (value + 1) * .25})`;
      context.fillRect(point.x - size / 2, point.y - size / 2, size, size);
    }
    return waves.length > 0;
  };
}
