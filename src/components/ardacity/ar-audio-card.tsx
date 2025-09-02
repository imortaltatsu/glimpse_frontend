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

      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h4 className="font-mono font-bold text-sm line-clamp-1" style={{ color: textColor }}>
              {title}
            </h4>
          )}
          {description && (
            <p className="font-mono text-xs opacity-80 line-clamp-2" style={{ color: textColor }}>
              {description}
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


