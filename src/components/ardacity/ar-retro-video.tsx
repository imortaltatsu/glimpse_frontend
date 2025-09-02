"use client"

import { useState, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, MoreHorizontal, Copy, Check } from "lucide-react"

interface RetroVideoProps {
  src?: string
  poster?: string
  title?: string
  showHeader?: boolean
  rounded?: boolean
  shadow?: boolean
  primaryColor?: string
  secondaryColor?: string
  textColor?: string
  className?: string
  autoPlay?: boolean
  controls?: boolean
}

export function RetroVideo({
  src = "/glimpsevid.mp4",
  poster = "/videothumb.png",
  title = "Retro Video Player",
  showHeader = false,
  rounded = true,
  shadow = true,
  primaryColor = "#2d2d2d",
  secondaryColor = "#f5f5dc",
  textColor = "#2d2d2d",
  className = "",
  autoPlay = false,
  controls = true,
}: RetroVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const enterFullscreen = () => {
    const el = videoRef.current
    if (!el) return
    const anyEl = el as any
    if (el.requestFullscreen) el.requestFullscreen()
    else if (anyEl.webkitRequestFullscreen) anyEl.webkitRequestFullscreen()
    else if (anyEl.msRequestFullscreen) anyEl.msRequestFullscreen()
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div
      className={`${rounded ? 'rounded-lg' : ''} border-2 overflow-hidden ${className}`}
      style={{
        backgroundColor: primaryColor,
        borderColor: primaryColor,
        boxShadow: shadow ? `6px 6px 0px ${primaryColor}` : undefined,
      }}
    >
      {/* Video Header */}
      {showHeader && (
        <div
          className="px-4 py-2 border-b-2 flex items-center justify-between"
          style={{
            backgroundColor: secondaryColor,
            borderBottomColor: primaryColor,
            color: textColor,
          }}
        >
          <span className="font-mono font-bold text-sm">{title}</span>
          <div className="relative">
            <button
              onClick={() => setShowMenu(v => !v)}
              className="p-1 rounded border-2"
              style={{ borderColor: primaryColor, color: textColor, backgroundColor: secondaryColor }}
              aria-label="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <div
                className="absolute right-0 mt-2 w-36 rounded-lg border-2 shadow-md overflow-hidden z-10"
                style={{ backgroundColor: "#ffffff", borderColor: primaryColor }}
              >
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(src || "")
                      setCopied(true)
                      setTimeout(() => setCopied(false), 1200)
                    } catch (e) {
                      console.error("Failed to copy link", e)
                    } finally {
                      setShowMenu(false)
                    }
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm"
                  style={{ color: textColor }}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Container */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          autoPlay={autoPlay}
          muted={isMuted}
        />

        {/* Play Button Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-200 hover:scale-110"
              style={{
                backgroundColor: secondaryColor,
                borderColor: primaryColor,
                color: primaryColor,
              }}
            >
              <Play className="w-6 h-6 ml-1" />
            </button>
          </div>
        )}

        {/* Controls */}
        {controls && (
          <div
            className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between"
            style={{ backgroundColor: `${primaryColor}CC` }}
          >
            <div className="flex items-center gap-2">
              <button onClick={togglePlay} style={{ color: secondaryColor }}>
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button onClick={toggleMute} style={{ color: secondaryColor }}>
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <span className="text-xs font-mono" style={{ color: secondaryColor }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <div className="flex-1 mx-4">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `${secondaryColor}33`,
                  outline: 'none',
                }}
              />
            </div>
            <button onClick={enterFullscreen} style={{ color: secondaryColor }}>
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}