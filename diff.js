#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"
import { PNG } from "pngjs"
import pixelmatch from "pixelmatch"
import { dateDirStr } from "./lib/dateDirStr.js"

// Handle CLI inputs
// ./diff.js /snaps/example.com-YY_MM_DD /snaps/staging.example.com-YY_MM_DD
const [, , ...args] = process.argv
const dir1 = args[0]
const dir2 = args[1]

// @todo compare folders for missing images

const dateDir = dateDirStr()
const dir1Imgs = fs.readdirSync(dir1)
const dir2Imgs = fs.readdirSync(dir2)

console.log("Command click to open:")
console.log(`file://${process.cwd()}/diffs/${dateDir}/`)

for (const img1name of dir1Imgs) {
  if (!dir2Imgs.includes(img1name)) {
    console.error(`Not found ${img1name} in ${dir2}`)
    continue
  }

  let img1 = PNG.sync.read(fs.readFileSync(path.join(dir1, img1name)))
  let img2 = PNG.sync.read(fs.readFileSync(path.join(dir2, img1name)))

  //
  let { width, height } = img1
  if (img1.height != img2.height) {
    height = Math.max(img1.height, img2.height)
    img1 = resizeImage(img1, { width, height })
    img2 = resizeImage(img2, { width, height })
  }

  const diff = new PNG({ width, height })

  const difference = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    {
      threshold: 0.1,
    }
  )

  if (difference) {
    console.log(`🩻`, img1name)
    // console.log(`🩻 ${difference} pixels differ`, img1name)

    const dir = path.join("diffs", dateDir)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(path.join(dir, img1name), PNG.sync.write(diff))
  }
}

function resizeImage(img, dimensions) {
  if (img.width > dimensions.width || img.height > dimensions.height) {
    throw new Error(
      `New dimensions expected to be greater than or equal to the original dimensions!`
    )
  }
  const resized = new PNG(dimensions)
  PNG.bitblt(img, resized, 0, 0, img.width, img.height)

  return resized
}
