import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--disable-gpu-sandbox'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

const failures = []
page.on('pageerror', (error) => failures.push(`PAGE: ${error.message}`))
page.on('requestfailed', (request) => failures.push(`REQUEST: ${request.url()} — ${request.failure()?.errorText}`))

await page.goto('https://mesh3d.gallery/the-state-of-the-gallery', { waitUntil: 'load', timeout: 60_000 })
await new Promise((resolve) => setTimeout(resolve, 6_000))

const overview = await page.evaluate(() => ({
  title: document.title,
  viewport: [innerWidth, innerHeight],
  scrollHeight: document.documentElement.scrollHeight,
  canvases: [...document.querySelectorAll('canvas')].map((canvas) => ({
    width: canvas.width,
    height: canvas.height,
    rect: canvas.getBoundingClientRect().toJSON(),
  })),
  videos: [...document.querySelectorAll('video')].map((video) => ({
    src: video.currentSrc,
    autoplay: video.autoplay,
    loop: video.loop,
    muted: video.muted,
  })),
  scripts: [...document.scripts].map((script) => script.src).filter(Boolean),
  bodyText: document.body.innerText.slice(0, 2500),
}))

const states = []

for (let index = 0; index < 18; index += 1) {
  if (index > 0) {
    await page.mouse.wheel({ deltaY: 620 })
    await new Promise((resolve) => setTimeout(resolve, 900))
  }

  const state = await page.evaluate((step) => {
    const visible = [...document.querySelectorAll('h1, h2, h3, p, [class*="title"], [class*="number"]')]
      .filter((element) => {
        const rect = element.getBoundingClientRect()
        return rect.bottom > 0 && rect.top < innerHeight && getComputedStyle(element).visibility !== 'hidden'
      })
      .map((element) => ({
        text: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 120),
        rect: element.getBoundingClientRect().toJSON(),
        opacity: getComputedStyle(element).opacity,
        transform: getComputedStyle(element).transform,
      }))
      .filter((item) => item.text)
      .slice(0, 12)

    return {
      step,
      scrollY,
      background: getComputedStyle(document.body).backgroundColor,
      visible,
      animations: document.getAnimations().length,
    }
  }, index)

  states.push(state)
  await page.screenshot({
    path: `reference-${String(index).padStart(2, '0')}.png`,
    captureBeyondViewport: false,
  })
}

console.log(JSON.stringify({ overview, states, failures }, null, 2))
await browser.close()
