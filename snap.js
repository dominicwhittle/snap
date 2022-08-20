#!/usr/bin/env node

const fs = require("fs")
const chalk = require("chalk")
const { chromium, devices } = require("playwright")
const compareImages = require("resemblejs/compareImages")

// Handle CLI inputs

const [, , ...args] = process.argv

if (args?.[0] === "compare") {
  const [_, dir1, dir2, out_dir] = args
  compare_snapshots(dir1, dir2, out_dir)
} else {
  const [profile_path, out_dir] = args
  create_snapshots(profile_path, out_dir)
}

// Methods

function create_snapshots(profile_path, out_dir) {
  const profile = JSON.parse(fs.readFileSync(profile_path))

  ;(async () => {
    const browser = await chromium.launch()

    for (const url of profile.urls) {
      let file_prefix = file_prefix_from_url(url)

      // Merge defined contexts with Playwright included contexts from device names
      const contexts = profile.contexts || []
      for (const device_name of profile.devices || []) {
        contexts.push({
          name: device_name,
          ...devices[device_name],
        })
      }

      console.log(chalk.blue.bold("%s"), url)

      for (let ctx of contexts) {
        console.log(
          "☼ %s " + chalk.grey("%s * %s"),
          ctx.name,
          ctx.viewport.width,
          ctx.viewport.height
        )

        // Mix in base context rules
        if (profile.baseContext) {
          ctx = Object.assign({}, profile.baseContext, ctx)
        }

        const file_suffix = ctx.name.replace(/ /g, "-")
        const file_name = file_prefix
          ? file_prefix + "--" + file_suffix
          : "home" + "--" + file_suffix

        const browserContext = await browser.newContext(ctx)
        const page = await browserContext.newPage()

        for (const script of profile.initScripts || []) {
          await page.addInitScript(script)
          // The script is evaluated after the document was created but before any of its scripts were run. This is useful to amend the JavaScript environment, e.g. to seed Math.random.
        }

        await page.goto(url)
        await page.screenshot({
          path: `${out_dir}/${file_name}.png`,
          fullPage: true,
        })
      }
    }

    await browser.close()
  })()
}

function compare_snapshots(dir1, dir2, out_dir) {
  dir1 = add_trailing_slash(dir1)
  dir2 = add_trailing_slash(dir2)
  out_dir = add_trailing_slash(out_dir)

  const dir1_snaps = fs.readdirSync(dir1)
  for (const file_name of dir1_snaps) {

    if (fs.existsSync(dir2 + file_name)) {
      write_mismatch_file(file_name)
    } else {
      console.log(chalk.red("Not found ") + file_name)
    }
  }

  async function write_mismatch_file(file_name) {
    const threshold = 0
    const options = {
      output: {
        errorColor: {
          red: 255,
          green: 0,
          blue: 255,
        },
        errorType: "movement",
        transparency: 0.3,
        largeImageThreshold: 1200,
        useCrossOrigin: false,
        outputDiff: true,
      },
      scaleToSameSize: true,
      ignore: "antialiasing",
    }

    const data = await compareImages(
      fs.readFileSync(dir1 + file_name),
      fs.readFileSync(dir2 + file_name),
      options
    )

    if (data.rawMisMatchPercentage > threshold) {
      console.log(chalk.gray("Mismatch ") + chalk.red(data.misMatchPercentage) + " " + file_name)
      fs.mkdirSync(out_dir, { recursive: true })
      fs.writeFileSync(out_dir + file_name, data.getBuffer())
    }
  }
}

function file_prefix_from_url(url) {
  const slash_replacement = "--"
  let prefix = add_trailing_slash(url)
  prefix = prefix.replace("http://", "").replace("https://", "")
  prefix = prefix.slice(prefix.indexOf("/")).slice(1) // Remove the TLD and the starting "/"
  prefix = remove_trailing_slash(prefix)
  return prefix.split("/").join(slash_replacement)
}

function add_trailing_slash(str) {
  if (str.endsWith("/")) return str
  return str + "/"
}

function remove_trailing_slash(str) {
  if (!str.endsWith("/")) return str
  return str.slice(0, -1)
}
