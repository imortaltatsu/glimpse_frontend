import { useState } from "react"
import { Copy, Check, ShieldAlert } from "lucide-react"

interface ResultImageCardProps {
  imageUrl: string
  linkUrl?: string
  isNsfw?: boolean
  primaryColor?: string
  textColor?: string
  className?: string
}

export function ArResultImageCard({
  imageUrl,
  linkUrl,
  isNsfw = false,
  primaryColor = "#2d2d2d",
  textColor = "#2d2d2d",
  className = "",
}: ResultImageCardProps) {
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
    <div className={`relative rounded-lg border-2 overflow-hidden bg-white ${className}`} style={{ borderColor: primaryColor }}>
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
          className="absolute top-2 right-2 p-2 rounded-lg border-2"
          style={{ backgroundColor: "#ffffff", color: textColor, borderColor: primaryColor }}
          aria-label="Copy link"
          title="Copy link"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      )}

      <div className="relative">
        <img
          src={imageUrl}
          alt="result"
          className={`w-full h-48 object-cover ${isNsfw && !showSensitive ? "blur-sm" : ""}`}
        />
        {isNsfw && !showSensitive && <div className="absolute inset-0 bg-black/10" />}
      </div>

      <div className="flex items-center gap-2 p-2">
        {isNsfw && (
          <button
            onClick={() => setShowSensitive(v => !v)}
            className="px-2 py-1 rounded-lg border-2 text-[10px] font-mono inline-flex items-center gap-1"
            style={{ backgroundColor: "#fee2e2", color: "#991b1b", borderColor: primaryColor }}
          >
            <ShieldAlert className="w-3 h-3" /> {showSensitive ? "Hide" : "Show"}
          </button>
        )}
        {domain && (
          <span
            className="px-2 py-1 rounded-lg border-2 text-[10px] font-mono"
            style={{ backgroundColor: "#ffffff", color: textColor, borderColor: primaryColor }}
          >
            {domain}
          </span>
        )}
      </div>
    </div>
  )
}


