"use client"

import { cn } from "@/lib/utils"

export interface InputProps {
  type?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  required?: boolean
}

export const Input = ({
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  className,
  required,
}: InputProps) => {
  const baseClasses = "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"

  const classes = cn(
    "pr-12",
    baseClasses,
    !disabled ? "ring-primary-500" : undefined,
    className
  )

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={classes}
      required={required}
    />
  )
}