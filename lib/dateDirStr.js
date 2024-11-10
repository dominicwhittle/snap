export const dateDirStr = () => {
  const d = new Date()
  return (
    [
      d.getFullYear(),
      (d.getMonth() + 1).toString().padStart(2, "0"),
      (d.getDate() + 1).toString().padStart(2, "0"),
    ].join("-") +
    "T" +
    [
      (d.getHours() + 1).toString().padStart(2, "0"),
      (d.getMinutes() + 1).toString().padStart(2, "0"),
    ].join("")
  )
}
