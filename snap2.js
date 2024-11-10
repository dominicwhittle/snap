#!/usr/bin/env node
// https://nodejs.org/en/learn/command-line/run-nodejs-scripts-from-the-command-line

import puppeteer from "puppeteer"
// import path from "node:path"
import fs from "node:fs"
import { dateDirStr } from "./lib/dateDirStr.js"
import { getWritablePathFromURL } from "./lib/getWritablePathFromURL.js"
import { getDomainFromURL } from "./lib/getDomainFromURL.js"

const profile = {
  devices: [
    {
      width: 1440,
      height: 1024,
    },
    {
      width: 375,
      height: 667,
    },
  ],
  urls: [
    "https://www.upguard.com",
    "https://www.upguard.com/blog/",
    "https://www.upguard.com/blog/2024-u-s-election-integrity-threats-not-just-data-leaks-and-hacks",
  ],
}


;(async () => {
  console.log("📷 Snap")
  console.log("https://github.com/dominicwhittle/snap")

  const dateDir = dateDirStr()
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  for await (const url of profile.urls) {
    for await (const { width, height } of profile.devices) {
      const logMsg = `📸  ${url} ${width}x${height}`
      console.time(logMsg)

      await page.setViewport({ width, height })
      await page.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: "reduce" },
      ])
      await page.goto(url, { waitUntil: "networkidle2" })

      const dir = `snaps/${getDomainFromURL(url)}-${dateDir}`

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      await page.screenshot({
        path: `${dir}/${getWritablePathFromURL(url)}.${width}x${height}.png`,
        fullPage: true,
        type: "png",
      })
      console.timeEnd(logMsg)
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
