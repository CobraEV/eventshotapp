import { processPhoto } from '@/actions/process-photo'
import prisma from '@/lib/prisma'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function run() {
  console.log('📸 Photo worker started')

  while (true) {
    const photo = await prisma.photo.findFirst({
      where: { status: 'pending' },
      orderBy: { createdAt: 'asc' },
    })

    if (!photo) {
      await sleep(1000)
      continue
    }

    console.log('⚙️ Processing photo', photo.id)

    await prisma.photo.update({
      where: { id: photo.id },
      data: { status: 'processing' },
    })

    try {
      await processPhoto(photo.id)

      await prisma.photo.update({
        where: { id: photo.id },
        data: { status: 'ready' },
      })

      console.log('✅ Photo ready', photo.id)
    } catch (err) {
      console.error('❌ Photo failed', photo.id, err)

      await prisma.photo.update({
        where: { id: photo.id },
        data: { status: 'error' },
      })
    }
  }
}

run()
