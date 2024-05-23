interface ChatGroupProps {
  id: number
  event: {
    title: string
  }
  latestMessage: {
    user: {
      name: string | null
    }
    message: string
  } | null
}
function formatUsername(name: string) {
  if (name == undefined) return ""
  if (name == null) return ""
  return name.split(" ")[0] + ":"
}

export default function GroupList({
  group,
  getMessage,
}: {
  group: ChatGroupProps
  getMessage: (id: number, name: string) => void
}) {
  return (
    <div
      onClick={() => getMessage(group.id, group.event.title)}
      className={`flex min-h-20 min-w-64 cursor-pointer flex-col justify-start gap-1 rounded-xl bg-clip-border p-4 shadow-sm`}
    >
      <div className="font-semibold">{group.event.title}</div>

      <div className="flex gap-2 overflow-hidden text-sm">
        <div>{formatUsername(group.latestMessage!.user.name!)}</div>
        <div className="text-sm text-[#dc2626]">
          {group.latestMessage?.message}
        </div>

        {/* <>
          {id != group.id && group.id === msg?.chatGroupId ? (
            <>
              <div>{`${
                session?.user.name === msg.user.name
                  ? "you"
                  : formatUsername(msg?.user.name)
              }`}</div>
              <div className="text-sm text-[#dc2626]">
                {msg?.message}
              </div>
            </>
          ) */}
      </div>
    </div>
  )
}
