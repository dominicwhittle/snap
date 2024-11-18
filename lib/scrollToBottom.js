// Inspired by https://github.com/Robdel12/scroll-to-bottom but changed to scroll by viewport increments

export function scrollToBottom({
  remoteWindow = window,
  viewportHeight = 1024,
  timing = 8, // ms
} = {}) {
  let resolve
  let scrollCount = 0
  let deferred = new Promise((r) => (resolve = r))
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
        remoteWindow.scrollTo(0, 0) // Scroll back to the very top to put any fixed/sticky elements back in their expected positions
        resolve(true) // Resolve the pending promise
      }
    }, timing)
  }

  scroll()

  return deferred
}
