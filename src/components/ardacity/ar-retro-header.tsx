"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ArrowRight,
  Clock,
  Volume2,
  ImageIcon,
  Video,
  FileText,
  ExternalLink,
  Eye,
  ChevronLeft,
  ChevronRight,
  
} from "lucide-react"
import { ArHomeVideoCard } from "./ar-home-video-card"
import { RetroCard } from "./ar-retro-card"
import { ArResultVideoCard } from "./ar-result-video-card"
import { ArImageCard } from "./ar-image-card"
import { ArAudioCard } from "./ar-audio-card"
import { RetroPopup } from "./ar-retro-popup"

interface SearchResult {
  score: number
  original_score: number
  content_quality: string
  content_type: string
  word_count: number
  section: string
  language: string
  chunk_index: number
  normalized_url: string
  has_description: boolean
  arns_status: string
  txid: string
  text_length: number
  web_loader_description: string
  processing_timestamp: string
  weight: number
  chunk: string
  web_loader_content: string
  original_modality: string
  tag: string
  web_loader_title: string
  author: string
  description: string
  is_non_assigned_arns: boolean
  title: string
  has_title: boolean
  url: string
  is_arns: boolean
  modality: string
  keywords: string
  duplicates: any[]
  has_duplicates: boolean
  // Optional NSFW flags if provided by backend
  is_nsfw?: boolean
  nsfw_score?: number
  nsfw_confidence?: number
}

interface SearchResponse {
  results: SearchResult[]
}

interface StatusResponse {
  web: number
  image: number
  audio: number
  video: number
  all: number
  arns: number
}

interface RetroHeaderProps {
  // Branding
  title?: string
  subtitle?: string
  highlightedWord?: string
  bottomText?: string
  // Navigation
  statusText?: string
  // Search
  searchPlaceholder?: string
  searchFilters?: string[]
  // Content
  speechBubbleText?: string
  infoBoxText?: string
  // Characters
  showCharacters?: boolean
  character1Image?: string
  character2Image?: string
  // Colors
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  backgroundColor?: string
  textColor?: string
  // Callbacks
  onSearch?: (query: string, filter: string) => void
  // onNavToggle?: (option: string) => void
  onStatusClick?: () => void
  className?: string
}

