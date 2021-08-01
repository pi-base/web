declare module 'yaml-front-matter' {
  function loadFront(content: string): object
  function safeLoadFront(content: string): object
}
declare module 'theredoc' {
  function theredoc(strings: TemplateStringsArray): string
  export default theredoc
}
