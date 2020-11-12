function toInt(id: string) {
  return parseInt(id.slice(1))
}

function format(prefix: string, id: number) {
  return `${prefix}${id.toString().padStart(6, '0')}`
}

export default {
  format,
  toInt,
}
