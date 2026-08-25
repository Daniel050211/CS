# Counter-Strike: The Long Game

An independent, motion-led editorial history of Counter-Strike, from the 1999 Half-Life mod to Counter-Strike 2.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production

```bash
npm run build
npm run preview
```

## Motion and accessibility

- Three.js renders the deferred particle terrain and morphing year glyphs in the nine-scene opening runway.
- GSAP + ScrollTrigger drive the intro, selective reveals, version timeline, and Source 2 shutter.
- Lenis is the only smooth-scroll engine.
- `prefers-reduced-motion: reduce` disables smooth scrolling, pinning, scrubbing, pointer tilt, and decorative transitions.
- Navigation, tabs, links, and controls are keyboard accessible with visible focus.

## Media credits

- `hlds-origin.png`: Ysangkok, Wikimedia Commons, public domain.
- `major-trophy.jpg`: SteelSeries, Wikimedia Commons, CC BY 2.0.
- `iem-katowice.jpg`: Esports Kingdom, Wikimedia Commons, CC BY 2.0.
- `cs2-inferno.jpg`: Hypernapol, Wikimedia Commons, CC BY-SA 4.0.
- `dust2-2001.png` and `dust2-2017.png`: Valve game radar assets archived by the Counter-Strike Wiki.
- `dust2-radar.png`: Current Valve game radar asset extracted from the CS2 depot by MurkyYT/cs2-map-icons.

The in-page captions link to each original file or source archive. Counter-Strike and its map assets are property of Valve Corporation.

Counter-Strike and related marks belong to Valve Corporation. This project is not affiliated with or endorsed by Valve.
