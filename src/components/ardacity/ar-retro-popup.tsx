"use client"

import type React from "react"
import { useEffect } from "react"
import { X } from "lucide-react"

interface RetroPopupProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  primaryColor?: string
  secondaryColor?: string
  textColor?: string
  className?: string
  size?: "sm" | "md" | "lg"
  showCloseButton?: boolean
}

export function RetroPopup({
  isOpen,
  onClose,
  title,
  children,
  primaryColor = "#2d2d2d",
  secondaryColor = "#f5f5dc",
  textColor = "#2d2d2d",
  className = "",
  size = "md",
  showCloseButton = true,
}: RetroPopupProps) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        className={`relative w-full ${sizeClasses[size]} rounded-lg border-4 ${className}`}
        style={{
          backgroundColor: secondaryColor,
          borderColor: primaryColor,
          boxShadow: `8px 8px 0px ${primaryColor}`,
          color: textColor,
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b-2" style={{ borderBottomColor: primaryColor }}>
            {title && (
              <h2 className="font-mono font-bold text-xl" style={{ color: textColor }}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg border-2 transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: primaryColor,
                  color: secondaryColor,
                  borderColor: primaryColor,
                }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 font-mono max-h-96 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
