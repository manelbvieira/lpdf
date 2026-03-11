"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { FurnitureItem } from "@/lib/furniture-data"

interface HotspotProps {
  item: FurnitureItem
  onHotspotClick: (item: FurnitureItem) => void
}

export function Hotspot({ item, onHotspotClick }: HotspotProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const hotspotRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hotspotRef.current || !tooltipRef.current || !isHovered) return

    const hotspot = hotspotRef.current
    const tooltip = tooltipRef.current
    const imageContainer = hotspot.closest(".relative")
    if (!imageContainer) return

    const containerRect = imageContainer.getBoundingClientRect()
    const hotspotRect = hotspot.getBoundingClientRect()
    const tooltipRect = tooltip.getBoundingClientRect()

    const spaceTop = hotspotRect.top - containerRect.top
    const spaceBottom = containerRect.bottom - hotspotRect.bottom
    const spaceLeft = hotspotRect.left - containerRect.left
    const spaceRight = containerRect.right - hotspotRect.right

    const tooltipWidth = tooltipRect.width
    const tooltipHeight = tooltipRect.height
    const margin = 8 // Safety margin from edges

    const newStyle: React.CSSProperties = {}

    // Determine best vertical position (top or bottom)
    const preferBottom = spaceBottom >= tooltipHeight + margin
    const preferTop = spaceTop >= tooltipHeight + margin

    if (preferBottom) {
      newStyle.top = "100%"
      newStyle.marginTop = `${margin}px`
    } else if (preferTop) {
      newStyle.bottom = "100%"
      newStyle.marginBottom = `${margin}px`
    } else {
      // Not enough space vertically, default to bottom
      newStyle.top = "100%"
      newStyle.marginTop = `${margin}px`
    }

    // Determine best horizontal position
    const centerOffset = tooltipWidth / 2

    // Check if centered tooltip would overflow left or right
    const wouldOverflowLeft = spaceLeft < centerOffset
    const wouldOverflowRight = spaceRight < centerOffset

    if (wouldOverflowLeft) {
      // Align to left edge of hotspot
      newStyle.left = "0"
      newStyle.transform = "none"
    } else if (wouldOverflowRight) {
      // Align to right edge of hotspot
      newStyle.right = "0"
      newStyle.transform = "none"
    } else {
      // Center the tooltip
      newStyle.left = "50%"
      newStyle.transform = "translateX(-50%)"
    }

    setTooltipStyle(newStyle)
  }, [isHovered])

  return (
    <button
      ref={hotspotRef}
      className="hotspot-ring"
      style={{
        left: `${item.posicao.x}%`,
        top: `${item.posicao.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onHotspotClick(item)}
      aria-label={`Ver detalhes de ${item.nome}`}
    >
      <div className="ring-inner" />
      
      {isHovered && (
        <div
          ref={tooltipRef}
          className="contextual-card"
          style={tooltipStyle}
        >
          <h4 className="font-medium text-sm text-foreground mb-1 line-clamp-2">
            {item.nome}
          </h4>
          <p className="text-xs text-muted-foreground mb-2">
            {item.categoria}
          </p>
          <p className="text-sm font-semibold text-[#0099CC]">
            {item.preco.toFixed(2)}€
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Clica para ver detalhes
          </p>
        </div>
      )}
    </button>
  )
}
