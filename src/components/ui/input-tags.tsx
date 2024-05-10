"use client"

import { forwardRef, useState, type Dispatch, type SetStateAction } from "react"
import { XIcon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Input, type InputProps } from "~/components/ui/input"

type InputTagsProps = InputProps & {
  value: string[]
  onChange: Dispatch<SetStateAction<string[]>>
  validation?: (value: string) => boolean
  errorMessage?: string
}

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(
  ({ value, onChange, validation, errorMessage, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState("")

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        if (validation && !validation(pendingDataPoint)) {
          toast.error(errorMessage ?? "Invalid data")
          return
        }
        const newDataPoints = Array.isArray(value)
          ? new Set([...value, pendingDataPoint])
          : new Set([pendingDataPoint])
        onChange(Array.from(newDataPoints))
        setPendingDataPoint("")
      }
    }

    return (
      <>
        <div className="flex">
          <Input
            value={pendingDataPoint}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addPendingDataPoint()
              } else if (e.key === "," || e.key === " ") {
                e.preventDefault()
                addPendingDataPoint()
              }
            }}
            className="rounded-r-none"
            {...props}
            ref={ref}
          />
          <Button
            type="button"
            variant="secondary"
            className="rounded-l-none border border-l-0"
            onClick={addPendingDataPoint}
          >
            Add
          </Button>
        </div>
        {value?.length > 0 && (
          <div className="flex min-h-[2.5rem] flex-wrap items-center gap-2 overflow-y-auto rounded-md border p-2">
            {value?.map((item, idx) => (
              <Badge key={idx} variant="secondary">
                {item}
                <button
                  type="button"
                  className="ml-2 w-3"
                  onClick={() => {
                    onChange(value.filter((i) => i !== item))
                  }}
                >
                  <XIcon className="w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </>
    )
  }
)
