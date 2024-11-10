export const addTrailingSlash = (str) => {
  if (str.endsWith("/")) return str
  return str + "/"
}