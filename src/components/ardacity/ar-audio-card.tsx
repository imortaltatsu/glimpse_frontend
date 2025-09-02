import { useRef, useState } from "react"
import { Play, Pause, Volume2, VolumeX, ShieldAlert, Copy, Check } from "lucide-react"
import { RetroCard } from "./ar-retro-card"

interface AudioCardProps {
  title?: string
  description?: string
  audioUrl: string
  linkUrl?: string
  isNsfw?: boolean
  primaryColor?: string
  secondaryColor?: string
  textColor?: string
  className?: string
}

export function ArAudioCard({
  title,
  description,
  audioUrl,
  linkUrl,
  isNsfw = false,
  primaryColor = "#2d2d2d",
  secondaryColor = "#ffffff",
  textColor = "#2d2d2d",
  className = "",
}: AudioCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
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

  const isLikelyUrl = (value?: string) => {
    if (!value) return false
    if (/^https?:\/\//i.test(value)) return true
    try {
      // This will throw for non-URLs lacking a scheme
      // We only want to treat obvious URLs as URLs
      new URL(value)
      return true
    } catch {
      return false
    }
  }

  const containsUrl = (value?: string) => {
    if (!value) return false
    return /(https?:\/\/\S+)/i.test(value)
  }

  const isLikelyIdentifier = (value?: string) => {
    if (!value) return false
    // Treat long base64url/base58-like strings as identifiers (e.g., Arweave txids)
    return /^[A-Za-z0-9_-]{32,}$/.test(value)
  }

  const deriveTitleFromUrl = (value?: string) => {
    if (!value) return "Audio"
    try {
      const u = new URL(value)
      const path = u.pathname
      const filename = path.split("/").filter(Boolean).pop()
      if (filename) return decodeURIComponent(filename)
      return u.hostname.replace(/^www\./, "")
    } catch {
      return "Audio"
    }
  }

  const displayTitle = (() => {
    // Hide if it's a URL or an identifier-like string (txid)
    if (title && (isLikelyUrl(title) || isLikelyIdentifier(title))) return ""
    if (title) return title
    // If missing or unusable, derive from URL but suppress identifier-like filenames
    const derived = deriveTitleFromUrl(title || audioUrl || linkUrl)
    return isLikelyIdentifier(derived) ? "" : derived
  })()

  const displayDescription = (() => {
    if (!description) return ""
    if (containsUrl(description) || isLikelyIdentifier(description)) return ""
    return description
  })()

  const togglePlay = () => {
    const a = audioRef.current
    if (!a) return
    if (isPlaying) a.pause(); else a.play()
    setIsPlaying(!isPlaying)
  }
  const toggleMute = () => {
    const a = audioRef.current
    if (!a) return
    a.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <RetroCard
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      textColor={textColor}
      className={`relative flex flex-col ${className}`}
      padding="sm"
    >

      <div className={`w-full p-3 rounded-md border-2 mb-3 flex items-center gap-3`} style={{ borderColor: primaryColor }}>
        <button onClick={togglePlay} className="p-2 rounded-lg border-2" style={{ borderColor: primaryColor }}>
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={toggleMute} className="p-2 rounded-lg border-2" style={{ borderColor: primaryColor }}>
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <audio ref={audioRef} src={audioUrl} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} className="hidden" />
        <span className="font-mono text-sm" style={{ color: textColor }}>Audio preview</span>
      </div>

      {(displayTitle || displayDescription) && (
        <div className="space-y-1">
          {displayTitle && (
            <h4 className="font-mono font-bold text-sm line-clamp-1" style={{ color: textColor }}>
              {displayTitle}
            </h4>
          )}
          {displayDescription && (
            <p className="font-mono text-xs opacity-80 line-clamp-2" style={{ color: textColor }}>
              {displayDescription}
            </p>
          )}
        </div>
      )}

      {/* Footer chips: NSFW (static) + Copy + Domain */}
      <div className="mt-1 inline-flex items-center gap-2">
        {isNsfw && (
          <span
            className="px-2 py-1 rounded-lg border-2 text-[10px] font-mono inline-flex items-center gap-1"
            style={{ backgroundColor: "#fee2e2", color: "#991b1b", borderColor: primaryColor, boxShadow: `2px 2px 0px ${primaryColor}` }}
          >
            <ShieldAlert className="w-3 h-3" /> NSFW
          </span>
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
            style={{ backgroundColor: "#ffffff", color: textColor, borderColor: primaryColor, boxShadow: `2px 2px 0px ${primaryColor}` }}
            aria-label="Copy link"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy
          </button>
        )}
        {domain && (
          <span
            className="px-2 py-1 rounded-lg border-2 text-[10px] font-mono"
            style={{ backgroundColor: "#ffffff", color: textColor, borderColor: primaryColor, boxShadow: `2px 2px 0px ${primaryColor}` }}
          >
            {domain}
          </span>
        )}
      </div>
    </RetroCard>
  )
}


