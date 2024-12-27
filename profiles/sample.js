export const urls = ["/", "/blog/", "/blog/example-blog-slug", "/about"]

export const devices = [
  {
    width: 1440,
    height: 1024,
  },
  {
    width: 375,
    height: 667,
  },
]

export const functions = [
  `$('[data-el="topbanners"]').remove()`,
  `$('#usercentrics-root').remove()`,
  `const $style = document.createElement("style")
    $style.innerHTML = \`
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }\`
    $("head").append($style)
  `,
]

