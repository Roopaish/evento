import { setCurrentEvent } from "@/trpc/react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CurrentEvent {
  currentEvent?: number
  setCurrentEvent: (event?: number) => void
}

export const useCurrentEventStore = create<CurrentEvent>()(
  persist(
    (set) => ({
      currentEvent: undefined,
      setCurrentEvent: (event) => {
        set({ currentEvent: event })
        setCurrentEvent(event)
      },
    }),
    {
      name: "current-event-storage",
      onRehydrateStorage(state) {
        setCurrentEvent(state.currentEvent)
      },
    }
  )
)
