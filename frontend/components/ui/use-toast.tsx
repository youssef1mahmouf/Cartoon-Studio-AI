"use client"

import { useState } from "react"

type ToastAction = {
  label: string
  onClick: () => void
}

type Toast = {
  id: string
  title: string
  description?: string
  action?: ToastAction
  status: "info" | "success" | "warning" | "error"
}

type UseToastReturn = {
  toast: (props: {
    title: string
    description?: string
    variant?: "default" | "destructive" | "secondary"
    duration?: number
  }) => string
  dismiss: (id: string) => void
}

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = (props: {
    title: string
    description?: string
    variant?: "default" | "destructive" | "secondary"
    duration?: number
  }) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      id,
      title: props.title,
      description: props.description,
      status: props.variant === "destructive" ? "error" : "info",
    }
    setToasts((prev) => [...prev, newToast])
    return id
  }

  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toast, dismiss }
}