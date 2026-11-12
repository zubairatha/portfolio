export type SceneKind = "pond" | "boats";
export type Point = { x: number; y: number };
export type ScenePointer = Point & { active: boolean; speed: number; vx: number; vy: number; keyboard: boolean };
type Ripple = Point & { age: number; strength: number };
type Wake = Point & { age: number };

const TAU = Math.PI * 2;
const INK = "#536c60";
const CLAY = "#b56d4d";
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));
const angleDifference = (from: number, to: number) => Math.atan2(Math.sin(to - from), Math.cos(to - from));
const hash = (seed: number) => { const n = Math.sin(seed * 127.1 + 31.7) * 43758.5453; return n - Math.floor(n); };
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

function inside(point: Point, polygon: Point[]) {
  let hit = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i], b = polygon[j];
    if ((a.y > point.y) !== (b.y > point.y) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) hit = !hit;
  }
  return hit;
}

/** Colored character cells retain their grid alignment while the shapes move through them. */
class GlyphPainter {
  readonly cell: number;
  readonly row: number;
  constructor(readonly ctx: CanvasRenderingContext2D, width: number) {
    this.cell = width < 600 ? 4 : 5;
    this.row = this.cell + 1;
    ctx.font = `${this.cell + 2}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  }
  tile(x: number, y: number, color: string, opacity: number, glyph = ":", ink = INK) {
    const { ctx, cell, row } = this;
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.fillRect(x + .5, y + .5, cell - .7, row - .7);
    ctx.globalAlpha = opacity * .55;
    ctx.fillStyle = ink;
    ctx.fillText(glyph, x + cell / 2, y + row / 2);
  }
  glyph(x: number, y: number, glyph: string, color: string, opacity: number) {
    this.ctx.globalAlpha = Math.max(0, opacity);
    this.ctx.fillStyle = color;
    this.ctx.fillText(glyph, Math.round(x / this.cell) * this.cell + this.cell / 2, Math.round(y / this.row) * this.row + this.row / 2);
  }
  polygon(points: Point[], color: string, opacity: number, glyph = "/", ink = INK) {
    const left = Math.floor(Math.min(...points.map(p => p.x)) / this.cell) * this.cell;
    const right = Math.max(...points.map(p => p.x));
    const top = Math.floor(Math.min(...points.map(p => p.y)) / this.row) * this.row;
    const bottom = Math.max(...points.map(p => p.y));
    for (let y = top; y <= bottom; y += this.row) {
      for (let x = left; x <= right; x += this.cell) {
        if (inside({ x: x + this.cell / 2, y: y + this.row / 2 }, points)) this.tile(x, y, color, opacity, glyph, ink);
      }
    }
  }
}

abstract class WaterScene {
  time = 0;
  ripples: Ripple[] = [];
  wakes: Wake[] = [];
  constructor(public width: number, public height: number) {}
  protected waterStep(dt: number) {
    this.time += dt;
    this.ripples.forEach(ripple => ripple.age += dt);
    this.ripples = this.ripples.filter(ripple => ripple.age < 2.6);
    this.wakes.forEach(wake => wake.age += dt);
    this.wakes = this.wakes.filter(wake => wake.age < 2.8).slice(-180);
  }
  protected water(ctx: CanvasRenderingContext2D, flowing: boolean) {
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, this.width, this.height);
    const paint = new GlyphPainter(ctx, this.width);
    // Sparse punctuation gives the entire rectangle a water surface.
    for (let y = 18; y < this.height; y += 29) {
      for (let x = 12; x < this.width; x += 21) {
        const seed = Math.floor(x / 21) * 17 + Math.floor(y / 29) * 31;
        if (hash(seed) < (flowing ? .47 : .78)) continue;
        const shift = flowing ? Math.sin(x * .012 + this.time * .3) * 8 : Math.sin(this.time * .3 + seed) * 2;
        paint.glyph(x, y + shift, flowing && seed % 3 === 0 ? "~" : seed % 2 ? "." : "-", INK, flowing ? .14 : .085);
      }
    }
    for (const wake of this.wakes) paint.glyph(wake.x, wake.y, wake.age < 1 ? ":" : ".", INK, .22 * (1 - wake.age / 2.8));
    for (const ripple of this.ripples) {
      for (let ring = 0; ring < 2; ring++) {
        const age = ripple.age - ring * .22;
        if (age < 0) continue;
        const radius = age * (42 + ripple.strength * 30);
        const alpha = Math.max(0, 1 - ripple.age / 2.6) ** 2 * (.25 + ripple.strength * .25);
        const count = Math.max(8, Math.ceil(radius * TAU / 8));
        for (let i = 0; i < count; i++) {
          const angle = i / count * TAU;
          const glyph = Math.abs(Math.sin(angle)) > .75 ? "-" : Math.abs(Math.cos(angle)) > .75 ? "|" : Math.sin(angle) * Math.cos(angle) > 0 ? "\\" : "/";
          paint.glyph(ripple.x + Math.cos(angle) * radius, ripple.y + Math.sin(angle) * radius * .76, glyph, INK, alpha);
        }
      }
    }
    return paint;
  }
  protected marker(paint: GlyphPainter, pointer: ScenePointer) {
    if (pointer.keyboard && pointer.active) paint.glyph(pointer.x, pointer.y, "+", CLAY, .85);
    paint.ctx.globalAlpha = 1;
  }
  abstract resize(width: number, height: number): void;
  abstract step(dt: number, pointer: ScenePointer): void;
  abstract interact(x: number, y: number): void;
  abstract draw(ctx: CanvasRenderingContext2D, pointer: ScenePointer): void;
}

export type Fish = {
  id: number; nodes: Point[]; heading: number; length: number; speed: number;
  phase: number; goal: Point; nextGoal: number; fright: number; wake: number;
};
type Pellet = Point & { age: number };

export class KoiPond extends WaterScene {
  fish: Fish[] = [];
  food: Pellet[] = [];
  eaten = 0;
  constructor(width: number, height: number) { super(width, height); this.seed(); }
  private seed() {
    const length = clamp(Math.min(this.width * .18, this.height * .48), 74, 150);
    this.fish = [
      { x: .23, y: .3, heading: -.18 },
      { x: .5, y: .3, heading: Math.PI + .12 },
      { x: .78, y: .3, heading: .45 },
      { x: .23, y: .73, heading: Math.PI - .2 },
      { x: .5, y: .73, heading: .12 },
      { x: .78, y: .73, heading: Math.PI + .3 },
    ].map((start, id) => {
      const size = length * (1 - (id % 3) * .12);
      const head = { x: start.x * this.width, y: start.y * this.height };
      return { id, length: size, heading: start.heading, speed: 22, phase: id * 2.1, fright: 0, wake: 0, nextGoal: 0, goal: { ...head },
        nodes: Array.from({ length: 20 }, (_, i) => ({ x: head.x - Math.cos(start.heading) * i * size * .82 / 19, y: head.y - Math.sin(start.heading) * i * size * .82 / 19 })) };
    });
  }
  resize(width: number, height: number) {
    const sx = width / this.width, sy = height / this.height;
    this.width = width; this.height = height;
    const length = clamp(Math.min(width * .18, height * .48), 74, 150);
    for (const fish of this.fish) {
      fish.nodes.forEach(node => { node.x *= sx; node.y *= sy; });
      fish.goal.x *= sx; fish.goal.y *= sy;
      fish.length = length * (1 - (fish.id % 3) * .12);
    }
    this.food.forEach(p => { p.x *= sx; p.y *= sy; });
    this.ripples = []; this.wakes = [];
  }
  interact(x: number, y: number) {
    this.ripples.push({ x, y, age: 0, strength: .8 });
    for (let i = 0; i < 6 && this.food.length < 24; i++) {
      const angle = i * 2.4 + this.time;
      const radius = 5 + i * 2.5;
      this.food.push({ x: clamp(x + Math.cos(angle) * radius, 8, this.width - 8), y: clamp(y + Math.sin(angle) * radius, 8, this.height - 8), age: 0 });
    }
    this.ripples = this.ripples.slice(-18);
  }
  step(dt: number, pointer: ScenePointer) {
    dt = Math.min(dt, .05);
    this.waterStep(dt);
    this.food.forEach(p => p.age += dt);
    this.food = this.food.filter(p => p.age < 14);
    for (const fish of this.fish) {
      const head = fish.nodes[0];
      if (this.time > fish.nextGoal || distance(head, fish.goal) < fish.length * .3) {
        const seed = Math.floor(this.time * 2) + fish.id * 57;
        fish.goal = { x: (.12 + hash(seed) * .76) * this.width, y: (.18 + hash(seed + 9) * .64) * this.height };
        fish.nextGoal = this.time + 4 + hash(seed + 1) * 6;
      }
      const food = this.food.filter(p => p.age > .12).sort((a, b) => distance(head, a) - distance(head, b))[0];
      let target = fish.goal;
      const pointerDistance = distance(head, pointer);
      if (pointer.active && pointer.speed > 900 && pointerDistance < fish.length * 1.1 && !food) fish.fright = 1.4;
      fish.fright = Math.max(0, fish.fright - dt);
      if (food) target = food;
      else if (fish.fright > 0) target = { x: head.x + (head.x - pointer.x) * 3, y: head.y + (head.y - pointer.y) * 3 };
      else if (pointer.active && pointerDistance < 240) {
        const angle = Math.atan2(head.y - pointer.y, head.x - pointer.x) + .7;
        const radius = fish.length * .48;
        target = { x: pointer.x + Math.cos(angle) * radius, y: pointer.y + Math.sin(angle) * radius };
      }
      const targetDistance = Math.max(1, distance(head, target));
      let dx = (target.x - head.x) / targetDistance, dy = (target.y - head.y) / targetDistance;
      for (const other of this.fish) {
        if (other === fish) continue;
        const d = Math.max(1, distance(head, other.nodes[0]));
        const personalSpace = (fish.length + other.length) * .19;
        if (d < personalSpace) {
          const force = (1 - d / personalSpace) * (food ? 1 : 2.4);
          dx += (head.x - other.nodes[0].x) / d * force;
          dy += (head.y - other.nodes[0].y) / d * force;
        }
      }
      const margin = Math.min(65, fish.length * .5);
      dx += Math.max(0, 1 - head.x / margin) * 3 - Math.max(0, 1 - (this.width - head.x) / margin) * 3;
      dy += Math.max(0, 1 - head.y / margin) * 3 - Math.max(0, 1 - (this.height - head.y) / margin) * 3;
      const turn = food || fish.fright > 0 ? 2.6 : 1.15;
      fish.heading += clamp(angleDifference(fish.heading, Math.atan2(dy, dx)), -turn * dt, turn * dt);
      const targetSpeed = (17 + fish.length * .055) * (food ? 2.15 : fish.fright > 0 ? 3 : .8 + .3 * Math.sin(this.time * .7 + fish.id));
      fish.speed += (targetSpeed - fish.speed) * Math.min(1, dt * 2.8);
      head.x = clamp(head.x + Math.cos(fish.heading) * fish.speed * dt, 5, this.width - 5);
      head.y = clamp(head.y + Math.sin(fish.heading) * fish.speed * dt, 5, this.height - 5);
      let backward = fish.heading + Math.PI;
      for (let i = 1; i < fish.nodes.length; i++) {
        const previous = fish.nodes[i - 1], node = fish.nodes[i];
        const following = Math.atan2(node.y - previous.y, node.x - previous.x);
        // Limit bend between adjacent vertebrae, so a turn forms a smooth arc.
        backward += clamp(angleDifference(backward, following), -.13, .13);
        const segment = fish.length * .82 / 19;
        node.x = previous.x + Math.cos(backward) * segment;
        node.y = previous.y + Math.sin(backward) * segment;
      }
      fish.phase += dt * (2 + fish.speed * .075);
      fish.wake += dt;
      if (fish.wake > .32) { this.wakes.push({ ...fish.nodes[18], age: 0 }); fish.wake = 0; }
      if (food && distance(head, food) < 11) {
        this.food.splice(this.food.indexOf(food), 1);
        this.eaten++;
        this.ripples.push({ ...head, age: 0, strength: .35 });
      }
    }
    this.ripples = this.ripples.slice(-24);
  }
  draw(ctx: CanvasRenderingContext2D, pointer: ScenePointer) {
    const paint = this.water(ctx, false);
    for (const fish of this.fish) this.drawFish(paint, fish);
    for (const pellet of this.food) {
      const drop = Math.max(0, 1 - pellet.age / .18) * 15;
      paint.glyph(pellet.x, pellet.y - drop, pellet.age < .18 ? "'" : "o", CLAY, .85);
    }
    this.marker(paint, pointer);
  }
  private drawFish(paint: GlyphPainter, fish: Fish) {
    const spine = fish.nodes.map((node, i) => {
      const a = fish.nodes[Math.max(0, i - 1)], b = fish.nodes[Math.min(19, i + 1)];
      const angle = Math.atan2(b.y - a.y, b.x - a.x);
      const swing = Math.sin(fish.phase - i / 19 * 5) * (i / 19) ** 2 * fish.length * .038;
      return { x: node.x - Math.sin(angle) * swing, y: node.y + Math.cos(angle) * swing };
    });
    const local = (index: number, along: number, side: number): Point => {
      const at = spine[index], next = spine[Math.min(19, index + 1)], prev = spine[Math.max(0, index - 1)];
      const heading = Math.atan2(prev.y - next.y, prev.x - next.x);
      return { x: at.x + Math.cos(heading) * along - Math.sin(heading) * side, y: at.y + Math.sin(heading) * along + Math.cos(heading) * side };
    };
    const L = fish.length;
    const opacity = .9 + Math.sin(this.time * .22 + fish.id) * .08;
    // Translucent paired fins and a forked, swinging tail.
    for (const sign of [-1, 1]) {
      paint.polygon([local(5, 0, sign * L * .08), local(5, -L * .19, sign * L * (.22 + .02 * Math.sin(fish.phase))), local(5, -L * .13, sign * L * .06)], "#adb5a0", .48, sign > 0 ? "/" : "\\");
    }
    paint.polygon([local(19, 0, 0), local(19, -L * .2, L * .14), local(19, -L * .13, 0), local(19, -L * .2, -L * .14)], fish.id % 3 === 1 ? "#c28a65" : "#b7bba9", .68, "/");
    const pad = L * .15;
    const minX = Math.floor((Math.min(...spine.map(p => p.x)) - pad) / paint.cell) * paint.cell;
    const maxX = Math.max(...spine.map(p => p.x)) + pad;
    const minY = Math.floor((Math.min(...spine.map(p => p.y)) - pad) / paint.row) * paint.row;
    const maxY = Math.max(...spine.map(p => p.y)) + pad;
    const body: { x: number; y: number; color: string; glyph: string; alpha: number }[] = [];
    for (let y = minY; y < maxY; y += paint.row) {
      for (let x = minX; x < maxX; x += paint.cell) {
        const px = x + paint.cell / 2, py = y + paint.row / 2;
        let nearest = Infinity, progress = 0, side = 0;
        for (let i = 0; i < 19; i++) {
          const a = spine[i], b = spine[i + 1];
          const dx = b.x - a.x, dy = b.y - a.y, squared = dx * dx + dy * dy;
          const t = clamp(((px - a.x) * dx + (py - a.y) * dy) / Math.max(.001, squared), 0, 1);
          const d = Math.hypot(px - a.x - dx * t, py - a.y - dy * t);
          if (d < nearest) { nearest = d; progress = (i + t) / 19; side = ((px - a.x) * -dy + (py - a.y) * dx) / Math.sqrt(Math.max(.001, squared)); }
        }
        const radius = L * (progress < .18 ? .065 + progress / .18 * .065 : .13 * Math.pow((1 - progress) / .82, .9) + .008);
        if (nearest > radius) continue;
        const grain = hash(Math.floor(progress * 35) * 31 + Math.floor(side / 4) + fish.id * 71);
        const patch = Math.sin(progress * 17 + fish.id * 2 + side / L * 5) + grain * .4;
        let color = "#d1cebc";
        if (fish.id % 3 === 1 ? patch > -.25 : patch > .67) color = grain > .5 ? "#bd5937" : "#d77e48";
        if (fish.id % 3 === 2 && patch < -.72) color = "#6a7665";
        const glyph = [":", "%", "s", "#", "."][Math.floor(grain * 5)];
        body.push({ x, y, color, glyph, alpha: opacity * (nearest / radius > .85 ? .6 : 1) });
      }
    }
    for (const cell of body) {
      paint.ctx.globalAlpha = .065;
      paint.ctx.fillStyle = INK;
      paint.ctx.fillRect(cell.x + 5, cell.y + 8, paint.cell, paint.row);
    }
    for (const cell of body) paint.tile(cell.x, cell.y, cell.color, cell.alpha, cell.glyph, "#555348");
    for (const sign of [-1, 1]) {
      const eye = local(1, 0, sign * L * .052);
      paint.glyph(eye.x, eye.y, "o", "#37443a", .95);
    }
  }
}

export type Boat = Point & { id: number; length: number; vx: number; vy: number; direction: number; angle: number; bob: number; wake: number };
export class PaperRiver extends WaterScene {
  boats: Boat[];
  constructor(width: number, height: number) {
    super(width, height);
    this.boats = [{ x: .22, y: .45 }, { x: .56, y: .7 }, { x: .8, y: .32 }].map((p, id) => ({ id, x: p.x * width, y: p.y * height, length: clamp(width * .105, 58, 100) * (1 - id * .09), vx: 10, vy: 0, direction: id === 1 ? -1 : 1, angle: -.08 + id * .09, bob: 0, wake: 0 }));
  }
  resize(width: number, height: number) {
    const sx = width / this.width, sy = height / this.height;
    this.width = width; this.height = height;
    for (const boat of this.boats) { boat.x *= sx; boat.y *= sy; boat.length = clamp(width * .105, 58, 100) * (1 - boat.id * .09); }
    this.ripples = []; this.wakes = [];
  }
  interact(x: number, y: number) {
    this.ripples.push({ x, y, age: 0, strength: 1 });
    this.ripples = this.ripples.slice(-12);
  }
  step(dt: number, pointer: ScenePointer) {
    dt = Math.min(dt, .05);
    this.waterStep(dt);
    for (const boat of this.boats) {
      const margin = boat.length * .6;
      if (boat.x > this.width - margin) boat.direction = -1;
      if (boat.x < margin) boat.direction = 1;
      let vx = boat.direction * (10 + Math.sin(this.time * .3 + boat.id) * 3);
      let vy = Math.sin(boat.x * .014 + this.time * .3 + boat.id) * 4;
      const dx = pointer.x - boat.x, dy = pointer.y - boat.y, d = Math.max(1, Math.hypot(dx, dy));
      if (pointer.active && d < 190) {
        const force = (1 - d / 190) ** 2;
        vx += (clamp(pointer.vx * .065, -65, 65) - dy / d * 30 + dx / d * 9) * force;
        vy += (clamp(pointer.vy * .065, -65, 65) + dx / d * 30 + dy / d * 9) * force;
      }
      let rocking = 0;
      for (const ripple of this.ripples) {
        const distanceToWave = distance(boat, ripple);
        const front = distanceToWave - ripple.age * 72;
        const force = Math.exp(-front * front / 650) * (1 - ripple.age / 2.6);
        vx += (boat.x - ripple.x) / Math.max(1, distanceToWave) * force * 55;
        vy += (boat.y - ripple.y) / Math.max(1, distanceToWave) * force * 55;
        rocking += Math.sin(front * .1) * force * .2;
      }
      vy += Math.max(0, 1 - boat.y / 65) * 25 - Math.max(0, 1 - (this.height - boat.y) / 45) * 25;
      boat.vx += (vx - boat.vx) * dt * 1.6;
      boat.vy += (vy - boat.vy) * dt * 1.6;
      boat.x = clamp(boat.x + boat.vx * dt, margin * .65, this.width - margin * .65);
      boat.y = clamp(boat.y + boat.vy * dt, 42, this.height - 25);
      const angle = clamp(boat.vy / 45, -.28, .28) + Math.sin(this.time * .9 + boat.id * 2) * .045 + rocking;
      boat.angle += (angle - boat.angle) * dt * 3;
      boat.bob = Math.sin(this.time * 1.1 + boat.id * 2) * 2;
      boat.wake += dt;
      if (boat.wake > .22) { this.wakes.push({ x: boat.x - boat.direction * boat.length * .35, y: boat.y + boat.length * .12, age: 0 }); boat.wake = 0; }
    }
  }
  draw(ctx: CanvasRenderingContext2D, pointer: ScenePointer) {
    const paint = this.water(ctx, true);
    for (const boat of this.boats) {
      const L = boat.length;
      const point = (x: number, y: number): Point => ({ x: boat.x + (x * Math.cos(boat.angle) - y * Math.sin(boat.angle)) * L, y: boat.y + boat.bob + (x * Math.sin(boat.angle) + y * Math.cos(boat.angle)) * L });
      const polygon = (coordinates: number[][]) => coordinates.map(([x, y]) => point(x, y));
      const shadow = polygon([[-.45, .1], [.45, .1], [.25, .27], [-.25, .27]]);
      paint.polygon(shadow, "#a4ad96", .16, ".");
      // Two folded peaks meet the shallow hull: a paper boat, viewed from the bank.
      paint.polygon(polygon([[-.38, 0], [-.03, -.4], [-.03, .08]]), "#ddd6bf", .98, "/", "#8a8a70");
      paint.polygon(polygon([[-.03, -.4], [.34, 0], [-.03, .08]]), "#e8e1cd", .98, "\\", "#999880");
      paint.polygon(polygon([[-.5, -.025], [.02, .07], [-.24, .23]]), boat.id === 1 ? "#a9b29b" : "#cfae8e", .95, "-", "#8a765e");
      paint.polygon(polygon([[.5, -.025], [.02, .07], [-.24, .23], [.27, .23]]), boat.id === 2 ? "#adbaa6" : "#c68d6b", .9, ":", "#866f59");
      const crease = point(-.03, -.16);
      paint.glyph(crease.x, crease.y, "/", "#8e8f75", .65);
    }
    this.marker(paint, pointer);
  }
}

export type LivingScene = KoiPond | PaperRiver;
export function createLivingScene(kind: SceneKind, width: number, height: number): LivingScene {
  return kind === "pond" ? new KoiPond(width, height) : new PaperRiver(width, height);
}
