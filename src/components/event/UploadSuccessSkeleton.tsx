import { Card, CardHeader } from '@/components/ui/card'

export function UploadSuccessSkeleton() {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-pulse">
        <CardHeader className="h-40 bg-muted/40 rounded-xl" />
      </Card>
    </div>
  )
}
