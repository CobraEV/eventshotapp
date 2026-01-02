import prisma from '@/lib/prisma'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: {
      zipBuilding: true,
      zipProgress: true,
      zipReady: true,
    },
  })

  return Response.json(event)
}
