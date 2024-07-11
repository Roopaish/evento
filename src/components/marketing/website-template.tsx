import { type RouterOutputs } from "@/trpc/shared"

export const WebsiteTemplate = ({
  data,
}: {
  data: RouterOutputs["event"]["getEvent"]
}) => {
  return <div>{data.address}</div>
}