export function RetroHeader({
  title = "GLIMPSE",
  subtitle = "SEARCH ALMOST",
  highlightedWord = "ANYTHING",
  bottomText = "WITH VECTOR SEARCHING ACCURACY",
  // navToggleOptions = ["WEB", "ARNS"],
  statusText = "STATUS",
  searchPlaceholder = "Search anything ///",
  searchFilters = ["Web", "Image", "Video", "Audio"],
  speechBubbleText = "Wow look great! What's Glimpse",
  infoBoxText = "Glimpse is the one stop solution to search anything on the hyperbeam on the go using vector search feature.",
  showCharacters = true,
  character1Image = "https://abcdefghijklmnopqrstuvwxyz.arweave.net/",
  character2Image = "https://zh5mns2xs4orzalnne62iz47xz7ag54ujodwlfmdbrzk5xymqkeq.arweave.net/yfrGy1eXHRyBbWk9pGefvn4Dd5RLh2WVgwxyrt8Mgok",
  primaryColor = "#2d2d2d",
  secondaryColor = "#f5f5dc",
 
  backgroundColor = "#f5f5dc",
  textColor = "#2d2d2d",
  onSearch,
  // onNavToggle,
  className = "",
}: RetroHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState(searchFilters[0])
  // const [activeNavOption, setActiveNavOption] = useState(navToggleOptions[0])
  const [showFirstBubble, setShowFirstBubble] = useState(false)
  const [showSecondBubble, setShowSecondBubble] = useState(false)
  const [videoVisible, setVideoVisible] = useState(false)
  // Allow runtime override of character 1 (e.g., mascot easter egg)
  const [character1Src, setCharacter1Src] = useState<string>(character1Image)
  const MASCOT_ALT = "green elephant humanoid"

  const preprocessQuery = (q: string): string => {
    // Replace any variation of "dum dum" / "dumdum" (with spaces/dashes/underscores/dots) with mascot alt text
    const pattern = /d\s*u\s*m[\s._-]*d\s*u\s*m/gi
    return q.replace(pattern, MASCOT_ALT)
  }

  // Search states
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [hideNsfw, setHideNsfw] = useState(true)

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 10
  const visibleResults = hideNsfw ? searchResults.filter(r => !r.is_nsfw) : searchResults
  const totalPages = Math.ceil(visibleResults.length / resultsPerPage)
  const startIndex = (currentPage - 1) * resultsPerPage
  const endIndex = startIndex + resultsPerPage
  const currentResults = visibleResults.slice(startIndex, endIndex)

  // Status states
  const [statusData, setStatusData] = useState<StatusResponse | null>(null)
  const [isStatusPopupOpen, setIsStatusPopupOpen] = useState(false)
  const [isStatusLoading, setIsStatusLoading] = useState(false)

  // Animation sequence on component mount
  useEffect(() => {
    if (!hasSearched) {
      const firstBubbleTimer = setTimeout(() => {
        setShowFirstBubble(true)
      }, 500)

      const secondBubbleTimer = setTimeout(() => {
        setShowSecondBubble(true)
      }, 1000)

      const videoTimer = setTimeout(() => {
        setVideoVisible(true)
      }, 1000)

      return () => {
        clearTimeout(firstBubbleTimer)
        clearTimeout(secondBubbleTimer)
        clearTimeout(videoTimer)
      }
    }
  }, [hasSearched])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    // Parse and replace mascot keyword, and trigger mascot if present
    const normalized = searchQuery.toLowerCase().replace(/\s+/g, "")
    const containsMascot = normalized.includes("dumdum")
    const parsedQuery = preprocessQuery(searchQuery)
    if (containsMascot) {
      setCharacter1Src("https://abcdefghijklmnopqrstuvwxyz.arweave.net/")
    }

    setIsLoading(true)
    setHasSearched(true)
    setCurrentPage(1)

    try {
      // Determine endpoint based on active filter
      let endpoint = "searchweb" // default for Web
      if (activeFilter === "Image") endpoint = "searchimage"
      else if (activeFilter === "Video") endpoint = "searchvideo"
      else if (activeFilter === "Audio") endpoint = "searchaudio"

      const response = await fetch(
        `https://arfetch.adityaberry.me/${endpoint}?query=${encodeURIComponent(parsedQuery)}&top_k=100`,
      )
      const data: SearchResponse = await response.json()
      setSearchResults(data.results || [])
      onSearch?.(parsedQuery, activeFilter)
    } catch (error) {
      console.error("Search failed:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const triggerMascotImageSearch = () => {
    setSearchQuery("dum dum")
    setActiveFilter("Image")
    setTimeout(() => {
      handleSearch()
    }, 0)
  }

  const handleStatusClick = async () => {
    setIsStatusLoading(true)
    setIsStatusPopupOpen(true)

    try {
      const response = await fetch("https://arfetch.adityaberry.me/status")
      const data: StatusResponse = await response.json()
      setStatusData(data)
    } catch (error) {
      console.error("Status fetch failed:", error)
      setStatusData(null)
    } finally {
      setIsStatusLoading(false)
    }
  }

  // const handleNavToggle = (option: string) => {
  //   setActiveNavOption(option)
  //   onNavToggle?.(option)
  // }

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result)
    setIsPopupOpen(true)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  const filterIcons = {
    Web: <FileText className="w-4 h-4" />,
    Image: <ImageIcon className="w-4 h-4" />,
    Video: <Video className="w-4 h-4" />,
    Audio: <Volume2 className="w-4 h-4" />,
  }

  // Animation styles
  const floatingAnimation1 = {
    animation: "float1 4s ease-in-out infinite",
  }

  const floatingAnimation2 = {
    animation: "float2 5s ease-in-out infinite",
  }

  const floatingAnimation3 = {
    animation: "float3 3.5s ease-in-out infinite",
  }

  const waveAnimation = {
    animation: "wave 2s ease-in-out infinite",
  }

  const chatBubbleSlideIn = {
    animation: "slideInFromLeft 0.8s ease-out forwards",
  }

  const infoBubbleSlideIn = {
    animation: "slideInFromLeft 0.8s ease-out forwards",
  }

  const videoSlideUp = {
    transform: videoVisible && !hasSearched ? "translateY(0)" : "translateY(100%)",
    transition: "transform 1s ease-out",
  }

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`} style={{ backgroundColor, color: textColor }}>
      {/* CSS Animations */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-20px) rotate(12deg); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(-12deg); }
          50% { transform: translateY(-15px) rotate(-12deg); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes wave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.2); }
        }
        
        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .search-hover-effect {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .search-hover-effect:hover {
          transform: translate(6px, 6px);
          box-shadow: none;
        }
      `}</style>

      {/* SVG Tunnel Grid Background */}
      <div className="absolute inset-0 z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 1728 1117"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1727.98 1116.97H1440L1369.39 1048.51L1304.22 985.325L1243.85 926.802L1187.79 872.442L1135.59 821.834L1086.86 774.6L1041.27 730.393L998.515 688.961L958.366 650.02M1728 1116.97V0.0315622M0.109397 930.807V186.162M0.109397 930.807V1116.97H288.022L358.496 1048.51L423.565 985.325L483.822 926.802L539.789 872.442L591.906 821.834L640.545 774.6L686.054 730.393L728.719 688.961L768.802 650.02H1005.63L1065.84 688.961M0.109397 930.807L105.875 885.15L203.523 842.992L293.951 803.956L377.925 767.727L456.122 733.988L529.112 702.488L597.398 673.006L661.418 645.385L721.564 619.434V466.349L661.418 427.471M0.109397 0H1727.98M1440.02 1117H288.088M105.853 68.423V1048.55H1622.08L1524.32 985.356M1524.32 985.356H203.501V131.517M1524.32 985.356V131.517L1622.08 68.3914H105.875L0.109397 0.0315622V186.193L105.875 231.756L203.523 273.818L293.951 312.76L377.925 348.926L456.122 382.602L529.112 414.038L597.398 443.457L661.418 471.047L721.564 496.966M203.501 131.517L105.853 68.3914M203.501 131.517H1304.19L1369.37 68.3914L1439.98 0.0315622M1433.81 926.834H293.929V189.977M1349.75 872.474H377.903V244.242M1727.98 0.0631244L1622.1 68.423V231.787L1524.35 273.85L1433.83 312.791L1349.77 348.958L1271.48 382.633L1198.41 414.07L1130.03 443.489L1065.93 471.079L1005.71 496.998V619.466L1065.93 645.416L1130.03 673.038L1198.41 702.52L1271.48 734.02L1349.77 767.758L1433.83 803.988L1524.35 843.023L1622.1 885.181V1048.55L1727.98 1117M1271.44 821.834H456.078V294.756M1524.32 131.486L1433.81 189.914M1433.81 189.914V926.771L1524.32 985.293M1433.81 189.914H293.929L203.501 131.486M1727.98 186.162L1622.1 231.724V885.15L1727.98 930.807M288.088 0.0315622L358.561 68.3914L423.631 131.517L483.887 189.945L539.855 244.211L591.972 294.756L640.61 341.926L686.12 386.07L728.785 427.439L768.868 466.318H958.323L998.471 427.439L1041.22 386.07L1086.82 341.926L1135.55 294.756L1187.75 244.211L1243.81 189.945L1304.17 131.517H1524.3M1433.79 189.945L1349.73 244.211V872.442L1433.79 926.802M293.886 189.945L377.859 244.211H1349.7M1151.98 1116.97L1116.64 1048.51L1084.02 985.325L1053.8 926.802L1025.76 872.442L999.631 821.834L975.235 774.6L952.415 730.393L931.017 688.961L910.91 650.02M576 1116.97L611.204 1048.51L643.717 985.325L673.823 926.802L701.785 872.442L727.822 821.834L752.13 774.6L774.863 730.393L796.173 688.961L816.193 650.02M529.068 341.926V774.6H1198.32L1129.95 730.393M721.521 588.786L661.374 601.776L597.354 615.619L529.068 630.376L456.078 646.141L377.881 663.042L293.907 681.173L203.479 700.722L105.831 721.817L0.0656385 744.677M721.477 527.583L661.33 514.656L597.311 500.876L529.025 486.183L456.035 470.48L377.837 453.642L293.864 435.574L203.436 416.12L105.787 395.119L0.0218795 372.354M1349.66 244.211L1271.37 294.756V821.834L1349.66 872.442M377.815 244.211L456.013 294.756H1271.4M863.978 1116.97L863.913 1048.51L863.847 985.325L863.803 926.802L863.759 872.442L863.716 821.834L863.672 774.6L863.628 730.393L863.584 688.961L863.541 650.02M721.455 558.169H661.308L597.289 558.232H529.003L456.013 558.294H377.815L293.842 558.358H203.414L105.766 558.452L0 558.515M1271.35 294.756L1198.28 341.926M1198.28 341.926V774.6L1271.35 821.834M1198.28 341.926H528.959M455.969 294.756L528.959 341.926M528.959 341.926L597.245 386.07H1129.92L1198.3 341.926M1129.95 730.393V386.07L1065.84 427.439H661.286L597.267 386.07V730.393H1129.95ZM661.374 688.961L721.521 650.02V619.403M1065.97 427.471V688.993M1065.97 688.993L1130.08 730.425M1065.97 688.993H661.418L597.398 730.425L529.112 774.632L456.122 821.866L377.925 872.474L293.951 926.834L203.523 985.356L105.875 1048.55L0.109397 1117M661.374 427.471V688.993M1727.96 744.677L1622.08 721.817L1524.32 700.722L1433.81 681.173L1349.75 663.042L1271.46 646.141L1198.38 630.376L1130.01 615.619L1065.9 601.776L1005.69 588.786M1727.96 372.322L1622.08 395.089L1524.32 416.088L1433.81 435.543L1349.75 453.61L1271.46 470.448L1198.38 486.151L1130.01 500.844L1065.9 514.624L1005.69 527.551M910.975 466.318L931.083 427.439L952.481 386.07L975.301 341.926L999.697 294.756L1025.82 244.211L1053.87 189.945L1084.09 131.517L1116.71 68.3914L1152.04 0.0315622M816.281 466.318L796.261 427.439L774.95 386.07L752.218 341.926L727.909 294.756L701.873 244.211L673.911 189.945L643.805 131.517L611.292 68.3914L576.087 0.0315622M1728 558.515L1622.13 558.452H1524.37L1433.85 558.358H1349.79L1271.51 558.294H1198.43L1130.05 558.232H1065.95L1005.74 558.169M863.65 466.318L863.694 427.439L863.737 386.07L863.781 341.926L863.825 294.756L863.869 244.211L863.913 189.945L863.956 131.517L864.022 68.3914L864.088 0.0315622M1005.76 466.318V496.934M721.586 466.318H768.955M958.41 466.318H1005.78L1065.99 427.439M1005.78 619.403V650.02M768.955 650.02H721.586"
            stroke="#2d2d2d"
            strokeOpacity="0.15"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Top Navigation */}
      <nav className="relative z-30 flex items-center justify-between p-6 lg:px-12">
        {/* Logo */}
        <div className="flex items-center">
          <a href="/">
          <h1 className="text-2xl lg:text-3xl font-mono font-bold" style={{ color: textColor }}>
            {title}
          </h1>
          </a>
        </div>

        {/* Center Toggle */}
        {/* <div className="hidden md:flex">
          <div
            className="inline-flex border-2 rounded-lg overflow-hidden"
            style={{
              borderColor: primaryColor,
              boxShadow: `4px 4px 0px ${primaryColor}`,
            }}
          >
            {navToggleOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleNavToggle(option)}
                className="px-6 py-2 font-mono font-bold transition-all duration-200 border-r-2 last:border-r-0"
                style={{
                  backgroundColor: activeNavOption === option ? primaryColor : secondaryColor,
                  color: activeNavOption === option ? secondaryColor : textColor,
                  borderRightColor: primaryColor,
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div> */}

        {/* Status Button */}
        <button
          onClick={handleStatusClick}
          className="flex items-center gap-2 px-4 py-2 font-mono font-bold rounded-lg border-2 transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: primaryColor,
            color: secondaryColor,
            borderColor: primaryColor,
            boxShadow: `3px 3px 0px ${primaryColor}`,
          }}
        >
          <Clock className="w-4 h-4" />
          <span className="hidden sm:inline">{statusText}</span>
        </button>
      </nav>

      {/* Decorative Elements */}
      {!hasSearched && (
        <div className="absolute inset-0 z-5 pointer-events-auto">
          {/* Speech bubble - Top left */}
          <div className="absolute top-32 left-[5%] hidden xl:block">
            {/* First chat bubble with slide-in animation */}
            {showFirstBubble && (
              <div
                className="relative px-4 py-2 rounded-lg border-2 font-mono text-sm font-bold opacity-0"
                style={{
                  backgroundColor: "#fbbf24",
                  borderColor: primaryColor,
                  boxShadow: `3px 3px 0px ${primaryColor}`,
                  color: primaryColor,
                  ...chatBubbleSlideIn,
                }}
              >
                {speechBubbleText}
                <div
                  className="absolute -bottom-2 left-4 w-4 h-4 rotate-45 border-r-2 border-b-2"
                  style={{
                    backgroundColor: "#fbbf24",
                    borderColor: primaryColor,
                  }}
                ></div>
              </div>
            )}
            {/* Second info bubble with slide-in animation */}
            {showSecondBubble && (
              <div
                className="mt-8 p-4 rounded-lg border-2 font-mono text-sm max-w-xs opacity-0"
                style={{
                  backgroundColor: "#67e8f9",
                  borderColor: primaryColor,
                  boxShadow: `4px 4px 0px ${primaryColor}`,
                  color: primaryColor,
                  ...infoBubbleSlideIn,
                  animationDelay: "0s",
                }}
              >
                {infoBoxText}
              </div>
            )}
          </div>

          {/* Character Illustrations - Top right with floating animation */}
          {showCharacters && (
            <>
              <div className="absolute xl:top-[10%] right-[5%] hidden xl:block z-40">
                <div className="relative inline-block" style={{ ...floatingAnimation1 }}>
                  <img
                    onClick={triggerMascotImageSearch}
                    className="w-60 rounded-lg border-2 flex items-center justify-center cursor-pointer"
                    style={{
                      borderColor: primaryColor,
                      boxShadow: `4px 4px 0px ${primaryColor}`,
                    }}
                    src={character1Src || "/placeholder.svg"}
                    alt="green elephant humanoid"
                  />
                  <button
                    onClick={triggerMascotImageSearch}
                    className="absolute inset-0 w-full h-full z-50"
                    style={{ background: 'transparent', pointerEvents: 'auto' }}
                    aria-label="Trigger mascot image search"
                  />
                </div>
                {/* Audio waveform visualization with floating animation */}
                <div
                  className="mt-4 p-3 rounded-lg border-2 bg-green-400"
                  style={{
                    borderColor: primaryColor,
                    boxShadow: `3px 3px 0px ${primaryColor}`,
                    ...floatingAnimation3,
                  }}
                >
                  <div className="flex items-end gap-1 h-8">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-green-800 rounded-sm"
                        style={{
                          width: "3px",
                          height: `${Math.random() * 100}%`,
                          minHeight: "20%",
                          ...waveAnimation,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* Bottom left character with floating animation */}
              <div className="absolute top-[32%] left-[10%] hidden lg:block z-40">
                <div className="relative inline-block" style={{ ...floatingAnimation2 }}>
                  <img
                    onClick={triggerMascotImageSearch}
                    className="w-60 rounded-lg border-2 flex items-center justify-center cursor-pointer"
                    style={{
                      borderColor: primaryColor,
                      boxShadow: `4px 4px 0px ${primaryColor}`,
                    }}
                    src={character2Image || "/placeholder.svg"}
                    alt="Bottom character illustration"
                  />
                  <button
                    onClick={triggerMascotImageSearch}
                    className="absolute inset-0 w-full h-full z-50"
                    style={{ background: 'transparent', pointerEvents: 'auto' }}
                    aria-label="Trigger mascot image search"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="relative z-20 px-6 lg:px-12 py-12 lg:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Main Headline */}
          {!hasSearched && (
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-mono font-bold leading-tight mb-4">
                <div className="mb-2">{subtitle}</div>
                <div className="relative inline-block">
                  <span
                    className="px-4 py-2 -rotate-[5deg] inline-block hover:-rotate-0 transition-transform duration-300 ease-in-out font-mono font-bold"
                    style={{
                      backgroundColor: primaryColor,
                      color: secondaryColor,
                      boxShadow: `6px 6px 0px ${primaryColor}`,
                    }}
                  >
                    {highlightedWord}
                  </span>
                </div>
                <div className="mt-2">{bottomText}</div>
              </h2>
            </div>
          )}

          {/* Search Section */}
          <div className={`max-w-3xl mx-auto ${hasSearched ? "mb-8" : ""}`}>
            {/* Search Input */}
            <div className="mb-6">
              <div
                className="search-hover-effect flex items-center p-2 md:p-4 lg:p-4 rounded-lg border-2 transition-all duration-200 ease-in-out"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: primaryColor,
                  boxShadow: `6px 6px 0px ${primaryColor}`,
                }}
              >
                <div className="flex items-center w-full">
                  <Search className="w-6 h-6 mr-4" style={{ color: textColor }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="flex-1 bg-transparent outline-none font-mono text-sm md:text-lg"
                    style={{ color: textColor }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="ml-4 p-3 rounded-lg border-2 transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: primaryColor,
                      color: secondaryColor,
                      borderColor: primaryColor,
                    }}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              {searchFilters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className="flex items-center gap-2 px-4 py-2 font-mono font-bold rounded-lg border-2 transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: activeFilter === filter ? primaryColor : "#ffffff",
                    color: activeFilter === filter ? secondaryColor : textColor,
                    borderColor: primaryColor,
                    boxShadow: `3px 3px 0px ${primaryColor}`,
                  }}
                >
                  {filterIcons[filter as keyof typeof filterIcons]}
                  {filter}
                </button>
              ))}
              {/* Hide NSFW toggle */}
              <button
                onClick={() => setHideNsfw(v => !v)}
                className="flex items-center gap-2 px-4 py-2 font-mono font-bold rounded-lg border-2 transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: hideNsfw ? primaryColor : "#ffffff",
                  color: hideNsfw ? secondaryColor : textColor,
                  borderColor: primaryColor,
                  boxShadow: `3px 3px 0px ${primaryColor}`,
                }}
              >
                Hide NSFW
              </button>
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          {/* {!hasSearched && (
            <div className="md:hidden mt-8 flex justify-center">
              <div
                className="inline-flex border-2 rounded-lg overflow-hidden"
                style={{
                  borderColor: primaryColor,
                  boxShadow: `4px 4px 0px ${primaryColor}`,
                }}
              >
                {navToggleOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleNavToggle(option)}
                    className="px-6 py-2 font-mono font-bold transition-all duration-200 border-r-2 last:border-r-0"
                    style={{
                      backgroundColor: activeNavOption === option ? primaryColor : secondaryColor,
                      color: activeNavOption === option ? secondaryColor : textColor,
                      borderRightColor: primaryColor,
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="relative z-20 px-6 lg:px-12 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Results Header */}
            <div className="mb-8">
              <h3 className="text-2xl font-mono font-bold mb-2" style={{ color: textColor }}>
                Search Results for "{searchQuery}"
              </h3>
              <p className="font-mono text-sm opacity-70" style={{ color: textColor }}>
                Found {visibleResults.length} results
              </p>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div
                  className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin"
                  style={{ color: primaryColor }}
                />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {currentResults.map((result, index) => {
                    const key = `${result.txid}-${index}`
                    const title = result.web_loader_title || result.title || "Untitled"
                    const description = result.web_loader_description || result.description || result.chunk
                    const linkUrl = result.url
                    const isNsfw = Boolean(result.is_nsfw)
                    const modality = (result.modality || result.original_modality || "text").toLowerCase()

                    if (modality === "image") {
                      return (
                        <ArImageCard
                          key={key}
                          title={title}
                          description={truncateText(description || "", 120)}
                          imageUrl={result.url}
                          linkUrl={linkUrl}
                          isNsfw={isNsfw}
                          primaryColor={primaryColor}
                          secondaryColor="#ffffff"
                          textColor={textColor}
                          className="h-full"
                        />
                      )
                    }
                    if (modality === "video") {
                      return (
                        <ArResultVideoCard
                          key={key}
                          videoUrl={result.url}
                          posterUrl={undefined}
                          linkUrl={linkUrl}
                          isNsfw={isNsfw}
                          primaryColor={primaryColor}
                          secondaryColor="#ffffff"
                          textColor={textColor}
                          className="h-full"
                        />
                      )
                    }
                    if (modality === "audio") {
                      return (
                        <ArAudioCard
                          key={key}
                          title={title}
                          description={truncateText(description || "", 120)}
                          audioUrl={result.url}
                          linkUrl={linkUrl}
                          isNsfw={isNsfw}
                          primaryColor={primaryColor}
                          secondaryColor="#ffffff"
                          textColor={textColor}
                          className="h-full"
                        />
                      )
                    }

                    // Fallback text card
                    return (
                      <RetroCard
                        key={key}
                        primaryColor={primaryColor}
                        secondaryColor={"#ffffff"}
                        textColor={textColor}
                        className="relative flex flex-col h-64"
                      >
                        <button
                          onClick={() => window.open(result.url, "_blank")}
                          className="absolute top-2 right-2 p-2 rounded-lg border-2 transition-all duration-200 hover:scale-110"
                          style={{ backgroundColor: primaryColor, color: secondaryColor, borderColor: primaryColor }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <div className="flex-1 pr-12 pb-2">
                          <h4 className="font-mono font-bold text-lg mb-2 line-clamp-2" style={{ color: textColor }}>
                            {title}
                          </h4>
                          <p className="font-mono text-sm mb-3 line-clamp-3" style={{ color: textColor, opacity: 0.8 }}>
                            {truncateText(description || "", 120)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleResultClick(result)}
                          className="flex absolute bottom-4 left-4 items-center gap-2 px-3 py-2 font-mono font-bold rounded-lg border-2 transition-all duration-200 hover:scale-105 mt-auto"
                          style={{ backgroundColor: secondaryColor, color: textColor, borderColor: primaryColor, boxShadow: `2px 2px 0px ${primaryColor}` }}
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </button>
                      </RetroCard>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 font-mono font-bold rounded-lg border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: "#ffffff",
                        color: textColor,
                        borderColor: primaryColor,
                        boxShadow: `3px 3px 0px ${primaryColor}`,
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className="px-3 py-2 font-mono font-bold rounded-lg border-2 transition-all duration-200 hover:scale-105"
                            style={{
                              backgroundColor: currentPage === pageNum ? primaryColor : "#ffffff",
                              color: currentPage === pageNum ? secondaryColor : textColor,
                              borderColor: primaryColor,
                              boxShadow: `2px 2px 0px ${primaryColor}`,
                            }}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 font-mono font-bold rounded-lg border-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: "#ffffff",
                        color: textColor,
                        borderColor: primaryColor,
                        boxShadow: `3px 3px 0px ${primaryColor}`,
                      }}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom Preview Section with slide-up animation */}
      {!hasSearched && (
        <div className="relative z-20 mt-12 lg:mt-0" style={videoSlideUp}>
          <div className="mx-6 lg:mx-12 xl:mx-28 p-6 rounded-t-lg">
            <div className="flex items-center justify-center gap-4">
              <div className="w-full">
                <ArHomeVideoCard title="GLIMPSE Demo" controls={true} autoPlay={false} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="relative z-10 text-center pb-6">
        <p className="font-mono text-sm opacity-60">@Glimpse all rights reserved</p>
      </div>

      {/* Status Popup */}
      <RetroPopup
        isOpen={isStatusPopupOpen}
        onClose={() => setIsStatusPopupOpen(false)}
        title="System Status"
        size="md"
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        textColor={textColor}
      >
        {isStatusLoading ? (
          <div className="flex justify-center items-center py-8">
            <div
              className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"
              style={{ color: primaryColor }}
            />
          </div>
        ) : statusData ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div
                className="text-center p-4 rounded-lg border-2"
                style={{ borderColor: primaryColor, backgroundColor: "#ffffff" }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: textColor }}>
                  {statusData.web.toLocaleString()}
                </div>
                <div className="text-sm opacity-70" style={{ color: textColor }}>
                  Web Pages
                </div>
              </div>

              <div
                className="text-center p-4 rounded-lg border-2"
                style={{ borderColor: primaryColor, backgroundColor: "#ffffff" }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: textColor }}>
                  {statusData.image.toLocaleString()}
                </div>
                <div className="text-sm opacity-70" style={{ color: textColor }}>
                  Images
                </div>
              </div>

              <div
                className="text-center p-4 rounded-lg border-2"
                style={{ borderColor: primaryColor, backgroundColor: "#ffffff" }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: textColor }}>
                  {statusData.audio.toLocaleString()}
                </div>
                <div className="text-sm opacity-70" style={{ color: textColor }}>
                  Audio Files
                </div>
              </div>

              <div
                className="text-center p-4 rounded-lg border-2"
                style={{ borderColor: primaryColor, backgroundColor: "#ffffff" }}
              >
                <div className="text-2xl font-bold mb-1" style={{ color: textColor }}>
                  {statusData.video.toLocaleString()}
                </div>
                <div className="text-sm opacity-70" style={{ color: textColor }}>
                  Video Files
                </div>
              </div>
            </div>

            <div
              className="text-center p-4 rounded-lg border-2"
              style={{ borderColor: primaryColor, backgroundColor: "#f0f9ff" }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: textColor }}>
                {statusData.all.toLocaleString()}
              </div>
              <div className="text-sm opacity-70" style={{ color: textColor }}>
                Total Indexed Items
              </div>
            </div>

            
          </div>
        ) : (
          <div className="text-center py-8">
            <p style={{ color: textColor }}>Failed to load status data</p>
          </div>
        )}
      </RetroPopup>

      {/* Detail Popup */}
      <RetroPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title="Search Result Details"
        size="lg"
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        textColor={textColor}
      >
        {selectedResult && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-2" style={{ color: textColor }}>
                {selectedResult.web_loader_title || selectedResult.title || "Untitled"}
              </h3>
              <a
                href={selectedResult.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {selectedResult.url}
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {/* Commented out score */}
              {/* <div>
                <strong>Score:</strong> {selectedResult.score.toFixed(4)}
              </div> */}
              {/* Commented out content type */}
              {/* <div>
                <strong>Content Type:</strong> {selectedResult.content_type}
              </div> */}
              {/* Commented out word count */}
              {/* <div>
                <strong>Word Count:</strong> {selectedResult.word_count}
              </div> */}
              {/* Commented out section */}
              {/* <div>
                <strong>Section:</strong> {selectedResult.section}
              </div> */}
              <div>
                <strong>ARNS Status:</strong> {selectedResult.arns_status}
              </div>
              <div>
                <strong>Modality:</strong> {selectedResult.modality}
              </div>
            </div>

            {selectedResult.web_loader_description && (
              <div>
                <strong>Description:</strong>
                <p className="mt-1 text-sm opacity-80">{selectedResult.web_loader_description}</p>
              </div>
            )}

            {/* Commented out content preview */}
            {/* {selectedResult.chunk && (
              <div>
                <strong>Content Preview:</strong>
                <p className="mt-1 text-sm opacity-80 max-h-32 overflow-y-auto">{selectedResult.chunk}</p>
              </div>
            )} */}

            {selectedResult.keywords && (
              <div>
                <strong>Keywords:</strong>
                <p className="mt-1 text-sm opacity-80">{selectedResult.keywords}</p>
              </div>
            )}

            <div className="pt-4 border-t" style={{ borderTopColor: primaryColor }}>
              <button
                onClick={() => window.open(selectedResult.url, "_blank")}
                className="flex items-center gap-2 px-4 py-2 font-mono font-bold rounded-lg border-2 transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: primaryColor,
                  color: secondaryColor,
                  borderColor: primaryColor,
                  boxShadow: `3px 3px 0px ${primaryColor}`,
                }}
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </button>
            </div>
          </div>
        )}
      </RetroPopup>
    </div>
  )
}
