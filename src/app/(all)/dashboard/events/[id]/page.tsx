import { api } from "~/trpc/server"

export default async function EventDetails({
  params,
}: {
  params: { id: string }
}) {
  const data = await api.event.getMyEvent.query({
    id: params.id,
  })

  return (
    <div>
      EventDetails
      {JSON.stringify(data)}
    </div>
  )
}
