# Sideways

A deliberately small browser arcade game for an AI development factory workshop.
Plain rectangles, TypeScript, Vite and Canvas. No backend, accounts, assets, sound,
external APIs or runtime downloads. Use this skeleton as a starting point.

## Get running

Use Node.js 22.12+ (or Node 24+) and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The first successful install generates
`package-lock.json`; commit it, then use `npm ci` for reproducible workshop installs.

```sh
npm test             # automated tests, one run
npm run test:watch   # tests during development
npm run build       # TypeScript checks and production output in dist/
npm run preview     # serve the production build locally
```

Installation needs the npm registry; the running game needs no external services.

## Play

- Move the blue rectangle with arrow keys or WASD.
- Hold Space to send small rectangles right at a limited rate.
- Hit an orange target for one point; avoid touching targets yourself.
- Targets that pass the left edge disappear without penalty.
- Restart clears the score, objects, player position, timers and held input.

The play area receives keyboard focus on load and restart. Click it to regain
focus after using another control. Losing focus releases held keys. Keyboard
controls are required; touch controls are a possible workshop extension.

## Code map

| File | Responsibility |
| --- | --- |
| `src/config.ts` | Logical size, rectangle sizes, speeds, spawn and fire timing |
| `src/input.ts` | Keyboard input only |
| `src/game.ts` | State factory and game rules; no DOM dependencies |
| `src/collision.ts` | Rectangle overlap checks |
| `src/render.ts` | Canvas drawing and pixel-density scaling |
| `src/main.ts` | Connect input, fixed-step updates, rendering and restart |
| `src/style.css` | Minimal page layout |
| `tests/game.test.ts` | Collision, score, restart, motion, firing and spawn tests |

The logical area is always 960 × 540, scaled to fit the browser. Movement uses
seconds, with 120 simulation steps per second independent of rendering rate.
Long frame stalls are capped at 0.1 seconds; hidden-tab time is discarded.
This intentionally slows simulation during severe stalls instead of jumping
objects across the screen. The default speeds and small steps avoid skipping
collisions. If you greatly increase speeds, consider swept collision detection.
Touching edges do not count as overlap. Player contact takes priority if a target
also meets a projectile in the same simulation step.

## Suggested extension tickets

Choose one small change per ticket; keep acceptance criteria observable.

1. **Pause button.** Add Pause/Resume. Acceptance: positions, score and spawn/fire
   timers stop while paused; resuming continues the same game without a jump.
2. **Player colour picker.** Add three colour choices. Acceptance: selecting one
   immediately changes the player rectangle without changing gameplay.
3. **Best score.** Display a local best score. Acceptance: it updates when beaten
   and remains visible after restart and a browser reload.
4. **Missed-target counter.** Show how many targets escaped. Acceptance: each target
   crossing the left edge adds one; destroyed targets do not; restart resets it.
5. **Touch controls.** Add four movement buttons and a fire button. Acceptance:
   holding a button acts like its keyboard equivalent and releasing stops it.

## Manual smoke check

Run the production preview. Verify all movement keys and boundaries, hold Space
to check firing cadence, hit a target and see the score rise, let a target touch
the player and check game over, then restart and confirm a clean game. Resize the
browser and check the play area retains its proportions. Automated tests exercise
game rules without requiring a browser.

## Verification status

The authoring environment could not resolve `registry.npmjs.org`, and its offline
npm cache was incomplete. Installation was attempted both online and offline.
`npm test` and `npm run build` were attempted but could not start because Vitest
and TypeScript were unavailable. Browser smoke testing is therefore still pending.
Run the commands and manual checklist above before distributing this starter.
