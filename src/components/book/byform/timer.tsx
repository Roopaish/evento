import React, { useEffect, useState } from "react"

interface CountdownTimerProps {
  initialSeconds: number
  onCancel: () => void
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  onCancel,
}) => {
  const [seconds, setSeconds] = useState<number>(initialSeconds)

  useEffect(() => {
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
