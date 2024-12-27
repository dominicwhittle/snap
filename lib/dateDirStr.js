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

// function localizeDateStr(date_to_convert_str) {
//   var date_to_convert = new Date(date_to_convert_str)
//   var local_date = new Date()
//   date_to_convert.setHours(
//     date_to_convert.getHours() + local_date.getTimezoneOffset()
//   )
//   return date_to_convert.toString()
// }