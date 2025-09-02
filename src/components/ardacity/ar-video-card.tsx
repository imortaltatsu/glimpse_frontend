import { useState } from "react"
import { Copy, ShieldAlert, Check } from "lucide-react"
import { RetroCard } from "./ar-retro-card"
import { RetroVideo } from "./ar-retro-video"

interface VideoCardProps {
  title?: string
  description?: string
  videoUrl: string
  posterUrl?: string
  linkUrl?: string
  isNsfw?: boolean
  primaryColor?: string
  secondaryColor?: string
  textColor?: string
  className?: string
}

export function ArVideoCard({
  title: _title,
  description: _desc,
  videoUrl,
  posterUrl,
  linkUrl,
  isNsfw = false,
  primaryColor = "#2d2d2d",
  secondaryColor = "#ffffff",
  textColor = "#2d2d2d",
  className = "",
}: VideoCardProps) {
  const [showSensitive, setShowSensitive] = useState(!isNsfw)
  const [copied, setCopied] = useState(false)
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
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(linkUrl)
              setCopied(true)
              setTimeout(() => setCopied(false), 1200)
            } catch (e) {
              console.error("Failed to copy link", e)
            }
          }}
          className="absolute top-2 right-2 p-2 rounded-lg border-2 transition-all duration-200 hover:scale-110"
          style={{ backgroundColor: primaryColor, color: secondaryColor, borderColor: primaryColor }}
          aria-label="Copy link"
          title="Copy link"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      )}

      <div className="w-full mb-2 relative border-2 rounded-md overflow-hidden" style={{ borderColor: primaryColor }}>
        <div className={isNsfw && !showSensitive ? "blur-sm" : ""}>
          <RetroVideo src={videoUrl} poster={posterUrl} primaryColor={primaryColor} secondaryColor={secondaryColor} textColor={textColor} />
        </div>
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


