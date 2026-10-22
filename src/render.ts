import { config as c } from './config';
import type { Rect } from './collision';
import type { GameState } from './game';

export function render(ctx: CanvasRenderingContext2D, state: GameState): void {
  const canvas = ctx.canvas;
  const bounds = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const width = Math.round(bounds.width * ratio);
  const height = Math.round(bounds.height * ratio);
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width; canvas.height = height;
  }
  ctx.setTransform(width / c.width, 0, 0, height / c.height, 0, 0);
  ctx.fillStyle = '#161c24';
  ctx.fillRect(0, 0, c.width, c.height);
  const box = (rect: Rect, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  };
  box(state.player, '#75baff');
  state.projectiles.forEach(shot => box(shot, '#e8edf2'));
  state.targets.forEach(target => box(target, '#eba568'));
  if (state.gameOver) {
    ctx.fillStyle = '#161c24cc'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 36px system-ui';
    ctx.textAlign = 'center'; ctx.fillText('Game over', c.width / 2, c.height / 2);
    ctx.font = '18px system-ui';
    ctx.fillText('Press Restart to play again', c.width / 2, c.height / 2 + 36);
  }
}
