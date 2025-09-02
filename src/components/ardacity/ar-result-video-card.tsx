import { useEffect, useState } from "react"
import { Copy, Check, ShieldAlert } from "lucide-react"
import { RetroVideo } from "./ar-retro-video"

interface ResultVideoCardProps {
  videoUrl: string
  posterUrl?: string
  linkUrl?: string
  isNsfw?: boolean
  primaryColor?: string
  secondaryColor?: string
  textColor?: string
  className?: string
}

export function ArResultVideoCard({
  videoUrl,
  posterUrl,
  linkUrl,
  isNsfw = false,
  primaryColor = "#2d2d2d",
  secondaryColor = "#ffffff",
  textColor = "#2d2d2d",
  className = "",
}: ResultVideoCardProps) {
  const [showSensitive, setShowSensitive] = useState(!isNsfw)
  const [copied, setCopied] = useState(false)
  const [generatedPoster, setGeneratedPoster] = useState<string | undefined>(undefined)
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
    if (posterUrl) {
      setGeneratedPoster(undefined)
      return
    }
    let cancelled = false
    const video = document.createElement('video')
    video.src = videoUrl
    video.crossOrigin = 'anonymous'
    video.preload = 'metadata'

    const captureFrame = () => {
      try {
        const width = video.videoWidth || 640
        const height = video.videoHeight || 360
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(video, 0, 0, width, height)
        const dataUrl = canvas.toDataURL('image/png')
        if (!cancelled) setGeneratedPoster(dataUrl)
      } catch {
        // ignore
      }
    }

    const handleLoadedMetadata = () => {
      // Seek to middle; some browsers require slight offset from 0 and < duration
      const mid = Math.max(0.01, Math.min((video.duration || 1) / 2, (video.duration || 1) - 0.01))
      const onSeeked = () => {
        captureFrame()
        video.removeEventListener('seeked', onSeeked)
      }
      video.addEventListener('seeked', onSeeked)
      try {
        video.currentTime = mid
      } catch {
        // fallback to first frame if seek fails
        captureFrame()
        video.removeEventListener('seeked', onSeeked)
      }
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true })
    return () => {
      cancelled = true
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [videoUrl, posterUrl])

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

      <div className="w-full relative">
        <div className={isNsfw && !showSensitive ? "blur-sm" : ""}>
          <RetroVideo src={videoUrl} poster={generatedPoster || posterUrl} primaryColor={primaryColor} secondaryColor={secondaryColor} textColor={textColor} rounded={false} shadow={false} />
        </div>
        {isNsfw && !showSensitive && <div className="absolute inset-0 bg-black/10" />}
      </div>

      <div className="flex items-center gap-2 p-2 border-t-2" style={{ borderColor: primaryColor, boxShadow: `6px 6px 0px ${primaryColor}` }}>
        {isNsfw && (
          <button
            onClick={() => setShowSensitive(v => !v)}
            className="px-2 py-1 rounded-lg border-2 text-[10px] font-mono inline-flex items-center gap-1"
            style={{ backgroundColor: "#fee2e2", color: "#991b1b", borderColor: primaryColor }}
          >
            <ShieldAlert className="w-3 h-3" /> {showSensitive ? "Hide" : "Show"}
          </button>
        )}
        {linkUrl && (
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(linkUrl)
                setCopied(true)
                setTimeout(() => setCopied(false), 1200)
              } catch {}
            }}
            className="px-2 py-1 rounded-lg border-2 text-[10px] font-mono inline-flex items-center gap-1"
            style={{ backgroundColor: "#ffffff", color: textColor, borderColor: primaryColor }}
            aria-label="Copy link"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
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


