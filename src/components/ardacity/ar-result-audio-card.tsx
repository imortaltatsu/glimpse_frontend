import { useEffect, useRef, useState } from "react"
import { ShieldAlert } from "lucide-react"

interface ResultAudioCardProps {
  audioUrl: string
  linkUrl?: string
  isNsfw?: boolean
  primaryColor?: string
  textColor?: string
  className?: string
}

export function ArResultAudioCard({
  audioUrl,
  linkUrl,
  isNsfw = false,
  primaryColor = "#2d2d2d",
  textColor = "#2d2d2d",
  className = "",
}: ResultAudioCardProps) {
  const [showSensitive, setShowSensitive] = useState(!isNsfw)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const domain = (() => {
    try {
      if (!linkUrl) return ""
      const u = new URL(linkUrl)
      return u.hostname.replace(/^www\./, "")
    } catch {
      return ""
    }
  })()

  useEffect(() => {
    let isCancelled = false

    async function prepareAudio() {
      if (!showSensitive) {
        if (objectUrl) URL.revokeObjectURL(objectUrl)
        setObjectUrl(null)
        setLoadError(null)
        return
      }
      try {
        setLoadError(null)
        // Fetch as blob to avoid exposing the original URL in the DOM
        const response = await fetch(audioUrl, { credentials: "omit" })
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const blob = await response.blob()
        if (isCancelled) return
        const blobUrl = URL.createObjectURL(blob)
        setObjectUrl(blobUrl)
      } catch (err) {
        // Fallback: if CORS blocks blob fetching, we can only use direct URL
        // Note: to fully hide URLs, proxy the media through your backend.
        if (isCancelled) return
        setLoadError("Could not load securely; falling back")
        setObjectUrl(audioUrl)
      }
    }

    prepareAudio()

    return () => {
      isCancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [showSensitive, audioUrl])

  return (
    <div className={`relative rounded-lg border-2 overflow-hidden bg-white ${className}`} style={{ borderColor: primaryColor }}>
      {showSensitive ? (
        <div className="p-4">
          <audio
            controls
            className="w-full"
            controlsList="nodownload"
            preload="none"
            onContextMenu={(e) => e.preventDefault()}
            ref={audioRef}
            src={objectUrl ?? undefined}
          >
            {/* Intentionally no <source> tag to avoid exposing the URL in markup */}
          </audio>
          {loadError && (
            <div className="mt-2 text-[10px] font-mono" style={{ color: textColor }}>
              {loadError}
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 flex items-center justify-center text-sm" style={{ color: textColor }}>
          Audio hidden due to sensitive content
        </div>
      )}

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


