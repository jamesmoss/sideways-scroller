// Distances are logical pixels; times are seconds; speeds are pixels/second.
export const config = {
  width: 960,
  height: 540,
  player: { width: 28, height: 28, speed: 300, startX: 48 },
  projectile: { width: 12, height: 6, speed: 600 },
  target: { width: 32, height: 32, speed: 180 },
  spawnInterval: 0.9,
  fireInterval: 0.18,
  step: 1 / 120,
};
