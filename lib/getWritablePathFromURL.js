import { parseURLStr } from "./parseURLStr.js"

export const getWritablePathFromURL = (url) => {
  const { paths } = parseURLStr(url)
  return encodeURIComponent(paths.filter(Boolean).join("/"))
}
