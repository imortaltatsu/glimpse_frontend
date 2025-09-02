// no React import needed in Vite + TSX
import { useState } from "react"
import { ExternalLink, ShieldAlert } from "lucide-react"
import { RetroCard } from "./ar-retro-card"

interface ImageCardProps {
  title?: string
  description?: string
  imageUrl: string
  linkUrl?: string
  isNsfw?: boolean
  primaryColor?: string
  secondaryColor?: string
  textColor?: string
  className?: string
  modalityLabel?: string // e.g., "Image" (not displayed, reserved)
}

export function ArImageCard({
  title,
  description: _desc,
  imageUrl,
  linkUrl,
  isNsfw = false,
  primaryColor = "#2d2d2d",
  secondaryColor = "#ffffff",
  textColor = "#2d2d2d",
  className = "",
  modalityLabel: _mod = "Image",
}: ImageCardProps) {
  const [showSensitive, setShowSensitive] = useState(!isNsfw)
  const domain = (() => {
    try {
      if (!linkUrl) return ""
      const u = new URL(linkUrl)
      return u.hostname.replace(/^www\./, "")
    } catch {
      return ""
    }
  })()
  return (
    <RetroCard
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      textColor={textColor}
      className={`relative flex flex-col ${className}`}
      padding="sm"
    >
      {linkUrl && (
        <button
          onClick={() => window.open(linkUrl, "_blank")}
          className="absolute top-2 right-2 p-2 rounded-lg border-2 transition-all duration-200 hover:scale-110 z-10"
          style={{ backgroundColor: primaryColor, color: secondaryColor, borderColor: primaryColor }}
          aria-label="Open link"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      )}

      <div className="w-full aspect-video overflow-hidden rounded-md border-2 mb-2 relative" style={{ borderColor: primaryColor }}>
        <img
          src={imageUrl}
          alt={title || "Image"}
          className={`w-full h-full object-cover transition duration-200 ${isNsfw && !showSensitive ? "blur-sm" : ""}`}
        />
        {isNsfw && !showSensitive && <div className="absolute inset-0 bg-black/10" />}
      </div>

      {/* Footer chips: NSFW toggle (if any) + domain */}
      <div className="mt-1 inline-flex items-center gap-2">
        {isNsfw && (
          <button
            onClick={() => setShowSensitive((v) => !v)}
            className="px-2 py-1 rounded-lg border-2 text-[10px] font-mono inline-flex items-center gap-1"
            style={{ backgroundColor: "#fee2e2", color: "#991b1b", borderColor: primaryColor, boxShadow: `2px 2px 0px ${primaryColor}` }}
            aria-label="Toggle NSFW visibility"
          >
            <ShieldAlert className="w-3 h-3" /> {showSensitive ? "Hide" : "Show"}
          </button>
        )}
        {domain && (
          <span
            className="px-2 py-1 rounded-lg border-2 text-[10px] font-mono"
            style={{ backgroundColor: "#fff", color: textColor, borderColor: primaryColor, boxShadow: `2px 2px 0px ${primaryColor}` }}
          >
            {domain}
          </span>
        )}
      </div>
    </RetroCard>
  )
}


