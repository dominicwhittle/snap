#!/usr/bin/env node

import puppeteer from "puppeteer"
import fs from "node:fs"
import { dateDirStr } from "./lib/dateDirStr.js"
import { getWritablePathFromURL } from "./lib/getWritablePathFromURL.js"
import { getDomainFromURL } from "./lib/getDomainFromURL.js"
import { domainToURL } from "./lib/domainToURL.js"
import { scrollToBottom } from "./lib/scrollToBottom.js"

// Handle CLI inputs
// ./snap.js example.com profiles/profile.json
const [, , ...args] = process.argv
const profilePath = args[0]
const baseURL = domainToURL(args[1])

// Read profile JSON
const profile = JSON.parse(fs.readFileSync(profilePath))

;(async () => {
  console.log("📷 Snap:", baseURL)
  console.log("https://github.com/dominicwhittle/snap")

  const dateDir = dateDirStr()
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  for await (const relativeURL of profile.urls) {
    for await (const { width, height } of profile.devices) {
      const url = baseURL + relativeURL
      const consoleMsg = `📸  ${relativeURL} ${width}x${height}`
      console.time(consoleMsg)

      await page.setViewport({ width, height })
      await page.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: "reduce" },
      ])
      await page.goto(url, { waitUntil: "networkidle2" })

      // Scoll page and wait for lazy loaded images
      await page.evaluate(scrollToBottom, { viewportHeight: height })
      await page.waitForNetworkIdle()

      // Take screenshot
      const dir = `snaps/${getDomainFromURL(url)}-${dateDir}`
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
      const imgName =
        (getWritablePathFromURL(url) || "_HOME_") + `.${width}x${height}.png`
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

// Remove annoying elements
// await page.evaluate((sel) => {
//   var elements = document.querySelectorAll(sel)
//   for (var i = 0; i < elements.length; i++) {
//     elements[i].parentNode.removeChild(elements[i])
//   }
// }, div_selector_to_remove)
