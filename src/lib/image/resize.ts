import sharp from 'sharp'

export async function generateThumbnail(input: Buffer, size = 400) {
  return sharp(input)
    .rotate() // EXIF Orientation fix
    .resize(size, size, {
      fit: 'cover',
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 70,
      mozjpeg: true,
    })
    .toBuffer()
}
