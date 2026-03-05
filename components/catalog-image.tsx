"use client"

import Image from "next/image"
import { Hotspot } from "./hotspot"
import type { FurnitureItem, Room } from "@/lib/furniture-data"

interface CatalogImageProps {
  room: Room
  onHotspotClick: (item: FurnitureItem) => void
}

export function CatalogImage({ room, onHotspotClick }: CatalogImageProps) {
  return (
    <div className="room-container w-full">
      <div className="relative">
        <Image
          src={room.imagem || "/placeholder.svg"}
          alt={`${room.nome} com moveis`}
          width={1200}
          height={800}
          className="w-full h-auto object-cover"
          priority
        />
        <div className="absolute inset-0">
          {room.moveis.map((item) => (
            <Hotspot key={item.id} item={item} onHotspotClick={onHotspotClick} />
          ))}
        </div>
      </div>
    </div>
  )
}
