#!/usr/bin/env node

const fs = require("fs")


// Handle CLI inputs

const [,, ...args] = process.argv

if (args?.[0] === "compare") {
  const [_, dir1, dir2, out_dir] = args
  compare_snapshots(dir1, dir2, out_dir)
} else {
  const [profile_path, out_dir] = args
  create_snapshots(profile_path, out_dir)
}


function create_snapshots (profile_path, out_dir) {
  console.log("create_snapshots", profile_path, out_dir)

  // Read profile as JSON
  const profile = JSON.parse(fs.readFileSync(profile_path))
  console.log(profile)
}


function compare_snapshots (dir1, dir2, out_dir) {
  console.log("Compare", dir1, dir2)
}