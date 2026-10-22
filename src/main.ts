import './style.css';
import { config } from './config';
import { createGame, update } from './game';
import { createInput } from './input';
import { render } from './render';

const canvas = document.querySelector<HTMLCanvasElement>('#game')!;
const ctx = canvas.getContext('2d')!;
const score = document.querySelector<HTMLElement>('#score')!;
const status = document.querySelector<HTMLElement>('#status')!;
const input = createInput(canvas);
let state = createGame();
let previous = performance.now();
let accumulator = 0;
canvas.style.aspectRatio = `${config.width} / ${config.height}`;
canvas.focus();

document.querySelector('#restart')!.addEventListener('click', () => {
  state = createGame();
  input.clear();
  accumulator = 0;
  previous = performance.now();
  canvas.focus();
});
document.addEventListener('visibilitychange', () => {
  previous = performance.now();
  accumulator = 0;
});

function frame(now: number): void {
  // Cap long stalls; small fixed steps prevent tunnelling at default speeds.
  accumulator += Math.min((now - previous) / 1000, 0.1);
  previous = now;
  while (accumulator >= config.step) {
    update(state, input.read(), config.step);
    accumulator -= config.step;
  }
  render(ctx, state);
  score.textContent = String(state.score);
  status.textContent = state.gameOver ? 'Game over. Restart to try again.' : 'Avoid the boxes.';
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
