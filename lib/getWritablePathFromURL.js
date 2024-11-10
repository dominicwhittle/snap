import { parseURLStr } from "./parseURLStr.js"

export const getWritablePathFromURL = (url) => {
  const { domain, paths } = parseURLStr(url)
  return encodeURIComponent([domain, paths.join("/")].filter(Boolean).join("/"))
}
