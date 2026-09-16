# Matteo Fornara, Personal Portfolio

This is my personal portfolio: the site I point people to when they ask what I do. I am a UX/UI designer, frontend developer and interaction designer, and the site collects my work, my background and a way to get in touch.

Published with GitHub Pages at https://matthewovens.github.io/PersonalPortfolio/

## What is on the site

- **Introduction**, who I am, plus the button that turns on hand navigation.
- **Projects**, case studies for Navia, Tune Crafter, SnacMan, EcoLens and HosTown, each opening in a dialog with the full story.
- **Journey**, my work and study history, from the Bachelor in Computer Science to co-founding Halfpast.
- **Contacts**, email and LinkedIn.

## Hand navigation

The site can be browsed without touching mouse or keyboard. Clicking the hand button in the introduction asks for the webcam and opens a short tutorial that teaches the gestures by having you use them:

- **Pinch** index finger and thumb, then move your hand to scroll. The page follows the hand directly, so the position is absolute rather than a per frame nudge.
- **Close your fist** to click whatever sits under the on screen cursor.
- Move the cursor near the top of the screen and the navbar drops down toward your hand, since the very top edge is hard to reach comfortably.

Hand tracking runs fully in the browser through MediaPipe Tasks Vision. The video never leaves the machine, nothing is recorded or uploaded, and turning hand navigation off releases the camera.

A couple of things worth knowing about the implementation:

- The tracked landmarks are smoothed with a One Euro filter (`src/utils/OneEuroFilter.ts`), which keeps the cursor steady when the hand is still without adding lag when it moves fast.
- Recognition is capped at 30fps, because the recognizer is the expensive part of the loop and falls back to software on machines without GPU acceleration.
- A fist click dispatches a synthetic mouse event, which carries no user activation, so links that open in a new tab need the special handling in `clickAt` and `followLink` (see `src/components/GestureComponents.tsx`).

## Built with

React 18, TypeScript, Vite, React Bootstrap and MediaPipe Tasks Vision.

## Running it locally

```bash
npm install
npm run dev
```

Other scripts:

- `npm run build`, type checks with `tsc` and then builds into `dist/`.
- `npm run preview`, serves the production build.
- `npm run lint`, runs ESLint.

The webcam needs a secure context, so hand navigation works on `localhost` in dev and over HTTPS in production.

## Layout

```
src/
  components/      sections, navbar, dialogs, tutorial, gesture layer
  assets/data/     project and journey content
  models/          gesture state machine
  utils/           One Euro filter, scroll target, helpers
```

## Deployment

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages. In the repository settings, Pages must be set to the "GitHub Actions" source.

Since Pages serves a project repository from a sub path, `vite.config.ts` sets `base: '/PersonalPortfolio/'`. Moving to a custom domain or to a `<user>.github.io` repository means setting it back to `'/'`.
