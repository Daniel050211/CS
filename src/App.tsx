import { useLayoutEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CinematicHistory from './components/CinematicHistory'

gsap.registerPlugin(ScrollTrigger)

type MapEra = 'original' | 'global' | 'source2'

type MapRecord = {
  date: string
  title: string
  copy: string
  image: string
  imageAlt: string
  width: number
  height: number
  source: string
  sourceLabel: string
}

const eraFiles = [
  {
    index: '01',
    year: '1999',
    range: 'BETA 1.0',
    title: 'A mod becomes a ritual.',
    copy: 'Minh “Gooseman” Le and Jess Cliffe release the first public beta on June 19. Rounds are short, death is final, and every footstep matters.',
    signal: 'HALF-LIFE MOD',
  },
  {
    index: '02',
    year: '2000',
    range: 'RETAIL 1.0',
    title: 'Valve makes it official.',
    copy: 'Valve acquires Counter-Strike and ships version 1.0. A community experiment becomes a standalone global game.',
    signal: 'NOV 09 / 2000',
  },
  {
    index: '03',
    year: '2003',
    range: 'VERSION 1.6',
    title: 'The competitive language sets.',
    copy: 'Steam distribution, sharper balance, and years of LAN play turn 1.6 into the definitive old-school rulebook.',
    signal: 'STEAM ERA',
  },
  {
    index: '04',
    year: '2004',
    range: 'SOURCE',
    title: 'A divided future.',
    copy: 'Condition Zero adds a campaign. Source rebuilds the game on new technology. The community splits, but the formula survives both sides.',
    signal: 'TWO BRANCHES',
  },
  {
    index: '05',
    year: '2012',
    range: 'GLOBAL OFFENSIVE',
    title: 'One game, one global stage.',
    copy: 'CS:GO launches across PC and consoles, later growing into the platform that unifies matchmaking, operations, skins, and Majors.',
    signal: 'AUG 21 / 2012',
  },
  {
    index: '06',
    year: '2023',
    range: 'COUNTER-STRIKE 2',
    title: 'The tick changes. The tension does not.',
    copy: 'Source 2 lighting, responsive smoke, and a sub-tick architecture replace CS:GO while keeping the same unforgiving round at the center.',
    signal: 'SEP 27 / 2023',
  },
]

const updateFiles = [
  { year: '2013', title: 'Arms Deal', note: 'Weapon finishes reshape the economy around the game.' },
  { year: '2013', title: 'The first Major', note: 'DreamHack Winter begins Valve-backed Major history.' },
  { year: '2015', title: 'A living map pool', note: 'Operations and revisions make maps an evolving competitive system.' },
  { year: '2018', title: 'Free to play', note: 'Danger Zone arrives and the player base opens wider.' },
  { year: '2020', title: 'Remote competition', note: 'A global scene adapts while arenas go quiet.' },
  { year: '2023', title: 'The final Major', note: 'Paris closes the CS:GO chapter after nineteen Majors.' },
]

const mapData: Record<MapEra, MapRecord> = {
  original: {
    date: '2001 / DE_DUST2',
    title: 'The routes were already there.',
    copy: 'David Johnston’s original Dust II establishes the enduring two-site layout: Long and Short converge on A, tunnels feed B, and Mid connects every rotation.',
    image: './assets/dust2-2001.png',
    imageAlt: 'Original Counter-Strike Dust II overhead radar from 2001',
    width: 1024,
    height: 768,
    source: 'https://counterstrike.fandom.com/wiki/File:De_dust2.png',
    sourceLabel: 'Counter-Strike Wiki archive',
  },
  global: {
    date: '2017 / CS:GO REMAKE',
    title: 'New landmarks. Familiar rotations.',
    copy: 'The 2017 remake rebuilds the surface detail, cover, and visual landmarks while preserving the recognizable route structure and round rhythm.',
    image: './assets/dust2-2017.png',
    imageAlt: 'Counter-Strike Global Offensive Dust II spectator radar after the 2017 remake',
    width: 1024,
    height: 1024,
    source: 'https://counterstrike.fandom.com/wiki/File:De_dust2_new_radar_spectate.png',
    sourceLabel: 'Counter-Strike Wiki archive',
  },
  source2: {
    date: '2023–2026 / SOURCE 2',
    title: 'A touchstone map.',
    copy: 'In Counter-Strike 2, Dust II receives brighter lighting and modern materials with minimal gameplay changes—the same routes remain readable in a newer engine.',
    image: './assets/dust2-radar.png',
    imageAlt: 'Current Counter-Strike 2 Dust II in-game radar',
    width: 1024,
    height: 1024,
    source: 'https://github.com/MurkyYT/cs2-map-icons/blob/main/images/radars/de_dust2_radar_psd.png',
    sourceLabel: 'Valve game depot asset',
  },
}

function Header({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const links = [
    ['origin', 'Origin'],
    ['eras', 'Versions'],
    ['living-game', 'Living game'],
    ['map-dna', 'Map DNA'],
    ['source-2', 'CS2'],
  ]

  return (
    <header className="site-header">
      <a className="archive-mark" href="#top" title="Back to top">
        <span>CS</span>
        <span>ARCHIVE / 24Y</span>
      </a>
      <nav
        id="mobile-nav"
        className={menuOpen ? 'nav-links is-open' : 'nav-links'}
        aria-label="History chapters"
      >
        {links.map(([id, label], index) => (
          <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
            <span>0{index + 1}</span>
            {label}
          </a>
        ))}
      </nav>
      <button
        className="menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span>{menuOpen ? 'Close' : 'Index'}</span>
        <i aria-hidden="true" />
      </button>
    </header>
  )
}

function OriginFile() {
  return (
    <section className="origin chapter" id="origin" aria-labelledby="origin-title">
      <div className="section-rule">
        <span>01 / ORIGIN FILE</span>
        <span>PUBLIC BETA</span>
      </div>
      <div className="origin-layout">
        <div className="origin-year reveal" aria-hidden="true">19<br />99</div>
        <div className="origin-copy">
          <p className="eyebrow reveal">A MOD FOR HALF-LIFE</p>
          <h2 id="origin-title" className="reveal">Built after hours.<br />Played for decades.</h2>
          <p className="lead reveal">
            Counter-Strike did not arrive with a campaign or a launch spectacle. It arrived as a free beta,
            passed from server to server, refined in public by the people playing it.
          </p>
          <dl className="fact-list reveal">
            <div><dt>Creators</dt><dd>Minh Le + Jess Cliffe</dd></div>
            <div><dt>First beta</dt><dd>June 19, 1999</dd></div>
            <div><dt>The rule</dt><dd>No respawn until the round ends</dd></div>
          </dl>
        </div>
        <figure className="terminal-evidence reveal">
          <div className="evidence-label">
            <span>SERVER EVIDENCE / 2006</span>
            <span>PUBLIC DOMAIN</span>
          </div>
          <img
            src="./assets/hlds-origin.png"
            alt="A Half-Life Dedicated Server terminal running the Counter-Strike mod"
            width="1120"
            height="772"
            loading="lazy"
          />
          <figcaption>
            A server log: the less glamorous machinery behind the phenomenon.{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Cstrike_hlds.png" target="_blank" rel="noreferrer">
              Source / public domain
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function EraTimeline() {
  return (
    <section className="eras chapter" id="eras" aria-labelledby="eras-title">
      <div className="eras-intro">
        <div className="section-rule">
          <span>02 / VERSION HISTORY</span>
          <span>6 PRIMARY BUILDS</span>
        </div>
        <p className="eyebrow reveal">SAME ROUND / NEW MACHINES</p>
        <h2 id="eras-title" className="reveal">Every rebuild left<br />the ritual intact.</h2>
      </div>
      <div className="era-pin">
        <div className="era-track">
          {eraFiles.map((era) => (
            <article className="era-card" key={era.year + era.range}>
              <div className="era-index">{era.index}</div>
              <div className="era-year">{era.year}</div>
              <div className="era-body">
                <p className="eyebrow">{era.range}</p>
                <h3>{era.title}</h3>
                <p>{era.copy}</p>
              </div>
              <div className="era-signal">
                <span>{era.signal}</span>
                <i aria-hidden="true" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function GlobalOffensive() {
  return (
    <section className="global-offensive chapter" aria-labelledby="global-title">
      <div className="go-number reveal" aria-hidden="true">GO</div>
      <div className="go-copy">
        <p className="eyebrow reveal">AUGUST 21 / 2012</p>
        <h2 id="global-title" className="reveal">The version that<br />became a world.</h2>
        <p className="lead reveal">
          Global Offensive began as another iteration. Matchmaking, operations, weapon finishes, and a
          shared professional circuit turned it into something larger: a place people lived in.
        </p>
      </div>
      <figure className="trophy-evidence reveal">
        <img
          src="./assets/major-trophy.jpg"
          alt="The trophy for the 2016 MLG Columbus CS:GO Major"
          width="1280"
          height="853"
          loading="lazy"
        />
        <figcaption>
          <span>MLG COLUMBUS / 2016</span>
          <a
            href="https://commons.wikimedia.org/wiki/File:MLG_Columbus_CSGO_Major_cup.jpg"
            target="_blank"
            rel="noreferrer"
          >
            STEELSERIES / CC BY 2.0
          </a>
        </figcaption>
      </figure>
    </section>
  )
}

function LivingGame() {
  return (
    <section className="living-game chapter" id="living-game" aria-labelledby="living-title">
      <div className="section-rule">
        <span>03 / THE LIVING GAME</span>
        <span>2013 — 2023</span>
      </div>
      <div className="living-heading">
        <p className="eyebrow reveal">NOT A SEQUEL / A PRACTICE</p>
        <h2 id="living-title" className="reveal">It changed while<br />everyone watched.</h2>
      </div>
      <div className="update-list">
        {updateFiles.map((update, index) => (
          <article className="update-row reveal" key={update.year + update.title}>
            <div className="update-no">0{index + 1}</div>
            <time>{update.year}</time>
            <h3>{update.title}</h3>
            <p>{update.note}</p>
            <span aria-hidden="true">↗</span>
          </article>
        ))}
      </div>
      <figure className="arena-evidence reveal">
        <img
          src="./assets/iem-katowice.jpg"
          alt="The packed arena at the IEM Katowice Major in 2019"
          width="1280"
          height="853"
          loading="lazy"
        />
        <div className="arena-overlay">
          <span>THE SERVER BECAME A STADIUM</span>
          <strong>1 ROUND<br />AT A TIME</strong>
        </div>
        <figcaption>
          Spodek arena, IEM Katowice Major 2019.{' '}
          <a
            href="https://commons.wikimedia.org/wiki/File:IEM_Katowice_Major_2019.jpg"
            target="_blank"
            rel="noreferrer"
          >
            Esports Kingdom / CC BY 2.0
          </a>
        </figcaption>
      </figure>
    </section>
  )
}

function MapDNA() {
  const [selected, setSelected] = useState<MapEra>('original')
  const current = mapData[selected]

  return (
    <section className="map-dna chapter" id="map-dna" aria-labelledby="map-title">
      <div className="section-rule">
        <span>04 / MAP DNA</span>
        <span>CASE STUDY: DUST II</span>
      </div>
      <div className="map-layout">
        <div className="map-copy">
          <p className="eyebrow reveal">A PLACE EVERYONE REMEMBERS</p>
          <h2 id="map-title" className="reveal">The map changed.<br />The timings stayed.</h2>
          <div className="map-tabs reveal" role="tablist" aria-label="Dust II versions">
            {(Object.keys(mapData) as MapEra[]).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={selected === key}
                onClick={() => setSelected(key)}
              >
                {key === 'original' ? '01 / ORIGINAL' : key === 'global' ? '02 / CS:GO' : '03 / CS2'}
              </button>
            ))}
          </div>
          <div className="map-description" aria-live="polite">
            <p className="eyebrow">{current.date}</p>
            <h3>{current.title}</h3>
            <p>{current.copy}</p>
          </div>
        </div>
        <figure className={`map-plate map-${selected} reveal`} data-tilt>
          <div className="map-grid" aria-hidden="true" />
          <img
            key={current.image}
            className="map-image"
            src={current.image}
            alt={current.imageAlt}
            width={current.width}
            height={current.height}
            loading="lazy"
          />
          <span className="map-stamp" aria-hidden="true">{current.date}</span>
          <figcaption>
            Real in-game Dust II radar. © Valve Corporation.{' '}
            <a href={current.source} target="_blank" rel="noreferrer">{current.sourceLabel}</a>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function SourceTwo() {
  return (
    <section className="source-two chapter" id="source-2" aria-labelledby="source-title">
      <figure className="source-image">
        <img
          src="./assets/cs2-inferno.jpg"
          alt="A firefight on Inferno in Counter-Strike 2"
          width="1920"
          height="1080"
          loading="lazy"
        />
        <div className="source-shutter" aria-hidden="true" />
        <figcaption>
          Inferno in Counter-Strike 2.{' '}
          <a href="https://commons.wikimedia.org/wiki/File:CS2_Inferno_Fight.jpg" target="_blank" rel="noreferrer">
            Hypernapol / CC BY-SA 4.0
          </a>
        </figcaption>
      </figure>
      <div className="source-copy">
        <p className="eyebrow reveal">SEPTEMBER 27 / 2023</p>
        <h2 id="source-title" className="reveal">A new engine.<br />An old heartbeat.</h2>
        <p className="lead reveal">
          Smoke reacts to bullets. Light fills old corridors. The server reads actions between ticks.
          Yet the question at the start of every round is unchanged: what will the other five do?
        </p>
        <div className="source-specs reveal">
          <span>SOURCE 2</span>
          <span>SUB-TICK</span>
          <span>RESPONSIVE SMOKE</span>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-statement">
        <p className="eyebrow">THE FILE REMAINS OPEN</p>
        <p>Maps become memory.<br />Rounds become stories.</p>
      </div>
      <div className="footer-bottom">
        <p>
          An independent editorial history. Counter-Strike and related marks belong to Valve Corporation.
          No affiliation or endorsement is implied.
        </p>
        <div>
          <a href="#top">Return to top ↑</a>
          <span>1999 — FOREVER</span>
        </div>
      </div>
    </footer>
  )
}

function App() {
  const root = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useLayoutEffect(() => {
    const rootElement = root.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let lenis: Lenis | undefined

    if (!reducedMotion) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true })
      ;(window as Window & { __lenis?: Lenis }).__lenis = lenis
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => lenis?.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      const context = gsap.context(() => {
        gsap.fromTo('.site-header', { opacity: 0 }, { opacity: 1, duration: 0.55, ease: 'power3.out' })

        gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
          gsap.from(element, {
            y: 46,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 87%', once: true },
          })
        })

        const track = document.querySelector<HTMLElement>('.era-track')
        if (track && window.innerWidth > 900) {
          gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth),
            ease: 'none',
            scrollTrigger: {
              trigger: '.era-pin',
              start: 'top top',
              end: () => `+=${track.scrollWidth - window.innerWidth}`,
              pin: true,
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          })
        }

        gsap.fromTo(
          '.source-shutter',
          { clipPath: 'inset(0 0 0 0)' },
          {
            clipPath: 'inset(0 0 100% 0)',
            ease: 'none',
            scrollTrigger: { trigger: '.source-two', start: 'top 70%', end: 'center 45%', scrub: true },
          },
        )

        gsap.to('.scroll-progress', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.1 },
        })
      }, root)

      const tiltElements = rootElement?.querySelectorAll<HTMLElement>('[data-tilt]')
      const resetTilt = () => tiltElements?.forEach((element) => {
        element.style.transform = ''
      })
      const onPointerMove = (event: PointerEvent) => {
        const target = (event.target as HTMLElement).closest<HTMLElement>('[data-tilt]')
        if (!target || event.pointerType === 'touch') return
        const bounds = target.getBoundingClientRect()
        const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 6
        const rotateX = -((event.clientY - bounds.top) / bounds.height - 0.5) * 6
        target.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      }
      const onPointerOut = (event: PointerEvent) => {
        const target = (event.target as HTMLElement).closest<HTMLElement>('[data-tilt]')
        if (target && !target.contains(event.relatedTarget as Node)) target.style.transform = ''
      }

      rootElement?.addEventListener('pointermove', onPointerMove)
      rootElement?.addEventListener('pointerout', onPointerOut)
      window.addEventListener('blur', resetTilt)
      document.addEventListener('visibilitychange', resetTilt)

      return () => {
        context.revert()
        rootElement?.removeEventListener('pointermove', onPointerMove)
        rootElement?.removeEventListener('pointerout', onPointerOut)
        window.removeEventListener('blur', resetTilt)
        document.removeEventListener('visibilitychange', resetTilt)
        gsap.ticker.remove(tick)
        lenis?.destroy()
        delete (window as Window & { __lenis?: Lenis }).__lenis
      }
    }

    gsap.set('.scroll-progress', { scaleX: 1 })
    return undefined
  }, [])

  return (
    <div ref={root}>
      <div className="scroll-progress" aria-hidden="true" />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main id="main">
        <CinematicHistory />
        <OriginFile />
        <EraTimeline />
        <GlobalOffensive />
        <LivingGame />
        <MapDNA />
        <SourceTwo />
      </main>
      <Footer />
    </div>
  )
}

export default App
