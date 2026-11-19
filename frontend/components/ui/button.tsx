"use client"

import { cn } from "@/lib/utils"
import type { ReactElement } from "react"
import { useToast } from "@/components/ui/use-toast"

export interface ButtonProps {
  variant?: "default" | "destructive" | "secondary" | "outline" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  asChild?: boolean
  disabled?: boolean
  className?: string
  onClick?: () => void
  children: React.ReactNode
  /** Show a toast notification on click */
  toast?: {
    title: string
    description?: string
    variant?: "default" | "destructive" | "secondary"
  }
}

export const Button = ({
  variant = "default",
  size = "default",
  asChild = false,
  disabled,
  className,
  onClick,
  children,
  toast,
}: ButtonProps) => {
  const { toast: showToast } = useToast()

  const handleClick = () => {
    if (onClick) onClick()
    if (toast) showToast({
      title: toast.title,
      description: toast.description,
      variant: toast.variant,
    })
  }

  const baseClasses = "inline-flex items-center justify-center rounded border border-transparent px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

  let variantClass: string
  let borderClass: string

  if (variant === "destructive") {
    variantClass = "bg-red-500 text-white hover:bg-red-600"
    borderClass = "border-red-500"
  } else if (variant === "secondary") {
    variantClass = "bg-white text-gray-900 hover:bg-gray-100"
    borderClass = "border-gray-200 hover:text-gray-500"
  } else if (variant === "outline") {
    variantClass = "bg-white text-gray-900 hover:bg-gray-50"
    borderClass = "border border-gray-300 hover:text-gray-500"
  } else if (variant === "link") {
    variantClass = "text-blue-600 underline underline-offset-4 hover:text-blue-500"
    borderClass = "border-none"
  } else {
    variantClass = "bg-primary-600 text-white hover:bg-primary-700"
    borderClass = "border-primary-600"
  }

  let sizeClass: string
  if (size === "sm") {
    sizeClass = "h-8 px-3 text-xs"
  } else if (size === "lg") {
    sizeClass = "h-10 px-8 text-base"
  } else if (size === "icon") {
    sizeClass = "h-10 w-10"
  } else {
    sizeClass = "h-10 px-4 text-sm"
  }

  const classes = cn(
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    baseClasses,
    `${variantClass} ${borderClass}`,
    `${sizeClass}`,
    className
  )

  if (asChild) {
    const element = children as ReactElement | undefined
    const Element = element?.type || "button"
    return (
      <Element
        type="button"
        onClick={handleClick}
        className={classes}
        disabled={disabled}
        {...(element?.props ?? {})}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  )
}