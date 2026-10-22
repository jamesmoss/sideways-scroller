# sideways-scroller

A deliberately small browser arcade game.
Plain rectangles, TypeScript, Vite and Canvas. No backend, accounts, assets, sound,
external APIs or runtime downloads. Use this skeleton as a starting point.

## Get running

Use Node.js 22.12+ (or Node 24+) and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The first successful install generates
`package-lock.json`; commit it, then use `npm ci` for reproducible installs.

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
controls are required; touch controls are a possible extension.

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
6. **Lives.** Give the player three lives. Acceptance: touching a target removes
   one life and clears nearby targets; game over happens only at zero lives.
7. **Difficulty ramp.** Spawn targets faster over time. Acceptance: spawn interval
   shortens every 15 seconds down to a fixed minimum; restart resets it.
8. **Start screen.** Show a title and "Press Space to start". Acceptance: nothing
   moves or spawns until the player starts; restart returns to play directly.
9. **Score popups.** Show "+1" where a target is destroyed. Acceptance: the text
   floats upward and fades within one second without affecting collisions.
10. **Target variety.** Add a larger, slower target worth three points. Acceptance:
    it spawns less often than normal targets and needs two hits to destroy.
11. **Elapsed timer.** Display survival time. Acceptance: it counts in seconds
    during play, stops at game over and resets on restart.
12. **Combo multiplier.** Reward consecutive hits. Acceptance: each hit within two
    seconds of the last raises the multiplier by one; a miss or timeout resets it.
13. **Ammo limit.** Limit shots to ten that refill slowly. Acceptance: firing stops
    at zero, one shot returns every half second and the count is displayed.
14. **Shield power-up.** Spawn an occasional green pickup. Acceptance: collecting it
    makes the player survive the next target contact, shown by a visible outline.
15. **Rapid-fire power-up.** Spawn an occasional pickup that doubles fire rate.
    Acceptance: the effect lasts five seconds and a countdown shows its remaining time.
16. **Screen shake.** Shake the play area on game over. Acceptance: shaking lasts
    under half a second and does not change logical positions or collisions.
17. **Starfield background.** Draw small dots scrolling left at different speeds.
    Acceptance: dots wrap around continuously and are drawn behind everything else.
18. **Wavy targets.** Make some targets move in a sine wave. Acceptance: they stay
    inside the vertical bounds and still disappear after passing the left edge.
19. **Target that shoots back.** Add a target that fires left at the player.
    Acceptance: its shots end the game on contact and can be destroyed by projectiles.
20. **Accuracy stat.** Show hits divided by shots on game over. Acceptance: it shows
    as a whole percentage, reads 0% with no shots and resets on restart.
21. **Keyboard remapping.** Let players choose alternative fire keys. Acceptance:
    the chosen key fires, Space still works and the choice survives reload.
22. **High-contrast mode.** Add a toggle for a high-contrast palette. Acceptance:
    all objects and text remain distinguishable and the toggle survives reload.
23. **Pause on blur.** Pause automatically when the window loses focus. Acceptance:
    returning shows a paused state and the game resumes only after a key press.
24. **Leaderboard.** Keep the top five local scores with initials. Acceptance:
    a qualifying score asks for three letters and the list survives reload.
25. **Debug overlay.** Toggle hitboxes and an FPS readout with a key. Acceptance:
    the overlay draws rectangle outlines and counts without changing gameplay.
26. **Bomb.** Press B to clear all targets on screen once per game. Acceptance:
    cleared targets score normally and the bomb indicator disappears after use.
27. **Charged shot.** Holding Space for one second fires a larger projectile.
    Acceptance: it passes through targets, destroying each one it touches.
28. **Spread shot power-up.** Add a pickup that fires three projectiles at once.
    Acceptance: shots angle up, straight and down for five seconds.
29. **Player trail.** Draw fading copies behind the player while moving.
    Acceptance: the trail vanishes when still and never affects collisions.
30. **Target health bars.** Show remaining hits above multi-hit targets.
    Acceptance: the bar shrinks on each hit and disappears with the target.
31. **Boss target.** Spawn a large target every 30 points. Acceptance: it needs
    twenty hits, normal spawns pause while it lives and destroying it scores ten.
32. **Level counter.** Advance a level every 10 points. Acceptance: the level shows
    on screen, a brief "Level N" banner appears and restart returns to level 1.
33. **Obstacles.** Add grey blocks that scroll left and cannot be destroyed.
    Acceptance: projectiles stop on them and touching one ends the game.
34. **Slow-motion power-up.** Add a pickup that halves target speed. Acceptance:
    the effect lasts five seconds and the player and projectiles move normally.
35. **Magnet pickups.** Make power-ups drift towards a nearby player. Acceptance:
    pickups within 120 units move towards the player; others travel normally.
36. **Projectile recoil.** Nudge the player slightly left on each shot. Acceptance:
    recoil never pushes the player outside the play area.
37. **Edge wrap mode.** Add an option for vertical screen wrap. Acceptance: moving
    off the top appears at the bottom and vice versa; the default stays bounded.
38. **Game over summary.** Show score, time, hits and best on game over.
    Acceptance: every value matches the finished game and restart hides it.
39. **Countdown restart.** Show 3, 2, 1 before play resumes after restart.
    Acceptance: nothing moves or spawns during the countdown.
40. **Speed boost.** Hold Shift to move faster for a limited time. Acceptance:
    a meter drains while boosting and refills when Shift is released.
41. **Seeded spawns.** Add a seed setting for target spawn positions. Acceptance:
    the same seed produces the same spawn sequence across reloads.
42. **Target colours by speed.** Colour faster targets differently. Acceptance:
    at least three speed bands map to distinct colours visible in both themes.
43. **Hit flash.** Flash targets white briefly when hit but not destroyed.
    Acceptance: the flash lasts under 0.2 seconds and does not change behaviour.
44. **Gamepad support.** Allow a connected gamepad to move and fire. Acceptance:
    the left stick and D-pad move, a face button fires and keyboard still works.
45. **Reduced motion.** Respect the system reduced-motion setting. Acceptance:
    shake, trails and flashing effects are disabled while gameplay is unchanged.
