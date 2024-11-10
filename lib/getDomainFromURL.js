import { parseURLStr } from "./parseURLStr.js"

export const getDomainFromURL = (url) => {
  return parseURLStr(url).domain
}
