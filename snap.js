#!/usr/bin/env node

import puppeteer from "puppeteer"
import fs from "node:fs"
import { dateDirStr } from "./lib/dateDirStr.js"
import { getWritablePathFromURL } from "./lib/getWritablePathFromURL.js"
import { getDomainFromURL } from "./lib/getDomainFromURL.js"
import { domainToURL } from "./lib/domainToURL.js"
import { triggerLazyLoad } from "./lib/triggerLazyLoad.js"

// Handle CLI inputs
// ./snap.js example.com profiles/profile.json
const [, , ...args] = process.argv
const profilePath = args[0]
const baseURL = domainToURL(args[1])

;(async () => {
  // Read profile JSON
  const {
    functions = [],
    urls = [],
    devices = [
      {
        width: 1440,
        height: 1024,
      },
      {
        width: 375,
        height: 667,
      },
    ],
  } = await import(profilePath)

  console.log("https://github.com/dominicwhittle/snap")
  console.log("📷 Snapping...", baseURL)

  const dateDir = dateDirStr()
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  for await (const relativeURL of urls) {
    for await (const { width, height } of devices) {
      const url = baseURL + relativeURL
      const consoleMsg = `📸 ${relativeURL} ${width}x${height}`
      console.time(consoleMsg)

      await page.setViewport({ width, height })
      await page.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: "reduce" },
      ])

      await page.goto(url, { waitUntil: "networkidle2" })

      // Scoll page and wait for lazy loaded images
      await page.evaluate(triggerLazyLoad, { viewportHeight: height })
      await page.waitForNetworkIdle()

      // Run any profile specific custom functions
      for await (const code of functions) {
        await page.evaluate(callCustomFunction, { code })
      }
      await sleep(100)

      // Take screenshot
      const dir = `screenshots/${getDomainFromURL(url)}-${dateDir}`
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      const imgName =
        (getWritablePathFromURL(url) || "_home") + `.${width}x${height}.png`
      await page.screenshot({
        path: `${dir}/${imgName}`,
        fullPage: true,
        type: "png",
      })
      console.timeEnd(consoleMsg)
    }
  }

  await browser.close()
})()

function callCustomFunction ({ window, code = "" } = {}) {
  const script = document.createElement("script")
  script.innerHTML = `(() => {
    const $ = (s) => document.querySelector(s);
    const $$ = (s) => Array.from(document.querySelectorAll(s));
    ${code}
  })()`
  document.body.appendChild(script)
}

function sleep (millisecondsCount = 0) {
  return new Promise((resolve) =>
    setTimeout(resolve, millisecondsCount)
  ).catch()
}

// Remove annoying elements
// await page.evaluate((sel) => {
//   var elements = document.querySelectorAll(sel)
//   for (var i = 0; i < elements.length; i++) {
//     elements[i].parentNode.removeChild(elements[i])
//   }
// }, div_selector_to_remove)
