'use client'

import { decode } from 'blurhash'
import { useEffect, useRef } from 'react'

export function BlurHashCanvas({
  hash,
  width,
  height,
  visible = true,
}: {
  hash: string
  width: number
  height: number
  visible?: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!visible) return
    if (!canvasRef.current) return

    const pixels = decode(hash, width, height)
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const imageData = ctx.createImageData(width, height)
    imageData.data.set(pixels)
    ctx.putImageData(imageData, 0, 0)
  }, [hash, width, height, visible])

  if (!visible) return null

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className='h-full w-full scale-[1.1]'
    />
  )
}
