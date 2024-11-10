export const removeTrailingSlash = (str) => {
  if (!str.endsWith("/")) return str
  return str.slice(0, -1)
}
