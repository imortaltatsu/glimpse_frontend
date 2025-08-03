"use client"

import { useState, useRef } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"

interface RetroVideoProps {
  src?: string
  poster?: string
  title?: string
  primaryColor?: string
  secondaryColor?: string
  textColor?: string
  className?: string
  autoPlay?: boolean
  controls?: boolean
}

export function RetroVideo({
  src = "https://aven-ping-landing-page.vercel.app/GreatestOfAllTime.mp4",
  poster = "https://zh5mns2xs4orzalnne62iz47xz7ag54ujodwlfmdbrzk5xymqkeq.arweave.net/yfrGy1eXHRyBbWk9pGefvn4Dd5RLh2WVgwxyrt8Mgok",
  title = "Retro Video Player",
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div
      className={`rounded-lg border-2 overflow-hidden ${className}`}
      style={{
        backgroundColor: primaryColor,
        borderColor: primaryColor,
        boxShadow: `6px 6px 0px ${primaryColor}`,
      }}
    >
      {/* Video Header */}
      <div
        className="px-4 py-2 border-b-2 flex items-center justify-between"
        style={{
          backgroundColor: secondaryColor,
          borderBottomColor: primaryColor,
          color: textColor,
        }}
      >
        <span className="font-mono font-bold text-sm">{title}</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-cover"
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
            <button style={{ color: secondaryColor }}>
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}