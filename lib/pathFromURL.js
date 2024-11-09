const slashReplacement = "--"
export const pathFromURL = (urlStr) => {
  urlStr = urlStr.replace("http://", "").replace("https://", "")
  prefix = prefix.slice(prefix.indexOf("/")).slice(1) // Remove the TLD and the starting "/"
  prefix = remove_trailing_slash(prefix)
  return prefix.split("/").join(slash_replacement)
}