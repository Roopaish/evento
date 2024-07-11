import React, { useEffect, useState } from "react"
import { api } from "@/trpc/react"

interface CountdownTimerProps {
  initialSeconds: number
  onCancel: () => void
  eventId: number
  ticketPositions: { position: string }[]
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  onCancel,
  eventId,
  ticketPositions,
}) => {
  const [seconds, setSeconds] = useState<number>(initialSeconds)
  const utils = api.useUtils()
  const { mutate: selectTicket } = api.ticket.selectTicket.useMutation()
  const { mutate: deSelectTicket } = api.ticket.deSelectTicket.useMutation()

  useEffect(() => {
    console.log("selected api")
    selectTicket(
      { position: ticketPositions.map((ticket) => ticket.position), eventId },
      {
        onSuccess: () => {
          void utils.ticket.getTicketByEventId.refetch()
        },
      }
    )
  }, [seconds === initialSeconds])

  useEffect(() => {
    console.log("ticketPositions", ticketPositions)
    console.log("eventId", eventId)

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(interval)
          return 0
        }
        return prevSeconds - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    deSelectTicket(
      { position: ticketPositions.map((ticket) => ticket.position), eventId },
      {
        onSuccess: () => {
          void utils.ticket.getTicketByEventId.refetch()
        },
      }
    )
  }, [seconds === 0])

  if (seconds === 0) {
    onCancel()
  }

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    if (minutes > 0) return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}s`
    else return `${seconds}s`
  }

  return (
    <div className="flex justify-center gap-2">
      <div>Time Left : </div>
      <div className="text-red-800">{formatTime(seconds)}</div>
    </div>
  )
}

export default CountdownTimer
