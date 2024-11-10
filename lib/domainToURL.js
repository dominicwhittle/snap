import { removeTrailingSlash } from "./removeTrailingSlash.js"

export const domainToURL = (url) => {
  url = removeTrailingSlash(url)
  if (url.startsWith("https://")) return url
  if (url.startsWith("http://")) return url
  return "https://" + url
}