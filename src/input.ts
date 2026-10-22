import type { Input } from './game';

export function createInput(canvas: HTMLCanvasElement) {
  const keys = new Set<string>();
  const codes = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space'];
  const clear = () => keys.clear();
  canvas.addEventListener('keydown', event => {
    if (codes.includes(event.code)) { event.preventDefault(); keys.add(event.code); }
  });
  window.addEventListener('keyup', event => keys.delete(event.code));
  canvas.addEventListener('blur', clear);
  window.addEventListener('blur', clear);
  document.addEventListener('visibilitychange', clear);
  canvas.addEventListener('pointerdown', () => canvas.focus());
  return {
    clear,
    read(): Input {
      return {
        x: Number(keys.has('ArrowRight') || keys.has('KeyD')) - Number(keys.has('ArrowLeft') || keys.has('KeyA')),
        y: Number(keys.has('ArrowDown') || keys.has('KeyS')) - Number(keys.has('ArrowUp') || keys.has('KeyW')),
        fire: keys.has('Space'),
      };
    },
  };
}
