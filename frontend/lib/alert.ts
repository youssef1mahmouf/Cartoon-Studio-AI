"use client"

import { useState } from "react"

export function useAlert() {
  const [alert, setAlert] = useState({
    show: false,
    title: "",
    message: "",
    type: "info" as "success" | "error" | "info",
  })

  const show = (title: string, message: string, type: "success" | "error" | "info") => {
    setAlert({ show: true, title, message, type })
  }

  const dismiss = () => {
    setAlert({ show: false, title: "", message: "", type: "info" })
  }

  return { alert, show, dismiss }
}