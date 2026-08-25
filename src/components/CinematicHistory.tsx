import { useLayoutEffect, useRef, type MutableRefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const storyScenes = [
  {
    glyph: 'CS',
    marker: 'SC.00 / THE LONG GAME',
    title: 'Counter-Strike',
    copy: 'An interactive history of the versions, maps, and moments that shaped the round that never ended.',
    note: 'SCROLL TO DEPLOY',
  },
  {
    glyph: '1999',
    marker: 'SC.01 / PUBLIC BETA',
    title: 'A mod becomes a ritual.',
    copy: 'Two teams. One life. Minh Le and Jess Cliffe release a new kind of tension into Half-Life.',
    note: 'JUNE 19 / 1999',
  },
  {
    glyph: '1.6',
    marker: 'SC.02 / THE STANDARD',
    title: 'The language sets.',
    copy: 'Economy, recoil, timings, callouts. Version 1.6 becomes the rulebook for competitive Counter-Strike.',
    note: 'STEAM ERA / 2003',
  },
  {
    glyph: '2004',
    marker: 'SC.03 / TWO BRANCHES',
    title: 'The future splits.',
    copy: 'Condition Zero adds a campaign. Source rebuilds the world. The community chooses both.',
    note: 'CZ + SOURCE',
  },
  {
    glyph: '2012',
    marker: 'SC.04 / GLOBAL OFFENSIVE',
    title: 'One global stage.',
    copy: 'Matchmaking, operations, weapon finishes, and a shared professional circuit turn a sequel into a place.',
    note: 'AUGUST 21 / 2012',
  },
  {
    glyph: '2013',
    marker: 'SC.05 / THE MAJOR ERA',
    title: 'The server becomes a stadium.',
    copy: 'DreamHack Winter begins a decade of Valve-backed Majors, packed arenas, and impossible final rounds.',
    note: 'MAJOR 01 / 19',
    image: './assets/major-trophy.jpg',
    imageAlt: 'The trophy for the 2016 MLG Columbus CS:GO Major',
  },
  {
    glyph: '2018',
    marker: 'SC.06 / OPEN ACCESS',
    title: 'The doors open wider.',
    copy: 'CS:GO becomes free to play. New players enter; the same unforgiving five-versus-five waits inside.',
    note: 'FREE TO PLAY',
  },
  {
    glyph: 'CS2',
    marker: 'SC.07 / SOURCE 2',
    title: 'A new engine. An old heartbeat.',
    copy: 'Responsive smoke, new light, and sub-tick architecture replace CS:GO without replacing its central question.',
    note: 'SEPTEMBER 27 / 2023',
    image: './assets/cs2-inferno.jpg',
    imageAlt: 'A firefight on Inferno in Counter-Strike 2',
  },
  {
    glyph: '∞',
    marker: 'SC.08 / THE FILE REMAINS OPEN',
    title: 'Maps become memory.',
    copy: 'Rounds become stories. The next one begins in fifteen seconds.',
    note: 'STILL ACTIVE',
  },
]

const storyDuration = storyScenes.length - 1
const sceneEnterDuration = 0.74
const sceneExitDuration = 0.62
const finalSceneHold = 0.8

const terrainVertexShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uPointer;
  uniform vec2 uImpact;
  uniform float uImpactAge;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vAlpha;
  varying float vHeat;
  varying float vElevation;
  varying float vImpact;

  void main() {
    vec3 p = position;
    p.z = mod(p.z + uProgress * 58.0 + 35.0, 46.0) - 35.0;
    float radial = length(p.xz) * 0.038;
    float slowTime = uTime * 0.11;
    float broadRidge =
      sin(p.x * 0.19 + p.z * 0.11 + slowTime) * 1.05 +
      cos(p.z * 0.16 - p.x * 0.08 - slowTime * 0.7) * 0.82;
    float foldedRidge = pow(
      1.0 - abs(sin(p.x * 0.105 - p.z * 0.145 + uProgress * 3.4)),
      2.4
    ) * 1.42;
    float distantRange = sin((p.x + p.z) * 0.07 - uProgress * 5.0) * 0.72;
    p.y =
      broadRidge +
      foldedRidge +
      distantRange +
      sin(p.x * 0.48 + p.z * 0.23 + aSeed * 2.0) * 0.22 -
      radial;

    vec4 baseMvPosition = modelViewMatrix * vec4(p, 1.0);
    vec4 baseClipPosition = projectionMatrix * baseMvPosition;
    vec2 screenPoint = baseClipPosition.xy / max(abs(baseClipPosition.w), 0.001);

    vec2 pointerDelta = screenPoint - uPointer;
    float pointerDistance = max(length(pointerDelta), 0.004);
    float pointerForce = exp(-pointerDistance * pointerDistance * 18.0);
    p.x += normalize(pointerDelta).x * pointerForce * (0.42 + aSeed * 0.24);
    p.y += pointerForce * (0.9 + aSeed * 0.65);

    vec2 impactDelta = screenPoint - uImpact;
    float impactDistance = max(length(impactDelta), 0.004);
    float impactLife = 1.0 - smoothstep(0.1, 1.58, uImpactAge);
    float waveRadius = uImpactAge * 1.55;
    float wave = exp(-pow(impactDistance - waveRadius, 2.0) * 105.0) * impactLife;
    float wake = sin((impactDistance - waveRadius) * 25.0) *
      exp(-abs(impactDistance - waveRadius) * 7.0) * impactLife;
    float globalReach = smoothstep(0.16, 0.74, uImpactAge) *
      (1.0 - smoothstep(0.96, 1.58, uImpactAge));
    float globalRipple = sin(impactDistance * 11.0 - uImpactAge * 13.0) *
      globalReach * 0.34;
    float pinch = exp(-impactDistance * impactDistance * 34.0) * impactLife;
    vec2 tangent = normalize(vec2(-impactDelta.y, impactDelta.x));
    p.xz += tangent * pinch * sin(impactDistance * 34.0 - uImpactAge * 13.0) * 0.52;
    p.x += normalize(impactDelta).x * (wave * 1.05 + wake * 0.26 - pinch * 0.3);
    p.z += normalize(impactDelta).y * (wave * 0.82 + wake * 0.2 - pinch * 0.24);
    p.y += wave * (2.15 + aSeed) + wake * 0.72 +
      globalRipple +
      pinch * sin(uImpactAge * 11.0 + aSeed * 3.0) * 0.82;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (1.25 + aSeed * 1.7) * uPixelRatio * (12.0 / max(1.0, -mvPosition.z));
    vAlpha = smoothstep(-35.0, -4.0, p.z) * (1.0 - smoothstep(4.0, 10.0, p.z));
    vHeat = aSeed;
    vElevation = clamp((p.y + 2.2) / 5.8, 0.0, 1.0);
    vImpact = clamp(
      wave + abs(wake) * 0.45 + abs(globalRipple) * 0.72 + pinch * 0.2,
      0.0,
      1.0
    );
  }
`

const terrainFragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  varying float vAlpha;
  varying float vHeat;
  varying float vElevation;
  varying float vImpact;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float distanceToCenter = length(center);
    float circle = 1.0 - smoothstep(0.2, 0.5, distanceToCenter);
    vec3 radar = vec3(0.52, 0.78, 0.1);
    vec3 amber = vec3(1.0, 0.29, 0.045);
    vec3 source = vec3(0.12, 0.66, 0.78);
    float warmPhase = smoothstep(0.16, 0.58, uProgress);
    float sourcePhase = smoothstep(0.66, 0.96, uProgress);
    vec3 eraColor = mix(radar, amber, warmPhase);
    eraColor = mix(eraColor, source, sourcePhase);
    float shimmer = 0.5 + 0.5 * sin(uTime * 0.35 + vHeat * 13.0);
    vec3 summit = mix(vec3(0.78, 0.94, 0.2), vec3(0.92, 0.91, 0.8), warmPhase);
    summit = mix(summit, vec3(0.55, 0.92, 1.0), sourcePhase);
    float highlight = clamp(vElevation * 0.68 + smoothstep(0.82, 1.0, vHeat) * 0.36 + shimmer * 0.06, 0.0, 1.0);
    vec3 color = mix(eraColor, summit, highlight);
    color = mix(color, vec3(0.88, 1.0, 0.48), vImpact * 0.82);
    gl_FragColor = vec4(color, circle * vAlpha * (0.86 + vImpact * 0.14));
  }
`

const glyphVertexShader = `
  uniform float uMorph;
  uniform float uPixelRatio;
  uniform float uProgress;
  uniform vec2 uPointer;
  uniform vec2 uImpact;
  uniform float uImpactAge;
  attribute vec3 aTarget;
  attribute float aSeed;
  varying float vAlpha;
  varying float vImpact;

  float easeInOut(float t) {
    return t * t * (3.0 - 2.0 * t);
  }

  void main() {
    float morph = easeInOut(uMorph);
    vec3 p = mix(position, aTarget, morph);
    float burst = sin(morph * 3.14159265);
    vec3 direction = normalize(vec3(p.xy + 0.001, aSeed - 0.5));
    p += direction * burst * (0.18 + aSeed * 0.38);
    p.z += sin((aSeed + uProgress) * 18.0) * burst * 0.28;

    vec2 pointerDelta = p.xy - uPointer * vec2(5.2, 2.8);
    float pointerDistance = max(length(pointerDelta), 0.08);
    float pointerForce = exp(-pointerDistance * pointerDistance * 0.22);
    p.xy += normalize(pointerDelta) * pointerForce * (0.38 + aSeed * 0.3);
    p.z += pointerForce * 1.15;

    vec2 impactPoint = uImpact * vec2(5.2, 2.8);
    vec2 impactDelta = p.xy - impactPoint;
    float impactDistance = max(length(impactDelta), 0.08);
    float impactLife = 1.0 - smoothstep(0.08, 1.38, uImpactAge);
    float waveRadius = uImpactAge * 5.2;
    float wave = exp(-pow(impactDistance - waveRadius, 2.0) * 1.05) * impactLife;
    float pinch = exp(-impactDistance * impactDistance * 0.45) * impactLife;
    p.xy += normalize(impactDelta) * (wave * 0.72 - pinch * 0.32);
    p.z += wave * 1.6 + pinch * 0.8;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (1.7 + aSeed * 1.5) * uPixelRatio * (10.0 / max(1.0, -mvPosition.z));
    float introVisibility = mix(0.2, 1.0, smoothstep(0.035, 0.12, uProgress));
    vAlpha = (0.55 + aSeed * 0.45) * introVisibility;
    vImpact = clamp(wave + pinch * 0.35, 0.0, 1.0);
  }
`

const glyphFragmentShader = `
  uniform float uProgress;
  varying float vAlpha;
  varying float vImpact;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float circle = 1.0 - smoothstep(0.2, 0.5, length(center));
    vec3 bone = vec3(0.93, 0.91, 0.86);
    vec3 source = vec3(0.55, 0.9, 1.0);
    vec3 color = mix(bone, source, smoothstep(0.68, 1.0, uProgress) * 0.48);
    color = mix(color, vec3(0.82, 1.0, 0.38), vImpact * 0.74);
    gl_FragColor = vec4(color, circle * vAlpha);
  }
`

function createGlyphPositions(label: string, count: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 280
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) return new Float32Array(count * 3)

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#fff'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.font = label.length > 3 ? '900 150px Arial' : '900 185px Arial'
  context.fillText(label, canvas.width / 2, canvas.height / 2)

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data
  const found: Array<[number, number]> = []
  for (let y = 0; y < canvas.height; y += 3) {
    for (let x = 0; x < canvas.width; x += 3) {
      if (pixels[(y * canvas.width + x) * 4 + 3] > 100) found.push([x, y])
    }
  }

  const positions = new Float32Array(count * 3)
  const safePoints = found.length > 0 ? found : [[canvas.width / 2, canvas.height / 2] as [number, number]]
  for (let index = 0; index < count; index += 1) {
    const [x, y] = safePoints[index % safePoints.length]
    const cycle = Math.floor(index / safePoints.length)
    const jitter = cycle === 0 ? 0 : ((index * 17) % 11 - 5) * 0.004
    positions[index * 3] = (x - canvas.width / 2) / 46 + jitter
    positions[index * 3 + 1] = -(y - canvas.height / 2) / 46 + 1.35 + jitter
    positions[index * 3 + 2] = ((index * 31) % 17 - 8) * 0.008
  }
  return positions
}

