// Inspired by https://github.com/Robdel12/scroll-to-bottom but changed to scroll by viewport increments

export function scrollToBottom({
  remoteWindow = window,
  viewportHeight = 1024,
  timing = 8, // ms
} = {}) {
  console.log(remoteWindow)
  let resolve
  let scrollCount = 0
  let deferred = new Promise((r) => (resolve = r))
  // resolve(true)
  // return deferred

  let totalScrolls = Math.ceil(
    remoteWindow.document.body.scrollHeight / viewportHeight
  )

  function scroll() {
    remoteWindow.setTimeout(() => {
      remoteWindow.scrollTo(0, scrollCount * viewportHeight)

      if (scrollCount < totalScrolls) {
        scrollCount += 1
        scroll()
      } else {
        // Resolve the pending  once we've finished scrolling the page
        console.log("remoteWindow.scrollY", remoteWindow.scrollY)
        resolve(true)
      }
    }, timing)
  }

  scroll()

  return deferred
}
