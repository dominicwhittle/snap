export const removeStartingStr = (str, strToRemove) => {
  if (!str.startsWith(strToRemove)) return str
  return str.slice(strToRemove.length)
}
