# Snap

Snap is a general purpose URL screenshot and image comparison tool using [Playwright]() and [ResembleJS]().

It has two modes: taking full page screenshots of URLs you specify in a JSON file, and comparing like-named images between two folders.

It was designed to be used as a visual regression testing tool that doesn't require integration with a Continuous Integration environment. The primary use case is taking screenshots of all URLs in your component library before and after you make code changes, then comparing them to highlight unintended visual differences, giving you confidence to push your code.

Because it's pretty lo-fi you can also use it in lo-fi ways, like comparing production site URL screenshots from before and after a code deployment, or peridoically recording screenshots for archival purposes.

## Quickstart

Snap images from URLs defined in a json file and save to a directory:

```bash
./snap.js <profile.json> <dest_folder>
```

Compare images with the same file name in the specified folders. When images aren't identical, a mismatch image is saved to the dest folder.

```bash
./snap.js compare <image_folder> <image_folder_2> <dest_folder>
```

## Taking screenshots

Screenshot configuration lives in a JSON file. At minimum this needs an array of `url` strings, and either an array of `devices` strings (`["iPhone 13 Pro", "Desktop Chrome"]`) or `contexts`. The latter allow you to create custom browser contexts. See [/profiles/sample.json](https://github.com/dominicwhittle/snap/blob/main/profiles/sample.json) for a template you can use.

`baseContext` is useful for setting cookies/localStorage, or adding `httpCredentials` to access URLs behind authentication. All `devices` and `contexts` inherit from this `baseContext` if you use it. Configuration options are available [here](https://playwright.dev/docs/api/class-browser#browser-new-context).

You might create multiple profiles based on your use cases, eg a `production.json` with URLs from your live site, and `components.json` with URLs from your component library.

Snapping images and saving them to a directory looks like this:

```bash
./snap.js <profile.json> <dest_folder>
```

## Comparing images

Snap compares images, creating a mismatch image that highlights the differences when images with the same name in the comparison folders are not found to be identical. A visual diff, if you like.

```bash
./snap.js compare <image_folder> <image_folder_2> <dest_folder>
```

The first dir of images is read and the second dir searched for images with matching names for comparison.

Only images that a deemed to have a visual mismatch are written to the `dest_folder`.

Snap will only compare images with the same filename.

## Example

Using snap as a visual regression testing tool while building a new feature on a branch in git.

```bash
# From branch main
# Snap using a profile and save screenshots to a directory:
./snap.js profiles/sample.json snaps/main
# Switch to your feature-xyz branch, do work etc
# Snap using the same profile and save screenshots to a new directory:
./snap.js profiles/sample.json snaps/feature-xyz
# You now have two folders of images you can compare
./snap.js compare snaps/main snaps/feature-xyz snaps/compare-main-feature-xyz
```

## Requirements

- Node
- [nvm](https://github.com/nvm-sh/nvm)
- [node-canvas](https://github.com/Automattic/node-canvas)

## Installation

```bash
nvm use
npm install
```

If you hit a `Error: Cannot find module 'canvas'` problem, follow the installation instructions for node-canvas at the link above (eg on macOS use the homebrew command to install cairo and other system dependencies) then run npm install again.

---

@todo manually install nvm

```bash
nvm use
npm install
```

chmod u+x snap2.js

```bash
./snap.js example.com profiles/profile.json
```


```bash
./compare.js snaps/example.com-YYYY-MM-DD snaps/staging.example.com-YYYY-MM-DD
```

@todo "Google Chrome for Testing" macOS desktop notifications
