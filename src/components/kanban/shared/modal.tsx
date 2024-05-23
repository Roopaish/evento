import type { Dispatch, ReactNode, SetStateAction } from "react"
import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"

type ModalProps = {
  children: ReactNode
  setShowModal:
    | Dispatch<SetStateAction<boolean | number>>
    | Dispatch<SetStateAction<boolean>>
}
const Modal = ({ children, setShowModal }: ModalProps) => {
  const elRef = useRef<HTMLDivElement | null>(null)
  if (!elRef.current) elRef.current = document.createElement("div")
  useEffect(() => {
    const modalRoot = document.getElementById("modal") as HTMLElement
    modalRoot.appendChild(elRef.current as HTMLDivElement)
    return () => {
      modalRoot.removeChild(elRef.current as HTMLDivElement)
    }
  }, [])

  return createPortal(
    <div
      className="absolute z-50 flex h-screen w-screen items-start justify-center overflow-auto bg-black bg-opacity-50 p-4"
      onClick={() => setShowModal(false)}
    >
      {children}
    </div>,
    elRef.current
  )
}

export default Modal
