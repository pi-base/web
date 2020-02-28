declare module 'yaml-front-matter' {
  function loadFront(content: string): object
  function safeLoadFront(content: string): object
}

declare module 'theredoc' {
  export default (strings: TemplateStringsArray) => string
}
