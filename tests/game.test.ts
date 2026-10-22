import { describe, expect, it } from 'vitest';
import { overlaps } from '../src/collision';
import { createGame, update, type Input } from '../src/game';
import { config as c } from '../src/config';

const idle: Input = { x: 0, y: 0, fire: false };
const box = (x: number, y: number) => ({ x, y, width: 20, height: 20 });

describe('collisions', () => {
  it('detects overlap and containment, but not separated or touching boxes', () => {
    expect(overlaps(box(0, 0), box(10, 10))).toBe(true);
    expect(overlaps(box(0, 0), { x: 5, y: 5, width: 2, height: 2 })).toBe(true);
    expect(overlaps(box(0, 0), box(20, 0))).toBe(false);
    expect(overlaps(box(0, 0), box(0, 21))).toBe(false);
  });
  it('removes both objects and awards exactly one point per hit', () => {
    const state = createGame();
    state.targets = [box(400, 100)];
    state.projectiles = [box(400, 100), box(400, 100)];
    update(state, idle, 0);
    expect(state.score).toBe(1);
    expect(state.targets).toHaveLength(0);
    expect(state.projectiles).toHaveLength(1);
    update(state, idle, 0);
    expect(state.score).toBe(1);
  });
  it('ends the game on player contact and freezes subsequent updates', () => {
    const state = createGame();
    state.targets = [{ ...state.player }];
    update(state, idle, 0);
    expect(state.gameOver).toBe(true);
    const snapshot = structuredClone(state);
    update(state, { x: 1, y: 1, fire: true }, c.step);
    expect(state).toEqual(snapshot);
  });
  it('discards escaped targets without awarding points or ending the game', () => {
    const state = createGame();
    state.targets = [box(-21, 100)];
    update(state, idle, c.step);
    expect(state.targets).toHaveLength(0);
    expect(state.score).toBe(0);
    expect(state.gameOver).toBe(false);
  });
});

it('restart resets score, objects, player, timers and game-over status', () => {
  let state = createGame();
  const initial = structuredClone(state);
  update(state, { x: 1, y: -1, fire: true }, c.step);
  state.score = 9; state.gameOver = true;
  state.targets.push(box(200, 200));
  state = createGame();
  expect(state).toEqual(initial);
});

it('moves by elapsed time and clamps to the play area', () => {
  const a = createGame(); const b = createGame();
  for (let i = 0; i < 60; i++) update(a, { ...idle, x: 1 }, 1 / 60);
  for (let i = 0; i < 120; i++) update(b, { ...idle, x: 1 }, 1 / 120);
  expect(a.player.x).toBeCloseTo(b.player.x);
  expect(a.player.x).toBeCloseTo(c.player.startX + c.player.speed);
  for (let i = 0; i < 1000; i++) update(a, { ...idle, x: -1, y: -1 }, c.step);
  expect(a.player.x).toBe(0); expect(a.player.y).toBe(0);
});

it('fires immediately, then limits held fire to the configured rate', () => {
  const state = createGame();
  const fire = { ...idle, fire: true };
  update(state, fire, c.step);
  expect(state.projectiles).toHaveLength(1);
  for (let i = 0; i < 10; i++) update(state, fire, c.step);
  expect(state.projectiles).toHaveLength(1);
  for (let i = 0; i < 13; i++) update(state, fire, c.step);
  expect(state.projectiles).toHaveLength(2);
});

it('spawns targets at varying heights inside the logical area', () => {
  const state = createGame();
  state.spawnIn = 0;
  update(state, idle, c.step, () => 0.25);
  expect(state.targets[0].y).toBe((c.height - c.target.height) * 0.25);
  state.spawnIn = 0;
  update(state, idle, c.step, () => 0.75);
  expect(state.targets[1].y).toBe((c.height - c.target.height) * 0.75);
});
