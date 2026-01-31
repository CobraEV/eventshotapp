import { encode } from 'blurhash'
import sharp from 'sharp'

export async function generateBlurHash(input: Buffer) {
  const { data, info } = await sharp(input)
    .resize(32, 32, { fit: 'inside' }) // klein & schnell
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true })

  return encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    4, // components X
    4, // components Y
  )
}
