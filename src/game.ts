import { config as c } from './config';
import { overlaps, type Rect } from './collision';

export interface Input { x: number; y: number; fire: boolean }
export interface GameState {
  player: Rect;
  projectiles: Rect[];
  targets: Rect[];
  score: number;
  gameOver: boolean;
  spawnIn: number;
  fireIn: number;
}

// Restart uses this same factory: no state survives a new game.
export function createGame(): GameState {
  return {
    player: { x: c.player.startX, y: (c.height - c.player.height) / 2,
      width: c.player.width, height: c.player.height },
    projectiles: [], targets: [], score: 0, gameOver: false,
    spawnIn: c.spawnInterval, fireIn: 0,
  };
}

// Called with small fixed steps by main.ts. Randomness is injectable for tests.
export function update(state: GameState, input: Input, dt: number, random = Math.random): void {
  if (state.gameOver) return;
  const p = state.player;
  const length = Math.max(1, Math.hypot(input.x, input.y));
  p.x = Math.max(0, Math.min(c.width - p.width, p.x + input.x / length * c.player.speed * dt));
  p.y = Math.max(0, Math.min(c.height - p.height, p.y + input.y / length * c.player.speed * dt));

  state.fireIn = Math.max(0, state.fireIn - dt);
  if (input.fire && state.fireIn <= 0) {
    state.projectiles.push({ x: p.x + p.width, y: p.y + (p.height - c.projectile.height) / 2,
      width: c.projectile.width, height: c.projectile.height });
    state.fireIn = c.fireInterval;
  }
  state.spawnIn -= dt;
  if (state.spawnIn <= 0) {
    state.targets.push({ x: c.width, y: random() * (c.height - c.target.height),
      width: c.target.width, height: c.target.height });
    state.spawnIn += c.spawnInterval;
  }
  for (const shot of state.projectiles) shot.x += c.projectile.speed * dt;
  for (const target of state.targets) target.x -= c.target.speed * dt;

  // Player contact takes priority over projectile contact in the same step.
  if (state.targets.some(target => overlaps(p, target))) {
    state.gameOver = true;
    return;
  }
  for (let i = state.projectiles.length - 1; i >= 0; i--) {
    const hit = state.targets.findIndex(target => overlaps(state.projectiles[i], target));
    if (hit !== -1) {
      state.projectiles.splice(i, 1);
      state.targets.splice(hit, 1);
      state.score++;
    }
  }
  state.projectiles = state.projectiles.filter(shot => shot.x < c.width);
  state.targets = state.targets.filter(target => target.x + target.width > 0);
}
