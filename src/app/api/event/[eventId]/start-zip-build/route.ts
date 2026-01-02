import { buildEventZip } from '@/lib/build-event-zip'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params

  // WICHTIG: await → Prozess bleibt alive
  await buildEventZip(eventId)

  return Response.json({ started: true })
}
