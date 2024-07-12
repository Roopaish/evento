import { useEffect, useRef, useState, type MouseEventHandler } from "react"
import { api } from "@/trpc/react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { Icons } from "../ui/icons"

export default function TicketGrid({
  length,
  width,
  label,
  color,
  price,
  totalSeats,
  ticketsInfo,
}: {
  /**
   * Mistake: length is width and width is height
   */
  length: number
  width: number
  label: string
  color: string
  price: number
  totalSeats: number
  ticketsInfo: {
    position: string
    color: string
    label: string
    price: number
  }[]
}) {
  const useUtils = api.useUtils()
  const [dragging, setDragging] = useState(false)
  const [initial, setInitial] = useState(0)
  const [ticketPositions, setTicketPositions] = useState<
    { position: string; color: string; label: string; price: number }[]
  >([])
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  )
  const [endPos, setEndPos] = useState<{ x: number; y: number } | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)
  const [mode, setMode] = useState<"add" | "remove">("add")

  const handleMouseDown: MouseEventHandler = (e) => {
    setDragging(true)
    if (gridRef?.current === null) return
    const rect = gridRef?.current?.getBoundingClientRect?.()
    console.log("rect", rect)

    setStartPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseMove: MouseEventHandler = (e) => {
    if (dragging) {
      console.log("dragging")
      if (gridRef?.current === null) return

      const rect = gridRef?.current.getBoundingClientRect()
      setEndPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
    // const totalMapping = ticketPositions.filter((p) => p.label == label).length
    // console.log("totalMapping", totalMapping)
    // if (totalMapping >= totalSeats) {
    //   console.log("You have exceeded the total number of seats")
    //   handleMouseUp()
    // }
  }

  const handleMouseUp = () => {
    const filteredPositions = ticketPositions.filter((p) => p.label == label)
    if (filteredPositions.length > totalSeats) {
      toast.error("You have exceeded the total number of seats of this type")
    }
    const reducedPosition = filteredPositions.splice(0, totalSeats)
    // ticketPositions.filter((p) => p.label !== label)
    setTicketPositions((prev) =>
      prev.filter((p) => p.label !== label).concat(reducedPosition)
    )

    setDragging(false)
    setStartPos(null)
    setEndPos(null)
  }

  useEffect(() => {
    if (!gridRef?.current) return

    if (startPos && endPos) {
      const newSelectedPositions: {
        position: string
        color: string
        price: number
        label: string
      }[] = []
      const { x: startX, y: startY } = startPos
      const { x: endX, y: endY } = endPos

      // Calculate the bounding box of the selection area
      const minX = Math.min(startX, endX)
      const minY = Math.min(startY, endY)
      const maxX = Math.max(startX, endX)
      const maxY = Math.max(startY, endY)

      const cells = Array.from(gridRef.current.children)
      cells.forEach((cell, index) => {
        const cellRect = cell.getBoundingClientRect()
        if (!gridRef?.current) return

        const cellLeft =
          cellRect.left - gridRef.current.getBoundingClientRect().left
        const cellTop =
          cellRect.top - gridRef.current.getBoundingClientRect().top
        const cellRight = cellLeft + cellRect.width
        const cellBottom = cellTop + cellRect.height

        if (
          cellRight > minX &&
          cellLeft < maxX &&
          cellBottom > minY &&
          cellTop < maxY
        ) {
          newSelectedPositions.push({
            position: (index + 1).toString(),
            color,
            price,
            label,
          })
        }
      })

      if (mode === "add") {
        setTicketPositions((prev) => {
          const uniquePositions = new Map(
            prev?.map((p) => [
              p.position,
              { color: p.color, price: p.price, label: p.label },
            ])
          )
          newSelectedPositions.forEach((p) =>
            uniquePositions.set(p.position, {
              color: p.color,
              price: p.price,
              label: p.label,
            })
          )

          return Array.from(
            uniquePositions,
            ([position, { color, price, label }]) => ({
              position,
              color,
              price,
              label,
            })
          )
        })
      } else {
        setTicketPositions((prev) => {
          const newSelectedPositionsSet = new Set(
            newSelectedPositions.map((p) => p.position)
          )
          return prev.filter((p) => !newSelectedPositionsSet.has(p.position))
        })
      }
    }
  }, [startPos, endPos, setTicketPositions])

  useEffect(() => {
    if (ticketsInfo?.length === 0) return
    if (initial === 0) {
      console.log("ticketsInfo", ticketsInfo)
      setTicketPositions(ticketsInfo)
    }
  }, [ticketsInfo])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setInitial(1)
    }, 400)
    return () => clearTimeout(timeoutId)
  }, [])

  // console.log("startPos", startPos)
  // console.log("endPos", endPos)
  // console.log("rect", gridRef?.current?.getBoundingClientRect())
  console.log("seedPositions", ticketPositions)

  // if (grid === 0) return
  const { mutate: saveData, isLoading } = api.ticket.create.useMutation()
  function saveTicket() {
    saveData(
      {
        length,
        width,
        ticketInfo: ticketPositions,
      },
      {
        onSuccess: () => {
          toast.success("Ticket type added successfully")
          void useUtils.ticket.getTicketByEventId.refetch()
        },
      }
    )
    // setInitial(0)
  }
  return (
    <>
      <div className="mt-8 box-border flex flex-wrap items-center gap-2">
        <Button
          variant={mode === "remove" ? "destructive" : "outline"}
          size="sm"
          onClick={() => {
            if (mode === "add") {
              setMode("remove")
            } else {
              setMode("add")
            }
          }}
        >
          Ticket Selection Mode: {mode === "add" ? "Add" : "Remove"}
        </Button>

        <Button
          variant={"outline"}
          size="sm"
          onClick={() => {
            setTicketPositions(
              Array.from(
                {
                  length: length * width,
                },
                (_, index) => ({
                  position: `${index + 1}`,
                  color,
                  price,
                  label,
                })
              )
            )
          }}
        >
          Select All
        </Button>

        <Button
          variant={"outline"}
          size="sm"
          onClick={() => {
            setTicketPositions([])
          }}
        >
          Deselect All
        </Button>
      </div>

      <div
        style={{
          gridTemplateColumns: `repeat(${length}, 1fr)`,
        }}
        className={`mb-10 mt-10 grid max-w-max gap-[4px] overflow-auto scroll-auto rounded-lg`}
        ref={gridRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        draggable={false}
      >
        {Array.from(
          {
            length: length * width,
          },
          (_, index) => {
            const containerId = `${index + 1}`
            const ticketPosition = ticketPositions?.find(
              (p) => p.position === containerId
            )
            const isSelected = !!ticketPosition
            return (
              <div
                style={{
                  width: 50,
                  height: 50,
                }}
                key={containerId}
              >
                <div
                  style={{
                    backgroundColor: isSelected
                      ? ticketPosition.color
                      : undefined,
                  }}
                  className={cn(
                    `flex h-full cursor-pointer select-none flex-col items-center justify-around gap-2 rounded-[8px] bg-slate-800 text-xs text-white transition duration-200 ease-in-out`,
                    {
                      "hover:bg-red-800": !isSelected,
                      "bg-slate-800": !isSelected,
                    }
                  )}
                  draggable={false}
                  key={index}
                  onClick={() => {
                    const filtered = ticketPositions.filter(
                      (p) => p.label == label
                    )

                    if (filtered.length >= totalSeats) {
                      toast.error(
                        "You have exceeded the total number of seats of this type"
                      )
                      return
                    }

                    let positions
                    if (isSelected) {
                      positions = ticketPositions.filter(
                        (p) => p.position !== containerId
                      )
                    } else {
                      positions = [
                        ...ticketPositions,
                        {
                          position: containerId,
                          color,
                          price,
                          label,
                        },
                      ]
                    }

                    setTicketPositions(positions)
                  }}
                >
                  {containerId}
                  {/* {isSelected && (
                    <span className="text-xs">
                      {seedPosition.label.split("", 1)[0]}
                    </span>
                  )} */}
                </div>
              </div>
            )
          }
        )}
      </div>
      <div className="box-border flex w-full justify-end gap-2 p-4">
        <Button variant="default" onClick={saveTicket}>
          {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </>
  )
}
