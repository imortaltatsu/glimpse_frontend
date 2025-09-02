import { RetroVideo } from "./ar-retro-video"

interface HomeVideoCardProps {
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

export function ArHomeVideoCard({
  src = "/glimpsevid.mp4",
  poster = "/videothumb.png",
  title = "GLIMPSE Demo",
  primaryColor = "#2d2d2d",
  secondaryColor = "#f5f5dc",
  textColor = "#2d2d2d",
  className = "",
  autoPlay = false,
  controls = true,
}: HomeVideoCardProps) {
  return (
    <RetroVideo
      src={src}
      poster={poster}
      title={title}
      showHeader={true}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      textColor={textColor}
      className={className}
      autoPlay={autoPlay}
      controls={controls}
    />
  )
}


