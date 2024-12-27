# Snap

Snap is a general purpose URL screenshot and image comparison tool using Puppeteer and Pixelmatch.

It has two modes: taking full page screenshots of URLs you specify in a JSON (profile) file, and comparing like-named images between two folders.

It was designed to be used as a visual regression testing tool that doesn't require integration with a Continuous Integration environment. The primary use case is taking screenshots of all URLs in your component library before and after you make code changes, then comparing them to highlight unintended visual differences, giving you confidence to push your code.

Because it's pretty lo-fi you can also use it in lo-fi ways, like comparing production site URL screenshots from before and after a code deployment, or peridoically recording screenshots for archival purposes.


## Quickstart

Snap images from URLs defined in a json file and save to a directory:

```bash
./snap.js ./profiles/sample.js example.com
```

Compare like-named images in the specified folders. When images aren't identical, a mismatch image is saved to a diff folder.

```bash
./diff.js <image_folder_1> <image_folder_2>
```

## Screenshot profiles

Screenshot configuration lives in a JSON file. At minimum this needs an array of relative `url` strings, and an array of `devices` with width and height values.

You might create multiple profiles based on your use cases, eg a `production.json` with URLs from your live site, and `components.json` with URLs from your component library.


## Requirements

- [nvm](https://github.com/nvm-sh/nvm)


## Installation

```bash
nvm use
npm install
```

If you hit a permissions error, you'll need to set `snap.js` and `diff.js to be executable.

```bash
chmod u+x snap.js
chmod u+x diff.js
```

## Custom functions

Custom functions are arbitrary JavaScript you write that run on every page. Use these to hide elements and make any DOM changes that make your life easier.

They are each called individually and within an immediately invoked function expression so that any variables ect are contained within a closure.
This closure scope gives you `$` and `$$` to make querying a little easier.

```javascript
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
```
