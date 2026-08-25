import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

const failures = []
page.on('pageerror', (error) => failures.push(`PAGE: ${error.message}`))
page.on('requestfailed', (request) => failures.push(`REQUEST: ${request.url()} — ${request.failure()?.errorText}`))

await page.goto('http://127.0.0.1:5173/', { waitUntil: 'load' })
await new Promise((resolve) => setTimeout(resolve, 2_500))

const depths = [0, 0.08, 0.16, 0.27, 0.39, 0.51, 0.64, 0.77, 0.9, 0.99]
for (let index = 0; index < depths.length; index += 1) {
  await page.evaluate((progress) => {
    const runway = document.querySelector('.story-runway')
    if (!(runway instanceof HTMLElement)) return
    const max = runway.offsetHeight - innerHeight
    const y = runway.offsetTop + progress * max
    window.__lenis?.scrollTo(y, { immediate: true, force: true })
    window.scrollTo(0, y)
  }, depths[index])
  await new Promise((resolve) => setTimeout(resolve, 1_100))
  await page.screenshot({
    path: `local-story-${String(index).padStart(2, '0')}.png`,
    captureBeyondViewport: false,
  })
}

console.log(JSON.stringify({
  failures,
  metrics: await page.evaluate(() => ({
    scrollHeight: document.documentElement.scrollHeight,
    canvas: document.querySelector('canvas')?.getBoundingClientRect().toJSON(),
    animations: document.getAnimations().length,
  })),
}, null, 2))

const mobile = await browser.newPage()
await mobile.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })
await mobile.goto('http://127.0.0.1:5173/', { waitUntil: 'load' })
await new Promise((resolve) => setTimeout(resolve, 1_000))
await mobile.screenshot({ path: 'local-mobile-top.png', captureBeyondViewport: false })
await mobile.evaluate(() => {
  document.querySelector('.story-scene-5')?.scrollIntoView()
})
await new Promise((resolve) => setTimeout(resolve, 600))
await mobile.screenshot({ path: 'local-mobile-mid.png', captureBeyondViewport: false })

const reduced = await browser.newPage()
await reduced.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await reduced.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await reduced.goto('http://127.0.0.1:5173/', { waitUntil: 'load' })
await new Promise((resolve) => setTimeout(resolve, 1_000))
await reduced.screenshot({ path: 'local-reduced-motion.png', captureBeyondViewport: false })

await browser.close()
