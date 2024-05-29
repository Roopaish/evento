import { setCookie } from "@/server/utils/cookies"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

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
        setCookie("event", event?.toString() ?? "")
        window.location.reload()
      },
    }),
    {
      name: "current-event-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          setCookie("event", state.currentEvent?.toString() ?? "")
        }
      },
    }
  )
)