function yieldToMain() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, 0)
  })
}

async function setupWebGL(
  canvas: HTMLCanvasElement,
  stage: HTMLElement,
  progressRef: MutableRefObject<number>,
) {
  const THREE = await import('three')
  await yieldToMain()
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x090a08, 0.045)

  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 100)
  camera.position.set(0, 4.8, 11.5)
  camera.lookAt(0, 0.2, -4)

  const pointer = new THREE.Vector2()
  const pointerTarget = new THREE.Vector2()
  const terrainImpact = new THREE.Vector2(100, 100)
  const glyphImpact = new THREE.Vector2(100, 100)
  const clock = new THREE.Clock()
  const pixelRatio = Math.min(window.devicePixelRatio, 1.5)

  const columns = 150
  const rows = 120
  const terrainCount = columns * rows
  const terrainPositions = new Float32Array(terrainCount * 3)
  const terrainSeeds = new Float32Array(terrainCount)
  let terrainIndex = 0

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const offset = terrainIndex * 3
      terrainPositions[offset] = (column / (columns - 1) - 0.5) * 40
      terrainPositions[offset + 1] = 0
      terrainPositions[offset + 2] = (row / (rows - 1) - 0.75) * 46
      terrainSeeds[terrainIndex] = ((terrainIndex * 73) % 997) / 997
      terrainIndex += 1
    }
  }
  await yieldToMain()

  const terrainGeometry = new THREE.BufferGeometry()
  terrainGeometry.setAttribute('position', new THREE.BufferAttribute(terrainPositions, 3))
  terrainGeometry.setAttribute('aSeed', new THREE.BufferAttribute(terrainSeeds, 1))

  const terrainUniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uPointer: { value: pointer },
    uImpact: { value: terrainImpact },
    uImpactAge: { value: 10 },
    uPixelRatio: { value: pixelRatio },
  }
  const terrainMaterial = new THREE.ShaderMaterial({
    uniforms: terrainUniforms,
    vertexShader: terrainVertexShader,
    fragmentShader: terrainFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const terrain = new THREE.Points(terrainGeometry, terrainMaterial)
  scene.add(terrain)
  await yieldToMain()

  const glyphCount = 8_000
  const glyphTargets: Float32Array[] = []
  for (const item of storyScenes) {
    glyphTargets.push(createGlyphPositions(item.glyph, glyphCount))
    await yieldToMain()
  }
  const glyphSeeds = new Float32Array(glyphCount)
  for (let index = 0; index < glyphCount; index += 1) glyphSeeds[index] = ((index * 47) % 991) / 991

  const glyphGeometry = new THREE.BufferGeometry()
  glyphGeometry.setAttribute('position', new THREE.BufferAttribute(glyphTargets[0], 3))
  glyphGeometry.setAttribute('aTarget', new THREE.BufferAttribute(glyphTargets[1], 3))
  glyphGeometry.setAttribute('aSeed', new THREE.BufferAttribute(glyphSeeds, 1))

  const glyphUniforms = {
    uMorph: { value: 0 },
    uPixelRatio: { value: pixelRatio },
    uProgress: { value: 0 },
    uPointer: { value: pointer },
    uImpact: { value: glyphImpact },
    uImpactAge: { value: 10 },
  }
  const glyphMaterial = new THREE.ShaderMaterial({
    uniforms: glyphUniforms,
    vertexShader: glyphVertexShader,
    fragmentShader: glyphFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const glyphPoints = new THREE.Points(glyphGeometry, glyphMaterial)
  glyphPoints.position.set(0, 1.1, -1.4)
  scene.add(glyphPoints)
  await yieldToMain()

  let activeGlyph = 0
  let impactStartedAt = -10
  let frame = 0
  let pageVisible = !document.hidden
  let inViewport = true
  let lastPointerX = Number.POSITIVE_INFINITY
  let lastPointerY = Number.POSITIVE_INFINITY

  const resize = () => {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    renderer.setSize(width, height, false)
    camera.aspect = width / Math.max(height, 1)
    camera.updateProjectionMatrix()
    terrainUniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.5)
    glyphUniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 1.5)
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!inViewport || event.pointerType === 'touch') return
    const bounds = stage.getBoundingClientRect()
    pointerTarget.set(
      ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
      -((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
    )
  }

  const onPointerLeave = () => {
    pointerTarget.set(0, 0)
  }

  const onPointerDown = (event: PointerEvent) => {
    if (!inViewport || event.button !== 0 || event.pointerType === 'touch') return
    const bounds = stage.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
    const y = -((event.clientY - bounds.top) / bounds.height - 0.5) * 2
    pointerTarget.set(x, y)
    terrainImpact.set(x, y)
    glyphImpact.set(x, y)
    impactStartedAt = clock.getElapsedTime()
  }

  const onVisibilityChange = () => {
    pageVisible = !document.hidden
  }

  const render = () => {
    if (pageVisible && inViewport) {
      const progress = THREE.MathUtils.clamp(progressRef.current, 0, 1)
      const glyphProgress = progress * (glyphTargets.length - 1)
      const nextGlyph = Math.min(Math.floor(glyphProgress), glyphTargets.length - 2)
      const morph = glyphProgress - nextGlyph
      const now = clock.getElapsedTime()

      if (nextGlyph !== activeGlyph) {
        activeGlyph = nextGlyph
        glyphGeometry.setAttribute('position', new THREE.BufferAttribute(glyphTargets[activeGlyph], 3))
        glyphGeometry.setAttribute('aTarget', new THREE.BufferAttribute(glyphTargets[activeGlyph + 1], 3))
      }

      pointer.lerp(pointerTarget, 0.075)
      terrainUniforms.uTime.value = now
      terrainUniforms.uProgress.value = progress
      terrainUniforms.uImpactAge.value = now - impactStartedAt
      glyphUniforms.uProgress.value = progress
      glyphUniforms.uMorph.value = morph
      glyphUniforms.uImpactAge.value = now - impactStartedAt
      glyphPoints.rotation.y = pointer.x * 0.105
      glyphPoints.rotation.x = pointer.y * 0.06
      glyphPoints.position.x = pointer.x * 0.22
      glyphPoints.position.y = 1.1 + pointer.y * 0.12
      camera.position.x = pointer.x * 0.72
      camera.position.y = 4.8 + pointer.y * 0.38
      camera.lookAt(0, 0.2, -4)

      if (Math.abs(pointer.x - lastPointerX) > 0.001 || Math.abs(pointer.y - lastPointerY) > 0.001) {
        lastPointerX = pointer.x
        lastPointerY = pointer.y
        stage.style.setProperty('--story-scene-x', `${(pointer.x * 11).toFixed(2)}px`)
        stage.style.setProperty('--story-scene-y', `${(pointer.y * -8).toFixed(2)}px`)
        stage.style.setProperty('--story-vignette-x', `${(pointer.x * -8).toFixed(2)}px`)
        stage.style.setProperty('--story-vignette-y', `${(pointer.y * 6).toFixed(2)}px`)
        stage.style.setProperty('--story-hud-x', `${(pointer.x * -5).toFixed(2)}px`)
        stage.style.setProperty('--story-hud-y', `${(pointer.y * -3).toFixed(2)}px`)
        stage.style.setProperty('--story-progress-x', `${(pointer.x * 4).toFixed(2)}px`)
        stage.style.setProperty('--story-progress-y', `${(pointer.y * 2).toFixed(2)}px`)
      }

      renderer.render(scene, camera)
    }
    frame = requestAnimationFrame(render)
  }

  const observer = new IntersectionObserver(([entry]) => {
    inViewport = entry.isIntersecting
    if (!inViewport) pointerTarget.set(0, 0)
  }, { threshold: 0.01 })

  resize()
  observer.observe(stage)
  window.addEventListener('resize', resize)
  stage.addEventListener('pointermove', onPointerMove, { passive: true })
  stage.addEventListener('pointerleave', onPointerLeave)
  stage.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('blur', onPointerLeave)
  document.addEventListener('visibilitychange', onVisibilityChange)
  frame = requestAnimationFrame(render)

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    window.removeEventListener('resize', resize)
    stage.removeEventListener('pointermove', onPointerMove)
    stage.removeEventListener('pointerleave', onPointerLeave)
    stage.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('blur', onPointerLeave)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    stage.style.removeProperty('--story-scene-x')
    stage.style.removeProperty('--story-scene-y')
    stage.style.removeProperty('--story-vignette-x')
    stage.style.removeProperty('--story-vignette-y')
    stage.style.removeProperty('--story-hud-x')
    stage.style.removeProperty('--story-hud-y')
    stage.style.removeProperty('--story-progress-x')
    stage.style.removeProperty('--story-progress-y')
    terrainGeometry.dispose()
    terrainMaterial.dispose()
    glyphGeometry.dispose()
    glyphMaterial.dispose()
    renderer.dispose()
  }
}

export default function CinematicHistory() {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef(0)

  useLayoutEffect(() => {
    const element = root.current
    const canvasElement = canvas.current
    if (!element || !canvasElement) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const compact = window.matchMedia('(max-width: 767px)').matches
    if (reduced || compact) return undefined

    let disposeWebGL: (() => void) | undefined
    let webGLCancelled = false
    const stage = element.querySelector<HTMLElement>('.story-stage')
    if (!stage) return undefined

    void setupWebGL(canvasElement, stage, progressRef).then((dispose) => {
      if (webGLCancelled) dispose()
      else disposeWebGL = dispose
    })
    const scenes = [...element.querySelectorAll<HTMLElement>('.story-scene')]
    const progressFill = element.querySelector<HTMLElement>('.story-progress-fill')
    const prompt = element.querySelector<HTMLElement>('.story-prompt')
    const timeline = gsap.timeline({ paused: true })
    const setStageGlow = (progress: number) => {
      const green = [116, 158, 60]
      const amber = [190, 74, 28]
      const cyan = [42, 132, 158]
      const start = progress < 0.62 ? green : amber
      const end = progress < 0.62 ? amber : cyan
      const mix = progress < 0.62 ? progress / 0.62 : (progress - 0.62) / 0.38
      const color = start.map((channel, index) => Math.round(channel + (end[index] - channel) * mix))
      stage.style.setProperty('--story-glow', `rgb(${color.join(' ')} / 24%)`)
    }

    gsap.set(scenes, { autoAlpha: 0, scale: 1.16, yPercent: 8 })
    gsap.set(scenes[0], { autoAlpha: 1, scale: 1, yPercent: 0 })
    setStageGlow(0)

    scenes.forEach((scene, index) => {
      if (index === 0) return
      const previous = scenes[index - 1]
      const stopAt = index
      timeline
        .to(
          previous,
          { autoAlpha: 0, scale: 0.68, yPercent: -8, duration: sceneExitDuration, ease: 'power2.in' },
          stopAt - sceneExitDuration,
        )
        .fromTo(
          scene,
          { autoAlpha: 0, scale: 1.32, yPercent: 10 },
          { autoAlpha: 1, scale: 1, yPercent: 0, duration: sceneEnterDuration, ease: 'power3.out' },
          stopAt - sceneEnterDuration,
        )

      const media = scene.querySelector('.story-media')
      if (media) {
        timeline.fromTo(
          media,
          { opacity: 0, scale: 1.3, clipPath: 'inset(18%)' },
          { opacity: 0.72, scale: 1, clipPath: 'inset(0%)', duration: sceneEnterDuration, ease: 'power2.out' },
          stopAt - sceneEnterDuration,
        )
      }
    })

    timeline.to({}, { duration: finalSceneHold }, storyDuration)

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: 'top top',
      end: 'bottom bottom',
      // Lenis already smooths the scroll position. A second interpolated scrub
      // lets the scene timeline trail the sticky runway's physical endpoint.
      scrub: true,
      animation: timeline,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const sceneProgress = gsap.utils.clamp(
          0,
          1,
          (self.progress * (storyDuration + finalSceneHold)) / storyDuration,
        )
        progressRef.current = sceneProgress
        setStageGlow(sceneProgress)
        if (progressFill) gsap.set(progressFill, { scaleX: sceneProgress })
        if (prompt) {
          prompt.textContent = sceneProgress < 0.08
            ? 'SCROLL TO DEPLOY'
            : sceneProgress > 0.9
              ? 'ALMOST THROUGH'
              : 'KEEP MOVING'
        }
      },
    })

    return () => {
      webGLCancelled = true
      trigger.kill()
      timeline.kill()
      stage.style.removeProperty('--story-glow')
      disposeWebGL?.()
    }
  }, [])

  return (
    <section className="story-runway" ref={root} aria-label="Counter-Strike history in nine scenes">
      <div className="story-stage">
        <canvas className="story-webgl" ref={canvas} aria-hidden="true" />
        <div className="story-vignette" aria-hidden="true" />
        <div className="story-hud" aria-hidden="true">
          <span className="story-prompt">Scroll to deploy</span>
          <span>CS / ARCHIVE</span>
          <span>MOTION / LIVE</span>
        </div>
        <div className="story-progress" aria-hidden="true">
          <i className="story-progress-fill" />
          {storyScenes.map((scene, index) => (
            <span key={scene.marker} style={{ left: `${(index / (storyScenes.length - 1)) * 100}%` }} />
          ))}
        </div>

        <div className="story-scenes">
          {storyScenes.map((scene, index) => (
            <article className={`story-scene story-scene-${index}`} key={scene.marker}>
              {scene.image && (
                <figure className="story-media" aria-hidden="true">
                  <img src={scene.image} alt="" width="1280" height="853" />
                  <div className="story-media-grid" />
                </figure>
              )}
              <p className="story-marker">{scene.marker}</p>
              {index === 0 ? (
                <h1 className="story-title story-title-intro" aria-label={scene.title}>
                  <span className="story-title-line story-title-line-top" aria-hidden="true">Counter</span>
                  <span className="story-title-line story-title-line-bottom" aria-hidden="true">Strike</span>
                </h1>
              ) : (
                <h2 className="story-title">{scene.title}</h2>
              )}
              <p className="story-copy">{scene.copy}</p>
              <p className="story-note">{scene.note}</p>
              {scene.image && <span className="sr-only">{scene.imageAlt}</span>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
