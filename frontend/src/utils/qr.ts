/** Convierte el SVG del QR a PNG (1024px, fondo blanco) y lo descarga. */
export function descargarQrPng(svg: SVGSVGElement, nombreArchivo: string) {
  const xml = new XMLSerializer().serializeToString(svg)
  const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const img = new Image()

  img.onload = () => {
    const size = 1024
    const margen = 64
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)
    ctx.drawImage(img, margen, margen, size - margen * 2, size - margen * 2)
    URL.revokeObjectURL(url)

    const enlace = document.createElement('a')
    enlace.href = canvas.toDataURL('image/png')
    enlace.download = `QR-${nombreArchivo}.png`
    enlace.click()
  }

  img.src = url
}

export function urlDeEquipo(codigo: string) {
  return `https://solutions-5voz.onrender.com/t/${codigo}`
}
