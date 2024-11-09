#!/usr/bin/env node
// https://nodejs.org/en/learn/command-line/run-nodejs-scripts-from-the-command-line

const puppeteer = require("puppeteer")
const path = require("node:path")
const fs = require("node:fs")

const profile = {
  devices: [
    {
      name: "laptop",
      width: 1440,
      height: 1024,
    },
  ],
  urls: [
    "https://www.upguard.com",
    "https://www.upguard.com/blog/",
    "https://www.upguard.com/blog/2024-u-s-election-integrity-threats-not-just-data-leaks-and-hacks",
  ],
}

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  for await (const url of profile.urls) {
    for await (const { name, width, height } of profile.devices) {
      await page.setViewport({ width, height })
      await page.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: "reduce" },
      ])
      console.time(url)
      await page.goto(url, { waitUntil: "networkidle2" })

      // Create folder for snapshots from url
      const domain = getDomainFromURL(url)
      if (!fs.existsSync(domain)) {
        fs.mkdirSync(domain, { recursive: true })
      }
      // @todo cerate subdir for timestamp?
      await page.screenshot({
        path: "snaps/" + getWritablePathFromURL(url) + ".png",
        fullPage: true,
        type: "png",
      })
      console.timeEnd(url)
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

function parseURLStr(url) {
  url = removeStartingStr(url, "http://")
  url = removeStartingStr(url, "https://")
  url = removeStartingStr(url, "www.")
  url = removeTrailingSlash(url)
  const [domain, ...paths] = url.split("/")
  return { domain, paths }
}

function getDomainFromURL(url) {
  return parseURLStr(url).domain
}

function getWritablePathFromURL(url) {
  const { domain, paths } = parseURLStr(url)
  return encodeURIComponent([domain, paths.join("/")].filter(Boolean).join("/"))
}

function removeStartingStr(str, strToRemove) {
  if (!str.startsWith(strToRemove)) return str
  return str.slice(strToRemove.length)
}

function addTrailingSlash(str) {
  if (str.endsWith("/")) return str
  return str + "/"
}
function removeTrailingSlash(str) {
  if (!str.endsWith("/")) return str
  return str.slice(0, -1)
}
