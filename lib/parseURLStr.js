import { removeStartingStr } from "./removeStartingStr.js"
import { removeTrailingSlash } from "./removeTrailingSlash.js"

export const parseURLStr = (url) => {
  url = removeStartingStr(url, "http://")
  url = removeStartingStr(url, "https://")
  url = removeStartingStr(url, "www.")
  url = removeTrailingSlash(url)
  const [domain, ...paths] = url.split("/")
  return { domain, paths }
}
