import type React from "react"

interface RetroCardProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  primaryColor?: string
  secondaryColor?: string
  textColor?: string
  className?: string
  padding?: "sm" | "md" | "lg"
}

export function RetroCard({
  children,
  title,
  subtitle,
  primaryColor = "#2d2d2d",
  secondaryColor = "#f5f5dc",
  textColor = "#2d2d2d",
  className = "",
  padding = "md",
}: RetroCardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }

  return (
    <div
      className={`rounded-lg border-2 ${paddingClasses[padding]} ${className}`}
      style={{
        backgroundColor: secondaryColor,
        borderColor: primaryColor,
        boxShadow: `6px 6px 0px ${primaryColor}`,
        color: textColor,
      }}
    >
      {title && (
        <h3 className="font-mono font-bold text-xl mb-2" style={{ color: textColor }}>
          {title}
        </h3>
      )}
      {subtitle && (
        <p className="font-mono text-sm opacity-70 mb-4" style={{ color: textColor }}>
          {subtitle}
        </p>
      )}
      <div className="font-mono">{children}</div>
    </div>
  )
}
